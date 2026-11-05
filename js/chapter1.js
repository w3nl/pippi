// Chapter 1: locked in the kitchen of Villa Villekulla. Also defines H, the hotspot table that every chapter adds to.
// Loaded in order by js/boot.js; all game files share the same global scope.

/* ---------- signal flags (the International Code of Signals, one flag per letter) ---------- */
const FLAG_C = { R:'#d22d2d', W:'#ffffff', B:'#1f4fa8', Y:'#f5c518', K:'#161616' };
/* Each flag in unit coordinates (0..1): [colour, points] polygons, drawn in order. */
const FLAG_SHAPES = (() => {
  const r = (c, x0, y0, x1, y1) => [c, [[x0,y0],[x1,y0],[x1,y1],[x0,y1]]];
  const t = (c, ...p) => [c, p];
  const sal = c => [t(c,[0,0],[.14,0],[1,.86],[1,1],[.86,1],[0,.14]), t(c,[1,0],[1,.14],[.14,1],[0,1],[0,.86],[.86,0])];
  return {
    A: [r('W',0,0,.5,1), t('B',[.5,0],[1,0],[.72,.5],[1,1],[.5,1])],
    B: [t('R',[0,0],[1,0],[.72,.5],[1,1],[0,1])],
    C: [r('B',0,0,1,.2), r('W',0,.2,1,.4), r('R',0,.4,1,.6), r('W',0,.6,1,.8), r('B',0,.8,1,1)],
    D: [r('Y',0,0,1,1), r('B',0,.25,1,.75)],
    E: [r('B',0,0,1,.5), r('R',0,.5,1,1)],
    F: [r('W',0,0,1,1), t('R',[.5,0],[1,.5],[.5,1],[0,.5])],
    G: [0,1,2,3,4,5].map(i => r(i%2 ? 'B' : 'Y', i/6, 0, (i+1)/6, 1)),
    H: [r('W',0,0,.5,1), r('R',.5,0,1,1)],
    I: [r('Y',0,0,1,1), ['circle', 'K']],
    J: [r('B',0,0,1,1/3), r('W',0,1/3,1,2/3), r('B',0,2/3,1,1)],
    K: [r('Y',0,0,.5,1), r('B',.5,0,1,1)],
    L: [r('Y',0,0,.5,.5), r('K',.5,0,1,.5), r('K',0,.5,.5,1), r('Y',.5,.5,1,1)],
    M: [r('B',0,0,1,1), ...sal('W')],
    N: [r('W',0,0,1,1), ...[0,1,2,3].flatMap(y => [0,1,2,3].filter(x => (x+y)%2===0).map(x => r('B',x/4,y/4,(x+1)/4,(y+1)/4)))],
    O: [r('R',0,0,1,1), t('Y',[0,0],[1,1],[0,1])],
    P: [r('B',0,0,1,1), r('W',.3,.3,.7,.7)],
    Q: [r('Y',0,0,1,1)],
    R: [r('R',0,0,1,1), r('Y',.42,0,.58,1), r('Y',0,.4,1,.6)],
    S: [r('W',0,0,1,1), r('B',.3,.3,.7,.7)],
    T: [r('R',0,0,1/3,1), r('W',1/3,0,2/3,1), r('B',2/3,0,1,1)],
    U: [r('R',0,0,.5,.5), r('W',.5,0,1,.5), r('W',0,.5,.5,1), r('R',.5,.5,1,1)],
    V: [r('W',0,0,1,1), ...sal('R')],
    W: [r('B',0,0,1,1), r('W',.2,.2,.8,.8), r('R',.38,.38,.62,.62)],
    X: [r('W',0,0,1,1), r('B',.42,0,.58,1), r('B',0,.4,1,.6)],
    Y: [r('Y',0,0,1,1), ...[-.6,-.2,.2,.6].map(o => t('R',[o,1],[o+.2,1],[o+1.2,0],[o+1,0]))],
    Z: [t('Y',[0,0],[1,0],[.5,.5]), t('B',[1,0],[1,1],[.5,.5]), t('R',[0,1],[1,1],[.5,.5]), t('K',[0,0],[0,1],[.5,.5])]
  };
})();
/* SVG markup for one flag at (x, y), w × h. Clipped to its outline, with a thin dark edge so white flags show up. */
let flagClipN = 0;
function flagSVG(L, x, y, w, h){
  const id = 'fclip' + (flagClipN++);
  const swallow = L==='A' || L==='B';
  const outline = swallow ? `${x},${y} ${x+w},${y} ${x+w*.72},${y+h/2} ${x+w},${y+h} ${x},${y+h}` : `${x},${y} ${x+w},${y} ${x+w},${y+h} ${x},${y+h}`;
  const parts = FLAG_SHAPES[L].map(s => {
    if(s[0]==='circle') return `<circle cx="${x+w/2}" cy="${y+h/2}" r="${Math.min(w,h)*.24}" fill="${FLAG_C[s[1]]}"/>`;
    return `<polygon points="${s[1].map(([px,py]) => `${(x+px*w).toFixed(1)},${(y+py*h).toFixed(1)}`).join(' ')}" fill="${FLAG_C[s[0]]}"/>`;
  }).join('');
  return `<clipPath id="${id}"><polygon points="${outline}"/></clipPath><g clip-path="url(#${id})">${parts}</g><polygon points="${outline}" fill="none" stroke="rgba(0,0,0,.45)" stroke-width="${Math.max(.6, w/40)}"/>`;
}
const FLAG_WORD = 'SPUNK';   // the word on the string of flags, and the sea chest's code (the same in every language)

