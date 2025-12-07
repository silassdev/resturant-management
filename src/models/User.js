import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'staff'], default: 'admin' },
  createdAt: { type: Date, default: Date.now }
});

export default model('User', UserSchema);
