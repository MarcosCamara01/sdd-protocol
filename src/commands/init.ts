import path from 'path';
import fs from 'fs';
import { ensureDir, copyTemplate } from '../utils';

interface InitOptions {
  force?: boolean;
}

const FILES: Array<{ src: string; dest: string }> = [
  // Core SDD files
  { src: 'workflow.md', dest: '.sdd/workflow.md' },
  { src: 'project-overview.md', dest: '.sdd/project-overview.md' },
  { src: 'conventions/base.md', dest: '.sdd/conventions.md' },
  { src: 'CLAUDE.md', dest: 'CLAUDE.md' },
  // Spec templates
  { src: 'specs/_template/1-requirements.md', dest: 'specs/_template/1-requirements.md' },
  { src: 'specs/_template/2-plan.md', dest: 'specs/_template/2-plan.md' },
  { src: 'specs/_template/3-tasks.md', dest: 'specs/_template/3-tasks.md' },
  // Claude Code slash commands
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
  // Cursor rules
  { src: 'cursor-rules/sdd-protocol.mdc', dest: '.cursor/rules/sdd-protocol.mdc' },
  // GitHub Copilot slash commands
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
  // GitHub Copilot always-on context
  { src: 'copilot-instructions.md', dest: '.github/copilot-instructions.md' },
];

export function initCommand(options: InitOptions): void {
  const cwd = process.cwd();
  const { force } = options;

  console.log('');
  console.log('  SDD Protocol — initializing');
  console.log('');

  ensureDir(path.join(cwd, '.sdd/domains'));
  ensureDir(path.join(cwd, 'specs/_template'));
  ensureDir(path.join(cwd, '.claude/commands'));
  ensureDir(path.join(cwd, '.cursor/rules'));
  ensureDir(path.join(cwd, '.github/prompts'));

  const claudeExisted = fs.existsSync(path.join(cwd, 'CLAUDE.md'));

  for (const file of FILES) {
    copyTemplate(file.src, path.join(cwd, file.dest), force);
  }

  console.log('');
  console.log('  Done. Next steps:');
  console.log('');
  console.log('  1. Run /bootstrap to populate project context (new project)');
  console.log('     or /bootstrap --scan to let the agent analyze the codebase (existing project)');
  if (!claudeExisted) {
    console.log('  2. CLAUDE.md was created — share it with your AI agent as context');
  } else {
    console.log('  2. CLAUDE.md already exists — add a reference to .sdd/ files manually');
  }
  console.log('  3. Slash commands are ready in Claude Code, Cursor, and GitHub Copilot. Type / to see them.\n');
}
