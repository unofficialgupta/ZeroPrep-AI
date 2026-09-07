'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PhoneCall,
  Code2,
  FileText,
  Settings,
  Sparkles,
  Zap,
  Shield,
  ChevronRight
} from 'lucide-react';
import { useGeminiKey } from '@/context/GeminiKeyContext';

const NAV_ITEMS = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: 'Call Sessions',
    href: '/dashboard/callSessions',
    icon: PhoneCall,
    badge: 'Live HUD',
  },
  {
    name: 'DSA Copilot',
    href: '/dashboard/copilot',
    icon: Code2,
    badge: 'Gemini',
  },
  {
    name: 'Documents & Resumes',
    href: '/dashboard/documents',
    icon: FileText,
    badge: null,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    badge: null,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { activeModel } = useGeminiKey();
  const [isMac, setIsMac] = React.useState(true);

  React.useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsMac(/Mac|iPod|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
    }
  }, []);

  return (
    <aside className="flex h-screen w-64 flex-col justify-between border-r border-slate-200 bg-white p-4 select-none">
      {/* Top Section: Logo & Nav */}
      <div className="space-y-6">
        {/* ZeroPrep Brand Emblem */}
        <Link href="/dashboard/callSessions" className="flex items-center gap-3 px-2 py-1 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#0052cc] text-white shadow-md shadow-[#0052cc]/25 group-hover:scale-105 transition-transform duration-200">
            <svg
              className="h-6 w-6 text-white drop-shadow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 3h5v5" />
              <path d="M4 20L21 3" />
              <path d="M21 16v5h-5" />
              <path d="M15 15l6 6" />
              <path d="M4 4l5 5" />
            </svg>
            <div className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-400">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-tight text-slate-900">ZeroPrep</span>
              <span className="rounded bg-[#0052cc]/10 border border-[#0052cc]/20 px-1.5 py-0.2 text-[10px] font-bold text-[#0052cc]">
                AI
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500">Interview & Code Copilot</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="space-y-1">
          <p className="px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Platform
          </p>
          <div className="mt-2 space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#0052cc]/10 text-[#0052cc] font-semibold border border-[#0052cc]/20 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                        isActive
                          ? 'bg-[#0052cc] text-white shadow-sm shadow-[#0052cc]/30'
                          : 'bg-slate-100 text-slate-500 group-hover:text-slate-800 group-hover:bg-slate-200'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium border ${
                        isActive
                          ? 'bg-[#0052cc]/20 text-[#0052cc] border-[#0052cc]/30'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Bottom Section: Copilot Health & Active Model */}
      <div className="space-y-3">
        {/* Active Engine Card */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#0052cc]" />
              <span className="text-xs font-semibold text-slate-800">AI Engine</span>
            </div>
            <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active
            </span>
          </div>

          <div className="space-y-1.5 pt-1 border-t border-slate-200 text-[11px]">
            <div className="flex items-center justify-between text-slate-500">
              <span>Model</span>
              <span className="text-slate-800 font-mono text-[10px] font-semibold">{activeModel}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Avg Latency</span>
              <span className="text-emerald-600 font-mono font-semibold flex items-center gap-0.5">
                <Zap className="h-3 w-3" /> 640ms
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Stealth Mode</span>
              <span className="text-purple-600 font-medium font-mono">Protected</span>
            </div>
          </div>
        </div>

        {/* User profile / Quick shortcut banner */}
        <div className="flex items-center justify-between rounded-xl bg-slate-100 px-2 py-2 border border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0052cc] text-xs font-bold text-white shadow-xs">
              Z
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-slate-800 leading-tight">ZeroPrep Pro</p>
              <p className="text-[10px] text-slate-500">Candidate Session</p>
            </div>
          </div>
          <div className="text-[10px] bg-white text-slate-700 px-1.5 py-0.5 rounded font-mono border border-slate-200 shadow-2xs font-semibold">
            {isMac ? '⌘+⇧+S' : 'Ctrl+Shift+S'}
          </div>
        </div>
      </div>
    </aside>
  );
}
