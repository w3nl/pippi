// Chapter 7: The South Sea island. Pippi visits her father's island: a whole day, from morning to moonlight.
// Captain Longstocking has buried a surprise for Pippilotta on Turtle Islet, which you can only walk to at low tide.
// Loaded in order by js/boot.js; all game files share the same global scope.

const UNLOCK7 = KEY + '-ch7';
function unlocked7(){ try{ if(localStorage.getItem(UNLOCK7) === '1') return true; }catch(e){} return S.ch >= 7 || (S.ch === 6 && !!S.f.out6); }
function setUnlocked7(){ try{ localStorage.setItem(UNLOCK7, '1'); }catch(e){} }

/* ---------- Chapter 7 items ---------- */
Object.assign(ITEMS, {
  map: { name:'Treasure map', desc:"Captain Longstocking's map of Turtle Islet, drawn on the back of a menu. It says: 12 of MY paces.",
    svg:'<svg viewBox="0 0 44 44"><path d="M7 10l10-3 12 3 10-3v27l-10 3-12-3-10 3z" fill="#f3e6c4" stroke="#b5651d" stroke-width="1.5"/><path d="M16 7v27M28 10v27" stroke="#d9c79a"/><path d="M10 28q8-10 16-6t10-8" stroke="#8a5a2b" stroke-width="1.5" stroke-dasharray="2 2" fill="none"/><path d="M31 12l4 4M35 12l-4 4" stroke="#c4302b" stroke-width="2"/></svg>' },
  spade: { name:'A spade', desc:"The king's own spade, for digging up surprises.",
    svg:'<svg viewBox="0 0 44 44"><path d="M30 6L18 28" stroke="#8a5a2b" stroke-width="4" stroke-linecap="round"/><path d="M26 6h10" stroke="#8a5a2b" stroke-width="4" stroke-linecap="round"/><path d="M14 24q-6 10 0 14q10 2 12-8z" fill="#9aa0a7" stroke="#5a6068" stroke-width="1.5"/></svg>' }
});

/* What time of day it is on the island: morning → low tide → the shower → dusk. */
const lowtide7 = () => !!S.f.tide;
const storm7 = () => !!S.f.chest && !S.f.storm;
const dusk7 = () => !!S.f.storm;

/* ---------- the island ---------- */
function applyIsland(){
  const show = vis;   // smooth when you can see it happen (core.js)
  const sc = $('#sc-island'); if(!sc) return;
  sc.classList.toggle('lowtide', lowtide7());
  sc.classList.toggle('storm', storm7());
  sc.classList.toggle('dusk', dusk7());
  sc.classList.toggle('hatch', !!S.f.out7);
  show('#si-sun', !storm7() && !dusk7()); show('#si-stormsky', storm7()); show('#si-rain', storm7()); show('#si-flash', storm7());
  show('#si-dusksky', dusk7()); show('#si-moonpath', dusk7()); show('#si-tint', dusk7());
  show('#si-torches', dusk7() && !S.f.out7); show('#si-lantern', dusk7() && !S.f.out7);
  show('#si-x', !!S.f.paces && !S.f.dug); show('#si-hole', !!S.f.dug); show('#hit-dig7', !!S.f.paces && !S.f.chest);
  show('#si-hatch', !!S.f.out7); show('#si-eggs', !S.f.out7);
  show('#si-shovel', !S.f.spadeTaken); show('#hit-shovel7', !S.f.spadeTaken);
  show('#si-spunk', !S.f.spunkTaken); show('#hit-spunk7', !S.f.spunkTaken);
  show('#si-captain .zz', !S.f.mapTaken || (!!S.f.tide && !S.f.paces));
}

