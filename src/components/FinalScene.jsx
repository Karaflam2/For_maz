import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { PHOTOS, FINAL_MESSAGE } from '../data/media'

// Nombre de vignettes qui composent l'étoile.
// Indépendant du nombre de photos : elles sont répétées pour remplir la forme.
const STAR_TILES = 30

// Génère `count` points répartis uniformément sur le contour d'une étoile à 5 branches.
function getStarData(count) {
  const OUTER = 1
  const INNER = 0.4          // ratio classique d'une étoile à 5 branches
  const SPIKES = 5
  const VERTS = SPIKES * 2   // 10 sommets (pointe / creux alternés)

  // 10 sommets alternant rayon externe/interne, en partant du haut
  const verts = []
  for (let k = 0; k < VERTS; k++) {
    const radius = k % 2 === 0 ? OUTER : INNER
    const angle = -Math.PI / 2 + (k * Math.PI) / SPIKES  // -90° puis +36° par pas
    verts.push({ x: radius * Math.cos(angle), y: radius * Math.sin(angle) })
  }

  // Les 10 arêtes d'une étoile régulière sont congruentes → répartition uniforme par arête
  const raw = []
  for (let i = 0; i < count; i++) {
    const t = (i / count) * VERTS
    const e = Math.floor(t)
    const f = t - e
    const a = verts[e]
    const b = verts[(e + 1) % VERTS]
    raw.push({ x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f })
  }

  const minX = Math.min(...raw.map(p => p.x))
  const maxX = Math.max(...raw.map(p => p.x))
  const minY = Math.min(...raw.map(p => p.y))
  const maxY = Math.max(...raw.map(p => p.y))
  const rangeX = maxX - minX
  const rangeY = maxY - minY

  const positions = raw.map(p => ({
    x: (p.x - minX) / rangeX,
    y: (p.y - minY) / rangeY,
  }))

  // Centre géométrique de l'étoile (origine 0,0) ramené dans le repère normalisé
  const center = {
    x: (0 - minX) / rangeX,
    y: (0 - minY) / rangeY,
  }

  return { positions, center }
}

function Petal({ delay }) {
  const startX = Math.random() * 100
  const size = 10 + Math.random() * 10
  const duration = 5 + Math.random() * 6
  const drift = (Math.random() - 0.5) * 150
  return (
    <motion.div
      initial={{ y: '-5vh', x: `${startX}vw`, opacity: 0, rotate: 0 }}
      animate={{ y: '110vh', x: `calc(${startX}vw + ${drift}px)`, opacity: [0, .8, .8, 0], rotate: 360 }}
      transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
      style={{
        position: 'fixed', top: 0,
        width: `${size}px`, height: `${size}px`,
        borderRadius: '50% 0 50% 0',
        background: Math.random() > 0.5 ? '#f0a868' : '#e0733a',
        transform: 'rotate(45deg)',
        pointerEvents: 'none', zIndex: 0,
      }}
    />
  )
}

function MessageText({ text }) {
  const [revealed, setRevealed] = useState(0)
  const chars = text.split('')
  useEffect(() => {
    if (revealed >= chars.length) return
    const t = setTimeout(() => setRevealed(r => r + 1), 55)
    return () => clearTimeout(t)
  }, [revealed, chars.length])
  return (
    <p style={{
      fontFamily: "'Playfair Display', serif",
      fontSize: 'clamp(.95rem, 2.8vw, 1.2rem)',
      color: '#3a1c0a', lineHeight: 1.9,
      letterSpacing: '.04em', whiteSpace: 'pre-line',
    }}>
      {chars.slice(0, revealed).map((ch, i) => (
        <motion.span key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .2 }}>
          {ch}
        </motion.span>
      ))}
    </p>
  )
}

export default function FinalScene() {
  const [step, setStep] = useState(0)
  const launchedRef = useRef(false)
  const count = Math.max(STAR_TILES, PHOTOS.length)
  const { positions, center } = getStarData(count)

  useEffect(() => {
    const t = setTimeout(() => setStep(1), count * 80 + 1200)
    return () => clearTimeout(t)
  }, [count])

  useEffect(() => {
    if (step !== 1 || launchedRef.current) return
    launchedRef.current = true
    const fire = (opts) => confetti({
      particleCount: 60, spread: 80,
      colors: ['#c1440e', '#e0733a', '#f0a868', '#e6b566', '#d4af37', '#fff'],
      ...opts,
    })
    setTimeout(() => { fire({ origin: { x: .25, y: .7 }, angle: 60 }); fire({ origin: { x: .75, y: .7 }, angle: 120 }) }, 300)
    setTimeout(() => { fire({ origin: { x: .25, y: .7 }, angle: 60 }); fire({ origin: { x: .75, y: .7 }, angle: 120 }) }, 1400)
    setTimeout(() => { fire({ origin: { x: .25, y: .7 }, angle: 60 }); fire({ origin: { x: .75, y: .7 }, angle: 120 }) }, 2600)
  }, [step])

  const photoSize = 52

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'fixed', inset: 0,
        background: 'linear-gradient(160deg, #fff6ec 0%, #ffe9d6 55%, #fff8f0 100%)',
        overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {[...Array(18)].map((_, i) => <Petal key={i} delay={i * .4} />)}

      {/* Conteneur de l'étoile */}
      <div style={{
        position: 'relative',
        width: 'min(82vw, 82vh)',
        height: 'min(82vw, 82vh)',
        flexShrink: 0,
      }}>
        {/* Photos sur le contour de l'étoile */}
        {positions.map((pos, i) => (
          <motion.div
            key={i}
            initial={{ left: '50%', top: '50%', opacity: 0, scale: 0.1, rotate: Math.random() * 60 - 30 }}
            animate={{
              left: `calc(${pos.x * 100}% - ${photoSize / 2}px)`,
              top: `calc(${pos.y * 100}% - ${photoSize / 2}px)`,
              opacity: 1, scale: 1,
              rotate: (Math.random() - 0.5) * 14,
            }}
            transition={{ delay: i * 0.08, duration: 0.85, type: 'spring', stiffness: 110, damping: 18 }}
            style={{
              position: 'absolute',
              width: `${photoSize}px`, height: `${photoSize}px`,
              borderRadius: '10px', overflow: 'hidden',
              border: '2.5px solid #fff',
              boxShadow: '0 4px 14px #c1440e33',
            }}
          >
            <img src={PHOTOS[i % PHOTOS.length].src} alt="" loading="lazy" decoding="async" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>
        ))}

        {/* Message — centré sur le centre géométrique de l'étoile
            On utilise left/top + margin négatif pour éviter le conflit
            entre transform de framer-motion et translate CSS */}
        <AnimatePresence>
          {step >= 1 && (
            // div wrapper : positionnement + centrage CSS (pas de conflit avec Framer Motion)
            <div style={{
              position: 'absolute',
              left: `${center.x * 100}%`,
              top: `${center.y * 100}%`,
              transform: 'translate(-50%, -50%)',
              width: 'min(260px, 52%)',
              zIndex: 10,
            }}>
              <motion.div
                initial={{ opacity: 0, scale: .75 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 120, damping: 16 }}
                style={{
                  background: 'rgba(255,255,255,0.003)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  borderRadius: '24px',
                  padding: 'clamp(10px, 2vw, 20px) clamp(14px, 3vw, 28px)',
                  border: '1.5px solid #f0c896',
                  boxShadow: '0 8px 48px #c1440e33',
                  textAlign: 'center',
                }}
              >
                <MessageText text={FINAL_MESSAGE} />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
