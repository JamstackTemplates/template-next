# Build a website from the Jamstacks Next.js starter

When asked to **`Implement plan/PLAN.md`**, use [PLAN.md](PLAN.md) in this folder as the website brief and
[AGENTS.md](../AGENTS.md) as the project rules. Read the root [README.md](../README.md) and inspect the existing
project before editing. Use the brief to resolve the website's audience, pages, content and visual
direction. Use reasonable assumptions for routine design decisions and ask when the brief leaves the
business or purpose unclear. Use the repository's current branch, preserve existing work and leave changes
uncommitted unless asked. Pages settings, DNS changes and deployment require separate instructions.

## Implement the site in this checkout

- GitHub has already populated this repository with the template files. Start implementation in
  this checkout. Run `npm ci` and `npm run check` for the baseline.
  Keep the inherited dependency versions unless the brief requires a change. Update the manifest
  and lockfile together when changing dependencies, including when adding self-hosted fonts.
- Replace the starter's sample copy and neutral layout, typography, header, footer and page heading.
  Design around the business and its visitors. Answer the main visitor question on the first screen
  and give the main action a clear place. Keep navigation compact and add pages when their content
  warrants its own route.
- Preserve the Next.js static export, base-path-safe links, Jamstacks light/dark integration, support
  form behavior and Pages provisioning contract. Limit client components to browser interactions.
  Keep the site self-contained so it can build without the portal or starter checkout.

## Separate editable copy from presentation

- Put page-specific prose and labels directly in the page's `app/**/page.tsx` file, in the order
  visitors see them. Write the copy as JSX children of the styled components. Keep the page
  composition and copy together so owners can find and edit both from the route they know.
- Use named React components such as `Hero.Heading`, `Hero.Introduction` and `Hero.Contact` for the
  editable parts of a section. The backing component owns the semantic HTML, Tailwind classes,
  layout, accessibility and interactions. Use inline JSX such as emphasis where it helps the copy.

  ```tsx
  // app/page.tsx
  import { Hero } from '../components/hero';

  export default function HomePage() {
    return (
      <Hero>
        <Hero.Heading>Seasonal flowers for everyday occasions</Hero.Heading>
        <Hero.Introduction>Visit the studio to see what is in bloom this week.</Hero.Introduction>
        <Hero.Contact>Ask about an arrangement</Hero.Contact>
      </Hero>
    );
  }
  ```

  ```tsx
  // components/hero.tsx
  import type { ReactNode } from 'react';
  import { SiteLink } from './site-link';

  type ContentProps = { children: ReactNode };

  function HeroSection({ children }: ContentProps) {
    return <section className="wrap py-20">{children}</section>;
  }

  function Heading({ children }: ContentProps) {
    return <h1 className="text-4xl font-bold">{children}</h1>;
  }

  function Introduction({ children }: ContentProps) {
    return <p className="mt-4 text-muted">{children}</p>;
  }

  function Contact({ children }: ContentProps) {
    return <SiteLink href="/contact/" className="button mt-6">{children}</SiteLink>;
  }

  export const Hero = Object.assign(HeroSection, { Heading, Introduction, Contact });
  ```

- Keep typed data in `content/` for values the site reads programmatically, such as business contact details,
  metadata strings, prices, opening hours and filterable collections. Use one source per shared value
  and reuse it in pages, metadata and structured data. Keep `site.config.json` in the provisioner's
  existing shape and update its public name and description as required by the brief.
- Document field meanings and use stable, URL-safe unique IDs for collections. Validate required
  fields, IDs, prices, availability and references where applicable, with failures that identify
  the item to fix. Verify the owner can change page-specific copy in the page file and can change
  structured data in its owning file. Document the exact files and sections or fields in the finished
  README and record file ownership in `AGENTS.md` for future edits.

## Design and site behavior

- Give the site a layout, type scale and artwork that fit its audience. Use Tailwind v4 utilities in
  components and map `app/tailwind.input.css` colour tokens for light, automatic dark and explicit
  dark modes. Keep the hosted form's button contrast, visible keyboard focus, semantic headings,
  skip link, reduced motion and print styles. Check small screens from 360px up.
- For businesses with premises, surface the address, directions and relevant hours early. Use the
  inherited map helpers and optional components. Compute time-dependent status in the browser
  using the configured IANA zone and refresh it every minute. Provide neutral static copy and test
  schedule boundaries and DST. Extend and test overnight support before using it.
- Reuse the hosted Jamstacks support form on Contact and always show the public email. With a site
  ID, render one host and bootstrap only on Contact. Without an ID, show the email fallback. The
  hosted runtime owns the name, email and message fields and submission. Phrase any booking,
  order or quote request as an enquiry. Preserve full-document navigation to and from Contact.
- Update page metadata, canonical URLs, sitemap, robots, schema.org data, site icon and social image
  for the finished website. Derive schema from content and escape inline JSON with the shared helper.

## Gallery templates

For a site intended for the Jamstacks gallery, use a fictitious business name and contact details
and write concrete sample copy. Use a public landmark if the sample needs a location. Set the demo
domain in `site.config.json` to `<template-id>.jamstacks.net`. Update the names in `package.json`
and `package-lock.json` and create or update `jamstacks/config.json` using the brief and
[the gallery manifest format](../jamstacks/README.md). Give the template its own composition, typography
and artwork. After a fresh normal build, capture genuine light and dark screenshots and create a
1200×630 OG image with stable copy. Run `node --test jamstacks/config.test.mjs` separately. Customer
builds, tests and Pages must work without the gallery folder.

## Verify and hand off

1. Run `npm run check`. When a change affects the Contact integration, base paths or canonical URLs,
   use a project-path build to check configured and unconfigured Contact, links and metadata.
2. Review each page in both themes at desktop and mobile widths. Exercise keyboard navigation,
   Contact navigation in both directions, and any new interactions. Test the common owner edit
   from the README against the rendered page.
3. Report the local checks and any remaining verification separately from deployment or actual
   enquiry delivery. Leave `plan/` in place for the owner's review. Keep it out of website code and
   public assets so the owner can delete it after the site is complete.
