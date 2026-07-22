// ═════════════════════════════════════════════════
//  ✦  THE ONLY FILE YOU NEED TO EDIT  ✦
//  Change something HERE → it updates everywhere.
// ═════════════════════════════════════════════════


// ─────────────────────────────────────────────────
//  1.  THE PERSON
//  Change just this name: cover, message and
//  signature all update automatically.
// ─────────────────────────────────────────────────
export const FRIEND_NAME = "Maz"


// ─────────────────────────────────────────────────
//  2.  THE ALBUM COVER
// ─────────────────────────────────────────────────
export const COVER_TITLE      = `For You, ${FRIEND_NAME}`
export const COVER_SUBTITLE   = "A friendship worth its weight in gold"
export const COVER_BACK_LABEL = "A precious friendship"


// ─────────────────────────────────────────────────
//  3.  THE POEM  (appears line by line at the start)
//  Use "" for an empty line / a breathing pause.
// ─────────────────────────────────────────────────
export const POEM_LINES = [
  `There are people we meet, and people we keep,`,
  `you, ${FRIEND_NAME}, are one the world made to be kept.`,
  `Partner in laughter as much as in grey days,`,
  `a steady presence when all else gave way.`,
  `We don't choose our family, so they say,`,
  `but friendship we do — and I choose you, always.`,
  `Thank you for staying, true, funny, and real,`,
  `for all we've lived, and all still to reveal.`,
  `To you, my golden friend.`,
]


// ─────────────────────────────────────────────────
//  4.  THE FINAL MESSAGE  (at the center of the photo star)
// ─────────────────────────────────────────────────
export const FINAL_MESSAGE = `Thank you for being you, ${FRIEND_NAME}.\nA friendship like ours\nis simply irreplaceable. ✨`


// ─────────────────────────────────────────────────
//  5.  THE MUSIC  (plays throughout the site)
//  Drop your file here:  public/music/chanson-v2.mp3
//  (renaming the file forces browsers to fetch the new track)
//  Friendship song ideas (English-language):
//    • "Count on Me" — Bruno Mars
//    • "You've Got a Friend" — Carole King
//    • "Lean on Me" — Bill Withers
//    • "I'll Be There for You" — The Rembrandts
// ─────────────────────────────────────────────────
export const MUSIC_URL = "/music/chanson-v2.mp3"


// ─────────────────────────────────────────────────
//  6.  THE INTRO VIDEO  (before the album)
// ─────────────────────────────────────────────────
export const INTRO_VIDEO_URL = "/videos/intro.mp4"


// ─────────────────────────────────────────────────
//  7.  THE PHOTOS  (in order of appearance)
// ─────────────────────────────────────────────────
export const PHOTOS = [
  { id: 1, src: "/photos/01.webp", caption: "Our best memories..." },
  { id: 2, src: "/photos/02.webp", caption: "Always up to something..." },
  { id: 3, src: "/photos/03.webp", caption: "A rare kind of bond..." },
  { id: 4, src: "/photos/04.webp", caption: "One for the books..." },
]


// ─────────────────────────────────────────────────
//  8.  THE ALBUM VIDEOS  (inserted between photos)
//  insertAfterPhoto = id of the photo to insert it after
// ─────────────────────────────────────────────────
export const ALBUM_VIDEOS = [
  { id: "v1", src: "/videos/moment1.mp4", insertAfterPhoto: 1, caption: "That moment..." },
  { id: "v2", src: "/videos/moment2.mp4", insertAfterPhoto: 2, caption: "Solving the world's problems..." },
  { id: "v3", src: "/videos/moment3.mp4", insertAfterPhoto: 3, caption: "Just us..." },
  { id: "v4", src: "/videos/moment4.mp4", insertAfterPhoto: 1, caption: "Laughing till it hurts..." },
  { id: "v5", src: "/videos/moment5.mp4", insertAfterPhoto: 4, caption: "Good times..." },
  { id: "v6", src: "/videos/moment6.mp4", insertAfterPhoto: 2, caption: "Never a dull moment..." },
]


// ─────────────────────────────────────────────────
//  9.  THE DEPLOYED SITE URL  (for the QR code)
// ─────────────────────────────────────────────────
export const SITE_URL = "https://maz-sooty.vercel.app"
