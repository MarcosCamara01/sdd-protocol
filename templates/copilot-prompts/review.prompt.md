---
description: Final audit before closing a spec
mode: agent
---

Execute the /review command defined in .sdd/workflow.md.

Verify: all goals (G1, G2…) satisfied, every acceptance scenario has a passing test, full test suite passes, no out-of-scope changes, no speculative code, implementation is the simplest that meets requirements.

Spec: ${input:specName}
