import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  age: { type: Number },
  gender: { type: String },
  weight: { type: Number },
  height: { type: Number }
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);