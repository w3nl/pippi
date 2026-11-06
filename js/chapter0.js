// Chapter 0: Pippi moves in. Pippi arrives in the little town with her horse, Mr Nilsson and a suitcase full of gold.
// Villa Villekulla has stood empty for years: a rusty gate, a dry pump, a creaky veranda, a dark house full of
// moving boxes and a stopped clock. Tommy and Annika peek over the hedge next door.
// Loaded in order by js/boot.js; all game files share the same global scope.

const UNLOCK1 = KEY + '-ch1';
function unlocked1(){ try{ if(localStorage.getItem(UNLOCK1) === '1') return true; }catch(e){} return S.ch >= 1 || !!S.f.out0 || unlocked2(); }
function setUnlocked1(){ try{ localStorage.setItem(UNLOCK1, '1'); }catch(e){} }

/* ---------- Chapter 0 items ---------- */
Object.assign(ITEMS, {
  oil0: { name:'An oil can', desc:'A little can of oil with a long spout. Pippi oils the horse\'s saddle with it. And her boots. And sometimes her hair.',
    svg:'<svg viewBox="0 0 44 44"><path d="M8 18h20v18H8z" fill="#9aa0a6" stroke="#5a5f66" stroke-width="2"/><path d="M28 22l12-10" stroke="#5a5f66" stroke-width="3" stroke-linecap="round"/><path d="M14 18v-6h8v6" fill="none" stroke="#5a5f66" stroke-width="2"/><path d="M40 13q2 4 0 6q-2-2 0-6z" fill="#c9a03a"/></svg>' },
  mirror0: { name:"Pippi's hand mirror", desc:'A round hand mirror. Pippi uses it to count her freckles. She always gets a different number.',
    svg:'<svg viewBox="0 0 44 44"><circle cx="22" cy="17" r="12" fill="#cfe9f8" stroke="#c9952a" stroke-width="3"/><path d="M16 12q4-4 8-3" stroke="#fff" stroke-width="2" fill="none"/><rect x="20" y="29" width="4" height="12" rx="2" fill="#c9952a"/></svg>' }
});

/* Where moving day has got to: on the road, in the garden, then in the house. */
const leg0 = () => !S.f.gate ? 'road' : !S.f.veranda ? 'garden' : 'house';
const CLOCK0 = { h: 10, m: 15 };   // the church clock: a quarter past ten

function applyMove(){
  const show = vis;   // smooth when you can see it happen (core.js)
  const sc = $('#sc-move'); if(!sc) return;
  const f = S.f, leg = leg0(), at0 = (id, on) => show('#hit-' + id, on);
  show('#mv-gateshut', !f.gate); show('#mv-gateopen', !!f.gate);
  show('#mv-horse-road', leg === 'road'); show('#mv-horse-garden', leg === 'garden'); show('#mv-horse-veranda', leg === 'house');
  show('#mv-pippi-road', leg === 'road'); show('#mv-pippi-garden', leg !== 'road');
  show('#mv-oilcan', !f.oilTaken);
  show('#mv-water', !!f.water); show('#mv-gush', !!f.water && !f.veranda);
  show('#mv-spunk', !f.spunkTaken);
  show('#mv-dark', !f.light); show('#mv-beam', !!f.light && !f.boxes);
  show('#mv-shutters', !f.light); show('#mv-view', !!f.light);
  show('#mv-heap', !f.boxes); show('#mv-stack', !!f.boxes);
  show('#mv-cargo', !f.light); show('#mv-nilcart', !f.boxes); show('#mv-nilclock', !!f.boxes);
  at0('nilsson0c', !f.boxes); at0('nilsson0k', !!f.boxes);
  show('#mv-kids', !f.out0);
  sc.classList.toggle('mv-ticking', !!f.out0);
  const t = f.out0 ? CLOCK0 : { h: 12, m: 0 };
  $('#mv-min').setAttribute('transform', `rotate(${t.m * 6} 1432 470)`);
  $('#mv-hour').setAttribute('transform', `rotate(${(t.h % 12 + t.m / 60) * 30} 1432 470)`);
  const at = (id, on) => show('#hit-' + id, on);
  at('horse0r', leg === 'road'); at('horse0g', leg === 'garden'); at('horse0v', leg === 'house');
  at('pippi0r', leg === 'road'); at('pippi0g', leg !== 'road');
  at('spunk0', !f.spunkTaken);
}

