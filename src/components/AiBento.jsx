import { useEffect, useState } from 'react'
import { AppTile, ArrowLink, Eyebrow, Icon, useInView, useReducedMotion } from './shared.jsx'

const BORDER =
  'linear-gradient(135deg, rgba(255,255,255,.1), rgba(255,255,255,.06) 38%, rgba(255,255,255,.06) 62%, rgba(255,255,255,.1))'

export function AiCard({ title, desc, visualH, className = '', children }) {
  return (
    <article
      className={`gradient-border isolate flex flex-col overflow-hidden rounded-xl bg-white/[.02] p-[15px] md:rounded-bento md:p-6 ${className}`}
      style={{ '--gb': BORDER }}
      data-reveal="ai-card"
    >
      <div className={`relative flex-none overflow-hidden ${title ? 'mb-6' : ''} ${visualH}`}>{children}</div>
      {title && <h3 className="max-w-[450px] text-[15px] font-medium leading-[1.5] text-white md:text-[16px]">{title}</h3>}
      {desc && <p className="plus-lighter mt-1 max-w-[450px] text-[13px] leading-[1.5] text-white/40 md:text-[15px]">{desc}</p>}
    </article>
  )
}

function Dots() {
  return (
    <div className="flex gap-2">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-3 w-3 rounded-full bg-white/15" />
      ))}
    </div>
  )
}

// Workflow demo, timings from the original (framer useInView amount .05; content unmounts when out of view):
// step 1 user message (600ms) -> step 2 tool calls, one every 1200ms, the active one shows its loading title
// with a 1.5s shimmer -> step 3 assistant reply streamed word by word every 25ms. Reduced motion: final state.
const TOOLS = [
  { icon: 'calendar', loading: 'Moving the event...', title: 'Updated event \u00b7 Thu 15:00' },
  { icon: 'chat', loading: 'Posting to the channel...', title: 'Posted message to #design' },
]
const REPLY = 'Done. The review now starts tomorrow at 3pm and the channel has a short note with the new time.'

function useTicker(active, ms, count) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!active || n >= count) return
    const t = setTimeout(() => setN(n + 1), ms)
    return () => clearTimeout(t)
  }, [active, ms, count, n])
  return n
}

function StreamText({ text, interval = 25, reduce }) {
  const [len, setLen] = useState(reduce ? text.length : 0)
  useEffect(() => {
    if (len >= text.length) return
    const chunk = text.slice(len).match(/^\s*\S+\s*/)?.[0] ?? text.slice(len)
    const t = setTimeout(() => setLen(len + chunk.length), interval)
    return () => clearTimeout(t)
  }, [len, text, interval])
  return text.slice(0, len)
}

function Workflow({ startDelay = 600 }) {
  const reduce = useReducedMotion()
  const step = useTicker(!reduce, startDelay, 1) // step 0 (user message only) lasts `startDelay` ms
  const toolStep = useTicker(!reduce && step >= 1, 1200, TOOLS.length)
  const s = reduce ? 2 : step < 1 ? 0 : toolStep < TOOLS.length ? 1 : 2
  const visibleTools = s === 0 ? [] : s === 1 ? TOOLS.slice(0, toolStep + 1) : TOOLS
  return (
    <>
      <div className="self-end rounded-lg bg-white/[.08] px-3 py-2 text-white/80">Move my 3pm review to tomorrow and tell the team.</div>
      {visibleTools.map((t, i) => {
        const loading = s === 1 && i === toolStep
        return (
          <div key={t.icon} className="wf-row flex items-center gap-2 text-[13px] text-white/40">
            <Icon name={t.icon} size={14} />
            <span className="wf-label" data-loading={loading}>{loading ? t.loading : t.title}</span>
          </div>
        )
      })}
      {s === 2 && (
        <>
          <div className="wf-reveal max-w-[520px] text-white/70">
            <StreamText text={REPLY} reduce={reduce} />
          </div>
          <span className="wf-reveal mt-auto inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/[.04] px-2.5 py-1 text-[12px] text-white/60">
            <AppTile size={16} hue={210} /> Calendar
          </span>
        </>
      )}
    </>
  )
}

// `startDelay`: how long the user message sits alone before the first tool call (homepage original: ~3.4s).
function ChatWindow({ startDelay = 600 }) {
  const [ref, inView] = useInView(0.05)
  return (
    <div ref={ref} className="absolute inset-0 flex overflow-hidden rounded-md border border-white/[.06] bg-[#0d0e10]">
      <aside className="hidden w-[278px] flex-none flex-col gap-1 border-r border-white/[.06] p-3 text-[13px] text-white/50 sm:flex">
        <Dots />
        <div className="mt-4 rounded-sm bg-white/[.06] px-2 py-1.5 text-white/80">Weekly planning</div>
        {['Draft release notes', 'Rename image batch', 'Summarize long thread', 'Fix flaky test', 'Gift ideas'].map((t) => (
          <div key={t} className="truncate px-2 py-1.5">{t}</div>
        ))}
      </aside>
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 text-[14px]" data-motion="workflow">
        <div className="sm:hidden"><Dots /></div>
        {inView && <Workflow startDelay={startDelay} />}
      </div>
    </div>
  )
}

