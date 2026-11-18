import React, { useState } from "react";
import {
  Settings,
  DollarSign,
  ShieldCheck,
  Cpu,
  Lock,
  Database,
  Save,
  Check,
  RotateCcw,
  Bot,
  Bell,
  Users,
  Plus
} from "lucide-react";
import { Button } from "@/team/sarukan/components/ui/Button";
import { Switch } from "@/team/sarukan/components/ui/Switch";
import { cn } from "@/team/sarukan/services/utils";

export interface SystemSettingsState {
  budgetCap: number;
  maxTokens: number;
  hardBudgetStop: boolean;
  maxRetries: number;
  timeoutSeconds: number;
  minEvidenceConfidence: number;
  enforceSchemaContracts: boolean;
  enableDeadLetter: boolean;
  enableOptionalML: boolean;
  allowedAlgorithms: string[];
  requireGateInfra: boolean;
  requireGateOutreach: boolean;
  requireGatePublication: boolean;
  defaultApproverRole: string;
  auditRetentionDays: number;
  dbPoolSize: number;
  storageBucket: string;
  llmProvider: "ollama" | "openai" | "gemini";
  llmModel: string;
  ollamaEndpoint: string;
  openaiApiKey: string;
  geminiApiKey: string;
  slackWebhookUrl: string;
  pagerDutyKey: string;
  notifyOnGate: boolean;
  notifyOnIncident: boolean;
}

export const DEFAULT_SETTINGS: SystemSettingsState = {
  budgetCap: 2.0,
  maxTokens: 25000,
  hardBudgetStop: true,
  maxRetries: 2,
  timeoutSeconds: 60,
  minEvidenceConfidence: 95,
  enforceSchemaContracts: true,
  enableDeadLetter: true,
  enableOptionalML: true,
  allowedAlgorithms: ["random_forest", "xgboost", "logistic_regression"],
  requireGateInfra: true,
  requireGateOutreach: true,
  requireGatePublication: true,
  defaultApproverRole: "Lead DevOps / CTO",
  auditRetentionDays: 90,
  dbPoolSize: 65,
  storageBucket: "gs://devconcord-prod-telemetry-eu",
  llmProvider: "ollama",
  llmModel: "llama3.2:latest",
  ollamaEndpoint: "http://localhost:11434",
  openaiApiKey: "sk-proj-****************",
  geminiApiKey: "AIzaSy****************",
  slackWebhookUrl: "https://hooks.slack.com/services/T00/B00/XXXX",
  pagerDutyKey: "pd-live-key-4912",
  notifyOnGate: true,
  notifyOnIncident: true
};

