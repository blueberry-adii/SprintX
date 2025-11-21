import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Sparkles, X, ChevronDown, Loader2, Bot } from 'lucide-react';
import { getQuickAdvice } from '../services/geminiService';

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: "Hi! I'm your study assistant. Ask me anything about your schedule, habits, or study tips." }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMsg = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const context = "Student using a productivity app. They have access to a task manager, routine logger, and dashboard.";
    const response = await getQuickAdvice(userMsg, context);

    setMessages(prev => [...prev, { role: 'ai', text: response }]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl shadow-violet-500/30 transition-all hover:scale-105 active:scale-95 ${
          isOpen 
            ? 'bg-slate-900 dark:bg-slate-200 text-white dark:text-slate-900 rotate-90' 
            : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white'
        }`}
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 h-[550px] bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200/60 dark:border-slate-700 z-50 flex flex-col animate-slide-up overflow-hidden font-sans">
          {/* Header */}
          <div className="bg-slate-900 dark:bg-slate-950 p-5 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="bg-violet-500 p-2 rounded-xl">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm">AI Study Buddy</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Online</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <ChevronDown size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-violet-600 text-white rounded-br-sm' 
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-600 rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-700 p-4 rounded-2xl rounded-bl-none shadow-sm border border-slate-100 dark:border-slate-600">
                  <Loader2 size={18} className="animate-spin text-violet-600 dark:text-violet-400" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
            <div className="relative flex items-center">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask for advice..."
                className="w-full pl-4 pr-12 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none text-sm transition-all font-medium dark:text-white"
              />
              <button 
                type="submit"
                disabled={!query.trim() || isLoading}
                className="absolute right-2 p-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:hover:bg-violet-600 transition-colors shadow-sm"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
