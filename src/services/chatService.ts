import { ChatMessage, DeviceInfo, SendMessageResponse, ConversationsListResponse, ConversationMessagesResponse, ConversationInfo } from '@/types/chat';
import httpBase, { RequestOptions } from './httpBase';
import { v4 as uuidv4 } from 'uuid';
import { getDeviceThumbmark } from '@/utils/thumbmark';

/**
 * Collects device information from the browser
 * @returns DeviceInfo object with device details
 */
export const collectDeviceInfo = (): DeviceInfo => {
  // Get browser information
  const userAgent = navigator.userAgent;
  const browserInfo = getBrowserInfo(userAgent);

  // Get screen information
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const screenResolution = `${screenWidth}x${screenHeight}`;

  // Get connection information
  let connectionType = 'unknown';
  let connectionSpeed = 'unknown';

  // Try to get connection information if available
  if ('connection' in navigator && navigator.connection) {
    const connection = navigator.connection as any;
    connectionType = connection.effectiveType || 'unknown';
    connectionSpeed = connection.downlink ? `${connection.downlink} Mbps` : 'unknown';
  }

  // Create device info object
  const deviceInfo: DeviceInfo = {
    userAgent,
    language: navigator.language,
    platform: browserInfo.os, // Use OS name instead of deprecated navigator.platform
    screenResolution,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    referrer: document.referrer,
    browserName: browserInfo.browser,
    browserVersion: browserInfo.version,
    osName: browserInfo.os,
    osVersion: browserInfo.osVersion,
    deviceType: getDeviceType(userAgent),
    connectionType,
    connectionSpeed
  };

  return deviceInfo;
};

/**
 * Extracts browser and OS information from user agent string
 * @param userAgent The browser's user agent string
 * @returns Object containing browser, version, OS, and OS version
 */
const getBrowserInfo = (userAgent: string) => {
  const ua = userAgent.toLowerCase();
  let browser = 'unknown';
  let version = 'unknown';
  let os = 'unknown';
  let osVersion = 'unknown';

  // Detect browser
  if (ua.indexOf('edge') !== -1) {
    browser = 'Microsoft Edge';
    version = ua.split('edge/')[1].split(' ')[0];
  } else if (ua.indexOf('edg') !== -1) {
    browser = 'Microsoft Edge (Chromium)';
    version = ua.split('edg/')[1].split(' ')[0];
  } else if (ua.indexOf('chrome') !== -1) {
    browser = 'Chrome';
    version = ua.split('chrome/')[1].split(' ')[0];
  } else if (ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1) {
    browser = 'Safari';
    version = ua.split('safari/')[1].split(' ')[0];
  } else if (ua.indexOf('firefox') !== -1) {
    browser = 'Firefox';
    version = ua.split('firefox/')[1].split(' ')[0];
  } else if (ua.indexOf('msie') !== -1 || ua.indexOf('trident') !== -1) {
    browser = 'Internet Explorer';
    version = ua.indexOf('msie') !== -1 ? ua.split('msie ')[1].split(';')[0] : '11.0';
  }

  // Detect OS
  if (ua.indexOf('windows') !== -1) {
    os = 'Windows';
    if (ua.indexOf('windows nt 10') !== -1) {
      osVersion = '10';
    } else if (ua.indexOf('windows nt 6.3') !== -1) {
      osVersion = '8.1';
    } else if (ua.indexOf('windows nt 6.2') !== -1) {
      osVersion = '8';
    } else if (ua.indexOf('windows nt 6.1') !== -1) {
      osVersion = '7';
    } else if (ua.indexOf('windows nt 6.0') !== -1) {
      osVersion = 'Vista';
    } else if (ua.indexOf('windows nt 5.1') !== -1) {
      osVersion = 'XP';
    }
  } else if (ua.indexOf('macintosh') !== -1 || ua.indexOf('mac os') !== -1) {
    os = 'macOS';
    const macOSVersionMatch = ua.match(/mac os x (\d+)[._](\d+)[._]?(\d+)?/);
    if (macOSVersionMatch) {
      osVersion = `${macOSVersionMatch[1]}.${macOSVersionMatch[2]}${macOSVersionMatch[3] ? `.${macOSVersionMatch[3]}` : ''}`;
    }
  } else if (ua.indexOf('android') !== -1) {
    os = 'Android';
    const androidVersionMatch = ua.match(/android (\d+(?:\.\d+)+)/);
    if (androidVersionMatch) {
      osVersion = androidVersionMatch[1];
    }
  } else if (ua.indexOf('ios') !== -1 || (ua.indexOf('iphone') !== -1 || ua.indexOf('ipad') !== -1)) {
    os = 'iOS';
    const iosVersionMatch = ua.match(/os (\d+)_(\d+)_?(\d+)?/);
    if (iosVersionMatch) {
      osVersion = `${iosVersionMatch[1]}.${iosVersionMatch[2]}${iosVersionMatch[3] ? `.${iosVersionMatch[3]}` : ''}`;
    }
  } else if (ua.indexOf('linux') !== -1) {
    os = 'Linux';
  }

  return { browser, version, os, osVersion };
};

