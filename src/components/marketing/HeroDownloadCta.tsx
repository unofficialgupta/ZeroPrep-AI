'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download, Laptop, ArrowRight } from 'lucide-react';

import { DOWNLOAD_LINKS } from '@/config/downloads';

interface HeroDownloadCtaProps {
  variant?: 'hero' | 'banner';
}

export default function HeroDownloadCta({ variant = 'hero' }: HeroDownloadCtaProps) {
  const [userOS, setUserOS] = useState<'mac' | 'windows' | 'linux'>('mac');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent.toLowerCase();
      if (ua.includes('win')) {
        setUserOS('windows');
      } else if (ua.includes('linux')) {
        setUserOS('linux');
      } else {
        setUserOS('mac');
      }
    }
  }, []);

  const getDownloadHref = (os: 'mac' | 'windows' | 'linux') => DOWNLOAD_LINKS[os];

  const getOSLabel = (os: 'mac' | 'windows' | 'linux') => {
    switch (os) {
      case 'windows':
        return 'Windows (64-bit .exe)';
      case 'linux':
        return 'Linux (.AppImage)';
      case 'mac':
      default:
        return 'macOS (.dmg Apple Silicon / Intel)';
    }
  };

  if (variant === 'banner') {
    return (
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href={getDownloadHref(userOS)}
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-500/30 transition-all hover:bg-blue-500 hover:scale-105 active:scale-100 cursor-pointer"
        >
          <Download className="h-5 w-5" />
          <span>Download for {getOSLabel(userOS)}</span>
        </a>
        <Link
          href="/download"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/80 px-6 py-4 text-base font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
        >
          <span>View All Platforms (.dmg, .exe)</span>
          <ArrowRight className="h-4 w-4 text-slate-400" />
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        {/* Primary Detected Download */}
        <a
          href={getDownloadHref(userOS)}
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-2xl hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
        >
          <Download className="h-5 w-5" />
          <span>Download for {getOSLabel(userOS)}</span>
        </a>

        {/* Other Platforms Selector / Direct Hub */}
        <Link
          href="/download"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-6 py-4 text-base font-semibold text-slate-700 shadow-sm backdrop-blur-md transition-all hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300"
        >
          <Laptop className="h-4 w-4 text-slate-500" />
          <span>All Downloads &amp; OS versions</span>
          <ArrowRight className="h-4 w-4 text-slate-400" />
        </Link>
      </div>

      {/* OS Quick Links */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 font-medium">
        <span>Also available for:</span>
        <a
          href={DOWNLOAD_LINKS.mac}
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition-colors underline underline-offset-2"
        >
          macOS (.dmg)
        </a>
        <span>•</span>
        <a
          href={DOWNLOAD_LINKS.windows}
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition-colors underline underline-offset-2"
        >
          Windows (.exe)
        </a>
        <span>•</span>
        <a
          href={DOWNLOAD_LINKS.linux}
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition-colors underline underline-offset-2"
        >
          Linux (.AppImage)
        </a>
      </div>
    </>
  );
}
