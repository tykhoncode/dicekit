---
name: Conventional Commits
description: Guidelines for writing conventional commit messages that follow project standards and trigger automated releases
---

# Conventional Commits Skill

This skill provides comprehensive guidance on writing conventional commit messages for the vm0 project. All commits must follow the Conventional Commits format to ensure consistent history and enable automated versioning via release-please.

Optional [gitmoji](https://gitmoji.dev/) prefixes are supported as a cosmetic visual cue. Emoji never changes release behavior — only the conventional `type:` does.

## Quick Reference

### Format

```
<emoji> <type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

The `<emoji>` is optional. When present it goes first, followed by a single space, then the conventional type.

### Core Rules (STRICT REQUIREMENTS)

1. **Type must be lowercase** - `feat:` not `Feat:` or `FEAT:`
2. **Description must start with lowercase** - `add feature` not `Add feature`
3. **No period at the end** - `fix user login` not `fix user login.`
4. **Keep title under 100 characters** - Be concise (emoji counts toward the limit)
5. **Use imperative mood** - `add` not `added` or `adds`
6. **At most one emoji**, at the very start of the title — never in the body or footer

## Common Types (Quick List)

| Emoji | Type        | Purpose           | Release?      |
| ----- | ----------- | ----------------- | ------------- |
| ✨    | `feat:`     | New feature       | ✅ Minor bump |
| 🐛    | `fix:`      | Bug fix           | ✅ Patch bump |
| ⬆️    | `deps:`     | Dependency update | ✅ Patch bump |
| 📝    | `docs:`     | Documentation     | ❌ No release |
| ♻️    | `refactor:` | Code refactoring  | ❌ No release |
| ✅    | `test:`     | Tests             | ❌ No release |
| 🔧    | `chore:`    | Build/tools       | ❌ No release |
| 💥    | `<type>!:`  | Breaking change   | ✅ Major bump |

**Pro tip:** If you want a `refactor` to trigger a release, use `fix: refactor ...` instead.

## Project-Specific Emojis (Take Priority)

When a change touches the agent stack, use one of these instead of the generic type emoji:

| Emoji | Scope                                                           | Example                                   |
| ----- | --------------------------------------------------------------- | ----------------------------------------- |
| 🧩    | **Skill** — `.claude/skills/<name>/`                            | `🧩 feat: add /grill-me skill`            |
| 🔌    | **MCP server** — install/config/upgrade                         | `🔌 chore: configure supabase mcp server` |
| 🤖    | **Agent generic** — `CLAUDE.md`, hooks, harness `settings.json` | `🤖 chore: add posttooluse prettier hook` |

These take precedence over the generic per-type emojis. Pick the most specific that applies — never stack. See `gitmoji.md` for the full rule.

## When to Load Additional Context

- **Need detailed type definitions?** → Read `types.md`
- **Picking the right emoji (variants like 🚑️ vs 🔒️ vs 🐛)?** → Read `gitmoji.md`
- **Confused about what triggers releases?** → Read `release-triggers.md`
- **Want to see good and bad examples?** → Read `examples.md`

## Quick Validation Checklist

Before committing, verify:

- ✅ Type is lowercase and valid
- ✅ Description starts with lowercase
- ✅ No period at the end
- ✅ Under 100 characters
- ✅ Imperative mood (add, fix, update)
- ✅ Accurately describes the "why" not just the "what"

## Common Mistakes to Avoid

❌ `Fix: Resolve database connection timeout.` (capitalized type, has period)
❌ `added user auth` (missing type, wrong tense)
❌ `feat: Add user authentication system with OAuth2...` (capitalized description, too long)

✅ `fix: resolve database connection timeout`
✅ `feat: add user authentication`
✅ `docs(api): update endpoint documentation`

## Integration with Workflow

This skill should be triggered whenever:

1. Creating a commit message
2. Validating an existing commit message
3. Planning what changes should go into a single commit
4. Deciding if changes should trigger a release

The commit message should focus on **why** the change was made, not **what** was changed (git diff shows the what).
