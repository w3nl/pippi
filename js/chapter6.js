// Chapter 6: Pippi's balloon ride. The ringmaster gives Pippi the circus's old hot-air balloon as a thank-you.
// The flight goes in legs, like the Hoppetossa's voyage: the garden, over the town, over the farms, through a cloud,
// and up to the church tower on the hill, where the burglars' stolen weathercock belongs.
// Loaded in order by js/boot.js; all game files share the same global scope.

const UNLOCK6 = KEY + '-ch6';
function unlocked6(){ try{ if(localStorage.getItem(UNLOCK6) === '1') return true; }catch(e){} return S.ch >= 6 || (S.ch === 5 && !!S.f.out5); }
function setUnlocked6(){ try{ localStorage.setItem(UNLOCK6, '1'); }catch(e){} }

/* ---------- Chapter 6 items ---------- */
Object.assign(ITEMS, {
  note6: { name:"Annika's note", desc:'For Kling and Klang: "The burglars are hiding behind the haystacks at the farm with the L-shaped barn!"',
    svg:'<svg viewBox="0 0 44 44"><rect x="9" y="8" width="26" height="30" fill="#fffaf0" transform="rotate(5 22 23)"/><path d="M14 16h16M14 22h14M14 28h16" stroke="#2f5f9a" stroke-width="2" transform="rotate(5 22 23)"/></svg>' },
  rooster: { name:'The golden weathercock', desc:'The church\'s golden weathercock. It belongs on top of the church tower, turning in the wind.',
    svg:'<svg viewBox="0 0 44 44"><path d="M10 30 q6-20 20-16 l4-8 l3 8 q8 4 4 14 q-8 8-22 8 q-8 0-9-6z" fill="#e8b830" stroke="#a8781a" stroke-width="1.5"/><path d="M10 30 l-6-8 l9 4z" fill="#e8b830"/><path d="M22 36 v6 M18 42 h8" stroke="#5a5f66" stroke-width="2"/></svg>' }
});

/* Where the flight is now: the garden, then over the town, the farms, through the cloud, and at the church. */
const leg6 = () => !S.f.up ? 'ground' : !S.f.steer ? 'town' : !S.f.dropped ? 'farms' : !S.f.cloud ? 'cloud' : 'church';

/* ---------- drawing the world below ---------- */
function buildBalloon(){
  if(!$('#bl-houses')) return;
  let h = '';
  [[60, 640], [200, 690], [380, 600], [470, 700], [620, 610], [860, 600], [1200, 620], [1320, 700], [180, 820], [460, 840], [1240, 840], [1480, 600]].forEach(([x, y], i) => {
    const w = 70 + (i % 3) * 14, c = ['#b0412a', '#c9a04a', '#e8e0d0'][i % 3];
    h += `<rect x="${x}" y="${y}" width="${w}" height="44" fill="${c}"/><path d="M${x - 6} ${y + 2} L${x + w / 2} ${y - 26} L${x + w + 6} ${y + 2}z" fill="#fff" stroke="#c9d8e8" stroke-width="2"/><rect x="${x + 12}" y="${y + 14}" width="10" height="10" fill="#fffaf0"/><rect x="${x + w - 18}" y="${y - 30}" width="8" height="18" fill="#7a3a1a"/>`;
  });
  $('#bl-houses').innerHTML = h;
  // chimney smoke leans back towards Villa Villekulla: the low wind blows the wrong way
  let sm = '';
  [[60, 640], [380, 600], [860, 600], [1200, 620]].forEach(([x, y], i) => { const w = 70 + (i % 3) * 14, cx = x + w - 14;
    sm += `<circle class="bl-puff" style="animation-delay:-${i * .7}s" cx="${cx}" cy="${y - 36}" r="8"/><circle class="bl-puff b" style="animation-delay:-${i * .7 + 1.2}s" cx="${cx - 14}" cy="${y - 44}" r="10"/>`; });
  $('#bl-smoke').innerHTML = sm;
  let fl = '';
  // snowy fields, with the tops of last year's furrows and hedges showing through
  const snows = ['#f4f8fc', '#eaf1f8', '#f8f6f0', '#e4edf6', '#f0f4f8'];
  for(let i = 0; i < 16; i++){ const x = 1600 + (i % 8) * 200, y = 560 + Math.floor(i / 8) * 150;
    fl += `<rect x="${x}" y="${y}" width="200" height="150" fill="${snows[i % 5]}" stroke="#9aa88a" stroke-width="4" stroke-dasharray="2 9" stroke-linecap="round"/>` + (i % 2 ? `<path d="M${x + 10} ${y + 30} h180 M${x + 10} ${y + 70} h180 M${x + 10} ${y + 110} h180" stroke="rgba(90,110,130,.12)" stroke-width="4"/>` : ''); }
  $('#bl-fields').innerHTML = fl;
  let pn = '';
  for(let i = 0; i < 26; i++){ const x = 3220 + (i * 37) % 760, y = 600 + (i * 53) % 260;
    pn += `<path d="M${x} ${y} l-18 40 h36z" fill="${i % 2 ? '#2f5a3a' : '#3f7a4a'}"/><path d="M${x} ${y} l-7 16 h14z" fill="#fff"/>`; }
  $('#bl-pines').innerHTML = pn;
  let cr = '';
  for(let i = 0; i < 16; i++){ const x = 5080 + (i % 8) * 24, y = 800 + Math.floor(i / 8) * 26;
    const col = ['#2f5f9a', '#e2483d', '#3f8a4a', '#f2c94c'][i % 4];
    cr += `<g class="bl-cheer" style="animation-delay:-${(i * .23).toFixed(2)}s"><path d="M${x - 5} ${y + 9} l-5 -9 M${x + 5} ${y + 9} l5 -9" stroke="${col}" stroke-width="3" stroke-linecap="round"/><rect x="${x - 6}" y="${y + 6}" width="12" height="18" rx="4" fill="${col}"/><circle cx="${x}" cy="${y}" r="6" fill="#f3c9a4"/></g>`; }
  $('#bl-crowd').innerHTML = cr;
}

