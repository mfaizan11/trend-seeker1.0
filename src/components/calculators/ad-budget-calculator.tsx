
"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign, Target, TrendingUp, Info, Lightbulb, Loader2, Brain, CheckCircle, AlertTriangle, CalendarDays, Eye, MousePointerClick, Gauge, Percent as PercentIcon, AlertOctagon, PauseCircle, ArrowDownCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useRegion } from '@/contexts/region-context';
import { analyzeAdBudgetStrategy, type AnalyzeAdBudgetStrategyInput, type AnalyzeAdBudgetStrategyOutput, type StrategyFeedback, type CampaignOverview } from '@/ai/flows/analyze-ad-budget-strategy';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface FormData {
  sellingPrice: string;
  productCost: string;
  shippingCost: string;
  targetROASMeta: string;
  targetROASGoogle: string;
  monthlySalesGoal: string;
  productCategory: string;
}

interface PlatformCalculations {
  maxAdSpendPerSale: number;
  monthlyAdBudget: number;
  dailyAdBudget: number;
  netProfitPerSaleAfterAds: number;
  projectedMonthlyNetProfit: number;
  warning?: string;
}

interface CalculationResult {
  profitPerUnitBeforeAds: number;
  meta: PlatformCalculations;
  google: PlatformCalculations;
}

