import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PHOTOS, ALBUM_VIDEOS, COVER_TITLE, COVER_SUBTITLE, COVER_BACK_LABEL } from '../data/media'
import SmartImage from './SmartImage'

function LandscapeGate() {
  const [portrait, setPortrait] = useState(() => window.innerHeight > window.innerWidth)
  useEffect(() => {
    const check = () => setPortrait(window.innerHeight > window.innerWidth)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  if (!portrait || Math.max(window.innerWidth, window.innerHeight) > 1024) return null
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: 'linear-gradient(160deg,#fff6ec,#ffe9d6)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '28px',
    }}>
      <div style={{ fontSize: '3.5rem', animation: 'spin-phone 2.2s ease-in-out infinite', display: 'inline-block' }}>📱</div>
      <div style={{ textAlign: 'center', padding: '0 40px' }}>
        <p style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.2rem', color: '#c1440e', letterSpacing: '.05em', marginBottom: '8px' }}>Turn your phone</p>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '.95rem', color: '#c1440eaa', fontStyle: 'italic' }}>for a better experience ↻</p>
      </div>
      <div style={{ fontSize: '1.4rem', opacity: .5 }}>✨</div>
    </div>
  )
}

function buildAlbumItems() {
  const items = [...PHOTOS.map(p => ({ ...p, type: 'photo' }))]
  ALBUM_VIDEOS.forEach(v => {
    const idx = items.findIndex(i => i.type === 'photo' && i.id === v.insertAfterPhoto)
    if (idx !== -1) items.splice(idx + 1, 0, { ...v, type: 'video' })
    else items.push({ ...v, type: 'video' })
  })
  return items
}

function buildSpreads(items) {
  const spreads = [{ type: 'cover' }]
  for (let i = 0; i < items.length; i++) {
    // photo sur la droite, gauche vide (verso de la page précédente)
    spreads.push({ type: 'content', left: null, right: items[i] })
  }
  spreads.push({ type: 'backcover' })
  return spreads
}

const ITEMS = buildAlbumItems()
const SPREADS = buildSpreads(ITEMS)

function PageMedia({ item }) {
  const videoRef = useRef(null)


  if (!item) return (
    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#ffe9d6,#fff8f0)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: '#f0c896', fontSize: '1.8rem' }}>✦</span>
      
    </div>
  )
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {item.type === 'video'
        ? <video ref={videoRef} src={item.src} autoPlay loop playsInline muted preload="metadata" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        : <SmartImage src={item.src} alt={item.caption || ''} />
      }
      {item.caption && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '26px 12px 10px',
          background: 'linear-gradient(to top, rgba(58,28,10,.72) 0%, transparent 100%)',
          color: '#fff', fontFamily: "'Cormorant Garamond',serif",
          fontStyle: 'italic', fontSize: 'clamp(.78rem,1.8vw,.95rem)',
          letterSpacing: '.05em', textShadow: '0 1px 6px #0006',
        }}>{item.caption}</div>
      )}
    </div>
  )
}

function RuledLines() {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2,
      backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 27px, rgba(193,68,14,0.07) 28px)',
    }} />
  )
}

function renderHalf(sp, side) {
  if (!sp) return null
  if (sp.type === 'cover') {
    const isRight = side === 'right'
    return (
      <div style={{
        width: '100%', height: '100%',
        background: isRight
          ? 'linear-gradient(150deg,#9c3d1a 0%,#c1440e 60%,#e0733a 100%)'
          : 'linear-gradient(150deg,#c1440e 0%,#9c3d1a 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '14px',
        padding: '0 18px',
      }}>
        {isRight ? (
          <>
            <div style={{ fontFamily: "'Playfair Display',serif", color: '#fff', fontSize: 'clamp(1.2rem,2.8vw,1.9rem)', textAlign: 'center', textShadow: '0 2px 14px #0005', lineHeight: 1.2 }}>{COVER_TITLE}</div>
            <div style={{ fontSize: '1.6rem' }}>✨</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", color: '#ffe0c2cc', fontSize: '.8rem', letterSpacing: '.18em', textTransform: 'uppercase', textAlign: 'center' }}>Turn the page →</div>
          </>
        ) : (
          <>
            <div style={{ color: '#ffe0c266', fontSize: '1.8rem' }}>✦</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", color: '#ffe0c288', fontSize: '.85rem', letterSpacing: '.18em', textTransform: 'uppercase', textAlign: 'center' }}>{COVER_SUBTITLE}</div>
          </>
        )}
      </div>
    )
  }
  if (sp.type === 'backcover') {
    return (
      <div style={{
        width: '100%', height: '100%',
        background: side === 'left'
          ? 'linear-gradient(150deg,#c1440e 0%,#9c3d1a 100%)'
          : 'linear-gradient(150deg,#9c3d1a 0%,#c1440e 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px',
        padding: '0 18px',
      }}>
        {side === 'left' && (
          <>
            <motion.div animate={{ scale: [1,1.15,1] }} transition={{ duration: 1.8, repeat: Infinity }}>
              <span style={{ fontSize: '2.8rem' }}>✨</span>
            </motion.div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", color: '#ffe0c2aa', fontSize: '.8rem', letterSpacing: '.16em', textTransform: 'uppercase', textAlign: 'center' }}>{COVER_BACK_LABEL}</div>
          </>
        )}
      </div>
    )
  }
  return <PageMedia item={side === 'left' ? sp.left : sp.right} />
}

