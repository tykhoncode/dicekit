---
description: "Task list for the WHFB 8th Edition Dice Calculator UI"
---

# Tasks: WHFB 8th Edition Dice Calculator UI

**Input**: Design documents from `/specs/001-whfb-dice-calculator/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md
**Branch**: `001-whfb-dice-calculator`

**Tests**: Story files (`*.stories.tsx`) and pure-helper unit tests (`*.spec.ts`) are
included throughout. They are NOT TDD-style "fail first" — per Constitution
Principle IV (Story-Driven Verification), stories double as tests AND living
documentation, so they are co-authored with their components rather than written
strictly before. Pure helper unit tests, however, are written before the
implementation steps that consume them where it adds clarity.

**Organization**: Tasks are grouped by user story so each story is independently
implementable and testable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: parallel-safe within its phase (different file, no incomplete-task
  dependency).
- **[Story]**: which user story the task serves (US1, US2, US3) — only on
  user-story-phase tasks.
- File paths are absolute relative to the repo root.

## Path Conventions

This is a single-project React SPA. All source under `src/`. Stories co-located
next to components. Pure-helper unit tests live next to the helper. Playwright
e2e in `tests/`.

---

## Phase 1: Setup

**Purpose**: pull in the shadcn primitives and visual tokens this feature needs.

- [x] T001 [P] Add shadcn `card` primitive: run `npx shadcn@latest add card`, convert default export to named in `src/shared/ui/card.tsx`, add `src/shared/ui/card.stories.tsx` with a `Default` story.
- [x] T002 [P] Add shadcn `select` primitive: run `npx shadcn@latest add select`, convert default export to named in `src/shared/ui/select.tsx`, add `src/shared/ui/select.stories.tsx` with a `Default` story.
- [x] T003 [P] Add shadcn `switch` primitive: run `npx shadcn@latest add switch`, convert default export to named in `src/shared/ui/switch.tsx`, add `src/shared/ui/switch.stories.tsx` with a `Default` story.
- [x] T004 [P] Add shadcn `separator` primitive: run `npx shadcn@latest add separator`, convert default export to named in `src/shared/ui/separator.tsx`, add `src/shared/ui/separator.stories.tsx` with a `Default` story.
- [x] T005 [P] Add shadcn `tooltip` primitive: run `npx shadcn@latest add tooltip`, convert default export to named in `src/shared/ui/tooltip.tsx`, add `src/shared/ui/tooltip.stories.tsx` with a `Default` story.
- [x] T006 [P] Add shadcn `badge` primitive: run `npx shadcn@latest add badge`, convert default export to named in `src/shared/ui/badge.tsx`, add `src/shared/ui/badge.stories.tsx` with a `Default` story.
- [x] T007 Add Tailwind 4 CSS variables to `src/index.css` for both light and dark themes per `research.md` §2.3: `--accent-active: #22c55e`, `--accent-result: #f59e0b`, `--card-glow: transparent` (light) / `rgba(34,197,94,0.06)` (dark).

**Checkpoint**: `npx vitest run src/shared/ui/` passes for the six new primitives' default stories.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: domain layer (types, charts, modifier configs, defaults, pure helpers, unit tests) plus feature-agnostic shared/ui composites used by every card. NOTHING in Phases 3–5 should begin until this phase is complete.

