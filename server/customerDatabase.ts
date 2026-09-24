import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface StoredCustomer {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  passwordHash?: string;
  avatar?: string;
  provider: 'local' | 'google' | 'guest';
  tier: 'Imperial Patron' | 'Royal Gold' | 'Silver Connoisseur';
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
  notes?: string;
}

export interface StoredOrder {
  id: string;
  customerId?: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    weight?: string;
  }>;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: 'Confirmed' | 'Dispatched' | 'Delivered';
  createdAt: string;
}

export interface StoredInquiry {
  id: string;
  fullName: string;
  businessName: string;
  phone: string;
  email?: string;
  city: string;
  state: string;
  businessType: string;
  expectedVolume: string;
  message?: string;
  createdAt: string;
}

interface DatabaseSchema {
  customers: StoredCustomer[];
  orders: StoredOrder[];
  distributorInquiries: StoredInquiry[];
  meta: {
    engine: string;
    version: string;
    lastPersisted: string;
    totalCustomers: number;
    totalOrders: number;
  };
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'customer_database.json');

// In-memory state with fast indexing
let memoryDb: DatabaseSchema = {
  customers: [],
  orders: [],
  distributorInquiries: [],
  meta: {
    engine: 'ARAJ Sovereign Customer Base (File-Backed JSON Database Engine)',
    version: '2.0.0',
    lastPersisted: new Date().toISOString(),
    totalCustomers: 0,
    totalOrders: 0,
  },
};

// Simple password hasher using crypto HMAC
function hashPassword(password: string): string {
  const salt = 'araj_dryfruits_secret_salt_1985';
  return crypto.createHmac('sha256', salt).update(password).digest('hex');
}

// Atomic disk persistence queue
let isPersisting = false;
let pendingPersist = false;

async function persistToDisk(): Promise<void> {
  if (isPersisting) {
    pendingPersist = true;
    return;
  }
  isPersisting = true;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    memoryDb.meta.lastPersisted = new Date().toISOString();
    memoryDb.meta.totalCustomers = memoryDb.customers.length;
    memoryDb.meta.totalOrders = memoryDb.orders.length;

    const payload = JSON.stringify(memoryDb, null, 2);
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;

    // Write to temp file first, then atomically rename to prevent corruption
    await fs.promises.writeFile(tempFile, payload, 'utf-8');
    await fs.promises.rename(tempFile, DB_FILE);
  } catch (err) {
    console.error('[CustomerDatabase] Disk write error:', err);
  } finally {
    isPersisting = false;
    if (pendingPersist) {
      pendingPersist = false;
      persistToDisk();
    }
  }
}

// Initialize database from disk on server startup
export function initCustomerDatabase(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.customers)) {
        memoryDb = {
          customers: parsed.customers || [],
          orders: parsed.orders || [],
          distributorInquiries: parsed.distributorInquiries || [],
          meta: {
            ...memoryDb.meta,
            ...(parsed.meta || {}),
            engine: 'ARAJ Sovereign Customer Base (File-Backed JSON Database Engine)',
          },
        };
        console.log(`[CustomerDatabase] Loaded ${memoryDb.customers.length} customer records and ${memoryDb.orders.length} orders from persistent storage.`);
        return;
      }
    }

    // Seed with sample royal customer for demonstration if fresh
    const now = new Date().toISOString();
    memoryDb.customers = [
      {
        id: 'CUST-198501',
        email: 'concierge@arajpure.com',
        name: 'Royal Heritage Concierge',
        phone: '+91 99171 04448',
        address: '11/48-E, Near Apsara Talkies, Hathras Road, Naraich',
        city: 'Agra',
        state: 'Uttar Pradesh',
        pincode: '282006',
        provider: 'local',
        tier: 'Imperial Patron',
        totalOrders: 12,
        totalSpent: 18450,
        createdAt: now,
        updatedAt: now,
        lastLoginAt: now,
        notes: 'VIP Agra Heritage Member',
      },
    ];
    persistToDisk();
    console.log('[CustomerDatabase] Initialized new persistent customer database storage.');
  } catch (err) {
    console.error('[CustomerDatabase] Boot initialization error:', err);
  }
}

