// Chapter 5: On board the Hoppetossa. Captain Efraim, Pippi's father, is sailing her to his island in the South Sea,
// but Mr Nilsson has "tidied up": the chart is overboard, the compass is wrong and the fresh water is gone.
// Loaded in order by js/boot.js; all game files share the same global scope.

const UNLOCK5 = KEY + '-ch5';
function unlocked5(){ try{ if(localStorage.getItem(UNLOCK5) === '1') return true; }catch(e){} return S.ch >= 5 || (S.ch === 4 && !!S.f.out4); }
function setUnlocked5(){ try{ localStorage.setItem(UNLOCK5, '1'); }catch(e){} }

/* ---------- Chapter 5 items ---------- */
Object.assign(ITEMS, {
  chart: { name:"Captain Efraim's chart", desc:'A sea chart, a bit damp, with squares on it. Mr Nilsson has eaten a banana over it.',
    svg:'<svg viewBox="0 0 44 44"><rect x="6" y="9" width="32" height="26" rx="2" fill="#f3e6c4" stroke="#b5651d" stroke-width="1.5"/><path d="M14 9v26M22 9v26M30 9v26M6 18h32M6 26h32" stroke="#c9b48a" stroke-width="1"/><circle cx="31" cy="13" r="3" fill="#5aa04a"/><circle cx="17" cy="29" r="4" fill="#8a5a2b" opacity=".5"/></svg>' },
  freshwater: { name:'A bucket of fresh water', desc:'Fresh water from the sun still: no salt in it at all. Somebody on board is very thirsty.',
    svg:'<svg viewBox="0 0 44 44"><path d="M10 14h24l-3 22H13z" fill="#9aa0a6" stroke="#5a6068" stroke-width="1.5"/><ellipse cx="22" cy="14" rx="12" ry="3" fill="#7cc6f0"/><path d="M10 14q12-12 24 0" stroke="#5a6068" stroke-width="1.5" fill="none"/><path d="M20 22q2 4 0 6" stroke="#fff" stroke-width="1.5" fill="none"/></svg>' }
});

/* What has to happen before the bell can be rung for "land ahoy". */
const ready5 = () => !!(S.f.course && S.f.knots && S.f.water);

/* ---------- the deck ---------- */
function applyShip(){
  const show = (sel, on) => { const el = $(sel); if(el) el.style.display = on ? '' : 'none'; };
  show('#hp-spunk', !S.f.spunkTaken); show('#hit-spunk5', !S.f.spunkTaken);
  const sc = $('#sc-ship'); if(!sc) return;
  sc.classList.toggle('sailing', !!S.f.course);   // the sails fill, the spray flies at the bow
  sc.classList.toggle('landho', !!S.f.out5);      // the island rises on the horizon
  sc.classList.toggle('watered', !!S.f.water);    // the horse stops drooping and nods happily
  show('#hp-floaters', !S.f.net);
  show('#hp-magnet', !S.f.compass);
  show('#hp-still', !!S.f.still && !S.f.water);
  show('#hp-tongue', !S.f.water);
  show('#hp-spray', !!S.f.course);
  show('#hp-island', !!S.f.out5);
  show('#hp-jib', !S.f.out5); show('#hp-furled', !!S.f.out5);
  const needle = $('#hp-needle');
  if(needle) needle.setAttribute('transform', S.f.compass ? '' : 'rotate(150 406 322)');
}

