export interface StartupScenario {
  
  id: string;

  
  title: string;

  
  category: "Incident & Latency" | "SaaS Retention" | "Pipeline Quality" | "Custom Objective";

  
  description: string;

  
  targetMetric: string;

  
  datasetName: string;

  
  rowCount: number;

  
  columnCount: number;

  
  estimatedCost: string;

  
  defaultPlan: Array<{
    
    id: string;

    
    name: string;

    
    worker: string;

    
    type: "inspection" | "statistical" | "ml_optional" | "critique" | "approval_gate" | "synthesis";

    
    status: "completed" | "running" | "pending" | "waiting_approval";

    
    duration: string;

    
    evidenceProduced: string;

    
    toolAdapter: string;

    
    details: string;
  }>;

  
  evidenceItems: Array<{
    
    claimId: string;

    
    claimText: string;

    
    sourceDataset: string;

    
    evidenceType: "Statistical Test" | "Distribution Shift" | "Model SHAP" | "Log Trace";

    
    metricValue: string;

    
    confidence: number;

    
    sampleRows: Record<string, any>[];

    
    verifiedBy: string;

    
    status: "verified" | "flagged" | "caveat";
  }>;

  
  dataPreview: {
    
    columns: Array<{ name: string; type: string; nulls: number; unique: number; sampleValue: string }>;

    
    rows: Record<string, any>[];
  };

  
  executiveSummary: {
    
    title: string;

    
    keyTakeaway: string;

    
    kpis: Array<{ label: string; value: string; change: string; positive: boolean }>;

    
    findings: Array<{
      category: string;
      observation: string;
      interpretation: string;
      confidence: number;
      evidenceRef: string;
      actionableRecommendation: string;
    }>;

    
    modelScorecard?: {
      algorithm: string;
      f1Score: number;
      rocAuc: number;
      latencyMs: number;
      baselineImprovement: string;
      justification: string;
    };

    
    limitations: string[];
  };
}

