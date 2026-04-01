# Cursor rules — `@contentstack/datasync-mongodb-sdk`

This directory contains project-specific rules for AI assistants and developers. Rules use YAML frontmatter with `description`, and optionally `globs` and/or `alwaysApply`.

## How to use

- Rules with **`alwaysApply: true`** are intended to be loaded in relevant sessions automatically (depending on your Cursor settings).
- Rules with **globs** apply when editing matching files.
- For rules without `alwaysApply`, reference them explicitly when needed, e.g. **`@dev-workflow`**, **`@typescript`**, **`@datasync-mongodb`**, **`@testing`**, **`@code-review`** (use the file base name as shown in your Cursor UI).

## Rule index

| File | alwaysApply | Globs | When it applies |
|------|-------------|-------|-----------------|
| [dev-workflow.md](./dev-workflow.md) | No | *(none)* | Branching, scripts, PR/release expectations, security hooks |
| [typescript.mdc](./typescript.mdc) | No | `src/**/*.ts`, `typings/**/*.ts` | TypeScript style, layout, TSLint alignment |
| [datasync-mongodb.mdc](./datasync-mongodb.mdc) | No | `src/**/*.ts` | DataSync MongoDB SDK patterns (Stack, config, MongoDB — not CDA/CMA) |
| [testing.mdc](./testing.mdc) | No | `test/**/*.ts`, `jest.config.js` | Jest tests, MongoDB integration tests, fixtures |
| [code-review.mdc](./code-review.mdc) | **Yes** | *(global)* | PR checklist, terminology (DataSync vs CDA/CMA) |

## Related

- Root agent entry point: [../../AGENTS.md](../../AGENTS.md) (repository root)
- Skills index: [../../skills/README.md](../../skills/README.md)
