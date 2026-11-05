// Start-up: inserts the room drawings (scenes/*.svg) into the stage, then loads the game scripts in order.
// Scenes are fetched, so the game must be served over http(s): GitHub Pages, `npm start`, or any static server.
const GAME_VERSION = 13;   // shown on the title screen; the same number as CACHE in sw.js
(async () => {
  const scenes = ['kitchen', 'bedroom', 'school', 'winter', 'circus', 'ship', 'island'];
  const scripts = ['i18n', 'core', 'chapter1', 'items', 'chapter2', 'chapter3', 'chapter4', 'chapter5', 'chapter6', 'chapter7', 'hints', 'ambience', 'voice', 'app'];
  const title = document.getElementById('title');
  try {
    if (location.protocol === 'file:') throw new Error('file');
    const svgs = await Promise.all(scenes.map(n => fetch(`scenes/${n}.svg`).then(r => { if (!r.ok) throw new Error(n); return r.text(); })));
    const fade = document.getElementById('fade');
    svgs.forEach(svg => fade.insertAdjacentHTML('beforebegin', svg));
    for (const name of scripts) {
      await new Promise((resolve, reject) => {
        const el = document.createElement('script');
        el.src = `js/${name}.js`; el.async = false; el.onload = resolve; el.onerror = () => reject(new Error(name));
        document.body.appendChild(el);
      });
      if (name === 'i18n') await langReady;   // the translated text has to be there before the game draws anything
    }
    title.classList.remove('loading');
  } catch (e) {
    title.classList.remove('loading');
    title.querySelectorAll('.row').forEach(el => el.hidden = true);
    const p = title.querySelector('p.keep');
    p.innerHTML = 'Pippi says: this game needs a web server, not a double-click. Run <b>npm start</b> and open http://127.0.0.1:4173.';
    console.error('Villa Villekulla could not start:', e);
  }
})();
