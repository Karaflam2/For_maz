/**
 * Optimise les photos de public/photos/ pour un chargement rapide,
 * même sur connexion très instable :
 *   1. convertit chaque photo en WebP (≈70 % plus léger qu'un JPEG)
 *   2. génère un placeholder flou minuscule (LQIP) encodé en base64
 *      → écrit dans src/data/lqip.js (zéro requête réseau à l'affichage)
 *   3. supprime l'original une fois le WebP créé (déploiement plus léger)
 *
 * Lancer :  npm run optimize
 * Prérequis : npm install  (sharp est déjà dans devDependencies)
 *
 * Workflow : dépose de nouvelles photos (.jpg/.jpeg/.png) dans public/photos/,
 * relance `npm run optimize`, puis référence-les en .webp dans src/data/media.js.
 */

import sharp from 'sharp'
import { readdir, stat, unlink, writeFile } from 'fs/promises'
import { join, extname, basename } from 'path'

const PHOTOS_DIR    = './public/photos'
const PUBLIC_PREFIX = '/photos'
const LQIP_OUT      = './src/data/lqip.js'

const MAX_DIM    = 1080  // px — largeur/hauteur max (plein écran mobile net)
const QUALITY    = 78    // qualité WebP (0-100) — 78 = excellent compromis
const LQIP_WIDTH = 24    // px — largeur du micro-aperçu flou

const files = await readdir(PHOTOS_DIR)
const sources = files.filter(f =>
  ['.jpg', '.jpeg', '.png', '.webp'].includes(extname(f).toLowerCase()) &&
  !f.startsWith('__')
)

console.log(`\n📸 Optimisation de ${sources.length} image(s)...\n`)

const lqip = {}
let before = 0
let after  = 0

for (const file of sources) {
  const ext  = extname(file).toLowerCase()
  const name = basename(file, ext)
  const input = join(PHOTOS_DIR, file)

  const outName = `${name}.webp`
  const output  = join(PHOTOS_DIR, outName)
  const key     = `${PUBLIC_PREFIX}/${outName}`

  const { size: b } = await stat(input)
  before += b

  try {
    // Détermine les octets WebP finaux (source du LQIP dans tous les cas).
    let webpBytes
    if (ext === '.webp') {
      // Déjà en WebP : on ne recompresse pas (évite la perte de qualité).
      webpBytes = await sharp(input).toBuffer()
      after += b
    } else {
      webpBytes = await sharp(input)
        .rotate()  // applique l'orientation EXIF avant de perdre les métadonnées
        .resize(MAX_DIM, MAX_DIM, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 5 })
        .toBuffer()
      await writeFile(output, webpBytes)
      after += webpBytes.length
      await unlink(input)  // supprime l'original (jpg/png)
      console.log(`✓ ${file.padEnd(20)} → ${outName.padEnd(16)} ${(b/1024).toFixed(0).padStart(5)}KB → ${(webpBytes.length/1024).toFixed(0).padStart(5)}KB`)
    }

    // Placeholder flou (LQIP) — généré depuis le WebP, minuscule, intégré en base64
    const lqipBuf = await sharp(webpBytes)
      .resize(LQIP_WIDTH)
      .blur()
      .webp({ quality: 40 })
      .toBuffer()
    lqip[key] = `data:image/webp;base64,${lqipBuf.toString('base64')}`
  } catch (err) {
    console.error(`✗ ${file}: ${err.message}`)
  }
}

// Fichier généré consommé par le composant SmartImage
const banner = '// ⚙️  AUTO-GÉNÉRÉ par scripts/optimize-images.mjs — ne pas éditer à la main.\n'
  + '// Placeholders flous (base64) affichés instantanément le temps que la vraie photo arrive.\n\n'
await writeFile(LQIP_OUT, banner + `export const LQIP = ${JSON.stringify(lqip, null, 2)}\n`)

const saved = before - after
console.log(`\n✅ ${(before/1024/1024).toFixed(2)}MB → ${(after/1024/1024).toFixed(2)}MB  (−${(saved/1024/1024).toFixed(2)}MB)`)
console.log(`   ${Object.keys(lqip).length} placeholder(s) écrits dans ${LQIP_OUT}\n`)
