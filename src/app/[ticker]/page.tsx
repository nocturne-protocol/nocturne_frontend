'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowUp, ArrowDown } from 'lucide-react';
import Image from 'next/image';
import { DetailedChart } from '@/components/DetailedChart';
import TradingInterface from '@/components/TradingInterface';
import { cn } from '@/lib/utils';
import { generateDetailedChartData } from '@/lib/chartData';


interface AssetData {
  ticker: string;
  name: string;
  price: string;
  change: number;
  changeValue: string;
  category?: string;
}

const ASSET_DESCRIPTIONS: Record<string, string> = {
  CRCLon: "Circle Internet Group, Inc. operates as a platform, network, and market infrastructure for stablecoin and blockchain applications. The company provides a suite of stablecoins and related products that include a network utility and application platform for organizati...",
  NVDAon: "NVIDIA Corporation designs, develops, and markets graphics processors and related software. The company's products are used in gaming, professional visualization, data centers, and automotive markets.",
  SPYon: "SPDR S&P 500 ETF Trust seeks to provide investment results that correspond to the price and yield performance of the S&P 500 Index.",
  INTCon: "Intel Corporation designs, manufactures, and sells computer components and related products. The company offers microprocessors, chipsets, and other semiconductor components.",
  FUTUon: "Futu Holdings Limited operates an online brokerage and wealth management platform. The company provides trading, clearing, and settlement services.",
  ACNon: "Accenture plc operates as a professional services company worldwide. The company provides consulting, technology, and outsourcing services.",
  FIGon: "Figma is a collaborative web application for interface design, with additional offline features enabled by desktop applications.",
  AMDon: "Advanced Micro Devices, Inc. operates as a semiconductor company worldwide. The company offers x86 microprocessors and chipsets for desktop, laptop, and server markets.",
};

const ASSET_INFO: Record<string, any> = {
  CRCLon: {
    underlyingAssetName: "Circle Internet Group, Inc.",
    underlyingAssetTicker: "CRCL",
    onchainAddress: "0xFC2146736ee72A1c5057e2b914Ed27339F1fe9c7",
    sharesPerToken: "1 CRCLon = 1.00 CRCL",
    category: ["Equities", "Stock"],
    chains: ["sepolia", "base", "arbitrum"],
  },
  NVDAon: {
    underlyingAssetName: "NVIDIA Corporation",
    underlyingAssetTicker: "NVDA",
    onchainAddress: "0xFC2146736ee72A1c5057e2b914Ed27339F1fe9c7",
    sharesPerToken: "1 NVDAon = 1.00 NVDA",
    category: ["Equities", "Stock"],
    chains: ["sepolia", "base", "arbitrum"],
  },
  // Add more as needed
};

const CHAIN_ICONS: Record<string, string> = {
  'arbitrum': '/asset/arbitrum.png',
  'base': '/asset/base.png',
  'sepolia': '/asset/ethereum.png',
};

