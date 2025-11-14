# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kubis Web is a monorepo workspace implementing a multi-app architecture with centralized authentication. The project consists of two Next.js applications (`main` and `sso`) that communicate with an external authentication service using OAuth 2.0 with PKCE flow.

## Essential Commands

```bash
# Install dependencies
pnpm install

# Development - all apps
pnpm dev

# Development - specific app
turbo dev --filter=main    # Main app on port 3001
turbo dev --filter=sso     # SSO app on port 3000

# Build all apps
pnpm build

# Build specific app
turbo build --filter=main
turbo build --filter=sso

# Linting
pnpm lint                  # All packages
turbo lint --filter=main   # Specific app

# Type checking
pnpm check-types

# Code formatting
pnpm format
```

## Architecture

### Monorepo Structure

This is a Turborepo monorepo managed with pnpm workspaces:

- **apps/main**: Primary application (port 3001)
- **apps/sso**: Single Sign-On authentication app (port 3000)
- **packages/commons**: Shared utilities, auth client, constants, and server actions
- **packages/shadcn-ui**: Shared UI components (shadcn/ui), guards, and providers
- **packages/eslint-config**: Shared ESLint configurations
- **packages/typescript-config**: Shared TypeScript configurations
- **packages/tailwind-config**: Shared Tailwind CSS configurations
- **packages/ui**: Additional shared UI components

### Authentication Flow

The project implements OAuth 2.0 Authorization Code flow with PKCE:

1. **SSO App (`apps/sso`)**: Handles user login
   - Middleware redirects authenticated users to main app
   - Uses `authClient.signIn()` from `@repo/commons/lib/auth-client`
   - Generates PKCE code verifier/challenge
   - Communicates with external auth service

2. **Main App (`apps/main`)**: Protected application
   - Uses `AuthGuard` from `@repo/shadcn-ui/guards/auth-guard` to protect routes
   - `AuthGuard` redirects unauthenticated users to SSO app with OAuth parameters
   - Middleware refreshes tokens on page loads using `refreshCredentialTokenAction()`
   - `ExchangeCodeForToken` component handles OAuth callback

3. **Auth Client** (`packages/commons/src/lib/auth-client.ts`):
   - `signIn()`: Authenticate with identifier/password
   - `refresh()`: Refresh access tokens
   - `validate()`: Validate access tokens
   - `exchangeCodeForTokens()`: Exchange authorization code for tokens

4. **Key Auth Components**:
   - `AuthProvider` (`packages/shadcn-ui/src/providers/auth-provider.tsx`): Context for auth state
   - `AuthGuard`: Client-side route protection with OAuth redirect
   - `ExchangeCodeForToken`: Handles OAuth callback and token exchange
   - `checkCurrentCredential` action: Server-side credential validation
   - `refreshCredentialToken` action: Server-side token refresh

### GraphQL Integration

The project uses Apollo Client for GraphQL queries and mutations, with automatic authentication token injection.

1. **Apollo Client Configuration** (`packages/commons/src/lib/apollo-client.ts`):
   - Configured with authentication link that automatically adds access tokens to requests
   - Error handling for GraphQL and network errors
   - Cache management with InMemoryCache
   - SSR-safe client creation
   - **Flexible URI configuration**: Supports multiple GraphQL endpoints for different services
   - Client instances are cached per URI for optimal performance

2. **ApolloProvider** (`packages/shadcn-ui/src/providers/apollo-provider.tsx`):
   - Wraps the application to provide GraphQL capabilities
   - **Accepts optional `uri` prop** to specify GraphQL endpoint
   - Falls back to `NEXT_PUBLIC_ACCOUNT_GRAPHQL_URL` if no URI provided
   - Each app can use different GraphQL backends by passing different URIs
   - Example: `<ApolloProvider uri="https://api.example.com/graphql">`

3. **Using GraphQL in Components**:
   ```tsx
   import { gql } from '@apollo/client';
   import { useQuery, useMutation } from '@apollo/client/react';

   // Define your query
   const GET_DATA = gql`
     query GetData {
       data {
         id
         name
       }
     }
   `;

   // Use in component
   function MyComponent() {
     const { data, loading, error } = useQuery(GET_DATA);

     if (loading) return <div>Loading...</div>;
     if (error) return <div>Error: {error.message}</div>;

     return <div>{data.data.name}</div>;
   }
   ```

