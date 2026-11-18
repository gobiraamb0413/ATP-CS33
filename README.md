# DevConcord — Multi-Agent Data Intelligence Platform

DevConcord is an autonomous AI data intelligence platform engineered for modern IT & automation startups. It orchestrates a specialized fleet of autonomous agents across data inspection, machine learning, validation, human approval gates, and executive reporting.

---

## Team Repository Architecture & File Division

All website source files are divided into dedicated workspaces for each team member under `src/team/`:

```text
src/
├── App.tsx                       # Master application router (imports from team workspaces)
├── main.tsx                      # Vite React entry point
├── index.css                     # Global Tailwind design tokens
├── vite-env.d.ts                 # TypeScript declarations
└── team/
    ├── nivethith/                # Nivethith Arasakumar (Project Lead)
    │   ├── pages/Home.tsx        # Public landing page
    │   ├── components/           # Navbar, Hero, Features, HowItWorks, Integrations, Pricing, FAQ, Blog, Footer
    │   └── README.md
    ├── saeyon/                   # Raveeswaran Saeyon (Member 01)
    │   ├── pages/Auth.tsx        # Operator authentication & OAuth session
    │   └── README.md
    ├── gobiraam/                 # Baraneetharan Gobiraam (Member 02)
    │   ├── pages/Dashboard.tsx   # Autonomous diagnostic dashboard
    │   ├── components/           # DashboardHeader, ObjectiveIntake, TaskGraphView, AgentFleetConsole, ApprovalGatesModal
    │   └── README.md
    ├── ashmiga/                  # Ashmiga Sathees (Member 03)
    │   ├── components/           # ExecutiveReportView, RunHistoryView, EvidenceLedger, AgentCopilotDrawer
    │   └── README.md
    └── sarukan/                  # Poongunran Sarukan (Member 04)
        ├── pages/NotFound.tsx    # 404 handler
        ├── components/           # ChatWidget, DataConnectorsView, SettingsView
        ├── components/ui/        # Button, Switch, Badge, GridBackground, ScrollProgressBar, ScrollReveal
        ├── services/             # StartupTelemetrySample, api, scroll, utils
        └── README.md
```

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Production build & verification
npm run build
```

---

## Collaboration Guide
For Git branching strategy, commit conventions, and pull request workflows, see [TEAM_WORKFLOW.md](file:///D:/atp%20project/TEAM_WORKFLOW.md).
