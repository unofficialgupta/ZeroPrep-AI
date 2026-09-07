'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Camera,
  Copy,
  Check,
  Bug,
  Cpu,
  Code,
  Upload,
  Terminal
} from 'lucide-react';
import { useGeminiKey } from '@/context/GeminiKeyContext';
import { analyzeScreenAndCode, AnalysisResult } from '@/lib/gemini';

export default function CodingCopilotPage() {
  const { apiKey, activeModel } = useGeminiKey();
  const [screenshot, setScreenshot] = useState<string | null>(
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop'
  );
  const [transcriptContext, setTranscriptContext] = useState(
    'Interviewer: "Can you implement continuous subarray sum divisible by k in O(N) time and O(K) space?"'
  );
  const [isSolving, setIsSolving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [solution, setSolution] = useState<AnalysisResult | null>({
    rawText: '',
    bugError: 'Standard division modulo gives negative remainders on negative inputs in languages like C++/Python, requiring ((sum % k) + k) % k normalization.',
    optimalApproach: 'Hash map of prefix sum modulo counts. Time Complexity: O(N), Space Complexity: O(K).',
    correctCode: `def subarrays_div_by_k(nums: list[int], k: int) -> int:
    remainder_count = {0: 1}
    curr_sum = 0
    total = 0
    
    for x in nums:
        curr_sum += x
        rem = ((curr_sum % k) + k) % k
        if rem in remainder_count:
            total += remainder_count[rem]
            remainder_count[rem] += 1
        else:
            remainder_count[rem] = 1
            
    return total`,
    language: 'python',
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setScreenshot(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSolve = async () => {
    if (!screenshot) return;
    setIsSolving(true);
    try {
      const res = await analyzeScreenAndCode(
        screenshot,
        transcriptContext,
        apiKey,
        activeModel
      );
      setSolution(res);
    } catch (err) {
      console.error('Solve error:', err);
    } finally {
      setIsSolving(false);
    }
  };

  const copyCode = () => {
    if (solution?.correctCode) {
      navigator.clipboard.writeText(solution.correctCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">DSA & Coding Copilot</h1>
            <span className="rounded-full bg-[#0052cc]/10 border border-[#0052cc]/20 px-2.5 py-0.5 text-xs font-semibold text-[#0052cc]">
              {activeModel}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Feed screenshots from LeetCode, HackerRank, CodeSignal, or CoderPad for instant analysis.
          </p>
        </div>

        <button
          onClick={handleSolve}
          disabled={isSolving}
          className="flex items-center gap-2 rounded-xl bg-[#0052cc] px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-[#0052cc]/25 transition hover:bg-[#0043a8] active:bg-[#003585] disabled:opacity-60"
        >
          {isSolving ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Analyzing Screenshot...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Solve with Gemini</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Camera className="h-4 w-4 text-[#0052cc]" />
                Problem Screenshot / Screen Stream
              </label>
              <label className="cursor-pointer rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-[#0052cc] hover:text-white transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                Upload Image
              </label>
            </div>

            <div className="relative h-56 w-full rounded-xl bg-slate-950 border border-slate-200 overflow-hidden group">
              {screenshot ? (
                <img
                  src={screenshot}
                  alt="Problem screenshot"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-4 text-center text-slate-400">
                  <Upload className="h-8 w-8 mb-2" />
                  <p className="text-xs">Drag & drop or paste screenshot here</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2.5 shadow-xs">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <Terminal className="h-4 w-4 text-purple-600" />
              Interviewer Speech / Constraints Context
            </label>
            <textarea
              rows={4}
              value={transcriptContext}
              onChange={(e) => setTranscriptContext(e.target.value)}
              placeholder="Paste or type interviewer remarks or constraints..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 placeholder-slate-400 focus:border-[#0052cc] focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div className="lg:col-span-7 space-y-5">
          {solution ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#0052cc]" />
                  <h3 className="text-sm font-bold text-slate-900">Gemini Generated Response</h3>
                </div>
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1.5 rounded-lg bg-[#0052cc]/10 px-3 py-1 text-xs font-semibold text-[#0052cc] hover:bg-[#0052cc] hover:text-white transition"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Fix</span>
                    </>
                  )}
                </button>
              </div>

              {solution.bugError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-700">
                    <Bug className="h-4 w-4" />
                    <span>1. BUG / LOGICAL FLAW</span>
                  </div>
                  <p className="text-xs text-rose-900 leading-relaxed font-medium">{solution.bugError}</p>
                </div>
              )}

              {solution.optimalApproach && (
                <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0052cc]">
                    <Cpu className="h-4 w-4" />
                    <span>2. OPTIMAL APPROACH & COMPLEXITY</span>
                  </div>
                  <p className="text-xs text-blue-950 leading-relaxed font-medium">{solution.optimalApproach}</p>
                </div>
              )}

              {solution.correctCode && (
                <div className="rounded-xl border border-slate-200 bg-slate-900 overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-2 text-xs text-slate-300">
                    <span className="flex items-center gap-2 font-medium text-white">
                      <Code className="h-3.5 w-3.5 text-blue-400" />
                      3. CORRECT CODE
                    </span>
                    <span className="font-mono text-[10px] uppercase">
                      {solution.language || 'python'}
                    </span>
                  </div>
                  <div className="p-4 font-mono text-xs text-slate-200 overflow-x-auto bg-slate-900 leading-relaxed">
                    <pre>
                      <code>{solution.correctCode}</code>
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-slate-400">
              <Sparkles className="h-8 w-8 text-[#0052cc] mb-2" />
              <p className="text-xs font-semibold text-slate-700">No active analysis</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Upload a screenshot and click Solve with Gemini to diagnose bugs and get code fixes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
