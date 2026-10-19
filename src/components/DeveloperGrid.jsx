import { forwardRef, useEffect, useState } from 'react'
import { Icon, useInView } from './shared.jsx'

/* ---------- Isometric helpers (original line art) ---------- */
const C = Math.cos(Math.PI / 6)
const S = 0.5
const P = (x, y, z) => [(x - y) * C, (x + y) * S - z]
const pts = (arr) => arr.map((p) => P(...p).map((n) => n.toFixed(1)).join(',')).join(' ')
const BLUE_D = 'rgb(25,60,140)'
const BLUE_L = 'rgb(90,150,255)'
const STROKE = '#2f3031'

function Box({ x, y, z, w, d, h, top = BLUE_D, side = '#0c0d0f', front = '#111214', stroke = STROKE }) {
  return (
    <g stroke={stroke} strokeWidth="1" strokeLinejoin="round">
      <polygon points={pts([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]])} fill={top} />
      <polygon points={pts([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]])} fill={front} />
      <polygon points={pts([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]])} fill={side} />
    </g>
  )
}
function Plane({ x, y, z, w, d, fill = 'rgba(90,150,255,.12)', stroke = BLUE_L, dash, className, style }) {
  return (
    <polygon
      className={className}
      style={style}
      points={pts([[x, y, z], [x + w, y, z], [x + w, y + d, z], [x, y + d, z]])}
      fill={fill}
      stroke={stroke}
      strokeDasharray={dash}
      strokeWidth="1"
    />
  )
}

function Fig({ variant, active }) {
  const vb = { layers: '-200 -170 400 300', computer: '-140 -150 280 260', toggle: '-140 -110 280 220', pieces: '-210 -120 420 260', disks: '-140 -130 280 250', float: '-140 -120 280 240' }[variant]
  return (
    <svg viewBox={vb} className="block h-full w-full" aria-hidden>
      {variant === 'layers' && (
        <>
          {/* FIG_01 (original ApiFig1): bottom from -37px, top from 55px (1.5s), focus from (2px,12px) (1s),
              labels fade up 20px over 2s with .5 / .65 / .85 / 1s delays */}
          <g className="fig-ease" style={{ transform: active ? 'none' : 'translateY(-37px)' }}>
            <Plane x={-60} y={-60} z={-40} w={200} d={140} fill="#0c0d0f" stroke={STROKE} />
          </g>
          <g className="fig-ease" style={{ transform: active ? 'none' : 'translateY(55px)' }}>
            <Plane x={-60} y={-60} z={10} w={200} d={140} fill="rgba(25,60,140,.35)" stroke={BLUE_L} />
          </g>
          <Plane className="fig-label" x={-40} y={-40} z={60} w={80} d={100} fill="rgba(10,42,110,.8)" stroke={BLUE_L} />
          <Plane className="fig-label" style={{ transitionDelay: '.65s' }} x={60} y={-40} z={60} w={60} d={40} fill="rgba(92,157,255,.5)" stroke={BLUE_L} />
          <Plane className="fig-label" style={{ transitionDelay: '.85s' }} x={60} y={20} z={60} w={60} d={40} fill="rgba(92,157,255,.25)" stroke={BLUE_L} dash="3 3" />
          <g style={{ transition: 'transform 1s cubic-bezier(.165,.84,.44,1)', transform: active ? 'none' : 'translate(2px, 12px)' }}>
            <Box x={-20} y={-20} z={110} w={40} d={40} h={14} top={BLUE_L} />
          </g>
        </>
      )}
      {variant === 'computer' && (
        <>
          <Box x={-60} y={-50} z={0} w={120} d={100} h={20} />
          <Box x={-50} y={-30} z={20} w={100} d={60} h={110} top="#111214" />
          {/* FIG_02 (original ApiFig2): screen runs screenBlinkStartup 1.5s ease, 1s delay */}
          <polygon className="fig-screen" points={pts([[-42, 30, 38], [42, 30, 38], [42, 30, 120], [-42, 30, 120]])} fill={BLUE_D} stroke={BLUE_L} data-motion="screen" />
          <Box x={-50} y={60} z={0} w={100} d={30} h={6} top="#1b1c1e" />
        </>
      )}
      {variant === 'toggle' && (
        <>
          <Box x={-90} y={-35} z={0} w={180} d={70} h={24} top="#111214" />
          {/* FIG_03 (original ApiFig3): indicator scales to 0 / fades over .5s easeOutCirc-like when active */}
          <g className="fig-indicator3">
            <Box x={10} y={-25} z={24} w={70} d={50} h={26} top={BLUE_L} side={BLUE_D} front={BLUE_D} />
          </g>
        </>
      )}
      {variant === 'pieces' && (
        <>
          <Plane x={-120} y={-30} z={0} w={90} d={60} fill="rgba(25,60,140,.4)" />
          <Box x={-10} y={-50} z={0} w={60} d={60} h={40} />
          {/* FIG_05 (original ApiFig5): battery drops in from -80px over 1.5s; indicator colours after .9s */}
          <g className="fig-ease" style={{ transform: active ? 'none' : 'translateY(-80px)' }}>
            <Box x={70} y={-20} z={0} w={40} d={80} h={18} top={BLUE_L} />
          </g>
          <Plane className="fig-mark5" x={-40} y={40} z={30} w={70} d={40} fill={active ? 'rgba(92,157,255,.3)' : 'transparent'} stroke={active ? BLUE_L : '#545454'} dash="4 3" />
        </>
      )}
      {variant === 'disks' && (
        <>
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <Box x={-50 + i * 6} y={-50 - i * 6} z={i * 16} w={100} d={100} h={10} top={i === 2 ? BLUE_D : '#111214'} />
            </g>
          ))}
          {/* FIG_04 (original ApiFig4): indicator moves (-70px,-35px) and back every 3s, 1.2s */}
          <g className="fig-indicator4">
            <Plane x={-26} y={-58} z={42} w={52} d={30} fill="rgba(92,157,255,.5)" />
          </g>
        </>
      )}
      {variant === 'float' && (
        /* FIG_06 (original ApiFig6): disc rises from 63px over 1.5s, then floats 0 -> 5px, 3s ease-in-out, from 1.5s */
        <>
          <Plane x={-70} y={-70} z={0} w={140} d={140} fill="none" stroke={STROKE} dash="4 4" />
          <g data-motion="float" className="fig-disc6">
            <Box x={-40} y={-40} z={40} w={80} d={80} h={80} top={BLUE_L} side={BLUE_D} front="#0a2a6e" />
          </g>
        </>
      )}
    </svg>
  )
}

