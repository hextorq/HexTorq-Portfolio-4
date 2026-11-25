import { useRef } from 'react'
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion'
import { showcase } from '../content'
import './ScrollSplitCard.css'

const ICONS = {
  payment: (
    <svg width="36" height="36" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect x="4" y="10" width="32" height="20" rx="3" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.9"/>
      <rect x="8" y="14" width="10" height="8" rx="1" fill="currentColor" opacity="0.3"/>
      <circle cx="27" cy="24" r="5" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.7"/>
      <path d="M25 24h4M27 22v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.9"/>
    </svg>
  ),
  printing: (
    <svg width="36" height="36" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect x="6" y="14" width="28" height="16" rx="3" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.9"/>
      <rect x="10" y="8" width="20" height="6" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5"/>
      <rect x="12" y="18" width="6" height="4" rx="1" fill="currentColor" opacity="0.3"/>
      <circle cx="28" cy="24" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6"/>
      <path d="M26.5 24h3M28 22.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.9"/>
    </svg>
  ),
  ticketing: (
    <svg width="36" height="36" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <rect x="4" y="10" width="32" height="20" rx="3" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.9"/>
      <path d="M4 16h32" stroke="currentColor" strokeWidth="2" opacity="0.3"/>
      <rect x="12" y="12" width="6" height="16" rx="1" fill="currentColor" opacity="0.15"/>
      <circle cx="28" cy="22" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6"/>
      <path d="M26.5 22h3M28 20.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.9"/>
    </svg>
  ),
}

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ScrollSplitCard() {
  const containerRef = useRef(null)
  const { image, cards } = showcase

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const leftX = useTransform(scrollYProgress, [0, 0.45, 0.8], [0, -48, -24])
  const rightX = useTransform(scrollYProgress, [0, 0.45, 0.8], [0, 48, 24])
  const scale = useTransform(scrollYProgress, [0, 0.45], [1, 0.9])

  const rotateY = useTransform(scrollYProgress, [0.45, 0.82], [0, 180])
  const rotateZLeft = useTransform(scrollYProgress, [0.45, 0.82], [0, 6])
  const rotateZRight = useTransform(scrollYProgress, [0.45, 0.82], [0, -6])

  const borderRadiusLeft = useTransform(scrollYProgress, [0, 0.18], ['16px 0px 0px 16px', '16px 16px 16px 16px'])
  const borderRadiusMiddle = useTransform(scrollYProgress, [0, 0.18], ['0px 0px 0px 0px', '16px 16px 16px 16px'])
  const borderRadiusRight = useTransform(scrollYProgress, [0, 0.18], ['0px 16px 16px 0px', '16px 16px 16px 16px'])

  const borderOpacity = useTransform(scrollYProgress, [0, 0.18], [0, 0.2])
  const shadowOpacity = useTransform(scrollYProgress, [0, 0.18], [0, 0.4])
  const boxShadow = useMotionTemplate`inset 0 1px 1px rgba(255, 255, 255, ${borderOpacity}), inset 0 -24px 48px rgba(0, 0, 0, ${shadowOpacity}), 0 25px 50px -12px rgba(0, 0, 0, ${shadowOpacity})`

  // Cards rise slightly then hold — no dramatic fly-off so no dead scroll space
  const cardsY = useTransform(scrollYProgress, [0.82, 1], [0, -60])

  const textOpacity = useTransform(scrollYProgress, [0.82, 0.95], [0, 1])
  const textY = useTransform(scrollYProgress, [0.82, 0.95], [30, 0])

  const startTextOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0])
  const startTextY = useTransform(scrollYProgress, [0, 0.08], [0, 20])

  return (
    <section className="ssc" id="ecosystem">
      <div className="ssc-head container">
        <span className="eyebrow">{showcase.eyebrow}</span>
        <h2 className="section-heading h-display">{showcase.heading}</h2>
      </div>

      <div ref={containerRef} className="ssc-scroll">
        <div className="ssc-sticky">
          <motion.div
            className="ssc-start-hint"
            style={{ opacity: startTextOpacity, y: startTextY }}
          >
            <p className="ssc-hint-text">Scroll down</p>
          </motion.div>

          <motion.div
            style={{ scale, y: cardsY }}
            className="ssc-row"
          >
            {cards.slice(0, 3).map((card, i) => (
              <motion.div
                key={card.title}
                className="ssc-panel"
                style={{
                  x: i === 0 ? leftX : i === 2 ? rightX : 0,
                  rotateY,
                  rotateZ: i === 0 ? rotateZLeft : i === 2 ? rotateZRight : 0,
                  zIndex: i,
                }}
              >
                <motion.div
                  className="ssc-front"
                  style={{
                    borderRadius: i === 0 ? borderRadiusLeft : i === 2 ? borderRadiusRight : borderRadiusMiddle,
                    boxShadow,
                  }}
                >
                  <div
                    className="ssc-front-img"
                    style={{
                      left: `${-100 * i}%`,
                      width: '300%',
                      backgroundImage: `url(${image})`,
                      backgroundSize: '100% 100%',
                      backgroundPosition: 'center',
                    }}
                  />
                </motion.div>

                <motion.div
                  className="ssc-back"
                  style={{
                    backgroundColor: card.bgColor,
                    color: card.textColor,
                    borderRadius: i === 0 ? borderRadiusLeft : i === 2 ? borderRadiusRight : borderRadiusMiddle,
                    boxShadow,
                  }}
                >
                  <div className="ssc-back-top">
                    {card.icon && <div className="ssc-icon">{ICONS[card.icon]}</div>}
                    {card.tag && <span className="ssc-tag">{card.tag}</span>}
                  </div>
                  <div className="ssc-back-body">
                    <h3 className="ssc-title">{card.title}</h3>
                    <p className="ssc-desc">{card.description}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="ssc-end-hint"
            style={{ opacity: textOpacity, y: textY }}
          >
            <p className="ssc-end-text">Three products. One ecosystem.</p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
