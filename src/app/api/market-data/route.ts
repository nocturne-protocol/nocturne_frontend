import { NextResponse } from 'next/server';

// Free API from Finnhub (you can also use Alpha Vantage, Yahoo Finance, etc.)
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || 'demo';
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'demo';

// Mapping of tickers to real stock symbols and company names
const TICKER_MAP: Record<string, { symbol: string; name: string; category?: string }> = {
  'CRCLon': { symbol: 'CRM', name: 'Circle Internet Group' },
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
      throw new Error('Failed to fetch from Finnhub');
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
    console.error(`Error fetching ${symbol}:`, error);
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
  try {
    const results: StockData[] = [];
    
    // Fetch data for all tickers
    for (const [displayTicker, tickerInfo] of Object.entries(TICKER_MAP)) {
      const stockData = await fetchStockPrice(tickerInfo.symbol);
      
      if (stockData) {
        results.push({
          ticker: displayTicker,
          name: tickerInfo.name,
          price: stockData.currentPrice.toFixed(2),
          change: stockData.change,
          changeValue: Math.abs(stockData.changeValue).toFixed(2),
          iconColor: '#000000',
          trendData: generateTrendData(stockData.currentPrice, stockData.change),
          category: tickerInfo.category,
        });
      }
    }
    
    // If no results (API failed), return mock data
    if (results.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Using mock data. Please add FINNHUB_API_KEY to .env.local',
        data: getMockData(),
      });
    }
    
    return NextResponse.json({
      success: true,
      data: results,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Error in market-data API:', error);
    return NextResponse.json({
      success: false,
      message: 'Error fetching market data',
      data: getMockData(),
    }, { status: 500 });
  }
}

// Fallback mock data
function getMockData(): StockData[] {
  return [
    {
      ticker: "CRCLon",
      name: "Circle Internet Group",
      price: "72.40",
      change: 8.11,
      changeValue: "5.43",
      iconColor: "#8B5CF6",
      trendData: [68, 69, 70, 71, 71.5, 72, 72.2, 72.3, 72.40]
    },
    {
      ticker: "FUTUon",
      name: "Futu Holdings",
      price: "162.30",
      change: 5.43,
      changeValue: "8.36",
      iconColor: "#2563EB",
      trendData: [155, 156, 158, 159, 160, 161, 161.5, 162, 162.30]
    },
    {
      ticker: "ACNon",
      name: "Accenture",
      price: "254.13",
      change: 4.96,
      changeValue: "12.01",
      iconColor: "#A855F7",
      trendData: [245, 247, 249, 250, 251, 252, 253, 254, 254.13]
    },
    {
      ticker: "NVDAon",
      name: "NVIDIA",
      price: "180.04",
      change: 0.97,
      changeValue: "1.76",
      iconColor: "#76B900",
      trendData: [178, 178.5, 179, 179.2, 179.5, 179.8, 180, 180.1, 180.04]
    },
    {
      ticker: "SPYon",
      name: "SPDR S&P 500 ETF",
      price: "661.29",
      change: 1.00,
      changeValue: "6.50",
      iconColor: "#6A1B9A",
      trendData: [655, 656, 657, 658, 659, 660, 660.5, 661, 661.29],
      category: "Equities ETF"
    },
    {
      ticker: "INTCon",
      name: "Intel",
      price: "34.66",
      change: 2.62,
      changeValue: "0.88",
      iconColor: "#0071C5",
      trendData: [33.5, 33.7, 33.9, 34, 34.2, 34.4, 34.5, 34.6, 34.66]
    },
    {
      ticker: "FIGon",
      name: "Figma",
      price: "34.49",
      change: 2.20,
      changeValue: "0.74",
      iconColor: "#F24E1E",
      trendData: [33, 33.3, 33.5, 33.8, 34, 34.1, 34.3, 34.4, 34.49],
      category: "Equities Stock"
    },
    {
      ticker: "AMDon",
      name: "AMD",
      price: "204.53",
      change: 1.09,
      changeValue: "2.24",
      iconColor: "#ED1C24",
      trendData: [201, 202, 202.5, 203, 203.5, 204, 204.2, 204.4, 204.53],
      category: "Equities Stock"
    }
  ];
}

