# Kubis Web

Your all in one workspace - A modern monorepo powered by Turborepo.

## What's inside?

This Turborepo includes the following packages and apps:

### Apps and Packages

- `main`: Main application built with [Next.js](https://nextjs.org/)
- `sso`: Single Sign-On (SSO) application built with [Next.js](https://nextjs.org/)
- `@repo/eslint-config`: Shared ESLint configurations used throughout the monorepo
- `@repo/typescript-config`: Shared TypeScript configuration files

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Development Tools

This workspace has the following tools configured:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Turborepo](https://turborepo.com/) for build orchestration

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm 9.0.0

### Installation

Install dependencies:

```bash
pnpm install
```

### Development

To develop all apps and packages:

```bash
pnpm dev
```

To develop a specific app:

```bash
# Develop main app
turbo dev --filter=main

# Develop SSO app
turbo dev --filter=sso
```

### Build

To build all apps and packages:

```bash
pnpm build
```

To build a specific app:

```bash
# Build main app
turbo build --filter=main

# Build SSO app
turbo build --filter=sso
```

### Other Commands

```bash
# Lint all packages
pnpm lint

# Format code
pnpm format

# Type check all packages
pnpm check-types
```

## Project Structure

```
kubis-web/
├── apps/
│   ├── main/          # Main application
│   └── sso/           # SSO application
├── packages/
│   ├── eslint-config/ # Shared ESLint configs
│   └── typescript-config/ # Shared TypeScript configs
└── package.json
```

## Turborepo

Learn more about Turborepo:

- [Documentation](https://turborepo.com/docs)
- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
