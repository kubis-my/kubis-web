# Main Application

The main application for Kubis Web - your all in one workspace.

## Overview

This is the core application built with [Next.js](https://nextjs.org). It provides the main user interface and functionality for the Kubis Web platform.

## Development

From the project root:

```bash
# Install dependencies (if not already done)
pnpm install

# Run development server
pnpm dev --filter=main

# Or using turbo directly
turbo dev --filter=main
```

The application will be available at [http://localhost:3000](http://localhost:3000) (port may vary).

## Build

```bash
# Build from project root
pnpm build --filter=main

# Or using turbo directly
turbo build --filter=main
```

## Tech Stack

- [Next.js](https://nextjs.org) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [React](https://react.dev/) - UI library

## Project Structure

```
apps/main/
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
