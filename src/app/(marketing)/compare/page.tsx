import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, X, Download, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'PrepZero AI vs Competitors | Alternative to Final Round AI & ChatGPT',
  description:
    'Compare PrepZero AI against Final Round AI, ChatGPT, and subscription interview tools. True screen-share invisibility, internal audio loopback, and $0 BYOK pricing.',
  alternates: {
    canonical: 'https://www.prepzero.in/compare',
  },
  openGraph: {
    title: 'PrepZero AI vs Competitors — Feature & Cost Comparison',
    description:
      'Zero subscriptions vs $99/mo apps. See why engineers prefer PrepZero AI for real-time technical interview assistance.',
    url: 'https://www.prepzero.in/compare',
    siteName: 'PrepZero AI',
    images: [{ url: '/zeroprep-preview.jpg', width: 1200, height: 630, alt: 'PrepZero AI Comparison' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PrepZero AI vs Final Round AI & ChatGPT',
    description: '100% invisible on Zoom & Google Meet. Zero monthly fees.',
    images: ['/zeroprep-preview.jpg'],
  },
};

export default function ComparePage() {
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
        name: 'Compare',
        item: 'https://www.prepzero.in/compare',
      },
    ],
  };

  return (
    <div className="py-16 sm:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Unbiased Comparison
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            How Does ZeroPrep AI Compare?
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            See how ZeroPrep AI stacks up against expensive subscription-based copilots like Final Round AI and standard ChatGPT.
          </p>
        </div>

        {/* Detailed Table */}
        <div className="mt-16 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-5 text-sm font-bold text-slate-900 w-2/5">Capability</th>
                <th className="p-5 text-sm font-extrabold text-blue-600 bg-blue-50/60 w-1/5">
                  ZeroPrep AI
                </th>
                <th className="p-5 text-sm font-semibold text-slate-700 w-1/5">
                  Final Round AI
                </th>
                <th className="p-5 text-sm font-semibold text-slate-700 w-1/5">
                  ChatGPT Plus
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              <tr>
                <td className="p-5 font-semibold text-slate-800">
                  Monthly Subscription Cost
                  <p className="text-xs text-slate-500 font-normal">Recurring fees</p>
                </td>
                <td className="p-5 font-bold text-emerald-600 bg-blue-50/30">
                  $0 / mo (Free BYOK)
                </td>
                <td className="p-5 text-slate-700 font-medium">$49 - $149 / mo</td>
                <td className="p-5 text-slate-700 font-medium">$20 / mo</td>
              </tr>
              <tr>
                <td className="p-5 font-semibold text-slate-800">
                  Screen Share Exclusion
                  <p className="text-xs text-slate-500 font-normal">Hidden from Zoom, Meet, Teams</p>
                </td>
                <td className="p-5 text-emerald-600 font-semibold bg-blue-50/30">
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="h-4 w-4" /> 100% OS Protected
                  </span>
                </td>
                <td className="p-5 text-amber-600">
                  <span>Partial / Extension based</span>
                </td>
                <td className="p-5 text-red-500">
                  <span className="inline-flex items-center gap-1.5">
                    <X className="h-4 w-4" /> Fully Visible
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-5 font-semibold text-slate-800">
                  Hardware Audio Loopback
                  <p className="text-xs text-slate-500 font-normal">Captures interviewer through headphones</p>
                </td>
                <td className="p-5 text-emerald-600 font-semibold bg-blue-50/30">
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="h-4 w-4" /> Native CoreAudio/WASAPI
                  </span>
                </td>
                <td className="p-5 text-slate-600">Requires bot or mic spill</td>
                <td className="p-5 text-red-500">
                  <span className="inline-flex items-center gap-1.5">
                    <X className="h-4 w-4" /> None
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-5 font-semibold text-slate-800">
                  Latency / Time-to-First-Token
                  <p className="text-xs text-slate-500 font-normal">Speed of coding suggestions</p>
                </td>
                <td className="p-5 font-bold text-emerald-600 bg-blue-50/30">
                  &lt; 650 ms (Direct API)
                </td>
                <td className="p-5 text-slate-600">2.5 - 4.5s (Proxy lag)</td>
                <td className="p-5 text-slate-600">1.8 - 3.2s</td>
              </tr>
              <tr>
                <td className="p-5 font-semibold text-slate-800">
                  Data Privacy Architecture
                  <p className="text-xs text-slate-500 font-normal">Where your audio & keys go</p>
                </td>
                <td className="p-5 text-emerald-600 font-semibold bg-blue-50/30">
                  Local-Only (Direct to Google)
                </td>
                <td className="p-5 text-slate-600">Routed via their servers</td>
                <td className="p-5 text-slate-600">Stored for training</td>
              </tr>
              <tr>
                <td className="p-5 font-semibold text-slate-800">
                  Desktop Form Factor
                  <p className="text-xs text-slate-500 font-normal">Native app vs browser tab</p>
                </td>
                <td className="p-5 text-blue-600 font-semibold bg-blue-50/30">
                  Native Mac & Windows App
                </td>
                <td className="p-5 text-slate-600">Web / Electron wrapper</td>
                <td className="p-5 text-slate-600">Browser tab</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/download"
            className="inline-flex items-center gap-2.5 rounded-2xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-500/25 hover:bg-blue-700 transition-all cursor-pointer"
          >
            <Download className="h-5 w-5" />
            <span>Switch to ZeroPrep AI Free</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
