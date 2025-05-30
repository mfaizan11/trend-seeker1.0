
"use client";

import { useState, useEffect } from 'react';
import { generateMarketingTips, type GenerateMarketingTipsOutput } from '@/ai/flows/generate-marketing-tips';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb, Loader2, AlertTriangle } from 'lucide-react';

export function AiMarketingSpark() {
  const [sparks, setSparks] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSparks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await generateMarketingTips();
      setSparks(response.tips);
    } catch (e) {
      console.error("Error fetching marketing sparks:", e);
      setError(e instanceof Error ? e.message : "An unknown error occurred while fetching tips.");
      setSparks(null); 
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSparks();
  }, []);

  return (
    <Card className="mt-8 shadow-lg animate-fadeInUp">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-xl text-primary">
          <Lightbulb className="mr-2 h-6 w-6" />
          AI Marketing Spark
        </CardTitle>
        <CardDescription className="text-sm opacity-80">
          Quick marketing insights and ideas, powered by AI.
        </CardDescription>
      </CardHeader>
      <CardContent className="min-h-[150px]">
        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-5/6" />
            <Skeleton className="h-5 w-4/5" />
          </div>
        )}
        {error && !isLoading && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Fetching Sparks</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {!isLoading && !error && sparks && sparks.length > 0 && (
          <ul className="space-y-3">
            {sparks.map((spark, index) => (
              <li key={index} className="flex items-start text-sm">
                <Lightbulb className="mr-3 h-4 w-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{spark}</span>
              </li>
            ))}
          </ul>
        )}
        {!isLoading && !error && (!sparks || sparks.length === 0) && (
             <p className="text-sm text-muted-foreground">No marketing sparks available at the moment. Try refreshing!</p>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={fetchSparks} disabled={isLoading} variant="outline" size="sm">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Lightbulb className="mr-2 h-4 w-4" />
          )}
          Get New Spark
        </Button>
      </CardFooter>
    </Card>
  );
}
