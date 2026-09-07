'use client';

import React, { useState } from 'react';
import {
  X,
  Radio,
  Monitor,
  Sparkles,
  Bot,
  ArrowRight
} from 'lucide-react';
import { CallSession, addStoredSession } from '@/lib/storage';

interface NewSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionCreated: (session: CallSession) => void;
}

export default function NewSessionModal({
  isOpen,
  onClose,
  onSessionCreated,
}: NewSessionModalProps) {
  const [sessionTitle, setSessionTitle] = useState('');
  const [platform, setPlatform] = useState<
    'Zoom' | 'Google Meet' | 'Microsoft Teams' | 'HackerRank' | 'LeetCode'
  >('Google Meet');
  const [sessionType, setSessionType] = useState<'real' | 'mock'>('real');
  const [topic, setTopic] = useState('Data Structures & Algorithms');
  const [isMac, setIsMac] = useState(true);

  React.useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsMac(/Mac|iPod|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
    }
  }, []);

  if (!isOpen) return null;

  const handleCreate = () => {
    const title = sessionTitle.trim() || `${platform} Technical Interview - ${topic}`;
    const shortcutStr = isMac ? '⌘+⇧+S' : 'Ctrl+Shift+S';

    const newSession: CallSession = {
      id: `ses-${Date.now().toString().slice(-4)}`,
      title,
      platform,
      date: 'Just now',
      duration: 'Live Now',
      transcriptCount: 6,
      status: 'Live',
      solvedProblems: 0,
      latencyMs: 580,
      audioDurationSec: 60,
      transcripts: [
        {
          id: 't-init-1',
          speaker: 'Interviewer',
          timestamp: '00:02',
          text: `Welcome to your ${topic} session on ${platform}! Please explain your approach as you walk through the problem.`,
        },
        {
          id: 't-init-2',
          speaker: 'Candidate',
          timestamp: '00:15',
          text: "Thanks! I'll read the requirements carefully, define the input constraints, and brainstorm edge cases.",
        },
      ],
      analysis: {
        problemTitle: `${topic} Assessment`,
        bugError: 'Awaiting first code block or screen capture...',
        optimalApproach: `ZeroPrep Copilot is listening to live audio context and ready for screenshot snapshot (${shortcutStr}).`,
        language: 'python',
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(1)',
        correctCode: `# ZeroPrep AI Copilot live ready
def solution(inputs):
    # Press ${shortcutStr} or click "Analyze Screen" to instantly solve bugs
    pass`,
      },
    };

    addStoredSession(newSession);
    onSessionCreated(newSession);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0052cc]/10 border border-[#0052cc]/25 text-[#0052cc]">
            <Radio className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Start New Real or Mock Session
            </h3>
            <p className="text-xs text-slate-500">
              Configure your interview copilot and audio loopback settings.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700">Session Name / Role</label>
            <input
              type="text"
              placeholder="e.g. Stripe L4 Staff Eng - Graph Algorithm & Systems"
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-[#0052cc] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Session Mode</label>
            <div className="mt-1.5 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSessionType('real')}
                className={`flex items-start gap-2.5 rounded-xl border p-3 text-left transition ${
                  sessionType === 'real'
                    ? 'border-[#0052cc] bg-[#0052cc]/10 text-slate-900 shadow-2xs'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Monitor className="h-4 w-4 text-[#0052cc] mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Live Call Copilot</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Screen & audio loopback capture during live calls
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSessionType('mock')}
                className={`flex items-start gap-2.5 rounded-xl border p-3 text-left transition ${
                  sessionType === 'mock'
                    ? 'border-[#0052cc] bg-[#0052cc]/10 text-slate-900 shadow-2xs'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Bot className="h-4 w-4 text-purple-600 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Practice Mock</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Interactive AI Interviewer asks questions & drills you
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Platform</label>
            <div className="mt-1.5 grid grid-cols-3 sm:grid-cols-5 gap-2">
              {(['Google Meet', 'Zoom', 'Microsoft Teams', 'HackerRank', 'LeetCode'] as const).map(
                (p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPlatform(p)}
                    className={`rounded-xl border py-2 px-2 text-center text-xs font-semibold transition ${
                      platform === p
                        ? 'border-[#0052cc] bg-[#0052cc] text-white shadow-2xs'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {p.replace('Microsoft ', '')}
                  </button>
                )
              )}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Topic Domain</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-800 focus:border-[#0052cc] focus:bg-white focus:outline-none"
            >
              <option>Data Structures & Algorithms (DSA)</option>
              <option>Distributed Systems & Architecture</option>
              <option>Full-Stack / React & Node.js System Design</option>
              <option>Concurrency, Multithreading & Low-Level</option>
              <option>Behavioral & Leadership Principles (STAR)</option>
            </select>
          </div>

          <div className="rounded-xl border border-purple-200 bg-purple-50 p-3 text-[11px] text-purple-800 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-600 shrink-0" />
            <span>
              Invisible Stealth HUD is activated with{' '}
              <code className="bg-purple-100 px-1 py-0.5 rounded font-mono text-purple-900 font-bold">
                win.setContentProtection(true)
              </code>
            </span>
          </div>

          <div className="pt-2">
            <button
              onClick={handleCreate}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0052cc] py-2.5 px-4 text-xs font-semibold text-white shadow-md shadow-[#0052cc]/25 transition hover:bg-[#0043a8] active:bg-[#003585]"
            >
              <span>Launch Live Session Copilot</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
