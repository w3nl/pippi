# AGENTS.md: working on Villa Villekulla

Context for AI agents and new contributors. The README covers what the game is and how to play. This file covers what isn't obvious from reading the code. The general recipe (shared with *Hello, IT*, https://github.com/w3nl/it) is in [docs/escape-room-blueprint.md](docs/escape-room-blueprint.md); this file is this project's own notes.

> **Spoilers:** the puzzle solutions are listed below. You'll need them to test changes.

## What this is

*Villa Villekulla* is a point-and-click escape room, an unofficial fan homage to Astrid Lindgren's *Pippi Longstocking* books (Swedish original: *Pippi Långstrump*; Dutch: *Pippi Langkous*, *Villa Kakelbont*). You're a kid visiting Pippi's house. Every puzzle teaches one real idea for children, wrapped in a Pippi joke: in Chapter 1 (Mr Nilsson has locked you in) mirror writing, sums, the fire triangle, doing steps in the right order, signal flags and feeding a horse safely; in Chapter 2 (burglars in the night) how batteries go in a torch, shadows, finding the North Star, Morse code and a balance scale; in Chapter 3 (Pippi goes to school) Roman numerals, the nines times table, ABC order, insects, fractions and why the seasons happen; in Chapter 4 (a snowball fight with the policemen Kling and Klang) reading animal tracks, temperatures below zero, building a wall in running bond, salt on ice, staying warm in layers and the best angle for a throw; in Chapter 5 (Pippi goes to the circus) money and change, mixing coloured light, levers, patterns, pendulums and gears; in Chapter 6 (on board the Hoppetossa) pulleys, compass points, floating and sinking, fresh water from sea water, finding the Equator by the North Star, and why the Earth hides far-away islands; in Chapter 7 (the South Sea island) reading a sundial, tides and the Moon, measuring with paces and metres, food chains, how far away a thunderstorm is, and why baby turtles need a dark beach.

