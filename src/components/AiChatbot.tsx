import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Trash2,
  RefreshCw,
  Crown,
  ChevronDown,
  ShoppingBag,
  ExternalLink,
  MessageSquare,
  Flame,
  CheckCircle2,
  Leaf
} from 'lucide-react';
import Markdown from 'react-markdown';
import { useStore } from '../context/StoreContext';
import { playLuxuryChime } from '../utils/sound';
import { Product } from '../types';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedProduct?: Product | null;
}

const QUICK_PROMPTS = [
  '🏛️ Tell me about Araj brand & Agra heritage since 1985',
  '🌿 Why are Araj spices stone ground below 32°C?',
  '🌰 Best dry fruits for brain health & memory?',
  '🥘 Secret recipe for authentic Amritsari Chana Masala',
  '🎁 What luxury gift hampers do you recommend?',
  '📦 Delivery times, Cash on Delivery & Free Shipping',
];

export const AiChatbot: React.FC = () => {
  const { isAiChatOpen, openAiChat, closeAiChat, products, addToCart, openProductDetail } = useStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `### 👑 Namaste & Welcome to ARAJ DRY FRUITS & SPICES
*Pure Quality from Agra • Trusted Since 1985*

I am your **Araj Culinary & Spice Assistant**. I'm here to help you with:
* **Pure Spices & Masalas:** Learn how our traditional stone grinding preserves natural aroma and real flavor.
* **Premium Dry Fruits & Nuts:** Health benefits, crunchy almonds, cashews, walnuts, and daily nutrition tips.
* **Authentic Indian Recipes:** Tips for making flavorful Chana Masala, rich curries, and festival dishes.
* **Gift Hampers & Celebrations:** Custom gift boxes for weddings, corporate gifting, and festivals.
* **Agra Heritage:** Four decades of uncompromised purity and family tradition.

*What would you like to explore or find today?*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
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
      }, 300);
    }
  }, [isAiChatOpen, isMinimized]);

  // Helper to find a relevant product to recommend
  const findRelevantProduct = (text: string): Product | null => {
    const lower = text.toLowerCase();
    if (lower.includes('chana') || lower.includes('chole')) {
      return products.find((p) => p.name.toLowerCase().includes('chana')) || null;
    }
    if (lower.includes('turmeric') || lower.includes('haldi') || lower.includes('curcumin')) {
      return products.find((p) => p.name.toLowerCase().includes('turmeric') || p.name.toLowerCase().includes('haldi')) || null;
    }
    if (lower.includes('almond') || lower.includes('badam')) {
      return products.find((p) => p.name.toLowerCase().includes('almond') || p.name.toLowerCase().includes('badam')) || null;
    }
    if (lower.includes('cashew') || lower.includes('kaju')) {
      return products.find((p) => p.name.toLowerCase().includes('cashew') || p.name.toLowerCase().includes('kaju')) || null;
    }
    if (lower.includes('walnut') || lower.includes('akhrot')) {
      return products.find((p) => p.name.toLowerCase().includes('walnut')) || null;
    }
    if (lower.includes('gift') || lower.includes('hamper') || lower.includes('box')) {
      return products.find((p) => p.category === 'gifting') || null;
    }
    if (lower.includes('garam masala')) {
      return products.find((p) => p.name.toLowerCase().includes('garam')) || null;
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
      // Build conversation payload for backend
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
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const replyContent = data.reply || "I am here to assist with any questions regarding ARAJ dry fruits and spices.";
      const suggested = findRelevantProduct(replyContent + ' ' + textToSend);

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedProduct: suggested,
      };

      setMessages((prev) => [...prev, botMessage]);
      playLuxuryChime('success');
    } catch (error) {
      console.error('Chat error:', error);
      // Friendly luxury offline fallback message
      const fallbackMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        role: 'assistant',
        content: `### 👑 ARAJ Royal Assistance
Thank you for your inquiry regarding our royal collection! 

Our stone mills in historic Agra are dedicated to zero-adulteration purity across all our whole spices, stone-ground masalas, and hand-selected California almonds.

For personal culinary guidance or custom corporate hampers, you may also reach our Royal Concierge directly:
📞 **Helpline / WhatsApp:** +91 99171 04448  
📍 **Rawatpara Mill & Naraich:** Agra-282006 (U.P.), India`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `Conversation refreshed. How may I assist you today with our pure dry fruits, stone-ground spices, or luxury gift boxes?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    playLuxuryChime('click');
  };

  return (
    <>
      {/* Floating Trigger Button in Bottom-Right Corner */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        {!isAiChatOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative group"
          >
            {/* Pulsing Ambient Radar Aura */}
            <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-[#D4AF37]/50 via-[#F3EFE6]/30 to-[#D4AF37]/50 blur-md opacity-70 group-hover:opacity-100 transition-opacity animate-pulse" />

            <button
              onClick={openAiChat}
              id="ai-chatbot-launcher-btn"
              title="Ask Araj Royal AI Spicer & Sommelier"
              aria-label="Open AI Assistant"
              className="relative flex items-center gap-3 px-4 sm:px-5 py-3.5 rounded-full bg-[#0E0E14] border-2 border-[#D4AF37] text-[#FAF7EE] shadow-[0_10px_35px_rgba(212,175,55,0.35)] hover:shadow-[0_15px_45px_rgba(212,175,55,0.55)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 cursor-pointer overflow-hidden"
            >
              {/* Gold light sweep sheen */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

              {/* Bot Avatar Icon */}
              <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#FFF3CC] to-[#C59F2D] p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#12121A] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#48BB78] ring-2 ring-[#0E0E14] animate-ping" />
              </div>

              <div className="flex flex-col text-left">
                <span className="font-serif text-xs font-bold text-[#FAF7EE] tracking-wide flex items-center gap-1.5">
                  Araj Royal AI <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                </span>
                <span className="text-[10px] text-[#D4AF37] font-mono uppercase tracking-wider">
                  Spicer & Sommelier
                </span>
              </div>
            </button>
          </motion.div>
        )}
      </div>

      {/* Main Interactive Chat Window */}
      <AnimatePresence>
        {isAiChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? 'auto' : '620px',
            }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={`fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[460px] max-w-[95vw] rounded-3xl glass-card-futuristic border border-[#D4AF37]/45 shadow-[0_25px_70px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden bg-[#0A0A0E]/95 backdrop-blur-2xl transition-all duration-300`}
            style={{ maxHeight: 'calc(100vh - 2rem)' }}
          >
            {/* Top Header Bar */}
            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#12121B] via-[#161624] to-[#12121B] relative">
              {/* Subtle gold top border line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-[#D4AF37] via-[#FFF3CC] to-[#C59F2D] shadow-md flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-[#12121A] flex items-center justify-center">
                    <Crown className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#48BB78] ring-2 ring-[#12121B]" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-sm sm:text-base font-bold text-[#FAF7EE] tracking-wide">
                      Araj Royal AI Spicer
                    </h3>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-[#D4AF37]/20 text-[#F5DE88] border border-[#D4AF37]/30 uppercase">
                      Gemini 3.8
                    </span>
                  </div>
                  <p className="font-editorial italic text-xs text-[#D4AF37]">
                    "Four Decades of Agra Terroir & Culinary Arts"
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {/* Clear Chat Button */}
                <button
                  onClick={handleClearChat}
                  title="Clear conversation"
                  aria-label="Clear chat"
                  className="p-2 rounded-full text-[#A6A295] hover:text-[#FAF7EE] hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Minimize Toggle */}
                <button
                  onClick={() => setIsMinimized((prev) => !prev)}
                  title={isMinimized ? 'Expand' : 'Minimize'}
                  aria-label="Minimize or expand chat"
                  className="p-2 rounded-full text-[#A6A295] hover:text-[#FAF7EE] hover:bg-white/5 transition-colors cursor-pointer"
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
                  title="Close chat"
                  aria-label="Close chat"
                  className="p-2 rounded-full text-[#A6A295] hover:text-[#FAF7EE] hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Body (Hidden if Minimized) */}
            {!isMinimized && (
              <>
                {/* Messages Scroll Area */}
                <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-[#D4AF37]/30">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.role === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`flex items-start gap-2.5 max-w-[92%] ${
                          msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                        }`}
                      >
                        {/* Avatar */}
                        <div
                          className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs ${
                            msg.role === 'user'
                              ? 'bg-[#D4AF37] text-[#0A0A0E] font-bold'
                              : 'bg-[#181824] text-[#D4AF37] border border-[#D4AF37]/30'
                          }`}
                        >
                          {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                        </div>

                        {/* Bubble */}
                        <div
                          className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-gradient-to-r from-[#D4AF37] to-[#C59F2D] text-[#0A0A0E] font-medium shadow-md'
                              : 'glass-panel border border-white/10 text-[#DFDACD] bg-[#12121A]/80 shadow-md'
                          }`}
                        >
                          {msg.role === 'user' ? (
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          ) : (
                            <div className="prose prose-invert prose-xs sm:prose-sm max-w-none text-[#DFDACD] [&_h3]:font-serif [&_h3]:text-[#FAF7EE] [&_h3]:text-sm [&_h3]:mt-1 [&_h3]:mb-1.5 [&_h3]:font-bold [&_strong]:text-[#FAF7EE] [&_p]:my-1.5 [&_ul]:my-1.5 [&_ul]:pl-4 [&_li]:my-0.5 [&_li]:marker:text-[#D4AF37]">
                              <Markdown>{msg.content}</Markdown>
                            </div>
                          )}

                          <span
                            className={`text-[9px] mt-1.5 block font-mono ${
                              msg.role === 'user' ? 'text-[#0A0A0E]/70 text-right' : 'text-[#88847A]'
                            }`}
                          >
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>

                      {/* Interactive Product Recommendation Card if detected */}
                      {msg.suggestedProduct && (
                        <div className="mt-2.5 ml-9 max-w-[85%] rounded-2xl p-3 glass-card-futuristic border border-[#D4AF37]/40 flex items-center gap-3 shadow-lg">
                          <img
                            src={msg.suggestedProduct.image}
                            alt={msg.suggestedProduct.name}
                            className="w-12 h-12 object-contain rounded-lg bg-black/40 p-1 flex-shrink-0"
                            onError={(e) => {
                              const target = e.currentTarget;
                              if (!target.src.includes('arajpure.com')) {
                                target.src = `https://www.arajpure.com${msg.suggestedProduct?.image.replace('/images', '')}`;
                              }
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-serif text-xs font-bold text-[#FAF7EE] truncate">
                              {msg.suggestedProduct.name}
                            </h4>
                            <div className="flex items-center gap-2 text-[11px] font-mono text-[#D4AF37]">
                              <span>₹{msg.suggestedProduct.price}</span>
                              <span className="line-through text-[#88847A] text-[10px]">
                                ₹{msg.suggestedProduct.originalPrice}
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
                              className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#C59F2D] text-[#0A0A0E] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
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
                    <div className="flex items-center gap-2 text-xs text-[#D4AF37] italic">
                      <div className="w-6 h-6 rounded-full bg-[#181824] border border-[#D4AF37]/30 flex items-center justify-center">
                        <Bot className="w-3.5 h-3.5 text-[#D4AF37] animate-spin" />
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10">
                        <span className="text-[11px] font-mono text-[#DFDACD]">Consulting Araj Spice Archives</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce" />
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts Carousel */}
                <div className="px-4 py-2 border-t border-white/5 bg-[#08080C] overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-2">
                  <span className="text-[10px] text-[#A6A295] font-mono uppercase tracking-wider flex items-center gap-1 flex-shrink-0">
                    <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Suggestions:
                  </span>
                  {QUICK_PROMPTS.map((prompt, idx) => (
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
                <div className="p-3.5 sm:p-4 border-t border-white/10 bg-[#0E0E14] relative">
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
                      placeholder="Ask about spices, dry fruits, recipes, heritage..."
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
                  <div className="flex items-center justify-between text-[9px] text-[#66635B] mt-2 px-1 font-mono">
                    <span>ARAJ Pure • Agra Heritage since 1985</span>
                    <span>Powered by Gemini 3.8 AI</span>
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
