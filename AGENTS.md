# AGENTS.md: working on Villa Villekulla

Context for AI agents and new contributors. The README covers what the game is and how to play. This file covers what isn't obvious from reading the code. The general recipe (shared with *Hello, IT*, https://github.com/w3nl/it) is in [docs/escape-room-blueprint.md](docs/escape-room-blueprint.md); this file is this project's own notes.

> **Spoilers:** the puzzle solutions are listed below. You'll need them to test changes.

## What this is

*Villa Villekulla* is a point-and-click escape room, an unofficial fan homage to Astrid Lindgren's *Pippi Longstocking* books (Swedish original: *Pippi Långstrump*; Dutch: *Pippi Langkous*, *Villa Kakelbont*). You're a kid visiting Pippi's house. Every puzzle teaches one real idea for children, wrapped in a Pippi joke: in Chapter 1 (Mr Nilsson has locked you in) mirror writing, sums, the fire triangle, doing steps in the right order, signal flags and feeding a horse safely; in Chapter 2 (burglars in the night) how batteries go in a torch, shadows, finding the North Star, Morse code and a balance scale.

- 2 chapters so far: the kitchen (6 puzzles) and the bedroom at night (6 puzzles). Plain HTML, CSS, JavaScript and SVG: **no build step, no framework, no runtime dependencies** (only Google Fonts).
- Hosted as a static site (GitHub Pages), installable as a PWA, playable offline.
- Three languages: **UK English** (in the code), **Dutch** (`lang/nl/*.txt`) and **Swedish** (`lang/sv/*.txt`). The language button cycles EN → NL → SV.
- **It must be served over http(s)** (`npm start`, http://127.0.0.1:4173); `file://` shows a "needs a web server" message.
- `node_modules/` and `package.json` exist **only for the tests and the local server**.
- Audience: children (about 8–12) and families. Keep words simple, puzzles fair, and nothing scary.

## Repository map

| Path | What |
|---|---|
| `index.html` | Page shell: header, stage, title and end screens, inventory ("Pockets"), close-up modal |
| `css/*.css` | Loaded in this order: `base` (tokens on `:root`), `chapter1`, `chapter2`, `phone`, `animations` (last: motion kill-switch) |
| `scenes/kitchen.svg`, `scenes/bedroom.svg` | The rooms: Chapter 1 (ids prefixed `vk`/`vk-`) and Chapter 2 (ids prefixed `br`/`br-`); hotspot rects are last |
| `js/boot.js` | Start-up: fetches the scenes, loads the scripts in order; holds `GAME_VERSION` |
| `js/i18n.js` | Languages: `LANG`, `tx()`, `setLang()`, `onLangChange()`, the translating observer (copied from Hello, IT) |
| `lang/nl/*.txt`, `lang/sv/*.txt` | Dutch and Swedish: `ui`, `ch1`, `ch2`, `hints`, `scenes` (the same files in every language) |
| `js/core.js` | Engine: state `S`, `save`/`load`, sound, `say()`, portraits (`faceFor`), `ITEMS`, inventory, `applyVisuals()`, hotspot input, `openModal()`, `nope()` |
| `js/chapter1.js` | Chapter 1: signal flags (`FLAG_SHAPES`, `flagSVG()`), `buildKitchen()`, `applyKitchen()`, `H` (the hotspot table), every close-up, `intro1()`, `win1()` |
| `js/chapter2.js` | Chapter 2: `UNLOCK2`/`unlocked2()`/`setUnlocked2()`, its `ITEMS` (batteries, torch, feather), `MORSE`, `tickleWord()`, `applyBedroom()`, hotspots, close-ups (`openTorch2`, `openShadow`, `openSpyCard`, `openSky`, `openMorse`, `openScale`), `tickle()`, `intro2()`, `startCh2()`, `win2()` |
| `js/items.js` | `useItem(item, hotspot)` |
| `js/hints.js` | `HINTS` and `stage1()`, `stage2()`, `stage_()` |
| `js/ambience.js` | Generated room sound (`ambKey()`, `SOUNDSCAPES.kitchen`; crackling fire once `S.f.fire`) |
| `js/voice.js` | Optional spoken dialogue; `VOICE_STYLE` per speaker |
| `js/app.js` | Chapters (`LAST_CH`, `chapterDone`, `nextChapter`, `exitLabels`, `refreshMenu`), chapter end (`CH_END`, `showWin`), scores, ranks, achievements (`ACH`), buttons, timer, title menu, PWA install, `start()` |
| `portraits/*.svg` | `you`, `pippi`, `nilsson`, `horse`, `spunk`, `tommy`, `annika`, `karlsson`, `bloom` (120×120) |
| `sw.js`, `manifest.webmanifest`, `icons/` | The installable, offline app. `icon.svg` is the source; PNGs are rendered from it |
| `tests/` | Playwright: `chapter1`, `chapter2`, `progress`, `language`, `pwa`, `phone`; helpers in `helpers.js`; `serve.js` is the local server |
| `tools/i18n-check.js` | For every language in `lang/`: lists English text without a translation, fails on stale keys and conflicts (`--lang=sv` for one) |
| `.github/` | CI (`tests.yml`) and the idea → plan → PR agent workflows (see `docs/agent-workflow.md`) |

## How the code fits together

- **Classic scripts in one shared global scope**, loaded in order by `boot.js`. Names must be unique across files; chapter-specific names end in the chapter number (`stage1`, `intro1`, `win1`) or say what they are (`openPancake`). Avoid browser globals.
- The scene SVG is in the page before any script runs; `core.js` wires up every `.hit` when it loads. `buildKitchen()` (called from `start()`) draws the flag string, the flag chart and the bureau drawers; `applyKitchen()` shows the state (fire, key, note, padlocks, horse, door light).
- **Hotspot ids** share one namespace across all rooms. Chapter 1 uses: `flags stove sign wood pantry window spunk mirror chart nilsson suitcase bureau horse door note homework bowl chest`. Chapter 2 uses: `card2 feet pippi2 case2 clock2 torch spunk2 sky nilsson2 scale dresser stones hat wardrobe vdoor`.
- **Chapters:** `S.ch` and `S.scene` (`kitchen` or `bedroom`) pick the room. Finishing a chapter sets its `outN` flag; `exitLabels()` then labels the kitchen's front door "on to Chapter 2", and clicking it (or **Continue to Chapter 2** on the end screen) runs `startCh2()`. The unlock is saved as `pippi-villa-v1-ch2`, which shows the chapter buttons on the title screen. `LAST_CH` in `app.js` is the newest chapter.
- **SVG ids are global**: prefix new ones per room. Flags use generated clip-path ids (`fclipN`).

### State and saving
- `S` is the whole save: `{ v:1, ch, scene, f:{}, inv:[], hl:{}, hints, t, ach:{}, started }`, saved to `localStorage['pippi-villa-v1']` after every action.
- Chapter 1 fields: `S.drw` (opened little drawers), `S.lockd` (bureau padlock digits), `S.stv` (`{wood, vent}` in the stove), `S.pan` (pancake steps done), `S.cl` (sea chest letter wheels).
- Chapter 2 fields: `S.tb` (battery directions, 1 = + towards the bulb), `S.shd` (`{d}`: Mr Nilsson's distance from the torch), `S.mrs` (`{seq}`: the Morse you're typing), `S.stn` (stones on the scale). Close-ups stay as the player left them.
- Other keys: `pippi-villa-v1-ch2` (Chapter 2 unlocked), `pippi-villa-v1-scores`, `-sound`, `-motion`, `-voice`, `-lang`, `-norotate`. Every `localStorage` access is wrapped in `try/catch`.
- A new game keeps achievements (`S.ach`).

### Dialogue
- `say(lines, done?)`; speakers: `you`, `sys` (narrator, label "Villa Villekulla", or "Villa Villekulla · night" in Chapter 2), `pippi`, `nilsson`, `horse`, `spunk`, `tommy`, `annika`, `karlsson` (Thunder-Karlsson), `bloom`. A new speaker needs a portrait, an entry in `WHO` and `faceFor` (core.js), a colour in `css/chapter1.css` (or base), and a `VOICE_STYLE`.

### Items
- `spunk` (free hint item, like the rubber duck in Hello, IT: use it on anything for the current stage's first hint, not counted), `note`, `matches`, `eggs`, `pancake`, `key`, `sugar`; Chapter 2: `spunk`, `batteries`, `torch`, `feather`. Four pockets; a chapter never needs more than four at once.

### Languages
- English in the code, translations in `lang/<code>/*.txt` as `= English` / `> translation` pairs (see the blueprint, section 4). Use `tx()` for text built from pieces.
- `js/i18n.js`: `LANGS` and `LANG_TAGS` list the languages; the browser language picks Dutch or Swedish on the first visit. `js/app.js`: `LANG_NEXT` (button order) and `LANG_HELLO` (the line shown after switching, written in the new language). `js/voice.js` speaks `LANG_TAGS[LANG]`.
- **Adding a language:** a `lang/<code>/` folder with the same four files, entries in `LANGS`, `LANG_TAGS`, `LANG_NEXT`, `LANG_HELLO`, a `<span data-l>` in the language button, the files in `CORE` in `sw.js`, and a `PW_LANG` phone run in `tests.yml`.
- Swedish names (Astrid Lindgren's originals): Pippi Långstrump, Villa Villekulla, Herr Nilsson, the horse **Lilla Gubben** (the Swedish text calls him by name), Tommy och Annika, kapten Efraim Långstrump, *sakletare* (thing-searcher), Dunder-Karlsson och Blom.
- Dutch names: Pippi Langkous, Villa Kakelbont, meneer Nilsson, het paard, Tommy en Annika, kapitein Efraïm Langkous, "dingen zoeken" (thing-searching). "Spunk" stays "spunk".
- Pippi's note is misspelt on purpose in every language ("Dear gest" / "Liefe gast" / "Käre gässt").
- The sea chest word **SPUNK** is the same in every language (the flags spell it), so it needs no translation.
- Chapter 2's Morse answer is a word puzzle: `tickleWord()` is `tx('TICKLE')`, so the reply flashes **TICKLE / KIETEL / KITTLA** and only the player's language is accepted. The spy card adds Å, Ä and Ö in Swedish.
- Run `node tools/i18n-check.js`: the remaining "missing" lines are code, names and the pieces of a `tx()` HTML template.

## Puzzle solutions (spoilers)

| # | Puzzle (real idea) | Solution | Flags |
|---|---|---|---|
| 1 | Pippi's backwards note (mirror writing) | Take the note, use it on the mirror | `noteRead` |
| 2 | Secret drawer (×, −, ÷) | Annika: the right answers to 2×3, 9−4, 8÷2 → **654** on the bureau padlock | `matches` |
| 3 | Stove (the fire triangle: fuel, air, heat) | Firewood in, air vent open, strike a match (needs the matches) | `fire` |
| 4 | Pancake (steps in a valid order: dependencies) | Eggs from the pantry; then eggs, milk+flour, whisk, butter, pour, flip (butter may come earlier; "toss to the ceiling" also flips) | `pancake` |
| – | Swap | Pancake on Mr Nilsson → key; key on the front door → the horse blocks it | `key`, `unlocked` |
| 5 | Sea chest (signal flags) | The string of flags + the chart: **SPUNK** | `chest` |
| 6 | The horse (feeding a horse safely) | Sugar on the horse (or the door) → "On my flat, open hand" | `out1` |

Chapter 2 (spoilers too):

| # | Puzzle (real idea) | Solution | Flags |
|---|---|---|---|
| 1 | Torch (batteries in series, + towards the bulb) | Alarm clock → batteries; torch: turn battery 1 round so both point right, switch on | `batteries`, `torchOn` |
| 2 | Shadow (closer to the light = bigger shadow) | Torch on the veranda door; Mr Nilsson at 40 cm or less (shadow ≥ 2.5 m), wave | `scared` |
| 3 | North Star (pointer stars of the Big Dipper) | Window → click the North Star (not Venus) | `north` |
| 4 | Morse code | Torch on the window: `... --- ...`; Tommy answers **TICKLE** (NL KIETEL, SV KITTLA) | `sos`, `morse` |
| 5 | Balance scale (equal weight) | Stones adding up to 9 kg (e.g. 6+3, 5+3+1, 6+2+1), then swap | `swapped` |
| 6 | Waking Pippi | Feather from Pippi's hat on her **feet** (on the pillow); needs `morse` and `swapped` first | `out2` |

Achievements: `spunk` (used the spunk), `egghead` (egg on your head), `ceiling` (tossed the pancake), `lift` (click the horse once the door is unlocked), `drawers` (opened all 9 little drawers), `nilsson` (clicked Mr Nilsson 3 times), `shake` (shook Pippi 3 times), `giant` (a shadow of 5 m or more: 24 cm or closer), `venus` (clicked Venus).

## Gotchas

Everything in the blueprint's "Lessons learned" applies. In particular:
- `[hidden]{display:none!important}` in `base.css` must stay.
- CSS class names are global; search `css/` first (`.chart`, `.hand`, `.secret`, `.wheel`, `.pstep`… are taken).
- Use `reducedMotion()` in JS; the CSS kill-switch is the last rule in `animations.css`. The flags sway (`.sway`) and the fire flickers (`.flame`).
- Check new close-ups at 412×915 and 915×412 (`tests/phone.spec.js`), also with `PW_LANG=nl` and `PW_LANG=sv`.
- **Bump `CACHE` in `sw.js` and `GAME_VERSION` in `js/boot.js` together** on every change, and list new files in `CORE`.
- No `alert/confirm/prompt`. Buttons have `type="button"`.

## Tone and writing

- **Humour first, teaching second.** Every wrong answer gets a joke *and* a nudge.
- Keep the characters:
  - **Pippi:** strongest girl in the world, cheerful, boastful, tells tall tales ("in Egypt everybody…"), wrong but confident maths, catchphrase "I've never done it before, so I'm sure I can" (NL: "Ik heb het nog nooit gedaan, dus ik denk dat ik het wel kan"; SV: "Det har jag aldrig provat förut, så det klarar jag säkert").
  - **Mr Nilsson:** her monkey in blue trousers and a straw hat; says "Eek!" (NL "Iek!", SV "Iii!"); mischievous, loves pancakes.
  - **The horse:** white with black spots, lives on the veranda, Pippi lifts it.
  - **Tommy and Annika:** the polite neighbour children; Annika is clever and a bit anxious.
  - **The spunk:** the free-hint beetle; it says "…".
  - **Thunder-Karlsson and Bloom** (NL Donder-Karlsson en Blom, SV Dunder-Karlsson och Blom): the burglars. Karlsson is big and bossy, Bloom small and jumpy. Silly, never scary. The policemen are Kling and Klang.
- Running jokes: two times three makes four, eighteen kilos of sweets, thing-searching, sleeping with feet on the pillow, the suitcase of gold (and the burglars who want it).
- Don't copy text, songs or illustrations from the books or films; write our own and draw our own.
- Every puzzle needs two hints in `HINTS`: a nudge, then the answer. Every English line needs a Dutch and a Swedish line.

## Ideas for next chapters

3. School ("pluttification"). 4. The circus. 5. On board the *Hoppetossa*. 6. The South Sea island. Follow the blueprint's "Adding a chapter" checklist.

## Workflow

**Never push to `main`.** Every change goes through a pull request from a branch off the latest `origin/main`; the owner reviews and merges.

```bash
npm install
npx playwright install chromium   # first time only
npm test                           # all tests, desktop + Pixel 7
PW_LANG=nl npx playwright test tests/phone.spec.js
PW_LANG=sv npx playwright test tests/phone.spec.js
node tools/i18n-check.js
npm start                          # http://127.0.0.1:4173
```

Licence: GPL-3.0 for this project's own code, art and text. *Pippi Longstocking* and its characters belong to their rights holders; this is a non-commercial fan project.
