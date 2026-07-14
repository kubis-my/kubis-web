# Kubis Web

Kubis Web is a Turborepo monorepo containing the Kubis product apps (main, ops, forge), an SSO app, and shared UI/utility packages.

## Tech Stack

- Next.js 16 + Turbopack (apps)
- React 19 + TypeScript
- Apollo Client + GraphQL, socket.io-client
- Turborepo
- pnpm workspaces
- Tailwind CSS v4
- ESLint (flat config) + Prettier

## Monorepo Layout

```txt
apps/
  sso/    Authentication and OAuth app - default dev port 3000
  main/   Main product app (your all-in-one workspace) - default dev port 3001
  ops/    Process/production management console - default dev port 3002
  forge/  Forge client project portal - default dev port 3003

packages/
  commons/            Shared constants, env schema, backend schema types, hooks, utilities
  shadcn-ui/          Shared UI components, guards, providers, dashboard blocks
  tailwind-config/    Shared Tailwind v4 / PostCSS setup
  eslint-config/      Shared ESLint flat-config presets
  typescript-config/  Shared TS config presets
```

## Apps

- **sso** (`:3000`) — Authentication and Single Sign-On. Handles user auth, OAuth authorization, and session management for all Kubis apps.
- **main** (`:3001`) — The all-in-one workspace. Public product homepage (`kubis.my`), author/profile entity, account management, and app discovery.
- **ops** (`:3002`) — Process/production management console for pre-order batch and production workflow tracking (`ops.kubis.my`).
- **forge** (`:3003`) — Client-facing project portal that powers the Forge service model (`forge.kubis.my`).

All apps are Next.js 16 (App Router) + Turbopack, with App Router routes in `app/`, UI composition in `components/`, app-local helpers in `libs/`, and an `eslint.config.mjs` flat config that imports `@repo/eslint-config/next-js`.

## Requirements

- Node.js >= 18 (CI uses Node 22)
- pnpm 9.x

## Getting Started

Install dependencies:

```bash
pnpm install
```

Copy the example env and fill in values (see [Environment Variables](#environment-variables)):

```bash
cp .env.example .env
```

Run all workspace `dev` tasks with Turborepo:

```bash
pnpm dev
```

Run a single app:

```bash
turbo dev --filter=sso     # http://localhost:3000
turbo dev --filter=main    # http://localhost:3001
turbo dev --filter=ops     # http://localhost:3002
turbo dev --filter=forge   # http://localhost:3003
```

## Environment Variables

The workspace validates env values via `@repo/commons` (`packages/commons/src/constant/env.ts`) using `@t3-oss/env-core` + Zod. All `NEXT_PUBLIC_*` URL variables must be valid URLs and client IDs non-empty, or startup/build fails schema validation.

Start from `.env.example`:

```bash
APP_ENV=development
NEXT_PUBLIC_AUTH_URL=http://localhost:8000
NEXT_PUBLIC_SSO_APP_BASE_URL=http://localhost:3000
NEXT_PUBLIC_MAIN_APP_BASE_URL=http://localhost:3001
NEXT_PUBLIC_OPS_APP_BASE_URL=http://localhost:3002
NEXT_PUBLIC_FORGE_APP_BASE_URL=http://localhost:3003
NEXT_PUBLIC_MAIN_CLIENT_ID=
NEXT_PUBLIC_OPS_CLIENT_ID=
NEXT_PUBLIC_FORGE_CLIENT_ID=
NEXT_PUBLIC_ACCOUNT_SERVICE_GRAPHQL_URL=http://localhost:8003/graphql
NEXT_PUBLIC_OPS_SERVICE_GRAPHQL_URL=http://localhost:8001/graphql
NEXT_PUBLIC_FORGE_SERVICE_GRAPHQL_URL=http://localhost:8002/graphql
NEXT_PUBLIC_FORGE_STRIPE_PUBLISHABLE_KEY=

# SEO — search engine site verification (optional; leave blank to omit the tags)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
NEXT_PUBLIC_BING_SITE_VERIFICATION=
```

## Scripts

From repo root:

```bash
pnpm dev          # turbo run dev (loads .env)
pnpm build        # turbo run build
pnpm lint         # turbo run lint
pnpm check-types  # turbo run check-types
pnpm format       # prettier write
pnpm format:check # prettier check
```

Useful filtered commands:

```bash
turbo build --filter=main
turbo lint --filter=ops
turbo dev --filter=forge
```

## Deployment

Deployment is handled by GitHub Actions to Vercel:

- `.github/workflows/deploy-vercel-prod.yml` — on push to `release`, deploys each app to its own Vercel project (SSO first, then Forge and Main).
- `.github/workflows/build-check.yml` — on push to any other branch, runs `pnpm build` as a CI check.

## Reference Docs

- `docs/ops-app-plan.md` — ops app product spec
- `AGENTS.md` — contributor/agent guidelines
- `CLAUDE.md` — Claude Code project guidance (architecture, commands, backend contract)