/* ---------- hotspot handlers ---------- */
const has0 = id => S.inv.includes(id);
Object.assign(H, {
  saab0(){ spotSaab(["A little yellow Saab 96 is parked down the road, round and shiny like a lemon drop.", ['pippi', "When I'm grown up, I'll buy one of those. For the horse to sit in."]]); },
  spunk0(){
    S.f.spunkTaken = true; S.ach.firstspunk = true; give('spunk'); applyVisuals();
    say([['pippi', "Look! A little green beetle, in an old jam jar. I've just made up a new word: SPUNK. And this must be one!"], ['annika', "(from behind the hedge) What IS a spunk?"], ['pippi', "Nobody knows. That's what makes it so clever."], "You take the jar. The very first spunk looks at you wisely. It will help you, if you get stuck."]);
  },
  sky0(){ say("A blue summer sky over the little town. A perfect day for moving house."); },
  town0(){ say(["The little town: red houses with smoking chimneys, and the road that leads to Villa Villekulla.", "The church is behind Villa Villekulla. To see its clock, you'd have to look out of a window at the back."]); },
  nextdoor0(){ say("A neat white house with a blue roof and a tidy garden. Everything there is straight. Everything here is crooked."); },
  oak0(){ say(["An enormous old oak at the bottom of the garden, with a hollow in its trunk.", ['pippi', "A hollow tree! Perfect for hiding lemonade in. Or letters. Or a monkey."]]); },
  kids0(){
    if(S.f.out0) return;
    say(["Two heads pop up over the hedge: a boy and a girl. When they see you looking, they duck down again. Then the girl peeks out once more.", ['annika', "Tommy, she's got a HORSE. And a MONKEY."], ['tommy', "Shh, Annika! They'll hear us."]]);
  },
  house0(){ say(["Villa Villekulla. The roof is missing a few tiles, the paint is peeling, and the whole house leans a little to one side.", ['pippi', "Isn't it beautiful? Daddy bought it years ago, for when he's too old to sail. But I'm going to live in it now."]]); },
  hall0(){
    if(!S.f.veranda) return say("You can see right into the house, but you'll have to get in through the front door, on the veranda.");
    if(!S.f.light) return has0('mirror0') ? openLight0() : say(["It's pitch dark in there. The shutters are nailed shut, and the sun can't get in.", ['pippi', "If only I could catch some sunshine and throw it in there. My hand mirror is somewhere on the cart."]]);
    if(!S.f.boxes) return openBoxes0();
    if(!S.f.out0) return openClock0();
    say("Villa Villekulla, all lit up and ticking. It already feels like home.");
  },
  window0(){
    if(!S.f.light) return say("A window, with its shutters nailed shut from the outside. Hardly a crack of light gets in.");
    say("Through the window, far away, you can see the church tower. Its clock says a quarter past ten.");
  },
  boxes0(){
    if(!S.f.light) return say("Something big and lumpy in the dark. You bump your knee on it. Ow.");
    if(!S.f.boxes) return openBoxes0();
    say("A neat stack: the suitcase of gold at the bottom, the eggs on top. Nothing squashed, nothing wobbling.");
  },
  clock0(){
    if(!S.f.light) return say("Something tall in the corner goes… nothing. Not even a tick.");
    if(!S.f.boxes) return say("The grandfather clock is behind a heap of moving boxes. Stack the boxes first.");
    if(!S.f.out0) return openClock0();
    say("Tick, tock. The grandfather clock is going again, right on time.");
  },
  door0(){
    if(S.f.out0) return startNew();   // on to Chapter 1: four o'clock on a Saturday
    if(!S.f.veranda) return say("The front door, up on the veranda. The veranda creaks dangerously. Better check how much it can carry.");
    if(!S.f.light) return has0('mirror0') ? openLight0() : say(["The front door is open, but inside it's as dark as a cupboard.", ['pippi', "My hand mirror! It's on the cart. With a mirror you can throw sunshine around."]]);
    say("The front door stands wide open, letting the summer in.");
  },
  veranda0(){
    if(!S.f.gate) return say("The veranda, on the other side of the fence. You have to get through the gate first.");
    if(!S.f.water) return say(["A creaky old veranda with a sign: MAX 500 kg.", ['pippi', "The horse can live here! But first it needs a drink. It's thirsty after the long walk."]]);
    if(!S.f.veranda) return openVeranda0();
    say("The horse's new home. It has already chewed the railing a bit.");
  },
  pump0(){
    if(!S.f.gate) return say("An old iron pump, on the other side of the fence. The gate is in the way.");
    if(!S.f.water) return openPump0();
    say("The pump squeaks, and clear cold water splashes into the trough.");
  },
  gate0(){
    if(S.f.gate) return say("The gate swings open and shut without a squeak. Mr Nilsson is riding on it, back and forth.");
    if(has0('oil0')) return openGate0();
    say(["The garden gate is rusted solid. You push. Pippi pushes. It doesn't move.", ['pippi', "I could lift it off, but then it would be a hole, not a gate. Something on the cart might help."]]);
  },
  cart0(){
    if(!S.f.oilTaken){ S.f.oilTaken = true; give('oil0'); applyVisuals();
      return say(["The moving cart: a sea chest, a suitcase full of gold, boxes of books and pans, a hat box, a box of eggs, and an oil can on top.", "You take the oil can."]); }
    if(S.f.veranda && !S.f.mirrorTaken){ S.f.mirrorTaken = true; give('mirror0'); applyVisuals();
      return say(["Right at the bottom of the hat box: Pippi's round hand mirror.", "You take it. It catches the sun and makes a little bright spot on Mr Nilsson's nose."]); }
    if(S.f.veranda) return say("Everything on the cart has gone into the house. Only a few straws are left.");
    say("The moving cart, piled high. Pippi pulled it all the way from the harbour. The horse just walked alongside.");
  },
  nilsson0(){ say([['nilsson', "Eek!"], S.f.boxes ? "Mr Nilsson has climbed onto the grandfather clock. It's the highest place in the house, so it's his." : "Mr Nilsson, in his blue trousers and straw hat, is sitting on top of the moving boxes like a king on his throne."]); },
  horse0(){
    const leg = leg0();
    if(leg === 'road') return say(["Pippi's horse, white with black spots. It's looking at the long grass behind the fence.", ['horse', "Pfrrr."]]);
    if(leg === 'garden') return S.f.water ? openVeranda0() : say(["The horse is sniffing at the old pump. It's thirsty.", ['horse', "Pfrrr!"]]);
    say(["The horse has its own veranda now. It looks very pleased with itself.", ['pippi', "Horses usually live in stables. But this one lives on a veranda. It's more fun."]]);
  },
  pippi0(){
    const leg = leg0();
    if(leg === 'road') return say(['pippi', "Villa Villekulla! My very own house. Well, Daddy's, but he's at sea. I've never lived on my own, so I'm sure I'll be very good at it."]);
    if(leg === 'garden') return say(['pippi', "Look at all this grass! The horse will never be hungry again."]);
    say(['pippi', S.f.out0 ? "Now it's a proper home. All it needs is a few friends." : "A house needs light, a tidy hall and a clock that ticks. Then it's a home."]);
  }
});

