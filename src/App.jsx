import { useEffect, useState } from 'react'
import Preloader from './components/Preloader'
import Navbar from './components/Navbar'
import Cursor from './components/Cursor'
import TemplateSwitcher from './components/TemplateSwitcher'
import { ScrollProgress, Marquee } from './components/Chrome'
import Scene from './three/Scene'
import {
  Hero,
  Story,
  Services,
  Products,
  Process,
  Projects,
  Ecosystem,
  Contact,
} from './components/Sections'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { scrollStore } from './three/scrollStore'
import { marqueeWords } from './content'
import { currentSectionFromPath, scrollToSection } from './routeUtils'

const hasPrerenderedHtml = () =>
  typeof document !== 'undefined' &&
  document.getElementById('root')?.dataset.prerendered === 'true'

export default function App({ prerender = false }) {
  const [ready, setReady] = useState(prerender || hasPrerenderedHtml()) // becomes true when intro finishes

  // Smooth scroll only after the intro completes.
  const lenisRef = useSmoothScroll(ready)

  // Lock native scroll while the preloader is up.
  useEffect(() => {
    document.documentElement.style.overflow = ready ? '' : 'hidden'
  }, [ready])

  // Feed global scroll progress into the store the 3D scene reads.
  useEffect(() => {
    if (!ready) return
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      scrollStore.progressTarget = max > 0 ? window.scrollY / max : 0
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [ready])

  useEffect(() => {
    if (!ready || prerender) return
    const scrollToCurrentRoute = () => {
      const section = currentSectionFromPath()
      if (section) window.setTimeout(() => scrollToSection(section, lenisRef), 80)
    }
    scrollToCurrentRoute()
    window.addEventListener('popstate', scrollToCurrentRoute)
    return () => window.removeEventListener('popstate', scrollToCurrentRoute)
  }, [ready, prerender, lenisRef])

  return (
    <>
      {!ready && !prerender && <Preloader onDone={() => setReady(true)} />}

      <Cursor />
      <ScrollProgress />
      <TemplateSwitcher />

      {/* Fixed WebGL background */}
      <Scene />

      {/* Readability scrim: darkens top (for the nav) + edges over the nebula */}
      <div className="scrim" aria-hidden="true" />

      {/* Foreground content */}
      <div className="content">
        <Navbar lenisRef={lenisRef} />
        <main>
          <Hero lenisRef={lenisRef} ready={ready} />
          <Story />
          <Services />
          <Marquee words={marqueeWords} duration={30} />
          <Products />
          <Process />
          <Projects />
          <Ecosystem />
          <Contact />
        </main>
      </div>
    </>
  )
}
