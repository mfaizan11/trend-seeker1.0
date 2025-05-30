
'use server';
/**
 * @fileOverview AI Marketing Tool flow.
 *
 * This flow analyzes product data and market gaps to generate engaging marketing content,
 * including ad image prompts, generated images, and specific campaign materials for Meta and Google.
 *
 * - generateMarketingContent - A function that generates marketing content for a given product.
 * - GenerateMarketingContentInput - The input type for the generateMarketingContent function.
 * - GenerateMarketingContentOutput - The return type for the generateMarketingContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMarketingContentInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productDescription: z.string().describe('A detailed description of the product.'),
  targetAudience: z.string().describe('The target audience for the product.'),
  marketGaps: z.string().optional().describe('Identified gaps or underserved needs in the market for this product (if any). Leave empty if not applicable.'),
});

export type GenerateMarketingContentInput = z.infer<typeof GenerateMarketingContentInputSchema>;

const MetaCampaignSchema = z.object({
  headline: z.string().describe('A compelling headline for Meta ads (e.g., Facebook, Instagram). Max 40 characters recommended.'),
  primaryText: z.string().describe('The main body text for Meta ads. Max 125 characters recommended.'),
  linkDescription: z.string().optional().describe('A short description for link ads on Meta (e.g., Facebook News Feed link description). Max 30 characters recommended.'),
  callToActionSuggestion: z.string().describe('A suggested call to action button text for Meta (e.g., "Shop Now", "Learn More", "Sign Up").'),
});

const GoogleAdsCampaignSchema = z.object({
  headlines: z.array(z.string()).describe('An array of 3-5 short, impactful headlines for Google Ads (each max 30 characters).'),
  descriptions: z.array(z.string()).describe('An array of 2-3 longer descriptions for Google Ads (each max 90 characters).'),
  callToActionSuggestion: z.string().describe('A suggested call to action phrase to incorporate or use for Google Ads.'),
});

const GenerateMarketingContentOutputSchema = z.object({
  adImagePrompt: z.string().describe('A descriptive prompt suitable for an AI image generation model to create an ad image for the product. This prompt should be detailed enough to guide image creation effectively.'),
  generatedAdImageDataUri: z.string().optional().describe("The base64 encoded Data URI of the AI-generated ad image. Expected format: 'data:image/png;base64,<encoded_data>'. This will be populated after image generation."),
  metaCampaign: MetaCampaignSchema.describe('Structured content specifically for Meta advertising campaigns.'),
  googleAdsCampaign: GoogleAdsCampaignSchema.describe('Structured content specifically for Google Ads campaigns.'),
  optimizedProductDescription: z.string().describe('An optimized and engaging product description suitable for online stores or marketplaces.'),
  generalAdCopyIdeas: z.array(z.string()).describe('A list of general advertising copy ideas, unique selling propositions, or creative angles that can be adapted for various platforms.'),
});

export type GenerateMarketingContentOutput = z.infer<typeof GenerateMarketingContentOutputSchema>;

// This prompt is focused on generating all textual content, including the adImagePrompt
const generateMarketingTextPrompt = ai.definePrompt({
  name: 'generateMarketingTextPrompt',
  input: {schema: GenerateMarketingContentInputSchema},
  // Output schema here EXCLUDES generatedAdImageDataUri as this prompt doesn't generate the image itself
  output: {schema: GenerateMarketingContentOutputSchema.omit({ generatedAdImageDataUri: true })},
  prompt: `You are an AI marketing expert specializing in creating comprehensive digital ad campaigns.
Analyze the following product data, target audience, and market gaps.
Based on this, generate:
1.  An 'adImagePrompt': A highly descriptive prompt for an AI image generation model. This prompt should aim to create a visually appealing and relevant ad image for the product. Describe scene, style, colors, and key elements.
2.  'metaCampaign': Content for Meta platforms (Facebook/Instagram).
    *   'headline': Engaging headline (max 40 chars).
    *   'primaryText': Compelling body text (max 125 chars).
    *   'linkDescription': Short link description for feed ads (max 30 chars). If not applicable for the product, this can be omitted or a very brief product tag line.
    *   'callToActionSuggestion': A suitable call to action (e.g., "Shop Now").
3.  'googleAdsCampaign': Content for Google Ads.
    *   'headlines': Array of 3-5 short headlines (max 30 chars each).
    *   'descriptions': Array of 2-3 descriptions (max 90 chars each).
    *   'callToActionSuggestion': A call to action phrase.
4.  'optimizedProductDescription': An engaging and SEO-friendly product description.
5.  'generalAdCopyIdeas': A list of 3-5 unique selling propositions or creative angles.

Product Name: {{{productName}}}
Product Description: {{{productDescription}}}
Target Audience: {{{targetAudience}}}
{{#if marketGaps}}Market Gaps: {{{marketGaps}}}{{else}}Market Gaps: Not specified by user.{{/if}}

Ensure all generated text is creative, persuasive, and tailored to maximize market potential.
Adhere strictly to the output schema. For arrays like Google Ads headlines/descriptions and generalAdCopyIdeas, provide at least the minimum number requested.
`,
  config: { // Example safety settings
    safetySettings: [
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  },
});


export async function generateMarketingContent(input: GenerateMarketingContentInput): Promise<GenerateMarketingContentOutput> {
  let textualOutput: z.infer<typeof GenerateMarketingContentOutputSchema.shape.metaCampaign.constructor> & // A bit of a hack to get the type without generatedAdImageDataUri
                     z.infer<typeof GenerateMarketingContentOutputSchema.shape.googleAdsCampaign.constructor> &
                     Pick<GenerateMarketingContentOutput, 'adImagePrompt' | 'optimizedProductDescription' | 'generalAdCopyIdeas'>;

  try {
    // Step 1: Generate textual content including the image prompt
    const textualContentResponse = await generateMarketingTextPrompt(input);
    if (!textualContentResponse.output) {
      throw new Error('AI failed to generate marketing text content.');
    }
    textualOutput = textualContentResponse.output;
  } catch (error: any) {
    console.error("Error generating marketing text content:", error);
    throw new Error(`Failed to generate marketing text. AI service error: ${error.message || 'Unknown AI error'}`);
  }

  let imageDataUri: string | undefined = undefined;
  // Step 2: Generate image using the adImagePrompt from step 1
  if (textualOutput.adImagePrompt) {
    try {
      const { media } = await ai.generate({
        model: 'googleai/gemini-2.0-flash-exp',
        prompt: textualOutput.adImagePrompt,
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
           safetySettings: [ // Stricter safety for image generation
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
          ],
        },
      });
      if (media && media.url) {
        imageDataUri = media.url;
      } else {
        console.warn("Image generation call succeeded but returned no media URL.");
        // Not throwing an error here, will return text content without image.
      }
    } catch (error: any) {
      console.error("Image generation failed:", error);
      // Optionally, handle this error more gracefully, e.g., by returning null for the image
      // and logging a warning to the user or system.
      // For now, we'll let it proceed without an image if generation fails.
      // The frontend will show a message if generatedAdImageDataUri is missing.
    }
  }

  // Step 3: Combine textual output with the generated image URI
  return {
    ...textualOutput,
    generatedAdImageDataUri: imageDataUri,
  };
}


// The ai.defineFlow wraps the main orchestration function
const generateMarketingContentFlow = ai.defineFlow(
  {
    name: 'generateMarketingContentFlow',
    inputSchema: GenerateMarketingContentInputSchema,
    outputSchema: GenerateMarketingContentOutputSchema,
  },
  generateMarketingContent // The exported function `generateMarketingContent` already implements the full logic
);

// Note: The above `generateMarketingContentFlow` definition is somewhat redundant if `generateMarketingContent`
// is the primary export used by the frontend. However, defining it with `ai.defineFlow` registers it with Genkit,
// which can be useful for monitoring or other Genkit tooling in a more complex setup.
// For this application, the frontend directly calls `generateMarketingContent`.
// To ensure the main exported function also benefits from potential Genkit wrapper benefits (like automatic tracing if fully integrated),
// you could technically do:
// export async function generateMarketingContentWithHandler(input: GenerateMarketingContentInput): Promise<GenerateMarketingContentOutput> {
//   return generateMarketingContentFlow(input);
// }
// But the current direct export of `generateMarketingContent` which embodies the flow logic is fine.
