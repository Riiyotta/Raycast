import { useEffect, useRef, useState } from 'react'

/* ---------- Hooks ---------- */
// IntersectionObserver hook, same contract as the original's useInView({ threshold, once }).
// Pass `rootMargin` / `amount` style options through `opts` when needed.
export function useInView(threshold = 0, { once = false, rootMargin } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (once && inView) return
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting && once) io.disconnect()
      },
      { threshold, rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [threshold, once, rootMargin, inView])
  return [ref, inView]
}

export function useReducedMotion() {
  const [reduce, setReduce] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const on = () => setReduce(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduce
}

// Step sequencer, same semantics as the original's showcase hook:
// steps = [[fn, waitMs], ...]. While `playing`, runs step n, waits, advances. The last step does not
// advance. Resets to step 0 whenever `playing` or `resetKey` changes.
export function useSequence(steps, playing, resetKey) {
  const [n, setN] = useState(0)
  const timer = useRef()
  useEffect(() => setN(0), [resetKey, playing])
  useEffect(() => {
    if (!playing) return
    const step = steps[n]
    if (!step) return
    step[0]()
    timer.current = setTimeout(() => {
      if (n !== steps.length - 1) setN(n + 1)
    }, step[1])
    return () => clearTimeout(timer.current)
  }, [playing, steps, n, resetKey])
}

// Typing helper, as in the original: one step per character, delay = round(rand * base / 2) + base.
export function typeOut(text, set, prefix = '', base = 50) {
  return text.split('').map((_, i) => [() => set(prefix + text.slice(0, i + 1)), Math.round((Math.random() * base) / 2) + base])
}

/* ---------- Icons (original, generic line glyphs) ---------- */
const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }

export function Icon({ name, size = 16, className = '' }) {
  const p = { width: size, height: size, viewBox: '0 0 16 16', className, 'aria-hidden': true, ...base }
  switch (name) {
    case 'arrow-right':
      return <svg {...p}><path d="M3 8h10M9 4l4 4-4 4" /></svg>
    case 'arrow-left':
      return <svg {...p}><path d="M13 8H3M7 4L3 8l4 4" /></svg>
    case 'arrow-ne':
      return <svg {...p}><path d="M5 11l6-6M6 5h5v5" /></svg>
    case 'chevron-right':
      return <svg {...p}><path d="M6 4l4 4-4 4" /></svg>
    case 'download':
      return <svg {...p}><path d="M8 2.5v8M4.5 7.5L8 11l3.5-3.5M3 13.5h10" /></svg>
    case 'spark':
      return <svg {...p}><path d="M8 2v3M8 11v3M2 8h3M11 8h3M4 4l1.8 1.8M10.2 10.2L12 12M12 4l-1.8 1.8M5.8 10.2L4 12" /></svg>
    case 'grid':
      return <svg {...p}><rect x="2.5" y="2.5" width="4" height="4" rx="1" /><rect x="9.5" y="2.5" width="4" height="4" rx="1" /><rect x="2.5" y="9.5" width="4" height="4" rx="1" /><rect x="9.5" y="9.5" width="4" height="4" rx="1" /></svg>
    case 'clip':
      return <svg {...p}><rect x="3.5" y="3" width="9" height="11" rx="1.5" /><path d="M6 3V2h4v1M6 7h4M6 10h3" /></svg>
    case 'window':
      return <svg {...p}><rect x="2" y="3" width="12" height="10" rx="2" /><path d="M2 6h12" /></svg>
    case 'bolt':
      return <svg {...p}><path d="M9 1.5L3.5 9H8l-1 5.5L12.5 7H8z" /></svg>
    case 'search':
      return <svg {...p}><circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5L14 14" /></svg>
    case 'note':
      return <svg {...p}><path d="M3 2.5h7l3 3v8H3z" /><path d="M5.5 8h5M5.5 10.5h3.5" /></svg>
    case 'calendar':
      return <svg {...p}><rect x="2.5" y="3.5" width="11" height="10" rx="1.5" /><path d="M2.5 6.5h11M5.5 2v3M10.5 2v3" /></svg>
    case 'chat':
      return <svg {...p}><path d="M2.5 3.5h11v7h-6l-3 2.5v-2.5h-2z" /></svg>
    case 'cmd':
      return <svg {...p}><path d="M6 6V4.5A1.5 1.5 0 104.5 6H6zm0 0h4m-4 0v4m4-4V4.5A1.5 1.5 0 1111.5 6H10zm0 0v4m0 0h1.5A1.5 1.5 0 1110 11.5V10zm0 0H6m0 0v1.5A1.5 1.5 0 114.5 10H6z" /></svg>
    case 'hash':
      return <svg {...p}><path d="M6 2L5 14M11 2l-1 12M2.5 5.5h11M2 10.5h11" /></svg>
    case 'bird':
      return <svg {...p}><path d="M2 12c4 1 8-1 9.5-5l2-2.5-2 .3C10.5 3 8 3.5 7.5 6 5 6 3.5 4.5 2.5 3.5 2 6 3.5 8 5 8.5 4 9 3 9 2.5 9c.5 1 1.5 1.5 2.5 1.5C4 11.5 3 12 2 12z" /></svg>
    case 'shield':
      return <svg {...p}><path d="M8 1.5l5 2v4c0 3.2-2.2 5.6-5 7-2.8-1.4-5-3.8-5-7v-4z" /></svg>
    case 'star':
      return <svg {...p}><path d="M8 2l1.8 3.8 4.2.5-3.1 2.9.8 4.1L8 11.3l-3.7 2 .8-4.1L2 6.3l4.2-.5z" /></svg>
    case 'apple':
      // generic "device" glyph used in place of a platform logo
      return <svg {...p} fill="currentColor" stroke="none"><rect x="3" y="2" width="10" height="12" rx="3" /></svg>
    case 'check':
      return <svg {...p}><path d="M3.5 8.5l3 3 6-7" /></svg>
    case 'dash':
      return <svg {...p}><path d="M5 8h6" /></svg>
    case 'chevron-down':
      return <svg {...p}><path d="M12.25 5.75 8 10.25l-4.25-4.5" /></svg>
    case 'info':
      return <svg {...p}><circle cx="8" cy="8" r="6" /><path d="M8 7.5v3.5M8 5h.01" /></svg>
    case 'play':
      return <svg {...p} fill="currentColor" stroke="none"><path d="M5 3l8 5-8 5z" /></svg>
    case 'users':
      return <svg {...p}><circle cx="6" cy="5.5" r="2.5" /><path d="M1.5 13.5c.5-2.5 2.3-4 4.5-4s4 1.5 4.5 4M10.5 3.2a2.5 2.5 0 010 4.6M12 9.7c1.3.5 2.2 1.8 2.5 3.8" /></svg>
    case 'globe':
      return <svg {...p}><circle cx="8" cy="8" r="6" /><path d="M2 8h12M8 2c1.8 1.7 2.6 3.7 2.6 6S9.8 12.3 8 14c-1.8-1.7-2.6-3.7-2.6-6S6.2 3.7 8 2z" /></svg>
    case 'lock':
      return <svg {...p}><rect x="3" y="7" width="10" height="7" rx="1.5" /><path d="M5.5 7V5a2.5 2.5 0 015 0v2" /></svg>
    case 'image':
      return <svg {...p}><rect x="2" y="3" width="12" height="10" rx="1.5" /><circle cx="6" cy="6.5" r="1" /><path d="M2.5 12l3.5-3.5 2.5 2.5 2-2 3 3" /></svg>
    case 'mic':
      return <svg {...p}><rect x="6" y="2" width="4" height="8" rx="2" /><path d="M3.5 8a4.5 4.5 0 009 0M8 12.5V14" /></svg>
    case 'qr':
      return <svg {...p}><rect x="2.5" y="2.5" width="4" height="4" /><rect x="9.5" y="2.5" width="4" height="4" /><rect x="2.5" y="9.5" width="4" height="4" /><path d="M9.5 9.5h1.5v1.5M13.5 9.5v4h-4" /></svg>
    default:
      return <svg {...p}><circle cx="8" cy="8" r="5.5" /></svg>
  }
}

