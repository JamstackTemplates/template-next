// Minimal static file server for previewing the export, like GitHub Pages would serve it.
// Usage: node scripts/serve.mjs [--base /site-preview] [--port 3000] [--dir out]
// With --base, files are served only under that path prefix, so missing prefixes show up as 404s.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const args = process.argv.slice(2);
const option = (name, fallback) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : fallback; };
const base = (option('base', process.env.PAGES_BASE_PATH || '') || '').replace(/\/+$/, '');
const port = Number(option('port', process.env.PORT || 3000));
const root = resolve(option('dir', 'out'));

const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml', '.woff2': 'font/woff2', '.webp': 'image/webp',
};

async function file(path) {
  try { const info = await stat(path); return info.isFile() ? path : info.isDirectory() ? file(join(path, 'index.html')) : null; }
  catch { return null; }
}

createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', 'http://localhost');
  let pathname = decodeURIComponent(url.pathname);
  if (base) {
    if (pathname === base) { response.writeHead(301, { Location: `${base}/` }).end(); return; }
    if (!pathname.startsWith(`${base}/`)) { response.writeHead(404, { 'Content-Type': types['.txt'] }).end('Not under base path'); return; }
    pathname = pathname.slice(base.length);
  }
  const target = normalize(join(root, pathname));
  if (!target.startsWith(root)) { response.writeHead(400).end(); return; }
  // Like GitHub Pages: /about redirects to /about/ when that directory exists.
  if (!pathname.endsWith('/') && !extname(pathname) && await file(join(target, 'index.html'))) {
    response.writeHead(301, { Location: `${base}${pathname}/${url.search}` }).end(); return;
  }
  const found = await file(target);
  const path = found ?? join(root, '404.html');
  const body = await readFile(path).catch(() => Buffer.from('Not found'));
  response.writeHead(found ? 200 : 404, { 'Content-Type': types[extname(path)] ?? 'application/octet-stream' }).end(body);
}).listen(port, () => console.log(`Serving ${root} at http://localhost:${port}${base}/`));
