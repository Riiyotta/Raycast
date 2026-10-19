import { useState } from 'react'
import CenteredLead from '../components/CenteredLead.jsx'
import DownloadBlock from '../components/DownloadBlock.jsx'
import MediaCard, { MockWindow } from '../components/MediaCard.jsx'
import SplitFeature, { PairHead } from '../components/SplitFeature.jsx'
import FaqAccordion from '../components/FaqAccordion.jsx'
import { ExtensionReel } from '../components/ExtensionsCarousel.jsx'
import { AppTile, Badge, Icon, Key } from '../components/shared.jsx'

/* /windows (PAGES_SPEC 4). <main> sections use 158px top padding at 1440.
   Page-only: SerifHero, HotkeysBanner, AiShowcaseFrame, QuoteStrip, GameLauncherMarquee, ComingSoonGrid. */

/* ---------- SerifHero ---------- */
const SERIF_LINE = 'For Windows' // 11c
function SerifHero() {
  return (
    <section className="relative flex flex-col items-center px-4 pb-[100px] pt-[150px] sm:pb-[176px] sm:pt-[325px]">
      {/* Video button: 536x404 thumbnail behind the title, shifted -268px (translateX(-50%)) */}
      <button
        type="button"
        aria-label="Play the intro video"
        className="group absolute left-1/2 top-[150px] hidden h-[404px] w-[536px] -translate-x-1/2 sm:top-[220px] sm:block"
      >
        <span
          className="absolute inset-0 rounded-lg opacity-60 shadow-[0_0_250px_rgba(255,255,255,.2)] transition-opacity duration-200 group-hover:opacity-80"
          style={{ background: 'radial-gradient(70% 70% at 50% 40%, rgba(86,194,255,.18), rgba(17,18,20,.9))' }}
        />
        <Icon name="play" size={55} className="absolute left-1/2 top-[38%] h-[55px] w-[52px] -translate-x-1/2 -translate-y-1/2 text-white opacity-90 transition-opacity duration-200 group-hover:opacity-100" />
      </button>

      <h1 className="pointer-events-none relative grid text-center font-serif text-[86px] font-normal leading-none tracking-[-2px] sm:text-[168px] sm:leading-[168px]" aria-label={SERIF_LINE}>
        {['text-white', 'text-white/80', 'text-white/60', 'text-white/40'].map((c, i) => (
          <span key={i} aria-hidden className={`serif-band serif-band-${i + 1} whitespace-nowrap ${c}`}>{SERIF_LINE}</span>
        ))}
      </h1>

      {/* Mock launcher window 706x475, overlapping the title by 22px, clipped to a 214px reveal */}
      <div className="relative -mt-[22px] h-[100px] w-full max-w-[706px] animate-fadeInUp overflow-hidden sm:h-[214px]">
        <div className="h-[475px] rounded-[18px] border border-window-border" style={{ background: 'linear-gradient(137deg, rgba(17,18,20,.88) 24.87%, #1d1d1d 95%)' }}>
          <div className="flex h-14 items-center gap-3 border-b border-white/[.06] px-5 text-[16px] text-white/40">
            Search for apps and commands
            <span className="caret-blink -ml-2 h-5 w-px bg-white/70" />
          </div>
          <MockWindow rows={4} hue={200} className="m-3 border-0 bg-transparent" />
        </div>
      </div>

      <p className="mt-6 max-w-[420px] animate-fadeInUp text-center text-[18px] leading-[28.8px] tracking-ui text-grey-200">
        The launcher you know, rebuilt for the other desktop. Same keys, same speed.
      </p>
      <DownloadBlock variant="windows" className="mt-6 animate-fadeInUp" />
    </section>
  )
}

/* ---------- Feature wall (MediaCard windows x8) ---------- */
const WALL = [
  ['Launch anything in two keystrokes', 'Instant search', 'search', true],
  ['Clipboard history', 'Unlimited on Plus', 'clip'],
  ['Snap windows into tidy layouts', 'Multi screen', 'window'],
  ['Snippets that expand anywhere', 'Works in every app', 'note'],
  ['Calculator and unit converter', 'Built in', 'hash'],
  ['Quick links to folders and sites', 'One hotkey each', 'arrow-ne'],
  ['Emoji and symbol search', 'Skin tones', 'star'],
]

function HotkeysBanner() {
  return (
    <div className="flex flex-col gap-4 rounded-md border border-card-border bg-card p-8 shadow-inset-top lg:min-h-[189px] lg:flex-row lg:items-center lg:justify-between">
      <div className="flex max-w-[500px] flex-col gap-4">
        <h3 className="text-[20px] font-medium leading-normal tracking-ui text-white">
          Bind any command
          <br />
          to a hotkey
        </h3>
        <Badge size="sm" icon="cmd">Global shortcuts</Badge>
      </div>
      <div className="scrollbar-none flex h-[106px] max-w-full items-center gap-2.5 overflow-x-auto lg:w-[622px] lg:justify-end">
        {[['', 'ctrl', 120], ['', 'alt', 100], ['', 'space', 230], ['', 'L', 90]].map(([a, l, w], i) => (
          <Key key={i} width={w} alt={a} label={l} className="!h-[90px] !text-[18px]" />
        ))}
      </div>
    </div>
  )
}

