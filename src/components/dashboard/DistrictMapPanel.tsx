import { useDashboard } from "@/context/DashboardContext";
import { calcFairnessScore, calcAidPerCapita, calcVulnerabilityIndex, classifyDistrict, calcRecommendedAllocation, calcTotalBudget } from "@/data/demoData";
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { MapPin } from "lucide-react";

const classColors: Record<string, string> = {
  Critical: "hsl(0 72% 51%)",
  High: "hsl(25 95% 53%)",
  Moderate: "hsl(38 92% 50%)",
  Adequate: "hsl(160 84% 39%)",
};

export const DistrictMapPanel = () => {
  const { data } = useDashboard();
  const totalBudget = calcTotalBudget(data);

  const mapData = data.map(d => ({
    name: d.District,
    state: d.State,
    lng: d.Longitude,
    lat: d.Latitude,
    classification: classifyDistrict(d),
    fairness: (calcFairnessScore(d) * 100).toFixed(1),
    aidPerCapita: calcAidPerCapita(d).toFixed(1),
    recommended: calcRecommendedAllocation(d, totalBudget, data).toFixed(1),
    vulnerability: calcVulnerabilityIndex(d).toFixed(3),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">District Map</h2>
        <p className="text-sm text-muted-foreground">Geographic distribution of aid allocation fairness</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {Object.entries(classColors).map(([label, color]) => (
          <div key={label} className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ background: color }} />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl p-5">
        <ResponsiveContainer width="100%" height={500}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
            <XAxis
              dataKey="lng" type="number" name="Longitude"
              domain={[68, 98]} tick={{ fill: "hsl(215 20% 55%)", fontSize: 10 }}
              axisLine={{ stroke: "hsl(222 30% 20%)" }}
              label={{ value: "Longitude", position: "bottom", fill: "hsl(215 20% 55%)", fontSize: 11, offset: 20 }}
            />
            <YAxis
              dataKey="lat" type="number" name="Latitude"
              domain={[8, 28]} tick={{ fill: "hsl(215 20% 55%)", fontSize: 10 }}
              axisLine={{ stroke: "hsl(222 30% 20%)" }}
              label={{ value: "Latitude", angle: -90, position: "insideLeft", fill: "hsl(215 20% 55%)", fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{ background: "hsl(222 40% 12%)", border: "1px solid hsl(222 30% 25%)", borderRadius: 8, color: "hsl(210 40% 92%)", fontSize: 12 }}
              content={({ payload }) => {
                if (!payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="glass-card rounded-lg p-3 text-xs space-y-1 border border-border">
                    <p className="font-semibold text-sm">{d.name}, {d.state}</p>
                    <p>Fairness: <span className="font-mono">{d.fairness}%</span></p>
                    <p>Aid/Capita: <span className="font-mono">₹{d.aidPerCapita} Cr/M</span></p>
                    <p>Recommended: <span className="font-mono">₹{d.recommended} Cr</span></p>
                    <p>Vulnerability: <span className="font-mono">{d.vulnerability}</span></p>
                    <p>Risk: <span className={`font-semibold ${d.classification === "Critical" ? "text-destructive" : d.classification === "High" ? "text-warning" : "text-success"}`}>{d.classification}</span></p>
                  </div>
                );
              }}
            />
            <Scatter data={mapData} r={8}>
              {mapData.map((d, i) => (
                <Cell key={i} fill={classColors[d.classification]} fillOpacity={0.85} stroke={classColors[d.classification]} strokeWidth={1} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
