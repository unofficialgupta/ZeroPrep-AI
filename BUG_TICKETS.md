# QA Defect Tracking & Test Audit Report: ZeroPrep AI
**Author:** Lead QA Automation & Test Architect (10+ Years Experience)  
**Target Application:** ZeroPrep AI (Real-Time Interview & Coding Copilot)  
**Scope:** Full-stack codebase audit (Next.js 15 Web App, Electron Desktop Container, Gemini 2.5 Multimodal Engine, Stealth HUD Overlay)  
**Date:** September 7, 2026  
**Status:** OPEN — Action Required  

---

## Executive Summary

A comprehensive quality assurance inspection of the **ZeroPrep AI** codebase was conducted covering:
1. **Functional Integrity:** Real-time AI answer generation, screen capture analysis, Gemini 2.5 API communications, and storage persistence.
2. **Cross-Platform & Cross-Browser Compatibility:** Windows vs macOS shortcut handling, Electron IPC bridge vs standalone Web fallbacks, and Chromium vs WebKit (Safari/Firefox) API compatibility.
3. **User Experience & Input Edge Cases:** Global keyboard event listener collisions, input focus traps, decoupled UI state, and dead/unimplemented interactive controls.
4. **Security, Stability & Data Handling:** Uncaught `localStorage` exceptions in Private Browsing, media track leaks, uncompressed 4K payload limits, and legacy brand references.

**Summary of Findings:**
- **Total Defects Identified:** 10
- **P0 (Blocker):** 1
- **P1 (Critical):** 3
- **P2 (Major):** 4
- **P3 (Minor / Polish):** 2

---

## Defect Summary Table

| Ticket ID | Severity | Priority | Component | Defect Title | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ZP-BUG-001** | Critical | P0 | `StealthOverlay.tsx` | Global Keyboard Listener Traps Editable Inputs & Deletes Answers | **Resolved / Verified** |
| **ZP-BUG-002** | Critical | P1 | `StealthOverlay.tsx` | Non-Standard `ImageCapture` API Crashes on Safari/Firefox & Leaks Video Tracks | **Resolved / Verified** |
| **ZP-BUG-003** | High | P1 | `Header.tsx` / `dashboard` | Global Header Search Bar Decoupled from Child Views & Missing `⌘K` Listener | **Resolved / Verified** |
| **ZP-BUG-004** | High | P1 | `documents/page.tsx` | "Upload Document" CTA is an Inoperable Dead Button with No File Picker | **Resolved / Verified** |
| **ZP-BUG-005** | Medium | P2 | `SessionDetailDrawer.tsx` | Call Recording Audio Player is Simulated with No Real Sound Output or Scrubber | **Resolved / Verified** |
| **ZP-BUG-006** | Medium | P2 | `settings/page.tsx` | Stealth Protection & STT Provider Toggles Fail to Persist or Sync to Desktop IPC | **Resolved / Verified** |
| **ZP-BUG-007** | Medium | P2 | `Sidebar.tsx` / `NewSessionModal` | Residual "Parakeet" Branding & Hardcoded Mac `⌘` Shortcuts on Windows | **Resolved / Verified** |
| **ZP-BUG-008** | Medium | P2 | `GeminiKeyContext.tsx` | Uncaught `QuotaExceededError` in Safari Private Mode on `localStorage.setItem` | **Resolved / Verified** |
| **ZP-BUG-009** | Low | P3 | `StealthOverlay.tsx` | Lack of Web Speech Recognition Fallback in Web Browser Environment | **Resolved / Verified** |
| **ZP-BUG-010** | Low | P3 | `api/gemini/route.ts` | High-Resolution Screen Captures Risk HTTP 413 Payload Rejection | **Resolved / Verified** |

---

## Detailed Bug Tickets

---

