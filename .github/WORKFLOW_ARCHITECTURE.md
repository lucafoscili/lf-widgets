# GitHub Workflows Architecture

---

## Workflow Architecture

### Release Flow

```plaintext
Developer commits → candidate branch
    ↓
bump-candidate.yaml (creates version bump PR)
    ↓
Merge PR with "release:rc" label
    ↓
publish-candidate.yaml (publishes to NPM with "rc" tag)
    ↓
Merge candidate → main
    ↓
bump-main.yaml (creates version bump PR, removes -rc suffix)
    ↓
Merge PR with "release:production" label
    ↓
publish-main.yaml (publishes to NPM with "latest" tag)
```

---

## Detailed Workflow Analysis

### 1. Version Bump Workflows

#### `bump-candidate.yaml`

- **Trigger:** Push to `candidate` branch (with path filters)
- **Actions:**
  - Uses Lerna with `--conventional-prerelease` and `--preid=rc`
  - Creates PR with `release:rc` label
  - Builds packages and formats code
- **Skip conditions:** `[skip bump]`, `chore: bump versions`, or manual skip input

#### `bump-main.yaml`

- **Trigger:** Push to `main` branch (with path filters)
- **Special logic:** Detects RC versions and graduates them to stable
- **Actions:**
  - Removes `-rc.X` suffix if present
  - Creates PR with `release:production` label
  - Builds packages
- **Skip conditions:** Same as candidate workflow

---

### 2. Publishing Workflows

#### `publish-candidate.yaml`

- **Trigger:** PR merge to `candidate` with `release:rc` label
- **NPM Tag:** `rc`
- **Environment:** Development
- **Safety features:**
  - Checks if packages need publishing via `lerna changed`
  - Uses `from-package` strategy
  - Creates GitHub release marked as prerelease

#### `publish-main.yaml`

- **Trigger:** PR merge to `main` with `release:production` label
- **NPM Tag:** `latest`
- **Environment:** Production
- **Safety features:** Same as candidate workflow

---

### 3. Quality Assurance Workflows

#### `component-count.yaml`

- **Trigger:** Push to `candidate`
- **Actions:**
  - Counts components in `packages/components/src/components`
  - Updates `count.json`
  - Creates PR to `candidate`

#### `cypress-tests.yaml`

- **Trigger:** PRs to `main`
- **Actions:** Runs Cypress tests with concurrency control

#### `daily-tests.yaml`

- **Trigger:** Daily cron + manual
- **Target:** `candidate` branch

#### `daily-prettier.yaml`

- **Trigger:** Daily cron + manual
- **Actions:** Formats code and creates PR if changes found
- **Recent fix:** Simplified PR creation to avoid duplicates

---

## Reusable Actions

### `.github/actions/setup`

- **Purpose:** Node.js setup, dependency installation, and build
- **Inputs:**
  - `node-version` (default: "18.x")
  - `install-immutable` (default: "false")

---

## Security

- Uses `secrets.GITHUB_TOKEN` (auto-generated, scoped)
- Uses `secrets.NPM_TOKEN` (required for publishing)
- Environment protection (Development/Production)
- No hardcoded credentials

## Best Practices

- Proper git configuration for bot commits
- Skip CI markers to prevent loops (`[skip ci]`, `[skip bump]`)
- Label-based workflow triggering
- Concurrency control in test workflows
- Fetch depth and tags for proper versioning
- Delete branch after PR merge

---

## Quick Reference

### Manual Workflow Triggers

All workflows support `workflow_dispatch` where needed. To manually trigger:

1. Go to Actions tab
2. Select workflow
3. Click "Run workflow"
4. Choose branch and options

### Troubleshooting

- **Version bump not happening:** Check for `[skip bump]` in commit message
- **Publishing not triggered:** Verify PR has correct label (`release:rc` or `release:production`)
- **Tests failing:** Check Cypress output in Actions logs

### Key Labels

- `automated PR` - All bot-created PRs
- `release:rc` - Triggers candidate publishing
- `release:production` - Triggers main publishing
- `formatting` - Prettier-related changes

---
