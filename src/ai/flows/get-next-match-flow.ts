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
    prompt: `You are a world-class sports data analyst. Your primary task is to provide the details of the *next confirmed, official match* for the Al-Hilal Saudi Football Club.

Accuracy is paramount. You must base your answer on real-time, verifiable information from major sports news outlets (like ESPN, BBC Sports, or regional equivalents). Do not use your internal knowledge without verification, as schedules change frequently.

Your process should be:
1. Search for Al-Hilal FC's upcoming official matches.
2. Identify the very next one on the schedule.
3. Verify the opponent, competition, and date/time from at least two reliable sources.

The result must be in the specified JSON format.
- All text strings (opponent, competition) must be in Arabic.
- The match date must be a single UTC ISO 8601 string.
- Generate a unique ID for the match.

If you cannot find a confirmed, upcoming official match, or if there is conflicting information, you MUST return null. Do not provide speculative or unconfirmed match data.`,
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