### [ZP-BUG-001] Global Keyboard Listener Traps Editable Inputs & Deletes Answers
- **Severity:** Critical (P0)
- **Component:** `src/components/StealthOverlay.tsx:218-274`
- **Environment:** All Platforms (Web & Desktop Container)

#### Description:
The global `keydown` event listener in `StealthOverlay.tsx` handles hotkeys (`?`, `Backspace`, `Ctrl+Backspace`, `ArrowLeft`, `ArrowRight`, `Enter`) without checking if the user is currently typing in an editable field (`<input>`, `<textarea>`, or `isContentEditable`).

#### Steps to Reproduce:
1. Open the Stealth HUD overlay.
2. Click on the "Chat" button to open the custom prompt text input.
3. Type a prompt containing a question mark, e.g., `"Can you optimize this?"`.
4. Press `?` (Shift + /).
5. Attempt to use `Cmd/Ctrl + Backspace` to delete the last word.
6. Attempt to use `Cmd/Ctrl + ArrowLeft` to jump the cursor to the beginning of the line.

#### Expected Result:
- Typing `?` inputs the question mark character into the text field.
- Pressing `Cmd/Ctrl + Backspace` deletes the preceding word or text in the input.
- Pressing `Cmd/Ctrl + ArrowLeft` moves the text caret to the beginning of the line.

#### Actual Result:
- Typing `?` calls `e.preventDefault()` and pops up the Shortcuts Cheatsheet modal.
- Pressing `Cmd/Ctrl + Backspace` calls `handleClearAnswer()` and permanently deletes the active AI answer card.
- Pressing `Cmd/Ctrl + ArrowLeft` flips through past interview answer history instead of moving the cursor.

#### Remediation:
Add an input guard at the top of the `keydown` handler:
```typescript
const target = e.target as HTMLElement;
const isInputActive = target && (
  target.tagName === 'INPUT' || 
  target.tagName === 'TEXTAREA' || 
  target.isContentEditable
);

// If typing inside an input, only allow Escape or explicit Enter submission
if (isInputActive && e.key !== 'Escape' && !(e.key === 'Enter' && (e.metaKey || e.ctrlKey))) {
  return;
}
```

---

### [ZP-BUG-002] Non-Standard `ImageCapture` API Crashes on Safari/Firefox & Leaks Video Tracks
- **Severity:** Critical (P1)
- **Component:** `src/components/StealthOverlay.tsx:367-378`
- **Environment:** Web Browsers (macOS Safari, iOS Safari, Firefox)

#### Description:
`triggerScreenAnalysis()` invokes `new (window as any).ImageCapture(track)` and `imageCapture.grabFrame()`. `ImageCapture` is an experimental Chromium-only specification and does NOT exist in standard Safari or Firefox. Calling this constructor throws an unhandled `TypeError: (window as any).ImageCapture is not a constructor`. Furthermore, `track.stop()` is placed *after* `grabFrame()`. If an exception occurs, the media stream track is never closed, leaving the system screen-recording indicator permanently active in the browser.

#### Steps to Reproduce:
1. Launch ZeroPrep AI in Safari (`http://localhost:3001`).
2. Open Stealth Overlay.
3. Click "Analyze Screen" or press hotkey.
4. Grant screen capture permission in the Safari prompt.

#### Expected Result:
A screenshot frame is captured, drawn to a canvas, encoded to base64, and all media stream tracks are immediately stopped.

#### Actual Result:
Uncaught `TypeError` thrown in the console. Screen analysis aborts and the screen sharing indicator remains active in the Safari menu bar.

#### Remediation:
Implement standard HTML5 `<video>` element frame capture with a `try/finally` block to guarantee `track.stop()` execution:
```typescript
const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
try {
  const track = stream.getVideoTracks()[0];
  const video = document.createElement('video');
  video.srcObject = stream;
  await video.play();
  
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx?.drawImage(video, 0, 0);
  base64Image = canvas.toDataURL('image/jpeg', 0.85);
} finally {
  stream.getTracks().forEach((t) => t.stop());
}
```

