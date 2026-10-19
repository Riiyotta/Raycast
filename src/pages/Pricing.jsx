import { useState } from 'react'
import PricingSection from '../components/PricingSection.jsx'
import FaqAccordion from '../components/FaqAccordion.jsx'
import { Icon, LightButton } from '../components/shared.jsx'

/* /pricing (PAGES_SPEC 4). Page-only: TopArt, PricingTable. */

// 1064x385 at y 0 (600x217 at 390), behind the toggle. Static glow placeholder.
function TopArt() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-0 h-[217px] w-[600px] -translate-x-1/2 sm:h-[385px] sm:w-[1064px]"
      style={{ background: 'radial-gradient(50% 60% at 50% 0, rgba(255,99,99,.14), rgba(154,170,255,.06) 55%, transparent 80%)' }}
    />
  )
}

/* ---------- PricingTable: label col + 5 plan cols, hairline grid via box-shadow ---------- */
const PLANS = ['Starter', 'Plus', 'Plus Duo', 'Business', 'Enterprise']
// [label, detail?, info?, values[5], height at >=720]; 'g' = group separator row (8px)
const Y = true
const N = false
const ROWS = [
  ['Launcher and quick actions', null, N, [Y, Y, Y, Y, Y], 70],
  ['Clipboard history', null, Y, ['7 days', 'Unlimited', 'Unlimited', 'Unlimited', 'Unlimited'], 70],
  ['Window layouts', null, N, [Y, Y, Y, Y, Y], 70],
  ['Snippets and quick links', null, N, [Y, Y, Y, Y, Y], 70],
  ['Calculator and converter', null, N, [Y, Y, Y, Y, Y], 70],
  'g',
  ['Assistant, including:', 'Fast models for short replies, larger models for drafts, image input', Y, ['Preview', Y, Y, Y, Y], 123],
  ['Monthly requests', null, Y, ['50 / mo', '2,000', '4,000', '3,000', 'Custom'], 70],
  ['Custom prompts', null, N, [N, Y, Y, Y, Y], 70],
  ['Bring your own key', null, Y, [N, N, N, Y, Y], 70],
  ['Model access, including:', 'Every core model, long context variants, open weights models and selected vision models for screenshots', N, [N, Y, Y, Y, Y], 160],
  'g',
  ['Cloud sync', null, N, [N, Y, Y, Y, Y], 70],
  ['Custom themes', null, N, [N, Y, Y, Y, Y], 70],
  ['Unlimited notes', null, N, [N, Y, Y, Y, Y], 70],
  ['Translator, including:', 'Forty languages, auto detect on selection and offline packs', N, [N, Y, Y, Y, Y], 123],
  ['Scheduled exports', null, N, [N, Y, Y, Y, Y], 70],
  ['Priority support', null, N, [N, Y, Y, Y, Y], 70],
  ['Larger upload limits', null, Y, ['5 MB', '50 MB', '50 MB', '100 MB', 'Custom'], 70],
  ['Notes, including:', 'Unlimited pages, search across every note and export', N, ['3 notes', Y, Y, Y, Y], 123],
  'g',
  ['Shared plugins, including:', 'Private plugin store, shared snippets, shared quick links, shared hotkeys and a review flow for new submissions', Y, [N, N, N, Y, Y], 160],
  ['Admin console, including:', 'Roles and permissions, invite by link or domain, seat management, usage insights, central billing, spend limits per group and device policies for managed fleets', N, [N, N, N, Y, Y], 205],
  ['Security, including:', 'Single sign-on, directory sync, audit logs with export, data residency options, retention controls, model allow lists, sandbox workspace and a signed data agreement', Y, [N, N, N, 'Add-on', Y], 227],
  ['Team workspaces', null, N, [N, N, N, Y, Y], 70],
  'g',
  ['Onboarding, including:', 'Custom sessions and a named contact', N, [N, N, N, N, Y], 123],
  ['Success manager', null, N, [N, N, N, N, Y], 70],
  ['Uptime commitment, including:', 'Written terms', N, [N, N, N, N, Y], 93],
]

const cell = 'px-4 py-6 bg-grey-900 shadow-api-cell flex items-center'