export default function AssetPage() {
  const params = useParams();
  const router = useRouter();
  const ticker = params.ticker as string;
  
  const [asset, setAsset] = useState<AssetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('1D');

  useEffect(() => {
    const fetchAssetData = async () => {
      try {
        const response = await fetch('/api/market-data', {
          cache: 'no-store'
        });
        const result = await response.json();
        
        if (result.data) {
          const foundAsset = result.data.find((a: AssetData) => a.ticker === ticker);
          if (foundAsset) {
            setAsset(foundAsset);
          }
        }
      } catch (error) {
        console.error('Error fetching asset data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssetData();
    
    // Refresh every 60 seconds
    const interval = setInterval(fetchAssetData, 60000);
    
    return () => clearInterval(interval);
  }, [ticker]);

  // Get asset image
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-8"></div>
            <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded mb-8"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center transition-colors">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Asset not found</h1>
          <button
            onClick={() => router.push('/')}
            className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
          >
            Go back home
          </button>
        </div>
      </div>
    );
  }

  const isPositive = asset.change >= 0;
  const info = ASSET_INFO[ticker] || {};

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Asset Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
            <Image 
              src={getAssetImage(ticker)} 
              alt={asset.name} 
              width={64}
              height={64}
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{asset.name}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">{ticker}</p>
          </div>
        </div>

        {/* Top Section: Chart & Trading Interface */}
        <div className="flex flex-col xl:flex-row gap-8 items-start mb-12">
          {/* Chart Column */}
          <div className="flex-1 w-full bg-gray-50/50 dark:bg-gray-900/50 rounded-3xl p-6 sm:p-8">
            <div className="mb-6">
              <div className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">
                ${asset.price}
              </div>
              <div className={cn(
                "flex items-center gap-2 text-lg font-medium",
                isPositive ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
              )}>
                {isPositive ? <ArrowUp size={24} /> : <ArrowDown size={24} />}
                ${asset.changeValue} ({Math.abs(asset.change).toFixed(4)}%) 24H
              </div>
            </div>

            {/* Time Range Selector */}
            <div className="flex flex-wrap gap-2 mb-8">
              {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-bold transition-colors",
                    timeRange === range
                      ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm"
                      : "text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                  )}
                >
                  {range}
                </button>
              ))}
            </div>

            {/* Chart */}
            <div className="h-[400px] w-full">
              <DetailedChart
                data={generateDetailedChartData(ticker, parseFloat(asset.price), asset.change, timeRange)}
                color={isPositive ? "#10B981" : "#EF4444"}
              />
            </div>
          </div>

          {/* Right Column - Trading Interface */}
          <div className="w-full xl:w-[420px] flex-shrink-0">
            <div className="sticky top-8">
              <TradingInterface
                ticker={ticker}
                assetName={asset.name}
                currentPrice={parseFloat(asset.price)}
                assetImage={getAssetImage(ticker)}
              />
            </div>
          </div>
        </div>

        {/* Bottom Section: Details */}
        <div className="max-w-4xl">
          {/* About Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">About</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-2 text-lg">
              {ASSET_DESCRIPTIONS[ticker] || "No description available."}
            </p>
            <button className="text-gray-900 dark:text-gray-100 font-semibold hover:underline">
              Show More
            </button>
          </div>

          {/* Asset Details List */}
          <div className="border-t border-gray-100 dark:border-gray-800">
            {info.chains && (
              <div className="flex items-center justify-between py-6 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500 dark:text-gray-400 text-lg">Supported Chains</span>
                <div className="flex gap-2">
                  {info.chains.map((chain: string) => (
                    <div key={chain} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center overflow-hidden relative border border-gray-200 dark:border-gray-800">
                      <Image
                        src={CHAIN_ICONS[chain.toLowerCase()] || '/asset/ethereum.png'}
                        alt={chain}
                        fill
                        className="object-contain p-1.5"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {info.underlyingAssetName && (
              <div className="flex items-center justify-between py-6 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500 dark:text-gray-400 text-lg">Underlying Asset Name</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium text-lg">{info.underlyingAssetName}</span>
              </div>
            )}

            {info.onchainAddress && (
              <div className="flex items-center justify-between py-6 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500 dark:text-gray-400 text-lg">Onchain Address</span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-[10px]">◆</span>
                  </div>
                  <span className="text-gray-900 dark:text-gray-100 font-mono text-lg">{info.onchainAddress}</span>
                  <button className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 ml-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {info.underlyingAssetTicker && (
              <div className="flex items-center justify-between py-6 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500 dark:text-gray-400 text-lg">Underlying Asset Ticker</span>
                <span className="text-gray-900 dark:text-gray-100 font-medium text-lg">{info.underlyingAssetTicker}</span>
              </div>
            )}

            {info.category && (
              <div className="flex items-center justify-between py-6 border-b border-gray-100 dark:border-gray-800">
                <span className="text-gray-500 dark:text-gray-400 text-lg">Category</span>
                <div className="flex gap-2">
                  {info.category.map((cat: string) => (
                    <span
                      key={cat}
                      className="px-4 py-1.5 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 rounded-full text-sm font-semibold"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {info.sharesPerToken && (
              <div className="flex items-center justify-between py-6 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 dark:text-gray-400 text-lg">Shares Per Token</span>
                  <button className="w-5 h-5 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-xs font-bold">?</button>
                </div>
                <span className="text-gray-900 dark:text-gray-100 font-medium text-lg">{info.sharesPerToken}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// This function is no longer needed - using generateDetailedChartData from lib/chartData.ts