/* ---------- drawing the kitchen ---------- */
function buildKitchen(){
  // the string of flags across the ceiling: the curve is M90 60 Q800 130 1510 60, so x is linear in t
  let g = '';
  [...FLAG_WORD].forEach((L, i) => {
    const x = 560 + i * 120, tt = (x - 90) / 1420, y = 60 + 140 * tt * (1 - tt);
    g += `<g class="sway" style="animation-delay:-${i*.4}s"><path d="M${x+4} ${y-2} v6 M${x+68} ${y-2} v6" stroke="#e9dcc0" stroke-width="3"/>${flagSVG(L, x, y + 4, 72, 54)}</g>`;
  });
  $('#vk-flags').innerHTML = g;
  // the little chart by the mirror: 26 tiny flags
  let c = '';
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach((L, i) => { const col = i % 5, row = Math.floor(i / 5);
    c += flagSVG(L, 930 + col * 18, 214 + row * 22, 14, 10) + `<text x="${937 + col * 18}" y="${232 + row * 22}" text-anchor="middle" font-size="6" font-family="IBM Plex Mono, monospace" fill="#3e200c">${L}</text>`; });
  $('#vk-chartgrid').innerHTML = c;
  // the bureau's little drawers
  let d = '';
  for(let row = 0; row < 3; row++) for(let col = 0; col < 3; col++){
    const x = 1064 + col * 70, y = 378 + row * 64;
    d += `<rect x="${x}" y="${y}" width="62" height="54" rx="3" fill="#a5602f" stroke="#4e2a12" stroke-width="3"/><circle cx="${x+31}" cy="${y+27}" r="5" fill="#f2c94c"/>`;
  }
  d += `<rect x="1064" y="572" width="202" height="62" rx="3" fill="#a5602f" stroke="#4e2a12" stroke-width="3"/>`;
  $('#vk-drawers').innerHTML = d;
}
function applyKitchen(){
  const has = id => S.inv.includes(id), show = vis;   // smooth when you can see it happen (core.js)
  show('#vk-spunk', !S.f.spunkTaken); show('#hit-spunk', !S.f.spunkTaken);
  show('#vk-note', !has('note')); show('#hit-note', !has('note'));
  show('#vk-fire', !!S.f.fire); show('#vk-steam', !!S.f.fire);
  show('#vk-nkey', !S.f.key);
  show('#vk-lock', !S.f.matches);
  show('#vk-horse', !S.f.out1);
  show('#vk-chestlock', !S.f.chest);
  $('#vk-doorled').setAttribute('fill', S.f.unlocked ? '#9fdc6e' : '#e2483d');
}