/* ---------- hotspot handlers ---------- */
const has7 = id => S.inv.includes(id);
Object.assign(H, {
  spunk7(){ S.f.spunkTaken = true; give('spunk'); applyVisuals(); say(["The spunk's jam jar, next to the sundial. Pippi has put it in the shade, so the spunk doesn't get sunburnt.", "You take it. A spunk knows things. Even about islands."]); },
  captain7(){
    if(S.f.out7) return say([['captain', "What a day, Pippilotta! Treasure, thunder and turtles. Tomorrow we'll do it all again, backwards."]]);
    if(storm7()) return openThunder7();
    if(!S.f.mapTaken){
      S.f.mapTaken = true; give('map'); applyVisuals();
      return say([['captain', "Zzz… whuh? Pippilotta! Welcome to my island! I'm the king here, you know. That's why I wear my crown on my hat."], ['captain', "I've buried a surprise for you on Turtle Islet, out in the lagoon. Here's my map. Follow MY paces exactly!"], ['pippi', "A treasure! Hurray! Can we go now?"], ['captain', "Only at low tide, when the sandbar comes out of the water. Look at the sundial to see what time it is, and the tide post to see when the water goes down. And now… zzz…"]]);
    }
    if(!S.f.tide) return say([['captain', "Zzz… the tide… the sundial… zzz…"], "The king is fast asleep in his hammock. He snores like the Hoppetossa's foghorn."]);
    if(!S.f.paces) return say([['captain', "Low tide! Off you go. Twelve of MY paces from the turtle rock, mind. My paces are one metre long, exactly. I measured them once."]]);
    if(!S.f.chest) return say([['captain', "Did you find it? Did you? Don't tell me! Yes, tell me!"]]);
    say([['captain', "Night is falling, and the feast is ready. But first, look at the turtle nest: tonight's the night!"]]);
  },
  sundial(){
    if(S.f.sundial) return say(S.f.tide ? "The sundial says it's the afternoon. The shadow has swung right round to the other side." : "The sundial says 9 o'clock in the morning. The stick's shadow points away from the sun.");
    openSundial7();
  },
  tidepost(){
    if(S.f.tide) return say("The water is way down the striped post now. Low tide! The sandbar to Turtle Islet is dry.");
    if(!S.f.sundial) return say(["The tide post: a striped pole in the lagoon. Right now the water is right up at the top stripe.", ['annika', "To know when the water goes down, we first need to know what time it is now."]]);
    openTide7();
  },
  lagoon7(){ say(lowtide7() ? "The lagoon at low tide: rock pools full of starfish and crabs, and a sandy path out to Turtle Islet." : "The lagoon, as clear as glass. Little striped fish dart about. Turtle Islet is out in the middle."); },
  islet7(){
    if(!S.f.tide) return say(["Turtle Islet: one palm tree, and a rock shaped like a turtle.", "The sandbar that leads there is under water. You would have to swim, and the horse can't."]);
    if(!S.f.paces) return has7('map') ? openPaces7() : say("Turtle Islet, at low tide. To find the surprise, you need the captain's map.");
    if(!S.f.dug) return say(["There's the X in the sand, exactly 12 metres from the turtle rock.", "Now you need something to dig with."]);
    if(!S.f.chest) return openChest7();
    say("The hole where the treasure chest was. A crab has moved in already.");
  },
  dig7(){
    if(S.f.dug) return S.f.chest ? H.islet7() : openChest7();
    say("The X. Dig here! But not with your hands: the sand is full of crabs' toes.");
  },
  shovel7(){ S.f.spadeTaken = true; give('spade'); applyVisuals(); say("A spade, leaning against the king's hut. You take it. Kings don't dig their own holes."); },
  hut7(){
    if(S.f.out7) return say("The king's hut. The feast is in full swing behind it: you can smell grilled fish and coconut cake.");
    if(storm7()) return say("Everybody is squashed into the king's hut while the rain drums on the roof. The horse too.");
    say(["The king's hut, made of bamboo with a roof of palm leaves. Inside: a hammock, a chest of sea charts, and a very big chair.", 'Captain Longstocking says it is a palace. Pippi says it is a very good palace.']);
  },
  sky7(){
    if(storm7()) return openThunder7();
    if(dusk7()) return say("The first stars come out over the island. The Moon is rising over the sea and making a silver path on the water.");
    say(S.f.tide ? "The sun has moved across the sky since this morning. It's afternoon now." : "A hot blue sky. The sun is still low in the east: it's morning.");
  },
  ship7(){ say(["The Hoppetossa, at anchor in the lagoon. She looks very pleased to be resting.", "Her sails are rolled up, and her anchor chain goes straight down into the clear water. You can see the anchor on the sand at the bottom."]); },
  nest7(){
    if(S.f.out7) return say("The nest is empty. Every baby turtle made it to the sea!");
    if(!dusk7()) return say(["A sea turtle's nest, with a little fence of shells around it. The mother turtle laid her eggs here, deep in the warm sand.", ['pippi', "They'll hatch tonight, Dad says. Baby turtles always come out in the dark."]]);
    openTurtles7();
  },
  torches7(){
    if(dusk7() && !S.f.out7) return openTurtles7();
    say(dusk7() ? "The torches have been put out on this side. The moon is bright enough." : "Torches for tonight's feast. They'll be lit when it gets dark.");
  },
  palm7(){
    S.f.bonks = (S.f.bonks || 0) + 1; save();
    if(S.f.bonks >= 3){ S.ach.bonk = true; save(); return say(["You shake the palm tree. BONK! A coconut lands right on your head.", ['nilsson', "Eek eek eek!"], "Mr Nilsson thinks that's the funniest thing he has ever seen."]); }
    say("A tall coconut palm. Mr Nilsson is halfway up, hugging a coconut. Better not shake it too hard.");
  },
  parrot7(){
    S.f.squawks = (S.f.squawks || 0) + 1; save();
    if(S.f.squawks >= 3){ S.ach.polly = true; save(); return say([['parrot', "Pluttification! Pluttification! Squawk!"], ['pippi', "I taught him that. He's much better at it than Miss."]]); }
    say([['parrot', S.f.chest ? "Treasure! Treasure! Squawk!" : "Squawk! Twelve paces! Twelve paces!"], "The king's parrot. It repeats everything it hears. Mostly the captain."]);
  },
  nilsson7(){ say([['nilsson', "Eek!"], "Mr Nilsson is up the palm tree with a coconut. He has finally found a country where the fruit grows at monkey height."]); },
  horse7(){ say(["The horse is wearing a garland of flowers and looks very relaxed. It has never been on holiday before.", ['pippi', "He's going to learn to surf. Tomorrow."]]); },
  kids7(){
    if(S.f.out7) return say([['annika', "Turtles, treasure and a thunderstorm. Nobody at school is going to believe us."], ['tommy', "We'll bring them a coconut."]]);
    if(storm7()) return say([['annika', "Thunder! Tommy, I don't like it."], ['tommy', "Count the seconds, Annika. Then we'll know how far away it is."]]);
    say([['tommy', "We're building a sandcastle. It has a moat, a tower, and a room for the horse."], ['annika', "Pippi, can you stop standing on your hands for a minute? You're kicking sand in the moat."]]);
  },
  pippi7(){ say(['pippi', S.f.out7 ? "Goodbye, little turtles! Write to us!" : S.f.chest ? "Eighteen kilos! Exactly the right amount. Dad knows me so well." : "On this island everybody walks on their hands on Tuesdays. Or they should."]); }
});

