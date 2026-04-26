# sddx-workflow

[![npm](https://img.shields.io/npm/v/sddx-workflow)](https://www.npmjs.com/package/sddx-workflow)
[![node](https://img.shields.io/node/v/sddx-workflow)](https://nodejs.org)
[![license](https://img.shields.io/npm/l/sddx-workflow)](LICENSE)

Spec-Driven Development CLI for AI-assisted projects. Installs a structured workflow system that guides AI agents (Claude, Cursor, Copilot) through planning, execution, and review — without letting them run loose.

Works with any project: Next.js, Python, React, Django, Go, Rails.

```bash
npx sddx-workflow init
```

---

## Why this exists

AI agents tend to implement without validating assumptions, refactor more than asked, and don't have a mental model of when to stop and ask for approval. This system enforces explicit ceremony levels and stop points.

---

## Quick start

```bash
# 1. Initialize the workflow in your project
npx sddx-workflow init

# 2. Populate project context (run with your AI agent)
/bootstrap

# 3. Build a feature
/spec-new      # scaffold a spec folder
/spec-plan     # generate a technical plan — stops for your approval
/spec-tasks    # execute one atomic task at a time
/finish        # stage files + generate a conventional commit
```

---

## CLI reference

```bash
npx sddx-workflow init                  # Initialize in current project
npx sddx-workflow init --force          # Overwrite existing files

npx sddx-workflow add domain auth       # Add a domain file
npx sddx-workflow add domain payments
npx sddx-workflow add domain storage
npx sddx-workflow add domain email

npx sddx-workflow status                # Show current workflow state
npx sddx-workflow update                # Update workflow templates
```

Files are **copied locally** — your project owns them. No runtime dependency. Edit freely.

---

## Generated structure

```
.sdd/
  workflow.md          # Commands, ceremony levels, stop points
  project-overview.md  # What this app is — populated by /bootstrap
  conventions.md       # Stack and patterns — populated by /bootstrap
  domains/             # Domain-specific rules (auth, payments, etc.)
specs/
  _template/
    1-requirements.md  # Problem, goals, acceptance criteria (BDD)
    2-plan.md          # Technical plan — requires approval before coding
    3-tasks.md         # Atomic task checklist with TDD gate
CLAUDE.md              # Agent entry point — points to .sdd/
```

---

## Agent commands

| Command | Purpose |
|---|---|
| `/bootstrap` | Populate project context via interview or codebase scan |
| `/ask` | Research and exploration — no code changes |
| `/assume` | Surface all assumptions before acting |
| `/bugfix` | Reproduce → diagnose → fix → validate |
| `/refactor` | Restructure without behavior change (green baseline required) |
| `/spec-new` | Scaffold a spec folder for a feature |
| `/spec-plan` | Generate technical plan — **stops for approval before any code** |
| `/spec-tasks` | Execute plan one atomic task at a time, TDD-first |
| `/review` | Final audit — verifies goals, no scope creep |
| `/finish` | Stage files + generate conventional commit message |

### Ceremony levels

| Change type | Flow |
|---|---|
| Typo / comment | Direct |
| Bug | `/bugfix` → `/finish` |
| Refactor | `/refactor` → `/finish` |
| Feature | `/spec-new` → `/spec-plan` → `/spec-tasks` → `/review` → `/finish` |
| Architecture | `/spec-new` → `/spec-plan` (mandatory review) → `/spec-tasks` → `/review` → `/finish` |

---

## Execution principles

Enforced by every command:

1. **Surface assumptions** — list them before acting, not mid-execution
2. **Minimum code** — only what was asked; no "while I'm here" changes
3. **Surgical changes** — touch only what the task requires
4. **Verify before moving on** — define "done" before starting, not after

---

## Spec structure

Each feature lives in `specs/<name>/` with three files:

**`1-requirements.md`** — Problem, measurable goals (G1, G2…), BDD acceptance criteria, constraints, open questions (blocking vs. non-blocking).

**`2-plan.md`** — Goals coverage, assumptions confirmed via `/assume`, approach + tradeoffs, components affected, abort criteria. Requires explicit approval before execution starts.

**`3-tasks.md`** — One task at a time. Each has: test to write first (red → green), files to change, goal ID, and acceptance scenario. Completed specs move to `specs/_done/`.

---

## Development

```bash
git clone https://github.com/MarcosCamara01/sddx-workflow.git
cd sddx-workflow
npm install
npm run dev      # watch mode
npm run build    # production build
```

### Publishing

```bash
npm version patch   # bug fix:     0.1.0 → 0.1.1
npm version minor   # new feature: 0.1.0 → 0.2.0
npm publish
```

Users running `npx sddx-workflow init` always get the latest version. Existing `.sdd/` files are never overwritten on update — use `--force` to explicitly replace them.

---

## License

MIT
