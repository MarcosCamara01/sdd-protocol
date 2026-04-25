import path from 'path';
import fs from 'fs';
import { ensureDir, copyTemplate } from '../utils';

interface InitOptions {
  force?: boolean;
}

const FILES: Array<{ src: string; dest: string }> = [
  { src: 'workflow.md', dest: '.sdd/workflow.md' },
  { src: 'project-overview.md', dest: '.sdd/project-overview.md' },
  { src: 'conventions/base.md', dest: '.sdd/conventions.md' },
  { src: 'CLAUDE.md', dest: 'CLAUDE.md' },
  { src: 'specs/_template/1-requirements.md', dest: 'specs/_template/1-requirements.md' },
  { src: 'specs/_template/2-plan.md', dest: 'specs/_template/2-plan.md' },
  { src: 'specs/_template/3-tasks.md', dest: 'specs/_template/3-tasks.md' },
];

export function initCommand(options: InitOptions): void {
  const cwd = process.cwd();
  const { force } = options;

  console.log('');
  console.log('  SDD Protocol — initializing');
  console.log('');

  ensureDir(path.join(cwd, '.sdd/domains'));
  ensureDir(path.join(cwd, 'specs/_template'));

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
  console.log('  3. Use /spec-new to start your first feature\n');
}
