import Head from 'next/head';
import type { Metadata } from 'next';
import { PageHeader } from "@/components/shared/page-header";
import { AiMarketingToolForm } from "@/components/forms/ai-marketing-tool-form";
import { AiMarketingSpark } from "@/components/marketing-spark/ai-marketing-spark"; 
import { Lightbulb } from "lucide-react";

const PAGE_TITLE = 'AI Marketing Tool - Ad Copy, Images & Campaign Content';
const PAGE_DESCRIPTION = 'Boost your campaigns! Use Trend Seeker\'s AI Marketing Tool to instantly generate compelling ad copy, image prompts, product descriptions, and full campaign content for Meta & Google.';
const PAGE_KEYWORDS = ['AI marketing tool', 'ad copy generator', 'AI content creation', 'product description generator', 'Meta ads AI', 'Google ads AI', 'digital advertising AI', 'campaign generator'];
const PAGE_URL = '/'; 
// const OG_IMAGE_URL = '/og-ai-marketing-tool.png'; 

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: PAGE_KEYWORDS,
  alternates: {
    canonical: PAGE_URL, 
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL, 
    images: [
      {
        // url: OG_IMAGE_URL, 
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
    // images: [OG_IMAGE_URL], 
  },
};

export default function AiMarketingToolHomePage() {
  return (
    
    <>
       <Head>
        <meta name="google-site-verification" content="ognblvgbLqQTT-hCUXDEEJRosOrDzv5OSovuL-drNZQ" />
      </Head>
      <PageHeader
        title="AI Marketing Tool"
        icon={Lightbulb}
      />
      <AiMarketingToolForm />
      <AiMarketingSpark />
    </>
  );
}
