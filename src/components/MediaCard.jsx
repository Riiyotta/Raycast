import { useEffect, useRef, useState } from 'react'
import { Badge, Icon } from './shared.jsx'

/* DotGrid (pro card 3): 8x5 circles 10x10, gap 40, col width 53.7, 1px rgba(86,194,255,.314).
   Columns 1-4 pulse in staggered bands (dotPulse1/2/3, 6s ease infinite); 5-8 stay hollow. */
export function DotGrid() {
  const band = (c) => (c === 0 ? 'dot-pulse-3' : c === 1 ? 'dot-pulse-2' : c < 4 ? 'dot-pulse-1' : '')
  return (
    <div className="grid w-max grid-cols-[repeat(8,53.7px)] gap-y-10 py-2">
      {Array.from({ length: 40 }, (_, i) => {
        const c = i % 8
        return <span key={i} className={`h-2.5 w-2.5 rounded-full border border-[rgba(86,194,255,.314)] ${band(c)}`} style={c < 4 ? { animationDelay: `${(i >> 3) * 0.15}s` } : undefined} />
      })}
    </div>
  )
}

/* Mock app window used as a poster on /windows cards (1px window-border, radius 18, bg black/.5) */
export function MockWindow({ rows = 5, className = '', hue = 210 }) {
  return (
    <div className={`overflow-hidden rounded-[18px] border border-window-border bg-black/50 ${className}`}>
      <div className="flex h-12 items-center gap-2 border-b border-white/[.06] px-4">
        <Icon name="search" size={14} className="text-white/40" />
        <span className="h-2 w-32 rounded bg-white/15" />
      </div>
      <div className="flex flex-col gap-2 p-3">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className={`flex items-center gap-3 rounded-md px-2 py-1.5 ${i === 0 ? 'bg-white/[.06]' : ''}`}>
            <span className="h-5 w-5 rounded-[5px]" style={{ background: `hsl(${(hue + i * 37) % 360} 55% 50%)` }} />
            <span className="h-2 rounded bg-white/20" style={{ width: 140 - i * 14 }} />
            <span className="ml-auto h-2 w-10 rounded bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Placeholder playback length for the hover "video" (no asset; progress fill uses width .2s linear)
const LOOP_MS = 8000

function WindowsCard({ title, badge, icon = 'window', wide, poster, hue }) {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const t0 = useRef(0)
  useEffect(() => {
    if (!playing) return
    t0.current = performance.now()
    const id = setInterval(() => setProgress(((performance.now() - t0.current) % LOOP_MS) / LOOP_MS), 200)
    return () => clearInterval(id)
  }, [playing])
  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-md border border-card-border bg-card shadow-inset-top transition-colors duration-300 hover:border-white/[.12] ${wide ? 'sm:col-span-2 sm:min-h-[582px]' : 'sm:min-h-[426px]'}`}
      onMouseEnter={() => setPlaying(true)}
      onMouseLeave={() => {
        setPlaying(false)
        setProgress(0)
      }}
    >
      <div className={`relative flex flex-none items-end justify-center overflow-hidden px-8 pt-12 ${wide ? 'h-[100px] sm:h-[460px]' : 'h-[100px] sm:h-[280px]'}`}>
        <div className="w-full max-w-[640px] transition-opacity duration-300 ease-in-out group-hover:opacity-0">{poster}</div>
      </div>
      {/* "video" layer: covers the whole card at opacity 0, fades in on hover */}
      <div
        aria-hidden
        className="media-video pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
        style={{ backgroundImage: `linear-gradient(110deg, hsl(${hue} 40% 12%), hsl(${(hue + 50) % 360} 55% 28%), hsl(${hue} 40% 10%))` }}
      />
      <Icon name={icon} size={16} className="absolute left-4 top-4 text-white" />
      <div className="relative flex flex-col gap-6 px-8 pb-8 pt-4">
        <h3 className="text-[20px] font-medium leading-normal tracking-ui text-white">{title}</h3>
        <Badge size="sm" icon="bolt">{badge}</Badge>
      </div>
      <div className={`absolute inset-x-0 bottom-0 h-0.5 bg-white/20 transition-opacity duration-300 ${playing ? 'opacity-100' : 'opacity-0'}`}>
        <div className="h-full bg-accent-red transition-[width] duration-200 ease-linear" style={{ width: `${progress * 100}%` }} />
      </div>
    </article>
  )
}

/* PAGES_SPEC 2.5. variant: 'pro' | 'windows' | 'ios' */
export default function MediaCard({ variant = 'pro', ...p }) {
  if (variant === 'windows') return <WindowsCard {...p} />
  if (variant === 'ios') {
    const { title, desc, link, footnote, visual, bleed, className = '', visualClass = '' } = p
    return (
      <article
        className={`flex flex-col gap-2 overflow-hidden rounded-xl bg-ios-card backdrop-blur-10 ${bleed ? 'border border-transparent px-6 pb-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,.1)] sm:px-10 sm:pb-10' : 'border border-card-border p-6 sm:p-10'} ${className}`}
      >
        {visual && <div className={`relative ${bleed ? '-mx-6 mb-6 sm:-mx-10' : 'mb-6'} ${visualClass}`}>{visual}</div>}
        <h3 className="text-[18px] font-medium leading-[20.7px] tracking-ui text-white">{title}</h3>
        <p className="text-[14px] leading-[22.4px] tracking-ui text-grey-200">{desc}</p>
        {link && (
          <a href="#" className="mt-2 self-start text-[14px] leading-[16.1px] text-grey-200 underline decoration-white/20 underline-offset-4 transition-[text-decoration-color] duration-100 ease-out hover:decoration-white">
            {link}
          </a>
        )}
        {footnote && <p className="mt-auto text-[12px] leading-[13.8px] text-grey-300">{footnote}</p>}
      </article>
    )
  }
  // pro
  const { title, sub, badge, badgeIcon = 'spark', visual, mask, className = '' } = p
  return (
    <article className={`flex flex-col gap-[30px] overflow-hidden rounded-md border border-card-border bg-card px-6 py-[30px] shadow-inset-top sm:min-h-[436px] sm:gap-[46px] sm:px-8 ${className}`}>
      <div className="relative h-[223px] flex-none" style={mask ? { WebkitMaskImage: mask, maskImage: mask } : undefined}>
        {visual}
      </div>
      <div className="flex max-w-[524px] flex-col gap-4">
        <p className="text-[20px] font-medium leading-normal tracking-ui">
          <span className="text-white">{title}</span> <span className="text-grey-200">{sub}</span>
        </p>
        {badge && <Badge icon={badgeIcon}>{badge}</Badge>}
      </div>
    </article>
  )
}
