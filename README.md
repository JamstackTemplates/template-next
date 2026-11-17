# JamstackTemplates Next.js starter

The shared starter for Next.js templates in the `JamstackTemplates` organization. Its canonical home is
`JamstackTemplates/template-next`, alongside the templates generated from it.
It is not a gallery design or a published demo. Business content is sample content. No application code
in a generated website depends on this starter directory or the portal repository.

## Start a template

Node 24 or later and npm are required. From this directory:

```sh
node scripts/create.mjs ../next-steakhouse-ember \
  --id next-steakhouse-ember --name "Cinder & Vesper" \
  --description "An illustrated steakhouse with editable cuts and reservation enquiries."
```

The destination folder must match `next-type-style`. The generator copies source and lockfile, sets the
package/business names, config description/domain (`<id>.jamstacks.net`) and gallery manifest. It skips
`.git`, dependencies, local environment files and build output. Existing unrelated files (including a
PLAN.md or repository metadata) are preserved. Any colliding file aborts preflight before copying; move
or reconcile an initial README deliberately first. Files are never overwritten. Source/destination
symlinks and recursive destinations are rejected. The generator does not install dependencies, create
repositories, commit, change Pages settings or deploy. Installing those settings is a separate step.

Then, in the generated project:

```sh
npm ci
npm run check
npm run dev
```

Write/review PLAN.md using the portal's PROMPT_PLAN.md and PROMPT_TEMPLATE.md, then implement its
business model and visual identity. The starter replaces their infrastructure-copy step; industry
requirements, dependency review, unique design, content tests and publishing checks still apply.
Do not copy the starter's neutral composition into every design.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Minimal content-driven home page and Organization JSON-LD |
| `/contact/` | Hosted support form when configured; visible email alternative |
| `/404.html` | Friendly static error page |

## Make it yours

| File | Owns |
| --- | --- |
| `content/business.ts` | Name, introduction, contact details and enquiry copy |
| `content/menu.ts` or `content/services.ts` (add when needed) | Industry-specific typed collections |
| `site.config.json` | Public name, description, hostname, optional timeZone and Jamstacks integration |
| `app/tailwind.input.css` | Theme tokens, utility mappings and small shared styles |
| `components/site-header.tsx`, `site-footer.tsx` | Replaceable navigation and visual shell |
| `lib/structured-data.ts` | Schema type/properties derived from real content |
| `app/sitemap.ts` | Public routes; update when adding a page |

For example, change `business.email` to update Contact. Rename in `business.name` and
`site.config.json.name`. Add a typed core-content file for frequent owner edits: a food menu should use
the existing sections/items/price/availability model; changes such as sold out, seasonal or a new section
should be data edits with actionable content tests. Do not add business content to configuration: the
Jamstacks provisioner replaces that file wholesale, possibly adding `provisioningId`.

## Appearance and optional local-business features

The starter uses system fonts, neutral Tailwind v4 tokens and the published `jamstacks` package's
ThemeProvider, ThemeScript and DarkModeToggle. No font download or font licence file is needed for
system fonts. Each designed template chooses and documents self-hosted font packages and their licences.
Utilities live in components; colours originate in CSS tokens with light, automatic-dark and explicit-dark
values plus `@theme inline` mappings. Keep the hosted form's primary fill dark enough for white text.
Keyboard focus, reduced motion and print styles are included. The footer credit is yours to keep,
reword or remove.

For a business with visiting hours, add address/directions/hours to typed content, set the IANA `timeZone`
in site.config.json and use optional `GoogleMap`, `TimeZoneNote` and `OpenBadge` components. GoogleMap
accepts an address and descriptive title; map helpers need no key. `OpenBadge` accepts seven
`OpeningHours` records, uses the business zone and refreshes each minute in the browser; static/no-JS
output is neutral. Same-day intervals only: overnight hours fail validation and need a tested extension
before use. The baseline home page does not load a map or assert opening hours.

## Public configuration

```json
{
  "name": "Business name",
  "description": "Public description",
  "domain": "next-business-minimal.jamstacks.net",
  "timeZone": "America/New_York",
  "jamstacks": { "siteId": "", "cdnUrl": "https://cdn.jamstacks.net" }
}
```

The starter itself leaves domain/timeZone unset. Generated templates use their folder name plus
`.jamstacks.net`; customers replace the demo domain with their own. Do not invent canonical URLs when
the deployed address is unknown.

