
"use client";

import { useState, type FormEvent, useRef, useEffect } from 'react';
import Image from 'next/image';
import { generateMarketingContent, type GenerateMarketingContentInput, type GenerateMarketingContentOutput } from '@/ai/flows/generate-marketing-content';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Lightbulb, Image as ImageIcon, Facebook, CornerUpRight, ListChecks, Info, Download, ClipboardEdit, Brain, ImageUp, CheckCircle2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { WorkflowIndicator, type WorkflowStep } from '@/components/shared/workflow-indicator';

const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.19,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.19,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.19,22C17.6,22 21.54,18.33 21.54,12.81C21.54,12.09 21.47,11.61 21.35,11.1Z" />
  </svg>
);

const PLACEHOLDER_PRODUCT_NAME = "Example: Eco-Friendly Yoga Mat";
const PLACEHOLDER_PRODUCT_DESC = "Made from 100% sustainable cork and natural rubber. Non-slip, durable, and extra-cushioned for comfort. Perfect for all yoga styles.";
const PLACEHOLDER_TARGET_AUDIENCE = "Environmentally conscious yogis, fitness enthusiasts, home workout practitioners.";
const PLACEHOLDER_MARKET_GAPS = "Lack of truly eco-friendly mats that are also high-performance and stylish.";

const aiMarketingToolWorkflowSteps: WorkflowStep[] = [
  {
    iconName: "ClipboardEdit",
    title: "1. Input Details",
    description: "Provide your product name, description, and target audience.",
  },
  {
    iconName: "Brain",
    title: "2. AI Content Ideas",
    description: "The AI analyzes inputs and generates text, ad copy, and image concepts.",
  },
  {
    iconName: "ImageUp",
    title: "3. AI Image Creation",
    description: "An ad image is automatically generated based on the AI's concepts.",
  },
  {
    iconName: "CheckCircle2",
    title: "4. Review Assets",
    description: "Access your complete, AI-generated marketing campaign materials.",
  },
];

