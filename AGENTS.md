# Agent guidance — `@contentstack/datasync-mongodb-sdk`

## Single source of truth

Use this file and **`skills/`** as the **canonical** place for project context, workflows, and review standards so contributors get consistent guidance in any IDE or agent (Cursor, Copilot, CLI, others).

| Layer | Role |
|-------|------|
| **`AGENTS.md`** (this file) | Entry point: package identity, repo links, tech stack, source layout, commands, and skills index |
| **`skills/<topic>/SKILL.md`** | Full detail: SDK mental model, testing, and code review checklists |
| **`.cursor/rules/`** | Cursor-only scoped pointers (`description` / `globs` / `alwaysApply`) that reference this file and `skills/` |

**Flow:** Cursor rules → **`AGENTS.md`** → **`skills/*.md`**

## What this package is

**Contentstack DataSync MongoDB SDK** is a **Node.js/TypeScript** library that **queries MongoDB** holding content synced from Contentstack DataSync (per `package.json`, contents synced via **`@contentstack/content-store-mongodb`**). It uses the **MongoDB Node.js driver**, **lodash**, and **sift** over **local collections**.

It is **not** the Contentstack **Delivery** (CDA) SDK or **Management** (CMA) SDK, and it does **not** call Contentstack REST APIs for core behavior.

## Repository

- **Git:** [https://github.com/contentstack/datasync-mongodb-sdk](https://github.com/contentstack/datasync-mongodb-sdk)
- **Product docs:** [https://www.contentstack.com/docs/guide/synchronization/contentstack-datasync](https://www.contentstack.com/docs/guide/synchronization/contentstack-datasync)

## Tech stack

| Area | Details |
|------|---------|
| Language/runtime | TypeScript (`typescript` `^4.9.5` in `package.json`); Node.js `>=8` (`engines`); README may recommend a newer Node for local dev |
| Compilation/build | `tsc` (`npm run compile`); clean + `tsc` via `npm run build-ts`; output to `dist/` and `typings/` |
| Test framework | Jest + ts-jest (`jest.config.js`, Node test environment, coverage enabled). `npm test` runs Jest only (no `pretest` script in `package.json`) |
| Lint/tooling | `npm run tslint` runs TSLint via `tslint.json` on `src/**/*.ts` — this repo does **not** define `npm run lint` or ESLint |
| Core query/data libs | `lodash`, `sift`, `mongodb` (runtime `dependencies`) |
| Docs generation | JSDoc via `npm run build-doc` (builds TS then runs JSDoc into `docs/`) |

## Source layout and public entry points

| Role | Path |
|------|------|
| Package runtime entry | `dist/index.js` (`main` in `package.json`) |
| TS public facade | `src/index.ts` (`Contentstack`, `Contentstack.Stack`) |
| User-visible messages | `src/messages.ts` |
| Query builder / core behavior | `src/stack.ts` |
| Defaults + validation helpers | `src/config.ts`, `src/util.ts` |
| Tests and fixtures | `test/` with fixtures in `test/data/` |
| Generated declarations | `typings/*.d.ts` |
| Example (non-published root) | `example/index.js` |

## Common commands

| Command | Purpose |
|---------|---------|
| `npm run build-ts` | Clean `dist`, `typings`, `coverage`, then compile TypeScript |
| `npm run compile` | Compile TypeScript only |
| `npm test` | Jest with coverage (`jest.config.js`) |
| `npm run tslint` | TSLint on `src/**/*.ts` (`tslint.json`) |
| `npm run clean` | Remove `dist/`, `typings/`, `coverage/` |
| `npm run build-doc` | Build TS then generate JSDoc under `docs/` |

## Test model and env/credentials

- Tests are **integration-style** against a **real MongoDB** (e.g. `Stack.connect()`); they are **not** live Contentstack HTTP API calls.
- Test suites live in `test/`; `jest.config.js` controls matches/ignores. Fixture data: `test/data/`.
- Default connection comes from merged config in **`src/config.ts`** (e.g. **`mongodb://localhost:27017`** unless tests override `contentStore.url`). Typical test DB name: **`sync-test`** (`test/config.ts`).
- No Delivery/Management API credentials are required for core tests. There is **no** committed `.env` contract; pass **`contentStore`** (including `url`) in config when you need non-default hosts or auth.

## Skills index

- Skills index: [`skills/README.md`](skills/README.md)
- Key skills:
  - [`skills/code-review/SKILL.md`](skills/code-review/SKILL.md)
  - [`skills/testing/SKILL.md`](skills/testing/SKILL.md)
  - [`skills/contentstack-typescript-datasync-mongodb/SKILL.md`](skills/contentstack-typescript-datasync-mongodb/SKILL.md)

## Cursor rules

- Cursor rules overview: [`.cursor/rules/README.md`](.cursor/rules/README.md)
- Treat `.cursor/rules/` as scoped pointers; do not treat them as a second source of truth.
- Update policy and standards primarily in `AGENTS.md` and `skills/`, then keep rule pointers aligned.

## Contributor workflow (concise)

- **`.husky/pre-commit`** runs **Snyk** and **Talisman** when installed; bypass only as documented locally (e.g. `SKIP_HOOK`).
- **Releases:** version in **`package.json`**. CI may enforce version bumps (see `.github/workflows/check-version-bump.yml`).

## Cursor-specific quick references

For Cursor workflows, reference these scoped rules:

- `@typescript` → [`.cursor/rules/typescript.mdc`](.cursor/rules/typescript.mdc)
- `@testing` → [`.cursor/rules/testing.mdc`](.cursor/rules/testing.mdc)
- `@datasync-mongodb` → [`.cursor/rules/datasync-mongodb.mdc`](.cursor/rules/datasync-mongodb.mdc)
- `@code-review` → [`.cursor/rules/code-review.mdc`](.cursor/rules/code-review.mdc)
- `@dev-workflow` → [`.cursor/rules/dev-workflow.md`](.cursor/rules/dev-workflow.md)

Related skills:

- [`skills/contentstack-typescript-datasync-mongodb/SKILL.md`](skills/contentstack-typescript-datasync-mongodb/SKILL.md)
- [`skills/testing/SKILL.md`](skills/testing/SKILL.md)
- [`skills/code-review/SKILL.md`](skills/code-review/SKILL.md)
