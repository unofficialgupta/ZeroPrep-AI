import React from 'react';
import Link from 'next/link';
import {
  Check,
  Zap,
  Download,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Sparkles
} from 'lucide-react';

export const metadata = {
  title: 'Pricing & BYOK Model | ZeroPrep AI',
  description:
    'ZeroPrep AI is 100% free with Bring-Your-Own-Key (BYOK). Never pay recurring monthly subscriptions for interview copilots again.',
};

export default function PricingPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Why is ZeroPrep AI free to use?',
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
        name: 'Is my Google API key safe in ZeroPrep AI?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Your API key is encrypted and stored strictly in your local device storage. It is never transmitted to our servers or shared with any third party.',
        },
      },
    ],
  };

  return (
    <div className="py-16 sm:py-24">
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Transparent BYOK Architecture
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            No Subscription Traps. Ever.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Most interview tools charge $40 to $120 every single month for a simple ChatGPT wrapper.
            ZeroPrep AI empowers you with a direct Bring-Your-Own-Key (BYOK) model.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="mt-16 max-w-lg mx-auto rounded-3xl border-2 border-blue-600 bg-white p-8 sm:p-10 shadow-2xl relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md">
            Forever Free AI Tier (BYOK)
          </div>

          <div className="text-center pt-2">
            <span className="text-5xl font-extrabold text-slate-900 tracking-tight">$0</span>
            <span className="text-sm font-medium text-slate-500 ml-1">/ month</span>
            <p className="text-xs text-slate-500 mt-2">
              Powered by your personal free Google Gemini API Key
            </p>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Everything Included:
            </h2>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Dual-channel CoreAudio & WASAPI system audio loopback</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Undetectable screen overlay (OS window exclusion)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Google Gemini 2.5 Flash sub-second reasoning</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Live screen OCR context extraction</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Unlimited mock interview sessions</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>No recurring bills or surprise card charges</span>
              </li>
            </ul>
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
                Never. ZeroPrep AI does not collect your credit card upon signup. You use your own free Google AI key, so we have no billing pipeline to charge you monthly.
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
