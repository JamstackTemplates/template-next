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

## Make the design the main deliverable

A site that passes every check but looks like a restyled starter is **not finished**. Visitors judge
the business by how the site looks within seconds, so treat the visual design with at least the same
care as the data, tests and form integration. The brief's visual direction is a specification, not a
mood board. Build every element it names.

1. **Art-direct before you code.** Turn the brief's visual direction into a plan for each page,
   section by section. Note each section's composition, the artwork it uses, how its content is
   presented, and how it differs from the sections next to it. Keep these notes in your working
   context, not in the repository. If a frontend-design skill or similar design guidance is
   available, load it now.
2. **Build the visual system first.** Before writing any page:
   - Install and wire up the fonts.
   - Create the palette tokens for both themes.
   - Build the textures, rules and borders.
   - Make the bespoke SVG artwork as reusable components: the hero illustration, section motifs,
     dividers, icons and the signature element. Artwork should be substantial, layered and drawn
     for this business. A single icon or a coloured box does not count.

   Pages then compose from these pieces.
3. **Let the content shape the design.** Present the core collections as designed objects that
   fit the subject: for example a tap list as a row of can labels or tap handles, a menu as a
   printed menu card, a portfolio as a contact sheet. Avoid generic cards. Write the copy for this
   business with specific, confident detail, and leave no starter phrasing behind.
4. **Aim high.**
   - **Hero:** the first screen is a composed scene. Use large display type, artwork that fills
     the space, and the primary action. A centred heading over a plain background does not
     count.
   - **Varied sections:** vary layouts, scale and rhythm from section to section, with full-bleed
     bands, overlapping art, asymmetric grids and oversized numerals or type. Don't repeat one
     card grid.
   - **Every surface themed:** the header, footer, page heads, Contact, the 404 and the print view
     all carry the brand.
   - **Dark mode:** design it as its own mood with the same character, not an inverted palette.
   - **Motion:** use small, purposeful motion such as reveals, hover states and the signature
     element's interaction, disabled under reduced motion.
5. **Avoid the generic look**:
   - the starter's layout or spacing left in place
   - system or default fonts
   - three identical feature cards
   - emoji or stock icons standing in for art
   - placeholder rectangles and decorative gradients with no link to the subject
   - flat, unbroken white or black backgrounds on every section
   - a design you could swap onto any other business by changing the words

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

- Implement the art direction described above. Use Tailwind v4 utilities in
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
2. **Review the design visually and refine it.** Serve the build (`npm start`) and capture every
   page in light and dark at about 1440px and 390px wide.
   - **How to capture:** use a browser-automation tool, Playwright or headless Chromium, whichever
     is available.
   - **Where to save:** put the screenshots in a temporary folder, not the repository.
   - **Look at them yourself.** Check them against the brief's visual direction and visual
     acceptance criteria, item by item, and against the "avoid the generic look" list above.
     Ask whether it could be a different business's site.
   - **Fix and recapture.** Fix every gap, then capture again. Do at least one full refinement
     pass even if the first result seems acceptable.
   - **If you can't capture:** say so in the hand-off, and list the visual checks still to be
     done by hand.
3. Exercise keyboard navigation, Contact navigation in both directions, and any new interactions.
   Test the common owner edit from the README against the rendered page.
4. In the hand-off, include a short design summary: how each item in the brief's visual direction
   was realised and where. Report the local checks and any remaining verification separately from deployment or actual
   enquiry delivery. Leave `plan/` in place for the owner's review. Keep it out of website code and
   public assets so the owner can delete it after the site is complete.
