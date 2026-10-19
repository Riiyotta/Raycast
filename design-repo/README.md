# Launchpad design-repo (raycast.com layout and motion study)

A machine-validated contract layer for generating new pages in the style of this
clone without inventing colors, copy, structure or assets. It is a snapshot of
the clone project that contains this folder (React 18, Vite 5, Tailwind CSS 3,
8 routes through a pathname switch in `src/App.jsx`, no router dependency).

Status: **design-review-pending**, `productionApproved: false`.

## Counts (recomputed from disk; verify_all.py fails if any drift)

| What | Count |
|---|---|
| Foundation tokens | <!--count:foundationTokens-->252 |
| Primitives | <!--count:primitives-->11 |
| Components | <!--count:components-->21 |
| Sections | <!--count:sections-->47 |
| Templates | <!--count:templates-->8 |
| Routes | <!--count:routes-->8 |

Also: 21 semantic tokens, 13 component token groups, 13 layout tokens, 13 asset
roles, 21 graph rules, and one dark theme. `registry.manifest.json` holds the
full counts block.

## Read this first: the source is a real company

The measured site is a real, live company's marketing site. This repo carries
geometry, tokens, structure and timing. It does not carry their content.

- Use the neutral **Launchpad** wordmark (`brand.wordmark`, must-reuse-exact).
- Never reproduce the source company's logo or wordmark, product screenshots,
  extension or app icons, illustrations, marketing copy, plan names or real
  prices. Never use a real person's photo, name, handle or quote.
- All copy is original. All visuals are original CSS/SVG placeholders. The
  clone ships no `<img>` or `<video>` at all.
- Pricing is structure only. `price` fields must match `^\$[0-9]{1,3}$` and
  every PageSpec must attest `originalCopy`, `placeholderVisualsOnly` and
  `placeholderPricing`.
- The validator rejects any PageSpec string that contains the source
  company's name (`FORBIDDEN_SOURCE_BRAND`).
- Copy budgets come from measured character and line counts in the specs,
  never from the original text.
- Keep this repository private. Do not publish it.

`assets/asset-roles.json` has the closed role list, a generation policy for
each role, and the licensing notice. Five compliance-critical roles are pinned
to one exact policy, and verify_all.py fails if any of them is moved.

## Unusual structure (documented, not normalized away)

1. **Excluded saved copy.** A user-saved copy of the live site
   (`Raycast - Your shortcut to everything.html` and its `_files` folder) is kept
   under `reference/original-site/` in the project. It is never cited, copied or packaged. verify_all.py
   fails on any citation to it.
2. **Motion was re-measured during the build.** A concurrent agent was editing
   homepage motion while this repo was built. Every motion value was
   reconciled against the final source and the clean QA re-measure. See
   `mv.qa.*` in `extraction/measured-values.json`:
   - Hotkeys cycle is about 3.7s: release, then `IDLE_MS` 2000, then the swap,
     then about 1.7s of presses. It is not 2s and not 3.36s.
   - The homepage AI workflow uses `workflowDelay={3400}`. `/pro` and
     `/core-features/ai` keep the default 600.
   - The shortcuts reel's first slide dwells about 13.8s on desktop, and later
     steps are 6s at 390. Snippet typing starts about 1.55s after entry. API
     figure easing is `ease-in-out` (float) and `ease` (screen blink), not
     linear. All of these match the clone.
   - Testimonials auto-advance at about 10s. This overrides CLONE_SPEC's "no
     autoplay", which only watched for 7s.
3. **Known deviations, not measured truth** (`mv.deviation.*`):
   - Secondary-page heights differ from the original, mostly at 390. The
     biggest gap is `/teams` at +15.4%, because it uses `PricingSection`
     instead of the bespoke plan pair (PAGES_SPEC's own "lean option").
   - The footer ships 56 links where 47 were measured.
   - `reducedMotionFallback` is required by the contract. The clone only
     implements it for the AI workflow.
4. **Required slots are a design decision.** Template slots marked `required`
   are chrome, the hero, and each template's defining section. That choice
   was not measured.

## Layout

```
registry.manifest.json   status, versions, counts, entryPoints (inside this folder only)
tokens/00-foundation     color, spacing, radius, breakpoint, elevation, gradient, typography, motion, container
tokens/10-semantic       roles (text.loud, surface.card, ...) as aliases
tokens/20-component      component-scoped aliases
tokens/30-layout         section padding, shells, gutters
tokens/themes/dark.json  the only theme (color-scheme: dark)
tokens/llm/              token-catalog, token-policy, component-allowlist (versioned)
assets/asset-roles.json  closed assetRole enum, generation and licensing policy
primitives/ components/  atomic and composed building blocks, each citing its JSX
sections/                47 section contracts: content budgets, motion, responsive
templates/               8 templates (structured node lists) and the 1:1 route map
compatibility/graph.json rhythm and position rules with severities
schema/                  Draft-07 PageSpec schema, example, semantic validator, tests
extraction/              measured-values.json (citation ledger), verify_all.py, prove_drift.py
```

## Run

```bash
python3 schema/semantic_validate.py [spec.json]   # validate a PageSpec (default: the example)
python3 schema/tests/adversarial_test.py          # every mutation rejected, every control passes
python3 extraction/verify_all.py                  # whole-repo checks
python3 extraction/prove_drift.py                 # proves verify_all catches each injected defect
```

Requires Python 3 and `jsonschema`. Scripts find the repo root from their own
location, so the folder works anywhere. When the clone project is next to
this folder, citations are re-read against it. When it is missing, ranges are
checked against the recorded line counts and the script warns instead.

## How a PageSpec is checked

1. Schema (Draft-07): closed template, type, variant and motion enums.
   Per-section content with `maxLength` budgets. Closed `assetRole` per media
   slot.
2. Semantic layer: the node sequence must match the **declared template's own
   slot list**, in order, with required slots present and variants pinned.
   On top of that: nav first, footer last, one hero, max per page, adjacency,
   FAQ before the footer, route lock, motion per variant, maxWords, list
   totals, and the brand filter.

## Versions

`allowlistVersion` is machine-checked. `repositoryVersion` and
`pageSpecVersion` are documentation-only. See `versionFieldNote` in the
manifest.

## Packaging

`design-repo.zip` is built next to this folder with the CLI `zip` tool. It is
regenerated last, after verification passes. Never commit it alongside this
folder. The project is not a git repository today; if it becomes one, add
`design-repo.zip` to `.gitignore`.
