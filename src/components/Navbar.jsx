import { useEffect, useState } from 'react'
import { LightButton, LogoMark } from './shared.jsx'

// 9 labels, lengths 5,3,2,3,7,5,10,4,7 (spec 1)
const LINKS = ['Tools', 'Pro', 'AI', 'Mac', 'Desktop', 'Teams', 'Developers', 'Blog', 'Pricing']
// PAGES_SPEC 1: index -> route (6 and 7 stay '#')
const HREFS = ['/store', '/pro', '/core-features/ai', '/ios', '/windows', '/teams', '#', '#', '/pricing']

const linkCls =
  'rounded-sm px-2 py-3 text-[14px] font-medium leading-normal tracking-ui text-grey-200 transition-colors duration-200 ease-in-out hover:text-white'

function Wordmark({ className = '' }) {
  return (
    <span className={`text-[15px] font-semibold leading-6 tracking-ui text-white ${className}`}>Launchpad</span>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 880px)')
    const close = () => mq.matches && setOpen(false)
    mq.addEventListener('change', close)
    return () => mq.removeEventListener('change', close)
  }, [])

  return (
    <header
      className={`fixed left-1/2 top-0 z-[2] flex w-full -translate-x-1/2 justify-center px-4 pt-4 ${open ? 'min-h-screen overflow-y-scroll' : ''}`}
    >
      <nav
        className={`relative grid w-full max-w-container grid-rows-[24px_auto] overflow-hidden rounded-lg border border-card-border bg-glass p-4 shadow-nav backdrop-blur-5 transition-[height,transform] duration-300 nav:flex nav:h-nav nav:items-center nav:justify-center nav:overflow-visible nav:px-8 nav:py-4 ${open ? 'h-[calc(100vh-16px)]' : 'h-[58px]'}`}
      >
        {/* Logo: absolute at left:32px on desktop; in the grid on mobile */}
        <a
          href="/"
          aria-label="Launchpad home"
          className="flex h-6 items-center gap-1.5 transition-transform duration-200 hover:scale-105 nav:absolute nav:left-8 nav:top-1/2 nav:-translate-y-1/2 nav:hover:-translate-y-1/2"
        >
          <LogoMark size={24} />
          <Wordmark className="nav:hidden lg:inline" />
        </a>

        {/* Hamburger (below 880) */}
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={`absolute right-4 top-[21px] h-4 w-6 transition-transform duration-500 nav:hidden ${open ? 'rotate-180' : ''}`}
        >
          <span className={`absolute left-0 top-[10%] h-px w-full bg-white/90 transition-transform duration-500 ${open ? '-rotate-45 !top-1/2' : ''}`} />
          <span className={`absolute left-0 top-1/2 h-px w-full bg-white/90 transition-opacity duration-500 ${open ? 'opacity-0' : ''}`} />
          <span className={`absolute left-0 top-[90%] h-px w-full bg-white/90 transition-transform duration-500 ${open ? 'rotate-45 !top-1/2' : ''}`} />
        </button>

        {/* Desktop center links */}
        <ul className="hidden gap-4 nav:flex">
          {LINKS.map((l, i) => (
            <li key={l}>
              <a href={HREFS[i]} className={`${linkCls} block`}>{l}</a>
            </li>
          ))}
        </ul>

        {/* Desktop right group */}
        <div className="absolute right-8 top-1/2 hidden -translate-y-1/2 items-center gap-6 nav:flex">
          <a href="#" className={linkCls}>Log in</a>
          <span className="hidden lg:inline-flex">
            <LightButton icon="download" className="w-[117px]">Download</LightButton>
          </span>
        </div>

        {/* Mobile menu */}
        <div className={`nav:hidden ${open ? '' : 'invisible'}`}>
          <ul className="flex flex-col gap-1 pb-8 pt-12">
            {LINKS.map((l, i) => (
              <li key={l}>
                <a href={HREFS[i]} onClick={() => setOpen(false)} className={`${linkCls} block px-0`}>{l}</a>
              </li>
            ))}
          </ul>
          <div className="border-t border-white/10 pt-8">
            <a href="#" className={`${linkCls} px-0`}>Log in</a>
          </div>
        </div>
      </nav>
    </header>
  )
}
