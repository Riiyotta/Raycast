import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { AppTile, Icon, LightButton, SectionTitle, typeOut, useInView, useSequence } from './shared.jsx'

const cardCls =
  'relative overflow-hidden rounded-md border border-card-border bg-auto-card shadow-inset-top'

function Desc({ icon, title, children, className = '' }) {
  return (
    <div className={`relative flex flex-col gap-4 p-6 ${className}`}>
      <h5 className="flex items-center gap-4 text-[18px] font-normal leading-6 text-white">
        <Icon name={icon} size={24} />
        {title}
      </h5>
      <p className="text-[14px] font-medium leading-[1.6] tracking-ui text-grey-200">{children}</p>
    </div>
  )
}

// Original snippet showcase (plays while the section container is >=10% visible, IO .1):
// wait 1000ms, type the keyword at 100-150ms per char, wait 50ms, then the completion replaces it
// (opacity 0 -> 1, no transition). The emoji button turns into a restart button that replays it.
function Composer({ playing }) {
  const [run, setRun] = useState(0)
  return <ComposerRun key={run} playing={playing} onRestart={() => setRun((r) => r + 1)} />
}
function ComposerRun({ playing, onRestart }) {
  const [typed, setTyped] = useState('')
  const [done, setDone] = useState(false)
  const steps = useMemo(() => [[() => {}, 1000], ...typeOut(';thanks', setTyped, '', 100), [() => {}, 50], [() => setDone(true), 0]], [])
  useSequence(steps, playing)
  return (
    <div className="relative h-[176px] w-[460px] max-w-full overflow-hidden rounded-b-md border border-t-0 sm:h-auto sm:rounded-md sm:border-t border-white/10 bg-[rgba(10,22,48,.85)] p-4 shadow-[0_20px_60px_rgba(0,0,0,.45)] backdrop-blur-10">
      <div className="mb-3 flex items-center gap-2 text-[12px] text-white/40">
        <AppTile size={16} hue={210} /> New message
      </div>
      <p className="min-h-[88px] text-[16px] leading-[1.5] text-white/80" data-motion="typing">
        Hi Sam, thanks for the quick turnaround.{' '}
        <span className="relative">
          <span className="snip-completion" data-visible={done}>
            <span className="text-accent-cyan">Here is the link to the final file</span>
            <span className="ml-px inline-block h-[18px] w-px translate-y-[3px] bg-white caret-blink" />
          </span>
          {!done && (
            <span className="absolute left-0 top-0 whitespace-nowrap">
              {typed}
              <span className="ml-px inline-block h-[18px] w-px translate-y-[3px] bg-white caret-blink" />
            </span>
          )}
        </span>
      </p>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onRestart}
          disabled={!done}
          className="relative font-geist text-[12px] text-white/40 transition-opacity duration-300 ease-in-out disabled:cursor-default"
          aria-label="Replay snippet"
        >
          <span className={`inline-block transition-[opacity,transform] duration-[300ms,500ms] ease-in-out ${done ? 'opacity-0' : 'opacity-100'}`}>;thanks</span>
          <span className={`absolute left-0 top-0 inline-block transition-[opacity,transform] duration-[300ms,500ms] ease-in-out ${done ? 'rotate-0 opacity-100' : 'rotate-[30deg] opacity-0'}`}>&#8635; replay</span>
        </button>
        <LightButton as="button" icon={null} className="min-h-[30px] px-3 py-1">Send</LightButton>
      </div>
    </div>
  )
}

