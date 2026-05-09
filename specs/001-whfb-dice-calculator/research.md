# Phase 0 Research — WHFB 8th Edition Dice Calculator UI

**Feature**: 001-whfb-dice-calculator
**Date**: 2026-05-06

This document consolidates the decisions reached during `/speckit-clarify` plus the
implementation research done in `/speckit-plan` Phase 0. Each section follows
**Decision / Rationale / Alternatives**.

## 1. WHFB 8th Edition rules encoding

### 1.1 To Hit chart (close combat)

**Decision**: Encode the WHFB 8th Edition close-combat To Hit lookup as a four-
branch formula in `lookupToHit(attackerWS, defenderWS)` inside
`src/entities/dice/lib/charts.ts`, returning values typed as the literal union
`"3+" | "4+" | "5+"`.

```ts
if (attackerWS > defenderWS) return "3+";
if (attackerWS === defenderWS) return "4+";
if (defenderWS > 2 * attackerWS) return "5+";
return "4+";
```

**Rationale**: The formula reproduces every cell of the canonical 10×10 chart at
<https://8th.whfb.app/close-combat/roll-to-hit-close-combat> (verified by walking
all 100 cells). It's self-documenting (a reader who knows WHFB sees the rule
directly), shorter to maintain than a literal `as const` array, and the unit
tests in `compute.spec.ts` assert outputs against rulebook cells so any drift
would be caught immediately.

**Alternatives considered**:

- _Literal 10×10 `as const` array_: was the original approach. Reads "exactly like
  the rulebook", but adds ~20 lines of typed literal data that buy nothing the
  formula doesn't already give us. Refactored away once the formula was proven
  cell-for-cell faithful.
- _Object map keyed by `${a}x${d}`_: rejected for the same reason — extra
  overhead, no readability win.

### 1.2 To Wound chart (close combat)

**Decision**: Encode the WHFB 8th Edition To Wound lookup as a five-branch
formula in `lookupToWound(strength, toughness)`, keyed on the S − T differential.

```ts
const diff = strength - toughness;
if (diff >= 2) return "2+"; // S two or more higher than T
if (diff === 1) return "3+"; // S one higher
if (diff === 0) return "4+"; // equal
if (diff === -1) return "5+"; // T one higher
return "6+"; // T two or more higher
```

**Rationale**: Same as §1.1 — the formula matches every cell of the canonical
10×10 chart at <https://8th.whfb.app/close-combat/roll-to-wound-close-combat>
(verified). The "cannot wound" surface is intentionally absent within the
S 1..10 × T 1..10 range — the chart caps at 6+ — so no special-casing is needed
beyond the formula's `return "6+"` fallthrough. Unrollable wounds (target ≥ 7
after modifiers, e.g., -1 to wound on a 6+) are handled by `clampAndFormat`
per FR-T05.

**Alternatives considered**: same as §1.1.

### 1.3 Sign convention

**Decision**: A signed numeric modifier `m` adjusts a target by **subtracting** `m`
from the target. So `+1` lowers the required roll (easier), `-1` raises it (harder).
This matches WHFB convention: a `-1 To Hit` modifier means the player rolls one less,
needing one more on the dice.

**Rationale**: The user confirmed this with the example "2+ AS with a -1 modifier →
3+ AS" in `/speckit-clarify` Q2.

**Implementation**: a single helper `applyModifiers(baseTarget: number, mods:
Modifier[]): number` returns `baseTarget - sum(activeMods)`, then passes through
`clampTarget()` for boundary handling.

### 1.4 Strength → Armour Save penalty

**Decision**: `as_strength_penalty = -max(0, effective_strength - 3)`. Effective
Strength = `base_strength + sum(active Strength-source modifiers from FR-015)`.
This is the only cross-card link in v1 (FR-018a) and is computed in
`useDiceCalculator()` so the Armour Save card stays "dumb" (it just consumes the
penalty as another modifier).

**Rationale**: The WHFB Armour Save Modifier table grows by 1 per Strength point
above 3 (S4 → -1, S5 → -2, …), per
<https://8th.whfb.app/shooting/armour-save-modifiers>. Computing it once in the
hook keeps the AS card composable.

### 1.5 Boundary rules

**Decision**: All four steps follow uniform clamp + display rules:

- **Natural 1 always fails / misses**: probability is capped at `5/6` for in-range
  targets ≥ 2.
- **Natural 6 always hits** (To Hit only): probability is floored at `1/6` for
  in-range targets ≤ 6.
- **A save can never be better than 1+**: `clampTarget(t, 'save')` returns
  `max(t, 1)` and stores it; display is "1+" with probability `5/6`.
- **To Hit target ≥ 7**: clamps to "6+" with probability `1/6` (natural-6
  always hits → To Hit is never unrollable, regardless of how far modifiers
  push the chart result); combat-sequence summary shows "6+".
- **To Wound target ≥ 7**: render "—" with "Auto-fail"; outcome treats as
  `successProb = 0`. (WHFB 8th has no natural-6-always-wounds rule on the
  source we encode against.)
