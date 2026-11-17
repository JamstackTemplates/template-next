// Public values resolved by lib/config.mjs and substituted by Next.js at build time.
// No runtime configuration API is needed to render the website.
export const site = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? 'Jamstacks starter',
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION ?? '',
  domain: process.env.NEXT_PUBLIC_SITE_DOMAIN ?? '',
  /** IANA time zone for opening hours (site.config.json `timeZone`), or '' when not set. */
  timeZone: process.env.NEXT_PUBLIC_SITE_TIME_ZONE ?? '',
  /** Absolute deployed URL including any base path, or '' when unknown at build time. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? '',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? '',
  /** Public Jamstacks website ID, or '' to use the static contact fallback. */
  jamstacksSite: process.env.JAMSTACKS_SITE ?? '',
  /** The one site bootstrap script, or '' when no site ID is configured. */
  jamstacksEmbedUrl: process.env.NEXT_PUBLIC_JAMSTACKS_EMBED_URL ?? '',
} as const;
