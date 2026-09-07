'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Download,
  Shield,
  Zap,
  Mic,
  Volume2,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Check,
  ChevronDown,
  Monitor,
  Terminal,
  ExternalLink,
  Laptop,
  Layers,
  Lock
} from 'lucide-react';

export default function MarketingHomePage() {
  const [userOS, setUserOS] = useState<'mac' | 'windows' | 'linux'>('mac');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent.toLowerCase();
      if (ua.includes('win')) {
        setUserOS('windows');
      } else if (ua.includes('linux')) {
        setUserOS('linux');
      } else {
        setUserOS('mac');
      }
    }
  }, []);

  const getDownloadHref = (os: 'mac' | 'windows' | 'linux') => {
    switch (os) {
      case 'windows':
        return '/downloads/ZeroPrep-AI-Setup-1.0.0.exe';
      case 'linux':
        return '/downloads/ZeroPrep-AI-1.0.0.AppImage';
      case 'mac':
      default:
        return '/downloads/ZeroPrep-AI-1.0.0.dmg';
    }
  };

  const getDownloadFilename = (os: 'mac' | 'windows' | 'linux') => {
    switch (os) {
      case 'windows':
        return 'ZeroPrep-AI-Setup-1.0.0.exe';
      case 'linux':
        return 'ZeroPrep-AI-1.0.0.AppImage';
      case 'mac':
      default:
        return 'ZeroPrep-AI-1.0.0.dmg';
    }
  };

  const getOSLabel = (os: 'mac' | 'windows' | 'linux') => {
    switch (os) {
      case 'windows':
        return 'Windows (64-bit .exe)';
      case 'linux':
        return 'Linux (.AppImage)';
      case 'mac':
      default:
        return 'macOS (.dmg Apple Silicon / Intel)';
    }
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ZeroPrep AI',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'macOS, Windows, Linux',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description:
      'Stealth AI copilot for coding and technical interviews with dual-channel audio loopback and screen invisibility.',
  };

  return (
    <div className="relative overflow-hidden">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Background Decorative Gradients */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[560px] w-[1000px] -translate-x-1/2 bg-gradient-to-b from-blue-100/70 via-indigo-50/40 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-[600px] -left-48 -z-10 h-96 w-96 rounded-full bg-blue-100/50 blur-3xl" />
      <div className="pointer-events-none absolute top-[900px] -right-48 -z-10 h-96 w-96 rounded-full bg-indigo-100/50 blur-3xl" />

      {/* ─────────────────── HERO SECTION ─────────────────── */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-3.5 py-1.5 text-xs font-semibold text-blue-700 shadow-sm backdrop-blur-md mb-6 hover:bg-blue-100/80 transition-colors">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span>ZeroPrep AI Desktop v1.0 Released</span>
            <span className="text-blue-400">•</span>
            <span className="text-blue-600 font-medium">100% Invisible to Zoom & Meet</span>
          </div>

          {/* Headline */}
          <h1 className="mx-auto max-w-4xl text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] sm:leading-[1.08]">
            Never Freeze in a{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 bg-clip-text text-transparent">
              Technical Interview
            </span>{' '}
            Again.
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-slate-600 leading-relaxed">
            The high-performance AI copilot that hears your interviewer through internal audio loopback,
            analyzes your live code editor, and suggests optimal solutions in real time — completely undetectable on screen share.
          </p>

          {/* Download CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Primary Detected Download */}
            <a
              href={getDownloadHref(userOS)}
              download={getDownloadFilename(userOS)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-2xl hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Download className="h-5 w-5" />
              <span>Download for {getOSLabel(userOS)}</span>
            </a>

            {/* Other Platforms Selector / Direct Hub */}
            <Link
              href="/download"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-6 py-4 text-base font-semibold text-slate-700 shadow-sm backdrop-blur-md transition-all hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300"
            >
              <Laptop className="h-4 w-4 text-slate-500" />
              <span>All Downloads & OS versions</span>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </Link>
          </div>

          {/* OS Quick Links & Guarantees */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 font-medium">
            <span>Also available for:</span>
            <a
              href="/downloads/ZeroPrep-AI-1.0.0.dmg"
              download="ZeroPrep-AI-1.0.0.dmg"
              className="hover:text-blue-600 transition-colors underline underline-offset-2"
            >
              macOS (.dmg)
            </a>
            <span>•</span>
            <a
              href="/downloads/ZeroPrep-AI-Setup-1.0.0.exe"
              download="ZeroPrep-AI-Setup-1.0.0.exe"
              className="hover:text-blue-600 transition-colors underline underline-offset-2"
            >
              Windows (.exe)
            </a>
            <span>•</span>
            <a
              href="/downloads/ZeroPrep-AI-1.0.0.AppImage"
              download="ZeroPrep-AI-1.0.0.AppImage"
              className="hover:text-blue-600 transition-colors underline underline-offset-2"
            >
              Linux (.AppImage)
            </a>
          </div>

          {/* Trust Guarantees */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-600 font-medium">
            <div className="flex items-center gap-1.5 text-slate-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>100% Free AI Tier (BYOK)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>No Subscription Traps</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Invisible to Screen Capture</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>Zero Virtual Cables Required</span>
            </div>
          </div>

          {/* ─────────────────── PREVIEW SHOWCASE ─────────────────── */}
          <div className="mt-14 relative mx-auto max-w-5xl rounded-2xl p-2 bg-gradient-to-b from-slate-200/80 to-slate-100/50 shadow-2xl border border-slate-200">
            <div className="relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800 shadow-inner">
              {/* Window Bar Mockup */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/80">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-slate-400">
                    ZeroPrep AI Stealth HUD — Live Audio & Screen Session
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  STEALTH ACTIVE (Window Excluded)
                </div>
              </div>

              {/* High Quality App Image */}
              <div className="relative aspect-video w-full bg-slate-950">
                <Image
                  src="/zeroprep-preview.jpg"
                  alt="ZeroPrep AI Stealth HUD Interface"
                  width={1280}
                  height={720}
                  priority
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Feature Callout Floating Pills */}
            <div className="absolute -bottom-5 left-8 hidden lg:flex items-center gap-2 rounded-xl bg-white/95 px-4 py-2.5 shadow-lg border border-slate-200 text-xs font-semibold text-slate-800 backdrop-blur-md">
              <Volume2 className="h-4 w-4 text-blue-600" />
              <span>Dual-Channel Audio Loopback: Active</span>
            </div>
            <div className="absolute -bottom-5 right-8 hidden lg:flex items-center gap-2 rounded-xl bg-white/95 px-4 py-2.5 shadow-lg border border-slate-200 text-xs font-semibold text-slate-800 backdrop-blur-md">
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span>Powered by Google Gemini 2.5 Flash</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── METRICS & STATS ─────────────────── */}
      <section className="border-y border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 tracking-tight">0.00%</div>
              <div className="mt-1 text-sm font-medium text-slate-600">Screen Capture Leak Rate</div>
              <div className="text-xs text-slate-400">OS Window Exclusion</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">&lt; 650ms</div>
              <div className="mt-1 text-sm font-medium text-slate-600">Gemini 2.5 Flash Response</div>
              <div className="text-xs text-slate-400">Direct Google AI Endpoint</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 tracking-tight">2-Way</div>
              <div className="mt-1 text-sm font-medium text-slate-600">Synchronous Audio</div>
              <div className="text-xs text-slate-400">Interviewer + Your Mic</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">$0 / mo</div>
              <div className="mt-1 text-sm font-medium text-slate-600">No Monthly Fees</div>
              <div className="text-xs text-slate-400">Bring Your Own Key (BYOK)</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── 4 CORE PILLARS ─────────────────── */}
      <section className="py-20 sm:py-28 bg-slate-50/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Unmatched Architecture
            </h2>
            <p className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Engineered specifically for live coding and technical evaluations.
            </p>
            <p className="mt-4 text-slate-600 text-base sm:text-lg">
              Unlike generic browser extensions or clunky bots that join your call, ZeroPrep AI is a native
              desktop application running purely client-side.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:shadow-md hover:border-blue-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-5">
                <Volume2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">System Audio Loopback</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Captures the interviewer speaking directly from your headphones or system audio. No virtual audio cables (BlackHole/VB-Cable) required.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                <span>Integrated native capture</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:shadow-md hover:border-blue-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-5">
                <EyeOff className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">100% Screen Share Invisible</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Utilizes OS-level Window Exclusion flags (`setContentProtection`). When you share your entire desktop or browser on Zoom, the HUD simply does not appear.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-indigo-600">
                <span>Verified on Zoom, Meet & Teams</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:shadow-md hover:border-blue-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-5">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Google Gemini 2.5 Flash</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Sub-second reasoning, syntax analysis, time/space complexity calculations, edge-case generation, and STAR-format behavioral coaching.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                <span>2M context window support</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all hover:shadow-md hover:border-blue-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 mb-5">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Bring Your Own Key (BYOK)</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Never pay a $30-$50 monthly subscription mark-up. Plug in your free Google Gemini API key and query Google directly at zero cost.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-purple-600">
                <span>Your key stays in local storage</span>
                <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── HOW IT WORKS (3 STEPS) ─────────────────── */}
      <section className="py-20 sm:py-28 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Simple 3-Minute Setup
            </h2>
            <p className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Ready before your next interview round begins.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-500/30 mb-6">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900">Download & Launch</h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Download the lightweight installer (.dmg for Mac, .exe for Windows). Open the app and sign in securely with your Google account.
              </p>
              <div className="mt-6">
                <a
                  href={getDownloadHref(userOS)}
                  download={getDownloadFilename(userOS)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download {getOSLabel(userOS)}</span>
                </a>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-sm shadow-md shadow-indigo-500/30 mb-6">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900">Add Your Gemini Key</h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Paste your free Google Gemini API key. Google gives every developer a generous free tier (15 requests/min) with zero cost.
              </p>
              <div className="mt-6">
                <Link
                  href="/blog/how-to-get-free-gemini-api-key"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  <span>Read 2-minute API key guide</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-2xl border border-slate-200 bg-slate-50/50 p-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-sm shadow-md shadow-emerald-500/30 mb-6">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900">Ace Your Interview</h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Press <code className="rounded bg-slate-200 px-1.5 py-0.5 text-xs font-mono text-slate-800">Cmd+Shift+P</code> during your call. The transparent HUD appears over your coding editor with live hints.
              </p>
              <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Screen share safe & invisible</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── COMPARISON TABLE ─────────────────── */}
      <section className="py-20 sm:py-28 bg-slate-50/50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600">
              ZeroPrep vs Others
            </h2>
            <p className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Why engineers choose ZeroPrep AI over expensive subscriptions.
            </p>
          </div>

          <div className="mt-14 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="p-4 sm:p-5 text-sm font-semibold text-slate-900">Feature</th>
                  <th className="p-4 sm:p-5 text-sm font-bold text-blue-600 bg-blue-50/50">
                    ZeroPrep AI
                  </th>
                  <th className="p-4 sm:p-5 text-sm font-semibold text-slate-500">
                    Final Round AI
                  </th>
                  <th className="p-4 sm:p-5 text-sm font-semibold text-slate-500">
                    Standard ChatGPT
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                <tr>
                  <td className="p-4 sm:p-5 font-medium text-slate-800">
                    Audio Loopback (Hear Interviewer)
                  </td>
                  <td className="p-4 sm:p-5 text-emerald-600 font-semibold bg-blue-50/30">
                    <span className="inline-flex items-center gap-1.5">
                      <Check className="h-4 w-4" /> Native dual-channel
                    </span>
                  </td>
                  <td className="p-4 sm:p-5 text-slate-500">Requires bot or mic echo</td>
                  <td className="p-4 sm:p-5 text-red-500">None (Manual typing)</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-medium text-slate-800">
                    Screen Share Undetectable
                  </td>
                  <td className="p-4 sm:p-5 text-emerald-600 font-semibold bg-blue-50/30">
                    <span className="inline-flex items-center gap-1.5">
                      <Check className="h-4 w-4" /> 100% Window Excluded
                    </span>
                  </td>
                  <td className="p-4 sm:p-5 text-amber-600">Partial / Glitchy</td>
                  <td className="p-4 sm:p-5 text-red-500">Visible on screen</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-medium text-slate-800">
                    Monthly Cost
                  </td>
                  <td className="p-4 sm:p-5 text-emerald-600 font-bold bg-blue-50/30">
                    $0 / mo (Free BYOK)
                  </td>
                  <td className="p-4 sm:p-5 text-slate-700 font-medium">$49 - $149 / mo</td>
                  <td className="p-4 sm:p-5 text-slate-700 font-medium">$20 / mo</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-medium text-slate-800">
                    Model Reasoning Engine
                  </td>
                  <td className="p-4 sm:p-5 text-blue-600 font-semibold bg-blue-50/30">
                    Gemini 2.5 Flash / Pro
                  </td>
                  <td className="p-4 sm:p-5 text-slate-600">Custom GPT-3.5/4 wrapper</td>
                  <td className="p-4 sm:p-5 text-slate-600">GPT-4o</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-medium text-slate-800">
                    Live Screen OCR Context
                  </td>
                  <td className="p-4 sm:p-5 text-emerald-600 font-semibold bg-blue-50/30">
                    <span className="inline-flex items-center gap-1.5">
                      <Check className="h-4 w-4" /> One-click screen snip
                    </span>
                  </td>
                  <td className="p-4 sm:p-5 text-slate-500">Limited</td>
                  <td className="p-4 sm:p-5 text-slate-500">Manual upload</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─────────────────── FAQ ACCORDION ─────────────────── */}
      <section className="py-20 sm:py-28 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything you need to know about stealth and safety.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            {[
              {
                q: 'How does ZeroPrep AI remain invisible during screen sharing?',
                a: 'ZeroPrep AI desktop app uses native operating system window exclusion APIs (such as macOS `setContentProtection(true)` and Windows `SetWindowDisplayAffinity`). When applications like Zoom, Google Meet, Microsoft Teams, or HackerRank capture your display or window, the OS hardware compositor completely strips the ZeroPrep HUD from the captured video feed. You see it; your interviewer cannot.',
              },
              {
                q: 'How does Audio Loopback capture the interviewer’s voice?',
                a: 'ZeroPrep AI features an integrated dual-channel audio pipeline. It captures your microphone input while simultaneously tapping the system audio output loopback. This allows the speech-to-text pipeline to capture questions from the interviewer even if you are wearing headphones, without requiring third-party tools like BlackHole or VB-Cable.',
              },
              {
                q: 'Is ZeroPrep AI really free to use?',
                a: 'Yes! ZeroPrep AI operates on a Bring Your Own Key (BYOK) architecture. Google offers a generous free tier for Google Gemini 2.5 Flash through Google AI Studio (up to 15 requests per minute at $0 cost). You paste your own key and get enterprise-grade AI reasoning without paying any monthly software subscriptions.',
              },
              {
                q: 'What platforms and operating systems are supported?',
                a: 'ZeroPrep AI is packaged for macOS (both Apple Silicon M1/M2/M3/M4 and Intel chips via .dmg), Windows 10/11 (64-bit .exe), and Linux (.AppImage). A web version is also available for practice sessions.',
              },
              {
                q: 'Are my audio recordings or interview questions stored on your servers?',
                a: 'No. ZeroPrep AI does not store, record, or retain your audio or transcript content. All transcription and AI queries communicate directly from your computer to the Google Gemini API using your personal API key.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-slate-50/60 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-base font-semibold text-slate-900 hover:text-blue-600"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${
                      faqOpen === idx ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {faqOpen === idx && (
                  <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-4 bg-white">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────── FINAL CTA BANNER ─────────────────── */}
      <section className="relative py-20 sm:py-24 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.2),transparent_50%)]" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Stop worrying about freezing.{' '}
            <span className="text-blue-400">Start passing rounds.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-slate-300">
            Download the desktop app today. Setup takes under 3 minutes, requires zero credit cards, and runs 100% free with your own Gemini key.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={getDownloadHref(userOS)}
              download={getDownloadFilename(userOS)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-500/30 transition-all hover:bg-blue-500 hover:scale-105 active:scale-100 cursor-pointer"
            >
              <Download className="h-5 w-5" />
              <span>Download for {getOSLabel(userOS)}</span>
            </a>
            <Link
              href="/download"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/80 px-6 py-4 text-base font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
            >
              <span>View All Platforms (.dmg, .exe)</span>
              <ArrowRight className="h-4 w-4 text-slate-400" />
            </Link>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-400">
            <span>Version 1.0.0</span>
            <span>•</span>
            <span>Direct Safe Download</span>
            <span>•</span>
            <span>macOS & Windows</span>
          </div>
        </div>
      </section>
    </div>
  );
}
