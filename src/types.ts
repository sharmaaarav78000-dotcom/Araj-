export interface Product {
  id: string;
  name: string;
  hindiName?: string;
  price: number;
  originalPrice: number;
  discountPercentage?: number;
  category: 'spices' | 'dry fruits' | 'gifting';
  tags: ('ALL' | 'DRY FRUITS' | 'SPICES' | 'NUTS' | 'SEEDS' | 'GIFT PACKS' | 'GROUND SPICES' | 'BLENDED SPICES')[];
  image: string;
  description: string;
  weight: string;
  nutritionalInfo?: string;
  ingredients?: string;
  storage?: string;
  origin?: string;
  inStock: boolean;
  featured: boolean;
  rating: number;
  reviews: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: 'cod' | 'upi' | 'card' | 'netbanking';
  notes?: string;
}

export type OrderStatus = 'Confirmed' | 'Processing' | 'Dispatched' | 'Out for Delivery' | 'Delivered';

export interface OrderStatusEvent {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  location?: string;
  completed: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  customer: CustomerInfo;
  createdAt: string;
  status: OrderStatus;
  userId?: string;
  carrier?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  statusTimeline?: OrderStatusEvent[];
  updatedAt?: string;
}

export interface DistributorInquiry {
  id: string;
  fullName: string;
  businessName: string;
  phone: string;
  email?: string;
  city: string;
  state: string;
  businessType: 'distributor' | 'wholesaler' | 'retailer' | 'caterer_hotel' | 'gift_reseller';
  expectedVolume: string;
  message?: string;
  createdAt: string;
}

export type CategoryFilter = 
  | 'ALL' 
  | 'GROUND SPICES' 
  | 'BLENDED SPICES' 
  | 'DRY FRUITS' 
  | 'NUTS' 
  | 'SEEDS' 
  | 'GIFT PACKS' 
  | 'SPICES';

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'discount' | 'newest';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  providerId?: string;
  phone?: string;
  address?: string;
  city?: string;
  pincode?: string;
  createdAt: string;
  lastLoginAt: string;
}

