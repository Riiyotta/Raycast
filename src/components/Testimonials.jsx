import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Badge, SectionTitle, useInView } from './shared.jsx'

// 24 fictional people (original placeholder content)
const FIRST = ['Mara', 'Jonah', 'Priya', 'Tomas', 'Elena', 'Kofi', 'Ingrid', 'Rafael', 'Suki', 'Dmitri', 'Leila', 'Owen']
const LAST = ['Okafor', 'Lindqvist', 'Haddad', 'Moreau', 'Castillo', 'Nakamura', 'Brennan', 'Varga', 'Ferreira', 'Sato', 'Novak', 'Adeyemi']
const ROLES = ['Product designer', 'Staff engineer', 'Founder, Northwind', 'Design lead', 'iOS developer', 'Head of operations', 'Writer', 'Data scientist']
const QUOTES = [
  ['I open it ', 'a hundred times a day', '. It replaced four small utilities and my dock finally feels calm again.'],
  ['The plugin store means ', 'every tool I use', ' is one keystroke away, and building my own took an afternoon.'],
  ['Window layouts alone ', 'saved my sanity', ' on a laptop screen. Everything else is a very welcome bonus.'],
  ['It is the first app I install on a new machine ', 'before anything else', ', even before my editor.'],
]
const HIGHLIGHTS = [
  [['Favorite command:', 'Clipboard', 'Pulls back anything copied this week.'], ['Daily hotkey:', 'Window snap', 'Uses ', 'ctrl+opt', ' to tile two apps side by side for review.']],
  [['Built a plugin:', 'Deploy Bot', 'A release helper the whole team uses.'], ['Favorite command:', 'Quick math', 'Converts units and time zones without opening a calculator.']],
]

const PEOPLE = Array.from({ length: 24 }, (_, i) => {
  const first = FIRST[i % 12]
  const last = LAST[(i * 5 + 3) % 12]
  return {
    name: `${first} ${last}`.slice(0, 15),
    handle: `@${first.toLowerCase()}${i}`,
    role: ROLES[i % ROLES.length],
    hue: (i * 37) % 360,
    quote: QUOTES[i % QUOTES.length],
    highlights: HIGHLIGHTS[i % HIGHLIGHTS.length],
  }
})
const N = PEOPLE.length
const LOOP = [...PEOPLE, ...PEOPLE, ...PEOPLE] // middle copy is the "real" set

function Avatar({ person, active }) {
  const initials = person.name.split(' ').map((p) => p[0]).join('')
  return (
    <span
      className={`grid h-12 w-12 place-items-center rounded-full border border-white/10 text-[14px] font-semibold text-white transition-[filter,opacity] duration-200 [grid-area:avatar] ${active ? 'opacity-100' : 'opacity-50 grayscale'}`}
      style={{ background: `linear-gradient(135deg, hsl(${person.hue} 55% 55%), hsl(${(person.hue + 50) % 360} 45% 30%))` }}
    >
      {initials}
    </span>
  )
}

function PersonCard({ person, active, onSelect, cardRef }) {
  return (
    <button
      ref={cardRef}
      type="button"
      onClick={onSelect}
      className={`card-border-tsx mx-2 grid flex-none grid-cols-[auto_auto] items-center gap-x-4 gap-y-0 border-b border-b-transparent rounded-md py-3 pl-3 pr-4 text-left text-[14px] font-semibold leading-normal tracking-link transition-shadow duration-200 [grid-template-areas:'avatar_name''avatar_title'] sm:mx-4 sm:gap-x-6 sm:gap-y-1 sm:rounded-lg sm:p-6 sm:text-[16px] ${
        active ? 'bg-card shadow-person-active' : 'border-transparent sm:hover:border-card-border sm:hover:shadow-inset-top-1'
      }`}
    >
      <Avatar person={person} active={active} />
      <span className="self-end whitespace-nowrap text-white [grid-area:name]">
        {person.name} <span className="hidden text-grey-400 sm:inline">{person.handle}</span>
      </span>
      <span className="self-start whitespace-nowrap text-grey-300 [grid-area:title]">{person.role}</span>
    </button>
  )
}

