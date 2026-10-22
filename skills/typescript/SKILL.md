---
name: typescript
description: TypeScript and TSLint for src/ — tsconfig, tslint.json, layout, JSDoc; no ESLint in this repo
---

# TypeScript (`src/`) — `@contentstack/datasync-mongodb-sdk`

## When to use

- Editing or adding files under `src/` or generated `typings/`
- Aligning with compiler and TSLint settings
- Choosing where new code belongs (`index.ts`, `stack.ts`, `config.ts`, `util.ts`, `messages.ts`)

## Instructions

### Tooling

- **Compiler:** `tsconfig.json` — CommonJS, ES6 target, `noImplicitReturns`, `noUnusedLocals` / `noUnusedParameters`, declarations to **`typings/`**, output **`dist/`**.
- **Lint:** **`npm run tslint`** with **`tslint.json`** on **`src/**/*.ts`**. This repo has **no ESLint** and **no `npm run lint`** script.

### Style (TSLint)

- Match `tslint.json`: e.g. 2-space indent, single quotes, no semicolons (`semicolon: never`), max line length 120, `ordered-imports`, `no-default-export` (entry composes via `src/index.ts`), `interface-name` with `I` prefix where used.

### Layout

- Public exports: **`src/index.ts`** (`Contentstack`, `Contentstack.Stack`).
- Core query/connection logic: **`src/stack.ts`**.
- Defaults: **`src/config.ts`**; validation/helpers: **`src/util.ts`**; copy: **`src/messages.ts`**.

### JSDoc

- Follow existing **`@public` / `@description`** patterns for symbols documented for **`npm run build-doc`**.

### Logging

- TSLint warns on several **`console`** methods in library code — avoid noisy logging in `src/`.

### Dependencies

- Do not assume HTTP/REST clients for core behavior — this SDK uses **MongoDB** + **lodash** + **sift** per **`package.json`**.

## References

- [`../datasync-mongodb/SKILL.md`](../datasync-mongodb/SKILL.md)
- [`../../AGENTS.md`](../../AGENTS.md)
