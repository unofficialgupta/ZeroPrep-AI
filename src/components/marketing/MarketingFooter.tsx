import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Download, Cpu, ExternalLink } from 'lucide-react';
import PrepZeroLogo from '@/components/PrepZeroLogo';

export default function MarketingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50/50 pt-16 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-2">
            <PrepZeroLogo
              size="lg"
              variant="horizontal"
              showTagline={true}
              tagline="Ace Any Interview. Zero Prep Required."
              href="/"
            />
            <p className="text-sm leading-relaxed text-slate-500 max-w-sm">
              The undetectable real-time AI copilot for engineers, architects, and technical professionals.
              Dual-channel audio loopback and sub-800ms Gemini 2.5 reasoning without screen capture detection.
            </p>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full w-fit border border-slate-200/80">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>100% Client-Side Stealth Architecture</span>
            </div>
          </div>

          {/* Product links */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Product
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link href="/download" className="hover:text-blue-600 transition-colors">
                  Download Desktop App
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-blue-600 transition-colors">
                  Stealth HUD & Loopback
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-blue-600 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-blue-600 transition-colors">
                  BYOK Model
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-blue-600 transition-colors">
                  Compare Alternatives
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Guides */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Guides & Docs
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link href="/blog/how-to-get-free-gemini-api-key" className="hover:text-blue-600 transition-colors">
                  Free Gemini Key Guide
                </Link>
              </li>
              <li>
                <Link href="/blog/byok-ai-interview-tools-explained" className="hover:text-blue-600 transition-colors">
                  What is BYOK AI?
                </Link>
              </li>
              <li>
                <Link href="/blog/one-time-vs-subscription-ai-tools" className="hover:text-blue-600 transition-colors">
                  Subscription vs Free AI
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-600 transition-colors">
                  Privacy & Trust Architecture
                </Link>
              </li>
            </ul>
          </div>

          {/* Platforms & Direct Download */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900">
              Installers
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <a
                  href="https://github.com/unofficialgupta/ZeroPrep-AI/releases/latest/download/ZeroPrep-AI-1.0.0.dmg"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  macOS (.dmg Apple/Intel)
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/unofficialgupta/ZeroPrep-AI/releases/latest/download/ZeroPrep-AI-Setup-1.0.0.exe"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  Windows 10/11 (.exe)
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/unofficialgupta/ZeroPrep-AI/releases/latest/download/ZeroPrep-AI-1.0.0.AppImage"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  Linux (.AppImage)
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="/dashboard/callSessions"
                  className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800"
                >
                  Launch Web Version
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-slate-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} PrepZero AI (www.prepzero.in). Engineered for privacy & high performance.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-slate-800 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-slate-800 transition-colors">
              Terms of Use
            </Link>
            <Link href="/download" className="hover:text-slate-800 transition-colors">
              Release Notes (v1.0.0)
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
