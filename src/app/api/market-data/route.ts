import { NextResponse } from 'next/server';

// Free API from Finnhub (you can also use Alpha Vantage, Yahoo Finance, etc.)
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || 'demo';
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'demo';

// Mapping of tickers to real stock symbols and company names
const TICKER_MAP: Record<string, { symbol: string; name: string; category?: string }> = {
  'NVDAon': { symbol: 'NVDA', name: 'NVIDIA' },
  'SPYon': { symbol: 'SPY', name: 'SPDR S&P 500 ETF', category: 'Equities ETF' },
  'INTCon': { symbol: 'INTC', name: 'Intel' },
  'CRCLon': { symbol: 'CRM', name: 'Salesforce' },
  'FUTUon': { symbol: 'TSLA', name: 'Tesla' },
  'HIMSon': { symbol: 'HIMS', name: 'Hims & Hers Health' },
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
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`,
      { next: { revalidate: 60 } } // Cache for 60 seconds
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch from Finnhub');
    }
    
    const data = await response.json();
    
    return {
      currentPrice: data.c || 0,
      change: data.dp || 0, // Percent change
      changeValue: data.d || 0, // Dollar change
      previousClose: data.pc || 0,
    };
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error);
    // Return mock data as fallback
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
      iconColor: "#6A1B9A",
      trendData: [650, 652, 655, 654, 658, 660, 662, 660, 660.78],
      category: "Equities ETF"
    },
    {
      ticker: "INTCon",
      name: "Intel",
      price: "34.51",
      change: 4.01,
      changeValue: "1.33",
      iconColor: "#0071C5",
      trendData: [33, 33.2, 33.5, 33.8, 34, 34.2, 34.5, 34.4, 34.51]
    },
    {
      ticker: "CRCLon",
      name: "Salesforce",
      price: "227.11",
      change: 0.77,
      changeValue: "1.74",
      iconColor: "#8B5CF6",
      trendData: [225, 225.5, 226, 226.5, 227, 226.8, 227.2, 227, 227.11]
    },
    {
      ticker: "FUTUon",
      name: "Tesla",
      price: "391.09",
      change: 1.05,
      changeValue: "4.14",
      iconColor: "#2563EB",
      trendData: [385, 387, 388, 389, 390, 391, 390.5, 391.5, 391.09]
    },
    {
      ticker: "HIMSon",
      name: "Hims & Hers Health",
      price: "34.71",
      change: 3.24,
      changeValue: "1.09",
      iconColor: "#1F2937",
      trendData: [33, 33.5, 33.8, 34, 34.2, 34.5, 34.6, 34.7, 34.71]
    },
    {
      ticker: "FIGon",
      name: "Figma",
      price: "34.31",
      change: 2.20,
      changeValue: "0.74",
      iconColor: "#F24E1E",
      trendData: [33, 33.3, 33.5, 33.8, 34, 34.1, 34.3, 34.2, 34.31],
      category: "Equities Stock"
    },
    {
      ticker: "AMDon",
      name: "AMD",
      price: "203.78",
      change: 1.09,
      changeValue: "2.24",
      iconColor: "#ED1C24",
      trendData: [200, 201, 201.5, 202, 202.5, 203, 203.5, 203.8, 203.78],
      category: "Equities Stock"
    }
  ];
}

