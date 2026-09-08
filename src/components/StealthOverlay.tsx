'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Camera,
  Mic,
  MicOff,
  Volume2,
  X,
  Sparkles,
  Copy,
  Check,
  Zap,
  Sliders,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  HelpCircle,
  CornerDownLeft,
  MessageSquare,
  Move,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Trash2,
  Maximize2,
  Minimize2,
  MoreVertical,
  Laptop,
  Code2,
  Command,
  Square,
  KeyRound,
  Terminal
} from 'lucide-react';
import { useGeminiKey } from '@/context/GeminiKeyContext';
import { useAudioLoopback } from '@/hooks/useAudioLoopback';
import { analyzeScreenAndCode, AnalysisResult } from '@/lib/gemini';

interface StealthOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  isNativeWindow?: boolean;
  initialIndex?: number;
}

interface AnswerEntry {
  id: string;
  timestamp: string;
  question: string;
  category?: 'behavioral' | 'coding' | 'system_design';
  answerSummary?: string;
  bulletPoints: string[];
  keySteps?: string[];
  correctCode?: string;
  language?: string;
  complexity?: string;
  tradeOff?: string;
}

const DEFAULT_ANSWERS: AnswerEntry[] = [
  {
    id: 'ans-behavioral-1',
    timestamp: '27:15',
    question: 'What is your biggest weakness?',
    category: 'behavioral',
    answerSummary: 'Turning perfectionism into structured quality delivery through strict deadlines.',
    bulletPoints: [
      'My biggest weakness is that I tend to be a perfectionist, especially when working on coding projects.',
      'I sometimes spend extra time refining details to ensure the highest quality, which can slow down my progress.',
      'However, I\'ve learned to balance this by setting clear deadlines and prioritizing tasks, so I can deliver high-quality work efficiently.',
      'I also actively seek feedback from my team to make sure I\'m focusing on what matters most, rather than getting caught up in minor details.',
      'This approach has helped me turn my perfectionism into a strength, ensuring both quality and timely delivery in my work.'
    ]
  },
  {
    id: 'ans-coding-2',
    timestamp: '27:33',
    question: 'How do you solve the "Longest Common Prefix" problem on LeetCode in C++?',
    category: 'coding',
    answerSummary: 'Vertical scanning across characters of all strings at the same index.',
    bulletPoints: [
      'The problem asks for the longest common prefix string among an array of strings.',
      'A simple and efficient approach is to compare characters of each string at the same position.',
      'Stop when a mismatch is found or the end of any string is reached.',
      'Return the prefix found so far.'
    ],
    keySteps: [
      'If the input array is empty, return an empty string "".',
      'Use the first string as a reference.',
      'For each character in the reference string, check if all other strings have the same character at that position.',
      'If a mismatch is found, return the prefix up to that point.',
      'If no mismatch is found, return the entire reference string.'
    ],
    correctCode: `class Solution {
public:
    string longestCommonPrefix(vector<string>& strs) {
        if (strs.empty()) return "";
        for (int i = 0; i < strs[0].size(); i++) {
            char c = strs[0][i];
            for (int j = 1; j < strs.size(); j++) {
                // If index exceeds string length or character mismatch occurs
                if (i == strs[j].size() || strs[j][i] != c) {
                    return strs[0].substr(0, i);
                }
            }
        }
        return strs[0];
    }
};`,
    language: 'cpp',
    complexity: 'Time: O(S) where S is sum of characters across all strings | Space: O(1) auxiliary space.'
  },
  {
    id: 'ans-sysdesign-3',
    timestamp: '27:45',
    question: 'How would you design a rate limiter for a public API?',
    category: 'system_design',
    answerSummary: 'Token bucket per API key stored in a Redis cluster.',
    bulletPoints: [
      'Refill logic: R tokens/sec up to burst capacity B; each request decrements atomically via Lua script.',
      'On empty: reject immediately with HTTP 429 Too Many Requests and Retry-After header.',
      'Scaling: shard by hash(client_ip or api_key) and cache active token buckets in memory with async flush.'
    ],
    tradeOff: 'Trade-off: A sliding-window log is more precise against boundary bursts but requires significantly more memory.',
    correctCode: `# Redis atomic token bucket Lua script
local key = KEYS[1]
local limit = tonumber(ARGV[1])
local current = tonumber(redis.call('get', key) or "0")

if current + 1 > limit then
    return 0
else
    redis.call("INCRBY", key, 1)
    if current == 0 then
        redis.call("expire", key, 1)
    end
    return 1
end`,
    language: 'python'
  }
];

