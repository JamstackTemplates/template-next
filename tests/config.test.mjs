import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { normalizeBasePath, resolveSiteConfig } from '../lib/config.mjs';

const file = { name: 'Example business', description: 'Example website', domain: '', jamstacks: { siteId: '', cdnUrl: 'https://cdn.jamstacks.net' } };

test('the owner’s site.config.json is valid', () => {
  const configured = JSON.parse(readFileSync(new URL('../site.config.json', import.meta.url), 'utf8'));
  assert.doesNotThrow(() => resolveSiteConfig(configured, {}));
});

test('an unconfigured website makes no embed request', () => {
  const site = resolveSiteConfig(file, {});
  assert.equal(site.siteId, '');
  assert.equal(site.embedUrl, '');
  assert.equal(site.cdnUrl, 'https://cdn.jamstacks.net');
  assert.equal(site.basePath, '');
  assert.equal(site.siteUrl, '');
  assert.equal(site.name, file.name);
});

test('the provisioner’s rewritten site.config.json shape is accepted', () => {
  // GitHubProvisioner writes exactly these keys, including provisioningId, and no business content.
  const provisioned = {
    name: 'My site', description: 'A Jamstacks website', domain: '',
    jamstacks: { siteId: 'site_abc123', cdnUrl: 'https://cdn.jamstacks.net' }, provisioningId: 42,
  };
  const site = resolveSiteConfig(provisioned, {});
  assert.equal(site.embedUrl, 'https://cdn.jamstacks.net/sites/site_abc123/embed.js');
  assert.equal(site.name, 'My site');
  assert.equal(site.timeZone, '');
  // The portal adds the owner's time zone when one was chosen.
  assert.equal(resolveSiteConfig({ ...provisioned, timeZone: 'Europe/London' }, {}).timeZone, 'Europe/London');
});

test('time zones are IANA names; the environment can override the file', () => {
  assert.equal(resolveSiteConfig({ ...file, timeZone: 'America/New_York' }, {}).timeZone, 'America/New_York');
  assert.equal(resolveSiteConfig({ ...file, timeZone: 'America/New_York' }, { SITE_TIME_ZONE: 'Asia/Tokyo' }).timeZone, 'Asia/Tokyo');
  assert.equal(resolveSiteConfig({ ...file, timeZone: 'America/New_York' }, { SITE_TIME_ZONE: ' ' }).timeZone, 'America/New_York');
  assert.equal(resolveSiteConfig(file, {}).timeZone, '');
  for (const zone of ['Pacific Standard Time', 'Mars/Olympus_Mons', '+05:00', 'Europe/London<script>', '../etc/passwd']) {
    assert.throws(() => resolveSiteConfig({ ...file, timeZone: zone }, {}), /IANA/, zone);
  }
});

test('environment variables override the file; blank values keep file defaults', () => {
  const withId = { ...file, jamstacks: { ...file.jamstacks, siteId: 'from_file' } };
  assert.equal(resolveSiteConfig(withId, { JAMSTACKS_SITE: '', NEXT_PUBLIC_JAMSTACKS_CDN_URL: ' ' }).embedUrl,
    'https://cdn.jamstacks.net/sites/from_file/embed.js');
  const site = resolveSiteConfig(withId, {
    JAMSTACKS_SITE: 'site_env-1',
    NEXT_PUBLIC_JAMSTACKS_CDN_URL: 'https://assets.example.org/widgets/',
    NEXT_PUBLIC_SITE_DOMAIN: 'EXAMPLE.COM',
    PRIVATE_PUBLISH_KEY: 'must-not-leak',
    GITHUB_TOKEN: 'must-not-leak',
  });
  assert.equal(site.embedUrl, 'https://assets.example.org/widgets/sites/site_env-1/embed.js');
  assert.equal(site.domain, 'example.com');
  assert.equal(site.siteUrl, 'https://example.com');
  assert.ok(!JSON.stringify(site).includes('must-not-leak'));
});

test('the GitHub Pages URL wins over the configured domain for canonical URLs', () => {
  const site = resolveSiteConfig(file, {
    NEXT_PUBLIC_SITE_DOMAIN: 'example.com', PAGES_BASE_PATH: '/project', PAGES_BASE_URL: 'https://owner.github.io/project/',
  });
  assert.equal(site.siteUrl, 'https://owner.github.io/project');
  assert.equal(resolveSiteConfig(file, { NEXT_PUBLIC_SITE_DOMAIN: 'example.com', PAGES_BASE_PATH: '/p' }).siteUrl, 'https://example.com/p');
  for (const url of ['ftp://owner.github.io/x', 'javascript:alert(1)', 'https://u:p@owner.github.io', 'https://owner.github.io/?q=1', 'https://owner.github.io/#fragment', 'not a url']) {
    assert.throws(() => resolveSiteConfig(file, { PAGES_BASE_URL: url }));
  }
});

