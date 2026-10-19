# Changelog

## 1.0.0 (2026-10-19): initial build

- Built from scratch (Situation A) with the existing IA (`ia.json`), CLONE_SPEC.md,
  PAGES_SPEC.md, `src/` and the QA re-measure as evidence. The IA was spot-checked
  against `src/pages/*.jsx` and held up: 8 templates, 8 routes, 47 sections.
- Tokens are parsed directly from `tailwind.config.js` and `src/index.css`. Each
  token cites the line its value comes from, and verify_all re-reads that line.
- 47 section contracts. Copy budgets use measured character counts. Unmeasured
  slots are flagged `clone-implementation` or `spec-sibling`.
- The PageSpec schema is closed. The semantic validator cross-references the
  declared template, and 23 rule ids agree with compatibility/graph.json
  (21 composition rules + 2 meta).
- The adversarial suite has 37 rejecting mutations and 1 warn-only mutation. It runs
  17 controls: the example, plus a full and a minimal instance synthesized for
  each template.
- prove_drift.py injects one defect per check into a scratch copy and confirms
  verify_all catches it.
- Motion reconciled against the final source after a concurrent motion pass.
  Hotkeys run about 3.7s per cycle, the home AI workflow uses `workflowDelay`
  3400, and the reel, snippet and API-figure values from the earlier brief were
  confirmed as not being corrections.
- Known deviations are recorded: secondary-page mobile heights, the `/teams`
  PricingSection substitution, footer link count, and reduced-motion coverage.
