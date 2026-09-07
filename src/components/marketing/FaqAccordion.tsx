'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    q: 'How does PrepZero AI remain invisible during screen sharing?',
    a: 'PrepZero AI desktop app uses native operating system hardware window exclusion APIs (such as macOS setContentProtection(true) and Windows SetWindowDisplayAffinity). When software like Zoom, Google Meet, Microsoft Teams, or HackerRank captures your display or window, the OS compositor completely excludes the PrepZero HUD from the recorded video stream. You see it clearly; your interviewer cannot.',
  },
  {
    q: 'How does Audio Loopback capture the interviewer’s voice without extra cables?',
    a: 'PrepZero AI features a built-in dual-channel audio loopback pipeline. It captures your microphone speech while simultaneously tapping system audio output. This allows real-time speech transcription to capture questions from the interviewer even when you wear headphones, without requiring third-party tools like BlackHole or VB-Cable.',
  },
  {
    q: 'Is PrepZero AI really free to use?',
    a: 'Yes! PrepZero AI runs on a Bring Your Own Key (BYOK) architecture. Google offers a free tier for Google Gemini 2.5 Flash through Google AI Studio (up to 15 requests per minute at $0 cost). You connect your personal key and get enterprise-grade AI reasoning without paying monthly software subscriptions.',
  },
  {
    q: 'What platforms and operating systems are supported?',
    a: 'PrepZero AI is available for macOS (Apple Silicon M1/M2/M3/M4 & Intel chips via .dmg), Windows 10/11 (64-bit .exe), and Linux (.AppImage). A companion web dashboard is also available for practicing and reviewing past sessions.',
  },
  {
    q: 'Are my audio recordings, resumes, or interview questions stored on your servers?',
    a: 'No. PrepZero AI operates strictly client-side. We do not store, record, or inspect your audio or interview transcripts. AI queries are dispatched directly from your device to the Google Gemini API using your personal private API key.',
  },
  {
    q: 'Can PrepZero AI solve complex LeetCode Hard and System Design questions?',
    a: 'Yes. Powered by Google Gemini 2.5 Flash with multimodal vision and a 2,000,000 token context window, PrepZero AI parses problem constraints, generates optimal algorithmic solutions with Big-O time/space complexity, and drafts high-level distributed system architecture trade-offs in sub-800ms.',
  },
];

export default function FaqAccordion() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="mt-12 space-y-4">
        {FAQ_ITEMS.map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-200 bg-slate-50/60 overflow-hidden transition-colors"
          >
            <button
              onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
              className="w-full flex items-center justify-between p-5 text-left text-base font-semibold text-slate-900 hover:text-blue-600"
              aria-expanded={faqOpen === idx}
            >
              <span>{item.q}</span>
              <ChevronDown
                className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${
                  faqOpen === idx ? 'rotate-180 text-blue-600' : ''
                }`}
              />
            </button>
            {faqOpen === idx && (
              <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-4 bg-white animate-in fade-in-50 duration-200">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
