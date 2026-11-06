// Chapter 9: The voyage home. The Hoppetossa sails from Captain Longstocking's island back to Sweden, in legs like
// the balloon ride: the lagoon, the open sea, a storm, a far-off coast with swallows, a night of lighthouses,
// and dawn in the harbour at home.
// Loaded in order by js/boot.js; all game files share the same global scope.

const UNLOCK9 = KEY + '-ch9';
function unlocked9(){ try{ if(localStorage.getItem(UNLOCK9) === '1') return true; }catch(e){} return S.ch >= 9 || (S.ch === 8 && !!S.f.out8); }
function setUnlocked9(){ try{ localStorage.setItem(UNLOCK9, '1'); }catch(e){} }

/* ---------- Chapter 9 items ---------- */
Object.assign(ITEMS, {
  bottle9: { name:'A message in a bottle', desc:'Pippi\'s letter to Miss, rolled up in an empty lemonade bottle with a cork in it. For throwing into the sea.',
    svg:'<svg viewBox="0 0 44 44"><path d="M17 8h10v6l4 6v18a3 3 0 0 1-3 3H16a3 3 0 0 1-3-3V20l4-6z" fill="#bfe6d8" fill-opacity=".7" stroke="#5a9a8a" stroke-width="1.5"/><rect x="18" y="4" width="8" height="6" rx="1" fill="#b07f4a"/><rect x="17" y="22" width="10" height="14" rx="1" fill="#fffaf0" transform="rotate(8 22 29)"/></svg>' },
  book9: { name:'The Book of Lighthouses', desc:'Captain Longstocking\'s book. Every lighthouse on the coast has its own pattern of flashes, so sailors can tell them apart at night.',
    svg:'<svg viewBox="0 0 44 44"><rect x="8" y="8" width="28" height="30" rx="2" fill="#1f3f6a"/><rect x="10" y="10" width="24" height="26" fill="#2f5f9a"/><path d="M19 32 L21 16 H23 L25 32 Z" fill="#fffaf0"/><rect x="19" y="13" width="6" height="4" fill="#f2c94c"/></svg>' }
});

/* Where the voyage is now: the lagoon, the open sea, the storm, the calm coast, the night, then the harbour at home. */
const leg9 = () => !S.f.packed ? 'lagoon' : !S.f.bottle ? 'sea' : !S.f.reefed ? 'storm' : !S.f.swallows ? 'calm' : !S.f.light ? 'night' : 'harbour';

/* ---------- drawing the sea, the rails, the stars, the town at home and the rain ---------- */
function buildVoyage(){
  if(!$('#vy-crests')) return;
  // the crests repeat every 422px, the distance they slide in one loop of the animation, so the loop has no jump
  const crests = (y0, w, tile) => { let s = ''; for(let k = 0; k < 6; k++) for(const [dx, dy] of tile){ s += `<path d="M${k * 422 + dx - 100} ${y0 + dy} q${w / 4} -${w / 8} ${w / 2} 0 t${w / 2} 0"/>`; } return s; };
  $('#vy-crests').innerHTML = crests(490, 60, [[0, 0], [110, 94], [211, 47], [320, 141]]);
  $('#vy-front').innerHTML = crests(650, 90, [[0, 60], [100, 130], [205, 10], [300, 100]]);
  let r = ''; for(let x = 500; x <= 1180; x += 40) r += `<path d="M${x} 496 v18"/>`;
  $('#vy-rails').innerHTML = r;
  let st = ''; for(let i = 0; i < 40; i++) st += `<circle class="vy-tw${i % 3 ? ' b' : ''}" cx="${(i * 137) % 1600}" cy="${(i * 71) % 380}" r="${1.2 + (i % 3) * .5}"/>`;
  $('#vy-stars').innerHTML = st;
  let t = '';
  [[8160, 430], [8240, 412], [8330, 400], [8430, 392], [8540, 384], [8760, 372], [8860, 368], [9100, 352], [9200, 348], [9320, 344], [9440, 336], [9560, 330]].forEach(([x, y], i) => {
    const c = ['#b0412a', '#c9a04a', '#e8e0d0'][i % 3];
    t += `<rect x="${x}" y="${y}" width="44" height="30" fill="${c}"/><path d="M${x - 4} ${y + 2} L${x + 22} ${y - 18} L${x + 48} ${y + 2}z" fill="#5a3a2a"/><rect x="${x + 8}" y="${y + 10}" width="8" height="8" fill="#fffaf0"/>`;
  });
  $('#vy-town').innerHTML = t;
  let rn = ''; for(let i = 0; i < 70; i++){ const x = (i * 97) % 1700 - 50, y = (i * 53) % 900; rn += `<path class="vy-drop${i % 2 ? ' b' : ''}" d="M${x} ${y} l-12 30"/>`; }
  $('#vy-rain').innerHTML = rn;
}

