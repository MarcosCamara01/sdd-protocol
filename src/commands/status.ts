import fs from 'fs';
import path from 'path';

function isBootstrapped(cwd: string): boolean {
  const file = path.join(cwd, '.sdd/project-overview.md');
  if (!fs.existsSync(file)) return false;
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  return lines.some(line => {
    const t = line.trim();
    return t.length > 0 && !t.startsWith('#') && !t.startsWith('<!--') && !t.startsWith('-->');
  });
}

interface SpecInfo {
  name: string;
  planApproved: boolean;
  tasksDone: number;
  tasksTotal: number;
}

function readSpec(specDir: string): SpecInfo {
  const name = path.basename(specDir);
  const tasksFile = path.join(specDir, '3-tasks.md');

  if (!fs.existsSync(tasksFile)) {
    return { name, planApproved: false, tasksDone: 0, tasksTotal: 0 };
  }

  const content = fs.readFileSync(tasksFile, 'utf8');
  const planApproved = !content.includes('<!-- date -->');
  const tasksDone = (content.match(/^- \[x\]/gim) ?? []).length;
  const tasksPending = (content.match(/^- \[ \]/gim) ?? []).length;

  return { name, planApproved, tasksDone, tasksTotal: tasksDone + tasksPending };
}

export function statusCommand(): void {
  const cwd = process.cwd();

  if (!fs.existsSync(path.join(cwd, '.sdd'))) {
    console.error('\n  error    .sdd/ not found. Run `npx sddx-workflow init` first.\n');
    process.exit(1);
  }

  console.log('');

  const bootstrapped = isBootstrapped(cwd);
  console.log(`  bootstrap    ${bootstrapped ? 'done' : 'pending — run /bootstrap'}`);

  const specsDir = path.join(cwd, 'specs');
  if (!fs.existsSync(specsDir)) {
    console.log('  open specs   0');
    console.log('');
    return;
  }

  const specs = fs.readdirSync(specsDir)
    .filter(name => name !== '_template' && name !== '_done')
    .filter(name => fs.statSync(path.join(specsDir, name)).isDirectory())
    .map(name => readSpec(path.join(specsDir, name)));

  console.log(`  open specs   ${specs.length}`);

  for (const spec of specs) {
    const label = spec.name.padEnd(14);
    if (!spec.planApproved) {
      console.log(`    ${label} awaiting approval`);
    } else if (spec.tasksDone === spec.tasksTotal && spec.tasksTotal > 0) {
      console.log(`    ${label} ${spec.tasksDone}/${spec.tasksTotal} tasks · done`);
    } else {
      console.log(`    ${label} ${spec.tasksDone}/${spec.tasksTotal} tasks · in progress`);
    }
  }

  console.log('');
}
