import mongoose from 'mongoose';

const foodItemSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fat: { type: Number, required: true },
  sugar: { type: Number, required: true }
});

export const FoodItem = mongoose.models.FoodItem || mongoose.model('FoodItem', foodItemSchema);