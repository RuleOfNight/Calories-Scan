// src/ai/flows/food-nutrition.ts
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FoodNutritionInputSchema = z.object({
  foodName: z.string().describe('The name of the food to get nutrition information for.'),
});

export type FoodNutritionInput = z.infer<typeof FoodNutritionInputSchema>;

const FoodNutritionOutputSchema = z.object({
  foodName: z.string(),
  calories: z.number(),
  carbohydrates: z.number(),
  protein: z.number(),
  fat: z.number(),
  sugar: z.number(),
});

export type FoodNutritionOutput = z.infer<typeof FoodNutritionOutputSchema>;

export async function getFoodNutrition(input: FoodNutritionInput): Promise<FoodNutritionOutput> {
  return foodNutritionFlow(input);
}

const foodNutritionPrompt = ai.definePrompt({
  name: 'foodNutritionPrompt',
  input: {schema: FoodNutritionInputSchema},
  output: {schema: FoodNutritionOutputSchema},
  prompt: `You are a nutrition information system. Provide detailed nutrition facts for the given food.
  Return the information in JSON format with exact numbers (no ranges).
  If you're not completely sure about the exact values, provide the most reasonable estimates based on standard portions.

  Food name: {{{foodName}}}
  
  Response in JSON:
  {
    "foodName": "exact food name",
    "calories": number (kcal),
    "carbohydrates": number (g),
    "protein": number (g),
    "fat": number (g),
    "sugar": number (g)
  } 
  All nutritional values should be based on a standard serving size of the food item or 100g if not specified.
  `, 
});

const foodNutritionFlow = ai.defineFlow(
  {
    name: 'foodNutritionFlow',
    inputSchema: FoodNutritionInputSchema,
    outputSchema: FoodNutritionOutputSchema,
  },
  async input => {
    const {output} = await foodNutritionPrompt(input);
    return output!;
  }
);