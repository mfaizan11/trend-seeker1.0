
'use server';
/**
 * @fileOverview Generates concise marketing tips or trend observations.
 *
 * - generateMarketingTips - A function that returns a list of marketing tips.
 * - GenerateMarketingTipsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMarketingTipsOutputSchema = z.object({
  tips: z.array(
      z.string().describe("A concise and actionable marketing tip or trend observation, ideally 1-2 sentences. Each tip should be distinct.")
    ).length(3).describe("A list of exactly 3 unique marketing tips.")
});
export type GenerateMarketingTipsOutput = z.infer<typeof GenerateMarketingTipsOutputSchema>;

export async function generateMarketingTips(): Promise<GenerateMarketingTipsOutput> {
  try {
    return await generateMarketingTipsFlow();
  } catch (error: any) {
    console.error("Error in generateMarketingTips (exported function):", error);
    // Re-throw a more generic error for the frontend to handle
    throw new Error(`Failed to generate marketing tips. AI service may be temporarily unavailable. Details: ${error.message || 'Unknown AI error'}`);
  }
}

const prompt = ai.definePrompt({
  name: 'generateMarketingTipsPrompt',
  output: {schema: GenerateMarketingTipsOutputSchema},
  prompt: `You are an expert marketing strategist and trend analyst. 
Generate exactly 3 diverse, concise, and actionable marketing tips or e-commerce trend observations.
Each tip should be unique and ideally 1-2 sentences long. Focus on providing practical advice or insightful observations that a user can consider for their marketing efforts.

Examples of good tips:
- "Personalize email campaigns based on customer purchase history to boost engagement."
- "Video content continues to dominate social media; consider short-form videos for product showcases."
- "Leverage user-generated content to build trust and authenticity for your brand."

Ensure the output strictly adheres to the schema, providing a list of 3 strings.`,
  config: { // Example safety settings
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  },
});

const generateMarketingTipsFlow = ai.defineFlow(
  {
    name: 'generateMarketingTipsFlow',
    outputSchema: GenerateMarketingTipsOutputSchema,
  },
  async () => {
    try {
      const {output} = await prompt({}); // No input needed for this prompt
      if (!output || !output.tips || output.tips.length !== 3) {
        // This secondary check is good if the Zod output schema validation somehow
        // doesn't catch an empty or malformed 'tips' array, though Zod is usually robust.
        console.error('AI generated unexpected output for marketing tips:', output);
        throw new Error("AI failed to generate the expected number of marketing tips.");
      }
      return output;
    } catch (error: any) {
      console.error("Error in generateMarketingTipsFlow (internal Genkit flow):", error);
      // Re-throw the error to be caught by the exported wrapper function
      throw error;
    }
  }
);

