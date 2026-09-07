/**
 * GET /api/license/status
 *
 * Called by the Electron app after login to determine the paywall state.
 * Returns the user's license status: 'unpaid' | 'active' | 'revoked'
 *
 * Requires: Authorization: Bearer <sessionToken>
 */

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { License } from '@/lib/models/License';
import { extractBearerToken, hashValue } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const rawToken = extractBearerToken(req.headers.get('authorization'));
    if (!rawToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const tokenHash = hashValue(rawToken);
    const user = await User.findOne({ currentSessionTokenHash: tokenHash });

    if (!user) {
      return NextResponse.json(
        { error: 'SESSION_INVALIDATED', message: 'Session not found. Please log in again.' },
        { status: 401 },
      );
    }

    const license = user.licenseId
      ? await License.findById(user.licenseId)
      : null;

    return NextResponse.json({
      status: license?.status ?? 'unpaid',
      licenseId: license?._id?.toString() ?? null,
      userId: user._id.toString(),
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('[ZeroPrep /api/license/status]', error.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
