import React, { useState } from 'react';
import { Message } from '../types/chat';
import { Sparkles, User, Copy, Check, Terminal } from 'lucide-react';

export const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.role === 'user';
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }).catch(() => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    });
  };

  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const firstLineEnd = part.indexOf('\n');
        const language = firstLineEnd !== -1 ? part.slice(3, firstLineEnd).trim() : 'code';
        const code = firstLineEnd !== -1 ? part.slice(firstLineEnd + 1, -3) : part.slice(3, -3);
        const isCopied = copiedIndex === index;

        return (
          <div
            key={index}
            className="my-4 rounded-2xl overflow-hidden border border-white/[0.1] bg-[#0c0c0e] shadow-lvl1"
          >
            <div className="flex items-center justify-between px-4 py-2 bg-white/[0.03] border-b border-white/[0.08] text-[11px] text-ink-tertiary font-mono">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#ff331f]" />
                <span className="uppercase font-semibold tracking-wider text-ink-secondary">
                  {language || 'SOURCE'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopyCode(code, index)}
                className="flex items-center gap-1.5 text-xs text-ink-secondary hover:text-white px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-all cursor-pointer"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-emerald-300/90 overflow-x-auto whitespace-pre leading-relaxed select-all">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      const lines = part.split('\n');
      return (
        <div key={index} className="space-y-2">
          {lines.map((line, lIdx) => {
            if (!line.trim()) return <div key={lIdx} className="h-2" />;

            // Headings
            if (line.startsWith('### ')) {
              return (
                <h3 key={lIdx} className="text-sm sm:text-base font-bold text-white mt-6 mb-2 tracking-tight">
                  {line.slice(4)}
                </h3>
              );
            }
            if (line.startsWith('## ')) {
              return (
                <h2 key={lIdx} className="text-base sm:text-lg font-extrabold text-white mt-8 mb-2 tracking-tight">
                  {line.slice(3)}
                </h2>
              );
            }

            // Bullet items
            const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ');
            const cleaned = isBullet ? line.trim().slice(2) : line;

            const segments = cleaned.split(/(\*\*.*?\*\*|`.*?`)/g);

            return (
              <p
                key={lIdx}
                className={`text-xs sm:text-sm text-ink-secondary leading-relaxed ${
                  isBullet ? 'pl-5 relative before:content-["•"] before:absolute before:left-1 before:text-[#ff331f] before:font-bold' : ''
                }`}
              >
                {segments.map((seg, sIdx) => {
                  if (seg.startsWith('**') && seg.endsWith('**')) {
                    return (
                      <strong key={sIdx} className="font-semibold text-white">
                        {seg.slice(2, -2)}
                      </strong>
                    );
                  }
                  if (seg.startsWith('`') && seg.endsWith('`')) {
                    return (
                      <code
                        key={sIdx}
                        className="px-1.5 py-0.5 rounded bg-white/[0.08] text-[#ff331f] font-mono text-[11px] border border-white/[0.06]"
                      >
                        {seg.slice(1, -1)}
                      </code>
                    );
                  }
                  return seg;
                })}
              </p>
            );
          })}
        </div>
      );
    });
  };

  return (
    <div
      className={`py-6 px-4 sm:px-6 transition-colors border-b ${
        isUser
          ? 'bg-transparent border-transparent'
          : 'bg-white/[0.02] border-white/[0.04]'
      }`}
    >
      <div className="max-w-3xl mx-auto flex gap-4">
        {/* Avatar */}
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border ${
            isUser
              ? 'bg-white/[0.06] text-white border-white/[0.12] shadow-obsidian-inner'
              : 'bg-[#ff331f] text-white border-[#ff331f]/40 shadow-ember-idle'
          }`}
        >
          {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
        </div>

        {/* Message body */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold text-white tracking-tight">
              {isUser ? 'Deep Purohit' : 'Gemini AI Mentor'}
            </span>
            <span className="text-[10px] text-ink-tertiary font-mono">
              {message.timestamp}
            </span>
          </div>

          <div className="text-ink-secondary">
            {renderContent(message.content)}

            {message.isStreaming && (
              <span className="inline-block w-2 h-4 bg-[#ff331f] animate-subtle-pulse ml-1.5 align-middle rounded-xs" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