- 7 chapters so far: the kitchen (6 puzzles), the bedroom at night (6 puzzles), the classroom (6 puzzles), the snowy garden (6 puzzles), the big top (6 puzzles), the Hoppetossa (6 puzzles) and the South Sea island (6 puzzles). Plain HTML, CSS, JavaScript and SVG: **no build step, no framework, no runtime dependencies** (only Google Fonts).
- Hosted as a static site (GitHub Pages), installable as a PWA, playable offline.
- Three languages: **UK English** (in the code), **Dutch** (`lang/nl/*.txt`) and **Swedish** (`lang/sv/*.txt`). The language button cycles EN → NL → SV.
- **It must be served over http(s)** (`npm start`, http://127.0.0.1:4173); `file://` shows a "needs a web server" message.
- `node_modules/` and `package.json` exist **only for the tests and the local server**.
- Audience: children (about 8–12) and families. Keep words simple, puzzles fair, and nothing scary.

## Repository map

| Path | What |
|---|---|
| `index.html` | Page shell: header, stage, title and end screens, inventory ("Pockets"), close-up modal |
| `css/*.css` | Loaded in this order: `base` (tokens on `:root`), `chapter1` … `chapter7`, `phone`, `animations` (last: motion kill-switch) |
| `scenes/kitchen.svg`, `scenes/bedroom.svg`, `scenes/school.svg`, `scenes/winter.svg`, `scenes/circus.svg`, `scenes/ship.svg`, `scenes/island.svg` | The rooms: Chapter 1 (ids prefixed `vk`/`vk-`), Chapter 2 (`br`/`br-`), Chapter 3 (`sl`/`sl-`), Chapter 4 (`wt`/`wt-`), Chapter 5 (`cc`/`cc-`), Chapter 6 (`hp`/`hp-`) and Chapter 7 (`si`/`si-`); hotspot rects are last |
| `js/boot.js` | Start-up: fetches the scenes, loads the scripts in order; holds `GAME_VERSION` |
| `js/i18n.js` | Languages: `LANG`, `tx()`, `setLang()`, `onLangChange()`, the translating observer (copied from Hello, IT) |
| `lang/nl/*.txt`, `lang/sv/*.txt` | Dutch and Swedish: `ui`, `ch1` … `ch7`, `hints`, `scenes` (the same files in every language) |
| `js/core.js` | Engine: state `S`, `save`/`load`, sound, `say()`, portraits (`faceFor`), `ITEMS`, inventory, `applyVisuals()`, hotspot input, `openModal()`, `nope()` |
| `js/chapter1.js` | Chapter 1: signal flags (`FLAG_SHAPES`, `flagSVG()`), `buildKitchen()`, `applyKitchen()`, `H` (the hotspot table), every close-up, `intro1()`, `win1()` |
| `js/chapter2.js` | Chapter 2: `UNLOCK2`/`unlocked2()`/`setUnlocked2()`, its `ITEMS` (batteries, torch, feather), `MORSE`, `tickleWord()`, `applyBedroom()`, hotspots, close-ups (`openTorch2`, `openShadow`, `openSpyCard`, `openSky`, `openMorse`, `openScale`), `tickle()`, `intro2()`, `startCh2()`, `win2()` |
| `js/chapter3.js` | Chapter 3: `UNLOCK3`/`unlocked3()`/`setUnlocked3()`, `TASKS3`/`stars3()`/`goldStar3()`, its `ITEMS` (chalk, magnifier), `applySchool()`, hotspots, close-ups (`openDrawer3`, `openRomans`, `openBoard`, `openTables`, `openRegister`, `openNature`, `openCake`, `openGlobe`), `intro3()`, `startCh3()`, `win3()` |
| `js/chapter4.js` | Chapter 4: `UNLOCK4`/`unlocked4()`/`setUnlocked4()`, `READY4`/`ready4()` (what must be ready by three o'clock), its `ITEMS` (mittens), `PRINT4`/`trail4()` (footprints), `wall4()`, `buildWinter()` (snowflakes, veranda lights, tracks, both forts), `applyWinter()` (also sets the church clock), `done4()`, hotspots, close-ups (`openTracks4`, `openThermo4`, `openFort4`, `openSteps4`, `openWarm4`, `openThrow4`), `intro4()`, `startCh4()`, `win4()` |
| `js/chapter5.js` | Chapter 5: `UNLOCK5`/`unlocked5()`/`setUnlocked5()`, the ringmaster's checklist `TASKS5`/`tasks5Done()`, its `ITEMS` (tickets), `buildCircus()` (stripes, bunting, sign bulbs, confetti), `applyCircus()`, hotspots, close-ups (`openTickets`, `openLights`, `openTeeter`, `openJuggle`, `openTrapeze`, `openGears`), `intro5()`, `startCh5()`, `win5()` |
| `js/chapter6.js` | Chapter 6: `UNLOCK6`/`unlocked6()`/`setUnlocked6()`, its `ITEMS` (net, sextant, spyglass), `buildShip()` (stars, wave crests, rails, ratlines), `applyShip()` (day → night → dawn, harbour → sea → island), `castOff6()`, hotspots, close-ups (`openHoist`, `openWheel`, `openChart6`, `openFloat`, `openStill`, `openLog6`, `openSextant6`, `openLandHo`), `intro6()`, `startCh6()`, `win6()` |
| `js/chapter7.js` | Chapter 7: `UNLOCK7`/`unlocked7()`/`setUnlocked7()`, its `ITEMS` (map, spade), the times of day (`lowtide7()`, `storm7()`, `dusk7()`), `applyIsland()`, hotspots, close-ups (`openSundial7`, `openTide7`, `openPaces7`, `openChest7`, `openThunder7`, `openTurtles7`), `intro7()`, `startCh7()`, `win7()` |
| `js/items.js` | `useItem(item, hotspot)` |
| `js/hints.js` | `HINTS` and `stage1()` … `stage7()`, `stage_()` |
| `js/ambience.js` | Generated room sound (`ambKey()`, `SOUNDSCAPES.kitchen`, `.bedroom`, `.school`, `.winter` (wind, crows, a far-off church bell; laughter once the fight is won), `.circus` (a barrel-organ waltz; cheering once the show starts), `.ship` (waves and creaking timbers; gulls in the harbour, wind at sea, the ship's bell at night), `.island` (waves and the parrot; rain and thunder in the shower; crickets at night); crackling fire once `S.f.fire`) |
| `js/voice.js` | Optional spoken dialogue; `VOICE_STYLE` per speaker |
| `js/app.js` | Chapters (`LAST_CH`, `chapterDone`, `nextChapter`, `exitLabels`, `refreshMenu`), chapter end (`CH_END`, `showWin`), `renumber()` (one-time move of old saves, unlocks and scores after winter became Chapter 4), scores, ranks, achievements (`ACH`), buttons, timer, title menu, PWA install, `start()` |
| `portraits/*.svg` | `you`, `pippi`, `nilsson`, `horse`, `spunk`, `tommy`, `annika`, `karlsson`, `bloom`, `teacher`, `kling`, `klang`, `ringmaster`, `clown`, `strongman`, `captain` (120×120) |
| `sw.js`, `manifest.webmanifest`, `icons/` | The installable, offline app. `icon.svg` is the source; PNGs are rendered from it |
| `tests/` | Playwright: `chapter1` … `chapter7`, `progress`, `language`, `pwa`, `phone`, `motion` (also in Firefox in CI); helpers in `helpers.js`; `serve.js` is the local server |
| `tools/i18n-check.js` | For every language in `lang/`: lists English text without a translation, fails on stale keys and conflicts (`--lang=sv` for one) |
| `.github/` | CI (`tests.yml`) and the idea → plan → PR agent workflows (see `docs/agent-workflow.md`) |

## How the code fits together

- **Classic scripts in one shared global scope**, loaded in order by `boot.js`. Names must be unique across files; chapter-specific names end in the chapter number (`stage1`, `intro1`, `win1`) or say what they are (`openPancake`). Avoid browser globals.
- The scene SVG is in the page before any script runs; `core.js` wires up every `.hit` when it loads. `buildKitchen()` (called from `start()`) draws the flag string, the flag chart and the bureau drawers; `applyKitchen()` shows the state (fire, key, note, padlocks, horse, door light).
- **Hotspot ids** share one namespace across all rooms. Chapter 1 uses: `flags stove sign wood pantry window spunk mirror chart nilsson suitcase bureau horse door note homework bowl chest`. Chapter 2 uses: `card2 feet pippi2 case2 clock2 torch spunk2 sky nilsson2 scale dresser stones hat wardrobe vdoor`. Chapter 3 uses: `window3 board tables romans clock3 stars plaque door3 teacher3 tdesk register bell3 nature globe ta3 pippi3 cake nilsson3 spunk3`. Chapter 4 uses: `snow4 church4 gate4 house4 window4 spunk4 thermo4 horse4 steps4 oak4 snowman4 tracks4 fort4 ta4 pippi4 police4`. Chapter 5 uses: `booth spunk5 list5 lamps trapeze seal clown curtain winch ringmaster teeter pippi5`. Chapter 6 uses: `sky6 sea6 quay6 horse6 hoist mast6 crow glass6 wheel captain6 nilsson6 ta6 pippi6 log6 case6 chart6 spunk6 stove6 barrel crates6 net6 hold6`. Chapter 7 uses: `sky7 ship7 lagoon7 tidepost islet7 dig7 nest7 torches7 horse7 pippi7 sundial spunk7 kids7 palm7 parrot7 nilsson7 captain7 hut7 shovel7` (and the ship gets `isle6`, the way ashore).
- **Chapters:** `S.ch` and `S.scene` (`kitchen`, `bedroom`, `school`, `winter`, `circus`, `ship` or `island`) pick the room. Finishing a chapter sets its `outN` flag; `exitLabels()` then labels the exit "on to Chapter N" (the kitchen's front door, the bedroom's veranda door, the classroom door, the garden gate, the circus curtain, the island seen from the Hoppetossa), and clicking it (or **Continue to Chapter N** on the end screen) runs `startCh2()` … `startCh7()`. The unlocks are saved as `pippi-villa-v1-ch2` … `-ch7`, which show the chapter buttons on the title screen. `LAST_CH` in `app.js` is the newest chapter.
- **Renumbering:** winter was added as Chapter 4 after the circus and the Hoppetossa existed (they were 4 and 5). `renumber()` in `app.js` moves old unlocks and scores up once (marker `pippi-villa-v1-ord`), and `start()` moves an old save by its room (`circus` with `ch` 4, `ship` with `ch` 5). The test helper `seed()` sets the marker.
- **SVG ids are global**: prefix new ones per room. Flags use generated clip-path ids (`fclipN`).

### State and saving
- `S` is the whole save: `{ v:1, ch, scene, f:{}, inv:[], hl:{}, hints, t, ach:{}, started }`, saved to `localStorage['pippi-villa-v1']` after every action.
- Chapter 1 fields: `S.drw` (opened little drawers), `S.lockd` (bureau padlock digits), `S.stv` (`{wood, vent}` in the stove), `S.pan` (pancake steps done), `S.cl` (sea chest letter wheels).
- Chapter 2 fields: `S.tb` (battery directions, 1 = + towards the bulb), `S.shd` (`{d}`: Mr Nilsson's distance from the torch), `S.mrs` (`{seq}`: the Morse you're typing), `S.stn` (stones on the scale). Close-ups stay as the player left them.
- Chapter 3 fields: `S.rl` (the desk padlock's digits), `S.nn` (lines marked on the blackboard), `S.reg` (names put in the register so far), `S.bug` (creatures ticked as insects), `S.frc` (cake puzzle round: 0 or 1). Flag `snow3`: after the bell the holidays fly by and the first snow falls (the bridge to the winter chapter).
- Chapter 4 fields: `S.frt` (the fort's row offsets, 0 or 1, top row first), `S.wrm` (keeping Annika warm: round 0 or 1), `S.ang` (`{a}`: the throwing angle). Flags: `tracks` (mittens back), the four jobs `balls fort steps warm` (`READY4`; with all four the church clock strikes three), `out4`; also `angel`, `carrot`, `snowTaps`, `spunkTaken`.
- Chapter 5 fields: `S.chg` (coins in the change tray), `S.lgt` (`{r, on}`: lighting round and switches), `S.tee` (`{m}`: Pippi's seat on the teeterboard), `S.jug` (the clown's last three balls), `S.trp` (`{a, b}`: rope lengths), `S.gr` (`{n}`: gears in between). Flags: `tickets`, `inside`, the four checklist tasks `lights teeter juggle trapeze`, and `out5`.
- Chapter 6 fields: `S.pul` (`{n}`: ropes on the hoist), `S.hd` (`{i}`: the ship's heading, 0 = N … 5 = SW), `S.flt` (each thrown thing: `f` floats / `s` sinks), `S.stl` (parts chosen for the sun still), `S.eqr` (sextant question: 0 or 1), `S.lho` (`{from}`: deck or nest). Flags in voyage order: `aboard`, `course`, `floats`, `water` (night falls), `equator` (dawn), `out6`; items taken: `netTaken`, `sextTaken`, `glassTaken`.
- Chapter 7 fields: `S.sdl` (`{r, pick}`: sundial round and the hour clicked), `S.tdq` (`{r}`: tide question), `S.pcs` (`{w, n}`: who walks, how many paces), `S.chn` (the pictures in the chest's lock), `S.thn` (`{r, seen}`: thunder round), `S.trt` (`{on}`: which lights are on). Flags in the order of the day: `mapTaken`, `sundial`, `tide` (low tide), `paces`, `dug`, `chest` (the shower starts), `storm` (dusk), `out7`; also `spadeTaken`.
- Other keys: `pippi-villa-v1-ch2` … `-ch7` (chapters unlocked), `pippi-villa-v1-scores`, `-sound`, `-motion`, `-voice`, `-lang`, `-norotate`, `-ord` (renumbering done). Every `localStorage` access is wrapped in `try/catch`.
- A new game keeps achievements (`S.ach`).

### Dialogue
- `say(lines, done?)`; speakers: `you`, `sys` (narrator, label "Villa Villekulla", "Villa Villekulla · night" in Chapter 2, "The little school" in Chapter 3, "Villa Villekulla · winter" in Chapter 4, "The big top" in Chapter 5, "The Hoppetossa" in Chapter 6), `pippi`, `nilsson`, `horse`, `spunk`, `tommy`, `annika`, `karlsson` (Thunder-Karlsson), `bloom`, `teacher` ("Miss"; NL "Juf", SV "Fröken"), `kling`, `klang` (the policemen), `ringmaster`, `clown`, `strongman`, `seal` (no portrait), `captain` (Captain Longstocking; NL kapitein Langkous, SV kapten Långstrump), `parrot` (Chapter 7, no portrait). A new speaker needs a portrait, an entry in `WHO` and `faceFor` (core.js), a colour in the chapter's CSS (or base), and a `VOICE_STYLE`.

### Items
- `spunk` (free hint item, like the rubber duck in Hello, IT: use it on anything for the current stage's first hint, not counted), `note`, `matches`, `eggs`, `pancake`, `key`, `sugar`; Chapter 2: `spunk`, `batteries`, `torch`, `feather`; Chapter 3: `spunk`, `chalk`, `magnifier`; Chapter 4: `spunk`, `mittens`; Chapter 5: `spunk`, `tickets`; Chapter 6: `spunk`, `net`, `sextant`, `spyglass`; Chapter 7: `spunk`, `map`, `spade`. Four pockets; a chapter never needs more than four at once.

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
- Chapter 6's compass letters and names go through `tx()`: N/E/S/W are N/O/Z/W in Dutch and N/O/S/V in Swedish; port and starboard are bakboord/stuurboord and babord/styrbord. The captain calls Pippi "Pippilotta" in every language.
- Chapter 7: Turtle Islet is het Schildpadeilandje / Sköldpaddsholmen; low and high tide are eb en vloed / ebb och högvatten; the parrot says "Pluttification!" in the player's language (plutimiceren, pluttifikation). The island's title is *Het eiland in de Stille Zuidzee* / *Ön i Söderhavet*.

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


Chapter 4 (spoilers too). Kling and Klang challenge you to a snowball fight at three o'clock. Get the mittens back first; then the four jobs in any order; with all four the church clock strikes three:

| # | Puzzle (real idea) | Solution | Flags |
|---|---|---|---|
| 1 | Tracks in the snow (reading animal tracks) | Trail **B**: five long fingers and a thumb (the monkey), not the bird, cat or horse → mittens | `tracks` |
| 2 | Thermometers (temperatures below zero; snow sticks just below freezing) | The sunny veranda at **−1 °C** (not −9, −4 or +20); needs the mittens | `balls` |
| 3 | The fort (running bond: no joint under another joint) | Shift every other row by half a block, then Pippi pushes | `fort` |
| 4 | The icy steps (salt water stays liquid below 0 °C) | **Salt** (not warm water, sugar or more snow); the horse comes down and pulls the sledge | `steps` |
| 5 | Keeping Annika warm (trapped air) | **Three thin layers**, then **mittens** | `warm` |
| 6 | The throw (about 45° goes furthest) | Kling and Klang (or our fort): **45°**, Throw! (30° and 60° land in the same spot) | `out4` |

Chapter 5 (spoilers too). Tickets first; then the ringmaster's checklist (`TASKS5`, any order); then the winch:

| # | Puzzle (real idea) | Solution | Flags |
|---|---|---|---|
| 1 | Ticket booth (money: 4 × 3 = 12, 20 − 12 = 8) | Give 8 crowns change (e.g. 5 + 2 + 1); tickets on the ringmaster | `tickets`, `inside` |
| 2 | Lighting desk (mixing coloured light) | Yellow = red + green; cyan = green + blue; white = all three | `lights` |
| 3 | Teeterboard (a lever: weight × distance) | Strongman 90 kg × 1 m = Pippi 30 kg × **3 m** | `teeter` |
| 4 | The clown (a repeating pattern) | R B B R B B R → **B B R** | `juggle` |
| 5 | Trapezes (a pendulum's rhythm depends on its length, not its weight) | Make both ropes the same length | `trapeze` |
| 6 | Curtain winch (touching gears turn opposite ways) | **2** gears in between (crank ↻ → drum ↺); needs the whole checklist | `out5` |

Chapter 6 (spoilers too). A voyage in legs: the quay, open sea by day, the Equator at night, the island at dawn. Each puzzle opens the next leg:

| # | Puzzle (real idea) | Solution | Flags |
|---|---|---|---|
| 1 | Cargo hoist (pulleys: more ropes, less pulling each) | Horse 400 kg, you can pull 100 kg: **4 ropes** | `aboard` |
| 2 | The wheel (compass points; north is up on a chart) | Chart in the cabin: the island is down-left. Turn to **south-west** (5 × starboard), Set sail → the sails drop, the quay slides away | `course` |
| 3 | Overboard (floating depends on what it's made of, not size) | Net from the hold on the sea: the log, apple and cork float; key, coin and marble sink | `floats` |
| 4 | Fresh water (evaporation and condensation; the salt stays behind) | Water barrel: bowl, cup, lid, pebble, sun (not shade, not salt) → night falls | `water` |
| 5 | The Equator (the North Star's height = how far north you are) | Sextant from the instrument box on the sky: **On the Equator**, then **below the horizon** → dawn | `equator` |
| 6 | Land ho (the Earth is round: higher up, you see further) | Spyglass from its hook by the wheel; crow's nest: "The Earth is round…" | `out6` |

Chapter 7 (spoilers too). A day on the island: morning, low tide, a tropical shower, dusk. Each puzzle moves the day on:

| # | Puzzle (real idea) | Solution | Flags |
|---|---|---|---|
| – | Wake the king | Click Captain Longstocking in the hammock → the treasure map | `mapTaken` |
| 1 | The sundial (a shadow points away from the sun; shortest at noon) | Click the **9**; then **It is shortest** | `sundial` |
| 2 | The tide post (about 6 hours from high to low tide; the Moon pulls the sea) | **3 o'clock**; then **The Moon pulls on it** → low tide, the sandbar comes up | `tide` |
| 3 | The captain's map (everybody's pace is a different length: that's why we have metres) | Map on Turtle Islet: 12 m = Pippi **24**, Tommy 30, Annika 40 or the horse 6 paces; then the spade (by the hut) on the X | `paces`, `dug` |
| 4 | The chest's lock (a food chain starts with the Sun) | **Sun → seaweed → crab → octopus** (not the coconut) → the shower starts | `chest` |
| 5 | The thunder (light is fast; sound takes about 3 s per km) | 9 s = **3 km**; then 3 s: **closer, into the hut** → dusk | `storm` |
| 6 | The turtle nest (hatchlings crawl to the brightest light) | Switch off the torch by the nest, the torch on the dunes and the hut's lantern; keep the feast torches behind the hut on | `out7` |

Achievements: `spunk` (used the spunk), `egghead` (egg on your head), `ceiling` (tossed the pancake), `lift` (click the horse once the door is unlocked), `drawers` (opened all 9 little drawers), `nilsson` (clicked Mr Nilsson 3 times), `shake` (shook Pippi 3 times), `giant` (a shadow of 5 m or more: 24 cm or closer), `venus` (clicked Venus), `quarter` (picked the quarter as the biggest piece), `freckles` (magnifying glass on Pippi), `snowangel` (clicked the fresh snow), `carrot` (clicked the snowman 3 times: the horse eats its nose), `ownhead` (threw a snowball straight up), `honk` (honked the clown's nose 3 times), `lightsout` (shone with every light off), `flyer` (Pippi at 4 m on the teeterboard), `tasted` (drank the sea water), `closehorse` (spyglass on the horse), `neptune` (clicked Pippi between the Equator and the island), `bonk` (shook the coconut palm 3 times), `soaked` (said the storm was going away), `polly` (clicked the parrot 3 times).

## Gotchas

Everything in the blueprint's "Lessons learned" applies. In particular:
- `[hidden]{display:none!important}` in `base.css` must stay.
- CSS class names are global; search `css/` first (`.chart`, `.hand`, `.secret`, `.wheel`, `.pstep`… are taken).
- **Motion:** every moving part is a **CSS animation** (no SMIL), so the kill-switch (the last rule in `animations.css`) stops them all for "Motion off" and for devices that ask for reduced motion (unless the player picks "Motion on"). In JS, use `reducedMotion()`. Things that only exist while moving (the bird, the shooting star) start off-screen or invisible, so they disappear when motion is off. `tests/motion.spec.js` checks that nothing in either room moves with Motion off.
  - Kitchen (`css/chapter1.css`): the flags sway, the fire flickers, steam rises from the pan once it's lit (`#vk-steam`), Mr Nilsson bobs and swishes his tail, the horse nods, the curtains move in the breeze, clouds drift and a bird flies past (inside the window's `vkWinClip`), Tommy and Annika wave at the gate, the spunk crawls about its jar.
  - Bedroom (`css/chapter2.css`): stars twinkle, the moon glows, a shooting star now and then, the burglars sneak and their lantern flickers, the shadow at the door fiddles with the lock, Pippi and Mr Nilsson breathe in their sleep, Pippi snores (z z z), Tommy's window flashes (`.flashing`, after SOS until you decode it), and the burglars' legs dangle from the wardrobe.
  - Classroom (`css/chapter3.css`): the horse munches the flowerbed in the schoolyard, Miss watches the class through the little window in the door (`#sl-teacher`, until the holidays start; she has her own hotspot `teacher3`), Pippi's plaits bob, clouds drift past the window, the clock's second hand ticks, Pippi's plaits bob, Mr Nilsson bobs, the spunk crawls about its jar. Once `snow3`, snow falls outside the window (`.sl-flake`) and the schoolyard turns white (`#sl-white`, fading in over a few seconds with the class `sl-firstsnow`).
  - Snowy garden (`css/chapter4.css`): snow falls (`.wt-flake`), smoke puffs from the chimney, the veranda's fairy lights blink, the horse nods, the snowman's scarf flaps, sparrows hop at the bird feeder, Mr Nilsson peeks from the oak (once found), Annika shivers (until `warm`), Pippi's plaits swing, Kling and Klang stamp their feet; at `out4` the white flag waves and snowballs fly across the garden (`.wt-fly`, which start off-screen). The close-up throw draws its arc (`.wt-arc`).
    - Where everybody stands is a class on `#sc-winter` set by `applyWinter()`: `wt-steps` (the sledge, `#wt-team`, moves from in front of the veranda to behind our fort), `wt-ready` (the children hide behind our fort), `wt-won` (they pop up and throw; Pippi's giant snowball, `#wt-bigball`, sits on the policemen's fort). The one-off moves are classes added for a few seconds by `move4()` (skipped with Motion off): `wt-walk` (the horse walks down the steps, turns, and pulls the sledge to the fort), `wt-run` (the children run to the fort), `wt-roll` (the giant snowball rolls across).
  - Big top (`css/chapter5.css`): the spotlights sweep (and meet in the middle, white, once `lit`), the horse (drawn like the Chapter 3 horse) trots round the left, front part of the ring (`ccTrot`: front facing right, far side smaller and facing left; it keeps clear of the teeterboard and the clown) with a real trot: each leg is an upper leg (`.hleg`, swings at the hip/shoulder) and a lower leg (`.shin`, folds at the knee), diagonal pairs (`a`: near fore + far hind, `b`: far fore + near hind) half a stride apart, and the body bobs (`.hbody`), the trapezes swing out of time (until `synced`), the bulbs round the sign chase, flags and bunting wave, the seal bounces its ball, the ringmaster waves his cane, the clown juggles (once `juggle`), and at `showtime` the curtain opens, confetti falls and Pippi rides the horse. The close-ups move too: swinging trapezes (their speed follows the rope length), spinning gears, the tilting teeterboard.
  - The Hoppetossa (`css/chapter6.css`), a cut-away ship (deck, rigging, the captain's cabin, the galley, the hold): she bobs at the quay (`hpBob`) and rocks at sea (`.sailing`, `hpRock`), wave crests roll past (faster at sea), clouds drift, gulls circle the harbour, fish and a jellyfish swim, the flag flutters, the cabin lamp and Mr Nilsson (by his tail) swing, the horse nods, Pippi's plaits and legs swing on the bowsprit, the wheel turns, and the spunk crawls. In the harbour it's winter in Sweden: a grey sky (`#hp-wintersky`), snow on the roofs and the quay, and falling snow (`.hp-flake`, clipped above the waterline); casting off fades the snow behind the ship and the sun comes out. Casting off (`.castoff`, `castOff6()`) drops the sails (`hpUnfurl`) and slides the harbour away (`hpLeave`); then the sails fill (`hpFull`), spray flies at the bow, and dolphins and a whale's spout appear (they only exist while moving). Night brings twinkling stars and lantern glow; at the island the palms sway.
  - The island (`css/chapter7.css`): the Hoppetossa bobs at anchor, palms sway (wildly in the shower), clouds drift, the sun's rays turn, the parrot shifts on its perch and flaps, the captain's hammock sways and his zzz float up, Mr Nilsson climbs, crabs scuttle, the foam laps, Pippi wobbles in her handstand, the horse nods; a frigate bird and a dolphin only exist while moving. Low tide (`.lowtide`) slides the high water away (a transition); the shower (`.storm`) brings rain and lightning (both invisible when still); dusk (`.dusk`) brings stars, the moon's path, torches and a lantern; at the end (`.hatch`) the baby turtles scurry to the sea.
  - **Coming and going:** the `applyX()` functions show and hide things with `show = vis` (`vis()` in `core.js`), so nothing pops: things fade in and out (`.vis-in`/`.vis-out` in `base.css`), big changes of light use the slow fade (`data-in="vis-slow-in" data-out="vis-slow-out"` on the sky layers of the ship and the island), and an element can name its own entrance or exit with `data-in`/`data-out` (the kitchen horse trots out of the door's window, `vk-horse-off`; the ship's island grows up from the tip on the horizon, `hp-isle-in`). It switches at once on the first draw, when the room changes or a new game starts, on the title screen, with Motion off, for hotspots, and for elements that already have an animation of their own. Changes made while a close-up is open wait and play when it closes (`visFlush()` in `closeModal()`).
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
  - **Thunder-Karlsson and Bloom** (NL Donder-Karlsson en Blom, SV Dunder-Karlsson och Blom): the burglars. Karlsson is big and bossy, Bloom small and jumpy. Silly, never scary.
  - **Kling and Klang** (NL Kling en Klang, SV Kling och Klang): the policemen. Friendly and a bit pompous; Kling is tall and serious (mostly), Klang round and jolly. In Chapter 4 they are the "snowball champions of the whole police station" and good losers.
  - **Miss** (NL de juf, SV fröken): the teacher at the little school. Kind, a bit strict, very fond of her geraniums; secretly delighted by Pippi.
  - **The ringmaster** (NL de directeur, SV direktören): top hat, moustache, panics easily. **The clown**: sniffy, says "Honk!". **The strongman**: big, proud and gentle, until Pippi lifts him. The trapeze act is the Flying Svenssons (Sofia and Sven).
  - **Captain Efraim Longstocking** (NL kapitein Efraïm Langkous, SV kapten Efraim Långstrump): Pippi's father, huge, red-bearded, loud and jolly; king of an island in the South Seas; calls Pippi "Pippilotta" and everybody else "sailor".
- Running jokes: two times three makes four, eighteen kilos of sweets, thing-searching, sleeping with feet on the pillow, the suitcase of gold (and the burglars who want it), pluttification, Pippi coming to school only for the holidays.
- Don't copy text, songs or illustrations from the books or films; write our own and draw our own.
- Every puzzle needs two hints in `HINTS`: a nudge, then the answer. Every English line needs a Dutch and a Swedish line.

## Ideas for next chapters

8. Home again to Villa Villekulla (Pippi sails home; the horse is glad to see its veranda). Follow the blueprint's "Adding a chapter" checklist. The Hoppetossa in the lagoon (`ship7`) is the natural exit from the island to Chapter 8 (add it to `exitLabels()`).

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
