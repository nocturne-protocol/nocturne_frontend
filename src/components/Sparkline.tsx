"use client";

import { LineChart, Line } from "recharts";
import { useEffect, useState } from "react";

interface SparklineProps {
  data: number[];
  color?: string;
}

export function Sparkline({ data, color = "#10B981" }: SparklineProps) {
  const [mounted, setMounted] = useState(false);
  const chartData = data.map((val, i) => ({ i, val }));

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-full" />;
  }

  return (
    <div className="w-full h-full">
      <LineChart width={300} height={48} data={chartData}>
        <Line
          type="monotone"
          dataKey="val"
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </div>
  );
}

