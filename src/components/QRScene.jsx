import { QRCodeSVG } from 'qrcode.react'
import { motion } from 'framer-motion'
import { SITE_URL } from '../data/media'

const HEART_LOGO = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">' +
  '<path d="M50,82C50,82 6,54 6,26C6,12 16,4 28,4C38,4 46,10 50,18C54,10 62,4 72,4C84,4 94,12 94,26C94,54 50,82 50,82Z" fill="#c1440e"/>' +
  '</svg>'
)}`

// Cœur "carte à jouer" (symbole ♥) — les côtés sont droits et larges,
// ce qui garantit que les 3 marqueurs de coin du QR restent entièrement à l'intérieur
const S = 300
const QR = 210
const OFF = (S - QR) / 2
const HEART = `M150,65 C150,35 108,12 78,12 C42,12 18,38 18,72 L18,232 C18,260 85,282 150,282 C215,282 282,260 282,232 L282,72 C282,38 258,12 222,12 C192,12 150,35 150,65Z`

export default function QRScene({ onEnter }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(160deg, #fff6ec 0%, #ffe9d6 60%, #fff8f0 100%)',
        gap: '28px',
      }}
    >
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ y: ['0vh', '110vh'], x: [0, (Math.random() - 0.5) * 120], rotate: [0, 360], opacity: [0, 0.7, 0] }}
          transition={{ duration: 6 + Math.random() * 6, delay: Math.random() * 5, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'fixed', top: '-40px', left: `${Math.random() * 100}%`,
            width: '14px', height: '14px',
            background: i % 2 === 0 ? '#f0a868' : '#e0733a',
            borderRadius: '50% 0 50% 0', transform: 'rotate(45deg)',
            pointerEvents: 'none', zIndex: 0,
          }}
        />
      ))}

      <motion.p
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .4 }}
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(1rem, 3vw, 1.3rem)',
          color: '#9c3d1a', letterSpacing: '.2em', textTransform: 'uppercase', zIndex: 1,
        }}
      >
        Scan to open
      </motion.p>

      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: .2, type: 'spring', stiffness: 120 }}
        onClick={onEnter}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        style={{ position: 'relative', cursor: 'pointer', zIndex: 1, width: S, height: S }}
      >
        {/* Fond blanc en forme de cœur */}
        <svg width={S} height={S} style={{ position: 'absolute', top: 0, left: 0, filter: 'drop-shadow(0 10px 40px #c1440e44)' }}>
          <path d={HEART} fill="white" />
        </svg>

        {/* QR code — les 3 marqueurs de coin sont à l'intérieur du cœur */}
        <div style={{ position: 'absolute', top: OFF, left: OFF }}>
          <QRCodeSVG
            value={SITE_URL}
            size={QR}
            bgColor="transparent"
            fgColor="#c1440e"
            level="H"
            imageSettings={{ src: HEART_LOGO, height: 44, width: 44, excavate: true }}
          />
        </div>

        {/* Bordure rose du cœur */}
        <svg width={S} height={S} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
          <path d={HEART} fill="none" stroke="#c1440e" strokeWidth="2.5" opacity="0.6" />
        </svg>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .8 }}
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '.95rem', color: '#c1440eaa', fontStyle: 'italic', zIndex: 1,
        }}
      >
        or click to enter ✦
      </motion.p>
    </motion.div>
  )
}
