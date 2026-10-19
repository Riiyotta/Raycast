import { useState } from 'react'
import { Badge, DarkButton, Icon, LightButton } from './shared.jsx'

/* PAGES_SPEC 2.2. Structure only: placeholder plan names, prices and feature lines. */

/* ---------- IntervalToggle: track 280x62, 2 cols of 129, sliding pill translateX(133px) ---------- */
export function IntervalToggle({ value, onChange }) {
  return (
    <div className="relative mx-auto grid h-[62px] w-[280px] grid-cols-[129px_129px] gap-1 rounded-[31px] border border-card-border bg-card p-2 shadow-inset-top">
      <span
        aria-hidden
        className="cat-active absolute left-2 top-2 h-[45px] w-[129px] rounded-[22.5px] bg-cat-active backdrop-blur-2 transition-transform duration-200 ease-in-out"
        style={{ transform: `translateX(${value * 133}px)` }}
      />
      {['Monthly', 'Yearly'].map((l, i) => (
        <button
          key={l}
          type="button"
          aria-pressed={value === i}
          onClick={() => onChange(i)}
          className={`relative flex items-center justify-center gap-2 px-4 text-[14px] font-medium leading-[22.4px] tracking-ui transition-colors duration-200 ${value === i ? 'text-white' : 'text-grey-200'}`}
        >
          {l}
          {i === 1 && (
            <span className="inline-flex h-6 items-center rounded-md bg-white px-2 font-geist text-[12px] font-medium leading-[22.4px] text-chip-discount">-20%</span>
          )}
        </button>
      ))}
    </div>
  )
}

