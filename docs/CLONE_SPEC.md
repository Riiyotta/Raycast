Source: https://www.raycast.com/

# CLONE_SPEC — Raycast homepage (design + motion study)

Target: React 18 + Vite + Tailwind v3 (dev: http://127.0.0.1:5174/).
Measured on 2026-10-16 with headless Chromium (Playwright 1.64) at 1440x900, 1280x800 and 390x844 (mobile, DPR 3). All values come from `getComputedStyle`, `getBoundingClientRect`, the live stylesheets (CSS Modules, flattened with their media queries), and the inline RSC config. Y positions are document-absolute at 1440 unless noted.

**Content policy.** Text is described by role, character count (c), word count (w) and line count at 1440 (L). Write your own placeholder copy of about the same length. Raycast's logo, product screenshots, illustrations, avatars, extension art and YouTube thumbnails must NOT be reused. Each asset is listed with its geometry and treatment so you can drop in an original placeholder of the same size.

Page height: 15983px at 1440 and 1280, 15948px at 390.

---

## 0. Global design tokens

### 0.1 Colors (`:root` custom properties, exact values)

| Token | Value | Use |
|---|---|---|
| `--background` / `--grey-900` / `--color-bg` | `#07080a` | page bg (body `background`) |
| `--grey-800` | `#0c0d0f` | hover bg of API grid cells, code bg |
| `--grey-700` | `#111214` | "browse more" card bg |
| `--grey-600` | `#1b1c1e` | dividers, footer top border, grid lines |
| `--grey-500` | `#2f3031` | button-light text, dock item border |
| `--grey-400` | `#434345` | "faint" text (inactive wall text, usernames) |
| `--grey-300` | `#6a6b6c` | "muted" text (section subtitles) |
| `--grey-200` | `#9c9c9d` | "default" text (nav links, body copy) |
| `--grey-100` | `#cdcece` | button active bg |
| `--grey-50` | `#e6e6e6` | light button bg |
| `--Base-White` | `#fff` | "loud" text (headings) |
| `--color-fg` | `#f4f4f6` | |
| `--color-fg-200 / 300 / 400` | `#c2c7ca / #78787c / #5e6366` | |
| `--color-bg-100/200/300/400` | `#101111 / #18191a / #313133 / #494b4d` | |
| `--color-border` | `#242728` | |
| `--Card-Border` (fallback) | `#ffffff0f` (rgba 255,255,255,0.06) | 1px card borders everywhere |
| `--Card-BG` (fallback) | `linear-gradient(137deg, #111214 4.87%, #0c0d0f 75.88%)` | card fill |
| Glass card bg | `linear-gradient(137deg, rgba(17,18,20,.75) 4.87%, rgba(12,13,15,.9) 75.88%)` | navbar, social cards |
| `--red-dark` / brand red | `#ff6363` | eyebrow, snippet, code text |
| `--blue-dark` | `#56c2ff` | |
| `--color-yellow / red / blue / green` | `#ffc533 / #ff6161 / #57c1ff / #59d499` (each also has a `26` alpha variant) | |
| Accent periwinkle glow | `rgba(154,170,255,0.05–0.65)` | hover glows, active wall text-shadow |
| Announcement pink | `#eca5a7`, `#452324`, `#833637`, `#130d0e` | hero pill |

Body text color is `#fff`. Color scheme: dark.

### 0.2 Spacing scale (`--spacing-*`)
0.5=4, 1=8, 1.5=12, 2=16, 2.5=20, 3=24, 4=32, 5=40, 6=48, 7=56, 8=64, 9=80, 10=96, 11=112, **12=168**, **13=224** (px).

### 0.3 Radii (`--rounding-*`)
xs 4, sm 6, normal 8, md 12, lg 16, xl 20, xxl 24 (px). Other measured radii: frame 19px, AI bento cards 30px, ext categories pill 31px, active category pill 36px, pagination buttons 86px, announcement 43px/1000px, keyboard keys 11px.

### 0.4 Containers
`--container-xs-width` 746px · `--container-sm-width` **1064px** (testimonial, footer) · `--container-width` **1204px** (nav, main sections) · `--container-lg-width` 1280px · AI section 1060px (with 20px side padding, so 1020px content) · `--grid-gap` 32px · `--navbar-height` 76px · navbar top padding 16px.

### 0.5 Section wrapper (`.sectionContainer`)
`max-width:100vw; padding:168px 24px` (below 720) → `224px 24px` (720 and up); `position:relative; overflow-x:hidden`. Used by: Shortcut frame, Testimonials, Automation, Feature wall, API grid.

### 0.6 Breakpoints in use
420 (h1 48px) · **720** (main mobile/desktop switch) · 767/768 (AI section, `max-width:767`) · 784 (API grid 2 columns) · **880** (desktop nav) · 920 · 1024 (`max-width`, extensions header stacks) · **1064** (full nav: logo wordmark + Log in + Download) · 1200 (API grid 3 columns) · 1204 (frame radius).
Suggested Tailwind `screens`: `{xs:'420px', sm:'720px', md:'768px', api2:'784px', nav:'880px', lg:'1064px', api3:'1200px', xl:'1204px'}`.

### 0.7 Easing and duration tokens
- `--spring-1`: `linear(0 0%, .005927 1%, .022466 2%, .047872 3%, .080554 4%, .119068 5%, .162116 6%, .208536 7%, .2573 8%, .3075 9%, .358346 10%, .409157 11%, .45935 12%, .508438 13%, .556014 14%, .601751 15%, .645389 16%, .686733 17%, .72564 18%, .762019 19%, .795818 20%, .827026 21%, .855662 22%, .881772 23%, .905423 24%, .926704 25%, .945714 26%, .962568 27%, .977386 28%, .990295 29%, 1.00143 30%, 1.01091 31%, 1.01888 32%, 1.02547 33%, 1.03079 34%, 1.03498 35%, 1.03816 36%, 1.04042 37%, 1.04189 38%, 1.04266 39%, 1.04283 40%, 1.04247 41%, 1.04168 42%, 1.04052 43%, 1.03907 44%, 1.03737 45%, 1.03549 46%, 1.03348 47%, 1.03138 48%, 1.02922 49%, 1.02704 50%, 1.02486 51%, 1.02272 52%, 1.02063 53%, 1.01861 54%, 1.01667 55%, 1.01482 56%, 1.01307 57%, 1.01142 58%, 1.00989 59%, 1.00846 60%, 1.00715 61%, 1.00594 62%, 1.00485 63%, 1.00386 64%, 1.00296 65%, 1.00217 66%, 1.00147 67%, 1.00085 68%, 1.00031 69%, .999849 70%, .999457 71%, .999128 72%, .998858 73%, .99864 74%, .99847 75%, .998342 76%, .998253 77%, .998196 78%, .998169 79%, .998167 80%, .998186 81%, .998224 82%, .998276 83%, .998341 84%, .998415 85%, .998497 86%, .998584 87%, .998675 88%, .998768 89%, .998861 90%, .998954 91%, .999045 92%, .999134 93%, .99922 94%, .999303 95%, .999381 96%, .999455 97%, .999525 98%, .999589 99%, .99965 100%)` (defined but not seen running on the homepage).
- Keyboard keys: `cubic-bezier(0.23, 1, 0.32, 1)` (easeOutQuint).
- Extension cards slide in: `cubic-bezier(.215, .61, .355, 1)` (easeOutCubic).
- Feature-wall image enter: `cubic-bezier(0.4, 0, 0.22, 0.96)`.
- Generic: `0.2s ease-in-out` for links/buttons, `0.3s` for color/transform micro-interactions.

### 0.8 Fonts (all open-licensed, so load from Google Fonts / Fontsource)

| Role | Family on site | License | Load as |
|---|---|---|---|
| Main UI / all headings | **Inter** variable 100–900 | OFL | Google Fonts `Inter:wght@400;500;600` |
| Mono captions (`--font-geist-mono`) | **Geist Mono** variable 100–900 | OFL | Google Fonts `Geist Mono:wght@300;400;500` |
| Eyebrow / tags (`--monospace-font`) | **JetBrains Mono** variable 100–800 | OFL | Google Fonts `JetBrains Mono:wght@500` |
| Keyboard key legends | `"SF Pro Text","SF Pro Icons", Inter` | SF is proprietary | use **Inter** 500 (SF only renders on Apple devices anyway) |
| Mock macOS menubar | `"SF Pro"` 700 13px | proprietary | Inter 600 13px |
| Instrument Serif, VT323 | declared but `unloaded` on the homepage | OFL | not needed |

- Body `font-feature-settings: "liga","calt","kern","ss03"`, `-webkit-font-smoothing: antialiased`.
- The h1 adds `font-feature-settings: "ss08","ss02","liga" 0`.
- Fallback stack: `"Inter", "Inter Fallback", sans-serif`. Inter Fallback = `local("Arial")` with ascent 90.44%, descent 22.52%, size-adjust 107.12%.
- Geist Mono fallback: `ui-monospace, SFMono-Regular, Roboto Mono, Menlo, Monaco, Liberation Mono, DejaVu Sans Mono, Courier New, monospace`.

### 0.9 Type scale (computed at 1440)

| Role | Family | Size / LH | Weight | Tracking | Color |
|---|---|---|---|---|---|
| Hero h1 | Inter | 64px / 110% (70.4px); 48px from 420; 36px base | 600 | normal | #fff, text-shadow `rgba(0,0,0,.15) 0 4px 4px` |
| Hero sub p | Inter | 18px / normal (14px below 720) | 400 | 0.2px | #fff, text-shadow `rgba(0,0,0,.25) 0 4px 4px`, `text-wrap:balance` |
| Section title h2 (SectionTitle) | Inter | 20px / normal (18px / 160% below 720) | 500 | 0.2px | #fff |
| Section title p (2nd line) | Inter | 20px / normal | 500 | 0.2px | #6a6b6c |
| AI title h2 | Inter | 32px / 1.2 | 500 | -0.025em (-0.8px) | #fff, balance |
| AI description | Inter | 18px / 1.5 (15px at ≤767) | 400 | 0.01em | rgba(255,255,255,.5), `mix-blend-mode: plus-lighter` |
| Eyebrow | JetBrains Mono | 12px / 16px, uppercase | 500 | 0.12em (1.44px) | #ff6363 |
| Nav link | Inter | 14px / normal | 500 | 0.2px | #9c9c9d → #fff on hover |
| Button | Inter | 14px / 16px | 500 | 0.2px | #2f3031 on #e6e6e6 |
| Mono small (requirements, sub-links) | Geist Mono | 12px / 160% | 400 | 0.2px | #fff at opacity .4 + plus-lighter / #9c9c9d |
| Body 16 | Inter | 16px / 160% | 500 | 0.2px | #6a6b6c (highlight span #fff) |
| Body 14 | Inter | 14px / 160% | 500 | 0.2px | #9c9c9d |
| Arrow link | Inter | 16px / 140% | 500 | 0.3px | #9c9c9d → #fff |
| Feature wall text | Inter | 24px / 160% | 500 | 0.2px | #434345; active #fff |
| Testimonial quote | Inter | 20px / 160% | 500 | — | #6a6b6c, highlight span #fff |
| API h3 | Inter | 56px / 117.18% (32px below 784) | 400 | 0.2px | #fff |
| API h4 | Inter | 24px / 160% | 500 | 0.2px | #fff |
| API p | Geist Mono | 14px / 160% | 500 | 0.3px | #6a6b6c |
| API caption "FIG_0n" | Geist Mono | 10px, uppercase, `ss09` | 300 | 0.5px | #6a6b6c on #08090c |
| Footer group head | Inter | 14px / 160% | 500 | 0.2px | #fff |
| Footer link | Inter | 14px / normal | 500 | 0.2px | #9c9c9d → #fff |
| Legal small | Inter | 12px / 18px | 400 | 0.4px | rgba(255,255,255,.4) |

### 0.10 Shared components

**Button / light** (Download):
- Base: `display:inline-flex; gap:8px; min-height:36px; padding:8px 12px; border-radius:8px; font 14/16 500; letter-spacing:.2px; color:#2f3031; background:#e6e6e6`.
- Shadow: `0 0 0 2px rgba(0,0,0,.5), 0 0 14px rgba(255,255,255,.19), inset 0 -1px .4px rgba(0,0,0,.2), inset 0 1px .4px #fff`.
- Hover: bg `#fff`. Active: bg `#cdcece`. Focus: adds `0 0 0 2px #f4f4f4`.
- Transition: `background-color .2s, box-shadow .2s ease-in-out, transform .1s ease-in-out`.
- Icon slot 16x16 (use a generic download/apple-style glyph placeholder). Measured size 117x36 ("Download") and 173x36 ("Download for Mac").

**Button / dark**: `color:#fff; background:linear-gradient(rgba(255,255,255,.03), rgba(255,255,255,.1)); box-shadow: inset 0 1px rgba(255,255,255,.05), 0 0 0 1px rgba(255,255,255,.25), inset 0 -1px rgba(0,0,0,.2)`. On hover the ring becomes `.5` alpha.

**ArrowLink**:
- `inline-flex; gap:3px; 16px/140% 500; letter-spacing:.3px; color:#9c9c9d; transition: color .3s`.
- 16px arrow svg with `transition: transform .3s`.
- Hover: color `#fff`, svg `translateX(2px)` (or `translate(2px,-2px)` for the north-east variant).

**SectionTitle**: two stacked lines (h2 white + p grey), centered or left aligned, `scroll-margin-top: 108px`.

---

## 1. Navbar (fixed)

- **Container**: `position:fixed; top:0; left:50%; translateX(-50%); width:100%; z-index:2; padding:16px 16px 0; display:flex; justify-content:center`. Box is 1440x92.
- **Bar**: `max-width:1204px; height:76px; padding:16px 32px` (16px below 880); `border:1px solid rgba(255,255,255,.06); border-radius:16px`.
  - Background: `linear-gradient(137deg, rgba(17,18,20,.75) 4.87%, rgba(12,13,15,.9) 75.88%)`.
  - `backdrop-filter: blur(5px); box-shadow: inset 0 1px 1px rgba(255,255,255,.15)`.
  - `transition: height .3s, transform .3s`.
  - At 1440 the bar sits at x=118, y=16, 1204x76.
- **Logo** (left): absolutely positioned at `left:32px; top:50%`. Wordmark plus icon is 93x24.
  - The full wordmark shows at ≥1064. At 880–1063 only the icon shows. Below 880 the wordmark returns inside the mobile grid.
  - Hover: `scale(1.05)` over .2s.
  - Use an original 24px-tall placeholder mark (red-ish square glyph plus text).
- **Center links**: 9 links, `display:flex; gap:16px`, block 628x42 centered (x 406–1034). Each link is `padding:12px 8px; border-radius:6px; 14px 500 .2px #9c9c9d; transition .2s ease-in-out`; hover `#fff`. Word lengths of the labels: 5, 3, 2, 3, 7, 5, 10, 4, 7 chars.
- **Right**: absolutely positioned at `right:32px`, `gap:24px`. Contains a "Log in" nav link (6c) and a light Download button 117x36.
- **Below 880 (mobile)**:
  - Bar becomes `display:grid; grid-template-rows:24px auto; overflow:hidden; padding:16px`. Measured 358x58 at 390.
  - Hamburger is 24x16 with three 1px lines `rgba(255,255,255,.9)` at top 10% / 50% / 90%.
  - Open state: container gets `min-height:100vh; overflow-y:scroll`. The toggle rotates 180deg (.5s), line 1 → rotate(-45deg), line 2 → opacity 0, line 3 → rotate(45deg).
  - Menu: links stacked in a column (`gap:4px; padding:48px 0 32px`), then a `border-top:1px solid rgba(255,255,255,.1)` block holding Log in (`padding-top:32px`).
  - The bar height animates via its `height .3s` transition. Behind it the glass blur shows the hero.
  - The Download button is hidden on mobile.
- Nav never hides on scroll. It stays fixed with no scroll-state change.

---

## 2. Hero (y 0–967, then margin-bottom 224px; 96px below 720)

**Layout**
- `.hero`: flex column, centered, relative.
- `.heroText` (818px max): `padding: 370px 16px 212px` (260px / 137px below 720), `gap:32px`.

**Content blocks**
- **h1**: max-width 540px (440 below 720), centered, 28c / 4w / **2 lines**. Box 540x141 at y=370.
- **Sub p**: 108c / ~15w / **2 lines** at 1440 (786 wide, wraps via `text-wrap:balance`), y=543. At 390 it's 3 lines.
- **Download block** (`HeroDownloadInfo`, y=797, 281x98, centered column). **Hidden below 720.**
  1. Light button "Download for Mac", 173x36.
  2. Requirements line, 38c: Geist Mono 12px/160%, `#fff` at `opacity:.4` with `mix-blend-mode:plus-lighter`, `margin-top:16px`.
  3. Sub row, `margin-top:8px; gap:25px`, Geist Mono 12px `#9c9c9d`. Two text buttons of 20c and 11c, separated by a `::before` 1px x 10px `#9c9c9d` vertical rule placed 12px left of the second item. Hover `#fff` (.2s).
- **Announcement pill** (container `padding-top:40px`, 24px below 720). Pill is 204x32 at y=935.
  - Outer: `padding:1px; border-radius:43px; box-shadow:0 0 20px rgba(245,48,107,.1)`.
  - Outer background: `conic-gradient(from calc(var(--r2) - 80deg) at var(--x) 15px, transparent 0%, #eca5a7 20%, transparent 25%), #452324` (a moving highlight on the 1px border).
  - Inner: `height:30px; padding:4px 12px; border-radius:1000px; background:#130d0e; 14px 500 .2px; gap:8px`. Label is 20c, followed by a 16px `#9c9c9d` arrow.
  - Hover: outer `background-color:#833637; box-shadow:0 0 20px 3px rgba(245,49,108,.25)`, .2s.
  - Requires `@property --r2 {syntax:"<angle>"; inherits:false; initial-value:0deg}` and `@property --x {syntax:"<length>"; inherits:false; initial-value:0}`.
  - Keyframes, both `3s linear -0.64s infinite`:
    - `x`: 0% 20px → 32.8228% 206px → 50% 206px → 82.8228% 20px → 100% 20px.
    - `rotating2`: 0% 0deg → 32.8228% 0deg → 50% 180deg → 82.8228% 180deg → 100% 360deg.

**Background (`.heroBackground`)**
- `position:absolute; inset:0; max-width:1200px; margin:0 auto; z-index:-1; background:#07080a`. Box at x=120, 1200x967.
- `::after` vignette:
  - `linear-gradient(to bottom, #07080a20 0%, #07080a20 90%, #07080a 100%)`
  - `linear-gradient(to left, #07080a00, #07080a)` at left, sized 5% x 100%
  - `linear-gradient(to right, #07080a00, #07080a)` at right, sized 5% x 100%
- **WebGL2 canvas** (three.js via react-three-fiber) fills the box. Backing store 2280x1837 because dpr is 2 (perf monitor can drop it to 1.5–2).

**Scene config (read verbatim from the page's inline config)**
- `scene`:
  - `backgroundColor rgb(7,9,10)`
  - `cubeZ:-9, cubeY:0, glassZ:0, glassRotation:0.73` (rad, about 41.8°, so the bars run diagonally top-left → bottom-right)
  - `cameraZ:16.54`, perspective camera `fov:35, near:.01, far:100`
  - `dpr:2`
  - Canvas props: `linear`, `flat`, `preserveDrawingBuffer`
- **Light source**: a `boxGeometry(7,7,7)` mesh at z=-9 with a custom ShaderMaterial (vertex passes `vUv`). Fragment shader (original, reproduce in your own words):
  - `t = uTime*uSpeed + 10000`, with `uSpeed=0.1` and `uSize=0.99`.
  - `xy` = (fragCoord/resolution − .5) · size + .5.
  - Sum of three waves, divided by 3:
    - `cos(3·x + t)`
    - `cos(1·(x·cos t + 5·y·sin t) + t)`
    - `sin(20·sqrt((.3x−.5+cos t)² + (.3y−.5+sin(t/2))² + 1) + t)`
  - Normalize to 0..1. Below .5, mix color3 → color2; at or above .5, mix color2 → color1. Output `pow(color, 3)`.
  - Colors: `color1 rgb(244,254,255)`, `color2 rgb(255,122,152)`, `color3 rgb(184,2,50)` (`color4 rgb(255,22,42)` is passed but unused).
- **Glass bars**: 16 instanced `cylinderGeometry(r=.5, r=.5, h=15, radialSegments=8, 1)`. Positions `x = (i+1)*1 − 8` for i=0..15, so they touch side by side. The group is rotated `z=0.73`.
- **Material**: drei `MeshTransmissionMaterial`:
  - `thickness 1, roughness .35, anisotropicBlur 2.88, ior 1.5, chromaticAberration 3, transmission 1`
  - `distortion 0 → animated, distortionScale .08, temporalDistortion 0 → animated`
  - `samples 6` (5 on mobile), `resolution 1024`, `specularIntensity 0`
  - This produces the frosted red stripes with cyan/blue chromatic fringes seen in screenshots.
- **Motion**
  - On mount the cube scale damps from 0 → 1 using `damp3(scale,[1,1,1], λ=1)`, so the light "blooms" in over about 2–3s. At t=300ms the frame is fully black; by 1s the stripes are visible.
  - When viewport width is over 7.3 world units (desktop), `distortion` damps to 15 (λ 30) and `temporalDistortion` to .025 (λ 10) with an expo-in mapping. The bars wobble and refract slowly.
  - The cube rotates toward the mouse: target rotation `[mouseX*0.3, -mouseY*0.3]` (mouse normalized −1..1), eased with `damp(…, .5)`. Translation influence is 0.2.
  - Frame loop is `"always"` only while the canvas intersects the viewport (IO threshold 0), otherwise `"demand"`. It stops entirely after 200s elapsed.
  - Post-processing (ordered Bayer dither) exists but is disabled.
  - Builder: a three.js recreation with your own shader is fine. A lighter fallback is a CSS/canvas gradient of 45° red/pink bars with blur, grain and slow drift.

**Text entrance**
- `.heroText` plays `fade-in-up 1s ease 0s forwards` (from opacity 0, `translateY(20px)` to opacity 1, 0).
- The sub p plays the same animation with a 1s delay.

**Breakpoints**: at 390 the hero is 615px tall, h1 is 36px in 2 lines (358 wide), and only the announcement pill shows below the text.

---

## 3. "Shortcuts" frame showcase (`sectionContainer` y 1191–2566, 1375 tall)

**Container and title**
- Flex column, centered.
- SectionTitle centered, max-width about 350px, `margin-bottom:64px`. Title 28c/4w/1L, subtitle 35c/5w/1L.

**Backdrop glow**
- `.backdrop`: `inset:-60px -70px; filter:blur(20px)`. Its `::before` is clipped by `polygon(0 0, 50% 14%, 100% 0, 92% 50%, 100% 100%, 50% 86%, 0 100%, 8% 50%)` and filled with `radial-gradient(40% 147% at 50% 46.2%, rgba(255,119,119,.2) 5%, rgba(154,170,255,.11) 60%, rgba(255,192,192,0) 140%)`.
- **Stars**: absolutely positioned layer `inset:-45px -135px` with four bands:
  - top and bottom: 45px tall
  - left and right: 86px wide, inset 82px from top/bottom and 50px from the sides
  - Each band holds tiny white round dots (`border-radius:100%`).
  - A dot with `data-state="medium"` shows a `::before` with `box-shadow 0 0 2px 1px rgba(50,145,255,.25)`. A dot with `data-state="high"` shows a `::after` with `0 0 1px 1px rgba(50,145,255,.8), 0 0 2px 1px rgba(50,145,255,.25)`. Opacity transitions use `var(--transition-duration) ease`, so the stars twinkle in JS-driven random states.

**Frame**
- `.frameOuter`:
  - Size: `width:100%; max-width:min(1204px, 100vw+19px); height:clamp(500px, 274.436px + 60vw, 740px)`, which is 740 at 1440. `padding:8px`; `border-radius:19px` at ≥1204.
  - Background: `radial-gradient(85.77% 49.97% at 51% 5.12%, rgba(255,150,150,.11) 0%, rgba(222,226,255,.08) 45.83%, rgba(241,242,255,.02) 100%), rgba(0,0,0,.44)`.
  - `border:1px solid rgba(255,255,255,.08); backdrop-filter:blur(2px)`.
  - `box-shadow: 0 0 40px 20px rgba(255,255,255,.03), inset 0 .5px rgba(255,255,255,.3)`.
- `.frameInner`: `#07080a; border:1px solid rgba(255,255,255,.08); radius 12px; overflow:hidden; box-shadow: 0 0 2px rgba(255,255,255,.19), inset 0 .5px rgba(255,255,255,.1)`. Box 1186x722.
  - Wallpaper image (placeholder): 1300x733 at x=70 (overflows the frame and is cropped), natural 1793x1011 (about 16:9), `opacity:.8`. Treatment: dark abstract red diagonal streaks. Use your own dark gradient art.
  - **Mock macOS menu bar** (≥720 only): 48px tall, `padding:12px`, 13px/16px bold, `color:rgba(255,255,255,.4)`, text-shadow `0 1px 4px rgba(0,0,0,.2), 0 36px 100px rgba(0,0,0,.7)`. Left group gap 19px (7 short labels). Right group gap 6px with status items. Write original labels.
  - **Showcase reel**: `display:grid; grid-template-columns: repeat(5, min(1184px,100vw))` with horizontal overflow (scrollWidth 5957). Each slide is a launcher-window mockup. `padding-bottom:102px` (and `padding-top:48px` at ≥720).
    - The first slide is a "clipboard history" style window, about 750x460: left list column about 280px wide, right preview pane, bottom action bar.
    - Window type: Inter 13px rows, 16px search input (placeholder color rgba(255,255,255,.4)), 12px table, 11px/600 hotkey glyphs at rgba(255,255,255,.6).
    - Build your own generic launcher mock.
  - **Dock** (bottom 24px, centered): `padding:8px; gap:8px; border-radius:20px; border:1px solid rgba(255,255,255,.06); backdrop-filter:blur(10px)`, 332x72.
    - Background: `linear-gradient(181deg, rgba(0,0,0,.1) 4.5%, rgba(255,255,255,.03) 99.51%)`.
    - Shadow: `0 0 1px rgba(0,0,0,.2), 0 2px 2px rgba(0,0,0,.17), 0 4px 3px rgba(0,0,0,.1), 0 7px 3px rgba(0,0,0,.03), 0 4px 4px rgba(0,0,0,.25), inset 0 1px rgba(255,255,255,.1)`.
    - **5 items**, each 54x54: `padding:16px; radius:12px; border:1px solid #2f3031; color:#9c9c9d; background: radial-gradient(1139.98% 138.18% at 0 0, rgba(255,255,255,.1), rgba(255,255,255,0)); box-shadow:0 7px 3px rgba(0,0,0,.03), 0 4px 4px rgba(0,0,0,.25)`, holding a 20px icon. `transition:.2s`.
    - Active or hover: `color #fff; border #434345; background: radial-gradient(79.21% 79.21% at 42.35% 0, #787878, #282828); box-shadow: 0 8.077px 3.462px rgba(0,0,0,.03), 0 4.615px 4.615px rgba(0,0,0,.25), inset 0 1.154px rgba(255,255,255,.19), 0 0 6px rgba(255,255,255,.25)`.
    - Active additionally gets `border-radius:16px; margin:0 6px; transform: scale(1.25) translateY(-5px)` (macOS dock magnify).
    - Tooltip above the hovered item: `padding:1px 8px; radius 6px; 14px/160% 500; backdrop blur 8px; Card-BG; 1px Card-Border; shadow 0 4px 4px rgba(0,0,0,.25)`.
  - **Behavior (measured)**: no auto-advance. The reel stayed on slide 1 after 6s and while scrolling the page. Clicking a dock item scrolls the reel to that slide (snap). Each slide's inner rows are IntersectionObserver-tracked. A blinking text cursor animates at `1.1s infinite`.
- **Caption under the frame**: `max-width:467px; margin-top:24px`, centered, 16px/160% 500 `#6a6b6c` with a white highlighted span. 87c / 13w / 2L.

**Mobile (390)**: frame is 409x508 (bleeds about 9px each side), no menubar, section padding 168px.

---

## 4. "Time" keyboard section (`GetYourTimeBack`, y 2566–3286, 720 tall)

**Layout**
- Grid `width:1204px; gap:85px; grid-template-columns: 440px auto` (≥720). Measured columns 440 + 679.
- **Text column**:
  - `max-width:320px; padding:24px; gap:48px`, flex column, vertically centered, left aligned (centered on mobile).
  - Background `linear-gradient(to bottom, transparent, #07080a 50%)`.
  - SectionTitle: 27c title / 48c subtitle (subtitle wraps to 2L at 272px wide).
  - Light Download button (hidden below 720).
- **Keyboard column**: 679x720, `padding-left:24px; overflow:hidden`.
  - Mask: `radial-gradient(95% 70% at 17.02% 47.84%, rgb(217,217,217) 16.79%, rgba(217,217,217,0) 83.76%)`. Keys fade out toward the right and bottom.
  - On mobile: height 490px, children absolutely positioned with a vertical mask `linear-gradient(transparent, #fff, transparent)`.

**Keyboard grid**
- Column of rows, `gap:12px`. Each row: `height:110px; gap:12px; flex-nowrap`. The rows overflow off the right edge.
- **Key**:
  - `width:110px` (wide keys 137/167/168/178/206/208/262px); `border-radius:11px; padding:14.5px 15px`; grid rows `1fr 1fr` (alt legend top, primary legend bottom).
  - Legend type: 23.75px 500 (single glyphs 24–32px).
  - Background: `radial-gradient(75% 75% at 50% 91.9%, var(--key-bg-start-color,#121212), var(--key-bg-end-color,#0d0d0d))`.
  - Shadow: `0 1.5px .5px 2.5px rgba(0,0,0,.4), 0 0 .5px 1px #000, inset 0 2px 1px 1px rgba(0,0,0,.25), inset 0 1px 1px 1px rgba(255,255,255,.2)`.
  - Text-shadow `0 .5px .5px rgba(0,0,0,.1)`. Alt legend icon color `#6a6b6c`; primary span color `#9c9c9d`.
- **Hover / pressed**:
  - `translateY(1px)` on hover, `2px` when pressed.
  - Key colors go to `#151515 → #0d0d0d`.
  - Shadow becomes `0 0 0 .5px 1px #000, inset 0 2px 1px 1px rgba(0,0,0,.25), inset 0 1px 1px rgba(255,255,255,.15)`.
  - Transitions: `opacity .4s, box-shadow .2s, transform .2s, color .2s, --key-bg-* .4s`, all `cubic-bezier(.23,1,.32,1)`. Register `@property --key-bg-start-color` / `--key-bg-end-color` as `<color>`, inherits true, initial `#121212` / `#0d0d0d`.
- **Feature keys**: four keys in rows 3–4 are wider (178/208/208/178px). Each has a 20px line icon top-left, and at the bottom a bold white 16px word plus 16px `#9c9c9d` text (about 20c, 2 lines).
  - They render brighter, with a visible 1px lighter border. The other keys are dimmed by the mask.
  - Use your own 4 feature words.
- Trigger: the section container is IO-observed with threshold 0, and keys get a per-key `--delay` used by the glow/press transitions. No glowing state was observed in this section.

---

## 5. Extensions carousel (`ExtensionHighlight`, y 3286–4543, `padding:224px 0`, 168px below 720)

**Top row and categories**
- Top row: `max-width:1252px` (1204+48), `justify-content:space-between`. Stacks into a column with gap 40px at ≤1024.
  - Left: `.text` (max 480, padding 0 24px) holds SectionTitle with 30c title / 50c subtitle (2L).
- **Category switcher** (right), 376x63:
  - `padding:8px 20px; gap:24px; border-radius:31px`. Fill is Card-BG. Border is 1px Card-Border on the top, left and right sides only. Shadow `inset 0 1px rgba(255,255,255,.1)`.
  - 4 tabs, each 46px tall, 14px/160% 500 .2px. Inactive `#6a6b6c`, hover/active `#fff`, `transition:color .3s`. Label lengths: 12, 11, 6, 7 chars.
  - **Sliding active pill**: absolute, `top:8px; height:46px; width:var(--width); transform:translate3d(var(--offset),0,0)` set from JS. Transition `transform .3s, width .3s`. `border-radius:36px; backdrop-filter:blur(2px)`.
    - Background: `radial-gradient(51.07% 92.4% at 51% 7.61%, #5a5a5a, #1a1a1a)`.
    - `::before` 1px gradient border via mask-composite exclude: `linear-gradient(#fff, transparent)` at opacity .2.
- **Reel**:
  - Wrapper `width:100vw; max-width:2000px`.
  - Scroller: `overflow-x:auto; scroll-snap-type:x mandatory; scroll-padding:24px; overscroll-behavior-x:contain`, scrollbar hidden. Padding `40px 24px` with a `-40px` vertical margin at ≥720.
  - Edge mask: `linear-gradient(to right, transparent, black 64px, black calc(100% - 224px), transparent)`.
  - Inner track: max 1204, `padding:32px 0`. Row is `inline-flex; gap:56px` (24px below 720), with `padding-right:32px`.
  - **17 extension cards** plus 1 "browse more" card, track width 7520px.
- **Extension card** (360x536; 300 wide and 446 tall on mobile):
  - `border-radius:20px; display:grid; grid-template-rows:1fr auto; overflow:hidden; scroll-snap-align:end`.
  - Background and shadow are **per card** (from data). Examples:
    - Card 1: `linear-gradient(138deg, rgba(32,35,91,.7) 22%, rgba(7,9,33,.7) 82%)`, shadow `inset 0 1px rgba(255,255,255,.1), 0 0 20px 3px rgba(7,13,79,.05), 0 0 40px 20px rgba(7,13,79,.05), inset 0 0 0 1px rgba(255,255,255,.06)`.
    - Card 2: `radial-gradient(94.21% 78.4% at 50% 29.91%, rgba(43,94,180,.7), rgba(13,16,35,.42))`.
    - Card 3: green radial.
    - Give each placeholder card its own brand-ish gradient at 0.7 alpha with the same shadow recipe.
  - Header container: `padding:24px 24px 0; gap:24px` (16 on mobile); rows `auto 1fr auto`.
    - Header row (`gap:12px`, items centered): 56x56 icon (radius 12, `margin:-2px`, shadow `0 1.189px 2.377px rgba(0,0,0,.28)`; natural 64x64 PNG) + title (18px 400, 6–16c) + 36x36 action button (dark-button style, radius 8, 16px chevron).
    - Description: 16px/160% 500 (14px on mobile), 2 lines, about 60–75c.
    - 1px divider `rgba(255,255,255,.05)`.
  - Bottom illustration: 360x360 square (natural 384x384), no radius. Use a placeholder illustration.
  - Hover: action ring goes to `.5` alpha. `::after` overlay `radial-gradient(50% 50%, transparent 0, rgba(0,0,0,.25) 80%)` with `mix-blend-mode:soft-light`, fades in (opacity 0 → 1, .3s).
  - **Entrance**: each `.extensionCardWrapper` starts `opacity:0; transform-origin:100% 0`. It runs `slideIn .7s var(--delay) cubic-bezier(.215,.61,.355,1) forwards`, from `translateY(50px) translateX(10px) scale(.98)`, opacity 0, to none, opacity 1. Delays measured: **100ms + 80ms × index** (100, 180, 260 … 1380ms). It replays when switching category.
  - Old set on category switch: `opacity 1 → 0; scale(.98) translate(-20px,-20px)`, `.3s ease-in`, absolute positioned.
- **Browse-more card**: 360 wide (300 on mobile), `background:#111214; border:1px solid rgba(255,255,255,.06); radius 22px`.
  - Image 358x411 (natural 384x441) at `filter:grayscale(1); opacity:.8`.
  - h3 24px 500 with `margin-top:40px`.
  - Hover: image back to color at opacity 1, card shadow `0 0 24px 8px rgba(255,255,255,.05)`, `.3s`.
- **Bottom row** (`padding:0 24px`, space-between):
  - Left: an ArrowLink, 21c.
  - Right: 2 round pagination buttons, each 58x57, `gap:12px`. `padding:20px; radius 86px`, Card-BG, top/sides border, `inset 0 1px rgba(255,255,255,.1)`.
    - Hover glow `0 2px 40px 10px rgba(154,170,255,.05), 0 0 16px -7px rgba(154,170,255,.05)`.
    - Disabled: color `#6a6b6c`.
    - Clicking scrolls the reel by one page.

---

## 6. AI section (`styles-module root`, y 4724–6113, `margin:180px auto`; 80px at ≤767)

**Shell and heading**
- Section: max 1060 with `padding:0 20px`, giving 1020px content at x=210.
- Heading block: `padding:72px 20px 56px`, centered.
  - Eyebrow: 8c, uppercase JetBrains Mono, red.
  - h2: 31c / 5w / 1L, 32px.
  - Description: 63c / 2L, max 500.
- A soft red glow sits behind the heading (part of a section background image or gradient; visible in screenshots as a faint warm band around y=4900–4950). Add a subtle red radial gradient there.

**Bento**
- `display:grid; grid-template-columns:repeat(var(--columns),1fr); gap:30px; margin-top:40px`. Becomes a flex column with gap 15 at ≤767.
  - Item 1: full width, 1020x477.
  - Items 2 and 3: 495x513 each, starting at y=5527.
- **Card**:
  - `background:rgba(255,255,255,.02); border-radius:30px; padding:24px; isolation:isolate; overflow:hidden` (radius 20 and padding 15 at ≤767).
  - Gradient hairline border via `::before` with `padding:1px` and mask-composite exclude: `linear-gradient(135deg, rgba(255,255,255,.1), rgba(255,255,255,.06) 38%, rgba(255,255,255,.06) 62%, rgba(255,255,255,.1))`.
  - Visual area: flex 1, `margin-bottom:24px`. Measured 972x332 (card 1) and 447x368 (cards 2–3).
  - Title: 16px/1.5 500 white, max 450, 1L (5–13c).
  - Description: 15px/1.5 rgba(255,255,255,.4) with plus-lighter, 2L (about 110c).
- **Visual 1**: a chat-app window mock (left sidebar 278px wide with rows at 13px; right conversation with 14px bubbles, tool-call rows and an app-chip pill), with a window chrome of three 12px traffic-light dots. Make your own neutral mock.
- **Visual 2**: a command-input pill (radius about 18px, 18px text at rgba(255,255,255,.7) plus a blinking caret at 1.1s) and a list of 18px/32px suggestions at rgba(255,255,255,.3) fading out downward.
- **Visual 3**: a chat bubble plus "checking" status row.
  - App icons are 16px with `border-radius:25%`.
  - Text 11–14px.
- Learn-more ArrowLink centered with `margin-top:50px` (32 on mobile). 27c.

---

## 7. Testimonials (`sectionContainer` y 6292–7392, 1100 tall)

**Title and carousel**
- SectionTitle centered, max 400. 33c / 36c, 1L each.
- **Person carousel** (Embla, loop, draggable):
  - `max-width:1204px; padding:96px 0` (64 below 720).
  - Mask `linear-gradient(90deg, rgba(217,217,217,0) 3%, #d9d9d9 30%, #d9d9d9 70%, rgba(217,217,217,0) 97%)`.
  - Slides `margin:0 16px` (8 below 720).
  - 24 people.
- **Card**: grid areas `"avatar name" "avatar title"`, `gap:4px 24px; padding:24px; border-radius:16px; 16px 600 .3px`. Measured 334x98 for the active card. Mobile: 14px, `padding:12px 16px 12px 12px`, radius 12.
  - Avatar: 48x48 circle, `border:1px solid rgba(255,255,255,.1); filter:grayscale(1); opacity:.5`.
  - Name: #fff, 15c, plus an @handle (#434345, hidden below 720).
  - Title line: #6a6b6c, about 11–20c.
  - **Active**: Card-BG plus top/sides border, shadow `inset 0 1px 1px rgba(255,255,255,.1), 0 2px 40px 10px rgba(154,170,255,.05), 0 0 16px -7px rgba(154,170,255,.05)`. Avatar goes to color at opacity 1.
  - Hover (≥720): border plus `inset 0 1px 1px rgba(255,255,255,.1)`. `transition: box-shadow .2s`.
  - Behavior: **click to select**. No autoplay (unchanged after 7s).
- **Testimonial panel**: `width:1064px; padding-top:96px` (48 below 720); grid `1fr auto 1fr` (columns measured 483 / 98 / 483).
  - Top border via border-image `linear-gradient(90deg, transparent, rgba(255,255,255,.19) 30%, rgba(255,255,255,.19) 70%, transparent)`.
  - Background `radial-gradient(49.41% 64.58% at 49.4% 0, rgba(255,255,255,.03), transparent)`.
  - **Left "highlight"**: grid `auto 1fr; gap:16px 24px`. Two label/value pairs:
    - Label: Geist Mono 14px #6a6b6c, about 15–18c.
    - Value: a badge, `height:26px; padding:0 6px; radius 6px; bg #1b1c1e; 14px 500 white; gap:8px`, with a 16px icon.
    - Below each badge: a description of 14px/24px #9c9c9d, max 320, 1–2L, `margin-bottom:45px` between pairs.
    - Optional inline `code`: Geist Mono 700 14px, #ff6363 on #0c0d0f, 1px #2f3031 border, radius 4, `padding:1px 3px`.
  - **Divider**: `padding:0 48px`, with a 2px x 100% `#1b1c1e` line.
  - **Quote**: max 490, 20px/160% 500 #6a6b6c with white emphasized spans, 2L, about 100c.
    - Decorative curly quotes in Geist Mono 56px 700 `#1b1c1e`: opening at `top:-26px; left:-34px`, closing at `bottom:-45px`.
    - When the quote changes it plays `fadeIn .7s ease-in-out` (opacity 0 → 1).

---

## 8. Automation (`sectionContainer` y 7392–8535, 1143 tall)

**Container**
- Flex column, `gap:48px`, max 1204.
- SectionTitle centered, max 510. 22c / 40c, 1L each.
- Grid: `1fr 1fr; gap:40px`; areas `"top top" "left right"` (stacked below 720).

**Card base**
- `background:linear-gradient(45deg, #0c0d0f 0%, #07080a 100.67%); border:1px solid rgba(255,255,255,.06); border-radius:12px; overflow:hidden; box-shadow: inset 0 1px rgba(255,255,255,.1)`.

**Cards**
- **Top card** (1204x218):
  - Grid flows by column. Description on the left (`padding:24px; gap:16px`, max 420):
    - h5: 18px 400 white with a 24px icon, gap 16px.
    - p: 14px/160% 500 #9c9c9d, 2L, about 85c.
  - Right side: a decorative image 800x643 (natural 801x644) at `opacity:.75`, `position:absolute; top:-160%; right:-5%`, clipped by the card. Shows blue diagonal glass streaks.
  - Over it sits a chat-composer mock: dark blue panel about 460x190 with a 16px text line, a blinking caret, a typed completion in `rgb(140,214,255)`, and a light "Send" button.
  - Backdrop behind the card: `inset:-13px 24px; filter:blur(37.5px)`, same star-polygon clip as section 3, with fill `radial-gradient(96.53% 62.13% at 22.87% 46.84%, rgba(255,255,255,0) 17.89%, rgba(154,170,255,.1) 100%)`.
- **Left card** (582x341):
  - Image 580x207 (natural 640x228) aligned to the end, masked by `linear-gradient(179deg, #d9d9d9 73.71%, rgba(217,217,217,0) 91.16%)`. It's a search-results mock.
  - Then the description (max 399), 2L.
- **Right card** (582x341): grid rows `1fr auto`.
  - Top: a centered hotkey illustration of three keycaps joined by "+" glyphs (22px). Keys are about 110x105 and 138x105, built like the section 4 keys, with 24px glyph and label.
  - Then the description.
- Trigger: container IO threshold 0.1 starts the typing animations. HotkeysShowcase IO threshold 0.2 presses its keys in sequence.

---

## 9. Feature wall (`sectionContainer` y 8535–9521, 986 tall)

**Layout**
- Container: flex row (column-reverse below 720), space-between, center aligned, max 1204.
- **Left** (626 wide; `min-width:380px; padding:0 24px; gap:80px`, flex column):
  - **Wall** (max 400): one paragraph of 24px/160% 500 #434345.
    - It begins with a white heading span (25c).
    - Then 13 inline clickable "text" spans: a 5c intro, then sentences of about 15–25c each. Total about 290c; it wraps to **8 lines** at 400px.
    - Hover: `#9c9c9d` (.3s).
    - Active: `#fff` plus `text-shadow:0 0 20px rgba(154,170,255,.65)`.
  - **Feature detail**: max 311, `gap:16px`.
    - Badge pill (14px white, 16px icon, `bg #1b1c1e`, radius 6).
    - Subtitle 14px/160% #9c9c9d with `min-height:70px` (≥720), 2L.
    - An underlined link of 10c.
- **Right** (578 wide), the desktop frame, 553x528 at ≥720:
  - Background `rgba(var(--theme-color), .02)`, where `--theme-color` is `215,42,42` (red) for the first feature. Each feature can set its own theme color.
  - `padding:8px; border-radius:16px; backdrop-filter:blur(2px)`.
  - Shadow: `inset 1px 1px 0 rgba(var(--theme-color),.07), inset 0 .5px #ffffff40`.
  - Mask: `radial-gradient(94.75% 100% at 20.94% 22%, #d9d9d9 20%, rgba(217,217,217,0) 76%)`. The bottom-right fades out.
  - Wrapper shadow: `-72px -50px 40px -60px rgba(var(--theme-color),.05)`.
  - Inside: 12 stacked feature images, each `height:633px` (natural 720x719, about 1:1), `border-radius:9px`, absolutely positioned. Only the active one has `opacity:1`.
  - Image swap: entering `opacity 0, scale(.95) translateY(12px)` → none over `.6s cubic-bezier(.4,0,.22,.96)`; exiting `opacity → .01` over .3s.
- **Pagination**: 240x8, centered under the frame (`margin:0 auto` at ≥920), `gap:8px`.
  - Segments: 1px tall `#452324` lines, masked with `radial-gradient(closest-side, #fff 90%, transparent)`.
  - The current segment's `::after` is `linear-gradient(90deg, #452324 0%, #eca5a7 93%, #581d27 100%)` and runs `progress 5000ms` (0% scaleX(0) → 5% scaleX(.1) → 100% scaleX(.95), transform-origin left). Its `::before` adds a pink radial glow.
- **Behavior (measured)**: auto-advances **every 5s** (active index changed from 0 to 1 between 0 and 5.5s), only while `.right` is ≥20% visible (IO threshold .2; `--animation-play-state` toggles). Clicking a wall phrase jumps to it.

---

## 10. Community (`CommunitySection`, y 9521–10316)

**Background**
- Image 818x657 (natural 828x665), centered, `opacity:.45; z-index:-1`. `width:clamp(680px, 561px+32vw, 818px)`.
- It shows red glass diagonal streaks. Use your own blurred gradient art.

**Socials**
- Grid `width:948px; padding:0 24px; gap:56px 40px; columns 1fr 1fr`; areas `"title title" "slack twitter"`; `margin-bottom:120px`.
- Title: 17c / 74c (2L), max 486.
- **Social card** (430x168, `padding:24px`; 16 on mobile):
  - Glass gradient as in the navbar, `backdrop-filter:blur(10px)`, 1px Card-Border, radius 12, `inset 0 1px 1px rgba(255,255,255,.15)`.
  - Header row (`gap:16px`):
    - 24px brand-icon placeholder
    - h5 20px 500 (5–9c), flex-grow
    - count in Geist Mono 14px #9c9c9d (11–12c)
  - Body p: 14px/160% #9c9c9d, 2L, about 70c.
  - CTA: 14px 500 white, 4–6c, with a 16px arrow.
  - Hover: `::after` overlay `rgba(255,255,255,.04)` (.3s) and the arrow moves `translateX(2px)`.

**Video ticker**
- `max-width:1204px`, with mask `linear-gradient(90deg, transparent, #000 15%, #000 65%, transparent)`.
- Embla `padding:48px 0`. Slides are `flex:0 0 230px; margin:0 20px`. 18 videos; the initial track transform is 467px.
- **Thumb**: 230x129 (16:9), `radius 12px; bg #434345`.
  - Shadow `0 0 20px 5px rgba(215,201,175,.05), 0 0 16px -7px rgba(215,201,175,.05)`.
  - Image `filter:grayscale(.5)`.
  - 1px gradient border via `::after`: `linear-gradient(rgba(255,255,255,.2), transparent)` with mask exclude.
  - Hover: `scale(1.04)`, glow becomes periwinkle `0 2px 40px 10px rgba(154,170,255,.05)`, image full color (.3s).
- Title below: `margin-top:16px`, 14px/1.4 600, opacity .8 → 1 on hover. 1–2L, about 25–45c.
- Measured: no autoplay over 3s; drag/swipe only.

**Footer block**
- `max-width:360px; gap:29px`, centered.
- p: 14px/160% #9c9c9d, 2L, 83c.
- Then a brand wordmark link: 108x25 SVG plus arrow. Use a generic "Watch videos" ArrowLink instead.

---

## 11. Developer API grid (`sectionContainer` y 10317–13499, 3182 tall)

**Grid**
- `--grid-width: min(100vw - 60px, 1065px)`.
- Columns: `1fr repeat(N, gridWidth/N) 1fr`, with N=1 base, 2 at ≥784, 3 at ≥1200.
  - At 1440: `161.5 355 355 355 161.5`.
  - At 1280: `81.5 355 355 355 81.5`.
- `gap:1px`. Every cell has `box-shadow: 0 0 0 1px #1b1c1e, inset 0 0 0 1px #07080a`, which draws the hairline grid.
- **Edge fades**: `.fadeX` with left/right `::before/::after` of width `(100vw − gridWidth)/2`, gradient `#07080a → transparent`. `.fadeY` covers the top (146px) and bottom (209px) the same way.
- **Spacer rows**: first row 146px tall, last 189px, others 48px.

**Cells** (in order at 3 columns)
- Column cells: `padding:24px; gap:32px; min-height:355px` (300 below 784), flex column, space-between.
- Dotted cells: `background-image: radial-gradient(#2f3031 .5px, transparent 0); background-size:17px 17px; background-position:-8.5px -8.5px; padding:50px`, with a centered line-art isometric SVG (width 100%).
  - Each has a caption badge at top-left: "FIG_0n", where n auto-increments via CSS `counter(fig)`. `padding:12px`, Geist Mono 10px.
- Link cells: hover `background:#0c0d0f` (.15s); the corner 16px north-east arrow goes from #6a6b6c to white and moves `translate(2px,-2px)` (.3s).
- Cell sequence:
  1. Intro column (355x271): h3 56px, 24c, **3L** at 307px width.
  2. Intro link column (355x213): p Geist Mono 106c / 4L, plus external link 13c.
  3. Dotted FIG_01, 711x485 (spans 2 columns): isometric exploded-UI illustration in blue `#0a2a6e`–`#5c9dff` fills and grey linework.
  4. Feature link cells, 355 or 456 tall: h4 24px (14–20c) plus Geist Mono p (3L, about 90c).
  5. Dotted FIG_02–FIG_06, each 355x355 or 711x429: isometric objects (retro computer, toggle, UI pieces, floppy disks).
  6. A centered "Get started" external link row, 48px tall.
- Illustrations use blue `rgb(25,60,140)` / `rgb(90,150,255)` fills plus `#2f3031` strokes. Draw original isometric line art at these box sizes.
- Motion:
  - Dotted cells are IO-observed at thresholds .7 and 1. Illustrations animate when fully in view: FIG_02 has a screen "blink startup" (1.5s, 1s delay) and FIG_06 has a `float` keyframe.
  - Treat these as subtle fade/float: `translateY` about 4–8px on an infinite ease-in-out loop.

**Mobile**: 1 column 330px wide, h3 32px.

---

## 12. Final CTA, Cmd+Space keyboard (`CommandYourTime`, y 13499–14743, `padding-bottom:224px`)

**Keyboard**
- Inline SVG with a `foreignObject`, `width:clamp(700px, 223.3px+127.6vw, 1754px)` (1754x770 at 1440, x=-157; overflows the page), `padding-bottom:50px`.
- Mask: `radial-gradient(43.1% 67.12% at 48.11% 80%, #d9d9d9 0%, rgba(217,217,217,0) 100%)`.
- Shows a full keyboard (same key component as section 4, 110px keys, 12px gaps) fading out toward the edges and top.
- **Glowing keys** (left command plus space bar) when the container is ≥90% visible (IO threshold .9). Measured: 2 `.glowing` keys present 0.4s after scrolling in.
  - Key colors `#161616 → #222` via `linear-gradient(180deg, …)`.
  - Text `rgb(255,205,205)` with `text-shadow 0 0 4.331px #ff6363`; svg paths fill `rgb(255,205,205)`.
  - Shadow `0 0 10px 5px rgba(255,67,7,.1), 0 0 3px 2px rgba(255,67,7,.1), inset 1px .5px .5px .5px rgba(255,118,118,.25), inset 0 0 1px 1px rgba(255,255,255,.45), inset 0 2px 1px 1px rgba(0,0,0,.25)`.
  - `::before` glow: 120% x 130% at top -15% / left -10%, `blur(15px)`, `radial-gradient(56% 65%, #fa7e7e, rgba(249,112,112,0))`, `scale(1.08)`.
  - `::after` highlight: 70% x 4% at top -1%, `blur(5px)`, overlay blend, white radial.
  - Transitions: 1.5s easeOutQuint with `var(--delay)`, and the bg colors `+.1s`. Pseudo-elements fade in over 1s with a `+.2s` delay.

**Action block**
- `max-width:400px; gap:80px`, centered.
- SectionTitle: 19c / 34c.
- The same HeroDownloadInfo block as the hero (button + requirements + sub links; hidden below 720).

---

## 13. Footer (y 14743–15982)

**Container and background**
- `padding-top: clamp(100px, 13.79px + 23vw, 200px)`; `position:relative; overflow-x:hidden`.
- Background image: 867x867 (natural 828x828), `opacity:.5`, `top:-40px; left:50%`, transformed `translateX(-50%) rotate(85deg)`. It's a red glass "isolated cube" render. Use your own blurred red shape.

**Content panel**
- `backdrop-filter:blur(20px); border-top:1px solid #1b1c1e; padding-bottom:64px; gap:96px`.
- Background: `linear-gradient(rgba(7,8,10,.8) .1%, #07080a 32.45%)` over `radial-gradient(49.41% 64.58% at 49.4% 0, rgba(255,255,255,.03), transparent)`.
- Shadow `0 -4px 10px rgba(0,0,0,.11)`.

**Links grid**
- `max-width:1064px; padding:96px 0 0 24px; gap:32px; columns repeat(6, minmax(144px,1fr))` (2 columns below 720). Columns measured about 146.7px.
- Each group: `gap:40px` between the head (14px white, 4–12c) and a link list (`gap:20px`).
- 47 links total. Per-group counts are about 13 / 11 / 8 / 9 / 5 / 8. Links are 3–22c; some wrap to 2 lines at 147px.
- External links get a 10px north-east icon (#6a6b6c) that moves `translate(1px,-1px)` on hover. Link color goes from `#9c9c9d` to `#fff` (.3s).

**Newsletter row**
- `max-width:1064px; padding:48px 24px 24px; border-top:1px solid #1b1c1e`; row with space-between at ≥720.
- Left text (max 260): h5 14px white (28c) plus a 2L grey line (about 50c).
- Form (max 430): grid `276px 138px; gap:16px`.
  - Input: 42px tall, `padding:8px 12px; radius 8; bg rgba(255,255,255,.05); border 1px rgba(255,255,255,.05)`, 14px 500 white, placeholder about 17c. `transition: color .3s, border .3s`.
  - Submit: `bg rgba(255,255,255,.9); color #000`, same radius/padding, opacity .9. Transitions `background-color .3s ease-in-out, transform .1s`.
  - Below: legal text 12px/18px .4px rgba(255,255,255,.4), 3L (162c) with a 14c inline link.
- **No copyright/legal bottom bar**: the page ends after the newsletter row plus 64px padding.

**Mobile**: links in 2 columns (167px each), newsletter stacked. Footer is 2199 tall.

---

## 14. Breakpoint summary

| Element | 390 (mobile) | 1280 | 1440 |
|---|---|---|---|
| Navbar | 358x58 grid + hamburger | 1204x76 at x=38 (same as 1440, centered) | 1204x76 at x=118 |
| Hero height | 615 (no download block) | 967 | 967 |
| h1 | 36px, 358w, 2L | 64px | 64px |
| Section padding Y | 168 | 224 | 224 |
| Shortcut frame | 409x508 | 1204x740 | 1204x740 |
| Time keyboard | text below keys, keys 490 tall | 440 + 679 columns | same |
| Extension card | 300x446 | 360x536 | 360x536 |
| AI bento | stacked, padding 15, radius 20 | 3-card grid at x=130 | x=210 |
| Testimonial | single column, divider becomes horizontal | 483/98/483 | same |
| Automation grid | all stacked (top/left/right) | 2 columns, 582 each | same |
| Feature wall | image first (342x342), wall below | row | row |
| Socials | 1 column, 342 wide | 2 × 430 | same |
| API grid | 1 column, 330 | 3 × 355 | 3 × 355 |
| Footer links | 2 columns | 6 columns | 6 columns |

Content width at 1280 equals 1440 (1204 container); only the side margins shrink (38 instead of 118).

---

## 15. Motion inventory (summary)

| # | Where | Trigger | Animation | Duration / easing / delay |
|---|---|---|---|---|
| 1 | Hero text block | load | opacity 0→1, translateY 20→0 | 1s ease, 0s |
| 2 | Hero sub p | load | same | 1s ease, **1s delay** |
| 3 | Hero WebGL | load + in-view | cube light scales 0→1 (damp λ1); glass distortion ramps to 15; continuous shader time ×0.1 | runs while visible, stops after 200s |
| 4 | Hero WebGL | mousemove | light cube rotates up to ±0.3 rad toward the cursor | damped .5 |
| 5 | Announcement border | always | conic highlight sweeps along the border and flips | 3s linear infinite, −0.64s |
| 6 | Stars around frame | JS timer | per-dot glow states off / medium / high | opacity transition, `--transition-duration` |
| 7 | Dock | click | item scale 1.25, translateY −5, radius 16 | .2s |
| 8 | Text cursors | always | blink | 1.1s infinite (step on/off) |
| 9 | Category pill | click | translate3d + width slide | .3s |
| 10 | Extension cards | in-view / category change | slideIn from (10px, 50px) scale .98 | .7s cubic-bezier(.215,.61,.355,1), 100ms + 80ms·i |
| 11 | Extension cards exit | category change | fade, scale .98, translate(−20,−20) | .3s ease-in |
| 12 | Testimonial quote | selection | fadeIn | .7s ease-in-out |
| 13 | Automation typing / hotkeys | IO .1 / .2 | typed text, key presses | JS |
| 14 | Feature wall | IO .2, then auto | progress bar scaleX 0→.95; image swap scale .95→1, y 12→0 | 5s per item; .6s cubic-bezier(.4,0,.22,.96) |
| 15 | API figures | IO .7 / 1 | screen blink startup, float | 1.5s (1s delay); infinite float |
| 16 | Cmd+Space keys | IO .9 | key glow, red under-light | 1.5s cubic-bezier(.23,1,.32,1) + per-key delay |
| 17 | Key hover (all keyboards) | hover | translateY 1–2px, darker bg | .2s easeOutQuint |
| 18 | Hovers (links, cards, thumbs) | hover | color / translate(2px) / scale 1.04 / glow | .2–.3s |

- No scroll-linked parallax or scroll-driven CSS (`animation-timeline`) is used.
- All reveals are IntersectionObserver-based. 21 scroll/wheel listeners were registered (Embla carousels and nav).
- No `<video>` elements are on the page.

---

## 16. Asset manifest (geometry only, all to be replaced with originals)

| Asset | Placement | Rendered size | Natural | Treatment |
|---|---|---|---|---|
| Logo mark + wordmark | navbar | 93x24 | SVG | hover scale 1.05 |
| Hero 3D canvas | hero bg | 1200x967 | WebGL2, dpr 2 | vignette ::after |
| Frame wallpaper | section 3 frame | 1300x733 | 1793x1011 | opacity .8, cropped by frame |
| App icons in launcher mock | section 3 | 20x20 | 20–32px PNG | none |
| Extension icons ×17 | ext cards | 56x56 | 64x64 | radius 12, shadow 0 1.19px 2.38px rgba(0,0,0,.28) |
| Extension illustrations ×17 | ext cards bottom | 360x360 | 384x384 | none (card overflow hidden, radius 20) |
| Browse-more art | last ext card | 358x411 | 384x441 | grayscale(1) opacity .8 → color on hover |
| App icons (AI) | AI visuals | 16x16 | 120x120 webp | radius 25% |
| Avatars ×24 | testimonial carousel | 48x48 | 46–48px | circle, 1px rgba(255,255,255,.1) border, grayscale + .5 opacity when inactive |
| Badge icon | testimonial | 16x16 | 128x128 | — |
| Snippets backdrop | automation top | 800x643 | 801x644 | opacity .75, absolute top −160% right −5% |
| Quicklinks mock | automation left | 580x207 | 640x228 | mask linear-gradient 179deg fade at 73–91% |
| Feature screenshots ×12 | feature wall | 633x633 (height 633) | 720x719 | radius 9, crossfade |
| Community bg | community | 818x657 | 828x665 | opacity .45, centered |
| YouTube thumbs ×18 | video ticker | 230x129 (16:9) | 480x360 | radius 12, grayscale .5 |
| API isometric SVGs ×6 | API grid | fill cell (355–711 wide) | inline SVG | dotted bg 17px |
| Cmd+Space keyboard | final CTA | 1754x770 | inline SVG/foreignObject | radial mask |
| Footer bg | footer top | 867x867 | 828x828 | opacity .5, rotate(85deg) |

Fonts actually loaded: Inter (latin variable woff2), Geist Mono variable, JetBrains Mono variable. All OFL, load from Google Fonts.

---

## 17. Not measured / caveats

- The **exact internal layouts of the product mocks** (launcher windows, AI chat, snippet composer, quicklinks) were measured only at the container level, plus a sample of their text roles in section 0.9 / per-section notes. They are proprietary UI and should be replaced with original simplified mocks of the same outer size.
- The **hero rendering** cannot be read as pixels/values beyond the config and shader logic above. The look comes from drei `MeshTransmissionMaterial` (refraction, anisotropic blur, chromatic aberration) over the animated shader cube. Pixel output varies by GPU; headless Chromium used SwiftShader.
- The **star twinkle timing** (`--transition-duration`, state change interval) is set from JS at runtime. Exact intervals were not extracted.
- **Typing speeds** in the automation/AI mocks and key-press sequence timing in the hotkeys showcase are JS-driven and were not timed.
- The **API figure keyframes** (`ApiFig2 screenBlinkStartup`, `ApiFig6 float`) were seen by name and duration only (1.5s, 1s delay); their keyframe stops were not dumped.
- Line counts come from the 1440 screenshots and rect heights. Counts for inline/flex elements are approximate (±1).