/* ---------- hotspot handlers ---------- */
Object.assign(H, {
  spunk5(){ S.f.spunkTaken = true; give('spunk'); applyVisuals(); say(["The spunk's jam jar, tied to a crate so it can't roll overboard.", "Pippi says a ship should always have a spunk on board, for luck. You take it. A spunk knows things. Even about the sea."]); },
  captain(){
    if(S.f.out5) return say([['captain', "Land ahoy! My island! Pippi, my girl, you're a born sea captain."]]);
    if(S.inv.includes('chart') && !S.f.chart) return openChart();
    if(!S.f.net) return say([['captain', "My chart! Where's my chart? Without it I'll never find my island. Islands are very small, and the sea is very big."], ['nilsson', "Eek!"], ['pippi', "Mr Nilsson put it in a bottle and threw it overboard. He's been tidying up."], ['captain', "Then fish it out, quick, before it floats away! Tommy has the big net at the bow."]]);
    if(!S.f.compass) return say([['captain', "We know where the island is, but the compass has gone mad. It says north is behind us! Something is pulling at the needle."]]);
    if(!S.f.course) return say([['captain', "The compass is working again. Now take the wheel and steer north-east, the way the chart says."]]);
    if(!S.f.water) return say([['captain', "We're on course! But the horse looks terribly thirsty. And somebody had a bath in the drinking water…"], ['nilsson', "Eek."]]);
    if(!S.f.knots) return say([['captain', "When will we get there? Throw the log line off the back of the ship and see how fast we're sailing."]]);
    say([['captain', "Three hours, then we'll see land. When it's three o'clock, ring the ship's bell, so the whole crew knows."]]);
  },
  wheel(){
    if(S.f.course) return say("The wheel is lashed with a rope, so the Hoppetossa keeps sailing north-east all by herself.");
    if(!S.f.chart) return say([['captain', "Steer? Steer where? First we need to know where the island is. My chart is somewhere in the sea."]]);
    if(!S.f.compass) return say(["You turn the wheel, and the compass needle doesn't follow. It just keeps pointing at the side of the binnacle.", ['captain', "That compass is bewitched! Something is pulling the needle."]]);
    openWheel();
  },
  binnacle(){
    if(S.f.compass) return say("The compass needle swings gently and points north, as a compass should. The ship turns around it.");
    openBinnacle();
  },
  barrel(){
    if(S.f.water) return say("The horse has drunk the bucket dry. The sun still keeps dripping: one drop, then another.");
    if(S.f.still) return say("The sun still is dripping away. You already have a bucket of fresh water: someone on board is very thirsty.");
    openStill();
  },
  horse5(){
    S.f.neighs = (S.f.neighs || 0) + 1; save();
    if(S.f.water) return say([['horse', "Neeeigh!"], "The horse has had a drink and is very happy. It is wearing its sailor's hat at a jaunty angle."]);
    say([['horse', "…"], "The horse is staring at the empty water barrel with its tongue out. It is SO thirsty.", ['pippi', "Don't drink the sea, horse. Seawater is salty: the more you drink, the thirstier you get."]]);
  },
  net(){
    if(S.f.net) return say("The net is empty and dripping. Everything that floated is back on board. Everything that sank is with the fish.");
    openNet();
  },
  log(){
    if(S.f.knots) return say("The log line: 6 knots, 18 sea miles, 3 hours. The captain has written it in the ship's logbook.");
    if(!S.f.course) return say([['captain', "The log line tells us how fast we're going. But first we need to be going the right way!"]]);
    openLog();
  },
  bell5(){
    if(S.f.out5) return say("Ding-ding, ding-ding, ding-ding. Six bells: three o'clock, and land ahoy!");
    if(!ready5()){ beep(1250, .5, 'sine', .05);
      return say(["Ding! The ship's bell. On a ship, the bell tells the time.", ['captain', tx("Not yet! {left}", { left: !S.f.course ? tx('First we need to sail the right way.') : !S.f.water ? tx('First the horse needs a drink.') : tx('First find out how long the voyage will take.') })]]); }
    openBells();
  },
  cabin(){ say(["Captain Efraim's cabin: a hammock, a sea chest, and a big hook for his hat. Pippi says her father once lifted a whole whale out of the water with one hand.", "\"It was a small whale,\" says Captain Efraim. \"But a heavy one.\""]); },
  sails(){
    if(S.f.course) return say("The sails are full of wind, and the Hoppetossa is flying over the waves. Pippi painted the monkey on the mainsail herself.");
    say(["The big square sails flap and flutter. Without a course, the Hoppetossa is just going round in circles.", ['pippi', "I painted Mr Nilsson on the sail, so the wind knows which ship it is."]]);
  },
  nilsson5(){ say([['nilsson', "Eek! Eek!"], "Mr Nilsson is hanging by his tail from the top of the mast, looking very pleased with himself. He has tidied up the whole ship. Into the sea."]); },
  kids5(){
    if(S.f.out5) return say([['tommy', "Land ahoy! I saw it first!"], ['annika', "No, Pippi did. She's been looking through that telescope since Tuesday."]]);
    if(!S.f.net) return say([['tommy', "There's a bottle bobbing by the bow, and lots of other things. Mr Nilsson's tidying."], ['annika', "You can only catch the things that float. The rest have gone straight to the bottom."]]);
    say([['annika', "Pippi, are you sure your father knows the way?"], ['pippi', "Of course! He's been to his island hundreds of times. He just never remembers where it is."]]);
  },
  pippi5(){
    say(['pippi', S.f.out5 ? "Land ahoy! Hello, island! Hello, Dad's crown!" : S.f.course ? "I'm the lookout. When I see the island, I'll shout so loud the fish hear it." : "I'm the lookout. Right now I can see the sea. And more sea. And a dolphin!"]);
  }
});

