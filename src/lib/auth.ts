/**
 * Auth utilities for ZeroPrep AI
 *
 * - Session token generation + hashing
 * - Device fingerprint hashing
 * - Google ID token verification
 * - Request token extraction
 */

import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';

// ─── Session Token ─────────────────────────────────────────────────────────────

/**
 * Generate a cryptographically random session token (32 bytes = 64 hex chars).
 * Returned once to the Electron app; never stored in plaintext on the server.
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * One-way hash a raw token/fingerprint for safe server-side storage.
 * Uses HMAC-SHA256 with SESSION_TOKEN_SECRET so raw values are never guessable
 * from the stored hashes even if the DB is compromised.
 */
export function hashValue(raw: string): string {
  const secret = process.env.SESSION_TOKEN_SECRET;
  if (!secret) {
    // Fallback: plain SHA-256 (acceptable but not as safe — configure secret in prod)
    console.warn('[ZeroPrep] SESSION_TOKEN_SECRET not set — using plain SHA-256');
    return crypto.createHash('sha256').update(raw).digest('hex');
  }
  return crypto.createHmac('sha256', secret).update(raw).digest('hex');
}

/** Alias for readability when hashing device fingerprints */
export const hashDeviceFingerprint = hashValue;

// ─── Google ID Token Verification ─────────────────────────────────────────────

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export interface GooglePayload {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
}

/**
 * Verify a Google ID token issued by the Electron app's OAuth flow.
 * Returns the user's Google profile from the verified token claims.
 * Throws if the token is invalid, expired, or issued for the wrong client.
 */
export async function verifyGoogleToken(idToken: string): Promise<GooglePayload> {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload || !payload.sub || !payload.email) {
    throw new Error('Invalid Google token payload');
  }

  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name ?? payload.email.split('@')[0],
    picture: payload.picture,
  };
}

// ─── Request Token Extraction ──────────────────────────────────────────────────

/**
 * Extract the raw Bearer token from an Authorization header.
 * Returns null if the header is missing or malformed.
 */
export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7).trim();
  return token || null;
}

// ─── Razorpay Webhook Signature Verification ───────────────────────────────────

/**
 * Verify a Razorpay webhook signature.
 * Razorpay signs each webhook payload with HMAC-SHA256 using your webhook secret.
 * We recompute the signature and compare in constant time to prevent timing attacks.
 *
 * @param rawBody - The raw request body as a string (must NOT be JSON.parsed first)
 * @param razorpaySignature - The X-Razorpay-Signature header value
 * @returns true if the signature matches, false otherwise
 */
export function verifyRazorpayWebhookSignature(
  rawBody: string,
  razorpaySignature: string,
): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error('[ZeroPrep] RAZORPAY_WEBHOOK_SECRET not set — rejecting all webhooks');
    return false;
  }

  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  // Constant-time comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected, 'hex'),
      Buffer.from(razorpaySignature, 'hex'),
    );
  } catch {
    return false;
  }
}