/* ---------- puzzle: the rusty gate (rust is iron + water + air; oil keeps the water away) ---------- */
function openGate0(){
  const st = S.gt0 || (S.gt0 = { r: 0 });
  openModal('The garden gate', 'Its hinges are brown and crusty with rust', `
    <div class="side6"><svg viewBox="0 0 70 50" aria-hidden="true"><rect x="6" y="6" width="10" height="38" fill="#5a3a1e"/><rect x="16" y="10" width="40" height="30" fill="none" stroke="#7a5030" stroke-width="4"/><g fill="#a0522d"><circle cx="16" cy="14" r="5"/><circle cx="16" cy="36" r="5"/></g><g fill="#c87a3a"><circle cx="13" cy="12" r="1.5"/><circle cx="19" cy="38" r="1.5"/></g></svg>
      <p>${tx('The gate squeals, shudders, and stays shut. The hinges are covered in rust.')}</p></div>
    <div id="gate0-q"></div>
    <div class="feedback" id="gate0-fb"></div>`, () => {
    const fb = $('#gate0-fb');
    const Q = [
      { ask: 'What will help the gate open?', opts: ['A bucket of water', 'A few drops of oil', 'A spoonful of sugar', 'Pippi kicks it'], ok: 1,
        no: ['Water is what made it rusty in the first place! Now it\'s wet AND stuck.', '', 'Now the gate is stuck AND sticky. Mr Nilsson licks it.', 'Pippi kicks it. The whole fence wobbles, a nail flies into the next garden, and the gate stays exactly where it was.'] },
      { ask: 'And what is rust?', opts: ['Iron that has been eaten away by water and air', 'Brown paint', 'Very old dust'], ok: 0,
        no: ['', "Nobody painted it. The brown came all by itself, from the rain.", "Dust you can blow off. Rust is part of the iron itself."] }
    ];
    const ask = () => {
      const q = Q[st.r];
      $('#gate0-q').innerHTML = `<p><b>${tx(q.ask)}</b></p><div class="row-btns">${q.opts.map((o, i) => `<button type="button" class="btn ghost gt0" data-i="${i}">${tx(o)}</button>`).join('')}</div>`;
      document.querySelectorAll('.gt0').forEach(b => b.onclick = () => {
        const i = +b.dataset.i;
        if(i !== q.ok){ nope(); fb.className = 'feedback bad'; fb.textContent = tx(q.no[i]); return; }
        chord([523, 659, 784]);
        if(st.r === 0){ st.r = 1; save(); fb.className = 'feedback good'; fb.textContent = tx('Drip, drip, drip. The oil creeps into the hinges. Creeeak… the gate moves a little.'); ask(); return; }
        take('oil0'); S.f.gate = true; S.gt0 = null; save(); chord([523, 659, 784, 1046]);
        fb.className = 'feedback good'; fb.textContent = tx('Rust is what iron turns into when water and air get at it for a long time. Oil keeps the water away, and helps the metal slide.');
        setTimeout(() => { closeModal(); applyVisuals();
          say(["The gate swings open without a squeak. Pippi, the horse and you march into the garden.", ['pippi', "Hello, garden! Hello, grass! Hello, old oak!"], "The horse stops at the old pump and sniffs it. It's thirsty after the long walk from the harbour."]); }, 2600);
      });
    };
    ask();
  });
}

