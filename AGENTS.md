# AGENTS.md: working on Villa Villekulla

Context for AI agents and new contributors. The README covers what the game is and how to play. This file covers what isn't obvious from reading the code. The general recipe (shared with *Hello, IT*, https://github.com/w3nl/it) is in [docs/escape-room-blueprint.md](docs/escape-room-blueprint.md); this file is this project's own notes.

> **Spoilers:** the puzzle solutions are listed below. You'll need them to test changes.

## What this is

*Villa Villekulla* is a point-and-click escape room, an unofficial fan homage to Astrid Lindgren's *Pippi Longstocking* books (Dutch: *Pippi Langkous*, *Villa Kakelbont*). You're a kid visiting Pippi's house; Mr Nilsson has locked you in. Every puzzle teaches one real idea for children (mirror writing, sums, the fire triangle, doing steps in the right order, signal flags, feeding a horse safely) wrapped in a Pippi joke.

- 1 chapter so far (the kitchen), 6 puzzles. Plain HTML, CSS, JavaScript and SVG: **no build step, no framework, no runtime dependencies** (only Google Fonts).
- Hosted as a static site (GitHub Pages), installable as a PWA, playable offline.
- Two languages: **UK English** (in the code) and **Dutch** (`lang/nl/*.txt`).
- **It must be served over http(s)** (`npm start`, http://127.0.0.1:4173); `file://` shows a "needs a web server" message.
- `node_modules/` and `package.json` exist **only for the tests and the local server**.
- Audience: children (about 8–12) and families. Keep words simple, puzzles fair, and nothing scary.

## Repository map

| Path | What |
|---|---|
| `index.html` | Page shell: header, stage, title and end screens, inventory ("Pockets"), close-up modal |
| `css/*.css` | Loaded in this order: `base` (tokens on `:root`), `chapter1`, `phone`, `animations` (last: motion kill-switch) |
| `scenes/kitchen.svg` | The room (Chapter 1). Ids are prefixed `vk`/`vk-`; hotspot rects are last |
| `js/boot.js` | Start-up: fetches the scenes, loads the scripts in order; holds `GAME_VERSION` |
| `js/i18n.js` | Languages: `LANG`, `tx()`, `setLang()`, `onLangChange()`, the translating observer (copied from Hello, IT) |
| `lang/nl/*.txt` | Dutch: `ui`, `ch1`, `hints`, `scenes` |
| `js/core.js` | Engine: state `S`, `save`/`load`, sound, `say()`, portraits (`faceFor`), `ITEMS`, inventory, `applyVisuals()`, hotspot input, `openModal()`, `nope()` |
| `js/chapter1.js` | Chapter 1: signal flags (`FLAG_SHAPES`, `flagSVG()`), `buildKitchen()`, `applyKitchen()`, `H` (the hotspot table), every close-up, `intro1()`, `win1()` |
| `js/items.js` | `useItem(item, hotspot)` |
| `js/hints.js` | `HINTS` and `stage1()` / `stage_()` |
| `js/ambience.js` | Generated room sound (`ambKey()`, `SOUNDSCAPES.kitchen`; crackling fire once `S.f.fire`) |
| `js/voice.js` | Optional spoken dialogue; `VOICE_STYLE` per speaker |
| `js/app.js` | Chapter end (`CH_END`, `showWin`), scores, ranks, achievements (`ACH`), buttons, timer, title menu, PWA install, `start()` |
| `portraits/*.svg` | `you`, `pippi`, `nilsson`, `horse`, `spunk`, `tommy`, `annika` (120×120) |
| `sw.js`, `manifest.webmanifest`, `icons/` | The installable, offline app. `icon.svg` is the source; PNGs are rendered from it |
| `tests/` | Playwright: `chapter1`, `progress`, `language`, `pwa`, `phone`; helpers in `helpers.js`; `serve.js` is the local server |
| `tools/i18n-check.js` | Lists English text without Dutch, fails on stale keys and conflicts |
| `.github/` | CI (`tests.yml`) and the idea → plan → PR agent workflows (see `docs/agent-workflow.md`) |

## How the code fits together

- **Classic scripts in one shared global scope**, loaded in order by `boot.js`. Names must be unique across files; chapter-specific names end in the chapter number (`stage1`, `intro1`, `win1`) or say what they are (`openPancake`). Avoid browser globals.
- The scene SVG is in the page before any script runs; `core.js` wires up every `.hit` when it loads. `buildKitchen()` (called from `start()`) draws the flag string, the flag chart and the bureau drawers; `applyKitchen()` shows the state (fire, key, note, padlocks, horse, door light).
- **Hotspot ids** share one namespace across all rooms. Chapter 1 uses: `flags stove sign wood pantry window spunk mirror chart nilsson suitcase bureau horse door note homework bowl chest`.
- **SVG ids are global**: prefix new ones per room. Flags use generated clip-path ids (`fclipN`).

### State and saving
- `S` is the whole save: `{ v:1, ch, scene, f:{}, inv:[], hl:{}, hints, t, ach:{}, started }`, saved to `localStorage['pippi-villa-v1']` after every action.
- Chapter 1 fields: `S.drw` (opened little drawers), `S.lockd` (bureau padlock digits), `S.stv` (`{wood, vent}` in the stove), `S.pan` (pancake steps done), `S.cl` (sea chest letter wheels). Close-ups stay as the player left them.
- Other keys: `pippi-villa-v1-scores`, `-sound`, `-motion`, `-voice`, `-lang`, `-norotate`. Every `localStorage` access is wrapped in `try/catch`.
- A new game keeps achievements (`S.ach`).

### Dialogue
- `say(lines, done?)`; speakers: `you`, `sys` (narrator, label "Villa Villekulla"), `pippi`, `nilsson`, `horse`, `spunk`, `tommy`, `annika`. A new speaker needs a portrait, an entry in `WHO` and `faceFor` (core.js), a colour in `css/chapter1.css` (or base), and a `VOICE_STYLE`.

### Items
- `spunk` (free hint item, like the rubber duck in Hello, IT: use it on anything for the current stage's first hint, not counted), `note`, `matches`, `eggs`, `pancake`, `key`, `sugar`. Four pockets; the chapter never needs more than four at once.

### Languages
- English in the code, Dutch in `lang/nl/*.txt` as `= English` / `> Nederlands` pairs (see the blueprint, section 4). Use `tx()` for text built from pieces.
- Dutch names: Pippi Langkous, Villa Kakelbont, meneer Nilsson, het paard, Tommy en Annika, kapitein Efraïm Langkous, "dingen zoeken" (thing-searching). "Spunk" stays "spunk".
- Pippi's note is misspelt on purpose in both languages ("Dear gest" / "Liefe gast").
- The sea chest word **SPUNK** is the same in every language (the flags spell it), so it needs no Dutch version.
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

Achievements: `spunk` (used the spunk), `egghead` (egg on your head), `ceiling` (tossed the pancake), `lift` (click the horse once the door is unlocked), `drawers` (opened all 9 little drawers), `nilsson` (clicked Mr Nilsson 3 times).

## Gotchas

Everything in the blueprint's "Lessons learned" applies. In particular:
- `[hidden]{display:none!important}` in `base.css` must stay.
- CSS class names are global; search `css/` first (`.chart`, `.hand`, `.secret`, `.wheel`, `.pstep`… are taken).
- Use `reducedMotion()` in JS; the CSS kill-switch is the last rule in `animations.css`. The flags sway (`.sway`) and the fire flickers (`.flame`).
- Check new close-ups at 412×915 and 915×412 (`tests/phone.spec.js`), also with `PW_LANG=nl`.
- **Bump `CACHE` in `sw.js` and `GAME_VERSION` in `js/boot.js` together** on every change, and list new files in `CORE`.
- No `alert/confirm/prompt`. Buttons have `type="button"`.

## Tone and writing

- **Humour first, teaching second.** Every wrong answer gets a joke *and* a nudge.
- Keep the characters:
  - **Pippi:** strongest girl in the world, cheerful, boastful, tells tall tales ("in Egypt everybody…"), wrong but confident maths, catchphrase "I've never done it before, so I'm sure I can" (NL: "Ik heb het nog nooit gedaan, dus ik denk dat ik het wel kan").
  - **Mr Nilsson:** her monkey in blue trousers and a straw hat; says "Eek!" (NL "Iek!"); mischievous, loves pancakes.
  - **The horse:** white with black spots, lives on the veranda, Pippi lifts it.
  - **Tommy and Annika:** the polite neighbour children; Annika is clever and a bit anxious.
  - **The spunk:** the free-hint beetle; it says "…".
- Running jokes: two times three makes four, eighteen kilos of sweets, thing-searching, sleeping with feet on the pillow, the suitcase of gold (and the burglars who want it).
- Don't copy text, songs or illustrations from the books or films; write our own and draw our own.
- Every puzzle needs two hints in `HINTS`: a nudge, then the answer. Every English line needs a Dutch line.

## Ideas for next chapters

2. Night at Villa Villekulla: the burglars Thunder-Karlsson and Bloom (NL: Donder-Karlsson en Blom) come for the gold. 3. School ("pluttification"). 4. The circus. 5. On board the *Hoppetossa*. 6. The South Sea island. Follow the blueprint's "Adding a chapter" checklist.

## Workflow

**Never push to `main`.** Every change goes through a pull request from a branch off the latest `origin/main`; the owner reviews and merges.

```bash
npm install
npx playwright install chromium   # first time only
npm test                           # all tests, desktop + Pixel 7
PW_LANG=nl npx playwright test tests/phone.spec.js
node tools/i18n-check.js
npm start                          # http://127.0.0.1:4173
```

Licence: GPL-3.0 for this project's own code, art and text. *Pippi Longstocking* and its characters belong to their rights holders; this is a non-commercial fan project.
