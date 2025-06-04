// NutritionChatbot.ts
'use server';

/**
 * @fileOverview AI-powered health advice tool that uses Google Gemini to answer user questions about nutrition.
 *
 * - nutritionChatbot - A function that handles the nutrition chatbot process.
 * - NutritionChatbotInput - The input type for the nutritionChatbot function.
 * - NutritionChatbotOutput - The return type for the nutritionChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NutritionChatbotInputSchema = z.object({
  question: z.string().describe('The user question about nutrition.'),
});

export type NutritionChatbotInput = z.infer<typeof NutritionChatbotInputSchema>;

const NutritionChatbotOutputSchema = z.object({
  answer: z.string().describe('The answer to the user question about nutrition.'),
});

export type NutritionChatbotOutput = z.infer<typeof NutritionChatbotOutputSchema>;

export async function nutritionChatbot(input: NutritionChatbotInput): Promise<NutritionChatbotOutput> {
  return nutritionChatbotFlow(input);
}

const nutritionChatbotPrompt = ai.definePrompt({
  name: 'nutritionChatbotPrompt',
  input: {schema: NutritionChatbotInputSchema},
  output: {schema: NutritionChatbotOutputSchema},
  prompt: `You are a helpful AI chatbot that provides answers to user questions about nutrition.

  Question: {{{question}}}
  Answer:`, 
});

const nutritionChatbotFlow = ai.defineFlow(
  {
    name: 'nutritionChatbotFlow',
    inputSchema: NutritionChatbotInputSchema,
    outputSchema: NutritionChatbotOutputSchema,
  },
  async input => {
    const {output} = await nutritionChatbotPrompt(input);
    return output!;
  }
);
