'use client';

import React from 'react';
import { AlertTriangle, Laptop, LogIn, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// Two distinct error states with specific copy and different CTAs
const ERROR_STATES = {
  SESSION_INVALIDATED: {
    icon: LogIn,
    iconColor: 'text-amber-400',
    bgColor: 'bg-amber-500/10 border-amber-500/20',
    title: 'Logged in on another device',
    description:
      'Your ZeroPrep AI account was signed into from another device or browser. ' +
      'That session is now active and this one has been invalidated for security.',
    action: 'Log in here to reclaim access.',
    cta: 'Sign in again',
    ctaAction: 'login',
  },
  DEVICE_MISMATCH: {
    icon: Laptop,
    iconColor: 'text-rose-400',
    bgColor: 'bg-rose-500/10 border-rose-500/20',
    title: 'License bound to a different device',
    description:
      'Your ZeroPrep AI lifetime license is activated on a different computer. ' +
      'For security, each license is locked to one device at the time of payment.',
    action: 'To transfer your license to this device, contact support.',
    cta: 'Contact support',
    ctaAction: 'support',
  },
} as const;

export default function DeviceErrorPage() {
  const { sessionError, login } = useAuth();
  const errorKey = sessionError ?? 'SESSION_INVALIDATED';
  const state = ERROR_STATES[errorKey] ?? ERROR_STATES.SESSION_INVALIDATED;
  const Icon = state.icon;

  const handleCta = () => {
    if (state.ctaAction === 'login') {
      login();
    } else {
      window.open('mailto:support@zeroprep.ai?subject=License%20Transfer%20Request', '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-4 font-sans antialiased">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-slate-700/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm space-y-6">
        {/* Error Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 space-y-6 shadow-2xl text-center">
          {/* Icon */}
          <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border ${state.bgColor}`}>
            <Icon className={`h-7 w-7 ${state.iconColor}`} />
          </div>

          {/* Copy */}
          <div className="space-y-2">
            <h1 className="text-lg font-bold text-white">{state.title}</h1>
            <p className="text-sm text-slate-400 leading-relaxed">{state.description}</p>
            <p className="text-xs text-slate-500">{state.action}</p>
          </div>

          {/* CTA */}
          <button
            onClick={handleCta}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0052cc] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0052cc]/30 hover:bg-[#0043a8] transition cursor-pointer"
          >
            {state.ctaAction === 'login' ? (
              <><LogIn className="h-4 w-4" /> {state.cta}</>
            ) : (
              <><Mail className="h-4 w-4" /> {state.cta}</>
            )}
          </button>

          {/* General help */}
          <div className="flex items-start gap-2 rounded-xl bg-white/5 border border-white/10 p-3 text-left">
            <AlertTriangle className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 leading-relaxed">
              This is a security feature to protect your account from unauthorized use. 
              If you believe this is an error, please{' '}
              <a
                href="mailto:support@zeroprep.ai"
                className="text-slate-400 hover:text-white underline transition"
              >
                contact support
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