function applyVoyage(){
  const show = vis;   // smooth when you can see it happen (core.js)
  const sc = $('#sc-voyage'); if(!sc) return;
  const f = S.f, leg = leg9(), docked = !!f.out9;
  ['sea', 'storm', 'calm', 'night', 'harbour'].forEach(l => sc.classList.toggle('vy-' + l, leg === l && !docked));
  sc.classList.toggle('vy-docked', docked);
  show('#vy-stormsky', leg === 'storm'); show('#vy-rain', leg === 'storm');
  show('#vy-nightsky', leg === 'night'); show('#vy-lights', leg === 'night'); show('#vy-glow', leg === 'night' || leg === 'storm');
  show('#vy-dawnsky', leg === 'harbour' && !docked);
  show('#vy-sails', !docked); show('#vy-furl', docked);
  show('#vy-swallows', leg === 'calm');
  show('#vy-buoys', leg === 'harbour' && !docked); show('#vy-ice', leg === 'harbour');
  show('#vy-welcome', docked);
  show('#vy-spunk', !f.spunkTaken);
  const at = (id, on) => show('#hit-' + id, on);
  at('isle9', leg === 'lagoon'); at('coast9', leg === 'calm'); at('light9', leg === 'night');
  at('town9', leg === 'harbour'); at('quay9', docked); at('buoys9', leg === 'harbour' && !docked); at('ice9', leg === 'harbour');
  at('birds9', leg === 'calm'); at('spunk9', !f.spunkTaken);
}

/* ---------- hotspot handlers ---------- */
const has9 = id => S.inv.includes(id);
Object.assign(H, {
  spunk9(){ S.f.spunkTaken = true; give('spunk'); applyVisuals(); say(["The spunk's jam jar, wedged between two coils of rope on the stern deck. The spunk is a good sailor.", "You take it. It doesn't seem to mind the waves."]); },
  gulls9(){ gag('#vy-gullbox', 'gag-flyup', 1400); gagText('Kee-ow!'); chord([1500, 1100, 1400], 110); },
  sky9(){
    const leg = leg9();
    if(leg === 'storm') return say(["Black clouds, a howling wind, and rain coming sideways. The Hoppetossa is leaning over a long way.", ['annika', "Can't we make the ship lean less?"]]);
    if(leg === 'night') return has9('book9') ? openLights9() : say(["A clear night. Along the coast, three lighthouses are flashing, each in its own way.", ['captain', "One of them is ours, sailor. My book of lighthouses will tell you which. It's in my sea chest."]]);
    if(leg === 'harbour') return say(S.f.out9 ? "A bright spring morning. Gulls are circling over the quay, hoping somebody has brought fish." : "Dawn. The sky turns pink, then gold, over the little town on the hill.");
    say("A big blue sky. The trade wind fills the sails and pushes the Hoppetossa north, towards home.");
  },
  sea9(){
    const leg = leg9();
    if(leg === 'sea') return has9('bottle9') ? openBottle9() : say("The open sea, blue as far as you can see. Somewhere far to the north is Sweden.");
    if(leg === 'storm') return say("Grey waves, as high as a house. Spray flies over the deck. Mr Nilsson holds on with his hands, his feet AND his tail.");
    if(leg === 'harbour') return say("The water in the harbour is calm and cold. Little bits of ice bump gently against the hull.");
    say("Waves, waves and more waves. A flying fish skips past the bow.");
  },
  isle9(){
    if(!S.f.packed) return say(["Captain Longstocking's island, getting smaller behind the ship. On the beach, the islanders are waving palm leaves.", ['pippi', "Goodbye, island! Goodbye, parrot! I'll come back when I'm queen."]]);
    say("The island is just a green dot on the horizon now.");
  },
  coast9(){ say(["A long, sandy coast far away, with a little white town. Hundreds of birds are flying over it, all heading north.", ['annika', "Everybody's going north. Like us!"]]); },
  light9(){
    if(has9('book9')) return openLights9();
    say(["Three lighthouses along the dark coast, each flashing in its own way. The captain says one of them is at the mouth of our harbour.", ['captain', "Look it up in my book of lighthouses, sailor. It's in my sea chest on deck."]]);
  },
  box9(){
    if(!S.f.bookTaken){ S.f.bookTaken = true; give('book9'); applyVisuals();
      return say(["The captain's sea chest. Inside: a spare hat, a whole cheese, and a blue book with a lighthouse on the cover: The Book of Lighthouses.", "You take the book. The cheese stays where it is. It smells very strongly of cheese."]); }
    say("The captain's sea chest. A spare hat and a very smelly cheese. Nothing else you need.");
  },
  town9(){
    S.f.ahoy9 = (S.f.ahoy9 || 0) + 1; save();
    if(S.f.ahoy9 >= 3){ S.ach.ahoy = true; save(); return say([['pippi', "AHOY, SWEDEN! WE'RE HOOOME!"], "Pippi shouts so loud that the church bell rings all by itself, and every gull in the harbour takes off at once."]); }
    say(["Your little town, on its hill: red houses, the white church, and right at the top, a yellow house that is a little crooked.", ['pippi', "Villa Villekulla! I can see the veranda from here."]]);
  },
  quay9(){
    if(S.f.out9) return startCh10();   // ashore, and home to Villa Villekulla: on to Chapter 10
    say("The quay, with its iron bollards. First you have to get the Hoppetossa safely through the buoys.");
  },
  buoys9(){ openBuoys9(); },
  ice9(){ say(["The last bits of ice, floating near the shore. It's spring, but the harbour only thawed a few weeks ago.", ['captain', "The ice comes from the river, sailor. Sea water is salty, so it has to get colder before it freezes: about two degrees below zero. The river freezes first, and the sea last."]]); },
  sails9(){
    const leg = leg9();
    if(leg === 'storm') return openStorm9();
    if(leg === 'lagoon') return say("The sails are set and waiting. But first the captain wants a word about what to pack.");
    say(S.f.out9 ? "The sails are rolled up neatly on their yards. The Hoppetossa is having a rest." : "The sails are full of wind. The Hoppetossa is flying along.");
  },
  birds9(){ openSwallows9(); },
  wheel9(){
    const leg = leg9();
    if(leg === 'lagoon') return openSeason9();
    if(leg === 'storm') return openStorm9();
    if(leg === 'harbour' && !S.f.out9) return openBuoys9();
    say("The wheel creaks as the captain steers. North, always north.");
  },
  captain9(){
    const leg = leg9();
    if(leg === 'lagoon') return openSeason9();
    if(leg === 'sea') return say([['captain', "Steady as she goes! If you've got anything to say to anybody at home, sailor, this is a good place to post it."], ['pippi', "Post it? There isn't a post box for a thousand miles."]]);
    if(leg === 'storm') return openStorm9();
    if(leg === 'calm') return say(['captain', "We have company, sailor. Look up at the yard."]);
    if(leg === 'night') return say(['captain', has9('book9') ? "Find our lighthouse in the book, sailor, and I'll steer for it." : "One of those lighthouses is ours. My book of lighthouses is in my sea chest."]);
    if(S.f.out9) return say([['captain', "Home port, Pippilotta! I'll stay a few days, and then the Hoppetossa sails back to my island."], ['pippi', "A few days is long enough for a very big party."]]);
    say(['captain', "Red buoys and green buoys. Get them on the right side, sailor, or we'll be stuck on the rocks."]);
  },
  horse9(){
    if(leg9() === 'storm'){ if(!S.ach.greenhorse){ S.ach.greenhorse = true; save(); } return say(["The horse is standing very still, with its legs wide apart. It has turned a little bit green.", ['horse', "Pfrrr…"], ['pippi', "Poor horse. When we're home, you can have your veranda all to yourself for a week."]]); }
    if(S.f.out9) return say(["The horse is looking at the quay, then at Pippi, then at the quay again.", ['pippi', "Yes, yes, we're home. I'll carry you."]]);
    say(["The horse is standing on deck, sniffing the wind. It can smell home.", ['horse', "Pfrrr!"]]);
  },
  kids9(){
    const leg = leg9();
    if(leg === 'lagoon') return say([['tommy', "It feels strange to go home. We've been away so long!"], ['annika', "Do you think it's still winter at home?"]]);
    if(leg === 'storm') return say([['annika', "I'm not scared. I'm just holding on to Tommy very tightly."], ['tommy', "Ow."]]);
    if(leg === 'night') return say(['annika', "In the dark, all the lighthouses look the same. But they flash differently. Count them!"]);
    if(S.f.out9) return say([['tommy', "Look, there's Miss! And Kling and Klang!"], ['annika', "And the luggage cart, for Pippi's sea chest."]]);
    say(['tommy', "I've stopped feeling seasick. Mostly."]);
  },
  nilsson9(){ say([['nilsson', "Eek!"], leg9() === 'storm' ? "Mr Nilsson is hanging on to the yard with everything he's got. His hat has blown away. No: there it is, on the horse." : "Mr Nilsson is hanging from the yard by his tail, watching the world go by."]); },
  pippi9(){
    const leg = leg9();
    if(leg === 'sea' && !S.f.bottle && !has9('bottle9') && !S.f.letter9){ S.f.letter9 = true; give('bottle9'); applyVisuals();
      return say([['pippi', "I've written a letter to Miss! \"Dear Miss, I'm coming home soon. Please keep some holidays for me. Love, Pippi.\""], "Pippi rolls the letter up, pushes it into an empty lemonade bottle and corks it.", ['pippi', "Now the sea can post it. You throw it, you've got the best aim."]]); }
    if(leg === 'storm') return say(['pippi', "Whee! It's like a swing, only wetter!"]);
    if(S.f.out9) return say(['pippi', "Home! I can't wait. I've never come home before. Well, I have, but never from this far away."]);
    say(['pippi', "On the island it's always summer. At home it's anything but. I like both."]);
  }
});

