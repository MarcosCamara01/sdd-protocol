# Change Requests: Agent Autonomy Policy

## CR-001 - 2026-06-18

- **Trigger:** full-suite verification
- **Motive:** `node --test` exposed an existing Windows path-separator expectation in `test/workflow-e2e.test.js` when validating this feature on Windows.
- **Change in requirements:** none.
- **Change in plan:** Add `test/workflow-e2e.test.js` as a modified test file for platform-neutral path assertions.
- **Affected tasks:** T4 verification includes the e2e path assertion adjustment.
- **Status:** Approved 2026-06-18 - self-approved by agent per user instruction to continue autonomously.

## CR-002 - 2026-06-18

- **Trigger:** user-requested
- **Motive:** The user asked for tests that prove each profile makes agents behave according to the selected mode, not only that the selected `Mode:` line is installed.
- **Change in requirements:** Add explicit behavior-specific operating-mode coverage for `guided`, `agent`, and `autonomous` policies.
- **Change in plan:** Strengthen template and provider-entrypoint tests so installed policies must define distinct operating defaults and entrypoints must tell agents to apply the policy's `Operating Mode`.
- **Affected tasks:** Add T5 for behavior-specific profile tests and policy wording.
- **Status:** Approved 2026-06-18 - approved by user request "pero haz los test para comprobar cada modo".
