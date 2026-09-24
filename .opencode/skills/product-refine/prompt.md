# product-refine prompt — simpler & more elegant, zero AI slop

Use this prompt directly with a coding agent (or reference the `product-refine` skill when
working inside the yoosuf.github.io repo) to refine the **Postwire** and **Messenger**
product microsites. One pass, targeted, reviewable.

---

```
Refine the Postwire and Messenger product microsites (yoosuf.me) to look more
professional and complete — simpler, calmer, fewer competing elements, and with zero
"AI-generated" feel.

Non-negotiables:
1. Generated bodies, not hand edits. The product body .astro files are generated
   ("Do not edit by hand"). Edit the authored docs in src/data/ and the body generators
   in scripts/, then run the documented generate command so both bodies regenerate
   consistently. Never hand-edit a generated body.
2. Neutral graphite palette only. Remove any leftover slate/navy/emerald values
   (#e2e8f0, #cbd5e1, #f8fafc, rgba(15,23,42,…), rgba(4,120,87,…), etc.). Reuse the
   existing neutral StyleX atoms; add new hex values only if no atom covers it, and
   mirror the site tokens if you do. Dark mode must inherit from :root's color-scheme.
3. Choose one clear emphasis per section. If a section lists several equally loud
   items (e.g. a wall of tool-logos or stacked switch-card groups), reduce or group
   them — don't stack cards to fill space. Everything secondary reads quieter than the
   primary message.
4. Make the "Built for real chat products" (#usecases) section feel intentional:
   keep the two authored groups (e.g. SaaS collaboration / Dating app integration)
   tight. If tabs are wanted, use a proper accessible tablist (role=tab, roving
   tabindex, aria-selected, arrow-key nav) as a React island — not decorative markup.
5. Human voice, no AI tells. First person, contractions, product-specific details
   (real table names, real workflows). No "seamless/elevate/empower", no parallel
   bullet scaffolding, no emoji, no stock filler.
6. Layout safety: no horizontal scroll at any width (320px up). Wide tables/terminals
   scroll inside their own container. No full page-width overflow.

Verify: npx tsc --noEmit, the StyleX architecture check, and npm run build must all
pass with no errors or warnings before you call it done.
```
