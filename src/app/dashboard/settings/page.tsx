'use client';

import React, { useState } from 'react';
import {
  Key,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Shield,
  Eye,
  EyeOff,
  Save,
  Cpu,
  Mic
} from 'lucide-react';
import { useGeminiKey } from '@/context/GeminiKeyContext';

export default function SettingsPage() {
  const {
    apiKey,
    saveApiKey,
    removeApiKey,
    isKeyConfigured,
    isValidating,
    activeModel,
    setActiveModel,
  } = useGeminiKey();

  const [inputKey, setInputKey] = useState(apiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const [stealthProtected, setStealthProtected] = useState(true);
  const [sttProvider, setSttProvider] = useState('deepgram');

  // Load persisted settings - ZP-BUG-006
  React.useEffect(() => {
    try {
      const savedStealth = localStorage.getItem('zeroprep_stealth_protection');
      if (savedStealth !== null) {
        setStealthProtected(savedStealth === 'true');
      }
      const savedSTT = localStorage.getItem('zeroprep_stt_provider');
      if (savedSTT) {
        setSttProvider(savedSTT);
      }
    } catch (e) {
      console.warn('Storage read restricted:', e);
    }
  }, []);

  const handleToggleStealthProtection = (val: boolean) => {
    setStealthProtected(val);
    try {
      localStorage.setItem('zeroprep_stealth_protection', String(val));
    } catch {}
    const desktop = (window as any).zeroPrepDesktop || (window as any).parakeetDesktop;
    desktop?.setStealthProtection?.(val);
  };

  const handleChangeSttProvider = (val: string) => {
    setSttProvider(val);
    try {
      localStorage.setItem('zeroprep_stt_provider', val);
    } catch {}
  };

  const handleSaveKey = async () => {
    setSaveMessage(null);
    const res = await saveApiKey(inputKey);
    if (res.success) {
      setSaveMessage({ type: 'success', text: 'Gemini API key successfully verified and stored!' });
    } else {
      setSaveMessage({ type: 'error', text: res.error || 'Failed to validate API key.' });
    }
  };

  const handleClearKey = () => {
    removeApiKey();
    setInputKey('');
    setSaveMessage({ type: 'success', text: 'API Key removed. Running in simulated demo mode.' });
  };

  return (
    <div className="max-w-4xl space-y-8 pb-16">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Settings & Engine Config</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your Google Gemini API credentials, models, STT providers, and stealth window protection.
        </p>
      </div>

      {/* 1. Gemini API Key Configuration Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0052cc]/10 border border-[#0052cc]/25 text-[#0052cc]">
              <Key className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Google Gemini API Key</h3>
              <p className="text-xs text-slate-500">
                Used to power real-time code fixes, bug analysis, and screen understanding.
              </p>
            </div>
          </div>

          {isKeyConfigured ? (
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Active
            </span>
          ) : (
            <span className="flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-800">
              <AlertTriangle className="h-3.5 w-3.5" />
              Missing Key
            </span>
          )}
        </div>

        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-700">API Key</label>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pr-10 text-xs text-slate-900 placeholder-slate-400 focus:border-[#0052cc] focus:bg-white focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {saveMessage && (
            <div
              className={`flex items-center gap-2 rounded-xl p-3 text-xs border ${
                saveMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-rose-50 border-rose-200 text-rose-700'
              }`}
            >
              {saveMessage.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <AlertTriangle className="h-4 w-4 shrink-0" />
              )}
              <span>{saveMessage.text}</span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs text-[#0052cc] font-medium hover:underline"
            >
              <span>Get API key on Google AI Studio</span>
              <ExternalLink className="h-3 w-3" />
            </a>

            <div className="flex items-center gap-2">
              {isKeyConfigured && (
                <button
                  type="button"
                  onClick={handleClearKey}
                  className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition"
                >
                  Clear Key
                </button>
              )}

              <button
                type="button"
                onClick={handleSaveKey}
                disabled={isValidating}
                className="flex items-center gap-1.5 rounded-xl bg-[#0052cc] px-4 py-2 text-xs font-semibold text-white shadow-md shadow-[#0052cc]/25 hover:bg-[#0043a8] transition disabled:opacity-60"
              >
                {isValidating ? (
                  <>
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-3.5 w-3.5" />
                    <span>Save & Test Key</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Model & STT Provider Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Cpu className="h-4 w-4 text-[#0052cc]" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Gemini Vision Model
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Recommended: <code className="text-slate-800 font-semibold">gemini-2.5-flash</code> for sub-800ms answers.
          </p>

          <select
            value={activeModel}
            onChange={(e) => setActiveModel(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:border-[#0052cc] focus:bg-white focus:outline-none"
          >
            <option value="gemini-2.5-flash">gemini-2.5-flash (Low-latency vision & audio)</option>
            <option value="gemini-1.5-pro">gemini-1.5-pro (High depth reasoning)</option>
            <option value="gemini-2.5-pro">gemini-2.5-pro (Next-gen reasoning)</option>
          </select>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Mic className="h-4 w-4 text-purple-600" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Speech-to-Text Provider
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Transcribes interviewer voice loopback and candidate microphone.
          </p>

          <select
            value={sttProvider}
            onChange={(e) => handleChangeSttProvider(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 focus:border-[#0052cc] focus:bg-white focus:outline-none"
          >
            <option value="deepgram">Deepgram Nova-2 (Live WebSockets)</option>
            <option value="browser-speech">Browser Web Speech API (Local & Free)</option>
            <option value="whisper-local">Local Whisper C++ (Offline)</option>
          </select>
        </div>
      </div>

      {/* 3. Stealth Protection & Global Hotkeys */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <Shield className="h-5 w-5 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Invisible Stealth HUD & Content Protection
            </h3>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={stealthProtected}
              onChange={(e) => handleToggleStealthProtection(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0052cc]"></div>
          </label>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          When active, Electron applies <code className="text-slate-800 font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 font-semibold">win.setContentProtection(true)</code>. Zoom, Google Meet, Teams, and Discord screen-sharing feeds filter out the floating ZeroPrep overlay from candidate broadcasts on Windows & macOS.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-700">Instant Screen Capture Hotkey</span>
            <span className="font-mono text-xs bg-white border border-slate-200 px-2 py-1 rounded text-slate-800 font-semibold shadow-2xs">
              {typeof navigator !== 'undefined' && /Mac/.test(navigator.platform || navigator.userAgent) ? '⌘+⇧+S' : 'Ctrl+Shift+S'}
            </span>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-700">Toggle Stealth HUD Overlay</span>
            <span className="font-mono text-xs bg-white border border-slate-200 px-2 py-1 rounded text-slate-800 font-semibold shadow-2xs">
              {typeof navigator !== 'undefined' && /Mac/.test(navigator.platform || navigator.userAgent) ? '⌘+\\' : 'Ctrl+\\'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
