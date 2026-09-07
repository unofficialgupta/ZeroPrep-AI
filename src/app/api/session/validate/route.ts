/**
 * POST /api/session/validate
 *
 * Called by the Electron app on every sensitive action (overlay launch,
 * screen capture, Gemini query) to ensure the session and device are still valid.
 *
 * TWO INDEPENDENT CHECKS:
 *
 * Check 1 — Session Token:
 *   Rejects if the presented token hash doesn't match the server-stored hash.
 *   This catches concurrent logins — when the user logs in from device B,
 *   the token is overwritten and device A's next call here will fail.
 *   Error code: SESSION_INVALIDATED
 *   Copy: "This account was logged in on another device."
 *
 * Check 2 — Device Fingerprint (only for active licenses):
 *   Rejects if the presented fingerprint doesn't match the one stored at
 *   license activation. This prevents the paid license from being moved
 *   to a different machine.
 *   Error code: DEVICE_MISMATCH
 *   Copy: "This license is bound to a different device."
 *
 * Request body:
 *   { sessionToken: string, deviceFingerprint: string }
 */

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { License } from '@/lib/models/License';
import { hashValue, hashDeviceFingerprint } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { sessionToken, deviceFingerprint } = await req.json();

    if (!sessionToken) {
      return NextResponse.json({ error: 'SESSION_INVALIDATED', valid: false }, { status: 401 });
    }

    await connectDB();

    // ── Check 1: Session Token ─────────────────────────────────────────────
    const tokenHash = hashValue(sessionToken);
    const user = await User.findOne({ currentSessionTokenHash: tokenHash });

    if (!user) {
      return NextResponse.json(
        {
          valid: false,
          error: 'SESSION_INVALIDATED',
          message: 'This account was logged in on another device. Log in here to reclaim access.',
        },
        { status: 401 },
      );
    }

    // ── Fetch license ──────────────────────────────────────────────────────
    const license = user.licenseId
      ? await License.findById(user.licenseId)
      : null;

    // ── Check 2: Device Fingerprint (only enforced for active licenses) ────
    if (license?.status === 'active' && deviceFingerprint) {
      const submittedHash = hashDeviceFingerprint(deviceFingerprint);
      const storedHash = license.deviceFingerprint;

      // Only enforce if a device fingerprint was actually bound at activation
      if (storedHash && storedHash !== submittedHash) {
        return NextResponse.json(
          {
            valid: false,
            error: 'DEVICE_MISMATCH',
            message: 'This license is activated on a different device. Contact support to transfer your license.',
          },
          { status: 403 },
        );
      }
    }

    return NextResponse.json({
      valid: true,
      licenseStatus: license?.status ?? 'unpaid',
      userId: user._id.toString(),
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('[ZeroPrep /api/session/validate]', error.message);
    return NextResponse.json({ error: 'Internal server error', valid: false }, { status: 500 });
  }
}
