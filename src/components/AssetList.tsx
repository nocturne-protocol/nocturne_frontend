import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export interface Asset {
  ticker: string;
  name: string;
  price: string;
  change: number; // percentage
  iconColor: string;
  marketCap?: string;
  category?: string;
}

interface AssetListProps {
  title: string;
  badge?: string;
  assets: Asset[];
}

// Get the asset image path based on ticker
const getAssetImage = (ticker: string) => {
  const tickerLower = ticker.toLowerCase();
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
  return imageMap[tickerLower] || '/asset/spyon.png';
};

export function AssetList({ title, badge, assets }: AssetListProps) {
  return (
    <div className="w-full">
      <div className="flex items-center space-x-2 mb-4">
        <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-100">{title}</h2>
        {badge && (
          <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm font-medium rounded-full border border-gray-200 dark:border-gray-700">
            {badge}
          </span>
        )}
      </div>
      <div className="space-y-4">
        {assets.map((asset, index) => (
          <Link key={index} href={`/${asset.ticker}`}>
            <div className="flex items-center justify-between group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 p-3 rounded-lg transition-colors -mx-2">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-white dark:bg-gray-800">
                  <Image 
                    src={getAssetImage(asset.ticker)} 
                    alt={asset.name} 
                    width={48}
                    height={48}
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-900 dark:text-gray-100 font-semibold text-base">{asset.ticker}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">{asset.name}</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                 <span className="text-gray-900 dark:text-gray-100 font-medium text-base">${asset.price}</span>
                 {asset.marketCap && <span className="text-gray-400 dark:text-gray-500 text-sm">{asset.marketCap}</span>}
                 {!asset.marketCap && (
                    <div className={cn("flex items-center text-sm font-medium", asset.change >= 0 ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500")}>
                      {asset.change >= 0 ? <ArrowUp size={12} className="mr-0.5" /> : <ArrowDown size={12} className="mr-0.5" />}
                      {Math.abs(asset.change).toFixed(2)}%
                    </div>
                 )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

