import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { PERSONAS } from '../services/gemini';
import { PersonaType } from '../types/chat';
import { X, Key, Sliders, ExternalLink, CheckCircle2, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const { settings, updateSettings, settingsModalOpen, setSettingsModalOpen } = useChat();

  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [model, setModel] = useState(settings.model);
  const [temperature, setTemperature] = useState(settings.temperature);
  const [persona, setPersona] = useState<PersonaType>(settings.persona);
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!settingsModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      apiKey: apiKey.trim(),
      model,
      temperature,
      persona
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setSettingsModalOpen(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity">
      <div className="bg-[#121216] rounded-3xl w-full max-w-lg shadow-lvl3 border border-white/[0.1] overflow-hidden text-ink-primary">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.08] bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#ff331f] text-white flex items-center justify-center font-bold shadow-ember-idle">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold block text-white tracking-tight">System & Model Settings</h2>
              <p className="text-[11px] text-ink-tertiary">Google Gemini 2.5 API parameters & AI Persona</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSettingsModalOpen(false)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-ink-tertiary hover:text-white rounded-xl transition-colors cursor-pointer"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSave} className="p-6 space-y-6">
          {/* API Key */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[#ff331f]" />
                Google Gemini API Key
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#ff331f] hover:underline flex items-center gap-1"
              >
                <span>Get API Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative flex items-center">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-[#0a0a0b] border border-white/[0.1] rounded-xl px-3.5 py-2.5 pr-11 text-xs text-white placeholder-ink-tertiary font-mono focus:outline-none focus:border-[#ff331f] focus:ring-1 focus:ring-[#ff331f]"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2.5 p-1 text-ink-tertiary hover:text-white cursor-pointer"
                title={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-ink-tertiary flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Stored strictly in your local browser sandbox. Never transmitted to third-party servers.
            </p>
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-white block">
              Gemini Model Architecture
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', desc: 'Ultra-low latency reasoning' },
                { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', desc: 'Deep architectural synthesis' }
              ].map((m) => (
                <div
                  key={m.id}
                  onClick={() => setModel(m.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    model === m.id
                      ? 'border-[#ff331f] bg-white/[0.04] shadow-lvl1'
                      : 'border-white/[0.08] hover:border-white/[0.16] bg-black/20'
                  }`}
                >
                  <span className="text-xs font-bold block text-white">{m.name}</span>
                  <span className="text-[10px] text-ink-tertiary block mt-0.5">{m.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Persona Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-white block">
              Active Mentorship Persona
            </label>
            <div className="space-y-2">
              {Object.values(PERSONAS).map((p) => (
                <div
                  key={p.id}
                  onClick={() => setPersona(p.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    persona === p.id
                      ? 'border-[#ff331f] bg-white/[0.04] shadow-lvl1'
                      : 'border-white/[0.08] hover:border-white/[0.16] bg-black/20'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold block text-white">{p.title}</span>
                    <span className="text-[10px] text-ink-tertiary block">{p.subtitle}</span>
                  </div>
                  <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-white/[0.06] text-ink-secondary border border-white/[0.08]">
                    {p.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Temperature Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white block">
                Temperature (Creativity vs Determinism)
              </label>
              <span className="text-xs font-mono font-bold text-[#ff331f]">
                {temperature.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-[#ff331f] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-ink-tertiary">
              <span>0.0 (Deterministic Code)</span>
              <span>1.0 (Creative Architecture)</span>
            </div>
          </div>

          {/* Footer Save Button */}
          <div className="pt-2 border-t border-white/[0.08] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setSettingsModalOpen(false)}
              className="min-h-[44px] px-4 rounded-full text-xs font-semibold text-ink-secondary hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-6 rounded-full bg-[#ff331f] hover:bg-[#e52c1a] text-white text-xs font-bold shadow-ember-idle hover:shadow-ember-hover active:scale-[0.97] transition-all cursor-pointer flex items-center gap-2"
            >
              {saved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Save Configuration</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
