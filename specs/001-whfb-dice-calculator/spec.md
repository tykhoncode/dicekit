# Feature Specification: WHFB 8th Edition Dice Calculator UI

**Feature Branch**: `001-whfb-dice-calculator`
**Created**: 2026-05-06
**Status**: Draft
**Input**: User description: "Build a full-screen desktop web app UI for DiceKit … polished
dark-mode Warhammer Fantasy Battle 8th Edition dice calculator page matching the attached
reference design … 4 equal calculator cards (To Hit, To Wound, Armour Save, Ward Save) with
steppers, modifier toggles, and result panels, plus a bottom combat-sequence summary."

## Clarifications

### Session 2026-05-06

- Q: How should the placeholder calculator reconcile the screenshot's stated default
  percentages (4+ → 66.7%) with the standard d6 formula (4+ → 50.0%)? → A: Use the real
  d6 formula `chance = max(0, min(6, 7 - target)) / 6`. The screenshot is a layout and
  design reference; its mathematical values are treated as imprecise. No percentage
  strings are hardcoded — every probability and the bottom-summary outcome are derived
  live from the current required roll. Default-state values in the spec have been
  recalculated accordingly.
- Q: Should the three Strength-tier rows on the Armour Save card (S4 -1, S5 -2, S6 -3)
  be independent toggles, mutually exclusive, or replaced? → A: Replaced. The Strength
  value entered on the To Wound card automatically drives the Armour Save penalty
  (`as_strength_penalty = -max(0, Strength - 3)`, so S3 or lower → no penalty, S4 →
  -1, S5 → -2, S6 → -3, and so on). The three S-tier toggles are removed from the
  Armour Save modifier list. This introduces a deliberate, scoped cross-card link
  (To Wound → Armour Save) that follows the WHFB 8th Edition rule even in v1.
  Sign convention: positive modifiers improve the save (lower required roll); negative
  modifiers worsen it (higher required roll). Example: 2+ AS with a -1 modifier → 3+ AS.
- Q: How should future iterations handle WHFB rules that don't fit the current four-card
  layout? → A: Layout is frozen at the four-card structure described in this spec.
  Future patches will polish columns, add more rules, and rework math, but MUST NOT
  reshape the layout to accommodate overflow rules. Any rule that does not fit the
  existing layout is captured in
  [`future-rules-backlog.md`](./future-rules-backlog.md) (sibling to this spec)
  for triage in a later iteration. Layout-fit is a hard constraint; the backlog
  is the escape valve.
- Q: How should out-of-range required rolls (target ≤ 1 or target ≥ 7) be displayed,
  and what placeholder formula should govern boundary behaviour? → A: Use the real
  WHFB 8th Edition rules verbatim, sourced from <https://8th.whfb.app/>. This
  supersedes the prior "placeholder formula" framing. v1 ships with real dice math
  for the four core steps (To Hit, To Wound, Armour Save, Ward Save); only the
  per-modifier source attribution (army-specific rules, magic items, special unit
  abilities, conditional spell effects) remains deferred to a follow-up. Boundary
  behaviour is governed by canonical rules: a natural 1 always misses / fails to
  wound / fails a save; a natural 6 always hits; a save can never be better than 1+;
  a save's required roll exceeding 6 means "no save" (auto-fail); ward saves are
  never modified by the attack's Strength.

## User Scenarios & Testing _(mandatory)_

### User Story 1 — Roll a single combat step (Priority: P1) 🎯 MVP

