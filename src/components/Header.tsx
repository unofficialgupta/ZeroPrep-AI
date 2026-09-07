'use client';

import React, { useEffect, useState } from 'react';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Shield,
  Command
} from 'lucide-react';
import { useGeminiKey } from '@/context/GeminiKeyContext';
import { useSearch } from '@/context/SearchContext';

interface HeaderProps {
  onNewSessionClick?: () => void;
  onToggleStealth?: () => void;
  isStealthActive?: boolean;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export default function Header({
  onNewSessionClick,
  onToggleStealth,
  isStealthActive = false,
  searchQuery: propQuery,
  onSearchChange: propOnChange,
}: HeaderProps) {
  const { isKeyConfigured, setIsModalOpen, activeModel } = useGeminiKey();
  const searchCtx = useSearch();

  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsMac(/Mac|iPod|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
    }
  }, []);

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchCtx.focusSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchCtx]);

  const activeQuery = propQuery !== undefined ? propQuery : searchCtx.searchQuery;
  const handleQueryChange = (val: string) => {
    if (propOnChange) propOnChange(val);
    searchCtx.setSearchQuery(val);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur-md">
      {/* Search Input Bar */}
      <div className="flex items-center gap-3 w-full max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            ref={searchCtx.searchInputRef}
            type="text"
            placeholder="Search sessions, topics, algorithms or companies..."
            value={activeQuery}
            onChange={(e) => handleQueryChange(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-12 text-xs text-slate-900 placeholder-slate-400 transition focus:border-[#0052cc] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0052cc]/15"
          />
          <button
            type="button"
            onClick={() => searchCtx.focusSearch()}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded bg-slate-200/80 hover:bg-slate-300 px-1.5 py-0.5 text-[10px] text-slate-600 font-medium transition cursor-pointer"
            title={`Focus search (${isMac ? '⌘' : 'Ctrl'}+K)`}
          >
            {isMac ? <Command className="h-2.5 w-2.5" /> : <span>Ctrl</span>}
            <span>K</span>
          </button>
        </div>
      </div>

      {/* Header Actions & Badges */}
      <div className="flex items-center gap-3">
        {/* Stealth Mode HUD Indicator / Toggle */}
        <button
          onClick={onToggleStealth}
          title="Toggle Floating Stealth HUD (Protected from screen share)"
          className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition border ${
            isStealthActive
              ? 'bg-purple-50 text-purple-700 border-purple-300 shadow-xs'
              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Shield className={`h-3.5 w-3.5 ${isStealthActive ? 'text-purple-600 animate-pulse' : 'text-slate-500'}`} />
          <span className="hidden sm:inline">Stealth HUD</span>
          <span className={`h-2 w-2 rounded-full ${isStealthActive ? 'bg-purple-600 animate-ping' : 'bg-slate-400'}`} />
        </button>

        {/* Dynamic API Key Status Badge */}
        {isKeyConfigured ? (
          <button
            onClick={() => setIsModalOpen(true)}
            title={`Connected to ${activeModel}. Click to manage key.`}
            className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100/70"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span className="hidden md:inline">Gemini Active</span>
            <span className="rounded bg-emerald-200/70 px-1.5 py-0.2 text-[10px] text-emerald-800 font-mono">
              {activeModel.replace('gemini-', '')}
            </span>
          </button>
        ) : (
          <button
            onClick={() => setIsModalOpen(true)}
            title="Configure your Google Gemini API Key"
            className="flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2 text-xs font-semibold text-amber-800 transition hover:bg-amber-100/80 animate-pulse"
          >
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
            <span>Missing Key (Click to Configure)</span>
          </button>
        )}

        {/* New Session Button */}
        <button
          onClick={onNewSessionClick}
          className="flex items-center gap-2 rounded-xl bg-[#0052cc] px-4 py-2 text-xs font-semibold text-white shadow-md shadow-[#0052cc]/25 transition hover:bg-[#0043a8] active:bg-[#003585]"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          <span>New Session</span>
        </button>
      </div>
    </header>
  );
}
