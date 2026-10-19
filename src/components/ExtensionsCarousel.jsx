import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ArrowLink, DarkButton, Icon, SectionTitle } from './shared.jsx'

const CATEGORIES = ['Productivity', 'Engineering', 'Design', 'Writing']

// Original placeholder data. Card 1 and 2 backgrounds are the measured recipes; the rest follow the same 0.7-alpha pattern.
const BASE = [
  ['Taskboard', 'Capture to-dos, set due dates and clear your list without a mouse.', 'linear-gradient(138deg, rgba(32,35,91,.7) 22%, rgba(7,9,33,.7) 82%)', 236],
  ['Cloud Drive', 'Browse shared folders, copy links and preview documents in a flash.', 'radial-gradient(94.21% 78.4% at 50% 29.91%, rgba(43,94,180,.7), rgba(13,16,35,.42))', 214],
  ['Greenhouse', 'Track habits and streaks with a tiny daily check-in from the bar.', 'radial-gradient(94.21% 78.4% at 50% 29.91%, rgba(40,150,90,.7), rgba(10,30,20,.42))', 146],
  ['Pinboard', 'Save any page you are reading and tag it for later in seconds.', 'linear-gradient(138deg, rgba(150,40,60,.7) 22%, rgba(40,8,16,.7) 82%)', 350],
  ['Deploy Bot', 'Watch builds, roll back releases and read logs from one place.', 'radial-gradient(94.21% 78.4% at 50% 29.91%, rgba(120,70,200,.7), rgba(22,12,40,.42))', 268],
  ['Color Picker', 'Grab any pixel on screen and copy it as hex, rgb or hsl values.', 'linear-gradient(138deg, rgba(200,120,30,.7) 22%, rgba(45,24,6,.7) 82%)', 32],
  ['Timezones', 'Compare clocks for your whole team before booking a late call.', 'radial-gradient(94.21% 78.4% at 50% 29.91%, rgba(30,140,160,.7), rgba(6,28,34,.42))', 188],
  ['Issue Tracker', 'Create, assign and search tickets without opening a browser tab.', 'linear-gradient(138deg, rgba(70,80,110,.7) 22%, rgba(12,14,22,.7) 82%)', 222],
  ['Music Remote', 'Skip, like and queue tracks with a single keystroke anywhere.', 'radial-gradient(94.21% 78.4% at 50% 29.91%, rgba(60,170,80,.7), rgba(10,30,14,.42))', 128],
  ['Translator', 'Turn selected text into another language and paste it back.', 'linear-gradient(138deg, rgba(40,90,200,.7) 22%, rgba(8,16,40,.7) 82%)', 220],
  ['Meeting Notes', 'Start a note for the current event with attendees already listed.', 'radial-gradient(94.21% 78.4% at 50% 29.91%, rgba(210,170,40,.7), rgba(40,32,6,.42))', 46],
  ['Password Vault', 'Look up logins and fill one-time codes without breaking your flow.', 'linear-gradient(138deg, rgba(30,110,220,.7) 22%, rgba(6,20,44,.7) 82%)', 210],
  ['Design Files', 'Jump into recent canvases and search frames across every project.', 'radial-gradient(94.21% 78.4% at 50% 29.91%, rgba(220,80,140,.7), rgba(44,14,28,.42))', 330],
  ['Inbox Zero', 'Triage new mail, archive threads and snooze replies until later.', 'linear-gradient(138deg, rgba(200,60,50,.7) 22%, rgba(40,10,8,.7) 82%)', 6],
  ['Server Status', 'See uptime and incident history for the services you depend on.', 'radial-gradient(94.21% 78.4% at 50% 29.91%, rgba(90,110,130,.7), rgba(16,20,24,.42))', 205],
  ['Word Count', 'Measure words, characters and reading time for any selection.', 'linear-gradient(138deg, rgba(110,60,170,.7) 22%, rgba(20,10,34,.7) 82%)', 276],
  ['Packages', 'Search registries, compare versions and copy install commands.', 'radial-gradient(94.21% 78.4% at 50% 29.91%, rgba(200,50,50,.7), rgba(40,10,10,.42))', 0],
]
const SETS = CATEGORIES.map((_, c) => (c === 0 ? BASE : [...BASE.slice(c * 4), ...BASE.slice(0, c * 4)]))

function CardIcon({ hue }) {
  return (
    <span
      className="-m-[2px] grid h-14 w-14 flex-none place-items-center rounded-md shadow-ext-icon"
      style={{ background: `linear-gradient(140deg, hsl(${hue} 75% 62%), hsl(${hue} 60% 32%))` }}
    >
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden>
        <rect x="5" y="5" width="18" height="18" rx="5" fill="none" stroke="#fff" strokeOpacity=".9" strokeWidth="2" />
        <circle cx="14" cy="14" r="4" fill="#fff" fillOpacity=".9" />
      </svg>
    </span>
  )
}

