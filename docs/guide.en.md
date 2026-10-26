## What it's for

A few forgotten tags are costly for search ranking and accessibility: no `lang`, an over-long title, two `h1`s, images without `alt`. This script audits your HTML pages (a static site, an export, a build folder) and lists the fixes.

## Before you start

- A folder of `.html` files (for example your build output).

## Step by step

1. Audit:
   ```bash
   node src/html-audit.mjs ./dist
   ```
2. Fix page by page; run again.
3. Start with `title`, `meta description` and `h1`: they pay off most.

## Reading the output

Checks: `lang` attribute, `<title>` (present, ≤ 65 characters), meta description, meta viewport, a single `<h1>`, `alt` on every image, links with no destination, `target="_blank"` without `rel="noopener"`. An `alt=""` is valid: it marks a decorative image.

## Automating it

In CI, on the build folder: exit code 2 blocks the release of a regressing page.

## Pitfalls

- The audit reads **static** HTML: a page rendered in the browser by JavaScript is not analysed as the user sees it.
- This is not a full accessibility audit; it covers the basics.
