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
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/market-data', {
          cache: 'no-store' // Disable cache
        });
        const result = await response.json();
        
        if (result.data && result.data.length > 0) {
          const assets: MarketData[] = result.data;
          
          // Create a map for easy lookup
          const assetMap = new Map(assets.map(a => [a.ticker, a]));
          
          // Top Gainers: Fixed order CRCLon, FUTUon, ACNon
          const topGainersOrder = ['CRCLon', 'FUTUon', 'ACNon'];
          const gainers = topGainersOrder
            .map(ticker => assetMap.get(ticker))
            .filter(a => a !== undefined)
            .map(a => ({
              ticker: a.ticker,
              name: a.name,
              price: a.price,
              change: a.change,
              iconColor: a.iconColor,
            }));
          
          // Trending: Fixed order NVDAon, SPYon, INTCon
          const trendingOrder = ['NVDAon', 'SPYon', 'INTCon'];
          const trendingAssets = trendingOrder
            .map(ticker => assetMap.get(ticker))
            .filter(a => a !== undefined)
            .map(a => ({
              ticker: a.ticker,
              name: a.name,
              price: a.price,
              change: a.change,
              iconColor: a.iconColor,
              marketCap: formatMarketCap(a.price, a.ticker),
            }));
          
          // Newly Added: Fixed order FIGon, AMDon, SPYon
          const newlyAddedOrder = ['FIGon', 'AMDon', 'SPYon'];
          const newAssets = newlyAddedOrder
            .map(ticker => assetMap.get(ticker))
            .filter(a => a !== undefined)
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
          setNewlyAdded(newAssets);
          setLastUpdate(new Date().toLocaleTimeString());
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
    <div>
      {lastUpdate && (
        <div className="text-xs text-gray-400 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Last update: {lastUpdate} • Auto-refresh every 60s
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <AssetList title="Top Gainers" badge="24H" assets={topGainers} />
        <AssetList title="Trending" badge="24H" assets={trending} />
        <AssetList title="Newly Added" assets={newlyAdded} />
      </div>
    </div>
  );
}

