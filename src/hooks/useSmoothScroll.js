import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Boots Lenis smooth scrolling and wires it into GSAP's ticker so
 * ScrollTrigger and the 3D scene stay perfectly in sync.
 *
 * On touch-only mobile devices Lenis still runs (so GSAP ScrollTrigger
 * fires correctly) but wheel-smoothing is disabled for a native feel.
 *
 * @param {boolean} enabled  Pass false while the intro loader is on
 *                           screen so the page can't be scrolled yet.
 * @returns {React.MutableRefObject<Lenis|null>}
 */
export function useSmoothScroll(enabled) {
  const ref = useRef(null)

  useEffect(() => {
    if (!enabled) return

    // Detect pure-touch devices (no mouse)
    const isTouchOnly =
      typeof window !== 'undefined' &&
      window.matchMedia('(hover: none) and (pointer: coarse)').matches

    const lenis = new Lenis({
      duration: isTouchOnly ? 0.8 : 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !isTouchOnly,
      touchMultiplier: isTouchOnly ? 1.2 : 1.6,
      infinite: false,
    })
    ref.current = lenis

    // Keep GSAP ScrollTrigger in sync on every Lenis scroll tick
    lenis.on('scroll', ScrollTrigger.update)

    // Wire Lenis into GSAP RAF so scrub/pin timelines stay frame-perfect
    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    // Recalculate ScrollTrigger positions once fonts/images settle
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    const t = setTimeout(refresh, 500)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      window.removeEventListener('load', refresh)
      clearTimeout(t)
      ref.current = null
    }
  }, [enabled])

  return ref
}