/* ---------- puzzle: the seasons (north and south of the Equator have opposite seasons) ---------- */
function openSeason9(){
  const st = S.ssn || (S.ssn = { r: 0 });
  openModal('What to pack?', 'The captain\'s calendar says: April', `
    <svg class="season9-svg" translate="no" viewBox="0 0 300 170" aria-hidden="true"><rect width="300" height="170" rx="8" fill="#0b1a3a"/>
      <circle cx="40" cy="85" r="26" fill="#ffe27a"/><g stroke="#ffe27a" stroke-width="3"><path d="M40 47v-10M40 123v10M14 85h-10M78 85h10M66 59l7-7M66 111l7 7"/></g>
      <g transform="translate(200 85) rotate(23)"><circle r="56" fill="#3a8ac0"/><path d="M-56 0 H56" stroke="#fff" stroke-width="1.5" stroke-dasharray="4 4"/><path d="M0 -70 V70" stroke="#c9ccd2" stroke-width="2"/>
        <path d="M-20 -48 q16 -8 30 2 q-6 10 -22 8z" fill="#5a9a4a"/><circle cx="2" cy="-44" r="4" fill="#c4302b"/>
        <path d="M-10 26 q20 -4 34 6 q-10 12 -28 8z" fill="#5a9a4a"/></g>
      <text x="232" y="24" font-size="11" fill="#fffaf0">${tx('Sweden')}</text><text x="226" y="160" font-size="11" fill="#fffaf0">${tx('far south')}</text><text x="40" y="160" text-anchor="middle" font-size="11" fill="#ffe27a">${tx('the Sun')}</text></svg>
    <div id="season9-q"></div>
    <div class="feedback" id="season9-fb"></div>`, () => {
    const fb = $('#season9-fb');
    const Q = [
      { ask: "When we sailed away, it was winter at home. Now it's April. <b>What season is it at Villa Villekulla?</b>", opts: ['Still winter', 'Spring', 'Summer', 'Autumn'], ok: 1,
        no: ["In April? The snow has had months to melt. The days at home are getting longer and longer.", '', "Not yet: summer at home starts in June. In April it's only just warming up.", "Autumn comes after summer. You've skipped a few months!"] },
      { ask: '<b>And far down south, below the Equator, what season is it there in April?</b>', opts: ['Spring too, everywhere', 'Autumn: the south has the opposite season', 'The south has no seasons'], ok: 1,
        no: ["Look at the picture: when the north leans towards the Sun, the south leans away. They can't both have spring.", '', "It does! Far south it gets cold in June and hot at Christmas."] }
    ];
    const ask = () => {
      const q = Q[st.r];
      $('#season9-q').innerHTML = `<p>${tx(q.ask)}</p><div class="row-btns">${q.opts.map((o, i) => `<button type="button" class="btn ghost ss9" data-i="${i}">${tx(o)}</button>`).join('')}</div>`;
      document.querySelectorAll('.ss9').forEach(b => b.onclick = () => {
        const i = +b.dataset.i;
        if(i !== q.ok){ nope(); fb.className = 'feedback bad'; fb.textContent = tx(q.no[i]); return; }
        chord([523, 659, 784]);
        if(st.r === 0){ st.r = 1; save(); fb.className = 'feedback good'; fb.textContent = tx("Spring! The north is starting to lean towards the Sun again: longer days, and the snow melts."); ask(); return; }
        S.f.packed = true; S.ssn = null; save(); chord([523, 659, 784, 1046]);
        fb.className = 'feedback good'; fb.textContent = tx("Autumn! The Earth leans the same way all year, so the north and the south take turns leaning towards the Sun. When it's spring at home, it's autumn far south.");
        setTimeout(() => { closeModal(); applyVisuals();
          say([['pippi', "Spring at home! Then I'll pack my mittens AND my sunhat."], ['captain', "Anchor up! Set the sails! Course: north, to Villa Villekulla!"], "The sails fill, and the island slides away behind the Hoppetossa. Soon there's nothing but sea all around.", ['annika', "How long will it take?"], ['captain', "Weeks, sailor. Plenty of time to write some letters."]]); }, 2600);
      });
    };
    ask();
  });
}

