# Data Model — WHFB 8th Edition Dice Calculator UI

**Feature**: 001-whfb-dice-calculator
**Date**: 2026-05-06
**Source**: derived from `spec.md` Functional Requirements + `research.md` decisions.

This is a frontend-only feature. The "data model" here is a set of TypeScript types
plus the configuration constants that drive every card's UI. There is no database,
no API contract, no persistence beyond in-memory React state.

## 1. Domain primitives

### 1.1 `CardKind`

```text
type CardKind = 'toHit' | 'toWound' | 'armourSave' | 'wardSave';
```

Used as a discriminator on UI events (`setStat({ card: 'toHit', ... })`) and to
key the modifier configuration map.

### 1.2 `DiceTarget`

```text
type DiceTarget = 1 | 2 | 3 | 4 | 5 | 6;
type UnrollableMarker = 'auto-fail' | 'no-save' | 'no-ward';
type DisplayedTarget = DiceTarget | UnrollableMarker;
```

`DiceTarget` is the canonical numeric form (`4` means a 4+ on the d6).
`UnrollableMarker` represents the FR-T05 boundary states. `DisplayedTarget` is the
union the result panel and summary panel render.

### 1.3 `ProbabilityFraction`

```text
type ProbabilityFraction = number;     // 0..1 inclusive
```

Always derived from `chanceFromTarget(target: DiceTarget)`; never set directly.
Boundary states map to `0` (unrollable) or `1` (auto-success — not currently
reachable since natural 1 always fails).

### 1.4 `Modifier`

```text
type ModifierEffect =
  | { kind: 'numeric'; value: number }   // ±1, ±2, etc.
  | { kind: 'replace-ward'; value: 6 };  // Parry Ward (6++)

type ModifierId = string;                // stable id for state keying

type ModifierConfig = {
  id: ModifierId;                        // e.g. 'toHit:charging'
  card: CardKind;
  label: string;                         // 'Charging'
  effect: ModifierEffect;                // { kind:'numeric', value: 1 }
  /** WHFB rules attribution: where this modifier comes from in canonical rules.
   *  Used by `<Tooltip>` content; informative only, no behaviour. */
  source?: string;
};

type ModifierState = {
  id: ModifierId;
  active: boolean;
};
```

`ModifierConfig` is static (lives in `entities/dice/model/modifiers.ts`).
`ModifierState` is the per-row toggle state held in `useDiceCalculator()`.

The `replace-ward` variant exists so the "Parry Ward (6++)" toggle on the Ward
Save card can be modelled without special-casing in compute logic. When active,
the effective ward target becomes `min(currentTarget, 6)` — matching WHFB's
"use the best ward save" rule. Parry Ward lives ONLY on the Ward Save card per
canonical WHFB rules (Parry from hand-weapon-and-shield is a 6+ ward save, not
an armour-save modifier).

### 1.5 `CardState` (per-card state slice)

```text
type StatInputs = {
  attackerWS?: number;       // 1..10, To Hit only
  defenderWS?: number;       // 1..10, To Hit only
  strength?:   number;       // 1..10, To Wound only
  toughness?:  number;       // 1..10, To Wound only
  baseTarget?: DiceTarget;   // Armour Save / Ward Save only
};

type CardState = {
  kind:       CardKind;
  inputs:     StatInputs;            // only the keys relevant to `kind`
  modifiers:  ModifierState[];       // one entry per ModifierConfig with the same `card`
};
```

Each card holds only the input keys it needs. `useDiceCalculator()` enforces the
shape via discriminated unions.

### 1.6 `ComputedCardResult`

```text
type ComputedCardResult = {
  kind:        CardKind;
  target:      DisplayedTarget;        // numeric 1..6 or unrollable marker
  probability: ProbabilityFraction;    // success probability (0..1)
  rawTarget:   number;                 // unclamped, for debugging only — never rendered
};
```

Produced by `computeCard()` in `entities/dice/lib/compute.ts`. The card's
`<ResultBadge>` consumes it.

### 1.7 `Outcome`

```text
type Outcome = {
  unsavedWoundChance:     ProbabilityFraction;  // 0..1
  expectedUnsavedWounds:  number;               // == unsavedWoundChance for one attack
};
```

Derived in the hook from the four `ComputedCardResult.probability` values per
FR-026's formula `hit × wound × failArmour × failWard`.

### 1.8 `FullState` (the whole calculator)

```text
type FullState = {
  toHit:      CardState;
  toWound:    CardState;
  armourSave: CardState;
  wardSave:   CardState;
};
```

This is the single object returned by `useState<FullState>` inside
`useDiceCalculator()`.

## 2. Constants

### 2.1 `TO_HIT_CHART`

`src/entities/dice/lib/charts.ts`

