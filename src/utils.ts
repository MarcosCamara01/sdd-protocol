import fs from 'fs';
import path from 'path';

export const TEMPLATES_DIR = path.join(__dirname, '../templates');

export function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function copyTemplate(
  src: string,
  dest: string,
  force?: boolean,
): void {
  const exists = fs.existsSync(dest);
  if (exists && !force) {
    console.log(`  skip     ${dest}`);
    return;
  }
  fs.copyFileSync(path.join(TEMPLATES_DIR, src), dest);
  console.log(`  ${exists ? 'overwrite' : 'create  '}  ${dest}`);
}
