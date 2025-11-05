# SSO Application

Single Sign-On (SSO) application for Kubis Web workspace.

## Overview

This is the authentication and Single Sign-On service built with [Next.js](https://nextjs.org). It handles user authentication, authorization, and session management for the Kubis Web platform.

## Development

From the project root:

```bash
# Install dependencies (if not already done)
pnpm install

# Run development server
pnpm dev --filter=sso

# Or using turbo directly
turbo dev --filter=sso
```

The application will be available at [http://localhost:3001](http://localhost:3001) (port may vary).

## Build

```bash
# Build from project root
pnpm build --filter=sso

# Or using turbo directly
turbo build --filter=sso
```

## Tech Stack

- [Next.js](https://nextjs.org) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [React](https://react.dev/) - UI library

## Project Structure

```
apps/sso/
├── app/              # Next.js app directory
├── public/           # Static assets
├── .eslintrc.js      # ESLint configuration
├── next.config.ts    # Next.js configuration
├── tsconfig.json     # TypeScript configuration
└── package.json      # Package dependencies
```

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