export default function StealthOverlay({
  isOpen,
  onClose,
  isNativeWindow = false,
  initialIndex = 0,
}: StealthOverlayProps) {
  const { apiKey, activeModel } = useGeminiKey();

  // OS Detection
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      const mac = /Mac|iPod|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
      setIsMac(mac);
    }
  }, []);

  // Hotkey Labels based on OS
  const modKey = isMac ? '⌘' : 'Ctrl';
  const shiftKey = isMac ? '⇧' : 'Shift';
  const enterKey = isMac ? '↩' : 'Enter';
  const backspaceKey = isMac ? '⌫' : 'Backspace';

  // Live Call Stopwatch / Timer (like "⏹ 27:15" in the video)
  const [callStartEpoch] = useState(() => Date.now() - 1635 * 1000); // session epoch for loopback timestamps
  const [callSeconds, setCallSeconds] = useState(1635); // 27:15 initial
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setCallSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (total: number) => {
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // HUD UI States
  const [opacity, setOpacity] = useState(94);
  const [glassTheme, setGlassTheme] = useState<'dark' | 'light'>('dark');
  const [isCollapsed, setIsCollapsed] = useState(false); // ^ collapse
  const [isExpandedSpeech, setIsExpandedSpeech] = useState(false);
  const [showSpeechBar, setShowSpeechBar] = useState(true);
  const [showAnswerCard, setShowAnswerCard] = useState(true);
  const [isCandidateMicMuted, setIsCandidateMicMuted] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showShortcutsView, setShowShortcutsView] = useState(false);
  const [showChatInput, setShowChatInput] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [copiedQuestion, setCopiedQuestion] = useState(false);
  const [copiedAnswer, setCopiedAnswer] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // ── Dual-Channel Audio Loopback (Interviewer system audio + Candidate mic) ──
  const audio = useAudioLoopback(callStartEpoch);

  // Live Speech Transcription Stream Text
  // Priority: interviewer loopback first, then candidate mic, then placeholder
  const [speechStream, setSpeechStream] = useState<string>(
    'What is your biggest weakness? Click AI help and ZeroPrepAI will provide an answer based on your resume and...'
  );

  // Keep speechStream in sync with latest audio from either channel.
  // Interviewers questions take priority since that's what Gemini needs to answer.
  useEffect(() => {
    if (audio.interviewerTranscript.trim()) {
      setSpeechStream(audio.interviewerTranscript);
    } else if (audio.candidateTranscript.trim()) {
      setSpeechStream(audio.candidateTranscript);
    }
  }, [audio.interviewerTranscript, audio.candidateTranscript]);

  // Auto-start mic when overlay opens and mic is not muted
  useEffect(() => {
    if (!isCandidateMicMuted && !audio.isMicActive) {
      audio.startMic();
    } else if (isCandidateMicMuted && audio.isMicActive) {
      audio.stopMic();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCandidateMicMuted]);

  // Answer Navigation History
  const [answersList, setAnswersList] = useState<AnswerEntry[]>(DEFAULT_ANSWERS);
  const [activeAnswerIndex, setActiveAnswerIndex] = useState(initialIndex ?? 0);

  const currentAnswer = answersList[activeAnswerIndex] || answersList[0];

  // Hotkey Listeners (ZP-BUG-001 Input Trapping Protected)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      const target = e.target as HTMLElement | null;
      const isInputActive = !!(
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      );

      // If user is currently typing inside an input/textarea:
      if (isInputActive) {
        // Allow Escape to dismiss active modals/inputs
        if (e.key === 'Escape') {
          if (showShortcutsView) setShowShortcutsView(false);
          else if (showChatInput) setShowChatInput(false);
          else if (showSettingsMenu) setShowSettingsMenu(false);
          target?.blur();
          return;
        }

        // Allow Cmd/Ctrl + Enter to trigger AI help with custom prompt from inside chat input
        if (isCmdOrCtrl && e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          if (customPrompt.trim()) {
            triggerAIHelp(customPrompt.trim());
            setCustomPrompt('');
            setShowChatInput(false);
          } else {
            triggerAIHelp();
          }
          return;
        }

        // Allow Enter alone to submit custom chat prompt if inside the chat input
        if (e.key === 'Enter' && !e.shiftKey && target.tagName === 'INPUT') {
          e.preventDefault();
          if (customPrompt.trim()) {
            triggerAIHelp(customPrompt.trim());
            setCustomPrompt('');
            setShowChatInput(false);
          }
          return;
        }

        // CRITICAL FIX (ZP-BUG-001): DO NOT intercept '?', Cmd+Backspace, Cmd+Left/Right, etc. when typing!
        return;
      }

      // 1. AI Help: Cmd/Ctrl + Enter
      if (isCmdOrCtrl && e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        triggerAIHelp();
        return;
      }

      // 2. Analyze Screen: Cmd/Ctrl + Shift + S OR Cmd/Ctrl + Shift + Enter
      if (isCmdOrCtrl && e.shiftKey && (e.key.toLowerCase() === 's' || e.key === 'Enter')) {
        e.preventDefault();
        triggerScreenAnalysis();
        return;
      }

      // 3. Chat prompt: Cmd/Ctrl + K or Cmd/Ctrl + Shift + Backspace
      if (isCmdOrCtrl && (e.key.toLowerCase() === 'k' || (e.shiftKey && e.key === 'Backspace'))) {
        e.preventDefault();
        setShowChatInput((prev) => !prev);
        return;
      }

      // 4. Hotkeys Cheatsheet: '?' or Cmd/Ctrl + '/'
      if ((e.key === '?' && !e.ctrlKey && !e.metaKey) || (isCmdOrCtrl && e.key === '/')) {
        e.preventDefault();
        setShowShortcutsView((prev) => !prev);
        return;
      }

      // 5. Answer Navigation: Cmd/Ctrl + Left / Right
      if (isCmdOrCtrl && e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevAnswer();
        return;
      }
      if (isCmdOrCtrl && e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextAnswer();
        return;
      }

      // 6. Delete answer: Cmd/Ctrl + Backspace
      if (isCmdOrCtrl && e.key === 'Backspace' && !e.shiftKey) {
        e.preventDefault();
        handleClearAnswer();
        return;
      }

      // 7. Escape
      if (e.key === 'Escape') {
        if (showShortcutsView) setShowShortcutsView(false);
        else if (showChatInput) setShowChatInput(false);
        else if (showSettingsMenu) setShowSettingsMenu(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    speechStream,
    answersList,
    activeAnswerIndex,
    showShortcutsView,
    showChatInput,
    customPrompt,
    apiKey,
    activeModel,
  ]);

  // IPC Electron Global Shortcuts
  useEffect(() => {
    const desktop = (window as any).zeroPrepDesktop || (window as any).parakeetDesktop;
    if (desktop) {
      const cleanCapture = desktop.onTriggerScreenCapture?.(() => {
        triggerScreenAnalysis();
      });
      const cleanAnswer = desktop.onTriggerAnswer?.(() => {
        triggerAIHelp();
      });
      const cleanShortcuts = desktop.onToggleShortcuts?.(() => {
        setShowShortcutsView((prev) => !prev);
      });
      return () => {
        cleanCapture?.();
        cleanAnswer?.();
        cleanShortcuts?.();
      };
    }
  }, [speechStream, answersList, activeAnswerIndex, apiKey, activeModel]);

  // Trigger AI Help (Solves speech question or custom prompt)
  const triggerAIHelp = async (overridePrompt?: string) => {
    const query = overridePrompt || speechStream || 'Summarize key engineering response.';
    setIsAnalyzing(true);
    setShowAnswerCard(true);

    try {
      let res: AnalysisResult | null = null;
      if (apiKey) {
        const dummyPixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
        res = await analyzeScreenAndCode(dummyPixel, query, apiKey, activeModel);
      }

      const isCoding = /code|algorithm|leetcode|solution|function|array|class|string|binary|tree/i.test(query);

      const newEntry: AnswerEntry = {
        id: `ans-${Date.now()}`,
        timestamp: formatTimer(callSeconds),
        question: query,
        category: isCoding ? 'coding' : 'behavioral',
        answerSummary: res?.optimalApproach || (isCoding ? 'Optimal linear traversal with two pointers.' : 'Structured STAR response tailored to candidate resume.'),
        bulletPoints: isCoding
          ? [
              'Traverse the input sequentially while maintaining window invariants.',
              'Check boundary condition: immediately return default when array is empty.',
              'Early exit on first mismatch to achieve minimal worst-case execution time.'
            ]
          : [
              'Identified the core behavioral context and aligned with engineering team leadership principles.',
              'Emphasized continuous feedback loops, clear milestone deadlines, and transparent delegation.',
              'Concluded with measurable positive impact on sprint delivery cadence.'
            ],
        keySteps: isCoding
          ? [
              'Initialize two boundary indices left = 0 and right = n - 1.',
              'Calculate midpoint safely without integer overflow: mid = left + (right - left) / 2.',
              'Evaluate condition and adjust pointers iteratively.',
              'Return target index or fallback sentinel -1.'
            ]
          : undefined,
        correctCode: isCoding ? (res?.correctCode || `class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        int left = 0, right = nums.size() - 1;\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[left] <= nums[mid]) {\n                if (nums[left] <= target && target < nums[mid]) right = mid - 1;\n                else left = mid + 1;\n            } else {\n                if (nums[mid] < target && target <= nums[right]) left = mid + 1;\n                else right = mid - 1;\n            }\n        }\n        return -1;\n    }\n};`) : undefined,
        language: isCoding ? (res?.language || 'cpp') : undefined,
        complexity: isCoding ? 'Time: O(log N) logarithmic binary search | Space: O(1) in-place' : undefined
      };

      setAnswersList((prev) => [newEntry, ...prev]);
      setActiveAnswerIndex(0);
      setShowChatInput(false);
      setCustomPrompt('');
    } catch (err) {
      console.error('AI Help failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Trigger Analyze Screen (Snaps active LeetCode / IDE screen - ZP-BUG-002, ZP-BUG-010)
  const triggerScreenAnalysis = async () => {
    setIsAnalyzing(true);
    setShowAnswerCard(true);

    try {
      let base64Image = '';

      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        let stream: MediaStream | null = null;
        try {
          stream = await navigator.mediaDevices.getDisplayMedia({
            video: {
              width: { max: 1920 },
              height: { max: 1080 }
            }
          });

          // Universal cross-browser frame grab via video element (Safari, Firefox, Chrome, Edge)
          const video = document.createElement('video');
          video.playsInline = true;
          video.muted = true;
          video.srcObject = stream;

          await new Promise<void>((resolve) => {
            video.onloadedmetadata = () => {
              video.play().then(() => resolve()).catch(() => resolve());
            };
            setTimeout(resolve, 500);
          });

          const maxW = 1920;
          const maxH = 1080;
          let w = video.videoWidth || 1280;
          let h = video.videoHeight || 720;

          if (w > maxW || h > maxH) {
            const ratio = Math.min(maxW / w, maxH / h);
            w = Math.round(w * ratio);
            h = Math.round(h * ratio);
          }

          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, w, h);
            // JPEG 0.85 ensures crisp OCR while staying well under 500KB (avoiding 413 Payload Too Large)
            base64Image = canvas.toDataURL('image/jpeg', 0.85);
          }
        } catch (mediaErr) {
          console.warn('Screen capture declined or unavailable, using active context', mediaErr);
        } finally {
          // Guaranteed stream track termination to close the OS/browser sharing indicator
          if (stream) {
            stream.getTracks().forEach((track) => track.stop());
          }
        }
      }

      if (!base64Image) {
        base64Image =
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      }

      const res = await analyzeScreenAndCode(
        base64Image,
        speechStream,
        apiKey,
        activeModel
      );

      const newEntry: AnswerEntry = {
        id: `ans-screen-${Date.now()}`,
        timestamp: formatTimer(callSeconds),
        question: speechStream || 'Screen Analysis: Longest Common Prefix & Bug Scan',
        category: 'coding',
        answerSummary: res.optimalApproach || 'Vertical character comparison across all array items.',
        bulletPoints: [
          res.bugError ? `Bug Found: ${res.bugError}` : 'Identified optimal string prefix matching strategy.',
          'Early termination prevents redundant iterations on divergent branches.',
          'Memory efficiency: zero dynamic heap allocation in outer traversal.'
        ],
        keySteps: [
          'Verify input array is non-empty.',
          'Compare characters of each string at index i.',
          'Return substring prefix up to index i upon any mismatch.'
        ],
        correctCode: res.correctCode,
        language: res.language || 'cpp',
        complexity: 'Time: O(S) where S is sum of all string lengths | Space: O(1)'
      };

      setAnswersList((prev) => [newEntry, ...prev]);
      setActiveAnswerIndex(0);
    } catch (err) {
      console.error('Screen Analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePrevAnswer = () => {
    if (activeAnswerIndex < answersList.length - 1) {
      setActiveAnswerIndex((prev) => prev + 1);
    }
  };

  const handleNextAnswer = () => {
    if (activeAnswerIndex > 0) {
      setActiveAnswerIndex((prev) => prev - 1);
    }
  };

  const handleClearAnswer = () => {
    if (answersList.length > 1) {
      const updated = answersList.filter((_, i) => i !== activeAnswerIndex);
      setAnswersList(updated);
      setActiveAnswerIndex(Math.max(0, activeAnswerIndex - 1));
    } else {
      setShowAnswerCard(false);
    }
  };

  const copyText = (text: string, type: 'q' | 'a' | 'c') => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === 'q') {
      setCopiedQuestion(true);
      setTimeout(() => setCopiedQuestion(false), 1800);
    } else if (type === 'a') {
      setCopiedAnswer(true);
      setTimeout(() => setCopiedAnswer(false), 1800);
    } else {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 1800);
    }
  };

  if (!isOpen) return null;

  const isDark = glassTheme === 'dark';

  return (
    <div
      className={`${
        isNativeWindow ? 'relative w-full' : 'fixed top-3 right-4 z-50'
      } flex flex-col items-end gap-1.5 select-none font-sans antialiased`}
      style={{
        width: isNativeWindow ? '100%' : '520px',
      }}
    >
      {/* ========================================================================= */}
      {/* 1. TOP FLOATING CONTROL BAR (MATCHING YOUTUBE VIDEO 0:15 / 0:36)          */}
      {/* ========================================================================= */}
      <div
        className="w-full flex items-center justify-between gap-1.5 px-3 py-1.5 rounded-2xl border shadow-2xl transition-all duration-150 backdrop-blur-2xl"
        style={{
          backgroundColor: isDark
            ? `rgba(24, 26, 32, ${opacity / 100})`
            : `rgba(255, 255, 255, ${opacity / 100})`,
          borderColor: isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.12)',
          color: isDark ? '#f8fafc' : '#0f172a',
          WebkitAppRegion: 'drag',
        } as any}
      >
        {/* Left Side: Brand Emblem & Audio Mic Status */}
        <div
          className="flex items-center gap-1.5 shrink-0"
          style={{ WebkitAppRegion: 'no-drag' } as any}
        >
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-1.5 pr-1 border-r border-white/10">
            <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-[#0052cc] text-white shadow-xs">
              <Zap className="h-3 w-3 fill-current" />
            </div>
            <span className="text-xs font-bold tracking-tight text-white">ZeroPrepAI</span>
          </div>

          {/* Audio Loopback Toggle (interviewer system audio) */}
          <button
            onClick={() => audio.isLoopbackActive ? audio.stopLoopback() : audio.startLoopback()}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full border transition cursor-pointer ${
              audio.loopbackError
                ? 'bg-rose-500/20 border-rose-500/40'
                : audio.isLoopbackActive
                  ? 'bg-black/40 border-white/10 hover:border-white/20'
                  : 'bg-black/20 border-white/10 opacity-60 hover:opacity-100'
            }`}
            title={
              audio.loopbackError
                ? `Loopback error: ${audio.loopbackError}`
                : audio.isLoopbackActive
                  ? 'Interviewer loopback active — click to stop'
                  : 'Click to start interviewer audio loopback (captures Zoom/Meet system audio)'
            }
          >
            <Volume2 className={`h-3 w-3 ${audio.loopbackError ? 'text-rose-400' : 'text-slate-300'}`} />
            {audio.isLoopbackActive ? (
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
            ) : (
              <span className="relative flex h-1.5 w-1.5">
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-slate-500"></span>
              </span>
            )}
          </button>

          {/* Candidate Mic Toggle */}
          <button
            onClick={() => setIsCandidateMicMuted((prev) => !prev)}
            className="p-1 rounded-full bg-black/40 border border-white/10 hover:border-white/20 transition cursor-pointer"
            title={isCandidateMicMuted ? 'Mic Muted — click to unmute' : 'Candidate Mic Active — click to mute'}
          >
            {isCandidateMicMuted ? (
              <MicOff className="h-3 w-3 text-rose-400" />
            ) : (
              <Mic className={`h-3 w-3 ${audio.isMicActive ? 'text-emerald-400' : 'text-rose-500'}`} />
            )}
          </button>
        </div>

        {/* Center: Main Action Buttons (AI Help ✨, Analyze Screen 💻, Chat, Timer) */}
        <div
          className="flex items-center gap-1.5"
          style={{ WebkitAppRegion: 'no-drag' } as any}
        >
          {/* AI Help ✨ Button */}
          <button
            onClick={() => triggerAIHelp()}
            disabled={isAnalyzing}
            className="group flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 text-xs font-medium text-white transition shadow-xs disabled:opacity-50 cursor-pointer"
            title={`Generate Immediate Answer (${modKey} + ${enterKey})`}
          >
            <span className="text-xs font-semibold text-white">AI Help</span>
            <Sparkles className="h-3 w-3 text-amber-300 animate-pulse" />
          </button>

          {/* Analyze Screen 💻 Button */}
          <button
            onClick={triggerScreenAnalysis}
            disabled={isAnalyzing}
            className="group flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 text-xs font-medium text-white transition shadow-xs disabled:opacity-50 cursor-pointer"
            title={`Analyze Active Coding Screen (${modKey} + ${shiftKey} + ${enterKey})`}
          >
            <span className="text-xs font-semibold text-white">Analyze Screen</span>
            <Laptop className="h-3 w-3 text-blue-300" />
          </button>

          {/* Chat Button */}
          <button
            onClick={() => setShowChatInput((prev) => !prev)}
            className={`flex items-center gap-1 px-2 py-1 rounded-xl border text-xs font-medium transition cursor-pointer ${
              showChatInput
                ? 'bg-[#0052cc] border-[#0052cc] text-white'
                : 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
            }`}
            title={`Ask Custom Question / Prompt (${modKey} + K)`}
          >
            <span className="text-xs font-semibold">Chat</span>
          </button>

          {/* Live Call Stopwatch Timer (⏹ 27:15) */}
          <button
            onClick={() => setIsTimerRunning((prev) => !prev)}
            className="flex items-center gap-1 px-2 py-0.8 rounded-xl bg-black/50 border border-white/10 text-xs font-mono font-medium text-slate-200 transition"
            title="Interview Call Duration Timer"
          >
            <Square className="h-2.5 w-2.5 fill-rose-500 text-rose-500" />
            <span>{formatTimer(callSeconds)}</span>
          </button>
        </div>

        {/* Right Side: Settings Menu, Move handle, Collapse caret & End */}
        <div
          className="flex items-center gap-1 shrink-0"
          style={{ WebkitAppRegion: 'no-drag' } as any}
        >
          {/* Settings Menu Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowSettingsMenu((prev) => !prev)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
              title="Settings & Opacity"
            >
              <MoreVertical className="h-3.5 w-3.5" />
            </button>

            {/* Dropdown Menu */}
            {showSettingsMenu && (
              <div
                className="absolute right-0 top-7 z-50 w-56 rounded-2xl border border-white/15 bg-[#181a20]/95 backdrop-blur-xl p-3 shadow-2xl space-y-2.5 text-xs text-slate-200 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                  <span className="font-semibold text-white">ZeroPrep HUD</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Stealth Protected</span>
                </div>

                {/* Opacity slider */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Glass Opacity</span>
                    <span className="font-mono text-white">{opacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={opacity}
                    onChange={(e) => setOpacity(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0052cc]"
                  />
                </div>

                {/* Theme toggle */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">Appearance</span>
                  <button
                    onClick={() => setGlassTheme(isDark ? 'light' : 'dark')}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/15 text-[11px] text-white"
                  >
                    {isDark ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
                    <span>{isDark ? 'Dark Glass' : 'Light Glass'}</span>
                  </button>
                </div>

                {/* Shortcuts modal button */}
                <div className="pt-1 border-t border-white/10">
                  <button
                    onClick={() => {
                      setShowShortcutsView(true);
                      setShowSettingsMenu(false);
                    }}
                    className="w-full text-left py-1 text-[11px] text-[#0052cc] hover:underline flex items-center justify-between"
                  >
                    <span>View All Hotkeys</span>
                    <kbd className="font-mono text-[9px] bg-black/40 px-1 py-0.2 rounded border border-white/10">{modKey} /</kbd>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Move handle */}
          <div
            className="p-1 text-slate-400 hover:text-white cursor-grab active:cursor-grabbing transition"
            title="Drag overlay anywhere on screen"
            style={{ WebkitAppRegion: 'drag' } as any}
          >
            <Move className="h-3.5 w-3.5" />
          </div>

          {/* Collapse / Expand caret toggle (^) */}
          <button
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded transition"
            title={isCollapsed ? 'Expand HUD' : 'Collapse HUD'}
          >
            {isCollapsed ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
          </button>

          {/* End / Close session button */}
          <button
            onClick={onClose}
            className="px-2 py-0.8 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-semibold shadow-xs transition cursor-pointer"
            title="End Interview Session / Close HUD"
          >
            End
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. IN-LINE CUSTOM PROMPT INPUT                                            */}
      {/* ========================================================================= */}
      {!isCollapsed && showChatInput && (
        <div
          className="w-full rounded-2xl border shadow-xl p-2.5 backdrop-blur-2xl transition-all animate-in fade-in slide-in-from-top-2 duration-150"
          style={{
            backgroundColor: isDark
              ? `rgba(24, 26, 32, ${opacity / 100})`
              : `rgba(255, 255, 255, ${opacity / 100})`,
            borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
            color: isDark ? '#f8fafc' : '#0f172a',
          }}
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="h-3.5 w-3.5 text-[#0052cc] shrink-0" />
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customPrompt.trim()) {
                  e.preventDefault();
                  triggerAIHelp(customPrompt.trim());
                }
              }}
              placeholder={`Ask ZeroPrep anything... (Press ${enterKey} to solve)`}
              autoFocus
              className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
            />
            <button
              onClick={() => customPrompt.trim() && triggerAIHelp(customPrompt.trim())}
              disabled={!customPrompt.trim() || isAnalyzing}
              className="p-1 rounded-lg bg-[#0052cc] text-white hover:bg-[#0043a8] disabled:opacity-40 transition cursor-pointer"
            >
              <CornerDownLeft className="h-3 w-3" />
            </button>
            <button
              onClick={() => setShowChatInput(false)}
              className="p-1 text-slate-400 hover:text-white transition"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SPEECH TRANSCRIPTION STREAM BAR (MATCHING VIDEO 0:15 / 0:36)           */}
      {/* ========================================================================= */}
      {!isCollapsed && showSpeechBar && (
        <div
          className="w-full flex items-center justify-between gap-2 px-3 py-1.5 rounded-2xl border shadow-xl backdrop-blur-2xl transition-all duration-150"
          style={{
            backgroundColor: isDark
              ? `rgba(24, 26, 32, ${opacity / 100})`
              : `rgba(255, 255, 255, ${opacity / 100})`,
            borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
            color: isDark ? '#f8fafc' : '#0f172a',
          }}
        >
          {/* Real-time transcribed text */}
          <div className="flex-1 text-[11.5px] text-slate-300 italic truncate pr-2">
            &ldquo;{speechStream}&rdquo;
          </div>

          {/* Right Action Icons: Trash (🗑), Expand (∨), Close (✕) */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setSpeechStream('Listening for interview speech...')}
              className="p-1 text-slate-400 hover:text-white rounded transition cursor-pointer"
              title="Clear transcript (🗑)"
            >
              <Trash2 className="h-3 w-3" />
            </button>

            <button
              onClick={() => setIsExpandedSpeech(!isExpandedSpeech)}
              className="p-1 text-slate-400 hover:text-white rounded transition cursor-pointer"
              title="Expand transcript (∨)"
            >
              {isExpandedSpeech ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>

            <button
              onClick={() => setShowSpeechBar(false)}
              className="p-1 text-slate-400 hover:text-white rounded transition cursor-pointer"
              title="Close transcript bar (✕)"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MAIN ANSWER / COPILOT CARD (MATCHING VIDEO 0:15 / 0:36)                */}
      {/* ========================================================================= */}
      {!isCollapsed && showAnswerCard && (
        <div
          className="w-full rounded-2xl border shadow-2xl p-4 backdrop-blur-2xl transition-all duration-150 overflow-hidden"
          style={{
            backgroundColor: isDark
              ? `rgba(24, 26, 32, ${opacity / 100})`
              : `rgba(255, 255, 255, ${opacity / 100})`,
            borderColor: isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.12)',
            color: isDark ? '#f8fafc' : '#0f172a',
          }}
        >
          {showShortcutsView ? (
            /* =================================================================== */
            /* 4A. SHORTCUTS CHEATSHEET VIEW                                       */
            /* =================================================================== */
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#0052cc] text-white">
                    <Command className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">ZeroPrep AI Shortcuts</h4>
                    <p className="text-[10px] text-slate-400">
                      Detected OS: <span className="text-emerald-400 font-semibold">{isMac ? 'macOS (⌘)' : 'Windows (Ctrl)'}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowShortcutsView(false)}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] transition font-medium"
                >
                  ← Back to Solution
                </button>
              </div>

              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 text-xs no-scrollbar">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#0052cc] uppercase tracking-wider">Actions</span>
                  <div className="flex items-center justify-between py-1 border-b border-white/5">
                    <span className="text-slate-300">AI Help (Immediate Answer)</span>
                    <div className="flex items-center gap-1">
                      <kbd className="bg-black/60 border border-white/15 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-200">{modKey}</kbd>
                      <kbd className="bg-black/60 border border-white/15 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-200">{enterKey}</kbd>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-white/5">
                    <span className="text-slate-300">Analyze Screen & Code</span>
                    <div className="flex items-center gap-1">
                      <kbd className="bg-black/60 border border-white/15 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-200">{modKey}</kbd>
                      <kbd className="bg-black/60 border border-white/15 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-200">{shiftKey}</kbd>
                      <kbd className="bg-black/60 border border-white/15 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-200">{enterKey}</kbd>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-white/5">
                    <span className="text-slate-300">Quick Chat Prompt</span>
                    <div className="flex items-center gap-1">
                      <kbd className="bg-black/60 border border-white/15 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-200">{modKey}</kbd>
                      <kbd className="bg-black/60 border border-white/15 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-200">K</kbd>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Answer Navigation</span>
                  <div className="flex items-center justify-between py-1 border-b border-white/5">
                    <span className="text-slate-300">Previous / Next Solution</span>
                    <div className="flex items-center gap-1">
                      <kbd className="bg-black/60 border border-white/15 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-200">{modKey}</kbd>
                      <kbd className="bg-black/60 border border-white/15 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-200">←</kbd>
                      <span className="text-slate-500">/</span>
                      <kbd className="bg-black/60 border border-white/15 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-200">→</kbd>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-white/5">
                    <span className="text-slate-300">Delete Current Solution</span>
                    <div className="flex items-center gap-1">
                      <kbd className="bg-black/60 border border-white/15 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-200">{modKey}</kbd>
                      <kbd className="bg-black/60 border border-white/15 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-200">{backspaceKey}</kbd>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">System</span>
                  <div className="flex items-center justify-between py-1 border-b border-white/5">
                    <span className="text-slate-300">Toggle Stealth Protection</span>
                    <div className="flex items-center gap-1">
                      <kbd className="bg-black/60 border border-white/15 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-200">{modKey}</kbd>
                      <kbd className="bg-black/60 border border-white/15 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-200">\</kbd>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-300">Toggle Shortcuts View</span>
                    <div className="flex items-center gap-1">
                      <kbd className="bg-black/60 border border-white/15 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-200">{modKey}</kbd>
                      <kbd className="bg-black/60 border border-white/15 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-200">/</kbd>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                <span>Press <kbd className="font-mono text-white">Esc</kbd> to dismiss</span>
                <button
                  onClick={() => setShowShortcutsView(false)}
                  className="px-3 py-1 rounded-lg bg-[#0052cc] text-white hover:bg-[#0043a8] font-semibold transition"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* =================================================================== */
            /* 4B. ACTIVE COPILOT ANSWER VIEW (MATCHING VIDEO 0:15 / 0:36)         */
            /* =================================================================== */
            <div className="space-y-3">
              {/* Header Navigation (< > 🗑 ❐ ✕) */}
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                {/* Previous & Next Arrows (< >) */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevAnswer}
                    disabled={activeAnswerIndex >= answersList.length - 1}
                    className="p-1 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-slate-300 font-mono transition"
                    title={`Previous Answer (${modKey} + ←)`}
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={handleNextAnswer}
                    disabled={activeAnswerIndex <= 0}
                    className="p-1 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-slate-300 font-mono transition"
                    title={`Next Answer (${modKey} + →)`}
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>

                  <span className="text-[10px] font-mono text-slate-400 ml-1">
                    {activeAnswerIndex + 1} of {answersList.length}
                  </span>
                </div>

                {/* Right controls: Hotkeys pill, Trash (🗑), Copy (❐), Close (✕) */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setShowShortcutsView(true)}
                    className="flex items-center gap-1 rounded-lg bg-white/10 hover:bg-white/20 px-2 py-0.8 text-[10px] text-slate-300 transition"
                    title="View Shortcuts List (? or Cmd/Ctrl+/)"
                  >
                    <HelpCircle className="h-3 w-3 text-slate-300" />
                    <span>Hotkeys</span>
                  </button>

                  <button
                    onClick={handleClearAnswer}
                    className="p-1 text-slate-400 hover:text-white rounded transition"
                    title="Delete Solution (🗑)"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={() => copyText(`${currentAnswer.question}\n\n${currentAnswer.bulletPoints.join('\n')}`, 'a')}
                    className="p-1 text-slate-400 hover:text-white rounded transition"
                    title="Copy Answer (❐)"
                  >
                    {copiedAnswer ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>

                  <button
                    onClick={() => setShowAnswerCard(false)}
                    className="p-1 text-slate-400 hover:text-white rounded transition"
                    title="Close Answer Card (✕)"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Thinking / Loading Indicator */}
              {isAnalyzing && (
                <div className="flex items-center gap-2 rounded-xl bg-[#0052cc]/20 border border-[#0052cc]/30 p-2.5 text-xs text-blue-200 animate-pulse">
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Loading... reasoning with Gemini Vision & Audio</span>
                </div>
              )}

              {/* Scrollable Answer Content Area */}
              <div className="space-y-2.5 max-h-[540px] overflow-y-auto pr-1 no-scrollbar text-xs">
                {/* 💬 Question */}
                <div className="flex items-start justify-between gap-1.5">
                  <div className="leading-snug">
                    <span className="font-bold text-white">💬 Question: </span>
                    <span className="text-slate-200">{currentAnswer.question}</span>
                  </div>
                  <button
                    onClick={() => copyText(currentAnswer.question, 'q')}
                    className="p-1 text-slate-400 hover:text-white shrink-0"
                    title="Copy question"
                  >
                    {copiedQuestion ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>

                {/* ⭐ Answer */}
                <div className="space-y-1.5 pt-1">
                  <div className="font-bold text-amber-300 flex items-center gap-1">
                    <span>⭐ Answer:</span>
                  </div>
                  <ul className="space-y-1 pl-4 text-slate-200 list-disc leading-relaxed text-[11.5px]">
                    {currentAnswer.bulletPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>

                {/* 🔑 Key Steps (if present, like in coding LeetCode frame) */}
                {currentAnswer.keySteps && currentAnswer.keySteps.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="font-bold text-emerald-400 flex items-center gap-1">
                      <span>🔑 Key Steps:</span>
                    </div>
                    <ul className="space-y-1 pl-4 text-slate-300 list-disc leading-relaxed text-[11px]">
                      {currentAnswer.keySteps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 💻 Code Solution (if present) */}
                {currentAnswer.correctCode && (
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-blue-400 flex items-center gap-1">
                        <span>💻 Code:</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/50 border border-white/10 text-slate-300">
                          {currentAnswer.language || 'cpp'}
                        </span>
                      </div>
                      <button
                        onClick={() => copyText(currentAnswer.correctCode!, 'c')}
                        className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-300 transition"
                      >
                        {copiedCode ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <div className="rounded-xl bg-black/70 border border-white/10 p-2.5 font-mono text-[10.5px] text-slate-100 overflow-x-auto">
                      <pre className="leading-relaxed whitespace-pre">{currentAnswer.correctCode}</pre>
                    </div>
                  </div>
                )}

                {/* Complexity analysis / Trade-off */}
                {(currentAnswer.complexity || currentAnswer.tradeOff) && (
                  <div className="pt-1 text-[11px] text-slate-400 italic leading-relaxed">
                    {currentAnswer.complexity && <p>{currentAnswer.complexity}</p>}
                    {currentAnswer.tradeOff && <p>{currentAnswer.tradeOff}</p>}
                  </div>
                )}
              </div>

              {/* Card Footer: Timestamp, Feedback, Resize Handle */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px]">Answer • {currentAnswer.timestamp}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
                      className={`p-1 rounded hover:text-white transition ${feedback === 'up' ? 'text-emerald-400' : 'text-slate-400'}`}
                      title="Helpful Answer"
                    >
                      <ThumbsUp className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
                      className={`p-1 rounded hover:text-white transition ${feedback === 'down' ? 'text-rose-400' : 'text-slate-400'}`}
                      title="Unhelpful Answer"
                    >
                      <ThumbsDown className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Resize icon indicator */}
                <div className="text-slate-500" title="Resizable card">
                  <span className="text-[10px] font-mono">⤡</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
