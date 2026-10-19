import PageHero from '../components/PageHero.jsx'
import SplitFeature from '../components/SplitFeature.jsx'
import MediaCard from '../components/MediaCard.jsx'
import DownloadBlock, { QrCard } from '../components/DownloadBlock.jsx'
import FaqAccordion from '../components/FaqAccordion.jsx'
import { AppTile, DarkButton, Icon, LightButton, SectionTitle, useInView } from '../components/shared.jsx'

/* /ios (PAGES_SPEC 4). Sections use a 1067 shell (content 1019), pad 168 24 (390: 96 16), heading gap 64.
   Page-only: HeroArt, Phone, GlassVisual, bento layouts. */

const SHELL = 'mx-auto max-w-[1067px] px-4 py-24 sm:px-6 sm:py-[168px]'

// 800x500 (300 tall at 390): 300x300 radius-100 blurred disk, 140 tile at .8, 108 tile on top
function HeroArt() {
  return (
    <div aria-hidden className="relative grid h-[300px] w-full max-w-[800px] place-items-center sm:-mb-[18px] sm:h-[500px] sm:w-[800px]">
      <span className="absolute h-[300px] w-[300px] rounded-[100px] blur-[5px]" style={{ background: 'radial-gradient(closest-side, rgba(255,99,99,.25), rgba(86,194,255,.08) 70%, transparent)' }} />
      <span className="absolute opacity-80 blur-[2px]"><AppTile size={140} hue={350} radius="24%" /></span>
      <span className="relative"><AppTile size={108} hue={350} radius="24%" /></span>
    </div>
  )
}

// Phone placeholder (natural 640x1386 ratio)
function Phone({ className = '', hue = 220 }) {
  return (
    <div className={`relative aspect-[640/1386] rounded-[48px] border-[6px] border-[#1d1e20] bg-grey-900 shadow-[0_30px_80px_rgba(0,0,0,.6)] ${className}`}>
      <span className="absolute left-1/2 top-3 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
      <div className="absolute inset-x-4 top-14 flex flex-col gap-3">
        <div className="h-10 rounded-xl border border-white/10 bg-white/[.04]" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <AppTile size={28} hue={(hue + i * 40) % 360} radius="26%" />
            <span className="h-2 rounded bg-white/15" style={{ width: `${70 - i * 6}%` }} />
          </div>
        ))}
      </div>
    </div>
  )
}

// 941x941 overflowing visual: frosted isometric panel over a phone; settles into the matrix when in view
function GlassVisual({ hue }) {
  const [ref, inView] = useInView(0.2, { once: true })
  return (
    <div ref={ref} className="relative mx-auto h-[300px] w-full max-w-[520px] lg:absolute lg:left-[331px] lg:top-[-47px] lg:h-[941px] lg:w-[941px] lg:max-w-none">
      <div
        className="absolute left-1/2 top-1/2 h-[60%] w-[60%] rounded-[48px] bg-white/[.01] shadow-[inset_0_0_0_1px_rgba(255,255,255,.06)] backdrop-blur-[25px]"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translate(-50%,-50%) matrix(.87,.5,-.87,.5,0,0)' : 'translate(-50%,-40%) matrix(.87,.5,-.87,.5,0,0)',
          transition: 'opacity 1.5s, transform 1s cubic-bezier(.05,.9,.1,1)',
          background: `radial-gradient(60% 60% at 50% 50%, hsl(${hue} 70% 55% / .12), rgba(255,255,255,.01))`,
        }}
      />
      <Phone hue={hue} className="absolute left-1/2 top-1/2 w-[190px] -translate-x-1/2 -translate-y-1/2 lg:w-[300px]" />
    </div>
  )
}

function SideFeature({ eyebrow, title, body, link, hue }) {
  return (
    <section className={`${SHELL} relative lg:!py-0`}>
      <SplitFeature
        className="relative lg:h-[700px]"
        layoutClass="lg:block"
        gapClass="gap-10"
        textClass="z-[1] max-w-[360px] lg:flex lg:h-full lg:flex-col lg:justify-center"
        visualClass="lg:!static"
        visual={<GlassVisual hue={hue} />}
      >
        <SectionTitle size={32} align="left" eyebrow={eyebrow} title={title} body={body} />
        <a href="#" className="mt-6 inline-block text-[16px] leading-[18.4px] text-white underline decoration-white/20 underline-offset-4 transition-[text-decoration-color] duration-100 ease-out hover:decoration-white">
          {link}
        </a>
      </SplitFeature>
    </section>
  )
}

function Vis({ h, hue = 210, children }) {
  return (
    <div className="relative grid w-full place-items-center overflow-hidden rounded-md" style={{ height: h, background: `radial-gradient(70% 70% at 50% 30%, hsl(${hue} 60% 50% / .18), transparent)` }}>
      {children}
    </div>
  )
}

const FAQ = [
  ['Is the phone app free?', 'Yes. The phone app is free to download and includes search, quick links and snippets. Plus features unlock automatically if your account already has them.'],
  ['Do I need the desktop app too?', 'No, but they work best together. Notes, snippets and quick links sync between both, so anything you save on one device shows up on the other.'],
  ['Which phones are supported?', 'Any phone running iOS 17 or later. Some widgets and keyboard features need iOS 18.'],
  ['How do I install the keyboard?', 'Open the app, follow the short setup guide and enable the keyboard in system settings. You can switch to it from the globe key at any time.'],
]

