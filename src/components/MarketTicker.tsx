import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

const marketData = [
  { name: "Dow Jones Industrial Average", value: "46,245.40", change: 1.08, isUp: true },
  { name: "NASDAQ Composite", value: "22,273.08", change: 0.88, isUp: true },
  { name: "NYSE Composite", value: "21,182.41", change: 1.29, isUp: true },
  { name: "CBOE Volatility Index", value: "23.43", change: 11.32, isUp: false },
  { name: "Treasury Yield 10 Years", value: "4.25", change: 0.50, isUp: false }, // Mocked last one
];

export function MarketTicker() {
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

