# sdd-protocol

Spec-Driven Development CLI for AI-assisted projects. Installs a structured workflow system that guides AI agents (Claude, Cursor, Copilot) through planning, execution, and review — without letting them run loose.

Works with any project: Next.js, Python, React, Django, Go, Rails — the workflow is universal.

```bash
npx sdd-protocol init
```

---

## The problem

AI agents tend to implement without validating assumptions, refactor more than asked, and don't have a mental model of when to stop and ask for approval. This system enforces explicit ceremony levels and stop points.

---

## Installation

```bash
# Initialize in any project
npx sdd-protocol init

# Overwrite existing files
npx sdd-protocol init --force

# Add a domain file to an existing installation
npx sdd-protocol add domain auth
npx sdd-protocol add domain payments
npx sdd-protocol add domain storage
npx sdd-protocol add domain email
```

Files are **copied locally** — your project owns them. No runtime dependency. Edit them freely.

---

## What it generates

```
.sdd/
  workflow.md          # Commands, ceremony levels, stop points
  project-overview.md  # What this app is (populated by /bootstrap)
  conventions.md       # Stack and patterns (populated by /bootstrap)
  domains/             # Domain-specific rules (auth, payments, etc.)
specs/
  _template/
    1-requirements.md  # Problem, goals, acceptance criteria (BDD)
    2-plan.md          # Technical plan — requires approval before coding
    3-tasks.md         # Atomic task checklist with TDD gate
CLAUDE.md              # Entry point — points the agent to .sdd/
```

---

## First thing to do after init

Run `/bootstrap` with your AI agent to populate the project context:

- **New project** — the agent interviews you with 6 targeted questions (problem, stack, non-goals, architecture decisions, domains, definition of done) and writes `.sdd/project-overview.md` and `.sdd/conventions.md`
- **Existing project** — run `/bootstrap --scan` and the agent reads your codebase first, infers what it can, then asks only about what the code can't answer

The agent presents a full draft for your approval before writing anything.

---

## Workflow commands

| Command | Purpose |
|---|---|
| `/bootstrap` | Populate project context — interview or codebase scan |
| `/ask` | Research and exploration — no code changes |
| `/assume` | Surface all assumptions before acting — stops for confirmation |
| `/bugfix` | Reproduce → diagnose → fix → validate |
| `/refactor` | Restructure without behavior change — green baseline required |
| `/spec-new` | Scaffold a spec folder for a feature |
| `/spec-plan` | Generate technical plan — **stops for approval before any code** |
| `/spec-tasks` | Execute plan one atomic task at a time, TDD-first |
| `/review` | Final audit — verifies goals, scenarios, no scope creep |
| `/finish` | Stage files and generate a conventional commit message for approval |

### Ceremony levels

| Change | Flow |
|---|---|
| Typo / comment | Direct |
| Bug | `/bugfix` → `/finish` |
| Refactor | `/refactor` → `/finish` |
| Feature | `/spec-new` → `/spec-plan` → `/spec-tasks` → `/review` → `/finish` |
| Architecture | `/spec-new` → `/spec-plan` (mandatory human review) → `/spec-tasks` → `/review` → `/finish` |

---

## Execution principles

Built into the workflow — every command enforces these:

1. **Surface assumptions** — list them before acting, not mid-execution
2. **Minimum code** — only what was asked; no "while I'm here" changes
3. **Surgical changes** — touch only what the task requires
4. **Verify before moving on** — define "done" before starting, not after

---

## Spec structure

Each feature gets a folder under `specs/<name>/` with three files:

**`1-requirements.md`** — Problem, measurable goals (G1, G2…), BDD acceptance criteria, constraints, open questions (blocking vs. non-blocking).

**`2-plan.md`** — Goals coverage, assumptions (confirmed via `/assume`), approach + tradeoffs, components affected, abort criteria, verification per task. Requires explicit approval before execution starts.

**`3-tasks.md`** — One task at a time. Each task has: test to write first (red→green), files to change, goal ID, acceptance scenario, and optional tradeoff. Completed specs move to `specs/_done/`.

---

## Updating

```bash
npm version patch   # bug fix:     0.1.0 → 0.1.1
npm version minor   # new feature: 0.1.0 → 0.2.0
npm publish
```

Users running `npx sdd-protocol init` always get the latest version automatically.

Since files are copied to your project, existing `.sdd/` files are never overwritten on update — use `--force` to explicitly replace them.

---

## License

MIT