/* ---------- puzzle: the dry pump (air pressure pushes the water up, like drinking through a straw) ---------- */
function openPump0(){
  const st = S.pmp || (S.pmp = { r: 0 });
  openModal('The old pump', 'Wheeze, wheeze: only air comes out', `
    <div class="side6"><svg viewBox="0 0 70 60" aria-hidden="true"><rect x="22" y="8" width="12" height="44" rx="2" fill="#4a5058"/><path d="M34 16 q12 0 14 10" stroke="#4a5058" stroke-width="6" fill="none"/><path d="M22 12 L6 2" stroke="#3a3f46" stroke-width="5" stroke-linecap="round"/><path d="M28 52 V60" stroke="#6fb8e0" stroke-width="4"/></svg>
      <p>${tx('The pipe goes deep down into the well. There is water down there: you can hear it.')}</p></div>
    <div id="pump0-q"></div>
    <div class="feedback" id="pump0-fb"></div>`, () => {
    const fb = $('#pump0-fb');
    const Q = [
      { ask: 'You pump and pump, but only air comes out. What do you do?', opts: ['Pump faster', 'Pour a little water into the top first', 'Shout down the pipe'], ok: 1,
        no: ["Faster wheezing is still wheezing. The pump's leather seal has dried out: the air slips past it.", '', 'HELLO, WATER? The well answers: hello, water… That\'s just the echo.'] },
      { ask: 'Why does the water come up the pipe?', opts: ['The air presses down on the water in the well and pushes it up the pipe', 'The water wants to see the sun', 'There is a little fish in the pipe that swims up'], ok: 0,
        no: ['', "Water doesn't want anything. Something pushes it.", 'No fish. Pippi checked, with one eye down the spout.'] }
    ];
    const ask = () => {
      const q = Q[st.r];
      $('#pump0-q').innerHTML = `<p><b>${tx(q.ask)}</b></p><div class="row-btns">${q.opts.map((o, i) => `<button type="button" class="btn ghost pm0" data-i="${i}">${tx(o)}</button>`).join('')}</div>`;
      document.querySelectorAll('.pm0').forEach(b => b.onclick = () => {
        const i = +b.dataset.i;
        if(i !== q.ok){ nope(); fb.className = 'feedback bad'; fb.textContent = tx(q.no[i]); return; }
        chord([523, 659, 784]);
        if(st.r === 0){ st.r = 1; save(); fb.className = 'feedback good'; fb.textContent = tx('Pippi pours in her lemonade. The dry leather swells up and seals the pipe. Pump, pump… SPLOSH!'); ask(); return; }
        S.f.water = true; S.pmp = null; save(); chord([523, 659, 784, 1046]);
        fb.className = 'feedback good'; fb.textContent = tx("Pumping takes the air out of the pipe. Then the air outside, pressing down on the water in the well, pushes the water up. It's the same when you drink through a straw.");
        setTimeout(() => { closeModal(); applyVisuals();
          say(["Cold, clear water gushes into the trough. The horse drinks and drinks and drinks.", ['pippi', "There. Now it needs somewhere to live. Not in the kitchen: it doesn't fit through the door. The veranda!"]]); }, 2800);
      });
    };
    ask();
  });
}