4. **Authentication with GraphQL**:
   - Access tokens are automatically retrieved from `secureTokenStorage`
   - Tokens are added to Authorization header for every GraphQL request
   - Authentication errors (UNAUTHENTICATED, FORBIDDEN) are logged automatically

5. **Example Hooks** (`packages/commons/src/hooks/use-graphql-examples.ts`):
   - Contains template queries and mutations
   - Shows patterns for useQuery, useMutation with variables
   - Demonstrates cache updates and refetching strategies

6. **Client Management Functions**:
   - `getApolloClient(uri?)`: Get or create Apollo Client instance for a specific URI
   - `resetApolloClient(uri?)`: Clear Apollo Client cache (useful after logout). If URI is omitted, clears all clients
   - `reinitializeApolloClient(uri?)`: Completely reset client instance. If URI is omitted, resets all clients

7. **Multiple GraphQL Backends**:
   Each app can connect to different GraphQL endpoints by passing the `uri` prop:
   ```tsx
   // Main app - uses account service
   <ApolloProvider uri={process.env.NEXT_PUBLIC_ACCOUNT_GRAPHQL_URL}>
     <App />
   </ApolloProvider>

   // Another app - uses different service
   <ApolloProvider uri={process.env.NEXT_PUBLIC_OTHER_SERVICE_URL}>
     <App />
   </ApolloProvider>
   ```

### Environment Variables

Required environment variables (validated via `@t3-oss/env-core` in `packages/commons/src/constant/env.ts`):

- `NEXT_PUBLIC_AUTH_URL`: External authentication service URL
- `NEXT_PUBLIC_MAIN_APP_BASE_URL`: Main app base URL
- `NEXT_PUBLIC_SSO_APP_BASE_URL`: SSO app base URL
- `NEXT_PUBLIC_MAIN_CLIENT_ID`: OAuth client ID for main app
- `NEXT_PUBLIC_ACCOUNT_GRAPHQL_URL`: GraphQL API endpoint URL for external account service

### Shared Package Exports

**@repo/commons**:
- `./lib/*`: Auth client, Apollo Client configuration, and utilities
- `./constant/*`: Environment variables, URLs, client IDs
- `./utils/*`: PKCE generators, error handlers, base actions
- `./actions/*`: Server actions for auth operations
- `./hooks/*`: Custom React hooks, GraphQL example hooks

**@repo/shadcn-ui**:
- `./components/*`: shadcn/ui components
- `./custom-components/*`: Custom components (loader, error, countdown, etc.)
- `./guards/*`: AuthGuard, ExchangeCodeForToken
- `./providers/*`: AuthProvider, ApolloProvider
- `./hooks/*`: use-mobile, use-countdown, use-debounce
- `./lib/*`: Utility functions

### Tech Stack

- **Next.js 15.5.6**: React framework with Turbopack
- **React 19.1.0**: UI library
- **TypeScript 5**: Static typing
- **Tailwind CSS 4**: Styling with PostCSS
- **pnpm 9.0.0**: Package manager
- **Turborepo 2.5.8**: Monorepo build system
- **shadcn/ui**: UI component library (Radix UI primitives)
- **Apollo Client 4**: GraphQL client with caching and state management
- **GraphQL 16**: Query language for APIs
- **Zod 4**: Schema validation
- **Axios**: HTTP client
- **Luxon**: Date/time handling

## Important Implementation Details

### Middleware Behavior

- **SSO middleware**: Redirects authenticated users to main app
- **Main middleware**: Refreshes tokens with cooldown (1 second) to prevent duplicate calls during navigation

### PKCE Implementation

All OAuth flows use PKCE (Proof Key for Code Exchange):
- Code verifier generated with `generateCodeVerifier()`
- Code challenge generated with `generateCodeChallenge()`
- State parameter generated with `generateState()`
- Verifier stored in sessionStorage during authorization
- Verifier used during token exchange

### Error Handling

Error handling uses standardized format from `convertErrorMessageListToObject()` in `packages/commons/src/utils/error-message.ts`. Auth client returns structured responses:
```typescript
{ code: 200 | 400 | 500, raw: data }
```

### Working with Workspace Packages

When importing from workspace packages:
- Use `workspace:*` or `workspace:^` in package.json dependencies
- Import using package exports defined in each package's package.json
- Example: `import { authClient } from "@repo/commons/lib/auth-client"`

### Adding shadcn/ui Components

shadcn/ui components are centralized in `packages/shadcn-ui`. Configuration is in `packages/shadcn-ui/components.json`. Add new components to this package, not individual apps.
