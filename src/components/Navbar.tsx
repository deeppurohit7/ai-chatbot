import React from 'react';
import { useChat } from '../context/ChatContext';
import { PERSONAS } from '../services/gemini';
import { Menu, Settings, Download, Key, Cpu } from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentConversation,
    settings,
    setSidebarOpen,
    setSettingsModalOpen,
    exportConversationMarkdown
  } = useChat();

  const activePersona = PERSONAS[settings.persona] || PERSONAS['coding-mentor'];
  const hasKey = Boolean(settings.apiKey?.trim());

  return (
    <header className="sticky top-0 z-40 h-16 bg-[#0a0a0b]/90 backdrop-blur-md border-b border-white/[0.08] px-4 sm:px-6 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3.5 min-w-0">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-ink-secondary hover:text-ink-primary hover:bg-white/[0.05] rounded-xl transition-all lg:hidden cursor-pointer"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <h1 className="text-xs sm:text-sm font-bold text-ink-primary truncate tracking-tight">
              {currentConversation?.title || 'New Conversation'}
            </h1>
            <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/[0.04] text-ink-secondary border border-white/[0.06]">
              <Cpu className="w-3 h-3 text-[#ff331f]" />
              {settings.model}
            </span>
          </div>

          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff331f] animate-pulse"></span>
            <span className="text-[10px] font-medium text-ink-tertiary tracking-wide">
              {activePersona.title} • {activePersona.subtitle}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={exportConversationMarkdown}
          className="min-h-[44px] px-3.5 hidden sm:flex items-center gap-1.5 rounded-full text-xs font-semibold text-ink-secondary hover:text-ink-primary bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] shadow-obsidian-inner hover:shadow-obsidian-hover transition-all cursor-pointer"
          title="Export thread as Markdown (.md)"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>

        <button
          type="button"
          onClick={() => setSettingsModalOpen(true)}
          className={`min-h-[44px] px-4 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer relative overflow-hidden ${
            hasKey
              ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/60 shadow-lvl1'
              : 'bg-[#ff331f] text-white shadow-ember-idle hover:shadow-ember-hover active:scale-[0.97] hover:-translate-y-0.5'
          }`}
          title={hasKey ? 'Gemini API Key Connected' : 'Connect Google Gemini API Key'}
        >
          {!hasKey && (
            <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 animate-specular-sweep pointer-events-none" />
          )}

          <Key className="w-3.5 h-3.5 shrink-0" />
          <span className="tracking-tight">{hasKey ? 'Gemini 2.5 Active' : 'Connect API Key'}</span>
        </button>

        <button
          type="button"
          onClick={() => setSettingsModalOpen(true)}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-ink-secondary hover:text-ink-primary border border-white/[0.08] shadow-obsidian-inner hover:shadow-obsidian-hover active:scale-[0.96] transition-all cursor-pointer"
          title="Open Settings & Model Configuration"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};