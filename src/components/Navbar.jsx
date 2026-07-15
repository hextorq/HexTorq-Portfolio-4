import { useEffect, useRef, useState } from 'react'
import { brand, nav } from '../content'
import { pushRouteForSection, scrollToSection } from '../routeUtils'
import './Navbar.css'

/**
 * Sticky top navigation. Uses Lenis (passed via ref) to smooth-scroll
 * to sections. Condenses after the user scrolls past the hero.
 */
export default function Navbar({ lenisRef }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const barRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (target) => {
    setOpen(false)
    pushRouteForSection(target)
    scrollToSection(target, lenisRef)
  }

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''}`} ref={barRef}>
      <button className="nav-logo" onClick={() => go('top')} aria-label="Hextorq home">
        <span className="nav-logo-mark" />
        {brand.name}
      </button>

      <nav className={`nav-links ${open ? 'is-open' : ''}`}>
        {nav.map((item) => (
          <button className="nav-link" key={item.target} onClick={() => go(item.target)}>
            <span className="nav-roll">
              <span className="nav-roll-inner">
                <span>{item.label}</span>
                <span aria-hidden="true">{item.label}</span>
              </span>
            </span>
          </button>
        ))}
        <a className="nav-cta" href={`mailto:${brand.email}`}>
          Get in touch
        </a>
      </nav>

      <button
        className={`nav-burger ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
      </button>
    </header>
  )
}
