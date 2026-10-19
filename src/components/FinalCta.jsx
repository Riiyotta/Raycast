import { HeroDownloadInfo, Key, SectionTitle, useInView } from './shared.jsx'

// Full keyboard, 6 rows of 110px keys with 12px gaps; each row ~1754px wide (viewBox 1754x720).
const k = (label, w = 110, alt = '') => ({ label, w, alt })
const ROWS = [
  [k('esc', 137), ...Array.from({ length: 12 }, (_, i) => k(`F${i + 1}`)), k('⏻')],
  [k('`', 110, '~'), ...'1234567890'.split('').map((c, i) => k(c, 110, '!@#$%^&*()'[i])), k('-', 110, '_'), k('=', 110, '+'), k('delete', 167)],
  [k('tab', 167), ...'QWERTYUIOP'.split('').map((c) => k(c)), k('[', 110, '{'), k(']', 110, '}'), k('\\', 110, '|')],
  [k('caps', 206), ...'ASDFGHJKL'.split('').map((c) => k(c)), k(';', 110, ':'), k("'", 110, '"'), k('return', 194)],
  [k('shift', 261), ...'ZXCVBNM'.split('').map((c) => k(c)), k(',', 110, '<'), k('.', 110, '>'), k('/', 110, '?'), k('shift', 261)],
  [k('fn'), k('control', 110, '⌃'), k('option', 110, '⌥'), { ...k('command', 137, '⌘'), glow: true }, { ...k('', 602), glow: true }, k('command', 137, '⌘'), k('option', 110, '⌥'), k('←'), k('↑ ↓'), k('→')],
]

export default function FinalCta() {
  const [ref, inView] = useInView(0.9)
  let glowIndex = 0
  return (
    <section className="flex flex-col items-center overflow-hidden pb-sp-13">
      <div ref={ref} data-inview={inView} className="flex w-full justify-center">
        <svg
          viewBox="0 0 1754 720"
          className="cta-keyboard block flex-none pb-[50px]"
          style={{ boxSizing: 'content-box' }}
          aria-hidden
        >
          <foreignObject x="0" y="0" width="1754" height="720">
            <div xmlns="http://www.w3.org/1999/xhtml" className="flex flex-col gap-3">
              {ROWS.map((row, r) => (
                <div key={r} className="flex h-[110px] flex-nowrap gap-3">
                  {row.map((key, i) => {
                    // measured on the original: command key --delay 0s, space bar --delay .125s
                    const delay = key.glow ? `${glowIndex++ * 125}ms` : '0ms'
                    return (
                      <Key
                        key={i}
                        width={key.w}
                        alt={key.alt}
                        label={key.label}
                        className={key.glow && inView ? 'glowing' : ''}
                        style={{ '--delay': delay }}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </foreignObject>
        </svg>
      </div>

      <div className="mt-6 flex min-h-[138px] max-w-[400px] flex-col items-center gap-sp-9 px-6">
        <SectionTitle title="Take back your time" subtitle="Free to download, quick to set up." />
        <HeroDownloadInfo />
      </div>
    </section>
  )
}
