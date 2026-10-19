import { useCallback, useState } from 'react'
import { HeroDownloadInfo, Icon, useInView } from './shared.jsx'
import HeroCanvas from './HeroCanvas.jsx'

function HeroBackground() {
  // WebGL2 glass-bars scene (HeroCanvas). The CSS layers are the fallback when WebGL2 is unavailable.
  const [gl, setGl] = useState(false)
  const ready = useCallback(() => setGl(true), [])
  return (
    <div className="hero-bg absolute inset-0 z-[-1] mx-auto max-w-[1200px] overflow-hidden bg-grey-900" data-hero-bg data-webgl={gl}>
      {!gl && (
        <>
          <div className="hero-light" data-motion="hero-light" />
          <div className="hero-bars" data-motion="hero-bars" />
          <div className="hero-grain" />
        </>
      )}
      <HeroCanvas onReady={ready} />
    </div>
  )
}

function Announcement() {
  // Original: the border sweep (.animate) is only applied while the container intersects (IO threshold 0).
  const [ref, inView] = useInView(0)
  return (
    <div ref={ref} className="pt-6 sm:pt-10">
      <a href="#" data-animate={inView} className="announce-outer group block rounded-announce p-px shadow-announce transition-shadow duration-200 hover:shadow-announce-hover">
        <span className="flex h-[30px] items-center gap-2 rounded-announce-inner bg-announce-inner px-3 py-1 text-[14px] font-medium leading-normal tracking-ui text-white">
          Introducing Spaces 2
          <Icon name="arrow-right" size={16} className="text-grey-200" />
        </span>
      </a>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="relative isolate mb-sp-10 flex flex-col items-center sm:mb-sp-13">
      <HeroBackground />
      <div
        className="flex w-full max-w-[818px] flex-col items-center gap-sp-4 px-4 pb-[137px] pt-[260px] text-center sm:pb-[212px] sm:pt-[370px]"
        data-reveal="hero-text"
      >
        <h1 className="hero-h1 max-w-[440px] text-[36px] font-semibold leading-[1.1] text-white xs:text-[48px] sm:max-w-[540px] sm:text-[64px]">
          Your quickest route anywhere
        </h1>
        <p
          className="hero-sub text-[14px] leading-normal tracking-ui text-white sm:text-[18px]"
          data-reveal="hero-sub"
        >
          A fast, extensible command bar for your desktop. Open apps, search files and run every daily task in one keystroke.
        </p>
      </div>
      <HeroDownloadInfo />
      <Announcement />
    </section>
  )
}
