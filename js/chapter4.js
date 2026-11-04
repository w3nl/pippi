// Chapter 4: winter at Villa Villekulla. Kling and Klang challenge the children to a snowball fight at three o'clock.
// Loaded in order by js/boot.js; all game files share the same global scope.

const UNLOCK4 = KEY + '-ch4';
function unlocked4(){ try{ if(localStorage.getItem(UNLOCK4) === '1') return true; }catch(e){} return S.ch >= 4 || (S.ch === 3 && !!S.f.out3); }
function setUnlocked4(){ try{ localStorage.setItem(UNLOCK4, '1'); }catch(e){} }

/* Everything that has to be ready before the church clock strikes three. */
const READY4 = ['balls', 'fort', 'steps', 'warm'];
const ready4 = () => READY4.every(k => S.f[k]);

/* ---------- Chapter 4 items ---------- */
Object.assign(ITEMS, {
  mittens: { name:'Mittens', desc:'Your own red mittens, a bit chewed by a monkey. Nobody makes snowballs with bare hands.',
    svg:'<svg viewBox="0 0 44 44"><g fill="#d22d2d"><path d="M6 20 q0-12 10-12 q10 0 10 12 v14 h-20z"/><path d="M4 22 q-2-6 3-7 l3 6z"/><path d="M20 22 q0-12 10-12 q10 0 10 12 v14 h-20z"/><path d="M40 24 q4-6 -1-8 l-3 6z"/></g><g fill="#fffaf0"><rect x="6" y="32" width="20" height="5"/><rect x="20" y="34" width="20" height="5"/></g></svg>' }
});

