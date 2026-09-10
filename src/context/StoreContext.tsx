import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Product, CartItem, Order, CustomerInfo, DistributorInquiry, UserProfile } from '../types';
import { PRODUCTS } from '../data/products';
import { playLuxuryChime } from '../utils/sound';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  fbSignOut, 
  updateProfile as fbUpdateProfile, 
  onAuthStateChanged,
  syncUserProfile,
  fetchUserProfile
} from '../lib/firebase';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: Product[];
  orders: Order[];
  user: User | null;
  userProfile: UserProfile | null;
  isAuthLoading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  loginWithGoogle: () => Promise<boolean>;
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  registerWithEmail: (email: string, password: string, displayName: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateCustomerProfile: (data: { phone?: string; address?: string; city?: string; pincode?: string; displayName?: string }) => Promise<void>;
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  isSearchOpen: boolean;
  isAccountOpen: boolean;
  selectedProduct: Product | null;
  activeCategory: string;
  searchQuery: string;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  openWishlist: () => void;
  closeWishlist: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  openAccount: () => void;
  closeAccount: () => void;
  openProductDetail: (product: Product) => void;
  closeProductDetail: () => void;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  placeOrder: (customer: CustomerInfo) => Order;
  setActiveCategory: (cat: string) => void;
  setSearchQuery: (query: string) => void;
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartTotal: number;
  isCheckoutOpen: boolean;
  isScannerOpen: boolean;
  isHamperOpen: boolean;
  isAiChatOpen: boolean;
  isInstallModalOpen: boolean;
  isDistributorModalOpen: boolean;
  scannedProduct: Product | null;
  openScanner: (product?: Product) => void;
  closeScanner: () => void;
  openHamper: () => void;
  closeHamper: () => void;
  openAiChat: () => void;
  closeAiChat: () => void;
  toggleAiChat: () => void;
  openInstallModal: () => void;
  closeInstallModal: () => void;
  openDistributorModal: () => void;
  closeDistributorModal: () => void;
  submitDistributorInquiry: (inquiry: Omit<DistributorInquiry, 'id' | 'createdAt'>) => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  lastOrder: Order | null;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products] = useState<Product[]>(PRODUCTS);
  
  // Persistent Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('araj_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persistent Wishlist state
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('araj_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persistent Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('araj_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isHamperOpen, setIsHamperOpen] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isDistributorModalOpen, setIsDistributorModalOpen] = useState(false);
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Firebase Auth State
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Listen for Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const profile = await fetchUserProfile(currentUser.uid);
          if (profile) {
            setUserProfile(profile);
          } else {
            const synced = await syncUserProfile(currentUser);
            setUserProfile(synced);
          }
        } catch (err) {
          console.error('Failed to load profile on auth change:', err);
        }
      } else {
        setUserProfile(null);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearAuthError = () => setAuthError(null);

  // Gmail / Google Login & Registration
  const loginWithGoogle = async (): Promise<boolean> => {
    setIsAuthLoading(true);
    setAuthError(null);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const profile = await syncUserProfile(res.user);
      if (profile) setUserProfile(profile);
      playLuxuryChime('success');
      showToast(`Welcome, ${res.user.displayName || res.user.email}!`);
      return true;
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      let msg = 'Google authentication could not be completed.';
      if (err.code === 'auth/popup-closed-by-user') {
        msg = 'Sign-in popup was closed before completing.';
      } else if (err.code === 'auth/cancelled-popup-request') {
        msg = 'Another login request is already in progress.';
      } else if (err.message) {
        msg = err.message;
      }
      setAuthError(msg);
      showToast(msg);
      return false;
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Email / Password Login
  const loginWithEmail = async (email: string, pass: string): Promise<boolean> => {
    setIsAuthLoading(true);
    setAuthError(null);
    try {
      const res = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const profile = await syncUserProfile(res.user);
      if (profile) setUserProfile(profile);
      playLuxuryChime('success');
      showToast(`Welcome back, ${res.user.displayName || res.user.email}!`);
      return true;
    } catch (err: any) {
      console.error('Email Login Error:', err);
      let msg = 'Failed to sign in. Please verify your email and password.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Incorrect email or password. Please try again or sign up.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      } else if (err.message) {
        msg = err.message;
      }
      setAuthError(msg);
      showToast(msg);
      return false;
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Email / Password Registration
  const registerWithEmail = async (email: string, pass: string, displayName: string): Promise<boolean> => {
    setIsAuthLoading(true);
    setAuthError(null);
    try {
      const res = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (displayName.trim()) {
        await fbUpdateProfile(res.user, { displayName: displayName.trim() });
      }
      const profile = await syncUserProfile(res.user);
      if (profile) setUserProfile(profile);
      playLuxuryChime('success');
      showToast(`Account created! Welcome to ARAJ, ${displayName.trim() || res.user.email}!`);
      return true;
    } catch (err: any) {
      console.error('Email Registration Error:', err);
      let msg = 'Could not complete registration.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email address already exists. Please login instead.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please provide a valid email address.';
      } else if (err.message) {
        msg = err.message;
      }
      setAuthError(msg);
      showToast(msg);
      return false;
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await fbSignOut(auth);
      setUser(null);
      setUserProfile(null);
      playLuxuryChime('click');
      showToast('Signed out successfully.');
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  // Update Customer Profile Details in Firestore
  const updateCustomerProfile = async (data: { phone?: string; address?: string; city?: string; pincode?: string; displayName?: string }) => {
    if (!user) return;
    try {
      if (data.displayName && data.displayName !== user.displayName) {
        await fbUpdateProfile(user, { displayName: data.displayName });
      }
      const updated = await syncUserProfile(user, { phone: data.phone, address: data.address });
      if (updated) {
        setUserProfile(updated);
        showToast('Profile updated successfully!');
      }
    } catch (err) {
      console.error('Update profile error:', err);
      showToast('Failed to save profile changes.');
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem('araj_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('araj_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('araj_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const openWishlist = () => setIsWishlistOpen(true);
  const closeWishlist = () => setIsWishlistOpen(false);

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  const openAccount = () => setIsAccountOpen(true);
  const closeAccount = () => setIsAccountOpen(false);

  const openCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
    playLuxuryChime('click');
  };
  const closeCheckout = () => setIsCheckoutOpen(false);

  const openScanner = (product?: Product) => {
    setScannedProduct(product || products[0] || null);
    setIsScannerOpen(true);
    playLuxuryChime('scan');
  };
  const closeScanner = () => setIsScannerOpen(false);

  const openHamper = () => {
    setIsHamperOpen(true);
    playLuxuryChime('click');
  };
  const closeHamper = () => setIsHamperOpen(false);

  const openAiChat = () => {
    setIsAiChatOpen(true);
    playLuxuryChime('click');
  };
  const closeAiChat = () => setIsAiChatOpen(false);
  const toggleAiChat = () => {
    setIsAiChatOpen((prev) => !prev);
    playLuxuryChime('click');
  };

  const openInstallModal = () => {
    setIsInstallModalOpen(true);
    playLuxuryChime('click');
  };
  const closeInstallModal = () => setIsInstallModalOpen(false);

  const openDistributorModal = () => {
    setIsDistributorModalOpen(true);
    playLuxuryChime('click');
  };
  const closeDistributorModal = () => setIsDistributorModalOpen(false);

  const submitDistributorInquiry = (inquiryData: Omit<DistributorInquiry, 'id' | 'createdAt'>) => {
    const newInquiry: DistributorInquiry = {
      ...inquiryData,
      id: `DIST-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    try {
      const existing = localStorage.getItem('araj_distributor_inquiries');
      const list = existing ? JSON.parse(existing) : [];
      list.push(newInquiry);
      localStorage.setItem('araj_distributor_inquiries', JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
    playLuxuryChime('success');
    showToast('Inquiry submitted! Our Agra office will connect shortly.');
  };

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    playLuxuryChime('click');
  };
  const closeProductDetail = () => setSelectedProduct(null);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    playLuxuryChime('add');
    showToast(`Added ${product.name} to bag`);
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        showToast(`Removed from Wishlist`);
        return prev.filter((item) => item.id !== product.id);
      } else {
        showToast(`Added ${product.name} to Wishlist`);
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.id === productId);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  const cartSubtotal = cart.reduce(
    (total, item) => total + item.product.originalPrice * item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const cartDiscount = Math.max(0, cartSubtotal - cartTotal);

  const placeOrder = (customer: CustomerInfo): Order => {
    const shipping = cartTotal >= 499 || cartTotal === 0 ? 0 : 50;
    const finalTotal = cartTotal + shipping;
    
    const newOrder: Order = {
      id: `ARAJ-${Date.now().toString().slice(-6)}`,
      items: [...cart],
      subtotal: cartSubtotal,
      discount: cartDiscount,
      shipping,
      total: finalTotal,
      customer,
      createdAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'Confirmed',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastOrder(newOrder);
    clearCart();
    return newOrder;
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        wishlist,
        orders,
        user,
        userProfile,
        isAuthLoading,
        authError,
        clearAuthError,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
        updateCustomerProfile,
        isCartOpen,
        isWishlistOpen,
        isSearchOpen,
        isAccountOpen,
        isCheckoutOpen,
        isScannerOpen,
        isHamperOpen,
        isAiChatOpen,
        scannedProduct,
        openScanner,
        closeScanner,
        openHamper,
        closeHamper,
        openAiChat,
        closeAiChat,
        toggleAiChat,
        isInstallModalOpen,
        openInstallModal,
        closeInstallModal,
        isDistributorModalOpen,
        openDistributorModal,
        closeDistributorModal,
        submitDistributorInquiry,
        selectedProduct,
        activeCategory,
        searchQuery,
        openCart,
        closeCart,
        toggleCart,
        openWishlist,
        closeWishlist,
        openSearch,
        closeSearch,
        openAccount,
        closeAccount,
        openCheckout,
        closeCheckout,
        openProductDetail,
        closeProductDetail,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isInWishlist,
        placeOrder,
        setActiveCategory,
        setSearchQuery,
        cartCount,
        cartSubtotal,
        cartDiscount,
        cartTotal,
        lastOrder,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
