# Villa Villekulla: Locked In with Mr Nilsson

A browser-based point-and-click escape room in Pippi Longstocking's kitchen. An unofficial fan game, inspired by Astrid Lindgren's books, and built the same way as [*Hello, IT*](https://github.com/w3nl/it).

You came to play at Pippi's house. Pippi has gone to town to buy eighteen kilos of sweets, and Mr Nilsson, her monkey, has locked the front door and climbed onto the bureau with the key. Tommy and Annika are waiting at the gate. Get out!

Every puzzle teaches something real, for children of about 8 to 12.

## Play

The game speaks **UK English**, **Dutch** (*Pippi Langkous* in *Villa Kakelbont*) and **Swedish**, Pippi's own language (*Pippi Långstrump*, with Herr Nilsson and Lilla Gubben). Switch with the **EN · NL · SV** button; it starts in Dutch or Swedish when your browser is set to one of them. Turn on **Voices** to hear the dialogue read aloud.

Play online once GitHub Pages is on (Settings → Pages → deploy from `main`).

To play locally, serve the folder with any static web server. With Node.js:

```bash
npm start
```

Then open http://127.0.0.1:4173. Double-clicking `index.html` doesn't work, because the game loads its room drawing from `scenes/`.

Stuck? Press **Hint** (first a nudge, then the answer), or pick up the spunk from the windowsill and show it something: it gives a free nudge.

## Chapters

1. **Locked in with Mr Nilsson** (the kitchen of Villa Villekulla): mirror writing, sums, what a fire needs, steps in the right order, signal flags, feeding a horse.
2. **Burglars in the night** (Pippi's bedroom): two burglars are after Pippi's gold, and Pippi won't wake up. Batteries in a torch, shadows, the North Star, Morse code and a balance scale.
3. **Pippi goes to school** (the classroom): on the last day before the summer holidays, the teacher turns the classroom into an escape room. Alphabetical order, fractions, a frog's life cycle, grid references and the 9-times finger trick.

More chapters are planned (the circus, the *Hoppetossa*, the South Sea island). See [AGENTS.md](AGENTS.md).

## Install it as an app

It's a Progressive Web App: install it from the game's **Install** button or your browser's menu (on iPhone: Share → Add to Home Screen). After the first visit it works offline. The version number is at the bottom of the title screen; when a new version is out, a bar offers to reload (your progress is kept).

## Saved progress

Progress is saved in your browser after every step. Press **Continue** to carry on. **Scores** shows your best time, fewest hints, rank and achievements.

## Working on the game

Start with [AGENTS.md](AGENTS.md) (how it fits together, the puzzle solutions, the gotchas) and [docs/escape-room-blueprint.md](docs/escape-room-blueprint.md) (the general recipe). Ideas go through the **Idea** issue form and the AI agent workflow in [docs/agent-workflow.md](docs/agent-workflow.md).

## Tests

```bash
npm install
npx playwright install chromium
npm test
```

The tests play the whole chapter in a real browser, and check saving, scores, the installable app and offline mode, phone layouts, and the Dutch and Swedish versions. Node.js 26 (see `.nvmrc`).

## Licence

GPL-3.0 for this project's own code, drawings and text. *Pippi Longstocking* and its characters belong to their rights holders; this is a non-commercial fan project, not affiliated with or endorsed by them.