/* ---------- puzzle: the sundial (a shadow points away from the sun; it is shortest at noon) ---------- */
const DIAL_NOW = 9;   // 9 o'clock in the morning
const dialPt = (h, r) => { const t = Math.PI - (h - 6) / 12 * Math.PI; return [150 + r * Math.cos(t), 120 + r * Math.sin(t)]; };
function openSundial7(){
  const st = S.sdl || (S.sdl = { r: 0, pick: 0 });
  openModal('The sundial', 'A stick, a stone, and the sun', `
    <svg class="dial7-svg" translate="no" viewBox="0 0 300 250" aria-hidden="true" id="dial7-svg"></svg>
    <div class="dial7-ask" id="dial7-ask"></div>
    <div class="row-btns" id="dial7-opts" hidden>${['It is shortest', 'It is longest', 'It disappears completely', 'It points at the sun'].map((o, i) => `<button type="button" class="btn ghost d6o" data-i="${i}">${tx(o)}</button>`).join('')}</div>
    <div class="feedback" id="dial7-fb"></div>`, () => {
    const fb = $('#dial7-fb');
    const draw = () => {
      const [sx, sy] = dialPt(DIAL_NOW + 12, 112);   // the sun: the opposite way from the shadow
      let g = `<rect width="300" height="250" fill="#f6e2a8"/><circle cx="150" cy="120" r="96" fill="#d8d2c7" stroke="#8a8378" stroke-width="4"/>`;
      g += `<g transform="translate(${sx.toFixed(1)} ${sy.toFixed(1)})"><circle r="16" fill="#ffe27a"/><g stroke="#f2a13a" stroke-width="3"><path d="M0 -24v6M0 18v6M-24 0h6M18 0h7"/></g></g>`;
      for(let h = 6; h <= 18; h++){ const [x, y] = dialPt(h, 80), lab = h > 12 ? h - 12 : h;
        g += `<g class="hr${st.r === 0 ? ' pick' : ''}" data-h="${h}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="11" fill="${st.pick === h ? '#f2c94c' : '#f3efe3'}" stroke="#6a6458" stroke-width="1.5"/><text x="${x.toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="700" fill="#3a3a3a">${lab}</text></g>`; }
      if(st.pick){ const [x, y] = dialPt(st.pick, 64); g += `<path d="M150 120 L${x.toFixed(1)} ${y.toFixed(1)}" stroke="#000" stroke-width="7" stroke-linecap="round" opacity=".3"/>`; }
      g += `<circle cx="150" cy="120" r="6" fill="#6a6458"/><text x="150" y="238" text-anchor="middle" font-size="12" fill="#5a3a1a">${tx('morning ← → afternoon')}</text>`;
      $('#dial7-svg').innerHTML = g;
      $('#dial7-ask').innerHTML = st.r === 0 ? tx('Mr Nilsson borrowed the shadow-stick, so the sundial has no shadow. Before you put the stick back: the sun is up there. <b>Which hour mark will the stick\'s shadow point to?</b> Click it.')
        : tx('<b>And at 12 o\'clock, when the sun is at its highest in the sky, what happens to the shadow?</b>');
      $('#dial7-opts').hidden = st.r !== 1;
      document.querySelectorAll('#dial7-svg .hr.pick').forEach(el => el.onclick = () => {
        const h = +el.dataset.h; st.pick = h; save(); beep(600, .03); draw();
        if(h === DIAL_NOW){ st.r = 1; save(); chord([523, 659, 784]); fb.className = 'feedback good'; fb.textContent = tx("You put the stick back, and its shadow falls on the 9. A shadow always points away from the sun. It's 9 o'clock in the morning!"); draw(); return; }
        nope(); fb.className = 'feedback bad';
        fb.textContent = tx(h > 12 ? 'That mark is on the same side as the sun! A shadow never points towards the sun: it points away from it.' : "Close, but the shadow points exactly the opposite way from the sun. Draw a line from the sun, through the stick, and keep going.");
      });
    };
    draw();
    document.querySelectorAll('.d6o').forEach(b => b.onclick = () => {
      const i = +b.dataset.i;
      if(i === 0){
        S.f.sundial = true; S.sdl = null; save(); applyVisuals(); chord([523, 659, 784, 1046]);
        fb.className = 'feedback good'; fb.textContent = tx('Shortest! When the sun is high, the shadow is short; in the morning and evening, when the sun is low, shadows are long. So: 9 o\'clock now, and a short shadow at lunchtime.');
        setTimeout(() => { closeModal(); say([['pippi', "Nine o'clock! On this island that's breakfast time, so I've had three breakfasts already."], ['annika', "Now the tide post. When will the water go down?"]]); }, 2200);
        return;
      }
      nope(); fb.className = 'feedback bad';
      fb.textContent = tx(['', 'Longest is when the sun is low, in the morning and evening. At noon it is as high as it gets.', 'Only if the sun is exactly overhead, and even then the stick has a tiny shadow under it. Not quite.', 'A shadow never points at the sun. Never ever. Not even on a South Sea island.'][i]);
    });
  });
}

