'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  Copy,
  Check,
  Sparkles,
  Bug,
  Cpu,
  Code,
  Volume2,
  Calendar,
  Clock,
  Search,
  Maximize2
} from 'lucide-react';
import { CallSession } from '@/lib/storage';

interface SessionDetailDrawerProps {
  session: CallSession | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function SessionDetailDrawer({
  session,
  isOpen,
  onClose,
}: SessionDetailDrawerProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgressSec, setAudioProgressSec] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);
  const [transcriptSearch, setTranscriptSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'interviewer' | 'candidate'>('all');

  const totalDurationSec = session?.audioDurationSec || 480;

  // Web Audio Synth & Progress Interval - ZP-BUG-005
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    let audioCtx: AudioContext | null = null;
    let osc: OscillatorNode | null = null;
    let gain: GainNode | null = null;

    if (isPlayingAudio) {
      try {
        const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtxClass) {
          audioCtx = new AudioCtxClass();
          osc = audioCtx.createOscillator();
          gain = audioCtx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(220, audioCtx.currentTime); // A3 harmonic
          gain.gain.setValueAtTime(0.015, audioCtx.currentTime); // Soft subtle tone

          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
        }
      } catch (e) {
        console.warn('AudioContext playback error:', e);
      }

      interval = setInterval(() => {
        setAudioProgressSec((prev) => {
          if (prev >= totalDurationSec) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
      try {
        osc?.stop();
        audioCtx?.close();
      } catch {}
    };
  }, [isPlayingAudio, totalDurationSec]);

  if (!isOpen || !session) return null;

  const handleCopyCode = () => {
    if (session.analysis.correctCode) {
      navigator.clipboard.writeText(session.analysis.correctCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const formatAudioTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeek = (index: number, totalBars: number) => {
    const fraction = (index + 1) / totalBars;
    setAudioProgressSec(Math.round(fraction * totalDurationSec));
  };

  const filteredTranscripts = session.transcripts.filter((t) => {
    const matchesFilter =
      activeTab === 'all' ||
      (activeTab === 'interviewer' && t.speaker === 'Interviewer') ||
      (activeTab === 'candidate' && t.speaker === 'Candidate');

    const matchesSearch =
      transcriptSearch.trim() === '' ||
      t.text.toLowerCase().includes(transcriptSearch.toLowerCase()) ||
      t.speaker.toLowerCase().includes(transcriptSearch.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 flex h-full w-full max-w-5xl flex-col border-l border-slate-200 bg-white shadow-2xl overflow-hidden">
        {/* Top Header Drawer Bar */}
        <div className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
          <div className="flex items-center gap-3">
            <span
              className={`rounded-lg px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${
                session.platform === 'Google Meet'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : session.platform === 'Zoom'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-purple-50 text-purple-700 border border-purple-200'
              }`}
            >
              {session.platform}
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                {session.title}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5 font-medium">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {session.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {session.duration}
                </span>
                <span>•</span>
                <span className="text-emerald-700 font-mono text-[11px] font-semibold">
                  {session.latencyMs}ms latency
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Audio Recording Playback Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-2.5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0052cc] text-white hover:bg-[#0043a8] transition shadow-xs"
            >
              {isPlayingAudio ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
            </button>
            <div className="text-xs">
              <span className="font-semibold text-slate-800">Call Recording Preview</span>
              <span className="text-slate-500 ml-2 font-medium">Dual Channel (Mic + Loopback)</span>
            </div>
          </div>

          {/* Audio Waveform visualization with interactive seek */}
          <div className="flex items-center gap-1.5 flex-1 max-w-xs mx-6 cursor-pointer py-1" title="Click anywhere to seek">
            {[35, 60, 45, 80, 50, 95, 40, 70, 85, 30, 90, 65, 45, 80, 55, 75, 40, 90, 60, 35].map(
              (height, i, arr) => {
                const isPassed = (i / arr.length) <= (audioProgressSec / totalDurationSec);
                return (
                  <div
                    key={i}
                    onClick={() => handleSeek(i, arr.length)}
                    className={`w-1.5 rounded-full transition-all duration-150 hover:opacity-100 ${
                      isPassed
                        ? 'bg-[#0052cc]'
                        : isPlayingAudio
                        ? 'bg-[#0052cc]/40 animate-pulse'
                        : 'bg-slate-300'
                    }`}
                    style={{ height: `${height}%`, maxHeight: '24px', minHeight: '6px' }}
                  />
                );
              }
            )}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 font-medium">
            <Volume2 className="h-3.5 w-3.5 text-slate-400" />
            <span>{formatAudioTime(audioProgressSec)} / {session.duration}</span>
          </div>
        </div>

        {/* Split View Content Area */}
        <div className="grid h-[calc(100%-120px)] grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left Panel: Dual-channel transcript timeline (5 cols) */}
          <div className="lg:col-span-5 flex flex-col border-r border-slate-200 bg-slate-50/50 h-full overflow-hidden">
            {/* Transcript Filter & Search */}
            <div className="p-3 border-b border-slate-200 space-y-2 bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter transcripts..."
                  value={transcriptSearch}
                  onChange={(e) => setTranscriptSearch(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-[#0052cc] focus:bg-white focus:outline-none"
                />
              </div>

              {/* Speaker tabs */}
              <div className="flex items-center gap-1">
                {(['all', 'interviewer', 'candidate'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-semibold capitalize transition ${
                      activeTab === tab
                        ? 'bg-[#0052cc] text-white shadow-2xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
                <span className="ml-auto text-[11px] text-slate-500 font-medium">
                  {filteredTranscripts.length} lines
                </span>
              </div>
            </div>

            {/* Transcripts List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredTranscripts.map((item) => {
                const isInterviewer = item.speaker === 'Interviewer';
                return (
                  <div
                    key={item.id}
                    className={`rounded-xl p-3.5 border transition ${
                      isInterviewer
                        ? 'border-purple-200 bg-purple-50/70 text-purple-950'
                        : 'border-blue-200 bg-blue-50/70 text-blue-950'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          isInterviewer
                            ? 'bg-purple-100 text-purple-700 border border-purple-200'
                            : 'bg-blue-100 text-blue-700 border border-blue-200'
                        }`}
                      >
                        [{item.speaker}]
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 font-medium">
                        {item.timestamp}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Screen Capture + Gemini Generated Code / Bug Answers (7 cols) */}
          <div className="lg:col-span-7 flex flex-col h-full overflow-y-auto bg-white p-5 space-y-5">
            {/* Screen Capture Snapshot */}
            {session.analysis.screenshotUrl && (
              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2.5 bg-slate-50">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <Maximize2 className="h-3.5 w-3.5 text-slate-500" />
                    Screen Capture Snapshot (Problem Statement)
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">1920x1080</span>
                </div>
                <div className="relative h-44 w-full bg-slate-950 overflow-hidden">
                  <img
                    src={session.analysis.screenshotUrl}
                    alt="Problem screenshot"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 rounded-md bg-white/90 border border-slate-200 px-2 py-1 text-[10px] text-slate-700 font-medium backdrop-blur-xs">
                    Captured via desktopCapturer hotkey [{typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? '⌘+⇧+S' : 'Ctrl+Shift+S'}]
                  </div>
                </div>
              </div>
            )}

            {/* Gemini AI Solution Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0052cc] text-white shadow-sm shadow-[#0052cc]/30">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                      Gemini Copilot Solution Log
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Multi-modal audio & vision analysis via gemini-2.5-flash
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {session.analysis.timeComplexity && (
                    <span className="rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-mono font-bold text-emerald-700">
                      Time: {session.analysis.timeComplexity}
                    </span>
                  )}
                  {session.analysis.spaceComplexity && (
                    <span className="rounded-md bg-purple-50 border border-purple-200 px-2 py-0.5 text-[11px] font-mono font-bold text-purple-700">
                      Space: {session.analysis.spaceComplexity}
                    </span>
                  )}
                </div>
              </div>

              {/* 1. BUG/ERROR */}
              {session.analysis.bugError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3.5 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-700">
                    <Bug className="h-3.5 w-3.5" />
                    <span>1. BUG / LOGICAL FLAW</span>
                  </div>
                  <p className="text-xs text-rose-900 leading-relaxed font-medium">
                    {session.analysis.bugError}
                  </p>
                </div>
              )}

              {/* 2. OPTIMAL APPROACH */}
              {session.analysis.optimalApproach && (
                <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3.5 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0052cc]">
                    <Cpu className="h-3.5 w-3.5" />
                    <span>2. OPTIMAL APPROACH & COMPLEXITY</span>
                  </div>
                  <p className="text-xs text-blue-950 leading-relaxed font-medium">
                    {session.analysis.optimalApproach}
                  </p>
                </div>
              )}

              {/* 3. CORRECT CODE */}
              {session.analysis.correctCode && (
                <div className="rounded-xl border border-slate-200 bg-slate-900 overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-300 font-medium">
                      <Code className="h-3.5 w-3.5 text-blue-400" />
                      <span>3. CORRECT COMPILABLE CODE</span>
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400 uppercase font-mono">
                        {session.analysis.language || 'python'}
                      </span>
                    </div>

                    <button
                      onClick={handleCopyCode}
                      className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-200 transition hover:bg-[#0052cc] hover:text-white"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-4 overflow-x-auto font-mono text-xs text-slate-200 leading-relaxed bg-slate-900">
                    <pre>
                      <code>{session.analysis.correctCode}</code>
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
