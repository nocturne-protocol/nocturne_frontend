import { Search, LayoutGrid, List, ChevronDown } from "lucide-react";
import { AssetCard } from "./AssetCard";
import { cn } from "@/lib/utils";

const categories = ["All assets", "ETF", "Technology", "Consumer", "Financials", "Large Cap", "Growth", "Value"];

// Mock data for Explore Assets
const exploreData = [
  {
    ticker: "NVDAon",
    name: "NVIDIA",
    price: "180.07",
    change: -0.07,
    changeValue: "0.13",
    iconColor: "#76B900",
    trendData: [185, 184, 182, 180, 181, 179, 178, 180, 180.07]
  },
  {
    ticker: "SPYon",
    name: "SPDR S&P 500 ETF",
    price: "660.78",
    change: 1.03,
    changeValue: "6.73",
    iconColor: "#6A1B9A", // Purple
    trendData: [650, 652, 655, 654, 658, 660, 662, 660, 660.78]
  },
  {
    ticker: "INTCon",
    name: "Intel",
    price: "34.51",
    change: 4.01,
    changeValue: "1.33",
    iconColor: "#0071C5", // Intel Blue
    trendData: [33, 33.2, 33.5, 33.8, 34, 34.2, 34.5, 34.4, 34.51]
  }
];

export function ExploreAssets() {
  return (
    <section className="space-y-6">
       <div className="flex items-center justify-between mb-6">
         <h2 className="text-2xl font-medium text-gray-900">Explore Assets</h2>
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
          {exploreData.map((asset, idx) => (
             <AssetCard key={idx} {...asset} />
          ))}
       </div>
    </section>
  );
}

