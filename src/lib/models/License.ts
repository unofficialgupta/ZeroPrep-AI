import mongoose, { Schema, Document, Model } from 'mongoose';

export type LicenseStatus = 'unpaid' | 'active' | 'revoked';

export interface ILicense extends Document {
  userId: mongoose.Types.ObjectId;
  status: LicenseStatus;
  /** Razorpay payment ID — set only after webhook confirms payment.captured */
  paymentId?: string;
  activatedAt?: Date;
  /**
   * SHA-256 hash of the device fingerprint captured at the moment of payment.
   * All subsequent /session/validate calls must match this fingerprint.
   * This prevents the license from being moved to a different machine.
   */
  deviceFingerprint: string;
}

const LicenseSchema = new Schema<ILicense>(
  {
    userId:            { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status:            { type: String, enum: ['unpaid', 'active', 'revoked'], default: 'unpaid' },
    paymentId:         { type: String },
    activatedAt:       { type: Date },
    deviceFingerprint: { type: String, default: '' },
  },
  {
    timestamps: true,
  },
);

export const License: Model<ILicense> =
  (mongoose.models.License as Model<ILicense>) ||
  mongoose.model<ILicense>('License', LicenseSchema);
