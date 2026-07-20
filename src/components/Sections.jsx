import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  hero,
  story,
  services,
  products,
  projects,
  process,
  showcase,
  faqs,
  contact,
  footer,
  brand,
} from '../content'
import { useReveal } from '../hooks/useReveal'
import { useMagnetic } from '../hooks/useMagnetic'
import { useTilt } from '../hooks/useTilt'
import ScrollSplitCard from './ScrollSplitCard'
import './Sections.css'

gsap.registerPlugin(ScrollTrigger)

/* Splits a string into word spans wrapped in overflow-hidden masks,
   so each word can slide up from behind a clip edge. */
function MaskWords({ text, className = '' }) {
  return (
    <>
      {text.split(' ').map((w, i) => (
        <span className="word-mask" key={i}>
          <span className={`word ${className}`}>{w}</span>
        </span>
      ))}
    </>
  )
}

/* A heading whose words rise from behind a clip edge when scrolled
   into view — the signature reveal used across every section. */
function MaskHeading({ text, className = '', as = 'h2' }) {
  const ref = useRef(null)
  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      gsap.from(ref.current.querySelectorAll('.word'), {
        yPercent: 118,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.07,
        scrollTrigger: { trigger: ref.current, start: 'top 84%', once: true },
      })
    }, ref)
    return () => ctx.revert()
  }, [text])
  const Tag = as
  return (
    <Tag ref={ref} className={`mask-head h-display ${className}`}>
      <MaskWords text={text} />
    </Tag>
  )
}

