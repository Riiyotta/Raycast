import { useState } from 'react'
import PageHero, { SearchButton } from '../components/PageHero.jsx'
import { AppTile, DarkButton, Icon } from '../components/shared.jsx'

/* /store (PAGES_SPEC 4). Page-only pieces: StoreArt, FeaturedExtensionCard, StoreToolbar, StoreExtensionCard, Pagination. */

// Two stacked layers 1064x560 at top 0 (470x247 at 390); back bgEnter 2s, front fgEnter 1.5s, on load.
function StoreArt() {
  return (
    <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[247px] w-[470px] -translate-x-1/2 sm:h-[560px] sm:w-[1064px]">
      <div
        className="anim-bgEnter absolute inset-0"
        style={{
          background:
            'radial-gradient(40% 50% at 50% 40%, rgba(255,99,99,.18), transparent 70%), radial-gradient(30% 40% at 25% 60%, rgba(86,194,255,.12), transparent 70%), radial-gradient(30% 40% at 75% 60%, rgba(154,170,255,.12), transparent 70%)',
          WebkitMaskImage: 'linear-gradient(#000 50%, transparent)',
          maskImage: 'linear-gradient(#000 50%, transparent)',
        }}
      />
      <div className="anim-fgEnter absolute inset-0 grid grid-cols-8 content-center gap-3 px-[8%] sm:gap-6" style={{ WebkitMaskImage: 'radial-gradient(50% 60% at 50% 45%, #000 30%, transparent)', maskImage: 'radial-gradient(50% 60% at 50% 45%, #000 30%, transparent)' }}>
        {Array.from({ length: 24 }, (_, i) => (
          <span
            key={i}
            className="aspect-square w-full rounded-[22%] opacity-70"
            style={{ background: `linear-gradient(135deg, hsl(${(i * 47) % 360} 70% 62%), hsl(${(i * 47 + 40) % 360} 65% 38%))` }}
          />
        ))}
      </div>
    </div>
  )
}

const FEATURED = [
  ['Focus Timer Pro', 'Block distractions with short sprints and a calm end-of-session chime.', 195, 'Mira Holt Studio'],
  ['Board Shortcuts', 'Move cards between columns, assign people and set due dates without a mouse.', 260, 'Kettle and Crane'],
  ['Shelf Bookmarks', 'Save, tag and reopen links from every browser profile you use daily.', 30, 'Paper Lantern Co'],
]

function FeaturedExtensionCard({ title, desc, hue, author }) {
  return (
    <a
      href="#"
      className="flex min-h-[364px] flex-col items-center rounded-[10px] border border-card-border p-8 text-center shadow-[inset_0_1px_rgba(255,255,255,.05)] transition-colors duration-150 ease-in-out hover:bg-white/[.02]"
    >
      <span className="grid h-24 w-24 place-items-center rounded-[20px] border-2 border-transparent bg-grey-900">
        <span
          className="grid h-[92px] w-[92px] place-items-center rounded-[18px]"
          style={{ background: `radial-gradient(circle at 50% 0, hsl(${hue} 100% 50% / .15), transparent), hsl(${hue} 100% 50% / .1)` }}
        >
          <AppTile size={64} hue={hue} radius="22%" />
        </span>
      </span>
      <h3 className="mt-4 text-[20px] font-medium leading-[23px] text-white">{title}</h3>
      <p className="mt-2 text-[15px] leading-[17.25px] text-grey-300">{desc}</p>
      <div className="mt-auto flex h-[84px] w-[141px] items-end justify-center">
        <span className="flex items-center gap-2 text-[13px] text-grey-200">
          <AppTile size={20} hue={(hue + 120) % 360} radius="50%" />
          {author}
        </span>
      </div>
    </a>
  )
}

const TABS = ['All plugins', 'Recently added', 'Most installed']
const VIEWS = ['grid', 'window', 'note']

function StoreToolbar({ tab, setTab, view, setView }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex h-14 gap-3 rounded-[100px] border border-card-border bg-card p-1.5 shadow-inset-top">
          {TABS.map((t, i) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(i)}
              className={`whitespace-nowrap rounded-[100px] border p-3 text-[15px] leading-[17.25px] transition-colors duration-150 ${i === tab ? 'border-white/10 bg-cat-active text-white' : 'border-transparent text-grey-200 hover:text-white'}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex h-11 rounded-md border border-grey-500 bg-grey-800 p-1.5">
          {VIEWS.map((v, i) => (
            <button
              key={v}
              type="button"
              aria-label={`${v} view`}
              aria-pressed={i === view}
              onClick={() => setView(i)}
              className={`rounded-sm px-2.5 py-1.5 transition-[color,background-color] duration-150 ${i === view ? 'bg-grey-600 text-white' : 'text-grey-200 hover:text-white'}`}
            >
              <Icon name={v} size={16} />
            </button>
          ))}
        </div>
      </div>
      <SearchButton compact label="Find a plugin" className="w-full sm:w-[320px]" />
    </div>
  )
}

const NAMES = ['Sprint Board', 'Quick Convert', 'Color Shelf', 'Daily Digest', 'Port Watcher', 'Emoji Finder', 'Mail Sorter', 'Tab Keeper', 'Doc Snapper', 'Stand-up Bot', 'Cloud Pager', 'Font Viewer']
const DESCS = [
  'Keep a tidy list of tasks and close them out with one keystroke.',
  'Turn units, currencies and time zones into each other while typing.',
  'Collect palettes from any app and paste them as code in seconds.',
  'A short morning summary of mail, events and unread mentions.',
]
function cardsFor(page, tab) {
  return Array.from({ length: 10 }, (_, i) => {
    const n = (page * 10 + i + tab * 3) % NAMES.length
    return { title: NAMES[n], desc: DESCS[(n * 3 + (i >> 1)) % DESCS.length], hue: (n * 31 + page * 17) % 360, installs: `${(97 - i * 7 - page) * 113}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') }
  })
}

