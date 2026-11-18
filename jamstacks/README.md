# Optional publishing assets

When preparing a `next-type-style` website for the gallery, create `jamstacks/config.json` using the
gallery name, description, type and style from the site's plan:

```json
{
  "name": "Gallery name",
  "description": "Gallery description",
  "tech": "next",
  "type": "type",
  "style": "style",
  "internal": false,
  "components": ["support-form"],
  "configFile": "site.config.json",
  "screenshots": {
    "light": "jamstacks/home-light.jpg",
    "dark": "jamstacks/home-dark.jpg",
    "theme": { "strategy": "media" }
  }
}
```

After implementing the design, generate light/dark screenshots and their report with the portal's
`tools/template-screenshots/capture.mjs`, then run `node --test jamstacks/config.test.mjs`.

Customer websites can delete this entire directory. Normal tests, builds and the Pages workflow do not read it.
