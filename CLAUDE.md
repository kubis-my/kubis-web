# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Rules

- Do what has been asked; nothing more, nothing less
- NEVER create files unless absolutely necessary — prefer editing existing files
- NEVER create documentation files unless explicitly requested
- ALWAYS read a file before editing it
- NEVER commit secrets, credentials, or .env files
- NEVER add a `Co-Authored-By` trailer to commits
- Keep files under 500 lines
- Validate input at system boundaries
- Follow `.claude/rules/code-rules.md` for workflow and formatting rules

## Commands

```bash
# From repo root
pnpm dev                    # Run all apps via Turbo (loads .env)
turbo dev --filter=<app>    # Run one app: sso | main | ops | forge
pnpm build                  # Build all workspaces
pnpm lint                   # ESLint across workspaces
pnpm check-types            # TypeScript checks (where configured; otherwise npx tsc --noEmit in the app)
pnpm format                 # Prettier write
```

No test framework is configured yet — validate changes with `pnpm lint`, `pnpm check-types`, and `pnpm build`.

## Architecture

**pnpm + Turborepo monorepo** of Next.js 16 (App Router + Turbopack) apps: React 19, TypeScript, Apollo Client (GraphQL), socket.io-client, Tailwind CSS v4.

### Apps (`apps/`)

| App   | Purpose                                                                              | Dev Port |
| ----- | ------------------------------------------------------------------------------------ | -------- |
| sso   | Authentication, OAuth authorization, session management for all Kubis apps           | 3000     |
| main  | All-in-one workspace: public homepage, profiles, account management, app discovery   | 3001     |
| ops   | Process/production management console (pre-order batches, production workflow)       | 3002     |
| forge | Client project portal: projects, briefs, threads, milestones, invoices, attachments  | 3003     |

Each app follows the same layout: App Router routes in `app/`, UI composition in `components/`, app-local helpers in `libs/`.

### Shared Packages (`packages/`)

- **@repo/commons** — env schema (`src/constant/env.ts`, t3-oss + Zod; startup fails on invalid env), backend GraphQL schema types, WebSocket event constants, storage/token helpers, shared utilities
- **@repo/shadcn-ui** — shared UI components, guards, providers, dashboard blocks
- **@repo/tailwind-config**, **@repo/eslint-config**, **@repo/typescript-config** — shared tooling presets

## Backend Contract (kubis-backend)

The backend is a sibling monorepo at `../kubis-backend` (NestJS + Apollo: account-service :8000, ops-service :8001, forge-service :8002). Two contracts are synced **manually** — update both sides when they change:

- **GraphQL schema types**: `packages/commons/src/types/<service>-schema.type.ts` is a hand-maintained copy of each backend service's schema
- **WebSocket event names**: `packages/commons/src/constant/web-socket.ts` must match backend `apps/<service>/libs/constants/src/socket-event.ts`

Attachments upload directly to Cloudflare R2 via presigned URLs (presign mutation → PUT to R2 → complete mutation → status via WebSocket with polling fallback); files are served through forge-service `GET /storage/:publicId` with a bearer token.

## Formatting & Naming

Prettier: 4-space indent, single quotes, semicolons, trailing commas, printWidth 100. Component files in `kebab-case.tsx`, types in `PascalCase`, variables/functions in `camelCase`, constants in `UPPER_SNAKE_CASE`. One blank line between logical operations; none between closely related ones.
