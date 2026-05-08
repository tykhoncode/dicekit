# Quickstart — WHFB 8th Edition Dice Calculator UI

**Feature**: 001-whfb-dice-calculator
**Date**: 2026-05-06
**Branch**: `001-whfb-dice-calculator`

This is the local dev guide for working on this feature. It covers environment setup,
the loops you'll run while implementing, and how to verify each piece before merge.

## 1. One-time setup

You should already be on the feature branch (created by `/speckit-specify`):

```text
git status     # Should show branch: 001-whfb-dice-calculator
```

Install dependencies if you haven't already:

```text
npm install
```

Verify the existing baseline works:

```text
npm run dev          # http://localhost:5173 — should serve the home page
npm run typecheck    # Should pass
npm run lint         # Should pass
npx vitest run       # Existing button.stories.tsx + any other stories should pass
npx playwright test  # Smoke test in tests/smoke.spec.ts should pass (start `npm run dev` separately first, or run preview)
```

If any of those fail, fix them before adding new code — the feature is built on
top of a clean baseline.

## 2. Add the shadcn primitives this feature needs

From the repo root, in any order:

```text
npx shadcn@latest add card
npx shadcn@latest add select
npx shadcn@latest add switch
npx shadcn@latest add separator
npx shadcn@latest add tooltip
npx shadcn@latest add badge
```

Each command writes a single file into `src/shared/ui/`. **Convert `export default
…` to a named export on first edit** (Constitution Principle III — `CLAUDE.md`
under "Module exports").

Add a co-located `*.stories.tsx` for each new primitive with at least a `Default`
story. Run `npx vitest` to verify the new stories pass.

## 3. Implementation order (matches Phase 1 layering)

1. **Domain layer — `entities/dice/`** (no UI dependency, fastest to test):
   1. Add `lib/charts.ts` with `TO_HIT_CHART` + `TO_WOUND_CHART` const arrays per
      `research.md` §1.1 / §1.2.
   2. Add `model/types.ts` with the types from `data-model.md` §1.
   3. Add `model/modifiers.ts` with `MODIFIER_CONFIGS` per `data-model.md` §2.3.
   4. Add `model/defaults.ts` with `INITIAL_DEFAULTS` and `createInitialState()`.
   5. Add `lib/compute.ts` (`applyModifiers`, `getEffectiveStrength`,
      `computeToHitTarget`, `computeToWoundTarget`, `computeArmourSaveTarget`,
      `computeWardSaveTarget`, `clampAndFormat`, `chanceFromTarget`,
      `unsavedWoundProbability`, `computeFullState`).
   6. Add `lib/format.ts` (`formatTarget`, `formatProbability`, `formatOutcome`).
   7. Add `lib/compute.spec.ts` and `lib/format.spec.ts` covering boundary cases.
      Run `npx vitest run src/entities/dice/lib/` and confirm the suite is green
      before moving on.

2. **Shared UI primitives — `shared/ui/`**:
   1. Add the six shadcn primitives (step 2 above) and convert exports.
   2. Add `number-stepper.tsx`, `save-select.tsx`, `modifier-toggle-row.tsx`,
      `result-badge.tsx`, each with stories. These compose shadcn primitives only;
      no domain knowledge.

3. **Feature layer — `features/dice-calculator/`**:
   1. Add `model/useDiceCalculator.ts` — single `useState<FullState>` plus action
      callbacks per `data-model.md` §5.
   2. Add `ui/AppShell.tsx`, `ui/TopBar.tsx` (stories for each).
   3. Add `ui/CalculatorCard.tsx` (slotted card shell, stories with mocked slots).
   4. Add `ui/ToHitCard.tsx`, `ui/ToWoundCard.tsx`, `ui/ArmourSaveCard.tsx`,
      `ui/WardSaveCard.tsx` (stories for each at default + edge-case args).
   5. Add `ui/CalculatorGrid.tsx` (4-column responsive grid wrapper) and
      `ui/SummaryPanel.tsx` (with stories).

