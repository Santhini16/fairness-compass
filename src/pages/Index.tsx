import { DashboardProvider, useDashboard } from "@/context/DashboardContext";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { OverviewPanel } from "@/components/dashboard/OverviewPanel";
import { BiasDetectionPanel } from "@/components/dashboard/BiasDetectionPanel";
import { DistrictMapPanel } from "@/components/dashboard/DistrictMapPanel";
import { SimulatorPanel } from "@/components/dashboard/SimulatorPanel";
import { StressTestPanel } from "@/components/dashboard/StressTestPanel";
import { AnalyticsPanel } from "@/components/dashboard/AnalyticsPanel";
import { TransparencyPanel } from "@/components/dashboard/TransparencyPanel";

const panels = {
  overview: OverviewPanel,
  bias: BiasDetectionPanel,
  map: DistrictMapPanel,
  simulator: SimulatorPanel,
  stress: StressTestPanel,
  analytics: AnalyticsPanel,
  transparency: TransparencyPanel,
};

const DashboardContent = () => {
  const { activeTab } = useDashboard();
  const Panel = panels[activeTab];

  return (
    <div className="min-h-screen">
      <Sidebar />
      <TopBar />
      <main className="ml-64 pt-14 min-h-screen">
        <div className="p-6 max-w-[1400px] mx-auto">
          <Panel />
        </div>
      </main>
    </div>
  );
};

const Index = () => (
  <DashboardProvider>
    <DashboardContent />
  </DashboardProvider>
);

export default Index;
