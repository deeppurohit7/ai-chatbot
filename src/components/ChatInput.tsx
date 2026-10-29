import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { Send, Square, Sparkles, CornerDownLeft } from 'lucide-react';

const SUGGESTED_PROMPTS = [
  'Explain Angular Signals vs RxJS Observables',
  'Review my MERN stack architecture for scalability',
  'Mock interview question on Node.js Event Loop',
  'Write a TypeScript function to debounce search inputs'
];

export const ChatInput: React.FC = () => {
  const { sendMessage, isGenerating, stopGeneration, currentConversation } = useChat();
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || isGenerating) return;
    sendMessage(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const showSuggestions = (currentConversation?.messages.length || 0) <= 1;

  return (
    <div className="p-4 sm:p-6 bg-[#0a0a0b]/95 border-t border-white/[0.08] backdrop-blur-md">
      <div className="max-w-3xl mx-auto space-y-3">
        {showSuggestions && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessage(prompt)}
                className="shrink-0 min-h-[36px] flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.07] text-[11px] font-semibold text-ink-secondary hover:text-white transition-all cursor-pointer shadow-obsidian-inner hover:shadow-obsidian-hover hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <Sparkles className="w-3 h-3 text-[#ff331f]" />
                <span>{prompt}</span>
              </button>
            ))}
          </div>
        )}

        <div className="relative flex items-end gap-2 bg-[#121216] border border-white/[0.1] rounded-2xl p-2.5 shadow-lvl2 focus-within:border-[#ff331f]/60 focus-within:ring-1 focus-within:ring-[#ff331f]/40 transition-all">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a full-stack question, request architecture review, or explore algorithms... (Shift+Enter for newline)"
            className="w-full bg-transparent resize-none border-none outline-none text-xs sm:text-sm text-ink-primary placeholder-ink-tertiary p-2 max-h-40 overflow-y-auto leading-relaxed"
          />

          {isGenerating ? (
            <button
              type="button"
              onClick={stopGeneration}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-all cursor-pointer shrink-0 shadow-lg active:scale-[0.96]"
              title="Stop Generating"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim()}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-[#ff331f] hover:bg-[#e52c1a] disabled:opacity-40 disabled:hover:bg-[#ff331f] text-white font-bold transition-all cursor-pointer shrink-0 shadow-ember-idle hover:shadow-ember-hover active:scale-[0.96] relative overflow-hidden group"
              title="Send Message"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out pointer-events-none" />
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between text-[10px] text-ink-tertiary px-1">
          <span>
            Deep Purohit Engineering Hub • Gemini 2.5 Architecture • © {new Date().getFullYear()}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1">
            <CornerDownLeft className="w-2.5 h-2.5" /> Enter to send
          </span>
        </div>
      </div>
    </div>
  );
};