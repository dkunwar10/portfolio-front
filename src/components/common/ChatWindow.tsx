
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Search, Send } from "lucide-react";

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
  const inputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-16 h-16 flex items-center justify-center transition-all hover:scale-105 animate-slow-pulse bg-transparent hover:bg-transparent border-0"
        >
          {/* <MessageCircle size={50} className="text-blue-600" strokeWidth={2.5} /> */}
          <MessageCircle style={{ color: 'white', strokeWidth: 2,width: 30, height: 30 }} size={30}/>

        </Button>
      ) : (
        <Card className="w-[490px] h-[550px] flex flex-col shadow-xl animate-in fade-in duration-300 slide-in-from-bottom-5">
          <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
            <h3 className="font-medium text-lg">Developer Chat</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20">
              <X size={20} />
            </Button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="text-center text-gray-600 p-6 bg-white rounded-lg shadow-sm mb-4">
              <p className="text-lg font-medium mb-2">Welcome, fellow developer!</p>
              <p className="text-sm opacity-80">
                This is where we'd normally put some witty developer humor, but we're too busy fixing bugs that worked fine in development.
              </p>
              <div className="mt-4 p-3 bg-gray-100 rounded-md text-left font-mono text-xs">
                <code>console.log('Why is this not working?');</code>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 mb-4">
              <div className="flex items-start">
                <div className="bg-blue-500 text-white p-2 rounded-full mr-3">
                  <MessageCircle size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800">Assistant</p>
                  <p className="text-sm text-gray-600 mt-1">I can help with your coding questions. What are you working on today?</p>
                </div>
              </div>
            </div>

            <div className="text-xs text-center text-gray-400 my-2">Today, 4:15 PM</div>
          </div>
          <div className="p-5 border-t bg-white">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                ref={inputRef}
                type="text"
                placeholder={currentPlaceholder}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-mono bg-gray-50 hover:bg-white"
                style={{ minHeight: '52px' }}
              />
              <button className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-500 hover:text-blue-700 transition-colors">
                <Send className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-3 text-xs text-gray-500 text-center flex items-center justify-center gap-1">
              Type your queries do not press<kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-700 font-mono mx-1">Tab</kbd> for suggestions
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