- [x] T008 Add type definitions in `src/entities/dice/model/types.ts` per `data-model.md` §1: `CardKind`, `DiceTarget`, `UnrollableMarker`, `DisplayedTarget`, `ProbabilityFraction`, `ModifierEffect`, `ModifierId`, `ModifierConfig`, `ModifierState`, `StatInputs`, `CardState`, `ComputedCardResult`, `Outcome`, `FullState`. All declared as `type` aliases (not enums per `erasableSyntaxOnly`); use literal unions for chart string outputs.
- [x] T009 [P] Add WHFB 8th Edition lookups in `src/entities/dice/lib/charts.ts` — `lookupToHit` and `lookupToWound` formula functions per `research.md` §1.1, §1.2 (depends on T008 for the `DiceTargetString` return type).
- [x] T010 [P] Add modifier configurations in `src/entities/dice/model/modifiers.ts` — flat `MODIFIER_CONFIGS: readonly ModifierConfig[]` covering all 9 toHit + 7 toWound + 4 armourSave + 3 wardSave entries from `data-model.md` §2.3 (Strength tiers S4/S5/S6 deliberately omitted from armourSave per FR-018a; Parry Ward lives ONLY on Ward Save card per FR-018 / FR-021), plus an `isStrengthSourceModifier(id: ModifierId): boolean` helper for the cross-card link (depends on T008).
- [x] T011 [P] Add default state factory in `src/entities/dice/model/defaults.ts` — `INITIAL_DEFAULTS` constants (`attackerWS:4`, `defenderWS:4`, `strength:4`, `toughness:3`, `armourBaseTarget:4`, `wardBaseTarget:5`) and `createInitialState(): FullState` per `data-model.md` §2.4 (depends on T008, T010).
- [x] T012 Add pure compute helpers in `src/entities/dice/lib/compute.ts` — `applyModifiers`, `getEffectiveStrength`, `computeToHitTarget`, `computeToWoundTarget` (per FR-T02: chart lookup uses `effective Strength`; the modifier-sum step EXCLUDES Strength-source modifiers — they flow only through `effective Strength`, never also subtracted from the chart result, to avoid double-counting), `computeArmourSaveTarget` (includes the `-max(0, effectiveS - 3)` Strength penalty per FR-018a), `computeWardSaveTarget` (NEVER receives Strength penalty per FR-T04), `clampAndFormat` (1+ floor, 7+ unrollable per FR-T05), `chanceFromTarget`, `unsavedWoundProbability`, `computeFullState`. Sign convention per FR-018b. Depends on T008, T009, T010, T011.
- [x] T013 [P] Add format helpers in `src/entities/dice/lib/format.ts` — `formatTarget(t: DisplayedTarget, kind: CardKind)`, `formatProbability(p: ProbabilityFraction, successWord)`, `formatOutcome(outcome: Outcome)`. "—" / "No save" / "No ward" / "Auto-fail" copy per FR-T05. Depends on T008.
- [x] T014 [P] Add unit tests in `src/entities/dice/lib/compute.spec.ts` covering: chart corner lookups (WS1×WS1, WS10×WS10, S1×T10, S10×T1); equal-WS / equal-S diagonals; sign convention (FR-018b examples); Strength→AS penalty edges (S3 → 0, S4 → -1, S10 → -7); 1+ floor; 7+ unrollable; ward NOT modified by Strength; the FR-T02 no-double-count rule (e.g., S=4 / T=4 with Halberd active → effective S=5 → 3+ to wound, NOT 2+; another: S=4 / T=3 with Great Weapon active → effective S=6 → 2+ to wound); `unsavedWoundProbability` against the documented default (0.148 ± 0.001). Depends on T012.
- [x] T015 [P] Add unit tests in `src/entities/dice/lib/format.spec.ts` covering: numeric `1+`..`6+` outputs; em-dash + "No save" for AS≥7; em-dash + "No ward" for WSv≥7; em-dash + "Auto-fail" for hit/wound≥7; percentage formatting to one decimal place; expected-wounds formatting to three decimal places. Depends on T013.
- [x] T016 Add public barrel `src/entities/dice/index.ts` re-exporting types, `lookupToHit`, `lookupToWound`, `parseTarget`, `MODIFIER_CONFIGS`, `isStrengthSourceModifier`, `INITIAL_DEFAULTS`, `createInitialState`, `computeFullState`, `chanceFromTarget`, `unsavedWoundProbability`, format helpers — using direct `export { … } from "./…"` per CLAUDE.md "Module exports". Depends on T008–T013.
- [x] T017 [P] Add `src/shared/ui/number-stepper.tsx` (`NumberStepper`: shadcn `Button` `−`, current value, shadcn `Button` `+`; props `label`, `value`, `onChange`, `min`, `max`; clamps on click and on direct keyboard entry; `aria-live="polite"` on the value) per `data-model.md` §6, plus `src/shared/ui/number-stepper.stories.tsx` with `Default`, `AtMin`, `AtMax` stories.
- [x] T018 [P] Add `src/shared/ui/save-select.tsx` (`SaveSelect`: shadcn `Select` exposing options `1+` through `6+`; props `label`, `value`, `onChange`) per `data-model.md` §6, plus `src/shared/ui/save-select.stories.tsx` with `Default` story.
- [x] T019 [P] Add `src/shared/ui/modifier-toggle-row.tsx` (`ModifierToggleRow`: shadcn `Switch` + label + numeric badge using shadcn `Badge`; active state uses `text-[color:var(--accent-active)]` / ring per FR-009; `aria-label` includes label + numeric effect per FR-036) per `data-model.md` §6, plus `src/shared/ui/modifier-toggle-row.stories.tsx` with `Inactive`, `ActiveBonus`, `ActivePenalty` stories.
- [x] T020 [P] Add `src/shared/ui/result-badge.tsx` (`ResultBadge`: small uppercase "REQUIRED ROLL" label, large dice target rendered in `text-[color:var(--accent-result)]`, one-line probability description; props `target: DisplayedTarget`, `probability`, `successWord: 'hit'|'wound'|'save'`; renders "—" + boundary copy when target is unrollable) per FR-006/FR-010/FR-T05, plus `src/shared/ui/result-badge.stories.tsx` with `Default`, `HighProbability`, `Unrollable`, `OnePlus` stories.