/* ---------- drawing the snowy garden ---------- */
const rnd4 = (i, n) => { const x = Math.sin(i * 12.9898 + 4.1) * 43758.5453; return (x - Math.floor(x)) * n; };
/* Footprints, drawn pointing up; tracks4() places them along a curve. */
const PRINT4 = {
  bird: '<path d="M0 6 V-6 M0 -2 L-5 -8 M0 -2 L5 -8" stroke="#8a9ab0" stroke-width="2" fill="none" stroke-linecap="round"/>',
  cat: '<ellipse cx="0" cy="2" rx="4" ry="3.5" fill="#8a9ab0"/><g fill="#8a9ab0"><circle cx="-5" cy="-4" r="1.6"/><circle cx="-2" cy="-6.5" r="1.6"/><circle cx="2" cy="-6.5" r="1.6"/><circle cx="5" cy="-4" r="1.6"/></g>',
  horse: '<path d="M-7 7 Q-9 -8 0 -9 Q9 -8 7 7" stroke="#8a9ab0" stroke-width="4" fill="none"/>',
  monkey: '<ellipse cx="0" cy="2" rx="4" ry="5" fill="#8a9ab0"/><path d="M-3 -2 v-7 M-1 -3 v-8 M1 -3 v-8 M3 -2 v-7 M-4 2 l-6 -2" stroke="#8a9ab0" stroke-width="1.8" stroke-linecap="round"/>'
};
function trail4(kind, x0, y0, cx, cy, x1, y1, n, scale = 1){
  let s = '';
  for(let i = 0; i < n; i++){
    const t = (i + .5) / n, u = 1 - t;
    const x = u * u * x0 + 2 * u * t * cx + t * t * x1, y = u * u * y0 + 2 * u * t * cy + t * t * y1;
    const dx = 2 * u * (cx - x0) + 2 * t * (x1 - cx), dy = 2 * u * (cy - y0) + 2 * t * (y1 - cy);
    const a = Math.atan2(dy, dx) * 180 / Math.PI + 90, side = i % 2 ? 5 : -5, k = scale * (.7 + .5 * t);
    s += `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a.toFixed(1)}) translate(${side} 0) scale(${k.toFixed(2)})">${PRINT4[kind]}</g>`;
  }
  return s;
}
/* A snow-block wall in running bond: every other row is shifted by half a block. */
function wall4(x0, y0, w, rows, bw, bh){
  let s = '';
  for(let r = 0; r < rows; r++){
    const off = r % 2 ? -bw / 2 : 0, y = y0 + r * bh;
    for(let x = x0 + off; x < x0 + w; x += bw){ const a = Math.max(x, x0), b = Math.min(x + bw, x0 + w); s += `<rect x="${a}" y="${y}" width="${b - a}" height="${bh}" rx="3" fill="#fff" stroke="#c9d8e8" stroke-width="2"/>`; }
  }
  for(let x = x0; x < x0 + w; x += bw * 2) s += `<rect x="${x}" y="${y0 - bh * .7}" width="${bw * .9}" height="${bh * .7}" rx="3" fill="#fff" stroke="#c9d8e8" stroke-width="2"/>`;
  return s;
}
function buildWinter(){
  let fl = '';
  for(let i = 0; i < 70; i++) fl += `<circle class="wt-flake" style="animation-delay:-${rnd4(i + 3, 12).toFixed(2)}s;animation-duration:${(8 + rnd4(i + 7, 6)).toFixed(1)}s" cx="${rnd4(i, 1600).toFixed(0)}" cy="${rnd4(i + 11, 900).toFixed(0)}" r="${(1.4 + rnd4(i + 5, 2.4)).toFixed(1)}"/>`;
  $('#wt-snow').innerHTML = fl;
  let li = '';
  for(let i = 0; i < 15; i++) li += `<circle class="wt-light" style="animation-delay:-${(i % 3) * .5}s" cx="${258 + i * 21}" cy="${432 + (i % 2) * 4}" r="4" fill="${['#e2483d', '#f2c94c', '#3f8a4a', '#5aa0e0'][i % 4]}"/>`;
  $('#wt-lights').innerHTML = li;
  $('#wt-tracks').innerHTML = trail4('monkey', 1170, 890, 960, 760, 706, 650, 14) + trail4('bird', 900, 880, 960, 830, 1040, 790, 7)
    + trail4('cat', 1190, 870, 1150, 720, 1110, 560, 11) + trail4('horse', 650, 650, 800, 720, 920, 704, 8, 1.1);
  $('#wt-fortwall').innerHTML = wall4(160, 760, 330, 3, 50, 28);
  $('#wt-pfort').innerHTML = wall4(1190, 716, 370, 3, 50, 28);
}
function applyWinter(){
  const show = (sel, on) => { const el = $(sel); if(el) el.style.display = on ? '' : 'none'; };
  const sc = $('#sc-winter'); if(!sc) return;
  show('#wt-spunk', !S.f.spunkTaken); show('#hit-spunk4', !S.f.spunkTaken);
  show('#wt-nilsson', !!S.f.tracks);
  show('#wt-balls', !!S.f.balls && !S.f.steps);
  show('#wt-fortheap', !S.f.fort); show('#wt-fortwall', !!S.f.fort);
  show('#wt-ice', !S.f.steps);
  show('#wt-vhorse', !S.f.steps); show('#hit-horse4v', !S.f.steps);
  show('#wt-ghorse', !!S.f.steps); show('#hit-horse4g', !!S.f.steps); show('#wt-sledgeballs', !!S.f.balls);
  show('#wt-annwarm', !!S.f.warm); $('#wt-annika').classList.toggle('wt-shiver', !S.f.warm);
  show('#wt-carrot', !S.f.carrot);
  show('#wt-cap', !S.f.out4); show('#wt-capfly', !!S.f.out4); show('#wt-flag', !!S.f.out4); show('#wt-fight', !!S.f.out4);
  // the church clock: half past two, then three o'clock once everything is ready
  const three = ready4() || S.f.out4;
  $('#wt-hour').setAttribute('transform', `rotate(${three ? 90 : 75} 1020 292)`);
  $('#wt-min').setAttribute('transform', `rotate(${three ? 0 : 180} 1020 292)`);
}
/* After each job: once all four are done, the church clock strikes three. */
function done4(lines){
  if(!ready4()) return say(lines);
  say([...lines, ['sys', "Bong… bong… bong. The church clock strikes three!"], ['kling', "Three o'clock, children! Ready? Your team throws first!"], "Everything is ready: the fort, the snowballs, the horse with the sledge, and a warm Annika. Throw at the policemen's fort!"]);
}

