'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Zap,
  Laptop,
  Mic,
  MicOff,
  Volume2,
  X,
  Send,
  Trash2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Move,
  Clock,
  Sparkles,
  Command,
  CornerDownLeft,
  Sliders,
  Sun,
  Moon
} from 'lucide-react';
import { useGeminiKey } from '@/context/GeminiKeyContext';
import { useAudioLoopback } from '@/hooks/useAudioLoopback';
import { askGemini, ChatMessage } from '@/lib/gemini';

interface StealthOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  isNativeWindow?: boolean;
  initialIndex?: number;
}

export default function StealthOverlay({
  isOpen,
  onClose,
  isNativeWindow = false,
}: StealthOverlayProps) {
  const { apiKey, activeModel } = useGeminiKey();

  // OS Detection
  const [isMac, setIsMac] = useState(true);
  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsMac(/Mac|iPod|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
    }
  }, []);

  const modKey = isMac ? '⌘' : 'Ctrl';

  // Live Call Timer
  const [callStartEpoch] = useState(() => Date.now() - 1635 * 1000);
  const [callSeconds, setCallSeconds] = useState(1635);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => setCallSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (total: number) => {
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // UI States
  const [opacity, setOpacity] = useState(96);
  const [glassTheme, setGlassTheme] = useState<'dark' | 'light'>('dark');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCandidateMicMuted, setIsCandidateMicMuted] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);

  // Audio Loopback & Transcription
  const audio = useAudioLoopback(callStartEpoch);
  const [interviewerSpeech, setInterviewerSpeech] = useState<string>('');

  useEffect(() => {
    if (audio.interviewerTranscript.trim()) {
      setInterviewerSpeech(audio.interviewerTranscript);
    } else if (audio.candidateTranscript.trim()) {
      setInterviewerSpeech(audio.candidateTranscript);
    }
  }, [audio.interviewerTranscript, audio.candidateTranscript]);

  useEffect(() => {
    if (!isCandidateMicMuted && !audio.isMicActive) {
      audio.startMic();
    } else if (isCandidateMicMuted && audio.isMicActive) {
      audio.stopMic();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCandidateMicMuted]);

  // Chat Messages Thread
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hello! I am your real-time AI copilot powered by Gemini 3.5 Flash.\n\nType any question below or press ⌘↵ for instant answers. Press ⇧⌘↵ to analyze your screen.',
      timestamp: '27:15'
    }
  ]);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef(audio);
  audioRef.current = audio;

  // Auto scroll to bottom of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Close HUD & Teardown
  const handleCloseHUD = useCallback(() => {
    audioRef.current.stopAll();
    setIsTimerRunning(false);
    setIsLoading(false);
    onClose();
  }, [onClose]);

  // Dynamic Window Sizing
  useEffect(() => {
    if (!isNativeWindow || !containerRef.current) return;
    const desktop = (window as any).zeroPrepDesktop || (window as any).parakeetDesktop;
    if (!desktop?.resizeHudWindow) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = Math.ceil(entry.target.getBoundingClientRect().height);
        if (height > 0) {
          desktop.resizeHudWindow(520, height);
        }
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [isNativeWindow, isCollapsed, messages.length]);

  // Mouse Drag Fallback
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleDragStart = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('textarea')) {
      return;
    }

    isDraggingRef.current = true;
    dragStartRef.current = { x: e.screenX, y: e.screenY };

    const handleMouseMove = (moveEvt: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaX = moveEvt.screenX - dragStartRef.current.x;
      const deltaY = moveEvt.screenY - dragStartRef.current.y;
      dragStartRef.current = { x: moveEvt.screenX, y: moveEvt.screenY };

      const desktop = (window as any).zeroPrepDesktop || (window as any).parakeetDesktop;
      if (desktop?.moveHudWindow) {
        desktop.moveHudWindow(deltaX, deltaY);
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const moveHUDBy = (dx: number, dy: number) => {
    const desktop = (window as any).zeroPrepDesktop || (window as any).parakeetDesktop;
    if (desktop?.moveHudWindow) {
      desktop.moveHudWindow(dx, dy);
    }
  };

  // Send Chat Message with Real-Time Streaming
  const handleSendMessage = async (customQuery?: string, base64Image?: string) => {
    const rawQuery = customQuery || inputText;
    const query = (rawQuery || interviewerSpeech || '').trim();
    if (!query && !base64Image) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: query || 'Analyze screen content',
      timestamp: formatTimer(callSeconds),
      image: base64Image
    };

    const aiMsgId = `ai-${Date.now()}`;
    const initialAiMsg: ChatMessage = {
      id: aiMsgId,
      sender: 'ai',
      text: '',
      timestamp: formatTimer(callSeconds)
    };

    setMessages((prev) => [...prev, userMsg, initialAiMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const aiResponse = await askGemini(
        query || 'Analyze the provided screen image and solve/explain what is shown.',
        base64Image,
        apiKey,
        activeModel || 'gemini-3.5-flash-lite',
        (streamedText) => {
          setMessages((prev) =>
            prev.map((msg) => (msg.id === aiMsgId ? { ...msg, text: streamedText } : msg))
          );
        }
      );

      // Final sync with full completed text
      setMessages((prev) =>
        prev.map((msg) => (msg.id === aiMsgId ? { ...msg, text: aiResponse } : msg))
      );
    } catch (err: any) {
      console.error('Chat error:', err);
      const isQuota = err?.message?.includes('429') || err?.message?.includes('quota') || err?.message?.includes('RESOURCE_EXHAUSTED');
      const errText = isQuota
        ? '⚠️ Gemini Free-Tier Quota Exceeded (429)\n\nPlease wait a few seconds or configure a Gemini API key in HUD Settings.'
        : `Error: ${err?.message || 'Unable to generate response. Please check your Gemini API key.'}`;

      setMessages((prev) =>
        prev.map((msg) => (msg.id === aiMsgId ? { ...msg, text: errText } : msg))
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Silent Screen Capture & Query
  const handleScreenOCR = async () => {
    setIsLoading(true);
    let base64Image = '';
    const desktop = (window as any).zeroPrepDesktop || (window as any).parakeetDesktop;

    if (desktop?.getDesktopSources) {
      try {
        const sources = await desktop.getDesktopSources();
        const primary = sources.find((s: any) => s.id.startsWith('screen:')) || sources[0];
        if (primary?.thumbnail) {
          base64Image = primary.thumbnail;
        }
      } catch (err) {
        console.warn('Native capture fallback:', err);
      }
    }

    if (!base64Image && navigator.mediaDevices?.getDisplayMedia) {
      let stream: MediaStream | null = null;
      try {
        stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const video = document.createElement('video');
        video.srcObject = stream;
        await video.play().catch(() => {});
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          base64Image = canvas.toDataURL('image/jpeg', 0.85);
        }
      } catch (err) {
        console.warn('Web screen capture declined:', err);
      } finally {
        stream?.getTracks().forEach((t) => t.stop());
      }
    }

    await handleSendMessage(interviewerSpeech || 'Analyze the active screen and solve any problem or question shown.', base64Image || undefined);
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 1800);
  };

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      const target = e.target as HTMLElement | null;
      const isInputActive = !!(
        target &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      );

      // 1. Escape: Dismiss
      if (e.key === 'Escape') {
        if (showSettingsMenu) {
          setShowSettingsMenu(false);
          return;
        }
        handleCloseHUD();
        return;
      }

      // 2. Move Window: Cmd/Ctrl + Alt + Arrow Keys
      if (isCmdOrCtrl && e.altKey) {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          moveHUDBy(0, -60);
          return;
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          moveHUDBy(0, 60);
          return;
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          moveHUDBy(-60, 0);
          return;
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          moveHUDBy(60, 0);
          return;
        }
      }

      if (isInputActive) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSendMessage();
          return;
        }
        return;
      }

      // 3. AI Help / Send: Cmd/Ctrl + Enter
      if (isCmdOrCtrl && e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
        return;
      }

      // 4. Screen Analysis: Cmd/Ctrl + Shift + S OR Cmd/Ctrl + Shift + Enter
      if (isCmdOrCtrl && e.shiftKey && (e.key.toLowerCase() === 's' || e.key === 'Enter')) {
        e.preventDefault();
        handleScreenOCR();
        return;
      }

      // 5. Focus Input: Cmd/Ctrl + K
      if (isCmdOrCtrl && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        return;
      }

      // 6. Toggle HUD: Cmd/Ctrl + \ or Cmd/Ctrl + Shift + H
      if (isCmdOrCtrl && (e.key === '\\' || (e.shiftKey && e.key.toLowerCase() === 'h'))) {
        e.preventDefault();
        handleCloseHUD();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // IPC Event Listeners
  useEffect(() => {
    const desktop = (window as any).zeroPrepDesktop || (window as any).parakeetDesktop;
    if (desktop) {
      const cleanCapture = desktop.onTriggerScreenCapture?.(() => handleScreenOCR());
      const cleanAnswer = desktop.onTriggerAnswer?.(() => handleSendMessage());
      const cleanChat = desktop.onTriggerChat?.(() => inputRef.current?.focus());
      const cleanStatus = desktop.onStealthHudStatus?.((isActive: boolean) => {
        if (!isActive) {
          audioRef.current.stopAll();
          setIsTimerRunning(false);
          setIsLoading(false);
        } else {
          setIsTimerRunning(true);
          if (!isCandidateMicMuted) {
            audioRef.current.startMic();
          }
        }
      });

      return () => {
        cleanCapture?.();
        cleanAnswer?.();
        cleanChat?.();
        cleanStatus?.();
      };
    }
  }, [interviewerSpeech]);

  if (!isOpen) return null;

  const isDark = glassTheme === 'dark';

  return (
    <div
      ref={containerRef}
      className="w-full select-none font-sans antialiased text-slate-100 transition-all duration-150"
      style={{
        width: '520px',
        maxWidth: '100%'
      }}
    >
      {/* Master Simple Chat Modal Chassis */}
      <div
        className="w-full flex flex-col rounded-2xl border transition-all duration-200 overflow-hidden shadow-2xl backdrop-blur-2xl"
        style={{
          backgroundColor: isDark
            ? `rgba(8, 12, 20, ${Math.max(opacity, 75) / 100})`
            : `rgba(255, 255, 255, ${Math.max(opacity, 75) / 100})`,
          borderColor: isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.12)',
          color: isDark ? '#f8fafc' : '#0f172a',
          boxShadow: isDark
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.08)'
            : '0 20px 40px -10px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.08)'
        }}
      >
        {/* ========================================================================= */}
        {/* 1. CLEAN HEADER (NO POINTER CURSORS, NO DOTS)                             */}
        {/* ========================================================================= */}
        <div
          onMouseDown={handleDragStart}
          className="w-full flex items-center justify-between gap-2 px-3 py-2 border-b border-white/[0.08] cursor-grab active:cursor-grabbing"
          style={{ WebkitAppRegion: 'drag' } as any}
        >
          {/* Left: Drag Handle, Brand Emblem & Timer */}
          <div className="flex items-center gap-2 shrink-0">
            <div
              className="p-1 rounded text-slate-400 hover:text-white transition cursor-default"
              title="Drag overlay or use ⌘+⌥+Arrows"
            >
              <Move className="h-3.5 w-3.5" />
            </div>

            <div className="flex items-center gap-1.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 via-blue-500 to-cyan-400 text-white shadow-xs">
                <Zap className="h-3 w-3 fill-current" />
              </div>
              <span className="text-xs font-bold tracking-tight text-white">ZeroPrep AI</span>
            </div>

            <div
              style={{ WebkitAppRegion: 'no-drag' } as any}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/40 border border-white/10 text-[11px] font-mono text-slate-300 cursor-default"
            >
              <Clock className="h-3 w-3 text-emerald-400" />
              <span>{formatTimer(callSeconds)}</span>
            </div>
          </div>

          {/* Right: Quick Action Icons & Window Controls */}
          <div
            className="flex items-center gap-1 shrink-0"
            style={{ WebkitAppRegion: 'no-drag' } as any}
          >
            {/* Silent Screen OCR Button */}
            <button
              onClick={handleScreenOCR}
              disabled={isLoading}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-medium text-slate-200 transition active:scale-95 disabled:opacity-50 cursor-default"
              title="Silent Screen OCR (⇧⌘↵)"
            >
              <Laptop className="h-3 w-3 text-cyan-300" />
              <span>Screen</span>
            </button>

            {/* Loopback Toggle */}
            <button
              onClick={() => (audio.isLoopbackActive ? audio.stopLoopback() : audio.startLoopback())}
              className={`p-1.5 rounded-lg border transition cursor-default ${
                audio.isLoopbackActive
                  ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                  : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
              }`}
              title="Interviewer Audio Loopback"
            >
              <Volume2 className="h-3.5 w-3.5" />
            </button>

            {/* Candidate Mic Toggle */}
            <button
              onClick={() => setIsCandidateMicMuted((p) => !p)}
              className="p-1.5 rounded-lg bg-black/30 border border-white/10 hover:border-white/20 text-slate-400 hover:text-white transition cursor-default"
              title={isCandidateMicMuted ? 'Mic Muted' : 'Mic Active'}
            >
              {isCandidateMicMuted ? (
                <MicOff className="h-3.5 w-3.5 text-rose-400" />
              ) : (
                <Mic className={`h-3.5 w-3.5 ${audio.isMicActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              )}
            </button>

            {/* Clear Chat */}
            <button
              onClick={() => setMessages([])}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-default"
              title="Clear Chat Thread"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>

            {/* Settings Popover */}
            <div className="relative">
              <button
                onClick={() => setShowSettingsMenu((p) => !p)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-default"
                title="Preferences & Opacity"
              >
                <Sliders className="h-3.5 w-3.5" />
              </button>

              {showSettingsMenu && (
                <div className="absolute right-0 top-7 z-50 w-56 rounded-xl border border-white/15 bg-[#0e131f]/98 backdrop-blur-xl p-3 shadow-2xl space-y-2.5 text-xs text-slate-200 animate-in fade-in zoom-in-95 duration-100">
                  <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                    <span className="font-semibold text-white">HUD Settings</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Stealth Protected</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Glass Opacity</span>
                      <span className="font-mono text-white">{opacity}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={opacity}
                      onChange={(e) => setOpacity(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none accent-indigo-500 cursor-default"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400">Theme</span>
                    <button
                      onClick={() => setGlassTheme(isDark ? 'light' : 'dark')}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/15 text-[11px] text-white cursor-default"
                    >
                      {isDark ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
                      <span>{isDark ? 'Dark' : 'Light'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Collapse Toggle */}
            <button
              onClick={() => setIsCollapsed((p) => !p)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition cursor-default"
              title={isCollapsed ? 'Expand Chat' : 'Collapse HUD'}
            >
              {isCollapsed ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
            </button>

            {/* Close Button */}
            <button
              onClick={handleCloseHUD}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-default"
              title="Dismiss HUD (Esc)"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. CHAT CONVERSATION THREAD                                               */}
        {/* ========================================================================= */}
        {!isCollapsed && (
          <div className="w-full flex flex-col justify-between overflow-hidden">
            {/* Messages Scroll Area */}
            <div className="w-full p-3 space-y-3 max-h-[420px] min-h-[160px] overflow-y-auto text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[92%] rounded-xl px-3 py-2 leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-black/40 border border-white/10 text-slate-100'
                    }`}
                  >
                    {/* Message Image thumbnail if attached */}
                    {msg.image && (
                      <div className="mb-1.5 rounded-lg overflow-hidden border border-white/10 max-h-28">
                        <img src={msg.image} alt="Screen capture" className="w-full object-cover" />
                      </div>
                    )}

                    {/* Message Text with Code Block formatting */}
                    <div className="whitespace-pre-wrap font-sans text-xs select-text">
                      {msg.text || (
                        <span className="inline-flex items-center gap-1 text-indigo-300 animate-pulse">
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce" />
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
                        </span>
                      )}
                    </div>

                    {/* Copy message button */}
                    {msg.sender === 'ai' && msg.text && (
                      <div className="mt-1.5 pt-1 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                        <span>{msg.timestamp}</span>
                        <button
                          onClick={() => copyText(msg.text, msg.id)}
                          className="flex items-center gap-1 hover:text-white transition cursor-default"
                        >
                          {copiedMsgId === msg.id ? (
                            <Check className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                          <span>{copiedMsgId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <div ref={chatBottomRef} />
            </div>

            {/* Quick Prompt Suggestions if chat is fresh */}
            {messages.length <= 1 && (
              <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                {[
                  'Explain time and space complexity',
                  'How to solve Longest Common Prefix in C++?',
                  'Analyze active screen'
                ].map((sug, i) => (
                  <button
                    key={i}
                    onClick={() => (sug === 'Analyze active screen' ? handleScreenOCR() : handleSendMessage(sug))}
                    className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-slate-300 transition cursor-default"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}

            {/* ========================================================================= */}
            {/* 3. BOTTOM CHAT INPUT BAR                                                  */}
            {/* ========================================================================= */}
            <div className="w-full px-3 py-2 border-t border-white/[0.08] bg-black/30">
              <div className="flex items-center gap-2 bg-slate-900/90 border border-white/15 focus-within:border-indigo-500/80 rounded-xl px-3 py-1.5 transition">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask anything or press Enter..."
                  className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
                />

                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim() || isLoading}
                  className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-30 transition cursor-default"
                  title="Send (Enter)"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
