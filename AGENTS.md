# Agent guidance — `@contentstack/datasync-mongodb-sdk`

## What this package is

**Contentstack DataSync MongoDB SDK** — a TypeScript/JavaScript library that **queries content already synced into MongoDB** (via Contentstack DataSync and stores such as `@contentstack/content-store-mongodb`). It is **not** a Content Delivery API (CDA) or Content Management API (CMA) HTTP client; it wraps the **MongoDB Node.js driver**, uses **sift** for predicate matching, and exposes a **Stack**-style query API over local collections.

## Repository

- **GitHub:** https://github.com/contentstack/datasync-mongodb-sdk

## Tech stack

| Area | Details |
|------|---------|
| Language | TypeScript **4.9.x** (compiles to `dist/`, declarations in `typings/`) |
| Runtime | Node.js **≥ 8** (`package.json` engines); README suggests Node **20+** for local dev |
| Build | `tsc` — `npm run compile` / `npm run build-ts` (with clean) |
| Tests | **Jest 29** + **ts-jest**, Node test environment |
| Data access | **mongodb** ^6.x, **lodash**, **sift** |
| Lint | **TSLint** (`npm run tslint`) — repo does not use ESLint |
| Docs | JSDoc → `npm run build-doc` (outputs under `docs/`) |

## Main entry points and layout

- **Published entry:** `main` → `dist/index.js` (build from `src/index.ts`).
- **Public API:** `Contentstack.Stack(config, db?)` → `Stack` instance (`src/index.ts`, `src/stack.ts`).
- **Config defaults:** `src/config.ts`; messages: `src/messages.ts`; helpers: `src/util.ts`.
- **Type declarations:** `typings/*.d.ts` (generated/committed alongside build).
- **Example:** `example/index.js` (not part of the core SDK package surface for agent edits).

## Common commands

| Command | Purpose |
|---------|---------|
| `npm run compile` | TypeScript compile to `dist/` |
| `npm run build-ts` | `clean` + full `tsc` |
| `npm run clean` | Remove `dist/`, `typings/`, `coverage/` |
| `npm test` | Run Jest (see `jest.config.js`) |
| `npm run tslint` | Lint `src/**/*.ts` |
| `npm run build-doc` | Build TS then JSDoc site |

## Tests and credentials

Tests under `test/` are **integration-style**: they call `Stack.connect()` and use a real MongoDB instance (default **`mongodb://localhost:27017`** from `src/config.ts` unless overridden in config). There is **no** separate `.env` contract in this repo for tests; ensure MongoDB is running locally (database name in tests is typically `sync-test` per `test/config.ts`). Fixture data lives under `test/data/` (ignored as tests by Jest patterns where configured).

## Further reading for agents

- **Cursor rules (when to apply, globs, @-references):** [.cursor/rules/README.md](.cursor/rules/README.md)
- **Skills (expanded checklists and workflows):** [skills/README.md](skills/README.md)
