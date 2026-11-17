import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolveSiteConfig } from '../lib/config.mjs';

const config = JSON.parse(await readFile(new URL('../site.config.json', import.meta.url), 'utf8'));
const site = resolveSiteConfig(config, process.env);
const hosted = Boolean(site.siteId);
for (const path of ['index.html', 'contact/index.html', '404.html']) {
  const html = await readFile(new URL(`../out/${path}`, import.meta.url), 'utf8');
  const contact = path === 'contact/index.html';
  assert.equal((html.match(/<jamstacks-support-form\b/g) || []).length, contact && hosted ? 1 : 0, `${path}: support-form host count`);
  assert.equal(html.includes('/embed.js'), contact && hosted, `${path}: bootstrap must appear only on configured Contact`);
  if (contact && hosted) assert.ok(html.includes(site.embedUrl.replaceAll('&', '&amp;')), `${path}: expected site bootstrap`);
  if (path !== '404.html') {
    const route = contact ? '/contact/' : '/';
    assert.ok(html.includes(`href="${site.basePath}${contact ? '/' : '/contact/'}"`), `${path}: Contact navigation includes the base path`);
    if (site.siteUrl) assert.ok(html.includes(`rel="canonical" href="${site.siteUrl}${route}"`), `${path}: canonical URL`);
    else assert.ok(!html.includes('rel="canonical"'), `${path}: no guessed canonical`);
  }
}
const sitemap = await readFile(new URL('../out/sitemap.xml', import.meta.url), 'utf8');
if (site.siteUrl) {
  for (const route of ['/', '/contact/']) assert.ok(sitemap.includes(`${site.siteUrl}${route}`), `sitemap: ${route}`);
} else assert.ok(!sitemap.includes('<loc>'), 'sitemap: no guessed URLs');
console.log(`Export verified: ${hosted ? 'configured' : 'unconfigured'} Contact, base path ${site.basePath || '/'}, canonical ${site.siteUrl || 'omitted'}.`);