// Settle physics measured on the original carousel (Embla scroll body, duration 25, friction .68, run on a
// fixed 60Hz step): per step v = (v + (target - x) / 25) * .68; x += v. Matches 2.7% at 17ms, 49% at 150ms,
// 91% at 400ms, 99% at 700ms of a one-card move.
function useEmblaTween(trackRef, target, dragging, jumpRef) {
  const st = useRef({ x: null, v: 0, raf: 0, acc: 0, last: 0 })
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const s = st.current
    cancelAnimationFrame(s.raf)
    // Selection changes and drag releases animate; resize / font re-centering (jumpRef) and drags jump.
    if (s.x === null) {
      // first commit (before the carousel is measured): place, keep any pending jump for the real centering
      s.x = target
      el.style.transform = `translate3d(${target}px,0,0)`
      return
    }
    const jump = dragging || jumpRef.current
    jumpRef.current = false
    if (jump) {
      s.x = target
      s.v = 0
      el.style.transform = `translate3d(${target}px,0,0)`
      return
    }
    s.last = performance.now()
    s.acc = 0
    const step = (now) => {
      s.acc += Math.min(100, now - s.last)
      s.last = now
      while (s.acc >= 1000 / 60) {
        s.v = (s.v + (target - s.x) / 25) * 0.68
        s.x += s.v
        s.acc -= 1000 / 60
      }
      if (Math.abs(target - s.x) < 0.001 && Math.abs(s.v) < 0.001) s.x = target
      el.style.transform = `translate3d(${s.x}px,0,0)`
      if (s.x !== target) s.raf = requestAnimationFrame(step)
    }
    s.raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(s.raf)
  }, [trackRef, target, dragging, jumpRef])
}

function PeopleCarousel({ active, setActive }) {
  const viewport = useRef(null)
  const track = useRef(null)
  const cards = useRef([])
  const [ioRef, inView] = useInView(0)
  const jumpRef = useRef(false)
  const [x, setX] = useState(0)
  const [drag, setDrag] = useState(null) // { startX, dx }
  const [pos, setPos] = useState(N + active) // index into LOOP
  const posRef = useRef(pos)
  posRef.current = pos

  // keep position in the middle copy when active changes from outside
  useEffect(() => {
    setPos((p) => (((p % N) + N) % N === active ? p : N + active))
  }, [active])

  const centerOn = (i) => {
    const vp = viewport.current
    const el = cards.current[i]
    if (!vp || !el) return 0
    return vp.offsetWidth / 2 - (el.offsetLeft + el.offsetWidth / 2)
  }
  // re-centering that should not animate (initial measure, resize, late fonts)
  const jumpTo = (v) =>
    setX((old) => {
      if (old !== v) jumpRef.current = true
      return v
    })
  const mounted = useRef(false)
  useLayoutEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      jumpTo(centerOn(pos))
    } else setX(centerOn(pos))
    const onResize = () => jumpTo(centerOn(posRef.current))
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [pos])
  useEffect(() => {
    document.fonts?.ready.then(() => jumpTo(centerOn(posRef.current)))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const select = (i) => {
    // re-anchor into the middle copy so the loop never runs out
    const real = ((i % N) + N) % N
    setActive(real)
    setPos(i < N / 2 || i >= 2 * N + N / 2 ? N + real : i)
  }

  // Original auto-advances one card every 10s while the carousel is in view (IO threshold 0).
  useEffect(() => {
    if (!inView || drag) return
    const t = setTimeout(() => select(pos + 1), 10000)
    return () => clearTimeout(t)
  }, [inView, drag, pos]) // eslint-disable-line react-hooks/exhaustive-deps

  useEmblaTween(track, x + (drag?.dx ?? 0), !!drag, jumpRef)

  const onPointerDown = (e) => setDrag({ startX: e.clientX, dx: 0, moved: false })
  const onPointerMove = (e) => {
    if (!drag) return
    const dx = e.clientX - drag.startX
    setDrag({ ...drag, dx, moved: drag.moved || Math.abs(dx) > 5 })
  }
  const onPointerUp = () => {
    if (!drag) return
    if (drag.moved) {
      // snap to the card nearest the viewport center
      const vp = viewport.current
      const center = vp.offsetWidth / 2 - (x + drag.dx)
      let best = pos
      let bestD = Infinity
      cards.current.forEach((el, i) => {
        if (!el) return
        const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - center)
        if (d < bestD) {
          bestD = d
          best = i
        }
      })
      select(best)
    }
    setDrag(null)
  }

  return (
    <div
      ref={viewport}
      className="person-mask w-full max-w-container cursor-grab touch-pan-y select-none overflow-hidden py-sp-8 active:cursor-grabbing sm:py-sp-10"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onClickCapture={(e) => drag?.moved && e.stopPropagation()}
    >
      <div ref={(el) => { track.current = el; ioRef.current = el }} className="flex w-max">
        {LOOP.map((p, i) => (
          <PersonCard
            key={i}
            person={p}
            active={i === pos}
            onSelect={() => select(i)}
            cardRef={(el) => (cards.current[i] = el)}
          />
        ))}
      </div>
    </div>
  )
}