function applyBalloon(){
  const show = vis;   // smooth when you can see it happen (core.js)
  const sc = $('#sc-balloon'); if(!sc) return;
  const f = S.f, leg = leg6(), up = !!f.up, flying = up && !f.out6;
  ['ground', 'town', 'farms', 'cloud', 'church'].forEach(l => sc.classList.toggle('bl-' + l, leg === l));
  sc.classList.toggle('bl-up', up);
  sc.classList.toggle('bl-landed', !!f.out6);
  show('#bl-flat', !up); show('#bl-balloon', up); show('#bl-flame', flying);
  show('#bl-gkids', !up);
  show('#bl-spunk', !f.spunkTaken && !up); show('#bl-spunka', !f.spunkTaken && up);
  show('#bl-fog', leg === 'cloud'); show('#bl-fog2', leg === 'cloud');
  show('#bl-ride', up && !f.dropped); show('#bl-caught', !!f.dropped && !f.cloud); show('#bl-cops3', !!f.cloud);
  show('#bl-feet', !f.dropped); show('#bl-cock', !!f.out6); show('#bl-crowd', !!f.cloud);
  const at = (id, on) => show('#hit-' + id, on);
  ['house6', 'horse6', 'balloon6g', 'ringmaster6', 'nilsson6g', 'pippi6g', 'kids6g', 'birds6'].forEach(id => at(id, leg === 'ground'));
  at('spunk6', leg === 'ground' && !f.spunkTaken); at('spunk6a', flying && !f.spunkTaken);
  ['balloon6a', 'burner6', 'kids6a', 'pippi6a', 'nilsson6a', 'basket6'].forEach(id => at(id, flying));
  at('town6', leg === 'town'); at('kite6', leg === 'town'); at('police6t', leg === 'town');
  at('farms6', leg === 'farms'); at('police6f', leg === 'farms'); at('saab6', leg === 'farms'); at('burglars6', leg === 'farms' && !!f.found);
  at('cloud6', leg === 'cloud');
  at('tower6', leg === 'church'); at('crowd6', leg === 'church'); at('harbour6', leg === 'church');
}
/* The balloon rises from the snowy garden (skipped with Motion off). */
function takeoff6(){
  const g = $('#bl-balloon .bl-lift'); if(!g || reducedMotion()) return;
  g.classList.remove('bl-takeoff'); void g.getBoundingClientRect(); g.classList.add('bl-takeoff');
  setTimeout(() => g.classList.remove('bl-takeoff'), 5200);
}

