// ARAJ Sovereign Customer Database Client Service
// Replaces Firebase Firestore completely for storing customer details, orders, and inquiries.

import { UserProfile, Order, DistributorInquiry } from '../types';

export interface CustomerDbStatus {
  engine: string;
  version: string;
  storageFile: string;
  totalCustomers: number;
  totalOrders: number;
  totalInquiries: number;
  lastPersisted: string;
}

const LOCAL_STORAGE_KEY = 'araj_sovereign_customer';

/**
 * Get locally cached customer profile
 */
export function getLocalCustomer(): UserProfile | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Save locally cached customer profile
 */
export function saveLocalCustomer(profile: UserProfile | null): void {
  try {
    if (profile) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  } catch (e) {
    console.warn('Could not save customer locally:', e);
  }
}

/**
 * Sync customer details to the ARAJ Server Customer Database
 * Replaces Firestore `syncUserProfile`
 */
export async function syncCustomerToDatabase(data: {
  id?: string;
  email: string;
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  avatar?: string;
  provider?: 'local' | 'google' | 'guest';
}): Promise<UserProfile | null> {
  try {
    const res = await fetch('/api/customer/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.customer) {
        const profile: UserProfile = {
          uid: json.customer.id,
          email: json.customer.email,
          displayName: json.customer.name,
          photoURL: json.customer.avatar || null,
          providerId: json.customer.provider || 'araj-database',
          phone: json.customer.phone || '',
          address: json.customer.address || '',
          city: json.customer.city || '',
          pincode: json.customer.pincode || '',
          createdAt: json.customer.createdAt,
          lastLoginAt: json.customer.lastLoginAt,
        };
        saveLocalCustomer(profile);
        return profile;
      }
    }
  } catch (err) {
    console.warn('Server customer sync fallback to local cache:', err);
  }

  // Fallback to local profile if offline
  const existing = getLocalCustomer();
  const fallbackProfile: UserProfile = {
    uid: data.id || existing?.uid || `CUST-${Date.now().toString().slice(-6)}`,
    email: data.email,
    displayName: data.name || existing?.displayName || data.email.split('@')[0],
    photoURL: data.avatar || existing?.photoURL || null,
    providerId: data.provider || 'local',
    phone: data.phone || existing?.phone || '',
    address: data.address || existing?.address || '',
    city: data.city || existing?.city || '',
    pincode: data.pincode || existing?.pincode || '',
    createdAt: existing?.createdAt || new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };
  saveLocalCustomer(fallbackProfile);
  return fallbackProfile;
}

/**
 * Fetch Customer Details from Server Database by email or id
 */
export async function fetchCustomerFromDatabase(identifier: string): Promise<UserProfile | null> {
  try {
    const res = await fetch(`/api/customer/${encodeURIComponent(identifier)}`);
    if (res.ok) {
      const json = await res.json();
      if (json.customer) {
        const profile: UserProfile = {
          uid: json.customer.id,
          email: json.customer.email,
          displayName: json.customer.name,
          photoURL: json.customer.avatar || null,
          providerId: json.customer.provider || 'araj-database',
          phone: json.customer.phone || '',
          address: json.customer.address || '',
          city: json.customer.city || '',
          pincode: json.customer.pincode || '',
          createdAt: json.customer.createdAt,
          lastLoginAt: json.customer.lastLoginAt,
        };
        saveLocalCustomer(profile);
        return profile;
      }
    }
  } catch (err) {
    console.warn('Fetch customer from database failed, checking local cache:', err);
  }

  return getLocalCustomer();
}

/**
 * Update Customer Profile in Database
 */
export async function updateCustomerInDatabase(data: {
  identifier: string;
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  notes?: string;
}): Promise<UserProfile | null> {
  try {
    const res = await fetch('/api/customer/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.customer) {
        const profile: UserProfile = {
          uid: json.customer.id,
          email: json.customer.email,
          displayName: json.customer.name,
          photoURL: json.customer.avatar || null,
          providerId: json.customer.provider || 'araj-database',
          phone: json.customer.phone || '',
          address: json.customer.address || '',
          city: json.customer.city || '',
          pincode: json.customer.pincode || '',
          createdAt: json.customer.createdAt,
          lastLoginAt: json.customer.lastLoginAt,
        };
        saveLocalCustomer(profile);
        return profile;
      }
    }
  } catch (err) {
    console.error('Update customer profile error:', err);
  }

  // Update local cache as fallback
  const existing = getLocalCustomer();
  if (existing) {
    const updated: UserProfile = {
      ...existing,
      displayName: data.name ?? existing.displayName,
      phone: data.phone ?? existing.phone,
      address: data.address ?? existing.address,
      city: data.city ?? existing.city,
      pincode: data.pincode ?? existing.pincode,
    };
    saveLocalCustomer(updated);
    return updated;
  }
  return null;
}