---

### [ZP-BUG-003] Global Header Search Bar Decoupled from Child Views & Missing `⌘K` Listener
- **Severity:** High (P1)
- **Component:** `src/components/Header.tsx`, `src/app/dashboard/layout.tsx`
- **Environment:** All Platforms

#### Description:
The persistent top navigation header includes a search input with a visual `⌘ K` badge. However:
1. `dashboard/layout.tsx` manages `searchQuery` state but does not pass it down to `children` via context, props, or URL search parameters (`?q=`).
2. `src/app/dashboard/callSessions/page.tsx` has its own isolated `searchQuery` state and ignores the global header. Searching from the top header yields zero results.
3. Pressing `⌘+K` or `Ctrl+K` does not focus the input because no global shortcut listener is implemented.

#### Steps to Reproduce:
1. Navigate to `/dashboard/callSessions`.
2. Click the top Header search bar and type `"Google"`.
3. Observe the session table below.
4. Press `Cmd+K` on Mac or `Ctrl+K` on Windows while unfocused.

#### Expected Result:
- The session table dynamically filters for "Google" sessions.
- Pressing `Cmd+K` / `Ctrl+K` immediately places focus into the search bar.

#### Actual Result:
- The session table does not filter; the user must re-type their search in the secondary local filter box.
- `Cmd+K` / `Ctrl+K` does nothing.

#### Remediation:
1. Synchronize the search input with URL search parameters (`useSearchParams` / `useRouter`), or expose a shared `SearchContext`.
2. Attach a `keydown` listener in `Header.tsx` to focus the search `inputRef` when `(e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'`.

---

### [ZP-BUG-004] "Upload Document" CTA is an Inoperable Dead Button with No File Picker
- **Severity:** High (P1)
- **Component:** `src/app/dashboard/documents/page.tsx:58-61`
- **Environment:** All Platforms

#### Description:
The primary action button on `/dashboard/documents` ("Upload Document") has no `onClick` handler, no hidden `<input type="file">`, and no upload functionality. Clicking the button produces no visual feedback or action.

#### Steps to Reproduce:
1. Navigate to `/dashboard/documents`.
2. Click the blue "Upload Document" button in the upper right corner.

#### Expected Result:
An OS file selector dialog opens allowing the candidate to upload `.pdf`, `.docx`, or `.md` resumes or cheat sheets.

#### Actual Result:
Nothing happens. The button is completely inert.

#### Remediation:
Wire an `<input type="file" ref={fileInputRef} accept=".pdf,.doc,.docx,.txt,.md" className="hidden" />` and handle document uploads, updating the state and persisting metadata to `localStorage`.

---

### [ZP-BUG-005] Call Recording Audio Player is Simulated with No Real Sound Output or Scrubber
- **Severity:** Medium (P2)
- **Component:** `src/components/SessionDetailDrawer.tsx:110-140`, `src/app/dashboard/callSessions/page.tsx:57-64`
- **Environment:** All Platforms

#### Description:
In both `CallSessionsPage` and `SessionDetailDrawer`, clicking the Play/Pause button merely toggles a boolean state that switches the icon between `<Play>` and `<Pause>` and adds an `animate-pulse` class to SVG bars. There is no `<audio>` element, no synthetic tone/waveform playback, no scrubber tracking elapsed seconds, and no audio duration synchronization.

#### Steps to Reproduce:
1. Go to `/dashboard/callSessions`.
2. Click any row to open the Session Detail Drawer.
3. Click the Play button in the "Call Recording Preview" bar.

#### Expected Result:
Audio playback starts, an elapsed time counter increments, and the scrubber moves across the duration.

#### Actual Result:
No sound is heard. The waveform pulses indefinitely, and time remains fixed.

