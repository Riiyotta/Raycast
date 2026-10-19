Source: https://www.raycast.com/ (routes: /store, /pro, /pricing, /teams, /core-features/ai, /windows, /ios)

# PAGES_SPEC: 7 secondary pages (reuse-first build spec)

Measured on 2026-10-19 with headless Chromium (Node Playwright) at **1440x900** and **390x844** (mobile, DPR 3). Values come from `getComputedStyle` and `getBoundingClientRect`, after a full scroll pass so reveal states settle; keyframes come from the live CSSOM. Y values are document-absolute. Raw outlines are in the scratchpad (`out/pages/*.txt`).

**Content policy** (same as CLONE_SPEC.md): text is given as role, character count (c) and line count at 1440 (L). Write original copy of the same length. Do not reuse Raycast logos, screenshots, app icons, avatars, illustrations or videos. Each asset is listed with its geometry so you can make an original placeholder. Pricing is structure only (tier count, row count, toggle and badge UI), with no prices or feature wording.

**Tokens**: everything in `tailwind.config.js` stays as is. Only the values below are new. Every other color here maps to an existing token: `bg-card`, `card-border`, `grey-*`, `fg-300` (#78787c), `brand-blue` (#56c2ff), `accent-red` (#ff6161).

---

## 0. New tokens (add to tailwind.config.js)

| Token | Value | Used by |
|---|---|---|
| `colors.plan.featured-from/to` | `#222326` → `#151619`, as `linear-gradient(137deg, #222326 4.87%, #151619 75.88%)` | featured PlanCard, EnterprisePlanCard |
| `colors.table.group` | `#1b1b1f` | PricingTable group separator rows |
| `colors.pro.badge` | `#aae1ff` | /pro hero pill text |
| `colors.pro.glyph` | `#ffe2e2` | ProUpsell highlighted word |
| `colors.teams.orange` | `#ff9217` | /teams hero pill text |
| `colors.chip.discount` | `#2c1617` | "-N%" badge text on the white chip |
| `colors.window-border` | `rgba(142,140,144,.2)` | /windows mock app windows |
| `colors.ios-card` | `rgba(49,49,49,.1)` | iOS bento cards |
| `fontFamily.serif` | `"Instrument Serif", serif` (OFL, Google Fonts, weight 400) | /windows hero only |
| `backgroundImage.text-sheen` | `linear-gradient(90deg, rgba(255,255,255,.8) -1.59%, #fff 49.71%, rgba(255,255,255,.81) 100%)` | PageHero h1 on /pro and /ios (with `bg-clip-text text-transparent`) |
| `backgroundImage.text-teams` | `linear-gradient(94.34deg, #fff -0.89%, #9bd0f5 100%)` | /teams h1 |
| `backgroundImage.faq-line` | `linear-gradient(90deg, rgba(255,255,255,.024) 0%, rgba(255,255,255,.1) 40%, rgba(255,255,255,.1) 60%, rgba(255,255,255,.024) 100%)` | FaqAccordion item border-image |
| `backgroundImage.pill-pro` | border-box trick: `linear-gradient(#07080a,#07080a) padding-box, linear-gradient(150deg, rgba(255,255,255,.23), rgba(255,255,255,.07)) border-box` | /pro hero pill |
| `backgroundImage.pill-teams` | `linear-gradient(90.33deg, rgba(251,137,32,.14) 0%, rgba(255,77,1,.106) 100%)` | /teams hero pill |
| `backgroundImage.pill-pink` | `linear-gradient(90.33deg, rgba(252,136,160,.25) 0%, rgba(249,193,193,.25) 100%)` | ProUpsell pill |
| `backgroundImage.slideshow` | `linear-gradient(112.7deg, #3e74ff 0%, #5505ff 39.49%, #020207 100%)` | TeamsSlideshow frame |
| `keyframes.blurIn` | `0% {filter:blur(10px); opacity:0} 100% {filter:none; opacity:1}` | /core-features/ai hero |
| `keyframes.riseIn` | `0% {opacity:0; translate:0 10px} 100% {opacity:1; translate:0}` | AI hero stage |
| `keyframes.fadeInUp` | `0% {opacity:0; transform:translateY(20px)} 100% {opacity:1; transform:none}` | /windows hero |
| `keyframes.marqueeL/R` | `translateX(0) → translateX(-512px)`, and the reverse | GameLauncherMarquee |
| `keyframes.dotPulse1/2/3` | bg transparent → `#56c2ff` → transparent, with ON windows of 22–90%, 32–80% and 42–70% | DotGrid (pro card) |
| `keyframes.orbitL/R` | `rotate(var(--rotation)) → rotate(calc(var(--rotation) ∓ 1turn))`, plus counter-rotation on each child icon | TeamsHeader orbit |

Container widths in use: **1204** (existing `container`), **1252** (`ext-top`; 1204 plus 24px padding each side, the "page-module" section shell), **1110** (pricing page body), **1067** (iOS SectionContainer), **1060** (existing `ai`), **1140** (1204 minus 32px side padding), **700** (FAQ), **740** (store header), **520** and **486** (heading max widths).

Section shell: `padding:168px 24px` and max 1252 at 1440. At 390 it is `96px 16px` on /ios and /core-features/ai, and stays `168px 24px` on /pro.

---

## 1. Refactors to existing components (small, enables reuse)

| Component | Change |
|---|---|
| `SectionTitle` (shared.jsx) | Add `size` prop: `20` (current), `24` (/pro: 24px/normal 500), `32` (/ios and AI page: 32px/51.2px 500 .2px, 20px/32px at 390), `48` (/pro FAQ: 48px/normal 600). Add optional `eyebrow` (JetBrains Mono 14px/16.1 500 .2px uppercase #6a6b6c, 4–15c, 8px above h2) and optional `body` (18px/27px 400 .2px #6a6b6c, max 516, 2–4L). Second line color stays #6a6b6c on most pages but is #9c9c9d on /pro. Expose as a prop. |
| `AiBento` | Export `AiHeader` (eyebrow + 32px h2 + 18px desc; `padding:72px 20px 56px` centered, `align` prop for the left variant) and `AiCard` (the existing `Card`). Make the default export accept `cards`/`children` so /pro can render it unchanged. |
| `ExtensionsCarousel` | Export `ExtensionReel` (reel + cards + browse-more card, without the category switcher or pagination buttons). Props: `title` node, `showCategories` (default true). |
| `Community` | Export `SocialCards` (title + 2 social cards grid only, no background art or video ticker). |
| `Footer` | Prop `art`: `'cube'` (default) or `'windows'`. The windows variant has `padding-top:320px`, a centered image 434x549 (natural 1736x2196, opacity .8, max-width 434), and at 390 340x430 at x 49. |
| `Navbar` | Give the 9 links real `href`s: index 0 → `/store`, 1 → `/pro`, 2 → `/core-features/ai`, 3 → `/ios`, 4 → `/windows`, 5 → `/teams`, 8 → `/pricing` (6 and 7 stay `#`). The nav looks identical on all 7 pages (same 1204x76 bar, no active-link styling measured). |
| `LightButton`/`DarkButton` | Add `size="lg"` (48px tall, two-line label: 14px/16 + 12px/16, used on the /ios hero) and `block` (full width). The dark button on /windows uses `radius 6px`. |
| `Badge` | Already matches the "Tag" (26px, `bg #1b1c1e`, radius 6, `px 6`, 14px/16.1 500 white, 16px icon, gap 8). Add `size="sm"` (24px tall, `px 4`) for /windows. |

---

## 2. New shared components (build once)

### 2.1 `PageHero`
Centered column with optional art behind it. Props: `pill`, `title`, `titleVariant`, `subtitle`, `actions`, `footnote`, `art`, `padTop`.

| Variant | Used on | Geometry | h1 | Subtitle | Extras |
|---|---|---|---|---|---|
| `sheen` | /pro | section 1440x547, `padding-top:250px` (390: 648 tall, same 250). Content max 662, `padding:0 16px`, gap 16 | 48px/normal 600, `text-sheen` clipped, 18c 1L (2L at 390, still 48px) | 18px/normal 500 .2px #fff, 111c 2L (390: 4L) | Pill 133x34 above (`pad 6 12 6 10`, radius 16, 1px transparent border with `pill-pro`, `inset 0 1px 1px rgba(255,255,255,.25)`, 14px/16.1 500 .2px `#aae1ff`, 11c, 16px icon, gap 4). Actions: column gap 16 = LightButton 128x36 + Geist Mono 14px/22.4 500 .3px #6a6b6c caption (22c). Art: absolute image at top 0, 1489x635 (natural 1917x817), 888x378 at 390. Placeholder: soft colored horizon glow. |
| `sheen` | /ios | section 873 tall, `padding:164px 16px 1px`, gap 12 (390: 571, `pad 90 16`) | 48px/normal 600 sheen, 29c 2L. **27px** at 390 | 16px/24 500 .2px white/.6, 51c 1L, max 520 | Art above the title: 800x500 (natural 828x518; 390: 300 tall), centered app tile 108x108 with a 140x140 duplicate at opacity .8 and a 300x300 radius-100 `blur(5px)` disk behind. Actions row gap 16: LightButton lg 127x48 + DarkButton lg 135x48. |
| `plain` | /core-features/ai | header 1020x333, `padding:0 20px 72px` inside the 1060 shell, top y 180 (390: y 80, `pad 32 0 56`) | 48px/50.4 500, ls **-1.92px**, max 450, 31c 2L. 390: 40px/44, ls -1.6px | 16px/24 400 white/.5, max 320, 63c 2L | Actions column gap 16 (270 wide): LightButton 193x36 + caption 14px/20 400 white/.4 (38c). **Motion**: h1, p and actions each run `blurIn .5s ease-out` on load. |
| `store` | /store | page `padding-top:108px` (390: 90). Header max 740, y 558 (390: 345), 277 tall | 80px/86 600 ls 1.2px, `padding:0 36px`, 5c. 390: 44px/48.4 | 20px/28 400 .3px #6a6b6c, max 560, 104c 2L (390: 16px/24, 3L) | Search button 476x51 (`pad 16`, `bg #0c0d0f`, 1px `#2f3031`, radius 12, placeholder 15px/17.25 #6a6b6c, 9c) with 2 keycaps on the right (20x20, radius 4, `radial-gradient(100% 100% at 50% 0, #111214, #1b1c1e 150%)`, 1px card-border, gap 6). Art: two stacked images 1064x560 at top 0, centered (natural 1080x568; 470x247 at 390). Back layer `bgEnter 2s ease` (opacity 0, `scale(1.03)` → 1). Front layer `fgEnter 1.5s ease` (opacity 0, `translateY(20px)` → 0). Page background `radial-gradient(50% 50% at 50% -20%, rgba(255,99,99,.08) 0%, rgba(255,119,119,.04) 50.5%, transparent 100%)` over the whole store column. |
| `teams` | /teams | block 1140x1208 starting y -72 (`pad 72 24`), content max 520 at y 296, gap 32 | 72px/84 700, `text-teams` clipped, 22c 2L. 390: 44px/51 | 18px/28 500 white at opacity .6, 95c 2L | Pill 311x38 (`pad 8 16`, radius 16, `pill-teams`, 1px white/.05, 14px/20 500 `#ff9217`, 35c; `transition: background-position .2s`). LightButton 143x36. "Learn more" link 76x46 (14px/16.1 500 white/.4, column gap 16 with a down chevron, color .2s). See **TeamsOrbit** for the art. |

### 2.2 `PricingSection` (identical on /pricing, /pro and /core-features/ai)
- **Wrapper**: column, gap 24. On /pro and /ai it sits in the 1252 shell (content 1204). On /pricing it is max 1110 with `padding-top:156px` (390: 138). /ai puts a `SectionTitle size=32` (7c) above it with gap 64.
- **IntervalToggle** (centered):
  - Track 280x62: `pad 8`, 2 cols of 129, gap 4, radius 31, `bg-card`, 1px card-border, `inset 0 1px rgba(255,255,255,.1)`.
  - Labels 14px/22.4 500 .2px, `pad 0 16`, `transition color .2s`. Active #fff, inactive #9c9c9d.
  - Sliding pill 129x45, radius 22.5, `radial-gradient(51.07% 92.4% at 51% 7.61%, #5a5a5a, #1a1a1a)` (existing `bg-cat-active`), `backdrop-blur 2px`. It moves with `transform: translateX(133px)` and `transition: transform .2s ease`.
  - The second option carries a discount chip 46x24: `bg #fff`, radius 12, `pad 0 8`, Geist Mono 12px/22.4 500 `chip.discount`, 4c.
  - Default is the second (yearly) option.
- **Plan grid** (1204x1130 at 1440; 1110x1153 on /pricing):
  - Outer box: `grid-template-columns: repeat(3,1fr)` (401 each; 369 on /pricing), `bg-card`, 1px `#2f3031` (grey-500), radius 16.
  - **3 tiers**. Side cards: `pad 32`, column gap 16.
  - **Middle (featured) card**: overhangs the box by 16px top and bottom (y -16, height +32). `pad 48 32`, `plan.featured` gradient, 1px #2f3031, radius 16.
  - **Card stack, top to bottom**:
    - Name: 20px/normal **700** .2px white, 9–12c. The featured card uses 24px.
    - Tagline: 14px/19.6 500 #9c9c9d, 31–41c, 1L. The featured card uses 18px/25.2.
    - **TierSwitch** segmented control, 40px tall. Present on the featured card (3 options) and the third card (4 options); the first card has an empty 40px spacer.
      - `pad 4`, gap 2, `bg rgba(255,255,255,.04)`, 1px white/.06, radius 999.
      - Buttons 30px tall, radius 999, 14px/16.1 500 (3–4c). Active: `bg rgba(255,255,255,.09)` + `inset 0 1px rgba(255,255,255,.06)`, #fff. Inactive: #9c9c9d.
    - Price: Inter 64px/64 600 .3px white, with a unit in Geist Mono 14px/14 500 .3px #9c9c9d (7–14c) baseline-aligned, gap 8.
    - Billing line: 24px tall. Geist Mono 14px #9c9c9d (20–21c) with a struck-through reference amount in #6a6b6c. Empty on the free tier and in monthly mode.
    - CTA: full-width 36px. LightButton on the featured card, DarkButton on the other two.
    - Feature list: column gap 8. Each row is a 16x16 stroke icon (white, `margin-top:3px`) + text 14px/22.4 500 .2px white, gap 6. Some rows are 2–7 lines and include a nested grey sub-list or an inline Badge. Row 1 on paid tiers is an "everything in previous tier" line in #9c9c9d.
  - **Row counts**: tier 1 = 6 rows. Tier 2 = 1 + 11 rows, followed by a trial note (12px/19 400 #9c9c9d centered, 48c, `pad-top 8`). Tier 3 = 1 + 5 rows.
- **"Compare all features" link** (/pricing only): 14px/22.4 500 #9c9c9d with a chevron, gap 4, `color .15s`, centered, about 32px below the grid.
- **EnterprisePlanCard**: 1188x433 at y +1226 from the toggle (/pricing: 1094 wide).
  - Inset 8px from the grid edges. Grid `2fr 1fr` (790/395), `plan.featured` gradient, 1px #2f3031, radius 16.
  - Left column: `pad 40`. Header = name 20px 700 (22c) + tagline 14px #9c9c9d (33c). Below it, two feature columns of 324 each (gap 10), with rows in #9c9c9d 14px/22.4. Column A: 1 + 2 rows, a white subhead (14px/16.1, 18c), then 5 rows. Column B: a subhead, then 8 rows.
  - Right column: `pad 24 40`, `border-left 1px #2f3031`. A vertically centered label (24px 700, 14c) + Geist Mono 12px #9c9c9d caption (20c). A full-width DarkButton is pinned to the bottom.
- **BlockCta link**: centered, 16px/16.96 500 .3px white with an arrow, 39c, 43px below the Enterprise card.
- **390**:
  - Toggle unchanged (280 wide).
  - Tier 1 collapses into a compact 358x133 card: grid `139px 153px`, gap 32/16, `pad 24`, featured gradient at 50% alpha (`rgba(34,35,38,.5)` → `rgba(21,22,25,.5)`), name/tagline left, price right.
  - Tiers 2 and 3 stack as full cards (358 wide, `pad 24`, single column 308). The plan column is `pad 0 16`.
  - Section height 3269 on /pricing, 3435 on /pro.
- **Motion**: none on scroll. Interactions are toggle pill .2s, label color .2s and TierSwitch `transition: all` (instant). Switching interval swaps the price and billing text with no tween.

### 2.3 `PricingTable` (/pricing only)
- 1204 wide at y 2287, 2652 tall. Grid columns `230 184 184 217.5 204.5 184`: one label column + 5 plan columns. Each row is a subgrid row.
- Every cell: `pad 24 16`, `bg #07080a`, `box-shadow: 0 0 0 1px #1b1c1e, inset 0 0 0 1px #07080a` (draws the hairline grid). Content is vertically centered; value cells are horizontally centered.
- **Rows**: header (72) + **22 feature rows** + **4 group-separator rows** (8px tall, all cells `bg table.group #1b1b1f`, no text) + a final CTA row (84, LightButton 36px in plan columns, 152–173 wide).
  - Feature row heights: 16 at 70, 4 at 123, 2 at 160, 1 at 205, 1 at 227, 1 at 93 (row height follows the label cell).
- Header cells: plan name 18px/20.7 600 white (4–10c), centered.
- Label cells: 14px/22.4 500 .2px white. Optional ", including:" plus a grey detail list (#6a6b6c, up to 130c / 7L). Optional 16x16 info icon (4px gap) that opens a popover (`slideUpAndFade`: opacity 0 + `translateY(2px)` → 0).
- Value cells: either a 16x22 glyph (check or dash) or a short text value 14px/22.4 white (8–9c).
- Not sticky: the header row scrolls away (`position: static` measured).
- **390**: the grid keeps 6 columns of 164 (984 wide) inside a 390 wrapper, so it scrolls horizontally. Height 2078.

### 2.4 `FaqAccordion` (/pricing, /pro, /core-features/ai, /windows, /ios)
- Column max 700, centered.
- Heading: `SectionTitle` (h2 4c + p 39c, 20px; second line #6a6b6c). /pro uses `size=48` (h2 48px 600 + p 20px #9c9c9d, max 482, gap 16). /windows uses a single h2 18px/25.2 600 centered, gap 48.
- List: `padding-top:1px`, starts 64px below the heading (/pricing: 112px from the heading top).
- **Item**: 103px collapsed (102 + 1px bottom border). The border is `border-bottom:1px solid` with `border-image: faq-line 1`. /pro also draws a top hairline on the list wrapper.
  - Trigger: full-width `<button>` inside an `h4`, `pad 39px 0`, row space-between, gap 32. Question 16px/24 **600** white left, 20–68c, 1L.
  - Chevron: 16x16 stroke 1.5 white (`M12.25 5.75 8 10.25l-4.25-4.5`), `transition: transform .4s`. Open state is `rotate(180deg)`.
  - Answer: grid with `grid-template-rows: 0fr → 1fr` and opacity 0 → 1, `transition: grid-template-rows .2s, opacity .2s`. Text 15px/22 400 `fg-300 #78787c`, roughly 100–330c (325c → 104px open).
  - Multiple items can be open at once. `aria-expanded` and `aria-controls` are wired.
- **Item counts**: /pricing 10, /pro 6, /core-features/ai 5, /windows 5, /ios 4.
- /pro wraps the list in `padding-top:48px` with `radial-gradient(49.41% 64.58% at 49.4% 0, rgba(255,255,255,.03), transparent)` (existing `bg-top-sheen`). /windows wraps everything in `radial-gradient(48.42% 36.85% at 53% 48%, rgba(255,255,255,.04), transparent)`.
- 390: the same items wrap to 2L (342–358 wide).

### 2.5 `MediaCard` (feature card with visual + text; /pro, /windows, /ios)
One component with a `variant` prop:
- **`pro`** (/pro 2x2 grid; grid `590 590`, gap 24, at y 4552, 899 tall):
  - Card 590x436–439: `pad 30 32`, column gap 46, `bg-card`, 1px card-border, radius 12, `shadow-inset-top`.
  - Visual box about 417–734 x 223–233. It can overflow right and is masked: `radial-gradient(circle at -80% 50%, #fff 50%, transparent 100%)` on cards 2 and 3, `linear-gradient(#fff 50%, transparent)` on card 4.
  - Text block max 524: `SectionTitle`-style pair, both 20px/normal 500 .2px. h2 white is 13–16c, inline-run with an h5 #9c9c9d of 54–78c (2L). Then a `Badge` (10–24c).
  - Card 3 visual is **DotGrid**: 8x5 grid of 10x10 circles, gap 40, column width 53.7, `border 1px rgba(86,194,255,.314)`. Columns 1–4 animate `dotPulse1/2/3 6s ease infinite` in staggered column bands; columns 5–8 stay hollow.
  - 390: single column, cards 342 wide, `pad 30 24`, gap 30, 404–471 tall.
- **`windows`** (/windows feature wall; grid `582 582`, gap 40, 1204x1980):
  - Card 1 spans both columns (1204x582). The others are 582x426. `bg-card`, 1px card-border, radius 12, `shadow-inset-top`.
  - Visual area: 460 tall on the wide card, 280 on the others. It holds a mock app window (1px `window-border`, radius 18, `bg rgba(0,0,0,.5)`) as the poster. A `<video loop muted>` covers the whole card at opacity 0.
  - Text block: `pad 16 32 32`, gap 24. h3 20px/normal 500 .2px white (16–25c, 1–2L) + `Badge size=sm`.
  - **Hover**: border goes to `rgba(255,255,255,.12)`. The video fades to opacity 1 and plays, and the poster fades to 0 (`opacity .3s ease`).
  - A 2px progress line (`bg white/.2`, fill `accent-red #ff6161`, `transition width .2s linear`) sits at the card bottom and shows while playing (opacity .3s).
  - A 16px icon sits top-left at 16/16.
  - 8 cards total (1 wide + 7 regular, 2-up).
  - 390: single column, 358 wide.
- **`ios`** (/ios bentos; grid `491.5 491.5`, gap 36, in the 1067 shell):
  - Card: `pad 40`, column gap 8, `bg ios-card`, 1px card-border, radius 20, `backdrop-blur 10px`.
  - Visual 410 wide (image 395x364–490x463).
  - Title 18px/20.7 500 .2px white (7–28c). Desc 14px/22.4 400 .2px #9c9c9d (57–137c, 1–3L). Optional link 14px/16.1 400 #9c9c9d, underline color `.1s ease-out`, 16–18c.
  - **Bento A** (y 3163, 1229 tall): two 492x558 cards on top. Then a left column of two stacked cards (421 + 177, gap 36; the 177 card has a 12px/13.8 #6a6b6c footnote of 22c). Right: one 492x634 card.
  - **Bento B** (y 7085, 1019 tall): 2x2 of 492x492. Cards 1 and 3 use `pad 0 40 40` with a full-bleed top image 490x490 / 490x358 and a transparent border + `inset 0 0 0 1px rgba(255,255,255,.1)`.
  - 390: single column, gap 36.

### 2.6 `SplitFeature` (text column + visual; /pro, /teams, /ios, /core-features/ai, /windows)
Props: `reverse`, `textMax`, `gap`, `visual`, `head` (one of the heading styles below), `body`, `link`, `badge`.

| Instance | Geometry | Heading style |
|---|---|---|
| /pro translator (y 4072) | row: visual 917x400 bleeding left to x 94 (natural 1856x810), text max 300 at x 987, vertically centered | 20px pair: h2 white 30c + h5 #9c9c9d 81c 3L, then Badge 10c with a 16px icon. 390: visual 688x300 centered over the text |
| /pro themes (y 5512) | `row-reverse`, gap 40. Visual 750x350 (mock window 750x310 with a 1px white/.1 top-only frame, radius 13 13 0 0, `shadow 0 16px 56px -8px #000`, overlay picker panel 200x242 `bg rgba(0,0,0,.4)` blur 8 radius 12). Text max 474 | 20px pair 17c / 73c + Badge 13c |
| /teams highlights x3 (y 1632, 3191, 3663) | grid `506 506`, gap 64 (column) / 24 (row), `pad 0 32`. Visual 506x272 (natural 846x454) or 506x213. Rows alternate sides (2nd row reversed) | eyebrow `strong` 16px/24 500 `brand-blue` 15–18c with a 12px-gap icon. h4 30px/36 600 white 48–56c 2L (390: 20px/30). Two paragraphs 16px/24 500 white/.6 (116–243c and 67–116c). Link 14px/16 500 .2px white with an arrow, gap 8 |
| /ios side features x2 (y 2295, 6036; 700-tall shells) | text max 360 at the left, visual 941x941 absolutely overflowing right (x 541, y -47). Visual = a frosted panel (`bg rgba(255,255,255,.01)`, radius 48 or 26/26/48/48, `inset 0 0 0 1px rgba(255,255,255,.06)`, blur 25, skewed with `matrix(.87,.5,-.87,.5,0,0)` isometric) over a phone image (natural 640x1386). 390: visual below, max 520 | SectionTitle size=32 left-aligned with eyebrow (10–15c), h2 28–32c 2L, body 90–106c 3L, link 16px/18.4 400 white 18c |
| /core-features/ai split A (y 3566, 468 tall) | grid `490 490`, gap 40. Text column gap 56 (header 128 / 3 bullet rows 100 / 2x2 mini-grid 225 cols gap 40). Right: AiCard 490x400 | AiHeader left (eyebrow + 32px h2 + 18px desc) |
| /core-features/ai split B (y 4215) | `pad 72 0`. Left: icon grid 5 columns of 80, gap 15. The centre tile (80x80, radius 25%, `bg rgba(49,49,49,.1)`) has a strong glow `0 4px 40px 15px rgba(8,9,11,.9), 0 0 100px 20px rgba(255,73,57,.25), 0 1px 4px rgba(0,0,0,.4)`. Right: text (`pad-top 25`), list of 3 rows (gap 40) + ArrowLink | AiHeader left |
| /core-features/ai split C (y 4999, 400 tall) | text 490 vertically centered. Right: a command palette mock 650x484 bleeding past the edge (`bg rgba(17,18,23,.96→.98)`, radius 26) | eyebrow 11c, h2 32c 2L, desc 143c 3L |
| /windows game launcher (y 5002) | row gap 24. Text 500 (h2 20px pair 18c + 81c, then p 14px/22.4 400 #9c9c9d 70c 2L). Visual 586x248 = **GameLauncherMarquee** | 20px pair |

### 2.7 `DownloadBlock`
- **`mac`** (/teams "ReadyForTakeOff", y 8584, max 560):
  - h2 36px/40 700 (19c) + p 18px/28 400 white/.6 (75c 2L).
  - Column gap 24: a white button 280x50 (`pad 12 40`, `bg rgba(255,255,255,.9)`, **3px** border white/.3, radius 8, 16px/20 500 #0d0d0d, 16c, `bg-color .2s`), then an "or" divider (16px white/.4), then a brew command chip 276x46 (`pad 12 24`, `bg #07080a`, radius 8, JetBrains Mono 13px/20 400 white/.4, 27c with a `$` prompt).
  - Caption 13px/16 400 .2px white/.4 (9c).
- **`windows`** (/windows hero + FinalCta block, 315 wide, column gap 24):
  - Row gap 24: a store badge 132x36 (radius 4; original placeholder badge) + DarkButton 136x36 (radius 6).
  - Then a Geist Mono 12px/19.2 500 .2px #9c9c9d line (24c) with an inline "install via" text button (18c, `opacity .2s`).
- **`ios`** (/ios final section, y 8272):
  - `SectionTitle` (38c / 33c), then a QR card 158x189: `pad 16`, column gap 12, `bg-card` (137.02deg), 1px card-border, radius 12, `shadow-inset-top`, QR placeholder 124x127, label 14px/16.1 500 white (16c), button-like transitions.
  - Caption JetBrains Mono 12px/13.8 500 #9c9c9d (15c), gap 24.
  - The **same card is also fixed** on /ios: `position:fixed; right:20px; bottom:20px; z-index:100` (x 1262, y 691 at 1440x900). It stays visible on scroll (no hide/fade measured). At 390 the fixed card is absent and the final section shows a 127x48 App Store-style LightButton (size lg) in place of the QR card (block 358x86, gap 24).

### 2.8 `CenteredLead` (heading over a section, older pages: /teams, /windows)
- **/teams**: block `pad 72 24 24`. h2 36px/40 **700** white, max 520 (17–41c, 1–2L). p 18px/28 400 white/.6, max 520 (47–107c). 390: h2 24px/36.
- **/windows**: h2 20px/28 500 .2px white, with a `<br>` and a second span in white/.6 or #9c9c9d. Max 60% / 436 / 438. 12–38c + 34–67c.

---

## 3. New single-page components

| Component | Page | Spec |
|---|---|---|
| `ModelTabs` | /pro y 2488–3390 | Header: SectionTitle size=24 (14c / 17c), max 424, + p 16px/25.6 500 #9c9c9d 75c 2L. Gap 32 to the tabs. **Tab strip**: 1000 wide, horizontally scrollable (`hide-scrollbars`), row `pad 0 24`, gap 32. **12 tabs**, each 48 tall (icon about 26px above label 14px/22.4 500 .2px; labels 3–17c). Active #fff, others #9c9c9d, `transition color .3s`. Click to select. **Table panel**: max 910, `bg-top-sheen`, `inset 0 1px rgba(255,255,255,.1)`. Table 630 wide, `pad-top 24`. 4 columns (248 / 146 / 146 / rest). Header row 23 tall: Geist Mono 12px/19.2 500 #6a6b6c. **13 body rows** of 37px (39 step): first cell 14px/22.4 500 #9c9c9d, others are icon or blank. Footnote below: Geist Mono 12px/19.2 #6a6b6c, 28c. Section 902 tall; same height at 390 (table scrolls). |
| `LogoStrip` | /teams y 1063 | p 16px/24 500 ls -.05px white/.6 (19c) centered, gap 24, then a `ul` row gap 24 of **6 logos** 93–163 wide x 25–33 tall at opacity .6 (`opacity .2s`, presumably 1 on hover). 390: wraps to 3 rows (192 tall). Use neutral wordmark placeholders. |
| `TeamsOrbit` | /teams hero art | Behind the hero: concentric SVG rings 759 / 599 px (gradient strokes). **28 animated nodes**: wrappers 302–382 wide with `--rotation` 25–335deg, `orbitL`/`orbitR` **180s linear infinite**. Each wrapper carries a 21–28px round icon that counter-rotates (`translateY(-50%) translateX(50%) rotate(-var(--rotation))`, same 180s) so it stays upright. Box 1140x1208 at 1440, 274x664 at 390. |
| `TeamsSlideshow` | /teams y 2040–2911 | Frame 1140x640: `slideshow` gradient, 1px card-border, radius 12, `shadow-inset-top`, overflow hidden. Track of 3 slides (1138 wide), moved by `margin-left` with `transition .3s ease-out`. **Autoplay every about 6.05s** (changes measured at 2.5s, 8.6s, 14.6s). Below: grid of 3 selector cards 364x207 (gap 24), `pad 32`, column gap 16, holding a 25px icon, a title 16px/24 500 white (11–14c) and a body 14px/20 500 #9c9c9d (97–119c 3L). The active card has `bg #0c0d0f` + 1px card-border, radius 12, `shadow-inset-top`. Inactive cards are transparent with a transparent border, `background-color .2s`. Click selects. Slide art: original UI placeholders. |
| `ProUpsell` | /teams y 4095–5680 | `pad-top 248`. h3 52px/57.2 600 white, 2L, 20c, where one 3c word is in `pro.glyph #ffe2e2` (390: 32px/35.2). p 20px/28 400 .3px white/.6, max 800, 111c 2L. Pill link 132x30 (`pad 6 12`, radius 16, `pill-pink`, 1px white/.15). Visual: 1076x503 image (natural 1920x895, 1px white/.1, radius 12, `shadow-inset-top`) with a 538x562 overlay image (natural 640x668) and a 441x465 `blur(12px)` radius-12 glass behind it. Then a 3-col grid (337, gap 32) of cards 337x348: `pad 16`, `bg-card`, radius 16, `shadow-inset-top`, image 305x159 (natural 384x200), h4 18px/27 600 white (17c), p. BlockCta link 23c below (y 5663). |
| `TeamsPlanPair` | /teams y 5936–7528 | `CenteredLead` (17c / 47c) + **IntervalToggle (large)**: 240x51, labels `pad 16 32` 16px/18.4 500, pill 111x42 radius 36, `transition transform .3s`, track radius 16 (`bg-card`, card-border). Two cards in a row (gap 0): left 313x529 (`pad 40`, `bg #111214`, 1px white/.1, radius 15 0 0 15, `inset 0 0 2px 2px rgba(0,0,0,.25)`, 4 list rows, body 15px/22 500 #9c9c9d). Right 342x695 is raised (`pad 48`, max 356, same colors, radius 12, 6 list rows). Then EnterprisePlanCard (1124x433, `bg #111214` instead of the gradient, same inset shadow) and a BlockCta (39c). 390: cards stack (1264 tall). *Lean option: substitute `PricingSection` if pixel parity is not required.* |
| `TemplateGrid` | /teams y 7616–8328 | CenteredLead (39c / 107c). Grid 3 x 337, gap 64. Cards `pad 32`, column gap 16: visual 273x160, title 16px/24 500 white centered (13–26c), p 14px/20 500 white/.6 centered (92–127c, 3–4L). Below: a centered button 224x32 (`pad 8 16`, `bg white/.9`, radius 6, 14px/16 500 .2px black, 24c, 14px icon, `transform .1s ease-in-out`). |
| `SerifHero` | /windows y 0–1034 | Section `pad 325 16 176` (390: `150 16 100`, 615 tall). **Title**: 4 stacked copies of the same 11c line in Instrument Serif 168px/168 400 ls -2px (390: 86px). Colors #fff, white/.8, white/.6, white/.4. Each is masked to a horizontal band: `linear-gradient(#000 0 64%, transparent 80%)`, then `transparent 0 64%, #000 72%, transparent 80%`, then `transparent 0 70%, #000 80%, transparent 96%`, then `transparent 0 80%, #000 96%`. This gives a "venetian" fade at the bottom of the glyphs. **Mock launcher window** 706x475 overlapping from y 471 (`linear-gradient(137deg, rgba(17,18,20,.88) 24.87%, #1d1d1d 95%)`, 1px window-border, 56px header row, a caret that blinks via `blink`, 50% opacity step), clipped to a 214px reveal. **Video button**: a 536x404 thumbnail (radius 16, `shadow 0 0 250px rgba(255,255,255,.2)`) sits behind/above the title, absolutely positioned and shifted -268px (`translateX(-50%)`). It has a 52x55 play glyph at opacity .9, and both fade `opacity .2s` on hover. p 18px/28.8 400 .2px #9c9c9d, max 420, 72c 2L. Then DownloadBlock windows. **Motion**: window, p and actions run `fadeInUp 1s ease` on load. |
| `HotkeysBanner` | /windows y 3324 | 1204x189 card: `pad 32`, row gap 16, `bg-card`, card-border, radius 12, `shadow-inset-top`. Left max 500: h3 20px (20c 2L) + Badge sm. Right 622x106: a row of key caps (reuse `Key` at a smaller size, gap 10). |
| `AiShowcaseFrame` | /windows y 3513–4508 | Section `pad-top 280`, gap 120. Head: Badge-style label 66x22 (14px/22.4) + h2 20px centered (25c 2L), max 456. Frame 1204x493: `pad 8`, `bg rgba(0,0,0,.44)`, 1px white/.08, radius 16, `shadow 0 .5px rgba(255,255,255,.3) inset`. Inner `bg #07080a`, 1px white/.08, radius 12, with a cover image at opacity .8 (natural 891x357). A centered chat window 750x475 floats over it (layered `rgba(0,0,0,.4)` + gray gradient, 64px header). The section's own glow pads the frame down 240px. 390: 566 tall. |
| `QuoteStrip` | /windows y 4508–5002 | `pad 158 16 100`. Quote p 16px/28 500 white/.6 centered, max 680 (about 141–164c, 2L). Then a horizontal track (1408 visible, overflow) of **about 20 person chips** (row gap 56). Each chip: 48px avatar circle with a 1px #1b1c1e border, name (18px row), title 14px/22.4 500 #6a6b6c (7–21c), gap 24. Chips are at opacity .2, the active one at 1 (`opacity .6s ease`). Click selects. No autoplay in 6s. Track is centered on the active chip. |
| `GameLauncherMarquee` | /windows | 2 rows of 56x56 tiles (`pad 8`, `bg-card`, card-border, 38px icon radius 8; natural 48x48), gap 8, row gap 8. Row 1 runs `marqueeL 120s linear infinite`, row 2 `marqueeR`, each over 512px (8 tiles). Fade the edges with a mask. |
| `ComingSoonGrid` | /windows y 6597–7537 | CenteredLead (31c + 67c, 3L, max 438), gap 48. Grid 3 x 385, gap 24, **grid opacity .8**. Columns 1 and 3 hold two stacked 385x234 cards each (gap 24); column 2 holds one 385x492 card. Cards: `bg-card`, card-border, radius 12, `shadow-inset-top`. Visual `pad 24 24 0`. Footer `pad 24` with an h3 14px/21 500 .2px white centered (7–24c, 2L). 390: one column, 1554 tall. |
| `StoreToolbar` | /store y 1636 | Row `pad 16 0`, space-between. Left: tab pill track 421x56 (`pad 6`, gap 12, `bg-card`, card-border, radius 100, `shadow-inset-top`) with 3 tabs (`pad 12`, 15px/17.25 400; active #fff on `bg-cat-active` with 1px white/.1, radius 100; inactive #9c9c9d). Then a segmented control 126x44 (`pad 6`, `bg #0c0d0f`, 1px #2f3031, radius 12) with 3 options (`pad 6 10`, radius 6; active `bg #1b1c1e`; `color/background .15s`). Right: a search button 320x43 (as in the store hero, `pad 12`) with 2 keycaps. |
| `FeaturedExtensionCard` | /store y 1145 | Grid 3 x 359, gap 32. Card 359x364: `pad 32`, centered column, 1px card-border, radius 10, `inset 0 1px rgba(255,255,255,.05)`, `background-color .15s ease-in-out` on hover. Icon well 96x96 (`bg #07080a`, 2px transparent border, radius 20) with an inner 92x92 tinted `radial-gradient(circle at 50% 0, rgba(0,179,255,.15), transparent)` over `rgba(0,179,255,.1)` (tint varies per card) and a 64px icon. Title 20px (14c) + p 15px/17.25 400 #6a6b6c centered (32–112c, 1–2L). Meta slot 141x84 below with an author row (20px avatar + 13px #9c9c9d, 17c). Section heads above: h2 40px/46 500 centered (7c) + p 20px/23 400 white/.4 (52c), then h3 20px/23 500 left (8c) + p 15px/17.25 white/.4 (32c). 390: h2 32px/36.8. |
| `StoreExtensionCard` + `Pagination` | /store y 1837–2963 | Grid 2 x 558, gap 24. **10 cards** of 558x186 per page. Card: `pad 32`, 1px card-border, radius 12, `inset 0 1px rgba(255,255,255,.05)`, `bg .15s`. Header row: 32px icon + title 16px/18.4 600 white (12c). p 15px/17.25 400 #9c9c9d (49c 2L). Footer row gap 16: 20px avatar + author 13px/14.95 500 #9c9c9d, a 20px glyph, an install count 13px 400 #9c9c9d. Top-right DarkButton 57x32 (`pad 8`). **Pagination** row gap 8, centered: 36x36 buttons (radius 8, 1px card-border, `inset 0 1px rgba(255,255,255,.05)`, 15px; active `bg #1b1c1e`, others `bg #0c0d0f`), a 64px ellipsis cell, last-page button, next arrow. |
| `AiChipTabs` | /core-features/ai y 513–1321 | Stage 1020x800 (`riseIn .7s ease-out .45s backwards`), radius 25, with a 1420x1000 background glow layer and an inner `pad 100 0` grid. Chip list overlaps the stage bottom (y 1253): `ul` wrap, gap 8/10, **10 chips**, 30 tall. Each chip: `pad 1 10 1 6`, radius 10, gap 8, 16px icon, 14px/20 400; inactive white/.35, active white/.9 on `bg rgba(255,255,255,.07)`; `shadow inset 0 0 0 .5px rgba(255,255,255,.1), inset 0 0 10px rgba(255,255,255,.024)`; `color/bg/border .15s`. Click swaps the stage content. 390: stage 350x226, chips wrap to 182 tall. |
| `ByokRow` | /core-features/ai y 2225 | Row gap 24: 4 tiles 50x50 (gap 10, `linear-gradient(135deg, rgba(255,255,255,.016), rgba(255,255,255,.024))`, 1px white/.08, radius 11) + text (h3 16px/24 500 white 37c; p 14px/22 400 white/.5 81c). 390: column, 140 tall. |

---

## 4. Per-page composition

Notation: `REUSE X (props)` means an existing component; `NEW X` points to sections 2 and 3. Section tops are given as y-top at 1440 / y-top at 390, with height at 1440.

### /store (H 4330 / 6865)
1. REUSE `Navbar`.
2. NEW `PageHero variant=store`, y 558 / 345.
3. NEW `FeaturedExtensionCard` block (headings + 3-grid), y 947 / 713.
4. NEW `StoreToolbar`, y 1636.
5. NEW `StoreExtensionCard` grid + `Pagination`, y 1756–2963.
6. REUSE `Footer`, y 3091 / 4666.
- Totals: reuse 2, new 4.
- Motion: hero `bgEnter 2s` / `fgEnter 1.5s` on load only. Card bg hover .15s. Nothing scroll-triggered.

### /pro (H 10665 / 14522)
Body content starts at y 24 (75 at 390). The offset's source wasn't identified; treat it as top padding.
1. REUSE `Navbar`.
2. NEW `PageHero variant=sheen`, y 24 / 75, 547 tall.
3. REUSE `AiBento` (header 8c / 31c / 63c; 1 wide + 2 cards; ArrowLink 27c), y 751 / 803, 1389 tall. Identical geometry to the homepage AI section.
4. NEW `ModelTabs` in the 1252 shell, y 2320 / 2350, 1238 tall.
5. REUSE `SectionTitle size=24` (28c / 39c) + the ComparePlans action (LightButton + mono caption from PageHero), then NEW `SplitFeature` (translator), NEW `MediaCard variant=pro` x4, NEW `SplitFeature` (themes). Shell y 3558 / 3588, 2471 tall.
6. NEW `PricingSection`, y 6030 / 7202, 2166 tall.
7. NEW `FaqAccordion` (size=48, 6 items), y 8196 / 10973, 1230 tall.
8. REUSE `Footer`, y 9426 / 12323.
- Totals: reuse 4 (Navbar, AiBento, SectionTitle, Footer), new 6 instances of 5 components.

### /pricing (H 7609 / 9496)
1. REUSE `Navbar`.
2. Top art: a 1064x385 image at y 0 behind the toggle (natural 1080x391; 600x217 at 390). Plain absolute `<img>` placeholder (soft glow), no animation.
3. NEW `PricingSection` (1110 wide, pad-top 156), y 156 / 138, 1907 tall.
4. NEW `PricingTable`, y 2287 / 3631, 2652 tall.
5. NEW `FaqAccordion` (10 items), y 5163 / 5933, 1142 tall.
6. REUSE `Footer`, y 6369 / 7297.
- Totals: reuse 2, new 3 (+1 decorative image).

### /teams (H 10971 / 12549)
Everything sits in a 1204 container with `pad 0 32` (content 1140; 390: `pad 0 24`).
1. REUSE `Navbar`.
2. NEW `PageHero variant=teams` + NEW `TeamsOrbit`, y -72 / -72, 1208 / 830 tall.
3. NEW `LogoStrip`, y 1063 / 758.
4. NEW `CenteredLead`, y 1256.
5. NEW `SplitFeature` (teams #1), y 1632.
6. NEW `TeamsSlideshow`, y 2040.
7. NEW `SplitFeature` x2 (teams #2, #3), y 3191 and 3663.
8. NEW `ProUpsell`, y 4095–5680.
9. NEW `TeamsPlanPair` (or substitute `PricingSection`), y 5936–7528.
10. NEW `CenteredLead` + `TemplateGrid`, y 7616–8328.
11. NEW `DownloadBlock variant=mac`, y 8584 / 9231.
12. REUSE `Community` → `SocialCards` (title 17c / 74c; 2 cards 454x168, gap 56/40, `pad 120 0`), y 9196 / 9604.
13. REUSE `Footer`, y 9732 / 10351.
- Totals: reuse 3, new 10 component types (12 section instances).
- Motion: orbit 180s linear, slideshow 6s autoplay with .3s ease-out, logo opacity .2s. No scroll reveals.

### /core-features/ai (H 10962 / 13024)
All upper sections use the AiBento shell: max 1060, `pad 0 20`, sections separated by 180px (80 at 390).
1. REUSE `Navbar`.
2. NEW `PageHero variant=plain`, y 180 / 80.
3. NEW `AiChipTabs`, y 513 / 320.
4. REUSE `AiCard` x4 in the AiBento grid (`495 495`, gap 30; heights 303/421 left, 413/311 right, i.e. masonry by content; titles 8–16c, desc 84–124c 2L) + NEW `ByokRow`, y 1421–2275.
5. REUSE `AiHeader` (eyebrow 8c, h2 31c, desc 92c) + one wide AiCard visual 1020x675 (radius 25), y 2455 / 2413, 931 tall.
6. NEW `SplitFeature` A / B / C, y 3566, 4215, 4999 (390: 2984, 3632, 4682).
7. REUSE `AiHeader` (7c / 18c / 79c) + `AiCard` x4 (2x2: 495x166, 495x121) + `ArrowLink` (46c), y 5579 / 5317, 644 tall.
8. NEW `PricingSection` with `SectionTitle size=32`, y 6403 / 6187, 2293 tall.
9. NEW `FaqAccordion` (5 items), y 8696 / 9880.
10. REUSE `Footer`, y 9723 / 10825.
- Totals: reuse 5 (Navbar, AiBento parts x3 sections, Footer), new 5.
- Motion: hero `blurIn .5s ease-out`, stage `riseIn .7s ease-out .45s`, chip transitions .15s. Card visuals follow the existing AiBento reveal (`data-reveal="ai-card"`).

### /windows (H 10220 / 10284)
`<main>` holds `<section>`s with 158px top padding at 1440 (50–100 at 390).
1. REUSE `Navbar`.
2. NEW `SerifHero` (includes `DownloadBlock variant=windows`), y 0, 1034 / 615.
3. NEW `CenteredLead` (30c) + `MediaCard variant=windows` x8 + `HotkeysBanner`, y 1034–3513 / 615–2986.
4. NEW `AiShowcaseFrame`, y 3513 / 2986.
5. NEW `QuoteStrip`, y 4508 / 3552.
6. NEW `SplitFeature` + `GameLauncherMarquee`, y 5002 / 3968.
7. REUSE `ExtensionsCarousel` → `ExtensionReel` (no categories, no pager; centered two-tone 20px/28 title "12c + 13c"; 12 cards + browse-more; ArrowLink 21c below; section `pad 158 0`). y 5566 / 4381, 1031 tall. Same card size, gap 56, `slideIn .7s cubic-bezier(.215,.61,.355,1)`.
8. NEW `ComingSoonGrid`, y 6597 / 5115.
9. Final CTA: NEW `CenteredLead` (38c + 34c, max 436) + `DownloadBlock variant=windows`. Section `pad 104 16 224`, gap 80, y 7537 / 6769, 543 tall. (Not the homepage `FinalCta`: no keyboard art.)
10. NEW `FaqAccordion` (heading 18px, 5 items), section `pad 96 16 32`, y 8080 / 7044.
11. REUSE `Footer art="windows"`, y 8860 / 7869.
- Totals: reuse 3, new 9 component types.
- Motion: hero `fadeInUp 1s ease`, caret `blink`, hover video on cards, marquee 120s, quote chip opacity .6s, reel slideIn.

### /ios (H 11110 / 11711)
Sections use a 1067 shell (content 1019) with `pad 168 24` (390: `96 16`) and gap 64 between heading and content.
1. REUSE `Navbar`.
2. NEW `PageHero variant=sheen` (ios), y 0, 873 / 571.
3. REUSE `SectionTitle size=32 eyebrow` (4c / 24c / 119c) + a phone composite visual: 395x854 phone (natural 640x1384) over a 1209x415 band image (natural 1920x659). y 873 / 571, 1422 tall.
4. NEW `SplitFeature` (ios A: models glass), y 2295 / 1391, 700 tall.
5. REUSE `SectionTitle` (none; bento only) + NEW `MediaCard variant=ios` Bento A, y 2995 / 2091, 1565 tall.
6. REUSE `SectionTitle size=32 eyebrow` (13c / 40c / 89c with an inline link) + full-bleed image 1440x828 (natural 1920x1104), y 4560 / 4424, 1476 tall.
7. NEW `SplitFeature` (ios B: keyboard glass), y 6036 / 5379, 700 tall.
8. REUSE `SectionTitle size=32` (26c / 88c) + NEW `MediaCard variant=ios` Bento B, y 6736 / 6079, 1536 tall.
9. NEW `DownloadBlock variant=ios` (+ fixed QR card), y 8272 / 8318, 675 tall.
10. NEW `FaqAccordion` (4 items), y 8947 / 8717.
11. REUSE `Footer`, y 9871 / 9512.
- Totals: reuse 5 (Navbar, SectionTitle x3, Footer), new 4 component types.
- Motion: glass panels transition `opacity 1.5s, transform 1s cubic-bezier(.05,.9,.1,1)` as they settle into the isometric matrix (the trigger is assumed scroll-in; only the end state was captured). Whisper bars `wave*` keyframes and action-button `shapemove`/`textmove` loops are decorative visual-internal loops (durations not read). Link underline .1s ease-out.

---

## 5. New components to build (deduplicated)

**Shared (used on 2 or more pages)**
1. `PageHero` (variants: sheen, plain, store, teams). Pages: /pro, /ios, /core-features/ai, /store, /teams.
2. `PricingSection`, containing `IntervalToggle`, `PlanCard`, `TierSwitch`, `EnterprisePlanCard` and `BlockCta`. Pages: /pricing, /pro, /core-features/ai (EnterprisePlanCard and IntervalToggle-lg also on /teams).
3. `FaqAccordion`. Pages: /pricing, /pro, /core-features/ai, /windows, /ios.
4. `MediaCard` (variants: pro, windows, ios). Pages: /pro, /windows, /ios.
5. `SplitFeature`. Pages: /pro, /teams, /ios, /core-features/ai, /windows.
6. `DownloadBlock` (variants: mac, windows, ios). Pages: /teams, /windows, /ios.
7. `CenteredLead`. Pages: /teams, /windows.

**Single page**

| Page | Components |
|---|---|
| /pricing | `PricingTable` |
| /pro | `ModelTabs`, `DotGrid` (inside MediaCard) |
| /teams | `LogoStrip`, `TeamsOrbit`, `TeamsSlideshow`, `ProUpsell`, `TeamsPlanPair`, `TemplateGrid` |
| /core-features/ai | `AiChipTabs`, `ByokRow` |
| /windows | `SerifHero`, `HotkeysBanner`, `AiShowcaseFrame`, `QuoteStrip`, `GameLauncherMarquee`, `ComingSoonGrid` |
| /store | `StoreToolbar`, `FeaturedExtensionCard`, `StoreExtensionCard`, `Pagination` |

**Refactors** (section 1): `SectionTitle` (size/eyebrow/body), `AiBento` (export AiHeader/AiCard), `ExtensionsCarousel` (export ExtensionReel), `Community` (export SocialCards), `Footer` (art prop), `Navbar` (hrefs), `LightButton`/`DarkButton` (lg/block), `Badge` (sm).

---

## 6. Routing notes
- There is no router today: `src/App.jsx` renders the homepage directly and `react-router` is not installed.
- Minimal approach (no new dependency): move the homepage body into `pages/Home.jsx` and add `pages/{Store,Pro,Pricing,Teams,Ai,Windows,Ios}.jsx`. In `App.jsx`, pick the page with a `switch (window.location.pathname)`, wrapped by the shared `<Navbar/>` and `<Footer art=…/>`. Vite's dev and preview servers already serve `index.html` for unknown paths, so deep links work. Static hosting needs an SPA fallback rewrite.
- Paths to support: `/store`, `/pro`, `/pricing`, `/teams`, `/core-features/ai`, `/windows`, `/ios`. Scroll to the top on navigation.
- /windows needs the Instrument Serif font loaded (Google Fonts, 400). Load it only on that page if you want, but adding it to `index.html` is simpler.

## 7. Not measured / caveats
- Images and videos are proprietary: geometry only, use original placeholders. App icons in MediaCards/GameLauncher/Store come from a CDN (32/48/64px PNG/WebP), and Store avatars are 20px circles.
- The /pro body offset (24px; 75 at 390) has no identified source.
- The /pro top hairline on the FAQ list reads as `1px solid` with a border-image whose source wasn't read; use `faq-line`.
- `ModelTabs` click handling didn't change label colors in headless; the selection behavior is inferred from the `.active` class and `color .3s`.
- The /ios glass panels' scroll trigger and the decorative loop durations inside visuals were not read. The teams logo hover opacity target is assumed to be 1.
- Hover states for Store cards are a background-color transition (.15s); the resulting color didn't change in headless, so it is probably a pseudo-element or a subtle tint. Use `rgba(255,255,255,.02)`.