/* ---------- hotspot handlers ---------- */
const H = {
  spunk(){ S.f.spunkTaken = true; give('spunk'); applyVisuals();
    say(["A jam jar with a tiny green beetle in it. The label, in Pippi's handwriting, says: SPUNK.",
         "Pippi made up the word \"spunk\" and then went out to find out what a spunk is. This is apparently it.",
         "You take it. If you're stuck, show the spunk something. A spunk knows things."]); },
  note(){
    if(S.f.noteRead) return openNote(true);
    give('note'); applyVisuals(); openNote(false);
  },
  mirror(){ say(["You look in the mirror. Your reflection waves back, with the wrong hand.", "Mirrors turn everything the other way round: left becomes right, and writing runs backwards."]); },
  homework(){ openHomework(); },
  bureau(){ openBureau(); },
  suitcase(){ say(["Pippi's suitcase, full to the brim with gold coins. Pippi is the richest girl in the whole town.",
                   "She keeps it on top of the bureau, where anyone could see it. A burglar, say. Let's not think about burglars right now."]); },
  pantry(){ openPantry(); },
  stove(){ openStove(); },
  sign(){ openSign(); },
  wood(){ say("Pippi's wood basket, full of logs. She chops them herself, with one hand, while reading a book with the other."); },
  bowl(){ say(["A big mixing bowl and a whisk. Pippi makes her pancake batter at the stove, where it's warm.", "There's a faint pancake smell. Mr Nilsson keeps sniffing in this direction."]); },
  window(){ say(["Through the window: the garden, the big old oak tree with a hollow trunk, and the gate.",
                 "Tommy and Annika are leaning on the gate, waving. Annika is pointing at her wristwatch."]); },
  flags(){ openFlags(); },
  chart(){ openChart(); },
  nilsson(){
    if(S.f.key) return say([['nilsson', "Nom nom nom."], "Mr Nilsson is busy with his pancake. He has syrup on his hat."]);
    S.f.nilTaps = (S.f.nilTaps || 0) + 1; save();
    if(S.f.nilTaps === 1) return say([['nilsson', "Eek! Eek-eek!"], "Mr Nilsson, Pippi's monkey, in his little blue trousers and straw hat. He holds up the front-door key and grins.", "When you reach for it, he puts it behind his back."]);
    if(S.f.nilTaps === 2) return say(["You ask very politely for the key.", ['nilsson', "Eek."], "He shakes his head. Then he rubs his tummy and points at the stove."]);
    S.ach.nilsson = true; save();
    say([['nilsson', "Eek eek eek!"], "You say please, pretty please, and pretty please with sugar on top. Mr Nilsson pats your head kindly and keeps the key.", "He keeps pointing at the stove. He wants something to eat."]);
  },
  door(){
    if(S.f.out1) return startCh2();
    if(!S.f.unlocked) return say(["The front door of Villa Villekulla. Locked, and the keyhole is empty.", "Mr Nilsson has the key, up on the bureau."]);
    say(["The door is unlocked, but it only opens a crack.", "Pippi's horse is standing on the veranda, leaning right against it. It looks very comfortable. It won't budge."]);
  },
  horse(){
    if(S.f.out1) return say("The horse is grazing in the garden now, very pleased with itself.");
    S.f.horseTaps = (S.f.horseTaps || 0) + 1; save();
    if(S.f.horseTaps === 1 && !S.f.unlocked) return say([['horse', "Pfrrrr."], "Pippi's horse, white with black spots, looking in through the little window in the door. It lives on the veranda. Pippi says it's in the way in the kitchen."]);
    if(S.f.unlocked && !S.f.liftTried){ S.f.liftTried = true; S.ach.lift = true; save();
      return say(["You squeeze a hand through the gap and try to lift the horse, the way Pippi does.", "The horse does not get lifted. You are strong, but not Pippi-strong.", ['horse', "Pfrrr?"], "Maybe you can make it want to move instead. What do horses like?"]); }
    say([['horse', "Neeeigh."], S.f.unlocked ? "It's leaning on the door. Horses move for a good reason. Something sweet, for example." : "It blinks at you through the window. Nice horse. Locked door."]);
  },
  chest(){ if(S.f.chest) return say("Captain Longstocking's sea chest, open. Charts, a compass and a spyglass. You already took the sugar."); openChest(); }
};

/* ---------- puzzle: Pippi's backwards note (mirror writing) ---------- */
const NOTE_LINES = ["Dear gest!",
  "Mr Nilsson has pinched the front-door key. He does that. He will swap it for a PANCAKE, and nothing else.",
  "The eggs are in the pantry. The matches are in my secret drawer in the bureau. The code is the answers to my sums.",
  "(Annika says my answers are wrong. Annika is very clever.)",
  "Luv, Pippi",
  "P.S. Don't lift the horse. That's my job."];
