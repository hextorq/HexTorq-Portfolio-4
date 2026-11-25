import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Attaches a ScrollTrigger to every element matching `selector`
 * inside the returned ref, toggling `.is-visible` as it enters view.
 * Pairs with the `.reveal` CSS class for staggered fade-ups.
 *
 * On mobile viewports the trigger fires earlier (bottom of screen)
 * so animations aren't missed on short viewports.
 */
export function useReveal(selector = '.reveal', { stagger = 0.09 } = {}) {
  const scope = useRef(null)

  useEffect(() => {
    if (!scope.current) return

    const els = gsap.utils.toArray(scope.current.querySelectorAll(selector))
    if (!els.length) return

    // Pick a comfortable trigger start depending on viewport height
    const isMobile = window.innerWidth <= 820
    const start = isMobile ? 'top 98%' : 'top 72%'

    const triggers = els.map((el, i) =>
      ScrollTrigger.create({
        trigger: el,
        start,
        once: true,
        onEnter: () => {
          // Stagger elements that enter together; reset index every 6 items
          gsap.delayedCall((i % 6) * stagger, () => el.classList.add('is-visible'))
        },
      })
    )

    // Refresh ScrollTrigger after any resize (font-load, orientation change)
    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)

    return () => {
      triggers.forEach((t) => t.kill())
      window.removeEventListener('resize', onResize)
    }
  }, [selector, stagger])

  return scope
}