A WHFB 8th Edition player sets up a single dice step (e.g., To Hit) before resolving an
attack. They adjust the relevant stat inputs (Attacker WS / Defender WS) and toggle the
situational modifiers that apply (e.g., Charging, Higher Ground). The card's result panel
shows the required dice roll (e.g., "4+") and the corresponding probability ("50.0% chance
to hit"). They can scan the result instantly without manually computing the modifier math.

**Why this priority**: This is the smallest unit of value the tool delivers — even a
single working calculator card replaces the player's mental math. If only this story
ships, the product is already useful.

**Independent Test**: Open the page, focus on any one of the four calculator cards
(e.g., To Hit), change the stat inputs, toggle two modifiers on and off, and confirm
the displayed required roll and probability change in response. Reset the card to
defaults and confirm the displayed value returns to the documented default for that
card (To Hit → 4+ / 50.0%).

**Acceptance Scenarios**:

1. **Given** the page is loaded with default state, **When** the player views the To Hit
   card, **Then** it shows "REQUIRED ROLL", a large "4+" target, and "50.0% chance to hit".
2. **Given** the To Hit card is at default, **When** the player toggles "Charging" on,
   **Then** the displayed required roll updates and a green-accent state is visible on
   the toggle to indicate it is active.
3. **Given** any calculator card, **When** the player presses the minus / plus controls
   on a numeric stepper, **Then** the underlying stat value changes by 1 per press.
4. **Given** any calculator card, **When** the player toggles a modifier off after it
   was on, **Then** its visual active state is cleared and the result recomputes.

---

### User Story 2 — Resolve a full attack sequence (Priority: P2)

A player wants the combined outcome across all four steps of a Warhammer attack
(To Hit → To Wound → Armour Save → Ward Save). They configure all four cards in one
view, then read the bottom summary panel showing the chained combat sequence
(e.g., "4+ → 3+ → 5+ → 5+") and the estimated outcome ("14.8% chance of unsaved wound,
0.148 expected unsaved wounds"). This lets them estimate the value of a planned attack
in a single glance.

**Why this priority**: The single-card view (US1) handles step-level decisions; this
story handles the strategic decisions ("is this attack worth committing?"). It depends
on US1 being functional and adds aggregation on top.

**Independent Test**: With all four cards configured to non-default values, confirm
the bottom summary panel shows the four required rolls in left-to-right combat order,
that the "Estimated Outcome" panel on the right shows a percentage and an expected-
wounds figure, and that changing any single card's required roll updates the summary
panel.

**Acceptance Scenarios**:

1. **Given** all four cards at defaults, **When** the player views the summary panel,
   **Then** "Combat Sequence" shows "4+ To Hit → 3+ To Wound → 5+ Armour Save → 5+ Ward
   Save" and "Estimated Outcome" shows "14.8% chance of unsaved wound" and "0.148
   expected unsaved wounds".
2. **Given** the summary panel is visible, **When** the player changes the To Wound
   card's required roll, **Then** the summary's "3+ To Wound" segment updates.
3. **Given** the summary panel is visible, **When** any single card's required roll
   changes, **Then** both the chained-sequence display and the estimated-outcome
   numbers refresh.

---

### User Story 3 — Reset and preset controls (Priority: P3)

After exploring several configurations, the player wants to start fresh quickly, or
load a saved combination of stats + modifiers. The top bar exposes "Reset All", "Load
Preset", "Share", and "Settings" controls. In v1, only Reset All is functional; the
others are visible placeholders so the layout is correct but they do nothing on click.

**Why this priority**: Reset All is a quality-of-life feature, not a core calculation
feature. The other three controls are layout placeholders so the visual structure
matches the reference design and downstream feature work has a hook to land in.

**Independent Test**: Modify several cards' state, click "Reset All", and confirm
every card returns to its documented default values and all modifier toggles return
to off. Click "Load Preset", "Share", and "Settings" and confirm they are visible and
clickable but do not change page state.

**Acceptance Scenarios**:

1. **Given** the player has changed stats and toggled modifiers across multiple cards,
   **When** they click "Reset All", **Then** every card returns to its default state
   (To Hit → 4+, To Wound → 3+, Armour Save → 5+, Ward Save → 5+) and all modifier
   toggles are off.
2. **Given** the page is loaded, **When** the player opens the "Load Preset" control,
   **Then** the control is interactive (focusable, opens a list) but selecting any
   item — or finding the list empty — does not alter card state.
3. **Given** the page is loaded, **When** the player clicks "Share" or "Settings",
   **Then** the buttons accept the click but no page state changes and no error
   message appears.

---

### Edge Cases

- **Modifiers push the required roll outside the d6 range**: handled per WHFB
  rules and FR-T05. A target ≤ 1 displays as "1+" (a natural 1 still fails); a
  save target ≥ 7 displays as "—" with "No save" / "No ward"; a To Hit or To
  Wound target ≥ 7 displays as "—" with "Auto-fail". Probabilities are bounded
  to `[1/6, 5/6]` for in-range targets by the natural-1 / natural-6 rules.
- **Stat inputs at extremes**: numeric steppers refuse to go below 1 (WS, S, T)
  and not exceed 10 — matching the rows / columns of the WHFB To Hit and To
  Wound charts. Steppers also refuse values outside this range during keyboard
  entry.
- **No-save scenarios**: when modifiers + Strength penalty push the Armour Save
  beyond 6+, the Armour Save card and the Combat Sequence summary BOTH render
  the "—" / "No save" treatment. The Estimated Outcome treats this step as a
  100% fail probability.
- **Toughness off the To Wound chart**: when Strength is so low relative to
  Toughness that the WHFB chart would say "cannot wound" (e.g., S1 vs T7+), the
  To Wound card renders "—" / "Auto-fail" per FR-T05.
- **Cross-card linking in v1 — scoped exception**: cards are otherwise independent,
  but Strength on the To Wound card DOES automatically drive the Armour Save penalty
  (per FR-018a). No other cross-card flows exist in v1; e.g., the Armour Piercing
  toggle on Armour Save is still a manual user choice. Other cross-card behaviour
  (auto-deriving wound thresholds from S vs T, etc.) waits for the rules engine.
- **Reset on a single card**: the spec only requires "Reset All" at the top bar.
  Per-card reset is out of scope for v1.

## Requirements _(mandatory)_

### Functional Requirements

**Page structure**:

- **FR-001**: System MUST present a single full-screen dark-themed page titled
  "DiceKit" with the subtitle "WHFB 8th Edition Dice Calculator".
- **FR-002**: The page MUST contain a top bar, a main grid of four equal calculator
  cards arranged in a single horizontal row, and a full-width bottom summary panel.
- **FR-003**: The top bar MUST contain, left to right: a brand mark + "DiceKit"
  wordmark with subtitle, and a right-aligned cluster of four controls: "Load Preset"
  selector, "Share" button, "Reset All" button, and a settings (gear) icon button.
- **FR-004**: Below desktop widths the four-card grid MAY collapse to fewer columns;
  no further mobile-specific optimization is required for v1.

**Calculator cards (apply to all four)**:

- **FR-005**: Each calculator card MUST contain, top to bottom: a header (icon + title
  - one-line subtitle + info icon), an input section, a list of toggleable modifiers,
    and a result panel.
- **FR-006**: Each card's result panel MUST display the literal label "REQUIRED ROLL",
  the required dice target as a large prominent number formatted with a trailing
  "+" (e.g., "4+"), and a one-line probability description (e.g., "66.7% chance to
  hit").
- **FR-007**: Numeric stat inputs MUST be presented as steppers with three controls:
  decrement, current value, increment.
- **FR-008**: Modifier rows MUST be presented as toggle switches with the modifier
  name + numeric effect (e.g., "+1", "-1", "6++") visible as a label.
- **FR-009**: Active modifier toggles MUST use a bright green accent so the active
  state is unambiguous at a glance.
- **FR-010**: The required-roll number in each result panel MUST use a gold / orange
  accent, distinct from the body text colour.

**Card 1 — To Hit (WS)**:

- **FR-011**: The To Hit card MUST expose two stat steppers labelled "Attacker WS"
  and "Defender WS", each defaulting to 4 (chosen so the default required roll lands
  at 4+ per the WHFB To Hit chart for equal Weapon Skill).
- **FR-012**: The To Hit card MUST list the following modifiers, each with the shown
  numeric effect: Fear (failed test) -1, Higher Ground +1, Charging +1, Enemy Hard
  to Hit -1, Spell / Hex (to hit) -1, Cover / Shooting Modifier -1, Multiple Shots
  Penalty -1, Long Range Penalty -1, Stand & Shoot Reaction -1.
- **FR-013**: The To Hit card's default result panel MUST read "4+" with "50.0%
  chance to hit". The required roll is derived live from the WHFB 8th Edition To Hit
  chart (lookup of Attacker WS × Defender WS) plus the sum of any active To Hit
  modifiers, governed by the sign convention in FR-018b and the natural-roll rules
  in FR-T01. The probability is derived live from
  `chance = max(0, min(6, 7 - target)) / 6` — never hardcoded.

**Card 2 — To Wound (S vs T)**:

- **FR-014**: The To Wound card MUST expose two stat steppers labelled "Strength"
  (defaulting to 4) and "Toughness" (defaulting to 3). These defaults produce a 3+
  required roll on the WHFB To Wound chart (S one higher than T) and a -1 Armour
  Save Strength penalty per FR-018a, which together produce the documented default
  values in FR-016 and FR-019.
- **FR-015**: The To Wound card MUST list the following modifiers: Great Weapon
  (+2 Strength) +2, Halberd (+1 Strength) +1, Lance (on charge) +2, Strength Buff
  +1, Strength Debuff -1, Wyssan's / Blessing (+1 Strength) +1, Curse / Hex
  (-1 Strength) -1.
- **FR-016**: The To Wound card's default result panel MUST read "3+" with "66.7%
  chance to wound". The required roll is derived live from the WHFB 8th Edition To
  Wound chart (lookup of effective Strength × Toughness) plus the sum of any active
  To Wound modifiers, governed by the sign convention in FR-018b and the natural-roll
  rule in FR-T02.

**Card 3 — Armour Save (AS)**:

- **FR-017**: The Armour Save card MUST expose a single input control allowing the
  player to choose the base armour save target (defaulting to 4+).
- **FR-018**: The Armour Save card MUST list the following modifiers as user
  toggles: Shield Bonus +1, Mounted Bonus +1, Armour Piercing -1, Cover Bonus
  (shooting) +1. The previously-listed Strength-tier rows (S4 / S5 / S6) are
  removed — that penalty is now derived automatically from the Strength stat on
  the To Wound card per FR-018a. Parry Ward (6++) is NOT duplicated here; it
  belongs to the Ward Save card only (FR-021), since per WHFB 8th Edition rules
  Parry from hand-weapon-and-shield is a 6+ ward save (a parallel save layer),
  not an armour-save modifier.
- **FR-018a**: The Armour Save required roll MUST be reduced (made worse) by an
  amount derived live from the To Wound card's _effective_ Strength (base
  Strength stat plus the sum of any active Strength-source modifiers from
  FR-015 — Great Weapon, Halberd, Lance, etc.), using the WHFB 8th Edition rule:
  `as_strength_penalty = -max(0, effective_Strength - 3)` (i.e., effective S ≤ 3
  → 0, S4 → -1, S5 → -2, S6 → -3, S7 → -4, …). This is the only cross-card
  linkage in v1.
- **FR-018b**: Save targets MUST follow the WHFB 8th Edition sign convention:
  applying a -1 modifier WORSENS a save by raising the required roll by 1 (e.g.,
  2+ AS with -1 → 3+ AS); a +1 modifier IMPROVES a save by lowering the required
  roll by 1 (e.g., 5+ AS with +1 → 4+ AS). The same convention applies to To Hit
  and To Wound: positive modifiers reduce the required roll, negative modifiers
  raise it.
- **FR-019**: The Armour Save card's default result panel MUST read "5+" with
  "33.3% chance to save".

**Card 4 — Ward Save (WSv)**:

- **FR-020**: The Ward Save card MUST expose a single input control allowing the
  player to choose the base ward save target (defaulting to 5+).
- **FR-021**: The Ward Save card MUST list the following modifiers: Magic Resistance
  (+ward vs spells) +1, Parry Ward (6++) 6++, Improved Ward +1.
- **FR-022**: The Ward Save card's default result panel MUST read "5+" with "33.3%
  chance to save".

**Bottom summary panel**:

- **FR-023**: The summary panel MUST be a full-width dark card placed below the
  four-card row, containing two regions: "Combat Sequence" on the left and "Estimated
  Outcome" on the right.
- **FR-024**: "Combat Sequence" MUST display the four cards' current required rolls
  in left-to-right order with a directional separator between each (e.g., "4+ To Hit
  → 3+ To Wound → 5+ Armour Save → 5+ Ward Save").
- **FR-025**: "Estimated Outcome" MUST display two metrics: a percentage labelled
  "Chance of unsaved wound" and a decimal labelled "Expected unsaved wounds".
- **FR-026**: At default state, "Estimated Outcome" MUST read "14.8% Chance of unsaved
  wound" and "0.148 Expected unsaved wounds". These values are derived live from the
  four cards' current required rolls using the per-step d6 chance and the standard
  unsaved-wound product `hit × wound × (1 - armour_save) × (1 - ward_save)`. No
  outcome strings are hardcoded.
- **FR-027**: The summary panel MUST update whenever any of the four cards' required
  rolls change.

**Top-bar controls behaviour**:

- **FR-028**: "Reset All" MUST restore every card's stat inputs and modifier toggles
  to their documented defaults in a single action.
- **FR-029**: "Load Preset" MUST be visually present and interactive (focusable,
  opens a list) but selecting any item MUST NOT change page state in v1; the preset
  list MAY be empty.
- **FR-030**: "Share" and "Settings" MUST be visually present and clickable, but
  clicks MUST NOT change page state in v1.

**State and persistence**:

- **FR-031**: All page state (stat inputs, modifier toggles, derived results) MUST
  live in memory only for v1; no values are persisted across page reloads.
- **FR-032**: v1 ships with the real WHFB 8th Edition dice math for the four core
  steps (To Hit, To Wound, Armour Save, Ward Save), encoded per FR-T01 through
  FR-T05. The per-card success probability is derived from
  `chance = max(0, min(6, 7 - target)) / 6` and the bottom-summary outcome is
  derived from the four cards' current required rolls. No probability or outcome
  strings are hardcoded. What is intentionally deferred (and labelled "rules engine"
  in this spec) is the broader system that resolves WHICH modifiers apply in a
  given situation: army-specific rules, magic items, special unit abilities,
  conditional spell effects, etc. The user manually toggles the modifiers in v1.

**WHFB rules encoding** (canonical source: <https://8th.whfb.app/>):

- **FR-T01 (To Hit)**: To Hit required roll MUST be derived live as
  `to_hit = clamp(chart_to_hit(Attacker WS, Defender WS) - sum(active to-hit
modifiers), 2, 6)`, where `chart_to_hit` is the WHFB 8th Edition close-combat
  To Hit lookup chart (Attacker WS rows × Defender WS columns; values 3+ to 5+).
  Natural-roll rules: a natural 1 always misses and a natural 6 always hits — so
  the displayed probability MUST always be at least 1/6 (auto-hit on a 6) and at
  most 5/6 (always-miss on a 1), regardless of where modifiers push the target.
- **FR-T02 (To Wound)**: To Wound required roll MUST be derived live as
  `to_wound = clamp(chart_to_wound(effective Strength, Toughness) - sum(active
to-wound modifiers EXCLUDING Strength-source modifiers), 2, 6)`. Strength-source
  modifiers (Great Weapon, Halberd, Lance, Strength Buff, Strength Debuff,
  Wyssan's, Curse/Hex — all of FR-015 in v1) flow ONLY through `effective
Strength = Strength + sum(active Strength-source modifiers)`; they MUST NOT
  also be subtracted from the chart result, or their effect would be double-
  counted. With the FR-015 modifier list as it stands today, the
  "EXCLUDING Strength-source modifiers" sum is effectively 0 — the rule is
  written this way to be forward-compatible when future patches add direct
  to-wound modifiers (e.g., a hypothetical "+1 to wound vs Cavalry" rule that
  is NOT a Strength buff). `chart_to_wound` is the WHFB 8th Edition To Wound
  lookup (Strength rows × Toughness columns; values 2+ to 6+; cells off the
  chart return "cannot wound", displayed as the system-defined unrollable label
  per FR-T05). A natural 1 to wound always fails — so the displayed probability
  MUST not exceed 5/6 even at 2+.
- **FR-T03 (Armour Save)**: Armour Save required roll MUST be derived live as
  `as = base_AS - sum(active AS modifiers from FR-018) - max(0, effective Strength
  - 3)`, then clamped so a save can never be better than 1+. If `as > 6` the save
    is impossible — displayed per FR-T05 as the unrollable label, contributing a
    100% fail probability to the combat-sequence outcome. A natural 1 always fails,
    so an effective 1+ save still fails 1/6 of the time.
- **FR-T04 (Ward Save)**: Ward Save required roll MUST be derived live as
  `ward = base_ward - sum(active ward modifiers from FR-021)`, clamped so a ward
  save can never be better than 1+. Per WHFB rules, ward saves are NEVER modified
  by the attack's Strength; the cross-card Strength penalty (FR-018a) MUST NOT
  apply here. The "Magic Resistance" and "Improved Ward" toggles in FR-021 are
  the only sources that adjust the ward target in v1; the user is responsible for
  toggling them correctly. A natural 1 always fails.
- **FR-T05 (Boundary display)**: When a required roll is computed as ≤ 1, the
  result panel MUST display the dice target as "1+" (the system clamps; a natural
  1 still fails). When a required roll is computed as ≥ 7 for a save, the result
  panel MUST display the literal em dash "—" as the dice target and the
  probability text MUST read "No save" (Armour Save) or "No ward" (Ward Save);
  the Combat Sequence summary MUST render the same em dash for that step. When
  the target is ≥ 7 for To Hit or To Wound, the result panel MUST display "—"
  with "Auto-fail" as the probability text. Probability values must always remain
  in `[1/6, 5/6]` for in-range targets due to the natural-1 / natural-6 rules.

**Visual identity**:

- **FR-033**: Visual style MUST be premium dark SaaS / tactical analytics — compact
  spacing, thin borders, subtle glow, expert-tool density.
- **FR-034**: Visual style MUST NOT use fantasy ornaments such as parchment textures,
  medieval flourishes, skull motifs, or game-HUD decoration.

**Accessibility (baseline)**:

- **FR-035**: All interactive controls (steppers, toggles, buttons, selectors) MUST
  be reachable and operable with keyboard alone.
- **FR-036**: Each modifier toggle's active / inactive state MUST be conveyed by more
  than colour alone (e.g., switch position and label) so colour-blind users can
  determine state.

**Iteration & layout stability**:

- **FR-037**: The page layout established in FR-001 through FR-005 (top bar, four-
  card horizontal row, full-width summary panel) is FROZEN for v1 and subsequent
  patches. Future iterations MAY refine column content, modifier sets, and math,
  but MUST NOT add a fifth card, split an existing card, or restructure the
  summary panel.
- **FR-038**: Any WHFB 8th Edition rule, modifier, or interaction that cannot be
  expressed inside the existing layout (within an existing card's stat inputs,
  modifier toggles, or the summary panel) MUST be captured in
  `future-rules-backlog.md` in this feature directory. The backlog is the
  triage queue for layout-affecting rules; nothing on it is implemented in v1
  unless it can be reshaped to fit the frozen layout.

### Key Entities

- **Calculator Bucket**: One of four calculation steps (To Hit, To Wound, Armour
  Save, Ward Save). Each has its own stat inputs, modifier list, current required
  roll, and probability text.
- **Modifier**: A named situational effect inside a Calculator Bucket. Has a label
  (e.g., "Charging"), a numeric effect (e.g., +1, -1, 6++), and an active / inactive
  state.
- **Stat Input**: A numeric value scoped to a Calculator Bucket (e.g., Attacker WS,
  Strength, base Armour Save). Adjusted via stepper or selector.
- **Combat Sequence**: The ordered display of all four buckets' current required
  rolls.
- **Estimated Outcome**: Aggregate metrics derived from all four buckets — chance of
  unsaved wound (percentage) and expected unsaved wounds (decimal).
- **Preset**: A named, shareable configuration of stats + modifiers across all four
  buckets. Placeholder concept in v1; the data model is reserved but no presets ship.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: A first-time visitor at default state recognises the page as a
  Warhammer-style dice tool within 5 seconds of landing, based solely on the visible
  card titles, the "REQUIRED ROLL" labelling, and the chained combat-sequence summary.
- **SC-002**: A player can configure all four calculator cards (adjust stats and
  toggle at least two modifiers per card) and read the resulting required-roll values
  without scrolling on a 1280-px-wide desktop viewport.
- **SC-003**: After any change to a card's stat inputs or modifier toggles, the
  card's result panel and the bottom summary panel both update within one
  user-perceivable frame (no visible lag).
- **SC-004**: A single "Reset All" action returns every card's stats and modifier
  toggles to their documented defaults — verifiable by re-reading every card and
  confirming default values match FR-013, FR-016, FR-019, FR-022.
- **SC-005**: 100% of interactive controls (steppers, toggles, top-bar buttons, save
  selectors) are reachable and operable using a keyboard alone.
- **SC-006**: When a modifier is active, a colour-blind user can identify its state
  from non-colour cues (switch position, label) at least as reliably as from colour.
- **SC-007**: A reviewer comparing the rendered page side-by-side with the supplied
  reference design (`.artifacts/screenshots/image.png`) confirms structural parity:
  every named region (top bar with all four right-side controls, four-card row in
  the documented order, summary panel with both halves) is present and ordered as
  in the reference.

## Assumptions

- The product is a single-user desktop tool. No multiplayer, no shared sessions, no
  account system in v1.
- All page state is in-memory; reloading the page resets to defaults.
- The four core dice steps (To Hit, To Wound, Armour Save, Ward Save) ship in v1
  with the real WHFB 8th Edition rules encoded — chart lookups, sign convention,
  Strength-driven AS penalty, ward-saves-never-modified, natural-1 / natural-6
  rules, and 1+ / unrollable boundary handling per FR-T01..FR-T05. Canonical
  rules source: <https://8th.whfb.app/>. What "rules engine" still means in this
  spec — and is deferred to a follow-up — is the broader system that decides
  WHICH modifiers apply automatically (army-specific rules, magic items, special
  unit abilities, conditional spell effects). In v1 the player toggles these by
  hand.
- "Load Preset" ships as a non-functional placeholder — visible and focusable, with
  an empty list (or non-mutating items). The preset persistence model is out of
  scope for v1.
- "Share" and "Settings" ship as non-functional placeholders (visible, clickable, no
  side effects).
- Cross-card linking is intentionally minimal in v1: only the Strength → Armour
  Save penalty flows automatically (per FR-018a). All other cross-card behaviour
  (e.g., S vs T driving the To Wound threshold) waits for the WHFB 8th Edition
  rules engine.
- Out-of-range required rolls display per FR-T05: "1+" floor for trivially-easy
  in-range targets, "—" with "No save" / "No ward" / "Auto-fail" copy for
  unrollable. Probabilities stay bounded to `[1/6, 5/6]` for in-range targets via
  the WHFB natural-1 / natural-6 rules.
- Desktop is the priority target. The grid MAY collapse to fewer columns at narrower
  widths, but no mobile-specific layout work is required for v1.
- The visible font (Inter, already bundled in the project) is acceptable as a
  substitute for any specific font shown in the reference image; visual parity does
  not require font matching.
- The four-card layout is frozen for v1 and subsequent patches (FR-037). Polishing
  passes will rework column content and math but not the layout. WHFB rules that
  do not fit the layout are deferred to `future-rules-backlog.md` in this feature
  directory (FR-038); they are NOT a v1 deliverable.