/* ── HERO ─────────────────────────────────────────────────────── */
export function Hero({ lenisRef, ready }) {
  const root = useRef(null)

  const go = (target) => {
    const el = document.getElementById(target)
    if (el && lenisRef?.current) lenisRef.current.scrollTo(el, { duration: 1.4 })
    else el?.scrollIntoView({ behavior: 'smooth' })
  }
  const ctaRef = useMagnetic(0.5)

  // Intro choreography — runs once the preloader hands off.
  useEffect(() => {
    if (!ready || !root.current) return
    const heroRoot = root.current
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from(heroRoot.querySelector('.eyebrow'), { y: 24, opacity: 0, duration: 0.8 })
        .from(
          heroRoot.querySelectorAll('.word'),
          { yPercent: 115, duration: 1.1, stagger: 0.06 },
          '-=0.5'
        )
        .from(heroRoot.querySelector('.hero-sub'), { y: 24, opacity: 0, duration: 0.9 }, '-=0.7')
        .from(heroRoot.querySelector('.hero-actions'), { y: 24, opacity: 0, duration: 0.9 }, '-=0.7')
        .from(heroRoot.querySelector('.scroll-hint'), { opacity: 0, duration: 0.8 }, '-=0.4')

      // Parallax: hero content drifts up + fades as you scroll away.
      gsap.to(heroRoot.querySelector('.hero-inner'), {
        yPercent: -18,
        opacity: 0.15,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRoot,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, root)
    return () => ctx.revert()
  }, [ready])

  return (
    <section className="hero section" id="top" ref={root}>
      <div className="container hero-inner">
        <span className="eyebrow">{hero.eyebrow}</span>
        <h1 className="hero-title h-display">
          {hero.title.map((line, i) => (
            <span className={`hero-line ${i === hero.title.length - 1 ? 'is-accent' : ''}`} key={i}>
              <MaskWords text={line} />
            </span>
          ))}
        </h1>
        <p className="hero-sub">{hero.subtitle}</p>
        <div className="hero-actions">
          <button
            className="btn btn-primary"
            ref={ctaRef}
            onClick={() => go(hero.cta.target)}
            aria-label="Explore IT services and AI development"
          >
            {hero.cta.label}
            <span className="btn-arrow" aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <div className="scroll-hint">
        <span>{hero.scrollHint}</span>
        <span className="scroll-line" aria-hidden="true" />
      </div>
    </section>
  )
}

/* ── STORY ────────────────────────────────────────────────────── */
export function Story() {
  const scope = useReveal('.reveal')
  const statsRef = useRef(null)

  // Count-up + entrance animation for stat cards.
  useEffect(() => {
    if (!statsRef.current) return
    const ctx = gsap.context(() => {
      const statCards = statsRef.current.querySelectorAll('.stat')
      gsap.from(statCards, {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 82%',
          once: true,
          onEnter: () => {
            gsap.utils.toArray('.stat-value').forEach((el) => {
              const raw = el.dataset.value || ''
              const num = parseFloat(raw.replace(/[^0-9.]/g, ''))
              if (isNaN(num)) return
              const suffix = raw.replace(/[0-9.,]/g, '')
              const obj = { v: 0 }
              gsap.to(obj, {
                v: num,
                duration: 1.6,
                ease: 'power2.out',
                onUpdate: () => {
                  el.textContent = Math.round(obj.v) + suffix
                },
              })
            })
          },
        },
      })
    }, statsRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="story section" id="story" ref={scope}>
      <div className="container">
        <span className="eyebrow reveal">{story.eyebrow}</span>
        <MaskHeading text={story.heading} className="story-heading" />

        <div className="story-grid">
          <div className="story-copy">
            {story.paragraphs.map((p, i) => (
              <p className="story-p reveal" key={i}>
                {p}
              </p>
            ))}
          </div>

          <div className="story-stats" ref={statsRef}>
            {story.stats.map((s, i) => (
              <div className="stat" key={i}>
                <div className="stat-value text-gradient" data-value={s.value}>
                  {s.value}
                </div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── SERVICES ─────────────────────────────────────────────────── */
export function Services() {
  const scope = useReveal('.reveal')
  const tiltRef = useTilt('.svc-card', { max: 7 })
  const cardsRef = useRef(null)

  useEffect(() => {
    if (!cardsRef.current) return
    const ctx = gsap.context(() => {
      const cards = cardsRef.current.querySelectorAll('.svc-card')
      gsap.from(cards, {
        y: 60,
        opacity: 0,
        scale: 0.92,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 80%',
          once: true,
        },
      })
    }, cardsRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="services section" id="services" ref={scope}>
      <div className="container">
        <span className="eyebrow reveal">{services.eyebrow}</span>
        <MaskHeading text={services.heading} className="section-heading" />
        <p className="section-sub reveal">{services.subheading}</p>

        <div className="svc-grid" ref={tiltRef}>
          {services.items.map((s) => (
            <article className="svc-card glass no-move" key={s.id} data-cursor="view">
              <div className="svc-index">{s.index}</div>
              <h3 className="svc-title">{s.title}</h3>
              <p className="svc-summary">{s.summary}</p>
              <ul className="svc-points">
                {s.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <div className="svc-glow" aria-hidden="true" />
              <div className="glass-glare" aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── PRODUCTS ─────────────────────────────────────────────────── */
export function Products() {
  const scope = useReveal('.reveal')
  const cardsRef = useRef(null)

  useEffect(() => {
    if (!cardsRef.current) return
    const ctx = gsap.context(() => {
      const cards = cardsRef.current.querySelectorAll('.prod-card')
      gsap.from(cards, {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 75%',
          once: true,
        },
        onComplete: () => {
          gsap.utils.toArray(cardsRef.current.querySelectorAll('.prod-visual')).forEach((visual) => {
            const orb = visual.querySelector('.prod-orb')
            const name = visual.querySelector('.prod-name')
            if (orb)
              gsap.fromTo(orb, { yPercent: -14 }, {
                yPercent: 14, ease: 'none',
                scrollTrigger: { trigger: visual, start: 'top bottom', end: 'bottom top', scrub: true },
              })
            if (name)
              gsap.fromTo(name, { yPercent: 8 }, {
                yPercent: -8, ease: 'none',
                scrollTrigger: { trigger: visual, start: 'top bottom', end: 'bottom top', scrub: true },
              })
          })
        },
      })
    }, cardsRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="products section" id="products" ref={scope}>
      <div className="container">
        <span className="eyebrow reveal">{products.eyebrow}</span>
        <MaskHeading text={products.heading} className="section-heading" />
        <p className="section-sub reveal">{products.subheading}</p>

        <div className="prod-list" ref={cardsRef}>
          {products.items.map((p, i) => (
            <article
              className={`prod-card ${i % 2 ? 'is-reverse' : ''}`}
              key={p.id}
              style={{ '--accent': p.accent }}
            >
              <div className="prod-visual">
                <div className="prod-badge">{p.status}</div>
                <div className="prod-orb" aria-hidden="true" />
                <div className="prod-name">{p.name}</div>
              </div>

              <div className="prod-body">
                <span className="prod-category">{p.category}</span>
                <h3 className="prod-title">{p.name}</h3>
                <p className="prod-desc">{p.description}</p>
                <ul className="prod-features">
                  {p.features.map((f) => (
                    <li key={f}>
                      <span className="prod-tick" aria-hidden="true">✦</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a className="prod-link" href={p.href} data-cursor="visit" aria-label={`Visit ${p.name} SaaS platform`}>
                  Visit {p.name} <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── PROJECTS & INNOVATION ────────────────────────────────────── */
export function Projects() {
  const scope = useReveal('.reveal')
  const tiltRef = useTilt('.proj-card', { max: 6 })
  const cardsRef = useRef(null)

  useEffect(() => {
    if (!cardsRef.current) return
    const ctx = gsap.context(() => {
      const cards = cardsRef.current.querySelectorAll('.proj-card')
      gsap.from(cards, {
        y: 50,
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 78%',
          once: true,
        },
      })
    }, cardsRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="projects section" id="projects" ref={scope}>
      <div className="container">
        <span className="eyebrow reveal">{projects.eyebrow}</span>
        <MaskHeading text={projects.heading} className="section-heading" />
        <p className="section-sub reveal">{projects.subheading}</p>

        <div className="proj-grid" ref={tiltRef}>
          {projects.items.map((p) => (
            <article className="proj-card glass no-move" key={p.id} data-cursor="explore">
              <h3 className="proj-title">{p.title}</h3>
              <p className="proj-summary">{p.summary}</p>
              <ul className="proj-tags">
                {p.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <div className="glass-glare" aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── PROCESS — horizontal pinned storytelling ─────────────────── */
export function Process() {
  const section = useRef(null)
  const track = useRef(null)

  useEffect(() => {
    if (!track.current) return
    const ctx = gsap.context(() => {
      const steps = track.current.querySelectorAll('.process-step')
      gsap.from(steps, {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: track.current,
          start: 'top 78%',
          once: true,
        },
      })
    }, track)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!section.current || !track.current) return
    const mm = gsap.matchMedia()

    mm.add('(min-width: 860px)', () => {
      const getScroll = () => track.current.scrollWidth - window.innerWidth
      const tween = gsap.to(track.current, {
        x: () => -getScroll(),
        ease: 'none',
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: () => `+=${getScroll()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })
      return () => tween.kill()
    })

    return () => mm.revert()
  }, [])

  return (
    <section className="process" id="process" ref={section}>
      <div className="process-track" ref={track}>
        <div className="process-intro">
          <span className="eyebrow">{process.eyebrow}</span>
          <h2 className="process-heading h-display">{process.heading}</h2>
          <p className="process-hint">
            <span className="process-hint-line" aria-hidden="true" /> Scroll to explore
          </p>
        </div>

        {process.steps.map((s) => (
          <article className="process-step" key={s.no} data-cursor="step">
            <div className="process-no">{s.no}</div>
            <h3 className="process-title">{s.title}</h3>
            <p className="process-text">{s.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

/* ── FAQS ─────────────────────────────────────────────────────── */
export function FaqSection() {
  const scope = useReveal('.reveal')
  const [openIndex, setOpenIndex] = useState(0)

  const toggle = (i) => setOpenIndex((prev) => (prev === i ? -1 : i))

  return (
    <section className="faqs section" id="faq" ref={scope}>
      <div className="container">
        <span className="eyebrow reveal">{faqs.eyebrow}</span>
        <MaskHeading text={faqs.heading} className="section-heading" />

        <div className="faq-list">
          {faqs.items.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <article className={`faq-item glass ${isOpen ? 'is-open' : ''}`} key={i}>
                <button
                  className="faq-question"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                >
                  <span className="faq-q-text">{item.question}</span>
                  <span className="faq-icon" aria-hidden="true">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                <div
                  id={`faq-answer-${i}`}
                  className="faq-answer"
                  hidden={!isOpen}
                >
                  <p>{item.answer}</p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ── SHOWCASE (scroll-split product cards) ────────────────────── */
export function Ecosystem() {
  return <ScrollSplitCard />
}

/* Minimal inline social glyphs for the footer */
const SOCIAL_ICONS = {
  X: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  Instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  YouTube: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.7-1.7C19.4 5.2 12 5.2 12 5.2s-7.4 0-8.9.4A2.5 2.5 0 0 0 1.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.7 1.7c1.5.4 8.9.4 8.9.4s7.4 0 8.9-.4a2.5 2.5 0 0 0 1.7-1.7C23 15.2 23 12 23 12zM9.8 15.3V8.7l6.2 3.3z" />
    </svg>
  ),
  LinkedIn: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  ),
}

/* ── CONTACT + FOOTER ─────────────────────────────────────────── */
export function Contact() {
  const scope = useReveal('.reveal')
  const ctaRef = useMagnetic(0.5)
  return (
    <section className="contact section" id="contact" ref={scope}>
      <div className="container contact-inner">
        <span className="eyebrow reveal">{contact.eyebrow}</span>
        <h2 className="contact-heading h-display reveal">
          {contact.heading.map((l, i) => (
            <span className="reveal" key={i}>
              {l}
            </span>
          ))}
        </h2>
        <p className="contact-sub reveal">{contact.subtitle}</p>
        <a className="btn btn-primary btn-lg reveal" ref={ctaRef} href={contact.cta.href} aria-label="Contact Hextorq via Email">
          {contact.cta.label}
          <span className="btn-arrow" aria-hidden="true">→</span>
        </a>

        <div className="contact-meta reveal">
          <a href={`mailto:${brand.email}`} aria-label="Send email to Hextorq">{brand.email}</a>
          <span>{brand.location}</span>
        </div>
      </div>

      <footer className="footer">
        <div className="container">
          <div className="footer-top">
            <div className="footer-lead">
              <p className="footer-tagline">{footer.tagline}</p>
              <div className="footer-socials">
                {brand.socials.map((s) => (
                  <a key={s.label} href={s.href} className="footer-social" aria-label={s.label} target="_blank" rel="noopener noreferrer">
                    {SOCIAL_ICONS[s.label] || s.label}
                  </a>
                ))}
              </div>
            </div>

            {footer.columns.map((col) => (
              <div className="footer-col" key={col.title}>
                <h3 className="footer-col-title">{col.title}</h3>
                <ul>
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <a href={l.href}>
                        {l.label}
                        {l.tag && <span className="footer-pill">{l.tag}</span>}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="footer-wordmark" aria-hidden="true">
            {footer.wordmark}
          </div>

          <div className="footer-bottom">
            <span className="footer-copy">{footer.copyright}</span>
            <div className="footer-legal">
              {footer.legal.map((l) => (
                <a key={l.label} href={l.href}>
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </section>
  )
}
