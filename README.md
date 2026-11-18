# Workspace: Poongunran Sarukan (Member 04)

## Developer Profile
- **Full Name:** Poongunran Sarukan
- **Handle:** Sarukan
- **Role:** Design Systems, Platform Settings & Services Engineer
- **Primary Domain:** Shared UI Library, Platform Settings, Data Connectors & Telemetry Models

---

## Assigned Files & Structure
```text
src/team/sarukan/
├── pages/
│   └── NotFound.tsx              # Standalone 404 error page
├── components/
│   ├── ChatWidget.tsx            # Floating support and model copilot widget
│   ├── DataConnectorsView.tsx    # Live database connection manager (Postgres, Snowflake)
│   ├── SettingsView.tsx          # Platform settings, budget caps, LLM & Slack webhooks
│   └── ui/
│       ├── Button.tsx            # Reusable button component
│       ├── Switch.tsx            # Theme & boolean toggle component
│       ├── Badge.tsx             # Status badge component
│       ├── GridBackground.tsx    # Subtle geometric grid background
│       ├── ScrollProgressBar.tsx # Top reading progress indicator
│       └── ScrollReveal.tsx      # Smooth viewport intersection animator
├── services/
│   ├── StartupTelemetrySample.ts # Diagnostic scenario data models & sample datasets
│   ├── api.ts                    # Backend API client
│   ├── scroll.ts                 # Smooth scroll utility with Lenis engine
│   └── utils.ts                  # Tailwind class merging utility (cn)
└── README.md                     # Workspace documentation
```

---

## Responsibilities
1. Maintain shared UI design system and components used across landing and dashboard.
2. Maintain platform settings, cost guardrails, and database connectors.
3. Provide typed telemetry models and utilities for all team members.

---

## Git Workflow
- **Branch:** `feature/sarukan-shared-services`
- **Integration Target:** Pull request into `develop`
- **Reviewer:** Nivethith Arasakumar