/* ---------- puzzle: the message in a bottle (ocean currents are rivers in the sea) ---------- */
const DROP9 = [
  { x: 120, y: 120, no: "From there, the current goes round and round in a big circle. Your bottle would still be going round when you're a grandmother." },
  { x: 150, y: 190, no: "That current flows west, all the way to America. Miss would never get it." },
  { x: 250, y: 205, no: "That current flows south, along the coast of Africa. Wrong way!" },
  { x: 225, y: 120, no: '' }
];
function openBottle9(){
  const st = S.btl || (S.btl = { r: 0 });
  openModal('A message in a bottle', "The captain's chart of the ocean currents", `
    <svg class="bottle9-svg" translate="no" viewBox="0 0 340 260" aria-hidden="true" id="bottle9-svg"></svg>
    <p id="bottle9-ask"></p>
    <div class="row-btns" id="bottle9-opts" hidden>${['Ocean currents: huge rivers of water that flow through the sea', 'The fish pass it along', 'It swims, if you shake it first'].map((o, i) => `<button type="button" class="btn ghost bt9" data-i="${i}">${tx(o)}</button>`).join('')}</div>
    <div class="feedback" id="bottle9-fb"></div>`, () => {
    const fb = $('#bottle9-fb');
    const arrow = (d) => `<path d="${d}" stroke="#2f5f9a" stroke-width="3" fill="none" marker-end="url(#bt9-arr)" stroke-dasharray="7 5"/>`;
    const draw = () => {
      let g = `<defs><marker id="bt9-arr" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0 L10 5 L0 10z" fill="#2f5f9a"/></marker></defs>`;
      g += `<rect width="340" height="260" rx="8" fill="#bfe3f4"/>`;
      g += `<path d="M0 0 H70 Q60 80 40 140 Q30 200 0 230 Z" fill="#c9b07a"/><text x="8" y="70" font-size="11" fill="#5a4a2a">${tx('America')}</text>`;
      g += `<path d="M270 0 H340 V90 Q310 110 290 100 Q275 70 280 40 Z" fill="#9cc86e"/><text x="288" y="30" font-size="11" font-weight="700" fill="#2f4a2a">${tx('Sweden')}</text><circle cx="300" cy="44" r="4" fill="#c4302b"/>`;
      g += `<path d="M262 150 Q300 140 340 150 V260 H250 Q240 200 262 150 Z" fill="#c9b07a"/><text x="282" y="240" font-size="11" fill="#5a4a2a">${tx('Africa')}</text>`;
      g += `<ellipse cx="135" cy="125" rx="40" ry="26" fill="none" stroke="#2f5f9a" stroke-width="3" stroke-dasharray="7 5"/>`;
      g += arrow('M170 190 Q120 196 80 186') + arrow('M258 170 Q262 200 250 236') + arrow('M215 135 Q250 90 286 56');
      g += `<g transform="translate(188 170)"><path d="M-12 6 H12 L8 12 H-8 Z" fill="#7a4022"/><path d="M0 6 V-12 L10 2 Z" fill="#fffaf0"/></g><text x="188" y="196" text-anchor="middle" font-size="10" fill="#1f3f6a">${tx('the Hoppetossa')}</text>`;
      DROP9.forEach((p, i) => { g += `<g class="dp9${st.r === 0 ? ' pick' : ''}" data-i="${i}"><circle cx="${p.x}" cy="${p.y}" r="12" fill="${st.r === 1 && i === 3 ? '#f2c94c' : '#fffaf0'}" stroke="#1f3f6a" stroke-width="2"/><text x="${p.x}" y="${p.y + 4}" text-anchor="middle" font-size="12" font-weight="700" fill="#1f3f6a">${i + 1}</text></g>`; });
      $('#bottle9-svg').innerHTML = g;
      $('#bottle9-ask').innerHTML = st.r === 0 ? tx('The blue arrows are currents: the sea is always flowing that way. <b>Where should you throw the bottle, so the sea carries it to Sweden?</b> Click a number.') : tx('<b>So what carries a bottle across the sea?</b>');
      $('#bottle9-opts').hidden = st.r !== 1;
      document.querySelectorAll('#bottle9-svg .dp9.pick').forEach(el => el.onclick = () => {
        const i = +el.dataset.i;
        if(i !== 3){ nope(); fb.className = 'feedback bad'; fb.textContent = tx(DROP9[i].no); return; }
        st.r = 1; save(); chord([523, 659, 784]); fb.className = 'feedback good'; fb.textContent = tx('Number 4! From there, the current flows north-east, all the way up to Sweden.'); draw();
      });
    };
    draw();
    document.querySelectorAll('.bt9').forEach(b => b.onclick = () => {
      const i = +b.dataset.i;
      if(i !== 0){ nope(); fb.className = 'feedback bad'; fb.textContent = tx(['', "Fish are far too busy. And they can't read the address.", "Bottles can't swim. Not even Pippi's bottles."][i]); return; }
      take('bottle9'); S.f.bottle = true; S.btl = null; save(); chord([523, 659, 784, 1046]);
      fb.className = 'feedback good'; fb.textContent = tx('Ocean currents! The sea is never still: big currents flow through it like rivers, driven by the wind and the warm and cold water. A bottle can drift thousands of kilometres.');
      setTimeout(() => { closeModal(); applyVisuals();
        say(["The Hoppetossa sails to the spot, and you throw the bottle as far as you can. Plop! It bobs away on the current.", ['pippi', "Miss will get it before we're home. Probably. Unless a whale reads it first."], "But the sky behind the ship is turning dark grey. The wind starts to howl, and the waves grow bigger and bigger.", ['captain', "A storm! All hands on deck!"]]); }, 2600);
    });
  });
}

