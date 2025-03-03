import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['member', 'admin'], default: 'member' },
  imageUrl: { type: String }, // Base64 or URL
  location: { type: String },
  jobStatus: { type: String },
  familyName: { type: String },
});

export const User = model('User', userSchema);