/* ---------- puzzle: the horse on the veranda (estimating weight; adding up) ---------- */
function openVeranda0(){
  const st = S.vrd || (S.vrd = { r: 0 });
  openModal('The old veranda', 'A sign on the post says: MAX 500 kg', `
    <div class="side6"><svg viewBox="0 0 70 50" aria-hidden="true"><rect x="2" y="36" width="66" height="6" fill="#8a5028"/><rect x="6" y="10" width="5" height="28" fill="#8a5028"/><rect x="59" y="10" width="5" height="28" fill="#8a5028"/><rect x="16" y="14" width="38" height="16" fill="#fffaf0" stroke="#8a5028"/><text x="35" y="26" text-anchor="middle" font-size="9" font-weight="700" fill="#c4302b">500 kg</text></svg>
      <p>${tx('The floorboards creak. If too much weight stands on them, they will crack.')}</p></div>
    <div id="vrd0-q"></div>
    <div class="feedback" id="vrd0-fb"></div>`, () => {
    const fb = $('#vrd0-fb');
    const Q = [
      { ask: 'How heavy is a horse?', opts: ['About 40 kg, like a big dog', 'About 400 kg', 'About 4000 kg, like an elephant'], ok: 1,
        no: ['40 kg is a big dog, or Tommy with his school bag. A horse is a LOT bigger.', '', "4000 kg is an elephant! This is a horse. Pippi could lift it anyway, but the veranda couldn't hold it."] },
      { ask: 'Pippi weighs 30 kg. Can she sit on the horse on the veranda?', opts: ['Yes: 400 + 30 = 430 kg, less than 500', 'No: that makes 700 kg', 'Only if Mr Nilsson gets off first'], ok: 0,
        no: ['', "400 + 30 isn't 700. Add them up again.", 'Mr Nilsson weighs about as much as a bag of potatoes. 430 kg is fine, with or without him.'] }
    ];
    const ask = () => {
      const q = Q[st.r];
      $('#vrd0-q').innerHTML = `<p><b>${tx(q.ask)}</b></p><div class="row-btns">${q.opts.map((o, i) => `<button type="button" class="btn ghost vr0" data-i="${i}">${tx(o)}</button>`).join('')}</div>`;
      document.querySelectorAll('.vr0').forEach(b => b.onclick = () => {
        const i = +b.dataset.i;
        if(i !== q.ok){ nope(); fb.className = 'feedback bad'; fb.textContent = tx(q.no[i]); return; }
        chord([523, 659, 784]);
        if(st.r === 0){ st.r = 1; save(); fb.className = 'feedback good'; fb.textContent = tx('About 400 kg: as heavy as thirteen Tommys! And 400 is less than 500, so the veranda can carry it.'); ask(); return; }
        S.f.veranda = true; S.vrd = null; save(); chord([523, 659, 784, 1046]);
        fb.className = 'feedback good'; fb.textContent = tx('430 kg: still less than 500. The veranda creaks, but it holds.');
        setTimeout(() => { closeModal(); applyVisuals();
          say(["Pippi lifts the horse over her head, carries it up the steps and puts it down on the veranda. Then she climbs on its back, just to check.", ['pippi', "There! From now on, this is the horse's home."], "Pippi opens the front door with the big old key from Daddy's letter. Inside it's pitch dark: the shutters are nailed shut.", ['pippi', "I can't see a thing. We need some sunshine in there."]]); }, 2800);
      });
    };
    ask();
  });
}