/* ---------- hotspot handlers ---------- */
const has6 = id => S.inv.includes(id);
Object.assign(H, {
  saab6(){ spotSaab(["Far below, a little red Saab 96 putters along the country road. From up here it looks like a ladybird.", ['pippi', "Hello down there! Ring-ding-ding-ding!"]]); },
  spunk6(){ S.f.spunkTaken = true; give('spunk'); applyVisuals(); say(["The spunk's jam jar. Pippi has brought it along, so that the spunk can see the world from above.", "You take it. A spunk has never flown before. It looks calm about it."]); },
  geese6(){ gag('#bl-geesebox', 'gag-hop', 1100); gagText('Honk honk!'); chord([330, 300, 330, 300], 120); },
  birds6(){ gag('#bl-sparrows', 'gag-flyup', 1400); gagText('Tweet tweet!'); chord([2200, 2600, 2300], 70); },
  sky6(){
    const leg = leg6();
    if(leg === 'cloud') return openCloud6();
    if(leg === 'ground') return say(["A clear blue sky, with a nice steady breeze. Perfect for flying, says the ringmaster.", ['ringmaster', "Not too windy, not too calm. Like a good trapeze act."]]);
    if(leg === 'town') return say(["Up here, the sky is all around you. A flock of geese flies past at eye level and looks at you very strangely.", "Down low, the chimney smoke leans back towards Villa Villekulla. Higher up, the clouds are drifting that way too."]);
    if(leg === 'farms') return say("Blue sky above, patchwork fields below. The wind is carrying you nicely towards the farms.");
    say(S.f.out6 ? "The sun shines on the golden weathercock. The sky is as blue as a policeman's uniform." : "Bright sunshine, after the cloud. The church tower is right next to the basket.");
  },
  house6(){ say(["Villa Villekulla, a little crooked as always. The horse is watching from the veranda.", ['pippi', "We'll be back for supper. Probably. Unless we fly to Egypt."]]); },
  horse6(){ say(["The horse looks at the basket, and then at you. Four hundred kilos of horse in a balloon basket?", ['horse', "Pfrrr."], "It decides to stay on the veranda and guard the house."]); },
  ringmaster6(){ say([['ringmaster', "The circus balloon! It has flown over seven countries and one very surprised cow. And now it's yours, Miss Longstocking."], ['ringmaster', "Just remember: hot air goes up. Up, up, up!"]]); },
  balloon6(){
    if(!S.f.up) return openLift6();
    say(["The circus balloon: red and yellow, with two white stars. It's taller than Villa Villekulla.", ['pippi', "It's the biggest thing I've ever carried. Well, it's carrying me, actually."]]);
  },
  burner6(){
    const leg = leg6();
    if(leg === 'town') return openWinds6();
    if(leg === 'cloud') return openCloud6();
    if(leg === 'farms') return say("A tiny puff from the burner keeps you at kite height. Right where the wind blows towards the farms.");
    say("A short puff from the burner, WHOOSH, keeps the balloon level with the top of the church tower.");
  },
  basket6(){ say(["The wicker basket creaks like an old chair. Sandbags hang from its sides, and a long rope trails down from the bottom.", ['annika', "Please don't jump, Pippi."]]); },
  pippi6(){
    if(!S.f.up) return say(['pippi', "I've never flown a balloon, so I'm sure I can!"]);
    S.f.taps6 = (S.f.taps6 || 0) + 1; save();
    if(S.f.taps6 >= 3){ S.ach.upside = true; save(); return say(["Pippi hooks her knees over the edge of the basket and hangs upside down, high above the ground.", ['pippi', "Everything looks much better this way round! The fields are the sky, and the sky is the sea."], ['annika', "PIPPI! Come back in AT ONCE!"]]); }
    say(['pippi', leg6() === 'church' ? "Look, everybody: the whole town has come out to see us!" : "From up here you can see everything. Even the top of Kling's helmet. It needs polishing."]);
  },
  kids6(){
    const leg = leg6();
    if(leg === 'cloud'){ S.ach.cloudjar = true; save(); return say([['annika', "I'm catching a bit of cloud in a jam jar, to show Miss."], "Annika screws the lid on tightly. When she looks inside, the jar is empty. Just a few drops of water at the bottom.", ['tommy', "You caught some rain, though."]]); }
    if(leg === 'ground') return say([['tommy', "It's lying flat in the snow, like a big red pancake."], ['annika', "Pippi, are you sure this is safe?"], ['pippi', "Completely sure! Well, nearly."]]);
    if(leg === 'town') return say([['annika', "The smoke, the kite and the clouds all go different ways. So the wind must be different at different heights!"], ['tommy', "Then we just need the height where the wind blows to the farms."]]);
    if(leg === 'farms') return say([['tommy', "From up here, everything looks like a map."], ['annika', "A haystack doesn't look like a hill any more. It looks like a round biscuit."]]);
    say([['tommy', "We're higher than the church!"], ['annika', "Don't look down, Tommy. Oh. I looked down."]]);
  },
  nilsson6(){ say([['nilsson', "Eek!"], leg6() === 'ground' ? "Mr Nilsson is sitting on Pippi's shoulder, holding on to her plait with both hands." : "Mr Nilsson is hanging from the balloon ropes by his tail, enjoying the view."]); },
  town6(){
    say(["The little town, far below: snowy roofs, the square, and smoke curling from the chimneys. The smoke leans back towards Villa Villekulla.", ['annika', "At this height, the wind is blowing us the wrong way!"]]);
  },
  kite6(){ say(["In the park, a boy is flying a red kite, right up at your height. Its long yellow tail streams out towards the farms.", ['tommy', "A kite's tail always streams the way the wind is blowing."]]); },
  police6(){
    const leg = leg6();
    if(leg === 'town') return say([['kling', "The burglars ran off towards the farms, Miss Longstocking! Follow them, if you can!"], ['klang', "We'll follow you! Pedal, Kling, pedal!"]]);
    if(leg === 'farms'){
      if(!S.f.found) return say([['kling', "Where are they? We can't see a thing over these haystacks!"], ['klang', "The farm with the L-shaped barn, the round duck pond and three haystacks, the farmer said!"]]);
      if(has6('note6')) return say("Kling and Klang are on the road, far below. They can't hear you. Annika's note would tell them where the burglars are.");
      return say("Kling and Klang are pedalling along the road below.");
    }
    say([['kling', "Thunder-Karlsson and Bloom are under arrest, Miss Longstocking. Thanks to you."], ['klang', "And the weathercock is home. Thanks to you too."]]);
  },
  farms6(){
    if(!S.f.found) return openMap6();
    say("The farm with the L-shaped barn, the round duck pond and three haystacks. Something is wiggling behind the haystacks.");
  },
  burglars6(){ say(["Two pairs of feet stick out from behind the haystacks: one pair very big, one pair very small. The small pair is wiggling.", ['bloom', "Karlsson, I think that balloon can see us."], ['karlsson', "Balloons can't see, Bloom. Keep still."]]); },
  cloud6(){ openCloud6(); },
  tower6(){
    if(S.f.out6) return say("The golden weathercock shines on top of the church tower, with its beak pointing into the wind.");
    if(has6('rooster')) return openVane6();
    say("The church tower, right next to the basket. On top there's an empty spike where the weathercock should be.");
  },
  crowd6(){
    if(S.f.out6) return say([['kling', "Three cheers for Miss Longstocking!"], "The whole town cheers. Thunder-Karlsson and Bloom cheer too, a little bit, from behind Kling and Klang."]);
    say("The whole town is gathering on the church square, pointing up at the balloon.");
  },
  harbour6(){
    if(S.f.out6) return startCh7();   // on to Chapter 7: the ship in the harbour
    say(["The harbour, behind the church. A big three-masted ship is just sailing in.", ['pippi', "That ship looks familiar. But first: the weathercock!"]]);
  }
});

