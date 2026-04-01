---
name: code-review
description: PR review checklist for the Contentstack DataSync MongoDB SDK — JSDoc, compatibility, errors, tests, dependencies, and DataSync-vs-CDA/CMA terminology.
---

# Skill: Code review (datasync-mongodb-sdk)

Use this skill when preparing or reviewing pull requests for **@contentstack/datasync-mongodb-sdk**.

## Scope reminder

This package implements **DataSync** queries against **MongoDB** (synced content). It is **not** the Contentstack **Delivery API (CDA)** or **Management API (CMA)** HTTP SDK. Reviews should use **DataSync** / **MongoDB Stack** terminology unless the change explicitly touches another system.

## Checklist

### Public API and documentation

- New or changed public surface on `Contentstack` / `Stack` has accurate **JSDoc** and matches behavior in `src/stack.ts`.
- README or `example/` updates reflect required **`Stack.connect()`** usage and realistic `contentStore` config.

### Backward compatibility

- Avoid breaking changes to exported names, config keys, default limits/skip/locale behavior, or query result shapes without a major version plan.
- Call out any change that affects **collection naming**, **locale** handling, or **reference depth** behavior for consumers.

### Errors and robustness

- Errors should flow through established patterns; prefer centralized copy in **`src/messages.ts`** where the codebase already does.
- Avoid leaking internal MongoDB details in thrown messages unless intentional.

### Dependencies and security

- Justify new packages; prefer existing **lodash**, **mongodb**, **sift** usage patterns.
- Consider **Snyk**/SCA impact and supply-chain expectations.

### Tests

- Add or update **Jest** tests with **MongoDB** running locally (default URL from config).
- Use **`test/data/`** fixtures for new document shapes; keep `test/config.ts` consistent with inserted collections.

### Optional severity

| Level | Examples |
|-------|----------|
| Blocker | Data loss, security issue, broken connect/query for supported config |
| Major | Wrong query results, missing tests for new feature, accidental breaking change |
| Minor | Typos, non-functional cleanup, comment-only |

## Related

- Cursor rule: [`.cursor/rules/code-review.mdc`](../../.cursor/rules/code-review.mdc)
- Entry point: [`AGENTS.md`](../../AGENTS.md)
