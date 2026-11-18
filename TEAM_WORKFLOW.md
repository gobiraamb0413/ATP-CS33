# DevConcord — Team Collaboration & Engineering Workflow

This document establishes the official team collaboration standards, repository ownership boundaries, Git branching strategies, pull request guidelines, and component integration procedures for our team project.

---

## 1. Group Members & Responsibility Allocation

| Member | WhatsApp / Chat Handle | Assigned Role | Primary Code Ownership | Dedicated Folder |
|---|---|---|---|---|
| **Nivethith Arasakumar** | Nive | **Project Lead & Platform Architect** | `src/team/nivethith/pages/Home.tsx`<br>`src/team/nivethith/components/*`<br>`src/App.tsx`<br>Architecture, PR approvals & final release | [`src/team/nivethith/`](file:///D:/atp%20project/src/team/nivethith/README.md) |
| **Baraneetharan Gobiraam** | Gobiraam | **Repository Host & Dashboard Lead (Member 02)** | Central GitHub repo host<br>`src/team/gobiraam/pages/Dashboard.tsx`<br>`src/team/gobiraam/components/*`<br>Multi-agent telemetry, intake & DAG views | [`src/team/gobiraam/`](file:///D:/atp%20project/src/team/gobiraam/README.md) |
| **Raveeswaran Saeyon** | Seayon Main | **Authentication & Access Lead (Member 01)** | `src/team/saeyon/pages/Auth.tsx`<br>Sign-in/Sign-up flows, OAuth buttons, Session storage (`devconcord_session`) | [`src/team/saeyon/`](file:///D:/atp%20project/src/team/saeyon/README.md) |
| **Ashmiga Sathees** | Ashmii | **Reporting & Audit Lead (Member 03)** | `src/team/ashmiga/components/*`<br>Executive reports, immutable evidence ledger, run history & copilot | [`src/team/ashmiga/`](file:///D:/atp%20project/src/team/ashmiga/README.md) |
| **Poongunran Sarukan** | Sarukan | **Design System & Services Lead (Member 04)** | `src/team/sarukan/pages/NotFound.tsx`<br>`src/team/sarukan/components/ui/*`<br>`src/team/sarukan/services/*`<br>Shared primitives, platform settings, connectors | [`src/team/sarukan/`](file:///D:/atp%20project/src/team/sarukan/README.md) |

---

## 2. Repository Structure & Folder Boundaries

All website files have been divided into the team workspaces:

```text
atp project/
├── TEAM_WORKFLOW.md                       # This collaboration manual
├── README.md                              # Project documentation & feature overview
├── package.json                           # Dependencies & build scripts
├── vite.config.ts                         # Vite configuration
├── tsconfig.json                          # TypeScript configuration
└── src/
    ├── App.tsx                            # Master application router
    ├── main.tsx                           # DOM mount entry point
    ├── index.css                          # Tailwind design tokens
    └── team/                              # Dedicated member workspaces
        ├── nivethith/                     # Nivethith (Landing page & marketing components)
        ├── saeyon/                        # Saeyon (Authentication page)
        ├── gobiraam/                      # Gobiraam (Dashboard page & core workflow)
        ├── ashmiga/                       # Ashmiga (Executive reports & evidence ledger)
        └── sarukan/                       # Sarukan (Shared UI, settings & services)
```

---

## 3. Git Collaboration & Integration Workflow

### Branching Model
- `main`: Stable demonstration and production release branch.
- `develop`: Shared integration branch where feature pull requests land.
- `feature/nivethith-landing`: Nivethith's feature branch.
- `feature/saeyon-auth-services`: Saeyon's feature branch.
- `feature/gobiraam-dashboard-core`: Gobiraam's feature branch.
- `feature/ashmiga-reports-audit`: Ashmiga's feature branch.
- `feature/sarukan-shared-services`: Sarukan's feature branch.

### How to Push to Gobiraam's GitHub Repository
```bash
# 1. Initialize git in the project root
git init
git add .
git commit -m "feat: initial commit of DevConcord divided team workspaces"

# 2. Add Gobiraam's GitHub remote
git remote add origin https://github.com/gobiraam/<repository-name>.git

# 3. Push to main and develop
git branch -M main
git push -u origin main
git checkout -b develop
git push -u origin develop
```