/* ---------- puzzle: lift-off (hot air is lighter than cold air, so it rises) ---------- */
function openLift6(){
  const st = S.lft || (S.lft = { r: 0 });
  openModal('The circus balloon', 'Lying flat in the snow', `
    <svg class="lift6-svg" translate="no" viewBox="0 0 300 170" aria-hidden="true"><rect width="300" height="170" rx="8" fill="#cfeaf8"/><rect y="130" width="300" height="40" fill="#eef3f8"/>
      <path d="M150 20 C200 20 222 60 214 96 C206 120 172 126 166 140 L134 140 C128 126 94 120 86 96 C78 60 100 20 150 20z" fill="#e2483d" opacity=".9"/>
      <g fill="none" stroke="#e8571f" stroke-width="3"><path d="M138 120 q6 -10 0 -20 q-6 -10 0 -20"/><path d="M162 120 q6 -10 0 -20 q-6 -10 0 -20"/></g>
      <ellipse cx="150" cy="142" rx="8" ry="12" fill="#ffb03a"/><rect x="128" y="146" width="44" height="22" rx="3" fill="#b08a52"/>
      <text x="40" y="60" font-size="12" fill="#2f5f9a">${tx('cold air')}</text><text x="128" y="64" font-size="12" fill="#fffaf0">${tx('air inside')}</text></svg>
    <div id="lift6-q"></div>
    <div class="feedback" id="lift6-fb"></div>`, () => {
    const fb = $('#lift6-fb');
    const Q = [
      { ask: 'How do you make the balloon go up?', opts: ['Blow it up with the bicycle pump', 'Heat the air inside with the burner', "Fill it with Pippi's sweets", 'Everybody jumps very high at the same time'], ok: 1,
        no: ['Pumped-in air is just as cold and heavy as the air outside. The balloon fills up, flops over and lies there like a sleepy elephant.', '', 'Sweets are heavy, and heavy things go down, not up. (Pippi eats a few, to make it lighter.)', 'You jump. You land. The basket stays exactly where it was. Mr Nilsson enjoyed it, though.'] },
      { ask: 'But why does hot air make the balloon rise?', opts: ['Hot air is lighter than the cold air around it, so it floats up, like a bubble in water', 'The flame pushes the balloon up like a rocket', 'The clouds pull it up'], ok: 0,
        no: ['', "There's no rocket: the flame points up INTO the balloon. It's the warm air inside that does the lifting.", 'Clouds are far too busy being clouds. They don\'t pull anything.'] }
    ];
    const ask = () => {
      const q = Q[st.r];
      $('#lift6-q').innerHTML = `<p><b>${tx(q.ask)}</b></p><div class="row-btns">${q.opts.map((o, i) => `<button type="button" class="btn ghost lf6" data-i="${i}">${tx(o)}</button>`).join('')}</div>`;
      document.querySelectorAll('.lf6').forEach(b => b.onclick = () => {
        const i = +b.dataset.i;
        if(i !== q.ok){ nope(); fb.className = 'feedback bad'; fb.textContent = tx(q.no[i]); return; }
        chord([523, 659, 784]);
        if(st.r === 0){ st.r = 1; save(); fb.className = 'feedback good'; fb.textContent = tx('The burner! WHOOOSH. The air inside the balloon gets hotter and hotter, and the balloon starts to stand up.'); ask(); return; }
        S.f.up = true; S.lft = null; save(); chord([523, 659, 784, 1046]);
        fb.className = 'feedback good'; fb.textContent = tx('Hot air spreads out, so a balloon full of it is lighter than the same balloon full of cold air. The cold air around pushes it up, the way water pushes a bubble up.');
        setTimeout(() => { closeModal(); applyVisuals(); takeoff6();
          say(["The burner roars, the balloon stands up straight, and the basket lifts off the snow!", ['ringmaster', "Bon voyage! Mind the chimneys!"], "Villa Villekulla gets smaller and smaller. Soon you're floating over the snowy roofs of the little town.", "Far below, two bicycles come racing across the square: Kling and Klang, shouting through a megaphone.", ['kling', "Miss Longstocking! The golden weathercock has been stolen from the church tower!"], ['klang', "It was Thunder-Karlsson and Bloom! They ran off towards the farms!"], ['pippi', "After them! But oh dear: the wind is blowing us back towards Villa Villekulla."], ['annika', "The wind isn't the same at every height. Look at the chimney smoke, the kite and the clouds!"]]); }, 2600);
      });
    };
    ask();
  });
}

