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
  FaqSection,
  Contact,
} from './components/Sections'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { scrollStore } from './three/scrollStore'
import { marqueeWords } from './content'
import { currentSectionFromPath, scrollToSection, normalizePath } from './routeUtils'
import { ROUTE_SEO_MAP } from './seo/routeSeo'

const hasPrerenderedHtml = () =>
  typeof document !== 'undefined' &&
  document.getElementById('root')?.dataset.prerendered === 'true'

export default function App({ prerender = false }) {
  const [ready, setReady] = useState(prerender || hasPrerenderedHtml())

  const lenisRef = useSmoothScroll(ready)

  useEffect(() => {
    document.documentElement.style.overflow = ready ? '' : 'hidden'
  }, [ready])

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

  // Update dynamic document title & canonical based on current route
  useEffect(() => {
    if (!ready || prerender || typeof window === 'undefined') return
    const updateMetaData = () => {
      const currentPath = normalizePath(window.location.pathname)
      const seo = ROUTE_SEO_MAP[currentPath] || ROUTE_SEO_MAP['/']
      if (seo) {
        document.title = seo.title
        let link = document.querySelector("link[rel='canonical']")
        if (!link) {
          link = document.createElement('link')
          link.setAttribute('rel', 'canonical')
          document.head.appendChild(link)
        }
        link.setAttribute('href', seo.canonical)
      }
    }

    const scrollToCurrentRoute = () => {
      const section = currentSectionFromPath()
      if (section) window.setTimeout(() => scrollToSection(section, lenisRef), 80)
      updateMetaData()
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

      {/* Readability scrim */}
      <div className="scrim" aria-hidden="true" />

      {/* Foreground content */}
      <div className="content">
        <Navbar lenisRef={lenisRef} />
        <main id="main-content">
          <Hero lenisRef={lenisRef} ready={ready} />
          <Story />
          <Services />
          <Marquee words={marqueeWords} duration={30} />
          <Products />
          <Process />
          <Projects />
          <Ecosystem />
          <FaqSection />
          <Contact />
        </main>
      </div>
    </>
  )
}
