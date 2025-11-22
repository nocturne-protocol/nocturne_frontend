import { NextResponse } from 'next/server';
import { generateMiniChartData } from '@/lib/chartData';

// Free API from Finnhub (you can also use Alpha Vantage, Yahoo Finance, etc.)
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || 'demo';
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'demo';

// Mapping of tickers to real stock symbols and company names
const TICKER_MAP: Record<string, { symbol: string; name: string; category?: string }> = {
  'CRCLon': { symbol: 'CRCL', name: 'Circle Internet Group' },
  'FUTUon': { symbol: 'FUTU', name: 'Futu Holdings' },
  'ACNon': { symbol: 'ACN', name: 'Accenture' },
  'NVDAon': { symbol: 'NVDA', name: 'NVIDIA' },
  'SPYon': { symbol: 'SPY', name: 'SPDR S&P 500 ETF', category: 'Equities ETF' },
  'INTCon': { symbol: 'INTC', name: 'Intel' },
  'FIGon': { symbol: 'FIG', name: 'Figma', category: 'Equities Stock' },
  'AMDon': { symbol: 'AMD', name: 'AMD', category: 'Equities Stock' },
};

interface StockData {
  ticker: string;
  name: string;
  price: string;
  change: number;
  changeValue: string;
  iconColor: string;
  trendData: number[];
  category?: string;
}

async function fetchStockPrice(symbol: string) {
  try {
    // Using Finnhub API
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
    
    const response = await fetch(url, { 
      cache: 'no-store' // Disable cache for real-time data
    });
    
    if (!response.ok) {
      // Silently handle API errors (rate limiting, etc.)
      return null;
    }
    
    const data = await response.json();
    
    // Check if we got valid data
    if (data.c === 0 && data.pc === 0) {
      return null;
    }
    
    return {
      currentPrice: data.c || 0,
      change: data.dp || 0, // Percent change
      changeValue: data.d || 0, // Dollar change
      previousClose: data.pc || 0,
    };
  } catch (error) {
    // Silently handle errors - fallback to mock data
    return null;
  }
}

// Generate mock trend data based on current price
function generateTrendData(currentPrice: number, changePercent: number): number[] {
  const points = 9;
  const data: number[] = [];
  const startPrice = currentPrice / (1 + changePercent / 100);
  
  for (let i = 0; i < points; i++) {
    const progress = i / (points - 1);
    const price = startPrice + (currentPrice - startPrice) * progress + (Math.random() - 0.5) * currentPrice * 0.01;
    data.push(parseFloat(price.toFixed(2)));
  }
  
  data[data.length - 1] = currentPrice; // Ensure last point is current price
  return data;
}

export async function GET() {
  // Always return mock data - no API calls
  return NextResponse.json({
    success: true,
    data: getMockData(),
    timestamp: new Date().toISOString(),
    isMockData: true,
  });
}

// Fallback mock data with generated chart data
function getMockData(): StockData[] {
  const mockAssets = [
    {
      ticker: "CRCLon",
      name: "Circle Internet Group",
      price: "72.40",
      change: 8.11,
      changeValue: "5.43",
      iconColor: "#8B5CF6",
    },
    {
      ticker: "FUTUon",
      name: "Futu Holdings",
      price: "162.30",
      change: 5.43,
      changeValue: "8.36",
      iconColor: "#2563EB",
    },
    {
      ticker: "ACNon",
      name: "Accenture",
      price: "254.13",
      change: 4.96,
      changeValue: "12.01",
      iconColor: "#A855F7",
    },
    {
      ticker: "NVDAon",
      name: "NVIDIA",
      price: "180.04",
      change: 0.97,
      changeValue: "1.76",
      iconColor: "#76B900",
    },
    {
      ticker: "SPYon",
      name: "SPDR S&P 500 ETF",
      price: "661.29",
      change: 1.00,
      changeValue: "6.50",
      iconColor: "#6A1B9A",
      category: "Equities ETF"
    },
    {
      ticker: "INTCon",
      name: "Intel",
      price: "34.66",
      change: 2.62,
      changeValue: "0.88",
      iconColor: "#0071C5",
    },
    {
      ticker: "FIGon",
      name: "Figma",
      price: "34.49",
      change: 2.20,
      changeValue: "0.74",
      iconColor: "#F24E1E",
      category: "Equities Stock"
    },
    {
      ticker: "AMDon",
      name: "AMD",
      price: "204.53",
      change: 1.09,
      changeValue: "2.24",
      iconColor: "#ED1C24",
      category: "Equities Stock"
    }
  ];

  // Generate unique chart data for each asset
  return mockAssets.map(asset => ({
    ...asset,
    trendData: generateMiniChartData(asset.ticker, parseFloat(asset.price), asset.change)
  }));
}