/* ---------- hotspot handlers ---------- */
Object.assign(H, {
  spunk4(){ S.f.spunkTaken = true; give('spunk'); applyVisuals(); say(["The spunk's jam jar, on the kitchen windowsill, nice and warm. Pippi doesn't let it out in the snow.", "You take it anyway, tucked inside your coat. A spunk knows things. Even about snow."]); },
  snow4(){
    if(!S.f.angel){ S.f.angel = true; S.ach.snowangel = true; save(); return say(["Fresh, deep snow, without a single footprint. You flop backwards into it and wave your arms and legs.", "A perfect snow angel. Pippi says it's the best she's ever seen, apart from all of hers."]); }
    say("Your snow angel is still there, looking up at the sky.");
  },
  church4(){ say(ready4() || S.f.out4 ? "The church clock in the town says three o'clock. Snowball time!" : ["The church clock in the town. The little hand is between the II and the III, and the big hand points straight down: half past two.", "At three o'clock, the snowball fight begins."]); },
  gate4(){
    if(S.f.out4) return startCh5();
    say(["The garden gate. Outside, children are pulling sledges up the lane.", "Kling and Klang came in through it with their snow shovels. They mean business."]);
  },
  house4(){ say(["Villa Villekulla, with a thick white blanket of snow on the roof and smoke curling out of the chimney.", "It looks even more crooked in the snow. Pippi says the snow makes it lean the other way for a change."]); },
  window4(){ say(["Through the kitchen window: the stove is glowing, and a pan of milk is waiting for the hot chocolate.", "Whoever loses the snowball fight has to make it. Pippi has already put out a lot of cups."]); },
  thermo4(){ openThermo4(); },
  horse4(){
    if(S.f.steps) return say([["horse", "Pfrrrr!"], S.f.balls ? "The horse is harnessed to the sledge, which is piled high with snowballs. It looks very proud to be on your team." : "The horse is harnessed to the sledge, waiting for something to pull."]);
    if(S.f.carrot) return say([['horse', "Crunch."], "The horse is still chewing the snowman's nose, very happily."]);
    say([['horse', "Pfrrrr!"], "The horse is on the veranda in its winter blanket. Pippi wants it to pull the sledge with the snowballs.", "But the veranda steps are one big sheet of ice. Every time it puts a hoof on them, it slides."]);
  },
  steps4(){ if(S.f.steps) return say("The veranda steps, salted and safe. Even Mr Nilsson walks down them now, instead of sliding."); openSteps4(); },
  oak4(){
    if(!S.f.tracks) return say(["The old oak, with snow on every branch and a dark hollow in its trunk.", "Sparrows are squabbling over the bird feeder. Somewhere, a monkey is hiding with your mittens."]);
    say([['nilsson', "Eek!"], "Mr Nilsson peeks out of the hollow in the oak, very pleased with himself. He has a snowball of his own."]);
  },
  snowman4(){
    if(S.f.carrot) return say("The snowman has no nose any more. The horse says it wasn't him. The horse has orange lips.");
    S.f.snowTaps = (S.f.snowTaps || 0) + 1; save();
    if(S.f.snowTaps === 1) return say(["Pippi's snowman, wearing her old top hat and a green scarf, with a carrot for a nose.", "There are hoofprints all round it. Somebody has been admiring that carrot."]);
    if(S.f.snowTaps === 2) return say("You straighten the snowman's hat. Behind you, someone is breathing very loudly through its nose.");
    S.f.carrot = true; S.ach.carrot = true; save(); applyVisuals();
    say([['horse', "Crunch, crunch."], "The horse has stretched its neck all the way from the veranda and eaten the snowman's nose. It looks delighted."]);
  },
  tracks4(){ if(S.f.tracks) return say("The tracks in the snow. The one with five long fingers led straight to the old oak, and Mr Nilsson."); openTracks4(); },
  fort4(){
    if(S.f.out4) return say("Your fort, a bit battered, but still standing. Snowball champions!");
    if(S.f.fort && ready4()) return openThrow4();
    if(S.f.fort) return say("Your fort, strong and straight. Now get everything else ready before three o'clock.");
    openFort4();
  },
  ta4(){
    if(S.f.out4) return say([['tommy', "We beat the police!"], ['annika', "Kindly. We beat the police kindly."]]);
    if(!S.f.warm) return openWarm4();
    say([['tommy', "Ready for battle!"], ['annika', "Lovely and warm now. Three layers and mittens. I could stay out all day."]]);
  },
  pippi4(){
    if(S.f.out4) return say(['pippi', "The police are very good losers. Next year I'll let them win. Maybe."]);
    say(['pippi', ready4() ? "It's three o'clock! Throw, throw, throw!" : "I've rolled one snowball. It's a bit big. I'm saving it for later. I've never had a snowball fight with the police, so I'm sure I'll win."]);
  },
  police4(){
    if(S.f.out4) return say([['klang', "We surrender! The cap is a bit wet, but it'll dry."], ['kling', "Same time next year, children?"]]);
    if(ready4()) return openThrow4();
    say([['kling', "Our fort is ready, children! Is yours?"], ['klang', "At three o'clock sharp. Losers make the hot chocolate. With whipped cream!"]]);
  }
});

