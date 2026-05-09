# WHFB Rules-Math Requirements Quality Checklist

**Purpose**: Validate that the WHFB 8th Edition dice-math requirements (charts, sign convention, cross-card link, boundary handling) are written tightly enough that a correct implementation is forced — and that incorrect ones (especially the FR-T02 double-counting trap) are fenced off.
**Created**: 2026-05-06
**Feature**: [spec.md](../spec.md)
**Audience**: Author self-check before `/speckit-implement`. Each item asks whether the spec / plan / research / data-model _writes down_ the rule — not whether the implementation produces the right number.

## Requirement Completeness

- [ ] CHK001 Are the To Hit chart bounds (Attacker WS 1–10 × Defender WS 1–10) explicitly stated? [Completeness, Spec §FR-T01 / Research §1.1]
- [ ] CHK002 Are the To Wound chart bounds (Strength 1–10 × Toughness 1–10) explicitly stated? [Completeness, Spec §FR-T02 / Research §1.2]
- [ ] CHK003 Are all 100 cells of the To Hit chart pinned in research, with no `…` continuation? [Completeness, Research §1.1]
- [ ] CHK004 Are all 100 cells of the To Wound chart pinned in research, with no `…` continuation? [Completeness, Research §1.2]
- [ ] CHK005 Is the natural-1-always-fails rule documented for hits, wounds, armour saves, and ward saves? [Completeness, Spec §FR-T01..FR-T04]
- [ ] CHK006 Is the natural-6-always-hits rule documented for the To Hit card? [Completeness, Spec §FR-T01]
- [ ] CHK007 Is the "save can never be better than 1+" rule documented? [Completeness, Spec §FR-T03 / FR-T04]
- [ ] CHK008 Is the "ward saves are never modified by Strength" rule documented? [Completeness, Spec §FR-T04]
- [ ] CHK009 Is the Strength → AS penalty formula `-max(0, effective_Strength - 3)` documented? [Completeness, Spec §FR-018a / FR-T03]

## Requirement Clarity

- [ ] CHK010 Is FR-018b's sign convention (positive lowers required roll, negative raises) unambiguous and exemplified? [Clarity, Spec §FR-018b]
- [ ] CHK011 Is the FR-T02 no-double-count rule pinned with the exact "EXCLUDING Strength-source modifiers" wording so the modifier-sum and effective-Strength steps don't both apply the same modifier? [Clarity, Spec §FR-T02]
- [ ] CHK012 Is "effective Strength" defined as `base Strength + sum(active Strength-source modifiers)` precisely, with the Strength-source set fully enumerated (Great Weapon, Halberd, Lance, Strength Buff, Strength Debuff, Wyssan's, Curse/Hex)? [Clarity, Data-model §2.3, Spec §FR-T02]
- [ ] CHK013 Is the boundary display copy ("—" + "No save" / "No ward" / "Auto-fail") pinned word-for-word so tests and UI match? [Clarity, Spec §FR-T05]
- [ ] CHK014 Is the "1+ floor" treatment specified as both a display value ("1+") and a probability cap (`5/6` because a natural 1 still fails)? [Clarity, Spec §FR-T05]
- [ ] CHK015 Is the unsaved-wound formula `hit × wound × (1 - armour_save) × (1 - ward_save)` explicit and matches FR-026's default outcome? [Clarity, Spec §FR-026]

## Requirement Consistency

- [ ] CHK016 Do FR-018a and FR-T03 use the same wording — "effective Strength" — for the cross-card penalty input? [Consistency, Spec §FR-018a / FR-T03]
- [ ] CHK017 Do the documented per-card default percentages match the d6 formula (4+ → 50.0%, 3+ → 66.7%, 5+ → 33.3%)? [Consistency, Spec §FR-013 / FR-016 / FR-019 / FR-022]
- [ ] CHK018 Does the default Estimated Outcome (14.8% / 0.148, FR-026) equal `0.5 × 0.667 × 0.667 × 0.667` to one decimal place? [Consistency, Spec §FR-026]
- [ ] CHK019 Is "Parry Ward (6++) lives only on Ward Save" stated consistently in spec FR-018, FR-021, data-model §1.4, and the future-rules-backlog? [Consistency]
- [ ] CHK020 Is the cross-card link unidirectional (Strength → AS) and explicitly _not_ bidirectional (AS → Strength) anywhere? [Consistency, Spec §FR-018a]

## Acceptance Criteria & Measurability

- [ ] CHK021 Are concrete chart-lookup test cases listed (corners, diagonals) so unit tests can lock the chart values? [Measurability, Tasks T014]
- [ ] CHK022 Is the FR-T02 no-double-count rule paired with at least one explicit test case (e.g., S=4 / T=4 with Halberd active → 3+, NOT 2+)? [Measurability, Tasks T014]
- [ ] CHK023 Is the unsavedWoundProbability acceptance value pinned to 0.148 ± a tolerance for a stable test? [Measurability, Tasks T014]

## Scenario & Edge-Case Coverage

- [ ] CHK024 Is the modifier-saturation case (raw target outside [1, 6] range) covered by `clampAndFormat`, with both the floor and the unrollable branch tested? [Coverage, Spec §FR-T05]
- [ ] CHK025 Are extreme stat combinations (S 1 vs T 10 → "cannot wound" display; A_WS 10 vs D_WS 1 → 3+) covered explicitly? [Edge Case, Research §1.1 / §1.2]
- [ ] CHK026 Is the "no save scenario" (AS modifiers + Strength penalty drive target ≥ 7) covered with the corresponding Combat Sequence summary copy ("—")? [Edge Case, Spec §FR-T05]
- [ ] CHK027 Is the multi-modifier accumulation case covered (multiple Strength-source modifiers active simultaneously, e.g., Halberd + Strength Buff)? [Coverage, Gap]
- [ ] CHK028 Is the cumulative-AS-modifier case covered (Shield + Mounted + Cover + AP all active)? [Coverage, Gap]

## Boundary Discipline

- [ ] CHK029 Is the deferred scope ("army books, magic items, special unit abilities, conditional spell effects, shooting BS chart") explicitly named so reviewers can sort future asks? [Clarity, Spec §FR-032 / FR-038]
- [ ] CHK030 Does FR-T05 explicitly say "no probability ever exceeds 5/6 for in-range targets" (because of natural-1 failure)? [Clarity, Spec §FR-T05]

## Notes

- Items mark whether the _rule itself_ is written tightly enough — not whether the resulting code computes correctly.
- `[Gap]` markers indicate a missing requirement that should be pinned before implementation or accepted as a known TODO.
- The full canonical rules source is <https://8th.whfb.app/> (also stored in user memory as `reference_whfb_rules.md`).
