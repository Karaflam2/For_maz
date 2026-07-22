# ✨ Hommage à une amitié — Guide

## Structure
```
src/
  data/media.js        ← ✏️  TON SEUL FICHIER À MODIFIER
  components/
    MusicPlayer.jsx    ← musique qui joue tout au long
    QRScene.jsx        ← page QR code
    IntroVideo.jsx     ← vidéo d'intro
    AlbumScene.jsx     ← album photo/vidéo avec page-turn
    FinalScene.jsx     ← photos → étoile + message + confettis + pétales
```

Tout le texte modifiable (prénom, poème, couverture, message, légendes) vit
dans `src/data/media.js`. **Change le prénom à un seul endroit** (`FRIEND_NAME`)
et il se répercute sur la couverture, le message et la signature.

---

## 1. Ajouter tes médias

Place tes fichiers dans `/public/` :
```
public/
  music/chanson.mp3     ← ta chanson (voir les idées dans media.js)
  videos/intro.mp4      ← vidéo d'intro
  videos/moment1.mp4    ← vidéos de l'album
  photos/01.jpg         ← photos de l'album
  ...
```
Les chemins dans `media.js` sont relatifs : `/photos/01.jpg`.

> 🎵 **Musique** : dépose ton `.mp3` dans `public/music/chanson.mp3`.
> Idées amitié (culture anglophone) : *Count on Me* — Bruno Mars,
> *You've Got a Friend* — Carole King, *Lean on Me* — Bill Withers,
> *I'll Be There for You* — The Rembrandts.

---

## 2. Configurer `src/data/media.js`

Tout est là, commenté par section :
```js
export const FRIEND_NAME   = "Alex"            // ← change juste ça
export const COVER_TITLE   = `Pour toi, ${FRIEND_NAME}`
export const COVER_SUBTITLE = "Une amitié en or"
export const POEM_LINES    = [ "...", "..." ]  // le poème, ligne par ligne
export const FINAL_MESSAGE = `Merci d'être toi, ${FRIEND_NAME}...`
export const PHOTOS        = [ { id: 1, src: "/photos/01.jpg", caption: "..." } ]
export const ALBUM_VIDEOS  = [ { id: "v1", src: "/videos/moment1.mp4", insertAfterPhoto: 1, caption: "..." } ]
export const SITE_URL      = "https://ton-site.vercel.app"  // après déploiement
```

---

## 3. Lancer en local

```bash
npm install
npm run dev
```

---

## 4. Déployer sur Vercel

```bash
npm install -g vercel
vercel
```

Ou pousse sur GitHub et connecte le repo à [vercel.com](https://vercel.com) → déploiement automatique.

---

## 5. Générer le QR code final

Une fois le site déployé, mets à jour `SITE_URL` dans `media.js`, puis `npm run build` et redéploie.
Ouvre `qr-generator.html` pour télécharger le QR en PNG.

---

## Personnalisation rapide

| Ce que tu veux changer | Où |
|---|---|
| Le prénom (partout) | `media.js` → `FRIEND_NAME` |
| Couverture de l'album | `media.js` → `COVER_TITLE` / `COVER_SUBTITLE` |
| Poème d'intro | `media.js` → `POEM_LINES` |
| Message final | `media.js` → `FINAL_MESSAGE` |
| Photos / vidéos / légendes | `media.js` → `PHOTOS` / `ALBUM_VIDEOS` |
| Musique | `media.js` → `MUSIC_URL` + fichier dans `public/music/` |
| Couleurs (thème chaud) | `index.css` → variables `:root` + composants |
