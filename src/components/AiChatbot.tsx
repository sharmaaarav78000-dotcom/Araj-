import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Trash2,
  Crown,
  ChevronDown,
  ShoppingBag,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Heart,
  Cpu,
  RefreshCw,
  Clock,
  Sparkle
} from 'lucide-react';
import Markdown from 'react-markdown';
import { useStore } from '../context/StoreContext';
import { playLuxuryChime } from '../utils/sound';
import { Product } from '../types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelUsed?: string;
  suggestedProduct?: Product | null;
}

type ChatRole = 'sommelier' | 'ayurveda' | 'heritage' | 'concierge';

interface RoleConfig {
  id: ChatRole;
  label: string;
  shortLabel: string;
  icon: string;
  description: string;
  placeholder: string;
  quickPrompts: string[];
}

const ROLES: RoleConfig[] = [
  {
    id: 'sommelier',
    label: 'Royal Spicer & Sommelier',
    shortLabel: 'Spicer',
    icon: '👑',
    description: 'Master blender for flavor pairings, curry alchemy, and stone-ground spices.',
    placeholder: 'Ask about spice pairings, secret recipes, roasting tips...',
    quickPrompts: [
      '🥘 Secret recipe for authentic Punjabi Chana Masala',
      '🌿 Why are Araj spices stone ground below 32°C?',
      '🌶️ How to use Shahi Garam Masala for maximum aroma?',
      '🥗 Best seasoning blend for fresh salads & snacks',
    ],
  },
  {
    id: 'ayurveda',
    label: 'Ayurvedic Wellness & Nutrition',
    shortLabel: 'Wellness',
    icon: '🌿',
    description: 'Ancient Ayurvedic benefits of daily nuts, curcumin absorption & dosha balance.',
    placeholder: 'Ask about health benefits of almonds, turmeric, walnuts...',
    quickPrompts: [
      '🌰 Why soak California almonds overnight in water?',
      '🧠 Best dry fruits for brain focus & memory?',
      '✨ How to boost turmeric curcumin absorption with black pepper?',
      '🥛 Ideal evening Golden Milk recipe with Araj spices',
    ],
  },
  {
    id: 'heritage',
    label: 'Agra Heritage & Cold Milling',
    shortLabel: 'Heritage',
    icon: '🏛️',
    description: 'Kaushal family history since 1985 in Agra, zero adulteration & purity standards.',
    placeholder: 'Ask about our Agra heritage, stone milling, zero adulteration...',
    quickPrompts: [
      '🏛️ The Kaushal family legacy in Agra since 1985',
      '🔬 How does Araj guarantee 0.00% synthetic starches?',
      '❄️ What happens when spices are milled below 32°C?',
      '📍 Where is the historic mill located in Agra?',
    ],
  },
  {
    id: 'concierge',
    label: 'Royal Orders & Gifting Concierge',
    shortLabel: 'Orders',
    icon: '📦',
    description: 'Fast shipping, Cash on Delivery, pan-India tracking, and custom luxury hampers.',
    placeholder: 'Ask about delivery times, free shipping, payment methods...',
    quickPrompts: [
      '📦 Delivery time to my city & Cash on Delivery (COD)',
      '🎁 Luxury gift boxes for wedding & corporate gifting',
      '🚚 How do I qualify for Free Pan-India Shipping?',
      '📞 Direct WhatsApp concierge contact details',
    ],
  },
];

const AVAILABLE_MODELS = [
  { id: 'gemini-3.8-flash', label: 'Gemini 3.8 Flash', tag: 'Recommended' },
  { id: 'gemini-3.5-flash', label: 'Gemini 3.5 Flash', tag: 'General Tasks' },
  { id: 'gemini-3.1-flash-lite', label: 'Gemini 3.1 Flash Lite', tag: 'Fast' },
  { id: 'gemini-3.1-pro-preview', label: 'Gemini 3.1 Pro', tag: 'Deep Reasoning' },
];

