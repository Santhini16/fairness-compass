import { X, BookOpen } from "lucide-react";

const sections = [
  {
    title: "Fairness Score",
    content: "Measures the alignment between a district's vulnerability and the aid it receives. Score = 1 − |Vulnerability Index − Normalized Aid|. Values range from 0 (completely unfair) to 1 (perfectly fair).",
  },
  {
    title: "Vulnerability Index",
    content: "Composite metric: Poverty Index × 0.35 + Minority % × 0.20 + Rural % × 0.15 + Disaster Severity × 0.30. Higher values indicate greater need for aid.",
  },
  {
    title: "Gini Coefficient",
    content: "Measures inequality in aid distribution across districts. 0 = perfect equality, 1 = maximum inequality. Calculated using the mean absolute difference formula.",
  },
  {
    title: "Allocation Simulator",
    content: "Adjust poverty, population, minority, and disaster weights to model different allocation strategies. The simulator maintains total budget constraint and redistributes based on weighted vulnerability scores.",
  },
  {
    title: "CSV Upload Format",
    content: "Required columns: State, District, Latitude, Longitude, Population, Poverty_Index (0-1), Minority_Percentage (0-100), Rural_Percentage (0-100), Disaster_Severity (0-1), Aid_Received (in crores). All numeric fields must be positive numbers.",
  },
];

export const HelpDrawer = ({ onClose }: { onClose: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-background/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md h-full bg-card border-l border-border overflow-y-auto animate-slide-in-right scrollbar-thin"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-card/90 backdrop-blur-sm border-b border-border p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Documentation</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5 space-y-6">
          {sections.map((s, i) => (
            <div key={i} className="glass-card rounded-xl p-4">
              <h3 className="text-sm font-semibold text-primary mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
