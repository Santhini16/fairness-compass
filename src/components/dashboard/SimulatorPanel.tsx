import { useDashboard } from "@/context/DashboardContext";
import { calcTotalBudget, calcRecommendedAllocation, calcNationalFairness } from "@/data/demoData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { GaugeChart } from "./GaugeChart";

export const SimulatorPanel = () => {
  const { data, simulatorWeights, setSimulatorWeights } = useDashboard();
  const totalBudget = calcTotalBudget(data);

  const chartData = data.map(d => ({
    name: d.District.length > 8 ? d.District.slice(0, 8) + "…" : d.District,
    current: d.Aid_Received,
    proposed: +calcRecommendedAllocation(d, totalBudget, data, simulatorWeights).toFixed(1),
  }));

  // Simulate new fairness with proposed allocations
  const simulatedData = data.map(d => ({
    ...d,
    Aid_Received: +calcRecommendedAllocation(d, totalBudget, data, simulatorWeights).toFixed(1),
  }));
  const newFairness = calcNationalFairness(simulatedData);
  const currentFairness = calcNationalFairness(data);

  const sliders = [
    { key: "poverty" as const, label: "Poverty Weight" },
    { key: "population" as const, label: "Population Weight" },
    { key: "minority" as const, label: "Minority Weight" },
    { key: "disaster" as const, label: "Disaster Weight" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">Allocation Simulator</h2>
        <p className="text-sm text-muted-foreground">Adjust weights to model different allocation strategies. Total budget: ₹{totalBudget} Cr</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sliders */}
        <div className="glass-card rounded-xl p-5 space-y-5">
          <h3 className="text-sm font-semibold">Weight Configuration</h3>
          {sliders.map(s => (
            <div key={s.key}>
              <div className="flex justify-between mb-1">
                <label className="text-xs text-muted-foreground">{s.label}</label>
                <span className="text-xs font-mono text-primary">{simulatorWeights[s.key].toFixed(2)}</span>
              </div>
              <input
                type="range" min="0" max="1" step="0.05"
                value={simulatorWeights[s.key]}
                onChange={e => setSimulatorWeights({ ...simulatorWeights, [s.key]: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"
              />
            </div>
          ))}
        </div>

        {/* Gauges */}
        <div className="glass-card rounded-xl p-5 flex flex-col items-center justify-center gap-4">
          <GaugeChart value={currentFairness} label="Current Fairness" size={140} />
          <div className="section-divider w-full" />
          <GaugeChart value={newFairness} label="Projected Fairness" size={140} />
          <p className={`text-sm font-semibold font-mono ${newFairness > currentFairness ? "text-success" : "text-destructive"}`}>
            {newFairness > currentFairness ? "+" : ""}{((newFairness - currentFairness) * 100).toFixed(1)}% change
          </p>
        </div>

        {/* Chart placeholder */}
        <div className="glass-card rounded-xl p-5 lg:col-span-1">
          <h3 className="text-sm font-semibold mb-4">Budget Constraint Check</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Current Total</span>
              <span className="font-mono">₹{totalBudget} Cr</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Proposed Total</span>
              <span className="font-mono text-primary">₹{chartData.reduce((s, d) => s + d.proposed, 0).toFixed(1)} Cr</span>
            </div>
            <div className="section-divider my-3" />
            <p className="text-xs text-success flex items-center gap-1">
              ✓ Budget constraint maintained
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-4">Current vs Proposed Allocation</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" tick={{ fill: "hsl(215 20% 55%)", fontSize: 10 }} axisLine={false} tickLine={false} angle={-45} textAnchor="end" height={60} />
            <YAxis tick={{ fill: "hsl(215 20% 55%)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "hsl(222 40% 12%)", border: "1px solid hsl(222 30% 25%)", borderRadius: 8, color: "hsl(210 40% 92%)", fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12, color: "hsl(210 40% 85%)" }} />
            <Bar dataKey="current" fill="hsl(222 30% 30%)" name="Current (₹Cr)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="proposed" fill="hsl(199 89% 48%)" name="Proposed (₹Cr)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
