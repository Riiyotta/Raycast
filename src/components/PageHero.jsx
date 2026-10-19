import { Icon } from './shared.jsx'

/* ---------- Pills (hero pills on /pro and /teams, ProUpsell pill) ---------- */
const PILL = {
  // 133x34: pad 6 12 6 10, radius 16, 1px transparent border with the pill-pro border-box gradient
  pro: 'pill-pro gap-1 py-1.5 pl-2.5 pr-3 text-[14px] leading-[16.1px] text-pro-badge shadow-[inset_0_1px_1px_rgba(255,255,255,.25)]',
  // 311x38: pad 8 16, pill-teams, 1px white/.05, 14px/20 #ff9217
  teams: 'border border-white/5 bg-pill-teams px-4 py-2 text-[14px] leading-5 text-teams-orange transition-[background-position] duration-200',
  // 132x30: pad 6 12, pill-pink, 1px white/.15
  pink: 'border border-white/15 bg-pill-pink px-3 py-1.5 text-[14px] leading-4 text-white',
}
export function HeroPill({ tone = 'pro', icon, href = '#', children }) {
  return (
    <a href={href} className={`inline-flex items-center rounded-[16px] font-medium tracking-ui ${PILL[tone]}`}>
      {icon && <Icon name={icon} size={16} />}
      {children}
    </a>
  )
}

/* ---------- Search button (store hero 476x51 pad 16; toolbar 320x43 pad 12) ---------- */
export function SearchButton({ label = 'Search...', compact = false, className = '' }) {
  return (
    <button
      type="button"
      className={`flex items-center justify-between rounded-md border border-grey-500 bg-grey-800 text-[15px] leading-[17.25px] text-grey-300 ${compact ? 'p-3' : 'p-4'} ${className}`}
    >
      <span className="flex items-center gap-2">
        <Icon name="search" size={16} />
        {label}
      </span>
      <span className="flex gap-1.5">
        {['⌘', 'K'].map((k) => (
          <kbd key={k} className="grid h-5 w-5 place-items-center rounded-xs border border-card-border bg-keycap font-sans text-[11px] text-grey-200">
            {k}
          </kbd>
        ))}
      </span>
    </button>
  )
}

/* ---------- PageHero (PAGES_SPEC 2.1) ----------
   variant: 'sheen' (/pro) | 'ios' (sheen title, /ios layout) | 'plain' (/core-features/ai) | 'store' | 'teams'
   art: absolutely positioned layer behind the content. media: in-flow node above the title (/ios). */
const V = {
  sheen: {
    section: 'flex min-h-[648px] flex-col items-center pt-[250px] sm:min-h-[547px]',
    content: 'max-w-[662px] gap-4 px-4',
    h1: 'bg-text-sheen bg-clip-text text-[48px] font-semibold leading-normal text-transparent',
    sub: 'text-[18px] font-medium leading-normal tracking-ui text-white',
  },
  ios: {
    section: 'flex min-h-[571px] flex-col items-center px-4 py-[90px] sm:min-h-[873px] sm:pb-px sm:pt-[164px]',
    content: 'gap-3',
    h1: 'bg-text-sheen bg-clip-text text-[27px] font-semibold leading-normal text-transparent sm:text-[48px]',
    sub: 'max-w-[520px] text-[16px] font-medium leading-6 tracking-ui text-white/60',
  },
  plain: {
    section: 'mx-auto flex max-w-[1020px] flex-col items-center pb-[56px] pt-8 sm:pb-[72px] sm:pt-0',
    content: 'gap-5',
    h1: 'max-w-[450px] animate-blurIn text-[40px] font-medium leading-[44px] tracking-[-1.6px] text-white sm:text-[48px] sm:leading-[50.4px] sm:tracking-[-1.92px]',
    sub: 'max-w-[320px] animate-blurIn text-[16px] leading-6 text-white/50',
    actions: 'animate-blurIn',
  },
  store: {
    section: 'flex flex-col items-center',
    content: 'max-w-[740px] gap-6 pt-[345px] sm:min-h-[835px] sm:pt-[558px]',
    h1: 'px-9 text-[44px] font-semibold leading-[48.4px] tracking-[1.2px] text-white sm:text-[80px] sm:leading-[86px]',
    sub: 'max-w-[560px] px-4 text-[16px] leading-6 tracking-link text-grey-300 sm:text-[20px] sm:leading-7',
  },
  teams: {
    section: '-mt-[72px] flex min-h-[830px] flex-col items-center px-6 pt-[200px] sm:min-h-[1135px] sm:pt-[368px]',
    content: 'max-w-[520px] gap-8',
    h1: 'bg-text-teams bg-clip-text text-[44px] font-bold leading-[51px] text-transparent sm:text-[72px] sm:leading-[84px]',
    sub: 'text-[18px] font-medium leading-7 text-white opacity-60',
  },
}

export default function PageHero({ variant = 'sheen', pill, media, title, subtitle, actions, footnote, art, className = '' }) {
  const v = V[variant]
  return (
    <section className={`relative ${v.section} ${className}`}>
      {art}
      <div className={`relative flex flex-col items-center text-center ${v.content}`}>
        {pill}
        {media}
        <h1 className={v.h1}>{title}</h1>
        {subtitle && <p className={v.sub}>{subtitle}</p>}
        {actions && <div className={`flex flex-col items-center gap-4 ${v.actions ?? ''}`}>{actions}{footnote}</div>}
      </div>
    </section>
  )
}