**Checkpoint**: `npx vitest run src/entities/dice/ src/shared/ui/` passes; pure-helper test suite is green; every shared/ui primitive has a working story.

---

## Phase 3: User Story 1 — Roll a single combat step (P1) 🎯 MVP

**Goal**: deliver a dark, full-screen page with the four calculator cards laid out in one row. The user can adjust stats and toggle modifiers on any card and watch the required roll + probability update live. Default state matches FR-013 / FR-016 / FR-019 / FR-022. The TopBar's controls and the SummaryPanel are NOT yet present — only the four working cards in their grid.

**Independent test**: open the page, change Attacker WS on the To Hit card, confirm the required roll changes; toggle Charging on, confirm the roll updates and the toggle shows the green active state; reload the page and confirm defaults return.

- [x] T021 [US1] Add `src/features/dice-calculator/model/useDiceCalculator.ts` — single `useState<FullState>(createInitialState())` plus action callbacks `setStat(card, key, value)`, `toggleModifier(card, id)`, `setSaveTarget(card, value)`, `resetAll()`; computes `results` via `useMemo(() => computeFullState(state), [state])`. Outcome derivation is intentionally NOT yet included (added in T034 for US2). Returns shape per `data-model.md` §3.1.
- [x] T022 [P] [US1] Add `src/features/dice-calculator/ui/AppShell.tsx` (full-screen dark wrapper, `min-h-screen`, max-width content, vertical stack) and `src/features/dice-calculator/ui/AppShell.stories.tsx` with `Default` story (renders placeholder children).
- [x] T023 [P] [US1] Add `src/features/dice-calculator/ui/CalculatorCard.tsx` (generic slotted shell using shadcn `Card` with `header`, `inputs`, `modifiers`, `result` slots per FR-005; header takes `icon`, `title`, `subtitle`, `infoText`; `infoText` opens a shadcn `Tooltip` from a lucide `Info` icon) and `src/features/dice-calculator/ui/CalculatorCard.stories.tsx` with `Default` story (mocked slots).
- [x] T024 [P] [US1] Add `src/features/dice-calculator/ui/CalculatorGrid.tsx` (CSS grid wrapper: 4 equal columns at desktop widths, collapses to 2 then 1 below — per FR-002 / FR-004; no story needed, it's a pure layout primitive used only by `CalculatorPage`).
- [x] T025 [P] [US1] Add `src/features/dice-calculator/ui/ToHitCard.tsx` (composes `CalculatorCard` with header icon `Swords` per `research.md` §2.2, two `NumberStepper` instances for Attacker WS / Defender WS bound to hook, `ModifierToggleRow` list filtered by `card === 'toHit'` from `MODIFIER_CONFIGS`, `ResultBadge` consuming `results.toHit`; per FR-011..FR-013) and `src/features/dice-calculator/ui/ToHitCard.stories.tsx` with `Default`, `WithCharging`, `EdgeCaseUnrollable` stories.
- [x] T026 [P] [US1] Add `src/features/dice-calculator/ui/ToWoundCard.tsx` (composes `CalculatorCard` with header icon `Flame`, two `NumberStepper` instances for Strength / Toughness bound to hook, `ModifierToggleRow` list filtered by `card === 'toWound'`, `ResultBadge` consuming `results.toWound`; per FR-014..FR-016) and `src/features/dice-calculator/ui/ToWoundCard.stories.tsx` with `Default`, `WithGreatWeapon`, `EdgeCaseLowStrength` stories.
- [x] T027 [P] [US1] Add `src/features/dice-calculator/ui/ArmourSaveCard.tsx` (composes `CalculatorCard` with header icon `Shield`, one `SaveSelect` for base armour save, `ModifierToggleRow` list filtered by `card === 'armourSave'`, `ResultBadge` consuming `results.armourSave` — which already includes the cross-card Strength penalty from the hook; per FR-017..FR-019, FR-018a) and `src/features/dice-calculator/ui/ArmourSaveCard.stories.tsx` with `Default`, `WithShield`, `WithStrength6Penalty`, `NoSave` stories.
- [x] T028 [P] [US1] Add `src/features/dice-calculator/ui/WardSaveCard.tsx` (composes `CalculatorCard` with header icon `Sparkles`, one `SaveSelect` for base ward save, `ModifierToggleRow` list filtered by `card === 'wardSave'`, `ResultBadge` consuming `results.wardSave`; ward target is NEVER affected by Strength per FR-T04 — verify the hook honours this) and `src/features/dice-calculator/ui/WardSaveCard.stories.tsx` with `Default`, `WithMagicResistance` stories.
- [x] T029 [US1] Add public barrel `src/features/dice-calculator/index.ts` re-exporting `useDiceCalculator`, `AppShell`, `CalculatorCard`, `CalculatorGrid`, `ToHitCard`, `ToWoundCard`, `ArmourSaveCard`, `WardSaveCard` via direct `export { … } from "./…"`. Depends on T021–T028.
- [x] T030 [US1] Add `src/pages/calculator/ui/CalculatorPage.tsx` (composes `<AppShell><CalculatorGrid>{four cards}</CalculatorGrid></AppShell>`, sharing one `useDiceCalculator()` instance among all four cards via prop drilling — no Context needed since the tree is shallow) and `src/pages/calculator/ui/CalculatorPage.stories.tsx` with `Default` story.
- [x] T031 [US1] Add public barrel `src/pages/calculator/index.ts` re-exporting `CalculatorPage`.
- [x] T032 [US1] Wire CalculatorPage into the router in `src/app/router/AppRouter.tsx` — point the root route (`"/"`) to `CalculatorPage`, replacing the existing `HomePage` default. Verify the existing 404 fallback still works.
- [x] T033 [US1] Add Playwright smoke `tests/calculator.spec.ts` asserting: (a) the four card titles "To Hit", "To Wound", "Armour Save", "Ward Save" are visible; (b) default required-roll text matches FR-013/016/019/022 ("4+", "3+", "5+", "5+") and the corresponding probability text; (c) toggling Charging on the To Hit card changes the displayed required roll; (d) no console errors fire during the page load.

**Checkpoint**: `npm run dev` shows the page with four working cards; `npx vitest run` is green for all stories; `npx playwright test tests/calculator.spec.ts` passes (start `npm run preview` separately locally). MVP is shippable.

---

## Phase 4: User Story 2 — Resolve a full attack sequence (P2)

**Goal**: add the bottom Combat Sequence + Estimated Outcome panel so the player can read the chained outcome of all four steps in one glance.

**Independent test**: with all four cards at defaults, confirm the summary panel shows "4+ To Hit → 3+ To Wound → 5+ Armour Save → 5+ Ward Save" and "14.8% Chance of unsaved wound" / "0.148 Expected unsaved wounds"; change any card and verify the summary updates within one frame.

- [x] T034 [US2] Extend `src/features/dice-calculator/model/useDiceCalculator.ts` to derive `Outcome` (`unsavedWoundChance`, `expectedUnsavedWounds`) from the four card results via a new helper `computeOutcome(results: ComputedCardResult[])` (added to `src/entities/dice/lib/compute.ts` if not yet present per `data-model.md` §1.7). Memoize alongside `results`; expose as `outcome` in the hook return.
- [x] T035 [P] [US2] Add `src/features/dice-calculator/ui/SummaryPanel.tsx` (full-width dark card placed below the grid; left region "Combat Sequence" rendering each card's `DisplayedTarget` + card name joined by "→" arrows per FR-024; right region "Estimated Outcome" with percentage + decimal lines per FR-025/FR-026; uses `formatTarget`, `formatOutcome`) and `src/features/dice-calculator/ui/SummaryPanel.stories.tsx` with `Default`, `AfterModifiers`, `WithUnrollableSave` stories.
- [x] T036 [US2] Mount `SummaryPanel` below `CalculatorGrid` in `src/pages/calculator/ui/CalculatorPage.tsx`; pass it the four `results` plus `outcome` from `useDiceCalculator()`. Update `CalculatorPage.stories.tsx` `Default` story to include the summary panel.
- [x] T037 [US2] Extend `tests/calculator.spec.ts` Playwright smoke to assert: (a) default Combat Sequence text matches FR-024 example; (b) default Estimated Outcome strings match FR-026 ("14.8% Chance of unsaved wound", "0.148 Expected unsaved wounds"); (c) toggling a modifier on any card updates the corresponding segment of the Combat Sequence AND the two Estimated Outcome numbers.

**Checkpoint**: summary panel visible and reactive; full default-state expectation in `quickstart.md` §4 holds.

---

## Phase 5: User Story 3 — Reset and preset controls (P3)

**Goal**: add the top bar with brand mark and the four right-side controls (Load Preset, Share, Reset All, Settings). Reset All works; the others are visible non-functional placeholders.

**Independent test**: change stats and toggles across multiple cards, click Reset All, confirm everything returns to defaults; click Load Preset / Share / Settings and confirm the page does not change state and no console errors fire.

- [x] T038 [US3] Add `src/features/dice-calculator/ui/TopBar.tsx` per FR-003: left side has lucide `Dices` brand mark + "DiceKit" wordmark + "WHFB 8th Edition Dice Calculator" subtitle; right cluster (in order) shadcn `Select` labelled "Load Preset" with empty options list per FR-029, shadcn `Button` containing lucide `Share2` labelled "Share" per FR-030, shadcn `Button` containing lucide `RotateCcw` labelled "Reset All" with `onResetAll` prop, shadcn icon `Button` containing lucide `Settings` per FR-030. Plus `src/features/dice-calculator/ui/TopBar.stories.tsx` with `Default` story.
- [x] T039 [US3] Wire `onResetAll` from TopBar to `useDiceCalculator().actions.resetAll` inside `src/pages/calculator/ui/CalculatorPage.tsx`.
- [x] T040 [US3] Mount `TopBar` above `CalculatorGrid` in `src/pages/calculator/ui/CalculatorPage.tsx`. Update `CalculatorPage.stories.tsx` `Default` story to include the top bar.
- [x] T041 [US3] Extend `tests/calculator.spec.ts` Playwright smoke to assert: (a) clicking Reset All after stat / modifier changes returns every card to its documented default; (b) clicking Load Preset, Share, Settings does not throw and does not change card state — assert by snapshotting the To Hit required-roll text before and after each click.

**Checkpoint**: every spec FR is now wired up; the page matches the four-region structure from FR-001..FR-005 and the visual identity targets from FR-033..FR-034.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: visual fidelity pass, accessibility audit, convention enforcement, and the full pre-merge gate.

- [x] T042 [P] Walk the rendered page against the FR-001..FR-005 region list per `quickstart.md` §7. Tune card spacing density, corner radius, border subtlety, and the `--card-glow` token until SC-007 passes. NO layout changes — only visual polish (FR-037).
- [x] T043 [P] Run the Storybook a11y addon (`@storybook/addon-a11y`) against every new story file via `npx vitest`. Resolve any axe violations surfaced — typical fixes are missing `aria-label` on icon-only buttons and label associations on `NumberStepper` value displays.
- [x] T044 [P] Audit every new file under `src/entities/`, `src/features/`, `src/pages/calculator/`, `src/shared/ui/` for Constitution Principle III compliance: named exports only, `cn()` import is from `@/shared/lib/classnames`, no relative `../` paths, `import type` for type-only imports, no enums/namespaces, no comments unless JSDoc on exported public API. Fix any deviations.
- [x] T045 Run the pre-merge gate: `npm run lint && npm run format:check && npm run typecheck && npm run build && npx vitest run`. Fix any failures (do NOT bypass with `--no-verify` or similar).
- [x] T046 Run `npx playwright test` against `npm run preview` and confirm `tests/calculator.spec.ts` passes end-to-end against the production build.

**Checkpoint**: all gates green. Feature is ready for review / merge.

---

## Dependencies & Execution Order

### Phase dependencies

- **Phase 1 (Setup)**: no upstream dependencies — start immediately.
- **Phase 2 (Foundational)**: depends on Phase 1 completion. Blocks all user-story phases.
- **Phase 3 (US1 / MVP)**: depends on Phase 2.
- **Phase 4 (US2)**: depends on Phase 3 (uses the page + hook from US1).
- **Phase 5 (US3)**: depends on Phase 3 (mounts TopBar onto the page from US1); independent of Phase 4 — could run in parallel with US2 if you have two implementers.
- **Phase 6 (Polish)**: depends on Phase 5 (and 4 if shipped).

### User-story dependencies

- **US1** (P1): self-contained MVP. No dependencies on US2 or US3.
- **US2** (P2): integrates with US1's hook and page; can be added without disturbing US1's behaviour.
- **US3** (P3): integrates with US1's hook and page; independent of US2 (TopBar doesn't read from outcome).

### Within each user story

- The hook task is the spine; it must be in place before card / page tasks can wire to it.
- Card components (`ToHitCard`, `ToWoundCard`, `ArmourSaveCard`, `WardSaveCard`) are siblings — fully parallel-safe once the hook + `CalculatorCard` shell exist.
- The page-mounting task comes after every card it composes is complete.
- The Playwright e2e task comes last in each story phase (it asserts the integration).

### Parallel opportunities

- **Phase 1**: T001–T006 are all `[P]` (six independent files). T007 is sequential because it touches the global stylesheet.
- **Phase 2**: T009, T010, T011 run in parallel after T008. T013 runs in parallel with T012. T014 runs after T012; T015 runs after T013 — both `[P]` once their helper is in place. T017–T020 are four independent shared/ui composites — fully `[P]`.
- **Phase 3 (US1)**: after T021 (hook) and T023 (CalculatorCard shell), the four card tasks T025–T028 are fully parallel (different files, all consume the same hook output).
- **Phase 6**: T042, T043, T044 are all `[P]` — different concerns, no file conflicts.

---

## Parallel Execution Examples

### Phase 1 — open six terminals or batch the agent calls

```text
T001: shadcn add card    + card.stories.tsx
T002: shadcn add select  + select.stories.tsx
T003: shadcn add switch  + switch.stories.tsx
T004: shadcn add separator + separator.stories.tsx
T005: shadcn add tooltip + tooltip.stories.tsx
T006: shadcn add badge   + badge.stories.tsx
```

### Phase 3 (US1) — once the hook + CalculatorCard exist, parallelize the four card components

```text
T025 [US1]: ToHitCard.tsx        + ToHitCard.stories.tsx
T026 [US1]: ToWoundCard.tsx      + ToWoundCard.stories.tsx
T027 [US1]: ArmourSaveCard.tsx   + ArmourSaveCard.stories.tsx
T028 [US1]: WardSaveCard.tsx     + WardSaveCard.stories.tsx
```

---

## Implementation Strategy

### MVP first (US1 only)

1. Phase 1 (Setup) — pull in shadcn primitives, wire tokens.
2. Phase 2 (Foundational) — domain layer + shared/ui composites; verify pure-helper tests are green before moving on.
3. Phase 3 (US1) — four cards working on the page; ship.
4. Stop and validate against `quickstart.md` §4 default-state expectation. Demo if appropriate.

### Incremental delivery

1. Ship MVP after US1 (no top bar, no summary panel — just the four cards).
2. Add US2 (summary panel) — same page, more value.
3. Add US3 (top bar + Reset All) — completes the spec's layout.
4. Run Phase 6 polish before opening the PR.

### Parallel team strategy

With two implementers after Phase 2:

- Implementer A takes US1 (cards + page + router).
- Implementer B can stage US2 (SummaryPanel against a stub hook) and US3 (TopBar standalone story).
- A and B reconcile at integration: A's hook + page mount B's panels.

---

## Notes

- `[P]` = different file, no incomplete-task dependency in this phase.
- `[US#]` label maps a task to a user story for traceability.
- Story files (`*.stories.tsx`) are tests AND docs — co-author with components.
- Pure-helper unit tests (`*.spec.ts`) come before the implementation steps that
  consume them (T014 / T015 are the only TDD-style red-first tasks; everything
  else writes implementation + story together).
- Each card is independently testable via its own story file; the integration
  is verified by the Playwright e2e at the end of each story phase.
- The frozen layout (FR-037) means: NO restructuring during Phase 6 polish. If a
  layout change feels necessary, capture it in `future-rules-backlog.md`
  instead.
- The four core WHFB charts + sign convention + Strength→AS penalty + boundary
  clamps are contained in `src/entities/dice/lib/charts.ts` and `compute.ts`.
  Anything broader (army books, magic items, special unit abilities, shooting
  BS chart, conditional spell triggers) belongs in `future-rules-backlog.md`
  via FR-038, not in this feature.