export const AiChatbot: React.FC = () => {
  const { isAiChatOpen, openAiChat, closeAiChat, products, addToCart, openProductDetail } = useStore();

  const [activeRole, setActiveRole] = useState<ChatRole>('sommelier');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.8-flash');
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasPromptedTeaser, setHasPromptedTeaser] = useState(true);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `### 👑 Namaste & Welcome to ARAJ DRY FRUITS & SPICES
*Agra Artisanal Heritage • Stone-Ground Purity Since 1985*

I am your **Araj Royal AI Spicer & Sommelier**. How may I assist your culinary or wellness journey today?

* **Stone-Ground Spices:** Preserving natural essential oils below 32°C.
* **Premium Dry Fruits:** Hand-sorted California almonds, W240 cashews, and Kashmiri walnuts.
* **Royal Recipes & Pairings:** Secret ratios for Amritsari Chana, Golden Milk, and curries.
* **Luxury Keepsake Hampers:** Velvet & lacquer boxes for weddings and festivals.

*Select a suggestion below or type your culinary question!*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.8-flash',
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (isAiChatOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAiChatOpen, isMinimized, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isAiChatOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 250);
    }
  }, [isAiChatOpen, isMinimized]);

  // Helper to match strictly against given authentic ARAJ catalog products
  const findRelevantProduct = (text: string): Product | null => {
    const lower = text.toLowerCase();
    
    // Exact spice matches from catalog
    if (lower.includes('chana') || lower.includes('chole')) {
      return products.find((p) => p.name.toLowerCase().includes('chana')) || null;
    }
    if (lower.includes('turmeric') || lower.includes('haldi') || lower.includes('curcumin')) {
      return products.find((p) => p.name.toLowerCase().includes('haldi') || p.name.toLowerCase().includes('turmeric')) || null;
    }
    if (lower.includes('black pepper') || lower.includes('kali mirch') || lower.includes('piperine')) {
      return products.find((p) => p.name.toLowerCase().includes('black pepper')) || null;
    }
    if (lower.includes('coriander') || lower.includes('dhaniya')) {
      return products.find((p) => p.name.toLowerCase().includes('dhaniya')) || null;
    }
    if (lower.includes('garam masala') || lower.includes('shahi garam')) {
      return products.find((p) => p.name.toLowerCase().includes('garam')) || null;
    }
    if (lower.includes('chatpata') || lower.includes('chat masala')) {
      return products.find((p) => p.name.toLowerCase().includes('chat masala')) || null;
    }
    if (lower.includes('salad masala')) {
      return products.find((p) => p.name.toLowerCase().includes('salad masala')) || null;
    }
    if (lower.includes('peri peri')) {
      return products.find((p) => p.name.toLowerCase().includes('peri peri')) || null;
    }
    if (lower.includes('kitchen king')) {
      return products.find((p) => p.name.toLowerCase().includes('kitchen king')) || null;
    }
    if (lower.includes('pav bhaji')) {
      return products.find((p) => p.name.toLowerCase().includes('pav bhaji')) || null;
    }
    if (lower.includes('shahi paneer')) {
      return products.find((p) => p.name.toLowerCase().includes('shahi paneer')) || null;
    }
    if (lower.includes('dal makhani')) {
      return products.find((p) => p.name.toLowerCase().includes('dal makhani')) || null;
    }
    if (lower.includes('hing') || lower.includes('asafoetida')) {
      return products.find((p) => p.name.toLowerCase().includes('hing')) || null;
    }
    if (lower.includes('cumin') || lower.includes('jeera')) {
      return products.find((p) => p.name.toLowerCase().includes('jeera')) || null;
    }

    // Exact dry fruit matches from catalog
    if (lower.includes('almond') || lower.includes('badam')) {
      return products.find((p) => p.name.toLowerCase().includes('almond') || p.name.toLowerCase().includes('badam')) || null;
    }
    if (lower.includes('cashew') || lower.includes('kaju')) {
      return products.find((p) => p.name.toLowerCase().includes('cashew') || p.name.toLowerCase().includes('kaju')) || null;
    }
    if (lower.includes('walnut') || lower.includes('akhrot')) {
      return products.find((p) => p.name.toLowerCase().includes('walnut') || p.name.toLowerCase().includes('akhrot')) || null;
    }
    if (lower.includes('pista') || lower.includes('pistachio')) {
      return products.find((p) => p.name.toLowerCase().includes('pista') || p.name.toLowerCase().includes('pistachio')) || null;
    }
    if (lower.includes('munakka') || lower.includes('raisin') || lower.includes('kishmish')) {
      return products.find((p) => p.name.toLowerCase().includes('munakka') || p.name.toLowerCase().includes('kishmish')) || null;
    }
    if (lower.includes('fig') || lower.includes('anjeer')) {
      return products.find((p) => p.name.toLowerCase().includes('anjeer') || p.name.toLowerCase().includes('fig')) || null;
    }
    if (lower.includes('makhana') || lower.includes('foxnut')) {
      return products.find((p) => p.name.toLowerCase().includes('makhana')) || null;
    }

    // Gifting
    if (lower.includes('gift') || lower.includes('hamper') || lower.includes('box') || lower.includes('treat')) {
      return products.find((p) => p.category === 'gifting') || null;
    }

    return null;
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputPrompt).trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt('');
    setIsLoading(true);
    playLuxuryChime('click');

    try {
      // Build conversation payload preserving multi-turn history
      const payloadMessages = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: payloadMessages,
          userPrompt: textToSend,
          model: selectedModel,
          role: activeRole,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      const replyContent =
        data.reply ||
        'Welcome to ARAJ Dry Fruits & Spices. I am delighted to assist with any culinary, spice, or wellness question.';
      const suggested = findRelevantProduct(replyContent + ' ' + textToSend);

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.model || selectedModel,
        suggestedProduct: suggested,
      };

      setMessages((prev) => [...prev, botMessage]);
      playLuxuryChime('success');
    } catch (error) {
      console.error('Chat API error:', error);
      const fallbackMsg: ChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        role: 'assistant',
        content: `### 👑 ARAJ Royal Culinary Advice
