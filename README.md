# Kubis Web

Kubis Web is a Turborepo monorepo containing the main product app, an SSO app, and shared UI/utility packages.

## Tech Stack

- Next.js 16 (apps)
- React 19 + TypeScript
- Turborepo
- pnpm workspaces
- Tailwind CSS v4
- ESLint + Prettier

## Monorepo Layout

```txt
apps/
  main/  Main product app (dashboard/workspace) - default dev port 3001
  sso/   Authentication and OAuth app - default dev port 3000

packages/
  commons/            Shared constants, API clients, utilities, typed helpers
  shadcn-ui/          Shared UI components, guards, providers, dashboard blocks
  ui/                 Additional shared UI package and generators
  tailwind-config/    Shared Tailwind/PostCSS setup
  eslint-config/      Shared ESLint config package
  typescript-config/  Shared TS config package
```

## Requirements

- Node.js >= 18 (Dockerfile uses Node 22.13)
- pnpm 9.x

## Getting Started

Install dependencies:

```bash
pnpm install
```

Run all workspace `dev` tasks with Turborepo:

```bash
pnpm dev
```

Run a single app:

```bash
# SSO app on http://localhost:3000
turbo dev --filter=sso

# Main app on http://localhost:3001
turbo dev --filter=main
```

## Environment Variables

The workspace validates env values via `@repo/commons` (`packages/commons/src/constant/env.ts`).

Create `.env.local` files for app development with at least:

```bash
APP_ENV=development
NEXT_PUBLIC_AUTH_URL=http://localhost:3000/api/auth
NEXT_PUBLIC_MAIN_APP_BASE_URL=http://localhost:3001
NEXT_PUBLIC_SSO_APP_BASE_URL=http://localhost:3000
NEXT_PUBLIC_MAIN_CLIENT_ID=main-web
NEXT_PUBLIC_KUBIS_GATEWAY_GRAPHQL_URL=http://localhost:4000/graphql
```

Notes:

- All `NEXT_PUBLIC_*` variables must be valid URLs/strings or startup will fail due to schema validation.
- `NEXT_PUBLIC_KUBIS_GATEWAY_GRAPHQL_URL` is used by the main app GraphQL proxy and socket setup.

## Scripts

From repo root:

```bash
pnpm dev          # turbo run dev
pnpm build        # turbo run build
pnpm lint         # turbo run lint
pnpm check-types  # turbo run check-types
pnpm format       # prettier write
pnpm format:check # prettier check
```

Useful filtered commands:

```bash
turbo build --filter=main
turbo build --filter=sso
turbo lint --filter=main
turbo lint --filter=sso
```

## Deployment Notes

- The repo includes a multi-stage `Dockerfile` that supports app-scoped builds via `APP_NAME`.
- Fly.io templates are provided:
    - `fly.prod.toml` for main branch/production
    - `fly.staging.toml` for non-main/staging-like deployments

## Reference Docs

- `apps/main/README.md`
- `apps/sso/README.md`
