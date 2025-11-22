'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowUp, ArrowDown } from 'lucide-react';
import Image from 'next/image';
import { DetailedChart } from '@/components/DetailedChart';
import { cn } from '@/lib/utils';


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
    onchainAddress: "0x3632...3fae",
    sharesPerToken: "1 CRCLon = 1.00 CRCL",
    category: ["Equities", "Stock"],
    chains: ["ethereum", "bitcoin"],
  },
  NVDAon: {
    underlyingAssetName: "NVIDIA Corporation",
    underlyingAssetTicker: "NVDA",
    onchainAddress: "0x1234...5678",
    sharesPerToken: "1 NVDAon = 1.00 NVDA",
    category: ["Equities", "Stock"],
    chains: ["ethereum"],
  },
  // Add more as needed
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
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="h-96 bg-gray-200 rounded mb-8"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Asset not found</h1>
          <button
            onClick={() => router.push('/')}
            className="text-gray-600 hover:text-black"
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 px-8 py-4">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Asset Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center bg-white border border-gray-200">
            <Image 
              src={getAssetImage(ticker)} 
              alt={asset.name} 
              width={64}
              height={64}
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{asset.name}</h1>
            <p className="text-gray-500 text-lg">{ticker}</p>
          </div>
        </div>

        {/* Price Section */}
        <div className="bg-gray-50 rounded-3xl p-8 mb-8">
          <div className="mb-6">
            <div className="text-5xl font-bold text-gray-900 mb-2">
              ${asset.price}
            </div>
            <div className={cn(
              "flex items-center gap-2 text-lg font-medium",
              isPositive ? "text-green-600" : "text-red-600"
            )}>
              {isPositive ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
              ${asset.changeValue} ({Math.abs(asset.change).toFixed(4)}%) 24H
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2 mb-6">
            {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  timeRange === range
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Chart */}
          <DetailedChart
            data={generateHistoricalData(parseFloat(asset.price), asset.change, timeRange)}
            color={isPositive ? "#10B981" : "#EF4444"}
          />
        </div>

        {/* About Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
          <p className="text-gray-700 leading-relaxed mb-2">
            {ASSET_DESCRIPTIONS[ticker] || "No description available."}
          </p>
          <button className="text-gray-900 font-medium hover:underline">
            Show More
          </button>
        </div>

        {/* Asset Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {info.chains && (
            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <span className="text-gray-600">Supported Chains</span>
              <div className="flex gap-2">
                {info.chains.map((chain: string) => (
                  <div key={chain} className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-xs">⛓️</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {info.underlyingAssetName && (
            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <span className="text-gray-600">Underlying Asset Name</span>
              <span className="text-gray-900 font-medium">{info.underlyingAssetName}</span>
            </div>
          )}

          {info.onchainAddress && (
            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <span className="text-gray-600">Onchain Address</span>
              <div className="flex items-center gap-2">
                <span className="text-gray-900 font-mono">{info.onchainAddress}</span>
                <button className="text-gray-400 hover:text-gray-900">📋</button>
              </div>
            </div>
          )}

          {info.underlyingAssetTicker && (
            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <span className="text-gray-600">Underlying Asset Ticker</span>
              <span className="text-gray-900 font-medium">{info.underlyingAssetTicker}</span>
            </div>
          )}

          {info.category && (
            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <span className="text-gray-600">Category</span>
              <div className="flex gap-2">
                {info.category.map((cat: string) => (
                  <span
                    key={cat}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {info.sharesPerToken && (
            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <span className="text-gray-600">Shares Per Token</span>
              <span className="text-gray-900 font-medium">{info.sharesPerToken}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Generate mock historical data based on current price and time range
function generateHistoricalData(currentPrice: number, changePercent: number, timeRange: string) {
  const points = timeRange === '1D' ? 24 : timeRange === '1W' ? 168 : 90;
  const data = [];
  const startPrice = currentPrice / (1 + changePercent / 100);
  
  for (let i = 0; i < points; i++) {
    const progress = i / (points - 1);
    const volatility = Math.random() * 0.02 - 0.01; // +/- 1% volatility
    const price = startPrice + (currentPrice - startPrice) * progress + currentPrice * volatility;
    
    data.push({
      time: i,
      price: parseFloat(price.toFixed(2)),
    });
  }
  
  data[data.length - 1].price = currentPrice;
  return data;
}

