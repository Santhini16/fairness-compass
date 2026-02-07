import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { District, generateDemoData } from "@/data/demoData";

export type FairnessModel = "equity" | "equality";
export type ActiveTab = "overview" | "bias" | "map" | "simulator" | "stress" | "analytics" | "transparency";

export interface Notification {
  id: string;
  type: "alert" | "info" | "warning" | "success";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface DashboardState {
  data: District[];
  demoMode: boolean;
  fairnessModel: FairnessModel;
  classificationThreshold: number;
  activeTab: ActiveTab;
  notifications: Notification[];
  simulatorWeights: { poverty: number; population: number; minority: number; disaster: number };
  stressParams: { disasterIncrease: number; budgetReduction: number };
}

interface DashboardContextType extends DashboardState {
  setData: (data: District[]) => void;
  addDistrict: (d: Omit<District, "id">) => void;
  setDemoMode: (v: boolean) => void;
  setFairnessModel: (m: FairnessModel) => void;
  setClassificationThreshold: (v: number) => void;
  setActiveTab: (t: ActiveTab) => void;
  addNotification: (n: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  setSimulatorWeights: (w: DashboardState["simulatorWeights"]) => void;
  setStressParams: (p: DashboardState["stressParams"]) => void;
  resetDashboard: () => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
};

const defaultWeights = { poverty: 0.35, population: 0.25, minority: 0.2, disaster: 0.2 };
const defaultStress = { disasterIncrease: 0, budgetReduction: 0 };

const generateInitialNotifications = (): Notification[] => [
  { id: "n1", type: "alert", title: "Underserved Districts Detected", message: "3 districts fall below the critical fairness threshold of 0.35", timestamp: new Date(), read: false },
  { id: "n2", type: "warning", title: "High Disparity in Bihar", message: "Araria and Kishanganj show significant aid-vulnerability mismatch", timestamp: new Date(Date.now() - 3600000), read: false },
  { id: "n3", type: "info", title: "System Ready", message: "FairAid AI dashboard initialized with 20 district records", timestamp: new Date(Date.now() - 7200000), read: true },
];

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<District[]>(generateDemoData());
  const [demoMode, setDemoMode] = useState(true);
  const [fairnessModel, setFairnessModel] = useState<FairnessModel>("equity");
  const [classificationThreshold, setClassificationThreshold] = useState(0.5);
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [notifications, setNotifications] = useState<Notification[]>(generateInitialNotifications());
  const [simulatorWeights, setSimulatorWeights] = useState(defaultWeights);
  const [stressParams, setStressParams] = useState(defaultStress);

  const addDistrict = useCallback((d: Omit<District, "id">) => {
    const newDistrict: District = { ...d, id: `d-${Date.now()}` };
    setData(prev => [...prev, newDistrict]);
    setNotifications(prev => [{
      id: `n-${Date.now()}`,
      type: "success",
      title: "District Added",
      message: `${d.District}, ${d.State} added to dataset`,
      timestamp: new Date(),
      read: false,
    }, ...prev]);
  }, []);

  const addNotification = useCallback((n: Omit<Notification, "id" | "timestamp" | "read">) => {
    setNotifications(prev => [{
      ...n, id: `n-${Date.now()}`, timestamp: new Date(), read: false,
    }, ...prev]);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const clearNotifications = useCallback(() => setNotifications([]), []);

  const resetDashboard = useCallback(() => {
    setData(generateDemoData());
    setDemoMode(true);
    setFairnessModel("equity");
    setClassificationThreshold(0.5);
    setActiveTab("overview");
    setSimulatorWeights(defaultWeights);
    setStressParams(defaultStress);
    setNotifications(generateInitialNotifications());
  }, []);

  const value = useMemo(() => ({
    data, setData, addDistrict, demoMode, setDemoMode,
    fairnessModel, setFairnessModel, classificationThreshold, setClassificationThreshold,
    activeTab, setActiveTab, notifications, addNotification, markNotificationRead, clearNotifications,
    simulatorWeights, setSimulatorWeights, stressParams, setStressParams, resetDashboard,
  }), [data, demoMode, fairnessModel, classificationThreshold, activeTab, notifications, simulatorWeights, stressParams, addDistrict, addNotification, markNotificationRead, clearNotifications, resetDashboard]);

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};
