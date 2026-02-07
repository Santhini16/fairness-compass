import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: "up" | "down" | "neutral";
  accent?: "primary" | "success" | "warning" | "destructive";
}

const accentColors = {
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
};

export const MetricCard = ({ title, value, subtitle, icon, accent = "primary" }: MetricCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="glass-card glass-card-hover rounded-xl p-5"
  >
    <div className="flex items-start justify-between mb-3">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
      <div className={accentColors[accent]}>{icon}</div>
    </div>
    <p className={`metric-value ${accentColors[accent]}`}>{value}</p>
    {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
  </motion.div>
);
