'use client';

/**
 * useAudioLoopback
 *
 * Dual-channel real-time audio capture for interview co-pilot:
 *
 *   Channel A — SYSTEM AUDIO (loopback):
 *     Captures the interviewer's voice played through the candidate's
 *     speakers/headphones from Zoom / Google Meet / Teams.
 *     Uses getDisplayMedia({ audio: true, video: false }) — available
 *     natively in packaged Electron on macOS 13+ and Windows.
 *     Falls back to Electron desktopCapturer source ID on older macOS.
 *
 *   Channel B — MICROPHONE:
 *     Captures the candidate's own voice via getUserMedia({ audio: true }).
 *
 * Both channels run separate SpeechRecognition instances (or can be
 * routed to a Deepgram WebSocket for production-quality diarization).
 *
 * Hook output:
 *   - interviewerTranscript: latest words from interviewer (system audio)
 *   - candidateTranscript:   latest words from candidate (mic)
 *   - combinedTranscript:    merged, timestamped, ready for Gemini context
 *   - isLoopbackActive:      whether system audio capture is running
 *   - isMicActive:           whether mic capture is running
 *   - loopbackError:         user-facing error if system audio unavailable
 *   - startLoopback():       start system audio capture
 *   - stopLoopback():        stop system audio capture
 *   - startMic():            start mic capture
 *   - stopMic():             stop mic capture
 *   - stopAll():             stop everything, release all tracks
 */

import { useState, useRef, useCallback, useEffect } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TranscriptEntry {
  speaker: 'Interviewer' | 'Candidate';
  text: string;
  timestamp: string;  // "MM:SS"
  isFinal: boolean;
}