/* ---------- puzzle: the tracks in the snow (reading animal tracks) ---------- */
function openTracks4(){
  const pr = (kind, x, y, a, k = 1.6) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(${k})">${PRINT4[kind]}</g>`;
  const row = (kind, y) => [0, 1, 2, 3, 4].map(i => pr(kind, 130 + i * 52, y + (i % 2 ? 8 : -8), 90)).join('');
  const trails = [['A', 'cat'], ['B', 'monkey'], ['C', 'bird'], ['D', 'horse']];
  openModal('Tracks in the snow', 'Which ones lead to your mittens?', `
    <svg class="wt-tracksvg" viewBox="0 0 440 250" role="group" aria-label="${tx('Four trails of footprints')}">
      <rect width="440" height="250" rx="8" fill="#f4f8fc"/>
      ${trails.map(([l, k], i) => `<g class="wt-trail" data-k="${k}" tabindex="0" role="button" aria-label="${tx('Trail {l}', { l })}"><rect x="10" y="${12 + i * 58}" width="420" height="52" rx="8" fill="transparent"/><text x="40" y="${44 + i * 58}" font-size="22" font-weight="700" fill="#1f3f6a" font-family="Fredoka, sans-serif">${l}</text>${row(k, 38 + i * 58)}</g>`).join('')}
    </svg>
    <div class="wt-book">${tx('<b>Annika\'s nature book.</b> BIRD: three thin toes forward, one back. CAT: four round toes and no claw marks. HORSE: round hoofprints. The book has no monkeys in it. This is Sweden.')}</div>
    <div class="feedback" id="wt-tfb">${tx('Click the trail you think Mr Nilsson left.')}</div>`, body => {
    body.querySelectorAll('.wt-trail').forEach(g => {
      const pick = () => {
        const k = g.dataset.k, fb = $('#wt-tfb');
        if(k === 'monkey'){
          S.f.tracks = true; save(); give('mittens'); applyVisuals(); chord([523,659,784,1046]);
          fb.className = 'feedback good'; fb.textContent = tx('Five long fingers and a thumb, like a little hand. That\'s not in any Swedish nature book: it\'s Mr Nilsson! The trail leads to the old oak.');
          setTimeout(() => { closeModal(); say(["You follow the little handprints across the garden to the old oak. A straw hat pokes out of the hollow in the trunk.", ['nilsson', "Eek!"], "Mr Nilsson is wearing your mittens on his feet. He looks at you, sighs, and kicks them down into the snow.", ['pippi', "Well found! Monkeys have hands on their feet too, so they leave handprints everywhere."]]); }, 1900);
          return;
        }
        nope(); fb.className = 'feedback bad';
        fb.textContent = tx({ bird: 'Three thin toes forward and one back: a bird. The sparrows have been hopping to the bird feeder.',
          cat: 'Four round toes and no claw marks: a cat. Cats pull their claws in when they walk. It\'s the neighbour\'s cat, off along the fence.',
          horse: 'Round hoofprints: the horse, from the veranda to the snowman. It was after the carrot, not your mittens.' }[k]);
      };
      g.addEventListener('click', pick);
      g.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); pick(); } });
    });
  });
}

