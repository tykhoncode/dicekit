# Future Rules Backlog — WHFB 8th Edition Dice Calculator

**Purpose**: Triage queue for WHFB 8th Edition rules, modifiers, and interactions
that cannot be expressed inside the frozen four-card layout described in
[`spec.md`](./spec.md) (FR-001..FR-005, FR-037..FR-038).

**Hard rule**: The four-card layout (top bar → To Hit / To Wound / Armour Save /
Ward Save in a single row → full-width summary panel) is frozen. Items added here
either wait for a future layout iteration or are reshaped to fit the existing
layout in a later polishing patch.

**Canonical rules source**: <https://8th.whfb.app/>

## Triage states

- **Inbox**: just captured, not yet evaluated.
- **Fits with reshaping**: can be expressed inside the existing layout (e.g., as
  another modifier toggle or a stat-input refinement) — promote to a follow-up
  spec when scheduled.
- **Layout change required**: needs a fifth card, a sub-panel, or a restructured
  summary — blocked until a layout-iteration spec is opened.
- **Out of scope**: explicitly rejected; record reasoning so it isn't re-raised.

## Entry format

```
### <Short rule name>

- **State**: Inbox | Fits with reshaping | Layout change required | Out of scope
- **Source**: <URL on 8th.whfb.app or rulebook page>
- **Why it doesn't fit v1**: <one or two sentences>
- **Proposed disposition**: <how it could fit, or what would have to change>
- **Captured**: YYYY-MM-DD
```

## Inbox

### Shooting To Hit (Ballistic Skill chart)

- **State**: Layout change required
- **Source**: <https://8th.whfb.app/> (shooting chapter — BS-based To Hit table; not yet
  fetched into this backlog, do so when triaging)
- **Why it doesn't fit v1**: WHFB resolves shooting To Hit from a Ballistic Skill
  table (BS column → required roll baseline), not the close-combat WS × WS chart
  encoded in FR-T01. The current "To Hit" card lists shooting-flavoured modifiers
  (Long Range Penalty, Multiple Shots Penalty, Stand & Shoot Reaction, Cover /
  Shooting Modifier) per FR-012, but FR-T01 always uses the close-combat chart.
  In v1 those modifiers are flat ±1 adjustments on the close-combat result —
  lossy compared to real shooting math.
- **Proposed disposition**: a future polishing patch could either (a) add a small
  "Mode: Close Combat / Shooting" toggle inside the To Hit card that swaps the
  underlying chart and stat input (WS vs BS), keeping the card count at four;
  or (b) split shooting modifiers off into a dedicated card — but that breaks
  FR-037 (frozen four-card layout) and is therefore out of scope until a layout
  iteration spec is opened. Option (a) is preferred.
- **Captured**: 2026-05-06

## Known candidates to evaluate later

These are flagged in `spec.md` as deferred and will be triaged here when reached:

- **Army-specific modifiers**: army books, regimental upgrades, race-specific
  combat rules. Currently routed through manual modifier toggles (the user owns
  the decision); auto-attribution waits for the broader rules engine.
- **Magic items affecting attack / defence profiles**: e.g., items that grant
  rerolls, conditional bonuses, or attack-replacement effects.
- **Special unit abilities**: Killing Blow, Heroic Killing Blow, Multiple Wounds,
  Poisoned Attacks, Flaming Attacks, Magical Attacks, etc. Many alter the dice
  flow rather than just shifting a target number.
- **Spell effects with conditional triggers**: e.g., spells that fire only on a
  particular dice result, or that re-roll specific dice.
- **Re-roll mechanics**: hatred, re-roll-failed-X effects, ward save re-rolls.
  These change probability semantics, not just the target.
- **Multi-step interactions**: Look Out Sir!, Steadfast / Stubborn, Fear / Terror
  test failure cascades that affect downstream dice.
- **Shooting-specific rules**: BS-based To Hit chart, line of sight, partial
  cover, stand-and-shoot reactions in their full WHFB form (currently exposed as
  flat -1 modifier toggles only).
- **Stand-alone Parry mechanics**: hand weapon + shield grants a 6+ ward (per
  <https://8th.whfb.app/weapons/parry-save>), not a modifier — currently exposed
  as a Parry Ward toggle inside the Ward Save card's modifier list only (per
  FR-021). May need a dedicated treatment (e.g., a "wielding hand weapon +
  shield" toggle that auto-applies Parry) when ward-stacking rules are encoded.