- **Save target ≥ 7**: render "—" with "No save" (Armour) or "No ward" (Ward);
  combat-sequence summary shows "—"; outcome treats as `failProb = 1`.

**Rationale**: All confirmed in `/speckit-clarify` Q3 and FR-T05. Collected in
helpers `clampTarget()` and `formatTarget()` in `entities/dice/lib/`.

### 1.6 Ward saves are never modified by Strength

**Decision**: The cross-card Strength penalty (FR-018a) is applied ONLY to the
Armour Save card. The Ward Save card uses its own modifier list (FR-021)
independently.

**Rationale**: WHFB rules state "ward saves are never modified by the Strength of
the attack" (<https://8th.whfb.app/shooting/ward-saves>). The user's listed ward
modifiers ("Magic Resistance", "Improved Ward") are intentional UI affordances for
houserule / item effects, applied only when the user toggles them.

## 2. UI primitive selection

### 2.1 shadcn primitives to add

**Decision**: Run, in this order from the repo root:

```text
npx shadcn@latest add card
npx shadcn@latest add select
npx shadcn@latest add switch
npx shadcn@latest add separator
npx shadcn@latest add tooltip
npx shadcn@latest add badge
```

Each generates a single `.tsx` file in `src/shared/ui/` with co-exported
`Component` + `componentVariants` (CVA). All default exports MUST be converted to
named exports on first edit (Constitution Principle III). A `*.stories.tsx` file
is added next to each.

**Rationale**: These are exactly the primitives the spec calls out (FR-005..FR-010
needs Card / Switch / Badge / Tooltip; FR-017 / FR-020 need Select; FR-023 etc.
benefit from Separator). `npx shadcn add` is zero-touch and the project already
has shadcn installed (`shadcn` package in dependencies, `components.json` configured).

**Alternatives considered**: hand-rolling each primitive — rejected for cost and
divergence from the constitution.

### 2.2 lucide-react icons

**Decision**: Map each spec-mentioned icon to a lucide name:

| Spec name | lucide-react export |
| --------- | ------------------- |
| Dice icon | `Dices`             |
| Swords    | `Swords`            |
| Flame     | `Flame`             |
| Shield    | `Shield`            |
| Sparkles  | `Sparkles`          |
| Info      | `Info`              |
| Share     | `Share2`            |
| RotateCcw | `RotateCcw`         |
| Settings  | `Settings`          |

**Card → header icon assignment**:

| Card        | Icon       |
| ----------- | ---------- |
| To Hit      | `Swords`   |
| To Wound    | `Flame`    |
| Armour Save | `Shield`   |
| Ward Save   | `Sparkles` |

The DiceKit logo placeholder uses `Dices`. The top bar uses `Share2`, `RotateCcw`,
`Settings`. Each card header has an `Info` icon that opens a tooltip describing
that card.

**Rationale**: Direct mapping from the user's icon list. lucide-react v1.11.0 is
already a dependency (verified in `package.json`).

### 2.3 Color tokens (Tailwind 4)

**Decision**: Use Tailwind 4 CSS variables defined in `src/index.css`. Add three
new tokens dedicated to this feature:

| Token             | Light value   | Dark value             | Used for                                              |
| ----------------- | ------------- | ---------------------- | ----------------------------------------------------- |
| `--accent-active` | `#22c55e`     | `#22c55e`              | active modifier toggle thumb + glow ring (FR-009)     |
| `--accent-result` | `#f59e0b`     | `#f59e0b`              | required-roll number in result panel (FR-010)         |
| `--card-glow`     | `transparent` | `rgba(34,197,94,0.06)` | subtle inner glow on each card to match the reference |

These are added to the existing theme variables and consumed via Tailwind arbitrary
values (`text-[color:var(--accent-result)]`) or via `cva` variants on the relevant
shared/ui primitives.

**Rationale**: Tailwind 4 expects design tokens as CSS variables. Keeping them in
the global stylesheet means stories and Playwright share the same source. Static
hex values would scatter colors across components.

### 2.4 Inter font

**Decision**: Use the bundled `@fontsource-variable/inter` (already in
`package.json`). No font swap required.

**Rationale**: The spec's Assumptions section explicitly accepts Inter as a
substitute. The project already imports it via the existing app entry.

## 3. State management strategy

### 3.1 Single-hook ownership

**Decision**: All four cards' state (stat inputs + modifier toggle states) lives
inside one custom hook `useDiceCalculator()` in
`src/features/dice-calculator/model/`. The hook returns:

```text
{
  toHit:       { attackerWS, defenderWS, modifiers, requiredRoll, probability }
  toWound:     { strength, toughness, modifiers, requiredRoll, probability }
  armourSave:  { baseTarget, modifiers, requiredRoll, probability }
  wardSave:    { baseTarget, modifiers, requiredRoll, probability }
  outcome:     { unsavedWoundChance, expectedUnsavedWounds }
  actions:     { setStat, toggleModifier, setSave, resetAll }
}
```

