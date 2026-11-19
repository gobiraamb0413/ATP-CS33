import React, { useState } from "react";
import {
  ShieldCheck,
  FileSearch,
  CheckCircle2,
  AlertTriangle,
  Database,
  ExternalLink,
  Table,
  Filter,
  BarChart,
  Eye
} from "lucide-react";
import { StartupScenario } from "@/team/sarukan/services/StartupTelemetrySample";
import { cn } from "@/team/sarukan/services/utils";


interface EvidenceLedgerProps {
  
  scenario: StartupScenario;
}


export const EvidenceLedger: React.FC<EvidenceLedgerProps> = ({ scenario }) => {

  const [selectedClaimId, setSelectedClaimId] = useState<string>(scenario.evidenceItems[0]?.claimId || "");


  const [activeTab, setActiveTab] = useState<"claims" | "preview">("claims");


  const selectedClaim = scenario.evidenceItems.find((c) => c.claimId === selectedClaimId) || scenario.evidenceItems[0];

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border/70 bg-muted/20">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Evidence Ledger &amp; Verifiable Lineage
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Claims backed by immutable sample rows, test distributions, and p-values.
          </p>
        </div>

        
        <div className="inline-flex rounded-lg border border-border bg-muted/50 p-1 text-xs">
          <button
            onClick={() => setActiveTab("claims")}
            className={cn(
              "px-3 py-1 rounded-md transition-colors font-medium cursor-pointer",
              activeTab === "claims"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Claim-to-Evidence Matrix
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={cn(
              "px-3 py-1 rounded-md transition-colors font-medium cursor-pointer",
              activeTab === "preview"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Data Profile Preview ({scenario.rowCount.toLocaleString()} rows)
          </button>
        </div>
      </div>

      {activeTab === "claims" ? (
        /* TAB 1: CLAIM-TO-EVIDENCE MATRIX */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-7 space-y-3">
            <span className="text-xs font-semibold text-muted-foreground block font-mono uppercase tracking-wider">
              Material Findings Tied to Inspectable Artifacts:
            </span>

            {scenario.evidenceItems.map((item) => {
              const isSelected = item.claimId === selectedClaimId;
              return (
                <div
                  key={item.claimId}
                  onClick={() => setSelectedClaimId(item.claimId)}
                  className={cn(
                    "p-4 rounded-xl border transition-all cursor-pointer relative space-y-2",
                    isSelected
                      ? "bg-muted/40 border-foreground/30 shadow-md ring-1 ring-foreground/20"
                      : "bg-background/80 hover:bg-muted/30 border-border/70 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        {item.claimId}
                      </span>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                        {item.evidenceType}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{item.confidence}% Confidence</span>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-foreground leading-relaxed">
                    "{item.claimText}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/50">
                    <span className="truncate max-w-[260px] font-mono">
                      Source: {item.sourceDataset}
                    </span>
                    <span className="font-medium text-foreground">
                      Verified by {item.verifiedBy}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          
          <div className="lg:col-span-5 rounded-xl border border-border/80 bg-muted/20 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5 font-mono">
                <FileSearch className="h-3.5 w-3.5 text-emerald-500" />
                Raw Evidence Deep-Dive
              </h4>
              <span className="text-xs font-mono font-bold text-foreground">
                {selectedClaim.claimId}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-[11px] text-muted-foreground block">Measured Signal / Statistical Metric</span>
                <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-background/80 p-2 rounded-lg border border-border/60 mt-1">
                  {selectedClaim.metricValue}
                </div>
              </div>

              <div>
                <span className="text-[11px] text-muted-foreground block">Source Row Span &amp; Lineage</span>
                <div className="text-xs font-mono text-foreground mt-0.5 break-all">
                  {selectedClaim.sourceDataset}
                </div>
              </div>

              
              <div>
                <span className="text-[11px] text-muted-foreground block mb-1.5">
                  Extracted Supporting Rows (Immutable Snapshot):
                </span>
                <div className="rounded-lg border border-border/80 bg-background overflow-x-auto text-[11px] font-mono">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border/60 bg-muted/40 text-[10px] text-muted-foreground">
                        {selectedClaim.sampleRows[0] &&
                          Object.keys(selectedClaim.sampleRows[0]).map((key) => (
                            <th key={key} className="p-2 font-semibold">
                              {key}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {selectedClaim.sampleRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-muted/20">
                          {Object.values(row).map((val: any, vIdx) => (
                            <td key={vIdx} className="p-2 whitespace-nowrap text-foreground">
                              {String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* TAB 2: DATA PROFILE & SCHEMA PREVIEW */
        <div className="space-y-4">
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl border border-border/70 bg-background/60">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block">Total Records</span>
              <span className="text-sm font-bold text-foreground font-mono">{scenario.rowCount.toLocaleString()}</span>
            </div>
            <div className="p-3 rounded-xl border border-border/70 bg-background/60">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block">Feature Columns</span>
              <span className="text-sm font-bold text-foreground font-mono">{scenario.columnCount} fields</span>
            </div>
            <div className="p-3 rounded-xl border border-border/70 bg-background/60">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block">Missing Values</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">0.04% (Clean)</span>
            </div>
            <div className="p-3 rounded-xl border border-border/70 bg-background/60">
              <span className="text-[10px] font-mono uppercase text-muted-foreground block">Schema Contract</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">Enforced &amp; Signed</span>
            </div>
          </div>

          
          <div className="rounded-xl border border-border/80 bg-background overflow-x-auto text-xs font-mono shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/60 bg-muted/40 text-[11px] text-muted-foreground">
                  {scenario.dataPreview.columns.map((col) => (
                    <th key={col.name} className="p-3 font-semibold">
                      <div>{col.name}</div>
                      <div className="text-[9px] font-normal text-muted-foreground">{col.type}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {scenario.dataPreview.rows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-muted/30 transition-colors">
                    {scenario.dataPreview.columns.map((col) => (
                      <td key={col.name} className="p-3 whitespace-nowrap text-foreground">
                        {String(row[col.name] ?? "-")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
