# `@repo/eslint-config`

Shared ESLint flat configurations for the Kubis Web monorepo.

## Overview

This package contains the shared ESLint flat configs used across all apps and packages in the Kubis Web workspace, ensuring consistent code quality and style throughout the project. It bundles `typescript-eslint`, the Next.js and React Hooks plugins, Turbo rules, and Prettier compatibility.

## Available Configurations

Exposed via package exports:

- `@repo/eslint-config/base` — base TypeScript config
- `@repo/eslint-config/next-js` — Next.js app config (extends base)
- `@repo/eslint-config/react-internal` — config for internal React libraries

## Usage

Apps and packages consume these via an `eslint.config.mjs` flat config file:

```js
import { nextJsConfig } from '@repo/eslint-config/next-js';

/** @type {import("eslint").Linter.Config[]} */
export default nextJsConfig;
```

## Development

Any changes to these configurations automatically apply to all apps and packages in the monorepo that import them.
