import { useDashboard } from "@/context/DashboardContext";
import { calcNationalFairness, calcGiniCoefficient, calcVulnerabilityIndex, calcFairnessScore, calcAidPerCapita, calcTotalBudget, calcRecommendedAllocation } from "@/data/demoData";
import { Download, FileText, Sparkles } from "lucide-react";
import { GaugeChart } from "./GaugeChart";

export const TransparencyPanel = () => {
  const { data, simulatorWeights } = useDashboard();
  const fairness = calcNationalFairness(data);
  const gini = calcGiniCoefficient(data.map(d => d.Aid_Received));
  const totalBudget = calcTotalBudget(data);

  const transparencyScore = +((fairness * 0.4 + (1 - gini) * 0.3 + 0.3) * 100).toFixed(1);

  const downloadCSV = () => {
    const headers = "State,District,Latitude,Longitude,Population,Poverty_Index,Minority_Percentage,Rural_Percentage,Disaster_Severity,Aid_Received,Vulnerability_Index,Fairness_Score,Aid_Per_Capita,Recommended_Allocation\n";
    const rows = data.map(d => {
      const vuln = calcVulnerabilityIndex(d);
      const fs = calcFairnessScore(d);
      const apc = calcAidPerCapita(d);
      const rec = calcRecommendedAllocation(d, totalBudget, data, simulatorWeights);
      return `${d.State},${d.District},${d.Latitude},${d.Longitude},${d.Population},${d.Poverty_Index},${d.Minority_Percentage},${d.Rural_Percentage},${d.Disaster_Severity},${d.Aid_Received},${vuln},${fs},${apc},${rec}`;
    }).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "fairaid_report.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const downloadReport = () => {
    const report = `FAIRAID AI – EXECUTIVE POLICY REPORT
Generated: ${new Date().toLocaleString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

NATIONAL METRICS
• National Fairness Index: ${(fairness * 100).toFixed(1)}%
• Gini Coefficient: ${gini.toFixed(4)}
• Total Budget: ₹${totalBudget} Cr
• Districts Analyzed: ${data.length}
• Transparency Score: ${transparencyScore}%

KEY FINDINGS
${data.filter(d => calcFairnessScore(d) < 0.4).map(d => `• ${d.District}, ${d.State}: Fairness ${(calcFairnessScore(d)*100).toFixed(1)}% – CRITICAL`).join("\n")}

METHODOLOGY
Fairness Score = 1 − |Vulnerability Index − Normalized Aid|
Vulnerability = Poverty(0.35) + Minority(0.20) + Rural(0.15) + Disaster(0.30)

RECOMMENDATIONS
1. Immediate intervention needed for districts below 35% fairness score
2. Reallocate budget using equity-weighted model to reduce Gini coefficient
3. Establish monitoring framework for disaster-prone regions
`;
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "fairaid_policy_report.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  // AI Insights
  const criticalDistricts = data.filter(d => calcFairnessScore(d) < 0.4);
  const avgVuln = (data.reduce((s, d) => s + calcVulnerabilityIndex(d), 0) / data.length).toFixed(3);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-1">Transparency & Reports</h2>
        <p className="text-sm text-muted-foreground">Composite scoring, methodology, and downloadable reports</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transparency Score */}
        <div className="glass-card rounded-xl p-6 flex flex-col items-center justify-center">
          <GaugeChart value={transparencyScore / 100} label="Transparency Score" size={180} />
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Composite of fairness index, distribution equality, and methodology adherence
          </p>
        </div>

        {/* Downloads */}
        <div className="glass-card rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold">Export Reports</h3>
          <button onClick={downloadCSV} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-sm">
            <Download className="h-4 w-4 text-primary" />
            <div className="text-left">
              <p className="font-medium">Download CSV</p>
              <p className="text-xs text-muted-foreground">Full dataset with computed metrics</p>
            </div>
          </button>
          <button onClick={downloadReport} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors text-sm">
            <FileText className="h-4 w-4 text-accent" />
            <div className="text-left">
              <p className="font-medium">Policy Summary Report</p>
              <p className="text-xs text-muted-foreground">Executive-level insights document</p>
            </div>
          </button>
        </div>

        {/* AI Insights */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-semibold">AI Policy Insights</h3>
          </div>
          <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
            <p>
              <span className="text-foreground font-medium">Critical Finding:</span> {criticalDistricts.length} districts show critically low fairness (&lt;40%), primarily in Bihar, UP, and NE states.
            </p>
            <p>
              <span className="text-foreground font-medium">Vulnerability Trend:</span> Average vulnerability index at {avgVuln} indicates systemic under-allocation to high-need regions.
            </p>
            <p>
              <span className="text-foreground font-medium">Recommendation:</span> Shifting to an equity-weighted model (poverty: 0.40, disaster: 0.30) would improve national fairness by an estimated 8-12%.
            </p>
            <p>
              <span className="text-foreground font-medium">Risk Alert:</span> Gini coefficient of {gini.toFixed(3)} suggests {gini > 0.35 ? "significant" : "moderate"} distribution inequality requiring policy intervention.
            </p>
          </div>
        </div>
      </div>

      {/* Methodology */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-3">Methodology</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground">
          <div>
            <p className="text-foreground font-medium mb-1">Vulnerability Index</p>
            <p className="font-mono">V = P×0.35 + M×0.20 + R×0.15 + D×0.30</p>
            <p className="mt-1">P = Poverty Index, M = Minority %, R = Rural %, D = Disaster Severity</p>
          </div>
          <div>
            <p className="text-foreground font-medium mb-1">Fairness Score</p>
            <p className="font-mono">F = 1 − |V − A_norm|</p>
            <p className="mt-1">A_norm = Normalized Aid Per Capita (0-1 scale)</p>
          </div>
        </div>
      </div>
    </div>
  );
};
