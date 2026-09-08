'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Download,
  Apple,
  Laptop,
  CheckCircle2,
  Terminal,
  ShieldCheck,
  Info,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';

// ─── GitHub Releases Download URLs ────────────────────────────────────────────
const GITHUB_RELEASE_BASE =
  'https://github.com/unofficialgupta/ZeroPrep-AI/releases/latest/download';

const DOWNLOAD_URLS = {
  macArm: `${GITHUB_RELEASE_BASE}/ZeroPrep-AI-1.0.0.dmg`,
  macIntel: `${GITHUB_RELEASE_BASE}/ZeroPrep-AI-1.0.0.dmg`,
  windows: `${GITHUB_RELEASE_BASE}/ZeroPrep-AI-Setup-1.0.0.exe`,
  linux: `${GITHUB_RELEASE_BASE}/ZeroPrep-AI-1.0.0.AppImage`,
} as const;

export default function DownloadClient() {
  const [detectedOS, setDetectedOS] = useState<'mac-arm' | 'mac-intel' | 'windows' | 'linux'>('mac-arm');
  const [copiedCmd, setCopiedCmd] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent.toLowerCase();
      if (ua.includes('win')) {
        setDetectedOS('windows');
      } else if (ua.includes('linux')) {
        setDetectedOS('linux');
      } else {
        setDetectedOS('mac-arm');
      }
    }
  }, []);

  const copyMacTerminal = () => {
    navigator.clipboard.writeText('xattr -cr /Applications/ZeroPrep\\ AI.app');
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700 mb-4">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            <span>Official Desktop Distribution • v1.0.0 Stable</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            Download PrepZero AI
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Choose your operating system below to download the stealth HUD desktop application.
            Direct download, no sign-up required to install.
          </p>
        </div>

        {/* ─────────────────── DOWNLOAD CARDS GRID ─────────────────── */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* macOS Apple Silicon */}
          <div
            className={`relative flex flex-col justify-between rounded-2xl border p-7 shadow-sm transition-all ${
              detectedOS === 'mac-arm'
                ? 'border-blue-500 bg-blue-50/20 ring-2 ring-blue-500/20 shadow-md'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            {detectedOS === 'mac-arm' && (
              <span className="absolute -top-3 left-6 rounded-full bg-blue-600 px-3 py-0.5 text-[11px] font-bold text-white uppercase tracking-wider shadow-sm">
                Recommended for your Mac
              </span>
            )}

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white">
                  <Apple className="h-6 w-6" />
                </div>
                <span className="text-xs font-mono text-slate-400">v1.0.0 • 86 MB</span>
              </div>

              <h2 className="text-xl font-bold text-slate-900">macOS Apple Silicon</h2>
              <p className="text-xs text-slate-500 mt-1">M1, M2, M3, M4 & newer Macs</p>

              <ul className="mt-6 space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Universal DMG installer</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Native CoreAudio loopback</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>macOS 12.0+ (Monterey to Sequoia)</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <a
                href={DOWNLOAD_URLS.macArm}
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-bold text-white shadow-md hover:bg-slate-800 transition-all cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>Download DMG (Apple Silicon)</span>
              </a>
              <div className="mt-2.5 text-center">
                <a
                  href={DOWNLOAD_URLS.macIntel}
                  rel="noopener noreferrer"
                  className="text-[11px] text-slate-500 hover:text-blue-600 transition-colors underline"
                >
                  Or download for Intel Macs (.dmg)
                </a>
              </div>
            </div>
          </div>

          {/* Windows Installer */}
          <div
            className={`relative flex flex-col justify-between rounded-2xl border p-7 shadow-sm transition-all ${
              detectedOS === 'windows'
                ? 'border-blue-500 bg-blue-50/20 ring-2 ring-blue-500/20 shadow-md'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            {detectedOS === 'windows' && (
              <span className="absolute -top-3 left-6 rounded-full bg-blue-600 px-3 py-0.5 text-[11px] font-bold text-white uppercase tracking-wider shadow-sm">
                Recommended for your PC
              </span>
            )}

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <Laptop className="h-6 w-6" />
                </div>
                <span className="text-xs font-mono text-slate-400">v1.0.0 • 92 MB</span>
              </div>

              <h2 className="text-xl font-bold text-slate-900">Windows 10 / 11</h2>
              <p className="text-xs text-slate-500 mt-1">64-bit Architecture (x64)</p>

              <ul className="mt-6 space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Standard NSIS Setup Installer</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>WASAPI Audio Loopback support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Windows 10 (Build 19041+) & Win 11</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <a
                href={DOWNLOAD_URLS.windows}
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-500/25 hover:bg-blue-700 transition-all cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>Download Windows (.exe)</span>
              </a>
              <div className="mt-2.5 text-center text-[11px] text-slate-500">
                Tested on Windows 11 & 10 (64-bit)
              </div>
            </div>
          </div>

          {/* Linux AppImage */}
          <div
            className={`relative flex flex-col justify-between rounded-2xl border p-7 shadow-sm transition-all ${
              detectedOS === 'linux'
                ? 'border-blue-500 bg-blue-50/20 ring-2 ring-blue-500/20 shadow-md'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            {detectedOS === 'linux' && (
              <span className="absolute -top-3 left-6 rounded-full bg-blue-600 px-3 py-0.5 text-[11px] font-bold text-white uppercase tracking-wider shadow-sm">
                Recommended for your OS
              </span>
            )}

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800 text-white">
                  <Terminal className="h-6 w-6" />
                </div>
                <span className="text-xs font-mono text-slate-400">v1.0.0 • 89 MB</span>
              </div>

              <h2 className="text-xl font-bold text-slate-900">Linux Distribution</h2>
              <p className="text-xs text-slate-500 mt-1">Ubuntu, Fedora, Debian & Arch</p>

              <ul className="mt-6 space-y-2.5 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Standalone AppImage format</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>PulseAudio & PipeWire compatible</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>No root or sudo install required</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <a
                href={DOWNLOAD_URLS.linux}
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-800 px-5 py-3.5 text-sm font-bold text-white shadow-md hover:bg-slate-700 transition-all cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>Download AppImage (Linux)</span>
              </a>
              <div className="mt-2.5 text-center text-[11px] text-slate-500">
                Run <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">chmod +x</code> to execute
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────── INSTALLATION GUIDES ─────────────────── */}
        <div className="mt-16 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-600" />
            <span>First-Time Installation Instructions</span>
          </h3>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* macOS Gatekeeper tip */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5">
              <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2">
                <Apple className="h-4 w-4 text-amber-700" />
                <span>macOS Gatekeeper Note</span>
              </h4>
              <p className="mt-2 text-xs text-amber-800 leading-relaxed">
                Because PrepZero AI is distributed directly as an open-architecture binary without expensive Apple Developer notarization certificates, macOS may show an &quot;unidentified developer&quot; or &quot;app is damaged&quot; notice upon first opening.
              </p>
              <div className="mt-3">
                <span className="text-[11px] font-semibold text-amber-900">
                  Quick fix: Run this in Terminal once:
                </span>
                <div className="mt-1.5 flex items-center justify-between rounded-lg bg-slate-900 p-2 text-xs font-mono text-slate-200">
                  <code className="text-[11px] select-all">xattr -cr /Applications/ZeroPrep\ AI.app</code>
                  <button
                    onClick={copyMacTerminal}
                    className="flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 ml-2"
                  >
                    {copiedCmd ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedCmd ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Windows SmartScreen tip */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-5">
              <h4 className="text-sm font-bold text-blue-900 flex items-center gap-2">
                <Laptop className="h-4 w-4 text-blue-700" />
                <span>Windows Defender SmartScreen</span>
              </h4>
              <p className="mt-2 text-xs text-blue-800 leading-relaxed">
                When you run the installer for the first time, Windows Defender may display a blue &quot;Windows protected your PC&quot; alert.
              </p>
              <div className="mt-3 text-xs text-blue-900 space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold">1.</span> Click <strong>&quot;More info&quot;</strong> on the prompt
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold">2.</span> Click <strong>&quot;Run anyway&quot;</strong> to complete installation
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold">3.</span> The desktop shortcut will be placed on your screen
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────── SYSTEM PERMISSIONS CHECKLIST ─────────────────── */}
        <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50/60 p-8">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <span>Required System Permissions</span>
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            PrepZero AI requires two standard OS permissions to function during technical rounds:
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl bg-white p-5 border border-slate-200">
              <h4 className="font-bold text-sm text-slate-900">1. Microphone & Audio Loopback</h4>
              <p className="text-xs text-slate-600 mt-1">
                Used to transcribe your voice and capture the interviewer&apos;s speech through the internal audio loopback. Audio is transcribed in real-time and never recorded to disk.
              </p>
            </div>
            <div className="rounded-xl bg-white p-5 border border-slate-200">
              <h4 className="font-bold text-sm text-slate-900">2. Screen Recording (OCR Only)</h4>
              <p className="text-xs text-slate-600 mt-1">
                Allows the app to snip coding questions, LeetCode problem descriptions, and IDE code snippets when you press the OCR shortcut.
              </p>
            </div>
          </div>
        </div>

        {/* Web version banner */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between rounded-2xl border border-blue-200 bg-blue-50/70 p-6">
          <div>
            <h4 className="text-sm font-bold text-blue-950">Don&apos;t want to install the desktop app yet?</h4>
            <p className="text-xs text-blue-800 mt-0.5">
              You can test the AI reasoning, practice sessions, and mock questions directly in your browser.
            </p>
          </div>
          <Link
            href="/dashboard/callSessions"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            <span>Launch Web App</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
