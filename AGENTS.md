# AGENTS.md: working on Villa Villekulla

Context for AI agents and new contributors. The README covers what the game is and how to play. This file covers what isn't obvious from reading the code. The general recipe (shared with *Hello, IT*, https://github.com/w3nl/it) is in [docs/escape-room-blueprint.md](docs/escape-room-blueprint.md); this file is this project's own notes.

> **Spoilers:** the puzzle solutions are listed below. You'll need them to test changes.

## What this is

*Villa Villekulla* is a point-and-click escape room, an unofficial fan homage to Astrid Lindgren's *Pippi Longstocking* books (Swedish original: *Pippi Långstrump*; Dutch: *Pippi Langkous*, *Villa Kakelbont*). You're a kid visiting Pippi's house. Every puzzle teaches one real idea for children, wrapped in a Pippi joke: in Chapter 1 (Mr Nilsson has locked you in) mirror writing, sums, the fire triangle, doing steps in the right order, signal flags and feeding a horse safely; in Chapter 2 (burglars in the night) how batteries go in a torch, shadows, finding the North Star, Morse code and a balance scale; in Chapter 3 (Pippi goes to school) Roman numerals, the nines times table, ABC order, insects, fractions and why the seasons happen; in Chapter 4 (Pippi goes to the circus) money and change, mixing coloured light, levers, patterns, pendulums and gears.

