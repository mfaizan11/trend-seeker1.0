
import type { Metadata } from 'next';
import { PageHeader } from "@/components/shared/page-header";
import { AiMarketingToolForm } from "@/components/forms/ai-marketing-tool-form";
import { AiMarketingSpark } from "@/components/marketing-spark/ai-marketing-spark"; 
import { Lightbulb } from "lucide-react";

const PAGE_TITLE = 'AI Marketing Tool - Ad Copy, Images & Campaign Content';
const PAGE_DESCRIPTION = 'Boost your campaigns! Use Trend Seeker\'s AI Marketing Tool to instantly generate compelling ad copy, image prompts, product descriptions, and full campaign content for Meta & Google.';
const PAGE_KEYWORDS = ['AI marketing tool', 'ad copy generator', 'AI content creation', 'product description generator', 'Meta ads AI', 'Google ads AI', 'digital advertising AI', 'campaign generator'];
const PAGE_URL = '/'; // Root page
const OG_IMAGE_URL = '/og-ai-marketing-tool.png'; // Relative path, use your actual image

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
        alt: 'Trend Seeker AI Marketing Tool Interface for Ad Generation',
        'data-ai-hint': 'marketing analytics dashboard' 
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

export default function AiMarketingToolHomePage() {
  return (
    <>
      <PageHeader
        title="AI Marketing Tool"
        icon={Lightbulb}
      />
      <AiMarketingToolForm />
      <AiMarketingSpark />
    </>
  );
}
