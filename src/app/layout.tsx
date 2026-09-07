import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { GeminiKeyProvider } from '@/context/GeminiKeyContext';
import { AuthProvider } from '@/context/AuthContext';
import ApiKeyModal from '@/components/ApiKeyModal';

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

export const metadata: Metadata = {
  title: 'ZeroPrep AI | Real-Time Interview & Coding Copilot',
  description:
    'ZeroPrep AI Copilot with real-time audio loopback, stealth screen analysis, and Google Gemini 2.5 Flash reasoning.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`light ${jakarta.variable} ${jetbrainsMono.variable}`}>
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
