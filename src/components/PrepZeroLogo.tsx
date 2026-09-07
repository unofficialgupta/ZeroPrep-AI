'use client';

import React from 'react';
import Link from 'next/link';

interface PrepZeroLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'horizontal' | 'icon-only';
  theme?: 'light' | 'dark';
  showTagline?: boolean;
  tagline?: string;
  href?: string;
  className?: string;
}

export default function PrepZeroLogo({
  size = 'md',
  variant = 'horizontal',
  theme = 'light',
  showTagline = true,
  tagline = 'Ace Any Interview. Zero Prep Required.',
  href = '/',
  className = '',
}: PrepZeroLogoProps) {
  // Dimension configurations
  const dimensions = {
    sm: {
      icon: 'h-7 w-7',
      text: 'text-base',
      tagline: 'text-[9px]',
      badge: 'text-[9px] px-1 py-0.2',
      gap: 'gap-2',
    },
    md: {
      icon: 'h-9 w-9',
      text: 'text-lg',
      tagline: 'text-[10px]',
      badge: 'text-[10px] px-1.5 py-0.5',
      gap: 'gap-2.5',
    },
    lg: {
      icon: 'h-11 w-11',
      text: 'text-2xl',
      tagline: 'text-xs',
      badge: 'text-xs px-2 py-0.5',
      gap: 'gap-3',
    },
    xl: {
      icon: 'h-14 w-14',
      text: 'text-3xl',
      tagline: 'text-sm',
      badge: 'text-xs px-2.5 py-1',
      gap: 'gap-3.5',
    },
  }[size];

  const textColor = theme === 'dark' ? 'text-white' : 'text-slate-900';
  const taglineColor = theme === 'dark' ? 'text-slate-400' : 'text-slate-500';

  const logoMark = (
    <div
      className={`relative flex ${dimensions.icon} flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white shadow-md shadow-blue-500/20 ring-1 ring-blue-500/30 transition-transform duration-200 group-hover:scale-105`}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full p-1.5 drop-shadow"
      >
        <defs>
          <linearGradient id="pzNeon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#38BDF8" />
            <stop offset="60%" stop-color="#3B82F6" />
            <stop offset="100%" stop-color="#6366F1" />
          </linearGradient>
          <linearGradient id="pzStem" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="100%" stop-color="#E2E8F0" />
          </linearGradient>
        </defs>

        {/* Stealth Hexagonal Shield Contour */}
        <path
          d="M50 14 L80 28 V56 C80 72 67 84 50 88 C33 84 20 72 20 56 V28 Z"
          fill="none"
          stroke="url(#pzNeon)"
          strokeWidth="5"
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity="0.9"
        />

        {/* Stem of P */}
        <path
          d="M38 32 V70"
          stroke="url(#pzStem)"
          strokeWidth="5.5"
          strokeLinecap="round"
        />

        {/* Loop of P intersecting 0 orbit */}
        <path
          d="M38 32 H54 C63 32 68 37 68 44 C68 51 63 56 54 56 H38"
          fill="none"
          stroke="url(#pzNeon)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Central Quantum Intelligence Node */}
        <circle cx="53" cy="44" r="3.5" fill="#38BDF8" />
        <circle cx="53" cy="44" r="1.5" fill="#FFFFFF" />
      </svg>

      {/* Stealth Active Pulse Dot */}
      <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-white" />
      </span>
    </div>
  );

  if (variant === 'icon-only') {
    return href ? (
      <Link href={href} className={`inline-flex group ${className}`} aria-label="PrepZero AI Home">
        {logoMark}
      </Link>
    ) : (
      <div className={`inline-flex ${className}`}>{logoMark}</div>
    );
  }

  const content = (
    <div className={`inline-flex items-center ${dimensions.gap} group select-none ${className}`}>
      {logoMark}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-extrabold tracking-tight ${dimensions.text} ${textColor}`}>
            Prep<span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">Zero</span>
          </span>
          <span
            className={`rounded-md bg-blue-600/10 border border-blue-500/25 font-black uppercase tracking-wider text-blue-600 ${dimensions.badge}`}
          >
            AI
          </span>
        </div>
        {showTagline && (
          <span
            className={`mt-1 font-medium tracking-tight ${dimensions.tagline} ${taglineColor} truncate max-w-[260px] sm:max-w-none`}
          >
            {tagline}
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex focus:outline-none" aria-label="PrepZero AI Home">
        {content}
      </Link>
    );
  }

  return content;
}
