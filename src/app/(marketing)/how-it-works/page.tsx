import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Download,
  Key,
  Monitor,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Volume2,
  Sparkles,
  Command
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'How It Works | PrepZero AI 3-Minute Stealth Setup',
  description:
    'Learn how PrepZero AI works: install the desktop app, connect your free Gemini API key, and launch the invisible HUD over Zoom, Google Meet, or Teams.',
  alternates: {
    canonical: 'https://www.prepzero.in/how-it-works',
  },
  openGraph: {
    title: 'How PrepZero AI Works — Setup in 3 Minutes',
    description:
      'Step-by-step walkthrough: installation, connecting free Gemini 2.5 Flash API key, and invisible HUD operation.',
    url: 'https://www.prepzero.in/how-it-works',
    siteName: 'PrepZero AI',
    images: [{ url: '/zeroprep-preview.jpg', width: 1200, height: 630, alt: 'How PrepZero AI Works' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How PrepZero AI Works — 3-Minute Setup',
    description: 'Learn how to set up invisible HUD over Zoom & Google Meet.',
    images: ['/zeroprep-preview.jpg'],
  },
};

export default function HowItWorksPage() {
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
        name: 'How It Works',
        item: 'https://www.prepzero.in/how-it-works',
      },
    ],
  };

  return (
    <div className="py-16 sm:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Frictionless Onboarding
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            How ZeroPrep AI Works
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            From download to live stealth interview assistance in less than 3 minutes.
            Zero complex configuration, zero virtual audio drivers.
          </p>
        </div>

        {/* 3 Step Walkthrough */}
        <div className="mt-16 space-y-16">
          {/* Step 1 */}
          <div className="relative rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white font-bold text-xl shadow-lg shadow-blue-500/30">
                1
              </div>
              <div className="flex-1 space-y-4">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                  <Download className="h-3.5 w-3.5" />
                  <span>STEP 1: INSTALLATION</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Download & Open the Native Desktop App
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Download the official installer for macOS (.dmg) or Windows (.exe). Drag ZeroPrep AI into your Applications folder or complete the Windows setup. Launch the app and sign in with your Google account.
                </p>
                <div className="pt-2 flex flex-wrap gap-4">
                  <a
                    href="https://github.com/unofficialgupta/ZeroPrep-AI/releases/latest/download/ZeroPrep-AI-1.0.0.dmg"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download macOS (.dmg)</span>
                  </a>
                  <a
                    href="https://github.com/unofficialgupta/ZeroPrep-AI/releases/latest/download/ZeroPrep-AI-Setup-1.0.0.exe"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Windows (.exe)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white font-bold text-xl shadow-lg shadow-indigo-500/30">
                2
              </div>
              <div className="flex-1 space-y-4">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                  <Key className="h-3.5 w-3.5" />
                  <span>STEP 2: FREE AI CONNECTION</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Connect Your Personal Google Gemini Key
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  ZeroPrep AI puts you in control. Instead of paying a $40/month subscription markup, you paste your own Google Gemini API key. Google provides every Google account with a free tier of up to 15 queries/minute. Your key is stored securely on your machine and never leaves your local environment.
                </p>
                <div className="pt-2">
                  <Link
                    href="/blog/how-to-get-free-gemini-api-key"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline underline-offset-4"
                  >
                    <span>Read step-by-step: How to get your free Gemini API key in 2 minutes</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white font-bold text-xl shadow-lg shadow-emerald-500/30">
                3
              </div>
              <div className="flex-1 space-y-4">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>STEP 3: LIVE INTERVIEW COPILOT</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Launch the Invisible Stealth Overlay
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Join your Zoom, Google Meet, or Microsoft Teams call. Press <code className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Cmd+Shift+P</code> (or <code className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Ctrl+Shift+P</code> on Windows). The transparent HUD floats over your screen.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>The loopback audio engine transcribes the interviewer as they speak.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Hit the Snip button to read code editors, diagrams, or LeetCode questions.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Gemini 2.5 Flash streams solutions, optimal complexity, and behavioral STAR points.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Hit <code className="font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded">Cmd+Esc</code> for instant panic dismissal anytime.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <Link
            href="/download"
            className="inline-flex items-center gap-2.5 rounded-2xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-500/25 hover:bg-blue-700 transition-all cursor-pointer"
          >
            <Download className="h-5 w-5" />
            <span>Download Desktop App Now</span>
          </Link>
          <div className="mt-3 text-xs text-slate-500">
            Available for macOS (Apple Silicon & Intel) and Windows 10/11
          </div>
        </div>
      </div>
    </div>
  );
}