The hook is the only place that knows the cross-card Strength→AS link. Each card
component receives only its own slice and a few callbacks.

**Rationale**: Local React state per Constitution Principle V. Centralizing avoids
a `useEffect` round-trip from To Wound → Armour Save and keeps the cross-card
logic testable as a pure derivation.

**Alternatives considered**:

- _RTK slice_: rejected — overkill for in-memory single-page state and explicitly
  ruled out by Principle V ("local React state until shared state is genuinely
  needed").
- _Per-card hooks with a shared context provider_: rejected — adds a Provider
  layer for one shared value (effective Strength); the single hook is simpler.

### 3.2 Reset All

**Decision**: `resetAll()` calls `createInitialState()` (a factory in
`entities/dice/model/defaults.ts`) and replaces the whole state in one
`setState()`. No per-card reset in v1 (FR Edge Cases).

**Rationale**: Single atomic action; matches FR-028 and removes any in-between
re-render artefacts.

## 4. Accessibility approach

**Decision**:

- All interactive controls are native HTML elements wrapped by Radix primitives,
  which already handle keyboard navigation (FR-035, SC-005).
- Each `ModifierToggleRow` uses a Radix `Switch` with `aria-label` set to the
  modifier name + numeric effect (e.g., "Charging, +1 to hit"). The visual state
  is conveyed by the switch thumb position (not just colour) per FR-036 / SC-006.
- Each `NumberStepper` exposes the underlying value via `aria-live="polite"` so
  screen readers announce changes when the user presses ± buttons.
- Tooltip content (the `Info` icon next to each card title) is keyboard-reachable.

**Rationale**: Radix primitives are accessibility-correct by default; we don't
need to roll bespoke a11y plumbing. The a11y addon Storybook already loads
(`@storybook/addon-a11y` per `package.json`) catches regressions in CI via the
vitest-storybook integration.

## 5. Testing strategy

### 5.1 Story-driven tests (primary)

**Decision**: Each component gets a `*.stories.tsx` file co-located with the `.tsx`
source. Stories cover:

- **Default**: zero or default-state args.
- **WithModifiersActive**: one or two modifiers toggled on.
- **EdgeCase**: extreme stats producing boundary display ("—" / "1+").
- **AfterReset**: the reset path.

`npx vitest` runs all stories in headless Chromium via
`@vitest/browser-playwright`. CI runs the same.

### 5.2 Pure-function unit tests

**Decision**: `entities/dice/lib/compute.spec.ts` and `format.spec.ts` cover:

- Chart lookups for representative cells (corners + diagonals).
- `applyModifiers` sign convention.
- Strength→AS penalty edge cases (S3 → 0, S4 → -1, S10 → -7).
- `clampTarget` for save 1+ floor and 7+ unrollable.
- `formatTarget` and `formatProbability` boundary outputs.
- `unsavedWoundProbability` against the documented default state (0.148).

**Rationale**: Pure helpers are cheaper to verify with unit tests than via story
arrangements. The spec's SC-003 ("update within one user-perceivable frame") is
implicitly verified by these being O(1) lookups.

### 5.3 Playwright smoke

**Decision**: One e2e test `tests/calculator.spec.ts` that:

1. Navigates to `/` (or `/calculator` if a route is added).
2. Asserts the four card titles are present.
3. Asserts each card's default required-roll text matches FR-013/016/019/022.
4. Asserts the Combat Sequence and Estimated Outcome default strings match FR-024
   and FR-026.
5. Toggles "Charging" on the To Hit card and asserts the required roll updates.
6. Clicks "Reset All" and re-asserts defaults.

**Rationale**: Catches integration breakage between hook + cards + summary.

## 6. Reference fidelity strategy

**Decision**: Build structure first, polish second. Concrete checklist before
visual tuning:

1. Top bar present with all four right-side controls in correct order.
2. Four cards in one row, in the order To Hit → To Wound → Armour Save → Ward Save.
3. Each card has the four regions (header / inputs / modifiers / result).
4. Summary panel below with Combat Sequence (left) + Estimated Outcome (right).

Only after structural parity passes does visual tuning (spacing density, glow,
border subtlety) start. SC-007 anchors this structural-first verification on
the FR-001..FR-005 region list in the spec.

## 7. Out of scope (v1) — confirmed

- No backend, no persistence, no auth.
- No real preset data — "Load Preset" is a non-functional shadcn `Select`.
- "Share" and "Settings" are non-functional buttons.
- No mobile-specific layout work.
- No shooting BS chart (deferred to `future-rules-backlog.md`).
- No army-specific rules, magic items, special unit abilities, conditional spell
  effects (deferred per FR-038).
- No animation budget; transitions only on toggle states for visual polish.
- No internationalization.

## 8. Open items

None blocking implementation. All NEEDS CLARIFICATION items raised during
`/speckit-clarify` were resolved (Q1 probability formula, Q2 mutually-exclusive S
tiers, Q3 boundary behaviour via canonical WHFB rules, Q4 layout-stability
directive). Phase 1 (data model + quickstart) may proceed.