| Environment variable | Public build-time meaning |
| --- | --- |
| `JAMSTACKS_SITE` | Website ID; blank retains file default, absent ID gives email fallback |
| `NEXT_PUBLIC_JAMSTACKS_CDN_URL` | CDN asset base; default `https://cdn.jamstacks.net` |
| `NEXT_PUBLIC_SITE_DOMAIN` | Hostname overriding config domain |
| `SITE_TIME_ZONE` | IANA zone overriding config timeZone |
| `PAGES_BASE_PATH` | Project path such as `/preview`; blank for custom domain/root |
| `PAGES_BASE_URL` | Actual Pages origin and path; takes precedence for canonical URLs |
| `JAMSTACKS_ALLOW_LOCAL_CDN` | Explicit localhost-only testing opt-in; disallowed in Actions |

Copy .env.example to .env.local for Next.js local work. All listed values are public. Never add tokens,
SMTP credentials or publishing keys. Newer dependencies should stay within reviewed majors; update
package.json and package-lock.json together, then run the full checks.

## Contact contract

The real `<jamstacks-support-form>` host and one `{cdn}/sites/{siteId}/embed.js` bootstrap appear only
on Contact when configured. Without a site ID there is no embed host/request. Email remains visible
in either case. The hosted runtime owns name/email/message fields, validation, submission and results.
Never register the element locally, substitute a form or intercept submission. Contact navigation uses
full document loads via SiteLink because the runtime has no remount API. Copy must describe an enquiry,
not a confirmed booking/order/payment; no attachments or extra input fields.

For local Jamstacks development, configure an explicit local CDN URL and
`JAMSTACKS_ALLOW_LOCAL_CDN=1`; remote builds reject localhost. A locally loaded component does not prove
real message delivery. Test delivery separately against a configured site/backend.

## Checks and preview

```sh
npm run check
PAGES_BASE_PATH=/preview PAGES_BASE_URL=https://owner.github.io/preview npm run build
npm start -- --base /preview --port 3000
```

Tests cover config/provisioner compatibility, embed state, content rules, optional opening hours,
structured-data escaping and generator preservation. Typecheck uses Next's generated route types.
After a configured-contact build, `npm run verify:export` checks the embed appears only on Contact
and verifies base-path/canonical metadata. Run it for both configured and unconfigured builds.
Use `PAGES_BASE_PATH`, `PAGES_BASE_URL` and `JAMSTACKS_SITE` consistently for build and verification.
Test light/dark at desktop and mobile widths, keyboard navigation, unknown routes, repeated Contact
navigation and any added browser interactions. Return to a normal build before capturing final assets.

## GitHub Pages deployment

The generated repository must place this starter's contents at its root. `.github/workflows/pages.yml`
uses npm ci, tests, typecheck and static export; it preserves Jamstacks' `provisioning_id` dispatch input
and correlated run name. It builds pull requests without deploying, and publishes main/manual runs.
Configure Pages to use GitHub Actions and set its custom domain to the same value as site.config.json.
DNS is managed separately; for template demos the CNAME targets `jamstacktemplates.github.io`.
Do not add public/CNAME. Enable HTTPS after the certificate is ready. This starter performs no remote setup.

## Content Security Policy

A host-level CSP must permit same-origin Next.js scripts/assets, the inline theme bootstrap (using an
appropriate hash/nonce policy), the configured Jamstacks CDN scripts/assets and the published form's
API connection origin. Derive actual directives from the deployed component. Optional maps require
`frame-src https://www.google.com`. Apply CSP at the host; static export cannot set response headers
through a running Next.js server. Do not put private credentials into CSP or relax policies blindly.

## Publishing assets and structure

`app/`, `components/`, `content/`, `lib/` and `types/` are the website; `scripts/` supplies static preview,
generation and verification; `tests/` covers customer behavior; `.github/` supplies deployment.
`jamstacks/` is removable gallery-only source metadata. Ordinary builds, tests and Pages work after
it is deleted. The starter intentionally has no gallery config or captures. The generator writes a
manifest; create genuine screenshots before running its separate publishing test:

```sh
node /home/mythz/src/mythz/jamstacks.net/tools/template-screenshots/capture.mjs \
  --template /path/to/next-type-style --modes light,dark --executable /usr/bin/chromium
node --test jamstacks/config.test.mjs
```

Before publication: replace neutral content and shell; validate industry data/schema and all links;
choose licensed fonts; verify both themes/base-path/embed states; create a neutral 1200×630 public/og.png
from the finished design and wire metadata; replace the icon; generate gallery captures and validate;
confirm domain/Pages settings and HTTPS; remove PLAN.md and PROMPT_TEMPLATE.md after review. The website
must not import/link planning documents. No stock screenshot or OG image is supplied as if it were final.
