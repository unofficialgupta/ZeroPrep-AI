import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Download, Zap, Heart, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'About & Privacy Architecture | ZeroPrep AI',
  description:
    'Learn about ZeroPrep AI mission, privacy architecture, client-side encryption, and zero data selling pledge.',
};

export default function AboutPage() {
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Trust & Transparency
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            Built for Engineers, by Engineers.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Technical interviews have become artificial trivia tests. We built ZeroPrep AI to empower engineers to showcase their real engineering potential under extreme interview pressure.
          </p>
        </div>

        {/* Privacy Guarantees */}
        <div className="mt-16 space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Our Privacy & Security Pledges</h2>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">1. Zero Audio or Video Recording</h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  ZeroPrep AI operates on real-time streaming audio buffers. We never record, save, or store your microphone feed or interviewer audio to our servers or disk. Once an audio chunk is transcribed, it is discarded from RAM.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">2. Direct Google Gemini Communication</h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  Your AI API key communicates directly from your desktop app to Google AI Studio endpoints. No intermediary proxy server intercepts your prompts, code snippets, or system design answers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">3. We Never Sell Your Data</h3>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                  We will never sell, monetize, or license your account info, questions asked, or resume data to recruiters, employers, or third-party data brokers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/download"
            className="inline-flex items-center gap-2.5 rounded-2xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-500/25 hover:bg-blue-700 transition-all cursor-pointer"
          >
            <Download className="h-5 w-5" />
            <span>Download Desktop App Free</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
