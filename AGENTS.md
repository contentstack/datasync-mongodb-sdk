# AI agent docs — `@contentstack/datasync-mongodb-sdk`

You are working on the **Contentstack DataSync MongoDB SDK** — a library that queries **MongoDB** (or a Mongo-compatible store) holding content synced via **Contentstack DataSync**, **not** the Content **Delivery** (CDA) or **Management** (CMA) HTTP SDKs. Core behavior uses the **MongoDB driver** and queries against **persisted sync data**, not live stack REST calls for normal reads.

## Single source of truth

| Layer | Role |
|-------|------|
| **[`.cursor/rules/README.md`](.cursor/rules/README.md)** | Optional Cursor pointer (the **only** file under `.cursor/rules/`); links to **`AGENTS.md`** and **`skills/`** |
| **`AGENTS.md`** (this file) | Universal entry: identity, out-of-scope, links, tech stack, commands, skills index |
| **`skills/<name>/SKILL.md`** | Full conventions and checklists (source of truth for depth) |

**Flow:** [`.cursor/rules/README.md`](.cursor/rules/README.md) → **`AGENTS.md`** → **`skills/<name>/SKILL.md`**

## Out of scope (unless comparing or documenting migration)

- **Not** the CDA or CMA **HTTP** client SDKs.
- **Not** live Contentstack **REST** reads for normal query paths — this SDK targets **synced data in MongoDB**.

## Repository

| | |
|--|--|
| **npm** | `@contentstack/datasync-mongodb-sdk` |
| **Git** | [https://github.com/contentstack/datasync-mongodb-sdk](https://github.com/contentstack/datasync-mongodb-sdk) |
| **Product docs** | [Contentstack DataSync](https://www.contentstack.com/docs/guide/synchronization/contentstack-datasync) |

## Tech stack

| Area | Details |
|------|---------|
| Language | TypeScript `^4.9.5` (`package.json`); `tsc` → `dist/`, declarations `typings/` (`tsconfig.json`) |
| Runtime | Node `>=8` (`engines`); README may suggest a newer Node for local dev |
| Build | `npm run compile` (`tsc`); `npm run build-ts` (`clean` + `tsc`) |
| Test | Jest `^29` + ts-jest, Node env, coverage on (`jest.config.js`). **`npm test` is `jest` only** — no `pretest` in `package.json` |
| Lint | **TSLint** — `npm run tslint` + `tslint.json` on `src/**/*.ts`. **No ESLint** / no `npm run lint` in this repo |
| Runtime deps | `mongodb`, `lodash`, `sift` |
| Docs | `npm run build-doc` (builds then JSDoc → `docs/`) |

## Source layout and public entry points

| Role | Path |
|------|------|
| Package entry | `dist/index.js` (`main`) |
| Public API | `src/index.ts` — `Contentstack`, `Contentstack.Stack(config, db?)` |
| Query / connection | `src/stack.ts` |
| Defaults + validation | `src/config.ts`, `src/util.ts` |
| Messages | `src/messages.ts` |
| Tests + fixtures | `test/`, `test/data/` |
| Declarations | `typings/*.d.ts` |
| Example | `example/index.js` |

## Commands

| Command | Purpose |
|---------|---------|
| `npm run build-ts` | Clean `dist/`, `typings/`, `coverage/`, then `tsc` |
| `npm run compile` | `tsc` only |
| `npm test` | Jest (coverage per `jest.config.js`) |
| `npm run tslint` | TSLint `src/**/*.ts` |
| `npm run clean` | Rimraf `dist`, `typings`, `coverage` |
| `npm run build-doc` | Full build + JSDoc to `docs/` |

## Test model and credentials

- **Integration-style** tests against a **real MongoDB** (`Stack.connect()`, inserts, queries, teardown). **Not** live Contentstack HTTP API calls.
- Default URI from merged **`src/config.ts`** (e.g. `mongodb://localhost:27017`); tests often use **`test/config.ts`** (`dbName` e.g. `sync-test`).
- **No** committed `.env` for tests; override via **`contentStore`** (including `url`) in code. **Do not** commit production Mongo URIs or secrets.
- **No** Testcontainers or CI Mongo service defined in-repo — local MongoDB is the documented path for developers running tests.

## Skills index

Canonical detail lives under **`skills/<kebab-case>/SKILL.md`**. See **[`skills/README.md`](skills/README.md)**.

| Skill | `SKILL.md` |
|-------|------------|
| Dev workflow, hooks, CI | [`skills/dev-workflow/SKILL.md`](skills/dev-workflow/SKILL.md) |
| TypeScript / TSLint / `src/` layout | [`skills/typescript/SKILL.md`](skills/typescript/SKILL.md) |
| DataSync MongoDB SDK behavior | [`skills/datasync-mongodb/SKILL.md`](skills/datasync-mongodb/SKILL.md) |
| Testing | [`skills/testing/SKILL.md`](skills/testing/SKILL.md) |
| Code review | [`skills/code-review/SKILL.md`](skills/code-review/SKILL.md) |

## Using Cursor

- Open **[`.cursor/rules/README.md`](.cursor/rules/README.md)** — the sole file in **`.cursor/rules/`** — for pointers to **`AGENTS.md`** and **`skills/`**.
- Full guidance: **`skills/<name>/SKILL.md`** (attach or `@`-reference those paths in chat per your Cursor setup); there are **no** `.cursor/rules/*.mdc` files in this repo.

## Contributor workflow (concise)

- **`.husky/pre-commit`:** **Snyk** + **Talisman** when installed; `SKIP_HOOK=1` only if your team allows.
- **CI:** `.github/workflows/` includes CodeQL, SCA, policy scans, **check-version-bump** — see each file for triggers.
- **Version bump workflow** path filters may **not** list `src/`; maintainers may need to align the workflow with this layout (see [`skills/dev-workflow/SKILL.md`](skills/dev-workflow/SKILL.md)).