- 4 chapters so far: the kitchen (6 puzzles), the bedroom at night (6 puzzles), the classroom (6 puzzles) and the big top (6 puzzles). Plain HTML, CSS, JavaScript and SVG: **no build step, no framework, no runtime dependencies** (only Google Fonts).
- Hosted as a static site (GitHub Pages), installable as a PWA, playable offline.
- Three languages: **UK English** (in the code), **Dutch** (`lang/nl/*.txt`) and **Swedish** (`lang/sv/*.txt`). The language button cycles EN → NL → SV.
- **It must be served over http(s)** (`npm start`, http://127.0.0.1:4173); `file://` shows a "needs a web server" message.
- `node_modules/` and `package.json` exist **only for the tests and the local server**.
- Audience: children (about 8–12) and families. Keep words simple, puzzles fair, and nothing scary.

## Repository map

| Path | What |
|---|---|
| `index.html` | Page shell: header, stage, title and end screens, inventory ("Pockets"), close-up modal |
| `css/*.css` | Loaded in this order: `base` (tokens on `:root`), `chapter1`, `chapter2`, `chapter3`, `chapter4`, `phone`, `animations` (last: motion kill-switch) |
| `scenes/kitchen.svg`, `scenes/bedroom.svg`, `scenes/school.svg`, `scenes/circus.svg` | The rooms: Chapter 1 (ids prefixed `vk`/`vk-`), Chapter 2 (`br`/`br-`), Chapter 4 (`cc`/`cc-`) and Chapter 3 (`sl`/`sl-`); hotspot rects are last |
| `js/boot.js` | Start-up: fetches the scenes, loads the scripts in order; holds `GAME_VERSION` |
| `js/i18n.js` | Languages: `LANG`, `tx()`, `setLang()`, `onLangChange()`, the translating observer (copied from Hello, IT) |
| `lang/nl/*.txt`, `lang/sv/*.txt` | Dutch and Swedish: `ui`, `ch1`, `ch2`, `ch3`, `ch4`, `hints`, `scenes` (the same files in every language) |
| `js/core.js` | Engine: state `S`, `save`/`load`, sound, `say()`, portraits (`faceFor`), `ITEMS`, inventory, `applyVisuals()`, hotspot input, `openModal()`, `nope()` |
| `js/chapter1.js` | Chapter 1: signal flags (`FLAG_SHAPES`, `flagSVG()`), `buildKitchen()`, `applyKitchen()`, `H` (the hotspot table), every close-up, `intro1()`, `win1()` |
| `js/chapter2.js` | Chapter 2: `UNLOCK2`/`unlocked2()`/`setUnlocked2()`, its `ITEMS` (batteries, torch, feather), `MORSE`, `tickleWord()`, `applyBedroom()`, hotspots, close-ups (`openTorch2`, `openShadow`, `openSpyCard`, `openSky`, `openMorse`, `openScale`), `tickle()`, `intro2()`, `startCh2()`, `win2()` |
| `js/chapter3.js` | Chapter 3: `UNLOCK3`/`unlocked3()`/`setUnlocked3()`, `TASKS3`/`stars3()`/`goldStar3()`, its `ITEMS` (chalk, magnifier), `applySchool()`, hotspots, close-ups (`openDrawer3`, `openRomans`, `openBoard`, `openTables`, `openRegister`, `openNature`, `openCake`, `openGlobe`), `intro3()`, `startCh3()`, `win3()` |
| `js/chapter4.js` | Chapter 4: `UNLOCK4`/`unlocked4()`/`setUnlocked4()`, the ringmaster's checklist `TASKS4`/`tasks4Done()`, its `ITEMS` (tickets), `buildCircus()` (stripes, bunting, sign bulbs, confetti), `applyCircus()`, hotspots, close-ups (`openTickets`, `openLights`, `openTeeter`, `openJuggle`, `openTrapeze`, `openGears`), `intro4()`, `startCh4()`, `win4()` |
| `js/items.js` | `useItem(item, hotspot)` |
| `js/hints.js` | `HINTS` and `stage1()`, `stage2()`, `stage3()`, `stage4()`, `stage_()` |
| `js/ambience.js` | Generated room sound (`ambKey()`, `SOUNDSCAPES.kitchen`, `.bedroom`, `.school`, `.circus` (a barrel-organ waltz; cheering once the show starts); crackling fire once `S.f.fire`) |
| `js/voice.js` | Optional spoken dialogue; `VOICE_STYLE` per speaker |
| `js/app.js` | Chapters (`LAST_CH`, `chapterDone`, `nextChapter`, `exitLabels`, `refreshMenu`), chapter end (`CH_END`, `showWin`), scores, ranks, achievements (`ACH`), buttons, timer, title menu, PWA install, `start()` |
| `portraits/*.svg` | `you`, `pippi`, `nilsson`, `horse`, `spunk`, `tommy`, `annika`, `karlsson`, `bloom`, `teacher`, `ringmaster`, `clown`, `strongman` (120×120) |
| `sw.js`, `manifest.webmanifest`, `icons/` | The installable, offline app. `icon.svg` is the source; PNGs are rendered from it |
| `tests/` | Playwright: `chapter1`, `chapter2`, `chapter3`, `chapter4`, `progress`, `language`, `pwa`, `phone`, `motion` (also in Firefox in CI); helpers in `helpers.js`; `serve.js` is the local server |
| `tools/i18n-check.js` | For every language in `lang/`: lists English text without a translation, fails on stale keys and conflicts (`--lang=sv` for one) |
| `.github/` | CI (`tests.yml`) and the idea → plan → PR agent workflows (see `docs/agent-workflow.md`) |

## How the code fits together

- **Classic scripts in one shared global scope**, loaded in order by `boot.js`. Names must be unique across files; chapter-specific names end in the chapter number (`stage1`, `intro1`, `win1`) or say what they are (`openPancake`). Avoid browser globals.
- The scene SVG is in the page before any script runs; `core.js` wires up every `.hit` when it loads. `buildKitchen()` (called from `start()`) draws the flag string, the flag chart and the bureau drawers; `applyKitchen()` shows the state (fire, key, note, padlocks, horse, door light).
- **Hotspot ids** share one namespace across all rooms. Chapter 1 uses: `flags stove sign wood pantry window spunk mirror chart nilsson suitcase bureau horse door note homework bowl chest`. Chapter 2 uses: `card2 feet pippi2 case2 clock2 torch spunk2 sky nilsson2 scale dresser stones hat wardrobe vdoor`. Chapter 3 uses: `window3 board tables romans clock3 stars plaque door3 teacher3 tdesk register bell3 nature globe ta3 pippi3 cake nilsson3 spunk3`. Chapter 4 uses: `booth spunk4 list4 lamps trapeze seal clown curtain winch ringmaster teeter pippi4`.
- **Chapters:** `S.ch` and `S.scene` (`kitchen`, `bedroom`, `school` or `circus`) pick the room. Finishing a chapter sets its `outN` flag; `exitLabels()` then labels the exit "on to Chapter N" (the kitchen's front door, the bedroom's veranda door, the classroom door), and clicking it (or **Continue to Chapter N** on the end screen) runs `startCh2()` / `startCh3()` / `startCh4()`. The unlocks are saved as `pippi-villa-v1-ch2`, `-ch3` and `-ch4`, which show the chapter buttons on the title screen. `LAST_CH` in `app.js` is the newest chapter.
- **SVG ids are global**: prefix new ones per room. Flags use generated clip-path ids (`fclipN`).

### State and saving
- `S` is the whole save: `{ v:1, ch, scene, f:{}, inv:[], hl:{}, hints, t, ach:{}, started }`, saved to `localStorage['pippi-villa-v1']` after every action.
- Chapter 1 fields: `S.drw` (opened little drawers), `S.lockd` (bureau padlock digits), `S.stv` (`{wood, vent}` in the stove), `S.pan` (pancake steps done), `S.cl` (sea chest letter wheels).
- Chapter 2 fields: `S.tb` (battery directions, 1 = + towards the bulb), `S.shd` (`{d}`: Mr Nilsson's distance from the torch), `S.mrs` (`{seq}`: the Morse you're typing), `S.stn` (stones on the scale). Close-ups stay as the player left them.
- Chapter 3 fields: `S.rl` (the desk padlock's digits), `S.nn` (lines marked on the blackboard), `S.reg` (names put in the register so far), `S.bug` (creatures ticked as insects), `S.frc` (cake puzzle round: 0 or 1).
- Chapter 4 fields: `S.chg` (coins in the change tray), `S.lgt` (`{r, on}`: lighting round and switches), `S.tee` (`{m}`: Pippi's seat on the teeterboard), `S.jug` (the clown's last three balls), `S.trp` (`{a, b}`: rope lengths), `S.gr` (`{n}`: gears in between). Flags: `tickets`, `inside`, the four checklist tasks `lights teeter juggle trapeze`, and `out4`.
- Other keys: `pippi-villa-v1-ch2`, `-ch3`, `-ch4` (chapters unlocked), `pippi-villa-v1-scores`, `-sound`, `-motion`, `-voice`, `-lang`, `-norotate`. Every `localStorage` access is wrapped in `try/catch`.
- A new game keeps achievements (`S.ach`).

### Dialogue
- `say(lines, done?)`; speakers: `you`, `sys` (narrator, label "Villa Villekulla", "Villa Villekulla · night" in Chapter 2, "The little school" in Chapter 3, "The big top" in Chapter 4), `pippi`, `nilsson`, `horse`, `spunk`, `tommy`, `annika`, `karlsson` (Thunder-Karlsson), `bloom`, `teacher` ("Miss"; NL "Juf", SV "Fröken"), `ringmaster`, `clown`, `strongman`, `seal` (no portrait). A new speaker needs a portrait, an entry in `WHO` and `faceFor` (core.js), a colour in the chapter's CSS (or base), and a `VOICE_STYLE`.

### Items
- `spunk` (free hint item, like the rubber duck in Hello, IT: use it on anything for the current stage's first hint, not counted), `note`, `matches`, `eggs`, `pancake`, `key`, `sugar`; Chapter 2: `spunk`, `batteries`, `torch`, `feather`; Chapter 3: `spunk`, `chalk`, `magnifier`; Chapter 4: `spunk`, `tickets`. Four pockets; a chapter never needs more than four at once.

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
- Pippi's word for multiplying is **pluttification** (NL **plutimiceren**, SV **pluttifikation**). The pupils' names in the class register (Annika, Axel, Britta, Olle, Peter, Pippi, Tommy, Tora) are the same in every language, so ABC order is too. In Swedish text the horse is Lilla Gubben here as well.

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

Chapter 3 (spoilers too). Five tasks on the blackboard, each worth a gold star from Annika (`TASKS3`); with five stars the bell ends the chapter:

| # | Puzzle (real idea) | Solution | Flags |
|---|---|---|---|
| 1 | Miss's desk drawer (Roman numerals) | The plaque over the door: MDCCCXCIV = **1894** on the desk padlock → chalk and magnifying glass | `drawer` |
| 2 | Pluttification (the nines: the tens go up, the units go down, the digits add up to 9) | Chalk on the blackboard; mark 9×5, 9×8 and 9×10 (Pippi wrote 54, 27, 100), then Done marking | `nines` |
| 3 | Class register (ABC order, then the second letter) | Annika, Axel, Britta, Olle, Peter, Pippi, Tommy, Tora | `abc` |
| 4 | Nature table (insects: six legs, three body parts) | Magnifying glass on the nature table; tick the ant, the ladybird and the bumblebee (not the spider or the woodlouse) | `bugs` |
| 5 | Pippi's cake (fractions) | The piece of the cake cut into 3; then 1/4 and 2/8 are the same | `cake` |
| 6 | The globe (the seasons come from the Earth's tilt) | "The Earth leans over…" | `seasons` |
| – | Holidays | Click the hand bell on Miss's desk (needs all five stars) | `out3` |


Chapter 4 (spoilers too). Tickets first; then the ringmaster's checklist (`TASKS4`, any order); then the winch:

| # | Puzzle (real idea) | Solution | Flags |
|---|---|---|---|
| 1 | Ticket booth (money: 4 × 3 = 12, 20 − 12 = 8) | Give 8 crowns change (e.g. 5 + 2 + 1); tickets on the ringmaster | `tickets`, `inside` |
| 2 | Lighting desk (mixing coloured light) | Yellow = red + green; cyan = green + blue; white = all three | `lights` |
| 3 | Teeterboard (a lever: weight × distance) | Strongman 90 kg × 1 m = Pippi 30 kg × **3 m** | `teeter` |
| 4 | The clown (a repeating pattern) | R B B R B B R → **B B R** | `juggle` |
| 5 | Trapezes (a pendulum's rhythm depends on its length, not its weight) | Make both ropes the same length | `trapeze` |
| 6 | Curtain winch (touching gears turn opposite ways) | **2** gears in between (crank ↻ → drum ↺); needs the whole checklist | `out4` |

Achievements: `spunk` (used the spunk), `egghead` (egg on your head), `ceiling` (tossed the pancake), `lift` (click the horse once the door is unlocked), `drawers` (opened all 9 little drawers), `nilsson` (clicked Mr Nilsson 3 times), `shake` (shook Pippi 3 times), `giant` (a shadow of 5 m or more: 24 cm or closer), `venus` (clicked Venus), `quarter` (picked the quarter as the biggest piece), `freckles` (magnifying glass on Pippi), `honk` (honked the clown's nose 3 times), `lightsout` (shone with every light off), `flyer` (Pippi at 4 m on the teeterboard).

## Gotchas

Everything in the blueprint's "Lessons learned" applies. In particular:
- `[hidden]{display:none!important}` in `base.css` must stay.
- CSS class names are global; search `css/` first (`.chart`, `.hand`, `.secret`, `.wheel`, `.pstep`… are taken).
- **Motion:** every moving part is a **CSS animation** (no SMIL), so the kill-switch (the last rule in `animations.css`) stops them all for "Motion off" and for devices that ask for reduced motion (unless the player picks "Motion on"). In JS, use `reducedMotion()`. Things that only exist while moving (the bird, the shooting star) start off-screen or invisible, so they disappear when motion is off. `tests/motion.spec.js` checks that nothing in either room moves with Motion off.
  - Kitchen (`css/chapter1.css`): the flags sway, the fire flickers, steam rises from the pan once it's lit (`#vk-steam`), Mr Nilsson bobs and swishes his tail, the horse nods, the curtains move in the breeze, clouds drift and a bird flies past (inside the window's `vkWinClip`), Tommy and Annika wave at the gate, the spunk crawls about its jar.
  - Bedroom (`css/chapter2.css`): stars twinkle, the moon glows, a shooting star now and then, the burglars sneak and their lantern flickers, the shadow at the door fiddles with the lock, Pippi and Mr Nilsson breathe in their sleep, Pippi snores (z z z), Tommy's window flashes (`.flashing`, after SOS until you decode it), and the burglars' legs dangle from the wardrobe.
  - Classroom (`css/chapter3.css`): the horse munches the flowerbed in the schoolyard, Miss watches the class through the little window in the door (`#sl-teacher`, until the holidays start; she has her own hotspot `teacher3`), Pippi's plaits bob, clouds drift past the window, the clock's second hand ticks, Pippi's plaits bob, Mr Nilsson bobs, the spunk crawls about its jar.
  - Big top (`css/chapter4.css`): the spotlights sweep (and meet in the middle, white, once `lit`), the horse trots round the ring (`ccTrot`: front facing right, far side smaller and facing left), the trapezes swing out of time (until `synced`), the bulbs round the sign chase, flags and bunting wave, the seal bounces its ball, the ringmaster waves his cane, the clown juggles (once `juggle`), and at `showtime` the curtain opens, confetti falls and Pippi rides the horse. The close-ups move too: swinging trapezes (their speed follows the rope length), spinning gears, the tilting teeterboard.
  - Interface (`css/base.css`): a new item pops into its pocket (`justGiven` in `core.js`), the end screen's title bounces in, portraits pop in.
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
  - **Miss** (NL de juf, SV fröken): the teacher at the little school. Kind, a bit strict, very fond of her geraniums; secretly delighted by Pippi.
  - **The ringmaster** (NL de directeur, SV direktören): top hat, moustache, panics easily. **The clown**: sniffy, says "Honk!". **The strongman**: big, proud and gentle, until Pippi lifts him. The trapeze act is the Flying Svenssons (Sofia and Sven).
- Running jokes: two times three makes four, eighteen kilos of sweets, thing-searching, sleeping with feet on the pillow, the suitcase of gold (and the burglars who want it), pluttification, Pippi coming to school only for the holidays.
- Don't copy text, songs or illustrations from the books or films; write our own and draw our own.
- Every puzzle needs two hints in `HINTS`: a nudge, then the answer. Every English line needs a Dutch and a Swedish line.

## Ideas for next chapters

5. On board the *Hoppetossa*. 6. The South Sea island. Follow the blueprint's "Adding a chapter" checklist. The circus curtain (`winch`/`curtain`) is the natural exit to Chapter 5 (add it to `exitLabels()`).

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
