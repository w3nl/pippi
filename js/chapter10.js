// Chapter 10: Home again. The Hoppetossa has brought Pippi, Tommy, Annika, you, Mr Nilsson and the horse home to Villa Villekulla.
// It's spring: the garden is overgrown, a branch of the old oak is lying across the path, the door is locked,
// and the horse wants nothing but its own veranda. Tonight there's a welcome-home party.
// Loaded in order by js/boot.js; all game files share the same global scope.

const UNLOCK10 = KEY + '-ch10';
function unlocked10(){ try{ if(localStorage.getItem(UNLOCK10) === '1') return true; }catch(e){} return S.ch >= 10 || (S.ch === 9 && !!S.f.out9); }
function setUnlocked10(){ try{ localStorage.setItem(UNLOCK10, '1'); }catch(e){} }

/* ---------- Chapter 10 items ---------- */
Object.assign(ITEMS, {
  magnet: { name:'A horseshoe magnet', desc:"The captain's goodbye present, on a long string. The label says: For finding things.",
    svg:'<svg viewBox="0 0 44 44"><path d="M10 6v16a12 12 0 0 0 24 0V6h-8v16a4 4 0 0 1-8 0V6z" fill="#c4302b"/><g fill="#c9ccd2"><rect x="10" y="6" width="8" height="6"/><rect x="26" y="6" width="8" height="6"/></g><path d="M22 34q2 6 10 6" stroke="#8a6a4a" stroke-width="1.5" fill="none"/></svg>' },
  key10: { name:'Front-door key', desc:'The key of Villa Villekulla, fished out of the rain barrel. Still dripping.',
    svg:'<svg viewBox="0 0 44 44"><circle cx="13" cy="22" r="8" fill="none" stroke="#c9952a" stroke-width="4"/><path d="M21 22h18M33 22v7M38 22v5" stroke="#c9952a" stroke-width="4" stroke-linecap="round"/><path d="M14 34q2 3 0 5q-2-2 0-5zM30 32q2 3 0 5q-2-2 0-5z" fill="#7fc6e6"/></svg>' }
});

/* The April shower: after the party food is sorted, until the rainbow. */
const shower10 = () => !!S.f.larder && !S.f.rainbow;

/* ---------- the garden of Villa Villekulla ---------- */
function applyHome(){
  const show = vis;   // smooth when you can see it happen (core.js)
  const sc = $('#sc-home'); if(!sc) return;
  const f = S.f;
  sc.classList.toggle('vh-late', !!f.larder);
  sc.classList.toggle('vh-shower', shower10());
  sc.classList.toggle('vh-party', !!f.out10);
  show('#vh-showersky', shower10()); show('#vh-rain', shower10());
  show('#vh-rainbow', !!f.rainbow);
  show('#vh-dusk', !!f.out10); show('#vh-lanterns', !!f.out10); show('#vh-smoke', !!f.out10);
  show('#vh-branch', !f.rings); show('#vh-logs', !!f.rings && !f.rolled); show('#hit-branch10', !f.rolled);
  show('#vh-chest', !f.rolled); show('#vh-chest2', !!f.rolled); show('#hit-chest10a', !f.rolled); show('#hit-chest10b', !!f.rolled);
  show('#vh-lidshut', !f.magnetTaken); show('#vh-lidopen', !!f.magnetTaken);
  show('#vh-dooropen', !!f.door);
  show('#vh-cloth', !!f.door); show('#vh-jars', !!f.door && !f.larder); show('#vh-feast', !!f.larder);
  show('#vh-leaves', !f.out10); show('#vh-hog', !!f.rainbow && !f.out10); show('#vh-hog2', !!f.out10);
  show('#vh-held', !f.out10); show('#vh-armsup', !f.out10); show('#vh-armsdown', !!f.out10);
  show('#vh-vhorse', !!f.out10); show('#hit-horse10a', !f.out10); show('#hit-horse10b', !!f.out10);
  show('#vh-spunk', !f.spunkTaken); show('#hit-spunk10', !f.spunkTaken);
}

