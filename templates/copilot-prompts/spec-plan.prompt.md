---
description: Generate technical plan — stops for approval before any code
mode: agent
---

Execute the /spec-plan command defined in .sdd/workflow.md.

Read specs/${input:specName}/1-requirements.md, run /assume to surface assumptions, then draft the technical plan in specs/${input:specName}/2-plan.md.
Stop for explicit approval before writing any implementation code.
