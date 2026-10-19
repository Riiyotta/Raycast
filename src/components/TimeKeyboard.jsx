import { Icon, Key, LightButton, SectionTitle, useInView } from './shared.jsx'

// Each entry: [alt, label, width] or { feature }
// delayIndex mirrors the original's per-feature transition stagger (.3s x index): row 3 = 1, 3; row 4 = 0, 2
const F = (icon, word, text, width, delayIndex) => ({ feature: true, icon, word, text, width, delayIndex })
const ROWS = [
  [['', 'esc', 137], ['', 'F1'], ['', 'F2'], ['', 'F3'], ['', 'F4'], ['', 'F5'], ['', 'F6'], ['', 'F7']],
  [['~', '`'], ['!', '1'], ['@', '2'], ['#', '3'], ['$', '4'], ['%', '5'], ['^', '6'], ['&', '7']],
  [['', 'tab', 167], F('bolt', 'Launch', 'apps before you blink', 178, 1), ['', 'E'], F('search', 'Find', 'any file in a moment', 208, 3), ['', 'Y'], ['', 'U']],
  [['', 'caps', 206], F('clip', 'Recall', 'all you copied today', 208, 0), ['', 'F'], F('window', 'Tidy', 'windows on one press', 178, 2), ['', 'J']],
  [['', 'shift', 262], ['', 'Z'], ['', 'X'], ['', 'C'], ['', 'V'], ['', 'B'], ['', 'N']],
  [['', 'fn'], ['', 'ctrl'], ['', 'opt'], ['', 'cmd', 137], ['', '', 168], ['', '']],
]

// Original: feature keys sit at opacity .2 and transition to 1 (opacity .4s easeOutQuint) while the section
// intersects (IO threshold 0, toggles both ways), with transition-delay .3s x delayIndex on the way in, 0s out.
function FeatureKey({ k, inView }) {
  return (
    <div
      className="key feature"
      style={{ width: k.width, '--delay': '0s', opacity: inView ? 1 : 0.2, transitionDelay: inView ? `${0.3 * k.delayIndex}s` : '0s' }}
    >
      <Icon name={k.icon} size={20} className="alt" />
      <p className="self-end text-[16px] leading-[1.25]">
        <strong className="font-bold text-white">{k.word}</strong> {k.text}
      </p>
    </div>
  )
}

export default function TimeKeyboard() {
  const [ref, inView] = useInView(0)
  return (
    <section ref={ref} data-inview={inView} className="flex justify-center overflow-hidden">
      <div className="grid w-full max-w-container grid-cols-1 gap-[85px] sm:grid-cols-[440px_auto]">
        {/* Keys (first on mobile: text sits below) */}
        <div className="relative order-1 h-[490px] overflow-hidden pl-6 mask-vertical sm:order-2 sm:h-[720px] sm:mask-time-keys">
          <div className="absolute inset-0 flex flex-col gap-3 pl-6 sm:static sm:pl-0">
            {ROWS.map((row, r) => (
              <div key={r} className="flex h-[110px] flex-nowrap gap-3">
                {row.map((k, i) =>
                  k.feature ? (
                    <FeatureKey key={i} k={k} inView={inView} />
                  ) : (
                    <Key key={i} alt={k[0]} label={k[1]} width={k[2] ?? 110} style={{ '--delay': '0s', opacity: 0.2 }} />
                  ),
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Text */}
        <div className="order-2 flex flex-col items-center justify-center sm:order-1 sm:items-start">
          <div className="flex max-w-[320px] flex-col items-center gap-sp-6 bg-time-text p-6 sm:items-start" data-reveal="time-text">
            <SectionTitle
              align="responsive"
              className="text-center sm:text-left"
              title="Win back hours every week"
              subtitle="Tiny shortcuts compound into whole days saved."
            />
            <span className="hidden sm:inline-flex">
              <LightButton icon="download">Download</LightButton>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
