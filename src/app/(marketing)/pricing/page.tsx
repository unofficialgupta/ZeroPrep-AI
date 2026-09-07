import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Check,
  Zap,
  Download,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Sparkles,
} from 'lucide-react';

export const metadata: Metadata = {
  title: '100% Free BYOK Pricing | PrepZero AI',
  description:
    'PrepZero AI is 100% free with Bring-Your-Own-Key (BYOK). Never pay recurring monthly subscriptions for technical interview copilots again.',
  alternates: {
    canonical: 'https://www.prepzero.in/pricing',
  },
  openGraph: {
    title: 'PrepZero AI Pricing — 100% Free BYOK Architecture',
    description:
      'Skip the $50-$100/mo subscription traps. Connect your free Google Gemini API key and get unlimited AI interview prep at $0 cost.',
    url: 'https://www.prepzero.in/pricing',
    siteName: 'PrepZero AI',
    images: [{ url: '/zeroprep-preview.jpg', width: 1200, height: 630, alt: 'PrepZero AI Free Pricing' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PrepZero AI Pricing — 100% Free BYOK Architecture',
    description: 'Zero subscriptions. Bring your own free Gemini API key for unlimited interview prep.',
    images: ['/zeroprep-preview.jpg'],
  },
};

export default function PricingPage() {
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
        name: 'Pricing',
        item: 'https://www.prepzero.in/pricing',
      },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Why is PrepZero AI free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We believe job seekers should never be exploited with high-margin $30-$50/month recurring fees. By using Google AI Studio free tier Gemini API keys, you get unlimited interview prep at zero AI cost.',
        },
      },
      {
        '@type': 'Question',
        name: 'What does BYOK (Bring Your Own Key) mean?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'BYOK means you connect your own Google Gemini API key. Google provides every Google account with a free tier of 15 queries per minute, which is more than enough for any coding or technical interview.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is my Google API key safe in PrepZero AI?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Your API key is encrypted and stored strictly in your local device storage. It is never transmitted to our servers or shared with any third party.',
        },
      },
    ],
  };

  return (
    <div className="py-16 sm:py-24">
      {/* Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Fair & Transparent BYOK Pricing
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            Pass interviews without predatory subscriptions.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Traditional AI interview apps charge $30-$100/month by marking up standard AI APIs.
            PrepZero AI is architected differently: Bring Your Own Key (BYOK) and pay $0 forever.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="mt-14 mx-auto max-w-lg rounded-3xl border-2 border-blue-600 bg-white p-8 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-blue-600 text-white text-[11px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider">
            Most Popular
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
            <ShieldCheck className="h-4 w-4" />
            <span>Community BYOK Edition</span>
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-5xl font-extrabold text-slate-900">$0</span>
            <span className="text-sm font-semibold text-slate-500">/ forever</span>
          </div>

          <p className="mt-3 text-sm text-slate-600">
            Full desktop app access with native audio loopback, stealth HUD, and Google Gemini 2.5 Flash.
          </p>

          <div className="mt-8 space-y-3.5 text-sm text-slate-700">
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Full Stealth HUD on Zoom, Google Meet & Teams</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Internal Audio Loopback (Interviewer speech)</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>One-Click Screen OCR for LeetCode & HackerRank</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Direct Google Gemini 2.5 Flash connectivity</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Client-side privacy: Zero cloud logs retained</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>No credit card required to install or use</span>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/download"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-all cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Download Desktop App</span>
            </Link>
          </div>
        </div>

        {/* BYOK Explanation Box */}
        <div className="mt-16 rounded-2xl border border-slate-200 bg-slate-50/60 p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                How Google gives you free AI power:
              </h3>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                Google AI Studio provides all registered developers with a generous free tier for Gemini 2.5 Flash.
                You get up to 15 queries every minute at no charge. A normal interview generates roughly 1 to 2 queries per minute.
                By connecting your own key, you skip the middleman markups completely.
              </p>
              <div className="mt-4">
                <Link
                  href="/blog/how-to-get-free-gemini-api-key"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
                >
                  <span>Step-by-step tutorial: Get a free Gemini key in 2 minutes</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing FAQ */}
        <div className="mt-16">
          <h3 className="text-xl font-bold text-slate-900 text-center mb-8">
            Common Questions About Pricing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h4 className="font-bold text-sm text-slate-900">Will I ever be billed unexpectedly?</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Never. PrepZero AI does not collect your credit card upon signup. You use your own free Google AI key, so we have no billing pipeline to charge you monthly.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h4 className="font-bold text-sm text-slate-900">Is the free Gemini quota sufficient?</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Yes! 15 requests per minute is more than 30x the rate needed during an hour-long coding interview or system design session.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
