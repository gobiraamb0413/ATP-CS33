import React, { useState } from "react";
import {
  Bot,
  X,
  Send,
  Copy,
  Check
} from "lucide-react";
import { Button } from "@/team/sarukan/components/ui/Button";
import { StartupScenario } from "@/team/sarukan/services/StartupTelemetrySample";
import { cn } from "@/team/sarukan/services/utils";

interface AgentCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: StartupScenario;
}

interface Message {
  id: string;
  sender: "user" | "copilot";
  timestamp: string;
  text: string;
  codeSnippet?: {
    lang: string;
    code: string;
  };
}

export const AgentCopilotDrawer: React.FC<AgentCopilotDrawerProps> = ({
  isOpen,
  onClose,
  scenario
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      sender: "copilot",
      timestamp: "11:42",
      text: `Hello! I am your DevConcord Data Science Copilot. I have inspected ${scenario.datasetName} (${scenario.rowCount.toLocaleString()} rows). What diagnostic questions or remediation scripts do you need?`
    }
  ]);

  const [inputText, setInputText] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const q = textToSend || inputText;
    if (!q.trim()) return;

    const userMsg: Message = {
      id: "u-" + Date.now(),
      sender: "user",
      timestamp: "Just now",
      text: q
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");

    setTimeout(() => {
      let replyText = "";
      let code: { lang: string; code: string } | undefined;

      if (q.toLowerCase().includes("sql") || q.toLowerCase().includes("reproduce")) {
        replyText = "Here is the exact SQL query to reproduce the database pool wait contention by filtering on batches where payload exceeds 4.2 MB:";
        code = {
          lang: "sql",
          code: `-- Reproduce pool wait time surge during peak ingestion
SELECT
  worker_id,
  AVG(pool_wait_ms) AS avg_wait_ms,
  MAX(pool_wait_ms) AS max_wait_ms,
  COUNT(*) FILTER (WHERE timeout_event = 1) AS timeout_count
FROM worker_telemetry_events
WHERE timestamp >= '2026-11-02 11:30:00'
  AND payload_mb > 4.2
GROUP BY worker_id
ORDER BY max_wait_ms DESC;`
        };
      } else if (q.toLowerCase().includes("terraform") || q.toLowerCase().includes("pool")) {
        replyText = "Here is the recommended Terraform HCL patch for AWS/Supabase to adjust the session connection pooler to 65 handles with a 5s idle timeout:";
        code = {
          lang: "hcl",
          code: `# Supabase / PostgreSQL Session Pooler Adjustment
resource "supabase_db_settings" "prod_pooler" {
  pool_size             = 65
  max_client_conn       = 250
  default_pool_size     = 65
  reserve_pool_size     = 10
  server_idle_timeout   = 5 # seconds
}`
        };
      } else if (q.toLowerCase().includes("founder") || q.toLowerCase().includes("executive")) {
        replyText = "Executive Summary for Non-Technical Stakeholders:\n\nOur system slowed down during the 11:42 batch run because several data files arrived at 3x their normal size without compression. This caused our server workers to wait for database handles like cars stuck at a 1-lane tollbooth. We have verified the cause and staged an automated fix to expand capacity from 20 to 65 lanes.";
      } else {
        replyText = `Based on the audited evidence in ${scenario.datasetName}, the primary bottleneck accounts for 68.4% of total variance. All claims have been verified against raw row traces with a 98.8% confidence score.`;
      }

      const copilotMsg: Message = {
        id: "c-" + Date.now(),
        sender: "copilot",
        timestamp: "Just now",
        text: replyText,
        codeSnippet: code
      };

      setMessages((prev) => [...prev, copilotMsg]);
    }, 600);
  };

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-background border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-foreground">
              DevConcord Data Science Copilot
            </h3>
            <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Connected to active sandbox
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="p-3 border-b border-border/60 bg-muted/15 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
        <button
          onClick={() => handleSend("Generate SQL Reproducer Query")}
          className="px-2.5 py-1 rounded-full bg-background border border-border hover:border-foreground/30 text-[11px] whitespace-nowrap text-muted-foreground hover:text-foreground transition-all cursor-pointer"
        >
          Generate SQL Reproducer
        </button>
        <button
          onClick={() => handleSend("Draft Terraform Pool Expansion Config")}
          className="px-2.5 py-1 rounded-full bg-background border border-border hover:border-foreground/30 text-[11px] whitespace-nowrap text-muted-foreground hover:text-foreground transition-all cursor-pointer"
        >
          Terraform Fix
        </button>
        <button
          onClick={() => handleSend("Explain to Non-Technical Founders")}
          className="px-2.5 py-1 rounded-full bg-background border border-border hover:border-foreground/30 text-[11px] whitespace-nowrap text-muted-foreground hover:text-foreground transition-all cursor-pointer"
        >
          Founder Summary
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "flex flex-col space-y-1.5 max-w-[90%]",
              m.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
            )}
          >
            <div className="text-[10px] text-muted-foreground font-mono">
              {m.sender === "user" ? "You" : "DevConcord Copilot"} · {m.timestamp}
            </div>

            <div
              className={cn(
                "p-3 rounded-2xl leading-relaxed",
                m.sender === "user"
                  ? "bg-foreground text-background font-medium rounded-tr-none"
                  : "bg-muted/50 border border-border text-foreground rounded-tl-none whitespace-pre-wrap"
              )}
            >
              {m.text}

              {m.codeSnippet && (
                <div className="mt-2.5 rounded-lg border border-border bg-zinc-950 text-zinc-100 overflow-hidden font-mono text-[11px]">
                  <div className="px-3 py-1 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between text-[10px] text-zinc-400">
                    <span>{m.codeSnippet.lang.toUpperCase()}</span>
                    <button
                      onClick={() => handleCopy(m.id, m.codeSnippet!.code)}
                      className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedId === m.id ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" /> Copy
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-3 overflow-x-auto text-[11px] leading-relaxed">
                    <code>{m.codeSnippet.code}</code>
                  </pre>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-border bg-background">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask about data drift, SQL queries, or fixes..."
            className="flex-1 rounded-xl border border-border bg-muted/30 px-3.5 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-foreground"
          />
          <Button
            type="submit"
            size="sm"
            className="h-8 w-8 p-0 rounded-xl bg-foreground text-background shrink-0"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </form>
      </div>
    </div>
  );
};
