import React, { useState } from "react";
import {
  Database,
  Cloud,
  Upload,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  Server,
  FileCode2,
  Trash2,
  Check
} from "lucide-react";
import { Button } from "@/team/sarukan/components/ui/Button";
import { cn } from "@/team/sarukan/services/utils";

interface ConnectorItem {
  id: string;
  name: string;
  type: "database" | "telemetry" | "cloud_storage" | "api_stream";
  provider: string;
  status: "connected" | "syncing" | "idle" | "error";
  lastSync: string;
  recordsCount: string;
  latencyMs: number;
}

export const DataConnectorsView: React.FC = () => {
  const [connectors, setConnectors] = useState<ConnectorItem[]>([
    {
      id: "conn-pg-01",
      name: "Supabase / PostgreSQL Primary",
      type: "database",
      provider: "AWS eu-central-1",
      status: "connected",
      lastSync: "30s ago",
      recordsCount: "4,280,000",
      latencyMs: 14
    },
    {
      id: "conn-clickhouse",
      name: "ClickHouse Realtime Ingest",
      type: "telemetry",
      provider: "Dedicated Cluster",
      status: "connected",
      lastSync: "Live streaming",
      recordsCount: "128,450,000",
      latencyMs: 8
    },
    {
      id: "conn-gcs-bucket",
      name: "Cloud Storage Telemetry Lake",
      type: "cloud_storage",
      provider: "gs://devconcord-prod-telemetry-eu",
      status: "connected",
      lastSync: "2m ago",
      recordsCount: "24.5 GB",
      latencyMs: 38
    },
    {
      id: "conn-datadog",
      name: "Datadog APM Trace Sync",
      type: "api_stream",
      provider: "Datadog EU API",
      status: "connected",
      lastSync: "15s ago",
      recordsCount: "1.2M spans/hr",
      latencyMs: 45
    }
  ]);

  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ name: string; size: string; status: "indexed" | "analyzing"; rows: string }>
  >([
    { name: "worker_telemetry_stream.parquet", size: "14.2 MB", status: "indexed", rows: "45,000" },
    { name: "customer_telemetry_hubspot.parquet", size: "8.4 MB", status: "indexed", rows: "12,400" }
  ]);

  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [newConnModalOpen, setNewConnModalOpen] = useState<boolean>(false);
  const [connSuccessMessage, setConnSuccessMessage] = useState<string | null>(null);

  const handleTestAllConnections = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setConnectors((prev) =>
        prev.map((c) => ({
          ...c,
          lastSync: "Just now",
          latencyMs: Math.floor(Math.random() * 20) + 8
        }))
      );
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const newEntry = {
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
      status: "indexed" as const,
      rows: "18,200"
    };
    setUploadedFiles((prev) => [newEntry, ...prev]);
  };

  const handleAddConnector = () => {
    setNewConnModalOpen(false);
    setConnSuccessMessage("Connection validated and registered successfully!");
    setTimeout(() => setConnSuccessMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-border/70 bg-muted/20">
        <div>
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Server className="h-4 w-4 text-emerald-500" />
            Telemetry Connectors &amp; Ingestion Hub
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage live read-replicas, stream brokers, and sandboxed datasets for autonomous profiling.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTestAllConnections}
            disabled={isSyncing}
            className="h-8 text-xs gap-1.5"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isSyncing && "animate-spin")} />
            <span>{isSyncing ? "Testing Ping..." : "Health Check All"}</span>
          </Button>

          <Button
            size="sm"
            onClick={() => setNewConnModalOpen(true)}
            className="h-8 text-xs bg-foreground text-background hover:opacity-90 gap-1.5 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Connection</span>
          </Button>
        </div>
      </div>

      {connSuccessMessage && (
        <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
          <Check className="h-4 w-4" />
          <span>{connSuccessMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {connectors.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-2xl border border-border/80 bg-background hover:border-foreground/30 transition-all space-y-3 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-muted/60 border border-border flex items-center justify-center text-foreground">
                  {c.type === "database" && <Database className="h-4 w-4 text-emerald-500" />}
                  {c.type === "telemetry" && <Server className="h-4 w-4 text-purple-500" />}
                  {c.type === "cloud_storage" && <Cloud className="h-4 w-4 text-sky-500" />}
                  {c.type === "api_stream" && <RefreshCw className="h-4 w-4 text-amber-500" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">{c.name}</h4>
                  <span className="text-[11px] font-mono text-muted-foreground block">{c.provider}</span>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/60 text-xs">
              <div>
                <span className="text-[10px] font-mono text-muted-foreground block">Latency</span>
                <span className="font-mono font-semibold text-foreground">{c.latencyMs} ms</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-muted-foreground block">Volume</span>
                <span className="font-mono font-semibold text-foreground">{c.recordsCount}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-muted-foreground block">Last Sync</span>
                <span className="font-mono text-muted-foreground">{c.lastSync}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 rounded-2xl border border-border/80 bg-background space-y-4">
        <div>
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Upload className="h-4 w-4 text-emerald-500" />
            Ad-Hoc Diagnostic Upload Sandbox
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Drop raw Parquet, CSV, or JSON telemetry dumps. Automatically scanned for schema contracts and PII.
          </p>
        </div>

        <label className="border-2 border-dashed border-border/80 hover:border-foreground/50 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-muted/10 hover:bg-muted/20">
          <input
            type="file"
            accept=".parquet,.csv,.json"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mb-3 text-muted-foreground">
            <Upload className="h-5 w-5" />
          </div>
          <span className="text-xs font-semibold text-foreground">
            Click to upload or drag &amp; drop telemetry dumps
          </span>
          <span className="text-[11px] text-muted-foreground mt-1 font-mono">
            Supports .parquet, .csv, and JSON lines (Up to 250 MB per file)
          </span>
        </label>

        <div className="space-y-2 pt-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-bold block">
            Loaded Sandboxed Datasets
          </span>

          <div className="divide-y divide-border/60 border border-border/80 rounded-xl overflow-hidden bg-muted/10">
            {uploadedFiles.map((file, idx) => (
              <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <FileCode2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <div>
                    <span className="font-mono font-semibold text-foreground block">{file.name}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {file.size} · {file.rows} records · AES-256 Encrypted
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Indexed
                  </span>
                  <button
                    onClick={() => setUploadedFiles((prev) => prev.filter((_, i) => i !== idx))}
                    className="text-muted-foreground hover:text-rose-500 transition-colors p-1"
                    title="Remove Dataset"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {newConnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 space-y-4 shadow-2xl">
            <div>
              <h3 className="text-sm font-bold text-foreground">Register New Telemetry Connector</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Connect a read-replica database pool, Kafka cluster, or cloud bucket.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-medium text-foreground block mb-1">Connector Type</label>
                <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground">
                  <option>PostgreSQL / Supabase Read-Replica</option>
                  <option>ClickHouse Real-time Analytics</option>
                  <option>Apache Kafka / Redpanda Stream</option>
                  <option>Amazon S3 / Google Cloud Storage</option>
                  <option>Datadog / OpenTelemetry APM Gateway</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-foreground block mb-1">Connection URI / Host</label>
                <input
                  type="text"
                  placeholder="postgresql://read_only_agent@db.prod.internal:5432/telemetry"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="font-medium text-foreground block mb-1">Access Scope</label>
                <div className="p-3 rounded-lg bg-muted/40 border border-border text-[11px] text-muted-foreground space-y-1">
                  <div>✓ Read-Only Role enforced</div>
                  <div>✓ Query Timeout capped at 15 seconds</div>
                  <div>✓ Max partition window: 30 days</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setNewConnModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleAddConnector}
                className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Save &amp; Verify Connection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
