# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install              # Install all workspace dependencies
pnpm dev                  # Run all apps in dev mode
pnpm build                # Build all packages/apps
pnpm lint                 # Lint all packages/apps
pnpm check-types          # TypeScript type checking
pnpm format               # Prettier format (write)
pnpm format:check         # Prettier check (CI)

turbo dev --filter=main   # Main app only (port 3001)
turbo dev --filter=sso    # SSO app only (port 3000)
turbo build --filter=main
turbo lint --filter=main
```

No test framework is configured in this repo.

## Architecture

**Turborepo monorepo** with pnpm workspaces, Next.js 16 (App Router + Turbopack), React 19, TypeScript.

### Apps

- **`apps/main`** (port 3001) — Main product dashboard/workspace app. Protected routes under `/my-account` use `AuthGuard`.
- **`apps/sso`** (port 3000) — SSO/OAuth app handling sign-in and OAuth authorization flows.

### Packages

- **`packages/commons`** — Shared API clients (Apollo, Axios, Elysia route handlers), constants, env validation (`@t3-oss/env-core` + Zod), types, utilities, hooks, server actions.
- **`packages/shadcn-ui`** — Shared UI: shadcn/ui primitives (new-york style), custom components, guards (`AuthGuard`, `ExchangeCodeForToken`), providers (`AuthProvider`, `ApolloProvider`, `SocketProvider`), dashboard layout, hooks.
- **`packages/tailwind-config`**, **`packages/eslint-config`**, **`packages/typescript-config`** — Shared config packages.

### Key Patterns

**Page → Container → Components**: Pages are thin wrappers that import a container component. Containers are `'use client'` components that own data fetching (Apollo `useQuery`/`useMutation`), define a local React Context, and expose a `useXxx()` hook. Sub-components consume the context.

**GraphQL**: Apollo Client 4. Queries use `TypedDocumentNode<Response, Variables>` with inline `gql` template literals co-located in the container file. All queries proxy through `/api/graphql` (Elysia route handler injects httpOnly access token cookie).

**Auth**: Custom OAuth 2.0 PKCE flow (no NextAuth). SSO app handles credentials → issues auth code → main app exchanges for tokens stored in httpOnly cookies. Token refresh every 25 minutes. CSRF tokens seeded by middleware (`proxy.ts`) and validated on mutating routes.

**API routes**: Built with Elysia (not raw Next.js handlers). Both `auth-api-route.ts` and `graphql-api-route.ts` export `.fetch` as the route handler.

**State management**: React Context API only (no Redux/Zustand). Key contexts: `AuthContext`, `DashboardContext`, `SocketContext`, plus per-feature contexts in containers.

**Server actions**: `useBaseAction()` factory from `@repo/commons/utils/base-action.ts` provides cookie access, Axios instance with forwarded headers, and form helpers.

### Styling

- Tailwind CSS v4 with oklch CSS custom properties for theming (dark mode via `.dark` class)
- `cn()` utility from `@repo/shadcn-ui/lib/utils` (clsx + tailwind-merge)
- Prettier enforces Tailwind class ordering via `prettier-plugin-tailwindcss`

### Import Conventions

```typescript
// Shared UI
import { Button } from '@repo/shadcn-ui/components/button';
import { useAuth } from '@repo/shadcn-ui/providers/auth-provider';

// Shared utilities
import { env } from '@repo/commons/constant/env';

// App-local (main app path aliases)
// @/*           → ./app/*
// @/root/*      → ./*
// @/component/* → ./components/*
// @/shadcn/*    → ../../packages/shadcn-ui/src/*
```

**Icons**: `@tabler/icons-react` (primary), `lucide-react` (secondary).

### Formatting

- Prettier: 4 spaces, single quotes, 100 char width, LF line endings
- Vertical spacing: one blank line between logical operations, before/after block comments, between declarations and operations; no blank line between closely related operations

## Environment Variables

Validated at startup via `packages/commons/src/constant/env.ts`. All `NEXT_PUBLIC_*` must be valid URLs or startup fails. Create `.env.local` in each app:

```bash
APP_ENV=development
NEXT_PUBLIC_AUTH_URL=http://localhost:3000/api/auth
NEXT_PUBLIC_MAIN_APP_BASE_URL=http://localhost:3001
NEXT_PUBLIC_SSO_APP_BASE_URL=http://localhost:3000
NEXT_PUBLIC_MAIN_CLIENT_ID=main-web
NEXT_PUBLIC_KUBIS_GATEWAY_GRAPHQL_URL=http://localhost:4000/graphql
```

## Deployment

Multi-stage Dockerfile with `APP_NAME` build arg. Deployed to Fly.io via GitHub Actions (`fly.prod.toml` for production, `fly.staging.toml` for staging).
