---
description: Branch workflow, npm scripts, PR expectations, version bumps, and local security hooks for this repo.
---

# Development workflow

## Branches

Use your team’s Git conventions (feature branches off the main integration branch, PR-based merge). No branch naming scheme is enforced in this repository’s config files.

## Lint and tests

- **Compile:** `npm run compile` or `npm run build-ts` (clean + build).
- **Tests:** `npm test` (Jest). Requires a **running MongoDB** reachable at the URL in stack config (defaults to `mongodb://localhost:27017`).
- **Lint:** `npm run tslint` (TSLint on `src/**/*.ts`).

## Pre-commit (local)

`.husky/pre-commit` runs **Snyk** (`snyk test --all-projects`) and **Talisman** secret scanning. Both tools must be installed on the developer machine unless commits are skipped with `SKIP_HOOK=1` (documented in the hook). This is separate from `npm test` / `tslint`.

## Pull requests

- Prefer green **Jest** runs for changes that touch query or connection behavior.
- Repository automation may include **SCA**, **policy**, and **CodeQL** workflows under `.github/workflows/` — follow failing checks before merge.
- **Version bump:** `.github/workflows/check-version-bump.yml` enforces `package.json` version bumps for certain change sets. *Note:* That workflow’s path filters appear tailored to a different layout in places; if your PR changes `src/` or `test/` and CI expects a version bump, confirm behavior against the latest workflow definition.

## Releases

Package version is **`package.json` → `version`**. Publishing uses `publishConfig.access: public`. Bump the version when releasing; align with maintainers on semver for breaking Stack API or config shape changes.
