<!--
SYNC IMPACT REPORT
==================
Version change: 1.0.0 → 2.0.0
Bump rationale: MAJOR. Principle V is redefined to remove temporal scope statements
and the (now-obsolete) "calculation helpers MUST be placeholders" mandate. The
remaining durable rules of the original Principle V (local-first state, no
preemptive backend, YAGNI) are preserved and consolidated under a more accurate
title. A constitution should contain durable principles, not snapshots of the
current feature scope; this revision applies that rule to itself.

Modified principles:
  - V. Thin UI, Deferred Domain Logic → V. YAGNI / No Preemptive Abstraction
    Removed: "current scope ships static UI", "Domain logic ... is intentionally
    deferred", "Calculation helpers ARE placeholders MUST be marked with TODO".
    Kept and refined: local-first state, no backend without amendment, YAGNI on
    abstractions.

Other principles (I, II, III, IV): unchanged.
Sections (Tech Stack, Workflow, Governance): unchanged.

Templates requiring updates: none (all generic).
Other artifacts to reconcile:
  - specs/001-whfb-dice-calculator/plan.md  — Complexity Tracking row referencing
                                                Principle V's "placeholder" wording
                                                is now stale; the plan no longer
                                                deviates from the principle. Will
                                                need a follow-up edit if the plan
                                                is regenerated; current text is
                                                left as-is to preserve audit history.
  - specs/001-whfb-dice-calculator/spec.md  — FR-032 still narrates the broader
                                                rules-engine umbrella as deferred;
                                                that's a spec-scope statement
                                                (correct location), not a
                                                constitution-scope statement.

Follow-up TODOs: none.
-->

# DiceKit Constitution

## Core Principles

### I. Visual Fidelity & Reference-Driven UI

DiceKit is a UI-first product. The spec's region / ordering / grouping
requirements are the source of truth for layout. Implementation MUST
match the spec's stated UI structure and aesthetic intent
(premium dark SaaS / tactical analytics — NOT fantasy parchment, skulls, or
HUD ornaments). Pixel-perfect parity is NOT required where shadcn primitives
or Inter (the bundled variable font) diverge from the reference; structural
parity IS required. New visual flourishes that are not in the reference
require explicit user approval.

**Rationale**: The product's value at this stage is the experience, not the
rules engine. Drift away from the reference erodes the only deliverable that
currently exists.

### II. shadcn-First Component Reuse

UI is composed from shadcn/ui primitives (`Button`, `Card`, `Select`,
`Switch`, `Separator`, `Tooltip`, `Badge`, …) wrapped or styled with Tailwind
via `cn()`. Custom primitives are only built when no shadcn equivalent fits.
Repeated JSX MUST be extracted into a reusable component (e.g.
`CalculatorCard`, `NumberStepper`, `SaveSelect`, `ModifierToggle`,
`ResultBadge`, `SummaryPanel`). Card-/list-shaped UI MUST be data-driven —
configuration arrays feed a single rendering component, never copy-pasted
JSX blocks.

**shadcn flat-file layout is mandatory**: `src/shared/ui/<component>.tsx`,
one file per primitive, co-exporting `Component` + `componentVariants`.
Generated files MUST NOT be reshaped into folders; that breaks `shadcn add`
and is irreversible without manual reconciliation. Radix compound primitives
(`Dialog.Root` + `.Trigger` + `.Content`, `Popover`, `DropdownMenu`, …)
MUST stay inside one slice or be wrapped as a single composed primitive —
never split `Trigger` and `Content` across slices, since they share React
Context.

**Rationale**: shadcn's zero-touch upgrade path and Radix's Context-based
composition only survive if the conventions stay intact. Duplication is the
fastest way to make future visual changes 4× more expensive.

### III. Strict-TypeScript & Project Conventions (NON-NEGOTIABLE)

The following rules are enforced and MUST NOT be relaxed without an
amendment:

- **Strict TS**: full `strict`, `noUncheckedIndexedAccess` (guard before
  use), `noImplicitOverride`, `verbatimModuleSyntax` (`import type` for
  type-only), `erasableSyntaxOnly` (no enums or namespaces — use unions /
  const objects), `noUnusedLocals` / `noUnusedParameters`. Target ES2023,
  JSX `react-jsx` (no `import React`).
- **Path aliases**: use `@/` for all `src` imports. Relative `../` paths
  across feature boundaries are forbidden.
- **Class composition**: import `cn` from `@/shared/lib/classnames`. Static
  Tailwind classes inline as a single string; conditional classes via
  `cn(...)`. `clsx` / `tailwind-merge` direct imports and
  `[…].join(' ')` are forbidden.
- **Named exports only**: never `export default` (except Storybook CSF
  `export default meta`, which is framework-mandated). Inline exports
  (`export function`, `export const`); barrel files re-export directly
  (`export { Foo } from "./Foo"`), never `export { default as Foo }`.
- **Redux access**: typed `useAppDispatch` / `useAppSelector` from
  `@/app/store` only — never the bare `react-redux` hooks.
- **No code comments** unless explicitly requested, except JSDoc on
  exported public APIs.

A `PostToolUse` hook auto-runs Prettier + `eslint --fix` after every file
write. Surfaced ESLint errors MUST be addressed, not suppressed.

**Rationale**: These conventions are why HMR, type-narrowing, rename
refactors, and shadcn upgrades work at all. Each one was chosen to prevent
a class of bug, not as style preference.

### IV. Story-Driven Verification

Component verification runs through Storybook stories executed in a real
headless Chromium via `@vitest/browser-playwright` (`npx vitest`). Stories
serve as living documentation, visual regression surface, and the primary
test target. Playwright (`tests/`) covers end-to-end smoke flows only.

