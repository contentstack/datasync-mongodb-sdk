---
name: code-review
description: PR review for DataSync MongoDB SDK — JSDoc, compatibility, errors, tests, deps/SCA; terminology DataSync MongoDB SDK not CDA/CMA HTTP
---

# Code review — `@contentstack/datasync-mongodb-sdk`

## When to use

- Reviewing a PR that touches `src/`, `test/`, or public docs
- Self-checking before request for review
- Judging semver impact for Stack / config / query behavior

## Instructions

### Scope and terminology

- This package is the **DataSync MongoDB SDK** (MongoDB over **synced** content). Do **not** call it the **CDA** or **CMA** **HTTP** SDK unless the change explicitly compares or documents migration.
- Behavior should be validated with **MongoDB + Jest** tests, not live stack REST calls, unless the PR is explicitly about integration docs.

### Public API and docs

- **`Contentstack` / `Stack`** public surface should have accurate **JSDoc** consistent with `src/stack.ts`.
- **README** / **`example/`** must match **`Stack.connect()`** and **`contentStore`** keys from **`src/config.ts`** and real usage.

### Backward compatibility

- Avoid breaking query result shape, **config** schema, or public method signatures without a **semver-major** plan.
- Watch **locale**, **collection naming**, **reference depth**, **limit/skip** defaults.

### Errors and messages

- Prefer centralized strings in **`src/messages.ts`** where the codebase already does.

### Correctness and null safety

- Align with MongoDB driver and existing null checks in query chains.

### Dependencies and security

- New dependencies need justification; align with **`lodash` / `mongodb` / `sift`** patterns and **Snyk**/SCA expectations.

### Tests

- Behavioral changes in **`src/`** need matching **`test/`** updates and **`test/data/`** fixtures when document shapes change.

### Optional severity

| Level | Examples |
|-------|----------|
| Blocker | Wrong query results, data corruption risk, security issue, broken public API contract |
| Major | Missing tests for core behavior, breaking change without version/docs strategy |
| Minor | Style, non-user-facing refactors, doc nits |

## References

- [`../testing/SKILL.md`](../testing/SKILL.md)
- [`../datasync-mongodb/SKILL.md`](../datasync-mongodb/SKILL.md)
- [`../../AGENTS.md`](../../AGENTS.md)
