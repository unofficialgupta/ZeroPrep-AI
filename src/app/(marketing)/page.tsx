import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  Shield,
  Zap,
  Mic,
  Volume2,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Check,
  Monitor,
  Terminal,
  ExternalLink,
  Laptop,
  Layers,
  Lock,
} from 'lucide-react';
import HeroDownloadCta from '@/components/marketing/HeroDownloadCta';
import FaqAccordion from '@/components/marketing/FaqAccordion';
import PrepZeroLogo from '@/components/PrepZeroLogo';

export const metadata: Metadata = {
  title: 'PrepZero AI — Stealth Real-Time Interview & DSA Coding Copilot',
  description:
    'Undetectable AI copilot for technical interviews, DSA rounds, and system design assessments. Invisible on Zoom, Google Meet & Teams. Dual-channel audio loopback and sub-800ms Google Gemini 2.5 Flash reasoning.',
  alternates: {
    canonical: 'https://www.prepzero.in',
  },
  openGraph: {
    title: 'PrepZero AI — Stealth Real-Time Interview & DSA Coding Copilot',
    description:
      'Never freeze in a technical interview again. Invisible screen OCR over Zoom/Meet, internal audio loopback, and sub-800ms Gemini 2.5 Flash algorithms.',
    url: 'https://www.prepzero.in',
    siteName: 'PrepZero AI',
    images: [
      {
        url: '/zeroprep-preview.jpg',
        width: 1200,
        height: 630,
        alt: 'PrepZero AI Real-time Stealth Copilot Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PrepZero AI — Stealth Real-Time Interview & DSA Copilot',
    description:
      'Ace any technical interview with zero prep. Undetectable on screen share, dual-channel audio loopback, and Gemini 2.5 Flash reasoning.',
    images: ['/zeroprep-preview.jpg'],
  },
};

export default function MarketingHomePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'PrepZero AI',
    alternateName: 'ZeroPrep AI',
    applicationCategory: 'DeveloperApplication',
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
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>PrepZero AI Desktop v1.0 Released</span>
            <span className="text-blue-400">•</span>
            <span className="text-blue-600 font-medium">100% Invisible to Zoom, Meet & Teams</span>
          </div>

          {/* Headline */}
          <h1 className="mx-auto max-w-4xl text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1] sm:leading-[1.08]">
            Never Freeze in a{' '}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              Technical Interview
            </span>{' '}
            Again.
          </h1>

          {/* Subtitle / Tagline */}
          <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
            <strong className="font-semibold text-slate-900">Ace Any Interview. Zero Prep Required.</strong>{' '}
            The high-performance stealth AI copilot that captures your interviewer&apos;s voice through internal audio loopback,
            reads your live code editor via OCR, and delivers optimal solutions in real time — completely undetectable on screen share.
          </p>

          {/* Hero Download CTA Buttons */}
          <HeroDownloadCta variant="hero" />

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
                    PrepZero AI Stealth HUD — Live Audio & Screen Session
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
                  alt="PrepZero AI Stealth HUD Interface Preview"
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
              <p className="text-3xl sm:text-4xl font-black text-slate-900">&lt; 800ms</p>
              <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500">
                End-to-End Latency
              </p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-blue-600">0%</p>
              <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500">
                Screen Capture Leakage
              </p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-slate-900">$0 / mo</p>
              <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500">
                With Free Gemini Tier
              </p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-emerald-600">100%</p>
              <p className="mt-1 text-xs sm:text-sm font-medium text-slate-500">
                Client-Side Data Privacy
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── CORE PILLARS ─────────────────── */}
      <section className="py-20 sm:py-28 bg-slate-50/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Engineered For The Real World
            </h2>
            <p className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Four breakthroughs that make PrepZero AI untraceable.
            </p>
            <p className="mt-4 text-base text-slate-600">
              Unlike web extensions or clunky second-screen setups, PrepZero AI is built from the ground up as a native desktop HUD.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-5">
                <Volume2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Audio Loopback</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Captures incoming interviewer audio directly from system output. No virtual audio cables or sound routing required.
              </p>
              <div className="mt-4 text-xs font-semibold text-blue-600 flex items-center gap-1">
                <span>Headphone compatible</span>
                <Check className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-5">
                <EyeOff className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Stealth HUD Overlay</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                OS-level content protection guarantees the overlay is invisible when sharing screens on Zoom, Google Meet, or Microsoft Teams.
              </p>
              <div className="mt-4 text-xs font-semibold text-indigo-600 flex items-center gap-1">
                <span>Hardware level exclusion</span>
                <Check className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 mb-5">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Gemini 2.5 Flash</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Sub-800ms multimodal inference. Solves LeetCode Hard DSA questions, calculates Big-O complexity, and generates clean code snippets.
              </p>
              <div className="mt-4 text-xs font-semibold text-amber-600 flex items-center gap-1">
                <span>1M+ token context</span>
                <Check className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Card 4 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-5">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Bring Your Own Key</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                100% free via Google AI Studio tier. Your API key and interview conversations remain strictly on your local computer.
              </p>
              <div className="mt-4 text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <span>Zero monthly fees</span>
                <Check className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── COMPARISON TABLE ─────────────────── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600">
              Unmatched Value
            </h2>
            <p className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Why Engineers Choose PrepZero AI
            </p>
          </div>

          <div className="mt-12 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="p-4 sm:p-5 font-semibold text-slate-900">Feature</th>
                  <th className="p-4 sm:p-5 font-bold text-blue-600 bg-blue-50/50">
                    PrepZero AI
                  </th>
                  <th className="p-4 sm:p-5 font-semibold text-slate-600">Final Round AI</th>
                  <th className="p-4 sm:p-5 font-semibold text-slate-600">ChatGPT Plus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-4 sm:p-5 font-medium text-slate-800">Monthly Price</td>
                  <td className="p-4 sm:p-5 text-emerald-600 font-bold bg-blue-50/30">
                    $0 (BYOK Free Tier)
                  </td>
                  <td className="p-4 sm:p-5 text-slate-500">$99 / month</td>
                  <td className="p-4 sm:p-5 text-slate-500">$20 / month</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-medium text-slate-800">
                    Screen-Share Invisibility
                  </td>
                  <td className="p-4 sm:p-5 text-emerald-600 font-semibold bg-blue-50/30">
                    <span className="inline-flex items-center gap-1.5">
                      <Check className="h-4 w-4" /> Native OS Content Protection
                    </span>
                  </td>
                  <td className="p-4 sm:p-5 text-slate-500">Partial</td>
                  <td className="p-4 sm:p-5 text-rose-500 font-medium">None (Visible)</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-medium text-slate-800">
                    Audio Loopback (Interviewer Voice)
                  </td>
                  <td className="p-4 sm:p-5 text-emerald-600 font-semibold bg-blue-50/30">
                    <span className="inline-flex items-center gap-1.5">
                      <Check className="h-4 w-4" /> Automatic internal loopback
                    </span>
                  </td>
                  <td className="p-4 sm:p-5 text-slate-500">External app required</td>
                  <td className="p-4 sm:p-5 text-rose-500 font-medium">Mic only</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-medium text-slate-800">AI Model Engine</td>
                  <td className="p-4 sm:p-5 text-slate-800 font-semibold bg-blue-50/30">
                    Gemini 2.5 Flash
                  </td>
                  <td className="p-4 sm:p-5 text-slate-500">Proprietary / Claude</td>
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

          <FaqAccordion />
        </div>
      </section>

      {/* ─────────────────── FINAL CTA BANNER ─────────────────── */}
      <section className="relative py-20 sm:py-24 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.2),transparent_50%)]" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <PrepZeroLogo
              size="lg"
              theme="dark"
              showTagline={false}
              href="/"
            />
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Stop worrying about freezing.{' '}
            <span className="text-blue-400">Start passing rounds.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-slate-300">
            Download the desktop app today. Setup takes under 3 minutes, requires zero credit cards, and runs 100% free with your own Gemini key.
          </p>

          <div className="mt-10">
            <HeroDownloadCta variant="banner" />
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-400">
            <span>Version 1.0.0</span>
            <span>•</span>
            <span>Direct Safe Download</span>
            <span>•</span>
            <span>macOS & Windows & Linux</span>
          </div>
        </div>
      </section>
    </div>
  );
}
