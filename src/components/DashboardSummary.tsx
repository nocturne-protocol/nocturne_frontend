'use client';

import { AssetList, Asset } from "./AssetList";
import { useEffect, useState } from "react";

interface MarketData {
  ticker: string;
  name: string;
  price: string;
  change: number;
  changeValue: string;
  iconColor: string;
  category?: string;
}

export function DashboardSummary() {
  const [topGainers, setTopGainers] = useState<Asset[]>([]);
  const [trending, setTrending] = useState<Asset[]>([]);
  const [newlyAdded, setNewlyAdded] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/market-data');
        const result = await response.json();
        
        if (result.data && result.data.length > 0) {
          const assets: MarketData[] = result.data;
          
          // Top Gainers: Sort by highest positive change
          const gainers = [...assets]
            .filter(a => a.change > 0)
            .sort((a, b) => b.change - a.change)
            .slice(0, 3)
            .map(a => ({
              ticker: a.ticker,
              name: a.name,
              price: a.price,
              change: a.change,
              iconColor: a.iconColor,
            }));
          
          // Trending: Take the first 3 assets (could be sorted by volume in real scenario)
          const trendingAssets = assets.slice(0, 3).map(a => ({
            ticker: a.ticker,
            name: a.name,
            price: a.price,
            change: a.change,
            iconColor: a.iconColor,
            marketCap: formatMarketCap(a.price, a.ticker), // Mock market cap based on price
          }));
          
          // Newly Added: Filter assets with category or take last 3
          const newAssets = assets
            .filter(a => a.category)
            .slice(0, 3)
            .map(a => ({
              ticker: a.ticker,
              name: a.name,
              price: a.price,
              change: a.change,
              iconColor: a.iconColor,
              marketCap: a.category || 'Equities Stock',
            }));
          
          setTopGainers(gainers);
          setTrending(trendingAssets);
          setNewlyAdded(newAssets.length > 0 ? newAssets : trendingAssets.map(a => ({...a, marketCap: 'Equities Stock'})));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Mock market cap calculation (in real scenario, would come from API)
  function formatMarketCap(price: string, ticker: string): string {
    const priceNum = parseFloat(price);
    const mockVolume = Math.floor(priceNum * 1000000 * (Math.random() * 2 + 1));
    return `$${mockVolume.toLocaleString()}`;
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      <AssetList title="Top Gainers" badge="24H" assets={topGainers} />
      <AssetList title="Trending" badge="24H" assets={trending} />
      <AssetList title="Newly Added" assets={newlyAdded} />
    </div>
  );
}

