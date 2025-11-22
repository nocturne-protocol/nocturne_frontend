import { MarketTicker } from "@/components/MarketTicker";
import { DashboardSummary } from "@/components/DashboardSummary";
import { ExploreAssets } from "@/components/ExploreAssets";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans text-gray-900 dark:text-gray-100 transition-colors">
      <MarketTicker />
      
      <main className="w-full px-15 py-8 space-y-12">
        <DashboardSummary />
        <ExploreAssets />
      </main>
    </div>
  );
}