export default function Ios() {
  return (
    <main className="overflow-x-clip">
      <PageHero
        variant="ios"
        media={<HeroArt />}
        title={<span className="mx-auto block max-w-[520px]">All your shortcuts, in pocket</span>}
        subtitle="The launcher you love, made for the screen you carry."
        actions={
          <div className="flex gap-4">
            <LightButton size="lg" sub="Download on the" className="w-[127px]">Phone Store</LightButton>
            <DarkButton as="a" href="#" size="lg" sub="Also on the" className="w-[135px]">
              Watch Shelf
            </DarkButton>
          </div>
        }
      />

      <section className={`${SHELL} flex flex-col items-center gap-16`}>
        <SectionTitle
          size={32}
          eyebrow="Home"
          title="Everything a tap or two away"
          body="Search apps, run commands and open your saved links from one bar that is always one swipe down from any screen you use."
        />
        <div className="relative flex h-[520px] w-full items-center justify-center sm:h-[854px]">
          <div className="absolute left-1/2 top-1/2 h-[200px] w-[1209px] -translate-x-1/2 -translate-y-1/2 sm:h-[415px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(86,194,255,.12) 30%, rgba(255,99,99,.12) 70%, transparent)', WebkitMaskImage: 'linear-gradient(transparent, #000 30%, #000 70%, transparent)', maskImage: 'linear-gradient(transparent, #000 30%, #000 70%, transparent)' }} />
          <Phone className="relative w-[240px] sm:w-[395px]" />
        </div>
      </section>

      <SideFeature
        hue={210}
        eyebrow="Assistant"
        title="Every model, in a glass bar"
        body="Pick a model, ask a question and get an answer that you can copy, share or keep for later."
        link="See supported models"
      />

      <section className={SHELL}>
        <div className="grid gap-9 md:grid-cols-2">
          <MediaCard variant="ios" className="md:h-[558px]" title="Quick links" desc="Open the pages and apps you use every day with a single tap from the home bar." visual={<Vis h={364} hue={200}><Icon name="arrow-ne" size={48} className="text-white/30" /></Vis>} link="Learn about links" />
          <MediaCard variant="ios" className="md:h-[558px]" title="Snippets" desc="Type a short keyword and the full text appears, in any app with the keyboard." visual={<Vis h={364} hue={30}><Icon name="note" size={48} className="text-white/30" /></Vis>} />
          <div className="flex flex-col gap-9">
            <MediaCard variant="ios" className="md:h-[421px]" title="Notes that sync" desc="Jot something on the phone and it is waiting on the desktop by the time you sit down, with search across all of it." visual={<Vis h={230} hue={330} />} />
            <MediaCard variant="ios" className="md:h-[177px]" title="Widgets" desc="Pin your favorite commands to the home screen." footnote="Requires iOS 18 or later" />
          </div>
          <MediaCard variant="ios" className="md:h-[634px]" title="Shortcut actions" desc="Run any command from the system shortcut app or from the action button on supported phones." visual={<Vis h={463} hue={140}><Icon name="bolt" size={48} className="text-white/30" /></Vis>} link="Set up the button" />
        </div>
      </section>

      <section className="py-24 sm:py-[168px]">
        <div className="mx-auto max-w-[1067px] px-4 sm:px-6">
          <SectionTitle
            size={32}
            className="mx-auto max-w-[540px]"
            eyebrow="Voice dictation"
            title="Speak and it writes, cleanly, in any app"
            body={<>Dictate into any field with the keyboard and get tidy text back. <a href="#" className="text-white underline decoration-white/20 underline-offset-4">How it works</a></>}
          />
        </div>
        <div className="mt-16 h-[230px] w-full sm:h-[828px]" style={{ background: 'radial-gradient(50% 60% at 50% 50%, rgba(154,170,255,.16), transparent), repeating-linear-gradient(90deg, rgba(255,255,255,.04) 0 2px, transparent 2px 18px)', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 20%, #000 80%, transparent)', maskImage: 'linear-gradient(90deg, transparent, #000 20%, #000 80%, transparent)' }} />
      </section>

      <SideFeature
        hue={330}
        eyebrow="Keyboard"
        title="A keyboard that knows your snippets"
        body="Expand snippets, run quick AI edits and paste from history without leaving the app you are typing in."
        link="Enable the keyboard"
      />

      <section className={`${SHELL} flex flex-col gap-16`}>
        <SectionTitle size={32} title="Small things that add up" subtitle="Little touches across the app that save a few seconds here and there, every single day." />
        <div className="grid gap-9 md:grid-cols-2">
          <MediaCard variant="ios" bleed className="md:h-[492px]" title="Clipboard history" desc="Everything you copy on the desktop is ready to paste on the phone." visual={<Vis h={358} hue={210} />} />
          <MediaCard variant="ios" className="md:h-[492px]" title="Search everything" desc="Apps, notes, links and commands in one list, ranked by what you use most." visual={<Vis h={300} hue={40}><Icon name="search" size={48} className="text-white/30" /></Vis>} />
          <MediaCard variant="ios" bleed className="md:h-[492px]" title="Dark and light" desc="Follows the system appearance or sticks to the one you prefer." visual={<Vis h={358} hue={280} />} />
          <MediaCard variant="ios" className="md:h-[492px]" title="Private by default" desc="Nothing leaves the phone unless you turn on sync for it yourself." visual={<Vis h={300} hue={150}><Icon name="lock" size={48} className="text-white/30" /></Vis>} />
        </div>
      </section>

      <section className={SHELL}>
        <DownloadBlock variant="ios" title="Get it on your phone in under a minute" body="Scan the code with your camera to start." />
      </section>

      <section className={SHELL}>
        <FaqAccordion title="FAQs" subtitle="Answers to common questions about the app." items={FAQ} />
      </section>

      <QrCard fixed />
    </main>
  )
}
