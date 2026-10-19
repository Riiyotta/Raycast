import { useEffect, useState } from 'react'
import { Badge, Icon, useInView } from './shared.jsx'

// 12 original features. theme = "r,g,b" for --theme-color (first is the measured 215,42,42)
const FEATURES = [
  { text: 'Pin files to the top. ', badge: 'Favorites', icon: 'star', theme: '215,42,42', sub: 'Keep the things you open most at the top of the root search, ready instantly.' },
  { text: 'Name any window. ', badge: 'Window names', icon: 'window', theme: '42,120,215', sub: 'Give windows a nickname and jump straight to them from the bar.' },
  { text: 'Hide the dock. ', badge: 'Focus mode', icon: 'shield', theme: '120,60,215', sub: 'Silence badges and hide distractions for a set block of time.' },
  { text: 'Emoji in two keys. ', badge: 'Emoji picker', icon: 'spark', theme: '215,160,42', sub: 'Search symbols by name and paste them into any text field.' },
  { text: 'Sticky notes. ', badge: 'Notes', icon: 'note', theme: '42,180,120', sub: 'A small always-on-top pad for scratch thoughts and quick lists.' },
  { text: 'Kill busy processes. ', badge: 'Processes', icon: 'bolt', theme: '215,90,42', sub: 'See what is eating memory and quit it without opening a monitor.' },
  { text: 'Search your mail. ', badge: 'Mail search', icon: 'search', theme: '42,160,215', sub: 'Find threads by sender or subject and open them in your client.' },
  { text: 'Set reminders fast. ', badge: 'Reminders', icon: 'calendar', theme: '200,42,140', sub: 'Type a time in plain words and get a nudge right on schedule.' },
  { text: 'Hotkeys for scripts. ', badge: 'Script hotkeys', icon: 'cmd', theme: '90,90,215', sub: 'Turn any shell script into a command with arguments and output.' },
  { text: 'Grab a screen color. ', badge: 'Color picker', icon: 'grid', theme: '215,42,90', sub: 'Pick a pixel and copy it in the format your code expects.' },
  { text: 'Chat anywhere. ', badge: 'Quick chat', icon: 'chat', theme: '42,200,200', sub: 'Ask a fast question in a floating window that stays out of the way.' },
  { text: 'Track your time. ', badge: 'Timers', icon: 'clip', theme: '160,200,42', sub: 'Start a named timer and see the countdown in the menu bar.' },
]

function FeatureImage({ f, active, index }) {
  return (
    <div
      className="wall-img absolute left-2 top-2 aspect-square h-[342px] overflow-hidden rounded-feature-img sm:h-[633px]"
      data-active={active}
      aria-hidden={!active}
      style={{
        background: `radial-gradient(70% 60% at 30% 25%, rgba(${f.theme},.35), transparent 70%), linear-gradient(160deg, #141518, #0a0b0d)`,
      }}
    >
      <div className="absolute left-10 top-10 flex w-[360px] flex-col gap-2 rounded-md border border-white/10 bg-black/40 p-4 backdrop-blur-8">
        <div className="flex items-center gap-2 text-[14px] text-white/80">
          <Icon name={f.icon} size={16} /> {f.badge}
        </div>
        {[0, 1, 2, 3].map((r) => (
          <div key={r} className="flex items-center gap-3">
            <span className="h-5 w-5 rounded-xs" style={{ background: `rgba(${f.theme},${0.7 - r * 0.15})` }} />
            <span className="h-2 rounded-full bg-white/20" style={{ width: 180 - r * 30 - index * 3 }} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function FeatureWall() {
  const [active, setActive] = useState(0)
  const [clicks, setClicks] = useState(0)
  const [rightRef, visible] = useInView(0.2)
  const f = FEATURES[active]
  // Original: while .right is >=20% visible, every 5s jump to a random *different* feature. The interval is
  // re-armed whenever the active item changes or the user picks one.
  useEffect(() => {
    if (!visible) return
    const id = setInterval(() => {
      let n = Math.floor(Math.random() * FEATURES.length)
      if (n === active) n = (n + 1) % FEATURES.length
      setActive(n)
    }, 5000)
    return () => clearInterval(id)
  }, [clicks, visible, active])
  const pick = (i) => {
    setActive(i)
    setClicks((c) => c + 1)
  }

  return (
    <section className="section-container flex justify-center">
      <div className="flex w-full max-w-container flex-col-reverse items-center justify-between gap-10 sm:flex-row sm:gap-0">
        {/* Left */}
        <div className="flex w-full min-w-0 max-w-[626px] flex-col-reverse gap-6 sm:min-w-[380px] sm:flex-col sm:gap-sp-9 sm:px-6">
          <p className="max-w-[400px] text-[24px] font-medium leading-[1.6] tracking-ui text-grey-400">
            <span className="block text-white">Small touches, big gains.</span>
            <span>Like </span>
            {FEATURES.map((x, i) => (
              <span
                key={i}
                role="button"
                tabIndex={0}
                onClick={() => pick(i)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && pick(i)}
                className={`wall-text cursor-pointer transition-[color,text-shadow] duration-300 hover:text-grey-200 ${i === active ? 'active' : ''}`}
              >
                {x.text}
              </span>
            ))}
            <a href="#" className="transition-colors duration-300 hover:text-grey-200">And plenty more besides.</a>
          </p>
          <div className="flex max-w-[311px] flex-col gap-4">
            <Badge icon={f.icon}>{f.badge}</Badge>
            <p className="hidden text-[14px] font-medium leading-[1.6] tracking-ui text-grey-200 sm:block sm:min-h-[70px]">
              {f.sub}{' '}
              <a href="#" className="text-white underline underline-offset-4">Learn more</a>
            </p>
          </div>
        </div>

        {/* Right */}
        <div ref={rightRef} className="flex h-[302px] w-full max-w-[578px] flex-col items-center sm:h-auto" style={{ '--theme-color': f.theme }}>
          <div className="w-full shadow-wall-wrap transition-shadow duration-600">
            <div
              className="wall-frame-mask relative mx-auto h-[342px] w-[342px] overflow-hidden rounded-lg bg-[rgba(var(--theme-color),.02)] p-2 shadow-wall-frame backdrop-blur-2 sm:h-[528px] sm:w-[553px]"
            >
              {FEATURES.map((x, i) => (
                <FeatureImage key={i} f={x} index={i} active={i === active} />
              ))}
            </div>
          </div>
          <div
            className="relative -mt-12 flex h-2 w-[240px] flex-none gap-2 sm:mt-0 w920:mx-auto"
            style={{ '--animation-play-state': visible ? 'running' : 'paused' }}
          >
            {FEATURES.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Show feature ${i + 1}`}
                onClick={() => pick(i)}
                className="wall-seg-wrap"
                data-current={i === active}
              >
                <span
                  key={i === active ? `on-${active}` : 'off'}
                  className="wall-seg"
                  data-current={i === active}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
