export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  text: string;
  timestamp: string;
  status?: 'sending' | 'sent' | 'error';
  suggestions?: string[];
  productIds?: string[];
}

export interface ChatSession {
  sessionId: string;
  createdAt: string;
  messages: ChatMessage[];
}

export interface N8nChatPayload {
  action?: string;
  sessionId: string;
  chatInput: string;
  metadata?: {
    source?: string;
    url?: string;
    timestamp?: string;
    device?: 'mobile' | 'desktop';
  };
}

export interface N8nChatResponse {
  output?: string;
  text?: string;
  response?: string;
  message?: string;
  productIds?: string[];
  error?: string;
}
