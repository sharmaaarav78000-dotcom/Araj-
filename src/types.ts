export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discountPercentage?: number;
  category: 'spices' | 'dry fruits' | 'gifting';
  tags: ('ALL' | 'DRY FRUITS' | 'SPICES' | 'NUTS' | 'SEEDS' | 'GIFT PACKS')[];
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

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  customer: CustomerInfo;
  createdAt: string;
  status: 'Confirmed' | 'Dispatched' | 'Delivered';
}

export type CategoryFilter = 'ALL' | 'DRY FRUITS' | 'SPICES' | 'NUTS' | 'SEEDS' | 'GIFT PACKS';
export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'discount' | 'newest';
