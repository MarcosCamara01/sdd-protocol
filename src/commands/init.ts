import path from 'path';
import fs from 'fs';
import { checkbox } from '@inquirer/prompts';
import { ensureDir, copyTemplate } from '../utils';

interface InitOptions {
  force?: boolean;
}

const CORE_FILES: Array<{ src: string; dest: string }> = [
  { src: 'workflow.md', dest: '.sdd/workflow.md' },
  { src: 'project-overview.md', dest: '.sdd/project-overview.md' },
  { src: 'conventions/base.md', dest: '.sdd/conventions.md' },
  { src: 'CLAUDE.md', dest: 'CLAUDE.md' },
  { src: 'specs/_template/1-requirements.md', dest: 'specs/_template/1-requirements.md' },
  { src: 'specs/_template/2-plan.md', dest: 'specs/_template/2-plan.md' },
  { src: 'specs/_template/3-tasks.md', dest: 'specs/_template/3-tasks.md' },
];

type ProviderId = 'claude-code' | 'cursor' | 'windsurf' | 'copilot' | 'codex';

interface Provider {
  name: string;
  dirs: string[];
  files: Array<{ src: string; dest: string }>;
}

const PROVIDERS: Record<ProviderId, Provider> = {
  'claude-code': {
    name: 'Claude Code',
    dirs: ['.claude/commands'],
    files: [
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
    ],
  },
  cursor: {
    name: 'Cursor',
    dirs: ['.cursor/rules'],
    files: [
      { src: 'cursor-rules/sddx-workflow.mdc', dest: '.cursor/rules/sddx-workflow.mdc' },
    ],
  },
  windsurf: {
    name: 'Windsurf',
    dirs: ['.windsurf/rules'],
    files: [
      { src: 'windsurf-rules/sddx-workflow.md', dest: '.windsurf/rules/sddx-workflow.md' },
    ],
  },
  copilot: {
    name: 'GitHub Copilot',
    dirs: ['.github/prompts'],
    files: [
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
    ],
  },
  codex: {
    name: 'OpenAI Codex',
    dirs: [
      '.agents/skills/bootstrap',
      '.agents/skills/ask',
      '.agents/skills/assume',
      '.agents/skills/bugfix',
      '.agents/skills/refactor',
      '.agents/skills/spec-new',
      '.agents/skills/spec-plan',
      '.agents/skills/spec-tasks',
      '.agents/skills/review',
      '.agents/skills/finish',
    ],
    files: [
      { src: 'AGENTS.md', dest: 'AGENTS.md' },
      { src: 'codex-skills/bootstrap/SKILL.md', dest: '.agents/skills/bootstrap/SKILL.md' },
      { src: 'codex-skills/ask/SKILL.md', dest: '.agents/skills/ask/SKILL.md' },
      { src: 'codex-skills/assume/SKILL.md', dest: '.agents/skills/assume/SKILL.md' },
      { src: 'codex-skills/bugfix/SKILL.md', dest: '.agents/skills/bugfix/SKILL.md' },
      { src: 'codex-skills/refactor/SKILL.md', dest: '.agents/skills/refactor/SKILL.md' },
      { src: 'codex-skills/spec-new/SKILL.md', dest: '.agents/skills/spec-new/SKILL.md' },
      { src: 'codex-skills/spec-plan/SKILL.md', dest: '.agents/skills/spec-plan/SKILL.md' },
      { src: 'codex-skills/spec-tasks/SKILL.md', dest: '.agents/skills/spec-tasks/SKILL.md' },
      { src: 'codex-skills/review/SKILL.md', dest: '.agents/skills/review/SKILL.md' },
      { src: 'codex-skills/finish/SKILL.md', dest: '.agents/skills/finish/SKILL.md' },
    ],
  },
};

const ALL_PROVIDER_IDS = Object.keys(PROVIDERS) as ProviderId[];

async function selectProviders(): Promise<ProviderId[]> {
  if (!process.stdout.isTTY) {
    return ALL_PROVIDER_IDS;
  }

  const selected = await checkbox({
    message: 'Select the AI providers to install:',
    choices: ALL_PROVIDER_IDS.map((id) => ({
      name: PROVIDERS[id].name,
      value: id,
      checked: true,
    })),
    required: true,
  });

  return selected as ProviderId[];
}

export async function initCommand(options: InitOptions): Promise<void> {
  const cwd = process.cwd();
  const { force } = options;

  console.log('');
  console.log('  SDD Workflow — initializing');
  console.log('');

  const selectedProviders = await selectProviders();

  console.log('');

  ensureDir(path.join(cwd, '.sdd/domains'));
  ensureDir(path.join(cwd, 'specs/_template'));

  for (const id of selectedProviders) {
    for (const dir of PROVIDERS[id].dirs) {
      ensureDir(path.join(cwd, dir));
    }
  }

  const claudeExisted = fs.existsSync(path.join(cwd, 'CLAUDE.md'));
  const agentsExisted = fs.existsSync(path.join(cwd, 'AGENTS.md'));

  for (const file of CORE_FILES) {
    copyTemplate(file.src, path.join(cwd, file.dest), force);
  }

  for (const id of selectedProviders) {
    for (const file of PROVIDERS[id].files) {
      copyTemplate(file.src, path.join(cwd, file.dest), force);
    }
  }

  const providerNames = selectedProviders.map((id) => PROVIDERS[id].name).join(', ');

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
  if (selectedProviders.includes('codex')) {
    if (!agentsExisted) {
      console.log('     AGENTS.md was created — Codex will read it automatically');
    } else {
      console.log('     AGENTS.md already exists — add a reference to .sdd/ files manually');
    }
  }
  console.log(`  3. Slash commands are ready in: ${providerNames}. Type / to see them.\n`);
}
