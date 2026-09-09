import { app, BrowserWindow, globalShortcut, ipcMain, desktopCapturer, screen, protocol, shell } from 'electron';
import path from 'path';
import { createServer } from 'http';
import crypto from 'crypto';
import os from 'os';

// ─── Single-Instance Enforcement ─────────────────────────────────────────────
// Must be evaluated BEFORE app.whenReady() to prevent multiple server / window spawns
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}

// ─── Dev vs. Production Detection ───────────────────────────────────────────
const isDev: boolean = !app.isPackaged;

// ─── Base URL: dev = local Next.js, prod = embedded standalone server ────────
let NEXT_PORT = 3001;
let BASE_URL = `http://localhost:${NEXT_PORT}`;

// Allow overriding start URL from environment
if (process.env.ELECTRON_START_URL) {
  try {
    const parsed = new URL(process.env.ELECTRON_START_URL);
    BASE_URL = `${parsed.protocol}//${parsed.host}`;
  } catch {}
}

let mainWindow: BrowserWindow | null = null;
let stealthHUDWindow: BrowserWindow | null = null;
let persistedStealthProtection: boolean = true;

// ─── Embedded Next.js Standalone Server (Production only) ───────────────────
async function startNextServer(): Promise<void> {
  if (isDev) return; // dev mode uses `next dev` externally

  try {
    // next.js standalone server entrypoint is .next/standalone/server.js
    const nextServerPath = path.join(process.resourcesPath, '.next/standalone/server.js');
    const nextServer = require(nextServerPath);

    // Find an available port
    NEXT_PORT = await findFreePort(3001);
    BASE_URL = `http://localhost:${NEXT_PORT}`;

    await new Promise<void>((resolve, reject) => {
      const server = nextServer.default || nextServer;
      if (typeof server.listen === 'function') {
        server.listen(NEXT_PORT, () => resolve());
      } else {
        // Some standalone builds export a handler; wrap in http server
        const httpServer = createServer(server);
        httpServer.listen(NEXT_PORT, () => resolve());
        httpServer.on('error', reject);
      }
    });

    console.log(`[ZeroPrep] Embedded Next.js server started on ${BASE_URL}`);
  } catch (err) {
    console.error('[ZeroPrep] Failed to start embedded Next.js server:', err);
  }
}

function findFreePort(preferred: number): Promise<number> {
  return new Promise((resolve) => {
    const net = require('net');
    const server = net.createServer();
    server.listen(preferred, () => {
      const port = (server.address() as any).port;
      server.close(() => resolve(port));
    });
    server.on('error', () => {
      // preferred port taken — let OS pick
      const fallback = net.createServer();
      fallback.listen(0, () => {
        const port = (fallback.address() as any).port;
        fallback.close(() => resolve(port));
      });
    });
  });
}

// ─── Resilient URL Loader (handles dev server startup lag) ──────────────────
async function loadURLWithRetry(win: BrowserWindow, url: string, maxRetries = 8): Promise<void> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await win.loadURL(url);
      return;
    } catch (err) {
      if (attempt === maxRetries) {
        console.error(`[ZeroPrep] Failed to load ${url} after ${maxRetries} attempts:`, err);
        return;
      }
      // Wait before retrying (exponential-ish backoff: 500ms, 1000ms...)
      await new Promise((r) => setTimeout(r, Math.min(600 * attempt, 2500)));
    }
  }
}

// ─── Deep-Link Protocol (zeroprep://) for Google OAuth ──────────────────────
function registerDeepLinkProtocol(): void {
  // macOS: set as default handler for zeroprep:// scheme
  if (process.platform === 'darwin') {
    app.setAsDefaultProtocolClient('zeroprep');
  }
  // Windows: handled via electron-builder nsis protocols config
}

function handleDeepLink(url: string): void {
  console.log('[ZeroPrep] Deep link received:', url);
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('auth-deep-link', url);
    mainWindow.show();
    mainWindow.focus();
  }
}

// ─── Device Fingerprint (stable hash of hardware + OS for license binding) ───
function getDeviceFingerprint(): string {
  const cpus = os.cpus();
  const raw = [
    os.hostname(),
    os.platform(),
    os.arch(),
    os.release(),
    cpus?.[0]?.model ?? '',
    cpus?.length?.toString() ?? '',
    os.totalmem().toString(),
  ].join('|');
  return crypto.createHash('sha256').update(raw).digest('hex');
}

