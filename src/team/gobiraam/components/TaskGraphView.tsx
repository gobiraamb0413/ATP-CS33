import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Layers,
  Cpu
} from "lucide-react";
import { StartupScenario } from "@/team/sarukan/services/StartupTelemetrySample";
import { cn } from "@/team/sarukan/services/utils";
import { Button } from "@/team/sarukan/components/ui/Button";

interface TaskGraphViewProps {
  scenario: StartupScenario;
  onOpenGate: () => void;
}

export const TaskGraphView: React.FC<TaskGraphViewProps> = ({
  scenario,
  onOpenGate
}) => {
  const [selectedStepId, setSelectedStepId] = useState<string>("step-5");
  const selectedStep = scenario.defaultPlan.find((s) => s.id === selectedStepId) || scenario.defaultPlan[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border/70 bg-muted/20">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Layers className="h-4 w-4 text-emerald-500" />
            Workflow Plan &amp; Task Graph (DAG)
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Inspectable dependency graph with sandboxed tool adapters and human approval checkpoints.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-background border border-border text-muted-foreground">
            {scenario.defaultPlan.length} Tasks Scheduled
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Graph Status: Bounded &amp; Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-3">
          {scenario.defaultPlan.map((step, idx) => {
            const isSelected = step.id === selectedStepId;
            const isGate = step.type === "approval_gate";

            return (
              <div
                key={step.id}
                onClick={() => setSelectedStepId(step.id)}
                className={cn(
                  "p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                  isSelected
                    ? "bg-muted/40 border-foreground/30 shadow-md ring-1 ring-foreground/20"
                    : "bg-background/80 hover:bg-muted/30 border-border/70 text-muted-foreground hover:text-foreground",
                  isGate && "border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10"
                )}
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0",
                    step.status === "completed" && "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30",
                    step.status === "waiting_approval" && "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/40 animate-pulse",
                    step.status === "pending" && "bg-muted text-muted-foreground border border-border"
                  )}>
                    {idx + 1}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-bold text-foreground">
                        {step.name}
                      </h4>
                      {isGate && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold border border-amber-500/30">
                          Human Gate (HITL)
                        </span>
                      )}
                      {step.type === "ml_optional" && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-500/10 text-muted-foreground border border-border">
                          Optional ML
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-2">
                      <span>Worker: <strong className="text-foreground">{step.worker}</strong></span>
                      <span>·</span>
                      <span className="font-mono text-[10px]">{step.duration}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  {step.status === "completed" && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Completed
                    </span>
                  )}
                  {step.status === "waiting_approval" && (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenGate();
                      }}
                      className="h-8 text-xs bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg shadow-sm gap-1.5"
                    >
                      <AlertCircle className="h-3.5 w-3.5" />
                      Review Gate
                    </Button>
                  )}
                  {step.status === "pending" && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-muted px-2.5 py-1 rounded-md border border-border">
                      <Clock className="h-3.5 w-3.5" />
                      Queued
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-4 rounded-xl border border-border/80 bg-muted/20 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5 font-mono">
              <Cpu className="h-3.5 w-3.5 text-emerald-500" />
              Node Contract Inspector
            </h4>
            <span className="text-[10px] font-mono text-muted-foreground">
              Inspector
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[11px] text-muted-foreground block">Task Name</span>
              <div className="text-xs font-bold text-foreground mt-0.5">
                {selectedStep.name}
              </div>
            </div>

            <div>
              <span className="text-[11px] text-muted-foreground block">Assigned Specialist Worker</span>
              <div className="text-xs font-medium text-foreground mt-0.5">
                {selectedStep.worker}
              </div>
            </div>

            <div>
              <span className="text-[11px] text-muted-foreground block">Tool Adapter / Sandbox Interface</span>
              <div className="text-xs font-mono px-2 py-1 rounded bg-background border border-border text-emerald-600 dark:text-emerald-400 mt-1 inline-block">
                {selectedStep.toolAdapter}
              </div>
            </div>

            <div>
              <span className="text-[11px] text-muted-foreground block">Evidence Produced</span>
              <div className="text-xs text-foreground bg-background/60 p-2.5 rounded-lg border border-border/60 mt-1 font-mono text-[11px] leading-relaxed">
                {selectedStep.evidenceProduced}
              </div>
            </div>

            <div>
              <span className="text-[11px] text-muted-foreground block">Execution Boundary &amp; Constraints</span>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {selectedStep.details}
              </p>
            </div>
          </div>

          {selectedStep.type === "approval_gate" && (
            <div className="pt-3 border-t border-border/60">
              <Button
                onClick={onOpenGate}
                className="w-full text-xs font-semibold h-9 rounded-lg bg-amber-500 hover:bg-amber-600 text-black shadow-sm"
              >
                Open Human Gate Decision Drawer
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
