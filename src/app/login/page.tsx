'use client';

import React from 'react';
import { Zap, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-4 font-sans antialiased">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#0052cc]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0052cc] shadow-2xl shadow-[#0052cc]/40">
            <Zap className="h-8 w-8 text-white fill-current" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">ZeroPrep AI</h1>
            <p className="text-sm text-slate-400 mt-1">Real-Time Interview & Coding Copilot</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 space-y-6 shadow-2xl">
          <div className="space-y-1 text-center">
            <h2 className="text-lg font-bold text-white">Sign in to continue</h2>
            <p className="text-xs text-slate-400">
              Your account secures your AI key and session — we never see your passwords.
            </p>
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={login}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg hover:bg-slate-50 active:scale-98 transition disabled:opacity-60 cursor-pointer"
          >
            {/* Google SVG logo */}
            <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Trust signals */}
          <div className="space-y-2">
            {[
              { icon: Shield, text: 'Google-verified login — we never see your password' },
              { icon: Sparkles, text: 'Bring your own AI key — zero usage fees from us' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-xs text-slate-500">
                <Icon className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-slate-600">
          By signing in you agree to our{' '}
          <a href="#" className="text-slate-400 hover:text-white transition">Terms</a>
          {' & '}
          <a href="#" className="text-slate-400 hover:text-white transition">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