interface SettingsViewProps {
  settings: SystemSettingsState;
  onSaveSettings: (newSettings: SystemSettingsState) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings: initialSettings,
  onSaveSettings
}) => {
  const [settings, setSettings] = useState<SystemSettingsState>(initialSettings);
  const [activeSection, setActiveSection] = useState<
    "budget" | "governance" | "evidence" | "ml" | "storage" | "providers" | "webhooks" | "team"
  >("budget");
  const [savedToast, setSavedToast] = useState<boolean>(false);
  const [inviteCopied, setInviteCopied] = useState<boolean>(false);

  const teamMembers = [
    { name: "Alex Rivera", email: "alex@acmeautomation.io", role: "Owner / CTO", status: "Active" },
    { name: "Sarah Chen", email: "sarah.c@acmeautomation.io", role: "Lead Data Engineer", status: "Active" },
    { name: "Marcus Vance", email: "m.vance@acmeautomation.io", role: "Product Operations", status: "Active" }
  ];

  const handleSave = () => {
    onSaveSettings(settings);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleResetDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
    onSaveSettings(DEFAULT_SETTINGS);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleInvite = () => {
    setInviteCopied(true);
    setTimeout(() => setInviteCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/80">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Settings className="h-5 w-5 text-emerald-500" />
            Platform &amp; Governance Settings
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure execution guardrails, cost budget caps, LLM providers, alerting webhooks, and team access.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetDefaults}
            className="text-xs h-9 gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
            Reset Defaults
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            className="text-xs font-semibold h-9 px-5 gap-1.5 bg-foreground text-background hover:opacity-90 shadow-sm"
          >
            {savedToast ? <Check className="h-4 w-4 text-emerald-400" /> : <Save className="h-4 w-4" />}
            {savedToast ? "Saved Changes" : "Save Settings"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-3 space-y-1">
          <button
            onClick={() => setActiveSection("budget")}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer",
              activeSection === "budget"
                ? "bg-muted text-foreground font-semibold shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <DollarSign className="h-4 w-4 shrink-0 text-emerald-500" />
            <span>Budget &amp; Cost Caps</span>
          </button>

          <button
            onClick={() => setActiveSection("governance")}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer",
              activeSection === "governance"
                ? "bg-muted text-foreground font-semibold shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <Lock className="h-4 w-4 shrink-0 text-amber-500" />
            <span>Human Oversight Gates</span>
          </button>

          <button
            onClick={() => setActiveSection("providers")}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer",
              activeSection === "providers"
                ? "bg-muted text-foreground font-semibold shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <Bot className="h-4 w-4 shrink-0 text-indigo-500" />
            <span>AI Model &amp; Providers</span>
          </button>

          <button
            onClick={() => setActiveSection("webhooks")}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer",
              activeSection === "webhooks"
                ? "bg-muted text-foreground font-semibold shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <Bell className="h-4 w-4 shrink-0 text-rose-500" />
            <span>Alerts &amp; Webhooks</span>
          </button>

          <button
            onClick={() => setActiveSection("evidence")}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer",
              activeSection === "evidence"
                ? "bg-muted text-foreground font-semibold shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <ShieldCheck className="h-4 w-4 shrink-0 text-sky-500" />
            <span>Evidence &amp; Quality</span>
          </button>

          <button
            onClick={() => setActiveSection("ml")}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer",
              activeSection === "ml"
                ? "bg-muted text-foreground font-semibold shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <Cpu className="h-4 w-4 shrink-0 text-purple-500" />
            <span>Machine Learning &amp; Tools</span>
          </button>

          <button
            onClick={() => setActiveSection("storage")}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer",
              activeSection === "storage"
                ? "bg-muted text-foreground font-semibold shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <Database className="h-4 w-4 shrink-0 text-zinc-500" />
            <span>Storage &amp; Pools</span>
          </button>

          <button
            onClick={() => setActiveSection("team")}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer",
              activeSection === "team"
                ? "bg-muted text-foreground font-semibold shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <Users className="h-4 w-4 shrink-0 text-emerald-500" />
            <span>Team &amp; RBAC Roles</span>
          </button>
        </div>

        <div className="md:col-span-9 rounded-2xl border border-border/80 bg-background p-6 space-y-6">
          {activeSection === "budget" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Execution Budget &amp; Cost Controls
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Prevent runaway agent loops and set hard budget stops for sandbox execution and token consumption.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-foreground">
                        Max Spend Cap Per Diagnostic Run
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Agents will gracefully pause if cumulative spend reaches this threshold.
                      </div>
                    </div>
                    <span className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ${settings.budgetCap.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="10.0"
                    step="0.25"
                    value={settings.budgetCap}
                    onChange={(e) => setSettings({ ...settings, budgetCap: parseFloat(e.target.value) })}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                    <span>$0.50 (Lean)</span>
                    <span>$5.00 (Standard)</span>
                    <span>$10.00 (Deep Batch)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                  <div>
                    <div className="text-xs font-semibold text-foreground">
                      Hard Budget Enforcer
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Instantly abort tool execution if LLM provider token costs exceed cap.
                    </div>
                  </div>
                  <Switch
                    checked={settings.hardBudgetStop}
                    onCheckedChange={(c) => setSettings({ ...settings, hardBudgetStop: c })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                    <label className="text-xs font-semibold text-foreground block">
                      Max Autonomous Retry Budget
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={settings.maxRetries}
                      onChange={(e) => setSettings({ ...settings, maxRetries: parseInt(e.target.value) || 1 })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono text-foreground"
                    />
                    <span className="text-[10px] text-muted-foreground block">
                      Limits repeated worker attempts to prevent runaway retries.
                    </span>
                  </div>

                  <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                    <label className="text-xs font-semibold text-foreground block">
                      Sandbox Execution Timeout
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="10"
                        max="300"
                        value={settings.timeoutSeconds}
                        onChange={(e) => setSettings({ ...settings, timeoutSeconds: parseInt(e.target.value) || 60 })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono text-foreground"
                      />
                      <span className="text-xs font-mono text-muted-foreground">seconds</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground block">
                      Max duration per Python/SQL tool execution.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "providers" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  AI Provider &amp; Model Routing
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Route agent planning, profiling, and synthesis across local Ollama clusters or cloud providers.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                  <label className="text-xs font-semibold text-foreground block">Primary AI Provider</label>
                  <select
                    value={settings.llmProvider}
                    onChange={(e) => setSettings({ ...settings, llmProvider: e.target.value as any })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground"
                  >
                    <option value="ollama">Ollama (Local Private GPU / Air-Gapped)</option>
                    <option value="openai">OpenAI (GPT-4o / GPT-4o-mini)</option>
                    <option value="gemini">Google Gemini (Gemini 1.5 Pro / Flash)</option>
                  </select>
                </div>

                {settings.llmProvider === "ollama" && (
                  <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                    <label className="text-xs font-semibold text-foreground block">Ollama Base URL</label>
                    <input
                      type="text"
                      value={settings.ollamaEndpoint}
                      onChange={(e) => setSettings({ ...settings, ollamaEndpoint: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono text-foreground"
                    />
                    <span className="text-[10px] text-muted-foreground block">
                      Local host endpoint with Llama 3.2 or Mistral weights.
                    </span>
                  </div>
                )}

                {settings.llmProvider === "openai" && (
                  <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                    <label className="text-xs font-semibold text-foreground block">OpenAI API Key</label>
                    <input
                      type="password"
                      value={settings.openaiApiKey}
                      onChange={(e) => setSettings({ ...settings, openaiApiKey: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono text-foreground"
                    />
                  </div>
                )}

                {settings.llmProvider === "gemini" && (
                  <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                    <label className="text-xs font-semibold text-foreground block">Gemini API Key</label>
                    <input
                      type="password"
                      value={settings.geminiApiKey}
                      onChange={(e) => setSettings({ ...settings, geminiApiKey: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono text-foreground"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === "webhooks" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Alerts, Webhooks &amp; ChatOps
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Stream diagnostic alerts, gate review notifications, and incident summaries into Slack and PagerDuty.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                  <label className="text-xs font-semibold text-foreground block">Slack Incoming Webhook URL</label>
                  <input
                    type="text"
                    value={settings.slackWebhookUrl}
                    onChange={(e) => setSettings({ ...settings, slackWebhookUrl: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono text-foreground"
                  />
                  <span className="text-[10px] text-muted-foreground block">
                    Post notifications to channels like #engineering-ops or #incident-response.
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                  <label className="text-xs font-semibold text-foreground block">PagerDuty Integration Key</label>
                  <input
                    type="text"
                    value={settings.pagerDutyKey}
                    onChange={(e) => setSettings({ ...settings, pagerDutyKey: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono text-foreground"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                  <div>
                    <div className="text-xs font-semibold text-foreground">Notify on Human Gate Awaiting</div>
                    <div className="text-[11px] text-muted-foreground">Alert reviewers instantly when high-impact decisions pause.</div>
                  </div>
                  <Switch
                    checked={settings.notifyOnGate}
                    onCheckedChange={(c) => setSettings({ ...settings, notifyOnGate: c })}
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === "governance" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Human Oversight &amp; Approval Gates (HITL)
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Configure checkpoints where autonomous agents must halt and require explicit operator sign-off.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                  <div>
                    <div className="text-xs font-semibold text-foreground">
                      Infrastructure &amp; DevOps Changes Gate
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Require sign-off before auto-scaling database pools or altering Redis buffers.
                    </div>
                  </div>
                  <Switch
                    checked={settings.requireGateInfra}
                    onCheckedChange={(c) => setSettings({ ...settings, requireGateInfra: c })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                  <div>
                    <div className="text-xs font-semibold text-foreground">
                      External Customer Outreach Gate
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Require sign-off before dispatching automated retention emails or webhooks.
                    </div>
                  </div>
                  <Switch
                    checked={settings.requireGateOutreach}
                    onCheckedChange={(c) => setSettings({ ...settings, requireGateOutreach: c })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                  <div>
                    <div className="text-xs font-semibold text-foreground">
                      Executive Report Publication Gate
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Require operator confirmation before publishing findings or distributing PDF reports.
                    </div>
                  </div>
                  <Switch
                    checked={settings.requireGatePublication}
                    onCheckedChange={(c) => setSettings({ ...settings, requireGatePublication: c })}
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === "evidence" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Evidence Standards &amp; Data Hygiene
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Set thresholds for verifiable evidence. Unsupported or low-confidence claims are surfaced as caveats.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-foreground">
                        Minimum Evidence Confidence Threshold
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Findings with statistical p-value or model confidence below this are tagged with warnings.
                      </div>
                    </div>
                    <span className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {settings.minEvidenceConfidence}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="99"
                    step="1"
                    value={settings.minEvidenceConfidence}
                    onChange={(e) => setSettings({ ...settings, minEvidenceConfidence: parseInt(e.target.value) })}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                  <div>
                    <div className="text-xs font-semibold text-foreground">
                      Strict Schema Contract Validation
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Quarantine partner streaming payloads that diverge from registered JSON/Parquet schemas.
                    </div>
                  </div>
                  <Switch
                    checked={settings.enforceSchemaContracts}
                    onCheckedChange={(c) => setSettings({ ...settings, enforceSchemaContracts: c })}
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === "ml" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Machine Learning &amp; Analytical Methods
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  ML is optional and evaluated only when deterministic or statistical methods are insufficient.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                  <div>
                    <div className="text-xs font-semibold text-foreground">
                      Enable Optional ML Evaluator
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Allow agents to train lightweight surrogate models for non-linear SHAP attribution.
                    </div>
                  </div>
                  <Switch
                    checked={settings.enableOptionalML}
                    onCheckedChange={(c) => setSettings({ ...settings, enableOptionalML: c })}
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === "storage" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Storage, Pools &amp; Retention
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Configure durable metadata repositories, object storage buckets, and pool capacities.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                  <label className="text-xs font-semibold text-foreground block">
                    Target Cloud Object Storage Bucket
                  </label>
                  <input
                    type="text"
                    value={settings.storageBucket}
                    onChange={(e) => setSettings({ ...settings, storageBucket: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs font-mono text-foreground"
                  />
                  <span className="text-[10px] text-muted-foreground block">
                    Cloud Storage URI where evidence packages and telemetry traces are stored.
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeSection === "team" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground">
                    Team Members &amp; RBAC Access
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Manage team permissions for approving gates, creating objectives, and exporting reports.
                  </p>
                </div>
                <Button size="sm" onClick={handleInvite} className="text-xs h-8 gap-1">
                  {inviteCopied ? <Check className="h-3 w-3 text-emerald-400" /> : <Plus className="h-3 w-3" />}
                  {inviteCopied ? "Invite Link Copied" : "Invite Colleague"}
                </Button>
              </div>

              <div className="divide-y divide-border/60 border border-border/80 rounded-xl overflow-hidden bg-background">
                {teamMembers.map((m, i) => (
                  <div key={i} className="p-3.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-foreground block">{m.name}</span>
                      <span className="text-[11px] text-muted-foreground font-mono">{m.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-muted text-foreground border border-border">
                        {m.role}
                      </span>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        {m.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