// ─── Window Factories ────────────────────────────────────────────────────────
function createMainWindow(): void {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.show();
    mainWindow.focus();
    return;
  }

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
      webSecurity: true,
    },
  });

  // Native screen capture protection — invisible in Zoom/Meet/Teams screenshares
  mainWindow.setContentProtection(persistedStealthProtection);

  loadURLWithRetry(mainWindow, `${BASE_URL}/dashboard/callSessions`);

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (stealthHUDWindow && !stealthHUDWindow.isDestroyed()) {
      stealthHUDWindow.close();
      stealthHUDWindow = null;
    }
  });

  // Open external links in system browser (for OAuth, docs, etc.)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

function createStealthHUD(autoShow: boolean = false): void {
  if (stealthHUDWindow && !stealthHUDWindow.isDestroyed()) {
    if (autoShow && !stealthHUDWindow.isVisible()) {
      if (process.platform === 'darwin') {
        stealthHUDWindow.showInactive();
      } else {
        stealthHUDWindow.show();
      }
      mainWindow?.webContents.send('stealth-hud-status', true);
      stealthHUDWindow.webContents.send('stealth-hud-status', true);
    }
    return;
  }

  const primaryDisplay = screen.getPrimaryDisplay();
  const { width } = primaryDisplay.workAreaSize;

  stealthHUDWindow = new BrowserWindow({
    title: 'ZeroPrep AI HUD',
    width: 520,
    height: 580,
    minWidth: 460,
    minHeight: 48,
    x: Math.max(20, width - 540),
    y: 60, // Comfortable upper-right HUD position
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    hasShadow: false,
    skipTaskbar: true,
    resizable: false,
    focusable: true,
    show: autoShow,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.platform === 'darwin') {
    stealthHUDWindow.setAlwaysOnTop(true, 'floating');
    stealthHUDWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  } else {
    stealthHUDWindow.setAlwaysOnTop(true);
  }

  stealthHUDWindow.setContentProtection(persistedStealthProtection);
  loadURLWithRetry(stealthHUDWindow, `${BASE_URL}/overlay`);

  stealthHUDWindow.on('closed', () => {
    stealthHUDWindow = null;
    mainWindow?.webContents.send('stealth-hud-status', false);
  });

  if (autoShow) {
    mainWindow?.webContents.send('stealth-hud-status', true);
  }
}

function toggleStealthHUD(): boolean {
  if (!stealthHUDWindow || stealthHUDWindow.isDestroyed()) {
    createStealthHUD(true);
    return true;
  } else if (stealthHUDWindow.isVisible()) {
    stealthHUDWindow.hide();
    mainWindow?.webContents.send('stealth-hud-status', false);
    stealthHUDWindow.webContents.send('stealth-hud-status', false);
    return false;
  } else {
    if (process.platform === 'darwin') {
      stealthHUDWindow.showInactive();
    } else {
      stealthHUDWindow.show();
    }
    mainWindow?.webContents.send('stealth-hud-status', true);
    stealthHUDWindow.webContents.send('stealth-hud-status', true);
    return true;
  }
}

// ─── Global Hotkeys System ───────────────────────────────────────────────────
function registerGlobalShortcuts(): void {
  globalShortcut.unregisterAll();

  const safeRegister = (accelerator: string, callback: () => void) => {
    try {
      const ok = globalShortcut.register(accelerator, callback);
      if (ok) {
        console.log(`[ZeroPrep] Registered global hotkey: ${accelerator}`);
      } else {
        console.warn(`[ZeroPrep] Could not register global hotkey: ${accelerator}`);
      }
    } catch (err) {
      console.warn(`[ZeroPrep] Error registering global hotkey ${accelerator}:`, err);
    }
  };

  // 1. Toggle HUD Show / Hide
  safeRegister('CommandOrControl+\\', toggleStealthHUD);
  safeRegister('CommandOrControl+Shift+H', toggleStealthHUD);

  // 2. Instant Screen Capture
  const triggerCapture = () => {
    if (!stealthHUDWindow || stealthHUDWindow.isDestroyed()) {
      createStealthHUD(true);
      stealthHUDWindow?.webContents.once('did-finish-load', () => {
        stealthHUDWindow?.webContents.send('trigger-screen-capture');
      });
      return;
    }
    if (!stealthHUDWindow.isVisible()) {
      if (process.platform === 'darwin') {
        stealthHUDWindow.showInactive();
      } else {
        stealthHUDWindow.show();
      }
      mainWindow?.webContents.send('stealth-hud-status', true);
      stealthHUDWindow.webContents.send('stealth-hud-status', true);
    }
    stealthHUDWindow.webContents.send('trigger-screen-capture');
    mainWindow?.webContents.send('trigger-screen-capture');
  };
  safeRegister('CommandOrControl+Shift+S', triggerCapture);
  safeRegister('CommandOrControl+Shift+Return', triggerCapture);
  safeRegister('CommandOrControl+Shift+Enter', triggerCapture);

  // 3. AI Answer Generation
  const triggerAnswer = () => {
    if (!stealthHUDWindow || stealthHUDWindow.isDestroyed()) {
      createStealthHUD(true);
      stealthHUDWindow?.webContents.once('did-finish-load', () => {
        stealthHUDWindow?.webContents.send('trigger-generate-answer');
      });
      return;
    }
    if (!stealthHUDWindow.isVisible()) {
      if (process.platform === 'darwin') {
        stealthHUDWindow.showInactive();
      } else {
        stealthHUDWindow.show();
      }
      mainWindow?.webContents.send('stealth-hud-status', true);
      stealthHUDWindow.webContents.send('stealth-hud-status', true);
    }
    stealthHUDWindow.webContents.send('trigger-generate-answer');
    mainWindow?.webContents.send('trigger-generate-answer');
  };
  safeRegister('CommandOrControl+Return', triggerAnswer);
  safeRegister('CommandOrControl+Enter', triggerAnswer);
  safeRegister('CommandOrControl+Alt+Return', triggerAnswer);
  safeRegister('CommandOrControl+Alt+Enter', triggerAnswer);

  // 4. Quick Chat Prompt
  const triggerChat = () => {
    if (!stealthHUDWindow || stealthHUDWindow.isDestroyed()) {
      createStealthHUD(true);
      stealthHUDWindow?.webContents.once('did-finish-load', () => {
        stealthHUDWindow?.focus();
        stealthHUDWindow?.webContents.send('trigger-chat');
      });
      return;
    }
    if (!stealthHUDWindow.isVisible()) {
      if (process.platform === 'darwin') {
        stealthHUDWindow.show();
      } else {
        stealthHUDWindow.show();
      }
      mainWindow?.webContents.send('stealth-hud-status', true);
      stealthHUDWindow.webContents.send('stealth-hud-status', true);
    }
    stealthHUDWindow.focus();
    stealthHUDWindow.webContents.send('trigger-chat');
  };
  safeRegister('CommandOrControl+Shift+K', triggerChat);
  safeRegister('CommandOrControl+K', triggerChat);

  // 5. Shortcuts Cheatsheet
  const triggerShortcuts = () => {
    if (!stealthHUDWindow || stealthHUDWindow.isDestroyed()) {
      createStealthHUD(true);
      stealthHUDWindow?.webContents.once('did-finish-load', () => {
        stealthHUDWindow?.webContents.send('toggle-shortcuts-cheatsheet');
      });
      return;
    }
    if (!stealthHUDWindow.isVisible()) {
      if (process.platform === 'darwin') {
        stealthHUDWindow.showInactive();
      } else {
        stealthHUDWindow.show();
      }
      mainWindow?.webContents.send('stealth-hud-status', true);
      stealthHUDWindow.webContents.send('stealth-hud-status', true);
    }
    stealthHUDWindow.webContents.send('toggle-shortcuts-cheatsheet');
  };
  safeRegister('CommandOrControl+/', triggerShortcuts);
  safeRegister('CommandOrControl+Alt+/', triggerShortcuts);

  // 6. Window Movement Hotkeys (Command/Ctrl + Alt + Arrow Keys)
  const moveWindow = (dx: number, dy: number) => {
    if (stealthHUDWindow && !stealthHUDWindow.isDestroyed()) {
      const [currX, currY] = stealthHUDWindow.getPosition();
      stealthHUDWindow.setPosition(Math.round(currX + dx), Math.round(currY + dy));
    }
  };
  safeRegister('CommandOrControl+Alt+Up', () => moveWindow(0, -60));
  safeRegister('CommandOrControl+Alt+Down', () => moveWindow(0, 60));
  safeRegister('CommandOrControl+Alt+Left', () => moveWindow(-60, 0));
  safeRegister('CommandOrControl+Alt+Right', () => moveWindow(60, 0));

  // Snap to screen corners (Command/Ctrl + Alt + Number)
  const snapWindow = (corner: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left') => {
    if (!stealthHUDWindow || stealthHUDWindow.isDestroyed()) return;
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    const [winW, winH] = stealthHUDWindow.getSize();
    let x = Math.max(20, width - winW - 20);
    let y = 60;
    if (corner === 'top-left') {
      x = 20;
      y = 60;
    } else if (corner === 'bottom-right') {
      x = Math.max(20, width - winW - 20);
      y = Math.max(60, height - winH - 20);
    } else if (corner === 'bottom-left') {
      x = 20;
      y = Math.max(60, height - winH - 20);
    }
    stealthHUDWindow.setPosition(Math.round(x), Math.round(y));
  };
  safeRegister('CommandOrControl+Alt+9', () => snapWindow('top-right'));
  safeRegister('CommandOrControl+Alt+7', () => snapWindow('top-left'));
  safeRegister('CommandOrControl+Alt+3', () => snapWindow('bottom-right'));
  safeRegister('CommandOrControl+Alt+1', () => snapWindow('bottom-left'));
}

// ─── IPC Handlers ────────────────────────────────────────────────────────────
ipcMain.handle('toggle-native-hud', () => toggleStealthHUD());

ipcMain.handle('close-native-hud', () => {
  if (stealthHUDWindow && !stealthHUDWindow.isDestroyed()) {
    stealthHUDWindow.hide();
    mainWindow?.webContents.send('stealth-hud-status', false);
    stealthHUDWindow.webContents.send('stealth-hud-status', false);
  }
  return true;
});

// Dynamic HUD window resizing to match expanded / collapsed state
ipcMain.handle('resize-hud-window', (_event, width: number, height: number) => {
  if (stealthHUDWindow && !stealthHUDWindow.isDestroyed()) {
    stealthHUDWindow.setSize(Math.round(width), Math.round(height));
  }
  return true;
});

// Move HUD window smoothly by delta (mouse drag fallback)
ipcMain.handle('move-hud-window', (_event, deltaX: number, deltaY: number) => {
  if (stealthHUDWindow && !stealthHUDWindow.isDestroyed()) {
    const [currX, currY] = stealthHUDWindow.getPosition();
    stealthHUDWindow.setPosition(Math.round(currX + deltaX), Math.round(currY + deltaY));
  }
  return true;
});

// Pass-through mouse events when hovering over transparent/empty canvas
ipcMain.handle('set-hud-ignore-mouse', (_event, ignore: boolean) => {
  if (stealthHUDWindow && !stealthHUDWindow.isDestroyed()) {
    try {
      stealthHUDWindow.setIgnoreMouseEvents(ignore, { forward: true });
    } catch {}
  }
  return true;
});

ipcMain.handle('get-desktop-sources', async () => {
  const sources = await desktopCapturer.getSources({
    types: ['screen', 'window'],
    thumbnailSize: { width: 1920, height: 1080 },
    fetchWindowIcons: false,
  });
  return sources.map((s) => ({
    id: s.id,
    name: s.name,
    thumbnail: s.thumbnail.toDataURL(),
  }));
});

ipcMain.handle('set-stealth-protection', (_event, enabled: boolean) => {
  persistedStealthProtection = enabled;
  mainWindow?.setContentProtection(enabled);
  stealthHUDWindow?.setContentProtection(enabled);
  return true;
});

ipcMain.handle('get-device-fingerprint', () => {
  return getDeviceFingerprint();
});

ipcMain.handle('open-external-url', (_event, url: string) => {
  shell.openExternal(url);
  return true;
});

ipcMain.handle('get-audio-sources', async () => {
  const sources = await desktopCapturer.getSources({
    types: ['screen', 'window'],
    thumbnailSize: { width: 0, height: 0 },
    fetchWindowIcons: false,
  });
  return sources.map((s) => ({
    id: s.id,
    name: s.name,
  }));
});

// ─── App Lifecycle ────────────────────────────────────────────────────────────
app.whenReady().then(async () => {
  registerDeepLinkProtocol();
  await startNextServer();
  createMainWindow();
  createStealthHUD(false); // Pre-warm HUD in memory for instant hotkey response
  registerGlobalShortcuts();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('second-instance', (_event, argv) => {
  const deepLink = argv.find((arg) => arg.startsWith('zeroprep://'));
  if (deepLink) handleDeepLink(deepLink);
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

// macOS: handle deep-link from second instance (when app is already running)
app.on('open-url', (_event, url) => {
  _event.preventDefault();
  handleDeepLink(url);
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
