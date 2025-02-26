import { Schema, model } from 'mongoose';

const payoutSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  cycleNumber: { type: Number, required: true },
});

export const Payout = model('Payout', payoutSchema);