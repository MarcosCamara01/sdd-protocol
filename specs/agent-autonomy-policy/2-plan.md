# Technical Plan: Agent Autonomy Policy

## Status

- [x] Draft
- [x] **Approved**

---

## Goals This Plan Addresses

- G1 - covered by Tasks 1-2: add `init --profile` parsing and install the selected
  autonomy policy without changing provider selection.
- G2 - covered by Task 1: add profile-specific `.sdd/autonomy.md` templates.
- G3 - covered by Task 3: update workflow and provider entrypoints/rules to require
  agents to read `.sdd/autonomy.md`.
- G4 - covered by Tasks 1-2: treat `.sdd/autonomy.md` as a project-owned core file
  preserved by force/update and checked by doctor.
- G5 - covered by Task 4: add CLI and template tests for profiles, preservation, doctor,
  and provider guidance.
- G6 - covered by Task 5: assert each profile installs distinct operating-mode guidance
  and provider entrypoints tell agents to apply it.

No goals are out of scope for this plan.

## Assumptions

1. **Three profiles are enough for the first version.** - Confirmed by user direction to
   proceed autonomously after the requirements discussion. If false, `--profile` may need
   a richer config format later.

2. **`.sdd/autonomy.md` should be project-owned.** - Teams will tune risk boundaries
   after install. If false, `update` would need refresh semantics for local policy files.

3. **Agents satisfy approval markers by documenting self-approval when policy allows.** -
   This keeps existing `gate` semantics intact. If false, `gate` needs autonomy-aware
   bypass logic, which is out of scope for this increment.

4. **`sddguard next --json` is deferred.** - This first increment installs and documents
   policy; orchestration can build on it later. If false, the change expands into command
   design and JSON contracts.

5. **Shared workflow and entrypoint guidance is enough.** - Providers already tell agents
   to read `.sdd/workflow.md`. If false, each command-aware provider template would need
   deeper command-by-command changes.

## Approach

Add profile-specific Markdown templates under `templates/autonomy/`, copy the selected
profile to `.sdd/autonomy.md` during `init`, and make `.sdd/autonomy.md` a user-owned
core file. The default `guided` profile preserves the current behavior. `agent` and
`autonomous` broaden delegated self-approval in the policy text while keeping hard stops
for ambiguity, pending CRs, unresolved gaps, failing tests, unlisted scope, high-risk
domains, and release/commit actions.

Use the existing `init` option style and synchronous template copy helpers. Avoid new
dependencies and avoid templating inside Markdown files by storing one complete template
per profile.

Simpler alternative rejected: one `templates/autonomy.md` file plus string replacement for
mode-specific sections. That would add custom templating behavior where the project
currently treats templates as copied data.

## Tradeoffs

- Three static policy templates -> duplicated headings between profiles -> acceptable
  because it keeps install behavior simple and transparent.
- `gate` remains approval-marker based -> autonomous agents still need to record
  self-approval in spec files -> acceptable because it preserves existing CI/check
  semantics and leaves an audit trail.
- No `sddguard next` yet -> autonomous agents rely on instructions rather than machine
  readable next-action output -> acceptable for the first increment because policy
  installation is the prerequisite.

## Components Affected

| Exact path | Role | Notes |
|---|---|---|
| `src/cli.ts` | Modified | Add `init --profile <profile>` option and help text |
| `src/commands/init.ts` | Modified | Parse profile and copy selected autonomy template |
| `src/providers.ts` | Modified | Define autonomy profile files and mark policy as core/user-owned |
| `templates/autonomy/guided.md` | New | Default policy matching current human-approved behavior |
| `templates/autonomy/agent.md` | New | Conservative delegated policy for agent work |
| `templates/autonomy/autonomous.md` | New | Broad delegated policy with hard stops |
| `templates/workflow.md` | Modified | Add autonomy policy rules and delegated approval semantics |
| `templates/AGENTS.md` | Modified | Add `.sdd/autonomy.md` to Codex project context |
| `templates/CLAUDE.md` | Modified | Add `.sdd/autonomy.md` to Claude project context |
| `templates/gemini.md` | Modified | Add `.sdd/autonomy.md` to Gemini project context |
| `templates/copilot-instructions.md` | Modified | Add `.sdd/autonomy.md` to Copilot project context |
| `templates/cursor-rules/sddguard.mdc` | Modified | Add `.sdd/autonomy.md` to Cursor rules |
| `templates/windsurf-rules/sddguard.md` | Modified | Add `.sdd/autonomy.md` to Windsurf rules |
| `templates/zed-rules/sddguard.md` | Modified | Add `.sdd/autonomy.md` to Zed rules |
| `README.md` | Modified | Document profiles and autonomy policy |
| `test/cli-smoke.test.js` | Modified | Cover default/explicit profiles, invalid profile, preservation, update, doctor |
| `test/provider-parity.test.js` | Modified | Require entry/rule files to mention autonomy policy |
| `test/package.test.js` | Modified | Assert autonomy templates are published |
| `test/workflow-e2e.test.js` | Modified | Accept platform-specific path separators exposed by full-suite verification |
| `.sdd/workflow.md` | Modified | Keep dogfood workflow in sync with installed workflow template |

