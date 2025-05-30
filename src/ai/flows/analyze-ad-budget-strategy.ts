
'use server';
/**
 * @fileOverview Provides AI-powered analysis of an advertising budget strategy.
 *
 * - analyzeAdBudgetStrategy - A function that analyzes ad budget inputs.
 * - AnalyzeAdBudgetStrategyInput - The input type for the function.
 * - AnalyzeAdBudgetStrategyOutput - The return type for the function.
 * - StrategyFeedback - The type for structured feedback for a specific platform.
 * - CampaignOverview - The type for estimated campaign metrics and strategic triggers.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeAdBudgetStrategyInputSchema = z.object({
  sellingPrice: z.number().describe('The selling price of the product.'),
  productCost: z.number().describe('The cost of goods sold (COGS) for the product.'),
  shippingCost: z.number().describe('The shipping cost per unit.'),
  targetROASMeta: z.number().describe('The target Return on Ad Spend (ROAS) for Meta platforms.'),
  targetROASGoogle: z.number().describe('The target Return on Ad Spend (ROAS) for Google Ads.'),
  monthlySalesGoal: z.number().describe('The desired number of sales per month through advertising.'),
  productCategory: z.string().optional().describe('The category of the product (e.g., Electronics, Apparel). This helps in estimating benchmark metrics.'),
  currency: z.string().describe('The currency code (e.g., USD, EUR).'),
});
export type AnalyzeAdBudgetStrategyInput = z.infer<typeof AnalyzeAdBudgetStrategyInputSchema>;

const CampaignOverviewSchema = z.object({
  estimatedImpressions: z.number().optional().describe("Estimated number of impressions needed to achieve the sales goal. Base this on an assumed CTR for the platform and product category."),
  estimatedClicks: z.number().optional().describe("Estimated number of clicks needed to achieve the sales goal. Base this on an assumed Conversion Rate (CVR) for the platform and product category."),
  targetCTR: z.string().optional().describe("Suggested target Click-Through Rate (e.g., '1-2%'). This should be a realistic estimate based on the platform and product category."),
  targetCPC: z.number().optional().describe("Suggested target Cost Per Click in the specified currency. This should align with the overall budget and estimated clicks."),
  estimatedConversionRate: z.string().optional().describe("The assumed Conversion Rate (Sales/Clicks) used for estimations (e.g., '1-3%'). Clearly state this assumption."),
  scalingTriggers: z.array(z.string()).describe("Concise, actionable conditions or metrics indicating when to consider scaling the campaign (e.g., 'ROAS consistently >X% for Y days')."),
  pauseTriggers: z.array(z.string()).describe("Concise, actionable conditions or metrics indicating when to pause or critically review the campaign (e.g., 'Spend exceeds X% of budget with <Y sales')."),
});
export type CampaignOverview = z.infer<typeof CampaignOverviewSchema>;

const StrategyFeedbackSchema = z.object({
  assessment: z.string().describe('A brief overall assessment of the strategy for this platform (e.g., Realistic, Ambitious, Challenging, Risky). Max 1-3 words.'),
  positivePoints: z.array(z.string()).describe('Key positive aspects or strengths of the strategy for this platform. Each point should be concise.'),
  concerns: z.array(z.string()).describe('Potential concerns, risks, or areas needing attention for this platform. Each point should be concise.'),
  suggestions: z.array(z.string()).describe('Actionable suggestions to improve or consider for this platform. Each point should be concise.'),
  campaignOverview: CampaignOverviewSchema.optional().describe('Estimated campaign metrics and strategic triggers for this platform.'),
});
export type StrategyFeedback = z.infer<typeof StrategyFeedbackSchema>;

const AnalyzeAdBudgetStrategyOutputSchema = z.object({
  metaStrategy: StrategyFeedbackSchema.describe('Structured feedback and campaign overview for the Meta advertising strategy.'),
  googleStrategy: StrategyFeedbackSchema.describe('Structured feedback and campaign overview for the Google Ads strategy.'),
  generalRecommendations: z.array(z.string()).describe('Overall advice, cross-platform considerations, or general best practices as a list of concise points.'),
});
export type AnalyzeAdBudgetStrategyOutput = z.infer<typeof AnalyzeAdBudgetStrategyOutputSchema>;

export async function analyzeAdBudgetStrategy(input: AnalyzeAdBudgetStrategyInput): Promise<AnalyzeAdBudgetStrategyOutput> {
  try {
    return await analyzeAdBudgetStrategyFlow(input);
  } catch (error: any) {
    console.error("Error in analyzeAdBudgetStrategy (exported function):", error);
    // Re-throw a more generic error for the frontend to handle
    throw new Error(`Failed to analyze ad budget strategy. AI service may be temporarily unavailable or the request could not be processed. Details: ${error.message || 'Unknown AI error'}`);
  }
}

const prompt = ai.definePrompt({
  name: 'analyzeAdBudgetStrategyPrompt',
  input: {schema: AnalyzeAdBudgetStrategyInputSchema},
  output: {schema: AnalyzeAdBudgetStrategyOutputSchema},
  prompt: `You are an expert digital advertising strategist and data analyst. Analyze the following product and advertising plan.
Your goal is to provide structured feedback for Meta and Google strategies, general recommendations, and a campaign overview with estimated metrics and strategic triggers for each platform.
Adhere strictly to the output schema provided.

Currency for all monetary values is {{{currency}}}.

Product Metrics:
- Selling Price: {{{sellingPrice}}}
- Product Cost (COGS): {{{productCost}}}
- Shipping Cost: {{{shippingCost}}}
- Product Category: {{#if productCategory}}{{{productCategory}}}{{else}}Not Specified{{/if}}

Advertising Goals:
- Target ROAS (Meta): {{{targetROASMeta}}}x
- Target ROAS (Google): {{{targetROASGoogle}}}x
- Desired Monthly Sales (Units): {{{monthlySalesGoal}}}

Part 1: Strategy Feedback (for each platform - Meta & Google)
- A concise 'assessment' (1-3 words, e.g., Realistic, Ambitious, Challenging, Risky).
- A list of 'positivePoints' (strengths).
- A list of 'concerns' (risks/weaknesses).
- A list of 'suggestions' (actionable advice).
Each point in 'positivePoints', 'concerns', and 'suggestions' arrays MUST be a short, single sentence.

Analysis Guidance for Feedback:
- Calculate profit per unit before ad spend.
- For each platform:
  - Calculate max ad spend per sale (Selling Price / Target ROAS) and net profit per sale after ads (Profit Per Unit Before Ads - Max Ad Spend Per Sale).
  - Evaluate if the ROAS target is realistic considering profit margins. This informs your 'assessment'.
  - Discuss profitability implications. If net profit is low/negative, this is a 'concern'. Suggest re-evaluation as a 'suggestion'.
- If ROAS targets are <= 1, highlight this as a major 'concern'.
- If profit margin before ads is negative, this is a critical 'concern'.

Part 2: Campaign Overview (for each platform - Meta & Google, within 'campaignOverview' field)
Based on the inputs and calculated Max Ad Spend Per Sale and Monthly Ad Budget (Max Ad Spend Per Sale * Monthly Sales Goal):
1.  'estimatedConversionRate': Assume a realistic Conversion Rate (CVR: sales/clicks) based on the 'productCategory' (if provided, otherwise general e-commerce). State this assumed CVR (e.g., "1-3% for Apparel on Meta"). If no category, use a general range like "0.5-2%".
2.  'estimatedClicks': Calculate as Monthly Sales Goal / Assumed CVR. Round to a whole number.
3.  'targetCTR': Assume a realistic Click-Through Rate (CTR: clicks/impressions) based on the 'productCategory' and platform. State this (e.g., "0.8-1.5% for Electronics on Google Search"). If no category, use a general range.
4.  'estimatedImpressions': Calculate as Estimated Clicks / Assumed CTR. Round to a whole number.
5.  'targetCPC': Calculate as Monthly Ad Budget / Estimated Clicks. Format to 2 decimal places for the given 'currency'.
6.  'scalingTriggers': Provide 2-3 concise, actionable triggers for when to consider scaling the campaign (e.g., "ROAS consistently above {{{targetROASMeta}}}x for 7+ days on good volume", "CTR significantly exceeds assumed {{{targetCTR}}} with healthy CVR").
7.  'pauseTriggers': Provide 2-3 concise, actionable triggers for when to pause or critically review the campaign (e.g., "Spend reaches 50% of monthly budget with less than 25% of sales goal", "CPC consistently 50% higher than target with low CVR").

IMPORTANT for Campaign Overview: Clearly state that these are ESTIMATES and actual performance will vary. Base CVR and CTR assumptions on typical industry benchmarks for the given 'productCategory' and platform (Meta vs. Google Ads). If 'productCategory' is not specified, use general e-commerce benchmarks and state this.

General Recommendations: Provide a list of overall advice, cross-platform considerations, or general best practices, each as a short, single sentence.

If there are no specific points for any array (e.g. no positive points for Meta), provide an empty array for that field. Do not make up points if none are applicable.
Example for a point in an array: "High profit margin allows for flexible ad spend."
Example for a trigger: "Consistent ROAS above 3.5x for 7 consecutive days with at least 20 conversions."
`,
});

const analyzeAdBudgetStrategyFlow = ai.defineFlow(
  {
    name: 'analyzeAdBudgetStrategyFlow',
    inputSchema: AnalyzeAdBudgetStrategyInputSchema,
    outputSchema: AnalyzeAdBudgetStrategyOutputSchema,
  },
  async (input) => {
    try {
      const {output} = await prompt(input);
      if (!output) {
        // This case should ideally be caught by Zod schema validation or prompt error,
        // but as a safeguard:
        throw new Error("AI prompt returned an empty output.");
      }
      return output;
    } catch (error: any) {
      console.error("Error in analyzeAdBudgetStrategyFlow (internal Genkit flow):", error);
      // Re-throw the error to be caught by the exported wrapper function
      throw error; 
    }
  }
);

