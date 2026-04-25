# GitHub Copilot Instructions

This project uses the SDD Protocol. Before starting any task, read:

1. `.sdd/workflow.md` — all commands, ceremony levels, and stop points
2. `.sdd/project-overview.md` — what this app is, its non-goals, and domains
3. `.sdd/conventions.md` — project-specific conventions and patterns

## Available commands

Use these slash commands in Copilot Chat (type `/` to see them):

| Command | Purpose |
|---|---|
| `/bootstrap` | Populate project context — interview or codebase scan |
| `/ask` | Research only — no code changes |
| `/assume` | List assumptions and stop for confirmation |
| `/bugfix` | Reproduce → diagnose → fix → validate |
| `/refactor` | Restructure without behavior change |
| `/spec-new` | Scaffold a spec folder |
| `/spec-plan` | Generate technical plan — stop for approval |
| `/spec-tasks` | Execute plan one task at a time, TDD-first |
| `/review` | Final audit before closing |
| `/finish` | Stage files and generate commit message |

## Execution principles

1. Surface assumptions before acting — never pick an interpretation silently
2. Minimum code — only what was asked
3. Surgical changes — touch only what the task requires
4. Verify before moving on — define "done" before starting

Full definitions for each command are in `.sdd/workflow.md`.
