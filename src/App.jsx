import { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Store from './pages/Store.jsx'
import Pro from './pages/Pro.jsx'
import Pricing from './pages/Pricing.jsx'
import Teams from './pages/Teams.jsx'
import Ai from './pages/Ai.jsx'
import Windows from './pages/Windows.jsx'
import Ios from './pages/Ios.jsx'

// Tiny path switch (PAGES_SPEC 6). Unknown paths render Home.
const ROUTES = {
  '/store': Store,
  '/pro': Pro,
  '/pricing': Pricing,
  '/teams': Teams,
  '/core-features/ai': Ai,
  '/windows': Windows,
  '/ios': Ios,
}
const norm = (p) => (p.length > 1 ? p.replace(/\/+$/, '') : p)

export default function App() {
  const [path, setPath] = useState(() => norm(window.location.pathname))

  useEffect(() => {
    const onPop = () => setPath(norm(window.location.pathname))
    // Intercept same-origin internal links for pushState navigation.
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = e.target.closest?.('a[href]')
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return
      const href = a.getAttribute('href')
      if (!href || !href.startsWith('/') || href.startsWith('//')) return
      e.preventDefault()
      const next = norm(href)
      if (next !== norm(window.location.pathname)) window.history.pushState(null, '', next)
      setPath(next)
      window.scrollTo(0, 0)
    }
    window.addEventListener('popstate', onPop)
    document.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('popstate', onPop)
      document.removeEventListener('click', onClick)
    }
  }, [])

  const Page = ROUTES[path] ?? Home
  return (
    <>
      <Navbar key={path} />
      <Page />
      <Footer art={path === '/windows' ? 'windows' : 'cube'} />
    </>
  )
}