/**
 * Register Customer Directly into ARAJ Database (No Firebase dependency)
 */
export async function registerCustomerDirect(data: {
  email: string;
  password: string;
  name: string;
  phone?: string;
  address?: string;
}): Promise<{ success: boolean; customer?: UserProfile; error?: string }> {
  try {
    const res = await fetch('/api/customer/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      return { success: false, error: json.error || 'Registration failed' };
    }

    const profile: UserProfile = {
      uid: json.customer.id,
      email: json.customer.email,
      displayName: json.customer.name,
      photoURL: null,
      providerId: 'local',
      phone: json.customer.phone || '',
      address: json.customer.address || '',
      city: json.customer.city || '',
      pincode: json.customer.pincode || '',
      createdAt: json.customer.createdAt,
      lastLoginAt: json.customer.lastLoginAt,
    };

    saveLocalCustomer(profile);
    return { success: true, customer: profile };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Server connection error during registration' };
  }
}

/**
 * Login Customer Directly against ARAJ Database (No Firebase dependency)
 */
export async function loginCustomerDirect(
  email: string,
  pass: string
): Promise<{ success: boolean; customer?: UserProfile; error?: string }> {
  try {
    const res = await fetch('/api/customer/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass }),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      return { success: false, error: json.error || 'Invalid email or password' };
    }

    const profile: UserProfile = {
      uid: json.customer.id,
      email: json.customer.email,
      displayName: json.customer.name,
      photoURL: null,
      providerId: 'local',
      phone: json.customer.phone || '',
      address: json.customer.address || '',
      city: json.customer.city || '',
      pincode: json.customer.pincode || '',
      createdAt: json.customer.createdAt,
      lastLoginAt: json.customer.lastLoginAt,
    };

    saveLocalCustomer(profile);
    return { success: true, customer: profile };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Server connection error during login' };
  }
}

/**
 * Record Customer Order in Server Database
 */
export async function saveOrderToDatabase(order: Order): Promise<boolean> {
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    return res.ok;
  } catch (err) {
    console.warn('Order could not be pushed to server database immediately:', err);
    return false;
  }
}

/**
 * Fetch Customer Orders from Server Database
 */
export async function fetchCustomerOrdersFromDatabase(emailOrId: string): Promise<Order[]> {
  try {
    const res = await fetch(`/api/customer/orders/${encodeURIComponent(emailOrId)}`);
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.orders)) {
        return json.orders.map((o: any) => ({
          id: o.id,
          items: o.items.map((i: any) => ({
            product: {
              id: i.id,
              name: i.name,
              price: i.price,
              originalPrice: i.price,
              category: 'dry fruits' as const,
              tags: ['ALL'],
              image: '',
              description: '',
              weight: i.weight || 'Standard',
              inStock: true,
              featured: false,
              rating: 5,
              reviews: 1,
            },
            quantity: i.quantity,
          })),
          subtotal: o.subtotal,
          discount: o.discount,
          shipping: o.shipping,
          total: o.total,
          customer: {
            name: o.customerName,
            email: o.customerEmail,
            phone: o.customerPhone,
            address: o.shippingAddress,
            city: o.city,
            state: o.state,
            pincode: o.pincode,
            paymentMethod: o.paymentMethod || 'cod',
          },
          createdAt: o.createdAt,
          status: o.status,
        }));
      }
    }
  } catch (err) {
    console.warn('Could not fetch server orders:', err);
  }
  return [];
}

/**
 * Submit Distributor Inquiry to Database
 */
export async function saveDistributorInquiryToDatabase(inquiry: Omit<DistributorInquiry, 'id' | 'createdAt'>): Promise<boolean> {
  try {
    const res = await fetch('/api/distributor-inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiry),
    });
    return res.ok;
  } catch (err) {
    console.warn('Could not push inquiry to server database:', err);
    return false;
  }
}

/**
 * Check Customer Database Engine Status
 */
export async function getCustomerDatabaseStatus(): Promise<CustomerDbStatus | null> {
  try {
    const res = await fetch('/api/customer/database-status');
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Ignore error
  }
  return null;
}
