---
name: contentstack-typescript-datasync-mongodb
description: Mental model and file map for the TypeScript DataSync MongoDB SDK — Stack, config, MongoDB driver usage (not CDA/CMA).
---

# Skill: Contentstack TypeScript — DataSync MongoDB SDK

Use this skill when changing **query behavior**, **connection lifecycle**, or **configuration defaults** for **`@contentstack/datasync-mongodb-sdk`**.

## What this SDK is

- **DataSync MongoDB SDK:** queries **local/synced** MongoDB collections populated by Contentstack **DataSync** (e.g. via content-store-mongodb). **Not** a REST client for **Delivery** or **Management** APIs.

## Entry and flow

1. **`Contentstack.Stack(config, existingDb?)`** — `src/index.ts` → constructs **`Stack`**.
2. **`Stack.connect()`** — establishes MongoDB client / DB (see `src/stack.ts`).
3. Fluent API — **`contentType()`**, **`entries()`**, **`assets()`**, filters, **`language()`**, **`includeReferences()`**, etc., ending in **`find()`** / similar per implementation.

## Where to change things

| Concern | Primary location |
|---------|------------------|
| Defaults and mergeable config | `src/config.ts` |
| Connection, queries, cursor logic | `src/stack.ts` |
| Validation helpers (URI, config) | `src/util.ts` |
| User-facing error/warning strings | `src/messages.ts` |
| Package export surface | `src/index.ts` |

## Dependencies (facts from package.json)

- **`mongodb`** — database access.
- **`lodash`** — merging and data manipulation.
- **`sift`** — matching filters.

## Config concepts

- **`contentStore`:** `url`, `dbName`, **`collection`** (asset/entry/schema names), `locale`, `limit`, `skip`, `projections`, `options` (MongoClient), `referenceDepth`, `indexes`, internal type keys, etc.
- **Locales** can influence collection naming in advanced setups (see tests that prefix collection names with locale segments).

## Related

- Cursor rule: [`.cursor/rules/datasync-mongodb.mdc`](../../.cursor/rules/datasync-mongodb.mdc)
- Cursor rule: [`.cursor/rules/typescript.mdc`](../../.cursor/rules/typescript.mdc)
- Entry point: [`AGENTS.md`](../../AGENTS.md)
