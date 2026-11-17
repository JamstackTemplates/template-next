import { readdir, readFile, writeFile, mkdir, lstat } from 'node:fs/promises';
import { resolve, dirname, relative, sep, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const starterRoot = fileURLToPath(new URL('../', import.meta.url));
const excluded = new Set(['.git', 'node_modules', '.next', 'out', '.env', '.env.local', '.env.production', 'tsconfig.tsbuildinfo', 'VALIDATION.md']);
const inside = (parent, child) => child === parent || child.startsWith(parent + sep);

async function exists(path) {
  try { return await lstat(path); } catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}
async function filesUnder(root, prefix = '') {
  const files = [];
  for (const entry of await readdir(resolve(root, prefix), { withFileTypes: true })) {
    if (excluded.has(entry.name) || (entry.name.startsWith('.env.') && entry.name !== '.env.example')) continue;
    const name = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isSymbolicLink()) throw new Error(`Starter source contains a symlink: ${name}`);
    if (entry.isDirectory()) files.push(...await filesUnder(root, name));
    else if (entry.isFile()) files.push(name);
  }
  return files;
}

/** Copy source only; no git/network/settings/install operations, and no file replacement. */
export async function createTemplate({ target, id, name, description = 'A Jamstacks website template.', source = starterRoot }) {
  const match = /^next-([a-z0-9]+)-([a-z0-9]+)$/.exec(id ?? '');
  if (!match) throw new Error('ID must be next-type-style, using lowercase letters and digits.');
  if (!name?.trim() || name.length > 100 || /[\u0000-\u001f]/.test(name)) throw new Error('Name must be 1–100 printable characters.');
  if (!description.trim() || description.length > 500 || /[\u0000-\u001f]/.test(description)) throw new Error('Description must be 1–500 printable characters.');
  if (!target) throw new Error('A destination path is required.');
  source = resolve(source); target = resolve(target);
  if (inside(source, target) || inside(target, source)) throw new Error('Destination and starter source must not contain each other.');
  if (basename(target) !== id) throw new Error(`Destination folder must be named ${id}.`);
  const writes = new Map();
  for (const file of await filesUnder(source)) writes.set(file, await readFile(resolve(source, file)));
  const json = value => Buffer.from(JSON.stringify(value, null, 2) + '\n');
  const pkg = JSON.parse(writes.get('package.json').toString()); pkg.name = id;
  writes.set('package.json', json(pkg));
  if (writes.has('package-lock.json')) {
    const lock = JSON.parse(writes.get('package-lock.json').toString());
    lock.name = id; lock.packages[''].name = id;
    writes.set('package-lock.json', json(lock));
  }
  const config = JSON.parse(writes.get('site.config.json').toString());
  Object.assign(config, { name: name.trim(), description: description.trim(), domain: `${id}.jamstacks.net` });
  writes.set('site.config.json', json(config));
  const business = writes.get('content/business.ts').toString().replace("name: 'Jamstacks starter',", `name: ${JSON.stringify(name.trim())},`);
  writes.set('content/business.ts', Buffer.from(business));
  writes.set('jamstacks/config.json', json({ name: name.trim(), description: description.trim(), tech: 'next', type: match[1], style: match[2], internal: false,
    components: ['support-form'], configFile: 'site.config.json', screenshots: { light: 'jamstacks/home-light.jpg', dark: 'jamstacks/home-dark.jpg', theme: { strategy: 'media' } } }));
  // Preflight every file and ancestor before creating any output. Never traverse a destination symlink.
  for (const file of writes.keys()) {
    const destination = resolve(target, file);
    if (!inside(target, destination)) throw new Error(`Invalid source path: ${file}`);
    if (await exists(destination)) throw new Error(`Refusing to overwrite ${destination}. No files were copied.`);
    for (let ancestor = dirname(destination);; ancestor = dirname(ancestor)) {
      const info = await exists(ancestor);
      if (info && (!info.isDirectory() || info.isSymbolicLink())) throw new Error(`Not a regular destination directory: ${ancestor}`);
      if (ancestor === dirname(ancestor)) break;
    }
  }
  for (const [file, contents] of writes) {
    const destination = resolve(target, file);
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, contents, { flag: 'wx' });
  }
  return { target, id, files: writes.size };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [target, ...args] = process.argv.slice(2);
  if (!target || target === '--help') {
    console.log('Usage: node scripts/create.mjs /path/next-type-style --id next-type-style --name "Business name" [--description "Gallery description"]');
    process.exit(target === '--help' ? 0 : 1);
  }
  const options = { target };
  try {
    for (let i = 0; i < args.length; i += 2) {
      if (!['--id', '--name', '--description'].includes(args[i]) || !args[i + 1]) throw new Error(`Unknown or missing option: ${args[i]}`);
      options[args[i].slice(2)] = args[i + 1];
    }
    const result = await createTemplate(options);
    console.log(`Created ${result.id} in ${result.target} (${result.files} files). Run npm ci there, then implement PLAN.md.`);
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
