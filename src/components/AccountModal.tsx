import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, User, Package, Phone, Mail, MapPin, Clock, ShieldCheck, 
  Sparkles, ExternalLink, Lock, Eye, EyeOff, LogOut, CheckCircle2, 
  AlertCircle, ArrowRight, Edit3, Save, Check, RefreshCw
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { BRAND_INFO } from '../data/brand';

export const AccountModal: React.FC = () => {
  const { 
    isAccountOpen, 
    closeAccount, 
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
    updateCustomerProfile
  } = useStore();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'support'>('orders');

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

  // Sync profile fields when user profile loads or changes
  React.useEffect(() => {
    if (userProfile || user) {
      setProfileName(userProfile?.displayName || user?.displayName || '');
      setProfilePhone(userProfile?.phone || '');
      setProfileAddress(userProfile?.address || '');
    }
  }, [userProfile, user]);

  if (!isAccountOpen) return null;

  const handleGoogleAuth = async () => {
    clearAuthError();
    await loginWithGoogle();
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    if (authMode === 'register') {
      if (!displayName.trim()) {
        alert('Please provide your name.');
        return;
      }
      if (password.length < 6) {
        alert('Password should be at least 6 characters.');
        return;
      }
      const success = await registerWithEmail(email, password, displayName);
      if (success) {
        setEmail('');
        setPassword('');
        setDisplayName('');
      }
    } else {
      const success = await loginWithEmail(email, password);
      if (success) {
        setEmail('');
        setPassword('');
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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeAccount}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-[#0F0F17] border border-[#D4AF37]/35 rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden z-10 my-4 sm:my-8 max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#141420]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37]/25 to-[#996515]/30 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shadow-inner">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-[#FAF7EE] flex items-center gap-2">
                  <span>{user ? 'Patron Sanctuary' : 'Sign In & Register'}</span>
                  {user && (
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#48BB78]/20 text-[#48BB78] border border-[#48BB78]/40">
                      Active
                    </span>
                  )}
                </h2>
                <span className="text-xs text-[#A6A295]">
                  {user 
                    ? `Logged in as ${user.email}` 
                    : 'Access orders, royal privileges & concierge support'}
                </span>
              </div>
            </div>

            <button
              onClick={closeAccount}
              className="p-2 rounded-full text-[#DFDACD] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

            {/* UNLOGGED STATE: Gmail Login & Register */}
            {!user ? (
              <div className="space-y-6">
                
                {/* Hero Privilege Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#D4AF37]/15 via-[#FAF7EE]/5 to-[#141420] border border-[#D4AF37]/30 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-[#D4AF37] font-semibold">
                    <Sparkles className="w-4 h-4" />
                    <span>Royal Agra Spice & Dry Fruit Privilege</span>
                  </div>
                  <p className="text-[#DFDACD] text-[11px] leading-relaxed">
                    Sign in with your Gmail account to instantly track shipments, access priority seasonal harvests, and save your preferred delivery addresses.
                  </p>
                </div>

                {/* Primary Action: Instant Gmail / Google Login */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={isAuthLoading}
                    className="w-full py-3.5 px-4 rounded-xl sm:rounded-2xl bg-white hover:bg-[#F5F5F7] text-[#1F2937] font-medium text-sm flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] border border-gray-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed group"
                  >
                    {isAuthLoading ? (
                      <RefreshCw className="w-5 h-5 animate-spin text-gray-600" />
                    ) : (
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                    )}
                    <span className="font-semibold text-gray-900">
                      {isAuthLoading ? 'Connecting to Google...' : 'Continue with Google / Gmail'}
                    </span>
                  </button>
                  <p className="text-center text-[10px] text-[#8E8A80]">
                    Instant 1-click Google Sign-In &bull; No password required
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
                <div className="flex rounded-xl bg-white/[0.04] p-1 border border-white/10">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('login'); clearAuthError(); }}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      authMode === 'login'
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#C59F2D] text-[#0A0A0E] shadow-md'
                        : 'text-[#DFDACD] hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('register'); clearAuthError(); }}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      authMode === 'register'
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#C59F2D] text-[#0A0A0E] shadow-md'
                        : 'text-[#DFDACD] hover:text-white'
                    }`}
                  >
                    Register New Account
                  </button>
                </div>

                {/* Auth Error Banner */}
                {authError && (
                  <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-200 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span className="flex-1 leading-relaxed">{authError}</span>
                    <button 
                      type="button" 
                      onClick={clearAuthError}
                      className="text-red-400 hover:text-red-200 p-0.5"
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
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C59F2D] hover:from-[#E5BF48] hover:to-[#D4AF37] text-[#0A0A0E] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-60"
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

                {/* Benefits Badges */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <Package className="w-4 h-4 text-[#D4AF37] mx-auto" />
                    <span className="text-[10px] text-[#A6A295] block font-medium">Order History</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <MapPin className="w-4 h-4 text-[#48BB78] mx-auto" />
                    <span className="text-[10px] text-[#A6A295] block font-medium">Saved Addresses</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <ShieldCheck className="w-4 h-4 text-[#ECC94B] mx-auto" />
                    <span className="text-[10px] text-[#A6A295] block font-medium">Encrypted Data</span>
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
                      {user.photoURL ? (
                        <img 
                          src={user.photoURL} 
                          alt={user.displayName || 'Patron'} 
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-[#D4AF37] shadow-md"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B38728] text-[#0A0A0E] font-serif font-black text-xl flex items-center justify-center shadow-md">
                          {(user.displayName || user.email || 'A').charAt(0).toUpperCase()}
                        </div>
                      )}
                      
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif font-bold text-base text-[#FAF7EE]">
                            {user.displayName || userProfile?.displayName || 'Royal Patron'}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] text-[10px] font-mono font-bold border border-[#D4AF37]/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-[#48BB78]" />
                            <span>{user.providerData?.[0]?.providerId === 'google.com' ? 'Gmail Verified' : 'Registered'}</span>
                          </span>
                        </div>
                        <p className="text-xs text-[#A6A295] flex items-center gap-1">
                          <Mail className="w-3 h-3 text-[#88847A]" />
                          <span>{user.email}</span>
                        </p>
                        <p className="text-[10px] text-[#6B685F]">
                          Client UID: <span className="font-mono text-[#D4AF37]">{user.uid.slice(0, 10)}...</span>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={logout}
                      className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-red-500/20 text-[#DFDACD] hover:text-red-300 border border-white/10 hover:border-red-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all self-start sm:self-center cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>

                {/* Sub-Navigation Tabs */}
                <div className="flex rounded-xl bg-white/[0.04] p-1 border border-white/10">
                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      activeTab === 'orders'
                        ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm'
                        : 'text-[#A6A295] hover:text-[#FAF7EE]'
                    }`}
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>Orders ({orders.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('profile')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      activeTab === 'profile'
                        ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm'
                        : 'text-[#A6A295] hover:text-[#FAF7EE]'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Delivery Address</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('support')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      activeTab === 'support'
                        ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 shadow-sm'
                        : 'text-[#A6A295] hover:text-[#FAF7EE]'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Concierge</span>
                  </button>
                </div>

                {/* TAB 1: ORDERS */}
                {activeTab === 'orders' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-sm font-bold text-[#FAF7EE] flex items-center gap-2">
                        <Package className="w-4 h-4 text-[#D4AF37]" /> Your Spice &amp; Dry Fruit Orders
                      </span>
                      <span className="text-[11px] text-[#A6A295]">Synced to your session</span>
                    </div>

                    {orders.length === 0 ? (
                      <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center mx-auto">
                          <Package className="w-6 h-6 opacity-60" />
                        </div>
                        <p className="text-sm text-[#FAF7EE] font-medium">No orders recorded yet</p>
                        <p className="text-xs text-[#88847A] max-w-sm mx-auto">
                          Explore our collection of authentic Agra ground spices, chef blends, and royal dry fruits to place your first dispatch.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {orders.map((order) => (
                          <div
                            key={order.id}
                            className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 hover:border-[#D4AF37]/40 transition-colors"
                          >
                            <div className="flex items-center justify-between text-xs pb-2.5 border-b border-white/10">
                              <div>
                                <span className="text-[#A6A295]">Order </span>
                                <strong className="font-mono text-[#D4AF37]">{order.id}</strong>
                                <span className="text-[#88847A] text-[10px] ml-2 block sm:inline">
                                  {order.createdAt}
                                </span>
                              </div>
                              <span className="px-2.5 py-0.5 rounded-full bg-[#48BB78]/20 text-[#48BB78] font-bold text-[10px] uppercase border border-[#48BB78]/30">
                                {order.status}
                              </span>
                            </div>

                            <div className="space-y-1.5 text-xs">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-[#DFDACD]">
                                  <span>{item.quantity}x {item.product.name} ({item.product.weight})</span>
                                  <span className="font-mono font-medium">₹{item.product.price * item.quantity}</span>
                                </div>
                              ))}
                            </div>

                            <div className="flex items-center justify-between text-xs pt-2.5 border-t border-white/10">
                              <span className="text-[#A6A295]">Total Amount</span>
                              <span className="text-[#FAF7EE] font-bold font-mono text-sm">₹{order.total}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: PROFILE & DELIVERY DETAILS */}
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
                            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C59F2D] text-[#0A0A0E] font-bold text-xs flex items-center justify-center gap-1.5 shadow cursor-pointer disabled:opacity-60"
                          >
                            {isSavingProfile ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                            <span>Save to Firestore</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsEditingProfile(false)}
                            className="px-4 py-2.5 rounded-xl bg-white/[0.06] text-[#DFDACD] text-xs font-semibold hover:bg-white/10 cursor-pointer"
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
                            <span className="text-[#FAF7EE] font-mono text-xs">{user.email}</span>
                          </div>
                        </div>

                        <div className="pb-2.5 border-b border-white/10">
                          <span className="text-[#88847A] text-[10px] block">Contact Number</span>
                          <span className="text-[#FAF7EE] font-medium">
                            {profilePhone || 'No phone added yet'}
                          </span>
                        </div>

                        <div>
                          <span className="text-[#88847A] text-[10px] block">Saved Shipping Address</span>
                          <p className="text-[#FAF7EE] font-medium leading-relaxed mt-0.5">
                            {profileAddress || 'No default delivery address configured. Click "Edit Details" above to set your delivery address.'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: CONCIERGE & SUPPORT */}
                {activeTab === 'support' && (
                  <div className="space-y-4">
                    <span className="font-serif text-sm font-bold text-[#FAF7EE] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Araj Heritage Concierge
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <a
                        href={`tel:${BRAND_INFO.phone.replace(/\s+/g, '')}`}
                        className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/40 flex items-center gap-3 transition-all group cursor-pointer"
                      >
                        <div className="p-2 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] group-hover:scale-105 transition-transform">
                          <Phone className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[#88847A] text-[10px]">Agra Helpline</div>
                          <div className="text-[#FAF7EE] font-medium">{BRAND_INFO.phone}</div>
                        </div>
                      </a>

                      <a
                        href={`mailto:${BRAND_INFO.email}`}
                        className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-[#D4AF37]/40 flex items-center gap-3 transition-all group cursor-pointer"
                      >
                        <div className="p-2 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] group-hover:scale-105 transition-transform">
                          <Mail className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-[#88847A] text-[10px]">Concierge Mail</div>
                          <div className="text-[#FAF7EE] font-medium truncate">{BRAND_INFO.email}</div>
                        </div>
                      </a>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-[#88847A] text-[10px]">Mills & Tasting Room</div>
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
                <strong className="text-[#FAF7EE] block font-serif">100% Secure Sanctuary</strong>
                Adhering to strict cryptographic identity authentication and zero-trust cloud data privacy.
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
