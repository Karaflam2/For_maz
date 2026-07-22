import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import MusicPlayer from './components/MusicPlayer'
import IntroVideo from './components/IntroVideo'
import PoemScene from './components/PoemScene'
import AlbumScene from './components/AlbumScene'
import FinalScene from './components/FinalScene'

export default function App() {
  const [scene, setScene] = useState('intro')

  return (
    <>
      <MusicPlayer />
      <AnimatePresence mode="wait">
        {scene === 'intro' && (
          <IntroVideo key="intro" onEnd={() => setScene('poem')} />
        )}
        {scene === 'poem' && (
          <PoemScene key="poem" onReady={() => setScene('album')} />
        )}
        {scene === 'album' && (
          <AlbumScene key="album" onFinish={() => setScene('final')} />
        )}
        {scene === 'final' && (
          <FinalScene key="final" />
        )}
      </AnimatePresence>
    </>
  )
}