/* ---------- hotspot handlers ---------- */
const has10 = id => S.inv.includes(id);
const POST10 = [
  ["A letter from Miss: \"Dear Pippi, welcome home! School starts again on Monday. I have saved you a desk by the window, next to the geraniums.\"", ['pippi', "Monday? Then I'll start my holidays on Tuesday."]],
  ["A card from Kling and Klang: \"A friendly reminder: horses may not be carried along the pavement. Not even by very strong girls.\"", ['pippi', "Then I'll carry it along the road."]],
  ["A postcard from the circus: \"Dear Miss Longstocking, the strongman has still not recovered. Please come and lift him again soon. He misses it.\""]
];
Object.assign(H, {
  saab10(){ spotSaab(["A cream-coloured Saab 96 is parked outside Tommy and Annika's house, as round and shiny as a polished egg.", ['tommy', "That's Dad's new car. He has washed it three times this week."], ['pippi', "I'd have bought the horse a car like that. But it wouldn't fit in."]]); },
  spunk10(){ S.f.spunkTaken = true; give('spunk'); applyVisuals(); say(["The spunk's jam jar, riding home on the luggage cart. The spunk has had a long voyage.", "You take it. It looks pleased to be home. As far as anyone can tell with a spunk."]); },
  sky10(){
    if(shower10()) return openRainbow10();
    if(S.f.rainbow){
      if(!S.ach.potofgold){ S.ach.potofgold = true; save(); }
      return say([['pippi', "At the end of every rainbow there's a pot of gold. Somebody else can have this one: I've got a whole suitcase."], "The rainbow ends somewhere behind Villa Villekulla. Mr Nilsson has gone to look anyway."]);
    }
    say("A pale blue spring sky. Two swallows swoop round the roof: they've just come home from Africa, the way you've just come home from the South Seas.");
  },
  house10(){
    if(S.f.out10) return say("Villa Villekulla, with lanterns on the veranda and smoke from the chimney: Pippi is making pancakes. Home.");
    say(["Villa Villekulla, a little crooked, exactly as you left it. Except that the swallows have built a nest under the roof.", ['pippi', "They can stay. Everybody can stay. Except burglars."]]);
  },
  window10(){
    if(S.f.door) return say("The kitchen. Tommy and Annika have opened every window to let the spring in. It smells much better already.");
    say(["You rub a clean spot on the dusty kitchen window and peek in. The stove, the bureau, the mirror… and a very old pancake on the table.", ['nilsson', "Eek!"]]);
  },
  door10(){
    if(S.f.door) return say(S.f.out10 ? "The front door is wide open, and the party spills in and out." : "The front door, wide open. Inside it smells of dust, old pancakes and home.");
    if(has10('key10')) return say("The front door is still locked. You have the key in your pocket.");
    if(S.f.key) return say("The front door is locked.");
    say(["The front door is locked. Locked! At Villa Villekulla!", ['pippi', "I locked it before we sailed, because of burglars. Then I gave the key to Mr Nilsson to look after. He's very good at looking after things."], ['nilsson', "Eek…"], "Mr Nilsson looks at the rain barrel. Then he looks at his feet."]);
  },
  barrel10(){
    if(S.f.key) return say("The rain barrel. Nothing left in it now but rainwater, old leaves, a gold coin, a marble and a rubber ball.");
    say(["The rain barrel, full to the brim with a whole winter's rain and melted snow. It's dark and full of old leaves: you can't see the bottom.", ['nilsson', "Eek!"], "Mr Nilsson points into the barrel, then pretends to drop something: plop. The key is down there. And it's far too deep and cold to reach in."]);
  },
  nilsson10(){
    if(!S.f.key) return say([['nilsson', "Eek…"], "Mr Nilsson sits on the rim of the rain barrel, looking very guilty. Every now and then he peers into the water."]);
    if(!S.f.larder) return say([['nilsson', "Eek!"], "Mr Nilsson is polishing his bottle top. He's very glad to have it back."]);
    say([['nilsson', "Eek eek!"], "Mr Nilsson has raisins in both cheeks and one in each hand."]);
  },
  swallows10(){ gag('#vh-swallowbox', 'gag-loop', 1200); gagText('Tswit tswit!'); chord([2400, 2800, 2600], 60); },
  bee10(){ gag('#vh-beebox', 'gag-loop', 1200); gagText('Bzzzz!'); beep(220, .5, 'sawtooth', .02); },
  bfly10(){ gag('#vh-bflybox', 'gag-flyup', 1400); gagText('Flutter!'); chord([1200, 1500], 120); },
  bush10(){
    if(S.f.out10) return say("Under the lilac, the hedgehog is eating its supper. It makes a lot of noise for something so small.");
    say("A lilac bush, in full flower. It smells wonderful, and a yellow butterfly can't decide which flower it likes best.");
  },
  oak10(){
    if(S.f.out10) return say("Lanterns hang in the branches of the old oak, glowing like big fireflies.");
    if(!S.f.rings) return say("The old oak, full of fresh green leaves. One of its big branches broke off in the winter storms: it's lying right across the garden path.");
    say(["The old oak. There's a hollow in it, just the right size for hiding things in.", ['pippi', "This oak is at least a hundred years old. I counted. Well, I counted to nine and then I guessed."]]);
  },
  branch10(){
    if(!S.f.rings) return openRings10();
    say("A neat pile of round logs. Pippi broke the branch into pieces with her bare hands. One hand, actually: the other one is holding the horse.");
  },
  chest10(){
    if(!S.f.rings) return say(["Pippi's sea chest, full of things from the island, on the luggage cart by the gate. It weighs as much as a grown-up.", ['tommy', "We can't get it past that branch anyway. And Pippi's hands are full of horse."]]);
    if(!S.f.rolled) return openRoll10();
    if(!S.f.magnetTaken){
      S.f.magnetTaken = true; give('magnet'); applyVisuals();
      return say(["You open the lid. Coconuts, shells, a grass skirt for the horse, eighteen kilos of sweets… and a big red horseshoe magnet on a long string.", "The label says: \"For Pippilotta. For finding things. Love, Dad.\"", ['pippi', "Dad always knows what I need. Even when I don't."]]);
    }
    say("The sea chest, open at the foot of the veranda. Mr Nilsson has been through it twice already.");
  },
  gate10(){ say("The garden gate, still creaking. Beyond it: the little town, the church, and the harbour, where the Hoppetossa is waiting for the captain."); },
  post10(){
    const n = S.f.letters || 0;
    S.f.letters = n + 1; save();
    if(n >= POST10.length - 1){ S.ach.postbox = true; save(); }
    say(POST10[n % POST10.length]);
  },
  nextdoor10(){ say(["Tommy and Annika's house, next door. Their mother has hung a big WELCOME HOME sign in the window.", ['annika', "We'll go home in a minute. First the party!"]]); },
  table10(){
    if(S.f.larder) return say("The party table: crispbread, honey, raisins and strawberry jam. Mr Nilsson is guarding the raisins. From the inside.");
    if(S.f.door) return openLarder10();
    say("The garden table, covered in last year's leaves. Perfect for a party, once there's food on it. And the food is in the larder, behind the locked front door.");
  },
  straw10(){
    if(S.f.out10) return H.horse10();
    if(S.f.rainbow) return openHog10();
    say("The horse's own straw, on the veranda. The winter wind has blown a big heap of dry leaves on top of it.");
  },
  horse10(){
    if(S.f.out10) return say(["The horse is back on its veranda, in its own straw. It hasn't stopped smiling.", ['horse', "Pfrrrr."]]);
    if(S.f.rainbow) return say(["The horse stares at its veranda. It wants to go home, but something on its straw is snuffling.", ['horse', "Pfrrr?"]]);
    say(["The horse looks down at you from high above Pippi's head. It is not putting a hoof in that wet grass. It wants its veranda.", ['horse', "Pfrrrr."]]);
  },
  pippi10(){
    if(shower10()) return openRainbow10();
    if(S.f.out10) return say(['pippi', "Welcome home, everybody! Especially me."]);
    if(S.f.rainbow) return say(['pippi', "The horse wants to go on its veranda. But there's something on its straw. Something prickly."]);
    say(['pippi', S.f.door ? "A welcome-home party! I've never had one, so I'm sure it'll be the best one ever." : "Home! I'd put the horse down, but it says the grass is too wet. It's very particular about its hooves."]);
  },
  kids10(){
    if(S.f.out10) return say([['annika', "What a day. And school starts on Monday."], ['tommy', "Don't tell Pippi."]]);
    if(shower10()) return say([['annika', "The sun's out, and it's still raining! Pippi says she's ordered a rainbow."], ['tommy', "Where will it be, though?"]]);
    if(!S.f.rings) return say([['annika', "That branch was knocked down by the winter storms. Look, you can see rings where it broke."], ['tommy', "Pippi could break it up in no time. If she put the horse down."]]);
    if(!S.f.rolled) return say([['tommy', "The sea chest is too heavy for us to carry. But those logs are nice and round…"]]);
    if(!S.f.door) return say([['annika', "Pippi, where's the front-door key?"], ['pippi', "Mr Nilsson knows. Mr Nilsson knows everything."]]);
    say([['tommy', "Let's get the party ready!"], ['annika', "Only with things that haven't gone off. We've been away for months."]]);
  }
});

