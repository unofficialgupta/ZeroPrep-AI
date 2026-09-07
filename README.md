# ZeroPrep AI 🚀
### Real-Time Interview, DSA & Coding Copilot

ZeroPrep AI is a real-time AI copilot designed for technical interviews, DSA coding challenges, and system design assessments. Built with Next.js 15, Electron, Tailwind CSS, and Google Gemini 2.5 Flash.

---

## ✨ Features

- **Invisible Floating Stealth HUD:** 
  - Floating minimal overlay designed to hover over Zoom, Google Meet, Microsoft Teams, and IDEs.
  - Native OS content protection (`win.setContentProtection(true)`) ensures the HUD remains invisible on candidate screen-sharing feeds.
- **Instant Screen & OCR Analysis:**
  - One-click screen capture (`⌘+⇧+S` / `Ctrl+Shift+S`) to analyze LeetCode, HackerRank, CodeSignal, or CoderPad problems.
  - Multimodal Gemini 2.5 Flash engine diagnoses bugs, calculates Big-O complexity, and generates clean compilable fixes in sub-800ms.
- **Audio Loopback & Speech Stream:**
  - Live transcription of interviewer questions and candidate voice.
  - Real-time AI answers and STAR behavioral talking points tailored to your uploaded resume.
- **Cross-Platform Shortcut Support:**
  - Adaptive OS keybindings for macOS (`⌘`) and Windows/Linux (`Ctrl`).
  - Hotkey cheatsheet modal (`?` or `⌘+/` / `Ctrl+/`).
- **DSA Copilot & Session Vault:**
  - Full archive of interview sessions, audio playback previews, dual-channel transcripts, and code solutions.
  - Document & resume management to automatically inject candidate experience into Gemini's context.

---

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router, Turbopack)
- **Desktop Runtime:** Electron (TypeScript, IPC Bridge, Global Shortcuts)
- **AI Engine:** Google Gemini 2.5 Flash (`@google/genai`)
- **Styling & Typography:** Vanilla CSS / Tailwind CSS, Plus Jakarta Sans, JetBrains Mono
- **Icons:** Lucide React

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+
- Google Gemini API Key ([Get one free on Google AI Studio](https://aistudio.google.com/app/apikey))

### 2. Installation
```bash
git clone https://github.com/unofficialgupta/ZeroPrep-AI.git
cd ZeroPrep-AI
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_GEMINI_MODEL=gemini-2.5-flash
```
*(Alternatively, enter your key directly via the in-app Settings modal)*

### 4. Running the Web Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) (or your designated port) in your browser.

### 5. Running Desktop Electron App
```bash
# In terminal 1 (Next.js server):
npm run dev

# In terminal 2 (Compile & launch Electron):
npm run electron:compile
npm run electron
```

---

## ⌨️ Global Hotkeys

| Action | macOS | Windows / Linux |
| :--- | :--- | :--- |
| **Instant Screen Capture & Solve** | `⌘ + Shift + S` | `Ctrl + Shift + S` |
| **Immediate AI Answer** | `⌘ + Enter` | `Ctrl + Enter` |
| **Chat / Custom Prompt** | `⌘ + K` | `Ctrl + K` |
| **Shortcuts Cheatsheet** | `?` or `⌘ + /` | `?` or `Ctrl + /` |
| **Toggle Floating Stealth HUD** | `⌘ + \` | `Ctrl + \` |
| **Cycle History Answers** | `⌘ + ← / →` | `Ctrl + ← / →` |

---

## 📄 License
MIT License
