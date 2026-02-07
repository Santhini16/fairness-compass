import { useState } from "react";
import { Bell, Settings, HelpCircle, Shield, Activity } from "lucide-react";
import { useDashboard } from "@/context/DashboardContext";
import { NotificationPanel } from "./NotificationPanel";
import { SettingsModal } from "./SettingsModal";
import { HelpDrawer } from "./HelpDrawer";

export const TopBar = () => {
  const { notifications } = useDashboard();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <header className="fixed top-0 left-64 right-0 h-14 z-40 flex items-center justify-between px-6 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Activity className="h-4 w-4 text-primary" />
          <span className="text-sm text-muted-foreground font-mono">
            LIVE MONITORING • {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
          </span>
          <span className="h-2 w-2 rounded-full bg-success animate-pulse-glow" />
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowHelp(true)}
            className="p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Help"
          >
            <HelpCircle className="h-4.5 w-4.5" />
          </button>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Settings"
          >
            <Settings className="h-4.5 w-4.5" />
          </button>
        </div>
      </header>
      {showNotifs && <NotificationPanel onClose={() => setShowNotifs(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showHelp && <HelpDrawer onClose={() => setShowHelp(false)} />}
    </>
  );
};
