'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Zap, Download, Menu, X, ArrowRight, ShieldCheck } from 'lucide-react';
import PrepZeroLogo from '@/components/PrepZeroLogo';

export default function MarketingNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-xl transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo with Tagline */}
        <PrepZeroLogo
          size="md"
          variant="horizontal"
          showTagline={true}
          tagline="Stealth Interview Copilot"
          href="/"
        />

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
          <Link
            href="/features"
            className="rounded-lg px-3.5 py-2 transition-colors hover:bg-slate-100/80 hover:text-slate-900"
          >
            Features
          </Link>
          <Link
            href="/how-it-works"
            className="rounded-lg px-3.5 py-2 transition-colors hover:bg-slate-100/80 hover:text-slate-900"
          >
            How It Works
          </Link>
          <Link
            href="/pricing"
            className="rounded-lg px-3.5 py-2 transition-colors hover:bg-slate-100/80 hover:text-slate-900"
          >
            BYOK Pricing
          </Link>
          <Link
            href="/compare"
            className="rounded-lg px-3.5 py-2 transition-colors hover:bg-slate-100/80 hover:text-slate-900"
          >
            Compare
          </Link>
          <Link
            href="/blog"
            className="rounded-lg px-3.5 py-2 transition-colors hover:bg-slate-100/80 hover:text-slate-900"
          >
            Resources
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/dashboard/callSessions"
            className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-blue-600 px-3 py-2 transition-colors"
          >
            Web App
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/download"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Download className="h-4 w-4" />
            <span>Download Free</span>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex sm:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 pt-2 pb-6 sm:hidden shadow-xl animate-in slide-in-from-top-2">
          <nav className="flex flex-col space-y-2">
            <Link
              href="/features"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              Features
            </Link>
            <Link
              href="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              How It Works
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              BYOK Pricing
            </Link>
            <Link
              href="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              Compare
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              Resources & Blog
            </Link>
            <div className="pt-4 flex flex-col gap-2.5">
              <Link
                href="/download"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white shadow-md shadow-blue-500/20"
              >
                <Download className="h-4 w-4" />
                Download App (.dmg / .exe)
              </Link>
              <Link
                href="/dashboard/callSessions"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-center font-medium text-slate-700 hover:bg-slate-50"
              >
                Launch Web App
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
