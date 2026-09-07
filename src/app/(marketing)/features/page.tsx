import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Volume2,
  EyeOff,
  Sparkles,
  Shield,
  Download,
  CheckCircle2,
  ArrowRight,
  Code2,
  Cpu,
  Monitor,
  Mic,
  Lock
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Stealth HUD & Audio Loopback Features | PrepZero AI',
  description:
    'Explore PrepZero AI features: dual-channel audio loopback, undetectable screen overlay on Zoom/Meet, sub-800ms Gemini 2.5 Flash reasoning, and BYOK privacy.',
  alternates: {
    canonical: 'https://www.prepzero.in/features',
  },
  openGraph: {
    title: 'PrepZero AI Features — Stealth Screen & Audio Copilot',
    description:
      'Explore undetectable screen overlays, dual audio loopback, and Gemini 2.5 Flash reasoning for technical coding interviews.',
    url: 'https://www.prepzero.in/features',
    siteName: 'PrepZero AI',
    images: [{ url: '/zeroprep-preview.jpg', width: 1200, height: 630, alt: 'PrepZero AI Features' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PrepZero AI Features — Stealth Screen & Audio Copilot',
    description: 'Hardware screen protection and dual-channel audio loopback.',
    images: ['/zeroprep-preview.jpg'],
  },
};

export default function FeaturesPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.prepzero.in',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Features',
        item: 'https://www.prepzero.in/features',
      },
    ],
  };

  return (
    <div className="py-16 sm:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Engineered For Performance
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            Deep-Dive into PrepZero AI
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Explore the technology that makes ZeroPrep AI the most reliable stealth copilot for coding rounds, system design, and technical interviews.
          </p>
        </div>

        {/* Feature 1: Audio Loopback */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-lg bg-blue-100/70 text-blue-800 px-3 py-1 text-xs font-semibold">
              <Volume2 className="h-4 w-4" />
              <span>Core Audio Technology</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Hardware-Tapped Dual Audio Loopback
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Traditional copilots force you to hold a microphone up to your speakers or install complex, glitchy virtual audio driver software like BlackHole or Soundflower.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              ZeroPrep AI hooks directly into OS loopback audio buses (CoreAudio on macOS and WASAPI loopback on Windows). It cleanly captures the interviewer speaking in real time through your headphones, multiplexing their voice alongside your mic input into a synchronized stream.
            </p>
            <ul className="space-y-2 text-sm text-slate-700 font-medium pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Works with AirPods, Bluetooth headsets, and USB DACs</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Zero acoustic feedback or echo loops</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Continuous streaming speech recognition</span>
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs font-mono text-slate-400">
              <span>AUDIO PIPELINE MONITOR</span>
              <span className="text-emerald-400">STATUS: 48kHz STEREO</span>
            </div>
            <div className="mt-6 space-y-4">
              <div className="rounded-lg bg-slate-800/80 p-4 border border-slate-700/60">
                <div className="flex justify-between text-xs text-slate-300 font-mono mb-2">
                  <span className="flex items-center gap-1.5"><Mic className="h-3.5 w-3.5 text-blue-400" /> CHANNEL 1: YOUR MIC</span>
                  <span className="text-blue-400">-12 dB</span>
                </div>
                <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-3/4 rounded-full" />
                </div>
              </div>

              <div className="rounded-lg bg-slate-800/80 p-4 border border-slate-700/60">
                <div className="flex justify-between text-xs text-slate-300 font-mono mb-2">
                  <span className="flex items-center gap-1.5"><Volume2 className="h-3.5 w-3.5 text-emerald-400" /> CHANNEL 2: INTERVIEWER (LOOPBACK)</span>
                  <span className="text-emerald-400">-6 dB</span>
                </div>
                <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-4/5 rounded-full" />
                </div>
              </div>

              <div className="rounded-lg bg-slate-950 p-4 border border-slate-800 text-xs font-mono text-slate-400">
                <span className="text-slate-500">&gt;</span> Transcription latency: <span className="text-emerald-400">180ms</span><br />
                <span className="text-slate-500">&gt;</span> Audio engine: <span className="text-blue-400">Native CoreAudio / WASAPI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2: Screen Invisibility */}
        <div className="mt-28 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs font-mono text-slate-400">
              <span>OS WINDOW COMPOSITOR</span>
              <span className="text-emerald-400">WINDOW_EXCLUDED</span>
            </div>
            <div className="mt-6 space-y-4">
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/30 text-emerald-300 text-xs">
                <strong>Protected Display Affinity:</strong> Electron window flagged with OS-level content protection. Hardware display buffers automatically mask window pixels from third-party screen grab APIs.
              </div>
              <div className="space-y-2 text-xs font-mono text-slate-400">
                <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                  <span>Zoom Desktop Meeting</span>
                  <span className="text-emerald-400">HIDDEN</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                  <span>Google Meet (Chrome)</span>
                  <span className="text-emerald-400">HIDDEN</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                  <span>Microsoft Teams Call</span>
                  <span className="text-emerald-400">HIDDEN</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                  <span>HackerRank / Codesignal Proctor</span>
                  <span className="text-emerald-400">HIDDEN</span>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-lg bg-indigo-100/70 text-indigo-800 px-3 py-1 text-xs font-semibold">
              <EyeOff className="h-4 w-4" />
              <span>Undetectable Stealth HUD</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Invisible to Zoom, Meet & Screen Capture
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              When interviewing, you are frequently asked to share your entire desktop screen or code editor window. If your copilot shows up on screen, your interview is over.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              ZeroPrep AI utilizes native operating system exclusion flags (`win.setContentProtection(true)` on macOS and Windows display affinity). The HUD window is rendered on your physical monitor, but completely omitted by the GPU compositor when any screen recording or video conferencing software captures the display.
            </p>
            <ul className="space-y-2 text-sm text-slate-700 font-medium pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Transparent click-through or draggable mode</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Panic hotkey (<code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">Cmd+Esc</code>) instant dismiss</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Custom opacity and minimal compact HUD views</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Feature 3: Gemini 2.5 Flash */}
        <div className="mt-28 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-100/70 text-emerald-800 px-3 py-1 text-xs font-semibold">
              <Sparkles className="h-4 w-4" />
              <span>Next-Gen AI Core</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Powered by Google Gemini 2.5 Flash
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              In a live interview, speed is everything. A delay of 4 seconds makes it obvious you are looking up answers.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              By connecting directly to Google Gemini 2.5 Flash, ZeroPrep AI delivers time-to-first-token in under 650 milliseconds. Get instant time complexity analysis (Big-O), code structures, edge-case warnings, and structured STAR-method answers before the interviewer even finishes their question.
            </p>
            <ul className="space-y-2 text-sm text-slate-700 font-medium pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Optimal algorithms for LeetCode, HackerRank, Codeforces</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Distributed system design tradeoffs & architectures</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>2,000,000 token context window capacity</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs font-mono text-slate-400">
              <span>LIVE REASONING STREAM</span>
              <span className="text-emerald-400">LATENCY: 540ms</span>
            </div>
            <div className="mt-6 font-mono text-xs text-slate-300 space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <p className="text-indigo-400">// Problem: Lowest Common Ancestor in Binary Tree</p>
              <p className="text-emerald-400">Optimal Approach: Recursive Post-Order Traversal</p>
              <div className="text-slate-400">
                Time: <span className="text-amber-300">O(N)</span> | Space: <span className="text-amber-300">O(H)</span>
              </div>
              <pre className="text-slate-300 text-[11px] overflow-x-auto p-2 bg-slate-900 rounded">
{`function lowestCommonAncestor(root, p, q) {
  if (!root || root === p || root === q) return root;
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  return left && right ? root : (left || right);
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* CTA banner */}
        <div className="mt-28 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-10 text-white text-center shadow-xl">
          <h3 className="text-2xl sm:text-3xl font-extrabold">Ready to try it on your desktop?</h3>
          <p className="mt-3 text-sm sm:text-base text-blue-100 max-w-xl mx-auto">
            Download the desktop app for macOS or Windows. Completely free to use with your own Google Gemini API key.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/download"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-blue-900 shadow-md hover:bg-blue-50 transition-all"
            >
              <Download className="h-4 w-4" />
              <span>Go to Downloads Hub</span>
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/20 transition-all"
            >
              <span>See How It Works</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