function StoreExtensionCard({ title, desc, hue, installs }) {
  return (
    <a href="#" className="relative flex min-h-[186px] flex-col gap-4 rounded-md border border-card-border p-8 shadow-[inset_0_1px_rgba(255,255,255,.05)] transition-colors duration-150 hover:bg-white/[.02]">
      <div className="flex items-center gap-3 pr-16">
        <AppTile size={32} hue={hue} radius="24%" />
        <h3 className="text-[16px] font-semibold leading-[18.4px] text-white">{title}</h3>
      </div>
      <p className="text-[15px] leading-[17.25px] text-grey-200">{desc}</p>
      <div className="mt-auto flex items-center gap-4 text-[13px] leading-[14.95px] text-grey-200">
        <span className="flex items-center gap-2 font-medium">
          <AppTile size={20} hue={(hue + 90) % 360} radius="50%" />
          Field Notes Lab
        </span>
        <span className="flex items-center gap-1">
          <Icon name="download" size={16} className="h-5 w-5" />
          {installs}
        </span>
      </div>
      <DarkButton className="absolute right-8 top-8 h-8 w-[57px] p-2 text-[13px] font-medium" onClick={(e) => e.preventDefault()}>
        Add
      </DarkButton>
    </a>
  )
}

const LAST = 24
function Pagination({ page, setPage }) {
  const btn = (active) =>
    `grid h-9 min-w-9 place-items-center rounded-normal border border-card-border px-2 text-[15px] shadow-[inset_0_1px_rgba(255,255,255,.05)] transition-colors duration-150 ${active ? 'bg-grey-600 text-white' : 'bg-grey-800 text-grey-200 hover:text-white'}`
  const nums = page < 3 ? [0, 1, 2, 3] : [page - 1, page, page + 1].filter((n) => n < LAST - 1)
  return (
    <nav aria-label="Pagination" className="flex justify-center gap-2">
      {nums.map((n) => (
        <button key={n} type="button" aria-current={n === page ? 'page' : undefined} onClick={() => setPage(n)} className={`${btn(n === page)} w-9`}>
          {n + 1}
        </button>
      ))}
      <span className="grid h-9 w-16 place-items-center text-[15px] text-grey-300">...</span>
      <button type="button" onClick={() => setPage(LAST - 1)} className={`${btn(page === LAST - 1)} w-9`}>{LAST}</button>
      <button type="button" aria-label="Next page" disabled={page === LAST - 1} onClick={() => setPage(Math.min(LAST - 1, page + 1))} className={`${btn(false)} w-9 disabled:opacity-40`}>
        <Icon name="arrow-right" size={16} />
      </button>
    </nav>
  )
}

export default function Store() {
  const [tab, setTab] = useState(0)
  const [view, setView] = useState(0)
  const [page, setPage] = useState(0)
  const go = (p) => {
    setPage(p)
    document.getElementById('store-list')?.scrollIntoView({ block: 'start' })
  }
  return (
    <main
      className="overflow-x-clip"
      style={{ background: 'radial-gradient(50% 50% at 50% -20%, rgba(255,99,99,.08) 0%, rgba(255,119,119,.04) 50.5%, transparent 100%)' }}
    >
      <PageHero
        variant="store"
        art={<StoreArt />}
        title="Store"
        subtitle="Hundreds of small plugins made by the community. Pick a few, install in a click and make them yours."
        actions={<SearchButton label="Search..." className="mt-2 w-[358px] sm:w-[476px]" />}
      />

      <div className="mx-auto max-w-[1188px] px-6">
        <section className="mt-[112px]">
          <div className="text-center">
            <h2 className="text-[32px] font-medium leading-[36.8px] text-white sm:text-[40px] sm:leading-[46px]">Popular</h2>
            <p className="mt-2 text-[20px] leading-[23px] text-white/40">Hand-picked by our team and loved by thousands daily</p>
          </div>
          <div className="mt-14">
            <h3 className="text-[20px] font-medium leading-[23px] text-white">Featured</h3>
            <p className="mt-1 text-[15px] leading-[17.25px] text-white/40">Fresh picks updated every Monday</p>
          </div>
          <div className="mt-[21px] grid gap-8 md:grid-cols-3">
            {FEATURED.map(([t, d, h, a]) => (
              <FeaturedExtensionCard key={t} title={t} desc={d} hue={h} author={a} />
            ))}
          </div>
        </section>

        <section className="mt-[127px] pb-32">
          <StoreToolbar tab={tab} setTab={(i) => { setTab(i); setPage(0) }} view={view} setView={setView} />
          <div id="store-list" className="mt-8 scroll-mt-[108px]">
            <h3 className="text-[20px] font-medium leading-[23px] text-white">{TABS[tab]}</h3>
            <p className="mt-1 text-[15px] leading-[17.25px] text-white/40">Page {page + 1} of {LAST}</p>
          </div>
          <div className={`mt-[37px] grid gap-6 ${view === 0 ? 'md:grid-cols-2' : ''}`}>
            {cardsFor(page, tab).map((c, i) => (
              <StoreExtensionCard key={`${page}-${i}`} {...c} />
            ))}
          </div>
          <div className="mt-16">
            <Pagination page={page} setPage={go} />
          </div>
        </section>
      </div>
    </main>
  )
}