/* ---------- puzzle: the net (floating and sinking) ---------- */
const OVERBOARD = [
  { k: 'cork', name: 'A cork', floats: true, svg: '<rect x="12" y="14" width="20" height="16" rx="3" fill="#c08a4a"/>' },
  { k: 'coin', name: 'A gold coin', floats: false, svg: '<circle cx="22" cy="22" r="11" fill="#f2c94c" stroke="#b07f1f" stroke-width="2"/>' },
  { k: 'apple', name: 'An apple', floats: true, svg: '<circle cx="22" cy="24" r="11" fill="#d62828"/><path d="M22 13v-5" stroke="#5a3a1a" stroke-width="2"/><path d="M23 10q6-4 8 1q-5 2-8-1z" fill="#3f8a4a"/>' },
  { k: 'marble', name: 'A glass marble', floats: false, svg: '<circle cx="22" cy="22" r="9" fill="#7cc6f0" opacity=".85"/><path d="M17 20q5-6 10 0" stroke="#fff" stroke-width="2" fill="none"/>' },
  { k: 'bottle', name: 'A corked bottle with paper inside', floats: true, svg: '<rect x="10" y="16" width="20" height="12" rx="5" fill="#9fd6b0"/><rect x="29" y="19" width="6" height="6" fill="#9fd6b0"/><rect x="34" y="18" width="4" height="8" fill="#b07a3a"/><rect x="13" y="18" width="12" height="8" fill="#f3efe3"/>' },
  { k: 'spoon', name: 'A metal teaspoon', floats: false, svg: '<ellipse cx="14" cy="22" rx="6" ry="4" fill="#c0c6cc"/><path d="M19 22h18" stroke="#c0c6cc" stroke-width="3" stroke-linecap="round"/>' },
  { k: 'ladle', name: 'A wooden spoon', floats: true, svg: '<ellipse cx="12" cy="22" rx="7" ry="5" fill="#b07a3a"/><path d="M18 22h20" stroke="#b07a3a" stroke-width="4" stroke-linecap="round"/>' },
  { k: 'pebble', name: 'A pebble', floats: false, svg: '<ellipse cx="22" cy="24" rx="12" ry="8" fill="#8a8a8a"/><ellipse cx="18" cy="21" rx="4" ry="2" fill="#aaa"/>' }
];
function openNet(){
  const st = S.flt || (S.flt = []);
  openModal('The fishing net', 'Mr Nilsson has tidied things overboard', `
    <p class="flag-p">${tx('Tommy can scoop up everything that is still floating. Things that sink have gone down to the bottom of the sea already. Which ones are floating? Tick them, then scoop.')}</p>
    <div class="ob-grid" id="ob-grid">${OVERBOARD.map((o, i) => `<button type="button" class="ob" data-i="${i}" aria-pressed="false"><svg viewBox="0 0 44 44" aria-hidden="true">${o.svg}</svg><span>${tx(o.name)}</span></button>`).join('')}</div>
    <div class="row-btns"><button type="button" class="btn" id="ob-go">${tx('Scoop with the net!')}</button></div>
    <div class="feedback" id="ob-fb"></div>`, () => {
    const fb = $('#ob-fb');
    const draw = () => document.querySelectorAll('.ob').forEach(b => { const on = st.includes(+b.dataset.i); b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    draw();
    document.querySelectorAll('.ob').forEach(b => b.onclick = () => { const i = +b.dataset.i, at = st.indexOf(i); if(at < 0) st.push(i); else st.splice(at, 1); save(); beep(700, .03); draw(); });
    $('#ob-go').onclick = () => {
      const sinker = st.map(i => OVERBOARD[i]).find(o => !o.floats);
      const missed = OVERBOARD.filter(o => o.floats && !st.includes(OVERBOARD.indexOf(o)));
      if(!sinker && !missed.length){
        S.f.net = true; S.flt = []; save(); give('chart'); applyVisuals(); chord([523, 659, 784, 1046]);
        fb.className = 'feedback good'; fb.textContent = tx('Got them all! Wood, cork and apples are light for their size, so they float. The glass bottle floats because it is full of air. That\'s why a big wooden ship floats too: it is full of air inside.');
        setTimeout(() => { closeModal(); say(["Tommy swings the net on board: a cork, an apple, a wooden spoon and a bottle. Inside the bottle is a rolled-up paper.", ['captain', "My chart! Mr Nilsson, you rascal!"], ['nilsson', "Eek!"], ['pippi', "Show it to Dad. He's the only one who can read his own handwriting."]]); }, 2200);
        return;
      }
      nope(); fb.className = 'feedback bad';
      if(sinker) return fb.textContent = tx('Plop! The net comes up empty there: {thing} sank to the bottom straight away. Things that are heavy for their size sink.', { thing: tx(sinker.name).toLowerCase() });
      fb.textContent = tx(missed.some(o => o.k === 'bottle') ? "Something is still bobbing by the bow: the bottle! Glass sinks, but this one is corked and full of air." : 'Something you didn\'t tick is still bobbing on the waves. Look again: which things are light for their size?');
    };
  });
}

/* ---------- puzzle: the compass (a compass needle is a magnet; iron, steel and magnets pull it) ---------- */
const BINNACLE_THINGS = [
  { k: 'magnet', name: "Mr Nilsson's toy magnet", pull: 110, svg: '<path d="M14 10a10 10 0 0 1 16 0v14h-6v-12a3 3 0 0 0-4 0v12h-6z" fill="#e2483d" transform="rotate(180 22 20)"/><rect x="14" y="26" width="6" height="5" fill="#c0c6cc"/><rect x="24" y="26" width="6" height="5" fill="#c0c6cc"/>' },
  { k: 'banana', name: 'A banana', pull: 0, svg: '<path d="M8 14q4 20 28 16q-20-2-24-18z" fill="#f2c94c" stroke="#b07f1f" stroke-width="1.5"/>' },
  { k: 'horseshoe', name: "The horse's spare horseshoe (iron)", pull: 50, svg: '<path d="M12 34V20a10 10 0 0 1 20 0v14" stroke="#6a6e74" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="12" cy="26" r="1.2" fill="#fff"/><circle cx="32" cy="26" r="1.2" fill="#fff"/>' },
  { k: 'candle', name: 'A brass candlestick', pull: 0, svg: '<rect x="19" y="8" width="6" height="16" fill="#fffaf0"/><path d="M22 4q3 3 0 5q-3-2 0-5z" fill="#f2a13a"/><path d="M14 36h16l-4-6h-8zM20 24h4v6h-4z" fill="#d9a83a"/>' },
  { k: 'tin', name: 'A tin of sardines (steel)', pull: 30, svg: '<rect x="8" y="14" width="28" height="16" rx="6" fill="#9aa0a6" stroke="#5a6068" stroke-width="1.5"/><path d="M14 22h16" stroke="#5a6068" stroke-width="1.5"/><path d="M32 14l4-4" stroke="#5a6068" stroke-width="2"/>' },
  { k: 'rope', name: 'A coil of rope', pull: 0, svg: '<circle cx="22" cy="22" r="11" fill="none" stroke="#d9c79a" stroke-width="5"/><circle cx="22" cy="22" r="4" fill="none" stroke="#d9c79a" stroke-width="4"/>' }
];
function openBinnacle(){
  const st = S.bin || (S.bin = []);   // the things you have taken away
  openModal("The ship's compass", 'North should be straight ahead… or should it?', `
    <div class="bin5">
      <svg class="compass-svg" translate="no" viewBox="0 0 160 160" aria-hidden="true"><circle cx="80" cy="80" r="74" fill="#f3efe3" stroke="#c9952a" stroke-width="8"/>
        ${['N', 'E', 'S', 'W'].map((d, i) => `<text x="${80 + 54 * Math.sin(i * Math.PI / 2)}" y="${86 - 54 * Math.cos(i * Math.PI / 2)}" text-anchor="middle" font-size="18" font-weight="700" fill="${i ? '#1f2a5c' : '#c4302b'}">${dirShort(d)}</text>`).join('')}
        <g id="bn-needle" class="bn-needle"><path d="M80 24 l9 56 h-18z" fill="#c4302b"/><path d="M80 136 l9 -56 h-18z" fill="#1f2a5c"/></g><circle cx="80" cy="80" r="6" fill="#c9952a"/></svg>
      <div class="bin-side">
        <p class="flag-p">${tx('The needle of a compass is a little magnet, and it always turns to point north. Unless something else is pulling it! Take away everything near the compass that pulls a magnet.')}</p>
        <div class="ob-grid small" id="bn-grid">${BINNACLE_THINGS.map((o, i) => `<button type="button" class="ob" data-i="${i}" aria-pressed="false"><svg viewBox="0 0 44 44" aria-hidden="true">${o.svg}</svg><span>${tx(o.name)}</span></button>`).join('')}</div>
      </div>
    </div>
    <div class="row-btns"><button type="button" class="btn" id="bn-go">${tx('Check the compass')}</button></div>
    <div class="feedback" id="bn-fb"></div>`, () => {
    const fb = $('#bn-fb');
    const draw = () => {
      document.querySelectorAll('#bn-grid .ob').forEach(b => { const off = st.includes(+b.dataset.i); b.classList.toggle('gone', off); b.setAttribute('aria-pressed', off); });
      const pull = BINNACLE_THINGS.reduce((a, o, i) => a + (st.includes(i) ? 0 : o.pull), 0);
      $('#bn-needle').style.transform = `rotate(${Math.min(170, pull)}deg)`;
    };
    draw();
    document.querySelectorAll('#bn-grid .ob').forEach(b => b.onclick = () => { const i = +b.dataset.i, at = st.indexOf(i); if(at < 0) st.push(i); else st.splice(at, 1); save(); beep(500, .03); draw(); });
    $('#bn-go').onclick = () => {
      const left = BINNACLE_THINGS.filter((o, i) => o.pull && !st.includes(i));
      const extra = BINNACLE_THINGS.filter((o, i) => !o.pull && st.includes(i));
      if(!left.length && !extra.length){
        S.f.compass = true; save(); applyVisuals(); chord([523, 659, 784, 1046]);
        fb.className = 'feedback good'; fb.textContent = tx('The needle swings round and points north! Magnets pull iron and steel, and other magnets. Bananas, rope and brass don\'t bother a compass at all.');
        setTimeout(() => { closeModal(); say([['captain', "North is north again! Now we can steer."], ['nilsson', "Eek?"], "Mr Nilsson looks sadly at his magnet. Pippi gives him the banana instead."]); }, 2200);
        return;
      }
      nope(); fb.className = 'feedback bad';
      if(left.length) return fb.textContent = tx(left.length === BINNACLE_THINGS.filter(o => o.pull).length ? 'The needle still points the wrong way. Something near it is pulling it: what does a magnet pull?' : 'Better, but the needle is still pulled a little to one side. Magnets don\'t only pull magnets: they pull iron and steel too.');
      fb.textContent = tx('The needle points north, but you took away {thing} for nothing: a magnet doesn\'t pull that. Put it back where it was.', { thing: tx(extra[0].name).toLowerCase() });
    };
  });
}

/* ---------- puzzle: the chart (grid references, and north is at the top of a map) ---------- */
const CHART_COLS = ['A', 'B', 'C', 'D', 'E', 'F'], CHART_ROWS = 5;
const ISLAND_SQ = 'E1', SHIP_SQ = 'B4';
const DIRS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
/* The short compass letters in each language (not translated as text: a lone "E" appears elsewhere too). */
const dirShort = d => (LANG === 'nl' ? { NE: 'NO', E: 'O', SE: 'ZO', S: 'Z', SW: 'ZW' } : LANG === 'sv' ? { NE: 'NO', E: 'O', SE: 'SO', SW: 'SV', W: 'V', NW: 'NV' } : {})[d] || d;
const DIR_NAME = { N: 'north', NE: 'north-east', E: 'east', SE: 'south-east', S: 'south', SW: 'south-west', W: 'west', NW: 'north-west' };
function openChart(){
  const st = S.chr || (S.chr = { r: 0 });
  openModal("Captain Efraim's chart", 'Columns A to F across the top, rows 1 to 5 down the side', `
    <div class="chart5"><svg class="chart-svg" translate="no" viewBox="0 0 380 250" id="chart-svg"></svg></div>
    <div class="ch5-ask" id="ch5-ask"></div>
    <div class="row-btns dirs" id="ch5-dirs" hidden>${DIRS.map(d => `<button type="button" class="btn ghost dirb" data-d="${d}">${tx(DIR_NAME[d])}</button>`).join('')}</div>
    <div class="feedback" id="ch5-fb"></div>`, () => {
    const fb = $('#ch5-fb'), X0 = 40, Y0 = 30, W = 48, Hh = 42;
    const smudges = ['C2', 'E1', 'D3', 'F4', 'A2'];
    const pos = sq => [X0 + CHART_COLS.indexOf(sq[0]) * W + W / 2, Y0 + (+sq[1] - 1) * Hh + Hh / 2];
    const draw = () => {
      let g = `<rect width="380" height="250" fill="#f3e6c4"/><rect x="${X0}" y="${Y0}" width="${W * 6}" height="${Hh * 5}" fill="#bfe0ee"/>`;
      CHART_COLS.forEach((c, i) => g += `<text x="${X0 + i * W + W / 2}" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="#5a3a1a">${c}</text>`);
      for(let r = 1; r <= CHART_ROWS; r++) g += `<text x="24" y="${Y0 + (r - 1) * Hh + Hh / 2 + 5}" text-anchor="middle" font-size="14" font-weight="700" fill="#5a3a1a">${r}</text>`;
      for(let i = 0; i <= 6; i++) g += `<path d="M${X0 + i * W} ${Y0}v${Hh * 5}" stroke="#7aa4b8" stroke-width="1"/>`;
      for(let r = 0; r <= 5; r++) g += `<path d="M${X0} ${Y0 + r * Hh}h${W * 6}" stroke="#7aa4b8" stroke-width="1"/>`;
      // the things on the chart: rocks, a sea serpent (drawn by Pippi), the ship
      const [rx, ry] = pos('C3'); g += `<g fill="#6a6a6a"><circle cx="${rx - 8}" cy="${ry + 4}" r="6"/><circle cx="${rx + 6}" cy="${ry}" r="8"/></g>`;
      const [sx, sy] = pos('D5'); g += `<path d="M${sx - 18} ${sy + 4} q6 -14 12 0 t12 0 t10 -4" stroke="#3f8a4a" stroke-width="4" fill="none"/><circle cx="${sx + 14}" cy="${sy - 2}" r="4" fill="#3f8a4a"/>`;
      const [bx, by] = pos(SHIP_SQ); g += `<path d="M${bx - 14} ${by + 4} h28 l-5 8 h-18z" fill="#8a4424"/><path d="M${bx} ${by + 4} v-18 l12 12z" fill="#fffaf0" stroke="#5a3a1a"/>`;
      if(st.r >= 1){ const [ix, iy] = pos(ISLAND_SQ); g += `<ellipse cx="${ix}" cy="${iy + 6}" rx="16" ry="7" fill="#e9d48a"/><path d="M${ix} ${iy + 2} v-14" stroke="#8a5a2b" stroke-width="3"/><path d="M${ix} ${iy - 12} q-10 -2 -14 6 M${ix} ${iy - 12} q10 -2 14 6" stroke="#3f8a4a" stroke-width="4" fill="none"/>`; }
      if(st.r >= 2){ const [ix, iy] = pos(ISLAND_SQ); g += `<path d="M${bx + 10} ${by - 10} L${ix - 10} ${iy + 10}" stroke="#c4302b" stroke-width="3" stroke-dasharray="6 4"/>`; }
      smudges.forEach(sq => { if(st.r >= 1 && sq === ISLAND_SQ) return; const [mx, my] = pos(sq); g += `<ellipse cx="${mx}" cy="${my}" rx="20" ry="15" fill="#c9a04a" opacity=".9"/><ellipse cx="${mx - 5}" cy="${my + 3}" rx="9" ry="6" fill="#8a5a2b" opacity=".6"/><path d="M${mx + 4} ${my - 8} q8 4 10 12" stroke="#6b4423" stroke-width="2" fill="none"/>`; });
      // the compass rose: north is at the top
      g += `<g transform="translate(${X0 + W * 6 + 22} 70)"><path d="M0 -16 l5 16 h-10z" fill="#c4302b"/><path d="M0 16 l5 -16 h-10z" fill="#1f2a5c"/><text y="-20" text-anchor="middle" font-size="11" font-weight="700" fill="#c4302b">${dirShort('N')}</text></g>`;
      // clickable squares (only while looking for the island)
      if(st.r === 0) CHART_COLS.forEach((c, i) => { for(let r = 1; r <= CHART_ROWS; r++) g += `<rect class="sq" data-sq="${c}${r}" x="${X0 + i * W}" y="${Y0 + (r - 1) * Hh}" width="${W}" height="${Hh}" fill="transparent"/>`; });
      $('#chart-svg').innerHTML = g;
      $('#ch5-ask').innerHTML = st.r === 0 ? `<b>${tx('Captain Efraim:')}</b> ${tx('"My island is in square E1. But Mr Nilsson\'s banana is all over it. Which square is E1? Click it."')}`
        : `<b>${tx('Captain Efraim:')}</b> ${tx('"There it is! The Hoppetossa is in square B4. Which way must we sail to get to the island?"')}`;
      $('#ch5-dirs').hidden = st.r !== 1;
      document.querySelectorAll('#chart-svg .sq').forEach(r => r.onclick = () => {
        const sq = r.dataset.sq; beep(600, .03);
        if(sq === ISLAND_SQ){ st.r = 1; save(); chord([523, 659, 784]); fb.className = 'feedback good'; fb.textContent = tx('E1: along the top to column E, then down to row 1. You wipe off the banana, and there\'s the island!'); draw(); return; }
        nope(); fb.className = 'feedback bad';
        fb.textContent = tx(sq === 'A5' ? 'That\'s A5: the corner, a long way from the island. The letter tells you the column across the top; the number tells you the row down the side.' : 'That\'s square {sq}. First find the letter E along the top, then go down to row 1.', { sq });
      });
    };
    draw();
    document.querySelectorAll('.dirb').forEach(b => b.onclick = () => {
      const d = b.dataset.d;
      if(d === 'NE'){
        st.r = 2; S.f.chart = true; take('chart'); save(); applyVisuals(); draw(); chord([523, 659, 784, 1046]);
        fb.className = 'feedback good'; fb.textContent = tx('North-east! On a chart, north is always at the top and east is on the right. The island is up and to the right of the ship: north-east.');
        setTimeout(() => { closeModal(); say([['captain', "North-east it is! I'll pin the chart up in my cabin, where Mr Nilsson can't reach it."], ['nilsson', "Eek!"], ['captain', "Now: the compass. And then, to the wheel!"]]); }, 2200);
        return;
      }
      nope(); fb.className = 'feedback bad';
      fb.textContent = tx(d === 'SW' ? 'South-west is exactly the wrong way: back home to Villa Villekulla! The island is up and to the right on the chart.' : 'The island is up and to the right of the ship. On a chart, north is at the top. Which direction is up AND right?');
    });
  });
}

/* ---------- puzzle: the wheel (the points of the compass; port and starboard) ---------- */
function openWheel(){
  const st = S.hd || (S.hd = { i: 4 });   // 0 = north, 1 = north-east … the ship starts out drifting south
  openModal("The ship's wheel", 'Steer the Hoppetossa north-east', `
    <div class="wheel5">
      <svg class="rose-svg" translate="no" viewBox="0 0 200 200" aria-hidden="true">
        <circle cx="100" cy="100" r="94" fill="#1f2a5c"/><circle cx="100" cy="100" r="86" fill="#f3efe3"/>
        ${DIRS.map((d, i) => { const a = i * Math.PI / 4, r = d.length > 1 ? 62 : 70; return `<text x="${100 + r * Math.sin(a)}" y="${105 - r * Math.cos(a)}" text-anchor="middle" font-size="${d.length > 1 ? 11 : 15}" font-weight="700" fill="${d === 'N' ? '#c4302b' : '#1f2a5c'}">${dirShort(d)}</text>`; }).join('')}
        <g id="wh-ship" class="wh-ship"><path d="M100 52 q16 18 14 64 h-28 q-2 -46 14 -64z" fill="#8a4424" stroke="#4e2412" stroke-width="2"/><rect x="92" y="86" width="16" height="4" fill="#fffaf0"/><circle cx="100" cy="100" r="4" fill="#5a3a1a"/></g>
      </svg>
      <div class="wh-ctl">
        <div class="wh-now" id="wh-now"></div>
        <div class="row-btns"><button type="button" class="btn ghost" id="wh-port">${tx('◀ Turn to port (left)')}</button><button type="button" class="btn ghost" id="wh-star">${tx('Turn to starboard (right) ▶')}</button></div>
        <button type="button" class="btn" id="wh-go">${tx('Steady as she goes!')}</button>
      </div>
    </div>
    <div class="feedback" id="wh-fb">${tx('Sailors say port for left and starboard for right. The chart said: sail north-east.')}</div>`, () => {
    const fb = $('#wh-fb');
    const draw = () => {
      $('#wh-ship').style.transform = `rotate(${st.i * 45}deg)`;
      $('#wh-now').innerHTML = `${tx('The Hoppetossa is heading:')} <b>${tx(DIR_NAME[DIRS[st.i]])}</b>`;
    };
    draw();
    $('#wh-port').onclick = () => { st.i = (st.i + 7) % 8; save(); beep(300, .05); draw(); };
    $('#wh-star').onclick = () => { st.i = (st.i + 1) % 8; save(); beep(360, .05); draw(); };
    $('#wh-go').onclick = () => {
      const d = DIRS[st.i];
      if(d === 'NE'){
        S.f.course = true; save(); applyVisuals(); chord([523, 659, 784, 1046]);
        fb.className = 'feedback good'; fb.textContent = tx('North-east: halfway between north and east. The wind fills the sails, and off we go!');
        setTimeout(() => { closeModal(); say(["The sails stop flapping, fill with wind with a big WHUMP, and the Hoppetossa leaps over the waves.", ['captain', "Steady as she goes! Pippi, you're a natural."], ['pippi', "I've never steered a ship before, so I knew I could."]]); }, 2200);
        return;
      }
      nope(); fb.className = 'feedback bad';
      if(d === 'SW'){ S.ach.homeward = true; save(); return fb.textContent = tx("South-west: that's the way home to Villa Villekulla! Turn the ship right round."); }
      fb.textContent = tx('We\'re heading {dir}. North-east is halfway between north (N) and east (E).', { dir: tx(DIR_NAME[d]) });
    };
  });
}

/* ---------- puzzle: the sun still (evaporation and condensation: the salt stays behind) ---------- */
const STILL_Q = [
  { q: 'Where do you put the big bowl of seawater?', opts: ['In the hot sun', 'In the shade of the sail'], ok: 0,
    why: ['', 'In the shade it stays cool, and the water hardly evaporates. The sun\'s warmth makes the water rise as vapour.'] },
  { q: 'What goes in the middle of the bowl?', opts: ['An empty cup', 'A sponge', 'The horse'], ok: 0,
    why: ['', 'The sponge soaks up the seawater, salt and all.', 'The horse doesn\'t fit in the bowl. It tried.'] },
  { q: 'What goes over the top?', opts: ['Nothing', 'Oilcloth, tied on tight', 'The fishing net'], ok: 1,
    why: ['Without a cover, the water vapour floats off into the sky. You need something to catch it.', '', 'The vapour goes straight through the holes in the net.'] },
  { q: 'Where does the pebble go?', opts: ['On the edge of the bowl', 'On the cover, right above the cup', 'Inside the cup'], ok: 1,
    why: ['Then the drops run to the edge, and drip back into the salty seawater.', '', 'In the cup, it just takes up room. The pebble has to make a low point in the cover, so the drops run there.'] }
];
function openStill(){
  const st = S.stl || (S.stl = [-1, -1, -1, -1]);
  openModal('The water barrel', 'Empty. And all around: seawater, far too salty to drink', `
    <p class="flag-p">${tx('Pippi has a plan: "We\'ll make the sun do the work." Build a sun still to get fresh water out of seawater.')}</p>
    <div class="still5">
      <svg class="still-svg" viewBox="0 0 240 150" aria-hidden="true" id="still-svg"></svg>
      <div class="still-qs" id="still-qs">${STILL_Q.map((s, i) => `<div class="sq5"><b>${tx(s.q)}</b><div class="opts">${s.opts.map((o, j) => `<button type="button" class="tog so" data-q="${i}" data-o="${j}">${tx(o)}</button>`).join('')}</div></div>`).join('')}</div>
    </div>
    <div class="row-btns"><button type="button" class="btn" id="still-go">${tx('Wait for the sun')}</button></div>
    <div class="feedback" id="still-fb"></div>`, () => {
    const fb = $('#still-fb');
    const draw = (drip) => {
      const [a, b, c, d] = st;
      let g = `<rect width="240" height="150" fill="${a === 1 ? '#c9dbe6' : '#bfe6f7'}"/>`;
      if(a === 0) g += `<circle cx="210" cy="24" r="16" fill="#ffe27a"/>`;
      if(a === 1) g += `<path d="M0 0 h240 v30 q-120 20 -240 0z" fill="#e9dcc0"/>`;
      g += `<path d="M30 80 q90 80 180 0z" fill="#1f7fb4"/><path d="M26 80 h188" stroke="#9aa0a6" stroke-width="4"/>`;
      if(b === 0) g += `<path d="M106 96 h28 l-3 24 h-22z" fill="#fffaf0" stroke="#5a6068" stroke-width="2"/>`;
      if(b === 1) g += `<rect x="104" y="92" width="32" height="16" rx="4" fill="#f2c94c"/>`;
      if(b === 2) g += `<text x="120" y="108" text-anchor="middle" font-size="22">?</text>`;
      if(c === 1) g += `<path d="M22 78 Q120 ${d === 1 ? 108 : 72} 218 78" stroke="#f3e6c4" stroke-width="5" fill="none"/><path d="M22 78 Q120 ${d === 1 ? 108 : 72} 218 78" stroke="#8a7a5a" stroke-width="1.5" fill="none"/><path d="M22 72 v12 M218 72 v12" stroke="#6b4423" stroke-width="4"/>`;
      if(c === 2) g += `<path d="M26 76 Q120 70 214 76" stroke="#8a5a2b" stroke-width="2" stroke-dasharray="3 3" fill="none"/>`;
      if(d === 0) g += `<circle cx="34" cy="74" r="6" fill="#7a7a7a"/>`;
      if(d === 1) g += `<circle cx="120" cy="${c === 1 ? 96 : 74}" r="6" fill="#7a7a7a"/>`;
      if(d === 2) g += `<circle cx="120" cy="112" r="6" fill="#7a7a7a"/>`;
      if(drip) g += `<g class="still-drip"><circle cx="120" cy="104" r="3" fill="#7cc6f0"/></g><path d="M60 70 q4 -10 0 -20 M90 66 q4 -10 0 -20 M150 66 q4 -10 0 -20 M180 70 q4 -10 0 -20" stroke="#fff" stroke-width="2" fill="none" opacity=".8"/>`;
      $('#still-svg').innerHTML = g;
      document.querySelectorAll('.so').forEach(x => x.classList.toggle('on', st[+x.dataset.q] === +x.dataset.o));
    };
    draw(false);
    document.querySelectorAll('.so').forEach(x => x.onclick = () => { st[+x.dataset.q] = +x.dataset.o; save(); beep(560, .03); fb.className = 'feedback'; fb.textContent = ''; draw(false); });
    $('#still-go').onclick = () => {
      if(st.includes(-1)){ nope(); fb.className = 'feedback bad'; fb.textContent = tx('Answer all four questions first.'); return; }
      const wrong = STILL_Q.findIndex((s, i) => st[i] !== s.ok);
      if(wrong < 0){
        S.f.still = true; S.stl = null; save(); give('freshwater'); applyVisuals(); draw(true); chord([523, 659, 784, 1046]);
        fb.className = 'feedback good'; fb.textContent = tx('The sun warms the seawater, and the water evaporates: it rises as invisible vapour and leaves the salt behind. On the cool cover, the vapour turns back into drops, which run down to the pebble and drip into the cup. Fresh water!');
        setTimeout(() => { closeModal(); say(["Pippi builds a giant sun still on top of the barrel, with the spare sail as the cover. By the afternoon, there's a whole bucket of fresh water.", ['pippi', "Taste it! Not salty at all. The salt stays behind in the bowl."], "You take the bucket. Somebody on board is very thirsty."]); }, 2600);
        return;
      }
      nope(); fb.className = 'feedback bad'; fb.textContent = tx(STILL_Q[wrong].why[st[wrong]]);
    };
  });
}

/* ---------- puzzle: the log line (speed in knots; time = distance ÷ speed) ---------- */
const LOG_KNOTS = 6, LOG_MILES = 18;
function openLog(){
  const st = S.lg || (S.lg = { thrown: false });
  openModal('The log line', 'How fast is the Hoppetossa sailing?', `
    <p class="flag-p">${tx('Sailors measure speed with a log line: a piece of wood on a long rope with a knot tied in it every few metres. Throw the wood overboard, turn the little sand-glass, and count the knots that run out before the sand runs through. That number is the speed, in knots.')}</p>
    <svg class="log-svg" viewBox="0 0 400 110" aria-hidden="true" id="log-svg"></svg>
    <div class="row-btns" id="log-throw-row"><button type="button" class="btn" id="log-throw">${tx('Throw the log!')}</button></div>
    <div id="log-q" hidden>
      <p class="flag-p" id="log-speed"></p>
      <p><b>${tx('Captain Efraim: "The island is 18 sea miles away." How many hours until we get there?')}</b></p>
      <div class="row-btns">${[2, 3, 4, 12].map(h => `<button type="button" class="btn ghost hrs" data-h="${h}">${tx('{h} hours', { h })}</button>`).join('')}</div>
    </div>
    <div class="feedback" id="log-fb"></div>`, () => {
    const fb = $('#log-fb');
    const draw = n => {
      let g = `<rect width="400" height="110" fill="#1f7fb4"/><rect width="400" height="30" fill="#8a4424"/><circle cx="30" cy="16" r="12" fill="#6b4423"/><circle cx="30" cy="16" r="4" fill="#d9c79a"/>`;
      g += `<path d="M30 28 Q${60 + n * 40} 70 ${70 + n * 50} 90" stroke="#d9c79a" stroke-width="3" fill="none"/>`;
      for(let k = 0; k < n; k++) g += `<circle cx="${70 + k * 50}" cy="${46 + k * 6}" r="5" fill="#7a4a1f"/><text x="${70 + k * 50}" y="${66 + k * 6}" text-anchor="middle" font-size="11" fill="#fffaf0">${k + 1}</text>`;
      g += `<path d="M${64 + n * 50} 90 l26 -6 l4 10 l-26 6z" fill="#b07a3a"/>`;
      g += `<g transform="translate(360 50)"><path d="M-12 -24 h24 l-10 24 l10 24 h-24 l10 -24z" fill="#f3efe3" stroke="#6b4423" stroke-width="2"/><path d="M-6 ${n >= LOG_KNOTS ? -20 : -16} h12 l-6 ${n >= LOG_KNOTS ? 4 : 12}z M-${n >= LOG_KNOTS ? 9 : 4} 22 h${n >= LOG_KNOTS ? 18 : 8} l-${n >= LOG_KNOTS ? 9 : 4} -${n >= LOG_KNOTS ? 10 : 4}z" fill="#e9c46a"/></g>`;
      $('#log-svg').innerHTML = g;
    };
    const showQ = () => { $('#log-throw-row').hidden = true; $('#log-q').hidden = false; $('#log-speed').textContent = tx('{n} knots ran out before the sand ran through: the Hoppetossa is sailing at {n} knots. That means {n} sea miles every hour.', { n: LOG_KNOTS }); };
    draw(st.thrown ? LOG_KNOTS : 0);
    if(st.thrown) showQ();
    $('#log-throw').onclick = () => {
      $('#log-throw').disabled = true;
      let n = 0;
      const step = () => { if(!$('#log-svg')) return; draw(++n); beep(500 + n * 60, .04); if(n < LOG_KNOTS) setTimeout(step, reducedMotion() ? 0 : 450); else { st.thrown = true; save(); showQ(); } };
      step();
    };
    document.querySelectorAll('.hrs').forEach(b => b.onclick = () => {
      const h = +b.dataset.h;
      if(h * LOG_KNOTS === LOG_MILES){
        S.f.knots = true; save(); applyVisuals(); chord([523, 659, 784, 1046]);
        fb.className = 'feedback good'; fb.textContent = tx('3 hours! 6 sea miles every hour: 6, 12, 18. Or: 18 ÷ 6 = 3. It\'s 12 o\'clock now, so we\'ll see the island at 3 o\'clock.');
        setTimeout(() => { closeModal(); say([['captain', "Three o'clock! Pippi, when it's three o'clock, ring the ship's bell. Then everybody looks out for land."], ['pippi', "How do you ring three o'clock?"], ['captain', "The sailors' way! One ring for every half hour since twelve o'clock."]]); }, 2400);
        return;
      }
      nope(); fb.className = 'feedback bad';
      fb.textContent = tx(h === 12 ? '18 − 6 = 12 is taking away. But every hour we sail 6 sea miles: how many sixes make 18?' : h === 2 ? 'After 2 hours we\'ve sailed 2 × 6 = 12 sea miles. There are still 6 to go: too far to swim.' : 'After 4 hours we\'d have sailed 4 × 6 = 24 sea miles: right past the island and out the other side!');
    });
  });
}

/* ---------- puzzle: the ship's bell (telling the time in half hours: one ring for every half hour of the watch) ---------- */
const BELLS_WANT = 6;
function openBells(){
  let n = 0;
  openModal("The ship's bell", 'One ring for every half hour since twelve o\'clock', `
    <div class="bells5">
      <svg class="clock-svg" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="54" fill="#f3efe3" stroke="#6b4423" stroke-width="6"/>
        ${[...Array(12)].map((_, i) => { const a = (i + 1) * Math.PI / 6; return `<text x="${60 + 42 * Math.sin(a)}" y="${65 - 42 * Math.cos(a)}" text-anchor="middle" font-size="11" fill="#1f2a5c">${i + 1}</text>`; }).join('')}
        <path d="M60 60 L60 22" stroke="#1f2a5c" stroke-width="3" stroke-linecap="round"/><path d="M60 60 L84 60" stroke="#1f2a5c" stroke-width="5" stroke-linecap="round"/><circle cx="60" cy="60" r="4" fill="#c4302b"/></svg>
      <div class="bell-side">
        <p class="flag-p">${tx('Three hours have flown by. The clock says 3 o\'clock. On a ship, the bell rings once for every half hour since 12 o\'clock: half past twelve is 1 ring, 1 o\'clock is 2 rings… Ring 3 o\'clock!')}</p>
        <div class="rings" id="rings"></div>
        <div class="row-btns"><button type="button" class="btn ghost" id="bell-clear">${tx('Start again')}</button><button type="button" class="btn ding" id="bell-ding">${tx('Ding!')}</button></div>
        <button type="button" class="btn" id="bell-go">${tx('Land ahoy?')}</button>
      </div>
    </div>
    <div class="feedback" id="bell-fb"></div>`, () => {
    const fb = $('#bell-fb');
    const draw = () => $('#rings').innerHTML = n ? [...Array(n)].map((_, i) => `<span class="ring${i % 2 ? ' b' : ''}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6h12q0 10 3 12H3q3-2 3-12z" fill="#e9c46a" stroke="#9a6e1a" stroke-width="1.5"/><circle cx="12" cy="20" r="2.5" fill="#9a6e1a"/></svg></span>`).join('') : `<i>${tx('No rings yet.')}</i>`;
    const time = k => { const m = k * 30, h = 12 + Math.floor(m / 60), mm = m % 60; return `${h > 12 ? h - 12 : h}:${mm ? '30' : '00'}`; };
    draw();
    $('#bell-ding').onclick = () => { if(n < 16){ n++; beep(1250, .4, 'sine', .05); draw(); } };
    $('#bell-clear').onclick = () => { n = 0; draw(); fb.className = 'feedback'; fb.textContent = ''; };
    $('#bell-go').onclick = () => {
      if(n === BELLS_WANT){
        S.f.out5 = true; save(); chord([523, 659, 784, 1046, 1318, 1568]);
        fb.className = 'feedback good'; fb.textContent = tx('Six rings: twelve o\'clock and six half hours, that\'s 3 o\'clock! Sailors ring them in pairs: ding-ding, ding-ding, ding-ding.');
        setTimeout(() => { closeModal(); applyVisuals(); win5(); }, 2400);
        return;
      }
      nope(); fb.className = 'feedback bad';
      if(n >= 12){ S.ach.wakeup = true; save(); }
      fb.textContent = n === 0 ? tx('Ring the bell first!') : n === 3 ? tx('3 rings means 1:30: three HALF hours after twelve. How many half hours are there in 3 hours?')
        : tx('{n} rings means {t}. {more}', { n, t: time(n), more: n < BELLS_WANT ? tx('Too early: keep ringing.') : n >= 12 ? tx('The whole crew falls out of their hammocks!') : tx('Too late: start again.') });
    };
  });
}

/* ---------- intro, start and win ---------- */
function intro5(){
  say([["sys", "The Hoppetossa, Captain Efraim's ship, is sailing on the wide blue sea. On board: Pippi, Tommy, Annika, the horse, Mr Nilsson and you."],
       ["captain", "To my island in the South Sea! Where the sun always shines and the coconuts fall straight into your hand."],
       ["pippi", "Dad, where is your island, exactly?"],
       ["captain", "It's on my chart. My chart is in… hmm. My chart was in my cabin."],
       ["nilsson", "Eek!"],
       ["annika", "Pippi, Mr Nilsson has been tidying up. He's thrown things overboard. And he had a bath in the drinking water."],
       ["captain", "Then we're lost at sea, the compass is going mad, and we've nothing to drink! Wonderful. A real adventure!"],
       ["you", "Things are bobbing by the bow. Maybe Tommy's net can catch them."]],
    () => { S.f.introDone = true; save(); });
}
function startCh5(){
  setUnlocked5();
  S = Object.assign(fresh(), { ach: S.ach || {}, ch: 5, scene: 'ship' });
  S.started = true; sel = null;
  $('#title').hidden = true; $('#win').hidden = true;
  renderInv(); applyVisuals(); $('#timer').textContent = '00:00'; save(); intro5();
}
function win5(){
  say([["sys", "Ding-ding, ding-ding, ding-ding! Everyone runs to the rail."],
       ["pippi", "LAND AHOY!"],
       ["sys", "On the horizon, a little green island rises out of the sea: a white beach, palm trees, and a flag waving on a hut."],
       ["captain", "My island! Right where I left it. Pippi, my girl, you found it."],
       ["tommy", "We found it together. With a net, a compass, a chart, a sun still, a log line and a bell."],
       ["annika", "And no help at all from Mr Nilsson."],
       ["nilsson", "Eek!"],
       ["sys", "The dolphins race ahead to the beach, and the Hoppetossa sails after them, with the horse at the bow, wearing its sailor's hat."]],
    () => showWin());
}
