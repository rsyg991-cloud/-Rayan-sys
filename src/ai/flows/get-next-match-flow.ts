'use server';
/**
 * @fileOverview A flow for getting Al-Hilal's next match information using AI.
 *
 * - getNextAlHilalMatch - A function that returns the next match for Al-Hilal.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { Match } from '@/lib/types';

const NextMatchInputSchema = z.object({
    currentDate: z.string().describe("The current date in UTC ISO 8601 format, used as a reference to find the *next* match."),
});

const NextMatchOutputSchema = z.object({
    id: z.string().describe("A unique ID for the match."),
    opponent: z.string().describe("The name of the opponent club in Arabic."),
    competition: z.string().describe("The name of the competition or tournament in Arabic."),
    date: z.string().describe("The exact date and time of the match in UTC ISO 8601 format."),
}).nullable();

const nextMatchPrompt = ai.definePrompt({
    name: 'alHilalNextMatchPrompt',
    input: { schema: NextMatchInputSchema },
    output: { schema: NextMatchOutputSchema },
    prompt: `You are a sports data expert specializing in Saudi football. Your goal is to provide details for the next official match of Al-Hilal Saudi FC.

The current date is {{currentDate}}. You must find the first official match scheduled to happen after this date.

Your priority is accuracy. Use up-to-date information from reliable sports sources, with a strong preference for data from '365Scores' if possible, to get the most current details, as schedules can change.

The result must be in the specified JSON format.
- All text strings (opponent, competition) must be in Arabic.
- The match date must be a single UTC ISO 8601 string.
- Generate a unique ID for the match.

If, after trying your best, you cannot find a *confirmed* upcoming official match after the current date, it is acceptable to return null. Do not provide speculative or unconfirmed match data.`,
});


export async function getNextAlHilalMatch(): Promise<Match | null> {
    const currentDate = new Date().toISOString();
    return getNextAlHilalMatchFlow({ currentDate });
}

const getNextAlHilalMatchFlow = ai.defineFlow(
  {
    name: 'getNextAlHilalMatchFlow',
    inputSchema: NextMatchInputSchema,
    outputSchema: NextMatchOutputSchema,
  },
  async (input) => {
    const { output } = await nextMatchPrompt(input);

    // Basic validation in case the model returns a structured but empty object
    if (output && (!output.opponent || !output.competition || !output.date)) {
      console.error("AI returned incomplete match data.", output);
      return null;
    }
    
    return output;
  }
);