/* ---------- puzzle: snow that sticks (reading temperatures below zero) ---------- */
const THERMO4 = [
  { k: 'north', label: 'North wall, in the shade', t: -9 },
  { k: 'oak', label: 'Under the old oak', t: -4 },
  { k: 'sun', label: 'By the veranda, in the sun', t: -1 },
  { k: 'kitchen', label: 'Kitchen windowsill, inside', t: 20 }
];
function openThermo4(){
  if(S.f.balls) return say("The thermometer by the veranda says -1 °C. Perfect snowball weather. You've made a whole pile.");
  const y = t => 190 - (t + 10) * 5;
  let s = '<rect width="440" height="230" rx="8" fill="#f4f8fc"/>';
  for(let t = -10; t <= 20; t += 5) s += `<path d="M30 ${y(t)} H420" stroke="${t === 0 ? '#5aa0e0' : '#d9e4ef'}" stroke-width="${t === 0 ? 2 : 1}"/><text x="24" y="${y(t) + 4}" text-anchor="end" font-size="11" fill="#5a6a80" font-family="IBM Plex Mono, monospace">${t > 0 ? '+' + t : t}</text>`;
  THERMO4.forEach((th, i) => { const x = 80 + i * 96;
    s += `<rect x="${x - 7}" y="${y(20) - 6}" width="14" height="${y(-10) - y(20) + 12}" rx="7" fill="#fffaf0" stroke="#9aa0a6" stroke-width="2"/><rect x="${x - 3}" y="${y(th.t)}" width="6" height="${y(-10) - y(th.t) + 8}" fill="#d22d2d"/><circle cx="${x}" cy="${y(-10) + 14}" r="9" fill="#d22d2d"/>`; });
  openModal('Four thermometers', 'Where does the snow stick?', `
    <svg class="wt-thermosvg" viewBox="0 0 440 230" aria-hidden="true">${s}</svg>
    <div class="wt-spots">${THERMO4.map(th => `<button type="button" class="btn ghost wt-spot" data-k="${th.k}">${tx(th.label)}</button>`).join('')}</div>
    <div class="wt-book">${tx('Annika says: snow sticks best when it\'s just below freezing (0 °C), a little bit damp. Very cold snow is dry like powder, and above 0 °C it melts into slush.')}</div>
    <div class="feedback" id="wt-hfb">${tx('Read the thermometers. Where will you make the snowballs?')}</div>`, () => {
    document.querySelectorAll('.wt-spot').forEach(b => b.onclick = () => {
      const k = b.dataset.k, fb = $('#wt-hfb');
      if(k !== 'sun'){
        nope(); fb.className = 'feedback bad';
        fb.textContent = tx({ north: '-9 °C: nine degrees below freezing, the coldest of all. The snow is as dry as powdered sugar and falls apart in your hands.',
          oak: '-4 °C: four degrees below freezing. Warmer than the north wall, but the snow still crumbles.',
          kitchen: '+20 °C is Pippi\'s kitchen. Snowballs in there turn into puddles, and the floor is wet enough already.' }[k]);
        return;
      }
      if(!S.inv.includes('mittens')){ nope(); fb.className = 'feedback bad'; fb.textContent = tx('-1 °C, just below freezing: perfect snowball snow! But your fingers are frozen stiff. Get your mittens back first.'); return; }
      S.f.balls = true; save(); applyVisuals(); chord([523,659,784,1046]);
      fb.className = 'feedback good'; fb.textContent = tx('-1 °C: only one degree below freezing. The snow is a little damp, so it sticks. Squish, pat, pat: perfect snowballs!');
      setTimeout(() => { closeModal(); done4(["You make a big pile of snowballs on the sunny side of the veranda. -1 is warmer than -4, and -4 is warmer than -9: below zero, the bigger the number, the colder it is.", ['pippi', "Forty snowballs! I've made four hundred. Well, four. But they're big."]]); }, 1800);
    });
  });
}