## New Artifacts

- File: `templates/autonomy/guided.md` - policy copied for default installs.
- File: `templates/autonomy/agent.md` - policy copied for conservative autonomous
  agent work.
- File: `templates/autonomy/autonomous.md` - policy copied for broad autonomous agent
  work.
- Type: `AutonomyProfile` in `src/providers.ts`.

No migrations, schemas, databases, or external services are introduced.

## What This Plan Does NOT Do

- Does not add a daemon, watcher, server, background process, or external agent runner.
- Does not execute AI tool commands automatically.
- Does not add `sddguard next`, `next --json`, scheduling, or orchestration.
- Does not make `gate` pass unapproved plans.
- Does not remove the guided workflow or change it as the default.
- Does not add provider-specific autonomy logic beyond shared policy guidance.
- Does not make auth, payments, security, destructive data changes, or releases
  autonomous by default.

## External Dependencies

None.

## Risks & Open Questions

Risk: wording in `.sdd/autonomy.md` could be interpreted as permission to ignore SDD
stop points.
-> Mitigation: every profile explicitly says delegated self-approval is allowed only
within policy and that hard stops still stop.

Risk: adding `.sdd/autonomy.md` to core files makes `doctor` fail for older installs.
-> Acceptable because `doctor` is already a health check for current expected install
surface; users can run `init --force` to add missing current core files, and user-owned
policy is preserved once present.

Risk: provider entrypoints are user-owned and `update` will not refresh existing installs.
-> Acceptable because this is existing update behavior. README can tell users to re-run
`init --force` or manually add the policy reference if they want existing entrypoints
to mention it.

Open questions: none.

## Abort Criteria

- Adding `.sdd/autonomy.md` requires changing `update` to overwrite project-owned files.
- Profile installation cannot be implemented without templating Markdown strings.
- Tests show existing `init --provider`, `init --all`, or non-TTY default behavior changes.
- Provider parity requires editing every command file instead of shared entry/rule files.
- Any task requires a new dependency.

## Gap Handling

Implementation-time ambiguities, contradictions, or technical impossibilities are not
recorded here. Run `/impl-gap` and append to `specs/agent-autonomy-policy/impl-gaps.md`.
If the resolution changes requirements or plan, escalate via `/spec-amend` before editing
approved spec files.

## Verification

Task 1: New autonomy policy templates and provider registry entries exist.
Run: `npm run check` and targeted assertions in `test/package.test.js`.
Scenarios: default init installs guided autonomy policy; explicit autonomous profile
installs autonomous policy; agent profile installs middle-ground policy.

Task 2: `init --profile` copies the selected template, rejects invalid profiles, preserves
custom policy during `init --force`, and lets `doctor` detect missing policy.
Run: `npm test`.
Scenarios: default init installs guided autonomy policy; explicit autonomous profile
installs autonomous policy; agent profile installs middle-ground policy; invalid profile
fails clearly; force install preserves edited autonomy policy; doctor reports missing
autonomy policy.

Task 3: Workflow and provider entrypoints/rules explain autonomy policy and hard stops.
Run: `npm test`.
Scenarios: provider entrypoints point agents at autonomy policy; workflow preserves hard
stops.

Task 4: README and update behavior reflect project-owned policy.
Run: `npm test` and `npm pack --dry-run`.
Scenarios: update preserves autonomy policy.

Task 5: Profile policies define distinct operating behavior.
Run: `node --test test/cli-smoke.test.js test/provider-parity.test.js` and `npm test`.
Scenarios: profiles encode distinct operating behavior; provider entrypoints point agents
at autonomy policy.

## Task Count Estimate

5 tasks.

---

## Approval

Date:
Approved by: user
Notes: Approved via "continua de forma autonoma" on 2026-06-18.
