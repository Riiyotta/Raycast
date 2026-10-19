import Hero from '../components/Hero.jsx'
import ShortcutsFrame from '../components/ShortcutsFrame.jsx'
import TimeKeyboard from '../components/TimeKeyboard.jsx'
import ExtensionsCarousel from '../components/ExtensionsCarousel.jsx'
import AiBento from '../components/AiBento.jsx'
import Testimonials from '../components/Testimonials.jsx'
import Automation from '../components/Automation.jsx'
import FeatureWall from '../components/FeatureWall.jsx'
import Community from '../components/Community.jsx'
import DeveloperGrid from '../components/DeveloperGrid.jsx'
import FinalCta from '../components/FinalCta.jsx'

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <Hero />
      <ShortcutsFrame />
      <TimeKeyboard />
      <ExtensionsCarousel />
      <AiBento workflowDelay={3400} />
      <Testimonials />
      <Automation />
      <FeatureWall />
      <Community />
      <DeveloperGrid />
      <FinalCta />
    </main>
  )
}
