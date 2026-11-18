import React, { useState } from "react";
import {
  Terminal,
  Cpu,
  Bot,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from "lucide-react";
import { Button } from "@/team/sarukan/components/ui/Button";
import { StartupScenario } from "@/team/sarukan/services/StartupTelemetrySample";
import { cn } from "@/team/sarukan/services/utils";

interface AgentFleetConsoleProps {
  scenario: StartupScenario;
}

export const AgentFleetConsole: React.FC<AgentFleetConsoleProps> = ({ scenario }) => {
  const [logFilter, setLogFilter] = useState<"all" | "tools" | "evidence">("all");

  const agents = [
    {
      name: "Supervisor Agent",
      role: "Graph Coordination & Budget Enforcer",
      status: "active",
      currentTask: "Monitoring Step 5 approval state; budget consumption at $0.38",
      toolsUsed: ["langgraph_state_machine", "cost_guard_limiter"]
    },
    {
      name: "Inspection & Profiling Agent",
      role: "Data Hygiene & Schema Contracts",
      status: "idle",
      currentTask: "Completed schema normalization & null surge verification",
      toolsUsed: ["parquet_profiler_adapter", "schema_contract_checker"]
    },
    {
      name: "Statistical Analysis Specialist",
      role: "Variance, Outliers & Optional ML",
      status: "idle",
      currentTask: "Extracted feature variance & SHAP attribution values",
      toolsUsed: ["scipy_changepoint_test", "shap_tree_explainer"]
    },
    {
      name: "Critique & Quality Controller",
      role: "Hallucination & Evidence Verification",
      status: "idle",
      currentTask: "Audited 3 assertions against raw parquet log rows",
      toolsUsed: ["evidence_verifier_rule_engine", "retry_budget_enforcer"]
    },
    {
      name: "Synthesis & Report Agent",
      role: "Executive Delivery & Citations",
      status: "waiting",
      currentTask: "Staged draft report; blocked until Human Gate approval",
      toolsUsed: ["typst_markdown_compiler", "citation_linker"]
    }
  ];

  const sampleLogs = [
    { timestamp: "11:42:01.104", worker: "Supervisor", type: "system", text: "Objective validated. Initiating bounded execution DAG for scenario: " + scenario.id },
    { timestamp: "11:42:01.890", worker: "Inspection", type: "tool", text: "[TOOL CALL] parquet_profiler_adapter -> read_metadata('prod_worker_telemetry_2026_q4.parquet')" },
    { timestamp: "11:42:02.410", worker: "Inspection", type: "evidence", text: "[EVIDENCE RECORDED] 28,450 rows ingested. Column types strictly match expected schema." },
    { timestamp: "11:42:03.118", worker: "Statistical", type: "tool", text: "[TOOL CALL] scipy_changepoint_test -> mann_whitney_u(col='pool_wait_ms', window_split='11:42 UTC')" },
    { timestamp: "11:42:04.290", worker: "Statistical", type: "evidence", text: "[EVIDENCE RECORDED] Significant structural break detected (p = 0.00012, Kendall-Tau = 0.84)." },
    { timestamp: "11:42:05.105", worker: "Statistical", type: "tool", text: "[TOOL CALL] shap_tree_explainer -> compute_interactions(features=['payload_mb', 'redis_queue_len'])" },
    { timestamp: "11:42:06.402", worker: "Critique", type: "evidence", text: "[CRITIQUE PASSED] Cross-checked SHAP rankings against database lock activity. No hallucinated causes." },
    { timestamp: "11:42:07.012", worker: "Supervisor", type: "system", text: "Triggering Gate Checkpoint: Sensitive Infrastructure Auto-Scale Recommendation requires human review." },
    { timestamp: "11:42:07.050", worker: "Supervisor", type: "system", text: "Awaiting Human-in-the-Loop review in Decision Drawer..." }
  ];

  const filteredLogs = sampleLogs.filter((log) => {
    if (logFilter === "tools") return log.type === "tool";
    if (logFilter === "evidence") return log.type === "evidence";
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border/70 bg-muted/20">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Bot className="h-4 w-4 text-emerald-500" />
            Multi-Agent Fleet &amp; Runtime Observability
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Autonomous worker fleet with least-privilege sandboxed tool adapters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-background border border-border text-muted-foreground">
            Swarm: 5 Workers
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
            Health: Nominal
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-border/80 bg-background space-y-3 shadow-sm hover:border-foreground/30 transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-xs font-bold text-foreground">{agent.name}</h4>
                <span className="text-[10px] text-muted-foreground font-mono block">
                  {agent.role}
                </span>
              </div>
              <span className={cn(
                "px-2 py-0.5 text-[10px] font-mono font-semibold rounded-full border",
                agent.status === "active" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 animate-pulse",
                agent.status === "waiting" && "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
                agent.status === "idle" && "bg-muted text-muted-foreground border-border"
              )}>
                {agent.status}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-muted/30 border border-border/50 text-[11px] text-foreground leading-relaxed">
              <strong className="text-muted-foreground font-mono text-[10px] block mb-0.5 uppercase">
                Active State
              </strong>
              {agent.currentTask}
            </div>

            <div className="pt-1">
              <span className="text-[10px] font-mono text-muted-foreground block mb-1">
                Sandboxed Tool Adapters
              </span>
              <div className="flex flex-wrap gap-1">
                {agent.toolsUsed.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground border border-border/60"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border/80 bg-zinc-950 text-zinc-100 overflow-hidden shadow-lg font-mono text-xs">
        <div className="px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-emerald-400" />
            <span className="font-semibold text-zinc-200">Autonomous Execution Stream</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
              Live Stream
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setLogFilter("all")}
              className={cn(
                "px-2 py-0.5 text-[10px] rounded cursor-pointer transition-colors",
                logFilter === "all" ? "bg-zinc-700 text-white font-bold" : "text-zinc-400 hover:text-white"
              )}
            >
              All Events
            </button>
            <button
              onClick={() => setLogFilter("tools")}
              className={cn(
                "px-2 py-0.5 text-[10px] rounded cursor-pointer transition-colors",
                logFilter === "tools" ? "bg-zinc-700 text-white font-bold" : "text-zinc-400 hover:text-white"
              )}
            >
              Tool Calls
            </button>
            <button
              onClick={() => setLogFilter("evidence")}
              className={cn(
                "px-2 py-0.5 text-[10px] rounded cursor-pointer transition-colors",
                logFilter === "evidence" ? "bg-zinc-700 text-white font-bold" : "text-zinc-400 hover:text-white"
              )}
            >
              Evidence Only
            </button>
          </div>
        </div>

        <div className="p-4 space-y-2 max-h-72 overflow-y-auto font-mono text-[11px] leading-relaxed">
          {filteredLogs.map((log, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <span className="text-zinc-500 shrink-0 select-none">
                [{log.timestamp}]
              </span>
              <span className={cn(
                "font-semibold shrink-0 w-20 text-right select-none",
                log.worker === "Supervisor" && "text-sky-400",
                log.worker === "Inspection" && "text-purple-400",
                log.worker === "Statistical" && "text-emerald-400",
                log.worker === "Critique" && "text-amber-400"
              )}>
                {log.worker}
              </span>
              <span className={cn(
                "flex-1",
                log.type === "tool" && "text-zinc-300",
                log.type === "evidence" && "text-emerald-300 font-semibold",
                log.type === "system" && "text-zinc-400"
              )}>
                {log.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
