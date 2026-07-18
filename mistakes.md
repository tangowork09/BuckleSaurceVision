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