#### Remediation:
Connect a Web Audio API synthesizer generating ambient interview speech audio playback or attach a real audio asset with an HTML5 `<audio>` element tracking playback progress.

---

### [ZP-BUG-006] Stealth Protection & STT Provider Toggles Fail to Persist or Sync to Desktop IPC
- **Severity:** Medium (P2)
- **Component:** `src/app/dashboard/settings/page.tsx:34-35`, `227-236`
- **Environment:** All Platforms

#### Description:
In `/dashboard/settings`:
1. The "Invisible Stealth HUD & Content Protection" toggle (`stealthProtected`) and "Speech-to-Text Provider" select (`sttProvider`) are stored only in volatile React `useState`.
2. Refreshing the settings page resets them back to default values.
3. Toggling `stealthProtected` does not call `window.zeroPrepDesktop.setStealthProtection(enabled)` to communicate with the Electron main process.
4. Line 253 contains a minor typo: `'Ctrl+\\ '` includes an unintended trailing space.

#### Steps to Reproduce:
1. Open `/dashboard/settings`.
2. Toggle off "Invisible Stealth HUD".
3. Change STT Provider to "Browser Web Speech API".
4. Refresh the browser page.

#### Expected Result:
Settings remain saved in `localStorage` and Electron native content protection updates accordingly.

#### Actual Result:
Settings revert to defaults. Desktop content protection remains in its initial state.

#### Remediation:
Persist `stealthProtected` and `sttProvider` into `localStorage` in an effect/handler and invoke `(window as any).zeroPrepDesktop?.setStealthProtection(val)`.

---

### [ZP-BUG-007] Residual "Parakeet" Branding & Hardcoded Mac `⌘` Shortcuts on Windows
- **Severity:** Medium (P2)
- **Component:** Multiple files (`Sidebar.tsx`, `NewSessionModal.tsx`, `callSessions/page.tsx`, `storage.ts`)
- **Environment:** Windows OS & Brand Consistency

#### Description:
Residual references to "Parakeet" and hardcoded macOS shortcut symbols (`⌘`) exist in several user-facing components:
1. `src/components/Sidebar.tsx:189`: Hardcodes `⌘+⇧+S` in the user candidate card regardless of whether the user is on Windows.
2. `src/components/NewSessionModal.tsx:68`: Code snippet defaults to `# Parakeet Copilot live ready`.
3. `src/components/NewSessionModal.tsx:64, 70`: Displays `⌘+⇧+S` on Windows systems.
4. `src/lib/storage.ts:255`: Local storage key is still `'parakeet_call_sessions'`.
5. `src/app/dashboard/callSessions/page.tsx:128`: Code comment reads `/* Parakeet Metrics Overview Grid */`.

#### Steps to Reproduce:
1. Open ZeroPrep AI on a Windows machine.
2. Inspect the bottom-left profile card in the sidebar (`⌘+⇧+S` shown instead of `Ctrl+Shift+S`).
3. Click "New Session" and inspect initial session code preview.

#### Expected Result:
- "ZeroPrep AI" branding is consistently applied.
- Shortcuts display `Ctrl + Shift + S` on Windows / Linux and `⌘ + ⇧ + S` on macOS.

#### Actual Result:
Mac-specific symbols and legacy "Parakeet" references appear.

---

### [ZP-BUG-008] Uncaught `QuotaExceededError` in Safari Private Mode on `localStorage.setItem`
- **Severity:** Medium (P2)
- **Component:** `src/context/GeminiKeyContext.tsx:67`, `91`
- **Environment:** Web Browser (Safari Private Mode / Sandboxed Iframes)

#### Description:
In `GeminiKeyContext.tsx`, `localStorage.setItem('parakeet_gemini_key', ...)` and `localStorage.setItem('parakeet_gemini_model', ...)` are called directly without a `try/catch` guard. In Safari Private Browsing mode or when disk quota is exceeded, `localStorage.setItem` throws an uncaught `QuotaExceededError` or `SecurityError`, halting execution and breaking the "Save & Test Key" flow.

