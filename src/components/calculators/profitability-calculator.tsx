
"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign, TrendingDown, TrendingUp, Percent, ArrowDownCircle } from 'lucide-react';
import { useRegion } from '@/contexts/region-context';

interface FormData {
  productCost: string;
  shippingFees: string;
  marketingExpenses: string;
  sellingPrice: string;
}

export function ProfitabilityCalculator() {
  const { selectedRegion } = useRegion();
  const [formData, setFormData] = useState<FormData>({
    productCost: '25.00',
    shippingFees: '5.00',
    marketingExpenses: '10.00',
    sellingPrice: '75.00',
  });
  const [result, setResult] = useState<{ profit: number; margin: number } | null>(null);
  const resultsCardRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateProfitability = () => {
    const productCost = parseFloat(formData.productCost) || 0;
    const shippingFees = parseFloat(formData.shippingFees) || 0;
    const marketingExpenses = parseFloat(formData.marketingExpenses) || 0;
    const sellingPrice = parseFloat(formData.sellingPrice) || 0;

    if (sellingPrice <= 0) {
      setResult(null); 
      return;
    }

    const totalCost = productCost + shippingFees + marketingExpenses;
    const profit = sellingPrice - totalCost;
    const margin = (profit / sellingPrice) * 100;

    setResult({ profit, margin });
  };
  
  useEffect(() => {
    calculateProfitability();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);
  
  const formatCurrencyValue = (value: number) => {
    return isNaN(value) ? `${selectedRegion.symbol}0.00` : `${selectedRegion.symbol}${value.toFixed(2)}`;
  }

  const handleScrollToResults = () => {
    resultsCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-8">
      <Card className="animate-fadeInUp">
        <CardHeader>
          <CardTitle>Profitability Calculator</CardTitle>
          <CardDescription className="text-sm opacity-80">Estimate potential profit margins for your products. Current currency: {selectedRegion.currency}</CardDescription>
        </CardHeader>
        <form>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="productCost">Product Cost (per unit)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">{selectedRegion.symbol}</span>
                <Input id="productCost" name="productCost" type="number" step="0.01" placeholder="e.g., 25.00" value={formData.productCost} onChange={handleChange} className="pl-9" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="shippingFees">Shipping Fees (per unit)</Label>
              <div className="relative">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">{selectedRegion.symbol}</span>
                <Input id="shippingFees" name="shippingFees" type="number" step="0.01" placeholder="e.g., 5.00" value={formData.shippingFees} onChange={handleChange} className="pl-9" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="marketingExpenses">Marketing Expenses (per unit)</Label>
              <div className="relative">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">{selectedRegion.symbol}</span>
                <Input id="marketingExpenses" name="marketingExpenses" type="number" step="0.01" placeholder="e.g., 10.00" value={formData.marketingExpenses} onChange={handleChange} className="pl-9" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sellingPrice">Selling Price (per unit)</Label>
              <div className="relative">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">{selectedRegion.symbol}</span>
                <Input id="sellingPrice" name="sellingPrice" type="number" step="0.01" placeholder="e.g., 75.00" value={formData.sellingPrice} onChange={handleChange} className="pl-9" required />
              </div>
            </div>
          </CardContent>
        </form>
      </Card>

      {result !== null && (
        <div className="md:hidden text-center mb-4">
          <Button onClick={handleScrollToResults} variant="outline" size="sm">
            <ArrowDownCircle className="mr-2 h-4 w-4" />
            View Results
          </Button>
        </div>
      )}

      {result !== null && (
        <Card ref={resultsCardRef} className="bg-gradient-to-r from-primary/10 to-accent/10">
          <CardHeader>
            <CardTitle className="text-primary">Estimated Profitability</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6 text-center md:text-left">
            <div className="p-6 rounded-lg bg-card shadow">
              <div className="flex items-center justify-center md:justify-start text-muted-foreground mb-2">
                <DollarSign className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Potential Profit per Unit</span>
              </div>
              <p className={`text-4xl font-bold ${result.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrencyValue(result.profit)}
              </p>
            </div>
            <div className="p-6 rounded-lg bg-card shadow">
              <div className="flex items-center justify-center md:justify-start text-muted-foreground mb-2">
                <Percent className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Profit Margin</span>
              </div>
              <p className={`text-4xl font-bold ${result.margin >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {result.margin.toFixed(2)}%
              </p>
            </div>
          </CardContent>
           <CardFooter className="text-sm text-muted-foreground">
            Note: This is an estimate. Actual profitability may vary based on other factors. All currency values are in {selectedRegion.currency}.
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