/* ---------- puzzle: the tide (two high tides a day; about 6 hours from high to low; the Moon pulls the sea) ---------- */
function openTide7(){
  const st = S.tdq || (S.tdq = { r: 0 });
  openModal('The tide post', 'High tide now: the water is at the top stripe', `
    <div class="tide7">
      <svg class="tide7-svg" viewBox="0 0 120 220" aria-hidden="true"><rect width="120" height="220" fill="#bfe8f7"/><rect y="40" width="120" height="180" fill="#3cd0d0"/><rect x="52" y="10" width="16" height="200" fill="#fffaf0"/>${[0, 1, 2, 3, 4].map(i => `<rect x="52" y="${20 + i * 40}" width="16" height="20" fill="#c4302b"/>`).join('')}<path d="M0 40 q15 -6 30 0 t30 0 t30 0 t30 0" stroke="#fff" stroke-width="3" fill="none"/></svg>
      <div class="tide7-side">
        <p class="flag-p">${tx('The captain painted a sign on the post: "The sea goes OUT for about 6 hours, then comes back IN for about 6 hours. And then it does it all again."')}</p>
        <div id="tide7-q"></div>
      </div>
    </div>
    <div class="feedback" id="tide7-fb"></div>`, () => {
    const fb = $('#tide7-fb');
    const Q = [
      { ask: "It's 9 o'clock in the morning, and the water is as high as it goes. <b>When will it be at its lowest, so you can walk to Turtle Islet?</b>", opts: ["12 o'clock", "3 o'clock", "6 o'clock", "9 o'clock tonight"], ok: 1,
        no: ["That's only 3 hours: the water will be halfway down the post. Not low enough.", '', "6 o'clock is 9 hours later. By then the sea is already coming back in.", "9 o'clock tonight is 12 hours later: 6 hours out, 6 hours back in. High tide again!"] },
      { ask: '<b>But what makes the sea go in and out, twice a day?</b>', opts: ['The wind blows it', 'The Moon pulls on it', 'The fish drink it and spit it out'], ok: 1,
        no: ['The wind makes waves, but it can\'t move a whole ocean in and out twice a day, every day, even when it\'s calm.', '', "Pippi likes that idea a lot. But no: there aren't THAT many thirsty fish."] }
    ];
    const draw = () => { const q = Q[st.r]; $('#tide7-q').innerHTML = `<p>${tx(q.ask)}</p><div class="row-btns">${q.opts.map((o, i) => `<button type="button" class="btn ghost t6o" data-i="${i}">${tx(o)}</button>`).join('')}</div>`;
      document.querySelectorAll('.t6o').forEach(b => b.onclick = () => {
        const i = +b.dataset.i;
        if(i !== q.ok){ nope(); fb.className = 'feedback bad'; fb.textContent = tx(q.no[i]); return; }
        chord([523, 659, 784]);
        if(st.r === 0){ st.r = 1; save(); fb.className = 'feedback good'; fb.textContent = tx("3 o'clock! 9 o'clock plus 6 hours: 10, 11, 12, 1, 2, 3."); draw(); return; }
        S.f.tide = true; S.tdq = null; save(); applyVisuals();
        fb.className = 'feedback good'; fb.textContent = tx('The Moon! Its pull lifts the sea into a big bulge, and the Earth turns underneath it. That makes two high tides and two low tides every day.');
        setTimeout(() => { closeModal(); say(["Six hours is a long time. Everybody has a swim, then a picnic, then a nap in the shade.", "At 3 o'clock, the water has slipped all the way down the tide post. A sandy path has come up out of the lagoon, all the way to Turtle Islet, with rock pools full of starfish along the way.", ['pippi', "Low tide! Treasure time!"]]); }, 2400);
      }); };
    draw();
  });
}