test('new Pages domains build before HTTPS enforcement while emitting HTTPS canonical URLs', () => {
  for (const [reported, expected, basePath] of [
    ['http://next-business-minimal.jamstacks.net', 'https://next-business-minimal.jamstacks.net', ''],
    ['http://owner.github.io/project/', 'https://owner.github.io/project', '/project'],
  ]) {
    const site = resolveSiteConfig(file, { GITHUB_ACTIONS: 'true', PAGES_BASE_URL: reported, PAGES_BASE_PATH: basePath });
    assert.equal(site.siteUrl, expected);
    assert.equal(site.basePath, basePath);
  }
});

test('path-prefixed CDN bases are supported; localhost needs an explicit local opt-in', () => {
  const local = { NEXT_PUBLIC_JAMSTACKS_CDN_URL: 'https://localhost:5001/_cdn/', JAMSTACKS_SITE: 'site_local' };
  assert.throws(() => resolveSiteConfig(file, local), /local builds/);
  assert.equal(resolveSiteConfig(file, { ...local, JAMSTACKS_ALLOW_LOCAL_CDN: '1' }).embedUrl,
    'https://localhost:5001/_cdn/sites/site_local/embed.js');
  assert.doesNotThrow(() => resolveSiteConfig(file, { NEXT_PUBLIC_JAMSTACKS_CDN_URL: 'http://127.0.0.1:4100', JAMSTACKS_ALLOW_LOCAL_CDN: 'true' }));
  // A remote (Actions) build can never publish a localhost dependency.
  assert.throws(() => resolveSiteConfig(file, { ...local, JAMSTACKS_ALLOW_LOCAL_CDN: '1', GITHUB_ACTIONS: 'true' }));
});

test('unsafe CDN URLs are rejected', () => {
  for (const url of ['http://cdn.example.com', 'javascript:alert(1)', 'https://user:secret@cdn.example.com',
    'https://cdn.example.com/?key=secret', 'https://cdn.example.com/#x', 'ftp://cdn.example.com', '//cdn.example.com']) {
    assert.throws(() => resolveSiteConfig(file, { NEXT_PUBLIC_JAMSTACKS_CDN_URL: url }), undefined, url);
  }
});

test('site IDs are a single path-safe segment', () => {
  for (const id of ['../another-site', 'a/b', 'site?x=y', 'site#x', 'site with spaces', 'x'.repeat(101)]) {
    assert.throws(() => resolveSiteConfig(file, { JAMSTACKS_SITE: id }), undefined, id);
  }
});

test('domains are hostnames rather than URLs', () => {
  for (const domain of ['https://example.com', 'example.com/path', 'example.com:8080', 'example.com?q', 'user@example.com', 'localhost']) {
    assert.throws(() => resolveSiteConfig(file, { NEXT_PUBLIC_SITE_DOMAIN: domain }), undefined, domain);
  }
});

test('Pages base paths support root, repository and nested paths without URL injection', () => {
  assert.equal(normalizeBasePath('/'), '');
  assert.equal(normalizeBasePath(''), '');
  assert.equal(normalizeBasePath('/next-business-minimal/'), '/next-business-minimal');
  assert.equal(normalizeBasePath('/preview/example.com'), '/preview/example.com');
  for (const path of ['https://example.com', '//example.com', '/a/../b', '/a?x=y', '/a#b', 'relative']) {
    assert.throws(() => normalizeBasePath(path), undefined, path);
  }
});

test('the workflow keeps the provisioning dispatch contract', () => {
  const workflow = readFileSync(new URL('../.github/workflows/pages.yml', import.meta.url), 'utf8');
  assert.match(workflow, /run-name: \$\{\{ inputs\.provisioning_id && format\('Jamstacks \{0\}', inputs\.provisioning_id\)/);
  assert.match(workflow, /workflow_dispatch:\s*\n\s*inputs:\s*\n\s*provisioning_id:/);
  assert.match(workflow, /JAMSTACKS_SITE: \$\{\{ vars\.JAMSTACKS_SITE \}\}/);
  assert.match(workflow, /NEXT_PUBLIC_JAMSTACKS_CDN_URL: \$\{\{ vars\.JAMSTACKS_CDN_URL \}\}/);
  assert.match(workflow, /NEXT_PUBLIC_SITE_DOMAIN: \$\{\{ vars\.SITE_DOMAIN \}\}/);
  assert.match(workflow, /PAGES_BASE_PATH: \$\{\{ steps\.pages\.outputs\.base_path \}\}/);
  assert.match(workflow, /if: github\.event_name != 'pull_request'\s*\n\s*needs: build/);
  assert.doesNotMatch(workflow, /secrets\./);
});