Stories SHOULD exist for each reusable shared/ui primitive and each
composed feature card before that component is wired into production
screens. Story coverage is prioritized over unit-test coverage; pure
helpers (e.g. dice probability utilities) MAY have inline Vitest unit
tests when behavior is non-trivial.

**Rationale**: For a UI-first product, "does it render and behave correctly
in a real browser" is the only test that matches user value. Storybook
gives that for free and doubles as the design system surface.

### V. YAGNI / No Preemptive Abstraction

Build only what the current task requires. Don't introduce abstractions,
state managers, or infrastructure for hypothetical future needs.

- **State**: stay with local React state until a feature genuinely
  needs cross-component sharing. RTK / RTK Query reducers MAY be added
  when that need is real, not preemptively. Use the typed
  `useAppDispatch` / `useAppSelector` from `@/app/store` when the store
  is the right call (Principle III).
- **Backend / persistence**: this codebase ships as a static SPA with
  no backend. Adding network calls or persisted user data (beyond
  `localStorage` for theme) requires an amendment to this principle.
- **Abstraction threshold**: three similar lines is better than a
  premature abstraction. Refactor toward a shared component when a
  third caller appears, not before.
- **Feature flags / backwards-compat shims**: do not add toggles or
  shims for hypothetical migrations. Change the code in place when the
  change is real.

**Rationale**: Preemptive abstractions encode assumptions that future
code has to fight. Iteration is cheaper than retrofit. Every added
abstraction has a carrying cost; default to local-first and inline
until evidence forces otherwise.

## Technology Stack & Constraints

- **Runtime**: React 19 + TypeScript 6 + Vite 8 SPA. No SSR, no backend.
- **Styling**: Tailwind CSS 4 (Vite plugin). Dark mode is the primary
  visual target; theme provider supports light/system but reference work
  targets dark.
- **UI primitives**: shadcn/ui (flat layout in `src/shared/ui/`), Radix
  UI compound primitives, `lucide-react` for icons, `framer-motion` for
  motion when needed.
- **State**: Redux Toolkit + RTK Query base API are wired in
  `src/app/store/store.ts`. Feature slices register there. Local
  component state remains the default; reach for the store only on
  genuine cross-cutting need.
- **Routing**: React Router 7.
- **Validation**: Zod for env (`src/shared/config/env.ts`) and any
  user-input schemas.
- **Test surface**: Storybook 10 + Vitest 4 (browser mode via Playwright)
  - a11y addon; Playwright for e2e in `tests/`. Locally Playwright does
    NOT auto-start a server (run `npm run dev` or `npm run preview`
    separately); CI auto-starts `vite preview` on port 5173.
- **Lint/format**: ESLint + Prettier, auto-applied on file write via the
  `PostToolUse` hook. `react-refresh/only-export-components` is disabled
  for `src/shared/ui/**` to support shadcn co-exports.
- **Env vars**: schema-validated in `src/shared/config/env.ts`.
  Build-time flags (`DEV` / `PROD` / `MODE`) read directly from
  `import.meta.env` for DCE — never added to the schema.
- **Scratch space**: `.artifacts/<ComponentName>/<stage>/` (stages:
  `draft/`, `research/`, `support/`, `visual/`, `audit/`). Never under
  `src/`. Only `src/` is the deliverable.

## Development Workflow & Quality Gates

- **Standard scripts** in `package.json`: `dev`, `build`, `typecheck`,
  `lint`, `format`, `storybook`, `build-storybook`. Use them; do not
  invent ad-hoc invocations.
- **Tests**: `npx vitest` runs `*.stories.*` files as browser tests;
  `npx playwright test` runs e2e. Single-file vitest:
  `npx vitest run path/to/file.stories.tsx`.
- **CI gate** (`.github/workflows/ci.yml`): lint + format check +
  typecheck + build + vitest (storybook) + playwright (chromium smoke).
  All gates MUST pass before merge.
- **shadcn additions**: `shadcn add <component>` writes flat files into
  `src/shared/ui/`; convert any default exports to named on first edit
  per Principle III. Do not preserve generator default exports.
- **Reference workflow**: when implementing a screen against a reference
  image, structure parity is a checklist item before visual polish:
  regions present, hierarchy correct, controls in the right groupings,
  THEN tune density, color, and motion.
- **Constitution Check** (in `/speckit-plan`): every plan re-validates
  against these principles. Violations require an entry in the plan's
  Complexity Tracking table justifying why a simpler compliant
  alternative was rejected.

## Governance

- **Authority**: This constitution supersedes ad-hoc style choices and
  conflicting prior conventions. `CLAUDE.md` is the runtime
  developer-guidance file; where it states rules narrower or stricter
  than this constitution, `CLAUDE.md` wins for day-to-day mechanics
  while this document remains the policy of record.
- **Amendments**: Any change to a principle or a constraint requires
  (a) a brief rationale, (b) a Sync Impact Report comment block at the
  top of this file, (c) a SemVer version bump, and (d) propagation
  review across `.specify/templates/*` and any agent guidance files.
- **Versioning policy** (SemVer for governance):
  - **MAJOR**: a principle is removed, redefined incompatibly, or
    governance authority is restructured.
  - **MINOR**: a new principle / section is added, or guidance is
    materially expanded.
  - **PATCH**: clarifications, wording fixes, non-semantic refinements.
- **Compliance review**: Pull requests touching `src/` MUST verify the
  changed code does not violate Principles I–V; reviewers cite the
  principle number when requesting changes. Complexity beyond what a
  principle permits MUST be justified in the plan's Complexity Tracking
  table.
- **Runtime guidance**: For day-to-day Claude Code / IDE behavior, see
  `CLAUDE.md` at the repo root.

**Version**: 2.0.0 | **Ratified**: 2026-05-05 | **Last Amended**: 2026-05-06
