import fs from 'fs';
import path from 'path';
import { copyTemplate } from '../utils';

const WORKFLOW_FILES: Array<{ src: string; dest: string }> = [
  { src: 'workflow.md', dest: '.sdd/workflow.md' },
  { src: 'claude-commands/bootstrap.md', dest: '.claude/commands/bootstrap.md' },
  { src: 'claude-commands/ask.md', dest: '.claude/commands/ask.md' },
  { src: 'claude-commands/assume.md', dest: '.claude/commands/assume.md' },
  { src: 'claude-commands/bugfix.md', dest: '.claude/commands/bugfix.md' },
  { src: 'claude-commands/refactor.md', dest: '.claude/commands/refactor.md' },
  { src: 'claude-commands/spec-new.md', dest: '.claude/commands/spec-new.md' },
  { src: 'claude-commands/spec-plan.md', dest: '.claude/commands/spec-plan.md' },
  { src: 'claude-commands/spec-tasks.md', dest: '.claude/commands/spec-tasks.md' },
  { src: 'claude-commands/review.md', dest: '.claude/commands/review.md' },
  { src: 'claude-commands/finish.md', dest: '.claude/commands/finish.md' },
  { src: 'cursor-rules/sddx-workflow.mdc', dest: '.cursor/rules/sddx-workflow.mdc' },
  { src: 'windsurf-rules/sddx-workflow.md', dest: '.windsurf/rules/sddx-workflow.md' },
  { src: 'copilot-prompts/bootstrap.prompt.md', dest: '.github/prompts/bootstrap.prompt.md' },
  { src: 'copilot-prompts/ask.prompt.md', dest: '.github/prompts/ask.prompt.md' },
  { src: 'copilot-prompts/assume.prompt.md', dest: '.github/prompts/assume.prompt.md' },
  { src: 'copilot-prompts/bugfix.prompt.md', dest: '.github/prompts/bugfix.prompt.md' },
  { src: 'copilot-prompts/refactor.prompt.md', dest: '.github/prompts/refactor.prompt.md' },
  { src: 'copilot-prompts/spec-new.prompt.md', dest: '.github/prompts/spec-new.prompt.md' },
  { src: 'copilot-prompts/spec-plan.prompt.md', dest: '.github/prompts/spec-plan.prompt.md' },
  { src: 'copilot-prompts/spec-tasks.prompt.md', dest: '.github/prompts/spec-tasks.prompt.md' },
  { src: 'copilot-prompts/review.prompt.md', dest: '.github/prompts/review.prompt.md' },
  { src: 'copilot-prompts/finish.prompt.md', dest: '.github/prompts/finish.prompt.md' },
  { src: 'copilot-instructions.md', dest: '.github/copilot-instructions.md' },
];

export function updateCommand(): void {
  const cwd = process.cwd();

  if (!fs.existsSync(path.join(cwd, '.sdd'))) {
    console.error('\n  error    .sdd/ not found. Run `npx sddx-workflow init` first.\n');
    process.exit(1);
  }

  console.log('');
  console.log('  SDD Workflow — updating workflow files');
  console.log('  (project-overview.md, conventions.md, CLAUDE.md, and domains are yours — untouched)');
  console.log('');

  let updated = 0;
  for (const file of WORKFLOW_FILES) {
    const dest = path.join(cwd, file.dest);
    if (!fs.existsSync(dest)) continue;
    copyTemplate(file.src, dest, true);
    updated++;
  }

  console.log('');
  console.log(`  Done. ${updated} file${updated !== 1 ? 's' : ''} updated.\n`);
}