#### Steps to Reproduce:
1. Open ZeroPrep AI in Safari in a Private Browsing window.
2. Open Settings or the API Key modal.
3. Enter a valid key and click "Save & Test Key".

#### Expected Result:
Key is saved gracefully in memory fallback and state updates cleanly.

#### Actual Result:
Uncaught exception thrown; UI remains stuck in "Verifying..." or unhandled rejection state.

#### Remediation:
Wrap all `localStorage.setItem` operations in safe utility wrappers with in-memory fallback.

---

### [ZP-BUG-009] Lack of Web Speech Recognition Fallback in Web Browser Environment
- **Severity:** Low (P3)
- **Component:** `src/components/StealthOverlay.tsx:206-209`
- **Environment:** Standalone Web Browser (Chrome/Edge)

#### Description:
In the floating HUD, `speechStream` is initialized with static sample text and never receives live microphone input when running inside standard web browsers. Although speech-to-text is listed in Settings as supporting "Browser Web Speech API", `StealthOverlay` does not instantiate `webkitSpeechRecognition` or `SpeechRecognition` when the candidate mic is unmuted.

#### Steps to Reproduce:
1. Open the Stealth Overlay in Google Chrome.
2. Speak into the microphone.

#### Expected Result:
Spoken words appear in real-time in the speech stream pill.

#### Actual Result:
The speech pill remains static with default placeholder text.

#### Remediation:
Implement a lightweight Web Speech API hook (`webkitSpeechRecognition`) that populates `speechStream` when `isCandidateMicMuted === false`.

---

### [ZP-BUG-010] High-Resolution Screen Captures Risk HTTP 413 Payload Rejection
- **Severity:** Low (P3)
- **Component:** `src/app/api/gemini/route.ts`, `src/components/StealthOverlay.tsx:378`
- **Environment:** 4K / High-DPI Displays (Retina Screens)

#### Description:
When capturing screen bitmaps on high-resolution displays (e.g. 3840x2160 or Retina 5K), `canvas.toDataURL('image/png')` can produce base64 strings exceeding 12MB. Next.js route handlers default to a body limit, leading to HTTP 413 (Payload Too Large) or edge memory errors when POSTing to `/api/gemini`.

#### Steps to Reproduce:
1. Run ZeroPrep AI on a 4K display or external Retina monitor.
2. Trigger "Analyze Screen".
3. POST request to `/api/gemini` with raw uncompressed PNG data URL.

#### Expected Result:
The image is compressed/resized before sending, staying under 1MB.

#### Actual Result:
Large multi-megabyte payload is sent, causing network latency or request failure.

#### Remediation:
Clamp maximum canvas dimensions to 1920x1080 and encode as `image/jpeg` with quality `0.8` to keep payloads under 500KB.

---

## QA Recommendation & Next Steps

1. **Sprint Priority 1 (Immediate Fixes):**
   - Resolve **ZP-BUG-001** (Input hotkey hijacking & accidental answer deletion).
   - Resolve **ZP-BUG-002** (Cross-browser screen capture fallback with guaranteed track cleanup).
   - Resolve **ZP-BUG-003** (Global header search state wiring & `⌘K` listener).
   - Resolve **ZP-BUG-004** (Document upload handler & file selector).

2. **Sprint Priority 2 (UX & Platform Consistency):**
   - Resolve **ZP-BUG-006** & **ZP-BUG-007** (Settings persistence & OS-aware shortcut labels).
   - Resolve **ZP-BUG-008** (Safe localStorage error boundaries).
   - Resolve **ZP-BUG-005** (Audio preview playback simulation).

3. **Sprint Priority 3 (Performance & Enhancements):**
   - Resolve **ZP-BUG-009** (Web Speech API integration) and **ZP-BUG-010** (Screen capture image downsampling).