/* ---------- puzzle: the broken branch (a tree grows one ring every year; the newest is just under the bark) ---------- */
const RINGS9 = 9;
function openRings10(){
  const st = S.rng || (S.rng = { r: 0, n: 1 });
  openModal('The fallen branch', 'The broken end, close up', `
    <p class="flag-p">${tx("Pippi is about to snap the branch into logs. \"Wait!\" says Annika. \"Look at the end where it broke off: rings! A tree grows a new ring every year.\"")}</p>
    <svg class="rings10-svg" translate="no" viewBox="0 0 260 240" aria-hidden="true" id="rings10-svg"></svg>
    <div id="rings10-q"></div>
    <div class="feedback" id="rings10-fb"></div>`, () => {
    const fb = $('#rings10-fb');
    const draw = () => {
      let g = `<rect width="260" height="240" fill="#9ad461" rx="8"/><circle cx="130" cy="120" r="108" fill="#6b4423"/>`;
      for(let i = RINGS9 - 1; i >= 0; i--){ const r = 12 + i * 11;
        g += `<circle cx="130" cy="120" r="${r}" fill="${i % 2 ? '#ecd29c' : '#e6c88e'}" stroke="#a8743a" stroke-width="2.5"/>`; }
      g += `<circle cx="130" cy="120" r="3" fill="#8a5a2b"/>`;
      if(st.r === 1) for(let i = 0; i < RINGS9; i++) g += `<circle class="rg10${st.pick === i ? ' on' : ''}" data-i="${i}" cx="130" cy="120" r="${12 + i * 11}" fill="none" stroke="transparent" stroke-width="9"/>`;
      $('#rings10-svg').innerHTML = g;
      $('#rings10-q').innerHTML = st.r === 0
        ? `<p><b>${tx('How old was the branch? Count the rings.')}</b></p><div class="row-btns stepper10"><button type="button" class="btn ghost" id="rg10-minus" aria-label="${tx('One fewer')}">−</button><b class="num10" id="rg10-n">${st.n}</b><button type="button" class="btn ghost" id="rg10-plus" aria-label="${tx('One more')}">+</button><button type="button" class="btn" id="rg10-go">${tx("That's it")}</button></div>`
        : `<p><b>${tx('And which ring grew last summer, just before the storm? Click it.')}</b></p>`;
      if(st.r === 0){
        const set = n => { st.n = Math.max(1, Math.min(30, n)); save(); beep(600, .03); $('#rg10-n').textContent = st.n; };
        $('#rg10-minus').onclick = () => set(st.n - 1);
        $('#rg10-plus').onclick = () => set(st.n + 1);
        $('#rg10-go').onclick = () => {
          if(st.n === RINGS9){ st.r = 1; save(); chord([523, 659, 784]); fb.className = 'feedback good'; fb.textContent = tx('Nine rings: the branch was nine years old. One ring for every year.'); draw(); return; }
          nope(); fb.className = 'feedback bad';
          fb.textContent = tx(st.n === RINGS9 * 2 ? 'You counted the light rings and the dark lines. Each year makes a light ring (spring and summer, when the tree grows fast) and a dark line (when it slows down in autumn). Count just the dark lines.'
            : st.n < RINGS9 ? 'There are more than that. Start at the dot in the middle and count every dark line out to the bark.' : 'Fewer than that. Count only the dark lines, from the dot in the middle out to the bark.');
        };
      }
      document.querySelectorAll('#rings10-svg .rg10').forEach(el => el.onclick = () => {
        const i = +el.dataset.i; st.pick = i; save(); draw();
        if(i === RINGS9 - 1){
          S.f.rings = true; S.rng = null; save(); chord([523, 659, 784, 1046]);
          fb.className = 'feedback good'; fb.textContent = tx('The outside one, just under the bark! A tree grows outwards: every year it adds a new ring on the outside. The ring in the middle is from when the branch was a tiny twig.');
          setTimeout(() => { closeModal(); applyVisuals(); say([['pippi', "Nine! Just like me. We're twins, this branch and I."], "Pippi snaps the branch into round logs with one hand, the way other people break a biscuit. The horse, in her other hand, doesn't even wobble.", ['tommy', "Round logs… Annika, are you thinking what I'm thinking?"], ['annika', "The sea chest!"]]); }, 2600);
          return;
        }
        nope(); fb.className = 'feedback bad';
        fb.textContent = tx(i === 0 ? "That's the very first ring, from when the branch was a tiny twig. Every year the tree adds a new ring on the outside." : 'Not that one. The newest ring is the one nearest the bark.');
      });
    };
    draw();
  });
}