4. **Page layer — `pages/calculator/`**:
   1. Add `ui/CalculatorPage.tsx` composing
      `<AppShell><TopBar/><CalculatorGrid/><SummaryPanel/></AppShell>`.
   2. Add `CalculatorPage.stories.tsx`.
   3. Wire the route in `src/app/router/AppRouter.tsx` (replace the home route
      contents OR add `/calculator`; pick whichever the existing router supports
      cleanly — the spec doesn't mandate which).

5. **e2e smoke — `tests/`**:
   1. Add `tests/calculator.spec.ts` per `research.md` §5.3.

## 4. Default-state sanity check

After step 3 above, with all the wiring in place, the page at default state MUST
show:

| Card        | Required roll | Probability text        |
| ----------- | ------------- | ----------------------- |
| To Hit      | `4+`          | `50.0% chance to hit`   |
| To Wound    | `3+`          | `66.7% chance to wound` |
| Armour Save | `5+`          | `33.3% chance to save`  |
| Ward Save   | `5+`          | `33.3% chance to save`  |

Summary panel:

```text
Combat Sequence:    4+ To Hit  →  3+ To Wound  →  5+ Armour Save  →  5+ Ward Save
Estimated Outcome:  14.8% Chance of unsaved wound
                    0.148 Expected unsaved wounds
```

Default inputs: `Attacker WS = 4`, `Defender WS = 4`, `Strength = 4`,
`Toughness = 3`, `Base Armour Save = 4+`, `Base Ward Save = 5+`. The Strength → AS
penalty (FR-018a) is what turns the base 4+ AS into a displayed 5+ AS.

If any of these don't match, the bug is in the chart lookup, the modifier
application, or the cross-card Strength → AS wiring — re-check
`entities/dice/lib/compute.spec.ts` first.

## 5. Day-to-day commands

| Command                                   | What it does                                               |
| ----------------------------------------- | ---------------------------------------------------------- |
| `npm run dev`                             | Vite dev server on `:5173`                                 |
| `npm run typecheck`                       | `tsc -b` against `tsconfig.app.json`                       |
| `npm run lint`                            | ESLint over `.`                                            |
| `npm run storybook`                       | Storybook on `:6006`                                       |
| `npx vitest`                              | All `*.stories.tsx` + `*.spec.ts(x)` files in browser mode |
| `npx vitest run path/to/file.stories.tsx` | Single-file run                                            |
| `npx playwright test`                     | e2e (start `npm run dev` separately first locally)         |
| `npx shadcn@latest add <component>`       | Pull a new shadcn primitive into `shared/ui/`              |

## 6. Pre-merge gate (matches CI)

```text
npm run lint && \
npm run format:check && \
npm run typecheck && \
npm run build && \
npx vitest run && \
npx playwright test
```

All six steps MUST pass green. The `PostToolUse` hook auto-runs Prettier +
`eslint --fix` after every file write, so formatting issues should be rare; if
`format:check` fails, run `npm run format` and commit.

## 7. Visual fidelity check (Constitution Principle I + SC-007)

Before declaring the feature done:

1. Open the dev server, dark theme.
2. Walk through the spec's FR-001..FR-005 region list and verify structural
   presence + ordering:
   - Top bar: brand mark + DiceKit/subtitle on left; Load Preset / Share /
     Reset All / Settings cluster on right.
   - Four cards in one row, in the order To Hit → To Wound → Armour Save → Ward
     Save.
   - Each card has the four regions (header / inputs / modifiers / result).
   - Summary panel below with Combat Sequence on the left and Estimated Outcome
     on the right.
3. Verify default text matches §4 above.
4. Toggle a few modifiers; confirm the green active accent (FR-009) and gold/
   orange result accent (FR-010).

Visual polish (corner radius, glow, exact spacing) is iterated in-app rather
than against an external reference.

## 8. When you finish

```text
git status                           # confirm only feature files changed
git add <files>
git commit                           # use the conventional-commits skill if needed
```

Then either run `/speckit-tasks` (if you want the formal task breakdown) or open
a PR directly using `/speckit-git-commit` and `gh pr create`.

## 9. Where to look when something's wrong

| Symptom                                            | First place to look                                                            |
| -------------------------------------------------- | ------------------------------------------------------------------------------ |
| Wrong default percentages                          | `entities/dice/lib/compute.ts` and the chart constants                         |
| Strength change on To Wound doesn't affect AS card | `useDiceCalculator()` — confirm S→AS derivation runs                           |
| Modifier toggle doesn't move the dice target       | `applyModifiers()` sign convention; `MODIFIER_CONFIGS` `effect.value` sign     |
| "—" / "No save" never appears                      | `clampAndFormat()` boundary handling (FR-T05)                                  |
| Stories pass locally, fail in CI                   | Storybook a11y addon — check `axe` violations in the failing story output      |
| Layout drifts at narrower widths                   | `CalculatorGrid` Tailwind responsive classes (FR-004 allows graceful collapse) |
| Reset All leaves a card unchanged                  | `createInitialState()` factory must produce a fresh object every call          |

## 10. Reference

- Canonical WHFB 8th Edition rules: <https://8th.whfb.app/>
  (saved to user memory as `reference_whfb_rules.md`).
- Constitution: `.specify/memory/constitution.md` — Principles I–V are the gating
  policy.
- CLAUDE.md (repo root): the strict-TS, named-export, `cn()`, and `@/`-alias rules
  this feature must follow.
