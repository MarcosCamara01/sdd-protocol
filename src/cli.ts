import { Command } from 'commander';
import { initCommand } from './commands/init';
import { addCommand } from './commands/add';
import { createRequire } from 'module';

const pkg = createRequire(__filename)('../package.json') as { version: string };

const program = new Command();

program
  .name('sdd-protocol')
  .description('Spec-Driven Development CLI')
  .version(pkg.version);

program
  .command('init')
  .description('Initialize SDD protocol in the current project')
  .option('--force', 'Overwrite files that already exist')
  .action(initCommand);

program
  .command('add <type> <name>')
  .description('Add an SDD component to an existing installation')
  .addHelpText('after', '\nExamples:\n  $ sdd-protocol add domain auth\n  $ sdd-protocol add domain payments')
  .action(addCommand);

program.parse();
