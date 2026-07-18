# BuckleSaurce clone — Claude rules

Pixel-faithful static clone of https://buckssauce.com/. Plain HTML/CSS/JS, no build step. Source of truth for layout and animation is the live site.

## MISTAKES RULE (mandatory, highest priority)
Any mistake — found by Claude OR by the user — MUST be logged to `mistakes.md` in this repo
BEFORE fixing it. Entry format:

```
## YYYY-MM-DD — <short title>
- What happened:
- Root cause:
- Prevention rule:
```

At the start of EVERY session in this repo, read `mistakes.md` and obey every Prevention rule.
Never repeat a logged mistake. If a prevention rule conflicts with a request, surface it.

## Model pipeline
- **Sonnet**: research (live-site inventories, comparisons, fact-finding).
- **Opus**: implementation (all code changes).
- **Fable**: decisions — diffs research, writes fix lists, approves changes.

## Repo notes
- Remote: `git@github-personal:tangowork09/BuckleSaurceVision.git` — push via the `github-personal` SSH alias only (default key is the work account and will be denied).
- Commit identity: `tangowork09 <tangowork09@users.noreply.github.com>` (set locally; never global).
- Pages: index, shop, product, about, faq, contact, wholesale. Shared css in `css/`, js in `js/`, images + lotties in `assets/`.
