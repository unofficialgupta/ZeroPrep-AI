import { contextBridge, ipcRenderer } from 'electron';

const desktopApi = {
  isElectron: true,
  toggleNativeHud: () => ipcRenderer.invoke('toggle-native-hud'),
  getDesktopSources: () => ipcRenderer.invoke('get-desktop-sources'),
  setStealthProtection: (enabled: boolean) => ipcRenderer.invoke('set-stealth-protection', enabled),
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
    const handler = (_event: any, isActive: boolean) => callback(isActive);
    ipcRenderer.on('stealth-hud-status', handler);
    return () => ipcRenderer.removeListener('stealth-hud-status', handler);
  }
};

contextBridge.exposeInMainWorld('parakeetDesktop', desktopApi);
contextBridge.exposeInMainWorld('zeroPrepDesktop', desktopApi);
