# CLAUDE.md

Guidance for Claude Code working in this repository.

## Git policy (NON-NEGOTIABLE)

- **Never run `git commit`, `git push`, `git merge`, `git rebase`, `git tag`, `git reset --hard`, or any other history-mutating / remote-publishing git command.** No matter how clearly the work seems to be at a "natural commit point", the agent does not commit. This applies even when the user has previously authorized a commit — authorization is single-use, not standing.
- **Never bypass the rule via the `commit-commands:*` skills, the `speckit-git-commit` hook, gh CLI (`gh pr create`, `gh pr merge`), or any wrapper that ultimately produces a commit / push.** If a slash-command pre/post hook offers an automatic commit (e.g. `after_constitution`, `after_implement`), display the suggested message and tell the user how to run it themselves — do not invoke it.
- **Read-only git is fine**: `git status`, `git diff`, `git log`, `git show`, `git branch --list`, `git stash list` etc. are encouraged for context.
- **Staging is fine** (`git add`, `git restore --staged`) when the user wants help organizing a commit they will create themselves.
- **Output a suggested commit message instead.** When the work reaches a point that the user might want to commit, surface the suggestion in the chat (conventional-commits + gitmoji style if the project uses it — see `git log` for the established pattern). The user runs `git commit` themselves.

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

<!-- SPECKIT START -->

Active feature: **001-whfb-dice-calculator** (WHFB 8th Edition Dice Calculator UI).

Read the current plan and supporting artifacts before changing related code:

- Plan: `specs/001-whfb-dice-calculator/plan.md`
- Spec: `specs/001-whfb-dice-calculator/spec.md`
- Research: `specs/001-whfb-dice-calculator/research.md`
- Data model: `specs/001-whfb-dice-calculator/data-model.md`
- Quickstart: `specs/001-whfb-dice-calculator/quickstart.md`
- Backlog of layout-overflowing rules: `specs/001-whfb-dice-calculator/future-rules-backlog.md`

The plan freezes the four-card layout (FR-037) and routes any WHFB rule that
doesn't fit through the backlog (FR-038). v1 ships the real WHFB 8th Edition
dice math for the four core steps; broader rules-engine work (army books, magic
items, special abilities) stays deferred.

<!-- SPECKIT END -->
