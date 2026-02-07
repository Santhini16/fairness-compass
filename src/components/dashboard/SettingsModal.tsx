import { X, RotateCcw } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";

export const SettingsModal = ({ onClose }: { onClose: () => void }) => {
  const {
    fairnessModel, setFairnessModel,
    classificationThreshold, setClassificationThreshold,
    demoMode, setDemoMode,
    resetDashboard,
  } = useDashboard();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-card w-full max-w-md rounded-2xl p-6 animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Dashboard Settings</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Fairness Model */}
          <div>
            <label className="text-sm font-medium mb-2 block">Fairness Model</label>
            <div className="grid grid-cols-2 gap-2">
              {(["equity", "equality"] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setFairnessModel(m)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    fairnessModel === m
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {m === "equity" ? "Equity-based" : "Equality-based"}
                </button>
              ))}
            </div>
          </div>

          {/* Threshold */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Classification Threshold: <span className="font-mono text-primary">{classificationThreshold.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={classificationThreshold}
              onChange={e => setClassificationThreshold(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-secondary rounded-full appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-1">
              <span>0.10</span><span>0.50</span><span>0.90</span>
            </div>
          </div>

          {/* Demo toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Demo Data</p>
              <p className="text-xs text-muted-foreground">Use sample dataset</p>
            </div>
            <button
              onClick={() => setDemoMode(!demoMode)}
              className={`w-11 h-6 rounded-full transition-colors relative ${demoMode ? "bg-primary" : "bg-secondary"}`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-foreground transition-transform ${demoMode ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </div>

          {/* Reset */}
          <button
            onClick={() => { resetDashboard(); onClose(); }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors text-sm font-medium"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
