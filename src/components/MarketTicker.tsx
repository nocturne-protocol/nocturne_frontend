'use client';

import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface MarketIndex {
  name: string;
  value: string;
  change: number;
  isUp: boolean;
}

export function MarketTicker() {
  const [marketData, setMarketData] = useState<MarketIndex[]>([]);

  useEffect(() => {
    const fetchIndices = async () => {
      try {
        const response = await fetch('/api/market-indices');
        const result = await response.json();
        
        if (result.data) {
          setMarketData(result.data);
        }
      } catch (error) {
        console.error('Error fetching market indices:', error);
      }
    };

    fetchIndices();
    
    // Refresh every 60 seconds
    const interval = setInterval(fetchIndices, 60000);
    
    return () => clearInterval(interval);
  }, []);
  if (marketData.length === 0) {
    return (
      <div className="w-full bg-white border-b border-gray-200 py-2 overflow-hidden">
        <div className="flex items-center justify-center px-4 text-xs font-medium text-gray-400">
          Loading market data...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border-b border-gray-200 py-2 overflow-hidden">
      <div className="flex items-center space-x-8 animate-scroll px-4 text-xs font-medium text-gray-600 whitespace-nowrap">
        {marketData.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span className="text-gray-500">{item.name}</span>
            <span className="text-black font-semibold">{item.value}</span>
            <span className={cn("flex items-center", item.isUp ? "text-green-600" : "text-red-600")}>
              {item.isUp ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
              {item.change}%
            </span>
          </div>
        ))}
         {/* Duplicate for seamless scrolling effect if we were to add animation, but for now static flex is fine or simple map */}
          {marketData.map((item, index) => (
          <div key={`dup-${index}`} className="flex items-center space-x-2 md:hidden">
             {/* Hidden on desktop, visible on mobile if we do scrolling */}
            <span className="text-gray-500">{item.name}</span>
            <span className="text-black font-semibold">{item.value}</span>
            <span className={cn("flex items-center", item.isUp ? "text-green-600" : "text-red-600")}>
              {item.isUp ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
              {item.change}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