function QuicklinksMock() {
  return (
    <div className="mask-quicklinks aspect-[580/207] w-full max-w-[580px] self-end overflow-hidden">
      <div className="ml-6 mt-6 h-full overflow-hidden rounded-tl-md border border-b-0 border-r-0 border-white/[.08] bg-[#101113]">
        <div className="flex h-11 items-center gap-2 border-b border-white/[.06] px-4 text-[14px] text-white/40">
          <Icon name="search" size={14} /> docs ticket 4182
        </div>
        {['Open ticket in tracker', 'Search team docs', 'Open staging dashboard', 'Find in shared drive'].map((r, i) => (
          <div key={r} className={`flex h-10 items-center gap-3 px-4 text-[13px] ${i === 0 ? 'bg-white/[.06] text-white' : 'text-white/60'}`}>
            <AppTile size={18} hue={(i * 70 + 200) % 360} radius="5px" />
            {r}
            <span className="ml-auto text-[11px] text-white/30">Link</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Original hotkeys showcase (IO .2): wait 2000ms, switch to the next combo (out-in swap, 300ms each way),
// then press keys one by one: stage 0 for 1000ms, 1 key 100ms, 2 keys 100ms, all 500ms, release; repeat.
const COMBOS = [
  [{ w: 110, glyph: '⌃', label: 'control' }, { w: 110, glyph: '⌥', label: 'option' }, { w: 138, glyph: 'N', label: 'new note' }],
  [{ w: 110, glyph: '⌥', label: 'option' }, { w: 110, glyph: 'A', label: 'assistant' }],
  [{ w: 137, glyph: '⇧', label: 'shift' }, { w: 138, glyph: '⌘', label: 'command' }, { w: 110, glyph: 'U', label: 'upload' }],
  [{ w: 110, glyph: '⌥', label: 'option' }, { w: 110, glyph: 'X', label: 'translate' }],
  [{ w: 137, glyph: '⇧', label: 'shift' }, { w: 138, glyph: '⌘', label: 'command' }, { w: 110, glyph: 'S', label: 'snap' }],
]
const PRESS = [[0, 1000], [1, 100], [2, 100], [3, 500], [0, 0]]
const IDLE_MS = 2000
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

function Combo({ keys, stage, className }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {keys.map((k, i) => (
        <div key={k.label + i} className="flex items-center gap-3">
          {i > 0 && <span className="text-[22px] text-grey-300">+</span>}
          <div className="key !h-[105px]" style={{ width: k.w }} data-pressed={i < stage} data-hotkey-index={i}>
            <span className="self-start text-[24px] leading-none text-white/80">{k.glyph}</span>
            <span className="alt self-end text-[14px] leading-none">{k.label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function HotkeyIllustration() {
  const [ref, inView] = useInView(0.2)
  const [combo, setCombo] = useState(0)
  const [stage, setStage] = useState(0)
  // swap: { from, phase: 'exit' | 'enter', active }
  const [swap, setSwap] = useState(null)
  const shown = useRef(0)
  useEffect(() => {
    if (!inView) return
    let alive = true
    // Sequential, not a fixed interval: idle 2000ms, swap combo, run the 1700ms press sequence, repeat
    // (measured on the original: next swap starts 2.0s after release, period ~3.7s).
    ;(async () => {
      while (alive) {
        await wait(IDLE_MS)
        if (!alive) return
        setCombo((c) => (c + 1) % COMBOS.length)
        for (const [s, ms] of PRESS) {
          if (!alive) return
          setStage(s)
          await wait(ms)
        }
      }
    })()
    return () => {
      alive = false
    }
  }, [inView])
  // SwitchTransition mode out-in, timeout 300. Layout effect so the incoming combo never paints before the exit.
  useLayoutEffect(() => {
    if (combo === shown.current) return
    const from = shown.current
    shown.current = combo
    setSwap({ from, phase: 'exit', active: false })
    const r1 = requestAnimationFrame(() => requestAnimationFrame(() => setSwap({ from, phase: 'exit', active: true })))
    const t1 = setTimeout(() => {
      setSwap({ from, phase: 'enter', active: false })
      requestAnimationFrame(() => requestAnimationFrame(() => setSwap({ from, phase: 'enter', active: true })))
    }, 300)
    const t2 = setTimeout(() => setSwap(null), 600)
    return () => {
      cancelAnimationFrame(r1)
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [combo])
  const exiting = swap?.phase === 'exit'
  const keys = COMBOS[exiting ? swap.from : combo]
  const cls = swap ? `${exiting ? 'hk-exit' : 'hk-enter'} ${swap.active ? 'hk-active' : ''}` : ''
  return (
    <div ref={ref} data-inview={inView} className="flex h-[114px] items-center justify-center sm:h-auto sm:px-6 sm:pt-10">
      <div className="flex flex-none scale-[.61] items-center gap-3 sm:scale-100">
        <Combo keys={keys} stage={exiting ? 0 : stage} className={cls} />
      </div>
    </div>
  )
}

export default function Automation() {
  const [ref, inView] = useInView(0.1)
  return (
    <section className="section-container flex flex-col items-center">
      <div ref={ref} data-inview={inView} className="flex w-full max-w-container flex-col gap-sp-6">
        <SectionTitle className="mx-auto max-w-[510px]" title="Automate the busy work" subtitle="Text, links and hotkeys that do the work." />

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:[grid-template-areas:'top_top''left_right']">
          {/* Top */}
          <div className="relative sm:[grid-area:top]">
            <div className="auto-backdrop" />
            <div className={`${cardCls} flex min-h-[218px] flex-col sm:flex-row`}>
              <Desc icon="note" title="Snippets" className="max-w-[420px] sm:justify-center">
                Type a short keyword anywhere and watch it grow into a full reply, address or template.
              </Desc>
              <div
                className="pointer-events-none absolute -right-[5%] top-[-160%] h-[643px] w-[800px] opacity-75"
                style={{
                  background:
                    'repeating-linear-gradient(130deg, rgba(60,120,255,0) 0 50px, rgba(60,120,255,.22) 70px, rgba(140,214,255,.12) 78px, rgba(60,120,255,0) 110px), radial-gradient(50% 50% at 50% 70%, rgba(30,70,180,.5), transparent)',
                  filter: 'blur(6px)',
                }}
              />
              <div className="relative order-first flex flex-1 items-start justify-center px-4 sm:order-none sm:items-center sm:justify-end sm:p-6 sm:py-[14px] sm:pr-14">
                <Composer playing={inView} />
              </div>
            </div>
          </div>

          {/* Left */}
          <div className={`${cardCls} flex flex-col border-b-0 sm:min-h-[341px] sm:[grid-area:left]`}>
            <QuicklinksMock />
            <Desc icon="bolt" title="Quick links" className="max-w-[399px]">
              Bookmark any URL or folder with a slot for a query, then open it anywhere with two keystrokes.
            </Desc>
          </div>

          {/* Right */}
          <div className={`${cardCls} grid grid-cols-[minmax(0,1fr)] grid-rows-[1fr_auto] border-b-0 sm:min-h-[341px] sm:[grid-area:right]`}>
            <HotkeyIllustration />
            <Desc icon="cmd" title="Hotkeys">
              Bind any command, script or plugin to a key combo or alias and trigger it from every app.
            </Desc>
          </div>
        </div>
      </div>
    </section>
  )
}