function openNote(readable){
  const body = NOTE_LINES.map(l => `<p>${tx(l)}</p>`).join('');
  openModal(readable ? "Pippi's note, in the mirror" : "Pippi's note", readable ? 'Now it reads the right way round' : 'Left on the kitchen table',
    `<div class="pnote${readable ? '' : ' mirrored'}" id="pnote" translate="no">${body}</div>
     <div class="feedback" id="note-fb">${readable ? '' : tx("It's all backwards! Every letter faces the wrong way, and the lines run from right to left. Pippi says that in Egypt everybody writes like this.")}</div>`);
}

/* ---------- puzzle: Pippi's sums (multiplication, subtraction, division) ---------- */
function openHomework(){
  openModal("Pippi's exercise book", 'Sums · homework · VERY IMPORTANT', `
    <div class="ebook">
      <div class="sum"><span>2 × 3 =</span><b>4</b><i>${tx("(that's how the song goes!)")}</i></div>
      <div class="sum"><span>9 − 4 =</span><b>${tx('Thursday')}</b></div>
      <div class="sum"><span>8 ÷ 2 =</span><b>${tx('a horse')}</b></div>
      <div class="teach">${tx('Miss says: <b>×</b> means "lots of": 2 × 3 is two, three times. <b>÷</b> means "share out": 8 ÷ 2 is 8 sweets shared between 2 children.')}</div>
      <div class="sticky">${tx('Pippi! Your answers are WRONG. The code for your secret drawer is the RIGHT answers, from top to bottom. — Annika')}</div>
    </div>`);
}

/* ---------- puzzle: the bureau, its little drawers, and the secret drawer (code 654) ---------- */
const DRAWERS = ["A bird's egg. Not for pancakes.",
  "A rusty tin can. Pippi found it thing-searching: \"A perfectly good tin, for keeping things in!\"",
  "A seashell from the South Seas. Hold it to your ear and you can hear the waves.",
  "Seven buttons. All different.",
  "A letter from Pippi's father, Captain Efraim Longstocking: \"Dear Pippi, I am now King of an island in the South Seas.\"",
  "A false moustache. For emergencies.",
  "A map with a big red X on it.",
  "A paper bag of sweets. Empty. Of course.",
  "A small bottle labelled: MEDICINE FOR EVERYTHING. It smells of lemonade."];
const SAFE_CODE = '654';
function openBureau(){
  const opened = S.drw || (S.drw = []);
  const dig = S.lockd || (S.lockd = [0, 0, 0]);
  openModal('The bureau', 'Lots of little drawers, and one with a padlock', `
    <div class="bureau">
      <div class="drawers">${DRAWERS.map((_, i) => `<button type="button" class="drw${opened.includes(i) ? ' open' : ''}" data-d="${i}" aria-label="${tx('Little drawer {n}', { n: i + 1 })}"><span></span></button>`).join('')}</div>
      <div class="secret ${S.f.matches ? 'open' : ''}">
        <div class="plabel">${tx('SECRET DRAWER · PRIVATE · KEEP OUT (this means you, Mr Nilsson)')}</div>
        ${S.f.matches ? `<div class="feedback good">${tx('Open. Empty, apart from some crumbs. You already took the matches.')}</div>` : `
        <div class="padlock">${[0,1,2].map(i => `<div class="wheel"><button type="button" class="up" data-w="${i}" aria-label="${tx('Wheel {n} up', { n: i + 1 })}">▲</button><b id="wd${i}">${dig[i]}</b><button type="button" class="dn" data-w="${i}" aria-label="${tx('Wheel {n} down', { n: i + 1 })}">▼</button></div>`).join('')}
          <button type="button" class="btn" id="lock-try">${tx('Open')}</button></div>`}
      </div>
      <div class="feedback" id="bur-fb"></div>
    </div>`, body => {
    body.querySelectorAll('.drw').forEach(b => b.onclick = () => {
      const i = +b.dataset.d; b.classList.add('open'); beep(300 + i * 40, .05);
      if(!opened.includes(i)){ opened.push(i); if(opened.length === DRAWERS.length) S.ach.drawers = true; save(); }
      $('#bur-fb').className = 'feedback'; $('#bur-fb').textContent = tx(DRAWERS[i]);
    });
    body.querySelectorAll('.wheel button').forEach(b => b.onclick = () => {
      const i = +b.dataset.w; dig[i] = (dig[i] + (b.classList.contains('up') ? 1 : 9)) % 10; save();
      $('#wd' + i).textContent = dig[i]; beep(500, .02);
    });
    const go = $('#lock-try'); if(go) go.onclick = () => {
      const code = dig.join(''), fb = $('#bur-fb');
      if(code === SAFE_CODE){
        S.f.matches = true; save(); give('matches'); applyVisuals(); chord([523,659,784,1046]);
        fb.className = 'feedback good'; fb.textContent = tx('Click! The padlock springs open. Inside: a box of matches, and a lot of crumbs.');
        setTimeout(() => { closeModal(); say(["6, 5, 4. Pippi's sums, done properly.", "You take the matches. Now, the stove…"]); }, 1500);
        return;
      }
      nope(); fb.className = 'feedback bad';
      fb.textContent = tx(code === '000' ? "Zero, zero, zero. Even Pippi wouldn't pick that." : code === '444' || code === '449' ? "Those are Pippi's answers, and the padlock agrees with Annika: they're wrong." : "The padlock doesn't budge. Annika's sticky note said: the right answers, from top to bottom.");
    };
  });
}