/* ---------- puzzle: the storm (less sail in a strong wind; a reef knot holds and can be undone) ---------- */
function openStorm9(){
  const st = S.stm || (S.stm = { r: 0 });
  openModal('The storm', 'The Hoppetossa is leaning over a long way', `
    <svg class="storm9-svg" translate="no" viewBox="0 0 300 160" aria-hidden="true" id="storm9-svg"></svg>
    <div id="storm9-q"></div>
    <div class="feedback" id="storm9-fb"></div>`, () => {
    const fb = $('#storm9-fb');
    const draw = () => {
      let g = `<rect width="300" height="160" rx="8" fill="#5a6676"/><g stroke="#c9d8e8" stroke-width="2" opacity=".5"><path d="M20 10 l-8 20 M80 20 l-8 20 M150 6 l-8 20 M220 16 l-8 20 M280 8 l-8 20"/></g>`;
      if(st.r === 0){
        g += `<g transform="rotate(14 150 120)"><path d="M70 110 H230 Q220 132 200 138 H100 Q80 132 70 110 Z" fill="#7a4022"/><rect x="146" y="20" width="8" height="92" fill="#6b4423"/>`;
        g += `<path d="M110 30 H190 Q198 60 194 98 H106 Q100 60 110 30 Z" fill="#fffaf0" stroke="#d9cdb0" stroke-width="2"/><g fill="#c4302b"><circle cx="120" cy="74" r="2.5"/><circle cx="140" cy="74" r="2.5"/><circle cx="160" cy="74" r="2.5"/><circle cx="180" cy="74" r="2.5"/></g></g>`;
        g += `<text x="290" y="150" text-anchor="end" font-size="11" fill="#fffaf0">${tx('the wind →')}</text>`;
      } else {
        g += `<path d="M30 70 C80 30 110 110 150 70" stroke="#e8571f" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M270 70 C220 110 190 30 150 70" stroke="#2f5f9a" stroke-width="9" fill="none" stroke-linecap="round"/>`;
        g += `<text x="150" y="140" text-anchor="middle" font-size="12" fill="#fffaf0">${tx('Two ends of a reef point, ready to tie')}</text>`;
      }
      $('#storm9-svg').innerHTML = g;
    };
    const Q = [
      { ask: 'The wind is howling, and the ship leans over further and further. <b>What do you do with the sails?</b>', opts: ['Put up even more sail, to get out of the storm faster', 'Make the sails smaller: take in a reef', 'Pippi holds the mast straight'], ok: 1,
        no: ['More sail catches more wind: the ship leans over even further, and Annika slides across the deck into the horse.', '', "Pippi grabs the mast and pulls. The ship stays up for exactly one wave. Even Pippi can't hold back a storm."] },
      { ask: 'Roll up the bottom of each sail and tie it down with the little ropes, the reef points. <b>How do you tie a reef knot?</b>', opts: ['Right over left, then right over left again', 'Right over left, then left over right', 'Lots of knots on top of each other, just in case'], ok: 1,
        no: ['That\'s a granny knot. In a storm it slips, or it jams so tight that nobody can undo it again.', '', 'A big tangle! When the storm is over, a sailor would need a knife to get it undone. Two neat crossings are enough.'] }
    ];
    const ask = () => {
      draw();
      const q = Q[st.r];
      $('#storm9-q').innerHTML = `<p>${tx(q.ask)}</p><div class="row-btns">${q.opts.map((o, i) => `<button type="button" class="btn ghost sm9" data-i="${i}">${tx(o)}</button>`).join('')}</div>`;
      document.querySelectorAll('.sm9').forEach(b => b.onclick = () => {
        const i = +b.dataset.i;
        if(i !== q.ok){ nope(); fb.className = 'feedback bad'; fb.textContent = tx(q.no[i]); return; }
        chord([523, 659, 784]);
        if(st.r === 0){ st.r = 1; save(); fb.className = 'feedback good'; fb.textContent = tx('Less sail, less push from the wind, so the ship stands up straighter. Now tie the sails down.'); ask(); return; }
        S.f.reefed = true; S.stm = null; save(); chord([523, 659, 784, 1046]);
        fb.className = 'feedback good'; fb.textContent = tx('A reef knot! It lies flat and holds tight, and when the storm is over you can undo it with one pull.');
        setTimeout(() => { closeModal(); applyVisuals();
          say(["With smaller sails, the Hoppetossa stands up straighter and rides the waves like a duck.", "By morning the storm has blown itself out. The sea is calm, the sails are set again, and far away there's a long, sandy coast.", ['annika', "Look! Little birds, landing on the yard!"]]); }, 2600);
      });
    };
    ask();
  });
}