/**
 * Determines the device type based on user agent
 * @param userAgent The browser's user agent string
 * @returns Device type (mobile, tablet, desktop)
 */
const getDeviceType = (userAgent: string): string => {
  const ua = userAgent.toLowerCase();

  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }

  if (/mobile|android|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop/i.test(ua)) {
    return 'mobile';
  }

  return 'desktop';
};

// Chat service class
class ChatService {
  private deviceId: string | null = null;
  private thumbmarkPromise: Promise<string> | null = null;

  constructor() {
    // Initialize thumbmark generation
    this.initializeThumbmark();
  }

  // Initialize thumbmark generation
  private async initializeThumbmark(): Promise<void> {
    // Check if we already have a thumbmark in local storage
    const storedThumbmark = localStorage.getItem('chat_device_thumbmark');

    if (storedThumbmark) {
      this.deviceId = storedThumbmark;
      return;
    }

    try {
      let thumbmark: string;

      // Try using the imported function first
      try {
        // Generate thumbmark if not available
        if (!this.thumbmarkPromise) {
          this.thumbmarkPromise = getDeviceThumbmark();
        }
        thumbmark = await this.thumbmarkPromise;
      } catch (importError) {
        console.warn('Error using imported ThumbmarkJS, trying global object:', importError);

        // Fallback to global ThumbmarkJS object
        // @ts-ignore - ThumbmarkJS global API
        if (typeof ThumbmarkJS !== 'undefined' && typeof ThumbmarkJS.getFingerprint === 'function') {
          // @ts-ignore - ThumbmarkJS global API
          thumbmark = await ThumbmarkJS.getFingerprint();
        } else {
          throw new Error('ThumbmarkJS not available');
        }
      }

      this.deviceId = thumbmark;
      localStorage.setItem('chat_device_thumbmark', thumbmark);

      // Log thumbmark for debugging
      console.log('Device thumbmark generated:', thumbmark);

      // Try to get IP address for additional information
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        console.log('IP Address:', data.ip);
      } catch (ipError) {
        console.warn('Could not fetch IP address:', ipError);
      }
    } catch (error) {
      console.error('Error generating thumbmark:', error);
      // Fallback to UUID if thumbmark generation fails
      this.deviceId = this.generateFallbackDeviceId();
      localStorage.setItem('chat_device_thumbmark', this.deviceId);
    }
  }

  // Generate a fallback device ID based on device information
  private generateFallbackDeviceId(): string {
    const deviceInfo = collectDeviceInfo();
    const deviceIdBase = `${deviceInfo.browserName}-${deviceInfo.osName}-${deviceInfo.deviceType}`;
    return `${deviceIdBase}-${uuidv4()}`;
  }



  // Send a message to the chat API with callbacks
  sendMessage(
    message: string,
    options?: RequestOptions<SendMessageResponse> & {
      onProcessed?: (userMessage: ChatMessage, assistantMessage: ChatMessage) => void;
      conversation_id?: string;
    }
  ): void {
    // Ensure we have a device ID
    if (!this.deviceId) {
      if (options?.onError) {
        options.onError(new Error('No device ID available'));
      }
      if (options?.onFinally) {
        options.onFinally();
      }
      return;
    }

    // Create request payload with the exact format required
    const payload: any = {
      device_id: this.deviceId,
      message: message
    };

    // Add conversation_id if available in options or localStorage
    const storedConversationId = localStorage.getItem('chat_conversation_id');

    if (options?.conversation_id) {
      payload.conversation_id = options.conversation_id;
    } else if (storedConversationId) {
      payload.conversation_id = storedConversationId;
    }

    // Add optional username if available
    const username = localStorage.getItem('chat_username');
    if (username) {
      // @ts-ignore - Add username to payload
      payload.username = username;
    }

    // Create custom options with our processing logic
    const customOptions: RequestOptions<SendMessageResponse> = {
      ...options,
      onSuccess: (data: SendMessageResponse) => {
        // Store conversation ID for future use
        if (data.conversation_id) {
          localStorage.setItem('chat_conversation_id', data.conversation_id);
        }

        // Create user message
        const userMessage: ChatMessage = {
          id: uuidv4(),
          content: message,
          timestamp: new Date(data.timestamp || new Date().toISOString()),
          sender: 'user',
          conversation_id: data.conversation_id
        };

        // Create assistant message
        const assistantMessage: ChatMessage = {
          id: uuidv4(),
          content: data.response || "Thank you for your message!",
          timestamp: new Date(data.timestamp || new Date().toISOString()),
          sender: 'assistant',
          conversation_id: data.conversation_id
        };

        // Log device information to console
        console.log('Device ID (Thumbmark):', this.deviceId);
        console.log('Device Info:', collectDeviceInfo());

        // Call the original onSuccess if provided
        if (options?.onSuccess) {
          options.onSuccess(data);
        }

        // Call the onProcessed callback if provided
        if (options?.onProcessed) {
          options.onProcessed(userMessage, assistantMessage);
        }
      },
      onError: (error) => {
        console.error('Error sending chat message:', error);

        // Create fallback messages
        const userMessage: ChatMessage = {
          id: uuidv4(),
          content: message,
          timestamp: new Date(),
          sender: 'user'
        };

        const assistantMessage: ChatMessage = {
          id: uuidv4(),
          content: "Sorry, I couldn't process your message. Please try again later.",
          timestamp: new Date(),
          sender: 'assistant'
        };

        // Call the onProcessed callback with fallback messages
        if (options?.onProcessed) {
          options.onProcessed(userMessage, assistantMessage);
        }

        // Call the original onError if provided
        if (options?.onError) {
          options.onError(error);
        }
      }
    };

    // Make the request
    httpBase.post<SendMessageResponse>(
      '/chat/message',
      payload,
      undefined,
      customOptions
    ).catch(error => {
      console.error('Error in sendMessage:', error);
      // Error is already handled by httpBase and callbacks
    });
  }

  // Get device information
  getDeviceInfo(): DeviceInfo {
    return collectDeviceInfo();
  }

  // Get the device thumbmark
  async getDeviceThumbmark(): Promise<string> {
    if (!this.deviceId && this.thumbmarkPromise) {
      await this.initializeThumbmark();
    }
    return this.deviceId || this.generateFallbackDeviceId();
  }

  // Process conversation messages into ChatMessage array
  private processConversationMessages(response: ConversationMessagesResponse, conversationId: string): ChatMessage[] {
    const chatMessages: ChatMessage[] = [];

    // Extract messages from the response
    const messages = response.messages || [];

    // Sort messages by timestamp (oldest first for display)
    const sortedMessages = [...messages].sort((a, b) => {
      const timestampA = a.created_at || a.createdAt || new Date().toISOString();
      const timestampB = b.created_at || b.createdAt || new Date().toISOString();
      return new Date(timestampA).getTime() - new Date(timestampB).getTime();
    });

    // Convert each message to ChatMessage format
    sortedMessages.forEach(msg => {
      // Handle timestamp format
      const timestamp = msg.created_at || msg.createdAt || new Date().toISOString();

      chatMessages.push({
        id: msg._id || `${msg.role}-${new Date(timestamp).getTime()}`,
        content: msg.content,
        timestamp: new Date(timestamp),
        sender: msg.role === 'user' ? 'user' : 'assistant',
        conversation_id: conversationId
      });
    });

    return chatMessages;
  }

  // Fetch conversation list with callbacks
  fetchConversationsList(
    page: number = 1,
    pageSize: number = 10,
    options?: RequestOptions<ConversationsListResponse> & { onProcessed?: (conversations: ConversationInfo[]) => void }
  ): void {
    // Ensure we have a device ID
    if (!this.deviceId) {
      if (options?.onError) {
        options.onError(new Error('No device ID available'));
      }
      if (options?.onFinally) {
        options.onFinally();
      }
      return;
    }

    // Prepare params
    const params = {
      device_id: this.deviceId,
      page,
      page_size: pageSize
    };

    // Create custom options with our processing logic
    const customOptions: RequestOptions<ConversationsListResponse> = {
      ...options,
      onSuccess: (data: ConversationsListResponse) => {
        // Sort conversations by created_at (newest first)
        const sortedConversations = [...data.data].sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });

        // Call the original onSuccess with the data
        if (options?.onSuccess) {
          options.onSuccess(data);
        }

        // Call the onProcessed callback if provided
        if (options?.onProcessed) {
          options.onProcessed(sortedConversations);
        }
      }
    };

    // Make the request
    httpBase.get<ConversationsListResponse>(
      '/chat/history',
      params,
      undefined,
      customOptions
    ).catch(error => {
      console.error('Error fetching conversations list:', error);
      // Error is already handled by httpBase and callbacks
    });
  }

  // Fetch conversation messages with callbacks
  fetchConversationMessages(
    conversationId: string,
    options?: RequestOptions<ConversationMessagesResponse> & { onProcessed?: (messages: ChatMessage[]) => void }
  ): void {
    // Create custom options with our processing logic
    const customOptions: RequestOptions<ConversationMessagesResponse> = {
      ...options,
      onSuccess: (data: ConversationMessagesResponse) => {
        // Process the messages
        const messages = this.processConversationMessages(data, conversationId);

        // Call the original onSuccess with the data
        if (options?.onSuccess) {
          options.onSuccess(data);
        }

        // Call the onProcessed callback if provided
        if (options?.onProcessed) {
          options.onProcessed(messages);
        }
      }
    };

    // Make the request
    httpBase.get<ConversationMessagesResponse>(
      `/chat/history/${conversationId}`,
      undefined,
      undefined,
      customOptions
    ).catch(error => {
      console.error(`Error fetching messages for conversation ${conversationId}:`, error);
      // Error is already handled by httpBase and callbacks
    });
  }

  // Fetch chat history (for backward compatibility)
  fetchChatHistory(
    page: number = 1,
    pageSize: number = 10,
    options?: RequestOptions<any> & { onProcessed?: (messages: ChatMessage[]) => void }
  ): void {
    // First fetch the conversation list
    this.fetchConversationsList(page, pageSize, {
      onProcessed: (conversations) => {
        if (conversations.length === 0) {
          // No conversations found, call onProcessed with empty array
          if (options?.onProcessed) {
            options.onProcessed([]);
          }
          if (options?.onFinally) {
            options.onFinally();
          }
          return;
        }

        // Get the first (newest) conversation
        const newestConversation = conversations[0];

        // Fetch messages for this conversation
        this.fetchConversationMessages(newestConversation.id, {
          onProcessed: (messages) => {
            if (options?.onProcessed) {
              options.onProcessed(messages);
            }
          },
          onError: options?.onError,
          onFinally: options?.onFinally
        });
      },
      onError: options?.onError
    });
  }
}

// Create and export a singleton instance
const chatService = new ChatService();
export default chatService;