/* ---------- the pantry: the eggs ---------- */
function openPantry(){
  const hasEggs = S.inv.includes('eggs') || S.f.pancake;
  openModal('The pantry cupboard', 'Painted blue, with yellow flowers', `
    <div class="pantry">
      <div class="shelf-row"><span class="jar">${tx('FLOUR')}</span><span class="jar milk">${tx('MILK')}</span><span class="jar butter">${tx('BUTTER')}</span><span class="jar sugar">${tx('SUGAR')}<small>${tx('(empty) Ate it. —P.')}</small></span></div>
      <div class="shelf-row">${hasEggs ? `<span class="egg-gone">${tx('An empty egg basket.')}</span>` : `<button type="button" class="btn" id="take-eggs">${tx('Take the eggs')}</button>`}
        <div class="recipe"><b>${tx("PIPPI'S PANCAKES")}</b><br>${tx('3 eggs, milk, flour, butter, and a HOT stove.')}<br>${tx('Do it in the right order. Not like last time. (Ceiling.)')}</div></div>
      <div class="feedback" id="pan-fb">${tx('Flour, milk and butter stay here: there are more by the stove. Pippi keeps them handy.')}</div>
    </div>`, () => {
    const b = $('#take-eggs'); if(b) b.onclick = () => { give('eggs'); applyVisuals(); closeModal(); say("You take three eggs, very carefully. Pippi would have juggled them."); };
  });
}

