# Design/motion study clone of https://www.raycast.com/ (homepage + 7 main-nav pages); structure from CLONE_SPEC.md and PAGES_SPEC.md, components from src/. Content is original placeholder.

Source: Design/motion study clone of https://www.raycast.com/ (homepage + 7 main-nav pages); structure from CLONE_SPEC.md and PAGES_SPEC.md, components from src/. Content is original placeholder.
Status: **built — all 8 routes implemented; reconciled against src/pages/**
8 routes · 8 templates · 47 unique sections

> Generated from `ia.json` by `build.mjs`. Edit the JSON, not this file.

## Shape of the site

The largest 3 templates (Homepage, Store, Pro) account for 3 of 8 routes (38%). The remaining 5 routes span 5 templates.

| template | routes | share |
|---|---:|---:|
| Homepage | 1 | 13% |
| Store | 1 | 13% |
| Pro | 1 | 13% |
| Pricing | 1 | 13% |
| Teams | 1 | 13% |
| AI feature page | 1 | 13% |
| Windows | 1 | 13% |
| iOS | 1 | 13% |

## Page chrome

**8 routes carry chrome = `full`** — Homepage, Store, Pro, Pricing, Teams, AI feature page, Windows, iOS.

## Sections by reuse

How widely a section is shared determines whether it belongs in a shared
component library or stays local to its page.

| section | category | templates | routes | implementation | scope |
|---|---|---:|---:|---|---|
| `nav.navbar` | NAV | 8 | 8 | `Navbar.jsx` | Every route. |
| `footer.footer` | FOOTER | 8 | 8 | `Footer.jsx` | Every route. |
| `hero.page` | HERO | 5 | 5 | `PageHero.jsx (Store/Pro/Teams/Ai/Ios pass their own art: StoreArt, ProArt, TeamsOrbit, IosHeroArt)` | Secondary product pages that open with a standard page hero (store, pro, teams, AI, iOS). |
| `feature.split` | FEATURE | 5 | 5 | `SplitFeature.jsx` | Pro, teams, AI, Windows and iOS pages, often several per page. |
| `faq.accordion` | FAQ | 5 | 5 | `FaqAccordion.jsx` | Pricing, Pro, AI, Windows and iOS pages. |
| `pricing.plans` | PRICING | 4 | 4 | `PricingSection.jsx` | Pricing, Pro, AI and Teams pages. |
| `feature.media-card-grid` | FEATURE | 3 | 3 | `MediaCard.jsx` | Pro, Windows and iOS pages. |
| `feature.ai-bento` | FEATURE | 2 | 2 | `AiBento.jsx` | Homepage and Pro page. |
| `feature.section-title` | FEATURE | 2 | 2 | `shared.jsx > SectionTitle` | Pro and iOS pages, repeated within a page. |
| `feature.centered-lead` | FEATURE | 2 | 2 | `CenteredLead.jsx` | Teams and Windows pages. |
| `cta.download` | CTA | 2 | 2 | `DownloadBlock.jsx` | Teams and iOS pages. |
| `hero.home` | HERO | 1 | 1 | `Hero.jsx + HeroCanvas.jsx` | Homepage only. |
| `hero.windows-serif` | HERO | 1 | 1 | `pages/Windows.jsx > SerifHero (+ DownloadBlock.jsx)` | Windows page only. |
| `hero.pricing-art` | HERO | 1 | 1 | `pages/Pricing.jsx > TopArt` | Pricing page only. |
| `showcase.shortcuts-frame` | SHOWCASE | 1 | 1 | `ShortcutsFrame.jsx` | Homepage only. |
| `showcase.time-keyboard` | SHOWCASE | 1 | 1 | `TimeKeyboard.jsx` | Homepage only. |
| `showcase.teams-slideshow` | SHOWCASE | 1 | 1 | `pages/Teams.jsx > TeamsSlideshow` | Teams page only. |
| `showcase.ai-frame` | SHOWCASE | 1 | 1 | `pages/Windows.jsx > AiShowcaseFrame` | Windows page only. |
| `showcase.game-launcher-marquee` | SHOWCASE | 1 | 1 | `pages/Windows.jsx > GameLauncherMarquee` | Windows page only. |
| `showcase.phone-composite` | SHOWCASE | 1 | 1 | `pages/Ios.jsx > HeroArt + Phone` | iOS page only. |
| `showcase.full-bleed-image` | SHOWCASE | 1 | 1 | `pages/Ios.jsx > Vis` | iOS page only. |
| `catalog.extensions-carousel` | CATALOG | 1 | 1 | `ExtensionsCarousel.jsx` | Homepage only. |
| `catalog.extension-reel` | CATALOG | 1 | 1 | `ExtensionsCarousel.jsx > ExtensionReel` | Windows page only. |
| `catalog.featured-grid` | CATALOG | 1 | 1 | `pages/Store.jsx > FeaturedExtensionCard` | Store page only. |
| `catalog.store-toolbar` | CATALOG | 1 | 1 | `pages/Store.jsx > StoreToolbar` | Store page only. |
| `catalog.store-grid` | CATALOG | 1 | 1 | `pages/Store.jsx > StoreExtensionCard + Pagination` | Store page only. |
| `catalog.template-grid` | CATALOG | 1 | 1 | `pages/Teams.jsx > TemplateGrid` | Teams page only. |
| `catalog.coming-soon-grid` | CATALOG | 1 | 1 | `pages/Windows.jsx > SoonCard` | Windows page only. |
| `feature.ai-card-grid` | FEATURE | 1 | 1 | `AiBento.jsx > AiCard` | AI page only. |
| `feature.ai-wide-visual` | FEATURE | 1 | 1 | `AiBento.jsx > AiHeader + AiCard` | AI page only. |
| `feature.ai-card-pairs` | FEATURE | 1 | 1 | `AiBento.jsx > AiHeader + AiCard` | AI page only. |
| `feature.ai-chip-tabs` | FEATURE | 1 | 1 | `pages/Ai.jsx > AiChipTabs` | AI page only. |
| `feature.byok-row` | FEATURE | 1 | 1 | `pages/Ai.jsx > ByokRow` | AI page only. |
| `feature.model-tabs` | FEATURE | 1 | 1 | `pages/Pro.jsx > ModelTabs` | Pro page only. |
| `feature.automation` | FEATURE | 1 | 1 | `Automation.jsx` | Homepage only. |
| `feature.feature-wall` | FEATURE | 1 | 1 | `FeatureWall.jsx` | Homepage only. |
| `feature.developer-grid` | FEATURE | 1 | 1 | `DeveloperGrid.jsx` | Homepage only. |
| `feature.hotkeys-banner` | FEATURE | 1 | 1 | `pages/Windows.jsx > HotkeysBanner` | Windows page only. |
| `proof.testimonials` | PROOF | 1 | 1 | `Testimonials.jsx` | Homepage only. |
| `proof.community` | PROOF | 1 | 1 | `Community.jsx` | Homepage only. |
| `proof.social-cards` | PROOF | 1 | 1 | `Community.jsx > SocialCards` | Teams page only. |
| `proof.logo-strip` | PROOF | 1 | 1 | `pages/Teams.jsx > LogoStrip` | Teams page only. |
| `proof.quote-strip` | PROOF | 1 | 1 | `pages/Windows.jsx > QuoteStrip` | Windows page only. |
| `pricing.compare-table` | PRICING | 1 | 1 | `pages/Pricing.jsx > PricingTable` | Pricing page only. |
| `pricing.pro-upsell` | PRICING | 1 | 1 | `pages/Teams.jsx > ProUpsell` | Teams page only. |
| `cta.final-keyboard` | CTA | 1 | 1 | `FinalCta.jsx` | Homepage only. |
| `cta.windows-final` | CTA | 1 | 1 | `CenteredLead.jsx + DownloadBlock.jsx` | Windows page only. |

**11 shared sections** appear in more than one template and belong in a component library.

**36 single-use sections** appear in exactly one template. Building these
as "reusable" components up front would be speculative — keep them page-local
until a second caller actually appears.

## Templates

### Homepage — `template.home`

1 route · `/` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | NAV | `nav.navbar` | shared ×8 |
| 2 | HERO | `hero.home` | page-local |
| 3 | SHOWCASE | `showcase.shortcuts-frame` | page-local |
| 4 | SHOWCASE | `showcase.time-keyboard` | page-local |
| 5 | CATALOG | `catalog.extensions-carousel` | page-local |
| 6 | FEATURE | `feature.ai-bento` | shared ×2 |
| 7 | PROOF | `proof.testimonials` | page-local |
| 8 | FEATURE | `feature.automation` | page-local |
| 9 | FEATURE | `feature.feature-wall` | page-local |
| 10 | PROOF | `proof.community` | page-local |
| 11 | FEATURE | `feature.developer-grid` | page-local |
| 12 | CTA | `cta.final-keyboard` | page-local |
| 13 | FOOTER | `footer.footer` | shared ×8 |

### Store — `template.store`

1 route · `/store` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | NAV | `nav.navbar` | shared ×8 |
| 2 | HERO | `hero.page` | shared ×5 |
| 3 | CATALOG | `catalog.featured-grid` | page-local |
| 4 | CATALOG | `catalog.store-toolbar` | page-local |
| 5 | CATALOG | `catalog.store-grid` | page-local |
| 6 | FOOTER | `footer.footer` | shared ×8 |

### Pro — `template.pro`

1 route · `/pro` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | NAV | `nav.navbar` | shared ×8 |
| 2 | HERO | `hero.page` | shared ×5 |
| 3 | FEATURE | `feature.ai-bento` | shared ×2 |
| 4 | FEATURE | `feature.model-tabs` | page-local |
| 5 | FEATURE | `feature.section-title` | shared ×2 |
| 6 | FEATURE | `feature.split` | shared ×5 |
| 7 | FEATURE | `feature.media-card-grid` | shared ×3 |
| 8 | FEATURE | `feature.split` | shared ×5 |
| 9 | PRICING | `pricing.plans` | shared ×4 |
| 10 | FAQ | `faq.accordion` | shared ×5 |
| 11 | FOOTER | `footer.footer` | shared ×8 |

### Pricing — `template.pricing`

1 route · `/pricing` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | NAV | `nav.navbar` | shared ×8 |
| 2 | HERO | `hero.pricing-art` | page-local |
| 3 | PRICING | `pricing.plans` | shared ×4 |
| 4 | PRICING | `pricing.compare-table` | page-local |
| 5 | FAQ | `faq.accordion` | shared ×5 |
| 6 | FOOTER | `footer.footer` | shared ×8 |

### Teams — `template.teams`

1 route · `/teams` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | NAV | `nav.navbar` | shared ×8 |
| 2 | HERO | `hero.page` | shared ×5 |
| 3 | PROOF | `proof.logo-strip` | page-local |
| 4 | FEATURE | `feature.centered-lead` | shared ×2 |
| 5 | FEATURE | `feature.split` | shared ×5 |
| 6 | SHOWCASE | `showcase.teams-slideshow` | page-local |
| 7 | FEATURE | `feature.split` | shared ×5 |
| 8 | FEATURE | `feature.split` | shared ×5 |
| 9 | PRICING | `pricing.pro-upsell` | page-local |
| 10 | FEATURE | `feature.centered-lead` | shared ×2 |
| 11 | PRICING | `pricing.plans` | shared ×4 |
| 12 | FEATURE | `feature.centered-lead` | shared ×2 |
| 13 | CATALOG | `catalog.template-grid` | page-local |
| 14 | CTA | `cta.download` | shared ×2 |
| 15 | PROOF | `proof.social-cards` | page-local |
| 16 | FOOTER | `footer.footer` | shared ×8 |

### AI feature page — `template.ai`

1 route · `/core-features/ai` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | NAV | `nav.navbar` | shared ×8 |
| 2 | HERO | `hero.page` | shared ×5 |
| 3 | FEATURE | `feature.ai-chip-tabs` | page-local |
| 4 | FEATURE | `feature.ai-card-grid` | page-local |
| 5 | FEATURE | `feature.byok-row` | page-local |
| 6 | FEATURE | `feature.ai-wide-visual` | page-local |
| 7 | FEATURE | `feature.split` | shared ×5 |
| 8 | FEATURE | `feature.split` | shared ×5 |
| 9 | FEATURE | `feature.split` | shared ×5 |
| 10 | FEATURE | `feature.ai-card-pairs` | page-local |
| 11 | PRICING | `pricing.plans` | shared ×4 |
| 12 | FAQ | `faq.accordion` | shared ×5 |
| 13 | FOOTER | `footer.footer` | shared ×8 |

### Windows — `template.windows`

1 route · `/windows` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | NAV | `nav.navbar` | shared ×8 |
| 2 | HERO | `hero.windows-serif` | page-local |
| 3 | FEATURE | `feature.centered-lead` | shared ×2 |
| 4 | FEATURE | `feature.media-card-grid` | shared ×3 |
| 5 | FEATURE | `feature.hotkeys-banner` | page-local |
| 6 | SHOWCASE | `showcase.ai-frame` | page-local |
| 7 | PROOF | `proof.quote-strip` | page-local |
| 8 | FEATURE | `feature.split` | shared ×5 |
| 9 | SHOWCASE | `showcase.game-launcher-marquee` | page-local |
| 10 | CATALOG | `catalog.extension-reel` | page-local |
| 11 | FEATURE | `feature.centered-lead` | shared ×2 |
| 12 | CATALOG | `catalog.coming-soon-grid` | page-local |
| 13 | CTA | `cta.windows-final` | page-local |
| 14 | FAQ | `faq.accordion` | shared ×5 |
| 15 | FOOTER | `footer.footer` | shared ×8 |

### iOS — `template.ios`

1 route · `/ios` · chrome: **full**

| # | category | section | |
|---:|---|---|---|
| 1 | NAV | `nav.navbar` | shared ×8 |
| 2 | HERO | `hero.page` | shared ×5 |
| 3 | FEATURE | `feature.section-title` | shared ×2 |
| 4 | SHOWCASE | `showcase.phone-composite` | page-local |
| 5 | FEATURE | `feature.split` | shared ×5 |
| 6 | FEATURE | `feature.media-card-grid` | shared ×3 |
| 7 | FEATURE | `feature.section-title` | shared ×2 |
| 8 | SHOWCASE | `showcase.full-bleed-image` | page-local |
| 9 | FEATURE | `feature.split` | shared ×5 |
| 10 | FEATURE | `feature.section-title` | shared ×2 |
| 11 | FEATURE | `feature.media-card-grid` | shared ×3 |
| 12 | CTA | `cta.download` | shared ×2 |
| 13 | FAQ | `faq.accordion` | shared ×5 |
| 14 | FOOTER | `footer.footer` | shared ×8 |

## Section reference

### NAV

_Global navigation chrome_

**`nav.navbar`** — Fixed glass navbar: wordmark, primary route links, Log in / Download actions, hamburger menu below the 880px breakpoint.

· Every route. · appears on 8 routes · implemented by `Navbar.jsx`

### HERO

_Top-of-page opener_

**`hero.home`** — Homepage hero: WebGL glass-bars background with CSS fallback, animated announcement pill, display heading, sub-text, download actions.

· Homepage only. · appears on 1 routes · implemented by `Hero.jsx + HeroCanvas.jsx`

**`hero.page`** — Shared secondary-page hero: pill, heading, subtitle, actions and optional art/media slot; variants sheen / store / teams / plain set background and sizing.

· Secondary product pages that open with a standard page hero (store, pro, teams, AI, iOS). · appears on 5 routes · implemented by `PageHero.jsx (Store/Pro/Teams/Ai/Ios pass their own art: StoreArt, ProArt, TeamsOrbit, IosHeroArt)`

**`hero.windows-serif`** — Windows hero with serif display heading and embedded Windows download block.

· Windows page only. · appears on 1 routes · implemented by `pages/Windows.jsx > SerifHero (+ DownloadBlock.jsx)`

**`hero.pricing-art`** — Decorative soft-glow image positioned behind the pricing toggle; no animation.

· Pricing page only. · appears on 1 routes · implemented by `pages/Pricing.jsx > TopArt`

### SHOWCASE

_Large product mockup or media showcase_

**`showcase.shortcuts-frame`** — Framed macOS-style launcher mockup with dock, star-dot border and auto-advancing scripted slide reel.

· Homepage only. · appears on 1 routes · implemented by `ShortcutsFrame.jsx`

**`showcase.time-keyboard`** — Text column beside a masked 3D keyboard grid whose feature keys light up in a staggered sequence on scroll-in.

· Homepage only. · appears on 1 routes · implemented by `TimeKeyboard.jsx`

**`showcase.teams-slideshow`** — Autoplaying slideshow of team-workflow mockups.

· Teams page only. · appears on 1 routes · implemented by `pages/Teams.jsx > TeamsSlideshow`

**`showcase.ai-frame`** — Large framed AI chat showcase.

· Windows page only. · appears on 1 routes · implemented by `pages/Windows.jsx > AiShowcaseFrame`

**`showcase.game-launcher-marquee`** — Slow infinite marquee of game-launcher tiles paired with a split feature.

· Windows page only. · appears on 1 routes · implemented by `pages/Windows.jsx > GameLauncherMarquee`

**`showcase.phone-composite`** — Phone mockup composited over a wide band image.

· iOS page only. · appears on 1 routes · implemented by `pages/Ios.jsx > HeroArt + Phone`

**`showcase.full-bleed-image`** — Full-bleed wide image under a section title.

· iOS page only. · appears on 1 routes · implemented by `pages/Ios.jsx > Vis`

### CATALOG

_Browsable collections of extensions/templates_

**`catalog.extensions-carousel`** — Extensions carousel with sliding category pill, snap-scrolling cards, slide-in stagger and pager buttons.

· Homepage only. · appears on 1 routes · implemented by `ExtensionsCarousel.jsx`

**`catalog.extension-reel`** — Bare extension card reel (no category tabs or pager) with centered two-tone title and browse link.

· Windows page only. · appears on 1 routes · implemented by `ExtensionsCarousel.jsx > ExtensionReel`

**`catalog.featured-grid`** — Featured extensions block: headings over a three-card grid.

· Store page only. · appears on 1 routes · implemented by `pages/Store.jsx > FeaturedExtensionCard`

**`catalog.store-toolbar`** — Store search / filter / sort toolbar.

· Store page only. · appears on 1 routes · implemented by `pages/Store.jsx > StoreToolbar`

**`catalog.store-grid`** — Paginated grid of store extension cards.

· Store page only. · appears on 1 routes · implemented by `pages/Store.jsx > StoreExtensionCard + Pagination`

**`catalog.template-grid`** — Grid of team templates under a centered lead.

· Teams page only. · appears on 1 routes · implemented by `pages/Teams.jsx > TemplateGrid`

**`catalog.coming-soon-grid`** — Grid of upcoming-feature tiles.

· Windows page only. · appears on 1 routes · implemented by `pages/Windows.jsx > SoonCard`

### FEATURE

_Feature explanation blocks and section headings_

**`feature.ai-bento`** — Homepage-style AI section: header plus one wide and two half cards in a bento grid with in-card scripted workflow.

· Homepage and Pro page. · appears on 2 routes · implemented by `AiBento.jsx`

**`feature.ai-card-grid`** — Masonry grid of AI cards of varying heights.

· AI page only. · appears on 1 routes · implemented by `AiBento.jsx > AiCard`

**`feature.ai-wide-visual`** — AI header over a single wide card visual.

· AI page only. · appears on 1 routes · implemented by `AiBento.jsx > AiHeader + AiCard`

**`feature.ai-card-pairs`** — AI header over a two-by-two card grid with an arrow link.

· AI page only. · appears on 1 routes · implemented by `AiBento.jsx > AiHeader + AiCard`

**`feature.ai-chip-tabs`** — Row of chip tabs switching the AI stage below the hero.

· AI page only. · appears on 1 routes · implemented by `pages/Ai.jsx > AiChipTabs`

**`feature.byok-row`** — Bring-your-own-key row under the AI card grid.

· AI page only. · appears on 1 routes · implemented by `pages/Ai.jsx > ByokRow`

**`feature.model-tabs`** — Tabbed model picker with detail panel in a wide shell.

· Pro page only. · appears on 1 routes · implemented by `pages/Pro.jsx > ModelTabs`

**`feature.automation`** — Automation cards: snippet typing composer, quick links mock and hotkey press showcase.

· Homepage only. · appears on 1 routes · implemented by `Automation.jsx`

**`feature.feature-wall`** — Clickable feature text wall with crossfading screenshot frame and timed progress bar.

· Homepage only. · appears on 1 routes · implemented by `FeatureWall.jsx`

**`feature.developer-grid`** — Hairline developer/API grid with dotted figure cells and per-figure scroll animations.

· Homepage only. · appears on 1 routes · implemented by `DeveloperGrid.jsx`

**`feature.section-title`** — Standalone section heading (optional eyebrow and body) introducing the content that follows.

· Pro and iOS pages, repeated within a page. · appears on 2 routes · implemented by `shared.jsx > SectionTitle`

**`feature.centered-lead`** — Centered heading and short body introducing a section on older-style pages.

· Teams and Windows pages. · appears on 2 routes · implemented by `CenteredLead.jsx`

**`feature.split`** — Text column beside a visual; side and head style vary by prop.

· Pro, teams, AI, Windows and iOS pages, often several per page. · appears on 5 routes · implemented by `SplitFeature.jsx`

**`feature.media-card-grid`** — Grid of feature cards each pairing a visual with text; pro / windows / ios variants.

· Pro, Windows and iOS pages. · appears on 3 routes · implemented by `MediaCard.jsx`

**`feature.hotkeys-banner`** — Wide banner showing a hotkey combination.

· Windows page only. · appears on 1 routes · implemented by `pages/Windows.jsx > HotkeysBanner`

### PROOF

_Social proof: testimonials, community, logos, quotes_

**`proof.testimonials`** — Person carousel with auto-advance and click-select, plus quote panel and highlight grid.

· Homepage only. · appears on 1 routes · implemented by `Testimonials.jsx`

**`proof.community`** — Community section: two social cards plus a draggable video thumbnail strip.

· Homepage only. · appears on 1 routes · implemented by `Community.jsx`

**`proof.social-cards`** — The two community social cards on their own, without the video strip.

· Teams page only. · appears on 1 routes · implemented by `Community.jsx > SocialCards`

**`proof.logo-strip`** — Row of customer logo placeholders.

· Teams page only. · appears on 1 routes · implemented by `pages/Teams.jsx > LogoStrip`

**`proof.quote-strip`** — Strip of short user quotes with chip highlights.

· Windows page only. · appears on 1 routes · implemented by `pages/Windows.jsx > QuoteStrip`

### PRICING

_Plans and plan comparison_

**`pricing.plans`** — Plan section: monthly/yearly toggle, tier cards, tier switch and enterprise card.

· Pricing, Pro, AI and Teams pages. · appears on 4 routes · implemented by `PricingSection.jsx`

**`pricing.compare-table`** — Full feature comparison table across tiers.

· Pricing page only. · appears on 1 routes · implemented by `pages/Pricing.jsx > PricingTable`

**`pricing.pro-upsell`** — Pro upsell block for teams.

· Teams page only. · appears on 1 routes · implemented by `pages/Teams.jsx > ProUpsell`

### FAQ

_Question-and-answer blocks_

**`faq.accordion`** — Question-and-answer accordion with heading.

· Pricing, Pro, AI, Windows and iOS pages. · appears on 5 routes · implemented by `FaqAccordion.jsx`

### CTA

_Download / call-to-action blocks_

**`cta.final-keyboard`** — Final call to action over a large keyboard whose Cmd and Space keys glow at high visibility.

· Homepage only. · appears on 1 routes · implemented by `FinalCta.jsx`

**`cta.download`** — Platform download block (mac / windows / ios variants; iOS adds a QR card).

· Teams and iOS pages. · appears on 2 routes · implemented by `DownloadBlock.jsx`

**`cta.windows-final`** — Windows closing call to action: centered lead over the Windows download block, no keyboard art.

· Windows page only. · appears on 1 routes · implemented by `CenteredLead.jsx + DownloadBlock.jsx`

### FOOTER

_Global footer chrome_

**`footer.footer`** — Site footer: link columns, newsletter row, legal line, decorative background art (art prop selects cube or windows variant).

· Every route. · appears on 8 routes · implemented by `Footer.jsx`
