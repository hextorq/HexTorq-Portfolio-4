import { useEffect, useState } from 'react'
import Preloader from './components/Preloader'
import Navbar from './components/Navbar'
import Cursor from './components/Cursor'
import TemplateSwitcher from './components/TemplateSwitcher'
import GeometricBackground from './components/GeometricBackground'
import { ScrollProgress, Marquee } from './components/Chrome'
import Scene from './three/Scene'
import { useFull3DBackground } from './browser'
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
import { trackClarityPageView } from './utils/clarity'

const hasPrerenderedHtml = () =>
  typeof document !== 'undefined' &&
  document.getElementById('root')?.dataset.prerendered === 'true'

export default function App({ prerender = false }) {
  // Always show preloader on first client load — ignore prerendered flag for
  // the intro animation so it runs on live (Vercel SSG) exactly like local dev.
  const [ready, setReady] = useState(prerender ? true : false)
  const [bgMode, setBgMode] = useState('webgl')

  const lenisRef = useSmoothScroll(ready)

  // Edge keeps the full 3D WebGL scene; Chrome (and others) get the
  // lightweight CSS background. Swapped after mount to match prerendered HTML.
  useEffect(() => {
    setBgMode(useFull3DBackground() ? 'webgl' : 'css')
  }, [])

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

  // Update dynamic document title, meta descriptions & canonical based on current route
  useEffect(() => {
    if (prerender || typeof window === 'undefined') return

    const upsertMeta = (attr, key, content) => {
      if (!content) return
      let el = document.querySelector(`meta[${attr}="${key}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    const updateMetaData = () => {
      const currentPath = normalizePath(window.location.pathname)
      const seo = ROUTE_SEO_MAP[currentPath] || ROUTE_SEO_MAP['/']
      if (seo) {
        document.title = seo.title
        upsertMeta('name', 'description', seo.description)
        upsertMeta('name', 'keywords', seo.keywords)
        upsertMeta('property', 'og:title', seo.title)
        upsertMeta('property', 'og:description', seo.description)
        upsertMeta('property', 'og:url', seo.canonical)
        upsertMeta('name', 'twitter:title', seo.title)
        upsertMeta('name', 'twitter:description', seo.description)
        upsertMeta('name', 'twitter:url', seo.canonical)

        let link = document.querySelector("link[rel='canonical']")
        if (!link) {
          link = document.createElement('link')
          link.setAttribute('rel', 'canonical')
          document.head.appendChild(link)
        }
        link.setAttribute('href', seo.canonical)
      }
    }

    updateMetaData()
    window.addEventListener('popstate', updateMetaData)
    return () => window.removeEventListener('popstate', updateMetaData)
  }, [prerender])

  useEffect(() => {
    if (!ready || prerender || typeof window === 'undefined') return
    const scrollToCurrentRoute = () => {
      const section = currentSectionFromPath()
      if (section) window.setTimeout(() => scrollToSection(section, lenisRef), 80)
      trackClarityPageView(normalizePath(window.location.pathname))
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

      {/* Fixed background — full 3D WebGL on Edge, lightweight CSS elsewhere */}
      {bgMode === 'webgl' ? <Scene /> : <GeometricBackground />}

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
