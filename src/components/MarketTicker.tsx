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

const getInitialData = (): MarketIndex[] => {
  // Fixed values to avoid hydration mismatch (no random)
  return [
    { 
      name: "Dow Jones Industrial Average", 
      value: "46,245.40", 
      change: 1.08, 
      isUp: true 
    },
    { 
      name: "NASDAQ Composite", 
      value: "22,273.08", 
      change: 0.88, 
      isUp: true 
    },
    { 
      name: "NYSE Composite", 
      value: "21,182.41", 
      change: 1.29, 
      isUp: true 
    },
    { 
      name: "CBOE Volatility Index", 
      value: "23.43", 
      change: 11.32, 
      isUp: false 
    },
    { 
      name: "Treasury Yield 10 Years", 
      value: "4.25", 
      change: 0.50, 
      isUp: false 
    },
  ];
};

export function MarketTicker() {
  const [marketData, setMarketData] = useState<MarketIndex[]>(getInitialData());

  useEffect(() => {
    const fetchIndices = async () => {
      try {
        const response = await fetch('/api/market-indices');
        const result = await response.json();
        
        if (result.data && result.data.length > 0) {
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

  return (
    <div className="w-full bg-white border-b border-gray-200 py-2 overflow-hidden relative">
      <div className="flex items-center space-x-8 animate-scroll text-xs font-medium text-gray-600 whitespace-nowrap">
        {/* First set */}
        {marketData.map((item, index) => (
          <div key={index} className="flex items-center space-x-2 flex-shrink-0">
            <span className="text-gray-500">{item.name}</span>
            <span className="text-black font-semibold">{item.value}</span>
            <span className={cn("flex items-center", item.isUp ? "text-green-600" : "text-red-600")}>
              {item.isUp ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
              {item.change.toFixed(2)}%
            </span>
          </div>
        ))}
        {/* Duplicate for seamless loop */}
        {marketData.map((item, index) => (
          <div key={`dup-${index}`} className="flex items-center space-x-2 flex-shrink-0">
            <span className="text-gray-500">{item.name}</span>
            <span className="text-black font-semibold">{item.value}</span>
            <span className={cn("flex items-center", item.isUp ? "text-green-600" : "text-red-600")}>
              {item.isUp ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
              {item.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

