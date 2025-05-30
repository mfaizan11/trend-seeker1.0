
import type {Metadata} from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { RegionProvider } from '@/contexts/region-context';
// import { AuthProvider } from '@/contexts/auth-context'; // AuthProvider removed
import { AppFooter } from '@/components/layout/app-footer';
import { MarqueeBanner } from '@/components/layout/marquee-banner';
import { MainHeader, type NavItem } from "@/components/layout/main-header";
import type { LucideIcon } from 'lucide-react';

// Configure Poppins font
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'], 
  variable: '--font-poppins', 
});

const SITE_URL = 'https://trend-seeker.netlify.app/'; 

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Trend Seeker | AI-Powered Marketing & Finance Tools',
    template: '%s | Trend Seeker',
  },
  description: 'Unlock growth with Trend Seeker: AI Marketing Tool, Profitability Calculator, and Ad Budget Analyzer. Get data-driven insights for your business.',
  keywords: ['AI marketing', 'profitability calculator', 'ad budget', 'ecommerce tools', 'business growth', 'trend seeker', 'AI advertising', 'financial calculator'],
  openGraph: {
    title: 'Trend Seeker | AI-Powered Marketing & Finance Tools',
    description: 'Unlock growth with Trend Seeker: AI Marketing Tool, Profitability Calculator, and Ad Budget Analyzer.',
    url: '/', 
    siteName: 'Trend Seeker',
    images: [
      {
        url: '/og-default.png', // Relative path, resolved by metadataBase
        width: 1200,
        height: 630,
        alt: 'Trend Seeker - AI Powered Tools for Business Growth',
        'data-ai-hint': 'abstract modern technology'
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trend Seeker | AI-Powered Marketing & Finance Tools',
    description: 'Unlock growth with Trend Seeker: AI Marketing Tool, Profitability Calculator, and Ad Budget Analyzer.',
    images: ['/og-default.png'], 
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
   
  },
  manifest: '/site.webmanifest', 
  
};


// Icons are now referenced by name (string)
const navItems: NavItem[] = [
  { href: "/", label: "AI Marketing Tool", iconName: "Lightbulb" },
  { href: "/profitability-calculator", label: "Profitability Calc", iconName: "Calculator" },
  { href: "/ad-budget-calculator", label: "Ad Budget Calc", iconName: "Target" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} dark`}>
       <head>
      
        <meta name="google-site-verification" content="ognblvgbLqQTT-hCUXDEEJRosOrDzv5OSovuL-drNZQ" />
      </head>
      <body className="font-sans antialiased overflow-x-hidden">
        <div className="blob" aria-hidden="true"></div>
        
        <div className="site-content-wrapper">
          {/* <AuthProvider> AuthProvider removed */}
            <RegionProvider>
              <MarqueeBanner />
              <MainHeader navItems={navItems} />
              <main className="flex-1 container mx-auto max-w-screen-2xl py-6 px-4 sm:px-8 bg-background">
                {children}
              </main>
              <Toaster />
              <AppFooter />
            </RegionProvider>
          {/* </AuthProvider> AuthProvider removed */}
        </div>
      </body>
    </html>
  );
}
