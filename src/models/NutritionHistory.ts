import mongoose from 'mongoose';

const nutritionHistorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  user_id: {
    type: String,
    required: true,
    ref: 'User'
  },
  food_id: {
    type: String,
    required: true,
    ref: 'FoodItem'
  },
  calories: { type: Number, required: true },
  scanned_at: { type: Date, default: Date.now }
});

export const NutritionHistory = mongoose.models.NutritionHistory || mongoose.model('NutritionHistory', nutritionHistorySchema);