# CLAUDE.md

Guidance for Claude Code working in this repository.

## Commands

- Standard `npm run` scripts (`dev`, `build`, `typecheck`, `lint`, `format`, `storybook`, …) are in `package.json`;
- `npx vitest` — runs `*.stories.*` files as tests in a real headless Chromium via `@vitest/browser-playwright` (configured in `vite.config.ts`). Single file: `npx vitest run path/to/file.stories.tsx`.
- `npx playwright test` — e2e tests in `tests/`. **Locally, no auto-managed `webServer`** — start `npm run dev` (or `npm run preview`) separately. **In CI** (`process.env.CI` set), `playwright.config.ts` auto-starts `vite preview` on port 5173 against the production build.

## Tooling

A `PostToolUse` hook on `Write|Edit|MultiEdit` auto-runs Prettier + `eslint --fix` after every file write and surfaces remaining ESLint errors back as `additionalContext`. Don't manually format; do address reported errors.

## Architecture

- **Redux store** ships with RTK Query's `baseApi` reducer + middleware wired (`src/app/store/store.ts`). Add feature slices there. Always use the typed `useAppDispatch` / `useAppSelector` from `@/app/store` — never the bare `react-redux` hooks.

## shadcn / radix conventions

- **`shared/ui/` uses shadcn's flat-file layout**, one `.tsx` per component (`shared/ui/button.tsx`). This keeps `shadcn add` zero-touch — never reshape generated files into folders.
- shadcn co-exports `Component` + `componentVariants` (CVA) from the same file. The `react-refresh/only-export-components` ESLint rule is disabled for `src/shared/ui/**` to allow this — leave the exports as shadcn writes them.
- Radix compound primitives (`Dialog.Root` + `.Trigger` + `.Content`, `Popover`, `DropdownMenu`, `Tabs`, `Accordion`, …) share React Context. Keep an entire compound tree inside one slice, or wrap it as a single composed primitive in `shared/ui` — never split `Trigger` and `Content` across slices.
- shadcn parts that bake in deps (`Form` → react-hook-form/zod, `DataTable` → tanstack-table, `Sidebar`/`Command` → internal context) still belong in `shared/ui` even though they pull libs into the bottom layer — that's the cost of zero-friction shadcn.

## Path aliases (mandatory)

Use `@/` for all `src` imports. Never use relative `../` paths.

## Class composition (mandatory)

- Import `cn` from `@/shared/lib/classnames` — never directly from `clsx` or `tailwind-merge`.
- Static Tailwind classes → inline as a single class string.
- Conditional/computed classes → `cn(...)`. Never `[…].join(' ')`.

## Module exports (mandatory)

- **Named exports only.** Never `export default` — not for components, hooks, utilities, types, or anything else.
- Define exports inline (`export function Foo() {}`, `export const bar = ...`). Don't write `function Foo() {}` then `export default Foo` or trailing `export { Foo }`.
- Barrel files (`index.ts`) re-export directly: `export { Foo } from "./Foo"`. Never `export { default as Foo }` — that pattern launders a default into a named export, defeating the rule.
- Exceptions:
  - Third-party scaffolds (shadcn, Vite generators) that emit default exports — convert them to named on first edit instead of preserving the default.
  - Storybook CSF (`*.stories.tsx`) — `export default meta` is framework-mandated; keep it. Individual story exports (`Default`, `Outline`, …) stay named.
- Why: rename refactors propagate, identifier and filename can't drift, `react-refresh` HMR is stricter on named exports, and `import Foo from "./bar"` lets the importer name it anything (anonymous-default ambiguity).

## `.artifacts/` folder convention

- Path: `.artifacts/<ComponentName>/<stage>/` (stages: `draft/`, `research/`, `support/`, `visual/`, `audit/`).
- Disposable scratch space for agent workflows; never put under `src/`.
- Only `src/` is the real deliverable.

## TypeScript gotchas

`tsconfig.app.json` enables full `strict`, `noUncheckedIndexedAccess` (indexed access yields `T | undefined` — guard before use), `noImplicitOverride` (class-component lifecycle methods need the `override` keyword — see `src/shared/ui/error-boundary.tsx`), `verbatimModuleSyntax` (use `import type` for type-only imports), `erasableSyntaxOnly` (no enums or namespaces — use unions/objects), and `noUnusedLocals` / `noUnusedParameters`. Target ES2023, JSX `react-jsx` (no `import React` needed).

## Env vars

Schema in src/shared/config/env.ts (TODO at top documents the add-a-key pattern).
Build-time flags (DEV/PROD/MODE) → import.meta.env.X directly for DCE; never in the schema.

## Code comments (mandatory)

- **Never add comments** unless explicitly requested by the user.
- Exception: JSDoc on exported functions when describing public API.
