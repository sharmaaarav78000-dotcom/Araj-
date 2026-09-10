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
  getDoc, 
  setDoc, 
  getDocFromServer 
} from 'firebase/firestore';
import firebaseConfigData from '../../firebase-applet-config.json';

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

// Initialize Google Auth Provider for Gmail Login / Register
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Initialize Firestore with configured databaseId
export const db = firebaseConfigData.firestoreDatabaseId && firebaseConfigData.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfigData.firestoreDatabaseId)
  : getFirestore(app);

// Validate Firestore connection on boot as mandated by Firebase Skill
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore offline notice. Verify network or Firebase configuration.');
    }
  }
}
testFirestoreConnection();

/**
 * Sync user profile to Firestore `users/{uid}` document
 */
export async function syncUserProfile(user: User, extraData?: { phone?: string; address?: string }) {
  try {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    const now = new Date().toISOString();

    if (!snap.exists()) {
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email?.split('@')[0] || 'Royal Patron',
        photoURL: user.photoURL,
        providerId: user.providerData?.[0]?.providerId || 'google.com',
        phone: extraData?.phone || user.phoneNumber || '',
        address: extraData?.address || '',
        createdAt: now,
        lastLoginAt: now,
      };
      await setDoc(userRef, newProfile);
      return newProfile;
    } else {
      const existing = snap.data() as UserProfile;
      const updatedProfile: UserProfile = {
        ...existing,
        displayName: user.displayName || existing.displayName,
        photoURL: user.photoURL || existing.photoURL,
        lastLoginAt: now,
        ...(extraData?.phone ? { phone: extraData.phone } : {}),
        ...(extraData?.address ? { address: extraData.address } : {}),
      };
      await setDoc(userRef, updatedProfile, { merge: true });
      return updatedProfile;
    }
  } catch (err) {
    console.error('Error syncing user profile:', err);
    return null;
  }
}

/**
 * Fetch user profile from Firestore
 */
export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (err) {
    console.error('Error fetching user profile:', err);
    return null;
  }
}

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  fbSignOut,
  updateProfile,
  onAuthStateChanged,
};
