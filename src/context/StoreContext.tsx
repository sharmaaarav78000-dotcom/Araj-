import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, CustomerInfo, DistributorInquiry } from '../types';
import { PRODUCTS } from '../data/products';
import { playLuxuryChime } from '../utils/sound';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: Product[];
  orders: Order[];
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
  isPhonePreviewOpen: boolean;
  isDistributorModalOpen: boolean;
  isThreeDAtelierOpen: boolean;
  threeDProduct: Product | null;
  scannedProduct: Product | null;
  openScanner: (product?: Product) => void;
  closeScanner: () => void;
  openThreeDAtelier: (product?: Product) => void;
  closeThreeDAtelier: () => void;
  openHamper: () => void;
  closeHamper: () => void;
  openAiChat: () => void;
  closeAiChat: () => void;
  toggleAiChat: () => void;
  openInstallModal: () => void;
  closeInstallModal: () => void;
  openPhonePreview: () => void;
  closePhonePreview: () => void;
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
  const [isPhonePreviewOpen, setIsPhonePreviewOpen] = useState(false);
  const [isDistributorModalOpen, setIsDistributorModalOpen] = useState(false);
  const [isThreeDAtelierOpen, setIsThreeDAtelierOpen] = useState(false);
  const [threeDProduct, setThreeDProduct] = useState<Product | null>(null);
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const openPhonePreview = () => {
    setIsPhonePreviewOpen(true);
    playLuxuryChime('click');
  };
  const closePhonePreview = () => setIsPhonePreviewOpen(false);

  const openDistributorModal = () => {
    setIsDistributorModalOpen(true);
    playLuxuryChime('click');
  };
  const closeDistributorModal = () => setIsDistributorModalOpen(false);

  const openThreeDAtelier = (product?: Product) => {
    setThreeDProduct(product || products[0] || null);
    setIsThreeDAtelierOpen(true);
    playLuxuryChime('sparkle');
  };
  const closeThreeDAtelier = () => {
    setIsThreeDAtelierOpen(false);
  };

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
        isPhonePreviewOpen,
        openPhonePreview,
        closePhonePreview,
        isDistributorModalOpen,
        openDistributorModal,
        closeDistributorModal,
        submitDistributorInquiry,
        isThreeDAtelierOpen,
        threeDProduct,
        openThreeDAtelier,
        closeThreeDAtelier,
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
