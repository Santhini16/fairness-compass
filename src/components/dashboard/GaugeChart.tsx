import { motion } from "framer-motion";

interface GaugeChartProps {
  value: number; // 0-1
  label: string;
  size?: number;
}

export const GaugeChart = ({ value, label, size = 160 }: GaugeChartProps) => {
  const radius = (size - 20) / 2;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference * (1 - value);

  const getColor = (v: number) => {
    if (v >= 0.7) return "hsl(160 84% 39%)";
    if (v >= 0.5) return "hsl(38 92% 50%)";
    return "hsl(0 72% 51%)";
  };

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 20}`}>
        {/* Background arc */}
        <path
          d={`M 10 ${size / 2 + 10} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2 + 10}`}
          fill="none"
          stroke="hsl(222 30% 18%)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Value arc */}
        <motion.path
          d={`M 10 ${size / 2 + 10} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2 + 10}`}
          fill="none"
          stroke={getColor(value)}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          className="font-mono text-2xl font-bold"
          fill={getColor(value)}
        >
          {(value * 100).toFixed(1)}%
        </text>
        <text
          x={size / 2}
          y={size / 2 + 18}
          textAnchor="middle"
          className="text-xs"
          fill="hsl(215 20% 55%)"
        >
          {label}
        </text>
      </svg>
    </div>
  );
};
