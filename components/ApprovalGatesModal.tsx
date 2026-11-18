import React, { useState } from "react";
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  X
} from "lucide-react";
import { Button } from "@/team/sarukan/components/ui/Button";
import { StartupScenario } from "@/team/sarukan/services/StartupTelemetrySample";

interface ApprovalGatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: StartupScenario;
  onApprove: (notes: string) => void;
  onReject: (reason: string) => void;
}

export const ApprovalGatesModal: React.FC<ApprovalGatesModalProps> = ({
  isOpen,
  onClose,
  onApprove,
  onReject
}) => {
  const [reviewerNotes, setReviewerNotes] = useState<string>("");
  const [reviewerName, setReviewerName] = useState<string>("Alex Rivera (Lead DevOps / CTO)");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-start justify-between pb-4 border-b border-border/80">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">
                  Human Oversight Gate (HITL Control)
                </h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-semibold">
                  Required Sign-Off
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Required for configured high-impact actions and final publication.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-border/80 bg-muted/30 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-foreground">
              <span>Proposed High-Impact Operational Action:</span>
              <span className="text-[11px] font-mono text-muted-foreground">Gate ID: GATE-AUTO-409</span>
            </div>
            <p className="text-xs text-foreground font-mono bg-background/80 p-3 rounded-lg border border-border/60 leading-relaxed">
              Auto-reconfigure PostgreSQL connection pool from 20 to 65 handles and deploy Redis ingestion backpressure threshold at 10,000 pending stream records.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-border/60 bg-muted/20 space-y-1">
              <span className="text-[10px] uppercase font-mono text-muted-foreground block">
                Evidence Foundation
              </span>
              <p className="text-xs text-foreground font-medium">
                Backed by <strong>EVD-01 &amp; EVD-02</strong>: 410% latency surge tied to connection exhaustion (p = 0.00012).
              </p>
            </div>

            <div className="p-3 rounded-xl border border-border/60 bg-muted/20 space-y-1">
              <span className="text-[10px] uppercase font-mono text-muted-foreground block">
                Rollback &amp; Recovery Policy
              </span>
              <p className="text-xs text-foreground font-medium">
                Autonomous canary rollback enabled if error rate &gt; 0.5% over 5-minute sampling window.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Reviewer Identity</label>
              <input
                type="text"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Audit Notes / Approval Conditions (Optional)</label>
              <textarea
                rows={2}
                value={reviewerNotes}
                onChange={(e) => setReviewerNotes(e.target.value)}
                placeholder="e.g. Approved for EU staging cluster. Monitor worker memory consumption during next 12:00 batch run."
                className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground leading-relaxed"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border/80">
          <Button
            variant="outline"
            onClick={() => onReject(reviewerNotes || "Rejected by human reviewer")}
            className="w-full sm:w-auto text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 border-rose-500/30 gap-1.5"
          >
            <XCircle className="h-4 w-4" />
            Reject &amp; Require Re-Planning
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              onClick={() => onApprove(reviewerNotes)}
              className="text-xs font-semibold px-5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              Approve &amp; Resume Loop
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
