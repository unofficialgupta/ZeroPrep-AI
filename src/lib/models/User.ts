import mongoose, { Schema, Document, Model } from 'mongoose';

// ─── Interface ────────────────────────────────────────────────────────────────

export interface IUser extends Document {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
  createdAt: Date;
  /**
   * SHA-256 hash of the raw session token issued on last login.
   * Overwritten on every new login — this single write invalidates
   * any other active sessions (single-device enforcement).
   */
  currentSessionTokenHash: string;
  /**
   * SHA-256 hash of the device fingerprint bound at license activation.
   * Empty until the user completes payment.
   */
  currentDeviceFingerprint: string;
  licenseId?: mongoose.Types.ObjectId;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const UserSchema = new Schema<IUser>(
  {
    googleId:                { type: String, required: true, unique: true, index: true },
    email:                   { type: String, required: true, unique: true },
    name:                    { type: String, required: true },
    picture:                 { type: String },
    currentSessionTokenHash: { type: String, required: true, default: '' },
    currentDeviceFingerprint:{ type: String, required: true, default: '' },
    licenseId:               { type: Schema.Types.ObjectId, ref: 'License' },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: false },
  },
);

// ─── Model (singleton pattern for Next.js hot-reloads) ────────────────────────

export const User: Model<IUser> =
  (mongoose.models.User as Model<IUser>) ||
  mongoose.model<IUser>('User', UserSchema);
