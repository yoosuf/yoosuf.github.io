---
name: product-refine
description: Simplify and polish the product microsites (Postwire and Messenger product pages on yoosuf.me) toward a calmer, more elegant presentation with zero AI-generated feel. Use when a microsite "looks incomplete", "looks unfinished", "too busy", "feels AI", or when asked to refine/tidy/clean up the messaging, layout, icons, or styling of the Postwire or Messenger product pages. Covers the authored source docs, the body generators, the StyleX product atoms, and the voice rules that keep copy human.
---

# product-refine — simpler + more elegant, no AI slop

Targets the product pages built from `@astrojs/stylex`-styled generated bodies. Everything
here is a gate you must respect; the site already encodes most of it in `AGENTS.md`.

## Ground truth (do this first, every time)

1. **The `.astro` bodies are generated.** `PostwireBody.astro` and `MessengerBody.astro` say
   "Do not edit by hand." Their real sources are the authored docs in `src/data/` plus the
   body generators in `scripts/generate-*-body.mjs`. Anyone hand-editing a body creates a
   file that the next `npm run generate:*` silently overwrites.
2. Read the current authored doc + its generator *before* editing anything, and confirm the
   exact StyleX atom keys exist (or add them to the product stylex module) — never invent an
   atom key.
3. If nothing is surfaced as wrong, ask a pointed question (which section reads as
   incomplete?) instead of sweeping the whole page. A targeted fix beats a full-image
   redesign, and it keeps the change reviewable.

## The style bar — what "elegant" means here

This site intentionally looks hand-built, quiet, and neutral. If your edit could be
described as "AI-generated", it is wrong. Concretely:

- **One neutral graphite palette only.** Light `#d6d6d6`/`#e5e5e5`/`#f6f6f6` and light-dark
  graphite darks (`#161616`, `rgba(160,160,160,…)`). **No slate, no navy, no indigo, no
  emerald** — any `#e2e8f0`, `#94a3b8`, `#0f172a`, `#cbd5e1`, `rgba(15,23,42,…)` is a
  leftover and reads as unfinished. Reuse the existing StyleX atoms; do not hard-code new
  hex values when an atom already exists.
- **Write like a human, in Yoosuf's voice** (first person, contractions, short punches and
  long rambles). Copy must be specific about *this* product: real table names, real
  workflows, real numbers. Generic SaaS filler (elevate, empower, seamless, you-can-craft,
  "in today's fast-paced …") is the loudest AI tell and must go.
- **No formulaic scaffolding**: no perfect parallel bullets everywhere, no repeated
  "The Good/Bad/Ugly", no emoji, no stock open-graph-style lines like "Built with care".
- **One clean load motion** — per the `astro-dev` skill: pure opacity fade, no per-element
  stagger, gated behind `prefers-reduced-motion`. Never re-introduce hero stagger.
- **Zero horizontal scroll at any width** (320px up). Tables and terminals overflow inside
  their own scroll container, never the page.

## Simplicity rules (when a section feels incomplete/busy)

- Remove a section rather than stack more cards. Two strong groups beat four weak ones: the
  "Built for real chat products" section works best when each `pm-doc-group` is one tight,
  intentional group, not a wall of chips.
- Empty/underfilled space is often a sign to *reduce* content or tighten spacing, not to add
  decoration. Don't pad with placeholders or fake hero imagery.
- One accent action (CTA) per section. If a section lists multiple, cut to the primary.

## The ready-to-use prompt

Paste this into a fresh code session to trigger the full refine pass:

```
Refine the Postwire and Messenger product microsites to look more professional and
complete — simpler, calmer, and with zero AI-generated feel.

Follow the product-refine skill for the full checklist, but the non-negotiables are:
1. Body files are generated: edit only the authored docs in src/data/ + their generators,
   never the .astro bodies directly, then run the generate script and the build gates.
2. Neutral graphite palette only. Remove every leftover slate/navy/emerald value
   (#e2e8f0, #94a3b8, rgba(15,23,42,...), etc.) and reuse existing StyleX atoms.
3. Keep the "Built for real chat products" section as clean, deliberate groups —
   don't turn it into a wall of tool logos.
4. Human voice, specific to this product, no AI-tell phrasing or stock filler.
5. No horizontal scroll at 320px; one fade-only load motion gated behind reduced-motion.

When you're done, run: npx tsc --noEmit, the stylex architecture check, and npm run build —
no errors or warnings.
```

## Verification (always)

1. `npx tsc --noEmit` — clean.
2. `npm run build` — no warnings.
3. Overflow + motion checks from `astro-dev` when layout/load changed.
4. If you edited the generated bodies via their generators, re-run the generator and
   confirm the emitted body is stable (regenerate is idempotent).