// 1. Sync or Upsert Customer Profile (e.g., from Google auth, Checkout, or profile update)
export function upsertCustomer(data: {
  id?: string;
  email: string;
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  provider?: 'local' | 'google' | 'guest';
  avatar?: string;
}): StoredCustomer {
  const emailKey = data.email.trim().toLowerCase();
  const existingIdx = memoryDb.customers.findIndex(
    (c) => c.email.toLowerCase() === emailKey || (data.id && c.id === data.id)
  );

  const now = new Date().toISOString();

  if (existingIdx >= 0) {
    const existing = memoryDb.customers[existingIdx];
    const updated: StoredCustomer = {
      ...existing,
      name: data.name?.trim() || existing.name,
      phone: data.phone?.trim() || existing.phone,
      address: data.address?.trim() || existing.address,
      city: data.city?.trim() || existing.city,
      state: data.state?.trim() || existing.state,
      pincode: data.pincode?.trim() || existing.pincode,
      avatar: data.avatar || existing.avatar,
      updatedAt: now,
      lastLoginAt: now,
    };
    memoryDb.customers[existingIdx] = updated;
    persistToDisk();
    return updated;
  } else {
    const newCustomer: StoredCustomer = {
      id: data.id || `CUST-${Date.now().toString().slice(-6)}`,
      email: emailKey,
      name: data.name?.trim() || emailKey.split('@')[0] || 'Royal Patron',
      phone: data.phone?.trim() || '',
      address: data.address?.trim() || '',
      city: data.city?.trim() || 'Agra',
      state: data.state?.trim() || 'Uttar Pradesh',
      pincode: data.pincode?.trim() || '282006',
      provider: data.provider || 'local',
      tier: 'Royal Gold',
      totalOrders: 0,
      totalSpent: 0,
      avatar: data.avatar || '',
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now,
    };
    memoryDb.customers.push(newCustomer);
    persistToDisk();
    return newCustomer;
  }
}

// 2. Direct Customer Registration (Independent of Firebase)
export function registerCustomerDirect(
  email: string,
  pass: string,
  name: string,
  phone?: string,
  address?: string
): { success: boolean; customer?: StoredCustomer; error?: string } {
  const emailKey = email.trim().toLowerCase();
  if (memoryDb.customers.some((c) => c.email.toLowerCase() === emailKey)) {
    return { success: false, error: 'A customer account with this email already exists in the database.' };
  }

  const now = new Date().toISOString();
  const customer: StoredCustomer = {
    id: `CUST-${Date.now().toString().slice(-6)}`,
    email: emailKey,
    name: name.trim() || emailKey.split('@')[0],
    phone: phone?.trim() || '',
    address: address?.trim() || '',
    city: 'Agra',
    state: 'Uttar Pradesh',
    pincode: '282006',
    passwordHash: hashPassword(pass),
    provider: 'local',
    tier: 'Royal Gold',
    totalOrders: 0,
    totalSpent: 0,
    createdAt: now,
    updatedAt: now,
    lastLoginAt: now,
  };

  memoryDb.customers.push(customer);
  persistToDisk();

  // Return clean customer object without passwordHash
  const { passwordHash, ...cleanCustomer } = customer;
  return { success: true, customer: cleanCustomer as StoredCustomer };
}

// 3. Direct Customer Login (Independent of Firebase)
export function authenticateCustomerDirect(
  email: string,
  pass: string
): { success: boolean; customer?: StoredCustomer; error?: string } {
  const emailKey = email.trim().toLowerCase();
  const customer = memoryDb.customers.find((c) => c.email.toLowerCase() === emailKey);

  if (!customer) {
    return { success: false, error: 'No customer record found with this email in the database.' };
  }

  if (customer.passwordHash && customer.passwordHash !== hashPassword(pass)) {
    return { success: false, error: 'Incorrect credentials for this customer account.' };
  }

  customer.lastLoginAt = new Date().toISOString();
  persistToDisk();

  const { passwordHash, ...cleanCustomer } = customer;
  return { success: true, customer: cleanCustomer as StoredCustomer };
}

// 4. Get Customer by ID or Email
export function getCustomer(identifier: string): StoredCustomer | null {
  const needle = identifier.trim().toLowerCase();
  const found = memoryDb.customers.find(
    (c) => c.id.toLowerCase() === needle || c.email.toLowerCase() === needle
  );
  if (!found) return null;
  const { passwordHash, ...cleanCustomer } = found;
  return cleanCustomer as StoredCustomer;
}

// 5. Update Customer Profile Details
export function updateCustomer(
  identifier: string,
  updates: Partial<Omit<StoredCustomer, 'id' | 'email' | 'createdAt' | 'passwordHash'>>
): StoredCustomer | null {
  const needle = identifier.trim().toLowerCase();
  const idx = memoryDb.customers.findIndex(
    (c) => c.id.toLowerCase() === needle || c.email.toLowerCase() === needle
  );
  if (idx < 0) return null;

  const existing = memoryDb.customers[idx];
  const updated: StoredCustomer = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  memoryDb.customers[idx] = updated;
  persistToDisk();

  const { passwordHash, ...cleanCustomer } = updated;
  return cleanCustomer as StoredCustomer;
}