/* ---------- AiShowcaseFrame ---------- */
function AiShowcaseFrame() {
  return (
    <section className="relative flex flex-col items-center gap-16 pt-[90px] sm:gap-[120px] sm:pt-[280px]">
      <div className="flex max-w-[456px] flex-col items-center gap-4 text-center">
        <span className="inline-flex h-[22px] items-center rounded-sm bg-grey-600 px-1.5 text-[14px] font-medium leading-[22.4px] text-white">AI chat</span>
        <h2 className="text-[20px] font-medium leading-7 tracking-ui text-white">
          Ask a model right from the bar, on any screen you use
        </h2>
      </div>
      <div className="relative w-full max-w-container rounded-lg border border-white/[.08] bg-black/[.44] p-2 shadow-[inset_0_.5px_rgba(255,255,255,.3)]">
        <div className="relative h-[300px] overflow-hidden rounded-md border border-white/[.08] bg-grey-900 sm:h-[475px]">
          <div className="absolute inset-0 opacity-80" style={{ background: 'radial-gradient(60% 80% at 50% 100%, rgba(154,170,255,.25), transparent), repeating-linear-gradient(90deg, rgba(255,255,255,.02) 0 1px, transparent 1px 64px)' }} />
          <div className="absolute left-1/2 top-1/2 w-[92%] max-w-[750px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[18px] border border-window-border" style={{ background: 'linear-gradient(rgba(0,0,0,.4), rgba(0,0,0,.4)), linear-gradient(160deg, #2a2a2e, #141416)' }}>
            <div className="flex h-16 items-center gap-3 border-b border-white/[.06] px-5 text-[15px] text-white/70">
              <Icon name="chat" size={16} />
              New chat
            </div>
            <div className="flex flex-col gap-3 p-5 text-[14px] leading-[1.6]">
              <p className="self-end rounded-lg bg-white/[.08] px-3 py-2 text-white/80">What changed in the release notes this week?</p>
              <p className="max-w-[560px] text-white/60">Three things: a faster file search, a new window layout for wide screens, and fixes for clipboard sync on older machines.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- QuoteStrip ---------- */
const PEOPLE = Array.from({ length: 20 }, (_, i) => ({
  name: ['Ada Moss', 'Rui Tan', 'Lena Park', 'Omar Haddad', 'Ivy Chen', 'Tomas Berg', 'Noor Ali', 'Kai Rivers', 'Sara Lind', 'Jon Pike'][i % 10],
  title: ['Designer', 'Staff engineer', 'Product lead', 'Founder', 'Support manager', 'Data analyst', 'Writer'][i % 7],
  hue: (i * 37) % 360,
}))
const QUOTES = [
  'I switched machines for work and the first thing I installed was this. Every hotkey I had was back within a minute and nothing felt slower than before.',
  'It replaced four small utilities on my desktop. Clipboard, snippets and window layouts now live in one bar that opens instantly every time.',
]
function QuoteStrip() {
  const [active, setActive] = useState(9)
  const STEP = 220
  return (
    <section className="flex flex-col items-center gap-14 overflow-hidden px-4 pb-[100px] pt-[100px] sm:pt-[158px]">
      <p className="max-w-[680px] text-center text-[16px] font-medium leading-7 text-white/60">{QUOTES[active % 2]}</p>
      <div className="w-full max-w-[1408px] overflow-hidden">
        <div className="flex transition-transform duration-600 ease-out" style={{ transform: `translateX(calc(50% - ${active * STEP + STEP / 2}px))` }}>
          {PEOPLE.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`flex w-[220px] flex-none items-center gap-6 px-3 text-left transition-opacity duration-600 ease-in-out ${i === active ? 'opacity-100' : 'opacity-20 hover:opacity-50'}`}
            >
              <span className="h-12 w-12 flex-none rounded-full border border-grey-600" style={{ background: `radial-gradient(circle at 35% 30%, hsl(${p.hue} 60% 65%), hsl(${p.hue} 50% 25%))` }} />
              <span className="flex flex-col">
                <span className="text-[14px] font-medium leading-[18px] text-white">{p.name}</span>
                <span className="text-[14px] font-medium leading-[22.4px] text-grey-300">{p.title}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- GameLauncherMarquee: 2 rows of 56px tiles, 120s, 512px per loop (8 tiles) ---------- */
function MarqueeRow({ dir, offset }) {
  const tiles = Array.from({ length: 24 }, (_, i) => (i % 8) * 45 + offset)
  return (
    <div className={`flex w-max gap-2 ${dir === 'l' ? 'animate-marqueeL' : 'animate-marqueeR'}`}>
      {tiles.map((h, i) => (
        <span key={i} className="grid h-14 w-14 flex-none place-items-center rounded-md border border-card-border bg-card p-2">
          <AppTile size={38} hue={h % 360} radius="8px" />
        </span>
      ))}
    </div>
  )
}
function GameLauncherMarquee() {
  return (
    <div className="mask-marquee flex h-[248px] w-full max-w-[586px] flex-col justify-center gap-2 overflow-hidden">
      <MarqueeRow dir="l" offset={0} />
      <MarqueeRow dir="r" offset={20} />
    </div>
  )
}

/* ---------- ComingSoonGrid ---------- */
function SoonCard({ title, tall, hue }) {
  return (
    <div className={`flex flex-col rounded-md border border-card-border bg-card shadow-inset-top ${tall ? 'lg:h-[492px]' : 'lg:h-[234px]'}`}>
      <div className="flex-1 px-6 pt-6">
        <div className="h-full min-h-[120px] rounded-t-md border border-b-0 border-white/[.06]" style={{ background: `radial-gradient(70% 80% at 50% 100%, hsl(${hue} 60% 50% / .2), transparent), #0c0d0f` }} />
      </div>
      <h3 className="p-6 text-center text-[14px] font-medium leading-[21px] tracking-ui text-white">{title}</h3>
    </div>
  )
}

const FAQ = [
  ['Which versions of Windows are supported?', 'Windows 11 on 64-bit machines, including ARM devices. Older versions are not supported because they lack the system hooks the launcher relies on for global hotkeys.'],
  ['Can I use my existing account?', 'Yes. Sign in with the same account you use on the Mac and your synced settings, snippets and quick links arrive automatically.'],
  ['Is it free?', 'The core launcher is free. Plus features such as unlimited clipboard history and larger models work the same way they do on every other platform.'],
  ['Do plugins work on Windows?', 'Most plugins from the store work without changes. Plugins that depend on Mac-only system features are marked clearly on their store page.'],
  ['How do I report a bug?', 'Open the launcher, type feedback and press enter. Your report includes the app version and you can attach a screenshot before sending it.'],
]

export default function Windows() {
  return (
    <main className="overflow-x-clip">
      <SerifHero />

      <section className="mx-auto max-w-ext-top px-4 pt-[100px] sm:px-6 sm:pt-[158px]">
        <CenteredLead variant="windows" maxClass="sm:max-w-[60%]" title="Built in from the start" body="Nothing extra to install first." />
        <div className="mt-14 grid gap-8 sm:grid-cols-2 sm:gap-10">
          {WALL.map(([t, b, i, wide], n) => (
            <MediaCard key={t} variant="windows" title={t} badge={b} icon={i} wide={wide} hue={(n * 47 + 200) % 360} poster={<MockWindow rows={wide ? 6 : 3} hue={(n * 47 + 200) % 360} />} />
          ))}
        </div>
        <div className="mt-10">
          <HotkeysBanner />
        </div>
      </section>

      <div className="mx-auto max-w-ext-top px-4 sm:px-6">
        <AiShowcaseFrame />
      </div>

      <QuoteStrip />

      <section className="mx-auto max-w-ext-top px-4 py-[50px] sm:px-6 sm:py-[158px]">
        <SplitFeature
          layoutClass="lg:flex-row lg:items-center lg:justify-between"
          gapClass="gap-6"
          textClass="max-w-[500px]"
          visual={<GameLauncherMarquee />}
          visualClass="w-full lg:w-[586px]"
        >
          <PairHead title="Your games, one key away" sub="Every title from every store you use, listed together and launched from the bar.">
            <p className="text-[14px] leading-[22.4px] text-grey-200">Library sync works with the most popular launchers and picks up new installs.</p>
          </PairHead>
        </SplitFeature>
      </section>

      <ExtensionReel
        className="py-[50px] sm:py-[158px]"
        link="Browse all the plugins"
        title={
          <h2 className="px-6 text-center text-[20px] font-medium leading-7 tracking-ui text-white">
            Your plugins <span className="text-white/60">came with you</span>
          </h2>
        }
      />

      <section className="mx-auto max-w-ext-top px-4 py-[100px] sm:px-6 sm:py-[158px]">
        <CenteredLead variant="windows" maxClass="max-w-[438px]" title="More is on its way this year" body="We are bringing over the rest of the features one at a time. Here is what comes next." />
        <div className="mt-12 grid gap-6 opacity-80 lg:grid-cols-[385px_385px_385px]">
          <div className="flex flex-col gap-6">
            <SoonCard title="Shared team spaces" hue={210} />
            <SoonCard title="Scripting with your own commands" hue={30} />
          </div>
          <SoonCard tall title="Native notes" hue={330} />
          <div className="flex flex-col gap-6">
            <SoonCard title="Calendar" hue={140} />
            <SoonCard title="Focus sessions and timers" hue={260} />
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center gap-10 px-4 py-[50px] sm:gap-20 sm:pb-[224px] sm:pt-[104px]">
        <CenteredLead variant="windows" maxClass="max-w-[436px]" title="Give it a try on your Windows machine" body="It takes under a minute to install." />
        <DownloadBlock variant="windows" />
      </section>

      <section className="px-4 pb-8 pt-24" style={{ background: 'radial-gradient(48.42% 36.85% at 53% 48%, rgba(255,255,255,.04), transparent)' }}>
        <FaqAccordion heading="18" title="Frequently asked questions" items={FAQ} />
      </section>
    </main>
  )
}
