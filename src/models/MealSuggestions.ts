import mongoose from 'mongoose';

const mealSuggestionsSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  user_id: {
    type: String,
    required: true,
    ref: 'User'
  },
  food_name: { type: String, required: true },
  suggestion_text: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

export const MealSuggestions = mongoose.models.MealSuggestions || mongoose.model('MealSuggestions', mealSuggestionsSchema);