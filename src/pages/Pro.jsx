import { useState } from 'react'
import AiBento from '../components/AiBento.jsx'
import PageHero, { HeroPill } from '../components/PageHero.jsx'
import PricingSection from '../components/PricingSection.jsx'
import FaqAccordion from '../components/FaqAccordion.jsx'
import MediaCard, { DotGrid, MockWindow } from '../components/MediaCard.jsx'
import SplitFeature, { PairHead } from '../components/SplitFeature.jsx'
import { Icon, LightButton, SectionTitle } from '../components/shared.jsx'

/* /pro (PAGES_SPEC 4). Page-only: ProArt, ModelTabs, Translator/Themes visuals. */

// 1489x635 at top 0 (888x378 at 390): soft colored horizon glow placeholder
function ProArt() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-0 h-[378px] w-[888px] -translate-x-1/2 sm:h-[635px] sm:w-[1489px]"
      style={{
        background:
          'radial-gradient(45% 38% at 50% 100%, rgba(86,194,255,.35), transparent 70%), radial-gradient(70% 30% at 50% 100%, rgba(170,225,255,.18), transparent 80%), radial-gradient(30% 60% at 50% 0, rgba(154,170,255,.12), transparent)',
        WebkitMaskImage: 'linear-gradient(#000 70%, transparent)',
        maskImage: 'linear-gradient(#000 70%, transparent)',
      }}
    />
  )
}

function ComparePlans() {
  return (
    <div className="flex flex-col items-center gap-4">
      <LightButton icon={null} className="w-[128px]" href="/pricing">Get Plus</LightButton>
      <p className="font-geist text-[14px] font-medium leading-[22.4px] tracking-link text-grey-300">Try free for two weeks</p>
    </div>
  )
}

