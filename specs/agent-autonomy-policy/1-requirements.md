# Requirements: Agent Autonomy Policy

> Decisions and trade-offs only. Implementation details belong in `2-plan.md`.

## Status

- [x] Draft
- [x] Reviewed
- [x] Ready for /spec-plan - all open questions resolved, all scenarios written

---

## Problem Statement

`sddguard` currently installs a guided SDD workflow where the human explicitly approves
structural decisions before the agent continues. That is the safest default, but it is
awkward for users who want an AI agent to work more autonomously while still using
SDD artifacts such as specs, bugfix flow, verify, review, gaps, and amendments.

Without an explicit autonomy policy, users have two poor options:

- Keep the current workflow and manually approve every stop point, even for low-risk
  agent runs.
- Tell the agent to "just continue", which weakens the protocol because the delegated
  approvals, hard stops, and risk boundaries are not recorded in the project.

The product needs a first-class way to choose between the current guided behavior and
an agent-oriented behavior where selected stop points may be self-approved according
to a project-owned policy.

## Goals

- **G1**: Users can choose an autonomy profile during `sddguard init` without changing
  provider selection or the default guided install behavior.
- **G2**: New installs include a project-owned `.sdd/autonomy.md` policy that explains
  what the agent may self-approve and which situations still require human input.
- **G3**: Agent entrypoints and workflow instructions tell agents to read and honor
  `.sdd/autonomy.md` before deciding whether a stop point is human-only or delegated.
- **G4**: `sddguard` preserves user-edited autonomy policy files during `init --force`
  and `update`, while `doctor` can detect when the policy file is missing.
- **G5**: Tests cover profile selection, invalid profiles, preservation behavior, and
  provider/template guidance so regressions are caught.
- **G6**: Each autonomy profile encodes a distinct operating mode so obedient agents
  choose different default behavior in `guided`, `agent`, and `autonomous` installs.

## Non-Goals

- Does not add a daemon, watcher, server, background process, or external agent runner.
- Does not execute AI tool commands automatically.
- Does not add `sddguard next`, `next --json`, scheduling, or orchestration in this
  first increment.
- Does not bypass `gate` checks by making unapproved plans pass silently.
- Does not remove the current guided workflow or change it as the default.
- Does not add provider-specific autonomy behavior beyond shared installed policy and
  instructions.
- Does not make high-risk domains such as auth, payments, security, data deletion, or
  releases autonomous by default.

## Acceptance Criteria

Scenario: default init installs guided autonomy policy
  Given: a user runs `sddguard init --provider codex`
  When: initialization completes
  Then: `.sdd/autonomy.md` exists
    And: it declares `Mode: guided`
    And: current provider installation behavior remains unchanged

Scenario: explicit autonomous profile installs autonomous policy
  Given: a user runs `sddguard init --provider codex --profile autonomous`
  When: initialization completes
  Then: `.sdd/autonomy.md` exists
    And: it declares `Mode: autonomous`
    And: it documents delegated approvals and human-required hard stops

Scenario: agent profile installs middle-ground policy
  Given: a user runs `sddguard init --provider codex --profile agent`
  When: initialization completes
  Then: `.sdd/autonomy.md` exists
    And: it declares `Mode: agent`
    And: it permits more self-approval than guided mode but less than autonomous mode

Scenario: invalid profile fails clearly
  Given: a user runs `sddguard init --profile spaceship`
  When: the CLI validates options
  Then: the command exits non-zero
    And: the error names the invalid profile
    And: the valid profiles are shown

Scenario: force install preserves edited autonomy policy
  Given: an installed project has a custom `.sdd/autonomy.md`
  When: the user runs `sddguard init --force --provider codex`
  Then: `.sdd/autonomy.md` is not overwritten
    And: other managed workflow and command files still follow existing force behavior

Scenario: update preserves autonomy policy
  Given: an installed project has a custom `.sdd/autonomy.md`
  When: the user runs `sddguard update` or `sddguard update --check`
  Then: `.sdd/autonomy.md` is not reported as outdated
    And: `.sdd/autonomy.md` is not overwritten

Scenario: doctor reports missing autonomy policy
  Given: an installed project is missing `.sdd/autonomy.md`
  When: the user runs `sddguard doctor`
  Then: the command reports the missing core file
    And: the command exits non-zero

Scenario: provider entrypoints point agents at autonomy policy
  Given: a user installs any provider integration
  When: the agent reads its entrypoint or rules file
  Then: the instructions include `.sdd/autonomy.md` as project context
    And: the instructions explain that delegated self-approval must come from that file

Scenario: workflow preserves hard stops
  Given: `.sdd/autonomy.md` allows autonomous work
  When: an agent hits ambiguity, contradiction, failing tests, pending CRs, unresolved gaps,
        unlisted scope, or a human-required risk category
  Then: the workflow requires the agent to stop and report instead of improvising

Scenario: profiles encode distinct operating behavior
  Given: a user installs `guided`, `agent`, and `autonomous` profiles
  When: the agent reads `.sdd/autonomy.md`
  Then: `guided` tells the agent to ask before approving SDD stop points
    And: `agent` tells the agent to continue only for low-risk, bounded, test-backed work
    And: `autonomous` tells the agent to continue through routine SDD phases without waiting
    And: provider entrypoints tell agents to apply the policy's `Operating Mode`

## Constraints

Technical:

- Must keep the installer-only architecture: copied Markdown plus CLI checks, not runtime
  enforcement inside target projects.
- Must keep plain Markdown as the policy format so users can read and edit it.
- Must not add a dependency.
- Must preserve provider parity: all provider entrypoints/rules should point to the same
  autonomy policy concept.
- Must keep `guided` behavior as the default for backward-compatible installs.

Product:

- The policy must be understandable to both a human user and an AI agent.
- The autonomous profile must still have explicit hard stops for high-risk or ambiguous work.
- The feature should be useful even for rule-only providers that do not have slash command files.

## Assumptions

1. **Three profiles are enough for the first version.** - `guided`, `agent`, and
   `autonomous` cover the current workflow, a conservative delegated mode, and a broad
   delegated mode without inventing a complex policy language.
   If wrong: the CLI needs either more profiles or a structured config format.

2. **`.sdd/autonomy.md` should be project-owned.** - teams will want to edit their
   risk categories and delegated permissions after install.
   If wrong: `update` could refresh the file, but that would risk overwriting local policy.

3. **Agents can satisfy approval markers by documenting self-approval when policy allows.** -
   this keeps existing `gate` semantics intact instead of making `gate` pass unapproved plans.
   If wrong: `gate` needs autonomy-aware bypass logic.

4. **The first increment should not include `sddguard next`.** - a next-action command is
   useful, but it is a separate orchestration feature and would broaden the first change.
   If wrong: the plan needs new command design, JSON output, and additional tests.

5. **Autonomy guidance can live in shared workflow and entrypoint text.** - providers already
   read `.sdd/workflow.md`, so the policy does not need separate per-provider logic.
   If wrong: command-aware provider templates need deeper changes.

## Open Questions

None blocking.

## Clarifications

- [x] NON-BLOCKING - CLI option name? -> Use `--profile <guided|agent|autonomous>` because
  it describes a bundled policy choice and avoids overloading provider selection.
- [x] NON-BLOCKING - Should `sddguard next --json` be included now? -> No. Defer to a later
  orchestration feature after policy installation exists.
- [x] NON-BLOCKING - Should `gate` accept unapproved plans in autonomous mode? -> No. Agents
  may self-approve by updating the normal approval marker only when `.sdd/autonomy.md` allows it.
