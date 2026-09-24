import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, User, Package, Phone, Mail, MapPin, Clock, ShieldCheck, 
  Sparkles, ExternalLink, Lock, Eye, EyeOff, LogOut, CheckCircle2, 
  AlertCircle, ArrowRight, Edit3, Save, Check, RefreshCw, Database, Download,
  Truck, Search, Copy, ChevronDown, ChevronUp, PackageCheck, Send, Radio
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BRAND_INFO } from '../data/brand';
import { Order, OrderStatus } from '../types';
import { buildDefaultStatusTimeline } from '../lib/firebase';

const STATUS_STEPS: { status: OrderStatus; label: string; iconName: string; defaultDesc: string; defaultLoc: string }[] = [
  {
    status: 'Confirmed',
    label: 'Order Confirmed',
    iconName: 'Package',
    defaultDesc: 'Order verified and recorded at Agra Central Heritage Mill.',
    defaultLoc: 'Agra Dispatch Desk, Uttar Pradesh',
  },
  {
    status: 'Processing',
    label: 'Artisan Milling & Packaging',
    iconName: 'Sparkles',
    defaultDesc: 'Hand-sorted spices ground under 32°C & sealed in multi-barrier nitrogen pouches.',
    defaultLoc: 'Araj Artisanal Mill, Hathras Road, Naraich, Agra',
  },
  {
    status: 'Dispatched',
    label: 'Handed to Express Courier',
    iconName: 'Truck',
    defaultDesc: 'Package sealed and handed over to Blue Dart / Delhivery Express priority service.',
    defaultLoc: 'Agra Express Logistics Transit Hub',
  },
  {
    status: 'Out for Delivery',
    label: 'Out for Doorstep Delivery',
    iconName: 'MapPin',
    defaultDesc: 'Courier partner is en route for final doorstep delivery to your location.',
    defaultLoc: 'Local Distribution Station',
  },
  {
    status: 'Delivered',
    label: 'Delivered to Patron',
    iconName: 'PackageCheck',
    defaultDesc: 'Shipment delivered in tamper-proof heritage pack. Purity of Agra delivered.',
    defaultLoc: 'Patron Destination',
  },
];

const ORDER_STATUS_ORDER: OrderStatus[] = ['Confirmed', 'Processing', 'Dispatched', 'Out for Delivery', 'Delivered'];

