// Build-time public configuration. Runs in next.config.mjs and the Node tests, never in the browser.
// Only the values returned here are exposed to the static site; nothing else from the environment is read.

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/** Environment values override the file; blank environment values keep the file default. */
function setting(envValue, fallback) {
  return text(envValue) || text(fallback);
}

/** GitHub Pages project path such as `/my-site`. Empty for root/custom-domain deployments. */
export function normalizeBasePath(value = '') {
  const path = text(value).replace(/\/+$/, '');
  if (!path) return '';
  if (!/^\/(?:[A-Za-z0-9._~-]+\/)*[A-Za-z0-9._~-]+$/.test(path) ||
      path.split('/').some(segment => segment === '.' || segment === '..')) {
    throw new Error('PAGES_BASE_PATH must be a URL path such as /my-site, not an origin, query or fragment.');
  }
  return path;
}

/** Public Jamstacks website identifier, used as a single CDN path segment. */
export function normalizeSiteId(value = '') {
  const id = text(value);
  if (id && !/^[A-Za-z0-9_-]{1,100}$/.test(id)) {
    throw new Error('The Jamstacks site ID must contain only letters, numbers, underscores or hyphens.');
  }
  return id;
}

/**
 * Public component asset base. HTTPS everywhere; HTTP only for an explicit local origin.
 * A path prefix is allowed (e.g. https://localhost:5001/_cdn). Remote builds may not point at localhost.
 */
export function normalizeCdnUrl(value, { allowLocal = false } = {}) {
  let cdn;
  try { cdn = new URL(text(value) || 'https://cdn.jamstacks.net'); }
  catch { throw new Error('The Jamstacks CDN URL must be an absolute URL such as https://cdn.jamstacks.net.'); }
  const local = LOCAL_HOSTS.has(cdn.hostname);
  if (!['https:', 'http:'].includes(cdn.protocol) || (cdn.protocol === 'http:' && !local) ||
      cdn.username || cdn.password || cdn.search || cdn.hash) {
    throw new Error('The Jamstacks CDN URL must use HTTPS (or HTTP on localhost), with no credentials, query or fragment.');
  }
  if (local && !allowLocal) {
    throw new Error('A localhost Jamstacks CDN URL is only allowed for local builds. Set JAMSTACKS_ALLOW_LOCAL_CDN=1 when testing locally.');
  }
  return cdn.toString().replace(/\/+$/, '');
}

/** Hostname only, e.g. example.com. */
export function normalizeDomain(value = '') {
  const domain = text(value).toLowerCase();
  if (!domain) return '';
  let parsed;
  try { parsed = new URL(`https://${domain}`); } catch { parsed = undefined; }
  if (!parsed || !domain.includes('.') || parsed.host !== domain || parsed.pathname !== '/' ||
      parsed.search || parsed.hash || parsed.username || parsed.password || parsed.port) {
    throw new Error('The site domain must be a hostname such as example.com, without a scheme, port or path.');
  }
  return domain;
}

/**
 * IANA time zone such as Europe/London, used for opening-hours features. Empty when not set.
 * Validated with the same Intl API the browser uses, so a bad value fails the build, not the page.
 */
export function normalizeTimeZone(value = '') {
  const zone = text(value);
  if (!zone) return '';
  let valid = /^[A-Za-z][A-Za-z0-9_+-]*(?:\/[A-Za-z0-9_+-]+){0,2}$/.test(zone);
  if (valid) {
    try { new Intl.DateTimeFormat('en-US', { timeZone: zone }); } catch { valid = false; }
  }
  if (!valid) throw new Error('The time zone must be an IANA name such as America/New_York or Europe/London.');
  return zone;
}

/** Canonical HTTPS URL (no trailing slash), including Pages URLs reported before HTTPS is enabled. */
export function normalizeSiteUrl(value = '') {
  const raw = text(value);
  if (!raw) return '';
  let url;
  try { url = new URL(raw); } catch { url = undefined; }
  if (!url || !['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
    throw new Error('PAGES_BASE_URL must be an http or https URL with no credentials, query or fragment.');
  }
  // configure-pages reports HTTP while a new custom domain's certificate is provisioning.
  // Keep canonical, social and sitemap URLs on HTTPS without blocking that first build.
  url.protocol = 'https:';
  return url.toString().replace(/\/+$/, '');
}

export function resolveSiteConfig(config = {}, env = {}) {
  const allowLocal = ['1', 'true'].includes(text(env.JAMSTACKS_ALLOW_LOCAL_CDN).toLowerCase()) && !text(env.GITHUB_ACTIONS);
  const siteId = normalizeSiteId(setting(env.JAMSTACKS_SITE, config.jamstacks?.siteId));
  const cdnUrl = normalizeCdnUrl(setting(env.NEXT_PUBLIC_JAMSTACKS_CDN_URL, config.jamstacks?.cdnUrl), { allowLocal });
  const domain = normalizeDomain(setting(env.NEXT_PUBLIC_SITE_DOMAIN, config.domain));
  const basePath = normalizeBasePath(env.PAGES_BASE_PATH);
  const timeZone = normalizeTimeZone(setting(env.SITE_TIME_ZONE, config.timeZone));
  // Prefer the URL GitHub Pages actually serves; fall back to the configured domain for other hosts.
  const siteUrl = normalizeSiteUrl(env.PAGES_BASE_URL) || (domain ? `https://${domain}${basePath}` : '');

  return {
    name: text(config.name) || 'Jamstacks starter',
    description: text(config.description),
    domain,
    timeZone,
    siteUrl,
    basePath,
    siteId,
    cdnUrl,
    embedUrl: siteId ? `${cdnUrl}/sites/${encodeURIComponent(siteId)}/embed.js` : '',
  };
}
