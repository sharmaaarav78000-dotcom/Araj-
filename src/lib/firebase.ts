import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as fbSignOut, 
  updateProfile, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  collection,
  onSnapshot,
  getDocFromServer,
  updateDoc
} from 'firebase/firestore';
import firebaseConfigData from '../../firebase-applet-config.json';
import { 
  syncCustomerToDatabase, 
  fetchCustomerFromDatabase 
} from '../services/customerDb';
import { Order, OrderStatus, OrderStatusEvent } from '../types';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  providerId?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  lastLoginAt: string;
}

const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId,
};

// Initialize Firebase App instance safely
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firestore with configured databaseId
export const db = firebaseConfigData.firestoreDatabaseId
  ? getFirestore(app, firebaseConfigData.firestoreDatabaseId)
  : getFirestore(app);

// Test Firestore connection as required by Firebase skill
async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline status check:', error.message);
    }
  }
}
testFirestoreConnection();

// Initialize Google Auth Provider for optional Gmail Login
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

/**
 * Generate a standard 5-step delivery timeline based on the current order status
 */
export function buildDefaultStatusTimeline(
  status: OrderStatus = 'Confirmed',
  createdAt: string = new Date().toLocaleDateString('en-IN')
): OrderStatusEvent[] {
  const steps: { status: OrderStatus; title: string; description: string; location: string }[] = [
    {
      status: 'Confirmed',
      title: 'Order Placed & Verified',
      description: 'Order confirmed and registered at Agra Heritage Mills dispatch desk.',
      location: 'Agra Dispatch Facility, U.P.',
    },
    {
      status: 'Processing',
      title: 'Stone-Ground Milling & Packaging',
      description: 'Fresh batch pulverized under 32°C and packed with multi-barrier nitrogen seal.',
      location: 'Araj Artisanal Mill, Naraich, Agra',
    },
    {
      status: 'Dispatched',
      title: 'Handed to Express Logistics',
      description: 'Shipment handed over to Blue Dart / Delhivery express transit hub.',
      location: 'Agra Express Hub (AWB generated)',
    },
    {
      status: 'Out for Delivery',
      title: 'Out for Doorstep Delivery',
      description: 'Courier partner is out for final delivery to your destination address.',
      location: 'Destination Local Delivery Hub',
    },
    {
      status: 'Delivered',
      title: 'Delivered to Patron',
      description: 'Parcel safely delivered. Enjoy fresh Agra spices & royal dry fruits!',
      location: 'Patron Doorstep',
    },
  ];

  const statusOrder: OrderStatus[] = ['Confirmed', 'Processing', 'Dispatched', 'Out for Delivery', 'Delivered'];
  const currentIndex = statusOrder.indexOf(status);

  return steps.map((s, idx) => ({
    status: s.status,
    title: s.title,
    description: s.description,
    location: s.location,
    timestamp: idx === 0 ? createdAt : idx <= currentIndex ? 'Updated recently' : 'Pending',
    completed: idx <= currentIndex,
  }));
}

/**
 * Save customer order into Firestore for real-time tracking
 */
export async function saveOrderToFirestore(order: Order, userId?: string): Promise<boolean> {
  try {
    const timeline = order.statusTimeline && order.statusTimeline.length > 0
      ? order.statusTimeline
      : buildDefaultStatusTimeline(order.status, order.createdAt);

    const trackingNum = order.trackingNumber || `AGR-BLU-${order.id.replace(/[^0-9]/g, '') || Math.floor(100000 + Math.random() * 900000)}`;
    const carrierName = order.carrier || 'Blue Dart Express';
    const estDelivery = order.estimatedDelivery || '3-4 Business Days (Express Pan-India)';

    const orderPayload: any = {
      id: order.id,
      items: order.items.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        weight: item.product.weight,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image || '',
        category: item.product.category,
      })),
      subtotal: order.subtotal,
      discount: order.discount,
      shipping: order.shipping,
      total: order.total,
      customer: {
        name: order.customer.name,
        email: order.customer.email,
        phone: order.customer.phone,
        address: order.customer.address,
        city: order.customer.city,
        state: order.customer.state,
        pincode: order.customer.pincode,
        paymentMethod: order.customer.paymentMethod,
        notes: order.customer.notes || '',
      },
      createdAt: order.createdAt,
      updatedAt: new Date().toISOString(),
      status: order.status,
      carrier: carrierName,
      trackingNumber: trackingNum,
      estimatedDelivery: estDelivery,
      statusTimeline: timeline,
      userId: userId || order.userId || '',
    };

    // 1. Save to global orders collection /orders/{orderId}
    const orderDocRef = doc(db, 'orders', order.id);
    await setDoc(orderDocRef, orderPayload, { merge: true });

    // 2. If user is authenticated, also save to /users/{userId}/orders/{orderId}
    if (userId) {
      const userOrderRef = doc(db, 'users', userId, 'orders', order.id);
      await setDoc(userOrderRef, orderPayload, { merge: true });
    }

    return true;
  } catch (err) {
    console.warn('Firestore order save error (handled gracefully):', err);
    return false;
  }
}

