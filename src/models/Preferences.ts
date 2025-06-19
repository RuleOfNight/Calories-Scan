import mongoose from 'mongoose';

const preferencesSchema = new mongoose.Schema({
  user_id: { 
    type: String, 
    required: true,
    ref: 'User'
  },
  dietary_restrictions: [String],
  food_preferences: [String]
});

export const Preferences = mongoose.models.Preferences || mongoose.model('Preferences', preferencesSchema);