/* ---------- puzzle: the swallows (birds migrate north for the summer, where there are lots of insects) ---------- */
function openSwallows9(){
  const st = S.swl || (S.swl = { r: 0 });
  openModal('Swallows', 'Five tired swallows, resting on the yard', `
    <div class="side6"><svg viewBox="0 0 70 50" aria-hidden="true"><path d="M8 30 q24 -24 46 -6 l14 -6 l-8 10 l10 6 l-16 -2 q-20 14 -46 -2z" fill="#1f2a5a"/><circle cx="50" cy="26" r="3" fill="#c4302b"/><path d="M20 32 q14 6 28 0" fill="#fffaf0"/></svg>
      <p>${tx('A forked tail, a red throat and a white tummy. They flew over the sea all night.')}</p></div>
    <div id="swallow9-q"></div>
    <div class="feedback" id="swallow9-fb"></div>`, () => {
    const fb = $('#swallow9-fb');
    const Q = [
      { ask: '<b>Where are the swallows flying?</b>', opts: ['North, to spend the summer in Sweden', 'South, to Africa for the winter', "Nowhere: they're stowaways, sailing to the South Seas"], ok: 0,
        no: ['', "In April? They spent the whole winter in Africa. Now they're on their way back.", "They're only resting their wings. In a minute they'll fly on, faster than the Hoppetossa."] },
      { ask: '<b>Why do they fly such a long way?</b>', opts: ['Because it gets too hot in Africa', 'In the northern summer there are lots of insects to eat, and long days to feed their chicks', 'To see Pippi'], ok: 1,
        no: ["Heat isn't the problem: swallows love warm weather. It's all about food.", '', "Pippi would like that to be true. But they'd fly north even without her."] }
    ];
    const ask = () => {
      const q = Q[st.r];
      $('#swallow9-q').innerHTML = `<p>${tx(q.ask)}</p><div class="row-btns">${q.opts.map((o, i) => `<button type="button" class="btn ghost sw9" data-i="${i}">${tx(o)}</button>`).join('')}</div>`;
      document.querySelectorAll('.sw9').forEach(b => b.onclick = () => {
        const i = +b.dataset.i;
        if(i !== q.ok){ nope(); fb.className = 'feedback bad'; fb.textContent = tx(q.no[i]); return; }
        chord([523, 659, 784]);
        if(st.r === 0){ st.r = 1; save(); fb.className = 'feedback good'; fb.textContent = tx('North! Every spring, swallows fly thousands of kilometres from Africa to Europe, and every autumn they fly back.'); ask(); return; }
        S.f.swallows = true; S.swl = null; save(); chord([523, 659, 784, 1046]);
        fb.className = 'feedback good'; fb.textContent = tx('Insects! In the northern summer the air is full of flies and midges, and the days are long. In the winter there are none, so the swallows fly south.');
        setTimeout(() => { closeModal(); applyVisuals();
          say(["The swallows shake their feathers, twitter, and fly off north, much faster than the Hoppetossa.", ['annika', "Maybe they'll build a nest under the roof of Villa Villekulla!"], "Days go by. Then one evening the sun sets, and lights start to flash along a dark coast.", ['captain', "Lighthouses, sailor! One of them marks the way into our harbour."]]); }, 2600);
      });
    };
    ask();
  });
}