/**
 * Fetch a single order by ID from Firestore
 */
export async function fetchOrderFromFirestore(orderId: string): Promise<Order | null> {
  try {
    const orderDocRef = doc(db, 'orders', orderId);
    const snap = await getDoc(orderDocRef);
    if (snap.exists()) {
      return snap.data() as Order;
    }
  } catch (err) {
    console.warn('Fetch order from Firestore failed:', err);
  }
  return null;
}

/**
 * Subscribe to real-time status updates for a single order by Order ID
 */
export function subscribeToOrderById(
  orderId: string, 
  callback: (order: Order | null) => void
): () => void {
  try {
    const orderDocRef = doc(db, 'orders', orderId);
    const unsubscribe = onSnapshot(
      orderDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          callback(data as Order);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.warn('Real-time order subscription error:', error);
        callback(null);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Failed to attach real-time order listener:', err);
    return () => {};
  }
}

/**
 * Subscribe to real-time updates for all orders of a customer
 */
export function subscribeToUserOrders(
  userId: string,
  callback: (orders: Order[]) => void
): () => void {
  if (!userId) return () => {};

  try {
    const userOrdersCollRef = collection(db, 'users', userId, 'orders');
    const unsubscribe = onSnapshot(
      userOrdersCollRef,
      (snapshot) => {
        const orderList: Order[] = [];
        snapshot.forEach((docSnap) => {
          orderList.push(docSnap.data() as Order);
        });
        // Sort newest first
        orderList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        callback(orderList);
      },
      (error) => {
        console.warn('Real-time customer orders subscription notice:', error);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Failed to listen to user orders collection:', err);
    return () => {};
  }
}

/**
 * Update delivery status in Firestore for real-time tracking demonstrations or live admin sync
 */
export async function updateOrderStatusInFirestore(
  orderId: string,
  newStatus: OrderStatus,
  locationOrNote?: string,
  userId?: string
): Promise<boolean> {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const snap = await getDoc(orderRef);
    if (!snap.exists()) return false;

    const data = snap.data() as Order;
    const timeline = buildDefaultStatusTimeline(newStatus, data.createdAt);

    if (locationOrNote) {
      const activeStep = timeline.find(t => t.status === newStatus);
      if (activeStep) {
        activeStep.description = locationOrNote;
        activeStep.timestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      }
    }

    const updates = {
      status: newStatus,
      statusTimeline: timeline,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(orderRef, updates);

    // If userId provided or in data, sync user subcollection too
    const targetUserId = userId || data.userId;
    if (targetUserId) {
      try {
        const userOrderRef = doc(db, 'users', targetUserId, 'orders', orderId);
        await updateDoc(userOrderRef, updates);
      } catch (e) {
        console.warn('User subcollection status sync note:', e);
      }
    }

    return true;
  } catch (err) {
    console.error('Failed to update order status in Firestore:', err);
    return false;
  }
}

/**
 * Sync user profile to Firestore and the ARAJ Customer Database
 */
export async function syncUserProfile(user: User, extraData?: { phone?: string; address?: string }) {
  const profilePayload = {
    id: user.uid,
    email: user.email || '',
    name: user.displayName || user.email?.split('@')[0] || 'Royal Patron',
    phone: extraData?.phone || user.phoneNumber || '',
    address: extraData?.address || '',
    avatar: user.photoURL || undefined,
    provider: (user.providerData?.[0]?.providerId === 'google.com' ? 'google' : 'local') as 'google' | 'local',
  };

  // Sync to Firestore /users/{userId}
  try {
    if (user?.uid) {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || user.email?.split('@')[0] || 'Royal Patron',
        photoURL: user.photoURL || null,
        providerId: user.providerData?.[0]?.providerId || 'password',
        phone: extraData?.phone || user.phoneNumber || '',
        address: extraData?.address || '',
        lastLoginAt: new Date().toISOString(),
      }, { merge: true });
    }
  } catch (firestoreErr) {
    console.warn('Firestore user profile sync warning (falling back gracefully):', firestoreErr);
  }

  // Also sync to customer database
  return syncCustomerToDatabase(profilePayload);
}

/**
 * Fetch customer details from Firestore with fallback to ARAJ Customer Database
 */
export async function fetchUserProfile(identifier: string): Promise<UserProfile | null> {
  try {
    if (identifier && !identifier.includes('@')) {
      const userRef = doc(db, 'users', identifier);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const d = snap.data();
        return {
          uid: d.uid || identifier,
          email: d.email || null,
          displayName: d.displayName || null,
          photoURL: d.photoURL || null,
          providerId: d.providerId || 'firebase',
          phone: d.phone || '',
          address: d.address || '',
          createdAt: d.createdAt || new Date().toISOString(),
          lastLoginAt: d.lastLoginAt || new Date().toISOString(),
        };
      }
    }
  } catch (err) {
    console.warn('Firestore fetch warning, checking customer database:', err);
  }

  return fetchCustomerFromDatabase(identifier);
}

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  fbSignOut,
  updateProfile,
  onAuthStateChanged,
};
