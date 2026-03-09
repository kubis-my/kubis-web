# Process Management System (ops) — App Plan

> **App name:** `apps/ops`
> **Target URL:** `ops.kubis.my`
> **Purpose:** Pre-order batch management + production workflow system for SMEs

---

## Concept

Pre-order businesses collect orders into a **Campaign** (bucket). When the threshold is met or the deadline is reached, the system notifies the Admin/Manager who then decides to trigger production or cancel the campaign. Once production starts, each order is tracked individually through a configurable production workflow.

### Two-Level Architecture

- **Campaign level** — batch health (X of Y orders collected, open/funded/in production)
- **Order level** — individual fulfillment through production stages, each with its own shipping date

---

## Core Flow

```
Order comes in → attaches to open campaign bucket (auto or manual)
    ↓
Orders accumulate in bucket
    ↓
Threshold met OR deadline hit → system notifies Admin/Manager
    ↓
Admin/Manager decides: trigger production start or cancel campaign
    ↓
Each order spawns its own workflow instance
    ↓
Production staff processes orders individually through stages (sorted by shipping date)
    ↓
Each order marked fulfilled → Campaign completes when all orders done
```

---

## Modules

### 1. Campaign
Pre-order batch container. Can be created manually by Admin or auto-created by the system when a new order comes in (configurable in Settings).

- Campaign statuses: `Open` → `Funded` → `In Production` → `Completed` | `Cancelled`
- Fields: product, min qty, max qty (optional), pre-order closing date (optional)
- Dashboard: X of Y orders collected, revenue, status
- System notifies Admin/Manager when threshold is met or closing date is reached
- Admin/Manager decides: trigger production or cancel

### 2. Orders
Individual purchases within a campaign.

- Created by Sales/CS or via customer-facing intake
- Attaches to an open campaign on creation
- Fields: customer info, product variant/specs, quantity, notes, payment status, shipping date
- Shipping date is per order — orders within the same campaign can have different deadlines
- Payment status: `Unpaid` | `Paid` | `Refunded` (manual, no gateway)
- Once campaign enters production, each order gets its own workflow instance
- Order status mirrors the active workflow stages

**Refund Flow**
- Refund request goes through: `Refund Requested` → `Pending Approval` → `Refunded` | `Rejected`
- If approved while campaign is `Open` or `Funded` → order removed from bucket, count drops
- If approved while campaign is `In Production` → order production stops immediately, flagged on Production Board — other orders in the same campaign continue unaffected
- Bulk refund: Admin can refund all or selected orders when cancelling a campaign
- If refunds cause order count to drop below min qty while campaign is `Open` → system warns Admin
- Admin can then wait for new orders or manually assign existing orders into the campaign to bring count back up

### 3. Workflow Builder
Fully configurable per business.

- Define custom stages (name, color, description)
- Assign responsible role per stage (e.g. Production Staff, QC Team)
- Set required fields or checklist before advancing to next stage
- Multiple workflows per business (different flows per product type)
- Link workflow to a product

### 4. Production Board
For production staff.

- Kanban or list view of orders in their assigned stage
- Orders sorted/highlighted by shipping date — nearest deadline first
- Advance order to next stage
- Add notes, attachments, timestamps per stage transition
- Filter by campaign, product, assignee

### 5. Product / Service Catalog
- Define orderable items with basic pricing / SKU info
- Link each product to a workflow
- Set default min/max qty (used when auto-creating campaign buckets)
- Used when creating campaigns

### 6. Customer Management
- Customer profiles: name, contact, address
- Order history across campaigns
- Customer portal: read-only order status tracking (separate app: `apps/customer-portal`)

### 7. Team & Roles
- Invite members to the business account
- Roles: `Admin`, `Sales/CS`, `Production Staff`
- Assign staff to specific workflow stages

### 8. Dashboard & Reports
- Active campaigns overview (orders collected, threshold progress)
- Orders per stage (bottleneck visibility)
- Production throughput
- Basic revenue overview per campaign

### 9. Settings
Business-level configuration for campaign and production behavior.

**Campaign / Bucket**
- Auto-create campaign bucket when a new order comes in (toggle on/off)
- Default min qty per product
- Default max qty per product (optional)

**Notifications**
- Notify when campaign threshold is met (toggle)
- Notify when shipping date is approaching (toggle + set days before)

**General**
- Business profile (name, logo, etc.)
- Member roles and permissions

### 10. Notifications
In-app notification center.

- Alerts: campaign threshold met, closing date reached, order stage changed, campaign completed, shipping date approaching
- Notification history / inbox
- Phase 2: email / WhatsApp delivery per trigger

---

## Phase 2 (Post-MVP)

- **Inventory / Materials** — track raw material consumption per order/product
- **Billing / Invoicing** — generate invoice from completed order
- **Mobile-optimized production view** — for floor workers on phone

---

## Tech Notes

- App: `apps/ops` in the turborepo monorepo
- Shared packages: `@repo/shadcn-ui`, `@repo/commons` (auth, Apollo, Elysia)
- Auth: same SSO flow as `apps/main` (PKCE, httpOnly cookies)
- Real-time: `SocketProvider` already available in shared packages
- Pattern: Page → Container → Components (same as `apps/main`)
- Table: TanStack React Table v8
- Product types supported: Simple, Variant (with cartesian attribute builder), Digital, Service, Bundle
- Currency/locale: MYR, `en-MY`

---

## Decisions

- **Customer portal** → separate app: `apps/customer-portal`
- **Payment tracking** → manual. Orders have a simple `payment_status` field (`Unpaid` / `Paid` / `Refunded`). No gateway integration.
- **Campaign creation** → configurable: auto-created by system when order comes in, or manually by Admin (toggle in Settings)
- **Production trigger** → always manual. Admin/Manager decides after being notified — system never auto-starts production.
- **Shipping date** → per order, not per campaign. Production board sorts by nearest shipping date.
- **Order reassignment** → orders can be manually moved between campaigns by Admin (e.g. to fill up a bucket after refunds drop count below threshold).

---

## TODO — Build Order

- [x] 1. App Scaffold        — `apps/ops` setup, auth, layout, routing
- [~] 2. Product Catalog     — UI shell built (list, add forms for all 5 types, variant builder); no backend persistence yet
- [ ] 3. Customer Management — standalone foundation
- [ ] 4. Workflow Builder    — standalone; defines stages & roles per product type
- [ ] 5. Product Catalog     — complete backend + workflow link (needs Workflow Builder)
- [ ] 6. Campaign            — needs Products
- [ ] 7. Orders              — needs Products + Campaigns + Customers
- [ ] 8. Production Board    — needs Workflows + Orders
- [ ] 9. Team & Roles
- [ ] 10. Dashboard & Reports
- [ ] 11. Notifications

### Catalog — Remaining Work
- [ ] Wire up GraphQL mutations (create / update / archive product)
- [ ] Product edit flow (open existing product in sheet/dialog)
- [ ] Search + filter in catalog list
- [ ] Link product to a workflow (needs Workflow Builder — step 4)
- [ ] Set default min/max qty per product

---

## App Ecosystem

Kubis is a SaaS platform with multiple products. `apps/main` is the account hub — not part of the ops system.

| App | Purpose |
|---|---|
| `apps/sso` | Authentication — sign in, OAuth PKCE flow |
| `apps/main` | Kubis hub — my account, explore & access Kubis products |
| `apps/ops` | Kubis product: Process Management System (this app) |
| `apps/pos` | Kubis product: POS (upcoming) |
| `apps/customer-portal` | Standalone: customer-facing order status tracking |
