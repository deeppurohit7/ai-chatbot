import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Conversation, Message, UserSettings, PersonaType } from '../types/chat';
import { GeminiService, PERSONAS } from '../services/gemini';

const CONVERSATIONS_STORAGE = 'gemini_chat_conversations_v2';
const SETTINGS_STORAGE = 'gemini_chat_settings_v2';

interface ChatContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  settings: UserSettings;
  isGenerating: boolean;
  createConversation: (persona?: PersonaType) => void;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  renameConversation: (id: string, newTitle: string) => void;
  sendMessage: (content: string) => Promise<void>;
  stopGeneration: () => void;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  exportConversationMarkdown: () => void;
  clearAllConversations: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  settingsModalOpen: boolean;
  setSettingsModalOpen: (open: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const initialConversation: Conversation = {
  id: 'conv-1',
  title: 'Full-Stack Architecture & Mentorship',
  persona: 'coding-mentor',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  messages: [
    {
      id: 'm-welcome',
      role: 'assistant',
      content: `### Welcome Deep! 👋

I'm your **Senior Full-Stack Mentor & AI Engineering Collaborator**, architected to guide you from foundational code to production-scale mastery across:

- **React 18 & Angular 17+:** Component lifecycle, Signals, custom hooks, and state orchestration.
- **Node.js, Express & MongoDB:** Resilient REST/GraphQL APIs, indexing strategies, and auth workflows.
- **Production UI/UX Systems:** Mathematical spacing, volumetric light, and Framer Motion micro-interactions.

Click any quick-prompt below, or enter your **Google Gemini API Key** in **Settings (⚙️)** to connect live!`,
      timestamp: 'Just now'
    }
  ]
};

const defaultSettings: UserSettings = {
  apiKey: '',
  model: 'gemini-2.5-flash',
  temperature: 0.7,
  persona: 'coding-mentor',
  maxTokens: 2048,
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem(CONVERSATIONS_STORAGE);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [initialConversation];
  });

  const [currentConvId, setCurrentConvId] = useState<string>(() => {
    return conversations[0]?.id || 'conv-1';
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE);
      if (saved) return { ...defaultSettings, ...JSON.parse(saved) };
    } catch {
      // Fallback
    }
    return defaultSettings;
  });

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState<boolean>(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CONVERSATIONS_STORAGE, JSON.stringify(conversations));
    } catch {
      // Storage full
    }
  }, [conversations]);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE, JSON.stringify(settings));
    } catch {
      // Storage full
    }
  }, [settings]);

  const currentConversation = conversations.find((c) => c.id === currentConvId) || conversations[0] || null;

  const createConversation = (persona?: PersonaType) => {
    const newPersona = persona || settings.persona;
    const personaMeta = PERSONAS[newPersona] || PERSONAS['coding-mentor'];
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      title: 'New Conversation',
      persona: newPersona,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `m-init-${Date.now()}`,
          role: 'assistant',
          content: `### ${personaMeta.title} Session Started\n\nHow can I accelerate your engineering build today? You can ask for code reviews, architectural blueprints, or technical mock questions.`,
          timestamp: 'Just now'
        }
      ]
    };

    setConversations((prev) => [newConv, ...prev]);
    setCurrentConvId(newConv.id);
    setSidebarOpen(false);
  };

  const selectConversation = (id: string) => {
    setCurrentConvId(id);
    setSidebarOpen(false);
  };

  const deleteConversation = (id: string) => {
    setConversations((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      if (filtered.length === 0) {
        return [initialConversation];
      }
      return filtered;
    });
    if (currentConvId === id) {
      const remaining = conversations.filter((c) => c.id !== id);
      setCurrentConvId(remaining[0]?.id || initialConversation.id);
    }
  };

  const renameConversation = (id: string, newTitle: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle, updatedAt: new Date().toISOString() } : c))
    );
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || isGenerating) return;

    const userMessage: Message = {
      id: `m-user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const assistantMessageId = `m-ai-${Date.now()}`;
    const assistantPlaceholder: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true
    };

    let targetConv = currentConversation;
    if (!targetConv) {
      createConversation();
      return;
    }

    // Auto-derive conversation title from first user message if default
    let updatedTitle = targetConv.title;
    if (targetConv.title === 'New Conversation' || targetConv.title === 'Welcome & Coding Mentorship') {
      updatedTitle = content.slice(0, 36).trim() + (content.length > 36 ? '...' : '');
    }

    const updatedMessages = [...targetConv.messages, userMessage, assistantPlaceholder];

    setConversations((prev) =>
      prev.map((c) =>
        c.id === targetConv!.id
          ? {
              ...c,
              title: updatedTitle,
              messages: updatedMessages,
              updatedAt: new Date().toISOString()
            }
          : c
      )
    );

    setIsGenerating(true);
    abortControllerRef.current = new AbortController();

    try {
      await GeminiService.streamChat(
        [...targetConv.messages, userMessage],
        settings,
        (chunkText) => {
          setConversations((prev) =>
            prev.map((c) => {
              if (c.id !== targetConv!.id) return c;
              return {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === assistantMessageId
                    ? { ...m, content: m.content + chunkText }
                    : m
                )
              };
            })
          );
        },
        abortControllerRef.current.signal
      );
    } catch (err: any) {
      const errorMessage = err?.message || 'An error occurred while streaming response.';
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== targetConv!.id) return c;
          return {
            ...c,
            messages: c.messages.map((m) =>
              m.id === assistantMessageId
                ? {
                    ...m,
                    content: `⚠️ **Generation Error:** ${errorMessage}\n\nPlease verify your Gemini API key in Settings (⚙️).`
                  }
                : m
            )
          };
        })
      );
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== targetConv!.id) return c;
          return {
            ...c,
            messages: c.messages.map((m) =>
              m.id === assistantMessageId ? { ...m, isStreaming: false } : m
            )
          };
        })
      );
    }
  };

  const exportConversationMarkdown = () => {
    if (!currentConversation) return;
    let md = `# ${currentConversation.title}\n`;
    md += `*Exported on ${new Date().toLocaleDateString()} | Persona: ${currentConversation.persona}*\n\n---\n\n`;

    currentConversation.messages.forEach((m) => {
      md += `### ${m.role === 'user' ? 'Deep Purohit' : 'Gemini AI'} (${m.timestamp})\n\n`;
      md += `${m.content}\n\n---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentConversation.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearAllConversations = () => {
    setConversations([initialConversation]);
    setCurrentConvId(initialConversation.id);
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversation,
        settings,
        isGenerating,
        createConversation,
        selectConversation,
        deleteConversation,
        renameConversation,
        sendMessage,
        stopGeneration,
        updateSettings,
        exportConversationMarkdown,
        clearAllConversations,
        sidebarOpen,
        setSidebarOpen,
        settingsModalOpen,
        setSettingsModalOpen
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