/* ---------- puzzle: the fort (blocks laid like bricks: every joint has a whole block on top) ---------- */
const FORT4_ROWS = 4, FORT4_BW = 60, FORT4_BH = 30, FORT4_W = 300;
function openFort4(){
  const off = S.frt || (S.frt = [0, 0, 0, 0]);
  openModal('Building the fort', 'Snow blocks, four rows high', `
    <svg class="wt-fortsvg" viewBox="0 0 380 190" aria-hidden="true" id="wt-fortsvg"></svg>
    <div class="row-btns wt-rowbtns">${off.map((_, r) => `<button type="button" class="btn ghost wt-shift" data-r="${r}">${tx('Shift row {n}', { n: FORT4_ROWS - r })}</button>`).join('')}</div>
    <div class="row-btns"><button type="button" class="btn" id="wt-push">${tx('Pippi tests it with a push')}</button></div>
    <div class="feedback" id="wt-ffb">${tx('Click a row to shift it by half a block. Then let Pippi push the wall to see if it holds.')}</div>`, () => {
    const fb = $('#wt-ffb');
    const draw = (crack) => {
      let s = '<rect width="380" height="190" fill="#dfe9f3"/><rect y="170" width="380" height="20" fill="#fff"/>';
      off.forEach((o, r) => { const y = 170 - (FORT4_ROWS - r) * FORT4_BH;
        for(let x = 40 - (o ? FORT4_BW / 2 : 0); x < 40 + FORT4_W; x += FORT4_BW){ const a = Math.max(x, 40), b = Math.min(x + FORT4_BW, 40 + FORT4_W);
          s += `<rect x="${a}" y="${y}" width="${b - a}" height="${FORT4_BH}" rx="3" fill="#fff" stroke="#9fb4cc" stroke-width="2"/>`; } });
      if(crack) s += `<path d="${crack}" stroke="#d22d2d" stroke-width="4" fill="none" stroke-dasharray="6 4"/>`;
      $('#wt-fortsvg').innerHTML = s;
    };
    draw();
    document.querySelectorAll('.wt-shift').forEach(b => b.onclick = () => { const r = +b.dataset.r; off[r] = off[r] ? 0 : 1; save(); beep(500 + r * 60, .04); fb.className = 'feedback'; fb.textContent = ''; draw(); });
    $('#wt-push').onclick = () => {
      const same = [];
      for(let r = 0; r < FORT4_ROWS - 1; r++) if(off[r] === off[r + 1]) same.push(r);
      if(!same.length){
        S.f.fort = true; save(); applyVisuals(); chord([523,659,784,1046]); draw();
        fb.className = 'feedback good'; fb.textContent = tx('Pippi pushes with all her might, and the wall doesn\'t budge! Every joint has a whole block on top of it, so the push spreads out over many blocks. That\'s how bricks are laid in a house wall too.');
        setTimeout(() => { closeModal(); done4(["Your fort stands strong and straight, with little battlements on top.", ['klang', "Kling, look! They know how to build a wall."]]); }, 2200);
        return;
      }
      nope(); fb.className = 'feedback bad';
      const r = same[0], y0 = 170 - (FORT4_ROWS - r) * FORT4_BH, x = 40 + FORT4_BW * 2 - (off[r] ? FORT4_BW / 2 : 0);
      draw(`M${x} ${y0} V${y0 + FORT4_BH * 2}`);
      fb.textContent = tx(same.length === FORT4_ROWS - 1 ? 'Crack! The joints are all in one straight line, from the top to the bottom, and the wall splits along it and topples over. Shift every other row.'
        : 'Crack! Where two rows have their joints in the same place, the wall still splits. Every joint needs a whole block on top of it.');
    };
  });
}

/* ---------- puzzle: the icy steps (salt melts ice, even below 0 °C) ---------- */
function openSteps4(){
  openModal('The icy steps', 'The horse can\'t get down', `
    <p class="flag-p">${tx('The veranda steps are covered in smooth, hard ice, and the horse slides on every step. Pippi\'s kitchen has a kettle of warm water, a bag of sugar, a box of salt, and outside there\'s plenty of snow. What do you put on the steps?')}</p>
    <div class="hands">${[['water', 'Warm water from the kettle'], ['sugar', 'Sugar'], ['salt', 'Salt'], ['snow', 'More snow']].map(([k, l]) => `<button type="button" class="hand" data-i="${k}">${tx(l)}</button>`).join('')}</div>
    <div class="feedback" id="wt-sfb"></div>`, () => {
    document.querySelectorAll('.hand[data-i]').forEach(b => b.onclick = () => {
      const k = b.dataset.i, fb = $('#wt-sfb');
      if(k !== 'salt'){
        nope(); fb.className = 'feedback bad';
        fb.textContent = tx({ water: 'It melts the ice… for one minute. Then it freezes again, smoother than ever. Now the steps are a slide! Mr Nilsson loves it.',
          sugar: 'The horse licks the steps. Very happy horse, still very icy steps.',
          snow: 'The snow just slides about on top of the ice, and the horse slides with it.' }[k]);
        return;
      }
      S.f.steps = true; save(); applyVisuals(); chord([523,659,784,1046]);
      fb.className = 'feedback good'; fb.textContent = tx('Salt! It mixes with the ice into salty water, and salty water stays runny even below 0 °C. The ice melts away. (Sand works too: it doesn\'t melt the ice, but it gives hooves something to grip.)');
      setTimeout(() => { closeModal(); done4(["Clip, clop, clip, clop: the horse walks carefully down the steps into the garden. Pippi harnesses it to the sledge.", S.f.balls ? "You load the snowballs onto the sledge, and the horse pulls them to your fort." : "Now it just needs something to pull."]); }, 2200);
    });
  });
}

