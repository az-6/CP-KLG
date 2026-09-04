import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';

const host = '127.0.0.1';
const port = 4321;
const root = resolve('dist');
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
};

const isFile = async (path) => {
  try {
    return (await stat(path)).isFile();
  } catch {
    return false;
  }
};

createServer(async (request, response) => {
  const pathname = decodeURIComponent(new URL(request.url ?? '/', `http://${host}:${port}`).pathname);
  const requested = resolve(root, `.${pathname}`);
  if (requested !== root && !requested.startsWith(`${root}${sep}`)) {
    response.writeHead(400).end('Bad request');
    return;
  }

  const candidates = pathname.endsWith('/')
    ? [join(requested, 'index.html')]
    : [requested, join(requested, 'index.html')];
  const file = (await Promise.all(candidates.map(async (candidate) => (await isFile(candidate)) ? candidate : null)))
    .find(Boolean);
  const target = file ?? join(root, '404.html');
  const statusCode = file ? 200 : 404;

  try {
    const body = await readFile(target);
    response.writeHead(statusCode, {
      'content-type': mimeTypes[extname(target)] ?? 'application/octet-stream',
      'content-length': body.byteLength,
    });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch {
    response.writeHead(500).end('Static test server error');
  }
}).listen(port, host, () => {
  process.stdout.write(`Static test server listening on http://${host}:${port}\n`);
});
