# Optional publishing assets

This starter is a developer foundation, not a gallery template. It has no invented screenshots or gallery entry.
The generator creates `config.json` for each real `next-type-style` template. After implementing its design,
generate light/dark screenshots and their report with the portal's `tools/template-screenshots/capture.mjs`,
then run `node --test jamstacks/config.test.mjs`. This source-only check deliberately requires real captures.

Customer websites can delete this entire directory. Normal tests, builds and the Pages workflow do not read it.
