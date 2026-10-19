import { useEffect, useRef, useState } from 'react'
import PageHero, { HeroPill } from '../components/PageHero.jsx'
import CenteredLead from '../components/CenteredLead.jsx'
import SplitFeature, { TeamsHead } from '../components/SplitFeature.jsx'
import PricingSection, { BlockCta } from '../components/PricingSection.jsx'
import DownloadBlock from '../components/DownloadBlock.jsx'
import { SocialCards } from '../components/Community.jsx'
import { MockWindow } from '../components/MediaCard.jsx'
import { AppTile, Icon, LightButton } from '../components/shared.jsx'

/* /teams (PAGES_SPEC 4). Everything sits in a 1204 container with pad 0 32 (390: 0 24).
   Page-only: TeamsOrbit, LogoStrip, TeamsSlideshow, ProUpsell, TemplateGrid. */

/* ---------- TeamsOrbit: rings 759 / 599, 28 nodes rotating 180s, icons counter-rotate ---------- */
const NODES = Array.from({ length: 28 }, (_, i) => ({
  r: i % 2 ? 302 : 382,
  rot: 25 + ((i * 113) % 311),
  dir: i % 3 ? 'l' : 'r',
  size: 21 + (i % 8),
  hue: (i * 53) % 360,
}))
function TeamsOrbit() {
  return (
    <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[664px] w-[274px] -translate-x-1/2 overflow-visible sm:h-[1208px] sm:w-[1140px]">
      <div className="absolute left-1/2 top-[47%] h-0 w-0 scale-[.45] sm:scale-100">
        <svg width="759" height="759" viewBox="0 0 759 759" className="absolute -left-[379.5px] -top-[379.5px]">
          <defs>
            <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity=".14" />
              <stop offset=".5" stopColor="#9bd0f5" stopOpacity=".05" />
              <stop offset="1" stopColor="#fff" stopOpacity=".12" />
            </linearGradient>
          </defs>
          <circle cx="379.5" cy="379.5" r="379" fill="none" stroke="url(#ring)" />
          <circle cx="379.5" cy="379.5" r="299.5" fill="none" stroke="url(#ring)" />
        </svg>
        {NODES.map((n, i) => (
          <div
            key={i}
            className={`absolute left-0 top-0 h-0 origin-left orbit-${n.dir}`}
            style={{ width: n.r, '--rotation': `${n.rot}deg` }}
          >
            <span className="orbit-icon absolute right-0 top-0 block">
              <AppTile size={n.size} hue={n.hue} radius="50%" />
            </span>
          </div>
        ))}
      </div>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(30% 25% at 50% 47%, #07080a 40%, transparent)' }} />
    </div>
  )
}

/* ---------- LogoStrip: 6 neutral wordmark placeholders at opacity .6 ---------- */
const LOGOS = [['Northwind', 120], ['Halcyon', 104], ['Brightline Labs', 163], ['Ovo', 93], ['Kestrel & Co', 140], ['Meridian', 112]]
function LogoStrip() {
  return (
    <div className="flex flex-col items-center gap-6 text-center sm:min-h-[193px]">
      <p className="text-[16px] font-medium leading-6 tracking-[-.05px] text-white/60">Trusted by crews at</p>
      <ul className="flex flex-wrap justify-center gap-6">
        {LOGOS.map(([n, w]) => (
          <li key={n} className="flex h-[33px] items-center justify-center text-[20px] font-bold tracking-tight text-white opacity-60 transition-opacity duration-200 hover:opacity-100" style={{ width: w }}>
            {n}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ---------- Visual placeholder (506x272 / 506x213) ---------- */
function Panel({ h = 272, hue = 210 }) {
  return (
    <div className="relative w-full overflow-hidden rounded-md border border-card-border shadow-inset-top" style={{ height: h, background: `radial-gradient(80% 90% at 30% 0, hsl(${hue} 70% 50% / .25), transparent), #0c0d0f` }}>
      <MockWindow rows={h > 250 ? 4 : 3} hue={hue} className="absolute left-8 right-8 top-8" />
    </div>
  )
}

/* ---------- TeamsSlideshow: 1140x640 frame, 3 slides, autoplay ~6.05s, .3s ease-out ---------- */
const SLIDES = [
  ['Shared snippets', 'Write a reply once and let the whole team paste it with the same short keyword from any app.'],
  ['Shared plugins', 'Publish internal tools to a private store so new hires find everything they need on their first day.'],
  ['Shared links', 'Collect the dashboards, docs and boards your team opens daily and launch each one with two keys.'],
]
function TeamsSlideshow() {
  const [i, setI] = useState(0)
  const timer = useRef()
  useEffect(() => {
    timer.current = setTimeout(() => setI((n) => (n + 1) % SLIDES.length), 6050)
    return () => clearTimeout(timer.current)
  }, [i])
  return (
    <div className="flex flex-col gap-6">
      <div className="h-[240px] overflow-hidden rounded-md border border-card-border bg-slideshow shadow-inset-top sm:h-[640px]">
        <div className="flex h-full transition-[margin-left] duration-300 ease-out" style={{ width: '300%', marginLeft: `-${i * 100}%` }}>
          {SLIDES.map(([t], n) => (
            <div key={t} className="grid h-full w-1/3 place-items-center p-6 sm:p-16">
              <MockWindow rows={6} hue={220 + n * 40} className="w-full max-w-[720px] bg-black/60" />
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {SLIDES.map(([t, b], n) => (
          <button
            key={t}
            type="button"
            aria-pressed={n === i}
            onClick={() => setI(n)}
            className={`flex min-h-[207px] flex-col gap-4 rounded-md border p-8 text-left transition-colors duration-200 ${n === i ? 'border-card-border bg-grey-800 shadow-inset-top' : 'border-transparent bg-transparent'}`}
          >
            <Icon name={['clip', 'grid', 'bolt'][n]} size={25} className="text-white" />
            <span className="text-[16px] font-medium leading-6 text-white">{t}</span>
            <span className="text-[14px] font-medium leading-5 text-grey-200">{b}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ---------- ProUpsell ---------- */
const UPSELL = [
  ['Unlimited history', 'Everything you copy stays searchable, with filters for links, colors and files.'],
  ['Larger models', 'Use the bigger assistants for long drafts, code reviews and research questions.'],
  ['Cloud sync built in', 'Settings and snippets follow every member to each of their machines safely.'],
]
function ProUpsell() {
  return (
    <section className="flex flex-col items-center pt-[160px] text-center sm:min-h-[1841px] sm:pt-[248px]">
      <h3 className="text-[32px] font-semibold leading-[35.2px] text-white sm:text-[52px] sm:leading-[57.2px]">
        Every seat gets <span className="text-pro-glyph">Pro</span>
        <br />
        tools too
      </h3>
      <p className="mt-6 max-w-[800px] text-[20px] leading-7 tracking-link text-white/60">
        Members on a team plan get the full personal upgrade as well, from longer history to larger models and themes.
      </p>
      <div className="mt-6">
        <HeroPill tone="pink" href="/pro">See what is in it</HeroPill>
      </div>
      <div className="relative mt-12 w-full max-w-[1076px]">
        <div className="h-[260px] rounded-md border border-white/10 shadow-inset-top sm:h-[503px]" style={{ background: 'radial-gradient(60% 70% at 50% 0, rgba(255,226,226,.12), transparent), linear-gradient(160deg, #1a1b20, #0c0d0f)' }} />
        <div className="absolute left-1/2 top-1/2 h-[232px] w-[220px] -translate-x-1/2 -translate-y-[45%] rounded-md bg-white/[.04] blur-[12px] sm:h-[465px] sm:w-[441px]" />
        <div className="absolute left-1/2 top-1/2 w-[270px] -translate-x-1/2 -translate-y-[45%] sm:w-[538px]">
          <MockWindow rows={7} hue={350} className="bg-grey-800/90" />
        </div>
      </div>
      <div className="mt-16 grid w-full max-w-[1075px] gap-8 md:grid-cols-3">
        {UPSELL.map(([t, b], n) => (
          <div key={t} className="flex min-h-[348px] flex-col gap-4 rounded-lg bg-card p-4 text-left shadow-inset-top">
            <div className="h-[159px] rounded-md" style={{ background: `radial-gradient(70% 90% at 50% 0, hsl(${n * 70 + 200} 60% 50% / .3), transparent), #111214` }} />
            <h4 className="text-[18px] font-semibold leading-[27px] text-white">{t}</h4>
            <p className="text-[14px] font-medium leading-5 text-grey-200">{b}</p>
          </div>
        ))}
      </div>
      <BlockCta className="mt-12">Compare personal plans</BlockCta>
    </section>
  )
}

/* ---------- TemplateGrid ---------- */
const TEMPLATES = [
  ['Support team kit', 'Reply snippets, a ticket lookup command and links to the help center, ready for new agents.'],
  ['Engineering starter pack', 'Deploy commands, log search and on-call links bundled so every engineer starts from the same place.'],
  ['Design ops', 'Shortcuts for the design files, asset folders and review boards your whole crew opens all day long.'],
]
function TemplateGrid() {
  return (
    <div className="flex flex-col items-center">
      <div className="mt-12 grid w-full max-w-[1139px] gap-8 md:grid-cols-3 md:gap-16">
        {TEMPLATES.map(([t, b], n) => (
          <div key={t} className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="h-[160px] w-full max-w-[273px] rounded-md border border-card-border" style={{ background: `radial-gradient(70% 80% at 50% 100%, hsl(${n * 90 + 20} 70% 55% / .25), transparent), #0c0d0f` }} />
            <h3 className="text-[16px] font-medium leading-6 text-white">{t}</h3>
            <p className="text-[14px] font-medium leading-5 text-white/60">{b}</p>
          </div>
        ))}
      </div>
      <a href="#" className="mt-8 inline-flex h-8 w-[224px] items-center justify-center gap-2 rounded-sm bg-white/90 px-4 py-2 text-[14px] font-medium leading-4 tracking-ui text-black transition-transform duration-100 ease-in-out active:scale-[.97]">
        <Icon name="grid" size={14} />
        Browse all the templates
      </a>
    </div>
  )
}

export default function Teams() {
  return (
    <main className="overflow-x-clip">
      <div className="mx-auto max-w-container px-6 sm:px-8">
        <PageHero
          variant="teams"
          art={<TeamsOrbit />}
          pill={<HeroPill tone="teams">New: private stores for every crew</HeroPill>}
          title="Shortcuts for the team"
          subtitle="Share plugins, snippets and links with everyone you work with and keep new hires up to speed."
          actions={
            <div className="flex flex-col items-center gap-4">
              <LightButton icon={null} className="w-[143px]">Start a free trial</LightButton>
              <a href="#features" className="group flex h-[46px] w-[76px] flex-col items-center justify-center gap-1 text-[14px] font-medium leading-[16.1px] text-white/40 transition-colors duration-200 hover:text-white">
                Learn more
                <Icon name="chevron-down" size={14} />
              </a>
            </div>
          }
        />
        <LogoStrip />

        <div id="features" className="sm:min-h-[376px]">
          <CenteredLead title="One place for the tools your team shares" body="Stop pasting the same links in chat. Give everyone the same commands, replies and plugins from day one." />
        </div>

        <SplitFeature
          className="pt-12 sm:min-h-[408px] sm:pt-0"
          layoutClass="lg:grid lg:grid-cols-[506px_506px] lg:items-center lg:justify-between"
          gapClass="gap-6 lg:gap-x-16"
          textClass="lg:px-8"
          visual={<Panel h={272} hue={210} />}
        >
          <TeamsHead
            eyebrow="Shared commands"
            title="Ship a command once and every member has it a second later"
            p1="Publish snippets, quick links and scripts to the team space. Updates arrive for everyone automatically, so nobody runs an old copy of a tool or pastes a stale reply into a customer chat."
            p2="Owners decide who can publish and who can only install, with a short review step."
            link="See how sharing works"
          />
        </SplitFeature>

        <div className="pt-16 sm:min-h-[1151px] sm:pt-0">
          <TeamsSlideshow />
        </div>

        <SplitFeature
          reverse
          className="pt-16 sm:min-h-[472px] sm:pt-0"
          layoutClass="lg:flex-row lg:items-center lg:justify-between"
          gapClass="gap-6 lg:gap-16"
          textClass="lg:w-[506px] lg:px-8"
          visualClass="lg:w-[506px]"
          visual={<Panel h={272} hue={260} />}
        >
          <TeamsHead
            eyebrow="Private plugin store"
            icon="lock"
            title="Keep internal tools inside the team, away from the public hub"
            p1="Build plugins for your own systems and list them in a store that only members can see. Install counts and versions are tracked for every release."
            p2="New hires get the full set the first time they sign in."
            link="Read the publishing guide"
          />
        </SplitFeature>

        <SplitFeature
          className="pt-16 sm:min-h-[432px] sm:pt-0"
          layoutClass="lg:flex-row lg:items-center lg:justify-between"
          gapClass="gap-6 lg:gap-16"
          textClass="lg:w-[506px] lg:px-8"
          visualClass="lg:w-[506px]"
          visual={<Panel h={213} hue={150} />}
        >
          <TeamsHead
            eyebrow="Admin and billing"
            icon="shield"
            title="Add seats, remove seats and see usage in one console"
            p1="Invite people by link or by domain, assign roles and keep one invoice for the whole team."
            p2="Seats free up on their own when people leave."
            link="Visit the admin docs"
          />
        </SplitFeature>

        <ProUpsell />

        <section>
          <CenteredLead className="mb-12" title="Plans for every team" body="Start small and add seats when your crew grows." />
          <PricingSection className="!pb-0" />
        </section>

        <section className="pt-[88px]">
          <CenteredLead title="Start with a template made for teams like yours" body="Pick a ready-made bundle of snippets, links and plugins for your function, then tweak it to match how you work." />
          <TemplateGrid />
        </section>

        <section className="pt-[256px] sm:min-h-[868px]">
          <DownloadBlock variant="mac" title="Ready when you are" body="Install it on your Mac, invite the team and share your first command today." />
        </section>
      </div>

      <section className="flex justify-center py-[120px]">
        <SocialCards title="Talk to the crew" subtitle="Ask questions, share team setups and swap tips with other admins in our spaces." />
      </section>
    </main>
  )
}
