---
name: testing
description: Jest + ts-jest for DataSync MongoDB SDK — real MongoDB integration tests, fixtures, jest.config.js, no live Contentstack HTTP
---

# Testing — `@contentstack/datasync-mongodb-sdk`

## When to use

- Adding or changing tests under `test/`
- Debugging failures after `src/` changes
- Understanding Jest ignores, coverage, or fixture layout

## Instructions

### Commands

- **`npm test`** — runs **`jest`** only (`package.json`). **No `pretest`** — run **`npm run build-ts`** or **`npm run compile`** first if `dist/` / imports require it.
- **`npm run build-ts`** — use when you need a clean compile before debugging.

### Runner and config

- **Jest** + **ts-jest**, **Node** environment (`jest.config.js`).
- **`collectCoverage: true`** — reports under **`coverage/`** (JSON + HTML).
- **`testMatch`:** `**/test/**/*.ts` (and `.js`).
- **`testPathIgnorePatterns`:** `/test/data/*`, `/test/.*config.ts` — fixture/config paths are not treated as test files.
- **`notify: true`** — may use `node-notifier` locally; optional in headless CI.

### Layout

| Path | Role |
|------|------|
| `test/**/*.ts` | Topic suites (`core.ts`, `queries.ts`, …) |
| `test/data/*.ts` | Fixture documents imported into collections |
| `test/config.ts` | Shared stack test config (e.g. `dbName`) |
| `jest.config.js` | Match, ignore, coverage, transform |

### Patterns

- Tests typically **`Stack.connect()`**, insert fixtures via MongoDB driver, run Stack queries, assert, drop collections / **`Stack.close()`** in `afterAll` where used.
- File names are **topic-based** (not required `*.test.ts`).

### Environment and credentials

- **Real MongoDB** at URL from merged config — default **`mongodb://localhost:27017`** in **`src/config.ts`** unless tests override **`contentStore.url`**.
- **No** Delivery/Management API keys for core tests.
- **No** `.env` contract in-repo; pass **`contentStore`** in code. **Do not** put production URIs in tests or CI secrets in the repo.
- **No** Testcontainers / dockerized Mongo in this repo’s scripts — document **local MongoDB** for developers unless CI is extended.

## References

- [`../datasync-mongodb/SKILL.md`](../datasync-mongodb/SKILL.md)
- [`../../AGENTS.md`](../../AGENTS.md)
