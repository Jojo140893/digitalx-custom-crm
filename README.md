# DigitalX Solutions — Internal CRM Platform

A production-grade, custom B2B SaaS CRM platform designed specifically for **DigitalX Solutions** — a Sydney-based digital agency delivering AI voice agents, GoHighLevel implementations, missed-call text-back automations, n8n workflows, chatbots, Meta Ads, and web design.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

---

## Business & Agency Context

DigitalX Solutions operates in Sydney, Australia, with client accounts across Australia (Sydney, Melbourne, Brisbane) and the USA (Los Angeles, Austin, Seattle). Deals typically combine a **one-off setup fee** with a **monthly recurring retainer**.

The CRM supports two distinct user personas via an interactive header role switcher:
1. **Admin / Founder (Sarah Jenkins)**: Full visibility into agency MRR, pipeline values, client retainers, labor cost margins, and executive reporting.
2. **Team Member (Alex Rivera)**: Operations-focused view where revenue figures are masked/restricted.

---

## Included Modules & System Overview

1. **Command Centre Dashboard**: 6 KPI cards, revenue & MRR trend line chart, leads by source donut chart, vertical distribution bar chart, conversion funnel, team activity stream.
2. **Lead Acquisition Pipeline**: Kanban pipeline & Data Table views, lead scoring, vertical & country flags (AU/US), follow-up reminders, and 1-click **"Convert Lead to Client"** workflow.
3. **Active Client Directory**: Retainer tracking, onboarding checklists, service package tags, client drawer.
4. **Churned / Past Clients Archive**: Churn reasons, exit dates, lifetime revenue, 1-click reactivation.
5. **Project Management Board**: Kanban & List views, target delivery dates, blocker notes, assignees.
6. **Completed Projects**: Delivery metrics, CSAT star ratings, final invoice value, client testimonials.
7. **Pending / Delayed Projects**: Blocker analysis, delay reasons, target start dates.
8. **Financial Command Hub**: Invoicing (Setup & Retainers), payment status management, MRR/ARR reporting, client profit margin calculator ($75/hr labor cost vs retainer fee), CSV & PDF report generators.
9. **Team Directory**: Employee list, department breakdown, capacity workload meters (Low/Med/High).
10. **Employee Background Profiles**: Skill tags, certifications (GHL, n8n, Vapi AI Voice), prior experience, CV viewer, performance ratings.
11. **Proposals & Contracts**: Multi-phase proposal builder, versioning, e-signature execution modal.
12. **Activity Timeline**: Central communication stream for calls, emails, meetings, and notes.
13. **Task & Reminder System**: Priority tags (Low/Med/High/Urgent), due dates, overdue highlights, time logger.
14. **Automation & Webhooks Hub**: Webhook endpoint listeners & live simulator for GoHighLevel, Apollo.io, n8n, Meta Ads, GA4.
15. **Role-Based Access Control (RBAC)**: Interactive Admin vs Team Member session switcher.
16. **Filterable Executive Reports**: Filter data by region (AU/US), vertical, or date range with instant CSV exports.
17. **Global Search (Cmd+K)**: Instant search modal finding leads, clients, projects, invoices, and employees.
18. **Security Audit Log**: Complete system audit log of all user modifications.
19. **Time Tracking & Margin Analysis**: Logged billable hours per employee/project.
20. **Responsive Dark Navy Theme**: Sleek SaaS aesthetic (`#070a11`, `#0b0f17`, electric blue `#3b82f6` accents).

---

## Webhook Integration API Endpoints

DigitalX CRM exposes ready REST API endpoints for external integrations:

- **GoHighLevel**: `POST /api/webhooks/ghl`
- **Apollo.io**: `POST /api/webhooks/apollo`
- **Meta Ads**: `POST /api/webhooks/meta-ads`
- **n8n Orchestrator**: `POST /api/webhooks/n8n`

Sending a POST JSON payload to any of these endpoints automatically ingests the lead into the pipeline and logs the webhook payload in the Automation Hub.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom dark navy tokens & glassmorphism
- **Icons**: Lucide React
- **Charts**: Recharts
- **ORM / Database**: Prisma with SQLite (`prisma/dev.db`)
- **State Management**: Reactive in-memory store with localStorage persistence (`lib/store.ts`)
