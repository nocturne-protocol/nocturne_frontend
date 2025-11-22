import { AssetList, Asset } from "./AssetList";

const topGainers: Asset[] = [
  { ticker: "CRCLon", name: "Circle Internet Group", price: "72.37", change: 10.19, iconColor: "#8B5CF6" },
  { ticker: "FUTUon", name: "Futu Holdings", price: "161.76", change: 5.36, iconColor: "#2563EB" },
  { ticker: "HIMSon", name: "Hims & Hers Health", price: "34.85", change: 5.06, iconColor: "#1F2937" },
];

const trending: Asset[] = [
  { ticker: "NVDAon", name: "NVIDIA", price: "180.07", change: 0.88, iconColor: "#76B900", marketCap: "$345,490,501" }, // Using market cap as secondary info like image? Image has market cap under price for trending.
  { ticker: "SPYon", name: "SPDR S&P 500 ETF", price: "660.78", change: 0.0, iconColor: "#6A1B9A", marketCap: "$123,873,392" },
  { ticker: "INTCon", name: "Intel", price: "34.51", change: 0.0, iconColor: "#0071C5", marketCap: "$105,453,706" },
];

const newlyAdded: Asset[] = [
  { ticker: "FIGon", name: "Figma", price: "34.44", change: 0.0, iconColor: "#F24E1E", marketCap: "Equities Stock" }, // Image shows "Equities Stock"
  { ticker: "AMDon", name: "AMD", price: "203.85", change: 0.0, iconColor: "#ED1C24", marketCap: "Equities Stock" },
  { ticker: "SPYon", name: "SPDR S&P 500 ETF", price: "660.78", change: 0.0, iconColor: "#6A1B9A", marketCap: "Equities ETF" },
];

export function DashboardSummary() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      <AssetList title="Top Gainers" badge="24H" assets={topGainers} />
      <AssetList title="Trending" badge="24H" assets={trending} />
      <AssetList title="Newly Added" assets={newlyAdded} />
    </div>
  );
}

