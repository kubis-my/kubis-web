# Forge Console — App Plan

> **App name:** `apps/forge`
> **Target URL:** `forge.kubis.my`
> **Purpose:** Client-facing project portal that powers the Forge service model

---

## Concept

Forge is a Kubis service product where custom business systems are built for SME clients under a "free MVP → monthly subscription" model (see `docs/kubis-forge.md`). The **Forge Console** is the digital platform that makes this service operational — clients get a workspace where they can communicate requirements, monitor project progress, and track delivery milestones.

### The Ecosystem Story

Forge is not a standalone product — it is part of the Kubis platform ecosystem:

1. **Client registers a Kubis account** → forced to create a Company (e.g., Acme Corp) during onboarding in `apps/main`
2. **Client uses the Kubis ecosystem** (main app, ops, etc.) for their day-to-day business
3. **Client decides to hire Kubis Forge** to build a custom system (e.g., POS, CRM) for their company
4. **Client opens Forge**, creates a project, and selects which of their Kubis companies this project is for
5. **Dev + client collaborate** in Forge — brief, discussion, milestones, billing
6. **Kubis builds and deploys the custom system**
7. **Client's staff access the deployed app via Kubis SSO** — same credentials, no new sign-up
8. **Permissions, audit logs, and access management** for the deployed app are handled entirely in `apps/main` (my-account)

Forge does not own or enforce permissions. It trusts whoever is authenticated via Kubis SSO.

### Two Sides

- **Dev (you)** — manages all client projects, internal todos, milestones, and discussion threads
- **Client** — read-only access to milestones, participates in discussion thread, submits project brief

---

## Core Flow

```
Client already has a Kubis account + Company
    ↓
Client lands on forge.kubis.my → auth via Kubis SSO (existing credentials)
    ↓
Client creates a project → selects which Company this is for (from their Kubis companies)
    ↓
Client submits intake brief (what they want built, problem to solve)
    ↓
Dev gets notified → reviews brief → responds via discussion thread
    ↓
Dev + client align on scope via thread
    ↓
Dev sets milestones (Discovery → MVP Build → Validation → Production)
    ↓
Dev manages internal todos per milestone (client cannot see)
    ↓
Milestones updated as work progresses → client monitors status
    ↓
Client validates via discussion thread → milestone marked done
    ↓
All milestones done → project complete, subscription begins
    ↓
Deployed app accessed by client's staff via Kubis SSO
Permissions managed in kubis-main my-account
```

---

## Modules

### 1. Project

Top-level container per client engagement.

