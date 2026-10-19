import { DarkButton, Icon, LightButton, SectionTitle } from './shared.jsx'

// Original placeholder store badge (132x36, radius 4)
function StoreBadge() {
  return (
    <a href="#" className="inline-flex h-9 w-[132px] items-center gap-2 rounded-xs border border-white/20 bg-black px-2.5 text-left text-white">
      <Icon name="grid" size={18} />
      <span className="flex flex-col leading-none">
        <span className="text-[9px] text-white/70">Get it from the</span>
        <span className="text-[13px] font-semibold">App Shelf</span>
      </span>
    </a>
  )
}

/* QR card 158x189 (pad 16, gap 12, bg-card, card-border, radius 12, inset top). `fixed` pins it bottom-right (>=720 only). */
export function QrCard({ fixed = false }) {
  return (
    <a
      href="#"
      className={`w-[158px] flex-col items-center gap-3 rounded-md border border-card-border bg-card p-4 shadow-inset-top transition-[box-shadow,transform] duration-200 hover:shadow-btn-dark-hover active:scale-[.98] ${fixed ? 'fixed bottom-5 right-5 z-[100] hidden sm:flex' : 'flex'}`}
    >
      <QrPlaceholder />
      <span className="text-[14px] font-medium leading-[16.1px] text-white">Scan to download</span>
    </a>
  )
}

function QrPlaceholder() {
  // Deterministic pseudo-random module pattern (placeholder, not a real code)
  const cells = Array.from({ length: 121 }, (_, i) => ((i * 7919) % 13) % 3 === 0)
  return (
    <div className="grid h-[127px] w-[124px] grid-cols-11 gap-px rounded-sm bg-white p-2">
      {cells.map((on, i) => (
        <span key={i} className={on ? 'bg-black' : ''} />
      ))}
    </div>
  )
}

/* PAGES_SPEC 2.7 */
export default function DownloadBlock({ variant = 'mac', title, body, className = '' }) {
  if (variant === 'mac') {
    return (
      <div className={`mx-auto flex max-w-[560px] flex-col items-center px-6 text-center ${className}`}>
        <h2 className="text-[36px] font-bold leading-10 text-white">{title}</h2>
        <p className="mt-4 text-[18px] leading-7 text-white/60">{body}</p>
        <div className="mt-8 flex flex-col items-center gap-6">
          <a
            href="#"
            className="inline-flex h-[50px] w-[280px] items-center justify-center gap-2 rounded-normal border-[3px] border-white/30 bg-white/90 px-10 py-3 text-[16px] font-medium leading-5 text-[#0d0d0d] transition-colors duration-200 hover:bg-white"
          >
            <Icon name="apple" size={16} />
            Download for Mac
          </a>
          <span className="text-[16px] text-white/40">or</span>
          <code className="flex h-[46px] w-[276px] items-center rounded-normal bg-grey-900 px-6 py-3 font-jet text-[13px] leading-5 text-white/40">
            $ brew install launchpad-app
          </code>
        </div>
        <p className="mt-6 text-[13px] leading-4 tracking-ui text-white/40">Free plan</p>
      </div>
    )
  }
  if (variant === 'windows') {
    return (
      <div className={`flex w-[315px] max-w-full flex-col items-center gap-6 ${className}`}>
        <div className="flex gap-6">
          <StoreBadge />
          <DarkButton as="a" href="#" className="h-9 w-[136px] gap-2 !rounded-sm text-[14px] font-medium">
            <Icon name="download" size={16} />
            Get installer
          </DarkButton>
        </div>
        <p className="font-geist text-[12px] font-medium leading-[19.2px] tracking-ui text-grey-200">
          Windows 11, 64-bit only. <button type="button" className="text-white transition-opacity duration-200 hover:opacity-70">Or install via CLI</button>
        </p>
      </div>
    )
  }
  // ios
  return (
    <div className={`flex flex-col items-center gap-[10px] ${className}`}>
      <SectionTitle size={32} title={title} subtitle={body} />
      <div className="flex flex-col items-center gap-6">
        <div className="hidden sm:block">
          <QrCard />
        </div>
        <LightButton size="lg" sub="Download on the" className="w-[127px] sm:hidden">
          Phone Store
        </LightButton>
        <p className="font-jet text-[12px] font-medium leading-[13.8px] text-grey-200">iOS 17 or later</p>
      </div>
    </div>
  )
}
