import { app, BrowserWindow, globalShortcut, ipcMain, desktopCapturer, screen } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow | null = null;
let stealthHUDWindow: BrowserWindow | null = null;

const BASE_URL = process.env.ELECTRON_START_URL || 'http://localhost:3001';

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: 'ZeroPrep AI - Real-Time Copilot',
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: '#090d16',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Enable native screen capture protection so Zoom/Meet won't broadcast this overlay
  mainWindow.setContentProtection(true);

  mainWindow.loadURL(`${BASE_URL}/dashboard/callSessions`);

  // Register Global Hotkey for instant Screen Capture across the entire OS (⌘+⇧+S or Ctrl+Shift+S)
  globalShortcut.register('CommandOrControl+Shift+S', () => {
    mainWindow?.webContents.send('trigger-screen-capture');
    stealthHUDWindow?.webContents.send('trigger-screen-capture');
  });

  // Register Global Hotkey for Triggering Answer (⌘+Enter or Ctrl+Enter)
  globalShortcut.register('CommandOrControl+Return', () => {
    stealthHUDWindow?.webContents.send('trigger-generate-answer');
  });

  // Register Global Hotkey for Shortcuts Cheatsheet (⌘+/ or Ctrl+/)
  globalShortcut.register('CommandOrControl+/', () => {
    stealthHUDWindow?.webContents.send('toggle-shortcuts-cheatsheet');
  });

  // Register Global Hotkey for toggling Stealth HUD system-wide (⌘+\ or Ctrl+\)
  globalShortcut.register('CommandOrControl+\\', () => {
    toggleStealthHUD();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (stealthHUDWindow) {
      stealthHUDWindow.close();
      stealthHUDWindow = null;
    }
  });
}

function createStealthHUD() {
  if (stealthHUDWindow && !stealthHUDWindow.isDestroyed()) {
    stealthHUDWindow.show();
    stealthHUDWindow.focus();
    return;
  }

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  stealthHUDWindow = new BrowserWindow({
    title: 'ZeroPrep AI HUD',
    width: 540,
    height: 690,
    x: Math.max(10, width - 560),
    y: Math.max(10, height - 710),
    alwaysOnTop: true,
    type: process.platform === 'darwin' ? 'panel' : undefined, // macOS NSPanel: floats over all apps even when inactive
    frame: false,
    transparent: true,
    hasShadow: true,
    skipTaskbar: true,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Floating behavior: floats above VS Code, Zoom, Fullscreen Chrome
  if (process.platform === 'darwin') {
    stealthHUDWindow.setAlwaysOnTop(true, 'screen-saver', 1);
    stealthHUDWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  } else {
    // Windows / Linux topmost
    stealthHUDWindow.setAlwaysOnTop(true);
  }

  // Native content protection (invisible in Zoom / Google Meet / Teams screenshares on Windows & Mac)
  stealthHUDWindow.setContentProtection(true);

  stealthHUDWindow.loadURL(`${BASE_URL}/overlay`);

  stealthHUDWindow.on('closed', () => {
    stealthHUDWindow = null;
    mainWindow?.webContents.send('stealth-hud-status', false);
  });

  mainWindow?.webContents.send('stealth-hud-status', true);
}

function toggleStealthHUD(): boolean {
  if (!stealthHUDWindow || stealthHUDWindow.isDestroyed()) {
    createStealthHUD();
    return true;
  } else if (stealthHUDWindow.isVisible()) {
    stealthHUDWindow.hide();
    mainWindow?.webContents.send('stealth-hud-status', false);
    return false;
  } else {
    stealthHUDWindow.show();
    mainWindow?.webContents.send('stealth-hud-status', true);
    return true;
  }
}

// IPC Handlers
ipcMain.handle('toggle-native-hud', () => {
  return toggleStealthHUD();
});

ipcMain.handle('get-desktop-sources', async () => {
  const sources = await desktopCapturer.getSources({
    types: ['screen', 'window'],
    thumbnailSize: { width: 1920, height: 1080 }
  });
  return sources.map(s => ({
    id: s.id,
    name: s.name,
    thumbnail: s.thumbnail.toDataURL()
  }));
});

ipcMain.handle('set-stealth-protection', (_event, enabled: boolean) => {
  mainWindow?.setContentProtection(enabled);
  stealthHUDWindow?.setContentProtection(enabled);
  return true;
});

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