/* ---------- puzzle: the sea chest (friction: sliding rubs, rolling hardly does) ---------- */
const ROLL10 = [
  { k: 'carry', name: 'Carry it', kg: 80, no: "Lift 80 kilos? You can't even get it off the cart. Carrying means holding up all of its weight." },
  { k: 'grass', name: 'Drag it across the grass', kg: 50, no: 'You pull and pull. The chest digs into the soft grass and hardly moves: it takes as much pulling as 50 kilos. Far too much.' },
  { k: 'gravel', name: 'Push it along the gravel path', kg: 40, no: 'Scraaape. The chest squeaks and scratches over the gravel. Still as much pulling as 40 kilos: twice what the three of you can manage.' },
  { k: 'logs', name: 'Put the round logs under it', kg: 5 }
];
const PULL10 = 20;   // what you, Tommy and Annika can pull together
function openRoll10(){
  const st = S.rol || (S.rol = { r: 0, pick: -1 });
  openModal("Pippi's sea chest", 'From the cart to the veranda', `
    <p class="flag-p">${tx("The sea chest weighs 80 kilos. Pippi's hands are full of horse, so it's up to you, Tommy and Annika. Together you can pull as hard as 20 kilos. Try it: the meter shows how hard you'd have to pull.")}</p>
    <svg class="roll10-svg" translate="no" viewBox="0 0 320 120" aria-hidden="true" id="roll10-svg"></svg>
    <div class="row-btns mix" id="roll10-opts">${ROLL10.map((o, i) => `<button type="button" class="btn ghost ro10" data-i="${i}">${tx(o.name)}</button>`).join('')}</div>
    <div id="roll10-q" hidden></div>
    <div class="feedback" id="roll10-fb"></div>`, () => {
    const fb = $('#roll10-fb');
    const draw = () => {
      const o = ROLL10[st.pick], kg = o ? o.kg : 0, x = v => 20 + v / 80 * 280;
      let g = `<rect width="320" height="120" fill="#e9f4dc" rx="8"/>`;
      g += `<rect x="20" y="58" width="280" height="22" rx="4" fill="#fffaf0" stroke="#8a6a4a" stroke-width="2"/>`;
      if(o) g += `<rect x="20" y="58" width="${(x(kg) - 20).toFixed(1)}" height="22" rx="4" fill="${kg <= PULL10 ? '#5fa83e' : '#e2483d'}"/>`;
      g += `<path d="M${x(PULL10)} 50 v38" stroke="#2f5f9a" stroke-width="3" stroke-dasharray="4 3"/><text x="${x(PULL10) + 4}" y="46" font-size="10" fill="#2f5f9a">${tx('you three')}</text>`;
      [0, 20, 40, 60, 80].forEach(v => g += `<text x="${x(v)}" y="98" text-anchor="middle" font-size="10" fill="#5a3a1a">${v} kg</text>`);
      g += `<g transform="translate(${o ? 24 + (kg <= PULL10 ? 200 : 40) : 24} 8)"><rect width="56" height="30" rx="3" fill="#7a4022"/><rect x="22" width="6" height="30" fill="#c9952a"/>${o && o.k === 'logs' ? '<circle cx="10" cy="36" r="7" fill="#e8c58a" stroke="#a8743a"/><circle cx="46" cy="36" r="7" fill="#e8c58a" stroke="#a8743a"/>' : ''}</g>`;
      g += `<text x="300" y="114" text-anchor="end" font-size="10" fill="#5a3a1a">${tx('how hard you have to pull')}</text>`;
      $('#roll10-svg').innerHTML = g;
      document.querySelectorAll('.ro10').forEach(b => b.classList.toggle('on', +b.dataset.i === st.pick));
    };
    const ask = () => {
      $('#roll10-q').hidden = false;
      const opts = ['When something slides, it rubs against the ground. Rolling hardly rubs at all.', 'The logs make the chest lighter.', 'Logs like rolling.'];
      $('#roll10-q').innerHTML = `<p><b>${tx('Only 5 kilos! But why is rolling so much easier than dragging?')}</b></p><div class="row-btns mix">${opts.map((o, i) => `<button type="button" class="btn ghost rq10" data-i="${i}">${tx(o)}</button>`).join('')}</div>`; mixIn($('#roll10-q'));
      document.querySelectorAll('.rq10').forEach(b => b.onclick = () => {
        const i = +b.dataset.i;
        if(i !== 0){ nope(); fb.className = 'feedback bad'; fb.textContent = tx(i === 1 ? "The chest still weighs 80 kilos. It's the rubbing that changes, not the weight." : 'Pippi agrees. But try rolling a square log…'); return; }
        S.f.rolled = true; S.rol = null; save(); chord([523, 659, 784, 1046]);
        fb.className = 'feedback good'; fb.textContent = tx('Exactly! That rubbing is called friction. Rollers, wheels and even the little balls inside a bicycle wheel are all ways of rolling instead of sliding.');
        setTimeout(() => { closeModal(); applyVisuals(); say(["Roll, roll, roll. Every time a log pops out at the back, Tommy runs round and puts it in at the front again.", ['pippi', "That's how they built the pyramids in Egypt. I helped. Well, I would have."], "The chest rumbles along the path and stops at the foot of the veranda."]); }, 2600);
      });
    };
    draw();
    document.querySelectorAll('.ro10').forEach(b => b.onclick = () => {
      const i = +b.dataset.i, o = ROLL10[i]; st.pick = i; save(); draw();
      if(o.k === 'logs'){ if(st.r === 0){ st.r = 1; save(); } chord([523, 659, 784]); fb.className = 'feedback good'; fb.textContent = tx('The chest rolls along on the logs, as easy as anything.'); ask(); return; }
      nope(); fb.className = 'feedback bad'; fb.textContent = tx(o.no);
    });
    if(st.r === 1) ask();
  });
}