/* ---------- puzzle: steering (the wind blows different ways at different heights; balloonists go up or down to steer) ---------- */
const HEIGHTS6 = [
  { k: 'high', name: 'Go up high', no: "Up there, the clouds are drifting back towards Villa Villekulla. Wrong way!" },
  { k: 'mid', name: 'The middle' },
  { k: 'low', name: 'Go down low', no: 'Down low, the chimney smoke leans back towards Villa Villekulla: the wind blows the wrong way. (And Pippi nearly lands on a chimney.)' }
];
function openWinds6(){
  const st = S.wnd || (S.wnd = { r: 0, h: 2 });
  openModal('Steering a balloon', 'A balloon has no steering wheel', `
    <p class="flag-p">${tx('The farms are that way: →. A balloon goes wherever the wind blows it. But the wind is not the same at every height…')}</p>
    <svg class="winds6-svg" translate="no" viewBox="0 0 320 240" aria-hidden="true" id="winds6-svg"></svg>
    <div class="row-btns" id="winds6-h">${HEIGHTS6.map((h, i) => `<button type="button" class="btn ghost wh6" data-i="${i}">${tx(h.name)}</button>`).join('')}</div>
    <div id="winds6-q" hidden></div>
    <div class="feedback" id="winds6-fb"></div>`, () => {
    const fb = $('#winds6-fb');
    const draw = () => {
      let g = `<rect width="320" height="240" rx="8" fill="#cfeaf8"/><rect y="200" width="320" height="40" fill="#eef3f8"/>`;
      g += `<path d="M0 80 H320 M0 150 H320" stroke="#fff" stroke-width="2" stroke-dasharray="6 6"/>`;
      g += `<g transform="translate(150 40)"><ellipse rx="34" ry="12" fill="#fff"/><ellipse cx="-12" cy="-8" rx="16" ry="10" fill="#fff"/><path d="M44 -4 h22 M44 6 h16" stroke="#fff" stroke-width="3"/></g>`;
      g += `<g transform="translate(130 112)"><path d="M0 -14 l12 14 l-12 14 l-12 -14z" fill="#e2483d"/><path d="M0 14 q10 6 20 0 q10 -6 20 0 q10 6 20 0" stroke="#f2c94c" stroke-width="3" fill="none"/></g>`;
      g += `<g transform="translate(150 186)"><rect x="-20" y="0" width="40" height="14" fill="#b0412a"/><rect x="6" y="-14" width="8" height="14" fill="#7a3a1a"/><circle cx="2" cy="-22" r="5" fill="#eef0f2"/><circle cx="-8" cy="-28" r="6" fill="#eef0f2"/><circle cx="-20" cy="-32" r="7" fill="#eef0f2"/></g>`;
      g += `<text x="8" y="232" font-size="11" fill="#2f4a2a">${tx('← Villa Villekulla')}</text><text x="312" y="232" font-size="11" fill="#2f4a2a" text-anchor="end">${tx('the farms →')}</text>`;
      g += `<text x="8" y="18" font-size="11" fill="#2f5f9a">${tx('high')}</text><text x="8" y="96" font-size="11" fill="#2f5f9a">${tx('middle')}</text><text x="8" y="166" font-size="11" fill="#2f5f9a">${tx('low')}</text>`;
      const y = [40, 112, 170][st.h];
      g += `<g transform="translate(262 ${y})"><path d="M0 -26 C14 -26 18 -14 16 -4 C14 4 6 6 4 10 L-4 10 C-6 6 -14 4 -16 -4 C-18 -14 -14 -26 0 -26z" fill="#e2483d" stroke="#8a1a14"/><rect x="-6" y="12" width="12" height="8" fill="#b08a52"/></g>`;
      $('#winds6-svg').innerHTML = g;
      document.querySelectorAll('.wh6').forEach(b => b.classList.toggle('on', +b.dataset.i === st.h));
    };
    const ask = () => {
      $('#winds6-q').hidden = false;
      const opts = ['By going up or down, to find a wind that blows the right way', 'With a steering wheel', 'By flapping the sandbags'];
      $('#winds6-q').innerHTML = `<p><b>${tx('So how does a balloon pilot steer?')}</b></p><div class="row-btns">${opts.map((o, i) => `<button type="button" class="btn ghost wq6" data-i="${i}">${tx(o)}</button>`).join('')}</div>`;
      document.querySelectorAll('.wq6').forEach(b => b.onclick = () => {
        const i = +b.dataset.i;
        if(i !== 0){ nope(); fb.className = 'feedback bad'; fb.textContent = tx(i === 1 ? 'Balloons have no steering wheel. Pippi checked twice.' : 'The sandbags flap. The balloon carries on exactly where the wind takes it.'); return; }
        S.f.steer = true; S.wnd = null; save(); chord([523, 659, 784, 1046]);
        fb.className = 'feedback good'; fb.textContent = tx('Exactly! A balloon pilot steers by going up and down, and looking for the wind that blows the right way.');
        setTimeout(() => { closeModal(); applyVisuals();
          say(["A little blast of the burner, and the balloon rises to kite height. The wind catches it, and off you float over the rooftops towards the farms.", "Far below, Kling and Klang pedal after you as fast as they can.", ['kling', "A farmer saw them! They're hiding at the farm with the L-shaped barn, the round duck pond and three haystacks!"], ['tommy', "From up here, the farms look just like a map."]]); }, 2600);
      });
    };
    draw();
    document.querySelectorAll('.wh6').forEach(b => b.onclick = () => {
      const i = +b.dataset.i, h = HEIGHTS6[i]; st.h = i; save(); beep(500 + i * 80, .05); draw();
      if(h.k === 'mid'){ if(st.r === 0){ st.r = 1; save(); } chord([523, 659, 784]); fb.className = 'feedback good'; fb.textContent = tx("The kite's tail streams out towards the farms: at this height, the wind blows exactly where you want to go."); ask(); return; }
      nope(); fb.className = 'feedback bad'; fb.textContent = tx(h.no);
    });
    if(st.r === 1) ask();
  });
}