/* ---------- puzzle: the captain's paces (measuring: everybody's pace is a different length, so we use metres) ---------- */
const PACE_GOAL = 12;   // 12 of the captain's paces, and his paces are 1 metre
const WALKERS7 = [{ k: 'pippi', who: 'Pippi', cm: 50 }, { k: 'tommy', who: 'Tommy', cm: 40 }, { k: 'annika', who: 'Annika', cm: 30 }, { k: 'horse', who: 'The horse', cm: 200 }];
function openPaces7(){
  const st = S.pcs || (S.pcs = { w: 0, n: 12 });
  openModal("The captain's map", '"From the turtle rock: 12 of MY paces towards the palm. Dig at the X."', `
    <p class="flag-p">${tx("The captain is far too comfortable in his hammock to walk to the islet himself. His paces are exactly 1 metre long. Who walks, and how many paces?")}</p>
    <div class="row-btns walkers">${WALKERS7.map((w, i) => `<button type="button" class="btn ghost wk7" data-i="${i}">${tx('{who}: {cm} cm a pace', { who: tx(w.who), cm: w.cm })}</button>`).join('')}</div>
    <label class="pace7">${tx('Paces:')} <b id="pc7-n"></b><input type="range" id="pc7" min="1" max="40" step="1" value="${st.n}"></label>
    <svg class="pace7-svg" translate="no" viewBox="0 0 400 90" aria-hidden="true" id="pace7-svg"></svg>
    <div class="row-btns"><button type="button" class="btn" id="pc7-go">${tx('Dig here!')}</button></div>
    <div class="feedback" id="pc7-fb"></div>`, () => {
    const fb = $('#pc7-fb');
    const metres = () => st.n * WALKERS7[st.w].cm / 100;
    const draw = () => {
      $('#pc7-n').textContent = st.n;
      document.querySelectorAll('.wk7').forEach(b => b.classList.toggle('on', +b.dataset.i === st.w));
      const m = metres(), px = v => 30 + Math.min(v, 16) * 21;
      let g = `<rect width="400" height="90" fill="#efd79a"/><path d="M30 60 H366" stroke="#8a5a2b" stroke-width="2"/>`;
      for(let i = 0; i <= 16; i++) g += `<path d="M${px(i)} 56 v${i % 2 ? 6 : 10}" stroke="#8a5a2b" stroke-width="2"/>` + (i % 2 ? '' : `<text x="${px(i)}" y="82" text-anchor="middle" font-size="10" fill="#5a3a1a">${i} m</text>`);
      g += `<path d="M14 58 q4 -20 18 -20 q12 0 14 20z" fill="#8a8f96"/><circle cx="36" cy="40" r="5" fill="#8a8f96"/>`;
      g += `<path d="M${px(PACE_GOAL) - 7} 30 l14 14 M${px(PACE_GOAL) + 7} 30 l-14 14" stroke="#c4302b" stroke-width="4" stroke-linecap="round" opacity=".35"/>`;
      g += `<g transform="translate(${px(m)} 0)"><path d="M0 52 v-30" stroke="#2f5f9a" stroke-width="3"/><path d="M0 22 l16 6 l-16 6z" fill="#2f5f9a"/></g>`;
      $('#pace7-svg').innerHTML = g;
    };
    draw();
    document.querySelectorAll('.wk7').forEach(b => b.onclick = () => { st.w = +b.dataset.i; save(); beep(500, .03); fb.className = 'feedback'; fb.textContent = ''; draw(); });
    $('#pc7').oninput = e => { st.n = +e.target.value; save(); draw(); };
    $('#pc7-go').onclick = () => {
      const m = metres(), w = WALKERS7[st.w];
      if(m === PACE_GOAL){
        S.f.paces = true; S.pcs = null; take('map'); save(); applyVisuals(); chord([523, 659, 784, 1046]);
        fb.className = 'feedback good'; fb.textContent = tx('{n} paces of {cm} cm is {m} metres: exactly 12 of the captain\'s paces! Everybody\'s pace is a different length. That\'s why people agreed on the metre: a metre is the same for everybody.', { n: st.n, cm: w.cm, m });
        setTimeout(() => { closeModal(); say([w.k === 'horse' ? "The horse clip-clops out along the sandbar, six big steps, and stops. Right under its hoof: a red X, drawn in the sand." : tx('{who} paces out across Turtle Islet, counting out loud. And right at the end: a red X, drawn in the sand!', { who: tx(w.who) }), ['parrot', "Treasure! Treasure!"], "Now you need something to dig with."]); }, 2400);
        return;
      }
      nope(); fb.className = 'feedback bad';
      fb.textContent = st.n === PACE_GOAL && w.k !== 'horse' ? tx("12 paces, just like the map says! But {who}'s paces are only {cm} cm, and the captain's are a whole metre. That's only {m} metres.", { who: tx(w.who), cm: w.cm, m })
        : tx('{who} took {n} paces of {cm} cm: that\'s {m} metres. The X is 12 of the captain\'s 1-metre paces from the rock: 12 metres.', { who: tx(w.who), n: st.n, cm: w.cm, m: String(m).replace('.', LANG === 'en' ? '.' : ',') });
    };
  });
}

