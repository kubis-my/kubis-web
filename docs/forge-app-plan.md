# Forge Console — App Plan

> **App name:** `apps/forge`
> **Target URL:** `forge.kubis.my`
> **Purpose:** Client-facing project portal that powers the Forge service model

---

## Concept

Forge is a Kubis service product where custom business systems are built for SME clients under a "free MVP → monthly subscription" model (see `docs/kubis-forge.md`). The **Forge Console** is the digital platform that makes this service operational — clients get a workspace after onboarding where they can communicate requirements, monitor project progress, and track delivery milestones.

### Two Sides

- **Dev (you)** — manages all client projects, internal todos, milestones, and discussion threads
- **Client** — read-only access to milestones, participates in discussion thread, submits project brief

---

## Core Flow

```
Client lands on forge.kubis.my → clicks CTA → auth handled by Kubis SSO → creates project
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
```

---

## Modules

### 1. Project

Top-level container per client engagement.

- **Created by client** on sign-up — replaces the "email us" CTA on the landing page
- Fields: project name, business background, subscription plan (optional at this stage), status, start date
- Project statuses: `Pending Review` → `Discovery` → `MVP Build` → `Validation` → `Production` | `On Hold` | `Cancelled`
- `Pending Review` = client just submitted, dev hasn't responded yet
- Dev sees all projects; client sees only their own

### 2. Project Intake / Brief

Client describes what they want built or what problem they want to solve.

- Submitted by client on first login (or prompted by dev)
- Fields: business background, current problem/pain point, what the system needs to do, any reference systems, expected users, notes
- Visible to both dev and client
- Dev can leave comments/clarifications directly on the brief

### 3. Discussion Thread

Async communication per project.

- Both dev and client can post messages
- Supports text + file/image attachments (Phase 2)
- Used for: requirements clarification, feedback, decisions, questions
- Threaded replies (Phase 2)

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

### 5. Internal Todo List

Dev's task list per milestone. **Not visible to client.**

- Dev creates todos under each milestone
- Fields: task name, status (`Todo` / `In Progress` / `Done`), notes
- Purely internal — helps dev track granular work without exposing it to client

### 6. Billing

Per-project billing. Manual tracking, no payment gateway for MVP.

- Subscription plan attached to the project (Starter / Growth / Scale)
- Dev creates invoices per billing cycle
- Invoice fields: period, amount, add-ons (itemised), due date, status
- Invoice statuses: `Unpaid` → `Paid` | `Overdue`
- Add-ons (new module, integration, etc.) attached as line items on the invoice
- Both dev and client can see invoices — client view is read-only

### 7. Client Management

- Client profile (name, company, contact) lives in `apps/main` (my-account) — Forge reads from it, does not duplicate it
- Subscription plan tracked at the project level in Forge
- One client can have multiple projects (Phase 2)
- Auth handled by Kubis SSO (same flow as `apps/main` and `apps/ops`) — no separate sign-up in Forge
- Client authenticates via SSO → lands in their project console → creates a project
- Dev gets notified on new project submission

---

## User Roles

| Role | Access |
|---|---|
| Dev (you) | Full access to everything across all projects |
| Client | Own project only: intake, discussion thread, milestone tracker (read-only) |

---

## Phase 2 (Post-MVP)

- **File/image attachments** in discussion thread
- **Threaded replies** in discussion
- **Multiple projects per client**
- **Billing / subscription status** visible to client
- **Email notifications** on milestone updates and new messages
- **Activity log** per project

---

## Tech Notes

- App: `apps/forge` in the turborepo monorepo
- Shared packages: `@repo/shadcn-ui`, `@repo/commons` (auth, Apollo, Elysia)
- Auth: same SSO flow as `apps/main` and `apps/ops` (PKCE, httpOnly cookies)
- Pattern: Page → Container → Components (same as `apps/main` and `apps/ops`)
- Real-time: `SocketProvider` for live discussion thread updates

---

## App Ecosystem

| App | Purpose |
|---|---|
| `apps/sso` | Authentication — sign in, OAuth PKCE flow |
| `apps/main` | Kubis hub — my account, explore & access Kubis products |
| `apps/ops` | Kubis product: Process Management System |
| `apps/forge` | Kubis product: Forge client project console (this app) |
| `apps/pos` | Kubis product: POS (upcoming) |

---

## TODO — Build Order

- [ ] 1. App Scaffold — `apps/forge` setup, auth, layout, routing
- [ ] 2. Project Intake — client self-registers + submits brief (replaces the email CTA)
- [ ] 3. Dev Dashboard — list of all submitted projects, status overview
- [ ] 4. Milestone Tracker — dev creates milestones, client monitors
- [ ] 5. Internal Todo List — dev manages todos per milestone
- [ ] 6. Discussion Thread — async messaging per project
- [ ] 7. Billing — invoices per project, manual status tracking, visible to both
