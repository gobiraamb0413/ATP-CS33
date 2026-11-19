import React from "react";
import {
  History,
  Download,
  ArrowRight
} from "lucide-react";
import { Button } from "@/team/sarukan/components/ui/Button";
import { cn } from "@/team/sarukan/services/utils";

interface RunHistoryViewProps {
  onLoadRun: (runId: string) => void;
}

export const RunHistoryView: React.FC<RunHistoryViewProps> = ({ onLoadRun }) => {
  const pastRuns = [
    {
      id: "run-2026-11-02-0941",
      objective: "Batch Worker Latency & PostgreSQL Pool Starvation RCA",
      category: "Incident & Latency",
      dataset: "prod_worker_telemetry_2026_q4.parquet",
      status: "waiting_approval",
      duration: "4.3s",
      cost: "$0.38",
      evidenceCoverage: "98.8%",
      humanGate: "Awaiting DevOps Sign-Off",
      createdAt: "Today at 11:42 UTC"
    },
    {
      id: "run-2026-10-31-1620",
      objective: "Q4 Enterprise B2B SaaS Churn & Seat Drop Risk",
      category: "SaaS Retention",
      dataset: "saas_usage_billing_mart.csv",
      status: "completed",
      duration: "6.8s",
      cost: "$0.52",
      evidenceCoverage: "99.1%",
      humanGate: "Approved by VP CS",
      createdAt: "Oct 31, 2026"
    },
    {
      id: "run-2026-10-28-1412",
      objective: "Partner Webhook Ingestion Schema Drift & Null Surge Audit",
      category: "Pipeline Quality",
      dataset: "partner_stream_ingest_audit.json",
      status: "completed",
      duration: "3.2s",
      cost: "$0.24",
      evidenceCoverage: "99.8%",
      humanGate: "Approved by Data Lead",
      createdAt: "Oct 28, 2026"
    },
    {
      id: "run-2026-10-25-0810",
      objective: "Redis Cluster Connection Saturation Canary Test",
      category: "Incident & Latency",
      dataset: "redis_latency_stream.json",
      status: "completed",
      duration: "2.9s",
      cost: "$0.19",
      evidenceCoverage: "97.4%",
      humanGate: "Auto-approved (Non-sensitive)",
      createdAt: "Oct 25, 2026"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border/70 bg-muted/20">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <History className="h-4 w-4 text-emerald-500" />
            Run History &amp; Audit Trail
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Prior executions, checkpoint states, and cryptographic verification logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
            <Download className="h-3.5 w-3.5" />
            Export Audit Compliance Bundle
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border/80 bg-background overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border/60 bg-muted/40 text-[11px] font-mono text-muted-foreground uppercase">
              <th className="p-3.5 font-semibold">Run ID / Created</th>
              <th className="p-3.5 font-semibold">Diagnostic Objective</th>
              <th className="p-3.5 font-semibold">Telemetry Asset</th>
              <th className="p-3.5 font-semibold">Status / Gate</th>
              <th className="p-3.5 font-semibold">Metrics (Cost &amp; Evidence)</th>
              <th className="p-3.5 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 font-mono">
            {pastRuns.map((run) => (
              <tr key={run.id} className="hover:bg-muted/20 transition-colors">
                <td className="p-3.5">
                  <div className="font-bold text-foreground">{run.id}</div>
                  <div className="text-[10px] text-muted-foreground font-sans mt-0.5">{run.createdAt}</div>
                </td>

                <td className="p-3.5 font-sans max-w-xs">
                  <div className="text-xs font-semibold text-foreground truncate">{run.objective}</div>
                  <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{run.category}</div>
                </td>

                <td className="p-3.5">
                  <span className="text-xs text-muted-foreground truncate block max-w-[180px]">{run.dataset}</span>
                  <span className="text-[10px] text-muted-foreground">{run.duration}</span>
                </td>

                <td className="p-3.5 font-sans">
                  <div className="flex items-center gap-1.5">
                    <span className={cn(
                      "h-2 w-2 rounded-full shrink-0",
                      run.status === "completed" && "bg-emerald-500",
                      run.status === "waiting_approval" && "bg-amber-500 animate-pulse"
                    )} />
                    <span className={cn(
                      "text-xs font-semibold",
                      run.status === "completed" && "text-emerald-600 dark:text-emerald-400",
                      run.status === "waiting_approval" && "text-amber-600 dark:text-amber-400"
                    )}>
                      {run.humanGate}
                    </span>
                  </div>
                </td>

                <td className="p-3.5">
                  <div className="text-xs text-foreground font-semibold flex items-center gap-1">
                    <span>{run.cost}</span>
                    <span className="text-muted-foreground font-normal">spend</span>
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                    {run.evidenceCoverage} evidence
                  </div>
                </td>

                <td className="p-3.5 text-right font-sans">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onLoadRun(run.id)}
                    className="h-8 text-xs gap-1"
                  >
                    Load Run
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
