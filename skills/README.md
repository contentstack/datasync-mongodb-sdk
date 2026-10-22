# Skills — `@contentstack/datasync-mongodb-sdk`

**This directory is the source of truth** for detailed conventions (workflow, TypeScript/TSLint, DataSync MongoDB SDK behavior, tests, code review). Read **[`AGENTS.md`](../AGENTS.md)** at the repo root for the index, identity, and command tables; each skill is a folder with **`SKILL.md`** (YAML frontmatter: `name`, `description`).

## When to use which skill

| Skill folder | Use when |
|--------------|----------|
| [`dev-workflow/`](dev-workflow/SKILL.md) | Branches, `npm` scripts, Husky, CI, version bumps |
| [`typescript/`](typescript/SKILL.md) | `tsconfig`, TSLint, `src/` layout, JSDoc |
| [`datasync-mongodb/`](datasync-mongodb/SKILL.md) | `Stack`, MongoDB config, queries — DataSync vs CDA/CMA |
| [`testing/`](testing/SKILL.md) | Jest, MongoDB test setup, fixtures, `jest.config.js` |
| [`code-review/`](code-review/SKILL.md) | PR checklist, semver, terminology |

## How to use these docs

- **Humans / any tool:** Start at **`AGENTS.md`**, then open the relevant **`skills/<name>/SKILL.md`**.
- **Cursor users:** **[`.cursor/rules/README.md`](../.cursor/rules/README.md)** (the only file under **`.cursor/rules/`**) points at **`AGENTS.md`** and **`skills/`**.
