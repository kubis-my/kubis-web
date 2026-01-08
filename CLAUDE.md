# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kubis Web is a monorepo workspace application built with Turborepo. It consists of two Next.js applications (main and SSO) with shared packages for common functionality, UI components, and configuration.

## Development Commands

### Setup
```bash
pnpm install              # Install all dependencies
```

### Development
```bash
pnpm dev                  # Run all apps in development mode
turbo dev --filter=main   # Run only main app (localhost:3001)
turbo dev --filter=sso    # Run only SSO app (localhost:3000)
```

### Build & Quality
```bash
pnpm build                # Build all apps
turbo build --filter=main # Build specific app
pnpm lint                 # Lint all packages
pnpm format               # Format code with Prettier
pnpm check-types          # Type check all packages
```

## Architecture

### Monorepo Structure

```
apps/
  main/          # Main application (port 3001)
  sso/           # Single Sign-On application (port 3000)
packages/
  commons/       # Shared utilities, types, API clients
  shadcn-ui/     # UI components and providers
  ui/            # Additional UI components
  tailwind-config/   # Shared Tailwind configuration
  typescript-config/ # Shared TypeScript configuration
  eslint-config/     # Shared ESLint configuration
```

### Authentication Architecture

The project implements **httpOnly cookie-based authentication** using OAuth 2.0 with PKCE flow:

1. **SSO App** (`apps/sso`): Handles OAuth authorization and sign-in flow
2. **Main App** (`apps/main`): Protected application that requires authentication
3. **Commons Package** (`packages/commons`): Contains shared authentication logic

#### Key Components

- **API Route Handlers**: Both apps use Elysia.js for API routes
  - `/api/auth` - Authentication endpoints (exchange, refresh, logout, session)
  - `/api/graphql` - GraphQL proxy with automatic token injection

- **Cookie Management** (`packages/commons/src/utils/cookie-helpers.ts`):
  - Access tokens: 30 minutes (httpOnly, secure in production)
  - Refresh tokens: 7 days (httpOnly, secure in production)
  - All cookies use `sameSite: 'strict'` for security

- **Auth Client** (`packages/commons/src/lib/auth-client.ts`):
  - Handles OAuth code exchange, token refresh, and validation
  - Used by API routes to communicate with auth backend

- **Apollo Client** (`packages/commons/src/lib/apollo-client.ts`):
  - Uses `/api/graphql` proxy endpoint for authenticated requests
  - Tokens handled server-side (not exposed to client)
  - Cache management utilities included

### GraphQL Integration

Both apps use Apollo Client for GraphQL queries. The authentication flow:
1. Client makes GraphQL request to `/api/graphql`
2. API route extracts access token from httpOnly cookie
3. API route forwards request to backend with `Authorization: Bearer {token}` header
4. Response returned to client

### Environment Variables

Required environment variables (see `packages/commons/src/constant/env.ts`):
- `NEXT_PUBLIC_AUTH_URL` - OAuth provider URL
- `NEXT_PUBLIC_MAIN_APP_BASE_URL` - Main app URL
- `NEXT_PUBLIC_SSO_APP_BASE_URL` - SSO app URL
- `NEXT_PUBLIC_MAIN_CLIENT_ID` - OAuth client ID
- `NEXT_PUBLIC_KUBIS_GATEWAY_GRAPHQL_URL` - GraphQL backend URL

Example values in `apps/main/.env` and `apps/sso/.env`

### Package Exports

The `@repo/commons` package exports modules via path-based exports:
```typescript
import { ... } from "@repo/commons/lib/apollo-client"
import { ... } from "@repo/commons/utils/cookie-helpers"
import { ... } from "@repo/commons/constant/env"
import { ... } from "@repo/commons/types/..."
```

### Next.js Configuration

Both apps use:
- Turbopack for faster builds and dev mode
- Monorepo root configuration (`turbopack.root` set to `../../`)
- Custom headers via `getDefaultHeaders()` from commons
- SSO app redirects `/` to `/sign-in`

## Key Patterns

### API Routes
Both apps use Elysia.js (not Next.js route handlers) for API routes. Example pattern:
```typescript
// apps/{app}/app/api/auth/[[...slugs]]/route.ts
export * from "@repo/commons/lib/auth-api-route";
```

The actual implementation is in `packages/commons/src/lib/*-api-route.ts`

### Authentication Guards
The main app wraps the application with:
- `ExchangeCodeForToken` - Handles OAuth code exchange on callback
- `ApolloProvider` - Provides Apollo Client instance
- `AuthProvider` - Manages auth state

### Component Organization
- `apps/main/components/` - App-specific components
  - `container/` - Layout containers
  - `pages/` - Page-level components
- `packages/shadcn-ui/` - Shared UI components built with shadcn/ui

## Technology Stack

- **Framework**: Next.js 16 with App Router
- **Build Tool**: Turborepo with Turbopack
- **Package Manager**: pnpm 9.0.0
- **Language**: TypeScript 5.9.2
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui, Radix UI primitives
- **GraphQL**: Apollo Client
- **API Layer**: Elysia.js
- **Validation**: Zod
- **Icons**: Tabler Icons, Lucide React
- **Notifications**: Sonner (toast notifications)

## Important Notes

- Node.js >= 18 required
- Both apps must run simultaneously for full functionality (SSO for auth, main for app)
- Authentication tokens are stored in httpOnly cookies and never exposed to client JavaScript
- All GraphQL requests must go through `/api/graphql` proxy to inject auth tokens
- Use `turbo dev --filter={app}` to run individual apps during development