/* ---------- TierSwitch: 40px segmented control ---------- */
function TierSwitch({ options, value, onChange }) {
  return (
    <div className="flex h-10 gap-0.5 self-start rounded-full border border-white/[.06] bg-white/[.04] p-1">
      {options.map((o, i) => (
        <button
          key={o}
          type="button"
          aria-pressed={value === i}
          onClick={() => onChange(i)}
          className={`h-[30px] rounded-full px-3 text-[14px] font-medium leading-[16.1px] transition-all ${value === i ? 'bg-white/[.09] text-white shadow-[inset_0_1px_rgba(255,255,255,.06)]' : 'text-grey-200'}`}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

/* ---------- Data ---------- */
// row: string | { t, grey, sub: [..], badge }
const TIERS = [
  {
    name: 'Starter',
    tagline: 'The everyday basics for one person',
    unit: 'forever',
    prices: [['$0'], ['$0']], // [monthly per option], [yearly per option]
    cta: 'Start for free',
    rows: [
      'Launcher, search and quick actions',
      'Clipboard history for the last week',
      'Window layouts and snapping',
      'Plugins from the open hub',
      'Snippets and quick links',
      { t: 'Assistant preview', badge: 'Limited' },
    ],
  },
  {
    name: 'Plus',
    featured: true,
    tagline: 'More power for people who live in the keys',
    unit: 'per month',
    options: ['Solo', 'Duo', 'Crew'],
    prices: [['$10', '$18', '$26'], ['$8', '$14', '$21']],
    billing: [['$96', '$120'], ['$168', '$216'], ['$252', '$312']],
    cta: 'Try Plus free',
    rows: [
      { t: 'Everything in Starter, plus', grey: true },
      'Unlimited clipboard history',
      { t: 'Assistant with every core model, including:', sub: ['Fast models for quick replies', 'Larger models for long drafts', 'Image input on supported models'] },
      'Custom window layouts across screens',
      'Cloud sync for settings and snippets',
      { t: 'Custom themes', badge: 'New' },
      'Unlimited notes with search',
      { t: 'Translator with forty languages and offline packs for travel', sub: ['Auto detect on selection'] },
      'Priority email support',
      'Early access to beta features',
      'Scheduled exports',
      'Larger upload limits',
    ],
    note: 'Two week trial. Cancel any time before it ends.',
  },
  {
    name: 'Business',
    tagline: 'Shared setups and access for groups',
    unit: 'per user / month',
    options: ['5', '10', '25', '50+'],
    prices: [['$15', '$14', '$13', '$12'], ['$12', '$11', '$10', '$9']],
    billing: [['$144', '$180'], ['$132', '$168'], ['$120', '$156'], ['$108', '$144']],
    cta: 'Set up a team',
    rows: [
      { t: 'Everything in Plus, plus', grey: true },
      'Shared plugins, snippets and links',
      { t: 'Admin console with roles', sub: ['Invite by link or domain', 'Seat management'] },
      'Central billing',
      'Usage insights for admins',
      { t: 'Single sign-on', badge: 'Add-on' },
    ],
  },
]

function Row({ r }) {
  const o = typeof r === 'string' ? { t: r } : r
  return (
    <li className="flex gap-1.5 text-[14px] font-medium leading-[22.4px] tracking-ui">
      <Icon name={o.grey ? 'arrow-left' : 'check'} size={16} className={`mt-[3px] flex-none ${o.grey ? 'text-grey-200' : 'text-white'}`} />
      <div className={o.grey ? 'text-grey-200' : 'text-white'}>
        <span className="inline-flex flex-wrap items-center gap-2">
          {o.t}
          {o.badge && <Badge>{o.badge}</Badge>}
        </span>
        {o.sub && (
          <ul className="mt-1 list-disc pl-4 text-grey-200">
            {o.sub.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        )}
      </div>
    </li>
  )
}

function PlanCard({ tier, yearly, className = '' }) {
  const [opt, setOpt] = useState(0)
  const f = tier.featured
  const price = tier.prices[yearly ? 1 : 0][opt] ?? tier.prices[yearly ? 1 : 0][0]
  const bill = yearly && tier.billing?.[opt]
  return (
    <article className={`flex flex-col gap-4 ${f ? 'rounded-lg border border-grey-500 bg-plan-featured px-6 py-6 lg:-my-4 lg:px-8 lg:py-12' : 'p-6 lg:p-8'} ${className}`}>
      <h3 className={`${f ? 'text-[24px]' : 'text-[20px]'} font-bold leading-normal tracking-ui text-white`}>{tier.name}</h3>
      <p className={`font-medium text-grey-200 ${f ? 'text-[18px] leading-[25.2px]' : 'text-[14px] leading-[19.6px]'}`}>{tier.tagline}</p>
      {tier.options ? <TierSwitch options={tier.options} value={opt} onChange={setOpt} /> : <div className="h-10" />}
      <div className="flex items-baseline gap-2">
        <span className="text-[64px] font-semibold leading-[64px] tracking-link text-white">{price}</span>
        <span className="font-geist text-[14px] font-medium leading-[14px] tracking-link text-grey-200">{tier.unit}</span>
      </div>
      <p className="h-6 font-geist text-[14px] leading-6 text-grey-200">
        {bill && (
          <>
            Billed yearly at {bill[0]} <s className="text-grey-300">{bill[1]}</s>
          </>
        )}
      </p>
      {f ? (
        <LightButton icon={null} block>{tier.cta}</LightButton>
      ) : (
        <DarkButton as="a" href="#" block className="h-9 text-[14px] font-medium">{tier.cta}</DarkButton>
      )}
      <ul className="mt-2 flex flex-col gap-2">
        {tier.rows.map((r, i) => (
          <Row key={i} r={r} />
        ))}
      </ul>
      {tier.note && <p className="pt-2 text-center text-[12px] leading-[19px] text-grey-200">{tier.note}</p>}
    </article>
  )
}

// 390: tier 1 as a compact 358x133 card (grid 139/153, gap 32/16, pad 24, featured gradient at 50%)
function CompactPlan({ tier }) {
  return (
    <article className="grid grid-cols-[139px_153px] items-center gap-x-8 gap-y-4 rounded-lg border border-grey-500 bg-plan-featured-50 p-6">
      <div>
        <h3 className="text-[20px] font-bold leading-normal tracking-ui text-white">{tier.name}</h3>
        <p className="text-[14px] font-medium leading-[19.6px] text-grey-200">{tier.tagline}</p>
      </div>
      <div className="flex items-baseline gap-2 justify-self-end">
        <span className="text-[64px] font-semibold leading-[64px] tracking-link text-white">{tier.prices[0][0]}</span>
        <span className="font-geist text-[14px] font-medium leading-[14px] text-grey-200">{tier.unit}</span>
      </div>
    </article>
  )
}

/* ---------- EnterprisePlanCard: grid 2fr 1fr, inset 8px from the grid edges ---------- */
const ENT_A = ['Everything in Business, plus', 'Dedicated success manager', 'Custom onboarding']
const ENT_A2 = ['Audit logs with export', 'Data residency options', 'Custom contract terms', 'Volume pricing', 'Uptime commitment']
const ENT_B = ['Private plugin registry', 'Model allow lists', 'Spend limits per group', 'Directory sync', 'Device policies', 'Retention controls', 'Sandbox workspace', 'Bring your own key']
function EntList({ rows }) {
  return (
    <ul className="flex flex-col gap-2">
      {rows.map((r) => (
        <li key={r} className="flex gap-1.5 text-[14px] font-medium leading-[22.4px] tracking-ui text-grey-200">
          <Icon name="check" size={16} className="mt-[3px] flex-none text-white" />
          {r}
        </li>
      ))}
    </ul>
  )
}
export function EnterprisePlanCard({ className = '' }) {
  return (
    <article className={`grid overflow-hidden rounded-lg border border-grey-500 bg-plan-featured lg:mx-2 lg:grid-cols-[2fr_1fr] ${className}`}>
      <div className="p-6 lg:p-10">
        <h3 className="text-[20px] font-bold leading-normal tracking-ui text-white">Enterprise and large orgs</h3>
        <p className="text-[14px] font-medium leading-[19.6px] text-grey-200">Controls and support for big rollouts</p>
        <div className="mt-8 grid gap-[10px] sm:grid-cols-[324px_324px]">
          <div className="flex flex-col gap-4">
            <EntList rows={ENT_A} />
            <h4 className="text-[14px] font-medium leading-[16.1px] text-white">Security and legal</h4>
            <EntList rows={ENT_A2} />
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-[14px] font-medium leading-[16.1px] text-white">Admin and governance</h4>
            <EntList rows={ENT_B} />
          </div>
        </div>
      </div>
      <div className="flex flex-col border-t border-grey-500 px-6 py-6 lg:border-l lg:border-t-0 lg:px-10">
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-8 text-center">
          <p className="text-[24px] font-bold leading-normal text-white">Custom pricing</p>
          <p className="font-geist text-[12px] text-grey-200">Billed annually, per seat</p>
        </div>
        <DarkButton as="a" href="#" block className="h-9 text-[14px] font-medium">Talk to us</DarkButton>
      </div>
    </article>
  )
}

export function BlockCta({ children, className = '' }) {
  return (
    <a href="#" className={`group mx-auto inline-flex items-center gap-1 text-[16px] font-medium leading-[16.96px] tracking-link text-white ${className}`}>
      {children}
      <Icon name="arrow-right" size={16} className="transition-transform duration-300 group-hover:translate-x-[2px]" />
    </a>
  )
}

/* ---------- PricingSection ----------
   narrow: the /pricing 1110 layout (369-wide columns, grid 1153) plus the "Compare all features" link. */
export default function PricingSection({ narrow = false, title, className = '' }) {
  const [interval, setIv] = useState(1) // default yearly
  const yearly = interval === 1
  return (
    <div className={`mx-auto flex w-full flex-col pb-[111px] ${narrow ? 'max-w-[1110px]' : 'max-w-container'} ${className}`}>
      {title && <div className="mb-16">{title}</div>}
      <IntervalToggle value={interval} onChange={setIv} />
      <div className="mt-6 flex flex-col gap-6 px-4 lg:hidden">
        <CompactPlan tier={TIERS[0]} />
        <PlanCard tier={TIERS[1]} yearly={yearly} />
        <PlanCard tier={TIERS[2]} yearly={yearly} className="rounded-lg border border-grey-500 bg-card" />
      </div>
      <div className={`mt-6 hidden grid-cols-3 rounded-lg border border-grey-500 bg-card lg:grid ${narrow ? 'min-h-[1153px]' : 'min-h-[1130px]'}`}>
        {TIERS.map((t) => (
          <PlanCard key={t.name} tier={t} yearly={yearly} />
        ))}
      </div>
      {narrow && (
        <a href="#compare" className="mx-auto mt-8 inline-flex h-[22px] items-center gap-1 text-[14px] font-medium leading-[22.4px] text-grey-200 transition-colors duration-150 hover:text-white">
          Compare all features
          <Icon name="chevron-down" size={14} />
        </a>
      )}
      <EnterprisePlanCard className="mx-4 mt-6 lg:mt-[10px]" />
      <BlockCta className="mt-[43px]">Questions about seats or billing? Ask us</BlockCta>
    </div>
  )
}