/* ---------- puzzle: the rain barrel (a magnet pulls iron and steel, not gold, glass or rubber) ---------- */
const MAG10 = [
  { k: 'key', name: 'The key (iron)', yes: true, svg: '<circle cx="13" cy="22" r="7" fill="none" stroke="#6a6f76" stroke-width="4"/><path d="M20 22h18M32 22v6M37 22v5" stroke="#6a6f76" stroke-width="4" stroke-linecap="round"/>' },
  { k: 'coin', name: 'A gold coin', svg: '<circle cx="22" cy="22" r="13" fill="#f2c94c" stroke="#c9952a" stroke-width="3"/><circle cx="22" cy="22" r="7" fill="none" stroke="#c9952a" stroke-width="2"/>' },
  { k: 'nail', name: 'A nail (iron)', yes: true, svg: '<path d="M12 12h18" stroke="#6a6f76" stroke-width="5" stroke-linecap="round"/><path d="M21 12v20l-2 6" stroke="#6a6f76" stroke-width="4" stroke-linecap="round" fill="none"/>' },
  { k: 'marble', name: 'A glass marble', svg: '<circle cx="22" cy="22" r="11" fill="#7fc6e6" opacity=".85" stroke="#3a8ab0" stroke-width="2"/><path d="M16 18q6-6 12 2" stroke="#fff" stroke-width="3" fill="none"/>' },
  { k: 'cap', name: 'A bottle top (steel)', yes: true, svg: '<path d="M10 28l3-9h18l3 9z" fill="#c4302b"/><path d="M10 28h24" stroke="#8a1a14" stroke-width="3"/><path d="M14 19l1-4M19 19v-4M25 19v-4M30 19l-1-4" stroke="#c4302b" stroke-width="2"/>' },
  { k: 'ball', name: 'A rubber ball', svg: '<circle cx="22" cy="22" r="12" fill="#3f8ad8"/><path d="M10 22h24M22 10v24" stroke="#f2c94c" stroke-width="3"/>' }
];
function openMagnet10(){
  const st = S.mag || (S.mag = { on: [] });
  openModal('The rain barrel', 'A magnet on a string', `
    <p class="flag-p">${tx('Mr Nilsson tells you, with his hands, that he dropped six things in the barrel over the winter. Before you lower the magnet: <b>which things will it pull up?</b> Tick them.')}</p>
    <div class="cards10" id="mag10">${MAG10.map((m, i) => `<button type="button" class="card10 mg10" data-i="${i}" aria-pressed="false"><svg viewBox="0 0 44 44" aria-hidden="true">${m.svg}</svg><span>${tx(m.name)}</span></button>`).join('')}</div>
    <div class="row-btns"><button type="button" class="btn" id="mg10-go">${tx('Lower the magnet')}</button></div>
    <div class="feedback" id="mg10-fb"></div>`, () => {
    const fb = $('#mg10-fb');
    const draw = () => document.querySelectorAll('.mg10').forEach(b => { const on = st.on.includes(MAG10[+b.dataset.i].k); b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    draw();
    document.querySelectorAll('.mg10').forEach(b => b.onclick = () => { const k = MAG10[+b.dataset.i].k; st.on = st.on.includes(k) ? st.on.filter(x => x !== k) : [...st.on, k]; save(); beep(640, .03); fb.className = 'feedback'; fb.textContent = ''; draw(); });
    $('#mg10-go').onclick = () => {
      const want = MAG10.filter(m => m.yes).map(m => m.k), on = st.on;
      if(want.every(k => on.includes(k)) && on.length === want.length){
        S.f.key = true; S.mag = null; save(); give('key10'); chord([523, 659, 784, 1046]);
        fb.className = 'feedback good'; fb.textContent = tx('Up comes the magnet with the key, the nail and the bottle top stuck to it. The gold coin, the marble and the ball stay at the bottom. Magnets pull things made of iron and steel, and hardly anything else.');
        setTimeout(() => { closeModal(); applyVisuals(); say([['nilsson', "Eek!"], "Mr Nilsson snatches the bottle top. He has been looking for it all winter.", ['pippi', "He can keep the gold coin in the barrel. It's his savings."], "And you have the front-door key!"]); }, 2600);
        return;
      }
      nope(); fb.className = 'feedback bad';
      fb.textContent = tx(!on.length ? 'Tick the things you think will stick to the magnet.'
        : on.includes('coin') ? "Gold isn't magnetic! Otherwise Pippi's suitcase of gold would stick to the stove. A magnet pulls iron and steel."
        : on.includes('marble') || on.includes('ball') ? "Glass and rubber aren't magnetic at all. A magnet only pulls things made of iron or steel."
        : "You've missed something. Look for everything made of iron or steel.");
    };
  });
}

/* ---------- puzzle: the larder (food goes off when mould and bacteria can grow: they need water) ---------- */
const LARDER10 = [
  { k: 'crisp', name: 'Crispbread', ok: true, svg: '<g fill="#d9a25a"><rect x="8" y="12" width="28" height="9" rx="2"/><rect x="8" y="24" width="28" height="9" rx="2"/></g><g fill="#a8743a"><circle cx="14" cy="16" r="1.2"/><circle cx="22" cy="17" r="1.2"/><circle cx="30" cy="16" r="1.2"/><circle cx="14" cy="28" r="1.2"/><circle cx="22" cy="29" r="1.2"/><circle cx="30" cy="28" r="1.2"/></g>' },
  { k: 'bread', name: 'A loaf of bread', no: 'The bread is blue and green with mould. Mould loves soft, damp bread.', svg: '<path d="M8 32q0-18 14-18t14 18z" fill="#d9a25a"/><g fill="#5a9a6a"><circle cx="16" cy="24" r="3"/><circle cx="26" cy="21" r="2.5"/><circle cx="30" cy="28" r="3"/><circle cx="19" cy="29" r="2"/></g><circle cx="23" cy="26" r="2" fill="#3f6ea8"/>' },
  { k: 'honey', name: 'A jar of honey', ok: true, svg: '<rect x="12" y="14" width="20" height="24" rx="4" fill="#f2b34a"/><rect x="10" y="10" width="24" height="6" rx="2" fill="#b5651d"/><path d="M16 24h12" stroke="#b5651d" stroke-width="2"/>' },
  { k: 'milk', name: 'A bottle of milk', no: 'The milk has gone sour and lumpy. Tiny living things called bacteria grew in it.', svg: '<path d="M16 8h12v6l4 6v18H12V20l4-6z" fill="#fffaf0" stroke="#c9c2b2" stroke-width="1.5"/><path d="M12 26h20" stroke="#3f8ad8" stroke-width="3"/><path d="M34 6q3 3 0 6M38 9q3 3 0 6" stroke="#9fae5a" stroke-width="1.5" fill="none"/>' },
  { k: 'raisins', name: 'Raisins', ok: true, svg: '<ellipse cx="22" cy="30" rx="15" ry="6" fill="#fffaf0" stroke="#c9c2b2"/><g fill="#5a2a3a"><circle cx="16" cy="26" r="3"/><circle cx="22" cy="24" r="3"/><circle cx="28" cy="26" r="3"/><circle cx="19" cy="29" r="3"/><circle cx="25" cy="29" r="3"/></g>' },
  { k: 'cucumber', name: 'A cucumber', no: 'The cucumber has turned to slime. Fresh fruit and vegetables are full of water, so they go off quickly.', svg: '<ellipse cx="22" cy="24" rx="16" ry="7" fill="#5a8a3a" transform="rotate(-20 22 24)"/><g fill="#8ab84a" opacity=".8"><circle cx="16" cy="26" r="2"/><circle cx="26" cy="21" r="2"/></g><path d="M30 30q2 6 0 8" stroke="#9fc46a" stroke-width="3" fill="none"/>' },
  { k: 'jam', name: 'Strawberry jam (never opened)', ok: true, svg: '<rect x="12" y="16" width="20" height="22" rx="4" fill="#c4302b"/><rect x="10" y="11" width="24" height="7" rx="2" fill="#fffaf0"/>' },
  { k: 'pancake', name: 'An old pancake', no: 'The pancake has grown a green fur coat. Mr Nilsson is very offended that nobody ate it in time.', svg: '<ellipse cx="22" cy="26" rx="16" ry="9" fill="#a8b06a" stroke="#6a7a3a" stroke-width="2"/><g stroke="#6a9a4a" stroke-width="1.5"><path d="M12 22l-2-4M18 19v-5M24 18l1-5M30 20l3-4M34 24l4-2"/></g>' }
];
function openLarder10(){
  const st = S.lar || (S.lar = { on: [] });
  openModal("Pippi's larder", 'Everything is out on the garden table', `
    <p class="flag-p">${tx("You've been away for five months, and nobody was here to eat anything. <b>What is still good enough for the party?</b> Tick it.")}</p>
    <div class="cards10 four" id="lar10">${LARDER10.map((m, i) => `<button type="button" class="card10 ld10" data-i="${i}" aria-pressed="false"><svg viewBox="0 0 44 44" aria-hidden="true">${m.svg}</svg><span>${tx(m.name)}</span></button>`).join('')}</div>
    <div class="row-btns"><button type="button" class="btn" id="ld10-go">${tx('Onto the party table!')}</button></div>
    <div class="feedback" id="ld10-fb"></div>`, () => {
    const fb = $('#ld10-fb');
    const draw = () => document.querySelectorAll('.ld10').forEach(b => { const on = st.on.includes(LARDER10[+b.dataset.i].k); b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    draw();
    document.querySelectorAll('.ld10').forEach(b => b.onclick = () => { const k = LARDER10[+b.dataset.i].k; st.on = st.on.includes(k) ? st.on.filter(x => x !== k) : [...st.on, k]; save(); beep(640, .03); fb.className = 'feedback'; fb.textContent = ''; draw(); });
    $('#ld10-go').onclick = () => {
      const bad = LARDER10.find(m => !m.ok && st.on.includes(m.k));
      if(bad){ nope(); fb.className = 'feedback bad'; fb.textContent = tx(bad.no); if(bad.k === 'pancake'){ S.ach.furry = true; save(); } return; }
      if(LARDER10.some(m => m.ok && !st.on.includes(m.k))){ nope(); fb.className = 'feedback bad'; fb.textContent = tx(st.on.length ? 'There are more good things than that. Dry things and very sweet things keep for a long time.' : 'Tick the things that are still good to eat.'); return; }
      S.f.larder = true; S.lar = null; save(); chord([523, 659, 784, 1046]);
      fb.className = 'feedback good'; fb.textContent = tx("Crispbread and raisins are dry, and honey and jam are full of sugar. Mould and bacteria need water to grow, so dry or very sweet food keeps for months. That's why sailors take dried food on long voyages.");
      setTimeout(() => { closeModal(); applyVisuals(); say(["Crispbread, honey, raisins and jam go on the party table. The rest goes on the compost heap, and the old pancake gets a little funeral.", "Then a grey cloud slides over the garden, and it starts to pour.", ['annika', "An April shower! Everybody onto the veranda!"], "But the sun is already peeping out again, low in the west, while the rain is still coming down.", ['pippi', "I've ordered a rainbow for the party. Where will it be? Somebody tell everybody where to look!"]]); }, 2800);
    };
  });
}

/* ---------- puzzle: the rainbow (always opposite the sun: sunlight split into colours by raindrops) ---------- */
const DIRS10 = [['N', 'north', 150, 22], ['E', 'east', 282, 154], ['S', 'south', 150, 288], ['W', 'west', 18, 154]];
function openRainbow10(){
  const st = S.rbw || (S.rbw = { r: 0 });
  openModal('Sun and rain', 'Where will the rainbow be?', `
    <p class="flag-p">${tx("It's evening, and the sun is low in the west. It's still raining all over the garden. Everybody is on the veranda, waiting for Pippi's rainbow.")}</p>
    <svg class="rainbow10-svg" translate="no" viewBox="0 0 300 300" aria-hidden="true" id="rbw10-svg"></svg>
    <div id="rbw10-q"></div>
    <div class="feedback" id="rbw10-fb"></div>`, () => {
    const fb = $('#rbw10-fb');
    let g = `<rect width="300" height="300" rx="10" fill="#9ad461"/><circle cx="150" cy="154" r="104" fill="#8ac85a" stroke="#6aa84a" stroke-width="3"/>`;
    g += `<g stroke="#bfe0ef" stroke-width="2" opacity=".9">${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => `<path d="M${60 + i * 20} ${70 + (i % 3) * 30} l-5 14"/><path d="M${70 + i * 18} ${190 + (i % 2) * 24} l-5 14"/>`).join('')}</g>`;
    g += `<rect x="128" y="138" width="44" height="34" fill="#f2c94c" stroke="#c9a03a" stroke-width="2"/><path d="M124 140 l26 -18 l26 18z" fill="#e8571f"/><circle cx="150" cy="182" r="5" fill="#2f5f9a"/><text x="150" y="198" text-anchor="middle" font-size="10" fill="#1f3f6a">${tx('you')}</text>`;
    g += `<g transform="translate(46 154)"><circle r="18" fill="#ffe27a"/><g stroke="#f2a13a" stroke-width="3"><path d="M0 -26v6M0 20v6M-26 0h6M20 0h6"/></g></g><text x="46" y="192" text-anchor="middle" font-size="10" fill="#5a3a1a">${tx('the evening sun')}</text>`;
    g += `<g font-size="16" font-weight="700" fill="#1f3f6a" text-anchor="middle" font-family="Fredoka, sans-serif">${DIRS10.map(([l, , x, y]) => `<text x="${x}" y="${y + 6}">${tx(l)}</text>`).join('')}</g>`;
    $('#rbw10-svg').innerHTML = g;
    const ask = () => {
      const q = st.r === 0
        ? { ask: '<b>Which way should everybody look to see the rainbow?</b>', opts: DIRS10.map(([, n]) => tx('Look {dir}', { dir: tx(n) })), ok: 1 }
        : { ask: '<b>And what is a rainbow made of?</b>', opts: ['Sunlight, split into its colours by the raindrops', 'Coloured raindrops', 'Paint, washed out of the sky by the rain'].map(o => tx(o)), ok: 0 };
      $('#rbw10-q').innerHTML = `<p>${tx(q.ask)}</p><div class="row-btns${st.r ? ' mix' : ''}">${q.opts.map((o, i) => `<button type="button" class="btn ghost rb10" data-i="${i}">${o}</button>`).join('')}</div>`; mixIn($('#rbw10-q'));
      document.querySelectorAll('.rb10').forEach(b => b.onclick = () => {
        const i = +b.dataset.i;
        if(i !== q.ok){ nope(); fb.className = 'feedback bad';
          fb.textContent = tx(st.r === 0 ? (i === 3 ? "That's looking straight into the sun! Never look at the sun. And a rainbow is never on the sun's side of the sky." : 'Not quite. The sunlight has to shine into the raindrops and bounce back to you. Turn your back on the sun.')
            : i === 1 ? "The raindrops are as clear as glass. It's the sunlight that is full of colours: the drops split it up." : "The sky isn't painted. Not even in Egypt."); return; }
        chord([523, 659, 784]);
        if(st.r === 0){ st.r = 1; save(); fb.className = 'feedback good'; fb.textContent = tx('East! A rainbow is always opposite the sun: the sun behind you, the rain in front of you.'); ask(); return; }
        S.f.rainbow = true; S.rbw = null; save();
        fb.className = 'feedback good'; fb.textContent = tx('Sunlight looks white, but it is all the colours mixed together. Each raindrop splits it up, like a tiny prism: red, orange, yellow, green, blue, indigo and violet.');
        setTimeout(() => { closeModal(); applyVisuals(); say(["Everybody turns round to face the east. And there it is: a rainbow, right over the roof of Villa Villekulla.", ['pippi', "Exactly where I ordered it."], "The rain stops. The whole garden sparkles in the evening sun.", "Then, from the veranda, comes a loud snuffling sound. The heap of leaves on the horse's straw is moving!", ['horse', "Pfrrr?!"]]); }, 2800);
      });
    };
    ask();
  });
}

/* ---------- puzzle: the hedgehog (hibernation; and what to give a hungry hedgehog: water and meaty food, never milk) ---------- */
function openHog10(){
  const st = S.hog || (S.hog = { r: 0 });
  openModal('A hedgehog!', "In the horse's straw", `
    <svg class="hog10-svg" translate="no" viewBox="0 0 300 150" aria-hidden="true"><rect width="300" height="150" rx="8" fill="#a5743f"/><path d="M20 140 q40 -50 130 -54 q100 -4 130 54z" fill="#e2c46a"/>
      <g fill="#a8743a"><ellipse cx="70" cy="118" rx="26" ry="10"/><ellipse cx="262" cy="132" rx="22" ry="8" fill="#8a5a2b"/><ellipse cx="120" cy="134" rx="16" ry="6" fill="#c48a3a"/></g>
      <path d="M96 124 q50 -76 112 -16 q-56 -10 -112 16z" fill="#6b4a2b"/><g stroke="#3a2614" stroke-width="3" stroke-linecap="round"><path d="M110 112 l-8 -14 M124 100 l-6 -16 M140 92 l-2 -17 M158 90 l2 -17 M174 94 l6 -15 M188 102 l9 -13"/></g>
      <path d="M200 112 q26 -6 30 8 q-12 8 -30 2z" fill="#d9b58a"/><circle cx="232" cy="118" r="4" fill="#1a1a1a"/><path d="M204 110 q5 -4 10 0" stroke="#1a1a1a" stroke-width="2.5" fill="none"/></svg>
    <p class="flag-p">${tx("Under the leaves, curled up in the horse's straw, a hedgehog is waking up. It's thin and very sleepy.")}</p>
    <div id="hog10-q"></div>
    <div class="feedback" id="hog10-fb"></div>`, () => {
    const fb = $('#hog10-fb');
    const Q = [
      { ask: 'Why has it been asleep under the leaves all winter?', opts: ['It was hibernating: in winter there are no beetles or worms to eat, so it sleeps and lives on its fat', 'It was hiding from Mr Nilsson', 'It was keeping the straw warm for the horse'], ok: 0,
        no: ['', 'Mr Nilsson was in the South Seas! Hedgehogs sleep all winter even when there are no monkeys about.', "Very kind of it, but no. It came for the warm, dry heap of leaves, not for the horse."] },
      { ask: 'It has slept for months. What should you give a hungry, thirsty hedgehog?', opts: ['A saucer of milk', 'Some bread', 'A shallow dish of water and some cat food', "Pippi's sweets"], ok: 2,
        no: ["No milk! Hedgehogs can't digest it: it gives them a terrible tummy ache. Lots of people don't know that.", "Bread fills up its tummy, but there's nothing in it that a hedgehog needs.", '', 'Pippi offers eighteen kilos. The hedgehog needs zero kilos: sweets are very bad for hedgehogs.'] }
    ];
    const ask = () => {
      const q = Q[st.r];
      $('#hog10-q').innerHTML = `<p><b>${tx(q.ask)}</b></p><div class="row-btns mix">${q.opts.map((o, i) => `<button type="button" class="btn ghost hg10" data-i="${i}">${tx(o)}</button>`).join('')}</div>`; mixIn($('#hog10-q'));
      document.querySelectorAll('.hg10').forEach(b => b.onclick = () => {
        const i = +b.dataset.i;
        if(i !== q.ok){ nope(); fb.className = 'feedback bad'; fb.textContent = tx(q.no[i]); return; }
        chord([523, 659, 784]);
        if(st.r === 0){ st.r = 1; save(); fb.className = 'feedback good'; fb.textContent = tx("Hibernating! Its heart beat very slowly, it hardly breathed, and it lived on the fat it ate in the autumn. Now it's spring, and it has woken up very, very hungry."); ask(); return; }
        S.f.out10 = true; S.hog = null; save(); chord([523, 659, 784, 1046, 1318, 1568]);
        fb.className = 'feedback good'; fb.textContent = tx('Water and meaty food, like cat food: hedgehogs eat beetles, worms and snails. And never milk!');
        setTimeout(() => { closeModal(); applyVisuals(); win10(); }, 2600);
      });
    };
    ask();
  });
}

/* ---------- intro, start and win ---------- */
function intro10(){
  say([["sys", "Villa Villekulla, in spring. The snow has gone, the grass is up to your knees, and the old oak is full of new leaves."],
       ["pippi", "Home! Villa Villekulla, I'm back! Did you miss me?"],
       ["sys", "Pippi is carrying the horse high over her head. It won't put a hoof in the wet grass: it wants its own veranda."],
       ["annika", "Oh no. A big branch has come off the old oak in the winter storms. It's lying right across the path."],
       ["tommy", "And how do we get the sea chest off the cart? It weighs as much as a grown-up."],
       ["pippi", "Tonight we'll have a welcome-home party, for the whole town! I've never had a welcome-home party, so I'm sure it'll be the best one ever."],
       ["you", "First things first: that branch on the path."]],
    () => { S.f.introDone = true; save(); });
}
function startCh10(){
  setUnlocked10();
  S = Object.assign(fresh(), { ach: S.ach || {}, ch: 10, scene: 'home' });
  S.started = true; sel = null;
  $('#title').hidden = true; $('#win').hidden = true;
  renderInv(); applyVisuals(); $('#timer').textContent = '00:00'; save(); intro10();
}
function win10(){
  say([["sys", "The hedgehog eats every last crumb, drinks the whole dish, and trundles off to live under the lilac bush."],
       ["pippi", "And now, at last…"],
       ["sys", "Pippi lifts the horse high over her head one last time, and sets it down gently on its own veranda, in its own straw."],
       ["horse", "Pfrrrrrr!"],
       ["sys", "The horse looks round at its veranda, the garden, the old oak and the rainbow, and gives a long, happy sigh. It's home."],
       ["sys", "That evening the whole town comes to the welcome-home party: Miss, Kling and Klang, and half the circus. Lanterns glow in the old oak, and Pippi makes pancakes for everybody."],
       ["kling", "Welcome home, Miss Longstocking. We have brought a cake."],
       ["klang", "We ate a bit of it on the way."],
       ["captain", "Pippilotta! The Hoppetossa sails again at dawn. Unless… you'd rather stay here?"],
       ["pippi", "I'll stay, Dad. Villa Villekulla is my home. But come back soon!"],
       ["annika", "And school starts on Monday."],
       ["pippi", "Then on Monday I'll start my holidays from school. I've never done that before, so I'm sure I can!"]],
    () => showWin());
}
