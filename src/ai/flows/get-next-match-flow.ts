'use server';
/**
 * @fileOverview A flow for getting Al-Hilal's next match information.
 *
 * - getNextAlHilalMatch - A function that returns the next match for Al-Hilal.
 * - Match - The return type for the getNextAlHilalMatch function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { Match } from '@/lib/types';

export { type Match };

const NextMatchOutputSchema = z.object({
    id: z.string(),
    opponent: z.string(),
    competition: z.string(),
    date: z.string(),
}).nullable();

// This is a MOCK function. In a real application, you would fetch this from a real sports data provider.
async function fetchNextAlHilalMatch(): Promise<Match | null> {
    console.log(`Fetching next match for Al-Hilal`);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // To make it "update automatically", we find the next Friday from today.
    const today = new Date();
    const dayOfWeek = today.getDay(); // Sunday is 0, Friday is 5
    const daysUntilFriday = (5 - dayOfWeek + 7) % 7;
    // if today is Friday, get next week's Friday
    const daysToAdd = daysUntilFriday === 0 ? 7 : daysUntilFriday;

    const nextFriday = new Date(today);
    nextFriday.setDate(today.getDate() + daysToAdd);
    nextFriday.setHours(21, 0, 0, 0); // 9 PM in local time of the server

    const mockMatch: Match = {
        id: "match-12345",
        opponent: "النصر",
        competition: "دوري روشن السعودي",
        date: nextFriday.toISOString(),
    };

    return mockMatch;
}

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
    // This flow encapsulates the logic to get that specific data.
    return await fetchNextAlHilalMatch();
  }
);
