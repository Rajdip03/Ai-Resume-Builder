import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles, AlertCircle, Bot, User, ChevronDown } from 'lucide-react';
import api from '../configs/api';
import { useSelector } from 'react-redux';

const SUGGESTION_CHIPS = [
  "How do I make my resume ATS-friendly?",
  "What keywords fit a software engineer resume?",
  "Review my summary section",
  "Common resume mistakes to avoid",
];

const ResumeChatbot = ({ resumeContext = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const { token } = useSelector((state) => state.auth);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 100);
  };

  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || isLoading) return;

    const userMsg = { role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Send last ~10 messages as history
      const history = [...messages].slice(-10).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const { data } = await api.post(
        '/api/chatbot/ask',
        {
          message: trimmed,
          conversationHistory: history,
          resumeContext: resumeContext || undefined,
        },
        { headers: { Authorization: token } }
      );

      setMessages((prev) => [
        ...prev,
        { role: 'model', text: data.reply },
      ]);
    } catch (err) {
      const errorText =
        err.response?.data?.error ||
        'Something went wrong — please try again.';
      setMessages((prev) => [
        ...prev,
        { role: 'error', text: errorText },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (text) => {
    // Simple markdown-like formatting for bot messages
    return text
      .split('\n')
      .map((line, i) => {
        // Bold
        let formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Bullet points
        if (formatted.startsWith('- ') || formatted.startsWith('• ')) {
          formatted = `<span class="inline-block ml-2">•</span> ${formatted.slice(2)}`;
        }
        return `<span key="${i}">${formatted}</span>`;
      })
      .join('<br/>');
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        id="chatbot-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 group flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 ease-out hover:scale-110 active:scale-95 print:hidden ${
          isOpen
            ? 'bg-slate-700 hover:bg-slate-800 rotate-0'
            : 'bg-gradient-to-br from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700'
        }`}
        aria-label={isOpen ? 'Close chatbot' : 'Open resume assistant'}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white transition-transform duration-200" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 text-white transition-transform duration-200" />
            {/* Pulse ring */}
            <span className="absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-30 animate-ping" />
          </>
        )}
      </button>

      {/* Chat Panel */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[400px] max-w-[calc(100vw-48px)] transition-all duration-300 ease-out print:hidden ${
          isOpen
            ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
            : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
        }`}
      >
        <div className="flex flex-col h-[560px] max-h-[calc(100vh-140px)] rounded-2xl bg-white shadow-2xl border border-gray-200/80 overflow-hidden">
          {/* Header */}
          <div className="flex-shrink-0 bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm tracking-wide">Resume Assistant</h3>
                <p className="text-violet-200 text-xs">AI-powered resume & career advice</p>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gradient-to-b from-slate-50 to-white scroll-smooth"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#c4b5fd #f8fafc' }}
          >
            {/* Welcome message when empty */}
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center px-4 animate-fadeIn">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center mb-4">
                  <Bot className="w-8 h-8 text-violet-600" />
                </div>
                <h4 className="text-slate-800 font-semibold text-base mb-1">
                  Hi! I'm your Resume Assistant
                </h4>
                <p className="text-slate-500 text-sm mb-6 max-w-[280px]">
                  Ask me anything about resumes, ATS optimization, keywords, or career advice.
                </p>

                {/* Suggestion Chips */}
                <div className="flex flex-wrap gap-2 justify-center">
                  {SUGGESTION_CHIPS.map((chip, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(chip)}
                      className="text-xs px-3 py-2 rounded-xl bg-white border border-violet-200 text-violet-700 hover:bg-violet-50 hover:border-violet-300 transition-all duration-200 hover:shadow-sm active:scale-95"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message bubbles */}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 animate-slideUp ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {/* Bot/Error avatar */}
                {msg.role !== 'user' && (
                  <div
                    className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-1 ${
                      msg.role === 'error'
                        ? 'bg-red-100'
                        : 'bg-gradient-to-br from-violet-100 to-indigo-100'
                    }`}
                  >
                    {msg.role === 'error' ? (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    ) : (
                      <Bot className="w-4 h-4 text-violet-600" />
                    )}
                  </div>
                )}

                <div
                  className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white rounded-br-md'
                      : msg.role === 'error'
                      ? 'bg-red-50 text-red-700 border border-red-200 rounded-bl-md'
                      : 'bg-white text-slate-700 border border-gray-100 shadow-sm rounded-bl-md'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <div
                      className="whitespace-pre-wrap [&>strong]:font-semibold"
                      dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
                    />
                  )}
                </div>

                {/* User avatar */}
                {msg.role === 'user' && (
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center mt-1">
                    <User className="w-4 h-4 text-slate-600" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-2.5 justify-start animate-slideUp">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center mt-1">
                  <Bot className="w-4 h-4 text-violet-600" />
                </div>
                <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Scroll to bottom button */}
          {showScrollBtn && (
            <button
              onClick={scrollToBottom}
              className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-white border border-gray-200 shadow-md rounded-full p-1.5 hover:bg-gray-50 transition-all z-10"
            >
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>
          )}

          {/* Input Area */}
          <div className="flex-shrink-0 border-t border-gray-100 bg-white px-4 py-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                id="chatbot-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your resume..."
                rows={1}
                className="flex-1 resize-none bg-slate-50 text-sm text-slate-700 placeholder-slate-400 rounded-xl px-4 py-2.5 max-h-24 focus:bg-white focus:ring-2 focus:ring-violet-300 focus:border-violet-400 border border-slate-200 transition-all outline-none"
                style={{
                  height: 'auto',
                  minHeight: '40px',
                  maxHeight: '96px',
                  overflowY: input.split('\n').length > 3 ? 'auto' : 'hidden',
                }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
                }}
                disabled={isLoading}
              />
              <button
                id="chatbot-send-btn"
                onClick={() => sendMessage()}
                disabled={isLoading || !input.trim()}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white hover:from-violet-600 hover:to-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 active:scale-95 hover:shadow-md"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5 text-center">
              AI-powered • Resume & career advice only
            </p>
          </div>
        </div>
      </div>

      {/* Inline styles for animations (Tailwind custom) */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default ResumeChatbot;
