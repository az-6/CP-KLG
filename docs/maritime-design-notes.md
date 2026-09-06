# Local maritime design comparison

The redesign starts from Sanity branch `feat/sanity-content-platform`, commit `9babf78`.
The redesign is maintained on branch `v2`, separate from `main` and the original Sanity branch.
Original source: `C:/CP/.worktrees/sanity-content-platform`.
Redesigned source: `C:/CP/.worktrees/maritime-redesign`.

## Visual direction

Deep maritime teal, warm white, restrained mint accents, Manrope headings with lighter weights,
DM Sans body text, small corner radii, photographic ocean hero, and an editorial layout.
Sanity schemas, content repositories, contact destinations, and published data are unchanged.
Hero copy is intentionally shorter. Product, evidence, partner, and news sections continue to
render the existing Sanity data and respect their visibility rules.

## Photography

Decorative ocean image: Jake Allison on Unsplash.
Source: https://unsplash.com/photos/an-aerial-view-of-a-body-of-water-bom8MViG88Q
Image: https://images.unsplash.com/photo-1647841016172-efaf8ebf2bac
License: https://unsplash.com/license
The ocean image is atmospheric decoration; it is not a photograph of KLG facilities or products.
Desktop and mobile WebP renditions are stored locally in `public/images/`.

## Compare locally

Both local comparison builds use the same built-in Sanity fixtures. Real project configuration
was not available in this workspace. No content has been published to Sanity.
Launch both versions together from this folder with `npm run preview:compare`.
Original: http://127.0.0.1:4324 — Redesign: http://127.0.0.1:4325.
Press Ctrl+C to stop both servers.

Build each version using its own configured Sanity environment. From the redesigned folder:

```powershell
$env:PORT='4325'
npm run build
node scripts/serve-static.mjs
```

For the original in a separate terminal, use the same static server with:

```powershell
$env:PORT='4324'
$env:STATIC_ROOT='C:/CP/.worktrees/sanity-content-platform/dist'
node scripts/serve-static.mjs
```

The original must be built beforehand. Both servers bind only to `127.0.0.1`.
Use `npm run test:e2e` with no pre-existing server on port 4321 to run the fixture-based suite.