/* ---------- puzzle: light in the dark house (a mirror bounces light at the same angle it comes in) ---------- */
const TILT0 = [{ k: 'A', a: 0 }, { k: 'B', a: 22.5 }, { k: 'C', a: -45 }];
function openLight0(){
  const st = S.lgt0 || (S.lgt0 = { r: 0, pick: -1 });
  openModal('Sunshine in a mirror', 'The sun shines on the veranda. The hall is dark', `
    <svg class="light0-svg" translate="no" viewBox="0 0 300 200" aria-hidden="true" id="light0-svg"></svg>
    <div id="light0-q"></div>
    <div class="feedback" id="light0-fb"></div>`, () => {
    const fb = $('#light0-fb');
    const draw = () => {
      let g = `<rect width="300" height="200" rx="8" fill="#cfe9f8"/><rect x="180" y="40" width="120" height="160" fill="#1a1a26"/><text x="240" y="66" text-anchor="middle" font-size="11" fill="#c9c0ae">${tx('the dark hall')}</text>`;
      g += `<circle cx="30" cy="26" r="18" fill="#ffe27a"/><path d="M42 38 L110 106" stroke="#f2c94c" stroke-width="5"/><rect y="150" width="180" height="50" fill="#a5743f"/>`;
      const out = { 0: 'M110 106 L178 38', 1: 'M110 106 L300 106', 2: 'M110 106 L42 38' };
      if(st.pick >= 0) g += `<path d="${out[st.pick]}" stroke="#f2c94c" stroke-width="5" stroke-dasharray="${st.pick === 1 ? '0' : '8 5'}"/>`;
      if(st.pick === 1) g += `<rect x="180" y="96" width="120" height="20" fill="#fff3b0" opacity=".5"/>`;
      const a = st.pick >= 0 ? TILT0[st.pick].a : 0;
      g += `<g transform="translate(110 106) rotate(${a})"><rect x="-26" y="-3" width="52" height="6" rx="2" fill="#cfe9f8" stroke="#c9952a" stroke-width="2"/></g>`;
      $('#light0-svg').innerHTML = g;
      $('#light0-q').innerHTML = st.r === 0
        ? `<p>${tx('<b>How should Pippi hold the mirror, so the sunbeam goes straight into the dark hall?</b>')}</p><div class="row-btns">${TILT0.map((t, i) => `<button type="button" class="btn ghost lg0" data-i="${i}">${tx({ A: 'A: flat, like a tray', B: 'B: tipped a little', C: 'C: facing the sun' }[t.k])}</button>`).join('')}</div>`
        : `<p><b>${tx('How does a mirror move light?')}</b></p><div class="row-btns">${['Light bounces off it like a ball off a wall: it leaves at the same angle it came in', 'The mirror makes its own light', 'The mirror swallows the light and spits it out'].map((o, i) => `<button type="button" class="btn ghost lq0" data-i="${i}">${tx(o)}</button>`).join('')}</div>`;
      document.querySelectorAll('.lg0').forEach(b => b.onclick = () => {
        const i = +b.dataset.i; st.pick = i; save(); draw();
        if(i !== 1){ nope(); fb.className = 'feedback bad'; fb.textContent = tx(i === 0 ? 'The sunbeam bounces off the flat mirror and shoots up into the sky. A bird blinks.' : 'The sunbeam bounces straight back where it came from: right into Pippi\'s eyes. She sneezes.'); return; }
        st.r = 1; save(); chord([523, 659, 784]); fb.className = 'feedback good'; fb.textContent = tx('B! The sunbeam bounces off the mirror and shoots straight into the hall.'); draw();
      });
      document.querySelectorAll('.lq0').forEach(b => b.onclick = () => {
        const i = +b.dataset.i;
        if(i !== 0){ nope(); fb.className = 'feedback bad'; fb.textContent = tx(['', 'In the dark the mirror is just as dark as everything else. It only sends on light that falls on it.', "It doesn't swallow anything. The light just bounces off, very fast."][i]); return; }
        take('mirror0'); S.f.light = true; S.lgt0 = null; save(); chord([523, 659, 784, 1046]);
        fb.className = 'feedback good'; fb.textContent = tx('Exactly: light bounces off a mirror at the same angle it comes in. Tip the mirror, and the light goes somewhere else.');
        setTimeout(() => { closeModal(); applyVisuals();
          say(["A bright beam of sunshine shoots across the hall. Cobwebs! Dust! A heap of moving boxes, and a tall grandfather clock in the corner.", "Pippi pulls the nails out of the shutters with her fingers and flings them open. Sunlight pours in everywhere.", ['pippi', "Now let's get the boxes sorted. They're all in a heap."]]); }, 2800);
      });
    };
    draw();
  });
}

