import React, { useRef, useEffect } from 'react';
import { useChat } from './context/ChatContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { SettingsModal } from './components/SettingsModal';

export const AppContent: React.FC = () => {
  const { currentConversation, setSettingsModalOpen } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages]);

  // Global Keyboard Shortcut: Cmd/Ctrl + K opens Settings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSettingsModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSettingsModalOpen]);

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-ink-primary flex flex-col font-sans overflow-x-hidden relative selection:bg-[#ff331f]/30 selection:text-white">
      {/* Film-grain texture overlay */}
      <div className="film-grain" />

      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area offset for desktop sidebar */}
      <div className="lg:pl-72 flex flex-col min-h-screen relative z-10">
        <Navbar />

        {/* Message Feed */}
        <main className="flex-1 overflow-y-auto">
          {currentConversation?.messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </main>

        {/* Hero Input Dock */}
        <ChatInput />
      </div>

      {/* Settings Dialog */}
      <SettingsModal />
    </div>
  );
};

export const App: React.FC = () => {
  return <AppContent />;
};

export default App;