Thank you for your question! Our Agra stone mills specialize in stone-ground whole spices and premium California almonds with zero adulteration.

* **Key Recommendation:** Savor our cold-ground spices (milled below 32°C) to experience volatile terpenes preserved fresh in your daily cooking.
* **Direct Concierge:** WhatsApp or call us at **+91 99171 04448** (Mon–Sat 9AM–8PM IST).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
        suggestedProduct: findRelevantProduct(textToSend),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    const roleConfig = ROLES.find((r) => r.id === activeRole) || ROLES[0];
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `### ${roleConfig.icon} Conversation Refreshed: ${roleConfig.label}
*Agra Artisanal Heritage • Stone-Ground Purity Since 1985*

${roleConfig.description}

*What would you like to explore together?*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
      },
    ]);
    playLuxuryChime('click');
  };

  const handleSwitchRole = (newRole: ChatRole) => {
    setActiveRole(newRole);
    const roleConfig = ROLES.find((r) => r.id === newRole) || ROLES[0];
    setMessages((prev) => [
      ...prev,
      {
        id: `role-switch-${Date.now()}`,
        role: 'assistant',
        content: `*Switched role to **${roleConfig.label}***  \n${roleConfig.description}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
      },
    ]);
    playLuxuryChime('click');
  };

  const currentRoleConfig = ROLES.find((r) => r.id === activeRole) || ROLES[0];

  return (
    <>
      {/* Floating Chat Trigger Button in Bottom-Right Corner */}
      <div className="fixed bottom-20 md:bottom-6 right-3 sm:right-6 z-40 flex flex-col items-end">
        {!isAiChatOpen && (
          <div className="flex flex-col items-end gap-2">
            {/* Friendly Greeting Teaser Bubble */}
            <AnimatePresence>
              {hasPromptedTeaser && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.9 }}
                  className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#0D0D14]/95 border border-[#D4AF37]/50 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md text-xs text-[#FAF7EE] max-w-[260px] relative group"
                >
                  <span className="text-sm">👑</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif font-bold text-[#D4AF37] leading-tight text-[11px]">
                      Araj AI Sommelier
                    </p>
                    <p className="text-[10px] text-[#DFDACD]/80 truncate">
                      Ask about recipes, health & spices!
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setHasPromptedTeaser(false);
                    }}
                    className="text-[#88847A] hover:text-[#FAF7EE] p-0.5 rounded transition-colors"
                    title="Dismiss"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {/* Speech bubble beak */}
                  <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-[#0D0D14] border-r border-b border-[#D4AF37]/50 rotate-45" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Floating Trigger Button */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative group"
            >
              {/* Pulsing Ambient Radar Aura */}
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#D4AF37]/50 via-[#F3EFE6]/30 to-[#D4AF37]/50 blur-lg opacity-70 group-hover:opacity-100 transition-opacity animate-pulse" />

              <button
                onClick={openAiChat}
                id="ai-chatbot-launcher-btn"
                title="Open Araj AI Spicer & Chat Box"
                aria-label="Open AI Chat Box"
                className="relative flex items-center gap-2.5 sm:gap-3 p-2.5 sm:px-5 sm:py-3.5 rounded-full bg-[#0E0E14] border-2 border-[#D4AF37] text-[#FAF7EE] shadow-[0_10px_40px_rgba(212,175,55,0.4)] hover:shadow-[0_15px_50px_rgba(212,175,55,0.65)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 cursor-pointer overflow-hidden"
              >
                {/* Gold light sweep sheen */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

                {/* Bot Avatar Icon */}
                <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#FFF3CC] to-[#C59F2D] p-0.5 shadow-md flex items-center justify-center shrink-0">
                  <div className="w-full h-full rounded-full bg-[#12121A] flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#D4AF37]" />
                  </div>
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#48BB78] ring-2 ring-[#0E0E14] animate-ping" />
                </div>

                <div className="hidden sm:flex flex-col text-left pr-1">
                  <span className="font-serif text-xs font-bold text-[#FAF7EE] tracking-wide flex items-center gap-1.5">
                    Chat with Araj AI <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-[#D4AF37] font-mono uppercase tracking-wider">
                    {currentRoleConfig.shortLabel} • Online
                  </span>
                </div>
              </button>
            </motion.div>
          </div>
        )}
      </div>

      {/* Main Interactive Chat Box Window */}
      <AnimatePresence>
        {isAiChatOpen && (
          <motion.div
            key="ai-chatbot-window"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? 'auto' : 'min(640px, calc(100dvh - 2rem))',
            }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-2 sm:bottom-6 right-2 sm:right-6 z-50 w-[calc(100vw-1rem)] sm:w-[480px] max-w-[96vw] rounded-2xl sm:rounded-3xl glass-card-futuristic border border-[#D4AF37]/50 shadow-[0_25px_80px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden bg-[#0A0A0E]/98 backdrop-blur-2xl transition-all duration-300"
            style={{ maxHeight: 'calc(100dvh - 1rem)' }}
          >
            {/* Top Header Bar */}
            <div className="p-3.5 sm:p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#12121B] via-[#181826] to-[#12121B] relative">
              {/* Subtle gold accent top border line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

              <div className="flex items-center gap-2.5">
                <div className="relative w-9 h-9 rounded-full p-0.5 bg-gradient-to-tr from-[#D4AF37] via-[#FFF3CC] to-[#C59F2D] shadow-md flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-[#12121A] flex items-center justify-center">
                    <Crown className="w-4.5 h-4.5 text-[#D4AF37]" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#48BB78] ring-2 ring-[#12121B]" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-sm sm:text-base font-bold text-[#FAF7EE] tracking-wide">
                      Araj AI Chat
                    </h3>

                    {/* Model Dropdown Trigger */}
                    <div className="relative">
                      <button
                        onClick={() => setShowModelMenu((prev) => !prev)}
                        title="Select Gemini Model"
                        className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#D4AF37]/15 hover:bg-[#D4AF37]/30 text-[#F5DE88] border border-[#D4AF37]/30 transition-colors cursor-pointer"
                      >
                        <Cpu className="w-2.5 h-2.5 text-[#D4AF37]" />
                        <span>{selectedModel.replace('gemini-', '')}</span>
                        <ChevronDown className="w-2.5 h-2.5" />
                      </button>

                      {/* Dropdown Menu */}
                      {showModelMenu && (
                        <div className="absolute top-full left-0 mt-1.5 w-52 rounded-xl bg-[#12121A] border border-[#D4AF37]/40 shadow-2xl p-1.5 z-50 text-left">
                          <div className="text-[10px] text-[#A6A295] font-mono px-2 py-1 border-b border-white/5 uppercase">
                            Select Gemini Model
                          </div>
                          {AVAILABLE_MODELS.map((m) => (
                            <button
                              key={m.id}
                              onClick={() => {
                                setSelectedModel(m.id);
                                setShowModelMenu(false);
                                playLuxuryChime('click');
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                                selectedModel === m.id
                                  ? 'bg-[#D4AF37]/25 text-[#FAF7EE] font-bold'
                                  : 'text-[#DFDACD] hover:bg-white/5'
                              }`}
                            >
                              <span>{m.label}</span>
                              <span className="text-[9px] font-mono text-[#D4AF37] opacity-80">
                                {m.tag}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] text-[#D4AF37] font-sans truncate max-w-[200px] sm:max-w-[260px]">
                    {currentRoleConfig.label}
                  </p>
                </div>
              </div>

              {/* Window Controls */}
              <div className="flex items-center gap-1">
                {/* Clear Chat Button */}
                <button
                  onClick={handleClearChat}
                  title="Clear conversation thread"
                  aria-label="Clear chat"
                  className="p-1.5 sm:p-2 rounded-full text-[#A6A295] hover:text-[#FAF7EE] hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Minimize Toggle */}
                <button
                  onClick={() => setIsMinimized((prev) => !prev)}
                  title={isMinimized ? 'Expand' : 'Minimize'}
                  aria-label="Minimize or expand chat"
                  className="p-1.5 sm:p-2 rounded-full text-[#A6A295] hover:text-[#FAF7EE] hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isMinimized ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Close Button */}
                <button
                  onClick={closeAiChat}
                  title="Close chat box"
                  aria-label="Close chat box"
                  className="p-1.5 sm:p-2 rounded-full text-[#A6A295] hover:text-[#FAF7EE] hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body (Hidden if Minimized) */}
            {!isMinimized && (
              <>
                {/* Role Switcher Pills */}
                <div className="px-3 sm:px-4 py-2 bg-[#0C0C12] border-b border-white/5 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
                  <span className="text-[10px] text-[#A6A295] font-mono uppercase tracking-wider pr-1 flex-shrink-0">
                    Role:
                  </span>
                  {ROLES.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => handleSwitchRole(role.id)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0 ${
                        activeRole === role.id
                          ? 'bg-[#D4AF37] text-[#0A0A0E] font-bold shadow-sm'
                          : 'bg-white/5 hover:bg-white/10 text-[#DFDACD] border border-white/5'
                      }`}
                    >
                      <span>{role.icon}</span>
                      <span>{role.shortLabel}</span>
                    </button>
                  ))}
                </div>

                {/* Messages Scroll Area */}
                <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3.5 scrollbar-thin scrollbar-thumb-[#D4AF37]/30">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.role === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`flex items-start gap-2.5 max-w-[94%] ${
                          msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                        }`}
                      >
                        {/* Avatar */}
                        <div
                          className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs shadow-sm ${
                            msg.role === 'user'
                              ? 'bg-[#D4AF37] text-[#0A0A0E] font-bold'
                              : 'bg-[#161622] text-[#D4AF37] border border-[#D4AF37]/30'
                          }`}
                        >
                          {msg.role === 'user' ? (
                            <User className="w-3.5 h-3.5" />
                          ) : (
                            <Bot className="w-3.5 h-3.5" />
                          )}
                        </div>

                        {/* Bubble */}
                        <div
                          className={`p-3 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-gradient-to-r from-[#D4AF37] to-[#C59F2D] text-[#0A0A0E] font-medium shadow-md rounded-tr-none'
                              : 'glass-panel border border-white/10 text-[#DFDACD] bg-[#12121A]/85 shadow-md rounded-tl-none'
                          }`}
                        >
                          {msg.role === 'user' ? (
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          ) : (
                            <div className="prose prose-invert prose-xs sm:prose-sm max-w-none text-[#DFDACD] [&_h3]:font-serif [&_h3]:text-[#FAF7EE] [&_h3]:text-sm [&_h3]:mt-1 [&_h3]:mb-1.5 [&_h3]:font-bold [&_strong]:text-[#FAF7EE] [&_p]:my-1.5 [&_ul]:my-1.5 [&_ul]:pl-4 [&_li]:my-0.5 [&_li]:marker:text-[#D4AF37]">
                              <Markdown>{msg.content}</Markdown>
                            </div>
                          )}

                          <div
                            className={`flex items-center gap-2 text-[9px] mt-1.5 font-mono ${
                              msg.role === 'user'
                                ? 'text-[#0A0A0E]/75 justify-end'
                                : 'text-[#88847A] justify-between'
                            }`}
                          >
                            {msg.role === 'assistant' && msg.modelUsed && (
                              <span className="text-[#D4AF37]/80">
                                {msg.modelUsed.replace('gemini-', '')}
                              </span>
                            )}
                            <span>{msg.timestamp}</span>
                          </div>
                        </div>
                      </div>

                      {/* Suggested Product Card from Authentic Given Catalog */}
                      {msg.suggestedProduct && (
                        <div className="mt-2.5 ml-9 max-w-[90%] rounded-xl p-2.5 sm:p-3 glass-card-futuristic border border-[#D4AF37]/45 flex items-center gap-3 shadow-lg bg-[#0E0E16]/90">
                          <img
                            src={msg.suggestedProduct.image}
                            alt={msg.suggestedProduct.name}
                            className="w-12 h-12 object-contain rounded-lg bg-black/40 p-1 flex-shrink-0"
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (!target.src.includes('arajpure.com')) {
                                target.src = `https://www.arajpure.com${msg.suggestedProduct?.image.replace(
                                  '/images',
                                  ''
                                )}`;
                              }
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] font-mono text-[#D4AF37] uppercase tracking-wider block">
                              Catalog Match
                            </span>
                            <h4 className="font-serif text-xs font-bold text-[#FAF7EE] truncate">
                              {msg.suggestedProduct.name}
                            </h4>
                            <div className="flex items-center gap-2 text-[11px] font-mono text-[#D4AF37]">
                              <span className="font-bold">₹{msg.suggestedProduct.price}</span>
                              <span className="line-through text-[#88847A] text-[10px]">
                                ₹{msg.suggestedProduct.originalPrice}
                              </span>
                              <span className="text-[9px] text-[#48BB78]">
                                {msg.suggestedProduct.weight}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              onClick={() => {
                                if (msg.suggestedProduct) {
                                  openProductDetail(msg.suggestedProduct);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#FAF7EE] text-[10px] cursor-pointer"
                              title="View Details"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (msg.suggestedProduct) {
                                  addToCart(msg.suggestedProduct, 1);
                                  playLuxuryChime('success');
                                }
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#C59F2D] text-[#0A0A0E] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer hover:brightness-110 shadow-sm"
                              title="Add to Cart"
                            >
                              <ShoppingBag className="w-3 h-3" />
                              <span>Add</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Loading Typing Indicator */}
                  {isLoading && (
                    <div className="flex items-center gap-2 text-xs text-[#D4AF37] italic ml-1">
                      <div className="w-6 h-6 rounded-full bg-[#181824] border border-[#D4AF37]/30 flex items-center justify-center">
                        <Bot className="w-3.5 h-3.5 text-[#D4AF37] animate-spin" />
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10">
                        <span className="text-[11px] font-mono text-[#DFDACD]">
                          Consulting Araj Spice Archives with {selectedModel.replace('gemini-', '')}...
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce" />
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts Carousel for Current Role */}
                <div className="px-3 sm:px-4 py-2 border-t border-white/5 bg-[#08080C] overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-2">
                  <span className="text-[10px] text-[#A6A295] font-mono uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
                    <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Ideas:
                  </span>
                  {currentRoleConfig.quickPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(prompt)}
                      disabled={isLoading}
                      className="px-3 py-1 rounded-full bg-white/[0.04] hover:bg-[#D4AF37]/20 border border-white/10 hover:border-[#D4AF37]/40 text-[#DFDACD] hover:text-[#FAF7EE] text-xs transition-all cursor-pointer flex-shrink-0 disabled:opacity-50"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>

                {/* Input Controls */}
                <div className="p-3 sm:p-4 border-t border-white/10 bg-[#0E0E14] relative">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputPrompt}
                      onChange={(e) => setInputPrompt(e.target.value)}
                      placeholder={currentRoleConfig.placeholder}
                      disabled={isLoading}
                      className="flex-1 bg-white/[0.05] border border-white/15 focus:border-[#D4AF37] rounded-full px-4 py-2.5 text-xs sm:text-sm text-[#FAF7EE] placeholder-[#88847A] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/50 transition-all"
                    />

                    <button
                      type="submit"
                      disabled={!inputPrompt.trim() || isLoading}
                      aria-label="Send message"
                      className="w-10 h-10 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C59F2D] text-[#0A0A0E] flex items-center justify-center hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition-all cursor-pointer flex-shrink-0"
                    >
                      <Send className="w-4 h-4 text-[#0A0A0E]" />
                    </button>
                  </form>

                  <div className="flex items-center justify-between text-[9px] text-[#77746B] mt-2 px-1 font-mono">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#D4AF37]" /> ARAJ Pure Heritage • Agra
                    </span>
                    <span className="flex items-center gap-1">
                      <Cpu className="w-2.5 h-2.5 text-[#D4AF37]" /> {selectedModel}
                    </span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
