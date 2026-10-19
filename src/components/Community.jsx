import { useRef, useState } from 'react'
import { ArrowLink, Icon, SectionTitle } from './shared.jsx'

const SOCIALS = [
  { area: 'slack', icon: 'hash', name: 'Chatroom', count: '42k members', body: 'Swap workflows, get help with plugins and hear about betas first.', cta: 'Join' },
  { area: 'twitter', icon: 'bird', name: 'Microblog', count: '120k follows', body: 'Short tips, release notes and the occasional behind the scenes clip.', cta: 'Follow' },
]

const VIDEOS = Array.from({ length: 18 }, (_, i) => ({
  title: [
    'Ten shortcuts I use every single day',
    'Building a tiny plugin in one hour',
    'Tidy windows on an ultrawide screen',
    'Snippets for faster support replies',
    'A calm desktop setup tour',
    'Scripting the boring parts of my job',
  ][i % 6],
  hue: (i * 29 + 200) % 360,
}))
const SLIDE = 230 + 40 // flex-basis + 2 x 20px margin

function VideoTicker() {
  const loop = [...VIDEOS, ...VIDEOS]
  const min = -(loop.length * SLIDE) + 1204
  const [x, setX] = useState(467 - VIDEOS.length * SLIDE)
  const drag = useRef(null)
  const clamp = (v) => Math.max(min, Math.min(467, v))

  return (
    <div
      className="video-mask w-full max-w-container cursor-grab touch-pan-y select-none overflow-hidden py-sp-6 active:cursor-grabbing"
      onPointerDown={(e) => (drag.current = { sx: e.clientX, x0: x, moved: false })}
      onPointerMove={(e) => {
        if (!drag.current) return
        const dx = e.clientX - drag.current.sx
        if (Math.abs(dx) > 5) drag.current.moved = true
        setX(clamp(drag.current.x0 + dx))
      }}
      onPointerUp={() => (drag.current = null)}
      onPointerLeave={() => (drag.current = null)}
      onClickCapture={(e) => drag.current?.moved && e.preventDefault()}
    >
      <div className="flex w-max" style={{ transform: `translate3d(${x}px,0,0)` }}>
        {loop.map((v, i) => (
          <a key={i} href="#" draggable={false} className="group mx-5 block flex-[0_0_230px]">
            <div
              className="gradient-border relative h-[129px] w-[230px] overflow-hidden rounded-md bg-grey-400 shadow-video transition-[transform,box-shadow] duration-300 group-hover:scale-[1.04] group-hover:shadow-video-hover"
              style={{ '--gb': 'linear-gradient(rgba(255,255,255,.2), transparent)' }}
            >
              <div
                className="absolute inset-0 grayscale-[.5] transition-[filter] duration-300 group-hover:grayscale-0"
                style={{ background: `radial-gradient(60% 80% at 30% 30%, hsl(${v.hue} 60% 50%), hsl(${(v.hue + 60) % 360} 40% 18%))` }}
              >
                <span className="absolute left-1/2 top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white">
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden><path d="M3 2l7 4-7 4z" fill="currentColor" /></svg>
                </span>
              </div>
            </div>
            <p className="mt-4 min-h-[40px] text-[14px] font-semibold leading-[1.4] text-white opacity-80 transition-opacity duration-300 group-hover:opacity-100">
              {v.title}
            </p>
          </a>
        ))}
      </div>
    </div>
  )
}

// Title + the two social cards (no background art, no video ticker). Reused on /teams.
export function SocialCards({
  className = '',
  title = 'Join the regulars',
  subtitle = 'Thousands of people share setups, plugins and tips with each other every day.',
  items = SOCIALS,
}) {
  return (
    <div className={`grid w-full max-w-[948px] grid-cols-1 gap-x-10 gap-y-8 px-6 sm:grid-cols-2 sm:gap-y-sp-7 sm:[grid-template-areas:'title_title''slack_twitter'] ${className}`}>
      <SectionTitle
        className="mx-auto mb-6 max-w-[486px] sm:mb-0 sm:[grid-area:title]"
        title={title}
        subtitle={subtitle}
      />
      {items.map((s) => (
        <a
          key={s.area}
          href="#"
          className="social-card group relative flex flex-col gap-4 rounded-md border border-card-border bg-glass p-4 shadow-nav backdrop-blur-10 sm:p-6"
        >
          <div className="flex items-center gap-4">
            <Icon name={s.icon} size={25} className="flex-none text-white" />
            <h5 className="flex-1 text-[20px] font-medium leading-normal tracking-ui text-white">{s.name}</h5>
            <span className="font-geist text-[14px] font-medium leading-[1.6] tracking-link text-grey-200">{s.count}</span>
          </div>
          <p className="text-[14px] font-medium leading-[1.6] tracking-ui text-grey-200">{s.body}</p>
          <span className="mt-auto inline-flex items-center gap-1 text-[14px] font-medium leading-[1.15] text-white">
            {s.cta}
            <Icon name="arrow-right" size={16} className="transition-transform duration-300 group-hover:translate-x-[2px]" />
          </span>
        </a>
      ))}
    </div>
  )
}

export default function Community() {
  return (
    <section className="relative isolate flex flex-col items-center overflow-hidden">
      <div
        className="pointer-events-none absolute left-1/2 top-0 z-[-1] aspect-[818/657] -translate-x-1/2 opacity-45"
        style={{
          width: 'clamp(680px, calc(561px + 32vw), 818px)',
          background:
            'repeating-linear-gradient(48deg, rgba(255,60,80,0) 0 50px, rgba(255,60,80,.35) 70px, rgba(255,160,170,.2) 76px, rgba(255,60,80,0) 110px)',
          filter: 'blur(18px)',
          WebkitMaskImage: 'radial-gradient(closest-side, #000, transparent)',
          maskImage: 'radial-gradient(closest-side, #000, transparent)',
        }}
      />

      <SocialCards className="mb-[120px]" />

      <VideoTicker />

      <div className="flex max-w-[360px] flex-col items-center gap-[29px] px-6 text-center">
        <p className="text-[14px] font-medium leading-[1.6] tracking-ui text-grey-200">
          Short walkthroughs from the team and community on setups, plugins and tricks.
        </p>
        <ArrowLink className="min-h-[25px]">Watch videos</ArrowLink>
      </div>
    </section>
  )
}