/* ---------- puzzle: stacking the boxes (heaviest at the bottom: steady, and nothing gets squashed) ---------- */
const BOXES0 = [
  { k: 'gold', name: 'The suitcase of gold', kg: 50 },
  { k: 'books', name: 'The box of books', kg: 20 },
  { k: 'pans', name: 'The box of pans', kg: 10 },
  { k: 'hats', name: "Pippi's hat box", kg: 2 },
  { k: 'eggs', name: 'The box of eggs', kg: 1 }
];
function openBoxes0(){
  const st = S.bx0 || (S.bx0 = { r: 0, stack: [] });
  openModal('The moving boxes', 'Stack them up, from the bottom to the top', `
    <div class="boxes0" id="boxes0-stack"></div>
    <div id="boxes0-q"></div>
    <div class="feedback" id="boxes0-fb"></div>`, () => {
    const fb = $('#boxes0-fb');
    const draw = () => {
      $('#boxes0-stack').innerHTML = st.stack.slice().reverse().map(i => `<div class="box0">${tx(BOXES0[i].name)} <span>${BOXES0[i].kg} kg</span></div>`).join('') || `<div class="box0 empty">${tx('(the floor)')}</div>`;
      const left = BOXES0.map((b, i) => i).filter(i => !st.stack.includes(i));
      $('#boxes0-q').innerHTML = st.r === 0
        ? `<p>${tx('<b>Which goes next?</b> Start at the bottom.')}</p><div class="row-btns">${left.map(i => `<button type="button" class="btn ghost bx0" data-i="${i}">${tx(BOXES0[i].name)} (${BOXES0[i].kg} kg)</button>`).join('')}</div>`
        : `<p><b>${tx('Why do the heavy things go at the bottom?')}</b></p><div class="row-btns">${['So the stack stays steady, and nothing gets squashed', 'Because heavy things are shy', "It doesn't matter at all"].map((o, i) => `<button type="button" class="btn ghost bq0" data-i="${i}">${tx(o)}</button>`).join('')}</div>`;
      document.querySelectorAll('.bx0').forEach(b => b.onclick = () => {
        const i = +b.dataset.i, heaviest = Math.min(...left);
        if(i !== heaviest){ nope(); fb.className = 'feedback bad';
          fb.textContent = tx(i === 4 ? 'The eggs, down there? Everything else lands on top of them. Omelette!' : 'Then something heavier would have to go on top of it. Squash! Put the heaviest thing left at the bottom.'); return; }
        st.stack.push(i); save(); beep(500 + st.stack.length * 60, .06);
        fb.className = 'feedback'; fb.textContent = '';
        if(st.stack.length === BOXES0.length){ st.r = 1; save(); chord([523, 659, 784]); fb.className = 'feedback good'; fb.textContent = tx('A perfect stack: from 50 kg at the bottom to 1 kg on top.'); }
        draw();
      });
      document.querySelectorAll('.bq0').forEach(b => b.onclick = () => {
        const i = +b.dataset.i;
        if(i !== 0){ nope(); fb.className = 'feedback bad'; fb.textContent = tx(['', "Suitcases aren't shy. Pippi's certainly isn't.", 'Try it the other way round, and the stack topples over. With eggs.'][i]); return; }
        S.f.boxes = true; S.bx0 = null; save(); chord([523, 659, 784, 1046]);
        fb.className = 'feedback good'; fb.textContent = tx('Heavy at the bottom keeps the stack steady: it is hard to tip over. And light things on top don\'t squash anything.');
        setTimeout(() => { closeModal(); applyVisuals();
          say(["Now you can get to the grandfather clock. Its hands both point straight up: it stopped at twelve o'clock, years ago.", ['pippi', "A house needs a ticking clock. Let's wind it up and set it right. The church clock will tell us the time."]]); }, 2800);
      });
    };
    draw();
  });
}