export function AiMarketingToolForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateMarketingContentOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [productName, setProductName] = useState(PLACEHOLDER_PRODUCT_NAME);
  const [productDescription, setProductDescription] = useState(PLACEHOLDER_PRODUCT_DESC);
  const [targetAudience, setTargetAudience] = useState(PLACEHOLDER_TARGET_AUDIENCE);
  const [marketGaps, setMarketGaps] = useState(PLACEHOLDER_MARKET_GAPS);

  const resultsCardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (result && resultsCardRef.current) {
      resultsCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  const getFinalInputValue = (currentValue: string, placeholder: string) => {
    return currentValue === placeholder ? '' : currentValue;
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setResult(null);
    setError(null);

    const finalProductName = getFinalInputValue(productName, PLACEHOLDER_PRODUCT_NAME);
    const finalProductDescription = getFinalInputValue(productDescription, PLACEHOLDER_PRODUCT_DESC);
    const finalTargetAudience = getFinalInputValue(targetAudience, PLACEHOLDER_TARGET_AUDIENCE);
    const finalMarketGaps = getFinalInputValue(marketGaps, PLACEHOLDER_MARKET_GAPS);


    if (!finalProductName || !finalProductDescription || !finalTargetAudience) {
        setError("Product Name, Description, and Target Audience are required.");
        setIsLoading(false);
        return;
    }

    const input: GenerateMarketingContentInput = {
      productName: finalProductName,
      productDescription: finalProductDescription,
      targetAudience: finalTargetAudience,
      marketGaps: finalMarketGaps || undefined, 
    };

    try {
      const response = await generateMarketingContent(input);
      setResult(response);
    } catch (e) {
      console.error("Error generating marketing content:", e);
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred while generating content. Please try again.";
      setError(errorMessage);
      toast({ variant: "destructive", title: "Generation Error", description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  }

  const handleDownloadImage = (imageDataUri?: string, pName?: string) => {
    if (!imageDataUri) return;
    const link = document.createElement('a');
    link.href = imageDataUri;
    const safeProductName = pName && pName !== PLACEHOLDER_PRODUCT_NAME ? pName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : 'ad';
    const downloadFilename = `trendseeker-${safeProductName}-image.png`;
    link.download = downloadFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="lg:flex lg:flex-row-reverse lg:gap-8 lg:items-start">
        <div className="lg:w-1/3 lg:sticky h-fit"> 
          <div className="lg:hidden">
            <WorkflowIndicator orientation="horizontal" steps={aiMarketingToolWorkflowSteps} title="AI Marketing Tool Workflow" />
          </div>
          <div className="hidden lg:block">
            <WorkflowIndicator orientation="vertical" steps={aiMarketingToolWorkflowSteps} title="AI Marketing Tool Workflow" />
          </div>
        </div>

        <Card className="lg:flex-grow animate-fadeInUp">
          <CardHeader>
            <CardTitle>AI Marketing Campaign Generator</CardTitle>
            <CardDescription className="text-sm opacity-80">
              Input product details for AI-generated marketing campaigns, including ad images and copy.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name</Label>
                  <Input
                    id="productName"
                    name="productName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    onFocus={() => {
                      if (productName === PLACEHOLDER_PRODUCT_NAME) {
                        setProductName('');
                      }
                    }}
                    className={cn(
                      productName === PLACEHOLDER_PRODUCT_NAME && "text-muted-foreground opacity-70"
                    )}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Input
                    id="targetAudience"
                    name="targetAudience"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    onFocus={() => {
                      if (targetAudience === PLACEHOLDER_TARGET_AUDIENCE) {
                        setTargetAudience('');
                      }
                    }}
                    className={cn(
                      targetAudience === PLACEHOLDER_TARGET_AUDIENCE && "text-muted-foreground opacity-70"
                    )}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="productDescription">Product Description (Detailed)</Label>
                <Textarea
                  id="productDescription"
                  name="productDescription"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  onFocus={() => {
                    if (productDescription === PLACEHOLDER_PRODUCT_DESC) {
                      setProductDescription('');
                    }
                  }}
                  className={cn(
                    productDescription === PLACEHOLDER_PRODUCT_DESC && "text-muted-foreground opacity-70"
                  )}
                  rows={5}
                  required
                  />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marketGaps">Market Gaps / Opportunities (Optional)</Label>
                <Textarea
                  id="marketGaps"
                  name="marketGaps"
                  value={marketGaps}
                  onChange={(e) => setMarketGaps(e.target.value)}
                  onFocus={() => {
                    if (marketGaps === PLACEHOLDER_MARKET_GAPS) {
                      setMarketGaps('');
                    }
                  }}
                  className={cn(
                    marketGaps === PLACEHOLDER_MARKET_GAPS && "text-muted-foreground opacity-70"
                  )}
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto" size="lg">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating Campaign Assets...
                  </>
                ) : (
                  <>
                    <Lightbulb className="mr-2 h-5 w-5" />
                    Generate Full Campaign
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      {error && !isLoading && (
        <Alert variant="destructive" className="mt-6">
            <Info className="h-5 w-5" />
          <AlertTitle>Error Generating Content</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card ref={resultsCardRef} className="mt-8">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-primary">AI Generated Campaign Assets</CardTitle>
                <CardDescription className="text-sm opacity-80">Review generated ad assets, including image, copy, and more.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="adImage" className="w-full">
              <TabsList className="flex flex-wrap justify-center gap-1 sm:gap-2 mb-6 bg-card/30 backdrop-blur-md rounded-md p-1">
                <TabsTrigger value="adImage"><ImageIcon className="mr-2 h-4 w-4"/>Ad Image</TabsTrigger>
                <TabsTrigger value="metaCampaign"><Facebook className="mr-2 h-4 w-4"/>Meta Ads</TabsTrigger>
                <TabsTrigger value="googleCampaign"><GoogleIcon /> <span className="ml-2">Google Ads</span></TabsTrigger>
                <TabsTrigger value="productDesc"><CornerUpRight className="mr-2 h-4 w-4 transform scale-x-[-1]"/>Product Page</TabsTrigger>
                <TabsTrigger value="generalIdeas"><ListChecks className="mr-2 h-4 w-4"/>General Ideas</TabsTrigger>
              </TabsList>

              <TabsContent value="adImage" className="p-4 mt-[5rem] border rounded-md bg-muted/20 min-h-[300px] space-y-4">
                <h3 className="text-xl font-semibold text-foreground mb-2">Generated Ad Image &amp; Prompt</h3>
                {result.generatedAdImageDataUri ? (
                  <div className="flex flex-col items-center space-y-4">
                    <Image 
                      src={result.generatedAdImageDataUri} 
                      alt={`AI Generated Ad Image for ${getFinalInputValue(productName, PLACEHOLDER_PRODUCT_NAME) || 'product'}`} 
                      width={512} 
                      height={512} 
                      className="rounded-lg border shadow-md object-contain max-w-full"
                      unoptimized={result.generatedAdImageDataUri.startsWith('data:image')}
                    />
                    <Button 
                      onClick={() => handleDownloadImage(result.generatedAdImageDataUri, getFinalInputValue(productName, PLACEHOLDER_PRODUCT_NAME))}
                      variant="outline"
                      size="sm"
                      className="mt-2"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Image
                    </Button>
                     <Alert className="w-full max-w-xl">
                        <Info className="h-4 w-4" />
                        <AlertTitle>Image Generation Note</AlertTitle>
                        <AlertDescription>
                         This image was generated by AI. Quality and relevance may vary. Use the prompt below as a starting point for further refinement with dedicated image editing tools if needed.
                        </AlertDescription>
                    </Alert>
                  </div>
                ) : (
                   <Alert variant="default" className="border-yellow-500/50 text-yellow-700 dark:text-yellow-400 dark:border-yellow-500/70 [&>svg]:text-yellow-500 dark:[&>svg]:text-yellow-400">
                    <ImageIcon className="h-4 w-4"/>
                    <AlertTitle>Image Not Generated</AlertTitle>
                    <AlertDescription>The AI could not generate an image for this request, or image generation failed. Textual content has still been provided. You can try again or refine your product inputs.</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-1 mt-3">
                  <Label htmlFor="adImagePromptResult" className="text-sm font-medium text-muted-foreground">AI Image Generation Prompt Used:</Label>
                  <Textarea id="adImagePromptResult" value={result.adImagePrompt} readOnly rows={3} className="text-sm bg-muted/50"/>
                </div>
              </TabsContent>

              <TabsContent value="metaCampaign" className="p-4 border rounded-md bg-muted/20 min-h-[300px] space-y-6">
                <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center"><Facebook className="mr-2 h-5 w-5 text-blue-600"/>Meta Campaign Content (Facebook/Instagram)</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Headline:</Label>
                    <p className="p-3 rounded-md bg-background border text-foreground text-sm">{result.metaCampaign.headline}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Primary Text:</Label>
                    <p className="p-3 rounded-md bg-background border text-foreground text-sm whitespace-pre-wrap">{result.metaCampaign.primaryText}</p>
                  </div>
                  {result.metaCampaign.linkDescription && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Link Description (for link ads):</Label>
                      <p className="p-3 rounded-md bg-background border text-foreground text-sm whitespace-pre-wrap">{result.metaCampaign.linkDescription}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Call to Action Suggestion:</Label>
                    <p className="p-3 rounded-md bg-background border text-foreground text-sm">{result.metaCampaign.callToActionSuggestion}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="googleCampaign" className="p-4 border rounded-md bg-muted/20 min-h-[300px] space-y-6">
                <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center"><GoogleIcon /> <span className="ml-2">Google Ads Campaign Content</span></h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Headlines (Max 30 chars each):</Label>
                    <ul className="list-disc list-inside space-y-1 mt-1">
                      {result.googleAdsCampaign.headlines.map((headline, index) => (
                        <li key={`gheadline-${index}`} className="p-2 rounded-md bg-background border text-foreground text-sm">{headline}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Descriptions (Max 90 chars each):</Label>
                     <ul className="space-y-2 mt-1">
                      {result.googleAdsCampaign.descriptions.map((desc, index) => (
                        <li key={`gdesc-${index}`} className="p-2 rounded-md bg-background border text-foreground text-sm whitespace-pre-wrap">{desc}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Call to Action Suggestion:</Label>
                    <p className="p-3 rounded-md bg-background border text-foreground text-sm">{result.googleAdsCampaign.callToActionSuggestion}</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="productDesc" className="p-4 border rounded-md bg-muted/20 min-h-[300px] space-y-4">
                <h3 className="text-xl font-semibold text-foreground mb-2">Optimized Product Description</h3>
                <p className="p-3 rounded-md bg-background border text-foreground text-sm whitespace-pre-wrap">{result.optimizedProductDescription}</p>
              </TabsContent>
              
              <TabsContent value="generalIdeas" className="p-4 border rounded-md bg-muted/20 min-h-[300px] space-y-4">
                <h3 className="text-xl font-semibold text-foreground mb-2">General Ad Copy Ideas &amp; Angles</h3>
                <ul className="list-disc list-inside space-y-2">
                  {result.generalAdCopyIdeas.map((idea, index) => (
                    <li key={`idea-${index}`} className="p-2 rounded-md bg-background border text-foreground text-sm">{idea}</li>
                  ))}
                </ul>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
