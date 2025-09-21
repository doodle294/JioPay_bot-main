import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader } from 'lucide-react';

export default function ChatBox({ onSend, loading }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 80) + 'px'; // smaller max height
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [query]);

  // Handle typing indicator
  useEffect(() => {
    if (query.length > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [query]);

  const handleSubmit = () => {
    if (query.trim() && !loading) {
      onSend(query);
      setQuery('');
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const quickSuggestions = [
    "Payments with JioPay?",
    "What are JioPay business features?",
    "JioPay security features",
    "How to contact support?"
  ];

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  return (
    <div className="relative mb-6">
      {/* Quick Suggestions */}
      {!loading && query === '' && (
        <div className="mb-4 animate-fade-in">
          <p className="text-sm text-gray-600 mb-2 font-medium flex items-center gap-2">
            <Sparkles size={16} className="text-yellow-500" />
            Quick suggestions:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {quickSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-sm bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 px-3 py-2 rounded-lg border border-blue-200 hover:border-blue-300 transition-all duration-200 hover:shadow-sm text-left"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Chat Input */}
      <div className={`relative transition-all duration-300 ${isFocused ? 'transform scale-[1.01]' : ''}`}>
        <div className={`relative bg-white rounded-2xl border-2 transition-all duration-300 shadow hover:shadow-md ${
          isFocused ? 'border-blue-500 shadow-lg ring-2 ring-blue-100' : 'border-gray-200'
        } ${loading ? 'opacity-70' : ''}`}>
          
          {/* Input Area */}
          <div className="flex items-end p-3 gap-2">
            {/* Text Input */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="💬 Ask me anything about JioPay..."
                disabled={loading}
                className="w-full resize-none border-none outline-none text-gray-800 placeholder-gray-500 bg-transparent min-h-[28px] max-h-[80px] leading-6 text-sm disabled:cursor-not-allowed"
                rows={1}
              />

              {/* Typing Indicator */}
              {isTyping && !loading && (
                <div className="absolute -bottom-1 left-0 text-xs text-blue-500 flex items-center gap-1 animate-pulse">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="ml-1">AI is ready to help...</span>
                </div>
              )}
            </div>

            {/* Send Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!query.trim() || loading}
              className={`flex-shrink-0 p-2.5 rounded-full transition-all duration-300 transform hover:scale-110 disabled:scale-100 ${
                query.trim() && !loading
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>

          {/* Character Counter & Status */}
          <div className="px-3 pb-2 flex justify-between items-center text-xs text-gray-500">
            <span>{loading ? "Processing..." : "Press Enter to send • Shift+Enter for new line"}</span>
            <span className={`${query.length > 800 ? 'text-red-500 font-semibold' : query.length > 600 ? 'text-yellow-500' : 'text-gray-400'}`}>
              {query.length}/1000
            </span>
          </div>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <div className="flex items-center gap-2 text-blue-600">
              <Loader size={20} className="animate-spin" />
              <span className="text-sm font-medium">Processing your request...</span>
            </div>
          </div>
        )}
      </div>

      {/* AI Status Indicator */}
      <div className="mt-3 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs border border-green-200">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-medium">JioPay AI Assistant Online</span>
        </div>
      </div>
    </div>
  );
}
