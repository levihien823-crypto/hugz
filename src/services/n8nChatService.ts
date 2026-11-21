import { getN8nChatUrl, CHAT_TIMEOUT_MS } from '../config/chatConfig';
import { N8nChatPayload, N8nChatResponse } from '../types/chat';

export interface SendMessageResult {
  success: boolean;
  replyText: string;
  productIds?: string[];
  error?: string;
}

/**
 * Trích xuất chuỗi phản hồi và danh sách productIds từ n8n
 * Hỗ trợ:
 * 1. Định dạng JSON có trường productIds: { "output": "...", "productIds": ["id1", "id2"] }
 * 2. Trường output chứa chuỗi JSON do LLM sinh ra
 * 3. Text thuần túy (fallback an toàn)
 */
function parseN8nResponse(data: unknown): { replyText: string; productIds: string[] } {
  let replyText = '';
  let productIds: string[] = [];

  if (typeof data === 'string') {
    const trimmed = data.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const parsed = JSON.parse(trimmed);
        return parseN8nResponse(parsed);
      } catch {
        replyText = trimmed;
      }
    } else {
      replyText = trimmed;
    }
  } else if (Array.isArray(data) && data.length > 0) {
    return parseN8nResponse(data[0]);
  } else if (data && typeof data === 'object') {
    const obj = data as Record<string, any>;

    // 1. Kiểm tra nếu có mảng productIds trực tiếp trong JSON response
    if (Array.isArray(obj.productIds)) {
      productIds = obj.productIds.filter(
        (id): id is string => typeof id === 'string' && id.trim().length > 0
      );
    }

    // 2. Lấy nội dung text từ các trường phổ biến của n8n
    const candidate = obj.output || obj.text || obj.response || obj.message;
    if (typeof candidate === 'string') {
      const trimmed = candidate.trim();
      // Nếu candidate là chuỗi JSON do LLM xuất ra
      if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
        try {
          const innerObj = JSON.parse(trimmed);
          if (innerObj && typeof innerObj === 'object') {
            if (typeof innerObj.output === 'string') {
              replyText = innerObj.output.trim();
            } else if (typeof innerObj.text === 'string') {
              replyText = innerObj.text.trim();
            } else if (typeof innerObj.message === 'string') {
              replyText = innerObj.message.trim();
            }

            if (Array.isArray(innerObj.productIds)) {
              const innerIds = innerObj.productIds.filter(
                (id: any): id is string => typeof id === 'string' && id.trim().length > 0
              );
              productIds = Array.from(new Set([...productIds, ...innerIds]));
            }
          }
        } catch {
          replyText = trimmed;
        }
      } else {
        replyText = trimmed;
      }
    }
  }

  return { replyText, productIds };
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
        replyText: 'Hệ thống trợ lý AI đang tạm thời gián đoạn. Bạn vui lòng thử lại sau giây lát hoặc nhắn tin qua Fanpage Facebook của HUGZ để được chuyên viên tư vấn hỗ trợ nhé.',
        error: `HTTP_${response.status}`,
      };
    }

    const contentType = response.headers.get('content-type') || '';
    let parsed = { replyText: '', productIds: [] as string[] };

    if (contentType.includes('application/json')) {
      const data = await response.json();
      parsed = parseN8nResponse(data);
    } else {
      const text = await response.text();
      parsed = parseN8nResponse(text);
    }

    if (!parsed.replyText) {
      return {
        success: false,
        replyText: 'HUGZ Assistant đã nhận được tin nhắn nhưng chưa có nội dung phản hồi từ AI. Bạn vui lòng gửi lại câu hỏi hoặc nhắn tin qua Fanpage nhé!',
        error: 'EMPTY_RESPONSE',
      };
    }

    return {
      success: true,
      replyText: parsed.replyText,
      productIds: parsed.productIds,
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