/* ---------- puzzle: the lighthouses (each has its own pattern of flashes, so sailors know which it is) ---------- */
const LIGHTS9 = [{ k: 'A', on: [0, 2, 6, 8, 12, 14, 18, 20, 24, 26] }, { k: 'B', on: [0, 5, 10, 15, 20, 25] }, { k: 'C', on: [0, 2, 10, 12, 20, 22] }];
const LIGHT9_OK = 2;
function openLights9(){
  const st = S.lts || (S.lts = { r: 0 });
  const strip = on => `<svg class="strip9" viewBox="0 0 302 18" aria-hidden="true">${Array.from({ length: 30 }, (_, s) => `<rect x="${1 + s * 10}" y="2" width="9" height="14" rx="2" fill="${on.includes(s) ? '#ffe27a' : '#1f2a4a'}"/>`).join('')}</svg>`;
  openModal('The Book of Lighthouses', 'Each square is one second. Yellow: the light flashes', `
    <p class="flag-p">${tx('The book says: <b>Our harbour: two flashes, then dark, every 10 seconds.</b> Gull Rock: one flash every 5 seconds. Seal Point: two flashes every 6 seconds.')}</p>
    <div class="lights9">${LIGHTS9.map((l, i) => `<button type="button" class="btn ghost lt9" data-i="${i}"><b>${l.k}</b>${strip(l.on)}</button>`).join('')}</div>
    <div id="lights9-q"></div>
    <div class="feedback" id="lights9-fb"></div>`, () => {
    const fb = $('#lights9-fb');
    const ask = () => {
      $('#lights9-q').innerHTML = st.r === 0 ? `<p>${tx('You watch the three lighthouses for 30 seconds. <b>Which one is ours?</b> Click A, B or C.')}</p>`
        : `<p><b>${tx('Why does every lighthouse flash differently?')}</b></p><div class="row-btns">${['So that sailors know which lighthouse it is, even in the dark', 'To save oil', 'Lighthouse keepers like to dance'].map((o, i) => `<button type="button" class="btn ghost lq9" data-i="${i}">${tx(o)}</button>`).join('')}</div>`;
      document.querySelectorAll('.lq9').forEach(b => b.onclick = () => {
        const i = +b.dataset.i;
        if(i !== 0){ nope(); fb.className = 'feedback bad'; fb.textContent = tx(['', "A dark lighthouse saves oil, but then nobody would see it. That's not why.", "They might. But the flashing is for the sailors."][i]); return; }
        S.f.light = true; S.lts = null; save(); chord([523, 659, 784, 1046]);
        fb.className = 'feedback good'; fb.textContent = tx("Exactly. Every lighthouse has its own pattern, written down in the sailors' books. Count the flashes and the dark, and you know where you are.");
        setTimeout(() => { closeModal(); applyVisuals();
          say([['captain', "Lighthouse C it is! Steer for the two flashes, sailor."], "All night the Hoppetossa sails towards the flashing light. And when the sun comes up, there it is: the little harbour, the little town on its hill, and right at the top, a yellow house.", ['pippi', "VILLA VILLEKULLA!"], ['captain', "Careful now. Into the harbour between the buoys, and not on the rocks."]]); }, 2800);
      });
    };
    document.querySelectorAll('.lt9').forEach(b => b.onclick = () => {
      if(st.r !== 0) return;
      const i = +b.dataset.i;
      if(i !== LIGHT9_OK){ nope(); fb.className = 'feedback bad'; fb.textContent = tx(i === 0 ? 'Two flashes, yes. But count the dark: they come every 6 seconds. That\'s Seal Point.' : 'One flash every 5 seconds: that\'s Gull Rock. Ours flashes twice.'); return; }
      st.r = 1; save(); chord([523, 659, 784]); fb.className = 'feedback good'; fb.textContent = tx('C! Two flashes, then dark, and again after 10 seconds. That\'s our harbour.'); ask();
    });
    ask();
  });
}

