// Generate realistic chart data for each token
// Each token has its own unique curve pattern

export interface ChartDataPoint {
  time: string;
  price: number;
}

// Generate detailed chart data (for detail page)
export function generateDetailedChartData(
  ticker: string,
  currentPrice: number,
  changePercent: number,
  timeRange: string = '1D'
): ChartDataPoint[] {
  const points = timeRange === '1D' ? 96 : timeRange === '1W' ? 168 : 90; // 15min intervals for 1D
  const data: ChartDataPoint[] = [];
  const startPrice = currentPrice / (1 + changePercent / 100);
  
  // Different patterns for different tokens
  const patterns = getTokenPattern(ticker);
  
  for (let i = 0; i < points; i++) {
    const progress = i / (points - 1);
    
    // Base trend
    let price = startPrice + (currentPrice - startPrice) * progress;
    
    // Add pattern-specific variations
    price += patterns.wave1 * Math.sin(progress * Math.PI * patterns.frequency1) * currentPrice;
    price += patterns.wave2 * Math.sin(progress * Math.PI * patterns.frequency2) * currentPrice;
    price += patterns.noise * (Math.random() - 0.5) * currentPrice;
    
    // Add some momentum changes
    if (progress > 0.3 && progress < 0.5) {
      price += patterns.dip * currentPrice;
    }
    if (progress > 0.6 && progress < 0.8) {
      price += patterns.spike * currentPrice;
    }
    
    const hours = Math.floor((i / points) * 24);
    const minutes = Math.floor(((i / points) * 24 * 60) % 60);
    const time = `11/21 ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    data.push({
      time,
      price: parseFloat(price.toFixed(2)),
    });
  }
  
  // Ensure last point is exactly current price
  data[data.length - 1].price = currentPrice;
  
  return data;
}

// Generate mini chart data (for cards - 9 points)
export function generateMiniChartData(
  ticker: string,
  currentPrice: number,
  changePercent: number
): number[] {
  const points = 9;
  const data: number[] = [];
  const startPrice = currentPrice / (1 + changePercent / 100);
  
  const patterns = getTokenPattern(ticker);
  
  for (let i = 0; i < points; i++) {
    const progress = i / (points - 1);
    
    let price = startPrice + (currentPrice - startPrice) * progress;
    
    // Same pattern as detailed chart but simplified
    price += patterns.wave1 * Math.sin(progress * Math.PI * patterns.frequency1) * currentPrice;
    price += patterns.wave2 * Math.sin(progress * Math.PI * patterns.frequency2) * currentPrice;
    
    if (progress > 0.3 && progress < 0.5) {
      price += patterns.dip * currentPrice;
    }
    if (progress > 0.6 && progress < 0.8) {
      price += patterns.spike * currentPrice;
    }
    
    data.push(parseFloat(price.toFixed(2)));
  }
  
  // Ensure last point is exactly current price
  data[data.length - 1] = currentPrice;
  
  return data;
}

// Define unique patterns for each token
function getTokenPattern(ticker: string): {
  wave1: number;
  frequency1: number;
  wave2: number;
  frequency2: number;
  noise: number;
  dip: number;
  spike: number;
} {
  const patterns: Record<string, any> = {
    CRCLon: {
      wave1: 0.02,
      frequency1: 2,
      wave2: 0.01,
      frequency2: 4,
      noise: 0.005,
      dip: -0.015,
      spike: 0.025,
    },
    FUTUon: {
      wave1: 0.025,
      frequency1: 3,
      wave2: 0.015,
      frequency2: 5,
      noise: 0.008,
      dip: -0.02,
      spike: 0.03,
    },
    ACNon: {
      wave1: 0.015,
      frequency1: 2,
      wave2: 0.01,
      frequency2: 3,
      noise: 0.004,
      dip: -0.01,
      spike: 0.02,
    },
    NVDAon: {
      wave1: 0.01,
      frequency1: 1.5,
      wave2: 0.008,
      frequency2: 3,
      noise: 0.003,
      dip: -0.008,
      spike: 0.015,
    },
    SPYon: {
      wave1: 0.008,
      frequency1: 1,
      wave2: 0.005,
      frequency2: 2,
      noise: 0.002,
      dip: -0.005,
      spike: 0.01,
    },
    INTCon: {
      wave1: 0.018,
      frequency1: 2.5,
      wave2: 0.012,
      frequency2: 4,
      noise: 0.006,
      dip: -0.012,
      spike: 0.018,
    },
    FIGon: {
      wave1: 0.02,
      frequency1: 2,
      wave2: 0.01,
      frequency2: 3.5,
      noise: 0.005,
      dip: -0.01,
      spike: 0.02,
    },
    AMDon: {
      wave1: 0.012,
      frequency1: 2,
      wave2: 0.008,
      frequency2: 3,
      noise: 0.004,
      dip: -0.008,
      spike: 0.015,
    },
  };
  
  return patterns[ticker] || patterns.NVDAon;
}

