export interface UserProfile {
  name: string;
  email: string;
  age?: number;
  weight?: number; // in kg
  height?: number; // in cm
  bmi?: number;
}

export interface NutritionData {
  foodName: string;
  calories?: number;
  protein?: number; // in grams
  carbs?: number; // in grams
  fat?: number; // in grams
  [key: string]: any; // For other nutrients
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}