export function AdBudgetCalculator() {
  const { selectedRegion } = useRegion();
  const [formData, setFormData] = useState<FormData>({
    sellingPrice: '100',
    productCost: '30',
    shippingCost: '10',
    targetROASMeta: '3',
    targetROASGoogle: '4',
    monthlySalesGoal: '100',
    productCategory: 'Electronics',
  });
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AnalyzeAdBudgetStrategyOutput | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const resultsCardRef = useRef<HTMLDivElement>(null);
  const aiResultsCardRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setAiAnalysis(null); 
    setAiError(null);
  };

  const formatCurrency = (value: number) => {
    return isNaN(value) ? `${selectedRegion.symbol}0.00` : `${selectedRegion.symbol}${value.toFixed(2)}`;
  }

  const formatNumber = (value?: number) => {
    if (value === undefined || isNaN(value)) return 'N/A';
    return value.toLocaleString();
  }

  const calculateAdBudget = () => {
    const sellingPrice = parseFloat(formData.sellingPrice) || 0;
    const productCost = parseFloat(formData.productCost) || 0;
    const shippingCost = parseFloat(formData.shippingCost) || 0;

    let formTargetROASMeta = parseFloat(formData.targetROASMeta);
    let formTargetROASGoogle = parseFloat(formData.targetROASGoogle);

    const calculationTargetROASMeta = (isNaN(formTargetROASMeta) || formTargetROASMeta <= 0) ? 1 : formTargetROASMeta;
    const calculationTargetROASGoogle = (isNaN(formTargetROASGoogle) || formTargetROASGoogle <= 0) ? 1 : formTargetROASGoogle;

    const monthlySalesGoal = parseInt(formData.monthlySalesGoal, 10) || 0;

    if (sellingPrice <= 0 || productCost < 0 || shippingCost < 0 || monthlySalesGoal < 0) {
      setResult(null);
      return;
    }

    const profitPerUnitBeforeAds = sellingPrice - (productCost + shippingCost);
    const baseCosts = productCost + shippingCost;

    const calculatePlatform = (userInputTargetROAS: number, calculationTargetROAS: number, platformName: string): PlatformCalculations => {
      let warning;

      const maxAdSpendPerSale = sellingPrice / calculationTargetROAS;
      const netProfitPerSaleAfterAds = profitPerUnitBeforeAds - maxAdSpendPerSale;
      const projectedMonthlyNetProfit = netProfitPerSaleAfterAds * monthlySalesGoal;
      const monthlyAdBudget = maxAdSpendPerSale * monthlySalesGoal;
      const dailyAdBudget = monthlyAdBudget / 30; 

      const roasInputForWarning = platformName === 'Meta' ? formData.targetROASMeta : formData.targetROASGoogle;

      if (isNaN(userInputTargetROAS) || userInputTargetROAS <= 0) {
        warning = `Invalid Target ROAS for ${platformName} (${roasInputForWarning || 'empty'}). It must be a positive number. Calculations are using a default of ${calculationTargetROAS.toFixed(2)}x.`;
      } else if (userInputTargetROAS <= 1) {
        warning = `A target ROAS of ${userInputTargetROAS.toFixed(2)}x for ${platformName} means for every ${formatCurrency(sellingPrice)} in ad revenue, you'd spend ${formatCurrency(sellingPrice / userInputTargetROAS)}. This results in a loss of at least ${formatCurrency(baseCosts + ((sellingPrice / userInputTargetROAS) - sellingPrice))} per sale. This strategy is generally unsustainable.`;
      } else {
        const requiredSellingPriceForROAS = baseCosts * (userInputTargetROAS / (userInputTargetROAS - 1));

        if (profitPerUnitBeforeAds <= 0) {
          warning = `Product is not profitable before ad spend (selling price doesn't cover product & shipping costs). `;
          if (isFinite(requiredSellingPriceForROAS)) {
            warning += `To cover these base costs AND achieve your target ${userInputTargetROAS.toFixed(2)}x ROAS for ${platformName}, your selling price would need to be at least ${formatCurrency(requiredSellingPriceForROAS)}.`;
          }
        } else if (netProfitPerSaleAfterAds < 0) {
          warning = `Current pricing leads to a loss of ${formatCurrency(Math.abs(netProfitPerSaleAfterAds))} per sale with a ${userInputTargetROAS.toFixed(2)}x ROAS for ${platformName} (ad spend ${formatCurrency(maxAdSpendPerSale)} vs. pre-ad profit ${formatCurrency(profitPerUnitBeforeAds)}). `;
          if (isFinite(requiredSellingPriceForROAS)) {
            warning += `To break even on ad costs at this ROAS (making net profit from ads zero), consider increasing selling price to at least ${formatCurrency(requiredSellingPriceForROAS)}. For actual profit, aim higher.`;
          }
        }
      }
      return { maxAdSpendPerSale, monthlyAdBudget, dailyAdBudget, netProfitPerSaleAfterAds, projectedMonthlyNetProfit, warning };
    };

    setResult({
      profitPerUnitBeforeAds,
      meta: calculatePlatform(formTargetROASMeta, calculationTargetROASMeta, 'Meta'),
      google: calculatePlatform(formTargetROASGoogle, calculationTargetROASGoogle, 'Google'),
    });
  };

  useEffect(() => {
    calculateAdBudget();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, selectedRegion]);

  useEffect(() => {
    if (aiAnalysis && aiResultsCardRef.current) {
        aiResultsCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [aiAnalysis]);
  
  const handleScrollToResults = () => {
    resultsCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleAiAnalysis = async () => {
    setIsAiLoading(true);
    setAiAnalysis(null);
    setAiError(null);

    const input: AnalyzeAdBudgetStrategyInput = {
      sellingPrice: parseFloat(formData.sellingPrice) || 0,
      productCost: parseFloat(formData.productCost) || 0,
      shippingCost: parseFloat(formData.shippingCost) || 0,
      targetROASMeta: parseFloat(formData.targetROASMeta) || 0,
      targetROASGoogle: parseFloat(formData.targetROASGoogle) || 0,
      monthlySalesGoal: parseInt(formData.monthlySalesGoal, 10) || 0,
      productCategory: formData.productCategory,
      currency: selectedRegion.currency,
    };

    try {
      const response = await analyzeAdBudgetStrategy(input);
      setAiAnalysis(response);
    } catch (e) {
      setAiError(e instanceof Error ? e.message : "An unknown error occurred during AI analysis.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const getProfitColor = (value: number) => {
    if (isNaN(value)) return 'text-muted-foreground';
    return value >= 0 ? 'text-green-500' : 'text-red-500';
  };

  const renderCampaignOverview = (overview?: CampaignOverview) => {
    if (!overview) return <p className="text-muted-foreground text-sm">No campaign overview data available.</p>;

    return (
      <div className="space-y-4 mt-4 pt-4 border-t border-border/50">
        <h4 className="font-semibold text-md text-accent mb-3">Campaign Overview & Triggers</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 text-sm mb-3">
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-2 text-muted-foreground shrink-0" />
            <span>Est. Impressions: <strong className="text-foreground">{formatNumber(overview.estimatedImpressions)}</strong></span>
          </div>
          <div className="flex items-center">
            <MousePointerClick className="h-4 w-4 mr-2 text-muted-foreground shrink-0" />
            <span>Est. Clicks: <strong className="text-foreground">{formatNumber(overview.estimatedClicks)}</strong></span>
          </div>
          <div className="flex items-center">
            <Target className="h-4 w-4 mr-2 text-muted-foreground shrink-0" />
            <span>Target CTR: <strong className="text-foreground">{overview.targetCTR || 'N/A'}</strong></span>
          </div>
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 mr-2 text-muted-foreground shrink-0" />
            <span>Target CPC: <strong className="text-foreground">{overview.targetCPC !== undefined ? formatCurrency(overview.targetCPC) : 'N/A'}</strong></span>
          </div>
          <div className="flex items-center sm:col-span-2 lg:col-span-1">
            <PercentIcon className="h-4 w-4 mr-2 text-muted-foreground shrink-0" />
            <span>Assumed CVR: <strong className="text-foreground">{overview.estimatedConversionRate || 'N/A'}</strong></span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground italic mt-1">Note: Impressions, Clicks, CTR, CPC, and CVR are AI-generated estimates based on your inputs and typical industry benchmarks. Actual results will vary.</p>

        {overview.scalingTriggers && overview.scalingTriggers.length > 0 && (
          <div className="mt-4">
            <h5 className="font-medium text-foreground mb-1.5 flex items-center"><TrendingUp className="h-5 w-5 mr-2 text-green-500"/>Scaling Triggers:</h5>
            <ul className="space-y-1.5">
              {overview.scalingTriggers.map((trigger, idx) => (
                <li key={`scale-${idx}`} className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500 shrink-0" />
                  <span className="text-muted-foreground text-sm">{trigger}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {overview.pauseTriggers && overview.pauseTriggers.length > 0 && (
          <div className="mt-4">
            <h5 className="font-medium text-foreground mb-1.5 flex items-center"><AlertOctagon className="h-5 w-5 mr-2 text-yellow-500"/>Pause/Review Triggers:</h5>
            <ul className="space-y-1.5">
              {overview.pauseTriggers.map((trigger, idx) => (
                <li key={`pause-${idx}`} className="flex items-start">
                  <PauseCircle className="h-4 w-4 mr-2 mt-0.5 text-yellow-500 shrink-0" />
                  <span className="text-muted-foreground text-sm">{trigger}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };


  const renderStrategyDetails = (strategy?: StrategyFeedback, platformName?: string) => {
    if (!strategy) return <p className="text-muted-foreground text-sm">No analysis data available for this platform.</p>;

    const noDetails = (!strategy.positivePoints || strategy.positivePoints.length === 0) &&
                      (!strategy.concerns || strategy.concerns.length === 0) &&
                      (!strategy.suggestions || strategy.suggestions.length === 0);

    const hasCampaignOverview = !!strategy.campaignOverview;

    if (noDetails && !strategy.assessment && !hasCampaignOverview) {
         return <p className="text-muted-foreground text-sm">No specific details provided by the AI for {platformName || 'this platform'}.</p>;
    }

    return (
      <div className="space-y-4 pl-2 pr-1">
        {strategy.assessment && (
             <p className="text-sm italic text-muted-foreground">AI Assessment: <Badge variant="outline" className="ml-1 text-sm py-0.5 px-1.5">{strategy.assessment}</Badge></p>
        )}
        {strategy.positivePoints && strategy.positivePoints.length > 0 && (
          <div className="mt-3">
            <h5 className="font-medium text-foreground mb-1.5 flex items-center"><CheckCircle className="h-5 w-5 mr-2 text-green-500"/>Positive Points:</h5>
            <ul className="space-y-1.5">
              {strategy.positivePoints.map((point, idx) => (
                <li key={`pos-${idx}`} className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500 shrink-0 opacity-70" />
                  <span className="text-muted-foreground text-sm">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {strategy.concerns && strategy.concerns.length > 0 && (
          <div className="mt-3">
            <h5 className="font-medium text-foreground mb-1.5 flex items-center"><AlertTriangle className="h-5 w-5 mr-2 text-yellow-500"/>Concerns:</h5>
            <ul className="space-y-1.5">
              {strategy.concerns.map((concern, idx) => (
                <li key={`con-${idx}`} className="flex items-start">
                  <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 text-yellow-500 shrink-0 opacity-70" />
                  <span className="text-muted-foreground text-sm">{concern}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {strategy.suggestions && strategy.suggestions.length > 0 && (
          <div className="mt-3">
            <h5 className="font-medium text-foreground mb-1.5 flex items-center"><Lightbulb className="h-5 w-5 mr-2 text-blue-500"/>Suggestions:</h5>
            <ul className="space-y-1.5">
              {strategy.suggestions.map((suggestion, idx) => (
                <li key={`sug-${idx}`} className="flex items-start">
                  <Lightbulb className="h-4 w-4 mr-2 mt-0.5 text-blue-500 shrink-0 opacity-70" />
                  <span className="text-muted-foreground text-sm">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {noDetails && strategy.assessment && !hasCampaignOverview && (
             <p className="text-muted-foreground text-sm italic mt-2">Overall assessment is "{strategy.assessment}", but no further specific points (positives, concerns, suggestions) were provided by the AI for this section.</p>
        )}
        {strategy.campaignOverview && renderCampaignOverview(strategy.campaignOverview)}
      </div>
    );
  };


  return (
    <div className="space-y-8">
      <Card className="animate-fadeInUp">
        <CardHeader>
          <CardTitle>Ad Budget Inputs</CardTitle>
          <CardDescription className="text-sm opacity-80">Enter your product and advertising goal metrics. Current currency: {selectedRegion.currency}</CardDescription>
        </CardHeader>
        <form>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sellingPrice">Product Selling Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">{selectedRegion.symbol}</span>
                  <Input id="sellingPrice" name="sellingPrice" type="number" step="0.01" placeholder="e.g., 100.00" value={formData.sellingPrice} onChange={handleChange} className="pl-9" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="productCost">Product Cost (COGS)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">{selectedRegion.symbol}</span>
                  <Input id="productCost" name="productCost" type="number" step="0.01" placeholder="e.g., 30.00" value={formData.productCost} onChange={handleChange} className="pl-9" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shippingCost">Shipping Cost (per unit)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">{selectedRegion.symbol}</span>
                  <Input id="shippingCost" name="shippingCost" type="number" step="0.01" placeholder="e.g., 10.00" value={formData.shippingCost} onChange={handleChange} className="pl-9" required />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="targetROASMeta">Target ROAS (Meta)</Label>
                 <div className="relative">
                  <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="targetROASMeta" name="targetROASMeta" type="number" step="0.1" placeholder="e.g., 3 (for 300%)" value={formData.targetROASMeta} onChange={handleChange} className="pl-8" required />
                </div>
                <p className="text-xs text-muted-foreground opacity-70">E.g., 3 for 3:1 return. Must be > 0.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetROASGoogle">Target ROAS (Google)</Label>
                 <div className="relative">
                  <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="targetROASGoogle" name="targetROASGoogle" type="number" step="0.1" placeholder="e.g., 4 (for 400%)" value={formData.targetROASGoogle} onChange={handleChange} className="pl-8" required />
                </div>
                <p className="text-xs text-muted-foreground opacity-70">E.g., 4 for 4:1 return. Must be > 0.</p>
              </div>
                 <div className="space-y-2">
                <Label htmlFor="productCategory">Product Category (Optional)</Label>
                 <div className="relative">
                  <Input id="productCategory" name="productCategory" type="text" placeholder="e.g., Electronics, Apparel" value={formData.productCategory} onChange={handleChange} className="pl-3" />
                </div>
                <p className="text-xs text-muted-foreground opacity-70">Helps AI provide more specific advice.</p>
              </div>
            </div>
            <div className="space-y-4 lg:col-span-1">
               <div className="space-y-2">
                <Label htmlFor="monthlySalesGoal">Desired Monthly Sales (Units)</Label>
                 <div className="relative">
                  <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="monthlySalesGoal" name="monthlySalesGoal" type="number" step="1" placeholder="e.g., 100" value={formData.monthlySalesGoal} onChange={handleChange} className="pl-8" required />
                </div>
                <p className="text-xs text-muted-foreground opacity-70">Total units you aim to sell via ads.</p>
              </div>
            </div>
          </CardContent>
        </form>
      </Card>

      {result !== null && (
         <div className="md:hidden text-center my-4">
          <Button onClick={handleScrollToResults} variant="outline" size="sm">
            <ArrowDownCircle className="mr-2 h-4 w-4" />
            View Results
          </Button>
        </div>
      )}

      {result !== null && (
        <Card ref={resultsCardRef} className="bg-card">
          <CardHeader>
            <CardTitle className="text-primary flex items-center"><Gauge className="mr-2 h-6 w-6" /> Estimated Ad Budgets & Profitability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-lg bg-muted/50 shadow text-center">
              <Label className="text-sm font-medium text-muted-foreground">Profit Per Unit (Before Ad Spend)</Label>
              <p className={`text-3xl font-bold ${getProfitColor(result.profitPerUnitBeforeAds)}`}>
                {formatCurrency(result.profitPerUnitBeforeAds)}
              </p>
              {result.profitPerUnitBeforeAds <=0 && (
                 <p className="text-xs text-destructive mt-1">
                    Product is not profitable before considering ad spend.
                  </p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              
              <div className="p-6 rounded-lg bg-muted/50 shadow space-y-3">
                <h3 className="text-xl font-semibold text-center text-foreground">Meta Ads</h3>
                {result.meta.warning && (
                  <div className="p-3 text-xs bg-destructive/10 text-destructive border border-destructive/30 rounded-md flex items-start">
                    <Info className="h-4 w-4 mr-2 shrink-0 mt-0.5" />
                    <p className="whitespace-pre-wrap">{result.meta.warning}</p>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <Label className="text-sm text-muted-foreground">Max Ad Spend Per Sale:</Label>
                  <span className={`font-semibold ${getProfitColor(result.profitPerUnitBeforeAds - result.meta.maxAdSpendPerSale)}`}>{formatCurrency(result.meta.maxAdSpendPerSale)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <Label className="text-sm text-muted-foreground">Monthly Ad Budget:</Label>
                  <span className={`font-semibold ${getProfitColor(result.profitPerUnitBeforeAds - result.meta.maxAdSpendPerSale)}`}>{formatCurrency(result.meta.monthlyAdBudget)}</span>
                </div>
                 <div className="flex justify-between items-center">
                  <Label className="text-sm text-muted-foreground flex items-center"><CalendarDays className="w-3.5 h-3.5 mr-1.5 text-muted-foreground/70"/>Est. Daily Ad Budget:</Label>
                  <span className={`font-semibold ${getProfitColor(result.profitPerUnitBeforeAds - result.meta.maxAdSpendPerSale)}`}>{formatCurrency(result.meta.dailyAdBudget)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <Label className="text-sm text-muted-foreground">Net Profit Per Sale (After Ads):</Label>
                  <span className={`font-bold ${getProfitColor(result.meta.netProfitPerSaleAfterAds)}`}>{formatCurrency(result.meta.netProfitPerSaleAfterAds)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <Label className="text-sm text-muted-foreground">Projected Monthly Net Profit:</Label>
                  <span className={`font-bold text-lg ${getProfitColor(result.meta.projectedMonthlyNetProfit)}`}>{formatCurrency(result.meta.projectedMonthlyNetProfit)}</span>
                </div>
              </div>

              
              <div className="p-6 rounded-lg bg-muted/50 shadow space-y-3">
                <h3 className="text-xl font-semibold text-center text-foreground">Google Ads</h3>
                 {result.google.warning && (
                  <div className="p-3 text-xs bg-destructive/10 text-destructive border border-destructive/30 rounded-md flex items-start">
                    <Info className="h-4 w-4 mr-2 shrink-0 mt-0.5" />
                     <p className="whitespace-pre-wrap">{result.google.warning}</p>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <Label className="text-sm text-muted-foreground">Max Ad Spend Per Sale:</Label>
                  <span className={`font-semibold ${getProfitColor(result.profitPerUnitBeforeAds - result.google.maxAdSpendPerSale)}`}>{formatCurrency(result.google.maxAdSpendPerSale)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <Label className="text-sm text-muted-foreground">Monthly Ad Budget:</Label>
                  <span className={`font-semibold ${getProfitColor(result.profitPerUnitBeforeAds - result.google.maxAdSpendPerSale)}`}>{formatCurrency(result.google.monthlyAdBudget)}</span>
                </div>
                 <div className="flex justify-between items-center">
                  <Label className="text-sm text-muted-foreground flex items-center"><CalendarDays className="w-3.5 h-3.5 mr-1.5 text-muted-foreground/70"/>Est. Daily Ad Budget:</Label>
                  <span className={`font-semibold ${getProfitColor(result.profitPerUnitBeforeAds - result.google.maxAdSpendPerSale)}`}>{formatCurrency(result.google.dailyAdBudget)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <Label className="text-sm text-muted-foreground">Net Profit Per Sale (After Ads):</Label>
                  <span className={`font-bold ${getProfitColor(result.google.netProfitPerSaleAfterAds)}`}>{formatCurrency(result.google.netProfitPerSaleAfterAds)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <Label className="text-sm text-muted-foreground">Projected Monthly Net Profit:</Label>
                  <span className={`font-bold text-lg ${getProfitColor(result.google.projectedMonthlyNetProfit)}`}>{formatCurrency(result.google.projectedMonthlyNetProfit)}</span>
                </div>
              </div>
            </div>
            <div className="mt-6 text-center">
                <Button onClick={handleAiAnalysis} disabled={isAiLoading || !result} size="lg">
                  {isAiLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing Strategy...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-5 w-5" />
                      Get AI Strategy Analysis
                    </>
                  )}
                </Button>
              </div>
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground">
            <Info className="h-3 w-3 mr-1.5 shrink-0" /> Note: These are estimates. Actual results depend on campaign performance, CPCs, conversion rates, and other market factors. Assumes the monthly sales goal is achieved through the respective platform. All currency values are in {selectedRegion.currency}. Daily budget assumes a 30-day month.
          </CardFooter>
        </Card>
      )}

      {isAiLoading && (
        <div className="flex justify-center items-center p-10">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-lg text-muted-foreground">AI is analyzing your strategy...</p>
        </div>
      )}

      {aiError && (
        <Alert variant="destructive" className="mt-6">
          <AlertTitle>AI Analysis Error</AlertTitle>
          <AlertDescription>{aiError}</AlertDescription>
        </Alert>
      )}

      {aiAnalysis && !isAiLoading && (
        <Card ref={aiResultsCardRef} className="mt-8 border-accent">
          <CardHeader>
            <CardTitle className="text-accent flex items-center"><Lightbulb className="mr-2 h-6 w-6"/> AI Ad Strategy Analysis</CardTitle>
            <CardDescription className="text-sm opacity-80">Strategic insights, estimated metrics, and campaign triggers from our AI based on your inputs.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Accordion type="multiple" defaultValue={['meta', 'google', 'general']} className="w-full">
              <AccordionItem value="meta">
                <AccordionTrigger className="text-xl font-semibold text-primary hover:no-underline py-4">
                  <div className="flex items-center justify-between w-full">
                    <span>Meta Strategy</span>
                    {aiAnalysis.metaStrategy.assessment && <Badge variant="outline" className="ml-3 text-sm py-0.5 px-1.5">{aiAnalysis.metaStrategy.assessment}</Badge>}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4">
                  {renderStrategyDetails(aiAnalysis.metaStrategy, "Meta")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="google">
                <AccordionTrigger className="text-xl font-semibold text-primary hover:no-underline py-4">
                   <div className="flex items-center justify-between w-full">
                    <span>Google Ads Strategy</span>
                    {aiAnalysis.googleStrategy.assessment && <Badge variant="outline" className="ml-3 text-sm py-0.5 px-1.5">{aiAnalysis.googleStrategy.assessment}</Badge>}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4">
                   {renderStrategyDetails(aiAnalysis.googleStrategy, "Google Ads")}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="general">
                <AccordionTrigger className="text-xl font-semibold text-primary hover:no-underline py-4">
                  General Recommendations
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4">
                  {aiAnalysis.generalRecommendations && aiAnalysis.generalRecommendations.length > 0 ? (
                    <ul className="space-y-1.5 pl-2">
                      {aiAnalysis.generalRecommendations.map((item, index) => (
                        <li key={`gen-${index}`} className="flex items-start">
                          <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500 shrink-0" />
                          <span className="text-muted-foreground text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground text-sm">No general recommendations provided.</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