/* ---------- puzzle: the stove (what a fire needs) and the pancake (doing steps in the right order) ---------- */
function openSign(){
  openModal('Enamel sign', 'Screwed to the wall above the stove', `
    <div class="enamel"><svg viewBox="0 0 120 100" aria-hidden="true"><path d="M60 10 L110 92 H10 Z" fill="none" stroke="#e8571f" stroke-width="8" stroke-linejoin="round"/></svg>
      <div class="tri-l l1">${tx('something to burn')}</div><div class="tri-l l2">${tx('air')}</div><div class="tri-l l3">${tx('heat')}</div>
      <p>${tx('A FIRE NEEDS THREE THINGS: something to burn, air, and heat. Take one away and it goes out. (That is also how you put a fire OUT.)')}</p>
      <small>${tx('— from the ship of Captain E. Longstocking')}</small></div>`);
}
const PAN_STEPS = {
  eggs:   { label: 'Crack the eggs into the bowl', needs: [] },
  milk:   { label: 'Add the milk and the flour', needs: [] },
  whisk:  { label: 'Whisk until smooth', needs: ['eggs', 'milk'] },
  butter: { label: 'Melt butter in the hot pan', needs: [] },
  pour:   { label: 'Pour the batter into the pan', needs: ['whisk', 'butter'] },
  flip:   { label: 'Flip it when the top bubbles', needs: ['pour'] },
  head:   { label: "Crack an egg on your head (Pippi's way)", needs: [] },
  toss:   { label: 'Toss the pancake up to the ceiling', needs: ['pour'] }
};
const PAN_ORDER = ['whisk', 'flip', 'eggs', 'head', 'butter', 'pour', 'toss', 'milk'];   // the buttons, shuffled once and for all
const PAN_WHY = {
  whisk: { eggs: "You whisk an empty bowl. Very energetic, but there's nothing in it. Eggs first.", milk: "You whisk the eggs. Lovely, but it's not batter yet: the milk and flour aren't in." },
  pour: { whisk: "There's no batter to pour yet. Everything has to be in the bowl and whisked first.", butter: "Wait! Without butter in the pan, the pancake will stick like glue. Grease the pan first." },
  flip: { pour: "You flip an empty pan. Very sporty. Still no pancake." },
  toss: { pour: "There's no pancake to toss yet." }
};
function openStove(){
  if(!S.f.fire) return openFire();
  if(S.f.pancake) return say(S.f.key ? "The stove is still warm. You've had enough pancakes for one day. (Nobody has ever said that in this house before.)" : "The stove is still warm. Mr Nilsson is still waiting for his pancake.");
  if(!S.inv.includes('eggs')) return say(["The stove is lovely and hot. The pan is ready, and so are the flour, milk and butter.", "Pancakes need eggs, though. Pippi keeps those in the pantry."]);
  openPancake();
}
function openFire(){
  const st = S.stv || (S.stv = { wood: false, vent: false });
  const hasM = S.inv.includes('matches');
  openModal('The stove', 'Cast iron, cold, and very hungry', `
    <div class="firebox">
      <div class="fb-door ${st.wood ? 'wood' : ''}"><span class="logs"></span><span class="smoke" id="smoke"></span></div>
      <div class="fb-ctl">
        <button type="button" class="tog ${st.wood ? 'on' : ''}" id="fb-wood">${tx(st.wood ? 'Firewood: in' : 'Firewood: none')}</button>
        <button type="button" class="tog ${st.vent ? 'on' : ''}" id="fb-vent">${tx(st.vent ? 'Air vent: open' : 'Air vent: closed')}</button>
        <button type="button" class="btn" id="fb-match">${tx('Strike a match')}</button>
      </div>
    </div>
    <div class="feedback" id="fire-fb">${tx('The enamel sign above the stove says what a fire needs.')}</div>`, () => {
    const fb = $('#fire-fb');
    const redraw = () => { $('#fb-wood').textContent = tx(st.wood ? 'Firewood: in' : 'Firewood: none'); $('#fb-wood').classList.toggle('on', st.wood);
      $('#fb-vent').textContent = tx(st.vent ? 'Air vent: open' : 'Air vent: closed'); $('#fb-vent').classList.toggle('on', st.vent);
      document.querySelector('.fb-door').classList.toggle('wood', st.wood); save(); };
    $('#fb-wood').onclick = () => { st.wood = !st.wood; beep(200, .06); redraw(); fb.className = 'feedback'; fb.textContent = tx(st.wood ? 'You stack three logs from the basket in the firebox.' : 'You take the logs out again.'); };
    $('#fb-vent').onclick = () => { st.vent = !st.vent; beep(600, .03); redraw(); fb.className = 'feedback'; fb.textContent = tx(st.vent ? 'You slide the little air vent open. You can feel a draught.' : 'You slide the air vent shut.'); };
    $('#fb-match').onclick = () => {
      if(!hasM && !S.inv.includes('matches')){ nope(); fb.className = 'feedback bad'; fb.textContent = tx("You have nothing to light it with. Pippi's note said where the matches are."); return; }
      if(!st.wood){ nope(); fb.className = 'feedback bad'; fb.textContent = tx("The match flares up… and burns out on its own. There's nothing to burn: a fire needs fuel."); return; }
      if(!st.vent){ nope(); fb.className = 'feedback bad'; fb.textContent = tx('The wood catches, smoulders, puffs out a cloud of smoke and goes out. With the vent shut, the fire gets no air.'); const s = $('#smoke'); if(s){ s.classList.remove('puff'); void s.offsetWidth; s.classList.add('puff'); } return; }
      S.f.fire = true; take('matches'); save(); applyVisuals(); chord([392,523,659,784]);
      document.querySelector('.fb-door').classList.add('lit');
      fb.className = 'feedback good'; fb.textContent = tx('Fuel, air and heat: the fire roars into life!');
      setTimeout(() => { closeModal(); say(["Something to burn, air, and heat from the match. The fire crackles happily.", S.inv.includes('eggs') ? "The pan is heating up. Time for a pancake." : "The pan is heating up. Now you need eggs for the batter."]); }, 1500);
    };
  });
}
function openPancake(){
  const done = S.pan || (S.pan = []);
  openModal("Pippi's pancakes", 'Every step needs the steps before it', `
    <div class="pancake">
      <ol class="pan-done" id="pan-done"></ol>
      <div class="pan-steps">${PAN_ORDER.map(k => `<button type="button" class="pstep" data-k="${k}">${tx(PAN_STEPS[k].label)}</button>`).join('')}</div>
      <div class="feedback" id="pk-fb">${tx('The recipe in the pantry lists what goes in, but not the order. Think: what does each step need first?')}</div>
    </div>`, () => {
    const fb = $('#pk-fb');
    const draw = () => { $('#pan-done').innerHTML = done.map(k => `<li>${tx(PAN_STEPS[k].label)}</li>`).join('');
      document.querySelectorAll('.pstep').forEach(b => b.disabled = done.includes(b.dataset.k)); };
    draw();
    document.querySelectorAll('.pstep').forEach(b => b.onclick = () => {
      const k = b.dataset.k;
      if(k === 'head'){ S.ach.egghead = true; save(); beep(160, .15, 'sine'); fb.className = 'feedback bad'; fb.textContent = tx('Splat. Egg runs down your face. Pippi does it this way too, and it never works for her either. Use the bowl.'); return; }
      const missing = PAN_STEPS[k].needs.find(n => !done.includes(n));
      if(missing){ nope(); fb.className = 'feedback bad'; fb.textContent = tx((PAN_WHY[k] && PAN_WHY[k][missing]) || 'Not yet. Something else has to happen first.'); return; }
      if(k === 'toss'){ S.ach.ceiling = true; }
      done.push(k === 'toss' ? 'flip' : k); save(); beep(500 + done.length * 60, .07); draw();
      fb.className = 'feedback good';
      fb.textContent = tx({ eggs: 'Crack, crack, crack. Three eggs in the bowl, and no shell. Well, hardly any.', milk: 'In go the milk and the flour. Whoosh: a small cloud of flour.', whisk: 'You whisk until the batter is smooth and has no lumps.', butter: 'The butter sizzles and slides around the hot pan.', pour: 'The batter spreads out into a perfect circle. Tiny bubbles appear on top.', flip: 'Flip! Golden brown underneath. Perfect.', toss: 'Whoops, too high! The pancake sticks to the ceiling… wobbles… and drops back into the pan, upside down. Flipped!' }[k]);
      if(done.includes('flip')){
        S.f.pancake = true; take('eggs'); give('pancake'); save(); applyVisuals(); chord([523,659,784,1046]);
        setTimeout(() => { closeModal(); say(["One golden pancake, made in the right order: each step only after the steps it needed.", ['nilsson', "Eek! EEK!"], "Up on the bureau, Mr Nilsson is jumping up and down."]); }, 1700);
      }
    });
  });
}