/* ---------- puzzle: the treasure chest's lock (a food chain: it starts with the Sun) ---------- */
const CHAIN7 = [
  { k: 'sun', name: 'The Sun', svg: '<circle cx="22" cy="22" r="10" fill="#ffe27a"/><g stroke="#f2a13a" stroke-width="3"><path d="M22 4v6M22 34v6M4 22h6M34 22h6M9 9l4 4M31 31l4 4M35 9l-4 4M9 35l4-4"/></g>' },
  { k: 'crab', name: 'A crab', svg: '<ellipse cx="22" cy="26" rx="12" ry="8" fill="#e2483d"/><path d="M10 22l-6-6M34 22l7-6M12 30l-6 4M32 30l7 4" stroke="#e2483d" stroke-width="3"/><circle cx="18" cy="20" r="2" fill="#111"/><circle cx="26" cy="20" r="2" fill="#111"/>' },
  { k: 'coconut', name: 'A coconut', svg: '<circle cx="22" cy="24" r="12" fill="#6b4423"/><circle cx="18" cy="20" r="2" fill="#3a2210"/><circle cx="26" cy="20" r="2" fill="#3a2210"/><circle cx="22" cy="26" r="2" fill="#3a2210"/>' },
  { k: 'octopus', name: 'An octopus', svg: '<ellipse cx="22" cy="16" rx="11" ry="10" fill="#b0508a"/><path d="M13 22q-4 12 2 16M18 24q-2 12 2 14M26 24q2 12 -2 14M31 22q4 12 -2 16" stroke="#b0508a" stroke-width="3" fill="none"/><circle cx="18" cy="15" r="2" fill="#fff"/><circle cx="26" cy="15" r="2" fill="#fff"/>' },
  { k: 'seaweed', name: 'Seaweed', svg: '<path d="M14 40q-6-12 2-20t0-16M22 40q7-14-2-22t4-14M30 40q-4-10 4-18" stroke="#3f8a4a" stroke-width="4" fill="none" stroke-linecap="round"/>' }
];
const CHAIN6_OK = ['sun', 'seaweed', 'crab', 'octopus'];
function openChest7(){
  const st = S.chn || (S.chn = []);
  openModal('The treasure chest', 'A lock with four picture slots', `
    <p class="flag-p">${tx('The captain has carved a riddle on the lid: <b>"From the one who feeds everybody, to the one who eats the most."</b> Put four of the pictures in the slots, in the right order.')}</p>
    <div class="slots7" id="slots7"></div>
    <div class="cards7" id="cards7">${CHAIN7.map((c, i) => `<button type="button" class="card7" data-i="${i}"><svg viewBox="0 0 44 44" aria-hidden="true">${c.svg}</svg><span>${tx(c.name)}</span></button>`).join('')}</div>
    <div class="row-btns"><button type="button" class="btn ghost" id="ch7-clear">${tx('Take them out')}</button><button type="button" class="btn" id="ch7-go">${tx('Open the lock')}</button></div>
    <div class="feedback" id="ch7-fb"></div>`, () => {
    const fb = $('#ch7-fb');
    const draw = () => {
      $('#slots7').innerHTML = [0, 1, 2, 3].map(i => { const c = CHAIN7.find(x => x.k === st[i]); return `<span class="slot7">${c ? `<svg viewBox="0 0 44 44" aria-hidden="true">${c.svg}</svg><small>${tx(c.name)}</small>` : `<b>${i + 1}</b>`}</span>` + (i < 3 ? '<span class="arrow7">→</span>' : ''); }).join('');
      document.querySelectorAll('.card7').forEach(b => { const used = st.includes(CHAIN7[+b.dataset.i].k); b.classList.toggle('gone', used); b.disabled = used; });
    };
    draw();
    document.querySelectorAll('.card7').forEach(b => b.onclick = () => { if(st.length < 4){ st.push(CHAIN7[+b.dataset.i].k); save(); beep(640, .03); draw(); } });
    $('#ch7-clear').onclick = () => { st.length = 0; save(); fb.className = 'feedback'; fb.textContent = ''; draw(); };
    $('#ch7-go').onclick = () => {
      if(st.length < 4){ nope(); fb.className = 'feedback bad'; fb.textContent = tx('The lock has four slots. Fill them all.'); return; }
      if(st.join() === CHAIN6_OK.join()){
        S.f.chest = true; S.chn = null; save(); chord([523, 659, 784, 1046, 1318]);
        fb.className = 'feedback good'; fb.textContent = tx('Click! The Sun feeds the seaweed (plants make their food from sunlight), the crab eats the seaweed, and the octopus eats the crab. Every food chain starts with the Sun.');
        setTimeout(() => { closeModal(); applyVisuals(); say(["The lid creaks open. Inside: a mountain of sweets, a little golden crown, and a letter.", ['pippi', "Sweets! It says on the bag: 18 KILOS. Dad, you remembered!"], ['annika', "The letter says: \"For Pippilotta, princess of the island, and her friends. Share them with the horse.\""], "Then a cold wind blows across the lagoon. The palm trees bend. The sky over the sea has gone very dark.", ['captain', "A tropical shower! Quick, everybody: how far away is it? Watch for the lightning!"]]); }, 2600);
        return;
      }
      nope(); fb.className = 'feedback bad';
      fb.textContent = tx(st[0] !== 'sun' ? 'Who feeds everybody? Every food chain starts with the Sun: plants use its light to make their food.'
        : st.includes('coconut') ? 'A coconut? Nobody in this chain eats coconuts. Only Mr Nilsson, and he isn\'t in the sea.'
        : 'Who eats whom? The crab nibbles the seaweed, and the octopus catches the crab.');
    };
  });
}

