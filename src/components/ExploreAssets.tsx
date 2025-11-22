'use client';

import { Search, LayoutGrid, List, ChevronDown } from "lucide-react";
import { AssetCard } from "./AssetCard";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const categories = ["All assets", "ETF", "Technology", "Consumer", "Financials", "Large Cap", "Growth", "Value"];

interface AssetData {
  ticker: string;
  name: string;
  price: string;
  change: number;
  changeValue: string;
  iconColor: string;
  trendData: number[];
  category?: string;
}

export function ExploreAssets() {
  const [assets, setAssets] = useState<AssetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch('/api/market-data', {
          cache: 'no-store' // Disable cache
        });
        const result = await response.json();
        
        if (result.success && result.data) {
          setAssets(result.data);
          setLastUpdate(new Date().toLocaleTimeString());
        } else {
          // Use fallback data
          setAssets(result.data || []);
          setLastUpdate(new Date().toLocaleTimeString());
        }
      } catch (error) {
        console.error('Error fetching market data:', error);
        // Use empty array on error
        setAssets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
    
    // Refresh data every 60 seconds
    const interval = setInterval(fetchMarketData, 60000);
    
    return () => clearInterval(interval);
  }, []);
  return (
    <section className="space-y-6">
       <div className="flex items-center justify-between mb-6">
         <div>
           <h2 className="text-2xl font-medium text-gray-900">Explore Assets</h2>
           {lastUpdate && (
             <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
               Last update: {lastUpdate} • Auto-refresh every 60s
             </div>
           )}
         </div>
       </div>

       {/* Filters and Search */}
       <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative w-full md:w-1/3">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
             <input 
               type="text" 
               placeholder="Search asset name or ticker" 
               className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-gray-200"
             />
          </div>

          <div className="flex-1 overflow-x-auto no-scrollbar">
             <div className="flex items-center space-x-1">
               {categories.map((cat, idx) => (
                 <button 
                   key={cat} 
                   className={cn(
                     "px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors",
                     idx === 0 ? "bg-gray-200 text-black" : "text-gray-500 hover:bg-gray-100 hover:text-black"
                   )}
                 >
                   {cat}
                 </button>
               ))}
             </div>
          </div>

          <div className="flex items-center space-x-3 flex-shrink-0">
             <div className="flex bg-gray-100 p-1 rounded-lg">
                <button className="p-1.5 bg-white rounded shadow-sm text-black">
                   <LayoutGrid size={18} />
                </button>
                <button className="p-1.5 text-gray-500 hover:text-black">
                   <List size={18} />
                </button>
             </div>
             <div className="relative">
               <button className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200">
                 <span>Most Popular</span>
                 <ChevronDown size={16} />
               </button>
             </div>
          </div>
       </div>

       {/* Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="rounded-2xl p-6 border border-gray-100 shadow-sm h-64 animate-pulse bg-gray-50">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))
          ) : assets.length > 0 ? (
            assets.map((asset, idx) => (
              <AssetCard key={idx} {...asset} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              No market data available
            </div>
          )}
       </div>
    </section>
  );
}

