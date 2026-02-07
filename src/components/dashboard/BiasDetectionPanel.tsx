import { useDashboard } from "@/context/DashboardContext";
import { calcVulnerabilityIndex, calcAidPerCapita, calcFairnessScore } from "@/data/demoData";
import { MetricCard } from "./MetricCard";
import { Target, AlertTriangle } from "lucide-react";
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export const BiasDetectionPanel = () => {
  const { data } = useDashboard();

  const scatterData = data.map(d => ({
    name: d.District,
    vulnerability: +calcVulnerabilityIndex(d).toFixed(3),
    aidPerCapita: +calcAidPerCapita(d).toFixed(2),
    fairness: calcFairnessScore(d),
  }));

  // Blind spot: districts with high vulnerability but low aid
  const blindSpots = data.filter(d => calcVulnerabilityIndex(d) > 0.5 && calcAidPerCapita(d) < 50);
  const blindSpotScore = +(blindSpots.length / data.length * 100).toFixed(1);

  // Disparity ratio
  const aids = data.map(calcAidPerCapita);
  const maxAid = Math.max(...aids);
  const minAid = Math.min(...aids);
  const disparityRatio = minAid > 0 ? +(maxAid / minAid).toFixed(1) : 999;

  const top10Vulnerable = [...data]
    .sort((a, b) => calcVulnerabilityIndex(b) - calcVulnerabilityIndex(a))
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">Bias Detection</h2>
        <p className="text-sm text-muted-foreground">Identifying systematic disparities in aid allocation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricCard title="Blind Spot Score" value={`${blindSpotScore}%`} icon={<Target className="h-5 w-5" />} subtitle={`${blindSpots.length} districts with high need, low aid`} accent="warning" />
        <MetricCard title="Disparity Ratio" value={`${disparityRatio}x`} icon={<AlertTriangle className="h-5 w-5" />} subtitle="Max vs Min aid per capita" accent="destructive" />
      </div>

      <div className="section-divider" />

      {/* Scatter */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-4">Vulnerability vs Aid Per Capita</h3>
        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart margin={{ bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 20%)" />
            <XAxis dataKey="vulnerability" name="Vulnerability" type="number" domain={[0, 1]} tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} label={{ value: "Vulnerability Index", position: "bottom", fill: "hsl(215 20% 55%)", fontSize: 11 }} />
            <YAxis dataKey="aidPerCapita" name="Aid/Capita" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} label={{ value: "Aid Per Capita (₹Cr/M)", angle: -90, position: "insideLeft", fill: "hsl(215 20% 55%)", fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: "hsl(222 40% 12%)", border: "1px solid hsl(222 30% 25%)", borderRadius: 8, color: "hsl(210 40% 92%)", fontSize: 12 }}
              formatter={(v: number, name: string) => [v, name]}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.name || ""}
            />
            <Scatter data={scatterData} fill="hsl(199 89% 48%)" fillOpacity={0.7} r={6} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Top Vulnerable Table */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-4">Top 10 Most Vulnerable Districts</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-muted-foreground font-medium text-xs">District</th>
                <th className="text-left py-2 text-muted-foreground font-medium text-xs">State</th>
                <th className="text-right py-2 text-muted-foreground font-medium text-xs">Vulnerability</th>
                <th className="text-right py-2 text-muted-foreground font-medium text-xs">Aid/Capita</th>
                <th className="text-right py-2 text-muted-foreground font-medium text-xs">Fairness</th>
              </tr>
            </thead>
            <tbody>
              {top10Vulnerable.map(d => (
                <tr key={d.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                  <td className="py-2 font-medium">{d.District}</td>
                  <td className="py-2 text-muted-foreground">{d.State}</td>
                  <td className="py-2 text-right font-mono">{calcVulnerabilityIndex(d).toFixed(3)}</td>
                  <td className="py-2 text-right font-mono">{calcAidPerCapita(d).toFixed(1)}</td>
                  <td className="py-2 text-right">
                    <span className={`font-mono px-2 py-0.5 rounded text-xs ${
                      calcFairnessScore(d) < 0.4 ? "bg-destructive/20 text-destructive" :
                      calcFairnessScore(d) < 0.6 ? "bg-warning/20 text-warning" : "bg-success/20 text-success"
                    }`}>
                      {(calcFairnessScore(d) * 100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
