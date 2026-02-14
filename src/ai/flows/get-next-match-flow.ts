'use server';
/**
 * @fileOverview A flow for getting Al-Hilal's next match information using AI.
 *
 * - getNextAlHilalMatch - A function that returns the next match for Al-Hilal.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { Match } from '@/lib/types';

const NextMatchOutputSchema = z.object({
    id: z.string().describe("A unique ID for the match."),
    opponent: z.string().describe("The name of the opponent club in Arabic."),
    competition: z.string().describe("The name of the competition or tournament in Arabic."),
    date: z.string().describe("The exact date and time of the match in UTC ISO 8601 format."),
}).nullable();

const nextMatchPrompt = ai.definePrompt({
    name: 'alHilalNextMatchPrompt',
    input: { schema: z.void() },
    output: { schema: NextMatchOutputSchema },
    prompt: `You are a sports data expert specializing in Saudi football. Your goal is to provide details for the next official match of Al-Hilal Saudi FC.

Your priority is accuracy. Use up-to-date information from reliable sports sources, with a strong preference for data from '365Scores' if possible, to get the most current details, as schedules can change.

The result must be in the specified JSON format.
- All text strings (opponent, competition) must be in Arabic.
- The match date must be a single UTC ISO 8601 string.
- Generate a unique ID for the match.

If, after trying your best, you cannot find a *confirmed* upcoming official match, it is acceptable to return null. Do not provide speculative or unconfirmed match data.`,
});


export async function getNextAlHilalMatch(): Promise<Match | null> {
    return getNextAlHilalMatchFlow();
}

const getNextAlHilalMatchFlow = ai.defineFlow(
  {
    name: 'getNextAlHilalMatchFlow',
    inputSchema: z.void(),
    outputSchema: NextMatchOutputSchema,
  },
  async () => {
    const { output } = await nextMatchPrompt();

    // Basic validation in case the model returns a structured but empty object
    if (output && (!output.opponent || !output.competition || !output.date)) {
      console.error("AI returned incomplete match data.", output);
      return null;
    }
    
    return output;
  }
);
