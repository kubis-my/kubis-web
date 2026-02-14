# `@repo/eslint-config`

Shared ESLint configurations for the Kubis Web monorepo.

## Overview

This package contains shared ESLint configurations used across all applications and packages in the Kubis Web workspace. It ensures consistent code quality and style throughout the project.

## Usage

To use these configurations in a package or app, install this package and extend from one of the available configurations in your `.eslintrc.js`:

```js
module.exports = {
    extends: ['@repo/eslint-config/next.js'],
};
```

## Available Configurations

This package includes ESLint configurations optimized for:

- Next.js applications
- React applications
- TypeScript projects
- Prettier integration

## Development

Any changes to these configurations will automatically apply to all packages and apps in the monorepo that extend from them.
