# Tasks: Agent Autonomy Policy

## Status

Plan approved: 2026-06-18

---

## Rules

- One task at a time - finish it completely before moving on
- Write the test first - it must fail (red) before any implementation; implement until green; then run the full suite
- Each task touches only what's needed - no cleanup of adjacent code
- If a task reveals ambiguity, contradiction, impossibility, or new scope, STOP and run /impl-gap. If requirements or plan must change, escalate to /spec-amend before editing approved spec files.

---

## Tasks

- [x] **T1** Add autonomy policy templates and package coverage.
  - Test: Extend `test/package.test.js` to require `templates/autonomy/guided.md`, `templates/autonomy/agent.md`, and `templates/autonomy/autonomous.md`; it must fail before the templates exist.
  - Changes: Add the three Markdown policy templates under `templates/autonomy/` and export profile metadata in `src/providers.ts`.
  - Goal: G2, G5
  - Criterion: default init installs guided autonomy policy; explicit autonomous profile installs autonomous policy; agent profile installs middle-ground policy.

- [x] **T2** Install selected autonomy profile and preserve policy.
  - Test: Extend `test/cli-smoke.test.js` to cover default profile install, `--profile agent`, `--profile autonomous`, invalid profile rejection, force preservation, update preservation, and doctor missing-policy failure; these assertions must fail before implementation.
  - Changes: Add `init --profile <profile>` in `src/cli.ts`, parse/copy selected policy in `src/commands/init.ts`, and include `.sdd/autonomy.md` in core/user-owned policy handling in `src/providers.ts`.
  - Goal: G1, G2, G4, G5
  - Criterion: default init installs guided autonomy policy; explicit autonomous profile installs autonomous policy; agent profile installs middle-ground policy; invalid profile fails clearly; force install preserves edited autonomy policy; update preserves autonomy policy; doctor reports missing autonomy policy.

- [x] **T3** Teach workflow and provider entrypoints to honor autonomy policy.
  - Test: Extend `test/provider-parity.test.js` to assert every entry/rule file mentions `.sdd/autonomy.md`; it must fail before template edits.
  - Changes: Update `templates/workflow.md`, `.sdd/workflow.md`, and provider entry/rule templates to describe autonomy policy, delegated self-approval, and hard stops.
  - Goal: G3, G5
  - Criterion: provider entrypoints point agents at autonomy policy; workflow preserves hard stops.

- [x] **T4** Document autonomy profiles in README.
  - Test: Existing README-sensitive checks plus full suite must pass after docs update.
  - Changes: Update `README.md` with `--profile` usage, mode semantics, and the deferred/non-runner boundary. Update `test/workflow-e2e.test.js` to accept platform-specific printed path separators exposed by the full suite.
  - Goal: G1, G2, G3
  - Criterion: workflow preserves hard stops; update preserves autonomy policy.

- [x] **T5** Verify behavior-specific operating modes.
  - Test: Extend `test/cli-smoke.test.js` to install `guided`, `agent`, and `autonomous` and assert each copied `.sdd/autonomy.md` contains distinct operating-mode instructions. Extend `test/provider-parity.test.js` to require entry/rule files to tell agents to apply `Operating Mode`.
  - Changes: Add `## Operating Mode` guidance to each autonomy template and update shared workflow/provider entrypoints to apply the selected mode.
  - Goal: G3, G5, G6
  - Criterion: profiles encode distinct operating behavior; provider entrypoints point agents at autonomy policy.

---

## Completion

- [x] All tasks done
- [x] Every acceptance scenario in 1-requirements.md covered by a passing test
- [x] /verify completed
- [x] /review completed with `review-report.md`
- [ ] Spec moved to `specs/_done/<name>/`
