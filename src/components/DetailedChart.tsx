'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface DetailedChartProps {
  data: { time: number; price: number }[];
  color?: string;
}

export function DetailedChart({ data, color = '#10B981' }: DetailedChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      
      return (
        <div className="bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="font-bold text-lg">${point.price}</div>
          <div className="text-xs text-gray-400">
            {formatTimeLabel(point.time)}
          </div>
        </div>
      );
    }
    return null;
  };

  // Calculate min and max for Y-axis domain
  const prices = data.map(d => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const padding = (maxPrice - minPrice) * 0.1;

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            tickFormatter={(value) => formatTimeLabel(value)}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            interval="preserveStartEnd"
            minTickGap={80}
          />
          <YAxis
            domain={[minPrice - padding, maxPrice + padding]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            tickFormatter={(value) => `${value.toFixed(2)}`}
            orientation="right"
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '5 5' }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorPrice)"
            animationDuration={300}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function formatTimeLabel(timeIndex: number): string {
  // Format based on time index
  // For 1D: show hours
  const hour = Math.floor(timeIndex % 24);
  return `11/21 ${hour.toString().padStart(2, '0')}:00`;
}

