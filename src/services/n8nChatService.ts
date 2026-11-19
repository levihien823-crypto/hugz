import { getN8nChatUrl, CHAT_TIMEOUT_MS } from '../config/chatConfig';
import { N8nChatPayload, N8nChatResponse } from '../types/chat';

export interface SendMessageResult {
  success: boolean;
  replyText: string;
  error?: string;
}

/**
 * Trích xuất chuỗi phản hồi từ các định dạng trả về khác nhau của n8n
 */
function extractN8nReply(data: unknown): string {
  if (typeof data === 'string') {
    return data;
  }

  if (Array.isArray(data) && data.length > 0) {
    return extractN8nReply(data[0]);
  }

  if (data && typeof data === 'object') {
    const obj = data as N8nChatResponse;
    if (obj.output && typeof obj.output === 'string') return obj.output;
    if (obj.text && typeof obj.text === 'string') return obj.text;
    if (obj.response && typeof obj.response === 'string') return obj.response;
    if (obj.message && typeof obj.message === 'string') return obj.message;
  }

  return 'HUGZ đã nhận được tin nhắn nhưng chưa nhận được định dạng trả lời hợp lệ từ AI. Bạn vui lòng thử lại nhé!';
}

/**
 * Gửi tin nhắn từ người dùng đến n8n AI Agent Webhook/Chat Trigger
 */
export async function sendChatMessageToN8n(
  message: string,
  sessionId: string
): Promise<SendMessageResult> {
  const n8nUrl = getN8nChatUrl();

  // Kiểm tra nếu chưa cấu hình URL n8n
  if (!n8nUrl || !n8nUrl.trim()) {
    return {
      success: false,
      replyText: 
        '🌿 **HUGZ Assistant đã sẵn sàng!**\n\n' +
        'Tuy nhiên, hệ thống chưa nhận được cấu hình `VITE_N8N_CHAT_URL` (hoặc Webhook URL) để kết nối đến workflow n8n AI Agent.\n\n' +
        '👉 **Quản trị viên:** Vui lòng cấu hình Production Webhook URL của n8n vào file `.env` hoặc bấm vào biểu tượng Cài đặt (bánh răng) ở góc trên khung chat để nhập link test.\n\n' +
        '👉 **Khách hàng:** Để được tư vấn ngay lập tức, bạn có thể nhắn tin trực tiếp qua **[Facebook Fanpage The Hugz Life](https://www.facebook.com/thehugzlife)** hoặc kênh **[TikTok Shop HUGZ](https://www.tiktok.com/@hugzvietnam)** nhé!',
      error: 'NO_WEBHOOK_CONFIGURED',
    };
  }

  const payload: N8nChatPayload = {
    action: 'sendMessage',
    sessionId,
    chatInput: message,
    metadata: {
      source: 'thehugzlife.store',
      url: typeof window !== 'undefined' ? window.location.href : '',
      timestamp: new Date().toISOString(),
      device: typeof window !== 'undefined' && window.innerWidth < 768 ? 'mobile' : 'desktop',
    },
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CHAT_TIMEOUT_MS);

  try {
    const response = await fetch(n8nUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        success: false,
        replyText: `Rất tiếc, máy chủ AI n8n phản hồi với mã lỗi HTTP ${response.status}. Bạn vui lòng kiểm tra lại workflow n8n hoặc nhắn tin qua Fanpage Facebook của HUGZ để được hỗ trợ nhé.`,
        error: `HTTP_${response.status}`,
      };
    }

    const contentType = response.headers.get('content-type') || '';
    let replyText = '';

    if (contentType.includes('application/json')) {
      const data = await response.json();
      replyText = extractN8nReply(data);
    } else {
      replyText = await response.text();
    }

    return {
      success: true,
      replyText: replyText.trim(),
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const errorObj = err as { name?: string; message?: string };

    if (errorObj?.name === 'AbortError') {
      return {
        success: false,
        replyText: 'Thời gian chờ phản hồi từ AI vượt quá 30 giây. Xin bạn vui lòng gửi lại tin nhắn hoặc nhắn tin trực tiếp với nhân viên qua Facebook Fanpage của HUGZ nhé!',
        error: 'TIMEOUT',
      };
    }

    return {
      success: false,
      replyText: 'Không thể kết nối đến máy chủ AI (Lỗi mạng hoặc CORS trên n8n). Vui lòng kiểm tra lại URL Webhook hoặc liên hệ trực tiếp đội ngũ HUGZ qua Fanpage.',
      error: errorObj?.message || 'NETWORK_ERROR',
    };
  }
}
