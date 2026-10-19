import { useEffect, useMemo, useRef, useState } from 'react'
import { AppTile, Icon, SectionTitle, typeOut, useInView, useSequence } from './shared.jsx'

/* ---------- Stars (spec 3) ---------- */
function seeded(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}
// Original (measured from its JS): `count` 1px dots at random top/left, opacity .1-.4, all start "off".
// round(.2 * count) random indices twinkle: every 1000ms each picks off/medium/high at random; when it
// brightens (80% chance) it pulses scale(2) after 100-500ms for 250ms. Glow layers fade over 250ms.
function StarBand({ className, count, seed }) {
  const dots = useMemo(() => {
    const rnd = seeded(seed)
    return Array.from({ length: count }, () => ({
      top: `${(rnd() * 100).toFixed(2)}%`,
      left: `${(rnd() * 100).toFixed(2)}%`,
      opacity: 0.1 + rnd() * 0.3,
    }))
  }, [count, seed])
  const twinkle = useMemo(
    () => Array.from({ length: Math.round(0.2 * count) }, () => Math.floor(Math.random() * count)),
    [count],
  )
  const ref = useRef(null)
  useEffect(() => {
    const states = ['off', 'medium', 'high']
    const timers = []
    const id = setInterval(() => {
      twinkle.forEach((idx) => {
        const el = ref.current?.querySelector(`[data-index="${idx}"]`)
        if (!el) return
        const next = states[Math.floor(Math.random() * states.length)]
        const cur = el.dataset.state
        const up =
          Math.random() > 0.2 &&
          ((cur === 'off' && next === 'high') || (cur === 'off' && next === 'medium') || (cur === 'medium' && next === 'high'))
        if (up) {
          const d = Math.floor(Math.random() * 401) + 100
          timers.push(setTimeout(() => (el.style.transform = 'scale(2)'), d))
          timers.push(setTimeout(() => (el.style.transform = 'scale(1)'), 250 + d))
        }
        el.dataset.state = cur === 'high' && next === 'medium' && up ? 'off' : next
      })
    }, 1000)
    return () => {
      clearInterval(id)
      timers.forEach(clearTimeout)
    }
  }, [twinkle])
  return (
    <div ref={ref} className={`absolute ${className}`}>
      {dots.map((d, i) => (
        <span
          key={i}
          className="star"
          data-state="off"
          data-index={i}
          style={{ '--transition-duration': '250ms', top: d.top, left: d.left, opacity: d.opacity, width: 1, height: 1 }}
        />
      ))}
    </div>
  )
}
function Stars() {
  return (
    <div className="pointer-events-none absolute inset-y-[-45px] inset-x-[-135px]" data-motion="stars">
      <StarBand className="inset-x-0 top-0 h-[45px]" count={33} seed={11} />
      <StarBand className="bottom-[82px] right-[50px] top-[82px] w-[86px]" count={18} seed={41} />
      <StarBand className="inset-x-0 bottom-0 h-[45px]" count={22} seed={23} />
      <StarBand className="bottom-[82px] left-[50px] top-[82px] w-[86px]" count={18} seed={37} />
    </div>
  )
}