/* ---------- puzzle: signal flags and the sea chest (SPUNK) ---------- */
function openFlags(){
  openModal('Flags on a string', 'Hung across the ceiling by Pippi', `
    <svg class="bigflags" viewBox="0 0 420 80" role="img" aria-label="${tx('Five signal flags')}">${[...FLAG_WORD].map((L, i) => flagSVG(L, 6 + i * 84, 10, 72, 54)).join('')}</svg>
    <p class="flag-p">${tx("Pippi's father, Captain Longstocking, gave her these flags. On ships, every flag stands for one letter, so a row of flags spells a word, even when the ships are too far apart to shout.")}</p>`);
}
function openChart(){
  openModal('Signal flags, A to Z', 'From the ship of Captain E. Longstocking', `
    <div class="chart">${'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(L => `<figure><svg viewBox="0 0 60 44" aria-hidden="true">${flagSVG(L, 2, 2, 56, 40)}</svg><figcaption translate="no">${L}</figcaption></figure>`).join('')}</div>
    <p class="flag-p">${tx('Ships send messages with these flags: one flag per letter. A, B and the others are the same all over the world, in every language.')}</p>`);
}
function openChest(){
  const lt = S.cl || (S.cl = [0, 0, 0, 0, 0]);
  const AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  openModal("The captain's sea chest", 'A brass lock with five letter wheels', `
    <div class="padlock letters">${lt.map((v, i) => `<div class="wheel"><button type="button" class="up" data-w="${i}" aria-label="${tx('Wheel {n} up', { n: i + 1 })}">▲</button><b id="cw${i}" translate="no">${AZ[v]}</b><button type="button" class="dn" data-w="${i}" aria-label="${tx('Wheel {n} down', { n: i + 1 })}">▼</button></div>`).join('')}
      <button type="button" class="btn" id="chest-try">${tx('Open')}</button></div>
    <div class="feedback" id="chest-fb">${tx('Engraved on the lid: "A captain\'s secret is always flying over his head."')}</div>`, body => {
    body.querySelectorAll('.wheel button').forEach(b => b.onclick = () => {
      const i = +b.dataset.w; lt[i] = (lt[i] + (b.classList.contains('up') ? 1 : 25)) % 26; save();
      $('#cw' + i).textContent = AZ[lt[i]]; beep(520, .02);
    });
    $('#chest-try').onclick = () => {
      const word = lt.map(v => AZ[v]).join(''), fb = $('#chest-fb');
      if(word === FLAG_WORD){
        S.f.chest = true; save(); give('sugar'); applyVisuals(); chord([523,659,784,1046]);
        fb.className = 'feedback good'; fb.textContent = tx('S-P-U-N-K. The lock clicks and the lid creaks open.');
        setTimeout(() => { closeModal(); say(["Inside: sea charts, a compass, a spyglass… and a paper bag of sugar cubes. \"FOR THE HORSE\", it says on the bag.", "You take the sugar cubes."]); }, 1500);
        return;
      }
      nope(); S.f.chestTries = (S.f.chestTries || 0) + 1; save(); fb.className = 'feedback bad';
      fb.textContent = tx(word === 'PIPPI' ? "Good guess! But no. That's a name, not a secret." : S.f.chestTries > 1 ? 'Still locked. Look up! The flags over your head each stand for a letter, and the chart by the mirror says which.' : 'The lock stays shut.');
    };
  });
}