function Illustration({ hue, i }) {
  // Original abstract placeholder art, square
  return (
    <svg viewBox="0 0 360 360" className="block aspect-square w-full" aria-hidden>
      <defs>
        <linearGradient id={`ill${i}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={`hsl(${hue} 70% 60%)`} stopOpacity=".55" />
          <stop offset="1" stopColor={`hsl(${hue} 70% 20%)`} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="40" y="40" width="280" height="300" rx="16" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.1)" />
      <rect x="64" y="72" width="140" height="10" rx="5" fill="rgba(255,255,255,.35)" />
      <rect x="64" y="96" width="210" height="8" rx="4" fill="rgba(255,255,255,.15)" />
      {[0, 1, 2, 3].map((r) => (
        <g key={r}>
          <rect x="64" y={130 + r * 44} width="28" height="28" rx="7" fill={`hsl(${(hue + r * 25) % 360} 60% 55%)`} fillOpacity=".7" />
          <rect x="104" y={136 + r * 44} width={150 - r * 18} height="8" rx="4" fill="rgba(255,255,255,.3)" />
          <rect x="104" y={149 + r * 44} width={100 - r * 10} height="6" rx="3" fill="rgba(255,255,255,.12)" />
        </g>
      ))}
      <circle cx="290" cy="300" r="120" fill={`url(#ill${i})`} />
    </svg>
  )
}

function ExtensionCard({ data, index }) {
  const [title, desc, bg, hue] = data
  return (
    <div
      className="flex-none"
      data-reveal="ext-card"
      style={{ '--delay': `${100 + 80 * index}ms`, transformOrigin: '100% 0' }}
    >
      <article
        className="ext-card group relative grid h-[446px] w-[300px] snap-end grid-rows-[1fr_auto] overflow-hidden rounded-xl shadow-ext-card sm:h-[536px] sm:w-[360px]"
        style={{ background: bg }}
      >
        <div className="grid grid-rows-[auto_1fr_auto] gap-4 px-6 pt-6 sm:gap-6">
          <div className="flex items-center gap-3">
            <CardIcon hue={hue} />
            <h3 className="flex-1 text-[18px] font-normal text-white">{title}</h3>
            <DarkButton className="h-9 w-9 flex-none group-hover:shadow-btn-dark-hover" aria-label={`Open ${title}`}>
              <Icon name="chevron-right" size={16} />
            </DarkButton>
          </div>
          <p className="text-[14px] font-medium leading-[1.6] tracking-ui text-grey-200 sm:text-[16px]">{desc}</p>
          <div className="h-px bg-white/5" />
        </div>
        <Illustration hue={hue} i={index} />
      </article>
    </div>
  )
}

function BrowseMore() {
  return (
    <a
      href="#"
      className="group flex h-[446px] w-[300px] flex-none snap-end flex-col overflow-hidden rounded-browse border border-card-border bg-grey-700 transition-shadow duration-300 hover:shadow-browse sm:h-[536px] sm:w-[360px]"
    >
      <h3 className="mt-10 px-6 text-[24px] font-medium text-white">Browse 1,500 more</h3>
      <div
        className="mt-auto aspect-[358/411] w-full opacity-80 grayscale transition-[filter,opacity] duration-300 group-hover:opacity-100 group-hover:grayscale-0"
        style={{
          background:
            'radial-gradient(40% 30% at 30% 40%, hsl(350 80% 60% / .6), transparent), radial-gradient(40% 30% at 70% 60%, hsl(210 80% 60% / .6), transparent), radial-gradient(30% 25% at 50% 85%, hsl(140 70% 50% / .5), transparent)',
        }}
      />
    </a>
  )
}

function Categories({ active, onChange }) {
  const refs = useRef([])
  const [pill, setPill] = useState({ width: 0, offset: 0 })
  const measure = useCallback(() => {
    const el = refs.current[active]
    if (!el) return
    // ASSUMPTION: pill hugs the tab plus half the gap on each side.
    const gap = parseFloat(getComputedStyle(el.parentElement).columnGap) || 24
    setPill({ width: el.offsetWidth + gap, offset: el.offsetLeft - gap / 2 })
  }, [active])
  useLayoutEffect(measure, [measure])
  useEffect(() => {
    window.addEventListener('resize', measure)
    document.fonts?.ready.then(measure)
    return () => window.removeEventListener('resize', measure)
  }, [measure])

  return (
    <div className="card-border-tsx relative flex w-max flex-none gap-6 self-start rounded-cat-pill bg-card px-5 py-2 shadow-inset-top">
      <span
        className="cat-active absolute left-0 top-2 h-[46px] rounded-cat-active bg-cat-active backdrop-blur-2 transition-[transform,width] duration-300"
        style={{ width: pill.width, transform: `translate3d(${pill.offset}px,0,0)` }}
      />
      {CATEGORIES.map((c, i) => (
        <button
          key={c}
          ref={(el) => (refs.current[i] = el)}
          type="button"
          onClick={() => onChange(i)}
          className={`relative h-[46px] text-[14px] font-medium leading-[1.6] tracking-ui transition-colors duration-300 hover:text-white ${i === active ? 'text-white' : 'text-grey-300'}`}
        >
          {c}
        </button>
      ))}
    </div>
  )
}

// Old set on category switch (original CSSTransition, 300ms): reelExit -> reelExitActive.
function ExitingSet({ cat }) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const r = requestAnimationFrame(() => requestAnimationFrame(() => setOn(true)))
    return () => cancelAnimationFrame(r)
  }, [])
  return (
    <div className={`ext-reel-exit ${on ? 'active' : ''}`} aria-hidden>
      <div className="inline-flex gap-6 pr-8 sm:gap-sp-7">
        {SETS[cat].map((d, i) => (
          <ExtensionCard key={d[0]} data={d} index={i} />
        ))}
        <BrowseMore />
      </div>
    </div>
  )
}