/* ---------- Launcher window mock ---------- */
const SLIDES = [
  {
    key: 'clip',
    icon: 'clip',
    tip: 'Clipboard',
    search: 'Type to filter entries...',
    group: 'Today',
    rows: ['Quarterly notes draft', '#3f7cff', 'https://example.org/docs', 'Meeting moved to 3pm', 'npm run build', 'Shipping address'],
    preview: 'Quarterly notes draft\n\n- Review roadmap items\n- Share the summary with the team\n- Book the planning room',
    meta: [['Source', 'Notes'], ['Content type', 'Text'], ['Characters', '96'], ['Copied', '10:42']],
  },
  {
    key: 'win',
    icon: 'window',
    tip: 'Windows',
    search: 'Arrange the focused window...',
    group: 'Layouts',
    rows: ['Left half', 'Right half', 'Top third', 'Center', 'Maximize', 'Next display'],
    preview: 'Left half\n\nMoves the frontmost window to the left side of the current screen.',
    meta: [['Hotkey', 'Ctrl Opt Left'], ['Display', 'Built-in'], ['Gap', '8 px'], ['Used', '214 times']],
  },
  {
    key: 'snip',
    icon: 'note',
    tip: 'Snippets',
    search: 'Search snippets...',
    group: 'Personal',
    rows: ['Email signature', 'Standup template', 'Office address', 'Bug report', 'Thanks reply', 'Date stamp'],
    preview: 'Standup template\n\nYesterday:\nToday:\nBlockers:',
    meta: [['Keyword', ';stand'], ['Folder', 'Work'], ['Expands', 'Anywhere'], ['Updated', 'Mon']],
  },
  {
    key: 'calc',
    icon: 'bolt',
    tip: 'Quick math',
    search: '128 * 3.5 in hours',
    group: 'Results',
    rows: ['448', '7.47 hours', '448 / 60', 'Copy answer', 'Paste answer', 'History'],
    preview: '128 * 3.5\n\n= 448\n\n7 hours 28 minutes',
    meta: [['Mode', 'Natural'], ['Precision', '2 places'], ['Units', 'Auto'], ['Saved', 'Yes']],
  },
  {
    key: 'cal',
    icon: 'calendar',
    tip: 'Schedule',
    search: 'Find a free slot...',
    group: 'This week',
    rows: ['Design review', 'Focus block', '1:1 sync', 'Lunch', 'Planning', 'Retro'],
    preview: 'Design review\n\nThursday, 14:00 - 14:45\nRoom 3B',
    meta: [['Calendar', 'Work'], ['Guests', '6'], ['Video', 'Linked'], ['Reminder', '10 min']],
  },
]

function Hotkey({ children }) {
  return (
    <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-xs bg-white/10 px-1 text-[11px] font-semibold text-white/60">
      {children}
    </span>
  )
}

const IDLE = { query: '', typing: false, sel: 0, pressed: -1, toast: false, preview: null, action: false }

