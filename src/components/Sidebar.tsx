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
import PrepZeroLogo from '@/components/PrepZeroLogo';

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
        {/* PrepZero Brand Emblem */}
        <div className="px-2 py-1">
          <PrepZeroLogo
            size="md"
            variant="horizontal"
            showTagline={true}
            tagline="Real-Time Stealth Copilot"
            href="/dashboard/callSessions"
          />
        </div>

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