```text
export const TO_HIT_CHART = [
  // Attacker WS = 1
  ['4+', '4+', '5+', '5+', '5+', '5+', '5+', '5+', '5+', '5+'],
  // Attacker WS = 2
  ['3+', '4+', '4+', '4+', '5+', '5+', '5+', '5+', '5+', '5+'],
  // ... rows 3..10 per research.md table
] as const satisfies readonly (readonly DiceTargetString[])[];

type DiceTargetString = `${DiceTarget}+`;
```

Lookup: `TO_HIT_CHART[attackerWS - 1][defenderWS - 1]` returns a `DiceTargetString`
(e.g., `"4+"`); the consumer parses to numeric via `parseTarget()`.

### 2.2 `TO_WOUND_CHART`

Same shape as `TO_HIT_CHART`, indexed `TO_WOUND_CHART[strength - 1][toughness - 1]`.
Values cover `'2+'` through `'6+'`.

### 2.3 `MODIFIER_CONFIGS`

`src/entities/dice/model/modifiers.ts`

A flat `readonly ModifierConfig[]` covering all four cards. The shape per card:

| Card       | Count | Examples                                                                                                                                                                                        |
| ---------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| toHit      | 9     | `{ id:'toHit:charging', label:'Charging', effect:{kind:'numeric',value:1} }`, plus Fear, Higher Ground, Enemy Hard to Hit, Spell/Hex, Cover/Shooting, Multiple Shots, Long Range, Stand & Shoot |
| toWound    | 7     | Great Weapon (+2), Halberd (+1), Lance (+2), Strength Buff (+1), Strength Debuff (-1), Wyssan's/Blessing (+1), Curse/Hex (-1)                                                                   |
| armourSave | 4     | Shield Bonus (+1), Mounted Bonus (+1), Armour Piercing (-1), Cover Bonus (+1)                                                                                                                   |
| wardSave   | 3     | Magic Resistance (+1), Parry Ward (6++ — replace-ward), Improved Ward (+1)                                                                                                                      |

