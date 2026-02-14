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
    prompt: `You are a sports data expert for Saudi football. Your task is to provide the details for the very next official match of Al-Hilal Saudi FC.

The current date is {{currentDate}}. Find the first official match scheduled to occur after this date. This could be a league match, cup match, or friendly. Look for the next available match, even if it is weeks or months away (e.g., the start of the new season).

Use the most up-to-date information available from reliable sports sources, such as the club's official Twitter account, to ensure accuracy. The user has indicated the next match is against "Al-Ittihad", so please verify this information and provide the correct match details.

The result must be in the specified JSON format.
- All text strings (opponent, competition) must be in Arabic.
- The match date must be a single UTC ISO 8601 string.
- Generate a unique ID for the match.

It is crucial that you find and return the next match. Only return null as an absolute last resort if no information about any future matches is available anywhere.`,
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
