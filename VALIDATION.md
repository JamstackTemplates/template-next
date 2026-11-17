# Local verification

Verified in `JamstackTemplates/template-next` after migration:

- `npm ci` succeeds; npm reports no vulnerabilities.
- All 28 Node tests pass, including generator preservation and symlink rejection.
- `npm run typecheck` passes.
- `npm run build -- --webpack` and `npm run verify:export` pass for the root/unconfigured Contact export.
- The same build and verification pass with `PAGES_BASE_PATH=/preview`, `PAGES_BASE_URL=https://jamstacktemplates.github.io/preview` and `JAMSTACKS_SITE=starter-validation`.
- Default `npm run check` passes tests and typecheck, but its Turbopack build fails because this environment blocks port binding, including after an escalated retry. The default build script is unchanged.
- No browser visual checks, remote deployment or message-delivery verification were performed during this migration.
