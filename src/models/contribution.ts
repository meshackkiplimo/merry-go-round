import { Schema, model } from 'mongoose';

const contributionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  cycleNumber: { type: Number, required: true },
});

export const Contribution = model('Contribution', contributionSchema);