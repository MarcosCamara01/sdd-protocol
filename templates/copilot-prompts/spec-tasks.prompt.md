---
description: Execute approved plan one task at a time, TDD-first
mode: agent
---

Execute the /spec-tasks command defined in .sdd/workflow.md.

Read the approved specs/${input:specName}/2-plan.md and execute tasks one at a time.
Write the test first (red), implement until green, run the full suite, then move to the next task.
Stop immediately if tests fail or a task reveals new scope.
