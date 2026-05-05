# Commit Types - Detailed Reference

This document provides comprehensive details on all valid commit types in the vm0 project. Each type lists a primary [gitmoji](https://gitmoji.dev/) plus optional variants for nuance — see `gitmoji.md` for the full catalog. Emoji is cosmetic; the conventional `type:` is what triggers releases.

## Release-Triggering Types

### `feat:` - New Feature

**Primary emoji:** ✨ `:sparkles:`
**Variant emojis:** 🚸 (UX), ♿️ (a11y), 🌐 (i18n), 💄 (UI/CSS), 🛂 (auth/perms), 🚩 (feature flag), 🔊 (logs), 📈 (analytics), 💫 (animations), 📱 (responsive)
**Triggers:** Minor version bump (e.g., 1.2.0 → 1.3.0)

Use when:

- Adding a completely new feature or capability
- Introducing new user-facing functionality
- Adding new API endpoints or methods
- Creating new components or modules

Examples:

- `✨ feat: add user authentication system`
- `💄 feat: add dark mode toggle`
- `✨ feat(api): add payment processing endpoint`
- `✨ feat: add export to csv functionality`
- `♿️ feat: add keyboard navigation to dialog`
- `🌐 feat: add german translations`

### `fix:` - Bug Fix

**Primary emoji:** 🐛 `:bug:`
**Variant emojis:** 🚑️ (critical hotfix), 🔒️ (security), 🩹 (small non-critical), 🥅 (catching errors), 💚 (CI build fix — but use `ci:` type)
**Triggers:** Patch version bump (e.g., 1.2.0 → 1.2.1)

Use when:

- Fixing a bug or error in existing functionality
- Correcting unexpected behavior
- Resolving errors or exceptions
- Fixing performance issues

Examples:

- `🐛 fix: resolve database connection timeout`
- `🐛 fix: correct validation logic for email fields`
- `🐛 fix(auth): prevent token expiration edge case`
- `🚑️ fix: patch crash on empty cart submit`
- `🔒️ fix(auth): close session-fixation vulnerability`
- `🩹 fix: correct off-by-one in pagination label`

**Special case:** You can use `fix:` for refactoring that improves code quality:

- `🐛 fix: refactor authentication logic for better maintainability`
- This is acceptable since refactoring often fixes technical debt.

### `deps:` - Dependency Updates

**Primary emoji:** ⬆️ `:arrow_up:` (upgrade)
**Variant emojis:** ⬇️ (downgrade), ➕ (add new), ➖ (remove), 📌 (pin)
**Triggers:** Patch version bump (e.g., 1.2.0 → 1.2.1)

Use when:

- Updating package dependencies
- Upgrading libraries or frameworks
- Security updates

Examples:

- `⬆️ deps: update next.js to v14.2.0`
- `⬆️ deps: bump typescript from 5.3 to 5.4`
- `➕ deps: add zod for runtime validation`
- `➖ deps: remove unused lodash`
- `📌 deps: pin react-router to 6.20.1`

## Non-Release Types

These types appear in the changelog but do NOT trigger a new release:

### `docs:` - Documentation

**Primary emoji:** 📝 `:memo:`
**Variant emojis:** 💡 (code comments only), ✏️ (typo fix), 👥 (contributors file)
**Triggers:** No release

Use when:

- Updating README files
- Changing code comments
- Modifying documentation sites
- Updating API documentation

Examples:

- `📝 docs: update installation instructions`
- `📝 docs(api): add examples for webhook endpoints`
- `✏️ docs: fix typo in contributing guide`
- `💡 docs: clarify cache-invalidation comment in store.ts`

### `style:` - Code Style

**Primary emoji:** 🎨 `:art:`
**Variant emojis:** 🚨 (linter fixes), ✏️ (typos), 💬 (text/copy)
**Triggers:** No release

Use when:

- Formatting code (whitespace, semicolons)
- Linting fixes that don't change logic
- Code style improvements

Examples:

- `🎨 style: format code with prettier`
- `🚨 style: fix eslint warnings`
- `🎨 style: adjust indentation`

### `refactor:` - Code Refactoring

**Primary emoji:** ♻️ `:recycle:`
**Variant emojis:** 🏗️ (architecture), 🔥 (removing code), ⚰️ (dead code), 🗑️ (deprecation), 🏷️ (types only), 🔇 (remove logs)
**Triggers:** No release

Use when:

- Restructuring code without changing behavior
- Improving code organization
- Extracting functions or modules
- Renaming variables for clarity

Examples:

- `♻️ refactor: extract validation logic to separate module`
- `♻️ refactor: simplify database query logic`
- `🏗️ refactor(auth): reorganize authentication flow`
- `🔥 refactor: remove legacy v1 api routes`
- `🏷️ refactor: tighten user profile types`

**Note:** If you want the refactor to trigger a release, use `🐛 fix: refactor ...` instead.

### `test:` - Test Changes

**Primary emoji:** ✅ `:white_check_mark:`
**Variant emojis:** 🧪 (adding a failing test, TDD red), 🤡 (mocks/stubs), 📸 (snapshots)
**Triggers:** No release

Use when:

- Adding new tests
- Modifying existing tests
- Fixing test failures
- Improving test coverage

Examples:

- `✅ test: add unit tests for user service`
- `✅ test(e2e): update checkout flow tests`
- `✅ test: fix flaky integration test`
- `🧪 test: add failing test for null cart bug`
- `📸 test: update snapshots after button restyle`

### `chore:` - Build/Tool Changes

**Primary emoji:** 🔧 `:wrench:`
**Variant emojis:** 🔨 (dev scripts), 🙈 (.gitignore), 🧱 (infra), 🧑‍💻 (DX), 🌱 (seed/fixture data)
**Triggers:** No release

Use when:

- Updating build scripts
- Modifying CI/CD configuration
- Changing development tools
- Updating package scripts

Examples:

- `🔧 chore: update build script for monorepo`
- `🔧 chore: configure prettier for typescript`
- `🔨 chore: add npm script for local development`
- `🙈 chore: ignore .artifacts in git`
- `🧱 chore: bump docker base image`

### `ci:` - CI Configuration

**Primary emoji:** 👷 `:construction_worker:`
**Variant emojis:** 💚 (fix a broken CI build)
**Triggers:** No release

Use when:

- Modifying GitHub Actions workflows
- Updating CI/CD pipelines
- Changing release automation
- Adjusting build matrix

Examples:

- `👷 ci: optimize release workflow dependencies`
- `👷 ci: add caching for npm dependencies`
- `💚 ci: fix node version mismatch in test job`

### `perf:` - Performance Improvements

**Primary emoji:** ⚡️ `:zap:`
**Triggers:** No release (unless breaking)

Use when:

- Optimizing performance
- Reducing bundle size
- Improving load times
- Optimizing algorithms

Examples:

- `⚡️ perf: optimize image loading`
- `⚡️ perf: reduce api response time`
- `⚡️ perf: implement lazy loading for components`

### `build:` - Build System

**Primary emoji:** 📦️ `:package:`
**Triggers:** No release

Use when:

- Changing build configuration
- Modifying webpack/vite/turbo config
- Updating bundler settings

Examples:

- `📦️ build: update webpack config for production`
- `📦️ build: configure turborepo for better caching`

### `revert:` - Revert Previous Commit

**Primary emoji:** ⏪️ `:rewind:`
**Triggers:** No release

Use when:

- Reverting a previous commit
- Rolling back changes

Examples:

- `⏪️ revert: revert "feat: add dark mode"`
- `⏪️ revert: roll back database migration`

## Breaking Changes

**Primary emoji:** 💥 `:boom:` (use **with** the `!` marker, not instead of it)
**Triggers:** Major version bump (e.g., 1.2.0 → 2.0.0)

Any type can be a breaking change by adding `!` after the type or including `BREAKING CHANGE:` in the footer:

```
💥 feat!: change api response format to include metadata

BREAKING CHANGE: API responses now return {data, metadata} instead of raw data
```

Use breaking changes when:

- Changing public API contracts
- Removing features or endpoints
- Changing behavior in incompatible ways
- Requiring migration steps

## Scopes (Optional)

Scopes provide additional context about what area of the codebase was affected:

Examples:

- `feat(api): add user endpoint`
- `fix(auth): resolve token refresh issue`
- `docs(readme): update installation steps`
- `test(e2e): add checkout flow tests`

Common scopes in this project:

- `api` - API endpoints
- `auth` - Authentication
- `db` - Database
- `ui` - User interface
- `cli` - Command-line interface