export default function AlbumScene({ onFinish }) {
  const [currentSpread, setCurrentSpread] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animDir, setAnimDir] = useState(null)
  const [animSpread, setAnimSpread] = useState(null)

  const isFirst = currentSpread === 0
  const isLast = currentSpread === SPREADS.length - 1

  const turnPage = (dir) => {
    if (isAnimating) return
    const nextIdx = dir === 'next' ? currentSpread + 1 : currentSpread - 1
    if (nextIdx < 0 || nextIdx >= SPREADS.length) return
    setAnimDir(dir)
    setAnimSpread(currentSpread)
    setCurrentSpread(nextIdx)   // mis à jour immédiatement → pages statiques déjà correctes
    setIsAnimating(true)
  }

  const onAnimDone = () => {
    setIsAnimating(false)
    setAnimDir(null)
    setAnimSpread(null)
    if (currentSpread >= SPREADS.length - 1) setTimeout(onFinish, 500)
  }

  // Précharge les images des spreads adjacents pour éviter la latence au changement de page
  useEffect(() => {
    [-1, 1].forEach(offset => {
      const idx = currentSpread + offset
      if (idx < 0 || idx >= SPREADS.length) return
      const sp = SPREADS[idx]
      ;[sp?.left, sp?.right].forEach(item => {
        if (item?.type === 'photo' && item.src) new Image().src = item.src
      })
    })
  }, [currentSpread])

  const spread = SPREADS[currentSpread]          // toujours la destination
  const oldSpread = animSpread !== null ? SPREADS[animSpread] : null  // source (pour la face avant)

  const bookW = 'min(90vw, 700px)'
  const bookH = 'min(90vh, 520px)'

  return (
    <>
    <LandscapeGate />
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(ellipse at 50% 40%,#fdf1e2 0%,#ffe9d6 55%,#f0dcc4 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 0, padding: '10px 20px',
        perspective: '1600px',
      }}
    >
      {/* BOOK */}
      <div style={{
        position: 'relative', width: bookW, height: bookH,
        transformStyle: 'preserve-3d',
        filter: 'drop-shadow(0 28px 56px rgba(193,68,14,.22)) drop-shadow(0 6px 18px rgba(0,0,0,.13))',
      }}>

        {/* Counter — overlay au-dessus du livre, hors du flux flex */}
        <div style={{
          position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)',
          fontFamily: "'Cormorant Garamond',serif", fontSize: '.72rem', color: '#c1440e88',
          letterSpacing: '.18em', textTransform: 'uppercase', whiteSpace: 'nowrap', zIndex: 10,
          pointerEvents: 'none',
        }}>
          {currentSpread === 0 ? 'Cover' : currentSpread >= SPREADS.length - 1 ? 'The End' : `${currentSpread} / ${SPREADS.length - 2}`}
        </div>

        {/* LEFT static page — toujours la destination (spread est déjà mis à jour) */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: 0, width: '50%',
          borderRadius: '8px 0 0 8px', overflow: 'hidden',
          background: '#fff', borderRight: '1px solid #e0c0a0',
        }}>
          {renderHalf(spread, 'left')}
          <RuledLines />
          <p></p>
        </div>

        {/* RIGHT static page — toujours la destination (spread est déjà mis à jour) */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, right: 0, width: '50%',
          borderRadius: '0 8px 8px 0', overflow: 'hidden',
          background: '#fffaf8', borderLeft: '1px solid #e0c0a0',
        }}>
          {renderHalf(spread, 'right')}
          <RuledLines />
        </div>

        {/* SPINE */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: '50%',
          width: '6px', transform: 'translateX(-50%)',
          background: 'linear-gradient(to right,#8a3a1555,#c1440e33,#8a3a1555)',
          zIndex: 6, pointerEvents: 'none',
        }} />

        {/* TURNING PAGE */}
        <AnimatePresence>
          {isAnimating && (
            <motion.div
              key="turning"
              initial={{ rotateY: 0 }}
              animate={{ rotateY: animDir === 'next' ? -180 : 180 }}
              transition={{ duration: 0.7, ease: [0.33, 1, 0.68, 1] }}
              onAnimationComplete={onAnimDone}
              style={{
                position: 'absolute', top: 0, bottom: 0,
                [animDir === 'next' ? 'right' : 'left']: 0,
                width: '50%',
                transformOrigin: animDir === 'next' ? 'left center' : 'right center',
                transformStyle: 'preserve-3d',
                zIndex: 20,
                borderRadius: animDir === 'next' ? '0 8px 8px 0' : '8px 0 0 8px',
              }}
            >
              {/* FRONT face — l'ancienne page (avant le tour) */}
              <div style={{
                position: 'absolute', inset: 0,
                backfaceVisibility: 'hidden', overflow: 'hidden',
                borderRadius: 'inherit', background: '#fffaf8',
              }}>
                {animDir === 'next'
                  ? renderHalf(oldSpread, 'right')
                  : renderHalf(oldSpread, 'left')
                }
                <RuledLines />
                <div style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  background: animDir === 'next'
                    ? 'linear-gradient(to right,rgba(255,255,255,.45) 0%,rgba(255,255,255,0) 35%)'
                    : 'linear-gradient(to left,rgba(255,255,255,.45) 0%,rgba(255,255,255,0) 35%)',
                }} />
              </div>

              {/* BACK face — what's revealed as page turns */}
              <div style={{
                position: 'absolute', inset: 0,
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                overflow: 'hidden', background: '#fff8f5',
                borderRadius: 'inherit',
              }}>
                {animDir === 'next'
                  ? renderHalf(spread, 'left')
                  : renderHalf(spread, 'right')
                }
                <RuledLines />
                <div style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  background: animDir === 'next'
                    ? 'linear-gradient(to left,rgba(0,0,0,.09) 0%,rgba(0,0,0,0) 35%)'
                    : 'linear-gradient(to right,rgba(0,0,0,.09) 0%,rgba(0,0,0,0) 35%)',
                }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CORNER HINTS — gauche : page précédente, droite : page suivante ou message final */}
        {!isFirst && !isAnimating && (
          <div
            onClick={() => turnPage('prev')}
            onMouseEnter={e => Object.assign(e.currentTarget.style, { opacity:'1', width:'64px', height:'64px' })}
            onMouseLeave={e => Object.assign(e.currentTarget.style, { opacity:'.5', width:'48px', height:'48px' })}
            style={{
              position: 'absolute', bottom: 0, left: 0,
              width: '48px', height: '48px', cursor: 'pointer', zIndex: 25,
              background: 'linear-gradient(315deg,#f0a868 0%,transparent 65%)',
              borderRadius: '0 48px 0 8px', opacity: '.5', transition: 'all .2s',
              display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start',
              padding: '5px 0 5px 6px',
            }}
          >
            <span style={{ fontSize: '.6rem', color: '#c1440e', fontFamily: "'Cormorant Garamond',serif", lineHeight: 1, pointerEvents: 'none' }}>←</span>
          </div>
        )}
        {!isAnimating && (
          <div
            onClick={() => isLast ? onFinish() : turnPage('next')}
            onMouseEnter={e => Object.assign(e.currentTarget.style, { opacity:'1', width:'64px', height:'64px' })}
            onMouseLeave={e => Object.assign(e.currentTarget.style, { opacity:'.5', width:'48px', height:'48px' })}
            style={{
              position: 'absolute', bottom: 0, right: 0,
              width: '48px', height: '48px', cursor: 'pointer', zIndex: 25,
              background: 'linear-gradient(225deg,#f0a868 0%,transparent 65%)',
              borderRadius: '48px 0 8px 0', opacity: '.5', transition: 'all .2s',
            }}
          />
        )}
      </div>
    </motion.div>
    </>
  )
}