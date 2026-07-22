import { useEffect, useRef, useState } from 'react'
import { MUSIC_URL } from '../data/media'

export default function MusicPlayer() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0.25
    audio.loop = true
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().catch(() => {})
      setPlaying(true)
      setStarted(true)
    }
  }

  // Déclenche la lecture sur la première interaction réelle.
  // touchend (pas touchstart) est requis par iOS Safari comme geste utilisateur valide.
  // Pas de {once:true} : si le play() échoue, on réessaie à la prochaine interaction.
  // Le flag `pending` empêche le double-appel touchend+click sur le même tap.
  useEffect(() => {
    if (started) return
    const audio = audioRef.current
    if (!audio) return

    let pending = false
    const tryPlay = () => {
      if (pending) return
      pending = true
      audio.play()
        .then(() => { setPlaying(true); setStarted(true) })
        .catch(() => { pending = false })
      setTimeout(() => { pending = false }, 600)
    }

    document.addEventListener('touchend', tryPlay, { passive: true })
    document.addEventListener('click', tryPlay)
    return () => {
      document.removeEventListener('touchend', tryPlay)
      document.removeEventListener('click', tryPlay)
    }
  }, [started])

  return (
    <>
      <audio ref={audioRef} src={MUSIC_URL} preload="auto" />
      <button
        onClick={toggle}
        style={{
          position: 'fixed',
          top: '18px',
          right: '18px',
          zIndex: 9999,
          background: 'rgba(255,255,255,0.85)',
          border: '1.5px solid #f0c896',
          borderRadius: '50%',
          width: '44px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem',
          boxShadow: '0 2px 12px #c1440e22',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          transition: 'transform .2s',
        }}
        title={playing ? 'Mute the music' : 'Play the music'}
      >
        {playing ? '🔊' : '🔇'}
      </button>
    </>
  )
}
