'use server';
/**
 * @fileOverview A food calorie estimation AI agent.
 *
 * - estimateCalories - A function that handles the calorie estimation process.
 * - EstimateCaloriesInput - The input type for the estimateCalories function.
 * - EstimateCaloriesOutput - The return type for the estimateCalories function.
 */

import {ai} from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import {z} from 'zod';

const EstimateCaloriesInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a meal, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type EstimateCaloriesInput = z.infer<typeof EstimateCaloriesInputSchema>;

const EstimateCaloriesOutputSchema = z.object({
    description: z.string().describe("A brief description of the food items identified in the meal, in Arabic."),
    calories: z.number().describe("The total estimated calorie count for the meal, as a single number."),
});
export type EstimateCaloriesOutput = z.infer<typeof EstimateCaloriesOutputSchema>;

export async function estimateCalories(input: EstimateCaloriesInput): Promise<EstimateCaloriesOutput> {
  return estimateCaloriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'estimateCaloriesPrompt',
  model: 'googleai/gemini-pro-vision',
  input: {schema: EstimateCaloriesInputSchema},
  output: {schema: EstimateCaloriesOutputSchema},
  prompt: `You are an expert nutritionist. Analyze the image of the meal provided and identify all the food items.

Based on the food items and their estimated portion sizes, provide a very accurate approximation of the total calorie count.

Return your answer in the specified JSON format. Your description of the food must be in Arabic.

Photo: {{media url=photoDataUri}}`,
});

const estimateCaloriesFlow = ai.defineFlow(
  {
    name: 'estimateCaloriesFlow',
    inputSchema: EstimateCaloriesInputSchema,
    outputSchema: EstimateCaloriesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
