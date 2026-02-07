import { useDashboard } from "@/context/DashboardContext";
import { calcNationalFairness, calcUnderservedCount, calcGiniCoefficient, District } from "@/data/demoData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Zap } from "lucide-react";

export const StressTestPanel = () => {
  const { data, stressParams, setStressParams, addNotification } = useDashboard();

  // Apply stress
  const stressedData: District[] = data.map(d => ({
    ...d,
    Disaster_Severity: Math.min(1, d.Disaster_Severity * (1 + stressParams.disasterIncrease / 100)),
    Aid_Received: d.Aid_Received * (1 - stressParams.budgetReduction / 100),
  }));

  const currentFairness = calcNationalFairness(data);
  const stressedFairness = calcNationalFairness(stressedData);
  const currentUnderserved = calcUnderservedCount(data);
  const stressedUnderserved = calcUnderservedCount(stressedData);
  const currentGini = calcGiniCoefficient(data.map(d => d.Aid_Received));
  const stressedGini = calcGiniCoefficient(stressedData.map(d => d.Aid_Received));

  const comparison = [
    { metric: "Fairness Index", current: +(currentFairness * 100).toFixed(1), stressed: +(stressedFairness * 100).toFixed(1) },
    { metric: "Underserved", current: currentUnderserved, stressed: stressedUnderserved },
    { metric: "Gini (×100)", current: +(currentGini * 100).toFixed(1), stressed: +(stressedGini * 100).toFixed(1) },
  ];

  const runStressTest = () => {
    addNotification({
      type: "warning",
      title: "Stress Test Complete",
      message: `Disaster +${stressParams.disasterIncrease}%, Budget -${stressParams.budgetReduction}%: Fairness dropped ${((currentFairness - stressedFairness) * 100).toFixed(1)}%`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">Stress Testing</h2>
        <p className="text-sm text-muted-foreground">Simulate adverse scenarios to assess system resilience</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-5 space-y-5">
          <h3 className="text-sm font-semibold">Scenario Parameters</h3>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs text-muted-foreground">Increase Disaster Severity</label>
              <span className="text-xs font-mono text-warning">+{stressParams.disasterIncrease}%</span>
            </div>
            <input type="range" min="0" max="100" step="5" value={stressParams.disasterIncrease}
              onChange={e => setStressParams({ ...stressParams, disasterIncrease: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-secondary rounded-full appearance-none cursor-pointer accent-warning" />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs text-muted-foreground">Reduce National Budget</label>
              <span className="text-xs font-mono text-destructive">-{stressParams.budgetReduction}%</span>
            </div>
            <input type="range" min="0" max="50" step="5" value={stressParams.budgetReduction}
              onChange={e => setStressParams({ ...stressParams, budgetReduction: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-secondary rounded-full appearance-none cursor-pointer accent-destructive" />
          </div>

          <button
            onClick={runStressTest}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-warning text-warning-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <Zap className="h-4 w-4" />
            Run Stress Test
          </button>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4">Impact Comparison</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={comparison}>
              <XAxis dataKey="metric" tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} />
              <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} />
              <Tooltip contentStyle={{ background: "hsl(222 40% 12%)", border: "1px solid hsl(222 30% 25%)", borderRadius: 8, color: "hsl(210 40% 92%)", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="current" fill="hsl(199 89% 48%)" name="Current" radius={[4, 4, 0, 0]} />
              <Bar dataKey="stressed" fill="hsl(0 72% 51%)" name="Stressed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
