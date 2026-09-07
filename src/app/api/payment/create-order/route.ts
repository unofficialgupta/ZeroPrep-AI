/**
 * POST /api/payment/create-order
 *
 * Creates a Razorpay order for ₹100 (10000 paise).
 * Called by the Electron paywall screen when the user clicks "Pay".
 *
 * Requires: Authorization: Bearer <sessionToken>
 *
 * Flow:
 * 1. Validate session token → get user
 * 2. Check license is 'unpaid' (idempotent — if already 'active', return immediately)
 * 3. Create Razorpay order
 * 4. Save payment record to DB (status: 'created')
 * 5. Return order_id to the Electron app, which opens Razorpay checkout
 */

import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { License } from '@/lib/models/License';
import { Payment } from '@/lib/models/Payment';
import { extractBearerToken, hashValue } from '@/lib/auth';

// Lazily-initialised Razorpay client (not a singleton to avoid issues in serverless)
function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.');
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

export async function POST(req: Request) {
  try {
    const rawToken = extractBearerToken(req.headers.get('authorization'));
    if (!rawToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // 1. Validate session
    const tokenHash = hashValue(rawToken);
    const user = await User.findOne({ currentSessionTokenHash: tokenHash });
    if (!user) {
      return NextResponse.json(
        { error: 'SESSION_INVALIDATED', message: 'Session expired. Please log in again.' },
        { status: 401 },
      );
    }

    // 2. Check license
    const license = user.licenseId
      ? await License.findById(user.licenseId)
      : null;

    if (license?.status === 'active') {
      return NextResponse.json({ alreadyActive: true, status: 'active' });
    }

    // 3. Create Razorpay order
    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create({
      amount: 10000,      // ₹100 in paise
      currency: 'INR',
      receipt: `zp_${user._id.toString().slice(-8)}_${Date.now()}`,
      notes: {
        userId: user._id.toString(),
        email: user.email,
        product: 'ZeroPrep AI — Lifetime License',
      },
    });

    // 4. Save payment record
    await Payment.create({
      userId: user._id,
      razorpayOrderId: order.id,
      amount: 10000,
      currency: 'INR',
      status: 'created',
    });

    // 5. Return order details to the app
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,   // public key, safe to expose
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('[ZeroPrep /api/payment/create-order]', error.message);
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
  }
}