/* ---------- puzzle: the map (from above, a haystack is a circle: a map shows things from above) ---------- */
const FARMS6 = [
  { no: 'That barn is one straight block, not an L.', barn: 'M10 14 h70 v26 h-70z', pond: '<circle cx="128" cy="34" r="16"/>', stacks: [[40, 96], [80, 104]] },
  { no: "That pond has corners: it's square, not round.", barn: 'M10 14 h70 v22 h-38 v36 h-32z', pond: '<rect x="108" y="20" width="32" height="32"/>', stacks: [[100, 100], [130, 96], [150, 112]] },
  { barn: 'M10 14 h70 v22 h-38 v36 h-32z', pond: '<circle cx="128" cy="34" r="16"/>', stacks: [[90, 100], [118, 108], [146, 98]] },
  { no: 'Count the haystacks: only two.', barn: 'M10 14 h70 v22 h-38 v36 h-32z', pond: '<circle cx="128" cy="34" r="16"/>', stacks: [[100, 104], [140, 100]] }
];
const FARM6_OK = 2;
function openMap6(){
  const st = S.map6 || (S.map6 = { r: 0 });
  openModal('The farms, from above', 'Up here, everything looks like a map', `
    <p class="flag-p">${tx('Kling and Klang shout up: the burglars are hiding at the farm with <b>the L-shaped barn, the round duck pond and three haystacks</b>.')}</p>
    <div id="map6-q"></div>
    <div class="feedback" id="map6-fb"></div>`, () => {
    const fb = $('#map6-fb');
    const draw = () => {
      if(st.r === 0){
        const shapes = ['<circle cx="22" cy="22" r="14" fill="#e2b84a"/>', '<path d="M22 6 L38 36 H6z" fill="#e2b84a"/>', '<rect x="8" y="8" width="28" height="28" fill="#e2b84a"/>'];
        $('#map6-q').innerHTML = `<div class="side6"><svg viewBox="0 0 60 44" aria-hidden="true"><path d="M6 40 q24 -44 48 0z" fill="#e2b84a"/><path d="M0 40 h60" stroke="#c9d8e8" stroke-width="3"/></svg><p>${tx('From the side, a haystack looks like a little hill. <b>What does it look like from above?</b>')}</p></div>
          <div class="row-btns">${shapes.map((s, i) => `<button type="button" class="btn ghost shp6" data-i="${i}" aria-label="${tx(['A circle', 'A triangle', 'A square'][i])}"><svg viewBox="0 0 44 44" width="40" height="40" aria-hidden="true">${s}</svg></button>`).join('')}</div>`;
        document.querySelectorAll('.shp6').forEach(b => b.onclick = () => {
          const i = +b.dataset.i;
          if(i !== 0){ nope(); fb.className = 'feedback bad'; fb.textContent = tx(i === 1 ? "That's how it looks from the side. From above, you look down on its round top." : "Haystacks aren't square. Not even in Egypt."); return; }
          st.r = 1; save(); chord([523, 659, 784]); fb.className = 'feedback good'; fb.textContent = tx('A circle! A map shows everything from above, the way a bird sees it.'); draw();
        });
        return;
      }
      let g = `<rect width="360" height="300" rx="8" fill="#eef3f8"/><path d="M0 150 H360 M180 0 V300" stroke="#c9ccd2" stroke-width="10"/>`;
      FARMS6.forEach((fm, i) => {
        const x = (i % 2) * 180, y = Math.floor(i / 2) * 150;
        g += `<g class="fm6" data-i="${i}" transform="translate(${x + 6} ${y + 8})"><rect width="168" height="134" fill="transparent"/><path d="${fm.barn}" fill="#b0412a"/><g fill="#cfe6f2" stroke="#a9cde0" stroke-width="2">${fm.pond}</g>${fm.stacks.map(([sx, sy]) => `<circle cx="${sx}" cy="${sy}" r="11" fill="#e2b84a" stroke="#b08a2a"/>`).join('')}</g>`;
      });
      g += `<text x="354" y="294" text-anchor="end" font-size="10" fill="#2f4a2a">${tx('N ↑')}</text>`;
      $('#map6-q').innerHTML = `<p><b>${tx('Which farm is it? Click it on the map.')}</b></p><svg class="map6-svg" translate="no" viewBox="0 0 360 300" aria-hidden="true">${g}</svg>`;
      document.querySelectorAll('.map6-svg .fm6').forEach(el => el.onclick = () => {
        const i = +el.dataset.i;
        if(i !== FARM6_OK){ nope(); fb.className = 'feedback bad'; fb.textContent = tx(FARMS6[i].no); return; }
        S.f.found = true; S.map6 = null; save(); chord([523, 659, 784, 1046]);
        fb.className = 'feedback good'; fb.textContent = tx('That one! An L-shaped roof, a round pond and three round haystacks.');
        setTimeout(() => { closeModal(); applyVisuals(); give('note6');
          say(["And behind those haystacks: two pairs of feet. One pair very big, one pair very small.", ['pippi', "Thunder-Karlsson and Bloom! Hello down there!"], ['annika', "Shh, Pippi! Kling and Klang are on the road, but they can't hear us from up here. I'll write them a note."], "Annika writes a note and gives it to you."]); }, 2400);
      });
    };
    draw();
  });
}

/* ---------- puzzle: the parachute (a big, wide shape pushes lots of air aside: air resistance slows the fall) ---------- */
function openChute6(){
  const st = S.cht || (S.cht = { r: 0 });
  openModal('A note for Kling and Klang', 'They are far below, on the road', `
    <p class="flag-p">${tx("Kling and Klang can't hear you from up here. The note has to float down to them, slowly and safely.")}</p>
    <div id="chute6-q"></div>
    <div class="feedback" id="chute6-fb"></div>`, () => {
    const fb = $('#chute6-fb');
    const Q = [
      { ask: 'How do you send the note down?', opts: ['Crumple it into a ball and drop it', 'Tie it to a sandbag', "Tie it to Pippi's big handkerchief, like a parachute", 'Fold it into a paper aeroplane'], ok: 2,
        no: ['It whistles down like a pebble, misses Kling by a mile and lands in the duck pond. Annika writes a new one.', 'Never drop heavy things from a balloon! A sandbag falls very fast, and it could flatten a bicycle. Or a policeman.', '', 'Whoosh! It loops twice, sails right over Kling\'s helmet and lands on a cow.'] },
      { ask: 'Why does the handkerchief fall so slowly?', opts: ["It's big and wide, so it has to push lots of air out of the way: the air slows it down", 'Handkerchiefs are lighter than air', 'Kling is a very good catcher'], ok: 0,
        no: ['', 'Then it would float up, like the balloon! It does fall, just slowly.', "He is. But that's not why."] }
    ];
    const ask = () => {
      const q = Q[st.r];
      $('#chute6-q').innerHTML = `<p><b>${tx(q.ask)}</b></p><div class="row-btns">${q.opts.map((o, i) => `<button type="button" class="btn ghost ch6b" data-i="${i}">${tx(o)}</button>`).join('')}</div>`;
      document.querySelectorAll('.ch6b').forEach(b => b.onclick = () => {
        const i = +b.dataset.i;
        if(i !== q.ok){ nope(); fb.className = 'feedback bad'; fb.textContent = tx(q.no[i]); return; }
        chord([523, 659, 784]);
        if(st.r === 0){ st.r = 1; save(); fb.className = 'feedback good'; fb.textContent = tx('The handkerchief opens like a little umbrella, and the note floats gently down… right into Kling\'s hands.'); ask(); return; }
        S.f.dropped = true; S.cht = null; take('note6'); save(); chord([523, 659, 784, 1046]);
        fb.className = 'feedback good'; fb.textContent = tx("That's called air resistance. Parachutes are big and wide on purpose: the more air they push aside, the slower they fall.");
        setTimeout(() => { closeModal(); applyVisuals(); give('rooster');
          say([['kling', "The farm with the L-shaped barn! Klang, pedal!"], "Kling and Klang race up the farm track and dive behind the haystacks. A lot of shouting. A lot of hay.", "Out come Thunder-Karlsson and Bloom, with their hands up. And in Bloom's sack, shining in the sun: the golden weathercock!", ['bloom', "It was Karlsson's idea! I only carried it!"], ['klang', "Miss Longstocking! We'll tie it to your rope. Please put it back on the church tower: we are afraid of heights."], ['kling', "And of ladders."], "You haul up the rope. On the end, glittering: the golden weathercock!", "A puff of the burner, and the balloon drifts on towards the church on the hill. Then, all of a sudden, everything goes white."]); }, 2600);
      });
    };
    ask();
  });
}

