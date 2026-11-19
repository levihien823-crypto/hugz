import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles, 
  RefreshCw, 
  Settings, 
  ExternalLink, 
  Bot, 
  User, 
  Check, 
  AlertCircle,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { ChatMessage } from '../../types/chat';
import { Product } from '../../types';
import { getStoredProducts } from '../../utils/productStorage';
import { 
  INITIAL_WELCOME_MESSAGE, 
  INITIAL_SUGGESTIONS, 
  STORAGE_KEYS, 
  getN8nChatUrl, 
  setN8nChatUrl, 
  getOrCreateSessionId, 
  resetChatSession 
} from '../../config/chatConfig';
import { sendChatMessageToN8n } from '../../services/n8nChatService';

interface HugzAIChatProps {
  onOpenProductDetail?: (product: Product) => void;
}

export const HugzAIChat: React.FC<HugzAIChatProps> = ({ onOpenProductDetail }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsUrl, setSettingsUrl] = useState('');
  const [sessionId, setSessionId] = useState(() => getOrCreateSessionId());
  const [allProducts, setAllProducts] = useState<Product[]>(() => getStoredProducts());

  // Lắng nghe cập nhật sản phẩm nếu admin chỉnh sửa
  useEffect(() => {
    const syncProducts = () => setAllProducts(getStoredProducts());
    window.addEventListener('hugz-products-updated', syncProducts);
    return () => window.removeEventListener('hugz-products-updated', syncProducts);
  }, []);

  // Lịch sử tin nhắn (khởi tạo từ sessionStorage nếu có)
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return [INITIAL_WELCOME_MESSAGE];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Lưu lịch sử chat vào sessionStorage mỗi khi có tin nhắn mới
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Tự động cuộn xuống tin nhắn mới nhất
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom('instant');
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom('smooth');
    }
  }, [messages, isTyping]);

  // Mở/Đóng cài đặt Webhook
  const handleOpenSettings = () => {
    setSettingsUrl(getN8nChatUrl());
    setShowSettings(!showSettings);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setN8nChatUrl(settingsUrl.trim());
    setShowSettings(false);
  };

  // Làm mới phiên chat
  const handleResetSession = () => {
    if (window.confirm('Bạn có muốn xóa lịch sử trò chuyện và bắt đầu cuộc trò chuyện mới không?')) {
      const newSid = resetChatSession();
      setSessionId(newSid);
      setMessages([
        {
          ...INITIAL_WELCOME_MESSAGE,
          id: `welcome_${Date.now()}`,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };

  // Gửi tin nhắn
  const handleSendMessage = async (textToSend?: string) => {
    const message = (textToSend || inputMessage).trim();
    if (!message || isTyping) return;

    const userMsgId = `user_${Date.now()}`;
    const newUserMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: message,
      timestamp: new Date().toISOString(),
      status: 'sent',
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const res = await sendChatMessageToN8n(message, sessionId);

      const botMsgId = `bot_${Date.now()}`;
      const newBotMsg: ChatMessage = {
        id: botMsgId,
        sender: 'bot',
        text: res.replyText,
        timestamp: new Date().toISOString(),
        status: res.success ? 'sent' : 'error',
      };

      setMessages((prev) => [...prev, newBotMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: `bot_err_${Date.now()}`,
        sender: 'bot',
        text: 'Có lỗi xảy ra khi truyền tin nhắn đến máy chủ AI. Bạn vui lòng thử lại hoặc liên hệ với HUGZ qua Fanpage Facebook nhé!',
        timestamp: new Date().toISOString(),
        status: 'error',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Tránh gửi nhầm khi đang gõ tiếng Việt Telex/VNI
    if (e.nativeEvent.isComposing) return;
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Định dạng thời gian gửi tin nhắn
  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  // Phát hiện sản phẩm HUGZ được đề cập trong câu trả lời của AI
  const detectProductsInMessage = (text: string): Product[] => {
    if (!text) return [];
    const lowerText = text.toLowerCase();
    const found: Product[] = [];

    for (const p of allProducts) {
      const lowerId = p.id.toLowerCase();
      const lowerTitle = p.title.toLowerCase();
      const shortTitle = lowerTitle.split(',')[0].trim();

      // Kiểm tra nếu text chứa ID hoặc toàn bộ tên hoặc cụm tên chính
      if (
        lowerText.includes(lowerId) ||
        lowerText.includes(lowerTitle) ||
        (shortTitle.length > 10 && lowerText.includes(shortTitle))
      ) {
        if (!found.some((item) => item.id === p.id)) {
          found.push(p);
        }
      }
      if (found.length >= 3) break; // Tối đa hiển thị 3 sản phẩm để gọn gàng
    }
    return found;
  };

  // Render text có hỗ trợ markdown đơn giản (ảnh ![alt](url), bold **text**, link [text](url))
  const renderMessageContent = (content: string) => {
    const parts = content.split('\n');
    return (
      <div className="space-y-1.5 leading-relaxed text-[13px] break-words">
        {parts.map((p, idx) => {
          if (!p.trim()) return <div key={idx} className="h-1.5" />;

          // 1. Kiểm tra markdown hình ảnh ![alt](url)
          const imgMatch = p.match(/!\[(.*?)\]\((.*?)\)/);
          if (imgMatch) {
            return (
              <div key={idx} className="my-2">
                <img
                  src={imgMatch[2]}
                  alt={imgMatch[1] || 'Sản phẩm HUGZ'}
                  className="rounded-2xl max-h-48 w-full object-cover border border-[#cac7ae]/40 shadow-xs"
                  loading="lazy"
                />
                {imgMatch[1] && (
                  <span className="text-[11px] text-[#797862] italic block text-center mt-1">
                    {imgMatch[1]}
                  </span>
                )}
              </div>
            );
          }

          // 2. Format in đậm **text** và link [text](url)
          let formatted = p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          formatted = formatted.replace(
            /\[(.*?)\]\((https?:\/\/.*?)\)/g,
            '<a href="$2" target="_blank" rel="noopener noreferrer" class="font-bold underline text-[#626200] hover:text-[#201b12]">$1</a>'
          );

          return (
            <p
              key={idx}
              dangerouslySetInnerHTML={{ __html: formatted }}
              className="[&:has(strong)]:text-[#201b12]"
            />
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. NÚT KÍCH HOẠT CHAT NỔI (FLOATING LAUNCHER BUTTON) */}
      {/* ========================================================================= */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-2">
        
        {/* Nút mạng xã hội phụ khi chưa mở chat */}
        {!isOpen && (
          <div className="flex items-center gap-2 mb-0.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <a
              href="https://www.facebook.com/thehugzlife"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#1877F2] text-white shadow-md hover:shadow-lg hover:scale-105 transition-all text-[11px] font-bold group"
              title="Nhắn tin trực tiếp qua Facebook The Hugz Life"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="hidden sm:inline">Facebook</span>
            </a>
            <a
              href="https://www.tiktok.com/@thehugzlife"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#111111] text-white shadow-md hover:shadow-lg hover:scale-105 transition-all text-[11px] font-bold group"
              title="Kênh TikTok @thehugzlife"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
              <span className="hidden sm:inline">TikTok</span>
            </a>
          </div>
        )}

        {/* Bong bóng gợi ý nổi nếu chưa mở chat */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1 }}
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white text-[#201b12] text-xs font-bold shadow-lg border border-[#cac7ae]/50 hover:bg-[#f8ecdd] cursor-pointer transition-transform hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#626200]" />
            <span>Chat với HUGZ Assistant AI</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </motion.div>
        )}

        {/* Nút tròn chính */}
        <button
          id="hugz-ai-chat-launcher-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Đóng cửa sổ chat' : 'Mở HUGZ Assistant AI Chat'}
          className={`w-13 h-13 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer shadow-xl border-2 relative group ${
            isOpen 
              ? 'bg-[#201b12] text-white border-white/20' 
              : 'bg-[#201b12] hover:bg-black text-[#f4f34d] border-[#f4f34d]/60'
          }`}
          title={isOpen ? 'Đóng trợ lý' : 'HUGZ Assistant - Trợ lý AI HUGZ'}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <span className="absolute inset-0 rounded-full border-2 border-[#f4f34d]/50 animate-ping opacity-30 pointer-events-none" />
              <MessageCircle className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
            </>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2. CỬA SỔ HỘI THOẠI CHAT (CHAT WINDOW POPUP) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="hugz-ai-chat-window"
            initial={{ opacity: 0, y: 30, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-[88px] sm:bottom-[80px] right-3 sm:right-6 z-50 w-[calc(100vw-24px)] sm:w-[410px] h-[540px] max-h-[calc(100vh-110px)] bg-[#fff8f2] rounded-3xl shadow-2xl border border-[#cac7ae]/50 flex flex-col overflow-hidden text-[#201b12]"
          >
            {/* Header Cửa sổ Chat */}
            <div className="px-4 py-3 bg-[#f8ecdd] border-b border-[#cac7ae]/40 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#201b12] text-[#f4f34d] flex items-center justify-center font-bold shadow-xs">
                  <Sparkles className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-display text-sm font-bold text-[#201b12] leading-none">
                      HUGZ Assistant
                    </h3>
                    <span className="px-1.5 py-0.2 rounded-full bg-[#f4f34d] text-[#201b12] text-[9px] font-extrabold tracking-wider">
                      AI 24/7
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[11px] text-[#626200] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Trực tuyến • Hỗ trợ The Hugz Life</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons trên Header */}
              <div className="flex items-center gap-1 text-[#484834]">
                <button
                  onClick={handleOpenSettings}
                  className="p-1.5 rounded-lg hover:bg-white/80 transition-colors cursor-pointer"
                  title="Cấu hình n8n Webhook"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={handleResetSession}
                  className="p-1.5 rounded-lg hover:bg-white/80 transition-colors cursor-pointer"
                  title="Làm mới cuộc hội thoại"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/80 transition-colors cursor-pointer"
                  title="Đóng cửa sổ"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bảng cấu hình Webhook n8n nhanh (Settings Drawer) */}
            {showSettings && (
              <div className="p-3 bg-[#f1ddba]/70 border-b border-[#cac7ae]/50 text-xs animate-in slide-in-from-top-2 duration-150">
                <form onSubmit={handleSaveSettings} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#201b12] flex items-center gap-1">
                      <Settings className="w-3.5 h-3.5" />
                      <span>Cấu hình n8n Production Webhook URL</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowSettings(false)}
                      className="text-[#797862] hover:text-[#201b12]"
                    >
                      ✕
                    </button>
                  </div>
                  <input
                    type="url"
                    value={settingsUrl}
                    onChange={(e) => setSettingsUrl(e.target.value)}
                    placeholder="https://your-n8n.com/webhook/..."
                    className="w-full h-8 px-2.5 rounded-lg bg-white border border-[#cac7ae]/60 text-xs text-[#201b12] focus:outline-none focus:border-[#201b12]"
                  />
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="text-[10px] text-[#797862]">
                      Lưu trong trình duyệt cho localhost/test
                    </span>
                    <button
                      type="submit"
                      className="px-3 py-1 rounded-lg bg-[#201b12] hover:bg-black text-white text-[11px] font-bold cursor-pointer"
                    >
                      Lưu cấu hình
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Banner liên hệ người thật nếu khách cần */}
            <div className="px-3.5 py-1.5 bg-[#f8ecdd]/50 border-b border-[#cac7ae]/30 flex items-center justify-between text-[11px] text-[#5c5443]">
              <span className="truncate">Cần hỗ trợ trực tiếp từ nhân viên?</span>
              <a
                href="https://www.facebook.com/thehugzlife"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#1877F2] hover:underline flex items-center gap-1 shrink-0 ml-2"
              >
                <span>Fanpage Facebook</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Vùng Lịch Sử Tin Nhắn */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-[#fff8f2] to-[#faf3ea]">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`flex items-start gap-2 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Avatar */}
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold ${
                          isUser
                            ? 'bg-[#201b12] text-white'
                            : 'bg-[#f4f34d] text-[#201b12] shadow-2xs'
                        }`}
                      >
                        {isUser ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3 h-3" />}
                      </div>

                      {/* Khung tin nhắn */}
                      <div
                        className={`p-3 rounded-2xl shadow-xs transition-all ${
                          isUser
                            ? 'bg-[#201b12] text-white rounded-tr-xs'
                            : msg.status === 'error'
                            ? 'bg-rose-50 border border-rose-200 text-rose-900 rounded-tl-xs'
                            : 'bg-white border border-[#cac7ae]/40 text-[#201b12] rounded-tl-xs'
                        }`}
                      >
                        {renderMessageContent(msg.text)}
                      </div>
                    </div>

                    {/* Thẻ sản phẩm tự động xuất hiện khi AI nhắc đến tên sản phẩm */}
                    {!isUser && (() => {
                      const matched = detectProductsInMessage(msg.text);
                      if (matched.length === 0) return null;
                      return (
                        <div className="mt-2.5 pl-8 flex flex-col gap-2 w-full max-w-[95%]">
                          {matched.map((p) => (
                            <div
                              key={p.id}
                              className="flex items-center gap-3 p-2 rounded-2xl bg-white border border-[#cac7ae]/50 shadow-xs hover:border-[#626200] transition-all group"
                            >
                              <div className="w-13 h-13 rounded-xl overflow-hidden bg-[#faf6ef] border border-[#cac7ae]/30 shrink-0 p-1 flex items-center justify-center">
                                <img
                                  src={p.image}
                                  alt={p.title}
                                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-[11px] font-bold text-[#201b12] line-clamp-1 group-hover:text-[#626200] transition-colors leading-snug">
                                  {p.title}
                                </h4>
                                <div className="flex items-baseline gap-2 mt-0.5">
                                  <span className="text-xs font-black text-[#b62506]">
                                    {new Intl.NumberFormat('vi-VN').format(p.price)}₫
                                  </span>
                                  {p.originalPrice > p.price && (
                                    <span className="text-[10px] text-stone-400 line-through">
                                      {new Intl.NumberFormat('vi-VN').format(p.originalPrice)}₫
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <button
                                    onClick={() => onOpenProductDetail && onOpenProductDetail(p)}
                                    className="px-2 py-0.5 rounded-lg bg-[#201b12] hover:bg-black text-white text-[10px] font-bold transition-all cursor-pointer shadow-2xs"
                                  >
                                    Xem chi tiết →
                                  </button>
                                  {p.shopeeUrl && (
                                    <a
                                      href={p.shopeeUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-2 py-0.5 rounded-lg bg-[#EE4D2D] text-white text-[9px] font-bold hover:opacity-90"
                                    >
                                      Shopee
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}

                    {/* Timestamp */}
                    <span className="text-[10px] text-[#797862] px-8 mt-1">
                      {formatTime(msg.timestamp)}
                    </span>

                    {/* Gợi ý câu hỏi nhanh (nếu có từ bot) */}
                    {!isUser && msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2 pl-8">
                        {msg.suggestions.map((sug, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => handleSendMessage(sug)}
                            className="px-2.5 py-1 rounded-full bg-white hover:bg-[#f4f34d] hover:text-[#201b12] border border-[#cac7ae]/50 text-[11px] font-medium text-[#484834] transition-all cursor-pointer shadow-2xs text-left"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Trạng thái AI đang gõ / trả lời */}
              {isTyping && (
                <div className="flex items-start gap-2 max-w-[85%]">
                  <div className="w-6 h-6 rounded-full bg-[#f4f34d] text-[#201b12] flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3" />
                  </div>
                  <div className="p-3 rounded-2xl rounded-tl-xs bg-white border border-[#cac7ae]/40 shadow-xs flex items-center gap-2">
                    <span className="text-xs text-[#626200] font-medium">HUGZ đang trả lời</span>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#626200] animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#626200] animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#626200] animate-bounce"></span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Ô nhập tin nhắn & Nút gửi */}
            <div className="p-3 bg-[#f8ecdd] border-t border-[#cac7ae]/40">
              <div className="flex items-center gap-2 bg-white rounded-2xl px-3 py-1.5 border border-[#cac7ae]/50 focus-within:border-[#201b12] transition-colors shadow-xs">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Hỏi về sản phẩm, kích thước, đặt hàng..."
                  disabled={isTyping}
                  className="flex-1 bg-transparent text-xs sm:text-sm text-[#201b12] placeholder:text-[#797862] focus:outline-none py-1"
                />
                <button
                  id="hugz-ai-chat-send-btn"
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isTyping}
                  aria-label="Gửi tin nhắn"
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    inputMessage.trim() && !isTyping
                      ? 'bg-[#201b12] hover:bg-black text-[#f4f34d] shadow-xs'
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Sub-footer thông tin */}
              <div className="flex items-center justify-between text-[10px] text-[#797862] mt-2 px-1">
                <span>Được hỗ trợ bởi n8n AI Agent</span>
                <span>The Hugz Life © 2026</span>
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
