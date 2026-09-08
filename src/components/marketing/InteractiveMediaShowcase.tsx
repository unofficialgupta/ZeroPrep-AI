'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  Play,
  Pause,
  Maximize2,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldCheck,
  Eye,
  LayoutDashboard,
  Code2,
  Terminal,
  CheckCircle2,
  X
} from 'lucide-react';

type TabType = 'video' | 'stealth' | 'dashboard' | 'session';

export default function InteractiveMediaShowcase() {
  const [activeTab, setActiveTab] = useState<TabType>('video');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="mt-14 relative mx-auto max-w-5xl">
      {/* ── Mode Switcher Tabs ── */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        <button
          onClick={() => setActiveTab('video')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm ${
            activeTab === 'video'
              ? 'bg-blue-600 text-white shadow-blue-500/25 ring-2 ring-blue-600/30'
              : 'bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          <span>Real Tool Demo Video</span>
          <span className="hidden sm:inline-block text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">
            1080p
          </span>
        </button>

        <button
          onClick={() => setActiveTab('stealth')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm ${
            activeTab === 'stealth'
              ? 'bg-blue-600 text-white shadow-blue-500/25 ring-2 ring-blue-600/30'
              : 'bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Real Hidden Window (Stealth HUD)</span>
        </button>

        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm ${
            activeTab === 'dashboard'
              ? 'bg-blue-600 text-white shadow-blue-500/25 ring-2 ring-blue-600/30'
              : 'bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <LayoutDashboard className="h-3.5 w-3.5" />
          <span>Desktop Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('session')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm ${
            activeTab === 'session'
              ? 'bg-blue-600 text-white shadow-blue-500/25 ring-2 ring-blue-600/30'
              : 'bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Code2 className="h-3.5 w-3.5" />
          <span>Session & Audio Replay</span>
        </button>
      </div>

      {/* ── Main Showcase Container ── */}
      <div className="rounded-2xl p-2 bg-gradient-to-b from-slate-200/90 to-slate-100/60 shadow-2xl border border-slate-200 backdrop-blur-sm">
        <div className="relative overflow-hidden rounded-xl bg-slate-950 border border-slate-800 shadow-inner">
          {/* Mac-style Window Header Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/90">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500/90" />
              <span className="h-3 w-3 rounded-full bg-amber-500/90" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/90" />
              <span className="ml-2 text-xs font-mono text-slate-400">
                {activeTab === 'video' && 'ZeroPrep AI — Live Product Walkthrough & Demo Video'}
                {activeTab === 'stealth' && 'ZeroPrep AI Stealth HUD — Live Google Onsite LeetCode Session'}
                {activeTab === 'dashboard' && 'ZeroPrep Desktop Client — Call Sessions & Latency Analytics'}
                {activeTab === 'session' && 'ZeroPrep Session Detail — Dual-Channel Audio & Code Fix Log'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {activeTab === 'video' && (
                <div className="flex items-center gap-2 text-[11px] font-mono text-blue-400 bg-blue-950/70 px-2.5 py-1 rounded-full border border-blue-800/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                  REAL SCREENCAST RECORDING
                </div>
              )}
              {activeTab === 'stealth' && (
                <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-emerald-950/70 px-2.5 py-1 rounded-full border border-emerald-800/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  STEALTH ACTIVE (Window Invisible to Zoom/Meet)
                </div>
              )}
              {activeTab === 'dashboard' && (
                <div className="flex items-center gap-2 text-[11px] font-mono text-indigo-400 bg-indigo-950/70 px-2.5 py-1 rounded-full border border-indigo-800/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  DESKTOP CLIENT (ELECTRON 44)
                </div>
              )}
              {activeTab === 'session' && (
                <div className="flex items-center gap-2 text-[11px] font-mono text-amber-400 bg-amber-950/70 px-2.5 py-1 rounded-full border border-amber-800/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  GEMINI 2.5 FLASH MULTI-MODAL LOG
                </div>
              )}

              {/* Expand Fullscreen Button */}
              <button
                onClick={() => setIsFullscreen(true)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
                title="View Full Resolution"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* ── Content Display Area ── */}
          <div className="relative aspect-video w-full bg-slate-950">
            {/* 1. Real Demo Video */}
            {activeTab === 'video' && (
              <div className="relative h-full w-full group">
                <video
                  ref={videoRef}
                  src="/videos/zeroprep-demo.mp4"
                  poster="/videos/demo-poster.jpg"
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src="/videos/zeroprep-demo.webm" type="video/webm" />
                  <source src="/videos/zeroprep-demo.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* Floating Video Overlay Controls */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-300 opacity-90 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={togglePlay}
                    className="flex items-center gap-1.5 hover:text-white transition"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                    <span>{isPlaying ? 'Pause' : 'Play'}</span>
                  </button>
                  <span className="text-slate-600">|</span>
                  <button
                    onClick={toggleMute}
                    className="flex items-center gap-1.5 hover:text-white transition"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <VolumeX className="h-3.5 w-3.5 text-slate-400" /> : <Volume2 className="h-3.5 w-3.5 text-emerald-400" />}
                  </button>
                  <span className="text-slate-600">|</span>
                  <button
                    onClick={() => setIsFullscreen(true)}
                    className="hover:text-white transition"
                    title="Fullscreen"
                  >
                    <Maximize2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}

            {/* 2. Real Hidden Window (Stealth HUD) Screenshot */}
            {activeTab === 'stealth' && (
              <div className="relative h-full w-full cursor-zoom-in" onClick={() => setIsFullscreen(true)}>
                <Image
                  src="/screenshots/real-hidden-window.png"
                  alt="Real PrepZero AI Hidden Stealth Window floating over LeetCode coding interview"
                  fill
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  priority
                  className="object-cover"
                />
                {/* Floating Feature Annotation Badges */}
                <div className="absolute top-4 left-4 bg-slate-950/90 border border-slate-800 text-white rounded-lg px-3 py-1.5 text-xs font-mono shadow-xl backdrop-blur-md flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Interview: LeetCode Problem 14 (Longest Common Prefix in C++)</span>
                </div>
                <div className="absolute bottom-4 left-4 bg-emerald-950/90 border border-emerald-700/60 text-emerald-200 rounded-lg px-3 py-1.5 text-xs font-mono shadow-xl backdrop-blur-md flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>HUD Invisible to Zoom/Meet Screen Share via OS Content Protection</span>
                </div>
              </div>
            )}

            {/* 3. Real Desktop Dashboard Screenshot */}
            {activeTab === 'dashboard' && (
              <div className="relative h-full w-full cursor-zoom-in" onClick={() => setIsFullscreen(true)}>
                <Image
                  src="/screenshots/real-tool-dashboard.png"
                  alt="Real PrepZero AI Desktop Dashboard showing Call Sessions and Latency Metrics"
                  fill
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  priority
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-slate-950/90 border border-slate-800 text-white rounded-lg px-3 py-1.5 text-xs font-mono shadow-xl backdrop-blur-md flex items-center gap-2">
                  <LayoutDashboard className="h-3.5 w-3.5 text-blue-400" />
                  <span>Actual Desktop App UI: 4 Recorded Calls • Avg Latency 655ms</span>
                </div>
              </div>
            )}

            {/* 4. Real Session Detail Replay Screenshot */}
            {activeTab === 'session' && (
              <div className="relative h-full w-full cursor-zoom-in" onClick={() => setIsFullscreen(true)}>
                <Image
                  src="/screenshots/real-session-drawer.png"
                  alt="Real PrepZero AI Session Detail Replay with Audio Scrubber and Gemini Code Analysis"
                  fill
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  priority
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-slate-950/90 border border-slate-800 text-white rounded-lg px-3 py-1.5 text-xs font-mono shadow-xl backdrop-blur-md flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Dual-Channel Audio Scrubber + Gemini Code Bug Fix Breakdown</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Feature Callout Floating Pills */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-2 text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-2 bg-white/90 px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm backdrop-blur-md">
            <Volume2 className="h-4 w-4 text-blue-600" />
            <span>Dual-Channel Audio Loopback: Active (No Virtual Cables)</span>
          </div>

          <div className="flex items-center gap-2 bg-white/90 px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm backdrop-blur-md">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>0% Screen Capture Leakage in Zoom / Google Meet</span>
          </div>

          <div className="flex items-center gap-2 bg-white/90 px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm backdrop-blur-md">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            <span>Powered by Google Gemini 2.5 Flash (&lt;800ms)</span>
          </div>
        </div>
      </div>

      {/* ── Fullscreen Lightbox Modal ── */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-8 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsFullscreen(false)}
        >
          <div className="relative max-w-7xl w-full h-[90vh] flex flex-col items-center justify-center">
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute -top-10 right-0 text-white/80 hover:text-white flex items-center gap-1.5 text-xs font-mono bg-white/10 px-3 py-1 rounded-full transition"
            >
              <X className="h-4 w-4" />
              <span>Close [Esc]</span>
            </button>

            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
              {activeTab === 'video' ? (
                <video
                  src="/videos/zeroprep-demo.mp4"
                  autoPlay
                  controls
                  loop
                  playsInline
                  className="w-full h-full object-contain bg-black"
                >
                  <source src="/videos/zeroprep-demo.webm" type="video/webm" />
                  <source src="/videos/zeroprep-demo.mp4" type="video/mp4" />
                </video>
              ) : (
                <Image
                  src={
                    activeTab === 'stealth'
                      ? '/screenshots/real-hidden-window.png'
                      : activeTab === 'dashboard'
                      ? '/screenshots/real-tool-dashboard.png'
                      : '/screenshots/real-session-drawer.png'
                  }
                  alt="Full resolution preview"
                  fill
                  className="object-contain bg-slate-950"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