All Strength-source modifiers (Great Weapon, Halberd, Lance, Strength Buff, Strength
Debuff, Wyssan's, Curse/Hex) are flagged via a derived selector
`isStrengthSourceModifier(id: ModifierId): boolean` so `useDiceCalculator()` can
sum them into `effectiveStrength` for FR-018a.

### 2.4 `INITIAL_DEFAULTS`

`src/entities/dice/model/defaults.ts`

```text
export const INITIAL_DEFAULTS = {
  attackerWS:        4,
  defenderWS:        4,
  strength:          4,
  toughness:         3,
  armourBaseTarget:  4,    // displays as "5+" after S4 penalty
  wardBaseTarget:    5,
} as const;
```

Pinned per FR-011 / FR-014 / FR-017 / FR-020 so that the default state produces
the documented `4+ / 3+ / 5+ / 5+` per FR-013 / FR-016 / FR-019 / FR-022.

`createInitialState(): FullState` builds a `FullState` from these constants with
every modifier `active: false`.

## 3. Validation rules (input boundaries)

| Field      | Min | Max | Source                              |
| ---------- | --- | --- | ----------------------------------- |
| attackerWS | 1   | 10  | matches WHFB To Hit chart bounds    |
| defenderWS | 1   | 10  | matches WHFB To Hit chart bounds    |
| strength   | 1   | 10  | matches WHFB To Wound chart bounds  |
| toughness  | 1   | 10  | matches WHFB To Wound chart bounds  |
| baseTarget | 1   | 6   | save targets must be a roll on a d6 |

`<NumberStepper>` clamps via React state on `+`/`-` clicks and on direct keyboard
entry. Out-of-range stat inputs are not representable.

## 4. Derivations (read-only computed fields)

| Derivation                 | Inputs                                                | Output                 | Function                         |
| -------------------------- | ----------------------------------------------------- | ---------------------- | -------------------------------- |
| effective Strength         | base S + active Strength-source modifiers             | `number` (1..N)        | `getEffectiveStrength(state)`    |
| To Hit raw target          | A_WS, D_WS, active toHit modifiers                    | `number` (raw, signed) | `computeToHitTarget(state)`      |
| To Wound raw target        | effective S, T, active toWound modifiers              | `number`               | `computeToWoundTarget(state)`    |
| Armour Save raw target     | base AS, active AS modifiers, S→AS penalty            | `number`               | `computeArmourSaveTarget(state)` |
| Ward Save raw target       | base ward, active ward modifiers, parry-ward override | `number`               | `computeWardSaveTarget(state)`   |
| clamped + displayed        | raw target, kind                                      | `DisplayedTarget`      | `clampAndFormat(raw, kind)`      |
| probability                | DisplayedTarget                                       | `ProbabilityFraction`  | `chanceFromTarget(t)`            |
| Outcome.unsavedWoundChance | 4 × ProbabilityFraction                               | `number` (0..1)        | `computeOutcome(results)`        |

All derivations are pure functions of `FullState`. The hook calls
`computeFullState(FullState): { results: ComputedCardResult[4], outcome: Outcome }`
inside a `useMemo` so derivations only re-run when state changes.

## 5. State transitions

The whole state lives in one `useState<FullState>`. There are five action types:

| Action                       | Transition                                                               |
| ---------------------------- | ------------------------------------------------------------------------ |
| `setStat(card, key, value)`  | clamps `value` to the field's min/max, updates `state[card].inputs[key]` |
| `toggleModifier(card, id)`   | flips `state[card].modifiers[i].active` for the matching id              |
| `setSaveTarget(card, value)` | thin wrapper around `setStat` for the save cards' `baseTarget`           |
| `resetAll()`                 | replaces state with `createInitialState()`                               |
| `loadPreset(presetId)`       | **no-op in v1** — placeholder per FR-029                                 |

All actions are dispatched through callbacks returned by `useDiceCalculator()`.
The cross-card recomputation (Strength → AS) happens implicitly because every
derivation is computed from the latest `FullState` on every render.

## 6. Component prop contracts

These mirror what `data-model.md` cares about. Full props are in source.

```text
<CalculatorCard>
  icon:        ReactNode                            // lucide icon
  title:       string                               // 'To Hit'
  subtitle:    string                               // 'WS vs WS'
  infoText:    string                               // tooltip body
  inputs:      ReactNode                            // slot
  modifiers:   ReactNode                            // slot
  result:      ReactNode                            // slot

<NumberStepper>
  label:       string
  value:       number
  onChange:    (next: number) => void
  min:         number
  max:         number

<SaveSelect>
  label:       string
  value:       DiceTarget
  onChange:    (next: DiceTarget) => void

<ModifierToggleRow>
  config:      ModifierConfig
  active:      boolean
  onToggle:    () => void

<ResultBadge>
  target:        DisplayedTarget
  probability:   ProbabilityFraction
  successWord:   'hit' | 'wound' | 'save'           // for the description text

<SummaryPanel>
  results:    [ComputedCardResult, ComputedCardResult, ComputedCardResult, ComputedCardResult]
  outcome:    Outcome

<TopBar>
  onResetAll: () => void

<AppShell>
  children:   ReactNode
```

Each prop interface is exported as a TypeScript type next to its component for
Storybook to discover.

## 7. Entity → spec FR cross-reference

| Spec FR(s)                              | Lives in                                                                                                                         |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| FR-001..FR-005 layout                   | `pages/calculator/ui/CalculatorPage.tsx`                                                                                         |
| FR-005..FR-010 card structure           | `features/dice-calculator/ui/CalculatorCard.tsx` + `shared/ui/result-badge.tsx`, `modifier-toggle-row.tsx`, `number-stepper.tsx` |
| FR-011..FR-013 (To Hit)                 | `features/dice-calculator/ui/ToHitCard.tsx` + `MODIFIER_CONFIGS.toHit`                                                           |
| FR-014..FR-016 (To Wound)               | `features/dice-calculator/ui/ToWoundCard.tsx` + `MODIFIER_CONFIGS.toWound`                                                       |
| FR-017..FR-019 (Armour Save)            | `features/dice-calculator/ui/ArmourSaveCard.tsx` + `MODIFIER_CONFIGS.armourSave`                                                 |
| FR-018a, FR-T03 (S→AS)                  | `features/dice-calculator/model/useDiceCalculator.ts` (cross-card derivation)                                                    |
| FR-018b sign convention                 | `entities/dice/lib/compute.ts` (`applyModifiers`)                                                                                |
| FR-020..FR-022 (Ward Save)              | `features/dice-calculator/ui/WardSaveCard.tsx` + `MODIFIER_CONFIGS.wardSave`                                                     |
| FR-023..FR-027 (Summary)                | `features/dice-calculator/ui/SummaryPanel.tsx`                                                                                   |
| FR-028..FR-030 (Top bar)                | `features/dice-calculator/ui/TopBar.tsx`                                                                                         |
| FR-031 (in-memory state)                | `useDiceCalculator()` (single `useState`)                                                                                        |
| FR-032, FR-T01..FR-T05                  | `entities/dice/lib/charts.ts`, `compute.ts`, `format.ts`                                                                         |
| FR-033..FR-034 (visual identity)        | Tailwind tokens in `src/index.css`, applied via `cva`                                                                            |
| FR-035..FR-036 (a11y)                   | Radix primitives + ARIA attributes on shared/ui composites                                                                       |
| FR-037..FR-038 (frozen layout, backlog) | Architectural — enforced by code review against this plan                                                                        |
