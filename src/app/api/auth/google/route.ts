/**
 * POST /api/auth/google
 *
 * Called by the Electron app after the user completes the Google OAuth flow
 * in the system browser. Receives the Google ID token and:
 *
 * 1. Verifies the token with google-auth-library
 * 2. Upserts the user in MongoDB
 * 3. Generates a new random session token
 * 4. OVERWRITES the stored token hash — this single write kills every other
 *    active session (the core single-device anti-sharing mechanism)
 * 5. Returns the raw token ONCE (never stored, never retrievable again)
 * 6. Returns the user's current license status
 */

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { License } from '@/lib/models/License';
import {
  verifyGoogleToken,
  generateSessionToken,
  hashValue,
} from '@/lib/auth';


export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();

    if (!idToken || typeof idToken !== 'string') {
      return NextResponse.json({ error: 'idToken is required' }, { status: 400 });
    }

    // 1. Verify Google token
    const profile = await verifyGoogleToken(idToken);

    await connectDB();

    // 2. Upsert user
    let user = await User.findOne({ googleId: profile.googleId });
    if (!user) {
      // First-time login — create user first, then license with the userId
      user = await User.create({
        googleId: profile.googleId,
        email: profile.email,
        name: profile.name,
        picture: profile.picture,
        currentSessionTokenHash: '',
        currentDeviceFingerprint: '',
      });

      const license = await License.create({
        userId: user._id,
        status: 'unpaid',
      });

      user.licenseId = license._id as mongoose.Types.ObjectId;
      await user.save();
    } else {
      // Returning user — update profile fields in case they changed
      user.email = profile.email;
      user.name = profile.name;
      if (profile.picture) user.picture = profile.picture;
    }

    // 3 & 4. Generate new session token and OVERWRITE stored hash
    // This single DB write immediately invalidates any other active session.
    const rawToken = generateSessionToken();
    user.currentSessionTokenHash = hashValue(rawToken);
    await user.save();

    // 5. Fetch license status
    const license = user.licenseId
      ? await License.findById(user.licenseId)
      : null;

    // 6. Return raw token once (never logged, never stored in plaintext)
    return NextResponse.json({
      success: true,
      sessionToken: rawToken,           // raw — app stores this locally
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
      license: {
        status: license?.status ?? 'unpaid',
        licenseId: license?._id?.toString() ?? null,
      },
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('[ZeroPrep /api/auth/google]', error.message);
    return NextResponse.json(
      { error: error.message || 'Authentication failed' },
      { status: 401 },
    );
  }
}
