# DiceKit

Opinionated React + Vite SPA.

## Stack

- **React 19** + **TypeScript 6** + **Vite 8**
- **Tailwind 4** + **shadcn** + **radix-ui** + **lucide-react** + **framer-motion**
- **Redux Toolkit** + **RTK Query** (axios baseQuery)
- **React Router 7**
- **zod** (env + schema validation)
- **Storybook 10** + **Vitest 4** (browser-mode via Playwright) + a11y addon
- **Playwright** for e2e + smoke
- **ESLint** + **Prettier** (auto-fix on file write)

## What's wired out of the box

- **ThemeProvider** — light/dark/system, persists to localStorage, listens to `prefers-color-scheme`. `useTheme()` hook in `@/shared/lib/theme`. A pre-hydration script in `index.html` applies the theme before React mounts to prevent FOUC.
- **ErrorBoundary** — outermost provider in `src/app/App.tsx`, themed fallback in `src/shared/ui/error-boundary.tsx`.
- **CI** — `.github/workflows/ci.yml` runs lint + format check + typecheck + build + vitest (storybook) + playwright (chromium smoke) on push/PR. Playwright auto-starts `vite preview` on port 5173 in CI
- **Smoke test** — `tests/smoke.spec.ts` verifies home, 404 fallback, and no console errors.

## Conventions

- Use `@/` for all `src` imports — never `../`.
- Use `cn()` from `@/shared/lib/classnames` for conditional Tailwind — never `clsx` directly or `[...].join(' ')`.
- Use typed `useAppDispatch` / `useAppSelector` from `@/app/store` — never the bare `react-redux` hooks.
- **Named exports only** — `export function Foo()`, never `export default Foo`. Barrel files re-export directly (`export { Foo } from "./Foo"`), never `export { default as Foo }`.
- See `CLAUDE.md` for the full set of rules (TypeScript flags, shadcn quirks).
