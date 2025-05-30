
"use client";

import React from 'react';
import { ClipboardEdit, Brain, ImageUp, CheckCircle2, ChevronRight, ClipboardList, DollarSign, BarChartBig, Target, Gauge, type LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Define a mapping from icon names (strings) to actual Lucide icon components
const iconMap: { [key: string]: LucideIcon } = {
  ClipboardEdit: ClipboardEdit,
  Brain: Brain,
  ImageUp: ImageUp,
  CheckCircle2: CheckCircle2,
  ClipboardList: ClipboardList,
  DollarSign: DollarSign,
  BarChartBig: BarChartBig,
  Target: Target,
  Gauge: Gauge,
};

export interface WorkflowStep {
  iconName: keyof typeof iconMap;
  title: string;
  description: string;
}

interface WorkflowIndicatorProps {
  orientation: 'vertical' | 'horizontal';
  steps: WorkflowStep[];
  title?: string;
}

export function WorkflowIndicator({ orientation, steps, title = "How It Works" }: WorkflowIndicatorProps) {
  if (!steps || steps.length === 0) {
    return null;
  }

  if (orientation === 'vertical') {
    return (
      <Card className="shadow-lg animate-fadeInUp">
        <CardHeader>
          <CardTitle className="text-lg text-primary">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {steps.map((step, index) => {
            const IconComponent = iconMap[step.iconName];
            return (
              <div key={step.title} className="relative pl-10">
                {index < steps.length - 1 && (
                  <div className="absolute left-[14px] top-8 h-[calc(100%-1rem)] w-0.5 bg-border" />
                )}
                <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {IconComponent && <IconComponent className="h-5 w-5" />}
                </div>
                <div className="pt-1">
                  <h4 className="font-semibold text-foreground">{step.title}</h4>
                  <p className="text-sm text-muted-foreground mt-0.5">{step.description}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  }

  // Horizontal orientation for mobile
  return (
    <Card className="shadow-md mb-6 animate-fadeInUp">
      <CardHeader className="pb-3 pt-4">
        <CardTitle className="text-md text-center text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-2 py-3">
        <div className="flex items-start justify-around text-center">
          {steps.map((step, index) => {
            const IconComponent = iconMap[step.iconName];
            return (
              <React.Fragment key={step.title}>
                <div className="flex flex-col items-center w-1/4 px-1">
                  <div className="mb-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground sm:h-8 sm:w-8">
                    {IconComponent && <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />}
                  </div>
                  <h5 className="text-xs font-semibold text-foreground leading-tight sm:text-sm">{step.title.substring(step.title.indexOf(' ') + 1)}</h5>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-shrink-0 pt-3 sm:pt-3.5">
                    <ChevronRight className="h-5 w-5 text-muted-foreground opacity-70 sm:h-6 sm:w-6" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