/* ---------- Cells ---------- */
const cellBase = 'relative bg-grey-900'

const DottedCell = forwardRef(function DottedCell({ variant, className = '', active = false, toggle = false }, ref) {
  return (
    <div
      ref={ref}
      className={`${cellBase} api-fig flex items-center justify-center bg-dots bg-dots-17 bg-dots-offset p-[50px] ${className}`}
      data-fig={variant}
      data-active={active}
      data-toggle={toggle}
    >
      <span className="api-fig-caption ss09 absolute left-0 top-0 m-3 bg-code px-1 font-geist text-[10px] font-light uppercase tracking-caption text-grey-300" />
      <Fig variant={variant} active={active} />
    </div>
  )
})

function LinkCell({ title, body, h = '' }) {
  return (
    <a
      href="#"
      className={`${cellBase} group flex flex-col justify-between gap-sp-4 overflow-hidden p-6 transition-colors duration-150 hover:bg-grey-800 ${h}`}
    >
      <Icon
        name="arrow-ne"
        size={16}
        className="absolute right-6 top-6 text-grey-300 transition-[color,transform] duration-300 group-hover:-translate-y-[2px] group-hover:translate-x-[2px] group-hover:text-white"
      />
      <span />
      <div className="flex flex-col gap-2">
        <h4 className="text-[24px] font-medium leading-[1.6] tracking-ui text-white">{title}</h4>
        <p className="font-geist text-[14px] font-medium leading-[1.6] tracking-link text-grey-300">{body}</p>
      </div>
    </a>
  )
}

function Spacer({ h, min2 = false }) {
  return (
    <>
      <div className={`${cellBase} ${h} ${min2 ? 'hidden api2:block' : ''}`} />
      <div className={`${cellBase} ${h} hidden api2:block`} />
      <div className={`${cellBase} ${h} hidden api3:block`} />
    </>
  )
}

