import { NextResponse } from 'next/server';

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || 'demo';

interface MarketIndex {
  name: string;
  value: string;
  change: number;
  isUp: boolean;
}

const INDICES: Record<string, string> = {
  '^DJI': 'Dow Jones Industrial Average',
  '^IXIC': 'NASDAQ Composite',
  '^NYA': 'NYSE Composite',
  '^VIX': 'CBOE Volatility Index',
  '^TNX': 'Treasury Yield 10 Years',
};

async function fetchIndexData(symbol: string) {
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`,
      { next: { revalidate: 60 } }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch');
    }
    
    const data = await response.json();
    
    return {
      currentPrice: data.c || 0,
      change: data.dp || 0,
    };
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error);
    return null;
  }
}

export async function GET() {
  try {
    const results: MarketIndex[] = [];
    
    for (const [symbol, name] of Object.entries(INDICES)) {
      const data = await fetchIndexData(symbol);
      
      if (data) {
        results.push({
          name,
          value: data.currentPrice.toFixed(2),
          change: Math.abs(data.change),
          isUp: data.change >= 0,
        });
      }
    }
    
    // Return mock data if API fails
    if (results.length === 0) {
      return NextResponse.json({
        success: false,
        data: getMockIndices(),
      });
    }
    
    return NextResponse.json({
      success: true,
      data: results,
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('Error in market-indices API:', error);
    return NextResponse.json({
      success: false,
      data: getMockIndices(),
    }, { status: 500 });
  }
}

function getMockIndices(): MarketIndex[] {
  return [
    { name: "Dow Jones Industrial Average", value: "46,245.40", change: 1.08, isUp: true },
    { name: "NASDAQ Composite", value: "22,273.08", change: 0.88, isUp: true },
    { name: "NYSE Composite", value: "21,182.41", change: 1.29, isUp: true },
    { name: "CBOE Volatility Index", value: "23.43", change: 11.32, isUp: false },
    { name: "Treasury Yield 10 Years", value: "4.25", change: 0.50, isUp: false },
  ];
}