/* ---------- puzzle: keeping Annika warm (trapped air keeps you warm) ---------- */
function openWarm4(){
  const round = S.wrm || 0;
  const q = round === 0
    ? ['Annika is shivering. "I\'m too cold to throw anything." Pippi opens her wardrobe. What keeps Annika warmest?', [['one', 'One thick cotton jumper'], ['layers', 'Three thin layers: a vest, a woolly jumper and a coat'], ['dress', 'Pippi\'s summer dress, put on twice']]]
    : ['Now her hands. Annika\'s fingers are like icicles. What keeps hands warmest?', [['gloves', 'Gloves, with a finger for every finger'], ['mittens', 'Mittens'], ['socks', 'Pippi\'s socks (one has a hole)']]];
  openModal('Keeping Annika warm', round === 0 ? 'Pippi\'s wardrobe' : 'And her hands?', `
    <p class="flag-p">${tx(q[0])}</p>
    <div class="hands">${q[1].map(([k, l]) => `<button type="button" class="hand" data-w="${k}">${tx(l)}</button>`).join('')}</div>
    <div class="feedback" id="wt-wfb"></div>`, () => {
    document.querySelectorAll('.hand[data-w]').forEach(b => b.onclick = () => {
      const k = b.dataset.w, fb = $('#wt-wfb');
      if(round === 0 && k === 'layers'){
        S.wrm = 1; save(); chord([523,659,784]);
        fb.className = 'feedback good'; fb.textContent = tx('Layers! Warm air gets trapped between the layers and keeps the cold out, like a sparrow fluffing up its feathers.');
        setTimeout(() => { if(!$('#modal').hidden) openWarm4(); }, 1700);
        return;
      }
      if(round === 1 && k === 'mittens'){
        S.f.warm = true; save(); applyVisuals(); chord([523,659,784,1046]);
        fb.className = 'feedback good'; fb.textContent = tx('Mittens! In a mitten your fingers are together, so they keep each other warm. In a glove every finger is out in the cold on its own.');
        setTimeout(() => { closeModal(); done4([['annika', "I'm as warm as a pancake! Three layers, a hat and mittens. Now I can throw."], ['tommy', "Annika is our secret weapon. Nobody expects her to aim so well."]]); }, 2000);
        return;
      }
      nope(); fb.className = 'feedback bad';
      fb.textContent = tx({ one: 'One thick jumper is warm, but it\'s only one layer. Several thin layers trap more warm air between them.',
        dress: 'Annika says a summer dress is a summer dress, however many times you put it on.',
        gloves: 'Gloves keep every finger on its own, out in the cold. Brrr.',
        socks: 'Socks on your hands are a bit like mittens, Pippi! But this one has a hole, and the snow gets in.' }[k]);
    });
  });
}

