import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { INTRO_VIDEO_URL } from '../data/media'

export default function IntroVideo({ onEnd }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.addEventListener('ended', onEnd)
    return () => v.removeEventListener('ended', onEnd)
  }, [onEnd])

  const handlePlay = () => {
    videoRef.current?.play().catch(() => {})
    setPlaying(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0,
        background: '#140a02',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '24px',
        zIndex: 10,
      }}
    >
      <motion.div
        initial={{ scale: .9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: .3 }}
        style={{
          width: 'min(90vw, 840px)',
          aspectRatio: '9/16',
          height: 'min(calc(min(90vw, 840px) * 16 / 9), 85vh)',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '2px solid #c1440e55',
          boxShadow: '0 0 80px #c1440e33',
          background: '#1f0f02',
          position: 'relative',
        }}
      >
        <video
          ref={videoRef}
          onClick={handlePlay}
          src={INTRO_VIDEO_URL}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          playsInline
          preload="auto"
          muted={false}
        />

        {!playing && <div onClick={handlePlay} style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 5,
        }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'rgba(193,68,14,0.75)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.6rem',
          }}>▶</div>
        </div> }
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        onClick={onEnd}
        style={{
          background: 'transparent',
          border: '1.5px solid #f0c896',
          color: '#f0c896',
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '1rem',
          padding: '10px 36px',
          borderRadius: '50px',
          letterSpacing: '.12em',
          transition: 'all .3s',
        }}
        onMouseEnter={e => { e.target.style.background = '#c1440e'; e.target.style.borderColor = '#c1440e' }}
        onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.borderColor = '#f0c896' }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: .97 }}
      >
        Skip →
      </motion.button>
    </motion.div>
  )
}
