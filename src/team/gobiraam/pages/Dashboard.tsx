import React, { useState, useEffect } from "react";
import {
  Target,
  Layers,
  Bot,
  ShieldCheck,
  FileText,
  History,
  Settings as SettingsIcon,
  Database
} from "lucide-react";
import { DashboardHeader } from "@/team/gobiraam/components/DashboardHeader";
import { ObjectiveIntake } from "@/team/gobiraam/components/ObjectiveIntake";
import { TaskGraphView } from "@/team/gobiraam/components/TaskGraphView";
import { AgentFleetConsole } from "@/team/gobiraam/components/AgentFleetConsole";
import { EvidenceLedger } from "@/team/ashmiga/components/EvidenceLedger";
import { ExecutiveReportView } from "@/team/ashmiga/components/ExecutiveReportView";
import { DataConnectorsView } from "@/team/sarukan/components/DataConnectorsView";
import { RunHistoryView } from "@/team/ashmiga/components/RunHistoryView";
import { SettingsView, DEFAULT_SETTINGS, SystemSettingsState } from "@/team/sarukan/components/SettingsView";
import { AgentCopilotDrawer } from "@/team/ashmiga/components/AgentCopilotDrawer";
import { ApprovalGatesModal } from "@/team/gobiraam/components/ApprovalGatesModal";
import { STARTUP_SCENARIOS, StartupScenario } from "@/team/sarukan/services/StartupTelemetrySample";
import { cn } from "@/team/sarukan/services/utils";

type TabId = "intake" | "graph" | "fleet" | "evidence" | "report" | "connectors" | "history" | "settings";

export const Dashboard: React.FC = () => {
  const [currentScenario, setCurrentScenario] = useState<StartupScenario>(STARTUP_SCENARIOS[0]);
  const [activeTab, setActiveTab] = useState<TabId>("intake");
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [runStatus, setRunStatus] = useState<"idle" | "running" | "waiting_approval" | "completed">("waiting_approval");
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState<number>(1);
  const [isGateModalOpen, setIsGateModalOpen] = useState<boolean>(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [settings, setSettings] = useState<SystemSettingsState>(DEFAULT_SETTINGS);

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleLaunchWorkflow = () => {
    setIsExecuting(true);
    setRunStatus("running");
    setActiveTab("fleet");

    setTimeout(() => {
      setIsExecuting(false);
      if (settings.requireGateInfra) {
        setRunStatus("waiting_approval");
        setPendingApprovalsCount(1);
        setActiveTab("graph");
      } else {
        setRunStatus("completed");
        setPendingApprovalsCount(0);
        setActiveTab("report");
      }
    }, 2400);
  };

  const handleApproveGate = () => {
    setIsGateModalOpen(false);
    setPendingApprovalsCount(0);
    setRunStatus("completed");
    setActiveTab("report");
  };

  const handleRejectGate = () => {
    setIsGateModalOpen(false);
    setRunStatus("idle");
    setActiveTab("intake");
  };

  const handleLoadPastRun = () => {
    const found = STARTUP_SCENARIOS.find((s) => s.id === "saas-churn") || STARTUP_SCENARIOS[0];
    setCurrentScenario(found);
    setRunStatus("completed");
    setPendingApprovalsCount(0);
    setActiveTab("report");
  };

  const navTabs: Array<{ id: TabId; label: string; icon: React.FC<{ className?: string }>; badge?: string }> = [
    { id: "intake", label: "Objective & Intake", icon: Target },
    { id: "graph", label: "Workflow DAG", icon: Layers, badge: runStatus === "waiting_approval" ? "Gate" : undefined },
    { id: "fleet", label: "Agent Fleet & Stream", icon: Bot },
    { id: "evidence", label: "Evidence Ledger", icon: ShieldCheck },
    { id: "report", label: "Executive Synthesis", icon: FileText, badge: runStatus === "completed" ? "Ready" : undefined },
    { id: "connectors", label: "Data Sources & Lake", icon: Database },
    { id: "history", label: "Run History", icon: History },
    { id: "settings", label: "Settings", icon: SettingsIcon }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-primarylw transition-colors duration-300">
      <DashboardHeader
        isDark={isDark}
        toggleTheme={toggleTheme}
        activeScenarioId={currentScenario.id}
        onSelectScenario={(id) => {
          const sc = STARTUP_SCENARIOS.find((s) => s.id === id);
          if (sc) setCurrentScenario(sc);
        }}
        pendingApprovalsCount={pendingApprovalsCount}
        onOpenApprovals={() => setIsGateModalOpen(true)}
        onOpenSettings={() => setActiveTab("settings")}
        runStatus={runStatus}
      />

      <div className="border-b border-border/80 bg-background/50 backdrop-blur-sm sticky top-[57px] z-30 px-4 sm:px-8">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 no-scrollbar">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer relative",
                  isActive
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-background" : "text-muted-foreground")} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={cn(
                    "text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold",
                    tab.badge === "Gate"
                      ? "bg-amber-500 text-black animate-pulse"
                      : "bg-emerald-500/20 text-emerald-400"
                  )}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6">
        {activeTab === "intake" && (
          <ObjectiveIntake
            currentScenario={currentScenario}
            onSelectScenario={(sc) => setCurrentScenario(sc)}
            onLaunchWorkflow={handleLaunchWorkflow}
            isExecuting={isExecuting}
            onOpenSettings={() => setActiveTab("settings")}
            settings={settings}
          />
        )}

        {activeTab === "graph" && (
          <TaskGraphView
            scenario={currentScenario}
            onOpenGate={() => setIsGateModalOpen(true)}
          />
        )}

        {activeTab === "fleet" && (
          <AgentFleetConsole scenario={currentScenario} />
        )}

        {activeTab === "evidence" && (
          <EvidenceLedger scenario={currentScenario} />
        )}

        {activeTab === "report" && (
          <ExecutiveReportView scenario={currentScenario} />
        )}

        {activeTab === "connectors" && (
          <DataConnectorsView />
        )}

        {activeTab === "history" && (
          <RunHistoryView onLoadRun={handleLoadPastRun} />
        )}

        {activeTab === "settings" && (
          <SettingsView
            settings={settings}
            onSaveSettings={(newSettings) => setSettings(newSettings)}
          />
        )}
      </main>

      <button
        onClick={() => setIsCopilotOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-foreground text-background font-semibold text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-border"
        title="Open DevConcord Data Science Copilot"
      >
        <Bot className="h-4 w-4 text-emerald-400" />
        <span>Ask Copilot</span>
      </button>

      <AgentCopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        scenario={currentScenario}
      />

      <ApprovalGatesModal
        isOpen={isGateModalOpen}
        onClose={() => setIsGateModalOpen(false)}
        scenario={currentScenario}
        onApprove={handleApproveGate}
        onReject={handleRejectGate}
      />
    </div>
  );
};

export default Dashboard;
