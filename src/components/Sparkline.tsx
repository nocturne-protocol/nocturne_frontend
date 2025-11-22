"use client";

interface SparklineProps {
  data: number[];
  color?: string;
}

export function Sparkline({ data, color = "#10B981" }: SparklineProps) {
  if (!data || data.length === 0) {
    return <div className="w-full h-32" />;
  }

  const width = 400;
  const height = 120;
  const padding = 8;

  // Find min and max values
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  // Create points for the line with smooth curve
  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / range) * (height - padding * 2);
    return { x, y };
  });

  // Create smooth curve path using quadratic bezier curves
  let pathD = `M ${points[0].x},${points[0].y}`;
  
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const midX = (current.x + next.x) / 2;
    const midY = (current.y + next.y) / 2;
    
    pathD += ` Q ${current.x},${current.y} ${midX},${midY}`;
  }
  
  // Add the last point
  const lastPoint = points[points.length - 1];
  pathD += ` L ${lastPoint.x},${lastPoint.y}`;

  // Create filled area path
  const areaPath = `${pathD} L ${lastPoint.x},${height} L ${points[0].x},${height} Z`;

  // Generate unique ID for gradient
  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="w-full"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      
      {/* Filled area */}
      <path
        d={areaPath}
        fill={`url(#${gradientId})`}
      />
      
      {/* Line on top */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