/* ---------- puzzle: the cloud (tiny drops of water; the higher you go, the colder it gets) ---------- */
function openCloud6(){
  const st = S.cld || (S.cld = { r: 0 });
  openModal('Inside a cloud', 'Everything has gone white and wet', `
    <svg class="cloud6-svg" translate="no" viewBox="0 0 300 120" aria-hidden="true"><rect width="300" height="120" rx="8" fill="#eef3f7"/><g fill="#fff"><ellipse cx="70" cy="60" rx="70" ry="34"/><ellipse cx="200" cy="50" rx="90" ry="40"/></g>
      <g fill="#7fb8e0">${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => `<circle cx="${20 + i * 23}" cy="${30 + (i * 37) % 70}" r="2"/>`).join('')}</g></svg>
    <p class="flag-p">${tx("You can't see the town. You can't see the church. You can hardly see Pippi, and she's right next to you. Everybody's hair is dripping.")}</p>
    <div id="cloud6-q"></div>
    <div class="feedback" id="cloud6-fb"></div>`, () => {
    const fb = $('#cloud6-fb');
    const Q = [
      { ask: 'What is a cloud made of?', opts: ['Billions of tiny drops of water', 'Cotton wool', 'Smoke', "Steam from Villa Villekulla's kettle"], ok: 0,
        no: ['', 'Pippi grabs a handful. Her hand is wet and empty. No cotton wool.', "It doesn't smell of smoke. It smells of rain.", "Pippi's kettle is good, but not THAT good."] },
      { ask: "And why is it even colder up here than down in the snowy garden?", opts: ['The higher you go, the colder the air gets', 'The cloud is made of ice cream', "The sun can't reach up here"], ok: 0,
        no: ['', 'Pippi licks the cloud to check. No ice cream.', "The sun shines up here just as much. You're even a tiny bit closer to it! It's the air that gets colder, higher up."] }
    ];
    const ask = () => {
      const q = Q[st.r];
      $('#cloud6-q').innerHTML = `<p><b>${tx(q.ask)}</b></p><div class="row-btns">${q.opts.map((o, i) => `<button type="button" class="btn ghost cl6" data-i="${i}">${tx(o)}</button>`).join('')}</div>`;
      document.querySelectorAll('.cl6').forEach(b => b.onclick = () => {
        const i = +b.dataset.i;
        if(i !== q.ok){ nope(); fb.className = 'feedback bad'; fb.textContent = tx(q.no[i]); return; }
        chord([523, 659, 784]);
        if(st.r === 0){ st.r = 1; save(); fb.className = 'feedback good'; fb.textContent = tx("Water! A cloud is made of drops so tiny that they float in the air. That's why everybody is soaking wet."); ask(); return; }
        S.f.cloud = true; S.cld = null; save(); chord([523, 659, 784, 1046]);
        fb.className = 'feedback good'; fb.textContent = tx("About 6 degrees colder for every kilometre up. That's why high mountains have snow on top, even in summer.");
        setTimeout(() => { closeModal(); applyVisuals();
          say(["The balloon pops out of the top of the cloud into bright sunshine.", "And right next to the basket, close enough to touch: the church tower, with an empty spike on top where the weathercock should be.", ['pippi', "Weathercock delivery! But which way round does it go?"], ['annika', "Look at the flag on the tower. It shows which way the wind is blowing."]]); }, 2600);
      });
    };
    ask();
  });
}

