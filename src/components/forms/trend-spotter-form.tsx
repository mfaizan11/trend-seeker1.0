
"use client";

import { useState, type FormEvent } from 'react';
import { identifyEmergingTrends, type IdentifyEmergingTrendsInput, type IdentifyEmergingTrendsOutput } from '@/ai/flows/identify-emerging-trends';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Zap } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const IDENTIFIED_TRENDS_COUNT_KEY = 'identifiedTrendsCount';

export function TrendSpotterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<IdentifyEmergingTrendsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [salesData, setSalesData] = useState("Example: Product A - 1000 units sold, $50k revenue; Product B - 500 units, $20k revenue.");
  const [socialMediaEngagement, setSocialMediaEngagement] = useState("Example: #NewGadget - 10k mentions, 50k likes; 'TechReview' video - 1M views.");
  const [searchTrends, setSearchTrends] = useState("Example: 'smart home devices' +200% MoM; 'eco-friendly products' +150% MoM.");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setResult(null);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const input: IdentifyEmergingTrendsInput = {
      salesData: formData.get('salesData') as string,
      socialMediaEngagement: formData.get('socialMediaEngagement') as string,
      searchTrends: formData.get('searchTrends') as string,
    };

    try {
      const response = await identifyEmergingTrends(input);
      setResult(response);

      // Increment identified trends count in localStorage
      try {
        const currentCount = parseInt(localStorage.getItem(IDENTIFIED_TRENDS_COUNT_KEY) || '0', 10);
        localStorage.setItem(IDENTIFIED_TRENDS_COUNT_KEY, (currentCount + 1).toString());
        toast({
          title: "Trend Identified!",
          description: "The dashboard's 'Emerging Trends Identified' count has been updated.",
        });
      } catch (storageError) {
        console.error("Failed to update identified trends count in localStorage:", storageError);
      }

    } catch (e) {
      setError(e instanceof Error ? e.message : "An unknown error occurred.");
      toast({
        variant: "destructive",
        title: "Analysis Error",
        description: e instanceof Error ? e.message : "An unknown error occurred during trend analysis.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>TrendSpotter AI Input</CardTitle>
          <CardDescription>Provide data points for the AI to analyze emerging trends.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="salesData">Sales Data</Label>
              <Textarea
                id="salesData"
                name="salesData"
                placeholder="Enter real-time sales data (e.g., product sales volume, revenue)"
                rows={4}
                value={salesData}
                onChange={(e) => setSalesData(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="socialMediaEngagement">Social Media Engagement</Label>
              <Textarea
                id="socialMediaEngagement"
                name="socialMediaEngagement"
                placeholder="Enter social media metrics (e.g., likes, shares, mentions, sentiment)"
                rows={4}
                value={socialMediaEngagement}
                onChange={(e) => setSocialMediaEngagement(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="searchTrends">Search Trends</Label>
              <Textarea
                id="searchTrends"
                name="searchTrends"
                placeholder="Enter search trends data (e.g., search volume, related keywords)"
                rows={4}
                value={searchTrends}
                onChange={(e) => setSearchTrends(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Identify Trends
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {error && !isLoading && ( // Only show error if not loading
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      )}

      {result && !isLoading && ( // Only show result if not loading
        <Card>
          <CardHeader>
            <CardTitle>TrendSpotter AI Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-primary mb-2">Trend Analysis</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{result.trendAnalysis}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-primary mb-2">Product Recommendations</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{result.productRecommendations}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