export const STARTUP_SCENARIOS: StartupScenario[] = [

  {
    id: "incident-latency",
    title: "Automation Pipeline Worker Latency & Timeout RCA",
    category: "Incident & Latency",
    description: "Identify the root cause of intermittent Celery worker timeouts and database pool exhaustions occurring during peak batch ETL ingestion.",
    targetMetric: "p99_job_latency_ms",
    datasetName: "prod_worker_telemetry_2026_q4.parquet",
    rowCount: 28450,
    columnCount: 14,
    estimatedCost: "$0.38 (3.2k tokens + 1.2s sandbox execution)",
    defaultPlan: [
      {
        id: "step-1",
        name: "Schema Contract & Log Normalization",
        worker: "Inspection & Profiling Agent",
        type: "inspection",
        status: "completed",
        duration: "0.8s",
        evidenceProduced: "28,450 log events parsed; 0 schema violations",
        toolAdapter: "parquet_profiler_adapter",
        details: "Validated field datatypes, timestamp synchronization across 8 worker nodes, and standardized error stacktraces."
      },
      {
        id: "step-2",
        name: "Telemetry Outlier & Changepoint Detection",
        worker: "Statistical Analysis Specialist",
        type: "statistical",
        status: "completed",
        duration: "1.4s",
        evidenceProduced: "Structural break detected at 11:42 UTC (p < 0.001)",
        toolAdapter: "scipy_changepoint_test",
        details: "Applied Mann-Whitney U test and CUSUM analysis to detect significant divergence in connection acquire times."
      },
      {
        id: "step-3",
        name: "Worker Failure Correlation & SHAP Attribution",
        worker: "Statistical Analysis Specialist",
        type: "ml_optional",
        status: "completed",
        duration: "2.1s",
        evidenceProduced: "Redis buffer bloat accounts for 68.4% of latency variance",
        toolAdapter: "shap_tree_explainer",
        details: "Evaluated lightweight Random Forest surrogate to measure non-linear interaction between payload size and connection pool queue depth."
      },
      {
        id: "step-4",
        name: "Hallucination & Evidence Critique Loop",
        worker: "Critique & Quality Controller",
        type: "critique",
        status: "completed",
        duration: "0.9s",
        evidenceProduced: "Zero unsupported claims; 4/4 assertions tied to log traces",
        toolAdapter: "evidence_verifier_rule_engine",
        details: "Cross-checked agent hypothesis against raw pgpool metrics to prevent conflating network jitter with database lock contention."
      },
      {
        id: "step-5",
        name: "Approval Gate: Autoscaling & Pool Reconfiguration",
        worker: "Human Oversight Gate (HITL)",
        type: "approval_gate",
        status: "waiting_approval",
        duration: "Awaiting review",
        evidenceProduced: "Actionable patch ready for DevOps sign-off",
        toolAdapter: "policy_gate_evaluator",
        details: "Proposed auto-adjusting DB pool size from 20 to 65 and enabling Redis stream backpressure threshold at 10k messages."
      },
      {
        id: "step-6",
        name: "Executive Incident Post-Mortem & Remediation Report",
        worker: "Synthesis & Report Agent",
        type: "synthesis",
        status: "pending",
        duration: "Estimated 1.2s",
        evidenceProduced: "Audited PDF/MD report with trace citations",
        toolAdapter: "typst_markdown_compiler",
        details: "Compiles executive timeline, root-cause decomposition, evidence links, and infrastructure remediation commands."
      }
    ],
    evidenceItems: [
      {
        claimId: "EVD-01",
        claimText: "Queue connection wait times spiked 410% when batch payload exceeded 4.2 MB",
        sourceDataset: "prod_worker_telemetry_2026_q4.parquet [rows 14,200-18,500]",
        evidenceType: "Distribution Shift",
        metricValue: "410% spike (from 14ms to 71.4ms)",
        confidence: 99.2,
        verifiedBy: "Statistical Analysis Specialist",
        status: "verified",
        sampleRows: [
          { worker_id: "wrk-eu-01", payload_mb: 5.1, pool_wait_ms: 82.4, timeout_event: 1, mem_mb: 1420 },
          { worker_id: "wrk-eu-03", payload_mb: 4.8, pool_wait_ms: 76.1, timeout_event: 1, mem_mb: 1390 },
          { worker_id: "wrk-us-02", payload_mb: 1.2, pool_wait_ms: 12.3, timeout_event: 0, mem_mb: 410 }
        ]
      },
      {
        claimId: "EVD-02",
        claimText: "Database connection pool exhaustion was secondary to Redis buffer starvation, not slow SQL queries",
        sourceDataset: "pg_stat_activity_sampled.csv & redis_latency_stream.json",
        evidenceType: "Statistical Test",
        metricValue: "Kendall-Tau Correlation = 0.84 (p = 0.00012)",
        confidence: 97.5,
        verifiedBy: "Inspection & Profiling Agent",
        status: "verified",
        sampleRows: [
          { timestamp: "11:42:05", redis_queue_len: 12400, db_active_conns: 20, lock_wait_ms: 2.1 },
          { timestamp: "11:42:20", redis_queue_len: 18900, db_active_conns: 20, lock_wait_ms: 3.4 },
          { timestamp: "11:42:45", redis_queue_len: 26300, db_active_conns: 20, lock_wait_ms: 4.0 }
        ]
      },
      {
        claimId: "EVD-03",
        claimText: "Worker nodes 01, 04, and 07 experienced GC pauses over 1,200ms due to uncompressed JSON deserialization",
        sourceDataset: "jvm_node_metrics.json",
        evidenceType: "Log Trace",
        metricValue: "GC pause max = 1,420ms (threshold: 200ms)",
        confidence: 95.8,
        verifiedBy: "Critique & Quality Controller",
        status: "verified",
        sampleRows: [
          { host: "ip-10-0-4-12", gc_type: "Stop-the-world", duration_ms: 1420, unparsed_bytes: 8492040 },
          { host: "ip-10-0-4-88", gc_type: "Stop-the-world", duration_ms: 1190, unparsed_bytes: 7120300 }
        ]
      }
    ],
    dataPreview: {
      columns: [
        { name: "timestamp", type: "datetime", nulls: 0, unique: 28450, sampleValue: "2026-11-02 11:42:15.201" },
        { name: "worker_id", type: "string", nulls: 0, unique: 8, sampleValue: "wrk-eu-01" },
        { name: "payload_mb", type: "float", nulls: 12, unique: 412, sampleValue: "4.82" },
        { name: "pool_wait_ms", type: "float", nulls: 0, unique: 1240, sampleValue: "76.4" },
        { name: "redis_queue_len", type: "integer", nulls: 0, unique: 890, sampleValue: "18400" },
        { name: "db_active_conns", type: "integer", nulls: 0, unique: 21, sampleValue: "20" },
        { name: "timeout_event", type: "boolean", nulls: 0, unique: 2, sampleValue: "1 (True)" }
      ],
      rows: [
        { id: 101, timestamp: "11:42:01", worker_id: "wrk-eu-01", payload_mb: 5.1, pool_wait_ms: 82.4, redis_queue_len: 14200, timeout_event: "Yes" },
        { id: 102, timestamp: "11:42:04", worker_id: "wrk-eu-02", payload_mb: 2.1, pool_wait_ms: 18.2, redis_queue_len: 14500, timeout_event: "No" },
        { id: 103, timestamp: "11:42:09", worker_id: "wrk-eu-03", payload_mb: 4.9, pool_wait_ms: 79.1, redis_queue_len: 16100, timeout_event: "Yes" },
        { id: 104, timestamp: "11:42:15", worker_id: "wrk-us-01", payload_mb: 1.4, pool_wait_ms: 11.0, redis_queue_len: 16800, timeout_event: "No" },
        { id: 105, timestamp: "11:42:22", worker_id: "wrk-eu-04", payload_mb: 6.2, pool_wait_ms: 94.3, redis_queue_len: 18900, timeout_event: "Yes" }
      ]
    },
    executiveSummary: {
      title: "Root Cause Investigation: Peak Batch Worker Timeouts",
      keyTakeaway: "Worker latency spikes are primarily driven by oversized JSON batch payloads (>4.2MB) choking the Redis worker ingest buffer, leading to cascading connection starvation on PostgreSQL pool limits.",
      kpis: [
        { label: "p99 Latency Spike", value: "840 ms", change: "+410%", positive: false },
        { label: "Failed Task Rate", value: "3.2%", change: "+2.8%", positive: false },
        { label: "Evidence Integrity", value: "98.8%", change: "Audited", positive: true },
        { label: "Mitigation Speed", value: "< 2 mins", change: "Ready", positive: true }
      ],
      findings: [
        {
          category: "Infrastructure Driver",
          observation: "PostgreSQL pool capacity was maxed at 20 persistent connections during surges.",
          interpretation: "Workers hung waiting for available database handles, triggering downstream Celery task deadlocks.",
          confidence: 98,
          evidenceRef: "EVD-02",
          actionableRecommendation: "Increase session pooler to 65 connections with 5s query timeouts."
        },
        {
          category: "Payload Hygiene",
          observation: "Batch payloads with raw uncompressed JSON exceed 5MB in 14.2% of ingestion batches.",
          interpretation: "Deserialization on single-threaded event loops spikes CPU GC pauses past 1.2 seconds.",
          confidence: 96,
          evidenceRef: "EVD-01",
          actionableRecommendation: "Enforce Snappy/Gzip stream compression on API client ingestion SDK."
        }
      ],
      limitations: [
        "Network latency metrics from AP-South region were excluded due to 0.4% packet loss on telemetry agent.",
        "Model evaluation used a gradient booster solely for non-linear feature attribution, not predictive deployment."
      ]
    }
  },

  {
    id: "saas-churn",
    title: "SaaS Customer Churn & Account Downgrade Risk Predictor",
    category: "SaaS Retention",
    description: "Identify high-risk B2B subscription accounts based on seat drop-off, API call frequency decline, and overdue payment warnings.",
    targetMetric: "churn_probability_30d",
    datasetName: "saas_usage_billing_mart.csv",
    rowCount: 42100,
    columnCount: 18,
    estimatedCost: "$0.52 (4.1k tokens + 2.4s AutoML evaluation)",
    defaultPlan: [
      {
        id: "step-1",
        name: "Data Hygiene & Contract Profiling",
        worker: "Inspection & Profiling Agent",
        type: "inspection",
        status: "completed",
        duration: "1.1s",
        evidenceProduced: "42,100 accounts mapped; 2.1% missing last_login imputed",
        toolAdapter: "pandas_profiling_adapter",
        details: "Checked billing timestamp continuity, removed test sandbox accounts, and validated categorical tiers."
      },
      {
        id: "step-2",
        name: "Statistical Drift & Velocity Variance",
        worker: "Statistical Analysis Specialist",
        type: "statistical",
        status: "completed",
        duration: "1.8s",
        evidenceProduced: "API volume velocity drops 62% in 21 days before churn",
        toolAdapter: "time_series_decay_test",
        details: "Calculated rolling 7-day vs 30-day usage velocity differential across enterprise vs growth tiers."
      },
      {
        id: "step-3",
        name: "Automated ML Evaluation (Random Forest vs XGBoost)",
        worker: "Statistical Analysis Specialist",
        type: "ml_optional",
        status: "completed",
        duration: "3.2s",
        evidenceProduced: "XGBoost achieves 0.91 ROC-AUC (+14% over baseline rules)",
        toolAdapter: "xgboost_evaluator_adapter",
        details: "Evaluated 5-fold cross-validated classifier with class rebalancing and SHAP tree value extraction."
      },
      {
        id: "step-4",
        name: "Evidence Consistency & False-Positive Guard",
        worker: "Critique & Quality Controller",
        type: "critique",
        status: "completed",
        duration: "1.0s",
        evidenceProduced: "Flagged 12 annual contract false-positives; adjusted rules",
        toolAdapter: "contract_sanity_checker",
        details: "Ensured annual upfront accounts were not categorized as churned due to seasonal summer inactivity."
      },
      {
        id: "step-5",
        name: "Approval Gate: Customer Success Automated Intervention",
        worker: "Human Oversight Gate (HITL)",
        type: "approval_gate",
        status: "waiting_approval",
        duration: "Awaiting review",
        evidenceProduced: "Intervention campaign targeting 38 top-tier accounts",
        toolAdapter: "crm_outreach_dispatcher",
        details: "Requires Customer Success VP confirmation before sending automated executive retention workflows."
      },
      {
        id: "step-6",
        name: "Account Risk Scorecard & Retention Playbook",
        worker: "Synthesis & Report Agent",
        type: "synthesis",
        status: "pending",
        duration: "Estimated 1.5s",
        evidenceProduced: "Executive retention summary with account-level citations",
        toolAdapter: "report_builder_adapter",
        details: "Compiles account tier analysis, revenue at risk ($182,400 ARR), and recommended CS playbooks."
      }
    ],
    evidenceItems: [
      {
        claimId: "EVD-CH-01",
        claimText: "Accounts with active seats drop > 30% have a 78.4% churn rate within 45 days",
        sourceDataset: "saas_usage_billing_mart.csv [columns: seat_count, active_seats_w4]",
        evidenceType: "Distribution Shift",
        metricValue: "Risk Ratio: 4.12x vs baseline",
        confidence: 98.7,
        verifiedBy: "Statistical Analysis Specialist",
        status: "verified",
        sampleRows: [
          { company: "Apex Systems", seats: 120, active_seats_30d: 42, mrr: 4500, risk_score: 0.94 },
          { company: "Kinetix Cloud", seats: 85, active_seats_30d: 31, mrr: 3200, risk_score: 0.88 },
          { company: "Velocty Dev", seats: 50, active_seats_30d: 14, mrr: 1900, risk_score: 0.91 }
        ]
      },
      {
        claimId: "EVD-CH-02",
        claimText: "Unresolved support tickets older than 9 days amplify churn probability by 2.8x",
        sourceDataset: "zendesk_ticket_extract.csv",
        evidenceType: "Model SHAP",
        metricValue: "SHAP importance: +0.28 to log-odds",
        confidence: 96.1,
        verifiedBy: "Critique & Quality Controller",
        status: "verified",
        sampleRows: [
          { ticket_id: "TCK-8812", account: "Apex Systems", days_open: 14, category: "API Webhook failure" },
          { ticket_id: "TCK-9041", account: "CloudForge", days_open: 11, category: "SSO SAML timeout" }
        ]
      }
    ],
    dataPreview: {
      columns: [
        { name: "company_name", type: "string", nulls: 0, unique: 42100, sampleValue: "Apex Systems" },
        { name: "tier", type: "categorical", nulls: 0, unique: 3, sampleValue: "Enterprise" },
        { name: "licensed_seats", type: "integer", nulls: 0, unique: 140, sampleValue: "120" },
        { name: "active_seats_30d", type: "integer", nulls: 0, unique: 130, sampleValue: "42" },
        { name: "monthly_arr_usd", type: "currency", nulls: 0, unique: 1800, sampleValue: "$4,500" },
        { name: "open_critical_tickets", type: "integer", nulls: 0, unique: 8, sampleValue: "2" },
        { name: "churn_risk_flag", type: "boolean", nulls: 0, unique: 2, sampleValue: "High (0.94)" }
      ],
      rows: [
        { id: 1, company_name: "Apex Systems", tier: "Enterprise", licensed_seats: 120, active_seats_30d: 42, monthly_arr_usd: "$4,500", open_critical_tickets: 2, churn_risk_flag: "High" },
        { id: 2, company_name: "Kinetix Cloud", tier: "Enterprise", licensed_seats: 85, active_seats_30d: 31, monthly_arr_usd: "$3,200", open_critical_tickets: 1, churn_risk_flag: "High" },
        { id: 3, company_name: "DataPulse AI", tier: "Growth", licensed_seats: 40, active_seats_30d: 38, monthly_arr_usd: "$1,600", open_critical_tickets: 0, churn_risk_flag: "Low" },
        { id: 4, company_name: "StackFlow IT", tier: "Starter", licensed_seats: 15, active_seats_30d: 14, monthly_arr_usd: "$450", open_critical_tickets: 0, churn_risk_flag: "Low" },
        { id: 5, company_name: "Velocty Dev", tier: "Growth", licensed_seats: 50, active_seats_30d: 14, monthly_arr_usd: "$1,900", open_critical_tickets: 3, churn_risk_flag: "High" }
      ]
    },
    executiveSummary: {
      title: "Predictive Intelligence: Q4 B2B SaaS Churn & Retention Analysis",
      keyTakeaway: "38 high-value Enterprise accounts representing $182,400 ARR show critical early-warning churn signals. The primary driver is a combination of seat utilization falling below 40% and unresolved webhook support tickets.",
      kpis: [
        { label: "ARR at Risk", value: "$182.4k", change: "38 Accounts", positive: false },
        { label: "Model Precision", value: "91.4%", change: "ROC-AUC 0.91", positive: true },
        { label: "Lead Time", value: "32 Days", change: "Action window", positive: true },
        { label: "Evidence Rigor", value: "99.1%", change: "Peer-reviewed", positive: true }
      ],
      findings: [
        {
          category: "Seat Inactivity Threshold",
          observation: "Accounts that drop below 40% active license utilization for 21 consecutive days churn at 78.4% rate.",
          interpretation: "The customer is undergoing internal team reorg or failed onboarding; account champion has likely left.",
          confidence: 97,
          evidenceRef: "EVD-CH-01",
          actionableRecommendation: "Trigger automated executive check-in email and offer complimentary re-onboarding session."
        },
        {
          category: "Technical Blockers",
          observation: "Open webhook failure tickets increase churn likelihood by 2.8x when lingering > 9 days.",
          interpretation: "Product bugs in integration layer directly block core automation value for the startup.",
          confidence: 95,
          evidenceRef: "EVD-CH-02",
          actionableRecommendation: "Escalate webhook integration tickets to tier-3 engineering on priority SLA."
        }
      ],
      modelScorecard: {
        algorithm: "XGBoost Classifier with SHAP Attribution",
        f1Score: 0.89,
        rocAuc: 0.91,
        latencyMs: 14,
        baselineImprovement: "+14.2% over manual rule triggers",
        justification: "Selected because non-linear interaction between seat drop and ticket age could not be captured cleanly by static rules."
      },
      limitations: [
        "Historical data does not include customers who cancelled during trial period.",
        "NPS survey feedback was only available for 64% of cohort accounts."
      ]
    }
  },

  {
    id: "pipeline-quality",
    title: "Data Pipeline Schema Contract & Distribution Drift Sentinel",
    category: "Pipeline Quality",
    description: "Validate incoming external partner webhook payloads against strict data contracts, identify null surges, and prevent corrupted data ingestion.",
    targetMetric: "data_drift_p_value",
    datasetName: "partner_stream_ingest_audit.json",
    rowCount: 54100,
    columnCount: 16,
    estimatedCost: "$0.24 (2.1k tokens + 0.8s validation)",
    defaultPlan: [
      {
        id: "step-1",
        name: "Data Contract & Schema Drift Check",
        worker: "Inspection & Profiling Agent",
        type: "inspection",
        status: "completed",
        duration: "0.7s",
        evidenceProduced: "Detected unexpected schema mutation: 'user_meta' -> string",
        toolAdapter: "json_schema_validator",
        details: "Detected type shift in partner payload where object structure was flattened to string without version bump."
      },
      {
        id: "step-2",
        name: "Null Surge & Distribution Variance",
        worker: "Statistical Analysis Specialist",
        type: "statistical",
        status: "completed",
        duration: "1.1s",
        evidenceProduced: "Null rate in 'billing_zip' surged from 0.1% to 18.4%",
        toolAdapter: "kolmogorov_smirnov_test",
        details: "KS-test confirms significant data drift between October baseline and November incoming batches (p = 0.00002)."
      },
      {
        id: "step-3",
        name: "Quarantine & Safe Transformation Synthesis",
        worker: "Critique & Quality Controller",
        type: "critique",
        status: "completed",
        duration: "0.9s",
        evidenceProduced: "Quarantined 418 malformed rows; preserved clean lineage",
        toolAdapter: "dead_letter_quarantine",
        details: "Safely isolated malformed rows into dead-letter queue without halting production pipeline execution."
      },
      {
        id: "step-4",
        name: "Approval Gate: Apply Schema Mutation Migration",
        worker: "Human Oversight Gate (HITL)",
        type: "approval_gate",
        status: "waiting_approval",
        duration: "Awaiting review",
        evidenceProduced: "Generated migration SQL for data engineering review",
        toolAdapter: "schema_migration_proposer",
        details: "Requires Data Lead sign-off before modifying the production BigQuery / Postgres destination table schema."
      },
      {
        id: "step-5",
        name: "Data Lineage & Quality Audit Report",
        worker: "Synthesis & Report Agent",
        type: "synthesis",
        status: "pending",
        duration: "Estimated 0.9s",
        evidenceProduced: "Contract violation report with sample payload diffs",
        toolAdapter: "audit_report_generator",
        details: "Generates exportable compliance report with JSON schema diffs for external vendor escalation."
      }
    ],
    evidenceItems: [
      {
        claimId: "EVD-DR-01",
        claimText: "Partner payload version v1.4 introduces breaking type shift on 'metadata.geo_point'",
        sourceDataset: "partner_stream_ingest_audit.json",
        evidenceType: "Distribution Shift",
        metricValue: "KS-Test p-value = 0.00002 (Drift detected)",
        confidence: 99.8,
        verifiedBy: "Inspection & Profiling Agent",
        status: "verified",
        sampleRows: [
          { partner_id: "vendor_stripe_sub", event: "charge.success", geo_point_format: "string", expected: "object" }
        ]
      }
    ],
    dataPreview: {
      columns: [
        { name: "event_id", type: "uuid", nulls: 0, unique: 54100, sampleValue: "e34b12-9a01" },
        { name: "partner_source", type: "string", nulls: 0, unique: 4, sampleValue: "vendor_stripe_sub" },
        { name: "payload_bytes", type: "integer", nulls: 0, unique: 280, sampleValue: "1840" },
        { name: "schema_valid", type: "boolean", nulls: 0, unique: 2, sampleValue: "False (Drifted)" },
        { name: "null_fields_count", type: "integer", nulls: 0, unique: 6, sampleValue: "2" }
      ],
      rows: [
        { id: 1, event_id: "e34b12", partner_source: "vendor_stripe_sub", payload_bytes: 1840, schema_valid: "Invalid", null_fields_count: 2 },
        { id: 2, event_id: "e34b13", partner_source: "vendor_hubspot_api", payload_bytes: 920, schema_valid: "Valid", null_fields_count: 0 },
        { id: 3, event_id: "e34b14", partner_source: "vendor_stripe_sub", payload_bytes: 2100, schema_valid: "Invalid", null_fields_count: 3 }
      ]
    },
    executiveSummary: {
      title: "Data Pipeline Integrity: Partner Stream Ingest Audit",
      keyTakeaway: "A partner API deployment without versioning caused breaking schema mutations and a surge in null values in 18.4% of records. All malformed payloads have been safely routed to quarantine without data loss.",
      kpis: [
        { label: "Drift Status", value: "Quarantined", change: "418 Records", positive: false },
        { label: "Pipeline Uptime", value: "100%", change: "Zero downtime", positive: true },
        { label: "Data Quality Score", value: "98.2%", change: "+0.4%", positive: true },
        { label: "Lineage Preservation", value: "Complete", change: "Audited", positive: true }
      ],
      findings: [
        {
          category: "Contract Violation",
          observation: "Partner vendor modified 'geo_point' from {lat, lng} object to a comma-separated string.",
          interpretation: "Incoming payloads fail automated JSON Schema validation, threatening downstream analytics pipelines.",
          confidence: 99,
          evidenceRef: "EVD-DR-01",
          actionableRecommendation: "Deploy automated normalization adapter and notify partner engineering lead."
        }
      ],
      limitations: [
        "Audit covers the last 72 hours of streaming events.",
        "Partner webhook logs do not contain user agent telemetry."
      ]
    }
  }
];