export const AccountModal: React.FC = () => {
  const { 
    isAccountOpen, 
    closeAccount, 
    orders, 
    user, 
    userProfile, 
    dbStatus,
    isAuthLoading, 
    authError, 
    clearAuthError,
    loginWithGoogle, 
    loginWithEmail, 
    registerWithEmail, 
    loginWithCustomerDb,
    registerWithCustomerDb,
    logout,
    updateCustomerProfile,
    showToast,
    updateOrderStatus,
    fetchOrderLive,
    isFirestoreSyncing,
  } = useStore();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [unloggedView, setUnloggedView] = useState<'auth' | 'quickTrack'>('auth');
  const [activeTab, setActiveTab] = useState<'orders' | 'track' | 'profile' | 'support'>('orders');
  const [localFormError, setLocalFormError] = useState<string | null>(null);

  // Form states for Email auth
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Profile edit states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Order Tracking states
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [trackInputId, setTrackInputId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [isTrackSearching, setIsTrackSearching] = useState(false);
  const [trackSearchError, setTrackSearchError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<string | null>(null);

  // Active customer from Sovereign Customer Database or Firebase session
  const activeCustomer = userProfile || (user ? {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || user.email?.split('@')[0] || 'Royal Patron',
    photoURL: user.photoURL || null,
    providerId: user.providerData?.[0]?.providerId || 'google.com',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  } : null);

  // Sync profile fields when customer profile loads or changes
  useEffect(() => {
    if (activeCustomer) {
      setProfileName(activeCustomer.displayName || '');
      setProfilePhone(activeCustomer.phone || '');
      setProfileAddress(activeCustomer.address || '');
    }
  }, [activeCustomer]);

  // Set the first order expanded by default if available
  useEffect(() => {
    if (orders.length > 0 && !expandedOrderId) {
      setExpandedOrderId(orders[0].id);
    }
  }, [orders]);

  if (!isAccountOpen) return null;

  const handleGoogleAuth = async () => {
    clearAuthError();
    await loginWithGoogle();
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    setLocalFormError(null);
    if (authMode === 'register') {
      if (!displayName.trim()) {
        const msg = 'Please provide your full name.';
        setLocalFormError(msg);
        showToast(msg);
        return;
      }
      if (password.length < 6) {
        const msg = 'Password should be at least 6 characters.';
        setLocalFormError(msg);
        showToast(msg);
        return;
      }
      const success = await registerWithEmail(email, password, displayName);
      if (success) {
        setEmail('');
        setPassword('');
        setDisplayName('');
        setLocalFormError(null);
      }
    } else {
      const success = await loginWithEmail(email, password);
      if (success) {
        setEmail('');
        setPassword('');
        setLocalFormError(null);
      }
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    await updateCustomerProfile({
      displayName: profileName,
      phone: profilePhone,
      address: profileAddress,
    });
    setIsSavingProfile(false);
    setIsEditingProfile(false);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    showToast(`Copied ${text}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTrackSearch = async (targetId?: string) => {
    const query = (targetId || trackInputId).trim();
    if (!query) {
      setTrackSearchError('Please enter an Order ID (e.g. ARAJ-123456).');
      return;
    }

    setIsTrackSearching(true);
    setTrackSearchError(null);

    // First check local orders
    const foundLocal = orders.find(o => o.id.toLowerCase() === query.toLowerCase());
    if (foundLocal) {
      setTrackedOrder(foundLocal);
      setIsTrackSearching(false);
      return;
    }

    // Fetch live from Firestore
    try {
      const live = await fetchOrderLive(query.toUpperCase());
      if (live) {
        setTrackedOrder(live);
      } else {
        setTrackSearchError(`No order found matching "${query}". Please verify the Order ID.`);
      }
    } catch {
      setTrackSearchError('Could not fetch order from Firestore. Please check your connection.');
    } finally {
      setIsTrackSearching(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setIsUpdatingStatus(orderId);
    await updateOrderStatus(orderId, newStatus);
    // If tracked order is also this order, update it too
    if (trackedOrder && trackedOrder.id === orderId) {
      setTrackedOrder(prev => prev ? {
        ...prev,
        status: newStatus,
        statusTimeline: buildDefaultStatusTimeline(newStatus, prev.createdAt),
        updatedAt: new Date().toISOString(),
      } : null);
    }
    setIsUpdatingStatus(null);
  };

  const getStatusBadgeConfig = (status: OrderStatus) => {
    switch (status) {
      case 'Confirmed':
        return {
          pill: 'bg-amber-500/15 text-amber-300 border-amber-500/35',
          dot: 'bg-amber-400',
          text: 'Order Confirmed',
          icon: <Clock className="w-3.5 h-3.5" />
        };
      case 'Processing':
        return {
          pill: 'bg-purple-500/15 text-purple-300 border-purple-500/35',
          dot: 'bg-purple-400 animate-pulse',
          text: 'Artisan Packaging',
          icon: <Sparkles className="w-3.5 h-3.5" />
        };
      case 'Dispatched':
        return {
          pill: 'bg-sky-500/15 text-sky-300 border-sky-500/35',
          dot: 'bg-sky-400 animate-pulse',
          text: 'Dispatched in Transit',
          icon: <Truck className="w-3.5 h-3.5" />
        };
      case 'Out for Delivery':
        return {
          pill: 'bg-orange-500/15 text-orange-300 border-orange-500/35',
          dot: 'bg-orange-400 animate-ping',
          text: 'Out for Delivery',
          icon: <MapPin className="w-3.5 h-3.5" />
        };
      case 'Delivered':
        return {
          pill: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35',
          dot: 'bg-emerald-400',
          text: 'Delivered to Patron',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />
        };
      default:
        return {
          pill: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/35',
          dot: 'bg-zinc-400',
          text: status || 'Confirmed',
          icon: <Package className="w-3.5 h-3.5" />
        };
    }
  };

  const filteredOrders = orders.filter(order => {
    if (!orderSearchQuery.trim()) return true;
    const q = orderSearchQuery.toLowerCase();
    return (
      order.id.toLowerCase().includes(q) ||
      order.status.toLowerCase().includes(q) ||
      order.items.some(i => i.product.name.toLowerCase().includes(q))
    );
  });

  // Render a detailed visual delivery stepper for an order
  const renderDeliveryStepper = (order: Order) => {
    const currentStatusIndex = ORDER_STATUS_ORDER.indexOf(order.status);
    const timeline = order.statusTimeline && order.statusTimeline.length > 0
      ? order.statusTimeline
      : buildDefaultStatusTimeline(order.status, order.createdAt);

    return (
      <div className="space-y-4 pt-2">
        {/* Logistics AWB & Carrier Banner */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-white/[0.04] to-white/[0.02] border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] text-[#88847A] uppercase tracking-wider block font-mono">
              Logistics Partner &amp; AWB Tracking
            </span>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#D4AF37]" />
              <strong className="text-[#FAF7EE] font-medium">{order.carrier || 'Blue Dart Express'}</strong>
              <span className="text-[#88847A]">&bull;</span>
              <span className="font-mono text-[#D4AF37] font-semibold">{order.trackingNumber || `AGR-BLU-${order.id.slice(-6)}`}</span>
              <button
                type="button"
                onClick={() => handleCopy(order.trackingNumber || `AGR-BLU-${order.id.slice(-6)}`, `awb-${order.id}`)}
                className="p-1 hover:text-[#FAF7EE] text-[#88847A] cursor-pointer transition-colors"
                title="Copy AWB Tracking Number"
              >
                {copiedKey === `awb-${order.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          <div className="text-right space-y-1">
            <span className="text-[10px] text-[#88847A] uppercase tracking-wider block font-mono">
              Estimated Arrival
            </span>
            <span className="text-emerald-400 font-medium font-mono text-xs flex items-center gap-1 sm:justify-end">
              <Clock className="w-3 h-3" />
              <span>{order.estimatedDelivery || '3-4 Business Days'}</span>
            </span>
          </div>
        </div>

        {/* Real-Time Stepper Line & Milestones */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
            <span className="text-[#FAF7EE] font-serif font-bold flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Real-Time Shipment Progress</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Live Firestore Feed
            </span>
          </div>

          <div className="relative pl-6 sm:pl-8 space-y-6">
            {/* Vertical connector line */}
            <div className="absolute left-[11px] sm:left-[15px] top-3 bottom-3 w-0.5 bg-white/10" />

            {STATUS_STEPS.map((step, idx) => {
              const isPast = idx < currentStatusIndex;
              const isCurrent = idx === currentStatusIndex;
              const isUpcoming = idx > currentStatusIndex;
              const matchingTimelineEvent = timeline.find(e => e.status === step.status);

              return (
                <div key={step.status} className="relative flex items-start gap-3.5">
                  {/* Step Icon Indicator */}
                  <div 
                    className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${
                      isCurrent
                        ? 'bg-[#D4AF37] text-[#0A0A0E] font-bold shadow-[0_0_15px_rgba(212,175,55,0.6)] ring-4 ring-[#D4AF37]/20 scale-110 z-10'
                        : isPast
                        ? 'bg-emerald-500 text-white font-bold z-10 shadow-sm'
                        : 'bg-[#181824] text-[#6B685F] border border-white/15 z-10'
                    }`}
                  >
                    {isPast ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-[#0A0A0E] animate-ping" />
                    ) : (
                      <span className="text-[10px]">{idx + 1}</span>
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <div className="flex items-center gap-2">
                        <strong className={`text-xs ${isCurrent ? 'text-[#D4AF37] font-bold' : isPast ? 'text-[#FAF7EE]' : 'text-[#88847A]'}`}>
                          {step.label}
                        </strong>
                        {isCurrent && (
                          <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-[#D4AF37]/20 text-[#D4AF37] rounded-full border border-[#D4AF37]/35 animate-pulse">
                            Active Stage
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-[#88847A]">
                        {matchingTimelineEvent?.timestamp || (isPast ? 'Completed' : isCurrent ? 'In Progress' : 'Upcoming')}
                      </span>
                    </div>

                    <p className={`text-xs leading-relaxed ${isCurrent ? 'text-[#DFDACD]' : isPast ? 'text-[#A6A295]' : 'text-[#66635B]'}`}>
                      {matchingTimelineEvent?.description || step.defaultDesc}
                    </p>

                    <div className="flex items-center gap-1 text-[10px] text-[#88847A]">
                      <MapPin className="w-3 h-3 text-[#D4AF37]/70" />
                      <span>{matchingTimelineEvent?.location || step.defaultLoc}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Controls: WhatsApp Inquiry & Interactive Status Simulation */}
        <div className="space-y-3 pt-1">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {/* WhatsApp Concierge Action */}
            <a
              href={`https://wa.me/919917104448?text=${encodeURIComponent(
                `Hello ARAJ Concierge! Please provide a live dispatch & transit update for my Order ID: ${order.id}. Total Amount: ₹${order.total}. Status: ${order.status}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#FAF7EE] text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm group"
            >
              <Send className="w-3.5 h-3.5 text-[#25D366] group-hover:translate-x-0.5 transition-transform" />
              <span>Inquire on WhatsApp (+91 99171 04448)</span>
            </a>

            {/* Manual Refresh from Firestore */}
            <button
              type="button"
              onClick={async () => {
                const refreshed = await fetchOrderLive(order.id);
                if (refreshed) {
                  showToast(`Live status synced from Firestore (${refreshed.status})`);
                }
              }}
              disabled={isFirestoreSyncing}
              className="py-2.5 px-3.5 rounded-xl glass-btn-secondary text-xs text-[#DFDACD] hover:text-white flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
              title="Ping Firestore for live updates"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFirestoreSyncing ? 'animate-spin text-[#D4AF37]' : ''}`} />
              <span>Sync Firestore</span>
            </button>
          </div>

          {/* Interactive Status Transition Simulator */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#88847A] flex items-center gap-1 font-mono">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                <span>Simulate / Progress Delivery Stage (Firestore Demo Sync):</span>
              </span>
              <span className="text-[10px] text-[#A6A295] font-mono">Updates live in Firestore</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              {ORDER_STATUS_ORDER.map((stage) => {
                const isSelected = order.status === stage;
                const isUpdating = isUpdatingStatus === order.id;

                return (
                  <button
                    key={stage}
                    type="button"
                    disabled={isUpdating || isSelected}
                    onClick={() => handleStatusChange(order.id, stage)}
                    className={`py-1.5 px-2 rounded-lg text-[10px] font-medium transition-all text-center cursor-pointer disabled:cursor-not-allowed ${
                      isSelected
                        ? 'bg-[#D4AF37] text-[#0A0A0E] font-bold shadow-sm'
                        : 'bg-white/[0.04] text-[#A6A295] hover:text-white hover:bg-white/[0.08] border border-white/10'
                    }`}
                  >
                    {stage}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Items Breakdown */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2 text-xs">
          <span className="text-[10px] uppercase font-mono text-[#88847A] tracking-wider block">
            Ordered Spices &amp; Dry Fruits
          </span>
          <div className="space-y-1.5">
            {order.items.map((item, idx) => (
              <div key={`${order.id}-${item.product.id}-${idx}`} className="flex justify-between items-center text-[#DFDACD]">
                <span className="flex items-center gap-1.5">
                  <span className="font-mono text-[#D4AF37]">{item.quantity}x</span>
                  <span>{item.product.name}</span>
                  <span className="text-[#88847A] text-[11px]">({item.product.weight})</span>
                </span>
                <span className="font-mono font-medium text-[#FAF7EE]">₹{item.product.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-[#88847A]">Shipping Address</span>
            <span className="text-[#FAF7EE] font-medium text-right max-w-xs truncate">
              {order.customer.address}, {order.customer.city} ({order.customer.pincode})
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      <div key="account-modal-wrapper" className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          key="account-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAccount}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          key="account-window"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#0F0F17] border border-[#D4AF37]/35 rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden z-10 my-4 sm:my-8 max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#141420]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37]/25 to-[#996515]/30 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shadow-inner">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-[#FAF7EE] flex items-center gap-2">
                  <span>{activeCustomer ? 'Patron Sanctuary' : 'Order Tracking & Sanctuary'}</span>
                  {activeCustomer && (
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      Active
                    </span>
                  )}
                </h2>
                <div className="flex items-center gap-2 text-xs text-[#A6A295]">
                  <span>
                    {activeCustomer 
                      ? `${activeCustomer.email}` 
                      : 'Live Firestore status tracking & royal patron privileges'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Firestore Live
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={closeAccount}
              className="p-2 rounded-full glass-btn-icon text-[#DFDACD] hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

            {/* UNLOGGED STATE: Gmail Login & Register OR Quick Order Tracking */}
            {!activeCustomer ? (
              <div className="space-y-6">
                
                {/* Hero Privilege Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#D4AF37]/15 via-[#FAF7EE]/5 to-[#141420] border border-[#D4AF37]/30 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-[#D4AF37] font-semibold">
                    <Sparkles className="w-4 h-4" />
                    <span>Royal Agra Spice & Dry Fruit Privilege</span>
                  </div>
                  <p className="text-[#DFDACD] text-[11px] leading-relaxed">
                    Track shipments in real-time backed by Google Cloud Firestore, access priority seasonal harvests, and save delivery preferences.
                  </p>
                </div>

                {/* Unlogged Navigation Mode (Sign In vs Quick Order Tracking) */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setUnloggedView('auth')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      unloggedView === 'auth'
                        ? 'glass-btn-gold text-[#0A0A0E] font-bold'
                        : 'glass-btn-pill text-[#DFDACD] hover:text-white'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Sign In / Register</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnloggedView('quickTrack')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      unloggedView === 'quickTrack'
                        ? 'glass-btn-gold text-[#0A0A0E] font-bold'
                        : 'glass-btn-pill text-[#DFDACD] hover:text-white'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Track Order by ID</span>
                  </button>
                </div>

                {unloggedView === 'quickTrack' ? (
                  /* Quick Track without login */
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                      <div className="space-y-1">
                        <label className="text-xs text-[#FAF7EE] font-semibold flex items-center gap-1.5">
                          <Package className="w-4 h-4 text-[#D4AF37]" />
                          <span>Enter Your Order ID</span>
                        </label>
                        <p className="text-[11px] text-[#88847A]">
                          Find your Order ID on your receipt or WhatsApp confirmation (e.g. ARAJ-123456).
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Search className="w-4 h-4 text-[#88847A] absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={trackInputId}
                            onChange={(e) => setTrackInputId(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleTrackSearch()}
                            placeholder="e.g. ARAJ-839102"
                            className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#FAF7EE] placeholder-[#66635B] focus:border-[#D4AF37] focus:outline-none uppercase font-mono"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleTrackSearch()}
                          disabled={isTrackSearching}
                          className="py-2.5 px-4 rounded-xl glass-btn-gold text-[#0A0A0E] font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                        >
                          {isTrackSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                          <span>Track Live</span>
                        </button>
                      </div>

                      {trackSearchError && (
                        <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                          <span>{trackSearchError}</span>
                        </div>
                      )}
                    </div>

                    {trackedOrder && (
                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-[#D4AF37]/40 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-white/10">
                          <div>
                            <span className="text-[10px] text-[#88847A] uppercase font-mono block">Order Found</span>
                            <span className="font-mono text-sm font-bold text-[#D4AF37]">{trackedOrder.id}</span>
                          </div>
                          {(() => {
                            const badge = getStatusBadgeConfig(trackedOrder.status);
                            return (
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border flex items-center gap-1.5 ${badge.pill}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                                {badge.icon}
                                <span>{badge.text}</span>
                              </span>
                            );
                          })()}
                        </div>

                        {renderDeliveryStepper(trackedOrder)}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Standard Auth Form */
                  <div className="space-y-6">
                    {/* Primary Action: Instant Gmail / Google Login */}
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={handleGoogleAuth}
                        disabled={isAuthLoading}
                        className="w-full py-3.5 px-4 rounded-xl sm:rounded-2xl glass-btn text-[#FAF7EE] hover:text-white font-medium text-sm flex items-center justify-center gap-3 transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group border-white/20 hover:border-[#D4AF37]/60"
                      >
                        {isAuthLoading ? (
                          <RefreshCw className="w-5 h-5 animate-spin text-gray-300" />
                        ) : (
                          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                          </svg>
                        )}
                        <span className="font-semibold text-[#FAF7EE]">
                          {isAuthLoading ? 'Connecting to Google...' : 'Continue with Google / Gmail'}
                        </span>
                      </button>
                      <p className="text-center text-[10px] text-[#8E8A80]">
                        Instant 1-click Google Sign-In &bull; Syncs all orders to your session
                      </p>
                    </div>

                    {/* Subtle Divider */}
                    <div className="relative flex items-center justify-center">
                      <div className="border-t border-white/10 w-full" />
                      <span className="bg-[#0F0F17] px-3 text-[11px] text-[#88847A] uppercase font-mono tracking-wider">
                        or with email
                      </span>
                      <div className="border-t border-white/10 w-full" />
                    </div>

                    {/* Mode Selector Tabs (Sign In vs Register) */}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => { setAuthMode('login'); clearAuthError(); }}
                        className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                          authMode === 'login'
                            ? 'glass-btn-gold text-[#0A0A0E] font-bold'
                            : 'glass-btn-pill text-[#DFDACD] hover:text-white'
                        }`}
                      >
                        Sign In
                      </button>
                      <button
                        type="button"
                        onClick={() => { setAuthMode('register'); clearAuthError(); }}
                        className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                          authMode === 'register'
                            ? 'glass-btn-gold text-[#0A0A0E] font-bold'
                            : 'glass-btn-pill text-[#DFDACD] hover:text-white'
                        }`}
                      >
                        Register New Account
                      </button>
                    </div>

                    {/* Auth Error Banner */}
                    {(authError || localFormError) && (
                      <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-200 flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                        <span className="flex-1 leading-relaxed">{authError || localFormError}</span>
                        <button 
                          type="button" 
                          onClick={() => { clearAuthError(); setLocalFormError(null); }}
                          className="text-red-400 hover:text-red-200 p-0.5 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {/* Email Form */}
                    <form onSubmit={handleEmailAuth} className="space-y-4">
                      {authMode === 'register' && (
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-[#DFDACD] block">
                            Full Name / Title
                          </label>
                          <div className="relative">
                            <User className="w-4 h-4 text-[#88847A] absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                              type="text"
                              required
                              value={displayName}
                              onChange={(e) => setDisplayName(e.target.value)}
                              placeholder="e.g., Aarav Sharma"
                              className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#FAF7EE] placeholder-[#66635B] focus:outline-none focus:border-[#D4AF37]"
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-[#DFDACD] block">
                          Email Address (Gmail or personal)
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-[#88847A] absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@gmail.com"
                            className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#FAF7EE] placeholder-[#66635B] focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-[#DFDACD] block">
                          Password {authMode === 'register' && '(min 6 characters)'}
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-[#88847A] absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-10 py-2.5 text-xs text-[#FAF7EE] placeholder-[#66635B] focus:outline-none focus:border-[#D4AF37]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((p) => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#88847A] hover:text-[#DFDACD]"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isAuthLoading}
                        className="w-full py-3 rounded-xl glass-btn-gold text-[#0A0A0E] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        {isAuthLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <span>{authMode === 'login' ? 'Sign In to Sanctuary' : 'Complete Registration'}</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}

                {/* Benefits Badges */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <Package className="w-4 h-4 text-[#D4AF37] mx-auto" />
                    <span className="text-[10px] text-[#A6A295] block font-medium">Real-Time Tracking</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <MapPin className="w-4 h-4 text-[#48BB78] mx-auto" />
                    <span className="text-[10px] text-[#A6A295] block font-medium">Saved Addresses</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <ShieldCheck className="w-4 h-4 text-[#ECC94B] mx-auto" />
                    <span className="text-[10px] text-[#A6A295] block font-medium">Encrypted Vault</span>
                  </div>
                </div>

              </div>
            ) : (

              /* LOGGED IN STATE: Patron Sanctuary */
              <div className="space-y-6">

                {/* Patron Profile Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#181824] to-[#12121A] border border-[#D4AF37]/35 relative overflow-hidden shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      {activeCustomer.photoURL ? (
                        <img 
                          src={activeCustomer.photoURL} 
                          alt={activeCustomer.displayName || 'Patron'} 
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-[#D4AF37] shadow-md"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B38728] text-[#0A0A0E] font-serif font-black text-xl flex items-center justify-center shadow-md">
                          {(activeCustomer.displayName || activeCustomer.email || 'A').charAt(0).toUpperCase()}
                        </div>
                      )}
                      
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif font-bold text-base text-[#FAF7EE]">
                            {activeCustomer.displayName || 'Royal Patron'}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Firestore Live</span>
                          </span>
                        </div>
                        <p className="text-xs text-[#A6A295] flex items-center gap-1">
                          <Mail className="w-3 h-3 text-[#88847A]" />
                          <span>{activeCustomer.email}</span>
                        </p>
                        <p className="text-[10px] text-[#6B685F]">
                          Client UID: <span className="font-mono text-[#D4AF37]">{activeCustomer.uid.slice(0, 10)}...</span>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={logout}
                      className="px-3 py-1.5 rounded-xl glass-btn-secondary text-[#DFDACD] hover:text-red-300 text-xs font-semibold flex items-center justify-center gap-1.5 self-start sm:self-center cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>

                {/* Sub-Navigation Tabs */}
                <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      activeTab === 'orders'
                        ? 'glass-btn-gold text-[#0A0A0E] font-bold'
                        : 'glass-btn-pill text-[#A6A295] hover:text-[#FAF7EE]'
                    }`}
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>Orders &amp; Tracking ({orders.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('track')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      activeTab === 'track'
                        ? 'glass-btn-gold text-[#0A0A0E] font-bold'
                        : 'glass-btn-pill text-[#A6A295] hover:text-[#FAF7EE]'
                    }`}
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Track by ID</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('profile')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      activeTab === 'profile'
                        ? 'glass-btn-gold text-[#0A0A0E] font-bold'
                        : 'glass-btn-pill text-[#A6A295] hover:text-[#FAF7EE]'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Address</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('support')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      activeTab === 'support'
                        ? 'glass-btn-gold text-[#0A0A0E] font-bold'
                        : 'glass-btn-pill text-[#A6A295] hover:text-[#FAF7EE]'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Concierge</span>
                  </button>
                </div>

                {/* TAB 1: ORDERS & LIVE DELIVERY STATUS TRACKING */}
                {activeTab === 'orders' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <span className="font-serif text-sm font-bold text-[#FAF7EE] flex items-center gap-2">
                          <Package className="w-4 h-4 text-[#D4AF37]" /> Your Order History &amp; Real-Time Tracking
                        </span>
                        <span className="text-[11px] text-[#A6A295]">
                          Synced in real-time with Google Cloud Firestore
                        </span>
                      </div>

                      {orders.length > 0 && (
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 text-[#88847A] absolute left-2.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={orderSearchQuery}
                            onChange={(e) => setOrderSearchQuery(e.target.value)}
                            placeholder="Filter by Order ID..."
                            className="bg-white/[0.04] border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#FAF7EE] placeholder-[#66635B] focus:border-[#D4AF37] focus:outline-none w-44"
                          />
                        </div>
                      )}
                    </div>

                    {orders.length === 0 ? (
                      <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center mx-auto">
                          <Package className="w-6 h-6 opacity-60" />
                        </div>
                        <p className="text-sm text-[#FAF7EE] font-medium">No orders placed yet</p>
                        <p className="text-xs text-[#88847A] max-w-sm mx-auto">
                          Discover our authentic cold stone-ground spices and royal dry fruits. Once placed, your orders will track here in real-time.
                        </p>
                      </div>
                    ) : filteredOrders.length === 0 ? (
                      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 text-center text-xs text-[#88847A]">
                        No orders match "{orderSearchQuery}".
                      </div>
                    ) : (
                      <div className="space-y-3.5">
                        {filteredOrders.map((order) => {
                          const isExpanded = expandedOrderId === order.id;
                          const badge = getStatusBadgeConfig(order.status);

                          return (
                            <div
                              key={order.id}
                              className={`p-4 rounded-2xl bg-white/[0.03] border transition-all ${
                                isExpanded 
                                  ? 'border-[#D4AF37]/50 shadow-[0_8px_30px_rgba(0,0,0,0.5)] ring-1 ring-[#D4AF37]/25' 
                                  : 'border-white/10 hover:border-[#D4AF37]/35'
                              }`}
                            >
                              {/* Order Card Header */}
                              <div className="flex items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10 flex-wrap sm:flex-nowrap">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[#A6A295] text-xs">Order</span>
                                    <strong className="font-mono text-[#D4AF37] text-sm">{order.id}</strong>
                                    <button
                                      type="button"
                                      onClick={() => handleCopy(order.id, `id-${order.id}`)}
                                      className="text-[#88847A] hover:text-[#FAF7EE] p-0.5 cursor-pointer"
                                      title="Copy Order ID"
                                    >
                                      {copiedKey === `id-${order.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                    </button>
                                  </div>
                                  <span className="text-[#88847A] text-[11px] block">
                                    Placed on {order.createdAt}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2.5">
                                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border flex items-center gap-1.5 ${badge.pill}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                                    {badge.icon}
                                    <span>{badge.text}</span>
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                                    className={`py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                                      isExpanded 
                                        ? 'bg-[#D4AF37] text-[#0A0A0E] font-bold shadow' 
                                        : 'glass-btn-secondary text-[#DFDACD] hover:text-white'
                                    }`}
                                  >
                                    <span>{isExpanded ? 'Hide Tracker' : 'Track Live'}</span>
                                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                              </div>

                              {/* Quick Summary Row */}
                              <div className="flex items-center justify-between text-xs py-2.5 text-[#DFDACD]">
                                <span className="text-[#A6A295]">
                                  {order.items.reduce((acc, item) => acc + item.quantity, 0)} item(s) &bull; {order.items.map(i => i.product.name).slice(0, 2).join(', ')}{order.items.length > 2 ? '...' : ''}
                                </span>
                                <div className="text-right">
                                  <span className="text-[10px] text-[#88847A] mr-1.5">Total</span>
                                  <span className="font-mono font-bold text-sm text-[#FAF7EE]">₹{order.total}</span>
                                </div>
                              </div>

                              {/* Expandable Real-Time Delivery Stepper */}
                              {isExpanded && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="pt-2 border-t border-white/10"
                                >
                                  {renderDeliveryStepper(order)}
                                </motion.div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: DIRECT REAL-TIME ORDER TRACKING SEARCH */}
                {activeTab === 'track' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                      <div className="space-y-1">
                        <span className="font-serif text-sm font-bold text-[#FAF7EE] flex items-center gap-2">
                          <Truck className="w-4 h-4 text-[#D4AF37]" /> Live Order Status Search
                        </span>
                        <p className="text-xs text-[#88847A]">
                          Fetch live shipment updates directly from the Firestore database using any Order ID.
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Search className="w-4 h-4 text-[#88847A] absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={trackInputId}
                            onChange={(e) => setTrackInputId(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleTrackSearch()}
                            placeholder="Enter Order ID (e.g. ARAJ-839201)"
                            className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#FAF7EE] placeholder-[#66635B] focus:border-[#D4AF37] focus:outline-none uppercase font-mono"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleTrackSearch()}
                          disabled={isTrackSearching}
                          className="py-2.5 px-4 rounded-xl glass-btn-gold text-[#0A0A0E] font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                        >
                          {isTrackSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                          <span>Query Firestore</span>
                        </button>
                      </div>

                      {/* Quick chips of recent orders */}
                      {orders.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px]">
                          <span className="text-[#88847A]">Recent Orders:</span>
                          {orders.slice(0, 3).map((o) => (
                            <button
                              key={o.id}
                              type="button"
                              onClick={() => {
                                setTrackInputId(o.id);
                                handleTrackSearch(o.id);
                              }}
                              className="px-2 py-0.5 rounded-lg bg-white/[0.05] hover:bg-[#D4AF37]/20 text-[#D4AF37] font-mono text-[10px] border border-white/10 transition-colors cursor-pointer"
                            >
                              {o.id}
                            </button>
                          ))}
                        </div>
                      )}

                      {trackSearchError && (
                        <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                          <span>{trackSearchError}</span>
                        </div>
                      )}
                    </div>

                    {trackedOrder && (
                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-[#D4AF37]/40 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-white/10">
                          <div>
                            <span className="text-[10px] text-[#88847A] uppercase font-mono block">Order Found in Firestore</span>
                            <span className="font-mono text-base font-bold text-[#D4AF37]">{trackedOrder.id}</span>
                          </div>
                          {(() => {
                            const badge = getStatusBadgeConfig(trackedOrder.status);
                            return (
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border flex items-center gap-1.5 ${badge.pill}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                                {badge.icon}
                                <span>{badge.text}</span>
                              </span>
                            );
                          })()}
                        </div>

                        {renderDeliveryStepper(trackedOrder)}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: PROFILE & DELIVERY DETAILS */}
                {activeTab === 'profile' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-sm font-bold text-[#FAF7EE] flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#D4AF37]" /> Delivery & Contact Preferences
                      </span>
                      {!isEditingProfile && (
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(true)}
                          className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Details</span>
                        </button>
                      )}
                    </div>

                    {isEditingProfile ? (
                      <form onSubmit={handleSaveProfile} className="space-y-3.5 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                        <div className="space-y-1">
                          <label className="text-xs text-[#DFDACD] block">Display / Contact Name</label>
                          <input
                            type="text"
                            value={profileName}
                            onChange={(e) => setProfileName(e.target.value)}
                            placeholder="Your full name"
                            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#FAF7EE] focus:border-[#D4AF37] focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-[#DFDACD] block">Phone / WhatsApp Number</label>
                          <input
                            type="tel"
                            value={profilePhone}
                            onChange={(e) => setProfilePhone(e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#FAF7EE] focus:border-[#D4AF37] focus:outline-none"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs text-[#DFDACD] block">Shipping & Delivery Address</label>
                          <textarea
                            rows={3}
                            value={profileAddress}
                            onChange={(e) => setProfileAddress(e.target.value)}
                            placeholder="Flat/House, Society, Landmark, City, State, PIN code"
                            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-[#FAF7EE] focus:border-[#D4AF37] focus:outline-none resize-none"
                          />
                        </div>

                        <div className="flex gap-2 pt-2">
                          <button
                            type="submit"
                            disabled={isSavingProfile}
                            className="flex-1 py-2.5 rounded-xl glass-btn-gold text-[#0A0A0E] font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                          >
                            {isSavingProfile ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                            <span>Save to Customer Database</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsEditingProfile(false)}
                            className="px-4 py-2.5 rounded-xl glass-btn-secondary text-[#DFDACD] text-xs font-semibold cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3.5 text-xs">
                        <div className="flex items-start justify-between pb-2.5 border-b border-white/10">
                          <div>
                            <span className="text-[#88847A] text-[10px] block">Contact Name</span>
                            <span className="text-[#FAF7EE] font-medium text-sm">
                              {profileName || 'Not configured'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[#88847A] text-[10px] block">Primary Email</span>
                            <span className="text-[#FAF7EE] font-mono text-xs">{activeCustomer.email}</span>
                          </div>
                        </div>

                        <div className="pb-2.5 border-b border-white/10">
                          <span className="text-[#88847A] text-[10px] block">Contact Number</span>
                          <span className="text-[#FAF7EE] font-medium">
                            {profilePhone || 'No phone added yet'}
                          </span>
                        </div>

                        <div className="pb-2.5 border-b border-white/10">
                          <span className="text-[#88847A] text-[10px] block">Saved Shipping Address</span>
                          <p className="text-[#FAF7EE] font-medium leading-relaxed mt-0.5">
                            {profileAddress || 'No default delivery address configured. Click "Edit Details" above to set your delivery address.'}
                          </p>
                        </div>

                        {/* Customer Storage Status Banner */}
                        <div className="pt-1 flex items-center justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-1.5 text-[11px] text-[#A6A295]">
                            <Database className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Storage: <strong className="text-[#DFDACD]">Sovereign ARAJ Customer Base &amp; Firestore</strong></span>
                          </div>
                          <a
                            href="/api/customer/export"
                            download="araj_customer_database.json"
                            className="text-[10px] text-[#D4AF37] hover:underline flex items-center gap-1 font-mono"
                          >
                            <Download className="w-3 h-3" />
                            <span>Export Data (.JSON)</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 4: CONCIERGE & SUPPORT */}
                {activeTab === 'support' && (
                  <div className="space-y-4">
                    <span className="font-serif text-sm font-bold text-[#FAF7EE] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Araj Heritage Concierge
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <a
                        href={`https://wa.me/919917104448`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/40 flex items-center gap-3 transition-all group cursor-pointer"
                      >
                        <div className="p-2 rounded-lg bg-[#25D366]/15 text-[#25D366] group-hover:scale-105 transition-transform">
                          <Send className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[#88847A] text-[10px]">WhatsApp Concierge</div>
                          <div className="text-[#FAF7EE] font-medium">+91 99171 04448</div>
                        </div>
                      </a>

                      <a
                        href={`tel:${BRAND_INFO.phone.replace(/\s+/g, '')}`}
                        className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/40 flex items-center gap-3 transition-all group cursor-pointer"
                      >
                        <div className="p-2 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] group-hover:scale-105 transition-transform">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[#88847A] text-[10px]">Agra Direct Helpline</div>
                          <div className="text-[#FAF7EE] font-medium">{BRAND_INFO.phone}</div>
                        </div>
                      </a>

                      <a
                        href={`mailto:${BRAND_INFO.email}`}
                        className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/40 flex items-center gap-3 transition-all group cursor-pointer col-span-1 sm:col-span-2"
                      >
                        <div className="p-2 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] group-hover:scale-105 transition-transform">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[#88847A] text-[10px]">Concierge Email Desk</div>
                          <div className="text-[#FAF7EE] font-medium truncate">{BRAND_INFO.email}</div>
                        </div>
                      </a>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-[#88847A] text-[10px]">Heritage Mills &amp; Tasting Room</div>
                        <div className="text-[#FAF7EE] font-medium">{BRAND_INFO.address}</div>
                        <div className="text-[#A6A295] text-[11px]">Visiting Hours: 10:00 AM – 8:00 PM IST</div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* Quality & Authenticity Seal */}
            <div className="p-3.5 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <div className="text-[11px] text-[#E1DACB] leading-snug">
                <strong className="text-[#FAF7EE] block font-serif">100% Real-Time Firestore Security</strong>
                Powered by Google Cloud Firestore database with instant sub-second delivery status tracking and end-to-end data encryption.
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