function CommandVisual() {
  return (
    <div className="absolute inset-0 flex flex-col items-center pt-10">
      <div className="flex h-12 w-[88%] items-center gap-2 rounded-[18px] border border-white/10 bg-white/[.04] px-4 text-[18px] text-white/70">
        Rewrite this in a calmer tone<span className="h-5 w-px bg-white/70 caret-blink" />
      </div>
      <ul className="mask-fade-down mt-4 w-[88%] px-4 text-[18px] leading-[32px] text-white/30">
        {['Shorten to one line', 'Fix spelling and grammar', 'Make it more formal', 'Turn into a list', 'Explain like I am new', 'Translate to Spanish'].map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </div>
  )
}

function CheckVisual() {
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-4 px-6">
      <div className="max-w-[300px] self-end rounded-lg bg-white/[.08] px-3 py-2 text-[14px] text-white/80">
        Which of my open tasks are due this week?
      </div>
      <div className="flex items-center gap-2 text-[12px] text-white/40">
        <AppTile size={16} hue={30} />
        <AppTile size={16} hue={140} />
        <AppTile size={16} hue={260} />
        Checking three sources...
      </div>
      <div className="rounded-md border border-white/[.06] bg-white/[.02] p-3 text-[13px] leading-[1.6] text-white/60">
        Four tasks are due before Friday. Two belong to the launch board and two are personal reminders.
      </div>
      <div className="text-[11px] text-white/30">Sources: Tasks, Notes, Mail</div>
    </div>
  )
}

// Section header (eyebrow + 32px h2 + 18px desc). `align="left"` for split layouts; `className` overrides padding.
export function AiHeader({ eyebrow, title, desc, align = 'center', className = 'pb-sp-7 pt-[72px]' }) {
  const left = align === 'left'
  return (
    <div className={`relative flex flex-col gap-2 ${left ? 'items-start text-left' : 'items-center text-center'} ${className}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="text-balance text-[32px] font-medium leading-[1.2] tracking-ai-title text-white">{title}</h2>
      {desc && (
        <p className="plus-lighter mt-1 max-w-[500px] text-[15px] leading-[1.5] tracking-ai-desc text-white/50 md:text-[18px]">{desc}</p>
      )}
    </div>
  )
}

export const AI_CHAT = ChatWindow
export const AI_COMMAND = CommandVisual
export const AI_CHECK = CheckVisual

// Defaults render the homepage section; /pro passes its own header copy, `cards` and `link`.
export default function AiBento({
  eyebrow = 'Assisted',
  title = 'Answers ready wherever you type',
  desc = 'Ask questions, draft text and act on your apps without switching.',
  cards,
  link = 'Learn more about assistants',
  linkHref = '#',
  workflowDelay = 600,
}) {
  return (
    <section className="relative mx-auto my-20 max-w-ai px-5 md:my-[180px]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[360px]"
        style={{ background: 'radial-gradient(45% 35% at 50% 55%, rgba(255,99,99,.12), transparent 70%)' }}
      />
      <AiHeader eyebrow={eyebrow} title={title} desc={desc} />

      <div className="flex flex-col gap-[15px] md:mt-10 md:grid md:grid-cols-2 md:gap-[30px]">
        {cards ?? (
          <>
            <AiCard
              className="md:col-span-2"
              visualH="h-[130px] md:h-[332px]"
              title="Chat that acts"
              desc="Hand off small chores in plain language. The assistant calls the right app, confirms what changed and keeps a log."
            >
              <ChatWindow startDelay={workflowDelay} />
            </AiCard>
            <AiCard
              visualH="h-[227px] md:h-[368px]"
              title="Quick prompts"
              desc="Save your go-to prompts and run them on any selected text with a short command."
            >
              <CommandVisual />
            </AiCard>
            <AiCard
              visualH="h-[361px] md:h-[368px]"
              title="Context aware"
              desc="Answers draw on the tools you connect, citing your own tasks, notes and messages."
            >
              <CheckVisual />
            </AiCard>
          </>
        )}
      </div>

      <div className="mt-8 flex justify-center md:mt-[50px]">
        <ArrowLink href={linkHref}>{link}</ArrowLink>
      </div>
    </section>
  )
}
