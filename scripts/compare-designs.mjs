import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const server = fileURLToPath(new URL('./serve-static.mjs', import.meta.url));
const versions = [
  { name: 'Desain sebelumnya', port: 4324, root: fileURLToPath(new URL('../../sanity-content-platform/dist/', import.meta.url)) },
  { name: 'Korporat modern maritim', port: 4325, root: fileURLToPath(new URL('../dist/', import.meta.url)) },
];

for (const version of versions) {
  if (!existsSync(`${version.root}/index.html`)) {
    console.error(`Build ${version.name} terlebih dahulu. Folder: ${version.root}`);
    process.exit(1);
  }
}

let stopping = false;
const children = [];
const stop = () => {
  if (stopping) return;
  stopping = true;
  for (const child of children) child.kill();
};

for (const version of versions) {
  const child = spawn(process.execPath, [server], {
    env: { ...process.env, PORT: String(version.port), STATIC_ROOT: version.root },
    stdio: 'inherit',
    windowsHide: true,
  });
  children.push(child);
  child.on('error', (error) => { console.error(error.message); process.exitCode = 1; stop(); });
  child.on('exit', (code) => { if (!stopping) { process.exitCode = code || 0; stop(); } });
  console.log(`${version.name}: http://127.0.0.1:${version.port}`);
}

process.on('SIGINT', stop);
process.on('SIGTERM', stop);