// Bare reel (no category switcher, no pager): centered title node, `count` cards + browse-more, ArrowLink below.
// Used on /windows (section pad 158 0, same card size / 56 gap / slideIn reveal as the homepage).
export function ExtensionReel({ title, link = 'Browse the plugin hub', count = 12, className = 'py-[158px]' }) {
  return (
    <section className={`flex flex-col items-center gap-10 overflow-hidden ${className}`}>
      {title}
      <div className="w-screen max-w-[2000px]">
        <div className="ext-reel-mask scrollbar-none snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-px-8 px-8 py-4 sm:-my-10 sm:scroll-px-6 sm:px-6 sm:py-10">
          <div className="mx-auto max-w-container py-8">
            <div className="inline-flex gap-6 pr-8 sm:gap-sp-7">
              {BASE.slice(0, count).map((d, i) => (
                <ExtensionCard key={d[0]} data={d} index={i} />
              ))}
              <BrowseMore />
            </div>
          </div>
        </div>
      </div>
      <ArrowLink>{link}</ArrowLink>
    </section>
  )
}

export default function ExtensionsCarousel() {
  const [cat, setCat] = useState(0)
  const [exiting, setExiting] = useState(null) // { cat, id }
  const exitTimer = useRef()
  const scroller = useRef(null)
  const [edges, setEdges] = useState({ start: true, end: false })

  const update = useCallback(() => {
    const el = scroller.current
    if (!el) return
    setEdges({ start: el.scrollLeft <= 1, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1 })
  }, [])
  useEffect(() => {
    const el = scroller.current
    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [update])

  const page = (dir) => {
    const el = scroller.current
    el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' })
  }
  const changeCat = (i) => {
    if (i === cat) return
    clearTimeout(exitTimer.current)
    setExiting({ cat, id: Date.now() })
    exitTimer.current = setTimeout(() => setExiting(null), 300)
    setCat(i)
    scroller.current?.scrollTo({ left: 0 })
  }
  useEffect(() => () => clearTimeout(exitTimer.current), [])

  return (
    <section className="flex flex-col items-center overflow-hidden py-sp-12 sm:gap-10 sm:py-sp-13">
      <div className="flex w-full max-w-ext-top justify-between max-ext:flex-col max-ext:gap-10 min-[1025px]:items-center">
        <div className="max-w-[480px] px-6">
          <SectionTitle
            align="left"
            title="Plugins for every tool you own"
            subtitle="Hundreds of community builds, installed in one click."
          />
        </div>
        <div className="scrollbar-none px-6 max-ext:overflow-x-auto">
          <Categories active={cat} onChange={changeCat} />
        </div>
      </div>

      <div className="w-screen max-w-[2000px]">
        <div
          ref={scroller}
          className="ext-reel-mask scrollbar-none snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-px-8 px-8 py-4 sm:-my-10 sm:scroll-px-6 sm:px-6 sm:py-10"
        >
          <div className="mx-auto max-w-container py-8">
            <div className="relative">
              {exiting && <ExitingSet key={exiting.id} cat={exiting.cat} />}
              <div key={cat} className="inline-flex gap-6 pr-8 sm:gap-sp-7" data-category={cat}>
                {SETS[cat].map((d, i) => (
                  <ExtensionCard key={d[0]} data={d} index={i} />
                ))}
                <BrowseMore />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full max-w-ext-top items-center justify-between px-6">
        <ArrowLink>Browse the plugin hub</ArrowLink>
        <div className="flex gap-3">
          {[
            [-1, 'arrow-left', edges.start, 'Previous'],
            [1, 'arrow-right', edges.end, 'Next'],
          ].map(([dir, icon, disabled, label]) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              disabled={disabled}
              onClick={() => page(dir)}
              className="card-border-tsx rounded-pagination bg-card p-5 text-white shadow-inset-top transition-shadow duration-300 hover:shadow-pagination-hover disabled:text-grey-300"
            >
              <Icon name={icon} size={16} />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