/* ---------- puzzle: the throw (about 45° goes furthest) ---------- */
const THROW4 = { x0: 70, y0: 150, far: 330 };
function openThrow4(){
  const st = S.ang || (S.ang = { a: 30 });
  openModal('Snowball fight!', 'Aim for Klang\'s cap', `
    <svg class="wt-throwsvg" viewBox="0 0 480 220" aria-hidden="true" id="wt-throwsvg"></svg>
    <div class="row-btns">${[15, 30, 45, 60, 75, 90].map(a => `<button type="button" class="btn ghost wt-ang" data-a="${a}">${a === 90 ? tx('Straight up') : a + '°'}</button>`).join('')}</div>
    <div class="row-btns"><button type="button" class="btn" id="wt-throw">${tx('Throw!')}</button></div>
    <div class="feedback" id="wt-afb">${tx('You always throw just as hard. Only the angle changes. At which angle does the snowball fly furthest?')}</div>`, () => {
    const fb = $('#wt-afb');
    const scene = (path, land) => {
      let s = '<rect width="480" height="220" fill="#dfe9f3"/><rect y="190" width="480" height="30" fill="#fff"/>';
      s += '<rect x="30" y="160" width="60" height="30" fill="#fff" stroke="#9fb4cc" stroke-width="2"/><rect x="360" y="140" width="50" height="50" fill="#fff" stroke="#9fb4cc" stroke-width="2"/>';
      s += '<circle cx="400" cy="132" r="10" fill="#f3c9a4"/><path d="M388 126 h24 v-6 q-12 -8 -24 0z" fill="#1f2f5a"/><circle cx="70" cy="146" r="8" fill="#f3c9a4"/>';
      if(path) s += `<path class="wt-arc" d="${path}" fill="none" stroke="#5aa0e0" stroke-width="3" stroke-dasharray="6 5"/><circle cx="${land[0]}" cy="${land[1]}" r="7" fill="#fff" stroke="#5aa0e0" stroke-width="2"/>`;
      $('#wt-throwsvg').innerHTML = s;
      document.querySelectorAll('.wt-ang').forEach(b => b.classList.toggle('on', +b.dataset.a === st.a));
    };
    const arc = a => {
      const r = THROW4.far * Math.sin(2 * a * Math.PI / 180), h = a === 90 ? 140 : r * Math.tan(a * Math.PI / 180) / 4;
      let d = '';
      for(let i = 0; i <= 30; i++){ const t = i / 30, x = THROW4.x0 + r * t, y = Math.max(6, THROW4.y0 - 4 * h * t * (1 - t)); d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)} `; }
      return [d, [THROW4.x0 + r, THROW4.y0]];
    };
    scene();
    document.querySelectorAll('.wt-ang').forEach(b => b.onclick = () => { st.a = +b.dataset.a; save(); beep(400 + st.a * 4, .04); scene(); });
    $('#wt-throw').onclick = () => {
      const [d, land] = arc(st.a); scene(d, land); beep(700, .08, 'sine');
      if(st.a === 45){
        S.f.out4 = true; save(); chord([523,659,784,1046,1318,1568]);
        fb.className = 'feedback good'; fb.textContent = tx('Whoosh… over their wall… SPLAT! Klang\'s cap flies off! Thrown just as hard, about 45°, halfway between flat and straight up, goes furthest.');
        setTimeout(() => { closeModal(); applyVisuals(); win4(); }, 2200);
        return;
      }
      nope(); fb.className = 'feedback bad';
      if(st.a === 90){ S.ach.ownhead = true; save(); }
      fb.textContent = tx({ 15: 'Too flat: the snowball skims along and plops into the snow halfway there.',
        30: 'Splat, right against the front of their wall! Close. And here\'s a funny thing: 60° lands in exactly the same spot.',
        60: 'Up high… and splat against the front of their wall! Close. And here\'s a funny thing: 30° lands in exactly the same spot.',
        75: 'Way up into the sky… and down in the middle of the garden. Too steep.',
        90: 'Straight up… and straight down. On your own head. Kling and Klang laugh so much they nearly fall over.' }[st.a]);
    };
  });
}

/* ---------- intro, start and win ---------- */
function intro4(){
  say([["sys", "Winter at Villa Villekulla. The garden is deep in snow, the windows glow, and smoke curls out of the chimney."],
       ["pippi", "Snow! Heaps and heaps of it! What shall we do first?"],
       ["sys", "Two policemen come stamping up the garden path with snow shovels: Kling and Klang. Nobody is in trouble. They're grinning."],
       ["kling", "Good afternoon, children! We are the snowball champions of the whole police station."],
       ["klang", "And nobody has ever beaten us. So we challenge you! At three o'clock, when the church clock strikes. Losers make the hot chocolate."],
       ["pippi", "I've never had a snowball fight with the police, so I'm sure I'll win!"],
       ["sys", "Kling and Klang start building a fort on the far side of the garden. The church clock says half past two."],
       ["nilsson", "Eek!"],
       ["you", "Half an hour to get ready. And Mr Nilsson has just run off with my mittens!"]],
    () => { S.f.introDone = true; save(); });
}
function startCh4(){
  setUnlocked4();
  S = Object.assign(fresh(), { ach: S.ach || {}, ch: 4, scene: 'winter' });
  S.started = true; sel = null;
  $('#title').hidden = true; $('#win').hidden = true;
  renderInv(); applyVisuals(); $('#timer').textContent = '00:00'; save(); intro4();
}
function win4(){
  say([["sys", "Your snowball sails up in a perfect curve, over their wall… and knocks Klang's cap clean off his head."],
       ["klang", "Bull's-eye! Kling, they got me!"],
       ["kling", "Hold on, Klang, I'll…"],
       ["sys", "Then Pippi rolls her enormous snowball across the garden. It's as big as a pantry. Their fort disappears underneath it."],
       ["kling", "We surrender! Has anybody got a white flag?"],
       ["pippi", "Have my handkerchief. It's nearly white. Well, it was."],
       ["sys", "Everybody troops into the warm kitchen. The policemen make the hot chocolate, with extra whipped cream, and Mr Nilsson gets the first cup."],
       ["annika", "We beat the snowball champions of the whole police station!"],
       ["klang", "Same time next year?"]],
    () => showWin());
}
