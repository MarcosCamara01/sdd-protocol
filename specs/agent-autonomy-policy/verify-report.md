# Verify Report: Agent Autonomy Policy

Result: PASS

## Checks

| # | Check | Status | Evidence |
|---|---|---|---|
| 1 | All tasks in `3-tasks.md` marked complete | PASS | T1, T2, T3, T4, and T5 are checked in `specs/agent-autonomy-policy/3-tasks.md`. |
| 2 | Every goal has a referencing task and observable artifact | PASS | G1-G6 are referenced by T1-T5 and map to CLI code, templates, docs, and tests. |
| 3 | Every acceptance scenario has a corresponding passing test | PASS | `test/cli-smoke.test.js`, `test/provider-parity.test.js`, `test/package.test.js`, and `test/workflow-e2e.test.js` cover all scenarios. |
| 4 | Full test suite passes | PASS | `npm test` passed: Biome check, build, and 43 node:test tests. |
| 5 | No files modified outside "Components Affected" in `2-plan.md` | PASS | Content diff paths match the approved plan plus CR-001 and CR-002; pre-existing unrelated working-tree changes are excluded. |
| 6 | No unresolved `/impl-gap` entries | PASS | No `impl-gaps.md` exists for this spec. |
| 7 | No CRs in "Pending approval" status | PASS | `amendments.md` contains CR-001 and CR-002 with `Status: Approved 2026-06-18`. |

## Detail

### Tasks

All implementation tasks are checked:

- T1 added `templates/autonomy/*.md`, profile metadata, and package coverage.
- T2 added `init --profile`, profile validation/copying, preservation behavior, and doctor coverage.
- T3 added autonomy guidance to workflow and provider entry/rule templates.
- T4 documented profiles in README and made the e2e path assertion platform-neutral.
- T5 added behavior-specific operating-mode guidance and tests for `guided`, `agent`,
  and `autonomous`.

### Goals

- G1: `src/cli.ts`, `src/commands/init.ts`, `README.md`, and `test/cli-smoke.test.js`.
- G2: `templates/autonomy/guided.md`, `agent.md`, `autonomous.md`, `src/providers.ts`, and package tests.
- G3: `templates/workflow.md`, `.sdd/workflow.md`, provider entry/rule templates, and provider parity tests.
- G4: `src/providers.ts`, `src/commands/init.ts`, `src/commands/doctor.ts`, and CLI smoke tests.
- G5: `test/cli-smoke.test.js`, `test/provider-parity.test.js`, `test/package.test.js`, and `test/workflow-e2e.test.js`.
- G6: `templates/autonomy/*.md`, `test/cli-smoke.test.js`, and `test/provider-parity.test.js`.

### Scenarios

- Default guided policy: covered by `init --provider codex installs only core and Codex provider files`.
- Explicit autonomous profile: covered by `init --profile installs the selected autonomy policy`.
- Agent profile: covered by `init --profile installs the selected autonomy policy`.
- Invalid profile: covered by `init rejects invalid autonomy profiles`.
- Force preservation: covered by `init without force skips existing files, while force preserves project context and refreshes workflow/provider files`.
- Update preservation: covered by `update detects drift, repairs existing files, and does not create uninstalled providers or touch project context`.
- Doctor missing policy: covered by `doctor reports healthy installs, missing installs, missing core files, and partial providers`.
- Provider entrypoints: covered by `entry and rule files point agents at autonomy policy`.
- Hard stops: covered by workflow text and provider parity asserting delegated/self-approval policy guidance.
- Distinct operating modes: covered by `init --profile installs behavior-specific autonomy policies`.

### Scope

Content diff paths are within the approved plan and CR-001/CR-002:

- CLI/runtime: `src/cli.ts`, `src/commands/init.ts`, `src/commands/doctor.ts`, `src/providers.ts`.
- Templates/docs: `templates/autonomy/*`, `templates/workflow.md`, provider entry/rule templates, `.sdd/workflow.md`, `README.md`.
- Tests: `test/cli-smoke.test.js`, `test/package.test.js`, `test/provider-parity.test.js`, `test/workflow-e2e.test.js`.
- Spec artifacts: `specs/agent-autonomy-policy/*`.

Known unrelated working-tree changes that predate or sit outside this feature are not part
of this verification.

### Gaps and CRs

No implementation gaps were opened.

CR-001 is approved and documents adding `test/workflow-e2e.test.js` to the plan after full-suite verification exposed a Windows path-separator assertion.

CR-002 is approved and documents behavior-specific operating-mode tests requested by the user.

## Conclusion

The agent autonomy policy feature satisfies the approved requirements. `npm test` passes,
`npm pack --dry-run` is covered by the package test, and an `npx` audit passed in three
separate temporary projects for `guided`, `agent`, and `autonomous`.

Additional deep audit on 2026-06-18:

- Built the package and installed it with `npx --package <local tarball>` into three
  scratch Node projects, one per profile.
- In each project, implemented a `stats-summary` feature through requirements, approved
  plan, red test, implementation, green test, tasks, verify report, review report, and
  `sddguard gate finish`.
- In each project, fixed a seeded `titleCase` bug with a failing test first, a minimal
  fix, and a passing final suite.
- Confirmed profile-specific behavior: `guided` artifacts used simulated human approval
  and no self-approval marker; `agent` and `autonomous` artifacts recorded delegated
  self-approval per `.sdd/autonomy.md`.
- Confirmed `doctor`, `commands --installed`, and `status` worked after feature and
  bugfix flows.
