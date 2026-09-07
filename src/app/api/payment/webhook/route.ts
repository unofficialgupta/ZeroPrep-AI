/**
 * POST /api/payment/webhook
 *
 * Razorpay webhook handler. Called by Razorpay when payment.captured fires.
 *
 * SECURITY CRITICAL:
 * - We MUST read the raw request body (not parsed JSON) to verify the signature.
 * - We reject EVERY request that does not pass HMAC-SHA256 signature verification.
 * - The license is NEVER activated by a client-side call — only by this verified webhook.
 *
 * Flow:
 * 1. Read raw body + X-Razorpay-Signature header
 * 2. Verify HMAC-SHA256 signature against RAZORPAY_WEBHOOK_SECRET
 * 3. On payment.captured event:
 *    a. Find payment record by razorpay_order_id
 *    b. Mark payment captured + set verifiedAt
 *    c. Activate the user's license
 *    d. Bind the device fingerprint from webhook payload or request header
 *
 * Configure at Razorpay Dashboard → Settings → Webhooks:
 *   URL: https://yourdomain.com/api/payment/webhook
 *   Events: payment.captured
 *   Secret: value of RAZORPAY_WEBHOOK_SECRET env var
 */

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { License } from '@/lib/models/License';
import { Payment } from '@/lib/models/Payment';
import { verifyRazorpayWebhookSignature, hashDeviceFingerprint } from '@/lib/auth';

// Next.js 15: to access raw body in Route Handlers, disable body parsing
export const runtime = 'nodejs';

export async function POST(req: Request) {
  let rawBody = '';

  try {
    // 1. Read raw body (must be done BEFORE any JSON parsing)
    rawBody = await req.text();

    // 2. Verify Razorpay signature
    const razorpaySignature = req.headers.get('x-razorpay-signature') ?? '';
    const isValid = verifyRazorpayWebhookSignature(rawBody, razorpaySignature);

    if (!isValid) {
      console.warn('[ZeroPrep Webhook] Signature verification FAILED — rejecting request');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // 3. Parse verified payload
    const payload = JSON.parse(rawBody);
    const event: string = payload?.event ?? '';

    // Only handle payment.captured
    if (event !== 'payment.captured') {
      // Acknowledge other events without action
      return NextResponse.json({ received: true });
    }

    const paymentEntity = payload?.payload?.payment?.entity;
    if (!paymentEntity) {
      return NextResponse.json({ error: 'Malformed payload' }, { status: 400 });
    }

    const { order_id: orderId, id: razorpayPaymentId } = paymentEntity;

    await connectDB();

    // 4a. Find payment record
    const payment = await Payment.findOne({ razorpayOrderId: orderId });
    if (!payment) {
      console.error('[ZeroPrep Webhook] Payment record not found for orderId:', orderId);
      // Return 200 anyway (Razorpay retries on non-200; not-found shouldn't cause retries)
      return NextResponse.json({ received: true });
    }

    if (payment.status === 'captured') {
      // Idempotent — already processed
      return NextResponse.json({ received: true, alreadyProcessed: true });
    }

    // 4b. Mark payment captured
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.status = 'captured';
    payment.verifiedAt = new Date();
    await payment.save();

    // 4c & 4d. Activate license + bind device fingerprint
    const user = await User.findById(payment.userId);
    if (user) {
      const license = user.licenseId
        ? await License.findById(user.licenseId)
        : null;

      if (license) {
        license.status = 'active';
        license.paymentId = razorpayPaymentId;
        license.activatedAt = new Date();

        // Device fingerprint is passed from the Electron app via the notes field
        // or a custom header. We hash it before storing.
        const rawFingerprint =
          paymentEntity?.notes?.deviceFingerprint ??
          req.headers.get('x-device-fingerprint') ??
          '';

        if (rawFingerprint) {
          const fingerprintHash = hashDeviceFingerprint(rawFingerprint);
          license.deviceFingerprint = fingerprintHash;
          user.currentDeviceFingerprint = fingerprintHash;
          await user.save();
        }

        await license.save();
        console.log(`[ZeroPrep Webhook] License activated for user ${user.email}`);
      }
    }

    return NextResponse.json({ received: true, activated: true });
  } catch (err: unknown) {
    const error = err as Error;
    console.error('[ZeroPrep Webhook] Error:', error.message);
    // Return 500 so Razorpay retries the webhook
    return NextResponse.json({ error: 'Webhook processing error' }, { status: 500 });
  }
}
