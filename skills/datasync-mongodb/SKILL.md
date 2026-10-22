---
name: datasync-mongodb
description: DataSync MongoDB SDK — Stack, MongoDB connection, contentStore config, queries; not CDA/CMA HTTP
---

# SDK core and queries — `@contentstack/datasync-mongodb-sdk`

## When to use

- Implementing or changing query behavior, filters, or references in `src/stack.ts`
- Adjusting defaults, URI validation, or locale/collection behavior (`src/config.ts`, `src/util.ts`)
- Adding exports or user-facing errors (`src/index.ts`, `src/messages.ts`)

## Instructions

### Product model

- **`@contentstack/datasync-mongodb-sdk`** queries **MongoDB** filled by Contentstack **DataSync** and stores such as **`@contentstack/content-store-mongodb`** (`package.json` description). It does **not** call Contentstack **Delivery** or **Management** REST APIs for normal reads.
- **Stack** here is the query facade over **persisted sync data**, not an HTTP API stack or region endpoint.

### Entry flow

1. **`Contentstack.Stack(config, existingDb?)`** (`src/index.ts`) constructs **`Stack`** (`src/stack.ts`).
2. **`Stack.connect()`** establishes the MongoDB client / database — call before queries (see README).
3. Fluent API: **`contentType(uid)`**, **`entries()`**, **`assets()`**, filters, **`language()`**, **`includeReferences()`**, pagination, projections — see **`src/stack.ts`**.

### Configuration

- Config merges with **`src/config.ts`** defaults: e.g. **`contentStore.url`**, **`dbName`**, **`collection`** (asset / entry / schema names), **`locale`**, **`limit`**, **`skip`**, **`projections`**, **`options`** (MongoClient options), **`referenceDepth`**, **`indexes`**, internal type keys.
- Optional second argument to **`Stack`**: an **existing** MongoDB connection for advanced scenarios.
- **Indexes:** README recommends indexes on keys such as `_content_type_uid`, `uid`, `locale`, `updated_at` — align with ops for performance.

### Query execution

- **Driver:** **`mongodb`** (`MongoClient`, `Db`, collections).
- **Filtering:** **`sift`** where used; **merge/sort:** **`lodash`** patterns in `stack.ts`.
- **Validation:** **`validateConfig`**, **`validateURI`**, **`getCollectionName`** in **`src/util.ts`**.
- **Errors:** prefer **`src/messages.ts`** for user-facing strings.

### Async patterns

- **`connect()`** / query methods follow existing **Promise** / `.then()` patterns in the codebase; match surrounding style when extending.

### Retries

- Document **MongoClient** / driver options under **`contentStore.options`** in config; **no** separate retry framework is defined in-repo — only what **`mongodb`** and merged config provide.

### Scope

- **`src/`** is the SDK core; **`example/`** is illustrative.

### Where to change code

| Concern | Start here |
|---------|------------|
| New operator or query path | `src/stack.ts` |
| Defaults, merge behavior | `src/config.ts` |
| URI / config validation | `src/util.ts` |
| User-visible messages | `src/messages.ts` |
| Public exports | `src/index.ts` |

## References

- [DataSync guide](https://www.contentstack.com/docs/guide/synchronization/contentstack-datasync)
- [SDK docs](https://contentstack.github.io/datasync-mongodb-sdk/) (when linked from repo README)
- [`../typescript/SKILL.md`](../typescript/SKILL.md)
- [`../testing/SKILL.md`](../testing/SKILL.md)
- [`../../AGENTS.md`](../../AGENTS.md)
