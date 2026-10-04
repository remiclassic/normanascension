# Norman Ascension — website

The public site for Norman Ascension, an online multiplayer medieval life and dynasty RPG set in Normandy, 1066. Published with GitHub Pages at https://normanascension.com/.

Plain HTML, CSS and JavaScript; no build step.

- `index.html`, `styles.css`, `main.js` — the page.
- `assets/img`, `assets/video` — unretouched in-engine captures.
- `tools/build-assets.py` — regenerates `assets/img` from the capture masters (which live outside this repo).

## Turning on the Steam wishlist button

The Steam store page is in review. When it is public, set `STEAM_LIVE = true` at the top of `main.js`; every wishlist button then opens the store page.

© Strategic Sloth LLC.
