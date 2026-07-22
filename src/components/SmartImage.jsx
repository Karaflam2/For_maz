import { useState } from 'react'
import { LQIP } from '../data/lqip'

/**
 * Image robuste pour connexion instable :
 *  - affiche INSTANTANÉMENT un placeholder flou (base64, zéro requête réseau)
 *  - charge la vraie photo par-dessus et l'affiche en fondu une fois arrivée
 *  - si la photo échoue, le flou reste visible (jamais de carré vide)
 *
 * Remplit son conteneur parent (qui doit être en position relative).
 */
export default function SmartImage({ src, alt = '', imgStyle }) {
  const [loaded, setLoaded] = useState(false)
  const placeholder = LQIP[src]

  const fill = {
    position: 'absolute', inset: 0,
    width: '100%', height: '100%',
    objectFit: 'cover', display: 'block',
  }

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#f0dcc4' }}>
      {placeholder && (
        <img
          src={placeholder}
          alt=""
          aria-hidden="true"
          style={{
            ...fill,
            filter: 'blur(14px)',
            transform: 'scale(1.15)',           // masque les bords flous
            opacity: loaded ? 0 : 1,
            transition: 'opacity .6s ease',
          }}
        />
      )}
      <img
        src={src}
        alt={alt}
        loading="eager"
        decoding="async"
        onLoad={() => setLoaded(true)}
        style={{
          ...fill,
          opacity: loaded ? 1 : 0,
          transition: 'opacity .6s ease',
          ...imgStyle,
        }}
      />
    </div>
  )
}
