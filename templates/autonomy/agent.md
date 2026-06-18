# SDD Autonomy Policy

Mode: agent

This project delegates low-risk SDD decisions to the agent while keeping structural,
high-risk, and irreversible decisions with the human.

## Operating Mode

- Default stance: continue only for low-risk, bounded, test-backed work.
- Classify each stop point before acting: self-approve only when the matching item under
  "Agent May Self-Approve" applies and no hard stop or human-required category is present.
- When the work is unclear, broad, risky, irreversible, or outside the approved plan,
  stop and ask for human direction.
- Keep changes small, verify them before moving on, and leave the normal SDD approval
  trail whenever you self-approve.

## Agent May Self-Approve

- Non-blocking clarifications when the default is documented in the requirements.
- `/assume` items that can be confirmed directly from repository files.
- `/bugfix` work that is reproducible, touches about one file, stays under about 50 lines,
  adds or updates a focused test, and introduces no dependency.
- `/spec-plan` approval for small internal changes that touch only source and test files
  listed in the plan, add no external dependency, and do not alter public contracts.
- `/verify` and `/review` reports when the full test suite passes and no structural
  issue is found.

## Human Approval Required

- New dependency, migration, public API, external contract, auth, payments, permissions,
  security, data deletion, privacy, billing, or release/publish change.
- Any `/spec-amend` that changes approved requirements or plan scope.
- Any implementation gap where the proposed resolution is not already covered by the
  approved plan.
- `/finish` before committing, unless the human has separately delegated commits.

## Hard Stops

The agent must stop and report when it hits ambiguity, contradiction, technical
impossibility, failing tests that cannot be resolved within the current task, pending
change requests, unresolved gaps, unlisted scope, destructive changes, or a human-required
risk category.

## Approval Trail

For delegated approvals, update the same SDD artifact a human would approve and note:
`Self-approved by agent per .sdd/autonomy.md (Mode: agent)`.
