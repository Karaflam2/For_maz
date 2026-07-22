import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PHOTOS, ALBUM_VIDEOS, POEM_LINES } from '../data/media'

const PHOTO_SRCS = PHOTOS.map(p => p.src)
const FIRST_VIDEO = ALBUM_VIDEOS[0]?.src
// Le déblocage de l'album ne dépend QUE des photos (légères).
// Les vidéos (lourdes) ne bloquent plus rien : elles se chargent à la volée
// quand on tourne la page → aucun blocage sur connexion instable.
const TOTAL = PHOTO_SRCS.length

// Garde les objets Image en vie pour éviter que le GC n'efface les pixels décodés
const _imgCache = {}

export default function PoemScene({ onReady }) {
  const [loaded, setLoaded] = useState(0)

  useEffect(() => {
    // Photos : decode() attend que les pixels soient prêts → zéro flash dans l'album
    PHOTO_SRCS.forEach(src => {
      const img = new Image()
      _imgCache[src] = img
      img.src = src
      img.decode()
        .then(() => setLoaded(n => n + 1))
        .catch(() => setLoaded(n => n + 1))
    })
    // Vidéos : NON bloquant. On amorce seulement la première en arrière-plan
    // pour fluidifier le premier passage ; les autres arrivent à la demande.
    if (FIRST_VIDEO) fetch(FIRST_VIDEO).catch(() => {})
  }, [])

  const progress = Math.min(100, Math.round((loaded / TOTAL) * 100))
  const ready = progress === 100

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      style={{
        position: 'fixed', inset: 0,
        background: 'linear-gradient(160deg, #fff6ec 0%, #ffe9d6 55%, #fff8f0 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px',
        overflow: 'hidden',
      }}
    >
      {/* Pétales dorés */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ y: ['0vh', '110vh'], rotate: [0, 360], opacity: [0, 0.5, 0] }}
          transition={{ duration: 8 + Math.random() * 6, delay: Math.random() * 6, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'fixed', top: '-40px',
            left: `${Math.random() * 100}%`,
            width: '12px', height: '12px',
            background: i % 2 === 0 ? '#f0a868' : '#e0733a',
            borderRadius: '50% 0 50% 0',
            pointerEvents: 'none', zIndex: 0,
          }}
        />
      ))}

      {/* Poème */}
      <div style={{ zIndex: 1, textAlign: 'center', maxWidth: '500px' }}>
        {POEM_LINES.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 1.4, duration: 1.1 }}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(.95rem, 2.8vw, 1.2rem)',
              color: line === ''
                ? 'transparent'
                : i === POEM_LINES.length - 1
                  ? '#c1440e'
                  : '#3a1c0a',
              lineHeight: line === '' ? '0.8' : '1.85',
              fontStyle: i < POEM_LINES.length - 1 ? 'italic' : 'normal',
              fontWeight: i === POEM_LINES.length - 1 ? '600' : '400',
              letterSpacing: '.04em',
              userSelect: 'none',
            }}
          >
            {line || '·'}
          </motion.p>
        ))}
      </div>

      {/* Barre de progression + bouton — apparaissent après le poème */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: POEM_LINES.length * 1.4 + 1 }}
        style={{
          position: 'absolute', bottom: '32px',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: '14px',
          width: '240px', zIndex: 1,
        }}
      >
        {/* Barre */}
        <div style={{
          width: '100%', height: '2px',
          background: '#f3d3b0', borderRadius: '2px', overflow: 'hidden',
        }}>
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut', duration: 0.5 }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #c1440e, #e0733a)',
              borderRadius: '2px',
            }}
          />
        </div>

        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '.72rem', color: '#c1440e88',
          letterSpacing: '.12em', textTransform: 'uppercase',
        }}>
          {ready ? '✦ Album ready' : `Loading… ${progress}%`}
        </p>

        {/* Bouton — actif uniquement quand tout est chargé */}
        <motion.button
          onClick={onReady}
          disabled={!ready}
          whileHover={ready ? { scale: 1.05 } : {}}
          whileTap={ready ? { scale: 0.97 } : {}}
          style={{
            background: ready
              ? 'linear-gradient(135deg, #c1440e, #e0733a)'
              : '#f3d3b055',
            border: 'none',
            color: ready ? '#fff' : '#c1440e66',
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1rem',
            letterSpacing: '.1em',
            padding: '11px 32px',
            borderRadius: '50px',
            cursor: ready ? 'pointer' : 'default',
            boxShadow: ready ? '0 4px 20px #c1440e44' : 'none',
            transition: 'all .4s',
          }}
        >
          {ready ? 'Discover the album ✦' : 'Just a moment…'}
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
