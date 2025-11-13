# Repository Guidelines

## 沟通与语言（必须）
- 问答、解释、注释、分析：一律使用中文（简体）。
- 代码命名与 API 标识保持英文（遵循下文命名规范）。
- 提交信息可中文为主，必要时在描述中补充英文关键词。
- 若遇到英文日志/报错，保留原文，并使用中文解释清楚。

## Project Structure & Module Organization
- apps/nextjs: Main Next.js app (App Router) and public assets.
- apps/auth-proxy: Lightweight auth proxy (Nitro/h3).
- packages/api, auth, common, stripe: Shared backend/business modules.
- packages/db: Prisma schema + Kysely types and DB utilities.
- packages/ui: Shared UI components and styles.
- tooling/*: Centralized ESLint, Prettier, Tailwind, and TS configs.
- Tests (when added): colocate as `*.test.ts(x)` or under `__tests__/`.

## Build, Test, and Development Commands
- `bun run dev:web`: Start the Next.js app locally on port 3000.
- `bun run dev`: Run all apps in parallel via Turborepo.
- `bun run build`: Build all workspaces (Turbo cache enabled).
- `bun db:push`: Apply Prisma schema to the database.
- `bun run lint` / `bun run lint:fix`: Lint (and optionally fix) across workspaces.
- `bun run format` / `bun run format:fix`: Check/format with Prettier.
- `bun run typecheck`: TypeScript checks across packages.
- Optional: `bun run tailwind-config-viewer` → http://localhost:3333

## Coding Style & Naming Conventions
- Language: TypeScript-first. 2‑space indent.
- Formatting: Prettier (`@saasfly/prettier-config`); sorted imports; Tailwind class ordering.
- Linting: `@saasfly/eslint-config` with TypeScript, React, Next.js rules.
- Naming: `PascalCase` for React components; `camelCase` for functions/vars; `kebab-case` for non-component files/dirs.

## Testing Guidelines
- No global runner yet. Prefer unit tests in packages and component tests in `packages/ui`.
- Name tests `*.test.ts(x)`; colocate near sources or under `__tests__/`.
- Run static checks: `bun run typecheck` and `bun run lint` before PRs.

## Commit & Pull Request Guidelines
- Commits: Use Conventional Commits (e.g., `feat:`, `fix:`, `docs:`). Keep messages imperative; scope when useful.
- PRs: Provide clear description, link issues, and add screenshots/GIFs for UI changes.
- CI gate: Ensure `bun run lint`, `bun run typecheck`, and `bun run build` pass locally.

## Security & Configuration Tips
- Env: `cp .env.example .env.local`; never commit secrets.
- Database: Set `POSTGRES_URL` before `bun db:push`.
- Providers: Keep Stripe and Clerk keys in `.env.local`. Many scripts support `with-env` to load `.env.local`.
- Optional features: Image→Prompt uses Coze; configure `COZE_*` vars if needed.
