import { Icon } from './shared.jsx'

// 56 links total (15/9/10/6/6/10) so group heights match the original columns (597 / 412px). Entries ending in "*" are external.
const GROUPS = [
  ['Product', ['Overview', 'Plugin store', 'Assistants', 'Pro plan', 'Teams', 'Desktop beta', 'Mobile app', 'Changelog', 'Roadmap', 'Pricing', 'Downloads', 'Integrations', 'Shortcut guide', 'Release notes', 'System status*']],
  ['Features', ['Clipboard history', 'Window layouts', 'Snippets', 'Quick links', 'Hotkeys', 'Notes', 'Calculator', 'Emoji search', 'File search']],
  ['Developers', ['Documentation*', 'API reference*', 'Examples', 'Publishing guide', 'Plugin templates', 'Source on the forge*', 'Community forum*', 'Sample plugins', 'CLI tools', 'Design kit*']],
  ['Resources', ['Blog', 'Guides', 'Video lessons*', 'Keyboard tips', 'Press kit', 'Accessibility']],
  ['Company', ['About', 'Careers', 'Contact', 'Customers', 'Partners', 'Brand']],
  ['Legal', ['Terms', 'Privacy', 'Cookies', 'Licenses', 'Security', 'Data processing', 'Imprint', 'Trust center', 'Subprocessors', 'Compliance']],
]

function FooterLink({ label }) {
  const ext = label.endsWith('*')
  const text = ext ? label.slice(0, -1) : label
  return (
    <a href="#" className="group inline-flex items-center gap-1 text-[14px] font-medium leading-normal tracking-ui text-grey-200 transition-colors duration-300 hover:text-white">
      {text}
      {ext && (
        <Icon name="arrow-ne" size={10} className="text-grey-300 transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-px" />
      )}
    </a>
  )
}

// art: 'cube' (homepage default) | 'windows' (padding-top 320, centered 434x549 image at opacity .8; 340x430 at 390).
function WindowsArt() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-0 h-[430px] w-[340px] -translate-x-1/2 overflow-hidden rounded-[18px] border border-window-border opacity-80 sm:h-[549px] sm:w-[434px]"
      style={{ background: 'linear-gradient(180deg, rgba(86,194,255,.18), rgba(17,18,20,.6) 45%, transparent 85%)' }}
    >
      <div className="mx-6 mt-6 h-10 rounded-md border border-white/10 bg-white/[.04]" />
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="mx-6 mt-3 flex items-center gap-3">
          <span className="h-6 w-6 rounded-sm bg-white/10" />
          <span className="h-2 rounded bg-white/10" style={{ width: 160 - i * 18 }} />
        </div>
      ))}
    </div>
  )
}

export default function Footer({ art = 'cube' }) {
  const win = art === 'windows'
  return (
    <footer className="footer-root relative overflow-x-hidden" style={win ? { paddingTop: 320 } : undefined}>
      {win && <WindowsArt />}
      {!win && <div
        className="pointer-events-none absolute left-1/2 top-[-40px] h-[867px] w-[867px] -translate-x-1/2 rotate-[85deg] opacity-50"
        style={{
          background:
            'radial-gradient(35% 35% at 50% 45%, rgba(255,99,99,.6), rgba(184,2,50,.35) 55%, transparent 75%), repeating-linear-gradient(45deg, rgba(255,120,140,0) 0 40px, rgba(255,120,140,.12) 52px, rgba(255,120,140,0) 70px)',
          filter: 'blur(30px)',
          WebkitMaskImage: 'radial-gradient(closest-side, #000 40%, transparent)',
          maskImage: 'radial-gradient(closest-side, #000 40%, transparent)',
        }}
      />}
      <div className="relative flex flex-col items-center gap-sp-10 border-t border-grey-600 bg-footer-panel pb-sp-8 shadow-footer backdrop-blur-20">
        <div className="grid w-full max-w-container-sm grid-cols-2 gap-sp-4 pl-6 pt-sp-10 sm:grid-cols-[repeat(6,minmax(144px,1fr))]">
          {GROUPS.map(([head, links]) => (
            <div key={head} className="flex flex-col gap-10">
              <h4 className="text-[14px] font-medium leading-[1.6] tracking-ui text-white">{head}</h4>
              <ul className="flex flex-col gap-5">
                {links.map((l) => (
                  <li key={l} className="flex"><FooterLink label={l} /></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex w-full max-w-container-sm flex-col gap-6 border-t border-grey-600 px-6 pb-6 pt-sp-6 sm:flex-row sm:justify-between">
          <div className="max-w-[260px]">
            <h5 className="text-[14px] font-medium leading-[1.6] tracking-ui text-white">Get the monthly product notes</h5>
            <p className="text-[14px] font-medium leading-[1.6] tracking-ui text-grey-200">New features, plugins and tips, once a month at most.</p>
          </div>
          <form className="w-full max-w-[430px]" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 gap-4 xs:grid-cols-[276px_138px] sm:grid-cols-1 nav:grid-cols-[276px_138px]">
              <input
                type="email"
                placeholder="you@yourmail.com"
                className="h-[42px] rounded-normal border border-white/5 bg-white/5 px-3 py-2 text-[14px] font-medium text-white outline-none transition-[color,border] duration-300 placeholder:text-grey-300 focus:border-white/20"
              />
              <button
                type="submit"
                className="h-[42px] rounded-normal bg-white/90 px-3 py-2 text-[14px] font-medium text-black opacity-90 transition-[background-color,transform] duration-300 ease-in-out [transition-duration:300ms,100ms] hover:bg-white active:scale-[.98]"
              >
                Subscribe
              </button>
            </div>
            <p className="mt-4 text-[12px] leading-[18px] tracking-legal text-white/40">
              By subscribing you agree that we may email you about product updates. You can opt out at any time with one click, and we never share your address. Read our{' '}
              <a href="#" className="underline transition-colors duration-300 hover:text-white">Privacy Policy</a> for details.
            </p>
          </form>
        </div>
      </div>
    </footer>
  )
}
