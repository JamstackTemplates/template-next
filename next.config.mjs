import { readFileSync } from 'node:fs';
import { resolveSiteConfig } from './lib/config.mjs';

const file = JSON.parse(readFileSync(new URL('./site.config.json', import.meta.url), 'utf8'));
const site = resolveSiteConfig(file, process.env);

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: site.basePath,
  images: { unoptimized: true },
  poweredByHeader: false,
  // Explicit allow-list of public values. JAMSTACKS_SITE is public even without a NEXT_PUBLIC_ prefix.
  env: {
    NEXT_PUBLIC_SITE_NAME: site.name,
    NEXT_PUBLIC_SITE_DESCRIPTION: site.description,
    NEXT_PUBLIC_SITE_DOMAIN: site.domain,
    NEXT_PUBLIC_SITE_TIME_ZONE: site.timeZone,
    NEXT_PUBLIC_SITE_URL: site.siteUrl,
    NEXT_PUBLIC_BASE_PATH: site.basePath,
    JAMSTACKS_SITE: site.siteId,
    NEXT_PUBLIC_JAMSTACKS_EMBED_URL: site.embedUrl,
  },
};

export default nextConfig;
