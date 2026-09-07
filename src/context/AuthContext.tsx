'use client';

/**
 * AuthContext
 *
 * Manages user authentication state, license status, and session token
 * throughout the Electron app. Reads from / writes to localStorage as
 * the local persistence layer (token is never sent to any 3rd party).
 *
 * Flow:
 *   1. On mount: read stored token + device fingerprint from localStorage
 *   2. Call /api/license/status to check if the session is still valid
 *   3. Expose login() — triggers Electron IPC to open Google OAuth in system browser
 *   4. On OAuth callback (deep-link): call /api/auth/google, store token
 *   5. Expose refreshLicense() — polls /api/license/status after payment
 *   6. Expose logout() — clears local state + localStorage
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type LicenseStatus = 'unpaid' | 'active' | 'revoked' | 'unknown';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export type SessionError = 'SESSION_INVALIDATED' | 'DEVICE_MISMATCH' | null;

interface AuthContextType {
  user: AuthUser | null;
  licenseStatus: LicenseStatus;
  sessionToken: string | null;
  isLoading: boolean;
  sessionError: SessionError;
  login: () => void;
  logout: () => void;
  refreshLicense: () => Promise<void>;
  validateSession: () => Promise<boolean>;
}

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const STORAGE = {
  TOKEN:        'zeroprep_session_token',
  USER:         'zeroprep_user',
  LICENSE:      'zeroprep_license_status',
} as const;

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,          setUser]          = useState<AuthUser | null>(null);
  const [licenseStatus, setLicenseStatus] = useState<LicenseStatus>('unknown');
  const [sessionToken,  setSessionToken]  = useState<string | null>(null);
  const [isLoading,     setIsLoading]     = useState(true);
  const [sessionError,  setSessionError]  = useState<SessionError>(null);

  // Ref for periodic session validation (every 60s while app is open)
  const validationInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const getDesktop = () =>
    typeof window !== 'undefined'
      ? ((window as any).zeroPrepDesktop ?? (window as any).parakeetDesktop)
      : null;

  const safeGet = (key: string): string | null => {
    try { return localStorage.getItem(key); } catch { return null; }
  };
  const safeSet = (key: string, val: string) => {
    try { localStorage.setItem(key, val); } catch {}
  };
  const safeRemove = (...keys: string[]) => {
    try { keys.forEach((k) => localStorage.removeItem(k)); } catch {}
  };

  // ── Session Validation (called periodically + on sensitive actions) ─────────

  const validateSession = useCallback(async (): Promise<boolean> => {
    const token = safeGet(STORAGE.TOKEN);
    if (!token) return false;

    const desktop = getDesktop();
    const deviceFingerprint = desktop?.getDeviceFingerprint
      ? await desktop.getDeviceFingerprint()
      : '';

    try {
      const res = await fetch('/api/session/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken: token, deviceFingerprint }),
      });
      const data = await res.json();

      if (!data.valid) {
        const errCode = (data.error as SessionError) ?? 'SESSION_INVALIDATED';
        setSessionError(errCode);
        logout();
        return false;
      }

      setLicenseStatus(data.licenseStatus ?? 'unpaid');
      safeSet(STORAGE.LICENSE, data.licenseStatus ?? 'unpaid');
      return true;
    } catch {
      return false; // network error — don't log out, just fail silently
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Refresh License Status ─────────────────────────────────────────────────

  const refreshLicense = useCallback(async () => {
    const token = safeGet(STORAGE.TOKEN);
    if (!token) return;

    try {
      const res = await fetch('/api/license/status', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.status) {
        setLicenseStatus(data.status);
        safeSet(STORAGE.LICENSE, data.status);
      }
    } catch {}
  }, []);

  // ── Login (opens system browser for Google OAuth) ──────────────────────────

  const login = useCallback(() => {
    const desktop = getDesktop();
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
      console.error('[ZeroPrep Auth] NEXT_PUBLIC_GOOGLE_CLIENT_ID not set');
      return;
    }

    const redirectUri = 'zeroprep://auth/callback';
    const scope = 'openid email profile';
    const url =
      `https://accounts.google.com/o/oauth2/v2/auth` +
      `?client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=token id_token` +
      `&scope=${encodeURIComponent(scope)}` +
      `&nonce=${Math.random().toString(36).slice(2)}`;

    if (desktop?.openExternalUrl) {
      desktop.openExternalUrl(url);
    } else {
      window.open(url, '_blank');
    }
  }, []);

  // ── Handle Deep-link Callback from Google OAuth ────────────────────────────

  const handleAuthCallback = useCallback(async (deepLinkUrl: string) => {
    try {
      // Parse the id_token from the URL fragment
      const url = new URL(deepLinkUrl.replace('zeroprep://', 'https://zeroprep.ai/'));
      const params = new URLSearchParams(url.hash.slice(1) || url.search.slice(1));
      const idToken = params.get('id_token');

      if (!idToken) {
        console.error('[ZeroPrep Auth] No id_token in callback URL');
        return;
      }

      setIsLoading(true);
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error);

      // Store token + user locally
      safeSet(STORAGE.TOKEN,   data.sessionToken);
      safeSet(STORAGE.USER,    JSON.stringify(data.user));
      safeSet(STORAGE.LICENSE, data.license.status);

      setSessionToken(data.sessionToken);
      setUser(data.user);
      setLicenseStatus(data.license.status ?? 'unpaid');
      setSessionError(null);
    } catch (err) {
      console.error('[ZeroPrep Auth] OAuth callback failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Logout ─────────────────────────────────────────────────────────────────

  const logout = useCallback(() => {
    safeRemove(STORAGE.TOKEN, STORAGE.USER, STORAGE.LICENSE);
    setUser(null);
    setSessionToken(null);
    setLicenseStatus('unknown');
    if (validationInterval.current) {
      clearInterval(validationInterval.current);
      validationInterval.current = null;
    }
  }, []);

  // ── Bootstrap on mount ─────────────────────────────────────────────────────

  useEffect(() => {
    const init = async () => {
      const storedToken = safeGet(STORAGE.TOKEN);
      const storedUser  = safeGet(STORAGE.USER);
      const storedLicense = safeGet(STORAGE.LICENSE);

      if (storedToken && storedUser) {
        setSessionToken(storedToken);
        setUser(JSON.parse(storedUser));
        setLicenseStatus((storedLicense as LicenseStatus) ?? 'unknown');

        // Validate with server
        await refreshLicense();
      }

      setIsLoading(false);
    };

    init();

    // Listen for deep-link callbacks from Electron (Google OAuth)
    const desktop = getDesktop();
    const cleanup = desktop?.onAuthDeepLink?.(handleAuthCallback);

    // Periodic session validation every 60 seconds
    validationInterval.current = setInterval(validateSession, 60_000);

    return () => {
      cleanup?.();
      if (validationInterval.current) clearInterval(validationInterval.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        licenseStatus,
        sessionToken,
        isLoading,
        sessionError,
        login,
        logout,
        refreshLicense,
        validateSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
