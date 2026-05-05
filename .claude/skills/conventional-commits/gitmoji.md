# Gitmoji Reference

This document maps [gitmoji.dev](https://gitmoji.dev/) emojis onto the conventional commit types used in this project. Emoji is **cosmetic** — it does not change release-please behavior. The conventional `type:` is what triggers releases. Emoji adds visual scanning cues to `git log`.

## Format

```
<emoji> <type>[optional scope]: <description>
```

- One emoji, at the start of the title.
- Single space between emoji and type.
- Use **Unicode** (`✨`) — it's more readable in `git log` than `:sparkles:`. The shortcode form is fine if your tooling renders it.
- The emoji is optional. A bare `feat: add x` is still valid. Skipping the emoji is better than picking a wrong one.

## Picking an emoji: the rule

1. **Start from the conventional type** (`feat`, `fix`, `docs`, …). The type is mandatory.
2. **Project-specific emojis come first** — if the change touches a skill, an MCP server, or the agent harness, use the project-convention emoji (see the next section), not the generic type emoji.
3. **Otherwise pick the most specific emoji** that fits the type. If a variant matches the nuance (security fix, hotfix, dependency bump), prefer it.
4. **One emoji only.** Don't stack `🐛🔒️ fix:` or `🤖🧩 feat:`.
5. **When in doubt**, use the primary emoji for the type, or omit it.

## Project conventions (this repo)

Three project-specific emojis take priority over the generic type emojis whenever they apply. They identify changes to the agent stack itself — easy to scan in `git log` when reviewing what's been built around Claude Code.

| Emoji | Scope                                                                              |
| ----- | ---------------------------------------------------------------------------------- |
| 🧩    | **Skill** — anything under `.claude/skills/<name>/` (add, edit, remove, rename)    |
| 🔌    | **MCP server** — installing, configuring, upgrading, or removing an MCP server     |
| 🤖    | **Agent generic** — `CLAUDE.md`, `AGENTS.md`, hooks, harness `settings.json`, etc. |

**Decision rule:** pick the _most specific_ of these that applies. A skill change is 🧩, never 🤖. Don't stack.

**Examples:**

```
🧩 feat: add /grill-me skill
🧩 docs: extend conventional-commits skill with gitmoji
🧩 refactor: split large skill file into types.md + examples.md
🧩 chore: rezip grill-me skill bundle

🔌 chore: configure supabase mcp server
🔌 deps: upgrade @figma/mcp-server to v0.4
🔌 fix: correct supabase mcp env var name

🤖 docs: clarify path alias rule in claude.md
🤖 chore: add posttooluse prettier hook
🤖 chore: enable nouncheckedindexedaccess instruction
```

**When NOT to use them:** if the dominant nature of the change isn't agent-shaped, prefer the standard emoji. A typo fix in a skill's docs is `✏️ docs:`, not `🧩 docs:`. A pure architectural reshuffle of instruction files is `🏗️ refactor:`.

**Note:** 🧩 / 🔌 / 🤖 are project conventions, not part of the official [gitmoji.dev](https://gitmoji.dev/) catalog. Tools that validate against the canonical set may flag them — that's fine; they still render and convey meaning.

## Primary emoji per type

| Type       | Primary emoji | Code                    | When                                               |
| ---------- | ------------- | ----------------------- | -------------------------------------------------- |
| `feat`     | ✨            | `:sparkles:`            | New feature                                        |
| `fix`      | 🐛            | `:bug:`                 | Bug fix                                            |
| `deps`     | ⬆️            | `:arrow_up:`            | Upgrade a dependency (default for deps)            |
| `docs`     | 📝            | `:memo:`                | Docs change                                        |
| `style`    | 🎨            | `:art:`                 | Code style/structure (formatting, no logic change) |
| `refactor` | ♻️            | `:recycle:`             | Refactor without changing behavior                 |
| `test`     | ✅            | `:white_check_mark:`    | Add/update tests                                   |
| `chore`    | 🔧            | `:wrench:`              | Config/tooling change                              |
| `ci`       | 👷            | `:construction_worker:` | CI/build pipeline                                  |
| `perf`     | ⚡️            | `:zap:`                 | Performance improvement                            |
| `build`    | 📦️            | `:package:`             | Build system / bundler                             |
| `revert`   | ⏪️            | `:rewind:`              | Revert a previous commit                           |

## Variants — pick when they're more specific than the primary

### Variants for `fix:`

| Emoji | Code                 | When                                                   |
| ----- | -------------------- | ------------------------------------------------------ |
| 🐛    | `:bug:`              | **Default**. Standard bug fix.                         |
| 🚑️    | `:ambulance:`        | Critical hotfix shipped under pressure.                |
| 🔒️    | `:lock:`             | Security fix (CVE, vulnerability, auth bypass).        |
| 🩹    | `:adhesive_bandage:` | Small, non-critical patch (typo in logic, off-by-one). |
| 🥅    | `:goal_net:`         | Catching/handling errors that previously crashed.      |
| 💚    | `:green_heart:`      | Fixing a broken CI build (still use `ci:` type).       |

### Variants for `feat:`

| Emoji | Code                         | When                                                      |
| ----- | ---------------------------- | --------------------------------------------------------- |
| ✨    | `:sparkles:`                 | **Default**. New feature.                                 |
| 🚸    | `:children_crossing:`        | UX improvement (a new feature whose value is the UX win). |
| ♿️    | `:wheelchair:`               | Accessibility improvement.                                |
| 🌐    | `:globe_with_meridians:`     | i18n / localization.                                      |
| 🛂    | `:passport_control:`         | Authorization, roles, permissions.                        |
| 🚩    | `:triangular_flag_on_post:`  | Feature flag added/updated/removed.                       |
| 🔊    | `:loud_sound:`               | Add logging.                                              |
| 📈    | `:chart_with_upwards_trend:` | Analytics / tracking.                                     |
| 💫    | `:dizzy:`                    | Animations or transitions.                                |
| 💄    | `:lipstick:`                 | UI / styling files (CSS, theme).                          |
| 📱    | `:iphone:`                   | Responsive design.                                        |

### Variants for `deps:`

| Emoji | Code                 | When                                    |
| ----- | -------------------- | --------------------------------------- |
| ⬆️    | `:arrow_up:`         | **Default**. Upgrade a dependency.      |
| ⬇️    | `:arrow_down:`       | Downgrade a dependency.                 |
| 📌    | `:pushpin:`          | Pin a dependency to a specific version. |
| ➕    | `:heavy_plus_sign:`  | Add a new dependency.                   |
| ➖    | `:heavy_minus_sign:` | Remove a dependency.                    |

### Variants for `refactor:`

| Emoji | Code                      | When                                                |
| ----- | ------------------------- | --------------------------------------------------- |
| ♻️    | `:recycle:`               | **Default**. Behavior-preserving refactor.          |
| 🏗️    | `:building_construction:` | Architectural change (module boundaries, layering). |
| 🔥    | `:fire:`                  | Removing code or files.                             |
| ⚰️    | `:coffin:`                | Removing dead code (never reached).                 |
| 🗑️    | `:wastebasket:`           | Deprecating code (marking, not yet removing).       |
| 🏷️    | `:label:`                 | Add/update TypeScript types only.                   |
| 🔇    | `:mute:`                  | Remove logs.                                        |

### Variants for `test:`

| Emoji | Code                 | When                                |
| ----- | -------------------- | ----------------------------------- |
| ✅    | `:white_check_mark:` | **Default**. Add or update tests.   |
| 🧪    | `:test_tube:`        | Add a failing test (TDD red phase). |
| 🤡    | `:clown_face:`       | Mocking/stubbing for tests.         |
| 📸    | `:camera_flash:`     | Snapshot tests.                     |

### Variants for `style:`

| Emoji | Code               | When                                             |
| ----- | ------------------ | ------------------------------------------------ |
| 🎨    | `:art:`            | **Default**. Formatting / structure improvement. |
| 🚨    | `:rotating_light:` | Fixing linter warnings.                          |
| ✏️    | `:pencil2:`        | Typo fix in user-facing strings or docs.         |
| 💬    | `:speech_balloon:` | Updating text content / copy.                    |

### Variants for `chore:`

| Emoji | Code             | When                                                       |
| ----- | ---------------- | ---------------------------------------------------------- |
| 🔧    | `:wrench:`       | **Default**. Config files.                                 |
| 🔨    | `:hammer:`       | Dev scripts (npm scripts, helper scripts).                 |
| 🙈    | `:see_no_evil:`  | Update `.gitignore`.                                       |
| 🧱    | `:bricks:`       | Infrastructure (Docker, k8s, terraform).                   |
| 🧑‍💻    | `:technologist:` | DX improvement (editor config, hooks, tooling ergonomics). |
| 🌱    | `:seedling:`     | Seed/fixture data.                                         |
| 💡    | `:bulb:`         | Update code comments only.                                 |

### Variants for `ci:`

| Emoji | Code                    | When                             |
| ----- | ----------------------- | -------------------------------- |
| 👷    | `:construction_worker:` | **Default**. CI workflow change. |
| 💚    | `:green_heart:`         | Fix a broken CI build.           |

### Variants for `perf:`

| Emoji | Code    | When                                      |
| ----- | ------- | ----------------------------------------- |
| ⚡️    | `:zap:` | **Default**. Any performance improvement. |

### Variants for breaking changes

| Emoji | Code     | When                                                                 |
| ----- | -------- | -------------------------------------------------------------------- |
| 💥    | `:boom:` | Breaking change. **Use with `!`** in the type, e.g. `💥 feat!: ...`. |

## Standalone semantics (rare, prefer the type-mapped variants above)

Use these only when there's a strong reason and the conventional type would be misleading:

| Emoji | Code                    | Meaning                            | Likely type                 |
| ----- | ----------------------- | ---------------------------------- | --------------------------- |
| 🎉    | `:tada:`                | Initial commit                     | `feat:` or `chore:`         |
| 🚧    | `:construction:`        | Work in progress (avoid on `main`) | any                         |
| 🚀    | `:rocket:`              | Deployment                         | `chore:` or `ci:`           |
| 🗃️    | `:card_file_box:`       | Database schema/data               | `feat:` / `fix:` / `chore:` |
| 🦺    | `:safety_vest:`         | Validation code                    | `feat:` / `fix:`            |
| 🔍️    | `:mag:`                 | SEO                                | `feat:` / `fix:`            |
| 🥚    | `:egg:`                 | Easter egg                         | `feat:`                     |
| 👥    | `:busts_in_silhouette:` | Update contributors / authors file | `docs:`                     |

## Decision shortcut

```
Touches the agent stack?  ← check this FIRST
  ├─ A skill (.claude/skills/...)? → 🧩 <type>:
  ├─ An MCP server?                → 🔌 <type>:
  └─ CLAUDE.md / hooks / harness?  → 🤖 <type>:

Bug fix?
  ├─ Security?           → 🔒️ fix:
  ├─ Critical hotfix?    → 🚑️ fix:
  ├─ Tiny patch/typo?    → 🩹 fix:
  └─ Otherwise           → 🐛 fix:

New feature?
  ├─ A11y?               → ♿️ feat:
  ├─ i18n?               → 🌐 feat:
  ├─ UX/affordance?      → 🚸 feat:
  ├─ Pure UI/CSS?        → 💄 feat:  (or style: if no logic)
  ├─ Analytics?          → 📈 feat:
  └─ Otherwise           → ✨ feat:

Dependency change?
  ├─ Upgrade             → ⬆️ deps:
  ├─ Downgrade           → ⬇️ deps:
  ├─ Add new             → ➕ deps:
  ├─ Remove              → ➖ deps:
  └─ Pin                 → 📌 deps:

Refactor?
  ├─ Removing code/files → 🔥 refactor:  (or ⚰️ for dead code)
  ├─ Architecture        → 🏗️ refactor:
  ├─ Types only          → 🏷️ refactor:
  └─ Otherwise           → ♻️ refactor:

Breaking change?       → 💥 <type>!: ...
```

## Common mistakes

❌ Multiple emojis: `✨🚀 feat: ship dashboard`
✅ One: `✨ feat: ship dashboard`

❌ Emoji replacing type: `✨ add dashboard`
✅ Both: `✨ feat: add dashboard`

❌ Wrong-category emoji: `🐛 feat: add validation` (bug emoji on a feature)
✅ Match: `🦺 feat: add validation` or `✨ feat: add validation`

❌ Stacking with breaking marker: `💥🐛 fix!: change error shape`
✅ Just `💥`: `💥 fix!: change error shape`

❌ Emoji in body/footer: keep emoji to the title only.
