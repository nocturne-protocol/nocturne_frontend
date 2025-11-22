import { Navbar } from "@/components/Navbar";
import { MarketTicker } from "@/components/MarketTicker";
import { DashboardSummary } from "@/components/DashboardSummary";
import { ExploreAssets } from "@/components/ExploreAssets";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />
      <MarketTicker />
      
      <main className="w-full px-15 py-8 space-y-12">
        <DashboardSummary />
        <ExploreAssets />
      </main>
    </div>
  );
}