export interface AudioLoopbackState {
  interviewerTranscript: string;
  candidateTranscript:   string;
  combinedTranscript:    TranscriptEntry[];
  isLoopbackActive:      boolean;
  isMicActive:           boolean;
  loopbackError:         string | null;
  micError:              string | null;
  startLoopback:         () => Promise<void>;
  stopLoopback:          () => void;
  startMic:              () => Promise<void>;
  stopMic:               () => void;
  stopAll:               () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTimestamp(startedAt: number): string {
  const elapsed = Math.floor((Date.now() - startedAt) / 1000);
  const m = Math.floor(elapsed / 60);
  const s = elapsed % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSpeechRecognition(): (new () => any) | null {
  if (typeof window === 'undefined') return null;
  return (
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition ||
    null
  );
}

/**
 * createRecognition — wraps the Web Speech API for one channel.
 * In production you would swap this for a Deepgram WebSocket connected
 * to an AudioWorklet PCM stream for much higher accuracy and true
 * speaker diarization.
 */
function createRecognition(
  stream: MediaStream,
  onInterim: (text: string) => void,
  onFinal: (text: string) => void,
  onError?: (err: string) => void,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): any | null {
  const SR = getSpeechRecognition();
  if (!SR) {
    onError?.('Web Speech API not available in this browser.');
    return null;
  }

  const recognition = new SR();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
  recognition.maxAlternatives = 1;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognition.onresult = (event: any) => {
    let interim = '';
    let final = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const t = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        final += t;
      } else {
        interim += t;
      }
    }
    if (interim) onInterim(interim.trim());
    if (final)   onFinal(final.trim());
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recognition.onerror = (event: any) => {
    if (event.error !== 'no-speech' && event.error !== 'aborted') {
      onError?.(event.error);
    }
  };

  return recognition;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAudioLoopback(sessionStartTime: number): AudioLoopbackState {
  // ── State ──────────────────────────────────────────────────────────────────
  const [interviewerTranscript, setInterviewerTranscript] = useState('');
  const [candidateTranscript,   setCandidateTranscript]   = useState('');
  const [combinedTranscript,    setCombinedTranscript]    = useState<TranscriptEntry[]>([]);
  const [isLoopbackActive,      setIsLoopbackActive]      = useState(false);
  const [isMicActive,           setIsMicActive]           = useState(false);
  const [loopbackError,         setLoopbackError]         = useState<string | null>(null);
  const [micError,              setMicError]              = useState<string | null>(null);

  // ── Refs (non-reactive, hold mutable stream/recognition handles) ───────────
  const loopbackStreamRef    = useRef<MediaStream | null>(null);
  const micStreamRef         = useRef<MediaStream | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loopbackRecogRef     = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const micRecogRef          = useRef<any>(null);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const appendCombined = useCallback(
    (speaker: TranscriptEntry['speaker'], text: string, isFinal: boolean) => {
      if (!text.trim()) return;
      setCombinedTranscript((prev) => [
        ...prev,
        {
          speaker,
          text: text.trim(),
          timestamp: formatTimestamp(sessionStartTime),
          isFinal,
        },
      ]);
    },
    [sessionStartTime],
  );

  // ── System Audio Loopback ──────────────────────────────────────────────────
  const startLoopback = useCallback(async () => {
    setLoopbackError(null);
    try {
      let stream: MediaStream | null = null;

      // ── Strategy 1: getDisplayMedia({ audio: true, video: false })
      // Works in: packaged Electron (macOS 13+ and Windows), Chrome 74+
      // Does NOT work in: Safari, Firefox, or browser-based deployments
      if (navigator.mediaDevices?.getDisplayMedia) {
        try {
          stream = await navigator.mediaDevices.getDisplayMedia({
            audio: {
              // Suppress noise/echo suppression to get clean interviewer audio
              echoCancellation: false,
              noiseSuppression: false,
              sampleRate: 16000,
            } as MediaTrackConstraints,
            video: false, // we only want audio, not a video track
          });
        } catch (displayErr: any) {
          // User cancelled the picker or feature not available
          console.warn('[ZeroPrep Loopback] getDisplayMedia failed:', displayErr?.message);
        }
      }

      // ── Strategy 2: Electron desktopCapturer source → getUserMedia
      // Fallback for older macOS versions or when Strategy 1 is unavailable.
      // Gets a chromeMediaSourceId from the main process and passes it to
      // getUserMedia as a constraint — gives Chromium access to system audio.
      if (!stream) {
        const desktop = (window as any).zeroPrepDesktop;
        if (desktop?.getAudioSources) {
          const sources: { id: string; name: string }[] = await desktop.getAudioSources();
          // Pick the primary screen source (first 'screen:' prefixed ID)
          const screenSource = sources.find((s) => s.id.startsWith('screen:')) || sources[0];
          if (screenSource) {
            try {
              stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                  // @ts-expect-error — Electron-specific chromeMediaSource constraint
                  mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: screenSource.id,
                  },
                },
                video: false,
              });
            } catch (desktopErr: any) {
              console.warn('[ZeroPrep Loopback] desktopCapturer fallback failed:', desktopErr?.message);
            }
          }
        }
      }

      if (!stream) {
        setLoopbackError(
          'System audio capture unavailable. On macOS: allow Screen Recording in System Settings → Privacy. ' +
          'On Windows: grant screen-capture permission when prompted.',
        );
        return;
      }

      loopbackStreamRef.current = stream;

      // Stop loopback if the user dismisses the OS picker
      stream.getAudioTracks()[0]?.addEventListener('ended', () => {
        stopLoopback();
      });

      const recognition = createRecognition(
        stream,
        (interim) => setInterviewerTranscript(interim),
        (final) => {
          setInterviewerTranscript(final);
          appendCombined('Interviewer', final, true);
        },
        (err) => setLoopbackError(`Transcription error: ${err}`),
      );

      if (recognition) {
        loopbackRecogRef.current = recognition;
        recognition.start();
      }

      setIsLoopbackActive(true);
    } catch (err: any) {
      setLoopbackError(err?.message || 'Failed to start system audio capture.');
    }
  }, [appendCombined]);

  const stopLoopback = useCallback(() => {
    try { loopbackRecogRef.current?.stop(); } catch {}
    loopbackStreamRef.current?.getTracks().forEach((t) => t.stop());
    loopbackRecogRef.current = null;
    loopbackStreamRef.current = null;
    setIsLoopbackActive(false);
    setInterviewerTranscript('');
  }, []);

  // ── Microphone Capture ─────────────────────────────────────────────────────
  const startMic = useCallback(async () => {
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        },
        video: false,
      });

      micStreamRef.current = stream;

      const recognition = createRecognition(
        stream,
        (interim) => setCandidateTranscript(interim),
        (final) => {
          setCandidateTranscript(final);
          appendCombined('Candidate', final, true);
        },
        (err) => setMicError(`Mic transcription error: ${err}`),
      );

      if (recognition) {
        micRecogRef.current = recognition;
        recognition.start();
      }

      setIsMicActive(true);
    } catch (err: any) {
      const msg = err?.name === 'NotAllowedError'
        ? 'Microphone access denied. Please allow mic access in your browser/OS settings.'
        : err?.message || 'Failed to start microphone.';
      setMicError(msg);
    }
  }, [appendCombined]);

  const stopMic = useCallback(() => {
    try { micRecogRef.current?.stop(); } catch {}
    micStreamRef.current?.getTracks().forEach((t) => t.stop());
    micRecogRef.current = null;
    micStreamRef.current = null;
    setIsMicActive(false);
    setCandidateTranscript('');
  }, []);

  const stopAll = useCallback(() => {
    stopLoopback();
    stopMic();
    setCombinedTranscript([]);
  }, [stopLoopback, stopMic]);

  // ── Cleanup on unmount ─────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      try { loopbackRecogRef.current?.stop(); } catch {}
      try { micRecogRef.current?.stop(); } catch {}
      loopbackStreamRef.current?.getTracks().forEach((t) => t.stop());
      micStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return {
    interviewerTranscript,
    candidateTranscript,
    combinedTranscript,
    isLoopbackActive,
    isMicActive,
    loopbackError,
    micError,
    startLoopback,
    stopLoopback,
    startMic,
    stopMic,
    stopAll,
  };
}
