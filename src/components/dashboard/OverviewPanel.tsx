import { Activity, Users, TrendingDown, PieChart, Percent } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import {
  calcNationalFairness, calcTotalBudget, calcUnderservedCount,
  calcGiniCoefficient, calcAidPerCapita, calcBudgetUtilization, calcFairnessScore
} from "@/data/demoData";
import { MetricCard } from "./MetricCard";
import { GaugeChart } from "./GaugeChart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export const OverviewPanel = () => {
  const { data } = useDashboard();
  const fairness = calcNationalFairness(data);
  const totalBudget = calcTotalBudget(data);
  const underserved = calcUnderservedCount(data);
  const gini = calcGiniCoefficient(data.map(d => d.Aid_Received));
  const utilization = calcBudgetUtilization(data);

  const top10 = [...data]
    .sort((a, b) => calcFairnessScore(a) - calcFairnessScore(b))
    .slice(0, 10)
    .map(d => ({
      name: d.District.length > 10 ? d.District.slice(0, 10) + "…" : d.District,
      fairness: +(calcFairnessScore(d) * 100).toFixed(1),
    }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">National Overview</h2>
        <p className="text-sm text-muted-foreground">Real-time aid distribution intelligence across {data.length} districts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="glass-card rounded-xl p-5 flex items-center justify-center lg:col-span-1">
          <GaugeChart value={fairness} label="National Fairness" />
        </div>
        <MetricCard title="Total Budget" value={`₹${totalBudget} Cr`} icon={<Activity className="h-5 w-5" />} subtitle="Across all districts" accent="primary" />
        <MetricCard title="Underserved" value={underserved} icon={<Users className="h-5 w-5" />} subtitle="Below fairness threshold" accent="destructive" />
        <MetricCard title="Gini Coefficient" value={gini.toFixed(4)} icon={<TrendingDown className="h-5 w-5" />} subtitle={gini > 0.4 ? "High inequality" : "Moderate"} accent={gini > 0.4 ? "warning" : "success"} />
        <MetricCard title="Utilization" value={`${utilization}%`} icon={<Percent className="h-5 w-5" />} subtitle="Budget efficiency" accent="success" />
      </div>

      <div className="section-divider" />

      {/* Lowest Fairness Scores */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-4">Districts with Lowest Fairness Scores</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={top10} layout="vertical" margin={{ left: 10 }}>
            <XAxis type="number" domain={[0, 100]} tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fill: "hsl(210 40% 85%)", fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
            <Tooltip
              contentStyle={{ background: "hsl(222 40% 12%)", border: "1px solid hsl(222 30% 25%)", borderRadius: 8, color: "hsl(210 40% 92%)", fontSize: 12 }}
              formatter={(v: number) => [`${v}%`, "Fairness"]}
            />
            <Bar dataKey="fairness" radius={[0, 4, 4, 0]}>
              {top10.map((_, i) => (
                <Cell key={i} fill={i < 3 ? "hsl(0 72% 51%)" : i < 6 ? "hsl(38 92% 50%)" : "hsl(199 89% 48%)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