- **Created by client** — replaces the "email us" CTA on the landing page
- Fields: project name, business background, company (multi-select from client's Kubis companies), subscription plan (optional at this stage), status, start date
- Company field is for organisational context only — not a routing or access-control concern
- Project statuses: `Pending Review` → `Discovery` → `MVP Build` → `Validation` → `Production` | `On Hold` | `Cancelled`
- `Pending Review` = client just submitted, dev hasn't responded yet
- Dev sees all projects; client sees only their own

### 2. Project Overview & Brief

Project summary and client intake brief, combined into the project Overview page.

- Brief submitted by client on first login (or prompted by dev)
- Brief fields: business background, current problem/pain point, what the system needs to do, reference systems, expected users, notes
- Overview also shows: project metadata (client, companies, status, start date, subscription plan), active milestone, staging URL
- Visible to both dev and client

### 3. Discussion Threads

Async communication per project. Route: `/threads`

- Both dev and client can post messages
- Messages grouped by date (date separators) and by sender (consecutive messages from same sender grouped)
- Reply-to: quote a message with a preview; click the preview to jump to and highlight the original
- Soft delete: deleted messages show "This message was deleted on [date]" — dev can restore
- Context menu (right-click) per message: Reply / Delete / Restore
- RichTextEditor input (Cmd+Enter / Ctrl+Enter to send)
- Scroll-to-bottom button when not at the bottom
- Empty state when no messages
- File/image attachments (Phase 2)

### 4. Milestone Tracker

High-level delivery phases visible to both sides.

- Created and managed by dev only
- Default milestones map to Forge service phases: `Discovery`, `MVP Build`, `Validation`, `Production`
- Dev can add custom milestones or rename defaults
- Fields per milestone: name, status, estimated delivery date, notes (visible to client)
- Milestone statuses: `Upcoming` → `In Progress` → `Done`
- Client view: read-only — sees milestone name, status, estimated date

### 4a. Staging Access

During `MVP Build` milestone, dev can attach a staging URL to the project.

- Dev sets the staging URL from the project settings
- Client sees a "Try it out" link in their console when staging URL is available
- Client can open the staging environment directly from the console
- Staging link only visible when set by dev — not shown on other milestones

### 5. Internal Todo List _(Phase 2)_

Dev's task list per milestone. **Not visible to client.**

- Dev creates todos under each milestone
- Fields: task name, status (`Todo` / `In Progress` / `Done`), notes
- Purely internal — helps dev track granular work without exposing it to client

### 6. Billing _(Phase 2)_

Per-project billing. Manual tracking, no payment gateway for MVP.

- Subscription plan attached to the project (Starter / Growth / Scale)
- Dev creates invoices per billing cycle
- Invoice fields: period, amount, add-ons (itemised), due date, status
- Invoice statuses: `Unpaid` → `Paid` | `Overdue`
- Add-ons (new module, integration, etc.) attached as line items on the invoice
- Both dev and client can see invoices — client view is read-only

### 7. Client Management

- Client profile (name, company, contact) lives in `apps/main` (my-account) — Forge reads from it, does not duplicate it
- Company list on project creation is sourced from the client's existing Kubis companies
- Subscription plan tracked at the project level in Forge
- Auth handled by Kubis SSO (same flow as `apps/main` and `apps/ops`) — no separate sign-up in Forge
- Permissions for deployed custom apps are managed entirely in `apps/main` my-account — Forge has no role in this

---

## User Roles

| Role      | Access                                                                      |
| --------- | --------------------------------------------------------------------------- |
| Dev (you) | Full access to everything across all projects                               |
| Client    | Own projects only: intake, discussion thread, milestone tracker (read-only) |

---

## Routing

Projects are scoped to the authenticated user — company is a tag on the project, not a URL segment.

```
/                            → redirect to /projects
/projects                    → client's project list (filterable by company)
/projects/new                → create project (select company, submit brief)
/projects/[id]               → project overview + brief
/projects/[id]/milestones    → milestone tracker
/projects/[id]/threads       → discussion threads
```

---

## Phase 2 (Post-MVP)

- **File/image attachments** in discussion threads
- **Threaded replies** in discussion
- **Internal todo list** — dev task list per milestone (not visible to client)
- **Billing / invoicing** — manual invoice tracking per project, visible to both
- **Email notifications** on milestone updates and new messages
- **Activity log** per project

---

## Tech Notes

- App: `apps/forge` in the turborepo monorepo
- Shared packages: `@repo/shadcn-ui`, `@repo/commons` (auth, Apollo, Elysia)
- Auth: same SSO flow as `apps/main` and `apps/ops` (PKCE, httpOnly cookies)
- Pattern: Page → Container → Components (same as `apps/main` and `apps/ops`)
- Real-time: `SocketProvider` for live discussion thread updates
- Routing: user-scoped (`/projects/[id]`), no company segment in URL

---

## App Ecosystem

| App               | Purpose                                                                                              |
| ----------------- | ---------------------------------------------------------------------------------------------------- |
| `apps/sso`        | Authentication — sign in, OAuth PKCE flow                                                            |
| `apps/main`       | Kubis hub — my account, explore & access Kubis products, permission management for all deployed apps |
| `apps/ops`        | Kubis product: Process Management System                                                             |
| `apps/forge`      | Kubis product: Forge client project console (this app)                                               |
| Custom-built apps | End result of Forge projects (e.g., POS, CRM) — accessed via Kubis SSO, managed in `apps/main`       |

---

## TODO — Build Order

- [x]   1. App Scaffold — `apps/forge` setup, auth, layout, routing (`/projects/[id]`)
- [x]   2. Project Overview & Brief — project metadata + client intake brief on overview page
- [x]   3. Projects List — list of submitted projects, status overview
- [x]   4. Milestone Tracker — milestones with status (Upcoming / In Progress / Done), estimated dates, dev notes
- [x]   5. Discussion Threads — async messaging with reply-to, soft delete/restore, message grouping
- [ ]   6. Connect GraphQL — wire all containers to real API (currently mock data)
- [ ]   7. New Project Flow — client creates project, selects company, submits brief (form exists, no backend)
- [ ]   8. Internal Todo List _(Phase 2)_
- [ ]   9. Billing _(Phase 2)_
