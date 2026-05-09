# Implementation Plan: WHFB 8th Edition Dice Calculator UI

**Branch**: `001-whfb-dice-calculator` | **Date**: 2026-05-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-whfb-dice-calculator/spec.md`

## Summary

Build the DiceKit page: a frozen-layout, dark-themed, full-screen desktop SPA that
shows four side-by-side calculator cards (To Hit, To Wound, Armour Save, Ward Save),
plus a full-width Combat Sequence / Estimated Outcome summary panel. The four cards
are driven by real WHFB 8th Edition dice math (chart lookups + sign convention +
Strength-driven AS penalty + boundary handling), encoded directly in the codebase per
FR-T01..FR-T05. UI is composed from shadcn/ui primitives with one config-array per
card; state is local React state held in a single feature hook (no Redux slice). Story
coverage is the primary verification surface (Vitest browser mode via the existing
`@vitest/browser-playwright` setup). Rules that don't fit the four-card layout (e.g.,
shooting BS chart, magic items, special unit abilities) are explicitly deferred to
[`future-rules-backlog.md`](./future-rules-backlog.md).

## Technical Context

**Language/Version**: TypeScript 6 (strict, `noUncheckedIndexedAccess`,
`verbatimModuleSyntax`, `erasableSyntaxOnly`, target ES2023)
**Primary Dependencies**: React 19, Vite 8, Tailwind CSS 4 (Vite plugin), shadcn/ui
(flat-file layout in `src/shared/ui/`), Radix UI primitives, `lucide-react` icons,
`framer-motion` (only if needed; not currently planned), `class-variance-authority`,
`clsx` + `tailwind-merge` (consumed via `cn` from `@/shared/lib/classnames`)
**Storage**: N/A. All page state is in-memory React state for v1 (FR-031). No
`localStorage` beyond the existing `ThemeProvider`.
**Testing**: Storybook 10 stories run as browser tests via `@vitest/browser-playwright`
(`npx vitest`). Optional Vitest unit tests for pure rules helpers
(`src/entities/dice/lib/*.spec.ts`). Playwright smoke `tests/calculator.spec.ts`
for the rendered page (no auto-server locally; CI auto-starts `vite preview` on
port 5173).
**Target Platform**: Modern desktop browsers (Chrome / Edge / Firefox / Safari latest).
1280-px-wide viewport is the design target (SC-002).
**Project Type**: Single-project React SPA, no backend.
**Performance Goals**: Card and summary updates render within one user-perceivable
frame on input change (SC-003). No animation budgets in v1.
**Constraints**:

- Frozen four-card layout (FR-037) — no fifth card, no card splits, no summary
  restructure in v1 or subsequent patches.
- Strict TypeScript flags MUST stay enabled (Constitution Principle III).
- Named exports only; `cn()` from `@/shared/lib/classnames`; `@/` import alias only
  (CLAUDE.md mandatory rules).
- shadcn flat-file layout in `src/shared/ui/` MUST NOT be reshaped (Principle II).
- No code comments unless asked; JSDoc on exported public API only.

**Scale/Scope**: ~30 components total (4 cards × ~3 sub-components + 1 page +
1 top bar + 1 summary panel + ~6 shadcn primitives + ~5 feature primitives). Single
WHFB v8 ruleset encoded in ~200 LOC of pure functions and constants. ~1500 LOC
total across all `.tsx` and `.ts` files.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| #   | Principle                                                | Status  | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| --- | -------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I   | Visual Fidelity & Reference-Driven UI                    | ✅ Pass | SC-007 anchors structural parity (regions, ordering, grouping) on FR-001..FR-005. Pixel-perfect parity is not required — Inter is the bundled font (FR Assumptions).                                                                                                                                                                                                                                                                                                                                                                                                                           |
| II  | shadcn-First Component Reuse                             | ✅ Pass | `Button` already exists. Plan adds shadcn `card`, `select`, `switch`, `separator`, `tooltip`, `badge` via `npx shadcn add` to `src/shared/ui/` (flat layout). Card/modifier rows are config-array driven; one `<CalculatorCard>` and one `<ModifierToggleRow>` render every card and every row.                                                                                                                                                                                                                                                                                                |
| III | Strict-TypeScript & Project Conventions (NON-NEGOTIABLE) | ✅ Pass | All new code uses named exports, `@/` aliases, `cn()`. Strict flags inherited from `tsconfig.app.json`. WHFB chart types use literal union types (no enums per `erasableSyntaxOnly`).                                                                                                                                                                                                                                                                                                                                                                                                          |
| IV  | Story-Driven Verification                                | ✅ Pass | Each shadcn primitive added gets a `.stories.tsx`. Each feature primitive (`NumberStepper`, `ModifierToggleRow`, `ResultBadge`, `SaveSelect`, `CalculatorCard`, `SummaryPanel`, `TopBar`, `AppShell`) gets a story. Composed cards (`ToHitCard`, etc.) get stories with default + edge-case args. The full `CalculatorPage` gets a story. Pure rules helpers (`computeRequiredRoll`, `chanceFromTarget`, `unsavedWoundProbability`, etc.) get inline Vitest unit tests.                                                                                                                        |
| V   | YAGNI / No Preemptive Abstraction                        | ✅ Pass | State stays local React state inside a single `useDiceCalculator()` hook — no RTK / RTK Query slice (none needed yet). No backend, no persistence beyond the existing `ThemeProvider`'s `localStorage`. Components are extracted only at the second or third caller (CalculatorCard, ModifierToggleRow, NumberStepper, etc.); shadcn primitives are pulled in only as needed. The four-step WHFB math is the real, scoped requirement — not a preemptive abstraction. Anything broader (army books, magic items, shooting BS chart, etc.) is deferred via FR-038 to `future-rules-backlog.md`. |

**Gate result**: PASS — no deviations from constitution v2.0.0.
Phase 0 may proceed.

## Project Structure

### Documentation (this feature)

```text
specs/001-whfb-dice-calculator/
├── spec.md                    # /speckit-specify output
├── plan.md                    # /speckit-plan output (this file)
├── research.md                # /speckit-plan Phase 0 output
├── data-model.md              # /speckit-plan Phase 1 output
├── quickstart.md              # /speckit-plan Phase 1 output
├── future-rules-backlog.md    # FR-038 backlog
├── checklists/
│   └── requirements.md        # /speckit-specify quality checklist
└── tasks.md                   # /speckit-tasks output (not created by /speckit-plan)
```

No `contracts/` directory: this is a frontend SPA with no external API or CLI
contracts. Component prop interfaces are documented in `data-model.md` and via
TypeScript types in source.

### Source Code (repository root)

```text
src/
├── app/
│   ├── App.tsx                              # existing — wires ThemeProvider, ErrorBoundary, Router
│   ├── main.tsx                             # existing
│   ├── router/                              # existing — adds /calculator route (or replaces home)
│   └── store/                               # existing — RTK store, NO new slice for this feature
├── pages/
│   ├── home/                                # existing
│   ├── not-found/                           # existing
│   └── calculator/                          # NEW
│       ├── index.ts
│       └── ui/
│           ├── CalculatorPage.tsx           # composes <AppShell><TopBar/><CalculatorGrid/><SummaryPanel/></AppShell>
│           └── CalculatorPage.stories.tsx
├── entities/                                # NEW top-level slice for domain models
│   └── dice/
│       ├── index.ts
│       ├── model/
│       │   ├── types.ts                      # ModifierConfig, CardKind, CardState, FullState, Outcome
│       │   ├── defaults.ts                   # default WS/S/T/AS/Ward + factory createInitialState()
│       │   └── modifiers.ts                  # MODIFIER_CONFIGS — config arrays per card (FR-012/015/018/021)
│       └── lib/
│           ├── charts.ts                     # lookupToHit / lookupToWound formula functions
│           ├── compute.ts                    # computeRequiredRoll, computeProbabilities, unsavedWoundProb
│           ├── compute.spec.ts               # Vitest unit tests for the pure helpers
│           ├── format.ts                     # formatTarget, formatProbability, formatOutcome
│           └── format.spec.ts                # Vitest unit tests for boundary formatting (FR-T05)
├── features/                                # NEW
│   └── dice-calculator/
│       ├── index.ts
│       ├── model/
│       │   └── useDiceCalculator.ts         # custom hook — single source of truth for all 4 cards' state
│       └── ui/
│           ├── AppShell.tsx
│           ├── AppShell.stories.tsx
│           ├── TopBar.tsx
│           ├── TopBar.stories.tsx
│           ├── CalculatorGrid.tsx           # 4-column grid wrapper
│           ├── CalculatorCard.tsx           # generic card shell (header / inputs slot / modifiers slot / result slot)
│           ├── CalculatorCard.stories.tsx
│           ├── ToHitCard.tsx                # composed: <CalculatorCard> + 2 NumberSteppers + ModifierToggleList + ResultBadge
│           ├── ToHitCard.stories.tsx
│           ├── ToWoundCard.tsx
│           ├── ToWoundCard.stories.tsx
│           ├── ArmourSaveCard.tsx
│           ├── ArmourSaveCard.stories.tsx
│           ├── WardSaveCard.tsx
│           ├── WardSaveCard.stories.tsx
│           ├── SummaryPanel.tsx
│           └── SummaryPanel.stories.tsx
├── shared/
│   ├── api/                                 # existing — untouched
│   ├── config/                              # existing — untouched
│   ├── lib/
│   │   ├── classnames/                      # existing
│   │   └── theme/                           # existing
│   └── ui/                                  # existing — adds shadcn primitives + small feature-agnostic widgets
│       ├── button.tsx                       # existing
│       ├── button.stories.tsx               # existing
│       ├── card.tsx                         # NEW — shadcn add
│       ├── card.stories.tsx                 # NEW
│       ├── select.tsx                       # NEW — shadcn add
│       ├── select.stories.tsx               # NEW
│       ├── switch.tsx                       # NEW — shadcn add
│       ├── switch.stories.tsx               # NEW
│       ├── separator.tsx                    # NEW — shadcn add
│       ├── separator.stories.tsx            # NEW
│       ├── tooltip.tsx                      # NEW — shadcn add
│       ├── tooltip.stories.tsx              # NEW
│       ├── badge.tsx                        # NEW — shadcn add
│       ├── badge.stories.tsx                # NEW
│       ├── number-stepper.tsx               # NEW — composed (Button + value display)
│       ├── number-stepper.stories.tsx       # NEW
│       ├── save-select.tsx                  # NEW — composed (Select with 2+..6+ options + "—" item)
│       ├── save-select.stories.tsx          # NEW
│       ├── modifier-toggle-row.tsx          # NEW — Switch + label + numeric badge
│       ├── modifier-toggle-row.stories.tsx  # NEW
│       ├── result-badge.tsx                 # NEW — REQUIRED ROLL + large target + probability text
│       ├── result-badge.stories.tsx         # NEW
│       └── error-boundary.tsx               # existing
└── vite-env.d.ts                            # existing

tests/
├── smoke.spec.ts                            # existing
└── calculator.spec.ts                       # NEW — Playwright smoke for the calculator page (renders, default values present, reset all)
```

**Structure Decision**: Single React SPA project, FSD-style layered organisation
(`app` → `pages` → `features` → `entities` → `shared`). The existing repo already
uses `app` / `pages` / `shared` (no `entities` or `features` yet); this feature
introduces both. Imports always flow downward across layers (a `feature` may import
`entities`/`shared`, never the reverse). The four-card layout is encoded as one
shared `<CalculatorCard>` shell plus four concrete `<XCard>` compositions, with
modifier lists driven by `MODIFIER_CONFIGS` arrays in `entities/dice/model/modifiers.ts`.
The calculator's whole state lives in a single `useDiceCalculator()` custom hook in
`features/dice-calculator/model/`; the hook owns the cross-card Strength→AS link
(FR-018a) so cards stay independent of each other.

## Complexity Tracking

_No constitution deviations under v2.0.0._ The earlier draft of this plan tracked
encoding-real-WHFB-math as a "bounded deviation" against the previous Principle V
("calculation helpers ARE placeholders"). Constitution v2.0.0 redefined Principle V
as "YAGNI / No Preemptive Abstraction" — under that wording, encoding the four
core WHFB charts is exactly what's required by the user, not a preemptive
abstraction. Broader rules-engine territory (army books, magic items, special unit
abilities, shooting BS chart) remains deferred via FR-038 to
`future-rules-backlog.md`, but that's spec-scope, not a constitution deviation.