/* ---------- ModelTabs ---------- */
const TABS = ['Swift', 'Atlas', 'Atlas Large', 'Corvid', 'Nimbus', 'Nimbus Mini', 'Orca', 'Kestrel', 'Lumen', 'Open weights', 'Vision models', 'Local models via app']
const COLS = ['MODEL', 'STARTER', 'PLUS', 'BUSINESS']
const SUFFIX = ['Mini', 'Base', 'Pro', 'Long context', 'Reasoning', 'Turbo', 'Vision', 'Code', 'Fast', 'Classic', 'Preview', 'Large', 'Edge']
function ModelTabs() {
  const [tab, setTab] = useState(0)
  const rows = SUFFIX.map((s, i) => [`${TABS[tab].split(' ')[0]} ${s}`, i < 3, true, (i + tab) % 4 !== 3])
  return (
    <div className="flex min-h-[902px] flex-col items-center">
      <div className="max-w-[424px] text-center">
        <SectionTitle size={24} title="Pick your model" subtitle="Switch per conversation" />
        <p className="mt-2 text-[16px] font-medium leading-[25.6px] text-grey-200">
          Every plan includes a set of models. Plus unlocks the larger ones for drafts.
        </p>
      </div>
      <div className="scrollbar-none mt-8 w-full max-w-[1000px] overflow-x-auto">
        <div role="tablist" className="flex w-max gap-8 px-6">
          {TABS.map((t, i) => (
            <button
              key={t}
              role="tab"
              type="button"
              aria-selected={i === tab}
              onClick={() => setTab(i)}
              className={`flex h-12 flex-col items-center justify-between whitespace-nowrap text-[14px] font-medium leading-[22.4px] tracking-ui transition-colors duration-300 ${i === tab ? 'text-white' : 'text-grey-200 hover:text-white'}`}
            >
              <Icon name={['spark', 'globe', 'bolt', 'star'][i % 4]} size={20} />
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-8 w-full max-w-[910px] rounded-lg bg-top-sheen shadow-inset-top">
        <div className="scrollbar-none overflow-x-auto">
          <table className="mx-auto mt-6 w-[630px] border-collapse text-left">
            <thead>
              <tr className="h-[23px] font-geist text-[12px] font-medium leading-[19.2px] text-grey-300">
                {COLS.map((c, i) => (
                  <th key={c} className={`font-medium ${i === 0 ? 'w-[248px]' : i < 3 ? 'w-[146px] text-center' : 'text-center'}`}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([name, ...cells]) => (
                <tr key={name} className="h-[39px] border-b-2 border-transparent">
                  <td className="text-[14px] font-medium leading-[22.4px] text-grey-200">{name}</td>
                  {cells.map((on, j) => (
                    <td key={j} className="text-center">
                      {on && <Icon name="check" size={16} className="mx-auto text-white" />}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mx-auto mt-4 w-[630px] pb-6 font-geist text-[12px] leading-[19.2px] text-grey-300">Limits reset on the first day.</p>
        </div>
      </div>
    </div>
  )
}

/* ---------- Visual placeholders ---------- */
function TranslatorVisual() {
  return (
    <div className="relative mx-auto h-[300px] w-[688px] max-w-none lg:h-[400px] lg:w-[917px]" style={{ WebkitMaskImage: 'radial-gradient(70% 80% at 60% 50%, #000 50%, transparent)', maskImage: 'radial-gradient(70% 80% at 60% 50%, #000 50%, transparent)' }}>
      <div className="absolute inset-y-[12%] left-[18%] right-[6%] grid grid-cols-2 gap-4">
        {['Where is the nearest train station?', 'Ou se trouve la gare la plus proche ?'].map((t, i) => (
          <div key={t} className="rounded-xl border border-white/10 bg-white/[.03] p-6">
            <span className="font-geist text-[12px] text-grey-300">{i ? 'TARGET' : 'SOURCE'}</span>
            <p className="mt-3 text-[18px] leading-7 text-white/80">{t}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ThemesVisual() {
  return (
    <div className="relative h-[350px] w-full max-w-[750px] flex-none">
      <div className="absolute inset-x-0 bottom-0 h-[310px] rounded-t-[13px] border border-b-0 border-white/10 shadow-[0_16px_56px_-8px_#000]" style={{ background: 'linear-gradient(160deg, #2b1630, #0f1324 60%)' }}>
        <MockWindow rows={5} hue={300} className="m-6 w-[420px] max-w-[70%] border-white/10" />
      </div>
      <div className="absolute right-6 top-0 flex h-[242px] w-[200px] flex-col gap-2 rounded-md bg-black/40 p-3 backdrop-blur-8">
        {['Midnight', 'Dune', 'Orchard', 'Glacier', 'Ember'].map((t, i) => (
          <span key={t} className={`flex items-center gap-2 rounded-sm px-2 py-2 text-[13px] text-white/80 ${i === 0 ? 'bg-white/10' : ''}`}>
            <span className="h-4 w-4 rounded-full" style={{ background: `hsl(${i * 60 + 280} 60% 55%)` }} />
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

const CARDS = [
  { title: 'Unlimited notes', sub: 'Jot anything from the bar and search every page you have written so far.', badge: 'Synced', visual: <MockWindow rows={4} hue={40} className="w-[417px] max-w-full" /> },
  { title: 'Cloud sync', sub: 'Settings, snippets and hotkeys follow you to every machine you sign into.', badge: 'End to end', mask: 'radial-gradient(circle at -80% 50%, #fff 50%, transparent 100%)', visual: <MockWindow rows={4} hue={190} className="w-[734px]" /> },
  { title: 'Larger models', sub: 'Run the bigger models on long drafts and complex questions without caps.', badge: 'Plus only', mask: 'radial-gradient(circle at -80% 50%, #fff 50%, transparent 100%)', visual: <DotGrid /> },
  { title: 'Custom windows', sub: 'Save your own layouts for each screen setup and recall them by hotkey.', badge: 'Multi monitor', mask: 'linear-gradient(#fff 50%, transparent)', visual: <MockWindow rows={5} hue={120} className="w-[520px] max-w-full" /> },
]

const FAQ = [
  ['Can I try Plus before paying?', 'Yes. Every account can start a two week trial from the settings page. You keep all of your data if you decide not to continue, and you are never charged without a reminder email first.'],
  ['What happens to my data if I cancel?', 'Your notes, snippets and settings stay on your machine. Synced copies remain available for thirty days so you can export them, after which the cloud copy is removed.'],
  ['Do you offer student discounts?', 'We offer a reduced price for students and teachers with a valid school address. Apply from the billing page and the discount is added to your next invoice.'],
  ['How do model limits work?', 'Each plan includes a monthly allowance of requests. Smaller models count less than larger ones, and the limit resets on the first day of every month.'],
  ['Can I switch between monthly and yearly?', 'You can change your billing interval at any time. The remaining value of your current period is credited toward the new one automatically.'],
  ['Is my data used for training?', 'No. Requests are sent to model providers under agreements that forbid training on your content, and we do not store your conversations on our servers.'],
]

export default function Pro() {
  return (
    <main className="overflow-x-clip pt-[75px] sm:pt-6">
      <PageHero
        variant="sheen"
        art={<ProArt />}
        pill={<HeroPill tone="pro" icon="star">Now in beta</HeroPill>}
        title="Plus, for the keen"
        subtitle="Unlock unlimited history, larger models, cloud sync and custom themes. Everything you already use, only more."
        actions={<LightButton icon={null} className="w-[128px]" href="/pricing">Get Plus</LightButton>}
        footnote={<p className="font-geist text-[14px] font-medium leading-[22.4px] tracking-link text-grey-300">Try free for two weeks</p>}
      />

      <AiBento
        eyebrow="Built in"
        title="Models that work where you work"
        desc="Pick a model for each task and keep chats next to your work."
        link="Explore the assistant tools"
      />

      <section className="mx-auto max-w-ext-top px-6 py-[168px]">
        <ModelTabs />
      </section>

      <section className="mx-auto max-w-ext-top px-6 py-[168px]">
        <SectionTitle size={24} subClass="text-grey-200" className="mx-auto max-w-[520px]" title="More tools, fewer browser tabs" subtitle="Small upgrades that add up over a week" />
        <div className="mt-8">
          <ComparePlans />
        </div>
        <SplitFeature
          className="mt-[120px] lg:mt-[182px]"
          gapClass="gap-8 lg:gap-0"
          visualFirst
          layoutClass="items-center lg:flex-row-reverse lg:items-center"
          textClass="max-w-[300px] lg:-ml-6"
          visualClass="w-full overflow-hidden lg:-ml-6 lg:w-[917px] lg:flex-none lg:overflow-visible"
          visual={<TranslatorVisual />}
        >
          <PairHead
            title="Translate without leaving"
            sub="Select text in any app, pick a language and paste the result back in place."
            badge="40 languages"
            badgeIcon="globe"
          />
        </SplitFeature>
        <div className="mt-20 grid gap-6 lg:grid-cols-[590px_590px]">
          {CARDS.map((c) => (
            <MediaCard key={c.title} variant="pro" {...c} />
          ))}
        </div>
        <SplitFeature
          reverse
          className="mt-[61px]"
          textClass="lg:max-w-[474px]"
          visualClass="w-full lg:w-[750px] lg:flex-none"
          visual={<ThemesVisual />}
        >
          <PairHead
            title="Make it look yours"
            sub="Pick from a set of hand-tuned themes or build one with your own colors."
            badge="Custom themes"
            badgeIcon="image"
          />
        </SplitFeature>
      </section>

      <section className="mx-auto max-w-ext-top px-6 pb-[168px] pt-[168px]">
        <PricingSection />
      </section>

      <section className="mx-auto max-w-ext-top px-6 py-[168px]">
        <FaqAccordion heading="48" sheen title="Questions" subtitle="Answers to the most common questions." items={FAQ} />
      </section>
    </main>
  )
}
