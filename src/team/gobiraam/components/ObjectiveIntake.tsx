import React, { useState } from "react";
import {
  Target,
  FileCheck2,
  Database,
  CheckCircle2,
  Play,
  Settings
} from "lucide-react";
import { Button } from "@/team/sarukan/components/ui/Button";
import { StartupScenario, STARTUP_SCENARIOS } from "@/team/sarukan/services/StartupTelemetrySample";
import { SystemSettingsState } from "@/team/sarukan/components/SettingsView";
import { cn } from "@/team/sarukan/services/utils";

interface ObjectiveIntakeProps {
  currentScenario: StartupScenario;
  onSelectScenario: (scenario: StartupScenario) => void;
  onLaunchWorkflow: () => void;
  isExecuting: boolean;
  onOpenSettings: () => void;
  settings: SystemSettingsState;
}

export const ObjectiveIntake: React.FC<ObjectiveIntakeProps> = ({
  currentScenario,
  onSelectScenario,
  onLaunchWorkflow,
  isExecuting,
  onOpenSettings,
  settings
}) => {
  const [userObjective, setUserObjective] = useState<string>(currentScenario.description);
  const [targetMetric, setTargetMetric] = useState<string>(currentScenario.targetMetric);
  const [customMode, setCustomMode] = useState<boolean>(false);

  const handleScenarioChange = (s: StartupScenario) => {
    setCustomMode(false);
    onSelectScenario(s);
    setUserObjective(s.description);
    setTargetMetric(s.targetMetric);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/80 bg-gradient-to-r from-muted/30 via-muted/10 to-background p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Specialized Automation Suite for Startups
            </div>

            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Automated Data Science Diagnostics
            </h2>

            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              Define your operational goal. DevConcord automatically coordinates specialized agents to inspect schemas, test statistical variance, and generate an executive report backed by verifiable evidence.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={onLaunchWorkflow}
              disabled={isExecuting}
              className="gap-2 h-10 px-5 rounded-xl text-xs font-semibold shadow-sm bg-foreground text-background hover:opacity-90"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              {isExecuting ? "Executing Workflow..." : "Plan & Run Autonomous Loop"}
            </Button>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-border/60">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-2.5 font-mono">
            Task Presets:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {STARTUP_SCENARIOS.map((sc) => {
              const isSelected = !customMode && currentScenario.id === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => handleScenarioChange(sc)}
                  className={cn(
                    "text-left p-3.5 rounded-xl border transition-all cursor-pointer relative",
                    isSelected
                      ? "bg-foreground/5 dark:bg-foreground/10 border-foreground/30 shadow-sm"
                      : "bg-background/60 hover:bg-muted/40 border-border/70 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border/60">
                      {sc.category}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-foreground mb-1 line-clamp-1">
                    {sc.title}
                  </h4>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {sc.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-2xl border border-border/80 bg-background p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-emerald-500" />
              <h3 className="text-sm font-bold text-foreground">
                Diagnostic Objective &amp; Scope
              </h3>
            </div>
            <span className="text-[11px] font-mono text-muted-foreground">
              Natural Language Intake
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">
              Diagnostic Question or Target Goal
            </label>
            <textarea
              rows={3}
              value={userObjective}
              onChange={(e) => {
                setUserObjective(e.target.value);
                setCustomMode(true);
              }}
              placeholder="e.g. Investigate why Celery batch worker p99 latency spiked past 800ms during the 11:40 UTC ETL run..."
              className="w-full rounded-xl border border-border bg-muted/20 px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground transition-all leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Target Metric / Anomaly Key</label>
              <input
                type="text"
                value={targetMetric}
                onChange={(e) => setTargetMetric(e.target.value)}
                className="w-full rounded-lg border border-border bg-muted/20 px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Telemetry Source Asset</label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted/30 text-xs font-mono text-muted-foreground">
                <Database className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span className="truncate">{currentScenario.datasetName}</span>
                <span className="text-[10px] text-foreground font-semibold shrink-0">
                  ({(currentScenario.rowCount / 1000).toFixed(1)}k rows)
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border/60 flex items-center justify-between flex-wrap gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span>Budget Cap: <strong className="text-foreground font-mono">${settings.budgetCap.toFixed(2)}</strong></span>
              <span>·</span>
              <span>ML Evaluator: <strong className="text-foreground">{settings.enableOptionalML ? "Enabled" : "Disabled"}</strong></span>
              <span>·</span>
              <span>Oversight Gates: <strong className="text-foreground">{settings.requireGateInfra ? "Required" : "Auto"}</strong></span>
            </div>

            <button
              onClick={onOpenSettings}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              <Settings className="h-3 w-3" />
              Configure in Settings
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 rounded-2xl border border-border/80 bg-muted/20 p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-emerald-500" />
                <h3 className="text-sm font-bold text-foreground">
                  Pre-Flight Verification
                </h3>
              </div>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
                Ready
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-background/80 text-xs">
                <span className="font-medium text-foreground">Scope Validation</span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Bounded
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-background/80 text-xs">
                <span className="font-medium text-foreground">Source Reachability</span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Connected
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-background/80 text-xs">
                <span className="font-medium text-foreground">Security Sandbox</span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Least-Privilege
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-background/80 text-xs">
                <span className="font-medium text-foreground">Estimated Run Cost</span>
                <span className="text-[11px] text-foreground font-mono font-bold">
                  {currentScenario.estimatedCost.split(" ")[0]}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Audit Trail &amp; Lineage: <strong>Enabled</strong></span>
            <span>Retry Cap: <strong>{settings.maxRetries} attempts</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
