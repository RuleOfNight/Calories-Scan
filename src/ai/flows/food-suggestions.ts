// src/ai/flows/food-suggestions.ts
'use server';

/**
 * @fileOverview An AI agent that suggests healthy alternative foods based on dietary restrictions and preferences.
 *
 * - suggestAlternativeFoods - A function that suggests alternative foods.
 * - SuggestAlternativeFoodsInput - The input type for the suggestAlternativeFoods function.
 * - SuggestAlternativeFoodsOutput - The return type for the suggestAlternativeFoods function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAlternativeFoodsInputSchema = z.object({
  foodItem: z.string().describe('The food item to find an alternative for.'),
  dietaryRestrictions: z
    .string()
    .optional()
    .describe('Any dietary restrictions the user has (e.g., vegetarian, gluten-free).'),
  preferences: z
    .string()
    .optional()
    .describe('The user preferences (e.g., taste, cuisine).'),
});
export type SuggestAlternativeFoodsInput = z.infer<
  typeof SuggestAlternativeFoodsInputSchema
>;

const SuggestAlternativeFoodsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of healthy alternative food suggestions.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the suggested alternatives.'),
});
export type SuggestAlternativeFoodsOutput = z.infer<
  typeof SuggestAlternativeFoodsOutputSchema
>;

export async function suggestAlternativeFoods(
  input: SuggestAlternativeFoodsInput
): Promise<SuggestAlternativeFoodsOutput> {
  return suggestAlternativeFoodsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAlternativeFoodsPrompt',
  input: {schema: SuggestAlternativeFoodsInputSchema},
  output: {schema: SuggestAlternativeFoodsOutputSchema},
  prompt: `Suggest healthy alternative foods for {{foodItem}}, considering the following dietary restrictions: {{dietaryRestrictions}} and preferences: {{preferences}}.

      Provide a list of suggestions and the reasoning behind them.
      Format the output as a JSON object with "suggestions" and "reasoning" fields.
      Be concise.
      `,
});

const suggestAlternativeFoodsFlow = ai.defineFlow(
  {
    name: 'suggestAlternativeFoodsFlow',
    inputSchema: SuggestAlternativeFoodsInputSchema,
    outputSchema: SuggestAlternativeFoodsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
