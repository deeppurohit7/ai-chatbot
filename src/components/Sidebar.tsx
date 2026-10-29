import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import {
  Plus,
  MessageSquare,
  Trash2,
  Edit2,
  Check,
  X,
  Settings,
  Sparkles,
  Terminal,
  RotateCcw
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    conversations,
    currentConversation,
    createConversation,
    selectConversation,
    deleteConversation,
    renameConversation,
    sidebarOpen,
    setSidebarOpen,
    setSettingsModalOpen,
    clearAllConversations
  } = useChat();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleStartRename = (id: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(id);
    setEditTitle(currentTitle);
  };

  const handleSaveRename = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      renameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0a0a0b] border-r border-white/[0.08] flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] text-ink-primary ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-white/[0.08] flex items-center justify-between">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              selectConversation(conversations[0]?.id || 'conv-1');
            }}
            className="flex items-center gap-3 group"
          >
            <div className="w-8 h-8 rounded-full bg-[#ff331f] text-white flex items-center justify-center font-bold shadow-ember-idle group-hover:shadow-ember-hover transition-all">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight block text-white group-hover:text-white transition-colors">
                Gemini Spark
              </span>
              <span className="text-[10px] font-semibold text-ink-tertiary uppercase tracking-widest block">
                Engineering AI
              </span>
            </div>
          </a>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-ink-tertiary hover:text-white rounded-xl lg:hidden cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Action Button: Radiant Ember Glow CTA */}
        <div className="p-4">
          <button
            type="button"
            onClick={() => createConversation()}
            className="w-full min-h-[44px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-[#ff331f] hover:bg-[#e52c1a] text-white font-bold text-xs tracking-wide shadow-ember-idle hover:shadow-ember-hover active:scale-[0.97] transition-all cursor-pointer relative overflow-hidden group"
          >
            {/* Specular Shimmer Sweep */}
            <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-[250%] transition-transform duration-700 ease-in-out pointer-events-none" />

            <Plus className="w-4 h-4" />
            <span>New Session</span>
          </button>
        </div>

        {/* Conversations Thread List */}
        <div className="flex-1 overflow-y-auto px-3 space-y-1">
          <div className="px-3 py-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-ink-tertiary">
            <span>Recent Sessions ({conversations.length})</span>
            {conversations.length > 1 && (
              <button
                type="button"
                onClick={clearAllConversations}
                className="hover:text-ink-secondary transition-colors cursor-pointer flex items-center gap-1"
                title="Reset session history"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {conversations.map((c) => {
            const isActive = currentConversation?.id === c.id;

            return (
              <div
                key={c.id}
                onClick={() => selectConversation(c.id)}
                className={`group min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all border ${
                  isActive
                    ? 'bg-white/[0.06] text-white border-white/[0.12] shadow-lvl1'
                    : 'text-ink-secondary hover:bg-white/[0.03] hover:text-ink-primary border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isActive ? 'bg-[#ff331f]' : 'bg-white/20 group-hover:bg-white/40'
                    }`}
                  />

                  {editingId === c.id ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveRename(c.id, e as any);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      className="bg-black/60 text-white px-2 py-1 rounded border border-white/20 text-xs w-full focus:outline-none focus:ring-1 focus:ring-[#ff331f]"
                      autoFocus
                    />
                  ) : (
                    <span className="truncate">{c.title}</span>
                  )}
                </div>

                {/* Edit & Delete actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {editingId === c.id ? (
                    <button
                      type="button"
                      onClick={(e) => handleSaveRename(c.id, e)}
                      className="p-1 hover:text-emerald-400 text-ink-tertiary cursor-pointer"
                      title="Save title"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => handleStartRename(c.id, c.title, e)}
                      className="p-1 hover:text-ink-primary text-ink-tertiary cursor-pointer"
                      title="Rename"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(c.id);
                    }}
                    className="p-1 hover:text-[#ff331f] text-ink-tertiary cursor-pointer"
                    title="Delete session"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer User Profile Card */}
        <div className="p-3 border-t border-white/[0.08] bg-[#0c0c0e]">
          <button
            type="button"
            onClick={() => setSettingsModalOpen(true)}
            className="w-full min-h-[44px] flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.04] transition-all text-left text-xs cursor-pointer group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-white/[0.08] text-white font-bold text-xs flex items-center justify-center border border-white/[0.12] shadow-obsidian-inner">
                  DP
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0a0a0b]" />
              </div>

              <div className="min-w-0">
                <span className="font-bold text-ink-primary block truncate group-hover:text-white transition-colors">
                  Deep Purohit
                </span>
                <span className="text-[10px] text-ink-tertiary block truncate">
                  Full-Stack Developer
                </span>
              </div>
            </div>

            <Settings className="w-4 h-4 text-ink-tertiary group-hover:text-ink-primary transition-colors" />
          </button>
        </div>
      </aside>
    </>
  );
};
