import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './GeometricBackground.css';

gsap.registerPlugin(ScrollTrigger);

function ElegantShape({
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradientColor = 'rgba(99, 102, 241, 0.15)', // Default to indigo-500/[0.15]
  style = {}
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className="elegant-shape-wrapper"
      style={{ ...style }}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="elegant-shape-inner"
      >
        <div
          className="elegant-shape-blur-circle"
          style={{
            background: `linear-gradient(90deg, ${gradientColor}, transparent)`,
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function GeometricBackground() {
  const root = useRef(null)

  /* Gentle GSAP scroll parallax on the shapes — Chrome-only, since this
     component only renders for non-Edge browsers. */
  useEffect(() => {
    const el = root.current
    if (!el) return

    const speeds = [40, -70, 90, -35, 55]
    const timers = []
    const ctx = gsap.context(() => {
      const shapes = el.querySelectorAll('.elegant-shape-wrapper')
      const delay = 2500 // wait for the framer-motion entrance to settle

      shapes.forEach((s, i) => {
        const t = setTimeout(() => {
          gsap.to(s, {
            y: () => speeds[i % speeds.length],
            ease: 'none',
            scrollTrigger: {
              trigger: document.body,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 1.2,
            },
          })
        }, delay)
        timers.push(t)
      })
    }, el)

    return () => {
      ctx.revert()
      timers.forEach(clearTimeout)
    }
  }, [])

  return (
    <div className="geometric-bg-container" ref={root}>
      {/* Background gradients */}
      <div className="geometric-bg-gradient-overlay" />

      {/* Floating Elegant Shapes */}
      <div className="geometric-bg-shapes-wrapper">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradientColor="rgba(99, 102, 241, 0.15)" /* indigo-500/[0.15] */
          style={{ left: '-5%', top: '15%' }}
        />

        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradientColor="rgba(244, 63, 94, 0.15)" /* rose-500/[0.15] */
          style={{ right: '-2%', top: '65%' }}
        />

        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradientColor="rgba(139, 92, 246, 0.15)" /* violet-500/[0.15] */
          style={{ left: '8%', bottom: '15%' }}
        />

        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradientColor="rgba(245, 158, 11, 0.15)" /* amber-500/[0.15] */
          style={{ right: '15%', top: '10%' }}
        />

        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradientColor="rgba(6, 182, 212, 0.15)" /* cyan-500/[0.15] */
          style={{ left: '22%', top: '5%' }}
        />
      </div>

      {/* Fade overlay on top of the shapes */}
      <div className="geometric-bg-fade-scrim" />
    </div>
  );
}