/* ---------- puzzle: the horse (how to give a horse a treat) ---------- */
function openHorse(){
  openModal('The horse', 'It sniffs: sugar!', `
    <p class="flag-p">${tx('How do you hold out a sugar cube to a horse?')}</p>
    <div class="hands">
      <button type="button" class="hand" data-h="tips">${tx('Between my fingertips, like a sweet')}</button>
      <button type="button" class="hand" data-h="fist">${tx('In my closed fist')}</button>
      <button type="button" class="hand" data-h="flat">${tx('On my flat, open hand')}</button>
    </div>
    <div class="feedback" id="horse-fb"></div>`, () => {
    document.querySelectorAll('.hand').forEach(b => b.onclick = () => {
      const h = b.dataset.h, fb = $('#horse-fb');
      if(h === 'tips'){ nope(); fb.className = 'feedback bad'; fb.textContent = tx("Careful! A horse can't see what's right under its nose, and it might nibble your fingers by mistake."); return; }
      if(h === 'fist'){ nope(); fb.className = 'feedback bad'; fb.textContent = tx('The horse snuffles at your fist. It can smell the sugar, but it can\'t get at it.'); return; }
      S.f.out1 = true; take('sugar'); save(); applyVisuals(); chord([523,659,784,1046,1318]);
      fb.className = 'feedback good'; fb.textContent = tx('Soft lips tickle your palm, and the sugar is gone. Flat hand, thumb tucked in: that is how you feed a horse.');
      setTimeout(() => { closeModal(); win1(); }, 1700);
    });
  });
}

/* ---------- intro, start and win ---------- */
function intro1(){
  say([["sys", "Villa Villekulla: a wonky old house at the edge of a small Swedish town. Four o'clock on a Saturday."],
       ["pippi", "Hello! Welcome to Villa Villekulla! I'm off to town to buy sweets. Eighteen kilos should do."],
       ["pippi", "Make yourself at home. Mr Nilsson will keep you company. Tommy and Annika are coming by, and then we're all going thing-searching!"],
       ["sys", "The front door bangs shut behind her. Then: click-clack. Mr Nilsson has turned the key, pulled it out of the lock, and scampered up onto the bureau with it."],
       ["nilsson", "Eek! Eek-eek!"],
       ["you", "Mr Nilsson! Give that back! …He's hidden it behind his back. Pippi said something about a note on the table."]],
    () => { S.f.introDone = true; save(); });
}
function win1(){
  say([["sys", "The horse crunches its sugar, clip-clops down the veranda steps and starts eating the lawn. The door swings wide open."],
       ["tommy", "There you are! We've been waiting for ages."],
       ["annika", "Did Mr Nilsson lock you in? He does that to everybody. He locked our mum in the shed once."],
       ["pippi", "Hello! I'm back! I've never been locked in by a monkey, so I'm sure I'd be very good at it. And look: so were you!"],
       ["pippi", "Now, who wants a sweet? I've got eighteen kilos."]],
    () => showWin());
}
