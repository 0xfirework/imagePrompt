# Repository Guidelines

## Project Structure & Module Organization
- apps/nextjs: Main Next.js app (App Router) and public assets.
- apps/auth-proxy: Lightweight auth proxy (Nitro/h3).
- packages/api, auth, common, stripe: Shared backend/business modules.
- packages/db: Prisma schema + Kysely types and DB utilities.
- packages/ui: Shared UI components and styles.
- tooling/*: Centralized ESLint, Prettier, Tailwind, and TS configs.

## Build, Test, and Development Commands
- `bun run dev:web`: Start the Next.js app locally on port 3000.
- `bun run dev`: Run all apps in parallel via Turborepo.
- `bun run build`: Build all workspaces (caches with Turbo).
- `bun db:push`: Apply Prisma schema to the database.
- `bun run lint` / `bun run lint:fix`: Lint (and optionally fix) across workspaces.
- `bun run format` / `bun run format:fix`: Check/format with Prettier.
- `bun run typecheck`: TypeScript checks across packages.

## Coding Style & Naming Conventions
- Language: TypeScript first. Prettier enforces 2‑space indent, sorted imports, and Tailwind class ordering via `@saasfly/prettier-config`.
- Linting: `@saasfly/eslint-config` with TypeScript, React, and Next.js rules.
- Naming: `PascalCase` for React components, `camelCase` for functions/vars, `kebab-case` for non-component files and directories.

## Testing Guidelines
- Current status: No project-wide test runner configured. Use strict type checks and ESLint during development.
- If adding tests: colocate as `*.test.ts(x)` next to sources or under `__tests__/`. Prefer lightweight unit tests for packages and component tests for `packages/ui`.

## Commit & Pull Request Guidelines
- Commits: Prefer Conventional Commits (e.g., `feat:`, `fix:`, `docs:`). Keep messages imperative and scoped when helpful.
- PRs: Include a clear description, linked issues, and screenshots/GIFs for UI changes. Ensure `bun run lint`, `bun run typecheck`, and `bun run build` succeed. Update docs when behavior changes.

## Security & Configuration Tips
- Env: Copy `.env.example` to `.env.local`. Secrets must not be committed.
- Running with env: Many scripts support `with-env` to load `.env.local` (see package scripts).
- Database: Set `POSTGRES_URL` before `bun db:push`.
- Providers: Keep Stripe and Clerk keys in `.env.local`. Review `vercel.json` for deploy behavior.