// 6. Save Customer Order into the Database
export function saveOrderToDatabase(orderData: any): StoredOrder {
  const customerEmail = (orderData.customer?.email || 'guest@arajpure.com').trim().toLowerCase();
  const customerName = orderData.customer?.name || 'Valued Patron';

  const newOrder: StoredOrder = {
    id: orderData.id || `ARAJ-${Date.now().toString().slice(-6)}`,
    customerId: orderData.customerId,
    customerEmail,
    customerName,
    customerPhone: orderData.customer?.phone || '',
    shippingAddress: orderData.customer?.address || '',
    city: orderData.customer?.city || 'Agra',
    state: orderData.customer?.state || 'Uttar Pradesh',
    pincode: orderData.customer?.pincode || '',
    paymentMethod: orderData.customer?.paymentMethod || 'cod',
    items: (orderData.items || []).map((item: any) => ({
      id: item.product?.id || item.id || '',
      name: item.product?.name || item.name || 'Araj Item',
      price: item.product?.price || item.price || 0,
      quantity: item.quantity || 1,
      weight: item.product?.weight || item.weight || '',
    })),
    subtotal: orderData.subtotal || 0,
    discount: orderData.discount || 0,
    shipping: orderData.shipping || 0,
    total: orderData.total || 0,
    status: orderData.status || 'Confirmed',
    createdAt: orderData.createdAt || new Date().toISOString(),
  };

  // Prepend order
  memoryDb.orders.unshift(newOrder);

  // Update customer order stats in database
  const customerIdx = memoryDb.customers.findIndex((c) => c.email.toLowerCase() === customerEmail);
  if (customerIdx >= 0) {
    const cust = memoryDb.customers[customerIdx];
    cust.totalOrders = (cust.totalOrders || 0) + 1;
    cust.totalSpent = (cust.totalSpent || 0) + (newOrder.total || 0);
    cust.updatedAt = new Date().toISOString();
  } else {
    // Automatically create new customer record in database from checkout details!
    upsertCustomer({
      email: customerEmail,
      name: customerName,
      phone: newOrder.customerPhone,
      address: newOrder.shippingAddress,
      city: newOrder.city,
      state: newOrder.state,
      pincode: newOrder.pincode,
      provider: 'guest',
    });
  }

  persistToDisk();
  return newOrder;
}

// 7. Get Orders for Customer
export function getOrdersForCustomer(emailOrId: string): StoredOrder[] {
  const needle = emailOrId.trim().toLowerCase();
  return memoryDb.orders.filter(
    (o) => o.customerEmail.toLowerCase() === needle || (o.customerId && o.customerId.toLowerCase() === needle)
  );
}

// 8. Save B2B Customer Distributor Inquiry
export function saveDistributorInquiryToDatabase(inquiryData: any): StoredInquiry {
  const newInquiry: StoredInquiry = {
    id: inquiryData.id || `DIST-${Date.now().toString().slice(-6)}`,
    fullName: inquiryData.fullName,
    businessName: inquiryData.businessName,
    phone: inquiryData.phone,
    email: inquiryData.email,
    city: inquiryData.city,
    state: inquiryData.state,
    businessType: inquiryData.businessType,
    expectedVolume: inquiryData.expectedVolume,
    message: inquiryData.message,
    createdAt: inquiryData.createdAt || new Date().toISOString(),
  };

  memoryDb.distributorInquiries.unshift(newInquiry);
  persistToDisk();
  return newInquiry;
}

// 9. Inspect Database Status & Metrics
export function getCustomerDatabaseStats(): {
  engine: string;
  version: string;
  storageFile: string;
  totalCustomers: number;
  totalOrders: number;
  totalInquiries: number;
  lastPersisted: string;
} {
  return {
    engine: memoryDb.meta.engine,
    version: memoryDb.meta.version,
    storageFile: DB_FILE,
    totalCustomers: memoryDb.customers.length,
    totalOrders: memoryDb.orders.length,
    totalInquiries: memoryDb.distributorInquiries.length,
    lastPersisted: memoryDb.meta.lastPersisted,
  };
}

// 10. Export Full Customer Database (for customer backup / admin inspection)
export function exportCustomerDatabase(): {
  customers: Array<Omit<StoredCustomer, 'passwordHash'>>;
  orders: StoredOrder[];
  meta: any;
} {
  return {
    customers: memoryDb.customers.map(({ passwordHash, ...c }) => c),
    orders: memoryDb.orders,
    meta: memoryDb.meta,
  };
}
