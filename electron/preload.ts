import { contextBridge, ipcRenderer } from 'electron';

const desktopApi = {
  isElectron: true,

  // ── HUD Window Control ─────────────────────────────────────────────────────
  toggleNativeHud: () => ipcRenderer.invoke('toggle-native-hud'),
  closeNativeHud: () => ipcRenderer.invoke('close-native-hud'),
  resizeHudWindow: (width: number, height: number) =>
    ipcRenderer.invoke('resize-hud-window', width, height),
  moveHudWindow: (deltaX: number, deltaY: number) =>
    ipcRenderer.invoke('move-hud-window', deltaX, deltaY),

  // ── Mouse Event Pass-Through (forward transparent background clicks) ──────
  setIgnoreMouseEvents: (ignore: boolean) =>
    ipcRenderer.invoke('set-hud-ignore-mouse', ignore),

  // ── Screen Capture ─────────────────────────────────────────────────────────
  getDesktopSources: () => ipcRenderer.invoke('get-desktop-sources'),

  // ── Audio Loopback Sources ─────────────────────────────────────────────────
  /** Returns [{id, name}] of all screen/window sources for audio loopback */
  getAudioSources: (): Promise<{ id: string; name: string }[]> =>
    ipcRenderer.invoke('get-audio-sources'),

  // ── Stealth Content Protection ─────────────────────────────────────────────
  setStealthProtection: (enabled: boolean) =>
    ipcRenderer.invoke('set-stealth-protection', enabled),

  // ── Device Fingerprint (for license binding) ───────────────────────────────
  getDeviceFingerprint: (): Promise<string> =>
    ipcRenderer.invoke('get-device-fingerprint'),

  // ── External Browser (for Google OAuth — Google blocks embedded webviews) ──
  openExternalUrl: (url: string): Promise<boolean> =>
    ipcRenderer.invoke('open-external-url', url),

  // ── IPC Event Listeners ────────────────────────────────────────────────────
  onTriggerScreenCapture: (callback: () => void) => {
    const handler = () => callback();
    ipcRenderer.on('trigger-screen-capture', handler);
    return () => ipcRenderer.removeListener('trigger-screen-capture', handler);
  },

  onTriggerAnswer: (callback: () => void) => {
    const handler = () => callback();
    ipcRenderer.on('trigger-generate-answer', handler);
    return () => ipcRenderer.removeListener('trigger-generate-answer', handler);
  },

  onTriggerChat: (callback: () => void) => {
    const handler = () => callback();
    ipcRenderer.on('trigger-chat', handler);
    return () => ipcRenderer.removeListener('trigger-chat', handler);
  },

  onToggleShortcuts: (callback: () => void) => {
    const handler = () => callback();
    ipcRenderer.on('toggle-shortcuts-cheatsheet', handler);
    return () => ipcRenderer.removeListener('toggle-shortcuts-cheatsheet', handler);
  },

  onToggleStealthHud: (callback: () => void) => {
    const handler = () => callback();
    ipcRenderer.on('toggle-stealth-hud', handler);
    return () => ipcRenderer.removeListener('toggle-stealth-hud', handler);
  },

  onStealthHudStatus: (callback: (isActive: boolean) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, isActive: boolean) => callback(isActive);
    ipcRenderer.on('stealth-hud-status', handler);
    return () => ipcRenderer.removeListener('stealth-hud-status', handler);
  },

  /** Fires when the app receives a zeroprep://auth/callback deep-link */
  onAuthDeepLink: (callback: (url: string) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, url: string) => callback(url);
    ipcRenderer.on('auth-deep-link', handler);
    return () => ipcRenderer.removeListener('auth-deep-link', handler);
  },
};

// Expose as both names for backwards compatibility during migration
contextBridge.exposeInMainWorld('zeroPrepDesktop', desktopApi);
contextBridge.exposeInMainWorld('parakeetDesktop', desktopApi);