/* ---------- Buttons (spec 0.10) ---------- */
// size="lg": 48px tall with a two-line label (children 14px/16 + `sub` 12px/16). block: full width.
export function LightButton({ children, icon = 'apple', className = '', as: Tag = 'a', size, sub, block, ...rest }) {
  const lg = size === 'lg'
  return (
    <Tag
      href={Tag === 'a' ? '#' : undefined}
      className={`inline-flex min-h-[36px] items-center justify-center gap-2 whitespace-nowrap rounded-normal bg-grey-50 px-3 py-2 text-[14px] font-medium leading-4 tracking-ui text-grey-500 shadow-btn-light outline-none transition-[background-color,box-shadow,transform] duration-200 ease-in-out [transition-duration:200ms,200ms,100ms] hover:bg-white focus-visible:shadow-btn-light-focus active:bg-grey-100 ${lg ? 'min-h-[48px]' : ''} ${block ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {icon && <Icon name={icon} size={lg ? 20 : 16} />}
      {sub ? (
        <span className="flex flex-col items-start text-left">
          <span className="text-[12px] leading-4">{sub}</span>
          <span className="text-[14px] leading-4">{children}</span>
        </span>
      ) : (
        children
      )}
    </Tag>
  )
}

export function DarkButton({ children, className = '', as: Tag = 'button', size, sub, block, ...rest }) {
  const lg = size === 'lg'
  const sized = lg
    ? 'min-h-[48px] gap-2 px-3 py-2 text-[14px] font-medium leading-4 tracking-ui'
    : ''
  return (
    <Tag
      type={Tag === 'button' ? 'button' : undefined}
      className={`inline-flex items-center justify-center rounded-normal bg-btn-dark text-white shadow-btn-dark transition-shadow duration-200 hover:shadow-btn-dark-hover ${sized} ${block ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {sub ? (
        <span className="flex flex-col items-start text-left">
          <span className="text-[12px] leading-4">{sub}</span>
          <span className="text-[14px] leading-4">{children}</span>
        </span>
      ) : (
        children
      )}
    </Tag>
  )
}

export function ArrowLink({ children, href = '#', variant = 'right', className = '' }) {
  const ne = variant === 'ne'
  return (
    <a
      href={href}
      className={`group inline-flex items-center gap-[3px] text-[16px] font-medium leading-[1.4] tracking-link text-grey-200 transition-colors duration-300 hover:text-white ${className}`}
    >
      {children}
      <Icon
        name={ne ? 'arrow-ne' : 'arrow-right'}
        size={16}
        className={`transition-transform duration-300 ${ne ? 'group-hover:translate-x-[2px] group-hover:-translate-y-[2px]' : 'group-hover:translate-x-[2px]'}`}
      />
    </a>
  )
}

/* ---------- SectionTitle ---------- */
// size: 20 (homepage default) | 24 (/pro) | 32 (/ios, AI page; 20px/32 below 720) | 48 (/pro FAQ).
// eyebrow: mono label 8px above the h2. body: 18px/27 paragraph under the pair. subClass: second-line color.
const ST_SIZE = {
  20: 'text-[18px] font-medium leading-[1.6] tracking-ui sm:text-[20px] sm:leading-normal',
  24: 'text-[24px] font-medium leading-normal tracking-ui',
  32: 'text-[20px] font-medium leading-[32px] tracking-ui sm:text-[32px] sm:leading-[51.2px]',
  48: 'text-[20px] font-medium leading-normal tracking-ui',
}
export function SectionTitle({ title, subtitle, align = 'center', className = '', id, size = 20, eyebrow, body, subClass = 'text-grey-300' }) {
  return (
    <div
      id={id}
      className={`scroll-mt-[108px] ${ST_SIZE[size]} ${align === 'center' ? 'text-center' : align === 'left' ? 'text-left' : ''} ${className}`}
    >
      {eyebrow && (
        <p className="mb-2 font-jet text-[14px] font-medium uppercase leading-[16.1px] tracking-ui text-grey-300">{eyebrow}</p>
      )}
      <h2 className={size === 48 ? 'mb-4 text-[48px] font-semibold leading-normal text-white' : 'text-white'}>{title}</h2>
      {subtitle && <p className={subClass}>{subtitle}</p>}
      {body && (
        <p className={`mt-4 max-w-[516px] text-[18px] font-normal leading-[27px] tracking-ui text-grey-300 ${align === 'center' ? 'mx-auto' : ''}`}>{body}</p>
      )}
    </div>
  )
}

/* ---------- Eyebrow ---------- */
export function Eyebrow({ children }) {
  return <span className="font-jet text-[12px] font-medium uppercase leading-4 tracking-eyebrow text-brand-red">{children}</span>
}

/* ---------- Badge (testimonial / feature wall) ---------- */
export function Badge({ icon = 'spark', children, size }) {
  return (
    <span className={`inline-flex items-center gap-2 self-start rounded-sm bg-grey-600 text-[14px] font-medium text-white ${size === 'sm' ? 'h-6 px-1' : 'h-[26px] px-1.5'}`}>
      <Icon name={icon} size={16} />
      {children}
    </span>
  )
}

/* ---------- Keyboard key (spec 4) ---------- */
export function Key({ alt, label, width = 110, glyph = false, className = '', style, children, ...rest }) {
  return (
    <div className={`key ${className}`} style={{ width, ...style }} {...rest}>
      {children ?? (
        <>
          <span className="alt self-start text-[16px] leading-none">{alt}</span>
          <span className={`self-end leading-none ${glyph ? 'text-[28px]' : ''}`}>{label}</span>
        </>
      )}
    </div>
  )
}

/* ---------- Placeholder wordmark ---------- */
export function LogoMark({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className="flex-none" aria-hidden>
      <defs>
        <linearGradient id="lm" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff8a8a" />
          <stop offset="1" stopColor="#e5484d" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="6" fill="url(#lm)" />
      <path d="M8 16V8h3.5M8 16h8" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  )
}

/* ---------- HeroDownloadInfo (spec 2, reused in 12) ---------- */
export function HeroDownloadInfo() {
  return (
    <div className="hidden flex-col items-center sm:flex">
      <LightButton>Download for Mac</LightButton>
      <p className="plus-lighter mt-4 font-geist text-[12px] leading-[1.6] tracking-ui text-white opacity-40">
        v2.4 &middot; macOS 13 or later &middot; 42 MB
      </p>
      <div className="mt-2 flex gap-[25px] font-geist text-[12px] leading-[1.6] tracking-ui text-grey-200">
        <button type="button" className="transition-colors duration-200 hover:text-white">Install via Homebrew</button>
        <button type="button" className="sub-divider relative transition-colors duration-200 hover:text-white">Linux build</button>
      </div>
    </div>
  )
}

/* Simple placeholder app tile (generic gradient square) */
export function AppTile({ size = 20, hue = 0, radius = '25%', className = '' }) {
  return (
    <span
      className={`inline-block flex-none ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        background: `linear-gradient(135deg, hsl(${hue} 70% 62%), hsl(${(hue + 40) % 360} 65% 38%))`,
      }}
    />
  )
}
