import { useDashboard } from "@/context/DashboardContext";
import { calcVulnerabilityIndex, calcFairnessScore, calcAidPerCapita, calcTotalBudget, calcRecommendedAllocation } from "@/data/demoData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Cell } from "recharts";

export const AnalyticsPanel = () => {
  const { data } = useDashboard();
  const totalBudget = calcTotalBudget(data);

  // Vulnerability heatmap as bar chart
  const vulnData = [...data]
    .sort((a, b) => calcVulnerabilityIndex(b) - calcVulnerabilityIndex(a))
    .map(d => ({
      name: d.District.slice(0, 8),
      vulnerability: +(calcVulnerabilityIndex(d) * 100).toFixed(1),
    }));

  // Budget efficiency per district
  const efficiencyData = data.map(d => {
    const vuln = calcVulnerabilityIndex(d);
    const aidPC = calcAidPerCapita(d);
    const efficiency = vuln > 0 ? Math.min(100, (aidPC / (vuln * 200)) * 100) : 0;
    return { name: d.District.slice(0, 8), efficiency: +efficiency.toFixed(1) };
  }).sort((a, b) => a.efficiency - b.efficiency);

  // Radar for top 5 districts
  const top5 = [...data].sort((a, b) => calcVulnerabilityIndex(b) - calcVulnerabilityIndex(a)).slice(0, 5);
  const radarData = [
    { axis: "Poverty", ...Object.fromEntries(top5.map((d, i) => [`d${i}`, +(d.Poverty_Index * 100).toFixed(0)])) },
    { axis: "Minority %", ...Object.fromEntries(top5.map((d, i) => [`d${i}`, +d.Minority_Percentage.toFixed(0)])) },
    { axis: "Rural %", ...Object.fromEntries(top5.map((d, i) => [`d${i}`, +d.Rural_Percentage.toFixed(0)])) },
    { axis: "Disaster", ...Object.fromEntries(top5.map((d, i) => [`d${i}`, +(d.Disaster_Severity * 100).toFixed(0)])) },
    { axis: "Aid Score", ...Object.fromEntries(top5.map((d, i) => [`d${i}`, +(calcFairnessScore(d) * 100).toFixed(0)])) },
  ];

  const radarColors = ["hsl(199 89% 48%)", "hsl(38 92% 50%)", "hsl(0 72% 51%)", "hsl(160 84% 39%)", "hsl(270 60% 60%)"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">Advanced Analytics</h2>
        <p className="text-sm text-muted-foreground">Deep-dive vulnerability analysis and risk prediction</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vulnerability Heatmap */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4">Vulnerability Heatmap</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vulnData}>
              <XAxis dataKey="name" tick={{ fill: "hsl(215 20% 55%)", fontSize: 9 }} axisLine={false} angle={-45} textAnchor="end" height={50} />
              <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(222 40% 12%)", border: "1px solid hsl(222 30% 25%)", borderRadius: 8, color: "hsl(210 40% 92%)", fontSize: 12 }} />
              <Bar dataKey="vulnerability" radius={[4, 4, 0, 0]}>
                {vulnData.map((d, i) => (
                  <Cell key={i} fill={d.vulnerability > 60 ? "hsl(0 72% 51%)" : d.vulnerability > 40 ? "hsl(38 92% 50%)" : "hsl(199 89% 48%)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Radar */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4">Risk Profile – Top 5 Vulnerable</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(222 30% 20%)" />
              <PolarAngleAxis dataKey="axis" tick={{ fill: "hsl(215 20% 55%)", fontSize: 10 }} />
              {top5.map((d, i) => (
                <Radar key={i} name={d.District} dataKey={`d${i}`} stroke={radarColors[i]} fill={radarColors[i]} fillOpacity={0.1} />
              ))}
              <Tooltip contentStyle={{ background: "hsl(222 40% 12%)", border: "1px solid hsl(222 30% 25%)", borderRadius: 8, color: "hsl(210 40% 92%)", fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-3">
            {top5.map((d, i) => (
              <span key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ background: radarColors[i] }} />
                {d.District}
              </span>
            ))}
          </div>
        </div>

        {/* Budget Efficiency */}
        <div className="glass-card rounded-xl p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold mb-4">Budget Efficiency Score by District</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={efficiencyData} layout="vertical">
              <XAxis type="number" domain={[0, 100]} tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: "hsl(210 40% 85%)", fontSize: 10 }} axisLine={false} width={80} />
              <Tooltip contentStyle={{ background: "hsl(222 40% 12%)", border: "1px solid hsl(222 30% 25%)", borderRadius: 8, color: "hsl(210 40% 92%)", fontSize: 12 }} />
              <Bar dataKey="efficiency" radius={[0, 4, 4, 0]}>
                {efficiencyData.map((d, i) => (
                  <Cell key={i} fill={d.efficiency < 30 ? "hsl(0 72% 51%)" : d.efficiency < 60 ? "hsl(38 92% 50%)" : "hsl(160 84% 39%)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
