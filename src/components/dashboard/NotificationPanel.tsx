import { X, AlertTriangle, Info, CheckCircle, AlertCircle } from "lucide-react";
import { useDashboard, Notification } from "@/context/DashboardContext";

const iconMap = {
  alert: <AlertCircle className="h-4 w-4 text-destructive" />, 
  warning: <AlertTriangle className="h-4 w-4 text-warning" />,
  info: <Info className="h-4 w-4 text-primary" />,
  success: <CheckCircle className="h-4 w-4 text-success" />,
};

export const NotificationPanel = ({ onClose }: { onClose: () => void }) => {
  const { notifications, markNotificationRead, clearNotifications } = useDashboard();

  return (
    <div className="fixed top-14 right-4 w-96 max-h-[70vh] z-50 glass-card rounded-xl overflow-hidden animate-fade-in-up">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="text-sm font-semibold">Notifications</h3>
        <div className="flex gap-2">
          <button onClick={clearNotifications} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Clear all
          </button>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="overflow-y-auto max-h-[60vh] scrollbar-thin">
        {notifications.length === 0 ? (
          <p className="p-6 text-center text-sm text-muted-foreground">No notifications</p>
        ) : (
          notifications.map(n => (
            <button
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`w-full text-left p-4 border-b border-border/50 hover:bg-secondary/50 transition-colors ${!n.read ? "bg-secondary/30" : ""}`}
            >
              <div className="flex gap-3">
                <div className="mt-0.5">{iconMap[n.type]}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                    {n.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {!n.read && <span className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
