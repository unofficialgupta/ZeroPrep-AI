import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { GeminiKeyProvider } from '@/context/GeminiKeyContext';
import { AuthProvider } from '@/context/AuthContext';
import ApiKeyModal from '@/components/ApiKeyModal';
import StructuredData from '@/components/StructuredData';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const viewport: Viewport = {
  themeColor: '#2563EB',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.prepzero.in'),
  title: {
    default: 'PrepZero AI (Prep Zero) — Stealth Real-Time Interview & DSA Coding Copilot',
    template: '%s | PrepZero AI',
  },
  description:
    'Undetectable real-time AI copilot for technical interviews, DSA coding rounds, and system design assessments. Featuring invisible screen OCR over Zoom/Meet, internal dual-channel audio loopback, and sub-800ms Google Gemini 2.5 Flash reasoning.',
  applicationName: 'PrepZero AI',
  authors: [{ name: 'PrepZero AI Team', url: 'https://www.prepzero.in' }],
  creator: 'PrepZero AI',
  publisher: 'PrepZero AI',
  category: 'Technology',
  // ─── Google Search Console Verification ────────────────────────────────────────────
  // After verifying prepzero.in in Google Search Console, paste the token here:
  // https://search.google.com/search-console → Add Property → HTML Tag method
  // e.g. verification: { google: 'abc123xyz' }
  verification: {
    google: '', // TODO: paste your GSC verification token here
  },
  keywords: [
    'PrepZero',
    'PrepZero AI',
    'Prep Zero',
    'Prep Zero AI',
    'ZeroPrep AI',
    'prepzero.in',
    'AI interview copilot',
    'stealth interview assistant',
    'undetectable interview helper',
    'real-time DSA copilot',
    'LeetCode live solver',
    'HackerRank real-time AI',
    'Gemini 2.5 Flash interview assistant',
    'invisible screen share AI',
    'Zoom undetectable AI assistant',
    'Google Meet interview cheat sheet',
    'Microsoft Teams stealth AI',
    'audio loopback transcription interview',
    'system design interview copilot',
    'BYOK AI interview assistant',
    'live coding interview help',
    'behavioral interview STAR assistant',
  ],
  alternates: {
    canonical: 'https://www.prepzero.in',
    languages: {
      'en-US': 'https://www.prepzero.in',
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    shortcut: '/favicon.svg',
    apple: [
      { url: '/favicon.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.prepzero.in',
    siteName: 'PrepZero AI',
    title: 'PrepZero AI — Stealth Real-Time Interview & DSA Coding Copilot',
    description:
      'Never freeze in a technical interview again. Invisible overlay on Zoom & Google Meet, dual-channel audio loopback, and instant sub-800ms Gemini 2.5 Flash solutions.',
    images: [
      {
        url: '/zeroprep-preview.jpg',
        width: 1200,
        height: 630,
        alt: 'PrepZero AI Real-Time Stealth Copilot Interface',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PrepZero AI — Stealth Real-Time Interview & DSA Coding Copilot',
    description:
      'The undetectable AI copilot that hears your interviewer through internal audio loopback, analyzes your live code editor, and suggests optimal solutions in real time.',
    images: ['/zeroprep-preview.jpg'],
    creator: '@prepzero_ai',
    site: '@prepzero_ai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`light ${jakarta.variable} ${jetbrainsMono.variable}`}>
      <head>
        <StructuredData />
      </head>
      <body className="text-slate-900 antialiased min-h-screen font-sans">
        <AuthProvider>
          <GeminiKeyProvider>
            {children}
            <ApiKeyModal />
          </GeminiKeyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
