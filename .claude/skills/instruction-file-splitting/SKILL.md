---
name: instruction-file-splitting
description: Splits instruction-heavy markdown (SKILL.md, CLAUDE.md, AGENTS.md, rule sections in READMEs) before it crosses ~300 lines, the threshold where models start silently compressing content and dropping rules. Use whenever writing or editing a markdown file whose content is rules/conventions/instructions for an agent and the file is at, near, or past 300 lines, OR when an edit would push it past 300. Goal: every rule in the file gets honored, every time.
---

# Instruction-File Splitting

## Iron rules (top of file, never skip)

1. If an instruction-heavy markdown file is at 280+ lines, or your edit would push it past 300, **split it before saving**.
2. The parent file stays under 150 lines and routes to sub-files via a pointer table with concrete "read when" hints.
3. Hard rules (MUST / NEVER / ALWAYS) live in the parent, at the top, before any prose. Never in sub-files only.
4. No rule is duplicated across parent and sub-file. One home per rule.

## Why 300 lines

Below ~300 lines, every rule in an instruction file survives in the model's working understanding. Above it, the model starts treating later content as background and quietly drops rules — usually the deeply nested ones, mid-paragraph ones, or the ones that look like recap. The failure is silent: nothing tells you a rule got skipped, you just notice later that the agent did not follow it.

Splitting via progressive disclosure keeps the always-loaded surface small enough that nothing gets compressed, and pulls in depth on demand.

## When to split

Trigger a split when **any** of these is true for an instruction file:

| Trigger                                        | Why                                                     |
| ---------------------------------------------- | ------------------------------------------------------- |
| File is at 280+ lines                          | Crossing the cliff is imminent                          |
| Your edit pushes it past 300                   | Don't ship a file that crosses the threshold            |
| File is already past 300 and you're editing it | Take the opportunity; don't compound                    |
| Bullet nesting exceeds 3 levels anywhere       | Deepest level reliably gets dropped                     |
| Same hard rule appears in two sections         | Indicates the file has organically grown past coherence |

If none apply, do not split. Premature splitting fragments rules that belong together and is itself a way to lose rule-honoring.

## How to split

### 1. Keep the parent as a router

The top-level file (SKILL.md, CLAUDE.md, AGENTS.md) stays short — aim under 150 lines. Its job:

- State the 1–3 iron rules at the very top
- Cover the common-case workflow in plain imperative voice
- Provide a pointer table to sub-files for depth

### 2. Extract by topic, not by length

Each sub-file owns one coherent concept — one framework, one anti-pattern family, one workflow stage. Never split a single rule across files. Never split chronologically ("part 1, part 2").

### 3. Place sub-files under `references/`

```
.claude/skills/<name>/
├── SKILL.md           ← parent, stays small
├── references/
│   ├── mocking.md
│   ├── refactor.md
│   └── anti-patterns.md
├── scripts/           ← executable helpers, if any
└── assets/            ← templates/fixtures, if any
```

For non-skill instruction files (CLAUDE.md, AGENTS.md), the equivalent is a sibling `docs/` or `.claude/docs/` folder — the structure is the same; only the path changes.

### 4. Write concrete "read when" pointers

Each sub-file gets one row in the parent's pointer table. The "Read when" column is the trigger that tells the agent to load it. Write it as a **concrete situation**, not a topic name.

| Bad                                 | Good                                                                                                                                       |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `mocking.md` — more on mocking      | `mocking.md` — read before adding any mock; covers when mocks are allowed, boundary rules, and the test-the-mock-not-the-code anti-pattern |
| `refactor.md` — refactoring details | `refactor.md` — read after GREEN, before starting the next RED                                                                             |
| `errors.md` — error handling        | `errors.md` — read when you're about to add a try/catch or throw, or when reviewing error paths                                            |

Vague hints cause two failure modes: the agent loads every reference (wasting context) or loads none (missing rules). Specific hints route correctly.

### 5. Recurse if needed

If a `references/foo.md` itself approaches 300 lines, apply the same split inside it. Sub-references go in the same folder and get linked from the parent reference's own pointer table.

## Pointer table template (drop into the parent)

```markdown
## Detail references

| File                    | Read when                                 |
| ----------------------- | ----------------------------------------- |
| references/<topic-1>.md | <concrete situation that triggers a load> |
| references/<topic-2>.md | <concrete situation>                      |
| references/<topic-3>.md | <concrete situation>                      |
```

## Anti-patterns

- **Splitting just to hit a number.** A tight 250-line file is fine. Splitting it fragments coherent rule sets and adds routing overhead.
- **Vague pointer hints.** "See references/x.md for more" — the model will not load this. State the situation.
- **Duplicating rules.** A rule in two places means the model will summarize them as one and lose nuance. Pick one home.
- **Hiding hard rules in sub-files.** Anything that must NEVER be skipped belongs in the parent, top-of-file. Sub-files contain specifics, examples, and edge cases — not iron rules.
- **Splitting by author or chronology.** "part 1, part 2" is not a topic. Split by what the agent needs to know in a given situation.

## Pre-save checklist

- [ ] Parent under 150 lines (or under 300 if no clean split is possible)?
- [ ] Iron rules at the top, before any philosophy or examples?
- [ ] No bullet nesting deeper than 3 levels?
- [ ] Every sub-file has a concrete "read when" pointer in the parent?
- [ ] No rule appears in two places?
- [ ] Each sub-file is itself under 300 lines?

If any box is unchecked, don't save yet. Fix it first.