export default function DeveloperGrid() {
  // Observers exactly as on the original: FIG_01/02 threshold .7 once; FIG_03 + FIG_04 share FIG_04's .7
  // observer (toggles); FIG_05 threshold 1 once; FIG_06 threshold 1 (toggles).
  const [r1, a1] = useInView(0.7, { once: true })
  const [r2, a2] = useInView(0.7, { once: true })
  const [r34, a34] = useInView(0.7)
  const [r5, a5] = useInView(1, { once: true })
  const [r6, a6] = useInView(1)
  // FIG_04 'animated': flips its indicator every 3000ms while active
  const [flip, setFlip] = useState(false)
  useEffect(() => {
    if (!a34) return
    const id = setInterval(() => setFlip((f) => !f), 3000)
    return () => clearInterval(id)
  }, [a34])
  return (
    <section className="section-container">
      <div className="api-wrap relative">
        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-1/2 z-[1] w-screen -translate-x-1/2">
          <div className="absolute inset-y-0 left-0 api-fade-x bg-gradient-to-r from-grey-900 to-transparent" />
          <div className="absolute inset-y-0 right-0 api-fade-x bg-gradient-to-l from-grey-900 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-[146px] bg-gradient-to-b from-grey-900 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-[209px] bg-gradient-to-t from-grey-900 to-transparent" />
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] gap-px">
          <div className={`${cellBase} api-side`} />
          <div
className="api-inner">
            <Spacer h="h-[146px]" />
            <Spacer h="h-12" />

            <DottedCell ref={r1} active={a1} variant="layers" className="h-[281px] api2:col-span-2 api2:h-[485px] api3:col-start-2 api3:row-span-2" />
            <div className={`${cellBase} flex h-[123px] flex-col gap-sp-4 p-6 api2:h-auto api3:h-[271px]`}>
              <h3 className="text-[32px] font-normal leading-[1.1718] tracking-ui text-white api2:text-[56px]">
                Extend it with your code
              </h3>
            </div>
            <div className={`${cellBase} flex h-[186px] flex-col justify-between gap-sp-4 p-6 api2:h-auto api3:h-[213px]`}>
              <p className="font-geist text-[14px] font-medium leading-[1.6] tracking-link text-grey-300">
                Write plugins with familiar web tools and share them with your whole team in minutes.
              </p>
              <a href="#" className="group inline-flex items-center gap-1 self-start text-[14px] font-medium text-white">
                Read the docs
                <Icon name="arrow-ne" size={16} className="text-grey-300 transition-[color,transform] duration-300 group-hover:-translate-y-[2px] group-hover:translate-x-[2px] group-hover:text-white" />
              </a>
            </div>

            <Spacer h="h-12" />

            <DottedCell ref={r2} active={a2} variant="computer" className="h-[326px] api2:h-[var(--api-h6)] api3:col-span-2 api3:h-[456px]" />
            <LinkCell h="h-[300px] api2:h-[var(--api-h6)] api3:h-[456px]" title="Typed toolkit" body="A strongly typed library of list, form and detail views that look native out of the box." />

            <DottedCell active={a34} variant="toggle" className="h-[330px] api2:hidden api3:flex api3:h-[355px]" />
            <LinkCell h="h-[300px] api2:h-[var(--api-h4)] api3:h-[355px]" title="Hot reload" body="Save a file and see the change in the bar instantly, with logs streamed to your terminal." />
            <DottedCell ref={r34} active={a34} toggle={flip} variant="disks" className="hidden h-[355px] api2:flex api2:h-[var(--api-h4)] api3:h-[355px]" />

            <Spacer h="h-12" min2 />

            <LinkCell h="hidden h-[429px] api2:flex" title="Local storage" body="Persist settings and cached data with a simple key value store that syncs per user." />
            <DottedCell ref={r5} active={a5} variant="pieces" className="hidden h-[429px] api2:flex api3:col-span-2" />

            <DottedCell ref={r6} active={a6} variant="float" className="h-[326px] api2:h-[var(--api-h6)] api3:col-span-2 api3:h-[456px]" />
            <LinkCell h="h-[300px] api2:h-[var(--api-h6)] api3:h-[456px]" title="Team publishing" body="Share private plugins inside your organization with versioning and review built in." />

            <div className={`${cellBase} hidden h-16 api3:block`} />
            <a
              href="#"
              className={`${cellBase} group flex h-16 items-center justify-center gap-1 text-[14px] font-medium text-white hover:bg-grey-800`}
            >
              Get started
              <Icon name="arrow-ne" size={16} className="text-grey-300 transition-[color,transform] duration-300 group-hover:-translate-y-[2px] group-hover:translate-x-[2px] group-hover:text-white" />
            </a>
            <div className={`${cellBase} hidden h-16 api2:block`} />

            <Spacer h="h-[189px]" />
          </div>
          <div className={`${cellBase} api-side`} />
        </div>
      </div>
    </section>
  )
}
