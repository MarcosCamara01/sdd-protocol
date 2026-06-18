# SDD Autonomy Policy

Mode: guided

This project uses the default human-guided SDD workflow. The agent may draft artifacts,
run checks, and prepare implementation work, but structural approvals stay with the human.

## Operating Mode

- Default stance: ask before approving SDD stop points.
- Do not mark artifacts as self-approved.
- Prepare requirements, plans, amendments, gap resolutions, review outcomes, and commit
  messages for human approval instead of approving them yourself.
- Continue only through read-only exploration, drafting, approved implementation tasks,
  and validation allowed by `.sdd/workflow.md`.

## Agent May Do

- Read project context, specs, domain files, and source code.
- Draft requirements, plans, tasks, gaps, amendments, verify reports, review reports, and
  commit messages when the matching SDD command allows it.
- Execute approved `/spec-tasks` work one task at a time.
- Run tests, gates, status checks, and package checks.

## Human Approval Required

- Confirm assumptions from `/assume`.
- Approve `/bootstrap` drafts before project context files are written.
- Approve `/spec-plan` before implementation starts.
- Approve `/spec-amend` before approved requirements or plans change.
- Approve `/conventions-sync` before `.sdd/conventions.md` changes.
- Approve `/finish` before committing.
- Decide how to resolve implementation gaps and structural review escalations.

## Hard Stops

The agent must stop and report when it hits ambiguity, contradiction, technical
impossibility, failing tests that cannot be resolved within the current task, pending
change requests, unresolved gaps, unlisted scope, new dependencies, destructive changes,
security-sensitive changes, or release/publish actions.

## Approval Trail

When a human approves a stop point, record the approval in the normal SDD artifact:
plan approval marker, amendment status, gap resolution, review report, or finish summary.