/* ---------- puzzle: the grandfather clock (reading a clock: the big hand for minutes, the little hand for hours) ---------- */
function openClock0(){
  const st = S.clk0 || (S.clk0 = { h: 12, m: 0 });
  const face = (cx, cy, r, h, m, col) => {
    let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#fffaf0" stroke="${col}" stroke-width="4"/>`;
    for(let n = 1; n <= 12; n++){ const a = n * Math.PI / 6; s += `<text x="${(cx + Math.sin(a) * (r - 12)).toFixed(1)}" y="${(cy - Math.cos(a) * (r - 12) + 4).toFixed(1)}" text-anchor="middle" font-size="${r > 40 ? 11 : 8}" fill="#3a3a3a">${n}</text>`; }
    const ha = ((h % 12) + m / 60) * 30, ma = m * 6;
    s += `<path d="M${cx} ${cy} V${cy - r * .5}" stroke="#2b2118" stroke-width="5" stroke-linecap="round" transform="rotate(${ha} ${cx} ${cy})"/>`;
    s += `<path d="M${cx} ${cy} V${cy - r * .8}" stroke="#2b2118" stroke-width="3" stroke-linecap="round" transform="rotate(${ma} ${cx} ${cy})"/><circle cx="${cx}" cy="${cy}" r="3" fill="#2b2118"/>`;
    return s;
  };
  openModal('The grandfather clock', 'Set it to the same time as the church clock', `
    <svg class="clock0-svg" translate="no" viewBox="0 0 320 170" aria-hidden="true" id="clock0-svg"></svg>
    <div class="clock0-set">
      <span>${tx('Big hand')}</span><button type="button" class="btn ghost" id="ck0-mdn">−</button><button type="button" class="btn ghost" id="ck0-mup">+</button>
      <span>${tx('Little hand')}</span><button type="button" class="btn ghost" id="ck0-hdn">−</button><button type="button" class="btn ghost" id="ck0-hup">+</button>
      <button type="button" class="btn" id="ck0-go">${tx('Set the clock')}</button>
    </div>
    <div class="feedback" id="clock0-fb"></div>`, () => {
    const fb = $('#clock0-fb');
    const draw = () => {
      let g = `<rect width="320" height="170" rx="8" fill="#e6d4a4"/>`;
      g += face(80, 86, 54, CLOCK0.h, CLOCK0.m, '#5a5f66') + `<text x="80" y="164" text-anchor="middle" font-size="11" fill="#3a3a3a">${tx('the church clock')}</text>`;
      g += face(240, 86, 54, st.h, st.m, '#c9952a') + `<text x="240" y="164" text-anchor="middle" font-size="11" fill="#3a3a3a">${tx('the grandfather clock')}</text>`;
      $('#clock0-svg').innerHTML = g;
    };
    const step = (k, d) => () => { if(k === 'm') st.m = (st.m + d + 60) % 60; else st.h = ((st.h - 1 + d + 12) % 12) + 1; save(); beep(800, .02); draw(); };
    $('#ck0-mdn').onclick = step('m', -5); $('#ck0-mup').onclick = step('m', 5);
    $('#ck0-hdn').onclick = step('h', -1); $('#ck0-hup').onclick = step('h', 1);
    $('#ck0-go').onclick = () => {
      if(st.m !== CLOCK0.m){ nope(); fb.className = 'feedback bad'; fb.textContent = tx(st.m === 45 ? "The big hand is on the 9: that's a quarter TO. On the church clock it's on the 3: a quarter past." : 'Look at the big hand on the church clock: it points at the 3. Each number is 5 minutes, so that\'s 15 minutes: a quarter past.'); return; }
      if(st.h !== CLOCK0.h){ nope(); fb.className = 'feedback bad'; fb.textContent = tx(st.h === 3 ? 'The big hand is right, but the little hand shows the hour. On the church clock it is just past the 10.' : 'The big hand is right! Now the little hand: on the church clock it points just past the 10.'); return; }
      S.f.out0 = true; S.clk0 = null; save(); applyVisuals(); chord([523, 659, 784, 1046]);
      fb.className = 'feedback good'; fb.textContent = tx('A quarter past ten! The big hand counts the minutes, the little hand the hours. Pippi winds the clock up, and it starts to tick.');
      setTimeout(() => { closeModal(); win0(); }, 2600);
    };
    draw();
  });
}

/* ---------- intro, start and win ---------- */
function intro0(){
  say([["sys", "A little town in Sweden, on a summer morning. Down the road comes a girl with red plaits, pulling a cart piled high with boxes. A horse walks beside her, and a monkey rides on top."],
       ["pippi", "Here it is: Villa Villekulla! Daddy's house. And now it's mine, until he comes back from the sea."],
       ["sys", "Behind the hedge next door, two heads pop up and disappear again. Then a paper aeroplane sails over the hedge."],
       ["sys", "On its wing, in neat writing: \"WHO ARE YOU? From Tommy and Annika, next door.\""],
       ["pippi", "I'm Pippi! I'll write back as soon as I've moved in. Moving in can't take long. I've never done it before, so I'm sure I'll be very good at it."],
       ["you", "The garden gate looks rusty. Maybe something on the cart can help."]],
    () => { S.f.introDone = true; save(); });
}
function startCh0(){
  S = Object.assign(fresh(), { ach: S.ach || {}, ch: 0, scene: 'move' });
  S.started = true; sel = null;
  $('#title').hidden = true; $('#win').hidden = true;
  renderInv(); applyVisuals(); $('#timer').textContent = '00:00'; save(); intro0();
}
function win0(){
  say([["sys", "BONG… BONG… The grandfather clock strikes, loud and deep, and the whole house seems to wake up."],
       ["sys", "Pippi folds a paper aeroplane and throws it over the hedge. On it: \"COME OVER! Pippi.\""],
       ["sys", "A minute later there's a knock at the open door. A polite boy and a polite girl, in very clean clothes."],
       ["tommy", "Hello. I'm Tommy, and this is my sister Annika. We live next door."],
       ["annika", "Is it true that you live here all by yourself? With a horse on the veranda?"],
       ["pippi", "All by myself! Well, with Mr Nilsson, and the horse, and now you. Come back on Saturday at four, and we'll go thing-searching!"]],
    () => showWin());
}
