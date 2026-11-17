import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, writeFile, readFile, readdir, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createTemplate } from '../scripts/create.mjs';

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'jamstacks-starter-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  return { root, target: join(root, 'next-business-minimal'), id: 'next-business-minimal', name: 'Sample & Studio' };
}
test('generation configures independent projects and preserves unrelated work', async t => {
  const options = await fixture(t);
  await mkdir(join(options.target, '.git'), { recursive: true });
  await writeFile(join(options.target, 'PLAN.md'), 'Keep this plan');
  await writeFile(join(options.target, '.git', 'HEAD'), 'keep branch');
  await createTemplate(options);
  const load = file => readFile(join(options.target, file), 'utf8');
  const config = JSON.parse(await load('site.config.json'));
  assert.equal(config.domain, `${options.id}.jamstacks.net`);
  assert.equal(config.name, options.name);
  assert.equal(JSON.parse(await load('package.json')).name, options.id);
  const lock = JSON.parse(await load('package-lock.json'));
  assert.equal(lock.name, options.id); assert.equal(lock.packages[''].name, options.id);
  assert.equal(JSON.parse(await load('jamstacks/config.json')).type, 'business');
  assert.ok((await load('content/business.ts')).includes(JSON.stringify(options.name)));
  assert.equal(await load('PLAN.md'), 'Keep this plan');
  assert.equal(await load('.git/HEAD'), 'keep branch');
  for (const dir of ['node_modules', '.next', 'out']) assert.ok(!(await readdir(options.target)).includes(dir), `${dir} must not be copied`);
});
test('collisions reject before writing anything', async t => {
  const options = await fixture(t); await mkdir(options.target);
  await writeFile(join(options.target, 'README.md'), 'owner readme');
  await assert.rejects(createTemplate(options), /Refusing to overwrite/);
  assert.deepEqual(await readdir(options.target), ['README.md']);
  assert.equal(await readFile(join(options.target, 'README.md'), 'utf8'), 'owner readme');
});
test('invalid IDs, mismatching folders and recursive destinations are rejected', async t => {
  const options = await fixture(t);
  await assert.rejects(createTemplate({ ...options, id: '../bad' }), /ID must/);
  await assert.rejects(createTemplate({ ...options, target: join(options.root, 'wrong') }), /folder must/);
  await assert.rejects(createTemplate({ ...options, source: options.root }), /must not contain/);
});
test('destination symlinks cannot redirect source writes', async t => {
  const options = await fixture(t);
  const elsewhere = join(options.root, 'elsewhere'); await mkdir(elsewhere);
  await symlink(elsewhere, options.target);
  await assert.rejects(createTemplate(options), /regular destination directory/);
  assert.deepEqual(await readdir(elsewhere), []);
});
