# UX Requirements Quality Checklist: WHFB 8th Edition Dice Calculator UI

**Purpose**: Validate that UX requirements (visual hierarchy, layout density, dark theme, controls, reference fidelity) are written tightly enough to implement without guessing.
**Created**: 2026-05-06
**Feature**: [spec.md](../spec.md)
**Audience**: Author self-check before `/speckit-implement`. Each item asks whether the spec / plan / data-model / research _writes down_ the answer — not whether the implementation behaves correctly.

## Requirement Completeness

- [ ] CHK001 Are visual hierarchy requirements defined for each of the four card regions (header, inputs, modifiers, result)? [Completeness, Spec §FR-005]
- [ ] CHK002 Is the order of the four cards (To Hit → To Wound → Armour Save → Ward Save) pinned across spec, plan, and tasks? [Completeness, Spec §FR-002]
- [ ] CHK003 Are the per-card lucide icons assigned (Swords / Flame / Shield / Sparkles)? [Completeness, Research §2.2]
- [ ] CHK004 Is the responsive collapse behaviour below desktop widths (4-col → 2-col → 1-col) explicitly documented or left as "MAY collapse"? [Completeness, Spec §FR-004]
- [ ] CHK005 Are header subtitle strings for each card pinned (or are they author's choice)? [Gap]
- [ ] CHK006 Is the info-icon tooltip body text specified for each card, or only the affordance? [Gap]
- [ ] CHK007 Is the visual treatment of the "REQUIRED ROLL" label (size, weight, color, casing) specified? [Completeness, Spec §FR-006]
- [ ] CHK008 Is the visual treatment of the probability description text (size, color contrast vs result number) specified? [Completeness, Spec §FR-006]

## Requirement Clarity

- [ ] CHK009 Is "premium dark SaaS / tactical analytics" quantified — e.g., specific spacing scale, border radius, border width? [Clarity, Spec §FR-033]
- [ ] CHK010 Is "subtle glow" pinned to a specific CSS treatment (color, opacity, blur radius, spread)? [Clarity, Spec §FR-033 / Research §2.3]
- [ ] CHK011 Is "compact spacing" pinned to specific Tailwind spacing tokens or px values? [Clarity, Spec §FR-033]
- [ ] CHK012 Is "thin borders" pinned to a specific border width (1px? hairline?) and color token? [Clarity, Spec §FR-033]
- [ ] CHK013 Is the "bright green accent" for active toggles pinned to a specific color value? [Clarity — pinned at `#22c55e` in Research §2.3]
- [ ] CHK014 Is the "gold/orange accent" for the result number pinned to a specific color value? [Clarity — pinned at `#f59e0b` in Research §2.3]
- [ ] CHK015 Is the typography for the large dice target ("4+") pinned with font weight, size, and tabular-nums treatment? [Gap]

## Requirement Consistency

- [ ] CHK016 Are toggle-row layouts described identically across the four cards (label position, badge position, switch alignment)? [Consistency, Spec §FR-008]
- [ ] CHK017 Are NumberStepper layouts (− / value / +) consistent between the To Hit and To Wound cards? [Consistency, Spec §FR-007]
- [ ] CHK018 Is the SaveSelect appearance consistent between Armour Save and Ward Save (both use the same shadcn `Select`)? [Consistency, Data-model §6]
- [ ] CHK019 Is the Combat Sequence summary's "→" separator pinned (specific glyph, spacing) for visual consistency with the cards? [Clarity, Spec §FR-024]
- [ ] CHK020 Is the result-panel treatment consistent between cards (gold accent, "REQUIRED ROLL" label, probability copy structure)? [Consistency, Spec §FR-006 / FR-010]

## Acceptance Criteria Quality

- [ ] CHK021 Can "structural parity" (SC-007) be objectively verified by walking the FR-001..FR-005 region list, or is it inherently subjective? [Measurability, Spec §SC-007]
- [ ] CHK022 Can "no scrolling on a 1280-px-wide desktop viewport" (SC-002) be objectively verified by an automated viewport test? [Measurability, Spec §SC-002]
- [ ] CHK023 Can "update within one user-perceivable frame" (SC-003) be measured without a perf benchmark, or is it implicitly satisfied by O(1) compute? [Measurability, Spec §SC-003]

## Scenario & Edge-Case Coverage

- [ ] CHK024 Is the empty-state UX of "Load Preset" (no items in the dropdown) specified, or left unspecified? [Edge Case, Spec §FR-029]
- [ ] CHK025 Are first-focus-on-load expectations defined (which control receives focus when the page mounts)? [Gap]
- [ ] CHK026 Are reduced-motion expectations defined for any toggle / modifier transitions? [Gap]
- [ ] CHK027 Is the visual treatment of the "—" / "No save" / "No ward" / "Auto-fail" boundary states specified beyond the literal text? [Edge Case, Spec §FR-T05]
- [ ] CHK028 Is dark-mode contrast for the gold-orange result number against the dark card background pinned to a measurable ratio? [Gap, Spec §FR-010]

## Notes

- Check items off as you confirm each in the spec / plan / research / data-model.
- Items marked `[Gap]` indicate the requirement is _missing_ from the artifacts; either pin it before implementation or accept a pre-implementation TODO.
- This checklist is _not_ a behavioural test list — it asks whether the requirements themselves are written tightly enough.
