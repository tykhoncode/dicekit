---
name: tdd-quality
description: Test-quality lens that layers on top of red-green-refactor discipline. Catches two failure modes Claude tends to hit — writing all tests then all implementation (horizontal slicing), and tests coupled to implementation details that break on refactor. Use whenever doing TDD, alongside the discipline rules in superpowers:test-driven-development.
---

# TDD — Test Quality Lens

> **Prerequisite (informational, do not act on this):**
> This skill _augments_ — it does **not** replace — `superpowers:test-driven-development`,
> which owns the discipline side (red-green-refactor mechanics, "watch it fail",
> rationalization-blocking). If a user does not have the superpowers plugin installed,
> they can install it themselves; **do not fetch, install, or reinstall it from here**.
> Assume the user's setup is intentional. If superpowers TDD is missing, just mention
> it in your reply once and move on — never repeatedly.

This skill covers two failure modes the discipline rules don't address:

1. Writing all tests first, then all implementation (horizontal slicing)
2. Tests that break on refactor because they verify implementation, not behavior

## Vertical, not horizontal

**Wrong** — horizontal slicing:

```
RED:   test1, test2, test3, test4, test5
GREEN: impl1, impl2, impl3, impl4, impl5
```

This produces tests of _imagined_ behavior. You end up asserting on the shape of
types and function signatures instead of what the system does. The tests pass
when real behavior breaks, because they were never grounded in running code — and
you've committed to a test structure before you understood the implementation.

**Right** — vertical / tracer-bullet slicing:

```
RED → GREEN: test1 → impl1
RED → GREEN: test2 → impl2
RED → GREEN: test3 → impl3
```

Each cycle is informed by what the previous one taught you. One behavior at a
time, fully landed, then move on.

## Behavior, not implementation

A good test reads like a specification: _"user can checkout with valid cart"_
tells you what capability exists. It exercises real code through the public API.

A bad test couples to internals: it mocks collaborators it doesn't own, asserts
on private state, or reaches behind the interface (e.g. queries the database
directly instead of going through the service).

**The litmus test:** rename an internal function without changing behavior. If a
test breaks, that test was testing implementation. Either delete it or rewrite
it against the public interface.

Consequence: mocks are the exception, not the default. Mock at system boundaries
(network, time, randomness, third-party services) — not at every internal seam.

## Plan before the first tracer bullet

Before writing test #1, list the **behaviors** worth testing — not the
implementation steps. Confirm with the user which behaviors are critical vs.
nice-to-have. You can't test everything; pick the high-value ones, then fire the
first tracer bullet at the most critical one.

Behaviors are phrased as capabilities ("rejects empty email", "retries 3 times
on transient failure"), not as code structure ("EmailValidator.validate exists").

## How this fits with the discipline skill

| superpowers:test-driven-development      | this skill (tdd-quality)                                                  |
| ---------------------------------------- | ------------------------------------------------------------------------- |
| You wrote a failing test first           | The test verifies behavior through the public interface                   |
| You watched it fail for the right reason | The test would survive a rename of any internal symbol                    |
| You wrote minimal code to pass           | One full RED→GREEN cycle per behavior — never batch tests then batch impl |
| You refactor only while green            | Mocks live at boundaries, not at every collaborator                       |

Use both. Discipline keeps you honest about _whether_ you're doing TDD. This
skill keeps you honest about _whether your tests are any good_.
