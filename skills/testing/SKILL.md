---
name: testing
description: How to run and extend Jest tests for the DataSync MongoDB SDK — MongoDB, fixtures, and jest.config.js behavior.
---

# Skill: Testing (datasync-mongodb-sdk)

## Commands

```bash
npm test
```

Uses **Jest** with **`ts-jest`** (`jest.config.js`). There is no separate `test:unit` vs `test:integration` script in `package.json` — all tests live under **`test/`** and typically require a real database.

## Prerequisites

- **MongoDB** running and reachable at the URL used by tests (defaults to **`mongodb://localhost:27017`** via merged `src/config.ts`, unless your test overrides `contentStore.url`).
- Test database name is commonly **`sync-test`** per **`test/config.ts`**.

## Layout

| Path | Role |
|------|------|
| `test/*.ts` | Topic suites (e.g. `core.ts`, `queries.ts`) |
| `test/data/*.ts` | Fixture documents imported into collections in `beforeAll` |
| `jest.config.js` | `testMatch`, coverage, `testPathIgnorePatterns` (e.g. `test/data`) |

## Patterns

- Tests obtain **`db`** from **`Stack.connect()`**, insert fixtures with the MongoDB driver, run Stack queries, assert, then **`Stack.close()`** in `afterAll` where used.
- File names are **topic-based**, not `*.spec.ts` — Jest discovers them via glob.

## Environment

- No committed `.env` contract for this repo; pass **`contentStore`** (including `url`) in the config object when you need non-default hosts or auth.

## Related

- Cursor rule: [`.cursor/rules/testing.mdc`](../../.cursor/rules/testing.mdc)
- Entry point: [`AGENTS.md`](../../AGENTS.md)
