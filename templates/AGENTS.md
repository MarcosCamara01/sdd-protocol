# Codex — Project Context

This project uses the SDD Protocol. Read these files before starting any task:

1. **[.sdd/workflow.md](.sdd/workflow.md)** — commands, ceremony levels, and stop points
2. **[.sdd/project-overview.md](.sdd/project-overview.md)** — what this app is, its non-goals, domains, and definition of done
3. **[.sdd/conventions.md](.sdd/conventions.md)** — project-specific conventions and patterns

## Available Skills

Type `/skills` or `$skill-name` to invoke. Skills are defined in `.agents/skills/`.

| Intent | Skill |
|---|---|
| Initialize project context | `$bootstrap` (new) · `$bootstrap --scan` (existing) |
| Explore / research | `$ask` |
| Surface and validate assumptions | `$assume` |
| Fix a confirmed bug | `$bugfix` → `$finish` |
| Restructure without behavior change | `$refactor` → `$finish` |
| New feature | `$spec-new` → `$spec-plan` → `$spec-tasks` → `$review` → `$finish` |
| Stage + commit after any work | `$finish` |

## Active Specs

<!-- List specs currently in progress — completed specs live in specs/_done/ and are not active context.
- specs/auth-refresh/ — in spec-tasks (task 3 of 5)
- specs/payments-v2/ — plan pending approval
-->

## Domain Files

Relevant domain context lives in `.sdd/domains/`. Read the relevant domain file before working in that area.

<!-- List domains present in this project, e.g.:
- [.sdd/domains/auth.md](.sdd/domains/auth.md)
- [.sdd/domains/payments.md](.sdd/domains/payments.md)
-->
