import { ChatMessage } from '../types/chat';

const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env;

export const DEFAULT_N8N_CHAT_URL = 
  metaEnv?.VITE_N8N_CHAT_URL || 
  'https://trangtran.app.n8n.cloud/webhook/6e97e807-3c58-4ac7-8f6a-e264341d777d/chat';

export const STORAGE_KEYS = {
  SESSION_ID: 'hugz_ai_chat_session_id',
  CHAT_HISTORY: 'hugz_ai_chat_history_v1',
  CUSTOM_N8N_URL: 'hugz_ai_custom_n8n_url',
} as const;

export const CHAT_TIMEOUT_MS = 30000;

export const INITIAL_SUGGESTIONS = [
  'Gợi ý túi du lịch đựng mỹ phẩm',
  'Chăn Sữa HUGZ có những kích thước nào?',
  'Chính sách đổi trả & bảo hành 7 ngày',
  'Cách mua trên Shopee Mall giảm 20%',
  'Gặp nhân viên hỗ trợ',
];

export const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome_msg_0',
  sender: 'bot',
  text: 'Chào bạn! Mình là **HUGZ Assistant** 🌿 Trợ lý AI chăm sóc khách hàng của The Hugz Life.\n\nMình có thể hỗ trợ bạn tìm kiếm giải pháp sắp xếp đồ đạc, tư vấn kích thước chăn sữa, hướng dẫn đặt hàng hoặc giải đáp chính sách bảo hành. Bạn đang cần tìm sản phẩm cho nhu cầu nào?',
  timestamp: new Date().toISOString(),
  suggestions: INITIAL_SUGGESTIONS,
};

/**
 * Lấy URL n8n Chat Webhook (ưu tiên localStorage nếu có cấu hình trực tiếp từ giao diện, sau đó đến .env)
 */
export function getN8nChatUrl(): string {
  if (typeof window === 'undefined') return DEFAULT_N8N_CHAT_URL;
  try {
    const customUrl = localStorage.getItem(STORAGE_KEYS.CUSTOM_N8N_URL);
    if (customUrl && customUrl.trim()) {
      return customUrl.trim();
    }
  } catch {}
  return DEFAULT_N8N_CHAT_URL;
}

/**
 * Cập nhật URL n8n vào localStorage (tiện lợi cho việc test nhanh mà không cần build lại code)
 */
export function setN8nChatUrl(url: string): void {
  if (typeof window === 'undefined') return;
  try {
    if (!url || !url.trim()) {
      localStorage.removeItem(STORAGE_KEYS.CUSTOM_N8N_URL);
    } else {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_N8N_URL, url.trim());
    }
  } catch {}
}

/**
 * Lấy hoặc khởi tạo Session ID riêng biệt cho mỗi khách hàng (được lưu trong sessionStorage)
 */
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'server_session';
  try {
    let sessionId = sessionStorage.getItem(STORAGE_KEYS.SESSION_ID);
    if (!sessionId) {
      sessionId = `hugz_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
    }
    return sessionId;
  } catch {
    return `hugz_${Date.now()}`;
  }
}

/**
 * Khởi tạo phiên chat mới (reset bộ nhớ)
 */
export function resetChatSession(): string {
  if (typeof window === 'undefined') return 'new_session';
  try {
    sessionStorage.removeItem(STORAGE_KEYS.SESSION_ID);
    sessionStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
    return getOrCreateSessionId();
  } catch {
    return `hugz_${Date.now()}`;
  }
}
