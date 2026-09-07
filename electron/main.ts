import { app, BrowserWindow, globalShortcut, ipcMain, desktopCapturer, screen, protocol, shell } from 'electron';
import path from 'path';
import { createServer } from 'http';
import { parse } from 'url';
import crypto from 'crypto';
import os from 'os';

// ─── Dev vs. Production Detection ───────────────────────────────────────────
// electron-is-dev checks NODE_ENV and whether app is packaged
const isDev: boolean = !app.isPackaged;

// ─── Base URL: dev = local Next.js, prod = embedded standalone server ────────
let NEXT_PORT = 3001;
let BASE_URL = `http://localhost:${NEXT_PORT}`;

let mainWindow: BrowserWindow | null = null;
let stealthHUDWindow: BrowserWindow | null = null;

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

// ─── Deep-Link Protocol (zeroprep://) for Google OAuth ──────────────────────
function registerDeepLinkProtocol(): void {
  // macOS: set as default handler for zeroprep:// scheme
  if (process.platform === 'darwin') {
    app.setAsDefaultProtocolClient('zeroprep');
  }
  // Windows: handled via electron-builder nsis protocols config
}

function handleDeepLink(url: string): void {
  // url = "zeroprep://auth/callback?code=...&state=..."
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
      // Required for getDisplayMedia() audio capture in packaged app
      webSecurity: true,
    },
  });

  // Native screen capture protection — invisible in Zoom/Meet/Teams screenshares
  mainWindow.setContentProtection(true);

  mainWindow.loadURL(`${BASE_URL}/dashboard/callSessions`);

  // ── Global Hotkeys ──
  globalShortcut.register('CommandOrControl+Shift+S', () => {
    mainWindow?.webContents.send('trigger-screen-capture');
    stealthHUDWindow?.webContents.send('trigger-screen-capture');
  });

  globalShortcut.register('CommandOrControl+Return', () => {
    stealthHUDWindow?.webContents.send('trigger-generate-answer');
  });

  globalShortcut.register('CommandOrControl+/', () => {
    stealthHUDWindow?.webContents.send('toggle-shortcuts-cheatsheet');
  });

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

  // Open external links in system browser (for OAuth, docs, etc.)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

function createStealthHUD(): void {
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
    type: process.platform === 'darwin' ? 'panel' : undefined,
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

  // Float above VS Code, Zoom, Fullscreen Chrome on macOS
  if (process.platform === 'darwin') {
    stealthHUDWindow.setAlwaysOnTop(true, 'screen-saver', 1);
    stealthHUDWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  } else {
    stealthHUDWindow.setAlwaysOnTop(true);
  }

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

// ─── IPC Handlers ────────────────────────────────────────────────────────────
ipcMain.handle('toggle-native-hud', () => toggleStealthHUD());

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
  mainWindow?.setContentProtection(enabled);
  stealthHUDWindow?.setContentProtection(enabled);
  return true;
});

ipcMain.handle('get-device-fingerprint', () => {
  return getDeviceFingerprint();
});

/**
 * open-external-url
 * Renderer → opens a URL in the system browser.
 * Used for Google OAuth flow (system browser is required — Google blocks webviews).
 */
ipcMain.handle('open-external-url', (_event, url: string) => {
  shell.openExternal(url);
  return true;
});

/**
 * get-audio-sources
 * Returns a list of desktop audio sources (screens + app windows) for loopback capture.
 * The renderer uses these IDs as chromeMediaSourceId in getUserMedia constraints.
 */
ipcMain.handle('get-audio-sources', async () => {
  const sources = await desktopCapturer.getSources({
    types: ['screen', 'window'],
    thumbnailSize: { width: 0, height: 0 }, // thumbnails not needed, minimise overhead
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

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

// macOS: handle deep-link from second instance (when app is already running)
app.on('open-url', (_event, url) => {
  _event.preventDefault();
  handleDeepLink(url);
});

// Windows/Linux: second instance passes argv; parse zeroprep:// from it
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (_event, argv) => {
    const deepLink = argv.find((arg) => arg.startsWith('zeroprep://'));
    if (deepLink) handleDeepLink(deepLink);
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
