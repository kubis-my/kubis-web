# Repository Guidelines

## Project Structure & Module Organization
`kubis-web` is a pnpm/Turborepo monorepo.

- `apps/main`: main product app (Next.js, default dev port `3001`)
- `apps/sso`: auth and OAuth app (Next.js, default dev port `3000`)
- `packages/commons`: shared constants, API clients, and utility helpers
- `packages/shadcn-ui`, `packages/ui`: shared UI components
- `packages/eslint-config`, `packages/typescript-config`, `packages/tailwind-config`: shared tooling presets

Use `app/` for routes, `components/` for UI composition, and `libs/` for app-local helpers.

## Build, Test, and Development Commands
Run commands from repo root:

- `pnpm install`: install workspace dependencies
- `pnpm dev`: run all workspace `dev` tasks via Turbo
- `turbo dev --filter=main` / `turbo dev --filter=sso`: run one app
- `pnpm build`: build all workspaces
- `pnpm lint`: run ESLint across workspaces
- `pnpm check-types`: run TypeScript checks where configured
- `pnpm format` / `pnpm format:check`: write/check Prettier formatting

## Coding Style & Naming Conventions
- Language: TypeScript + React (Next.js App Router)
- Formatting: Prettier (`.prettierrc.json`) with 4-space indentation, semicolons, single quotes, trailing commas, and `printWidth: 100`
- Linting: shared ESLint config from `@repo/eslint-config`
- Naming: component files in `kebab-case.tsx`, types in `PascalCase`, variables/functions in `camelCase`, constants in `UPPER_SNAKE_CASE`
- Vertical spacing: keep one blank line between logical operations, around block comments, and between declarations and later operations

## Development Workflow Rules
Follow `.claude/rules/code-rules.md` for all changes.

- Apply KISS, YAGNI, and SOLID; avoid over-engineering
- Read existing code before proposing or making edits
- Reuse existing patterns before introducing new abstractions
- Research similar implementations first
- Share a short plan and wait for approval before coding

## Testing Guidelines
There is no dedicated test framework configured yet. Before opening a PR, validate with:

- `pnpm lint`
- `pnpm check-types`
- `pnpm build`

When adding tests, place them near the feature (`*.test.ts` / `*.test.tsx`) or in a nearby `__tests__/` folder.

## Commit & Pull Request Guidelines
Recent history follows Conventional Commit style (`feat:`, `fix:`, `misc:`). Example:

- `feat: add invitation decline mutation`
- `fix: resolve profile settings validation`

PRs should include clear scope, linked issue/ticket, screenshots/recordings for UI changes, and notes on env/config changes affecting `main`, `sso`, or shared packages.
