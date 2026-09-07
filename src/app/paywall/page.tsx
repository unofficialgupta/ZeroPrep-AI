'use client';

import React, { useState, useEffect } from 'react';
import { Zap, CheckCircle2, Sparkles, Key, ExternalLink, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function PaywallPage() {
  const { sessionToken, refreshLicense, user } = useAuth();
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Poll for license activation after user pays in Razorpay checkout
  useEffect(() => {
    if (!isPolling) return;
    const interval = setInterval(async () => {
      await refreshLicense();
    }, 3000);
    // Stop polling after 5 minutes
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setIsPolling(false);
    }, 5 * 60 * 1000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [isPolling, refreshLicense]);

  const handlePay = async () => {
    setError(null);
    setIsCreatingOrder(true);

    try {
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
      });

      const data = await res.json();

      if (data.alreadyActive) {
        await refreshLicense();
        return;
      }

      if (!res.ok || data.error) throw new Error(data.error || 'Failed to create order');

      const desktop = (window as any).zeroPrepDesktop;

      // Build Razorpay checkout URL
      const checkoutUrl =
        `https://api.razorpay.com/v1/checkout/embedded` +
        `?key=${data.keyId}` +
        `&order_id=${data.orderId}` +
        `&name=${encodeURIComponent('ZeroPrep AI')}` +
        `&description=${encodeURIComponent('Lifetime License — ₹100 one-time')}` +
        `&prefill[email]=${encodeURIComponent(user?.email ?? '')}` +
        `&prefill[name]=${encodeURIComponent(user?.name ?? '')}` +
        `&theme[color]=${encodeURIComponent('#0052cc')}`;

      // Open in system browser (Electron) or new tab (web)
      if (desktop?.openExternalUrl) {
        desktop.openExternalUrl(checkoutUrl);
      } else {
        window.open(checkoutUrl, '_blank');
      }

      // Start polling for license activation
      setIsPolling(true);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || 'Payment failed. Please try again.');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-4 font-sans antialiased">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#0052cc]/8 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0052cc] shadow-xl shadow-[#0052cc]/40 mx-auto">
            <Zap className="h-7 w-7 text-white fill-current" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">One-time access</h1>
            <p className="text-slate-400 text-sm mt-1">Pay once. Use forever. No subscriptions.</p>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Price Banner */}
          <div className="bg-[#0052cc] px-6 py-5 text-center">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-slate-300 text-lg font-medium">₹</span>
              <span className="text-5xl font-black text-white tracking-tight">100</span>
            </div>
            <p className="text-blue-200 text-sm mt-1 font-medium">One-time · Lifetime · No renewals</p>
          </div>

          {/* Features */}
          <div className="px-6 py-6 space-y-4">
            {[
              { icon: Sparkles, text: 'Real-time AI answers during live interviews' },
              { icon: Key,      text: 'Bring your own AI key — we never charge for AI usage' },
              { icon: CheckCircle2, text: 'Invisible Stealth HUD — hidden from screen shares' },
              { icon: CheckCircle2, text: 'Screen capture + OCR + LeetCode/HackerRank analysis' },
              { icon: CheckCircle2, text: 'Dual-channel audio: hear & transcribe your interviewer' },
              { icon: CheckCircle2, text: 'All future updates included' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3">
                <Icon className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm">{text}</span>
              </div>
            ))}

            {/* Free tier note */}
            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs text-emerald-300 flex items-start gap-2">
              <Key className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span>
                <strong>Need a free AI key?</strong> Get a free Gemini API key from Google AI Studio in 2 minutes —
                no credit card required.{' '}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-emerald-200 inline-flex items-center gap-0.5"
                >
                  Get it here <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="px-6 pb-6 space-y-3">
            {error && (
              <p className="text-xs text-rose-400 text-center">{error}</p>
            )}

            {isPolling ? (
              <div className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600/20 border border-emerald-500/30 px-4 py-3 text-sm font-semibold text-emerald-300">
                <Loader2 className="h-4 w-4 animate-spin" />
                Waiting for payment confirmation...
              </div>
            ) : (
              <button
                onClick={handlePay}
                disabled={isCreatingOrder}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0052cc] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-[#0052cc]/40 hover:bg-[#0043a8] active:scale-98 transition disabled:opacity-60 cursor-pointer"
              >
                {isCreatingOrder ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Creating order...</>
                ) : (
                  'Pay ₹100 — Unlock Lifetime Access'
                )}
              </button>
            )}

            <p className="text-center text-xs text-slate-600">
              Secured by Razorpay · No recurring charges · Cancel anytime means nothing to cancel
            </p>
          </div>
        </div>

        {/* Transparency note */}
        <p className="text-center text-xs text-slate-600 leading-relaxed">
          The ₹100 covers infrastructure and maintenance costs.{' '}
          <strong className="text-slate-500">We make zero money from your AI usage</strong> —
          you pay your AI provider directly with your own key.
        </p>
      </div>
    </div>
  );
}
