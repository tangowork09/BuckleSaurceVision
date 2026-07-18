# Mistakes Log

Log every mistake (Claude-found or user-found) here BEFORE fixing. Never repeat one.

<!-- template
## YYYY-MM-DD — <short title>
- What happened:
- Root cause:
- Prevention rule:
-->

## 2026-07-19 — Pushed with wrong SSH identity
- What happened: First push to `git@github.com:tangowork09/BuckleSaurceVision.git` failed with "Permission to tangowork09/BuckleSaurceVision.git denied to tanish-visit" — the default SSH key belongs to the work account.
- Root cause: Used the plain `github.com` host, which resolves to the tanish-visit key, instead of the `github-personal` alias that carries `~/.ssh/id_ed25519_tangowork09`.
- Prevention rule: All remotes for tangowork09 repos use `git@github-personal:tangowork09/<repo>.git`. Verify `git remote -v` shows `github-personal` before the first push.

## 2026-07-19 — sections.css linked only on index.html
- What happened: `css/sections.css` was linked only from `index.html`. The JS marquee (`reviews()` in `main.js`) builds `.rev-card` review markup on `product.html` and `wholesale.html`, but those pages never loaded `sections.css`, so the reviews rendered as unstyled stacked blocks.
- Root cause: A shared stylesheet was treated as page-specific. The stylesheet-to-page link was not audited against every page that renders classes defined in it.
- Prevention rule: Any CSS file that styles markup produced by shared JS (or reused across pages) must be linked on every page that can render that markup. When adding a stylesheet, grep for its classes across all pages/JS before deciding which pages link it.

## 2026-07-19 — data.js `back` fields pointed at `*-front.png`
- What happened: In `js/data.js` every product's `back:` field pointed at `assets/<flavor>-front.png` while the real `assets/<flavor>-back.png` files sat unused, so the bottle hover-flip on the shop/product cards showed the front image twice instead of the back label.
- Root cause: Copy-paste of the `front` path into the `back` field; the `-back.png` assets were never wired up and no visual check of the flip state was done.
- Prevention rule: When a data field names a distinct asset variant (front/back, open/closed), verify the referenced file is the correct variant and that the intended asset is not left orphaned in `assets/`. Diff data references against the asset directory.

## 2026-07-19 — Interior pages had no mobile navigation
- What happened: Only `index.html` carried the `.nav-mini` + `.burger-menu` markup. The 6 interior pages relied solely on `.nav .nav-links`, which `style.css` hides under 820px, leaving those pages with zero navigation on mobile.
- Root cause: The responsive nav pattern was built on the homepage and never propagated to the other pages; mobile (375px) was never exercised on interior pages.
- Prevention rule: Site-wide navigation markup must be identical on every page. Test every page at 375px width before considering nav complete; a page with no reachable nav at mobile widths is a defect.

## 2026-07-19 — Dead parallax() IIFE targeting a non-existent class
- What happened: `js/main.js` shipped a `parallax()` IIFE that queried `.ingredient`, a class present in zero HTML files (leftover from an abandoned legacy centered hero), so it registered a scroll listener that never did anything.
- Root cause: Legacy hero code (JS + matching `style.css` rules) was left behind when the hero was replaced by the carousel hero, without cleaning up the orphaned selectors.
- Prevention rule: When replacing a component, remove its JS and CSS in the same change. Periodically grep every class referenced in JS/CSS against the HTML and delete selectors with zero matches.
