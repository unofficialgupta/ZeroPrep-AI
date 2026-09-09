'use client';

import React, { useEffect, useState, Suspense } from 'react';
import StealthOverlay from '@/components/StealthOverlay';

function OverlayContent() {
  const [bgMode, setBgMode] = useState<string | null>(null);
  const [questionIdx, setQuestionIdx] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const bg = params.get('bg');
      const q = params.get('q');
      setBgMode(bg);
      if (q) setQuestionIdx(parseInt(q, 10) || 0);

      if (!bg) {
        document.documentElement.classList.add('overlay-transparent');
        document.body.classList.add('overlay-transparent');
        document.documentElement.style.background = 'transparent';
        document.body.style.background = 'transparent';
      }
    }

    return () => {
      document.documentElement.classList.remove('overlay-transparent');
      document.body.classList.remove('overlay-transparent');
      document.documentElement.style.background = '';
      document.body.style.background = '';
    };
  }, []);

  if (bgMode === 'interview' || bgMode === 'leetcode') {
    return (
      <div className="relative h-screen w-screen overflow-hidden bg-[#0d1117] text-slate-200 font-sans flex flex-col">
        {/* Mock Interview IDE Top Bar */}
        <div className="h-12 border-b border-slate-800 bg-[#161b22] px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="font-mono text-xs font-semibold text-slate-300">
              LeetCode Problem 14: Longest Common Prefix (Google Onsite Interview)
            </span>
            <span className="rounded bg-emerald-950/80 border border-emerald-700/50 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
              Easy / Core DSA
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1 rounded-md text-slate-300">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
              <span>Google Meet Call In Progress (45:12)</span>
            </div>
            <span className="text-slate-400">Interviewer: Staff SWE @ Google</span>
          </div>
        </div>

        {/* Mock Interview IDE Body */}
        <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden">
          {/* Left Column: Problem Description */}
          <div className="col-span-5 border-r border-slate-800 bg-[#0d1117] p-6 overflow-y-auto space-y-4">
            <h1 className="text-xl font-bold text-white">14. Longest Common Prefix</h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-300">""</code>.
            </p>
            <div className="space-y-3 pt-2">
              <div className="bg-[#161b22] p-3 rounded-lg border border-slate-800 text-xs font-mono space-y-1">
                <p className="text-slate-400 font-bold">Example 1:</p>
                <p><span className="text-slate-500">Input:</span> strs = ["flower","flow","flight"]</p>
                <p><span className="text-slate-500">Output:</span> "fl"</p>
              </div>
              <div className="bg-[#161b22] p-3 rounded-lg border border-slate-800 text-xs font-mono space-y-1">
                <p className="text-slate-400 font-bold">Example 2:</p>
                <p><span className="text-slate-500">Input:</span> strs = ["dog","racecar","car"]</p>
                <p><span className="text-slate-500">Output:</span> ""</p>
              </div>
            </div>
            <div className="pt-4 text-xs text-slate-500 space-y-1">
              <p>Constraints:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>1 &le; strs.length &le; 200</li>
                <li>0 &le; strs[i].length &le; 200</li>
                <li>strs[i] consists of only lowercase English letters.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Code Editor */}
          <div className="col-span-7 bg-[#010409] p-6 font-mono text-xs text-slate-300 overflow-hidden flex flex-col justify-between">
            <div className="space-y-1">
              <div className="text-slate-500">// Language: C++20 (Gnu++20)</div>
              <div className="text-blue-400">#include &lt;vector&gt;</div>
              <div className="text-blue-400">#include &lt;string&gt;</div>
              <div className="text-purple-400 mt-2">using namespace std;</div>
              <div className="mt-4 text-blue-400">class <span className="text-yellow-300">Solution</span> {'{'}</div>
              <div className="text-purple-400 pl-4">public:</div>
              <div className="text-blue-400 pl-8">string <span className="text-yellow-300">longestCommonPrefix</span>(vector&lt;string&gt;&amp; strs) {'{'}</div>
              <div className="text-slate-500 pl-12">// Solution being written live...</div>
              <div className="text-blue-400 pl-8">{'}'}</div>
              <div className="text-blue-400">{'}'};</div>
            </div>

            {/* Bottom Status */}
            <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-[11px] text-slate-500">
              <div>Screen Share Active (Zoom/Meet/Teams)</div>
              <div className="text-emerald-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                ZeroPrep Stealth Protected: Window invisible to interviewer
              </div>
            </div>
          </div>
        </div>

        {/* Real Floating Stealth HUD in Foreground */}
        <div className="absolute inset-0 pointer-events-none p-4 flex items-end justify-end">
          <div className="pointer-events-auto max-w-[560px] w-full">
            <StealthOverlay
              isOpen={true}
              onClose={() => {}}
              isNativeWindow={false}
              initialIndex={questionIdx}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overlay-transparent-root w-full h-full bg-transparent select-none overflow-hidden flex flex-col items-stretch justify-start">
      <StealthOverlay
        isOpen={true}
        onClose={() => {
          const desktop = (window as any).zeroPrepDesktop || (window as any).parakeetDesktop;
          if (desktop?.closeNativeHud) {
            desktop.closeNativeHud();
          } else if (desktop?.toggleNativeHud) {
            desktop.toggleNativeHud();
          }
        }}
        isNativeWindow={true}
        initialIndex={questionIdx}
      />
    </div>
  );
}

export default function OverlayStandalonePage() {
  return (
    <Suspense fallback={<div className="h-screen w-screen bg-transparent" />}>
      <OverlayContent />
    </Suspense>
  );
}
