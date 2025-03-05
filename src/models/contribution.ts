import { Schema, model } from 'mongoose';

const contributionSchema = new Schema({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  cycleNumber: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

export const Contribution = model('Contribution', contributionSchema);