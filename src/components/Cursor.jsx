import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './Cursor.css'

/**
 * Interactive custom cursor driven purely by pointer position.
 * - The ring follows the pointer; the dot trails behind the ring and
 *   eases into the ring's center when the pointer stops.
 * - Hover activates when the pointer touches an interactive element
 *   (checked via elementFromPoint each move) — reliable on every
 *   element, including nav links.
 * Disabled on touch devices, where the native cursor is fine.
 */
export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const label = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    document.body.classList.add('has-custom-cursor')

    // Ring leads, dot trails far behind with a long, slow catch-up —
    // the gap shrinks as it approaches, then fits into the ring center.
    const ringX = gsap.quickTo(ring.current, 'x', { duration: 0.3, ease: 'power3' })
    const ringY = gsap.quickTo(ring.current, 'y', { duration: 0.3, ease: 'power3' })
    const dotX = gsap.quickTo(dot.current, 'x', { duration: 1.1, ease: 'power2.out' })
    const dotY = gsap.quickTo(dot.current, 'y', { duration: 1.1, ease: 'power2.out' })

    let current = null

    const setActive = (el) => {
      current = el
      ring.current.classList.add('is-active')
      const text = el.getAttribute('data-cursor')
      if (text && label.current) {
        label.current.textContent = text
        ring.current.classList.add('has-label')
      } else {
        ring.current.classList.remove('has-label')
      }
    }

    const clearActive = () => {
      current = null
      ring.current.classList.remove('is-active', 'has-label')
    }

    const move = (e) => {
      ringX(e.clientX)
      ringY(e.clientY)
      dotX(e.clientX)
      dotY(e.clientY)

      // Position-based hover: whatever the cursor actually touches wins.
      const el = document.elementFromPoint(e.clientX, e.clientY)
      const interactive = el && el.closest('a, button, [data-cursor]')
      if (interactive) {
        if (interactive !== current) setActive(interactive)
      } else if (current) {
        clearActive()
      }
    }

    const down = () =>
      gsap.to(ring.current, { scale: 0.88, duration: 0.25, ease: 'power2.out', overwrite: 'auto' })
    const up = () =>
      gsap.to(ring.current, { scale: 1, duration: 0.4, ease: 'power2.out', overwrite: 'auto' })

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)

    return () => {
      document.body.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
    }
  }, [])

  return (
    <>
      <div className="cursor-dot" ref={dot} aria-hidden="true" />
      <div className="cursor-ring" ref={ring} aria-hidden="true">
        <span className="cursor-label" ref={label} />
      </div>
    </>
  )
}