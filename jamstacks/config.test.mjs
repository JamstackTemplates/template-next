import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

// Source-template checks only. Customer tests and builds never import this folder.
const config = JSON.parse(readFileSync(new URL('./config.json', import.meta.url), 'utf8'));
const root = new URL('../', import.meta.url);

test('template publishing metadata matches the catalog contract', () => {
  for (const key of ['name', 'description', 'tech', 'type', 'style']) {
    assert.ok(typeof config[key] === 'string' && config[key].length > 0 && !/[\u0000-\u001f]/.test(config[key]), key);
  }
  assert.ok(config.name.length <= 100 && config.description.length <= 500);
  assert.equal(config.configFile, 'site.config.json');
  assert.ok(config.components.includes('support-form'));
  const id = basename(fileURLToPath(root));
  assert.equal(id, config.internal ? 'next-test' : `${config.tech}-${config.type}-${config.style}`);
});

test('gallery captures match their public report and stay in the removable folder', () => {
  const report = JSON.parse(readFileSync(new URL('./screenshots.json', import.meta.url), 'utf8'));
  assert.equal(report.templateId, basename(fileURLToPath(root)));
  assert.deepEqual(report.captures.map(x => x.mode), ['light', 'dark']);
  for (const capture of report.captures) {
    assert.match(capture.file, /^jamstacks\/[a-zA-Z0-9_-]+\.jpg$/);
    assert.equal(config.screenshots[capture.mode], capture.file);
    const bytes = readFileSync(new URL(capture.file, root));
    assert.equal(bytes.length, capture.bytes);
    assert.ok(bytes.length <= 524288);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), capture.sha256);
  }
  assert.notEqual(report.captures[0].sha256, report.captures[1].sha256);
});