/* ---------- puzzle: the thunder (light is fast, sound is slow: about 3 seconds for every kilometre) ---------- */
const THUNDER7 = [9, 3];
function openThunder7(){
  const st = S.thn || (S.thn = { r: 0, seen: false });
  openModal('The tropical shower', 'Count the seconds between the flash and the bang', `
    <p class="flag-p">${tx('You see lightning straight away: light is very fast. The sound of the thunder is much slower: it takes about 3 seconds to travel 1 kilometre.')}</p>
    <div class="thunder7"><div class="flash7" id="th7-flash"><svg viewBox="0 0 40 60" aria-hidden="true"><path d="M26 2 L8 34 h12 L12 58 L34 22 h-12 L30 2z" fill="#fff6b0" stroke="#c9952a" stroke-width="2"/></svg></div><div class="count7" id="th7-count">0</div><div class="boom7" id="th7-boom"></div></div>
    <div class="row-btns"><button type="button" class="btn" id="th7-watch">${tx('Watch for lightning')}</button></div>
    <div id="th7-q" hidden></div>
    <div class="feedback" id="th7-fb"></div>`, () => {
    const fb = $('#th7-fb');
    const ask = () => {
      const q = st.r === 0 ? { ask: 'How far away is the storm?', opts: ['1 km', '3 km', '9 km', '27 km'], ok: 1 } : { ask: 'Only 3 seconds this time: the storm is 1 km away. Is it coming closer, or going away?', opts: ['Closer: everybody into the hut!', 'Going away: keep building the sandcastle'], ok: 0 };
      $('#th7-q').hidden = false;
      $('#th7-q').innerHTML = `<p><b>${tx(q.ask)}</b></p><div class="row-btns">${q.opts.map((o, i) => `<button type="button" class="btn ghost th6o" data-i="${i}">${tx(o)}</button>`).join('')}</div>`;
      document.querySelectorAll('.th6o').forEach(b => b.onclick = () => {
        const i = +b.dataset.i;
        if(i !== q.ok){ nope(); fb.className = 'feedback bad';
          if(st.r === 1){ S.ach.soaked = true; save(); fb.textContent = tx('SPLOOSH. The rain comes down like a waterfall, and you are wet right through. 9 seconds, then 3 seconds: the storm is getting closer!'); return; }
          fb.textContent = tx(i === 0 ? '1 km would be 3 seconds. You counted 9.' : i === 3 ? "That's 9 × 3. But it's the other way round: every 3 seconds is 1 km, so how many threes are there in 9?" : '9 km would take 27 seconds to hear. Sound is slow, but not THAT slow.'); return; }
        chord([523, 659, 784]);
        if(st.r === 0){ st.r = 1; st.seen = false; save(); fb.className = 'feedback good'; fb.textContent = tx('3 km! 9 seconds ÷ 3 = 3 kilometres. Watch again…'); $('#th7-q').hidden = true; $('#th7-watch').disabled = false; return; }
        S.f.storm = true; S.thn = null; save();
        fb.className = 'feedback good'; fb.textContent = tx('Closer! 9 seconds, then 3 seconds: 3 km, then 1 km. Into the hut, everybody, and the sweets too!');
        setTimeout(() => { closeModal(); applyVisuals(); say(["Everybody squeezes into the king's hut: the captain, Pippi, Tommy, Annika, Mr Nilsson, the parrot, 18 kilos of sweets and, somehow, the horse.", "The rain drums on the roof for exactly twenty minutes. Then it stops, as suddenly as it started.", "When you come out, the sun is going down. The sky is orange and pink, and the first stars are out.", ['captain', "The turtle nest! Tonight's the night. Somebody light the feast torches!"]]); }, 2600);
      });
    };
    const watch = () => {
      $('#th7-watch').disabled = true; $('#th7-boom').textContent = ''; fb.className = 'feedback'; fb.textContent = '';
      const n = THUNDER7[st.r], fl = $('#th7-flash'); fl.classList.add('on'); setTimeout(() => fl && fl.classList.remove('on'), 250);
      let k = 0;
      const step = () => { if(!$('#th7-count')) return; $('#th7-count').textContent = k;
        if(k >= n){ $('#th7-boom').textContent = tx('BOOM!'); beep(70, .6, 'sawtooth', .06); st.seen = true; save(); ask(); return; }
        k++; beep(900, .02, 'sine', .02); setTimeout(step, reducedMotion() ? 0 : 420); };
      step();
    };
    $('#th7-watch').onclick = watch;
    if(st.seen){ $('#th7-count').textContent = THUNDER7[st.r]; $('#th7-boom').textContent = tx('BOOM!'); $('#th7-watch').disabled = true; ask(); }
  });
}

