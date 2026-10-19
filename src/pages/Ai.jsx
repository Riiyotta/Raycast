import { useState } from 'react'
import PageHero from '../components/PageHero.jsx'
import { AiCard, AiHeader, AI_CHAT, AI_CHECK, AI_COMMAND } from '../components/AiBento.jsx'
import SplitFeature from '../components/SplitFeature.jsx'
import PricingSection from '../components/PricingSection.jsx'
import FaqAccordion from '../components/FaqAccordion.jsx'
import { AppTile, ArrowLink, Icon, LightButton, SectionTitle } from '../components/shared.jsx'

/* /core-features/ai (PAGES_SPEC 4). Upper sections use the AiBento shell (max 1060, pad 0 20), 180px apart (80 at 390).
   Page-only: AiChipTabs, ByokRow, IconGrid, PaletteMock. */

/* ---------- AiChipTabs: stage 1020x800 (riseIn .7s ease-out .45s), 10 chips overlapping the stage bottom ---------- */
const CHIPS = [
  ['spark', 'Write', 'Draft a short launch note for the changelog'],
  ['globe', 'Translate', 'Turn this paragraph into plain French'],
  ['note', 'Summarize', 'Give me the three main points of this thread'],
  ['calendar', 'Plan', 'Block two focus hours tomorrow morning'],
  ['search', 'Research', 'Compare the two vendors on price and support'],
  ['cmd', 'Code', 'Explain what this shell script does'],
  ['chat', 'Reply', 'Answer this email politely and decline'],
  ['image', 'Describe', 'What is shown in this screenshot?'],
  ['clip', 'Extract', 'Pull every date out of the copied text'],
  ['bolt', 'Automate', 'Rename these files by the date they were made'],
]
function AiChipTabs() {
  const [active, setActive] = useState(0)
  const [, label, prompt] = CHIPS[active]
  return (
    <div className="relative">
      <div className="absolute left-1/2 top-1/2 h-[1000px] w-[1420px] -translate-x-1/2 -translate-y-1/2" aria-hidden style={{ background: 'radial-gradient(35% 35% at 50% 50%, rgba(255,99,99,.1), transparent 70%)' }} />
      <div className="relative h-[226px] animate-riseIn overflow-hidden rounded-[25px] border border-white/[.06] bg-white/[.02] sm:h-[800px]">
        <div className="grid h-full place-items-center px-6 sm:py-[100px]">
          <div key={active} className="wf-reveal w-full max-w-[640px] rounded-[18px] border border-white/10 bg-[#0d0e10] p-4 sm:p-6">
            <div className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-3 text-[14px] text-white/80 sm:h-12 sm:text-[18px]">
              <Icon name={CHIPS[active][0]} size={16} />
              {prompt}
              <span className="caret-blink h-5 w-px bg-white/70" />
            </div>
            <div className="mt-4 hidden flex-col gap-3 text-[15px] leading-[1.6] text-white/50 sm:flex">
              <span className="font-geist text-[12px] uppercase text-grey-300">{label}</span>
              <p>Here is a first pass. It keeps your tone, stays under the length you asked for and leaves room for a final edit.</p>
              <p>Want me to make it shorter, more formal or add a list of next steps at the end?</p>
            </div>
          </div>
        </div>
      </div>
      <ul className="relative mx-auto mt-6 flex max-w-[600px] flex-wrap justify-center gap-x-2 gap-y-2 px-4 sm:-mt-[60px]">
        {CHIPS.map(([icon, l], i) => (
          <li key={l}>
            <button
              type="button"
              aria-pressed={i === active}
              onClick={() => setActive(i)}
              className={`flex h-[30px] items-center gap-2 rounded-[10px] border border-transparent py-px pl-1.5 pr-2.5 text-[14px] leading-5 shadow-[inset_0_0_0_.5px_rgba(255,255,255,.1),inset_0_0_10px_rgba(255,255,255,.024)] transition-[color,background-color,border-color] duration-150 ${i === active ? 'bg-white/[.07] text-white/90' : 'text-white/35 hover:text-white/70'}`}
            >
              <Icon name={icon} size={16} />
              {l}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ---------- ByokRow ---------- */
function ByokRow() {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
      <div className="flex gap-2.5">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="grid h-[50px] w-[50px] place-items-center rounded-[11px] border border-white/[.08]" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,.016), rgba(255,255,255,.024))' }}>
            <AppTile size={24} hue={i * 80 + 20} radius="30%" />
          </span>
        ))}
      </div>
      <div>
        <h3 className="text-[16px] font-medium leading-6 text-white">Bring your own key for any provider</h3>
        <p className="text-[14px] leading-[22px] text-white/50">Connect an account you already pay for and use its models right inside the bar.</p>
      </div>
    </div>
  )
}

function Placeholder({ hue = 0, children }) {
  return (
    <div className="absolute inset-0 grid place-items-center" style={{ background: `radial-gradient(60% 70% at 50% 0, hsl(${hue} 70% 55% / .16), transparent)` }}>
      {children}
    </div>
  )
}

