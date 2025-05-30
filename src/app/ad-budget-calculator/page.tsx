
import type { Metadata } from 'next';
import { PageHeader } from "@/components/shared/page-header";
import { AdBudgetCalculator } from "@/components/calculators/ad-budget-calculator";
import { Target as TargetIcon } from "lucide-react";
import { WorkflowIndicator, type WorkflowStep } from "@/components/shared/workflow-indicator";

const PAGE_TITLE = 'Ad Budget Calculator & AI Strategy Analysis';
const PAGE_DESCRIPTION = 'Estimate Meta & Google ad spend with Trend Seeker\'s Ad Budget Calculator. Get AI-powered strategy analysis for your product advertising budget and campaign triggers.';
const PAGE_KEYWORDS = ['ad budget calculator', 'advertising spend estimator', 'ROAS calculator', 'Meta ad budget', 'Google ad budget', 'AI ad strategy', 'PPC budget tool'];
const PAGE_URL = '/ad-budget-calculator';
const OG_IMAGE_URL = '/og-ad-budget-calculator.png'; // Relative path, use your actual image

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: PAGE_KEYWORDS,
  alternates: {
    canonical: PAGE_URL, // metadataBase in layout.tsx will make this absolute
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL, // metadataBase in layout.tsx will make this absolute
    images: [
      {
        url: OG_IMAGE_URL, // Relative path, resolved by metadataBase
        width: 1200,
        height: 630,
        alt: 'Trend Seeker Ad Budget Calculator and AI Analyzer',
        'data-ai-hint': 'advertising chart graph'
      }
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [OG_IMAGE_URL], // Relative path, resolved by metadataBase
  },
};

const adBudgetCalculatorWorkflowSteps: WorkflowStep[] = [
  {
    iconName: "ClipboardList",
    title: "1. Input Metrics",
    description: "Enter product price, costs, and advertising goals.",
  },
  {
    iconName: "Target",
    title: "2. Set ROAS & Sales",
    description: "Define target ROAS and monthly sales units.",
  },
  {
    iconName: "Gauge",
    title: "3. View Budgets",
    description: "See estimated ad spend for Meta & Google and profit projections.",
  },
  {
    iconName: "Brain",
    title: "4. AI Analysis (Optional)",
    description: "Get AI-powered strategy feedback and campaign insights.",
  },
];


export default function AdBudgetCalculatorPage() {
  return (
    <>
      <PageHeader
        title="Advertising Budget Calculator"
        icon={TargetIcon} 
      />
      <div className="lg:flex lg:flex-row-reverse lg:gap-8 lg:items-start">
        <div className="lg:w-1/3 lg:sticky h-fit">
          <div className="lg:hidden">
            <WorkflowIndicator
              orientation="horizontal"
              steps={adBudgetCalculatorWorkflowSteps}
              title="Calculator Workflow"
            />
          </div>
          <div className="hidden lg:block">
            <WorkflowIndicator
              orientation="vertical"
              steps={adBudgetCalculatorWorkflowSteps}
              title="Calculator Workflow"
            />
          </div>
        </div>
        <div className="lg:flex-grow">
          <AdBudgetCalculator />
        </div>
      </div>
    </>
  );
}
