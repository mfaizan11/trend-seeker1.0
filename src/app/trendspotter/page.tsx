
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/shared/page-header";
import { TrendSpotterForm } from "@/components/forms/trend-spotter-form";
import { TrendingUp } from "lucide-react";

export default function TrendSpotterPage() {
  return (
    <AppShell>
      <PageHeader 
        title="TrendSpotter AI" 
        description="Identify emerging product trends by analyzing real-time sales data, social media engagement, and search trends."
        icon={TrendingUp}
      />
      <TrendSpotterForm />
    </AppShell>
  );
}