/* ---------- puzzle: the weathercock (it points INTO the wind; a wind is named after where it comes from) ---------- */
const VANE6 = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
const VANE6_OK = 6;   // west: the flag streams east, so the wind comes from the west
function openVane6(){
  const st = S.vane || (S.vane = { r: 0, i: 0 });
  openModal('The golden weathercock', 'Back on top of the church tower', `
    <p class="flag-p">${tx("Pippi holds the weathercock over its spike. It can turn freely, but it has to be fitted the right way round: with its beak into the wind.")}</p>
    <svg class="vane6-svg" translate="no" viewBox="0 0 280 260" aria-hidden="true" id="vane6-svg"></svg>
    <div id="vane6-q"></div>
    <div class="feedback" id="vane6-fb"></div>`, () => {
    const fb = $('#vane6-fb');
    const draw = () => {
      let g = `<rect width="280" height="260" rx="8" fill="#cfeaf8"/><circle cx="130" cy="130" r="96" fill="#fffaf0" stroke="#c9c0ae" stroke-width="3"/>`;
      g += `<g font-size="16" font-weight="700" fill="#1f3f6a" text-anchor="middle" font-family="Fredoka, sans-serif"><text x="130" y="50">${tx('N')}</text><text x="130" y="222">${tx('S')}</text><text x="52" y="136">${tx('W')}</text><text x="208" y="136">${tx('E')}</text></g>`;
      g += `<g transform="translate(230 30)"><path d="M0 0 V50" stroke="#5a5f66" stroke-width="3"/><path class="bl-pennant" d="M0 2 l36 6 l-36 8z" fill="#2f5f9a"/><text x="18" y="66" text-anchor="middle" font-size="9" fill="#2f4a2a">${tx('the flag')}</text></g>`;
      g += `<g transform="translate(130 130) rotate(${st.i * 45})"><path d="M0 -62 q10 4 8 16 l-8 14 l-8 -14 q-2 -12 8 -16z" fill="#e8b830" stroke="#a8781a"/><path d="M-6 -60 l6 -10 l6 10" fill="#c4302b"/><path d="M0 -32 V20" stroke="#a8781a" stroke-width="6"/><path d="M0 14 l-28 44 q28 -10 56 0z" fill="#e8b830" stroke="#a8781a"/><circle r="5" fill="#5a5f66"/></g>`;
      $('#vane6-svg').innerHTML = g;
    };
    const ask = () => {
      if(st.r === 0){
        $('#vane6-q').innerHTML = `<div class="row-btns"><button type="button" class="btn ghost" id="vn6-l" aria-label="${tx('Turn left')}">⟲</button><button type="button" class="btn ghost" id="vn6-r" aria-label="${tx('Turn right')}">⟳</button><button type="button" class="btn" id="vn6-go">${tx('Fit it on')}</button></div>`;
        $('#vn6-l').onclick = () => { st.i = (st.i + 7) % 8; save(); beep(500, .03); draw(); };
        $('#vn6-r').onclick = () => { st.i = (st.i + 1) % 8; save(); beep(560, .03); draw(); };
        $('#vn6-go').onclick = () => {
          if(st.i !== VANE6_OK){ nope(); fb.className = 'feedback bad';
            fb.textContent = tx(st.i === 2 ? "That's the way the flag streams: where the wind is going. But a weathercock's big tail catches the wind and gets blown away, so its beak always points INTO the wind, towards where the wind comes from." : 'Look at the flag on the tower: it streams out to the east. So where does the wind come from?'); return; }
          st.r = 1; save(); chord([523, 659, 784]); fb.className = 'feedback good'; fb.textContent = tx("Click! The weathercock fits on its spike, with its beak pointing west, into the wind. Its big tail swings away from the wind, like a flag."); ask();
        };
        return;
      }
      const opts = ['A west wind', 'An east wind', 'A Pippi wind'];
      $('#vane6-q').innerHTML = `<p><b>${tx('The wind comes from the west. What do we call it?')}</b></p><div class="row-btns">${opts.map((o, i) => `<button type="button" class="btn ghost vq6" data-i="${i}">${tx(o)}</button>`).join('')}</div>`;
      document.querySelectorAll('.vq6').forEach(b => b.onclick = () => {
        const i = +b.dataset.i;
        if(i !== 0){ nope(); fb.className = 'feedback bad'; fb.textContent = tx(i === 1 ? 'It blows TOWARDS the east, but a wind is always named after where it comes FROM.' : 'Only when Pippi sneezes.'); return; }
        S.f.out6 = true; S.vane = null; take('rooster'); save(); chord([523, 659, 784, 1046, 1318, 1568]);
        fb.className = 'feedback good'; fb.textContent = tx('A west wind! Winds are named after where they come from, and a weathercock points straight at it.');
        setTimeout(() => { closeModal(); applyVisuals(); win6(); }, 2600);
      });
    };
    draw(); ask();
  });
}

/* ---------- intro, start and win ---------- */
function intro6(){
  say([["sys", "The garden of Villa Villekulla, on a frosty winter morning after the circus. A big circus wagon has just delivered an enormous present."],
       ["ringmaster", "Miss Longstocking! The circus would like to thank you for lifting our strongman. Here is our old balloon. It's yours!"],
       ["pippi", "A balloon! I've never flown a balloon, so I'm sure I can!"],
       ["tommy", "A balloon ride? In the middle of winter?"],
       ["ringmaster", "The best time of all! A hot-air balloon flies best on a cold day."],
       ["annika", "But Pippi, it's lying flat in the snow. How do we make it go up?"],
       ["tommy", "And where are we going?"],
       ["pippi", "To the church on the hill, of course! From up there you can see the whole world. Well, the whole town."],
       ["you", "First, we need to get this thing off the ground."]],
    () => { S.f.introDone = true; save(); });
}
function startCh6(){
  setUnlocked6();
  S = Object.assign(fresh(), { ach: S.ach || {}, ch: 6, scene: 'balloon' });
  S.started = true; sel = null;
  $('#title').hidden = true; $('#win').hidden = true;
  renderInv(); applyVisuals(); $('#timer').textContent = '00:00'; save(); intro6();
}
function win6(){
  say([["sys", "Pippi leans out of the basket and drops the golden weathercock onto its spike. It creaks round and points its beak into the wind."],
       ["sys", "Then you pull the vent rope. A little hot air escapes from the top, the balloon sinks gently down… and lands, bump, in the snow beside the church."],
       ["sys", "The whole town is there, cheering. The church bell rings all by itself. (Well, Mr Nilsson is swinging on the bell rope.)"],
       ["kling", "Thank you, Miss Longstocking. These two are going straight to the police station."],
       ["karlsson", "Next time we'll steal something that isn't on top of a church."],
       ["bloom", "Or something that isn't gold. Or maybe… we just won't steal anything at all."],
       ["ringmaster", "Magnificent! The best balloon flight in the whole history of the circus!"],
       ["sys", "And down in the harbour, a big ship has just sailed in. On deck stands a man with a very red beard and a captain's hat."],
       ["pippi", "That ship… that beard… DADDY?!"]],
    () => showWin());
}