/* ---------- puzzle: the turtles (hatchlings crawl towards the brightest light; on a dark beach, that's the sea) ---------- */
const LIGHTS7 = [
  { k: 'nest', name: 'The torch by the nest', x: 150, y: 46, seen: true },
  { k: 'dune', name: 'The torch on the dunes', x: 60, y: 30, seen: true },
  { k: 'window', name: 'The lantern in the hut window', x: 282, y: 60, seen: true },
  { k: 'feast', name: 'The feast torches behind the hut', x: 342, y: 14, seen: false }
];
function openTurtles7(){
  const st = S.trt || (S.trt = { on: [1, 1, 1, 1] });
  openModal('The turtle nest', 'The baby turtles are hatching!', `
    <p class="flag-p">${tx("Baby turtles crawl towards the brightest light they can see. On a dark beach, that's the sea, shining under the moon. But tonight there are torches for the feast…")}</p>
    <svg class="turtle7-svg" translate="no" viewBox="0 0 380 230" aria-hidden="true" id="turtle7-svg"></svg>
    <div class="row-btns lights7">${LIGHTS7.map((l, i) => `<button type="button" class="tog lt7" data-i="${i}">${tx(l.name)}</button>`).join('')}</div>
    <div class="row-btns"><button type="button" class="btn" id="tt7-go">${tx('Let them go!')}</button></div>
    <div class="feedback" id="tt7-fb"></div>`, () => {
    const fb = $('#tt7-fb');
    const lure = () => LIGHTS7.find((l, i) => l.seen && st.on[i]);
    const draw = () => {
      const L = lure();
      let g = `<rect width="380" height="230" fill="#e2c27a"/><rect y="0" width="380" height="80" fill="#c9a85a"/><rect y="160" width="380" height="70" fill="#2a4a7a"/><path d="M0 160 q20 -6 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/>`;
      g += `<g fill="#fdf6d8" opacity=".8"><rect x="160" y="176" width="60" height="4" rx="2"/><rect x="146" y="190" width="90" height="4" rx="2"/><rect x="130" y="206" width="120" height="5" rx="2"/></g><text x="190" y="226" text-anchor="middle" font-size="10" fill="#fdf6d8">${tx('the sea, in the moonlight')}</text>`;
      g += `<rect x="250" y="10" width="70" height="60" fill="#8a6a3a"/><text x="285" y="44" text-anchor="middle" font-size="10" fill="#fffaf0">${tx('hut')}</text><text x="342" y="44" text-anchor="middle" font-size="9" fill="#5a3a1a">${tx('feast')}</text>`;
      g += `<ellipse cx="190" cy="80" rx="26" ry="10" fill="#b9985a"/><text x="190" y="100" text-anchor="middle" font-size="10" fill="#5a3a1a">${tx('nest')}</text>`;
      LIGHTS7.forEach((l, i) => { g += `<circle cx="${l.x}" cy="${l.y}" r="${st.on[i] ? 22 : 8}" fill="${st.on[i] ? '#ffcf6a' : '#5a5a5a'}" opacity="${st.on[i] ? .55 : .8}"/><circle cx="${l.x}" cy="${l.y}" r="4" fill="${st.on[i] ? '#ff9a2a' : '#2a2a2a'}"/>`; });
      // the hatchlings and the way they're heading
      const [tx2, ty2] = L ? [L.x, L.y] : [190, 160];
      g += `<path d="M190 84 L${tx2} ${ty2}" stroke="${L ? '#c4302b' : '#3f8a4a'}" stroke-width="3" stroke-dasharray="6 5" marker-end="url(#t6arrow)"/>`;
      g += `<defs><marker id="t6arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="${L ? '#c4302b' : '#3f8a4a'}"/></marker></defs>`;
      [[180, 86], [196, 88], [188, 78]].forEach(([x, y]) => g += `<ellipse cx="${x}" cy="${y}" rx="5" ry="4" fill="#3f6a3a"/>`);
      $('#turtle7-svg').innerHTML = g;
      document.querySelectorAll('.lt7').forEach(b => { const on = !!st.on[+b.dataset.i]; b.classList.toggle('on', on); b.textContent = tx(on ? '{l}: on' : '{l}: off', { l: tx(LIGHTS7[+b.dataset.i].name) }); });
    };
    draw();
    document.querySelectorAll('.lt7').forEach(b => b.onclick = () => { const i = +b.dataset.i; st.on[i] = st.on[i] ? 0 : 1; save(); beep(st.on[i] ? 700 : 400, .04); fb.className = 'feedback'; fb.textContent = ''; draw(); });
    $('#tt7-go').onclick = () => {
      const L = lure();
      if(L){ nope(); fb.className = 'feedback bad'; fb.textContent = tx('Oh no! The baby turtles crawl the wrong way, towards {l}. Annika scoops them up and puts them back in the nest. They follow the brightest light they can see.', { l: tx(L.name).toLowerCase() }); return; }
      if(!st.on[3]){ nope(); fb.className = 'feedback bad'; fb.textContent = tx("The turtles would be fine, but now the feast is pitch dark and Pippi has sat on the fish. The torches behind the hut can stay on: the hut hides them from the nest."); return; }
      S.f.out7 = true; S.trt = null; save(); chord([523, 659, 784, 1046, 1318, 1568]);
      fb.className = 'feedback good'; fb.textContent = tx('The beach goes dark, and the sea shines under the moon. Out pop the baby turtles, and off they scurry, straight down the beach to the water!');
      setTimeout(() => { closeModal(); applyVisuals(); win7(); }, 2600);
    };
  });
}

/* ---------- intro, start and win ---------- */
function intro7(){
  say([["sys", "Captain Longstocking's island. White sand, palm trees, a turquoise lagoon, and the Hoppetossa resting at anchor."],
       ["pippi", "Dad's island! It's even better than he said. And he said it was the best island in the world."],
       ["annika", "Where is your father, Pippi?"],
       ["sys", "A snore comes from a hammock between the palm trees. In it lies the king of the island, fast asleep, with his crown on top of his captain's hat."],
       ["tommy", "He looks very comfortable."],
       ["pippi", "Kings need a lot of sleep. It's hard work, being a king. Let's wake him up!"],
       ["you", "The captain is in the hammock by the hut."]],
    () => { S.f.introDone = true; save(); });
}
function startCh7(){
  setUnlocked7();
  S = Object.assign(fresh(), { ach: S.ach || {}, ch: 7, scene: 'island' });
  S.started = true; sel = null;
  $('#title').hidden = true; $('#win').hidden = true;
  renderInv(); applyVisuals(); $('#timer').textContent = '00:00'; save(); intro7();
}
function win7(){
  say([["sys", "One after another, the little turtles pop out of the sand and scurry down the beach, towards the shining sea. Not one of them goes the wrong way."],
       ["annika", "Twenty-three, twenty-four… twenty-five! All of them!"],
       ["sys", "The waves carry them out into the lagoon, where the moon is making a silver path on the water."],
       ["captain", "Pippilotta, you'd make a very good queen. But I think you're an even better Pippi."],
       ["pippi", "Tomorrow we'll sail home to Villa Villekulla. The horse misses his veranda. But tonight: the feast!"],
       ["parrot", "Pluttification! Squawk!"],
       ["sys", "And behind the hut, by the light of the feast torches, the whole island eats grilled fish, coconut cake and, of course, eighteen kilos of sweets."]],
    () => showWin());
}