/* ---------- puzzle: the buoys (coming into harbour in Europe: red buoys on your left, green on your right) ---------- */
function openBuoys9(){
  const st = S.byo || (S.byo = { r: 0 });
  openModal('Into the harbour', 'Red and green buoys mark the safe way in', `
    <svg class="buoys9-svg" translate="no" viewBox="0 0 300 260" aria-hidden="true" id="buoys9-svg"></svg>
    <div id="buoys9-q"></div>
    <div class="feedback" id="buoys9-fb"></div>`, () => {
    const fb = $('#buoys9-fb');
    const gates = [[150, 205], [120, 140], [170, 75]];
    const routes = [
      { k: 'A', d: 'M220 250 Q232 205 210 140 Q206 100 230 40', c: '#7a5a9a' },
      { k: 'B', d: 'M150 250 Q150 205 120 140 Q120 100 170 40', c: '#e8571f' },
      { k: 'C', d: 'M90 250 Q84 205 70 140 Q66 100 110 40', c: '#2f8a6a' }
    ];
    const draw = () => {
      let g = `<rect width="300" height="260" rx="8" fill="#3a8ac0"/><path d="M0 0 H300 V30 H0 Z" fill="#8a8f96"/><text x="150" y="20" text-anchor="middle" font-size="11" fill="#fffaf0">${tx('the quay')}</text>`;
      g += `<g fill="#6b5a4a"><circle cx="240" cy="110" r="10"/><circle cx="252" cy="180" r="12"/><circle cx="40" cy="190" r="11"/><circle cx="30" cy="110" r="9"/><circle cx="60" cy="60" r="8"/></g>`;
      gates.forEach(([x, y]) => { g += `<circle cx="${x - 34}" cy="${y}" r="8" fill="#c4302b" stroke="#fff" stroke-width="2"/><circle cx="${x + 34}" cy="${y}" r="8" fill="#3f8a4a" stroke="#fff" stroke-width="2"/>`; });
      if(st.r === 1) routes.forEach(r => { g += `<path d="${r.d}" stroke="${r.c}" stroke-width="4" fill="none" stroke-dasharray="8 5"/><text x="${parseInt(r.d.slice(1))}" y="246" text-anchor="middle" font-size="13" font-weight="700" fill="#fffaf0">${r.k}</text>`; });
      g += `<text x="296" y="252" text-anchor="end" font-size="10" fill="#fffaf0">${tx('↑ coming in from the sea')}</text>`;
      $('#buoys9-svg').innerHTML = g;
    };
    const ask = () => {
      draw();
      $('#buoys9-q').innerHTML = st.r === 0
        ? `<p>${tx('<b>Sailing INTO the harbour, which side do you keep the red buoys on?</b>')}</p><div class="row-btns">${['On your left (port), like the red lamp on the left side of a ship', 'On your right (starboard)', "Either side, as long as you're quick"].map((o, i) => `<button type="button" class="btn ghost by9" data-i="${i}">${tx(o)}</button>`).join('')}</div>`
        : `<p>${tx('<b>Which way in is safe?</b>')}</p><div class="row-btns">${routes.map((r, i) => `<button type="button" class="btn ghost by9" data-i="${i}">${tx('Route {k}', { k: r.k })}</button>`).join('')}</div>`;
      document.querySelectorAll('.by9').forEach(b => b.onclick = () => {
        const i = +b.dataset.i;
        if(st.r === 0){
          if(i !== 0){ nope(); fb.className = 'feedback bad'; fb.textContent = tx(i === 1 ? "Then you'd be outside the channel, on the rocks. Think of a ship's lamps: red on the left." : "Quick or slow, the rocks don't care. The buoys show where the deep water is."); return; }
          st.r = 1; save(); chord([523, 659, 784]); fb.className = 'feedback good'; fb.textContent = tx('Red on the left, green on the right, coming in from the sea. Between them, the water is deep enough.'); ask(); return;
        }
        if(i !== 1){ nope(); fb.className = 'feedback bad'; fb.textContent = tx(i === 0 ? 'Route A goes to the right of the green buoys: straight onto the rocks!' : 'Route C goes to the left of the red buoys: straight onto the rocks!'); return; }
        S.f.out9 = true; S.byo = null; save(); applyVisuals(); chord([523, 659, 784, 1046]);
        fb.className = 'feedback good'; fb.textContent = tx('Route B: every red buoy on your left, every green buoy on your right. Safely in!');
        setTimeout(() => { closeModal(); win9(); }, 2400);
      });
    };
    ask();
  });
}

/* ---------- intro, start and win ---------- */
function intro9(){
  say([["sys", "The morning after the feast. The Hoppetossa is ready to sail, and the whole island has come down to the beach to wave goodbye."],
       ["captain", "Pippilotta! I'll sail you home to Villa Villekulla. But first: have you packed the right clothes?"],
       ["pippi", "I've packed my sunhat, my bucket and spade, and eighteen kilos of coconuts."],
       ["annika", "But it was winter when we left home. Will it still be winter?"],
       ["captain", "Ask my calendar, sailor. It's by the wheel."],
       ["you", "What season will it be at home? Let's ask the captain."]],
    () => { S.f.introDone = true; save(); });
}
function startCh9(){
  setUnlocked9();
  S = Object.assign(fresh(), { ach: S.ach || {}, ch: 9, scene: 'voyage' });
  S.started = true; sel = null;
  $('#title').hidden = true; $('#win').hidden = true;
  renderInv(); applyVisuals(); $('#timer').textContent = '00:00'; save(); intro9();
}
function win9(){
  say([["sys", "Red buoy on the left, green buoy on the right. The Hoppetossa glides into the harbour and comes to rest against the quay, as gently as a sleeping cat."],
       ["sys", "The whole town is there. Miss is waving her umbrella, and Kling and Klang are standing to attention."],
       ["teacher", "Pippi! I got your letter! It came in a bottle, washed up on the beach last Tuesday."],
       ["pippi", "Then the sea is faster than the post!"],
       ["kling", "Welcome home, Miss Longstocking. A reminder: horses must be carried, not ridden, along the quay."],
       ["sys", "Pippi lifts the horse over her head and carries it down the gangway. It won't put a hoof on the wet stones."],
       ["pippi", "Home to Villa Villekulla! The horse wants its veranda."]],
    () => showWin());
}