function Highlight({ item, last }) {
  const [label, badge, ...desc] = item
  return (
    <>
      <span className="self-center font-geist text-[14px] font-medium leading-[1.6] tracking-link text-grey-300">{label}</span>
      <span className="flex justify-self-end sm:justify-self-start">
        <Badge icon="star">{badge}</Badge>
      </span>
      <div className={`col-start-2 hidden sm:block ${last ? '' : 'mb-[45px]'}`}>
        <p className="max-w-[320px] text-[14px] font-medium leading-6 tracking-ui text-grey-200">
          {desc.length === 1 ? (
            desc[0]
          ) : (
            <>
              {desc[0]}
              <code className="rounded-xs border border-grey-500 bg-grey-800 px-[3px] py-px font-geist text-[14px] font-bold text-brand-red">{desc[1]}</code>
              {desc[2]}
            </>
          )}
        </p>
      </div>
    </>
  )
}

export default function Testimonials() {
  const [active, setActive] = useState(0)
  const person = PEOPLE[active]
  return (
    <section className="section-container flex flex-col items-center">
      <SectionTitle
        className="max-w-[400px]"
        title="Loved by people who live on keys"
        subtitle="Notes from the folks who use it daily."
      />
      <PeopleCarousel active={active} setActive={setActive} />

      <div className="testimonial-panel grid w-full max-w-container-sm grid-cols-1 bg-top-sheen pt-sp-6 sm:grid-cols-[1fr_auto_1fr] sm:pt-sp-10">
        <div className="order-3 grid grid-cols-[1fr_auto] content-start gap-x-6 gap-y-4 sm:order-none sm:grid-cols-[auto_1fr]">
          {person.highlights.map((h, i) => (
            <Highlight key={i} item={h} last={i === person.highlights.length - 1} />
          ))}
        </div>
        <div className="order-2 py-8 sm:order-none sm:px-sp-6 sm:py-0">
          <div className="h-px w-full bg-grey-600 sm:h-full sm:w-[2px]" />
        </div>
        <blockquote
          key={active}
          data-reveal="quote"
          className="relative order-1 max-w-[490px] self-center text-[20px] sm:order-none font-medium leading-[1.6] text-grey-300"
        >
          <span aria-hidden className="absolute -left-[34px] -top-[26px] font-geist text-[56px] font-bold leading-none text-grey-600">&ldquo;</span>
          {person.quote[0]}
          <span className="text-white">{person.quote[1]}</span>
          {person.quote[2]}
          <span aria-hidden className="absolute -bottom-[45px] font-geist text-[56px] font-bold leading-none text-grey-600">&rdquo;</span>
        </blockquote>
      </div>
    </section>
  )
}
