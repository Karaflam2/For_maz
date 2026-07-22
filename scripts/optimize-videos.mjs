/**
 * Compresse les vidéos de public/videos/ pour un chargement rapide,
 * même sur connexion instable :
 *   - ré-encode H.264 (CRF), résolution plafonnée, faststart (streaming web)
 *   - RETIRE l'audio des clips d'album (ils sont muets dans le site → poids mort)
 *   - garde l'audio uniquement sur intro.mp4 (seule vidéo jouée avec son)
 *   - garde le résultat seulement s'il est plus petit que l'original
 *
 * Lancer :  npm run optimize:videos
 * Prérequis : ffmpeg installé (winget install ffmpeg / dans le PATH)
 */

import { readdir, stat, rename, unlink, access } from 'fs/promises'
import { join, extname } from 'path'
import { execSync } from 'child_process'

// Résoudre ffmpeg : PATH d'abord, puis installation WinGet connue
async function findFfmpeg() {
  try { execSync('ffmpeg -version', { stdio: 'ignore' }); return 'ffmpeg' } catch {}
  const winget = join(
    process.env.LOCALAPPDATA,
    'Microsoft', 'WinGet', 'Packages',
    'Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe',
    'ffmpeg-8.1.1-full_build', 'bin', 'ffmpeg.exe'
  )
  try { await access(winget); return `"${winget}"` } catch {}
  throw new Error('ffmpeg introuvable. Redémarre le terminal ou réinstalle ffmpeg.')
}
const FFMPEG = await findFfmpeg()

const VIDEOS_DIR = './public/videos'

// Seule vidéo lue AVEC son sur le site → on lui garde l'audio.
const KEEP_AUDIO = new Set(['intro.mp4'])

// CRF : qualité (18 = quasi-lossless, 28 = bon compromis). Les clips d'album
// s'affichent dans une petite page → on peut pousser un peu la compression.
const CRF_INTRO = 24
const CRF_ALBUM = 28
const MAX_RES   = 720   // px sur la plus grande dimension

const files = await readdir(VIDEOS_DIR)
const videos = files.filter(f => extname(f).toLowerCase() === '.mp4' && !f.startsWith('__tmp__'))

let totalBefore = 0
let totalAfter  = 0

console.log(`\n🎬 Optimisation de ${videos.length} vidéos...\n`)

for (const file of videos) {
  const input = join(VIDEOS_DIR, file)
  const tmp   = join(VIDEOS_DIR, `__tmp__${file}`)

  const { size: before } = await stat(input)
  totalBefore += before

  const keepAudio = KEEP_AUDIO.has(file)
  const crf = keepAudio ? CRF_INTRO : CRF_ALBUM
  const audioArgs = keepAudio ? '-c:a aac -b:a 96k' : '-an'

  console.log(`⏳ ${file} (${(before / 1024 / 1024).toFixed(1)}MB)${keepAudio ? '' : ' [audio retiré]'}...`)

  try {
    // Redimensionne la plus grande dimension à MAX_RES max, dimensions paires (-2)
    const scaleFilter = `scale='if(gt(iw,ih),min(${MAX_RES},iw),-2)':'if(gt(iw,ih),-2,min(${MAX_RES},ih))'`

    execSync(
      `${FFMPEG} -y -i "${input}" -c:v libx264 -crf ${crf} -preset slow -vf "${scaleFilter}" ${audioArgs} -movflags +faststart "${tmp}"`,
      { stdio: 'inherit' }
    )

    const { size: after } = await stat(tmp)

    // On ne garde le résultat que s'il est réellement plus petit
    if (after < before) {
      await unlink(input)
      await rename(tmp, input)
      totalAfter += after
      const pct = Math.round((1 - after / before) * 100)
      console.log(`✓ ${file}: ${(before/1024/1024).toFixed(1)}MB → ${(after/1024/1024).toFixed(1)}MB  (-${pct}%)\n`)
    } else {
      await unlink(tmp)
      totalAfter += before
      console.log(`= ${file}: déjà optimal (${(before/1024/1024).toFixed(1)}MB), conservé tel quel\n`)
    }
  } catch (err) {
    console.error(`✗ ${file}: erreur ffmpeg\n`)
    try { await unlink(tmp) } catch {}
    totalAfter += before
  }
}

const saved = totalBefore - totalAfter
console.log(`\n✅ Total : ${(totalBefore/1024/1024).toFixed(1)}MB → ${(totalAfter/1024/1024).toFixed(1)}MB  (économie : ${(saved/1024/1024).toFixed(1)}MB)\n`)
