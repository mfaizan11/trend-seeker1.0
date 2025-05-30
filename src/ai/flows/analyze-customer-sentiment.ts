// src/ai/flows/analyze-customer-sentiment.ts
'use server';

/**
 * @fileOverview Analyzes customer reviews to determine public perception of a product.
 *
 * - analyzeCustomerSentiment - A function that analyzes customer reviews.
 * - AnalyzeCustomerSentimentInput - The input type for the analyzeCustomerSentiment function.
 * - AnalyzeCustomerSentimentOutput - The return type for the analyzeCustomerSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCustomerSentimentInputSchema = z.object({
  productName: z.string().describe('The name of the product to analyze.'),
  customerReviews: z.string().describe('The customer reviews for the product.'),
});
export type AnalyzeCustomerSentimentInput = z.infer<
  typeof AnalyzeCustomerSentimentInputSchema
>;

const AnalyzeCustomerSentimentOutputSchema = z.object({
  overallSentiment: z
    .string()
    .describe(
      'The overall sentiment of the customer reviews (positive, negative, or neutral).'
    ),
  detailedAnalysis: z
    .string()
    .describe('A detailed analysis of the customer reviews.'),
});
export type AnalyzeCustomerSentimentOutput = z.infer<
  typeof AnalyzeCustomerSentimentOutputSchema
>;

export async function analyzeCustomerSentiment(
  input: AnalyzeCustomerSentimentInput
): Promise<AnalyzeCustomerSentimentOutput> {
  return analyzeCustomerSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCustomerSentimentPrompt',
  input: {schema: AnalyzeCustomerSentimentInputSchema},
  output: {schema: AnalyzeCustomerSentimentOutputSchema},
  prompt: `You are an AI expert in sentiment analysis. Analyze the customer reviews for the product "{{productName}}" to determine the overall sentiment and provide a detailed analysis.

Customer Reviews:
{{customerReviews}}

Provide the overall sentiment (positive, negative, or neutral) and a detailed analysis of the reviews.`,
});

const analyzeCustomerSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeCustomerSentimentFlow',
    inputSchema: AnalyzeCustomerSentimentInputSchema,
    outputSchema: AnalyzeCustomerSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
