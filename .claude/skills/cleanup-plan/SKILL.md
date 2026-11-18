---
name: cleanup-plan
description: Remove the initial-build planning files from a finished website. Deletes the plan/ folder and the .claude/skills/ folder (this skill and write-plan), then updates README.md and AGENTS.md so they no longer point at them. Use only when the user asks to clean up, remove or delete the plan after the site has been built and reviewed.
disable-model-invocation: true
---

# Clean up planning files

Run this only after the website from `plan/PLAN.md` has been implemented and reviewed. Deleting the
plan removes the brief that the build was checked against.

## 1. Check before deleting

1. Run `git status --short`. Note any uncommitted changes, and leave them untouched. Never stash,
   reset or commit.
2. List exactly what will be removed:
   `ls -la plan .claude/skills 2>/dev/null`.
3. Check that nothing in the website uses the planning files:
   `grep -rn "plan/\|\.claude/skills" app components content lib scripts tests public next.config.mjs package.json 2>/dev/null`.
   If any website code or asset references them, stop and report it. Website code must never
   depend on `plan/`.
4. Check the site looks implemented:
   - Has `site.config.json` been renamed from the starter values?
   - Has `content/business.ts` been replaced with the business's own details?

   If either still looks like the neutral starter, warn the user that the plan may still be
   needed.
5. Show the user the list of files to delete and the doc edits from step 3, then ask them to
   confirm. Continue only once they confirm.

## 2. Delete

```bash
rm -rf plan .claude/skills
rmdir .claude 2>/dev/null || true   # only removes .claude if nothing else is left in it
```

Remove `.claude/skills/`. 

## 3. Update the docs that pointed at them

Edit only the lines about the planning workflow, and leave every other part of these files as it is.

- `README.md`:
  - remove or reword the "fill in `plan/PLAN.md` … delete `plan/`" instructions under
    "Build your website"
  - remove the `/write-plan` and `/cleanup-plan` mentions
  - remove "remove `plan/` after review" and "must not import or link the planning folder"
    from the pre-publication checklist
- `AGENTS.md`:
  - remove the "Building a new website" section
  - remove the "Remove `plan/` …" sentence under "Template publishing assets"
  - remove the skills note

Then run `grep -rn "plan/\|PLAN.md\|write-plan\|cleanup-plan\|\.claude/skills" --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=out --exclude-dir=.git .`
and fix any remaining stale references.

## 4. Verify and report

- Run `npm run check`. It must pass, since the build never depended on these files.
- Report three things:
  - what was deleted
  - which doc lines changed
  - the check result

  Leave the changes uncommitted unless the user asks you to commit.
