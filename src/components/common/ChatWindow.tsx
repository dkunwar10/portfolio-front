
import { useState, useEffect, useRef, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Search, Send, Loader2, RefreshCw, User } from "lucide-react";
import chatService from "@/services/chatService";
import { ChatMessage } from "@/types/chat";
import { toast } from "@/components/ui/sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import "@/styles/markdown.css";

// Helper function to check if a date is valid
const isValidDate = (date: Date): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

// Helper function to format message time
const formatMessageTime = (date: Date): string => {
  if (!isValidDate(date)) return 'Just now';

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Check if the date is today
  if (date >= today) {
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  }

  // Check if the date is yesterday
  if (date >= yesterday && date < today) {
    return `Yesterday, ${date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
  }

  // For older dates, show the full date
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Fun developer-friendly placeholder messages
const PLACEHOLDER_MESSAGES = [
  "while not solved: debug()  # Infinite loop vibes",
  "print('AI is just fancy if-else')",
  "def fix_bug(): raise NewBugError('Now with more confusion')",
  "# TODO: Optimize this brute force before it brute forces me",
  "query = {'name': 'John'}  # MongoDB will still return 0 results",
  "def machine_learning(): return random.choice(['works', 'black magic'])",
  "IndexError: List index went on a coffee break",
  "model.train()  # eventually",
  "const answer = 42  # until the AI model disagrees",
  "data = mongo.find().sort('chaos', -1)",
  "SELECT * FROM solutions WHERE problem = current_issue",
  "git commit -m 'fixed bugs'",
  "while (coding) { coffee++; sleep--; }",
  "catch (exception) { blame_intern(); }",
  "// TODO: Write better code",
  "function solve() { return 'works' || 'fails'; }",
  "npm install --save sanity",
  "Error 418: I'm a teapot",
  "const answer = 42; // Life, universe & everything",
  "!false // It's funny because it's true"
];

export const ChatWindow = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPlaceholder, setCurrentPlaceholder] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle typing animation
  useEffect(() => {
    if (!isOpen) return;

    const targetMessage = PLACEHOLDER_MESSAGES[currentMessageIndex];

    if (isTyping && typingIndex < targetMessage.length) {
      // Typing animation
      const typingTimer = setTimeout(() => {
        setCurrentPlaceholder(targetMessage.substring(0, typingIndex + 1));
        setTypingIndex(typingIndex + 1);
      }, Math.random() * 50 + 30); // Random typing speed for realism

      return () => clearTimeout(typingTimer);
    } else if (isTyping && typingIndex >= targetMessage.length) {
      // Pause at the end of typing
      const pauseTimer = setTimeout(() => {
        setIsTyping(false);
      }, 2000);

      return () => clearTimeout(pauseTimer);
    } else if (!isTyping) {
      // Start deleting
      const deleteTimer = setTimeout(() => {
        if (typingIndex > 0) {
          setCurrentPlaceholder(targetMessage.substring(0, typingIndex - 1));
          setTypingIndex(typingIndex - 1);
        } else {
          // Move to next message
          setIsTyping(true);
          setCurrentMessageIndex((currentMessageIndex + 1) % PLACEHOLDER_MESSAGES.length);
        }
      }, Math.random() * 30 + 20);

      return () => clearTimeout(deleteTimer);
    }
  }, [isOpen, currentPlaceholder, typingIndex, currentMessageIndex, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Fetch chat history when chat opens
  useEffect(() => {
    if (isOpen) {
      fetchChatHistory();
    }
  }, [isOpen]);

  // Fetch chat history using callbacks
  const fetchChatHistory = () => {
    // Don't show loading if we already have messages
    const shouldShowLoading = messages.length === 0;

    if (shouldShowLoading) {
      setIsLoadingHistory(true);
    }

    // If we already have a conversation ID, fetch messages for that conversation
    if (currentConversationId) {
      fetchConversationMessages(currentConversationId, shouldShowLoading);
      return;
    }

    // Otherwise, fetch the list of conversations first
    chatService.fetchConversationsList(currentPage, 10, {
      onProcessed: (conversations) => {
        if (conversations.length > 0) {
          // Get the first (newest) conversation
          const newestConversation = conversations[0];
          setCurrentConversationId(newestConversation.id);

          // Fetch messages for this conversation
          fetchConversationMessages(newestConversation.id, shouldShowLoading);
        } else if (messages.length === 0) {
          // If no conversations found, show welcome message
          setMessages([
            {
              id: "welcome",
              content: "I can help with your coding questions. What are you working on today?",
              timestamp: new Date(),
              sender: "assistant"
            }
          ]);
          if (shouldShowLoading) {
            setIsLoadingHistory(false);
          }
        }
      },
      onError: (error) => {
        console.error("Error fetching conversations list:", error);

        // Only show toast if we were showing loading
        if (shouldShowLoading) {
          toast.error("Failed to load chat history");
        }

        // Show welcome message if no messages
        if (messages.length === 0) {
          setMessages([
            {
              id: "welcome",
              content: "I can help with your coding questions. What are you working on today?",
              timestamp: new Date(),
              sender: "assistant"
            }
          ]);
        }

        if (shouldShowLoading) {
          setIsLoadingHistory(false);
        }
      }
    });
  };

  // Fetch messages for a specific conversation
  const fetchConversationMessages = (conversationId: string, shouldShowLoading: boolean) => {
    chatService.fetchConversationMessages(conversationId, {
      onProcessed: (processedMessages) => {
        if (processedMessages.length > 0) {
          // Messages are already sorted oldest first in the service
          setMessages(processedMessages);
        } else if (messages.length === 0) {
          // If no messages found, show welcome message
          setMessages([
            {
              id: "welcome",
              content: "I can help with your coding questions. What are you working on today?",
              timestamp: new Date(),
              sender: "assistant"
            }
          ]);
        }
      },
      onError: (error) => {
        console.error(`Error fetching messages for conversation ${conversationId}:`, error);

        // Only show toast if we were showing loading
        if (shouldShowLoading) {
          toast.error("Failed to load conversation messages");
        }

        // Show welcome message if no messages
        if (messages.length === 0) {
          setMessages([
            {
              id: "welcome",
              content: "I can help with your coding questions. What are you working on today?",
              timestamp: new Date(),
              sender: "assistant"
            }
          ]);
        }
      },
      onFinally: () => {
        if (shouldShowLoading) {
          setIsLoadingHistory(false);
        }
      }
    });
  };

  // Handle sending a message
  const handleSendMessage = (e?: FormEvent) => {
    if (e) e.preventDefault();

    if (!inputValue.trim()) return;

    // Set sending state
    setIsSending(true);

    // Clear input field immediately for better UX
    const messageText = inputValue;
    setInputValue("");

    // Add temporary user message to the chat for immediate feedback
    const tempUserMessage: ChatMessage = {
      id: `temp-user-${Date.now()}`,
      content: messageText,
      timestamp: new Date(),
      sender: "user",
      conversation_id: currentConversationId || undefined
    };

    // Add temporary message at the end (oldest first)
    setMessages(prev => [...prev, tempUserMessage]);

    // Send message to the server with callbacks
    chatService.sendMessage(messageText, {
      conversation_id: currentConversationId || undefined,
      onProcessed: (userMessage, assistantMessage) => {
        // Store the conversation ID if it's new
        if (assistantMessage.conversation_id && (!currentConversationId || currentConversationId !== assistantMessage.conversation_id)) {
          setCurrentConversationId(assistantMessage.conversation_id);
        }

        // Remove temporary message and add real messages
        setMessages(prev => {
          // Filter out the temporary message
          const filteredMessages = prev.filter(msg => msg.id !== tempUserMessage.id);
          // Add the real messages (oldest first)
          return [...filteredMessages, userMessage, assistantMessage];
        });

        // Wait a short delay to allow the server to process the message
        setTimeout(() => {
          // Refetch chat history to ensure we have the latest state
          fetchChatHistory();
        }, 1000); // 1 second delay
      },
      onError: (error) => {
        console.error("Error sending message:", error);
        toast.error("Failed to send message. Please try again.");
      },
      onFinally: () => {
        setIsSending(false);
      }
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-16 h-16 flex items-center justify-center transition-all hover:scale-110 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 hover:from-blue-700 hover:via-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl border-0 group"

       >
          <div className="relative">
                    {/* <MessageCircle size={50} className="text-blue-600" strokeWidth={2.5} /> */}
                  <MessageCircle style={{ color: 'white', strokeWidth: 2,width: 30, height: 30 }} size={30}/>


            {/* <MessageCircle className="text-white w-8 h-8 group-hover:scale-110 transition-all duration-300" /> */}
            {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse">1</span> */}
          </div>
        </Button>
      ) : (
        <Card className="w-[490px] h-[550px] flex flex-col shadow-xl animate-in fade-in duration-300 slide-in-from-bottom-5">
          <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 text-white rounded-t-lg shadow-md">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-2 rounded-full">
                <MessageCircle size={20} className="text-white animate-pulse-slow" />
              </div>
              <h3 className="font-medium text-lg">Developer Chat</h3>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchChatHistory}
                disabled={isLoadingHistory}
                className="text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
                title="Refresh chat history"
              >
                <RefreshCw size={16} className={isLoadingHistory ? 'animate-spin' : ''} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
              >
                <X size={20} />
              </Button>
            </div>
          </div>
          <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-blue-50 to-gray-50 relative">
            {isLoadingHistory && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-blue-50 to-gray-50 bg-opacity-90 z-10">
                <div className="flex flex-col items-center">
                  <RefreshCw className="h-8 w-8 text-blue-500 animate-spin mb-2" />
                  <p className="text-sm text-gray-600">Loading messages...</p>
                </div>
              </div>
            )}
            {messages.length === 0 && !isLoadingHistory ? (
              <div className="text-center text-gray-600 p-6 bg-white rounded-lg shadow-sm mb-4">
                <p className="text-lg font-medium mb-2">Welcome, fellow developer!</p>
                <p className="text-sm opacity-80">
                  This is where we'd normally put some witty developer humor, but we're too busy fixing bugs that worked fine in development.
                </p>
                <div className="mt-4 p-3 bg-gray-100 rounded-md text-left font-mono text-xs">
                  <code>console.log('Why is this not working?');</code>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Note: By using this chat, your device information will be collected for analytics and support purposes.
                </p>
              </div>
            ) : messages.length > 0 && (
              <>
                {/* Group messages by date - display in chronological order (oldest first) */}
                {messages.reduce((acc, message, index, array) => {
                  // Skip separators for date headers
                  if (message.isConversationSeparator) return acc;

                  // Get the current message date
                  const messageDate = isValidDate(message.timestamp) ?
                    message.timestamp.toLocaleDateString() : null;

                  // Get the previous message date
                  const prevMessage = array[index - 1];
                  const prevMessageDate = prevMessage && isValidDate(prevMessage.timestamp) ?
                    prevMessage.timestamp.toLocaleDateString() : null;

                  // If this is the first message or the date is different from the previous message
                  if (messageDate && (!prevMessageDate || messageDate !== prevMessageDate)) {
                    acc.push(
                      <div key={`date-${message.id}`} className="text-xs text-center text-gray-400 my-2">
                        {message.timestamp.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                      </div>
                    );
                  }

                  return acc;
                }, [] as React.ReactNode[])}

                {messages.map((message) => (
                  message.isConversationSeparator ? (
                    // Conversation separator
                    <div key={message.id} className="my-6 text-center">
                      <div className="relative flex items-center">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="flex-shrink mx-4 text-xs text-gray-500">
                          {isValidDate(message.timestamp) ?
                            message.timestamp.toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            }) :
                            'New conversation'}
                        </span>
                        <div className="flex-grow border-t border-gray-300"></div>
                      </div>
                    </div>
                  ) : (
                    // Regular message
                    <div
                      key={message.id}
                      className={`p-4 mb-4 shadow-sm transition-all duration-300 hover:shadow-md animate-fade-in ${message.sender === 'assistant' ?
                        'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-lg rounded-tl-none mr-12 hover:from-blue-100 hover:to-indigo-100' :
                        'bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-lg rounded-tr-none ml-12 hover:from-gray-50 hover:to-white'}`}
                    >
                      <div className="flex items-start">
                        <div className={`${message.sender === 'assistant' ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-gray-700 to-gray-900'} text-white p-2 rounded-full mr-3 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105`}>
                          {message.sender === 'assistant' ?
                            <MessageCircle size={16} className="animate-pulse-slow" /> :
                            <User size={16} />}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${message.sender === 'assistant' ? 'text-blue-800' : 'text-gray-800'}`}>
                            {message.sender === 'assistant' ? 'Assistant' : 'You'}
                          </p>
                          {message.sender === 'assistant' ? (
                            <div className="text-sm text-gray-700 mt-1 markdown-content">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}
                                components={{
                                  // Style the markdown elements
                                  p: (props) => <p className="mb-2" {...props} />,
                                  h1: (props) => <h1 className="text-xl font-bold my-3" {...props} />,
                                  h2: (props) => <h2 className="text-lg font-bold my-2" {...props} />,
                                  h3: (props) => <h3 className="text-md font-bold my-2" {...props} />,
                                  ul: (props) => <ul className="list-disc pl-5 my-2" {...props} />,
                                  ol: (props) => <ol className="list-decimal pl-5 my-2" {...props} />,
                                  li: (props) => <li className="mb-1" {...props} />,
                                  a: (props) => <a className="text-blue-500 hover:underline" {...props} />,
                                  code: (props) => {
                                    const {children, className, node, ...rest} = props;
                                    const match = /language-(\w+)/.exec(className || '');
                                    const language = match ? match[1] : '';
                                    const isInline = !match && !className;

                                    return isInline ? (
                                      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" {...rest}>{children}</code>
                                    ) : (
                                      <SyntaxHighlighter
                                        style={vscDarkPlus}
                                        language={language}
                                        PreTag="div"
                                        className="rounded-md my-2 overflow-x-auto"
                                        showLineNumbers
                                        wrapLines
                                      >
                                        {String(children).replace(/\n$/, '')}
                                      </SyntaxHighlighter>
                                    );
                                  },
                                  pre: ({children}) => <>{children}</>,
                                  blockquote: (props) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2" {...props} />,
                                  table: (props) => <table className="border-collapse border border-gray-300 my-2" {...props} />,
                                  th: (props) => <th className="border border-gray-300 px-4 py-2 bg-gray-100" {...props} />,
                                  td: (props) => <td className="border border-gray-300 px-4 py-2" {...props} />,
                                }}
                              >
                                {message.content}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
                              {message.content}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-2">
                            {isValidDate(message.timestamp) ?
                              formatMessageTime(message.timestamp) :
                              'Just now'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
          <form onSubmit={handleSendMessage} className="p-5 border-t bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-blue-400" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={currentPlaceholder}
                disabled={isSending}
                className="w-full pl-10 pr-12 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-mono bg-white shadow-sm hover:shadow-md focus:shadow-md"
                style={{ minHeight: '52px' }}
              />
              <button
                type="submit"
                disabled={isSending || !inputValue.trim()}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-500 hover:text-blue-700 transition-all disabled:text-gray-400 disabled:cursor-not-allowed hover:scale-110"
              >
                {isSending ?
                  <Loader2 className="h-5 w-5 animate-spin" /> :
                  <Send className="h-5 w-5 transition-transform duration-300 transform group-hover:translate-x-1" />}
              </button>
            </div>
            <div className="mt-3 text-xs text-blue-600 text-center flex items-center justify-center gap-1 animate-pulse">
              {isSending ? "Sending message..." : "Type your message and press Enter to send"}
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};
