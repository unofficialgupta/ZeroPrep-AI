'use client';

import React, { useState } from 'react';
import { Key, AlertTriangle, ExternalLink, Eye, EyeOff, X, CheckCircle2, Sparkles } from 'lucide-react';
import { useGeminiKey } from '@/context/GeminiKeyContext';

export default function ApiKeyModal() {
  const { isModalOpen, setIsModalOpen, saveApiKey, apiKey } = useGeminiKey();
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [showPassword, setShowPassword] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isModalOpen) return null;

  const handleSave = async () => {
    if (!inputKey.trim()) {
      setError('Please enter a valid Gemini API Key from Google AI Studio.');
      return;
    }
    setTesting(true);
    setError('');
    setSuccess(false);

    const result = await saveApiKey(inputKey);
    setTesting(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccess(false);
      }, 900);
    } else {
      setError(result.error || 'Failed to validate Gemini API Key. Please verify and try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        {/* Close button */}
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-800"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0052cc]/10 border border-[#0052cc]/25 text-[#0052cc]">
            <Key className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Gemini API Key Setup
              <span className="inline-flex items-center gap-1 rounded-full bg-[#0052cc]/10 px-2 py-0.5 text-[10px] font-bold text-[#0052cc]">
                <Sparkles className="h-2.5 w-2.5" /> 2.5 Flash
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Paste your key below for live speech & vision copilot analysis.
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span>Google AI Studio API Key</span>
              <span className="text-[11px] text-slate-400 font-medium">Saved securely in browser</span>
            </label>
            <div className="relative mt-1.5">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="AIzaSy..."
                value={inputKey}
                onChange={(e) => {
                  setInputKey(e.target.value);
                  if (error) setError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 pr-10 text-xs text-slate-900 placeholder-slate-400 transition focus:border-[#0052cc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0052cc]/15"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-700 font-semibold">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Gemini connected successfully!</span>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[#0052cc] font-medium hover:underline"
            >
              <span>Get a free Gemini API key</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium"
            >
              Continue in Demo Mode
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={handleSave}
              disabled={testing || success}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0052cc] py-2.5 px-4 text-xs font-semibold text-white shadow-md shadow-[#0052cc]/25 transition hover:bg-[#0043a8] active:bg-[#003585] disabled:opacity-60"
            >
              {testing ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Validating Key Connection...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-white" />
                  <span>Key Verified & Active</span>
                </>
              ) : (
                <span>Save & Connect Copilot</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
