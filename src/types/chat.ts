// Define interfaces for chat messages and device information

export interface DeviceInfo {
  userAgent: string;
  language: string;
  platform: string;
  screenResolution: string;
  timeZone: string;
  referrer: string;
  ipAddress?: string; // Will be populated by the backend
  macAddress?: string; // Will be populated by the backend (if available)
  browserName: string;
  browserVersion: string;
  osName: string;
  osVersion: string;
  deviceType: string;
  connectionType?: string;
  connectionSpeed?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'assistant' | 'system';
  conversation_id?: string;
  deviceInfo?: DeviceInfo;
  isConversationSeparator?: boolean;
}

// API request format for sending messages
export interface SendMessageRequest {
  device_id: string;
  message: string;
  username?: string;
  ip_address?: string;
}

// API response format for sent messages
export interface SendMessageResponse {
  conversation_id: string;
  message: string;
  response: string;
  timestamp: string;
}

// API response format for chat history
export interface ChatHistoryMessage {
  role: 'user' | 'assistant';
  content: string;
  created_at?: string;
  createdAt?: string;
  _id?: string;
  user_id?: string;
}

export interface ConversationInfo {
  id: string;
  created_at: string;
}

export interface ConversationsListResponse {
  data: ConversationInfo[];
  meta: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

export interface ConversationMessagesResponse {
  messages: ChatHistoryMessage[];
}