function LauncherWindow({ slide, live = IDLE }) {
  const preview = live.preview ?? slide.preview
  return (
    <div className="relative flex h-[360px] w-[750px] max-w-[calc(100vw-32px)] flex-col sm:h-[460px] overflow-hidden rounded-md border border-white/10 bg-[rgba(22,23,26,.86)] text-[13px] shadow-[0_24px_80px_rgba(0,0,0,.55),inset_0_1px_rgba(255,255,255,.08)] backdrop-blur-20">
      {/* Search: typed text, then the caret (solid while typing, 1.1s step blink otherwise), then placeholder */}
      <div className="flex h-[56px] items-center gap-3 border-b border-white/[.06] px-4 text-[16px]">
        {live.query && <span className="-mr-3 whitespace-pre text-white">{live.query}</span>}
        <span className={`h-[18px] w-px bg-white ${live.typing ? 'caret-solid' : 'caret-blink'}`} />
        {!live.query && <span className="text-white/40">{slide.search}</span>}
      </div>
      <div className="flex min-h-0 flex-1">
        {/* List */}
        <div className="w-full flex-none p-2 sm:w-[280px] sm:border-r sm:border-white/[.06]">
          <div className="px-2 pb-1 pt-2 text-[12px] font-medium text-white/40">{slide.group}</div>
          {slide.rows.map((r, i) => (
            <div
              key={r}
              className={`flex h-10 items-center gap-3 rounded-normal px-2 transition-transform duration-150 ease-[cubic-bezier(.34,1.56,.64,1)] ${i === live.sel ? 'bg-white/[.08] text-white' : 'text-white/70'} ${i === live.pressed ? 'scale-95' : ''}`}
            >
              <AppTile size={20} hue={(i * 47 + slide.key.length * 30) % 360} radius="6px" />
              <span className="truncate">{r}</span>
            </div>
          ))}
        </div>
        {/* Preview */}
        <div className="hidden min-w-0 flex-1 flex-col sm:flex">
          <pre className="flex-1 whitespace-pre-wrap p-4 font-sans text-[13px] leading-[1.6] text-white/80">{preview}</pre>
          <table className="mx-4 mb-3 text-[12px]">
            <tbody>
              {slide.meta.map(([k, v]) => (
                <tr key={k} className="border-t border-white/[.06]">
                  <td className="py-1.5 text-white/40">{k}</td>
                  <td className="py-1.5 text-right text-white/70">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Action bar */}
      <div className="flex h-10 items-center justify-between border-t border-white/[.06] bg-white/[.02] px-3 text-[12px] text-white/50">
        <span className="flex items-center gap-2"><Icon name={slide.icon} size={14} /> {slide.tip}</span>
        <span className="flex items-center gap-3">
          <span className={`flex items-center gap-1.5 transition-colors duration-150 ${live.action ? 'text-white' : 'text-white/80'}`}>Paste <Hotkey>&#8629;</Hotkey></span>
          <span className="h-3 w-px bg-white/10" />
          <span className="hidden items-center gap-1.5 sm:flex">Actions <Hotkey>&#8984;</Hotkey><Hotkey>K</Hotkey></span>
        </span>
      </div>
      {live.toast && (
        <div className="reel-toast absolute bottom-[52px] left-1/2 -ml-[78px] flex h-9 items-center gap-2 rounded-[20px] bg-white/10 pl-2 pr-4 text-[12px] font-medium leading-[14px] tracking-[.1px] text-white shadow-[0_4px_16px_rgba(0,0,0,.32)] backdrop-blur-[16px]">
          <Icon name="clip" size={16} /> Copied to clipboard
        </div>
      )}
    </div>
  )
}

/* ---------- Scripted showcase per slide ----------
   Step timings follow the original reel slide at the same index (measured from its JS):
   0 clipboard: 2000, dropdown 400/300/850/1000, type 5 chars, 1200, type, 1000, panel 1000, press 150/750,
     toast 2500, 1000, done (~13.6s)
   1 AI: type 23 chars (50ms base), answer at 10ms/char, 6x50 + 2x20 list lines, 2000, done (~5s)
   2 emoji: 1500, type 5 chars, 1000, select 250/250, press 350, toast 2000, 500, done (~6.2s)
   3 calculator: 2000, type 19 chars (50ms base), 1500, done (~4.5s)
   4 window mgmt: 1500, then select/apply 800/250 x3, 1200, done (~5.9s)
   typeOut delay per char = round(rand * base / 2) + base. */
function buildSteps(index, set, done) {
  const q = (v) => set((s) => ({ ...s, query: v }))
  const patch = (o) => () => set((s) => ({ ...s, ...o }))
  const noop = () => {}
  const preview = (v) => set((s) => ({ ...s, preview: v }))
  switch (index) {
    case 0:
      return [
        [noop, 2000],
        [patch({ sel: 1 }), 400],
        [patch({ sel: 2 }), 300],
        [patch({ sel: 3 }), 850],
        [patch({ sel: 0 }), 1000],
        [patch({ typing: true }), 0],
        ...typeOut('notes', q),
        [patch({ typing: false }), 0],
        [noop, 1200],
        [patch({ typing: true }), 0],
        ...typeOut(' draft', q, 'notes'),
        [patch({ typing: false }), 0],
        [noop, 1000],
        [patch({ action: true }), 1000],
        [patch({ pressed: 0 }), 150],
        [patch({ pressed: -1, action: false }), 750],
        [patch({ toast: true }), 2500],
        [patch({ toast: false }), 1000],
        [done, 0],
      ]
    case 1: {
      const text = 'Left half\n\nMoves the frontmost window to the left side of the screen.'
      return [
        [patch({ typing: true }), 0],
        ...typeOut(' window to the left half', q, 'move'),
        [patch({ typing: false }), 0],
        ...typeOut(text, preview, '', 10),
        ...[1, 2, 3, 4, 5, 0].map((i) => [patch({ sel: i }), 50]),
        [patch({ sel: 0 }), 20],
        [patch({ sel: 0 }), 20],
        [noop, 2000],
        [done, 0],
      ]
    }
    case 2:
      return [
        [noop, 1500],
        [patch({ typing: true }), 0],
        ...typeOut('stand', q),
        [patch({ typing: false }), 1000],
        [patch({ sel: 1 }), 250],
        [patch({ sel: 2 }), 250],
        [patch({ pressed: 2 }), 350],
        [patch({ pressed: -1, toast: true }), 2000],
        [patch({ toast: false }), 500],
        [done, 0],
      ]
    case 3:
      return [
        [noop, 2000],
        [patch({ typing: true }), 0],
        ...typeOut('128 * 3.5 in hours', q),
        [patch({ typing: false }), 1500],
        [done, 0],
      ]
    default:
      return [
        [noop, 1500],
        [patch({ sel: 0 }), 800],
        [patch({ pressed: 1 }), 250],
        [patch({ sel: 1, pressed: -1 }), 800],
        [patch({ pressed: 2 }), 250],
        [patch({ sel: 2, pressed: -1 }), 800],
        [patch({ pressed: 3 }), 250],
        [patch({ sel: 3, pressed: -1 }), 1200],
        [done, 0],
      ]
  }
}

function Showcase({ slide, index, playing, onComplete }) {
  const [live, setLive] = useState(IDLE)
  const steps = useMemo(() => buildSteps(index, setLive, onComplete), [index, onComplete])
  useSequence(steps, playing)
  return <LauncherWindow slide={slide} live={live} />
}

/* ---------- Dock ---------- */
function Dock({ active, onSelect }) {
  const [hover, setHover] = useState(null)
  return (
    <div className="absolute bottom-6 left-1/2 z-[1] flex -translate-x-1/2 items-end gap-2 rounded-xl border border-card-border bg-dock p-2 shadow-dock backdrop-blur-10">
      {SLIDES.map((s, i) => {
        const on = i === active
        return (
          <button
            key={s.key}
            type="button"
            aria-label={s.tip}
            onClick={() => onSelect(i)}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            className={`relative h-[54px] w-[54px] flex-none rounded-md border p-4 transition-all duration-200 ${
              on
                ? 'mx-1.5 -translate-y-[5px] scale-125 rounded-lg border-grey-400 bg-dock-item-active text-white shadow-dock-item-active'
                : 'border-grey-500 bg-dock-item text-grey-200 shadow-dock-item hover:border-grey-400 hover:bg-dock-item-active hover:text-white hover:shadow-dock-item-active'
            }`}
          >
            <Icon name={s.icon} size={20} className="-m-px" />
            {hover === i && (
              <span className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-sm border border-card-border bg-card px-2 py-px text-[14px] font-medium leading-[1.6] text-white shadow-tooltip backdrop-blur-8">
                {s.tip}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

const MENU_LEFT = ['Finder', 'File', 'Edit', 'View', 'Go', 'Window', 'Help']

export default function ShortcutsFrame() {
  const reelRef = useRef(null)
  const [active, setActive] = useState(0)
  // Original: reel observed at threshold .2; a slide plays only while visible and active.
  const [visRef, visible] = useInView(0.2)
  const setReel = (el) => {
    reelRef.current = el
    visRef.current = el
  }
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && !window.matchMedia('(min-width: 720px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 720px)')
    const on = () => setMobile(!mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  // Each showcase gets a fresh key 500ms after it stops being active, so it restarts from scratch.
  const [keys, setKeys] = useState(() => SLIDES.map((_, i) => i))
  const prev = useRef(active)
  useEffect(() => {
    const t = setTimeout(() => {
      const p = prev.current
      setKeys((k) => k.map((v, i) => (i === p && p !== active ? v + SLIDES.length : v)))
      prev.current = active
    }, 500)
    return () => clearTimeout(t)
  }, [active])

  const advance = useMemo(() => () => setActive((a) => (a + 1) % SLIDES.length), [])

  // Scroll the reel to the active slide (smooth) while visible, like the original.
  useEffect(() => {
    const el = reelRef.current
    if (!el || !visible) return
    const slide = el.children[active]
    if (!slide) return
    el.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' })
  }, [active, visible])

  // Below 720px the original shows static slides and advances every 6s.
  useEffect(() => {
    if (!mobile) return
    const t = setTimeout(advance, 6000)
    return () => clearTimeout(t)
  }, [mobile, active, advance])

  const goTo = (i) => setActive(i)

  return (
    <section className="section-container flex flex-col items-center">
      <SectionTitle
        title="Commands for every workflow"
        subtitle="Built around your muscle memory."
        className="mb-sp-8 max-w-[350px]"
      />

      <div className="relative flex w-full flex-col items-center" data-reveal="frame">
        <div className="frame-outer-size relative flex-none" style={{ width: 'calc(100vw + 19px)' }}>
          <div className="frame-backdrop" />
          <Stars />
          <div className="relative h-full w-full border border-white/[.08] bg-black/[.44] bg-frame-outer p-2 shadow-frame-outer backdrop-blur-2 xl:rounded-frame">
            <div className="relative h-full overflow-hidden rounded-md border border-white/[.08] bg-grey-900 shadow-frame-inner">
              {/* Wallpaper placeholder, 1300x733 centered and cropped */}
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-[733px] w-[1300px] -translate-x-1/2 -translate-y-1/2 opacity-80"
                style={{
                  background:
                    'radial-gradient(60% 50% at 30% 30%, rgba(160,20,40,.55), transparent 70%), repeating-linear-gradient(48deg, rgba(255,80,90,.0) 0 60px, rgba(255,80,90,.12) 80px, rgba(255,80,90,0) 120px), radial-gradient(70% 60% at 75% 80%, rgba(90,10,30,.6), transparent 70%), #0a0506',
                  filter: 'blur(2px)',
                }}
              />
              {/* Menu bar */}
              <div className="menubar-text relative hidden h-12 items-center justify-between p-3 text-[13px] font-semibold leading-4 text-white/40 sm:flex">
                <div className="flex items-center gap-[19px]">
                  <span className="h-3.5 w-3.5 rounded-full bg-white/40" />
                  {MENU_LEFT.slice(1).map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <Icon name="search" size={14} />
                  <Icon name="bolt" size={14} />
                  <span>Thu 16 Oct</span>
                  <span>9:41</span>
                </div>
              </div>
              {/* Showcase reel */}
              <div
                ref={setReel}
                className="reel-grid scrollbar-none relative grid h-full snap-x snap-mandatory overflow-x-auto pb-[102px] sm:h-[calc(100%-48px)] sm:pt-sp-6"
              >
                {SLIDES.map((s, i) => (
                  <div key={s.key} className="flex snap-start items-start justify-center pt-4 sm:pt-0" data-slide={i}>
                    <Showcase
                      key={keys[i]}
                      slide={s}
                      index={i}
                      playing={visible && !mobile && active === i}
                      onComplete={advance}
                    />
                  </div>
                ))}
              </div>
              <Dock active={active} onSelect={goTo} />
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 max-w-[467px] text-center text-[16px] font-medium leading-[1.6] tracking-ui text-grey-300">
        <span className="text-white">Press one hotkey</span> and the bar opens over any app, ready for a search, a command or a note.
      </p>
    </section>
  )
}
