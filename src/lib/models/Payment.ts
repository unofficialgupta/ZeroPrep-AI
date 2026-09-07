import mongoose, { Schema, Document, Model } from 'mongoose';

export type PaymentStatus = 'created' | 'captured' | 'failed';

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  /** Amount in paise. ₹100 = 10000 paise */
  amount: number;
  currency: string;
  status: PaymentStatus;
  /** Set by the webhook handler after signature verification — never by the client */
  verifiedAt?: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    userId:             { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    razorpayOrderId:    { type: String, required: true, unique: true },
    razorpayPaymentId:  { type: String },
    amount:             { type: Number, required: true, default: 10000 }, // ₹100 in paise
    currency:           { type: String, required: true, default: 'INR' },
    status:             { type: String, enum: ['created', 'captured', 'failed'], default: 'created' },
    verifiedAt:         { type: Date },
  },
  {
    timestamps: true,
  },
);

export const Payment: Model<IPayment> =
  (mongoose.models.Payment as Model<IPayment>) ||
  mongoose.model<IPayment>('Payment', PaymentSchema);
