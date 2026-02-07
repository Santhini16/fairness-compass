import { useRef, useState } from "react";
import {
  LayoutDashboard, Target, Map, Sliders, Zap, BarChart3,
  FileText, Upload, Plus, Shield
} from "lucide-react";
import { useDashboard, ActiveTab } from "@/context/DashboardContext";
import { REQUIRED_COLUMNS, INDIAN_STATES, District } from "@/data/demoData";

const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: "bias", label: "Bias Detection", icon: <Target className="h-4 w-4" /> },
  { id: "map", label: "District Map", icon: <Map className="h-4 w-4" /> },
  { id: "simulator", label: "Simulator", icon: <Sliders className="h-4 w-4" /> },
  { id: "stress", label: "Stress Testing", icon: <Zap className="h-4 w-4" /> },
  { id: "analytics", label: "Analytics", icon: <BarChart3 className="h-4 w-4" /> },
  { id: "transparency", label: "Reports", icon: <FileText className="h-4 w-4" /> },
];

export const Sidebar = () => {
  const { activeTab, setActiveTab, setData, data, addDistrict, addNotification } = useDashboard();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({
    State: INDIAN_STATES[0], District: "", Latitude: "", Longitude: "",
    Population: "", Poverty_Index: "", Minority_Percentage: "",
    Rural_Percentage: "", Disaster_Severity: "", Aid_Received: "",
  });

  const handleCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.trim().split("\n");
      const headers = lines[0].split(",").map(h => h.trim());
      const missing = REQUIRED_COLUMNS.filter(c => !headers.includes(c));
      if (missing.length > 0) {
        setUploadMsg(`Missing columns: ${missing.join(", ")}`);
        return;
      }
      const rows: District[] = lines.slice(1).map((line, i) => {
        const vals = line.split(",").map(v => v.trim());
        const row: any = {};
        headers.forEach((h, j) => { row[h] = vals[j]; });
        return {
          id: `csv-${i}`,
          State: row.State || "",
          District: row.District || "",
          Latitude: parseFloat(row.Latitude) || 0,
          Longitude: parseFloat(row.Longitude) || 0,
          Population: parseInt(row.Population) || 0,
          Poverty_Index: parseFloat(row.Poverty_Index) || 0,
          Minority_Percentage: parseFloat(row.Minority_Percentage) || 0,
          Rural_Percentage: parseFloat(row.Rural_Percentage) || 0,
          Disaster_Severity: parseFloat(row.Disaster_Severity) || 0,
          Aid_Received: parseFloat(row.Aid_Received) || 0,
        };
      }).filter(r => r.District);
      setData(rows);
      setUploadMsg(`✓ Loaded ${rows.length} districts`);
      addNotification({ type: "success", title: "Dataset Uploaded", message: `${rows.length} districts loaded from CSV` });
    };
    reader.readAsText(file);
  };

  const handleAddDistrict = () => {
    if (!form.District || !form.Population) return;
    addDistrict({
      State: form.State,
      District: form.District,
      Latitude: parseFloat(form.Latitude) || 0,
      Longitude: parseFloat(form.Longitude) || 0,
      Population: parseInt(form.Population) || 0,
      Poverty_Index: parseFloat(form.Poverty_Index) || 0,
      Minority_Percentage: parseFloat(form.Minority_Percentage) || 0,
      Rural_Percentage: parseFloat(form.Rural_Percentage) || 0,
      Disaster_Severity: parseFloat(form.Disaster_Severity) || 0,
      Aid_Received: parseFloat(form.Aid_Received) || 0,
    });
    setForm({ State: INDIAN_STATES[0], District: "", Latitude: "", Longitude: "", Population: "", Poverty_Index: "", Minority_Percentage: "", Rural_Percentage: "", Disaster_Severity: "", Aid_Received: "" });
    setShowAddForm(false);
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border z-50 flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">FairAid AI</h1>
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">National Intelligence</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === item.id
                ? "bg-sidebar-accent text-sidebar-accent-foreground border border-primary/20 shadow-sm"
                : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}

        <div className="section-divider my-4" />

        {/* CSV Upload */}
        <div className="px-1">
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all"
          >
            <Upload className="h-4 w-4" />
            Upload Dataset
          </button>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleCSV} />
          {uploadMsg && (
            <p className={`text-xs px-3 mt-1 ${uploadMsg.startsWith("✓") ? "text-success" : "text-destructive"}`}>
              {uploadMsg}
            </p>
          )}
        </div>

        {/* Add District */}
        <div className="px-1">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all"
          >
            <Plus className="h-4 w-4" />
            Add District
          </button>
          {showAddForm && (
            <div className="mt-2 p-3 glass-card rounded-lg space-y-2">
              <select
                value={form.State}
                onChange={e => setForm(f => ({ ...f, State: e.target.value }))}
                className="w-full px-2 py-1.5 rounded bg-input text-foreground text-xs border border-border"
              >
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {["District", "Latitude", "Longitude", "Population", "Poverty_Index", "Minority_Percentage", "Rural_Percentage", "Disaster_Severity", "Aid_Received"].map(field => (
                <input
                  key={field}
                  placeholder={field.replace("_", " ")}
                  value={(form as any)[field]}
                  onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                  className="w-full px-2 py-1.5 rounded bg-input text-foreground text-xs border border-border placeholder:text-muted-foreground"
                />
              ))}
              <button
                onClick={handleAddDistrict}
                className="w-full py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Add to Dataset
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <p className="text-[10px] text-muted-foreground font-mono text-center">
          {data.length} DISTRICTS LOADED
        </p>
      </div>
    </aside>
  );
};
