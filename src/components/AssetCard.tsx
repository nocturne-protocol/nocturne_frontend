import { ArrowUp, ArrowDown } from "lucide-react";
import { Sparkline } from "./Sparkline";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface AssetCardProps {
  ticker: string;
  name: string;
  price: string;
  change: number;
  changeValue: string;
  iconColor: string;
  trendData: number[];
}

export function AssetCard({ ticker, name, price, change, changeValue, trendData }: AssetCardProps) {
  const isPositive = change >= 0;
  const bgColor = isPositive ? "bg-white dark:bg-gray-900" : "bg-red-50 dark:bg-red-950/30";
  const lineColor = isPositive ? "#10B981" : "#EF4444";
  
  // Get the asset image path based on ticker
  const getAssetImage = (ticker: string) => {
    const tickerLower = ticker.toLowerCase();
    // Map tickers to their image files
    const imageMap: Record<string, string> = {
      'nvdaon': '/asset/nvdaon.webp',
      'spyon': '/asset/spyon.png',
      'intcon': '/asset/intcon.png',
      'crclon': '/asset/crclon.webp',
      'futuon': '/asset/futuon.png',
      'acnon': '/asset/acnon.png',
      'himson': '/asset/acnon.png',
      'figon': '/asset/figon.png',
      'amdon': '/asset/amdon.png',
    };
    return imageMap[tickerLower] || '/asset/spyon.png'; // Default fallback
  };

  return (
    <Link href={`/${ticker}`}>
      <div className={cn("rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col h-96 transition-all hover:shadow-md cursor-pointer", bgColor)}>
        <div className="flex items-start justify-between mb-4">
           <div className="flex items-center space-x-3">
               <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-white dark:bg-gray-800">
                   <Image 
                     src={getAssetImage(ticker)} 
                     alt={name} 
                     width={40}
                     height={40}
                     className="w-full h-full object-cover" 
                   />
                </div>
                <div>
                   <h3 className="text-gray-900 dark:text-gray-100 font-bold">{ticker}</h3>
                   <p className="text-gray-500 dark:text-gray-400 text-xs uppercase">{name}</p>
                </div>
           </div>
        </div>

        <div className="mb-4">
           <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">${price}</div>
           <div className={cn("flex items-center text-sm font-medium mt-1", isPositive ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500")}>
              {isPositive ? <ArrowUp size={14} className="mr-1" /> : <ArrowDown size={14} className="mr-1" />}
              ${changeValue} ({Math.abs(change).toFixed(2)}%) 24H
           </div>
        </div>

        <div className="w-full flex-1 flex items-end mt-auto">
           <Sparkline data={trendData} color={lineColor} />
        </div>
      </div>
    </Link>
  );
}

