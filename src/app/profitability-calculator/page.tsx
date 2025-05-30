
import type { Metadata } from 'next';
import { PageHeader } from "@/components/shared/page-header";
import { ProfitabilityCalculator } from "@/components/calculators/profitability-calculator";
import { Calculator } from "lucide-react"; 
import { WorkflowIndicator, type WorkflowStep } from "@/components/shared/workflow-indicator";

const PAGE_TITLE = 'Product Profitability Calculator - Calculate Your Margins';
const PAGE_DESCRIPTION = "Easily calculate product profitability and margins with Trend Seeker's free online calculator. Factor in costs, shipping, and marketing expenses to make informed pricing decisions.";
const PAGE_KEYWORDS = ['profitability calculator', 'profit margin calculator', 'ecommerce profit', 'product pricing tool', 'cost analysis', 'business finance tool'];
const PAGE_URL = '/profitability-calculator';
const OG_IMAGE_URL = '/og-profitability-calculator.png'; // Relative path, use your actual image

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
        alt: 'Trend Seeker Profitability Calculator Interface',
        'data-ai-hint': 'calculator finance chart'
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

const profitabilityCalculatorWorkflowSteps: WorkflowStep[] = [
  {
    iconName: "ClipboardList",
    title: "1. Input Costs",
    description: "Enter product cost, shipping, and marketing expenses per unit.",
  },
  {
    iconName: "DollarSign",
    title: "2. Set Price",
    description: "Define the selling price for your product per unit.",
  },
  {
    iconName: "BarChartBig",
    title: "3. See Results",
    description: "Instantly view your estimated profit and profit margin.",
  },
];

export default function ProfitabilityCalculatorPage() {
  return (
    <>
      <PageHeader
        title="Profitability Calculator"
        icon={Calculator}
      />
      <div className="lg:flex lg:flex-row-reverse lg:gap-8 lg:items-start">
        <div className="lg:w-1/3 lg:sticky h-fit">
          <div className="lg:hidden">
            <WorkflowIndicator 
              orientation="horizontal" 
              steps={profitabilityCalculatorWorkflowSteps} 
              title="Calculator Workflow" 
            />
          </div>
          <div className="hidden lg:block">
            <WorkflowIndicator 
              orientation="vertical" 
              steps={profitabilityCalculatorWorkflowSteps}
              title="Calculator Workflow"
            />
          </div>
        </div>
        <div className="lg:flex-grow">
          <ProfitabilityCalculator />
        </div>
      </div>
    </>
  );
}
