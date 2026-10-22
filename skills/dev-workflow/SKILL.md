---
name: dev-workflow
description: Branches, npm scripts, Husky, CI, and version-bump expectations for @contentstack/datasync-mongodb-sdk
---

# Dev workflow — Contentstack DataSync MongoDB SDK

## When to use

- Onboarding or setting up locally
- Before opening or updating a PR
- Planning a release or editing `package.json` version

## Instructions

### Branches

- No `development` / `master` policy is **encoded in this repo** — use your team’s Git flow (feature branches, PR merge targets).

### Install and build

```bash
npm install
npm run build-ts
```

`npm run build-ts` runs `clean` (rimraf `dist`, `typings`, `coverage`) then `tsc` (`package.json`).

### Quality gates

```bash
npm run tslint   # TSLint — src/**/*.ts, tslint.json
npm test         # Jest — no pretest script; ensure MongoDB available for integration tests
```

- **`npm run compile`** — `tsc` without clean (faster incremental builds).

### PR expectations

- Run **build** (`build-ts` or `compile` as appropriate), **tslint**, and **tests** when touching `src/` or query behavior.
- **`.husky/pre-commit`** runs **Snyk** and **Talisman** when installed; use **`SKIP_HOOK=1`** only when your team allows bypassing checks.

### Version bumps and CI

- Version lives in **`package.json`**. Coordinate semver with maintainers for breaking **Stack** API or **contentStore** config shape changes.
- **`.github/workflows/check-version-bump.yml`** flags missing `package.json` bumps for some “code changed” paths — its **`grep` patterns currently reference paths like `app.js`, `bin/`, `routes/`, not `src/`**. **Placeholder for maintainers:** align this workflow with **`src/`** / **`test/`** or confirm it is intentionally narrow.

### Other workflows

- **`.github/workflows/`** also includes **CodeQL**, **SCA**, **policy** scans — read each YAML for triggers.

### Docs

- **`npm run build-doc`** — requires successful TS output then JSDoc into **`docs/`**.

## References

- [`../testing/SKILL.md`](../testing/SKILL.md)
- [`../typescript/SKILL.md`](../typescript/SKILL.md)
- [`../../AGENTS.md`](../../AGENTS.md)
