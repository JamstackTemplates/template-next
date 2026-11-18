---
name: write-plan
description: Write the website brief in plan/PLAN.md for a new site built from this Next.js starter. Use when asked to write, fill in or draft PLAN.md, or to plan a website or gallery template (for example a `next-<type>-<style>` row with a business name, description and form purpose). Writes the brief only; it does not implement the site.
argument-hint: "<template-id> | <business> | <description> | <form purpose>   (or a free-form description of the business)"
---

# Write plan/PLAN.md

Turn a short business description into a complete, implementation-ready brief in `plan/PLAN.md`.
Someone will then run **`Implement plan/PLAN.md`** in a later session. Your job is the brief only.

Input: $ARGUMENTS

## 1. Understand the input

The input is either a gallery-table row such as
`next-brewery-taproom | Tall Tales Brewing Co. | Industrial taproom with … | Events, tours & wholesale`
or a free-form description of a real business. Decide which:

- **Gallery template.** The template ID follows `next-<type>-<style>`. Everything is fictitious.
  - Use made-up but plausible contact details and a public landmark for the location.
  - Set the domain to `<template-id>.jamstacks.net`.
  - The gallery manifest's `type` and `style` come from the ID.
- **Real website.** Use only the facts the owner gives you. Never invent contact details, addresses,
  prices, hours or claims. If key facts are missing (the business purpose, public email, location
  for premises), ask before writing. If you can't ask, list them under "Open questions" at the
  end of the plan rather than making them up.

If no input was given, ask for the business, what it offers, who it serves, and whether it is a
real site or a gallery sample.

## 2. Read before writing

Read these so the brief asks only for things this starter supports:

- `plan/PLAN.md`: the template to fill in. Keep its intro paragraph and three sections.
- `plan/PROMPT_TEMPLATE.md`: the shared build rules. Don't repeat them in the brief.
- `AGENTS.md`, `README.md`, `content/business.ts`, `site.config.json`.
- `jamstacks/README.md` (gallery templates only).

For a gallery template, check whether sibling templates exist next to this checkout (`../next-*/`).
For any that have been built, skim `jamstacks/config.json`, `app/tailwind.input.css` and their
`plan/PLAN.md` if present. Note their fonts, palettes and signature elements, and choose a visual
direction that is clearly different from them.

If `plan/PLAN.md` already has filled-in content (no bracketed prompts), show the user and ask
before overwriting it.

## 3. Write the brief

Replace every bracketed prompt with specific, final content. Leave no `[…]` placeholders, and
delete optional entries that don't apply. Write in the plan's existing bullet style, and use
nested lists or small tables for collections. Each section must cover the following.

**Business and audience**

- Name, offer, audience. State "sample for the Jamstacks gallery" or "real website".
- The first question the home page answers and the single primary action.
- Public email, phone, address or service area, opening hours, and an IANA time zone (for
  example `America/Denver`).
- Short meta description, domain and schema.org type (e.g. `Brewery`, `Bakery`, `Restaurant`).
  - For a gallery template, also give the template ID, gallery name and gallery description.

**Pages and content**

- Home: the lead message, primary action and sections in order.
- Every other route (e.g. `/menu/`): its nav label, purpose and sections in order. Always
  include Contact and a themed 404. Keep the nav compact and only give content its own route
  when there is enough of it.
- Core collections, written out in full with real entries, not "add 8 items":
  - give each one its fields, units and stable URL-safe IDs
  - give prices in one currency and availability flags where relevant
  - say which values the owner will edit most often
- Contact:
  - What the enquiry form is for.
  - What visitors should put in the message. The hosted form has only name, email and
    message fields, so any other details go in the message text.
  - The public email, which is always visible.
  - Wording rule: bookings, orders, tours, quotes and wholesale requests are *enquiries*, and
    nothing may imply they are confirmed.

**Design and behavior**

- Visual direction: the layout concept, a named display font and body font, light and dark
  palettes as hex values, imagery and illustration style, and one signature element tied to
  the business.
  - The primary colour must carry white button text in both modes.
  - Use only self-hosted or licensed fonts that can be installed via npm.
  - Start from the subject itself: its materials, signage, packaging, tools, era and place. Turn
    those into a concept with a name (e.g. "Machine shop and can art"), not a generic adjective
    like "modern and clean".
- Artwork: list each bespoke SVG piece by name and describe it. At minimum include a hero scene,
  two or three section motifs or dividers, small icons, the 404 art and the OG image. Describe
  the shared drawing style (line weight, flat or textured fills, halftone, paper grain, and so
  on). Every piece must be drawable as inline SVG, with no photography or stock assets.
- Page compositions: for every page, give each section in order with its layout and the artwork
  it uses, and say how its content is presented as a designed object rather than a card grid
  (for example "beers as a row of can labels on a steel shelf"). Vary the layouts between
  sections. Describe what the first screen looks like at 390px and at 1440px.
- Interactions (filters, an open-now status, a map, tabs): what each does, and how it reads
  without JavaScript. Static copy stays neutral, and time-based status is computed in the
  browser.
  - Hours must not cross midnight unless the brief explicitly requires overnight support,
    tested, to be built.
- Acceptance criteria: start with **visual criteria** that can be checked in screenshots, so the
  design is held to the same standard as the data. Give at least five. For example:
  - the first screen at 390px shows the hero art, the wordmark and the primary action
  - the signature element appears on Home and on its main page
  - no two consecutive sections on Home share a layout
  - the header, footer, page heads, Contact and the 404 all use the themed art and type
  - dark mode keeps the textures and art with the same character
  - nothing on the page could pass for the neutral starter

  Then add checks specific to this brief, beyond the shared ones. For example:
  - validate collection data (unique IDs, price and range limits, references between items)
  - test hours boundaries and DST
  - required legal or responsible-service wording (age limits for alcohol, allergen notes)
  - one common owner edit to verify end to end

## 4. Check and hand off

- Re-read the plan against `PROMPT_TEMPLATE.md` and `AGENTS.md` and remove anything that
  contradicts them, such as server rendering, a custom form, extra form fields, payments,
  a database or overnight hours.
  - Run `grep -n '\[' plan/PLAN.md` to make sure no prompts remain (markdown links are fine).
- Don't edit any file other than `plan/PLAN.md`. Don't commit.
- Reply with a short summary of the brief, the assumptions you made, and any open questions.
  Then tell the user the next step is **`Implement plan/PLAN.md`**, and that once the finished
  site has been reviewed, `/cleanup-plan` removes the planning files.