function Label({ label, detail, info }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`${cell} relative h-full`}>
      <div className="text-[14px] font-medium leading-[22.4px] tracking-ui text-white">
        <span className="inline-flex items-center gap-1">
          {label}
          {info && (
            <button type="button" aria-label="More info" onClick={() => setOpen((o) => !o)} onBlur={() => setOpen(false)} className="text-grey-300 hover:text-white">
              <Icon name="info" size={16} />
            </button>
          )}
        </span>
        {detail && <p className="hidden text-grey-300 sm:block">{detail}</p>}
        {open && (
          <div role="tooltip" className="anim-popover absolute left-4 top-full z-10 mt-1 w-[220px] rounded-normal border border-card-border bg-grey-700 p-3 text-[13px] leading-5 text-grey-200 shadow-tooltip">
            Limits apply per seat and reset on the first day of each month.
          </div>
        )}
      </div>
    </div>
  )
}

function PricingTable() {
  return (
    <div id="compare" className="scrollbar-none mx-auto w-full max-w-container overflow-x-auto">
      <div className="pricing-table grid w-[984px] grid-cols-[repeat(6,164px)] sm:w-[1204px] sm:grid-cols-[230px_184px_184px_217.5px_204.5px_184px]">
        <div className={`${cell} sm:h-[72px]`} />
        {PLANS.map((p) => (
          <div key={p} className={`${cell} justify-center text-[18px] font-semibold leading-[20.7px] text-white sm:h-[72px]`}>{p}</div>
        ))}
        {ROWS.map((r, i) =>
          r === 'g' ? (
            Array.from({ length: 6 }, (_, j) => <div key={`g${i}-${j}`} className="h-2 bg-table-group shadow-api-cell" />)
          ) : (
            [
              <div key={`l${i}`} className="sm:h-[var(--h)]" style={{ '--h': `${r[4]}px` }}>
                <Label label={r[0]} detail={r[1]} info={r[2]} />
              </div>,
              ...r[3].map((v, j) => (
                <div key={`v${i}-${j}`} className={`${cell} justify-center sm:h-[var(--h)]`} style={{ '--h': `${r[4]}px` }}>
                  {v === true ? (
                    <Icon name="check" size={16} className="h-[22px] text-white" />
                  ) : v === false ? (
                    <Icon name="dash" size={16} className="h-[22px] text-grey-300" />
                  ) : (
                    <span className="text-[14px] leading-[22.4px] text-white">{v}</span>
                  )}
                </div>
              )),
            ]
          ),
        )}
        <div className={`${cell} sm:h-[84px]`} />
        {PLANS.map((p) => (
          <div key={`c${p}`} className={`${cell} justify-center sm:h-[84px]`}>
            <LightButton icon={null} className="w-[152px] max-w-full">Choose {p.split(' ')[0]}</LightButton>
          </div>
        ))}
      </div>
    </div>
  )
}

const FAQ = [
  ['Which plan is right for me?', 'Start with Starter if you work alone and mostly need the launcher. Plus suits people who want unlimited history, larger models and sync. Business adds shared tools and admin controls for groups of any size.'],
  ['Can I change plans later?', 'Yes. Upgrades take effect right away and are prorated. Downgrades apply at the end of the current billing period so you never lose time you already paid for.'],
  ['How does the yearly discount work?', 'Paying yearly lowers the monthly rate. You are billed once for twelve months, and the saving is shown next to the toggle above the plans.'],
  ['Is there a free trial of Plus?', 'Every new account can try Plus for two weeks. We send a reminder a few days before the trial ends, and nothing is charged unless you confirm.'],
  ['What payment methods do you accept?', 'We accept major cards and bank transfers for yearly plans. Business and Enterprise customers can also pay by invoice with net thirty terms.'],
  ['Do you offer discounts for nonprofits?', 'Registered nonprofits and schools can apply for a reduced rate from the billing page. Approval usually takes a couple of working days.'],
  ['How are seats counted on Business?', 'A seat is any member who has signed in during the billing period. Removing a member frees the seat for the next period automatically.'],
  ['What happens to my data if I downgrade?', 'Your local data stays on your machine. Features tied to the higher plan are paused, and you can pick them up again by upgrading at any time.'],
  ['Can I bring my own model key?', 'On Business and Enterprise you can connect your own provider key. Requests then use your account and do not count toward plan limits.'],
  ['Where can I get help with billing?', 'Write to the billing team from the help menu and we will reply within one working day.'],
]

export default function Pricing() {
  return (
    <main className="relative overflow-x-clip">
      <TopArt />
      <div className="relative pt-[138px] sm:pt-[156px]">
        <PricingSection narrow />
      </div>
      <div className="mt-[224px] px-0 sm:px-0">
        <PricingTable />
      </div>
      <div className="mt-[224px] px-4">
        <FaqAccordion title="FAQs" subtitle="Everything else you wanted to know." items={FAQ} />
      </div>
    </main>
  )
}
