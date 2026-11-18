# Agent guide: Next.js customer website

## Working preferences

Work on the current branch, preserve existing changes and leave changes uncommitted unless asked.
Do not push, change remote settings or deploy without instructions. Replace sample content with the
owner's real details. This is a self-contained static website; it does not require the starter or portal
repository at runtime. See README.md for local preview and publishing steps.

## Building a new website

When asked to `Implement plan/PLAN.md`, read the brief there and the shared build requirements in
`plan/PROMPT_TEMPLATE.md`, then implement the site in the current checkout. The `plan/` folder is
for initial creation and can be deleted after review. Keep it out of website code and public assets.
The `.claude/skills/` folder holds `write-plan` (drafts `plan/PLAN.md`) and `cleanup-plan` (removes
`plan/` and `.claude/skills/` after review). Like `plan/`, it is for initial creation only.

## Structure and content

`content/business.ts` holds the starter's shared business details and sample copy. When building a
site, write page-specific copy directly in the route's `app/**/page.tsx` as JSX children of named React
components. Put headings, calls to action, labels and captions in page order. Backing components
own the semantic markup, Tailwind styles, accessibility and behavior. Keep typed data in `content/`
for values the site reads programmatically, including contact details and structured collections.
Document fields and validate IDs, required
fields, prices, availability and references with item-specific failures. Rename in content and
site.config.json. Keep the provisioner's config shape: name, description, domain, optional timeZone,
jamstacks.siteId/cdnUrl and optional provisioningId. Business data never goes there. Reuse the design's
illustrations and palette rather than adding unrelated assets.

## Styling: Tailwind CSS v4

Use utilities in components. `app/tailwind.input.css` owns tokens, theme mappings, base styles, small
shared components and illustration/state rules. Only the template palette exists. Add colour tokens
in light, media-dark and explicit-dark blocks and map them through @theme inline. Prefer tokens over
repeated dark: utilities. Restyle the neutral header, footer and PageHead to suit the business.
Keep semantic headings, keyboard focus, sufficient contrast, a skip link, reduced motion and print styles.
Map --jamstacks-* and toggle variables; primary fill must support white button text in both modes.

## Static architecture

Next.js static export only: no production Next server, request-time rendering, Route Handlers,
Server Actions, middleware or database. Client components are for browser interactions. Read installed
`node_modules/next/dist/docs/` before changing framework behavior. `lib/config.mjs` is the public
configuration boundary. Use SiteLink and path helpers for base-path-safe navigation; Contact requires
full-document navigation both ways. Add routes to sitemap and per-page metadata. Schema lives in
lib/structured-data.ts, derives from content and escapes inline JSON. Time-dependent text runs only
in the browser and refreshes every minute; static/no-JS copy stays neutral. Optional hours/maps accept
content through props; validate schedule boundaries and zone/DST behavior when used. Overnight hours
are unsupported unless explicitly implemented and tested.

## Optional Jamstacks form

Keep the shared component's behavior. Contact alone renders the real support-form host and one site
bootstrap when a public ID is configured. No ID means visible email fallback with no host/script.
Email is always visible. The hosted runtime owns fields, validation, submission and results: no local
custom-element registration, substitute form, submission interception or delivery claims. Only name,
email and message are supported. Enquiries never imply bookings/orders/payments are confirmed.
No credentials in config or browser output. Preserve Pages provisioning_id input and correlated run name.

## Commands and checks

Run `npm run check` after changes. Check configured and unconfigured Contact and use a project-path
export when changing the embed, base paths or canonical URLs. Check light/dark at desktop/mobile
widths and keyboard links. Add meaningful tests for behavior, including frequent owner edits. Report local checks
separately from deployments or message delivery. Update README when owner-facing behavior changes.

## Template publishing assets

The entire jamstacks/ folder is source-gallery-only and removable. Customer code, normal tests, builds
and Pages never import/read it. Keep site.config.json, the form and workflow outside it. Generate real
light/dark captures after a fresh normal build and run node --test jamstacks/config.test.mjs separately.
Each new template needs its own business-led layout/fonts/art and OG image; do not ship the neutral
starter as a final design. Remove `plan/` and `.claude/skills/` before publishing a gallery template once reviewed.