/* ---------- Split B icon grid: 5 cols of 80, gap 15, glowing centre tile ---------- */
function IconGrid() {
  return (
    <div className="grid grid-cols-[repeat(5,56px)] gap-[10px] sm:grid-cols-[repeat(5,80px)] sm:gap-[15px]" style={{ WebkitMaskImage: 'radial-gradient(closest-side, #000 50%, transparent)', maskImage: 'radial-gradient(closest-side, #000 50%, transparent)' }}>
      {Array.from({ length: 25 }, (_, i) =>
        i === 12 ? (
          <span key={i} className="relative z-[1] grid aspect-square place-items-center rounded-[25%] bg-ios-card shadow-[0_4px_40px_15px_rgba(8,9,11,.9),0_0_100px_20px_rgba(255,73,57,.25),0_1px_4px_rgba(0,0,0,.4)]">
            <AppTile size={44} hue={0} radius="28%" />
          </span>
        ) : (
          <span key={i} className="grid aspect-square place-items-center rounded-[25%] border border-white/[.06] bg-white/[.02]">
            <AppTile size={32} hue={(i * 41) % 360} radius="28%" className="opacity-50" />
          </span>
        ),
      )}
    </div>
  )
}

/* ---------- Split C command palette mock 650x484 bleeding past the edge ---------- */
function PaletteMock() {
  return (
    <div className="w-[650px] max-w-none overflow-hidden rounded-[26px] border border-white/10" style={{ background: 'linear-gradient(180deg, rgba(17,18,23,.96), rgba(17,18,23,.98))', height: 484 }}>
      <div className="flex h-16 items-center gap-3 border-b border-white/[.06] px-6 text-[18px] text-white/70">
        <Icon name="spark" size={18} />
        Ask anything about the selected text
      </div>
      <ul className="p-3 text-[15px] text-white/60">
        {['Fix spelling and grammar', 'Make it shorter', 'Change tone to friendly', 'Explain this simply', 'Find action items', 'Translate to German', 'Continue writing'].map((t, i) => (
          <li key={t} className={`flex items-center gap-3 rounded-xl px-3 py-3 ${i === 0 ? 'bg-white/[.06] text-white' : ''}`}>
            <AppTile size={20} hue={i * 45} radius="30%" />
            {t}
          </li>
        ))}
      </ul>
    </div>
  )
}

const BULLETS = [
  ['bolt', 'Runs in the background while you keep typing'],
  ['shield', 'Asks before it changes anything in your apps'],
  ['note', 'Keeps a short log of every step it took'],
]
const MINI = [
  ['Calendar', 'Move events and find open slots'],
  ['Tasks', 'Create and close to-dos by voice'],
  ['Mail', 'Draft replies from your notes'],
  ['Files', 'Find and rename local documents'],
]

const FAQ = [
  ['Which models can I use?', 'The free plan includes a set of fast models. Plus and Business unlock the larger ones, and Business can also connect its own provider keys for any model they support.'],
  ['Is my data used to train models?', 'No. Requests go to providers under terms that forbid training on your content, and we do not keep your conversations on our servers after they are answered.'],
  ['Does it work offline?', 'The assistant needs a connection to reach a model. Everything else in the launcher, including search, snippets and window layouts, works fully offline.'],
  ['Can I limit what the assistant can do?', 'Yes. Each tool asks for permission the first time it runs, and admins on Business can restrict tools and models for the whole team.'],
  ['How are requests counted?', 'Every message counts as one request. Larger models count a little more, and the remaining allowance is always visible in settings.'],
]

