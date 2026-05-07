# Scope-Discipline Requirements Quality Checklist

**Purpose**: Validate that the frozen-layout discipline (FR-037) and backlog escape valve (FR-038) are written tightly enough that future patches don't silently erode the layout, and that "what's in v1 vs what's deferred" is unambiguous to a reviewer.
**Created**: 2026-05-06
**Feature**: [spec.md](../spec.md)
**Audience**: Author self-check before `/speckit-implement`. Each item asks whether the boundary _is documented_ — not whether the implementation respects it.

## Requirement Completeness

- [ ] CHK001 Is the four-card layout exhaustively enumerated (top bar + 4 cards in named order + summary panel) so "the layout" has zero ambiguity? [Completeness, Spec §FR-001..FR-005]
- [ ] CHK002 Is FR-037's "frozen layout" enumeration complete (no fifth card; no card splits; no summary panel restructure; no new top-level page regions)? [Completeness, Spec §FR-037]
- [ ] CHK003 Are the explicit non-functional placeholders (Load Preset, Share, Settings) documented as v1 no-ops with no state side-effects? [Completeness, Spec §FR-029 / FR-030]
- [ ] CHK004 Is the only allowed cross-card link (Strength → Armour Save penalty) explicitly the only one — and is the absence of all other cross-card links explicit? [Completeness, Spec §FR-018a + Edge Cases]
- [ ] CHK005 Is the deferred-scope catalogue listed in the spec and mirrored in `future-rules-backlog.md` (army books, magic items, special unit abilities, conditional spell effects, shooting BS chart)? [Completeness, Spec §FR-032 / FR-038]

## Requirement Clarity

- [ ] CHK006 Is "non-functional placeholder" clearly distinguishable from "functional but optional" so a reviewer can sort UI elements correctly? [Clarity, Spec §FR-029 / FR-030]
- [ ] CHK007 Is "broader rules-engine" defined with concrete examples so a future PR can answer "does this go into v1 or into the backlog"? [Clarity, Spec §FR-032]
- [ ] CHK008 Is the boundary between "polish patch" (allowed in Phase 6) and "layout change" (forbidden) defined with concrete examples? [Clarity, Spec §FR-037]
- [ ] CHK009 Is "the layout" defined as the structure (regions, ordering, grouping) rather than the styling (spacing, color, typography), so polish stays unblocked? [Clarity, Tasks T042]
- [ ] CHK010 Is the "frozen for v1 and subsequent patches" duration pinned (until what event does the freeze lift — a layout-iteration spec? a major version?)? [Gap]

## Requirement Consistency

- [ ] CHK011 Does the spec's deferred-scope list match the future-rules-backlog's "Known candidates to evaluate later"? [Consistency]
- [ ] CHK012 Are FR-037 (frozen layout) and FR-038 (backlog escape valve) mutually consistent — one names the constraint, the other names the escape valve? [Consistency, Spec §FR-037 / FR-038]
- [ ] CHK013 Is the constitution's Principle V (YAGNI / No Preemptive Abstraction) consistent with FR-037's frozen-layout discipline (both prevent scope creep, but from different angles — YAGNI on abstractions, FR-037 on UI structure)? [Consistency, Constitution §V]
- [ ] CHK014 Is the "Strength → AS only cross-card link" explicit in spec, plan, data-model, AND tasks (not silently re-introduced in any of them)? [Consistency]

## Boundary Enforcement

- [ ] CHK015 Is there an explicit rule in tasks.md Phase 6 (Polish) saying "NO restructuring during polish — capture in `future-rules-backlog.md` instead"? [Coverage, Tasks Notes section]
- [ ] CHK016 Is there an explicit instruction that adding a fifth card requires a layout-iteration spec, not a direct edit to this feature? [Coverage, Spec §FR-037]
- [ ] CHK017 Is the workflow "we want to add X but it doesn't fit" documented (capture in backlog → triage → schedule layout-iteration spec)? [Coverage, future-rules-backlog.md]
- [ ] CHK018 Is there a documented review prompt for PRs touching `pages/calculator/` or `features/dice-calculator/` along the lines of "does this change the page-level region structure"? [Gap]

## Acceptance Criteria & Measurability

- [ ] CHK019 Can the frozen-layout claim be objectively verified (e.g., a snapshot test or a grep that catches new top-level page regions)? [Measurability]
- [ ] CHK020 Can the backlog routing be verified — is there a way to detect a WHFB rule that's been implemented but never logged in `future-rules-backlog.md` triage? [Gap]
- [ ] CHK021 Are SC-007's "structural parity" criteria specific enough to fail when a region is added or split, vs only when visual polish drifts? [Measurability, Spec §SC-007]

## Backlog Hygiene

- [ ] CHK022 Is the backlog's entry format documented (State / Source / Why / Disposition / Captured)? [Completeness, future-rules-backlog.md]
- [ ] CHK023 Are existing known-deferred items pre-populated in the backlog to seed triage? [Completeness, future-rules-backlog.md]
- [ ] CHK024 Is the canonical WHFB rules source URL referenced in the backlog so future entries can link to the rule they're implementing? [Completeness, future-rules-backlog.md]
- [ ] CHK025 Are the backlog's triage states (Inbox / Fits with reshaping / Layout change required / Out of scope) defined with a concrete rule for each? [Clarity, future-rules-backlog.md]

## Notes

- This checklist guards _scope discipline_, not implementation correctness. The frozen-layout directive is the project's main risk surface for future drift.
- A `[Gap]` here is more serious than in other checklists, because once scope erodes, the layout becomes harder to defend without an explicit policy statement to point to.
- Items CHK010 (freeze duration), CHK018 (PR review prompt), and CHK020 (backlog-routing CI check) are the only true policy gaps; the rest validate that existing policy is _written down_, not _practiced_.
