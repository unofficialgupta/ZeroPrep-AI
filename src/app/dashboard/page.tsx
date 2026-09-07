'use client';

import React from 'react';
import Link from 'next/link';
import {
  PhoneCall,
  Code2,
  Settings,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-blue-50 via-white to-slate-50 p-8 shadow-xs">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#0052cc]/10 border border-[#0052cc]/20 px-3 py-1 text-xs font-semibold text-[#0052cc]">
            <Sparkles className="h-3.5 w-3.5" />
            ZeroPrep Copilot v2.5 Engine
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Real-Time AI Interview & Coding Copilot
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed">
            Ultra low-latency vision & audio loopback assistant. Detect bugs, derive optimal asymptotic complexities, and generate clean runnable code in real-time during coding screens.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/dashboard/callSessions"
              className="flex items-center gap-2 rounded-xl bg-[#0052cc] px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-[#0052cc]/25 transition hover:bg-[#0043a8]"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Explore Call Sessions</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/dashboard/copilot"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 shadow-2xs"
            >
              <Code2 className="h-4 w-4 text-[#0052cc]" />
              <span>Live DSA Workbench</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          href="/dashboard/callSessions"
          className="group rounded-2xl border border-slate-200 bg-white p-6 space-y-3 hover:border-[#0052cc]/50 hover:shadow-md transition shadow-xs"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0052cc]/10 border border-[#0052cc]/25 text-[#0052cc]">
            <PhoneCall className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-[#0052cc] transition">
            Call Sessions Archive
          </h3>
          <p className="text-xs text-slate-500">
            Review past interviews, split-view transcripts, problem statements, and Gemini solution logs.
          </p>
        </Link>

        <Link
          href="/dashboard/copilot"
          className="group rounded-2xl border border-slate-200 bg-white p-6 space-y-3 hover:border-[#0052cc]/50 hover:shadow-md transition shadow-xs"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 border border-purple-200 text-purple-600">
            <Code2 className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition">
            DSA & Problem Solver
          </h3>
          <p className="text-xs text-slate-500">
            Paste screenshots or code editor snippets to get instant bug diagnoses and optimal O(1) fixes.
          </p>
        </Link>

        <Link
          href="/dashboard/settings"
          className="group rounded-2xl border border-slate-200 bg-white p-6 space-y-3 hover:border-[#0052cc]/50 hover:shadow-md transition shadow-xs"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600">
            <Settings className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition">
            Copilot & Key Config
          </h3>
          <p className="text-xs text-slate-500">
            Manage your Google Gemini API key, switch between models, and configure hotkey shortcuts.
          </p>
        </Link>
      </div>
    </div>
  );
}