export default function Ai() {
  return (
    <main className="overflow-x-clip">
      <div className="mx-auto max-w-ai px-5">
        <div className="mt-20 sm:mt-[180px]">
          <PageHero
            variant="plain"
            title="Your assistant, one hotkey away"
            subtitle="Ask, write and act across your apps without opening a new window."
            actions={<LightButton className="w-[193px]">Download for Mac</LightButton>}
            footnote={<p className="text-[14px] leading-5 text-white/40">Free to start. Larger models with Plus.</p>}
          />
        </div>

        <AiChipTabs />

        <section className="mt-20 sm:mt-[100px]">
          <div className="grid gap-[15px] md:grid-cols-2 md:gap-[30px]">
            <div className="flex flex-col gap-[15px] md:gap-[30px]">
              <AiCard visualH="h-[160px] md:h-[158px]" title="Ask about the screen" desc="Point at any window and ask a question about what is on it, with no copying or uploading.">
                <Placeholder hue={210}><Icon name="window" size={48} className="text-white/30" /></Placeholder>
              </AiCard>
              <AiCard visualH="h-[260px] md:h-[276px]" title="Quick prompts" desc="Save the prompts you use most and run them on the selected text from any app you are in.">
                <AI_COMMAND />
              </AiCard>
            </div>
            <div className="flex flex-col gap-[15px] md:gap-[30px]">
              <AiCard visualH="h-[260px] md:h-[268px]" title="Grounded answers" desc="Replies cite your own notes, tasks and messages so you can check where each fact came from.">
                <AI_CHECK />
              </AiCard>
              <AiCard visualH="h-[160px] md:h-[166px]" title="Voice input" desc="Hold a key and talk. Your words become a prompt, a note or a reply in the active field.">
                <Placeholder hue={350}><Icon name="mic" size={48} className="text-white/30" /></Placeholder>
              </AiCard>
            </div>
          </div>
          <div className="mt-[50px]">
            <ByokRow />
          </div>
        </section>

        <section className="mt-20 sm:mt-[180px]">
          <AiHeader eyebrow="Agentic" title="Chat that actually gets work done" desc="Ask for a change and the assistant picks the right tools, does the steps and reports back on what it did." />
          <div className="relative h-[300px] overflow-hidden rounded-[25px] border border-white/[.06] sm:h-[675px]">
            <AI_CHAT />
          </div>
        </section>

        <section className="mt-20 sm:mt-[180px]">
          <SplitFeature
            layoutClass="lg:grid lg:grid-cols-[490px_490px] lg:items-center"
            gapClass="gap-10"
            textClass="flex flex-col gap-14"
            visual={
              <AiCard className="h-[400px]" visualH="h-full">
                <AI_CHAT />
              </AiCard>
            }
          >
            <AiHeader align="left" className="" eyebrow="Tools" title="Connect the apps you already use" desc="The assistant reads and writes to your apps through tools you approve once." />
            <ul className="flex flex-col gap-3">
              {BULLETS.map(([i, t]) => (
                <li key={t} className="flex items-center gap-3 text-[15px] leading-[22px] text-white/70">
                  <Icon name={i} size={16} />
                  {t}
                </li>
              ))}
            </ul>
            <div className="grid grid-cols-2 gap-x-10 gap-y-6">
              {MINI.map(([t, d]) => (
                <div key={t}>
                  <h4 className="text-[15px] font-medium text-white">{t}</h4>
                  <p className="text-[14px] leading-[1.5] text-white/50">{d}</p>
                </div>
              ))}
            </div>
          </SplitFeature>
        </section>

        <section className="mt-20 sm:mt-[180px]">
          <SplitFeature
            className="py-[72px]"
            layoutClass="lg:flex-row lg:items-start lg:justify-between"
            reverse
            gapClass="gap-10"
            textClass="lg:w-[460px] lg:pt-[25px]"
            visual={<IconGrid />}
          >
            <AiHeader align="left" className="" eyebrow="Plugins" title="Every plugin becomes a tool" desc="Installed plugins plug into the assistant, so a single question can reach dozens of services." />
            <ul className="mt-10 flex flex-col gap-10">
              {['Mention a plugin by name to call it directly', 'Chain several plugins in one request', 'Build your own tool with a few lines of code'].map((t) => (
                <li key={t} className="text-[16px] leading-6 text-white/70">{t}</li>
              ))}
            </ul>
            <div className="mt-10">
              <ArrowLink>Browse the plugin store</ArrowLink>
            </div>
          </SplitFeature>
        </section>

        <section className="mt-20 sm:mt-[180px]">
          <SplitFeature
            className="lg:min-h-[400px]"
            layoutClass="lg:flex-row lg:items-center"
            gapClass="gap-10"
            textClass="lg:w-[490px] lg:flex-none"
            visualClass="overflow-hidden lg:flex lg:h-[400px] lg:items-center lg:overflow-visible"
            visual={<PaletteMock />}
          >
            <AiHeader
              align="left"
              className=""
              eyebrow="Quick edits"
              title="Rewrite selected text in place, anywhere"
              desc="Select a sentence in any app, open the palette and pick a command. The result replaces your selection, so you never paste between windows again."
            />
          </SplitFeature>
        </section>

        <section className="mt-20 sm:mt-[180px]">
          <AiHeader title="Privacy" eyebrow="Built safe" desc="Your data stays yours. Clear controls for what is shared, stored and sent to models." />
          <div className="grid gap-[15px] md:grid-cols-2 md:gap-[30px]">
            {[
              ['No training', 'Providers may not train on your requests.', 'shield'],
              ['Short retention', 'Conversations are not stored after a reply.', 'lock'],
              ['Admin controls', 'Restrict tools and models for the team.', 'users'],
              ['Clear logs', 'See every tool call the assistant made.', 'note'],
            ].map(([t, d, i], n) => (
              <AiCard key={t} visualH={n < 2 ? 'h-[44px]' : 'h-0'} title={t} desc={d}>
                {n < 2 && <Icon name={i} size={24} className="text-white/50" />}
              </AiCard>
            ))}
          </div>
          <div className="mt-8 flex justify-center md:mt-[50px]">
            <ArrowLink>Read the full privacy and security overview</ArrowLink>
          </div>
        </section>
      </div>

      <section className="mx-auto mt-20 max-w-ext-top px-6 pb-[96px] sm:mt-[180px] sm:pb-[348px]">
        <PricingSection title={<SectionTitle size={32} title="Pricing" />} />
      </section>

      <section className="px-4 pb-[96px] pt-[96px] sm:pb-[156px] sm:pt-[180px]">
        <FaqAccordion title="FAQs" subtitle="Common questions about the assistant." items={FAQ} />
      </section>
    </main>
  )
}
