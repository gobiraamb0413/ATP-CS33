import React from "react";
import { Zap, Settings, AlertCircle, Sun, Moon, Layers } from "lucide-react";
import { Button } from "@/team/sarukan/components/ui/Button";
import { Switch } from "@/team/sarukan/components/ui/Switch";
import { cn } from "@/team/sarukan/services/utils";

interface DashboardHeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
  activeScenarioId: string;
  onSelectScenario: (id: string) => void;
  pendingApprovalsCount: number;
  onOpenApprovals: () => void;
  onOpenSettings: () => void;
  runStatus: "idle" | "running" | "waiting_approval" | "completed";
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  isDark,
  toggleTheme,
  pendingApprovalsCount,
  onOpenApprovals,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-md px-4 sm:px-8 py-3 flex items-center justify-between gap-4 transition-colors">
      <div className="flex items-center gap-4">
        <a
          href="/"
          className="group flex items-center gap-2.5 text-foreground hover:opacity-85 transition-opacity"
          title="Back to Landing Page"
        >
          <div className="h-8 w-8 rounded-xl bg-foreground flex items-center justify-center shadow-sm">
            <Zap className="w-4 h-4 text-background" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight text-foreground">
              Dev<span className="text-muted-foreground font-normal ml-0.5">Concord</span>
            </span>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/60">
              Workspace
            </span>
          </div>
        </a>

        <div className="h-5 w-px bg-border/80 hidden sm:block" />

        <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
          <Layers className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-foreground font-semibold">Acme Automation Systems</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-muted/60 border border-border/60">
            Prod-EU
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        {pendingApprovalsCount > 0 && (
          <button
            onClick={onOpenApprovals}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-semibold transition-all cursor-pointer shadow-sm animate-pulse"
          >
            <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
            <span>Review Gate ({pendingApprovalsCount})</span>
          </button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={onOpenSettings}
          className="h-8 px-3 text-xs gap-1.5 rounded-lg border-border/80 text-muted-foreground hover:text-foreground"
          title="Open Platform & Governance Settings"
        >
          <Settings className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="hidden sm:inline">Settings</span>
        </Button>

        <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/50 border border-border/60">
          <Moon className={cn("h-3.5 w-3.5", isDark ? "text-foreground" : "text-muted-foreground")} />
          <Switch checked={isDark} onCheckedChange={toggleTheme} size="sm" />
          <Sun className={cn("h-3.5 w-3.5", !isDark ? "text-foreground" : "text-muted-foreground")} />
        </div>

        <div className="flex items-center gap-2 pl-1 border-l border-border/60">
          <div className="h-7 w-7 rounded-full bg-zinc-800 dark:bg-zinc-200 text-zinc-100 dark:text-zinc-900 font-bold text-[11px] flex items-center justify-center">
            AO
          </div>
          <span className="text-xs font-medium text-foreground hidden lg:inline">Alex (CTO)</span>
        </div>
      </div>
    </header>
  );
};
