// Chapter 5: on board the Hoppetossa. Captain Longstocking sails Pippi, Tommy, Annika and you to his island.
// The voyage goes in legs: the quay, open sea by day, the Equator at night, and the island at dawn.
// Loaded in order by js/boot.js; all game files share the same global scope.

const UNLOCK5 = KEY + '-ch5';
function unlocked5(){ try{ if(localStorage.getItem(UNLOCK5) === '1') return true; }catch(e){} return S.ch >= 5 || (S.ch === 4 && !!S.f.out4); }
function setUnlocked5(){ try{ localStorage.setItem(UNLOCK5, '1'); }catch(e){} }

/* ---------- Chapter 5 items ---------- */
Object.assign(ITEMS, {
  net: { name:'Fishing net', desc:'A fishing net from the hold. Good for fishing things out of the sea, and for catching monkeys.',
    svg:'<svg viewBox="0 0 44 44"><path d="M22 4 V10" stroke="#6b4423" stroke-width="3"/><path d="M8 10 L36 10 L31 36 L13 36 Z" fill="none" stroke="#c9a46a" stroke-width="2.5"/><path d="M15 10 L18 36 M22 10 V36 M29 10 L26 36 M9 19 H35 M11 28 H33" stroke="#c9a46a" stroke-width="1.5" fill="none"/></svg>' },
  sextant: { name:'Sextant', desc:'The captain\'s brass sextant. It measures how high a star stands above the horizon. Select it, then click the sky.',
    svg:'<svg viewBox="0 0 44 44"><path d="M22 6 L8 34 A16 16 0 0 0 36 34 Z" fill="none" stroke="#c9952a" stroke-width="3"/><path d="M22 6 L30 36" stroke="#7a5a1a" stroke-width="2.5"/><rect x="11" y="16" width="9" height="5" rx="1" fill="#9aa0a6"/><circle cx="22" cy="6" r="3" fill="#c9952a"/></svg>' },
  spyglass: { name:'Spyglass', desc:'The captain\'s brass spyglass. It makes far-away things look near. Select it, then click something far away.',
    svg:'<svg viewBox="0 0 44 44"><g transform="rotate(-30 22 22)"><rect x="4" y="18" width="12" height="8" rx="2" fill="#7a5a1a"/><rect x="15" y="16" width="13" height="12" rx="2" fill="#c9952a"/><rect x="27" y="14" width="13" height="16" rx="3" fill="#f3d27a" stroke="#b07f1f"/></g></svg>' }
});

/* ---------- drawing the ship ---------- */
function buildShip(){
  let st = '';
  for(let i = 0; i < 46; i++){ const x = (i * 137) % 1600, y = 20 + (i * 53) % 400, r = 1 + (i % 3) * .6;
    st += `<circle class="hp-tw" style="animation-delay:-${(i * .37 % 3).toFixed(2)}s" cx="${x}" cy="${y}" r="${r}" fill="#fff"/>`; }
  $('#hp-stars').innerHTML = st;
  // wave crests: two strips, each twice as wide as the stage so they can roll past
  const strip = (y, a, w) => { let d = `M-400 ${y}`; for(let x = -400; x < 2000; x += w) d += ` q${w / 4} ${-a} ${w / 2} 0 q${w / 4} ${a} ${w / 2} 0`; return `<path d="${d}"/>`; };
  $('#hp-waves').innerHTML = strip(560, 4, 90) + strip(580, 5, 120);
  $('#hp-wavefront').innerHTML = strip(600, 7, 100);
  let rl = '<path d="M186 298 H486 M486 380 H1340 Q1420 374 1484 338"/>';
  for(let x = 196; x <= 476; x += 24) rl += `<path d="M${x} 298 V324"/>`;
  for(let x = 500; x <= 1330; x += 30) rl += `<path d="M${x} 380 V404"/>`;
  $('#hp-rails').innerHTML = rl;
  let rt = '';
  for(let y = 170; y <= 390; y += 22){ const k = (y - 150) / 252; rt += `<path d="M${(760 - 48 * k).toFixed(0)} ${y} H${(760 + 48 * k).toFixed(0)}"/>`; }
  $('#hp-ratlines').innerHTML = rt;
}
/* The time of day follows the voyage: day until the water is made, night until the Equator, then dawn and the island. */
function applyShip(){
  const show = (sel, on) => { const el = $(sel); if(el) el.style.display = on ? '' : 'none'; };
  const sc = $('#sc-ship'); if(!sc) return;
  const night = !!S.f.water && !S.f.equator, dawn = !!S.f.equator && !S.f.out5, day = !night && !dawn;
  sc.classList.toggle('sailing', !!S.f.course);
  sc.classList.toggle('night', night);
  show('#hp-day', day); show('#hp-sun', day); show('#hp-clouds', day);
  show('#hp-night', night); show('#hp-stars', night); show('#hp-moon', night); show('#hp-dark', night); show('#hp-glow', night);
  show('#hp-dusk', dawn); show('#hp-dawnsun', dawn);
  show('#hp-harbour', !S.f.course); show('#hit-quay5', !S.f.course); show('#hp-seafar', !!S.f.course);
  show('#hp-isletip', dawn); show('#hp-isle', !!S.f.out5);
  show('#hp-qhorse', !S.f.aboard); show('#hit-horse5q', !S.f.aboard);
  show('#hp-dhorse', !!S.f.aboard); show('#hit-horse5d', !!S.f.aboard);
  show('#hp-ropelong', !S.f.aboard); show('#hp-ropeshort', !!S.f.aboard);
  show('#hp-furl', !S.f.course); show('#hp-sails', !!S.f.course); show('#hp-spray', !!S.f.course);
  show('#hp-zero', !!S.f.equator);
  show('#hp-splash', !!S.f.course && !S.f.floats);
  show('#hp-stills', !!S.f.water);
  show('#hp-spunk', !S.f.spunkTaken); show('#hit-spunk5', !S.f.spunkTaken);
  show('#hp-net', !S.f.netTaken); show('#hit-net5', !S.f.netTaken);
  show('#hp-sext', !S.f.sextTaken);
  show('#hp-glass', !S.f.glassTaken); show('#hit-glass5', !S.f.glassTaken);
}
/* Casting off: the sails drop, and the quay slides away behind the ship. */
function castOff5(){
  const sc = $('#sc-ship');
  sc.classList.add('castoff');
  setTimeout(() => { sc.classList.remove('castoff'); applyVisuals(); }, reducedMotion() ? 0 : 3200);
}

/* ---------- hotspot handlers ---------- */
const has5 = id => S.inv.includes(id);
Object.assign(H, {
  spunk5(){ S.f.spunkTaken = true; give('spunk'); applyVisuals(); say(["The spunk's jam jar, on the captain's chart table. Pippi has brought it along: \"It has never been to sea.\"", "You take it. A spunk knows things. Even about ships."]); },
  quay5(){ say(["The harbour town on its hill. Right at the top, a little crooked, stands Villa Villekulla.", "The whole town has come down to the quay to wave goodbye. Well, three people and a dog."]); },
  horse5(){
    if(!S.f.aboard) return say(["Pippi's horse, on the quay, with a rope sling round its middle. It looks at the ship. It looks at you.", ['horse', "Pfrrrr?"], "Pippi won't sail without it. The cargo hoist on the stern could lift it aboard."]);
    if(S.f.floats && !S.f.water) return say([['horse', "Hrrrm."], "The horse's tongue is hanging out. It drank the whole water barrel, and it's still thirsty. So is everybody else."]);
    say([['horse', "Neeeigh!"], S.f.course ? "The horse stands on deck with its legs wide apart, like a real sailor." : "The horse is on board, sniffing the hay in the hold."]);
  },
  hoist(){ if(S.f.aboard) return say("The cargo hoist. Its pulleys have done their job: the horse is on board."); openHoist(); },
  mast5(){ say(S.f.course ? ["The sails are full of wind. The Hoppetossa leans a little and hurries along.", "High above, the crow's nest sways against the sky."] : ["The sails are rolled up tight on the yards. They come down when the ship sets off.", "First the horse, then a course. The captain is very firm about that."]); },
  crow(){
    if(S.f.out5) return say("The crow's nest. From up here the island is all palm trees, white sand and waving people.");
    if(!S.f.equator) return say(S.f.course ? ["You climb the rope ladder to the crow's nest. Sea, sea, and more sea, all the way round.", "Mr Nilsson waves at you from the yard. He climbed up faster."] : ["You climb to the crow's nest. You can see the whole town from here, and Villa Villekulla on its hill.", "The sea is waiting. The captain is waiting. The horse is waiting most of all."]);
    if(!has5('spyglass')) return say(["You climb to the crow's nest. It's dawn. Far away, on the horizon, is there a tiny bump? You can't be sure.", "To see that far you'd need the captain's spyglass."]);
    openLandHo();
  },
  glass5(){ S.f.glassTaken = true; give('spyglass'); applyVisuals(); say(["The captain's spyglass, hanging on the mizzen mast by the wheel.", ['captain', "Take it, sailor! A spyglass belongs to whoever is first to shout LAND HO."]]); },
  wheel(){
    if(S.f.course) return say(["The ship's wheel and the compass. The needle points north, and the ship's nose points south-west. Steady as she goes.", ['captain', "Don't touch, sailor. She's on course."]]);
    if(!S.f.aboard) return say([['captain', "Not so fast, sailor! We don't leave without the horse."], ['pippi', "We don't leave without the horse!"]]);
    openWheel();
  },
  captain5(){
    if(S.f.out5) return say([['captain', "My island! And my people waving! Pippilotta, you're a princess now. A princess who climbs masts."]]);
    if(!S.f.aboard) return say([['captain', "Ahoy, sailor! Everything aboard except the horse. Use the hoist on the stern. No lifting it by hand, Pippilotta!"], ['pippi', "Spoilsport!"]]);
    if(!S.f.course) return say([['captain', "Now set a course for my island. My chart is in the cabin, and the wheel is right here. The compass will tell you which way you're pointing."]]);
    if(!S.f.floats) return say([['captain', "That monkey has thrown half my cabin overboard! What floats, we fish out with the net. What sinks, Pippi fetches."]]);
    if(!S.f.water) return say([['captain', "The horse has drunk all the drinking water. And sea water is no good: far too salty. But the sun is hot, and the sun can help."]]);
    if(!S.f.equator) return say([['captain', "Tonight we should cross the Equator. Where are we, sailor? The stars will tell you, with my sextant."]]);
    say([['captain', "Dawn! My island must be close now. Up to the crow's nest with my spyglass, and keep your eyes open!"]]);
  },
  nilsson5(){
    S.f.nilTaps5 = (S.f.nilTaps5 || 0) + 1; save();
    say(S.f.floats ? [['nilsson', "Eek!"], "Mr Nilsson hangs by his tail from the yard, looking very innocent. He has nothing left to throw."]
      : S.f.course ? [['nilsson', "Eek! Eek!"], "Mr Nilsson swings from the yard by his tail. Every few minutes something splashes into the sea."]
      : [['nilsson', "Eek!"], "Mr Nilsson has climbed into the rigging. He loves ships: so many things to throw."]);
  },
  ta5(){
    if(S.f.out5) return say([['tommy', "An island with real palm trees!"], ['annika', "And real coconuts. I hope they fall down slowly."]]);
    if(!S.f.course) return say([['annika', "I've never been on a real ship. What if I get seasick?"], ['tommy', "What if the horse gets seasick?"]]);
    if(S.f.water && !S.f.equator) return say([['annika', "Look at all the stars! The North Star is so low tonight. At home it's high up in the sky."], ['tommy', "Maybe it's tired."]]);
    say([['tommy', "I'm a sailor now!"], ['annika', "We're both sailors. I've written it in my diary."]]);
  },
  pippi5(){
    if(S.f.equator && !S.f.out5){ S.ach.neptune = true; save();
      return say(['pippi', "I'm King Neptune, the king of the sea! Everybody who crosses the Equator for the first time gets a bucket of water over their head. Ready?"]); }
    say(['pippi', S.f.out5 ? "Daddy's island! I'm going to be a princess. A thing-searching princess." : S.f.course ? "I'm the figurehead! Look, no hands!" : "I've never sailed to the South Seas, so I'm sure I'll be very good at it."]);
  },
  log5(){ openLog5(); },
  case5(){
    if(S.f.sextTaken) return say("The instrument box. Empty, apart from a pair of dividers and a very old biscuit.");
    S.f.sextTaken = true; give('sextant'); applyVisuals();
    say(["The captain's instrument box. Inside, on red velvet: a brass sextant.", "A note in the lid says: \"For measuring how high a star is above the horizon. Only works at night. Obviously.\""]);
  },
  chart5(){ openChart5(); },
  stove5(){ say(S.f.water ? "The galley stove. A pot of fish soup is bubbling. Pippi made it. There's a whole fish in it, and a sock." : ["The galley stove, with a pot of soup bubbling away.", "Soup needs fresh water too. Everything on a ship needs fresh water."]); },
  barrel(){
    if(S.f.water) return say("The water barrel, filling up again, cupful by cupful, from the bowls in the sun.");
    if(!S.f.floats) return say(["The drinking-water barrel, full to the top.", "On a ship, fresh water is precious. There's water all around you, but the sea is far too salty to drink."]);
    openStill();
  },
  crates5(){ say(["Crates of supplies. Two of them are labelled 18 kg.", "Pippi says that's sweets for the voyage. Eighteen kilos each. \"In case we're becalmed.\""]); },
  net5(){ S.f.netTaken = true; give('net'); applyVisuals(); say("A fishing net, hanging on a hook in the hold. You take it. It might come in handy at sea."); },
  hold5(){ say(["The lower hold: barrels of salted fish, and a pile of heavy stones.", "The stones are ballast. They sit low down in the ship so she doesn't tip over in the wind."]); },
  sky5(){
    if(S.f.water && !S.f.equator){
      if(has5('sextant')) return openSextant5();
      return say(["The sky is full of stars. The North Star hangs very low, just above the sea.", "The captain measures stars with his sextant. It's in the instrument box in his cabin."]);
    }
    if(S.f.equator && !S.f.out5) return say("Dawn. The sky turns pink, then orange, then gold. Somewhere ahead is an island.");
    say(S.f.course ? "Blue sky, white clouds, and the sun getting hotter every day as you sail south." : "Seagulls circle over the harbour, hoping somebody drops a sandwich.");
  },
  sea5(){
    if(!S.f.course) return say("Harbour water, green and calm. A seagull floats on it, looking bored.");
    if(!S.f.floats){
      if(has5('net')) return openFloat();
      return say(["Splash! Mr Nilsson has thrown the captain's things overboard. Some are bobbing on the waves; some have gone straight down.", "You'll need something to fish them out with."]);
    }
    say(S.f.out5 ? "The water around the island is so clear you can see the fish nibbling your shadow." : "Fish swim alongside the ship. A dolphin jumps, now and then, just to show off.");
  }
});

/* ---------- puzzle: the cargo hoist (pulleys: more ropes, less pulling) ---------- */
const HORSE_KG = 400, PULL_KG = 100;
function openHoist(){
  const st = S.pul || (S.pul = { n: 1 });
  openModal('The cargo hoist', 'Pulleys and rope, on the stern', `
    <svg class="hp-tackle" viewBox="0 0 300 240" aria-hidden="true" id="hp-tackle"></svg>
    <p class="flag-p">${tx('The horse weighs 400 kg. You, Tommy and Annika can pull 100 kg together. The more ropes hold the horse up, the less each rope has to carry.')}</p>
    <div class="row-btns">${[1, 2, 3, 4].map(n => `<button type="button" class="btn ghost hp-ropes" data-n="${n}">${tx(n === 1 ? '1 rope' : '{n} ropes', { n })}</button>`).join('')}</div>
    <div class="row-btns"><button type="button" class="btn" id="hp-heave">${tx('Heave!')}</button></div>
    <div class="feedback" id="hp-hfb"></div>`, () => {
    const fb = $('#hp-hfb');
    const draw = () => {
      const n = st.n, each = Math.round(HORSE_KG / n), xs = Array.from({ length: n }, (_, i) => 150 - (n - 1) * 14 + i * 28);
      let s = '<rect width="300" height="240" fill="#cfe7fb"/><rect x="40" y="10" width="220" height="12" rx="4" fill="#6b3a1a"/>';
      s += `<rect x="${xs[0] - 14}" y="22" width="${(n - 1) * 28 + 28}" height="18" rx="6" fill="#9aa0a6"/>`;
      xs.forEach(x => s += `<path d="M${x} 40 V140" stroke="#c9a46a" stroke-width="3"/>`);
      s += `<path d="M${xs[n - 1] + 14} 31 Q${xs[n - 1] + 60} 60 ${xs[n - 1] + 70} 190" stroke="#c9a46a" stroke-width="3" fill="none"/><circle cx="${xs[n - 1] + 70}" cy="196" r="7" fill="#f3c9a4"/>`;
      s += `<rect x="${xs[0] - 14}" y="138" width="${(n - 1) * 28 + 28}" height="14" rx="5" fill="#9aa0a6"/><use href="#hpHorseShape" transform="translate(${90} 150) scale(.6)"/>`;
      s += `<text x="150" y="230" text-anchor="middle" font-size="14" font-weight="600" font-family="IBM Plex Mono, monospace" fill="#1f3f6a">${tx('Each rope: {kg} kg', { kg: each })}</text>`;
      $('#hp-tackle').innerHTML = s;
      document.querySelectorAll('.hp-ropes').forEach(b => b.classList.toggle('on', +b.dataset.n === n));
    };
    draw();
    document.querySelectorAll('.hp-ropes').forEach(b => b.onclick = () => { st.n = +b.dataset.n; save(); draw(); beep(300 + st.n * 80, .05); fb.className = 'feedback'; fb.textContent = ''; });
    $('#hp-heave').onclick = () => {
      const each = HORSE_KG / st.n;
      if(each <= PULL_KG){
        S.f.aboard = true; save(); applyVisuals(); chord([523,659,784,1046]);
        fb.className = 'feedback good'; fb.textContent = tx('Four ropes share the 400 kg: 100 kg each. Up goes the horse! You had to pull four metres of rope for every metre it rose, but you could do it.');
        setTimeout(() => { closeModal(); say(["The horse rises gently into the air, swings over the rail, and lands on deck with four clonks.", ['horse', "Neeeigh!"], ['captain', "Well hoisted, sailor! Now: a course for my island. My chart is in the cabin."]]); }, 1900);
        return;
      }
      nope(); fb.className = 'feedback bad';
      fb.textContent = tx(st.n === 1 ? 'You pull with all your might. With one rope you are lifting all 400 kg. The horse doesn\'t even notice.'
        : st.n === 2 ? 'Two ropes: 200 kg each. The horse\'s front hooves lift off… and land again with a clonk. More ropes!'
        : 'Three ropes: about 133 kg each. So close! The horse dangles half a centimetre above the quay. One more rope!');
    };
  });
}

/* ---------- puzzle: the course (the compass: north is always north; in between are NE, SE, SW, NW) ---------- */
const HEADINGS5 = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
const HEADING5_NAME = { N:'north', NE:'north-east', E:'east', SE:'south-east', S:'south', SW:'south-west', W:'west', NW:'north-west' };
const COURSE5 = 'SW';
function compassRose5(rot){
  let s = `<g transform="rotate(${rot} 110 110)"><circle cx="110" cy="110" r="96" fill="#fffaf0" stroke="#c9952a" stroke-width="6"/>`;
  HEADINGS5.forEach((h, i) => { const a = i * 45, big = i % 2 === 0;
    s += `<g transform="rotate(${a} 110 110)"><path d="M110 ${big ? 26 : 42} L${big ? 118 : 115} 110 L110 104 L${big ? 102 : 105} 110 Z" fill="${i === 0 ? '#c4302b' : big ? '#1f3f6a' : '#7a8aa6'}"/><text x="110" y="${big ? 22 : 38}" text-anchor="middle" font-size="${big ? 15 : 11}" font-weight="700" fill="#1f3f6a" font-family="Fredoka, sans-serif">${tx(h)}</text></g>`; });
  return s + '</g>';
}
function openWheel(){
  const st = S.hd || (S.hd = { i: 0 });
  openModal("The ship's wheel", 'Turn the ship until she points the right way', `
    <svg class="hp-compass" viewBox="0 -16 220 240" aria-hidden="true" id="hp-compass"></svg>
    <div class="hp-heading" id="hp-heading"></div>
    <div class="row-btns"><button type="button" class="btn ghost" id="hp-port">↺ ${tx('Turn to port (left)')}</button><button type="button" class="btn ghost" id="hp-star">${tx('Turn to starboard (right)')} ↻</button></div>
    <div class="row-btns"><button type="button" class="btn" id="hp-setsail">${tx('Set sail!')}</button></div>
    <div class="feedback" id="hp-wfb">${tx('The compass card always points north, whichever way the ship turns. The little ship in the middle shows where her nose is pointing.')}</div>`, () => {
    const fb = $('#hp-wfb');
    const draw = () => {
      const h = HEADINGS5[st.i];
      $('#hp-compass').innerHTML = `<rect y="-16" width="220" height="240" fill="#1c2340" rx="8"/>${compassRose5(-st.i * 45)}<path d="M110 40 L122 120 L110 150 L98 120 Z" fill="#8a5028" stroke="#3e200c" stroke-width="2" opacity=".9"/><path d="M110 6 l-8 -14 h16z" fill="#f2c94c"/>`;
      $('#hp-heading').innerHTML = `${tx('The ship points:')} <b>${tx(HEADING5_NAME[h])}</b>`;
    };
    draw();
    $('#hp-port').onclick = () => { st.i = (st.i + 7) % 8; save(); beep(420, .05); draw(); };
    $('#hp-star').onclick = () => { st.i = (st.i + 1) % 8; save(); beep(520, .05); draw(); };
    $('#hp-setsail').onclick = () => {
      const h = HEADINGS5[st.i];
      if(h === COURSE5){
        S.f.course = true; save(); chord([392,523,659,784,1046]);
        fb.className = 'feedback good'; fb.textContent = tx('South-west! Down and to the left on the chart. "Drop the sails!" roars the captain.');
        setTimeout(() => { closeModal(); castOff5(); say(["The sails tumble down from the yards and fill with wind with a great WHUMP. The ropes creak, the quay slides away, and the Hoppetossa is off!", ['captain', "South-west it is! Steady as she goes!"], ['pippi', "Goodbye, Villa Villekulla! Goodbye, everybody! Goodbye, dog!"]]); }, 1600);
        return;
      }
      nope(); fb.className = 'feedback bad';
      fb.textContent = tx({ N: 'North? That way is ice and polar bears. Pippi would love it, but the island is the other way.',
        S: 'Due south runs straight down the chart. The island is south, but it\'s west as well.',
        W: 'Due west goes straight across the chart. The island is west, but it\'s south as well.',
        E: 'East would take you to Finland. The captain\'s island is nowhere near Finland.',
        NE: 'North-east is exactly the wrong way. Turn the ship right round.',
        SE: 'South-east: the right way down, but the wrong way across. Look at the chart again.',
        NW: 'North-west: the right way across, but the wrong way up and down. Look at the chart again.' }[h]);
    };
  });
}
function openChart5(){
  const pos = !S.f.course ? [300, 70] : !S.f.water ? [220, 150] : !S.f.equator ? [150, 220] : !S.f.out5 ? [110, 262] : [86, 290];
  openModal("The captain's chart", 'Spread out on the chart table', `
    <svg class="hp-chart" viewBox="0 0 400 320" aria-hidden="true">
      <rect width="400" height="320" fill="#f3e6c4"/>
      <path d="M270 0 Q300 40 330 50 Q350 20 380 0 Z M300 120 Q340 90 400 100 V180 Q350 170 300 120 Z M240 300 Q300 250 360 260 Q400 270 400 320 H250 Z" fill="#d9c79a" stroke="#a8946a"/>
      <path d="M0 236 H400" stroke="#c4302b" stroke-width="1.5" stroke-dasharray="6 4"/>
      <text x="8" y="230" font-size="12" font-weight="700" fill="#c4302b" font-family="Fredoka, sans-serif">${tx('Equator 0°')}</text>
      <text x="8" y="70" font-size="11" fill="#7a5a1a" font-family="Fredoka, sans-serif">60°</text>
      <path d="M0 74 H400" stroke="#a8946a" stroke-dasharray="2 4"/>
      <circle cx="312" cy="60" r="6" fill="#e8571f"/><text x="322" y="64" font-size="11" fill="#3e200c" font-family="Fredoka, sans-serif">${tx('Villa Villekulla')}</text>
      <path d="M312 60 Q250 140 170 200 Q110 250 60 300" stroke="#1f3f6a" stroke-width="2.5" fill="none" stroke-dasharray="7 5"/>
      <g fill="#3f8a4a"><circle cx="54" cy="304" r="12"/></g><text x="72" y="310" font-size="11" fill="#3e200c" font-family="Fredoka, sans-serif">${tx("The captain's island")}</text>
      <g transform="translate(${pos[0]} ${pos[1]})"><path d="M-9 -4 h18 l-4 8 h-10z" fill="#6b3a1a"/><path d="M0 -4 v-12 l9 8z" fill="#fffaf0" stroke="#6b3a1a"/></g>
      <g transform="translate(350 230)"><circle r="28" fill="#fffaf0" stroke="#c9952a" stroke-width="2"/>
        <path d="M0 -24 L5 0 L0 24 L-5 0 Z" fill="#1f3f6a"/><path d="M0 -24 L5 0 L-5 0 Z" fill="#c4302b"/><path d="M-24 0 L0 -4 L24 0 L0 4 Z" fill="#1f3f6a"/>
        <g font-size="10" font-weight="700" fill="#1f3f6a" text-anchor="middle" font-family="Fredoka, sans-serif"><text y="-32">${tx('N')}</text><text y="40">${tx('S')}</text><text x="-36" y="4">${tx('W')}</text><text x="36" y="4">${tx('E')}</text></g></g>
    </svg>
    <p class="flag-p">${tx('On a chart, north is always at the top, south at the bottom, west on the left and east on the right. The dotted line is the way to the captain\'s island.')}</p>`);
}

/* ---------- puzzle: Mr Nilsson's things overboard (floating and sinking: what it's made of, not how big it is) ---------- */
const FLOAT5 = [
  { k: 'log', name: 'A big, heavy log', floats: true, svg: '<rect x="10" y="28" width="80" height="24" rx="12" fill="#8a5028"/><ellipse cx="86" cy="40" rx="6" ry="12" fill="#c98a4b"/>' },
  { k: 'key', name: "The captain's little iron key", floats: false, svg: '<circle cx="34" cy="40" r="10" fill="none" stroke="#5a5f66" stroke-width="5"/><path d="M44 40 H76 M68 40 v8 M74 40 v6" stroke="#5a5f66" stroke-width="5"/>' },
  { k: 'apple', name: 'An apple', floats: true, svg: '<circle cx="50" cy="44" r="18" fill="#d22d2d"/><path d="M50 26 q2 -8 8 -10" stroke="#5a3a1a" stroke-width="3" fill="none"/><path d="M52 24 q10 -6 14 0 q-8 4 -14 0z" fill="#3f8a4a"/>' },
  { k: 'coin', name: 'A gold coin', floats: false, svg: '<circle cx="50" cy="40" r="16" fill="#f3d27a" stroke="#b07f1f" stroke-width="3"/><text x="50" y="45" text-anchor="middle" font-size="14" font-weight="700" fill="#b07f1f">1</text>' },
  { k: 'cork', name: 'A cork', floats: true, svg: '<path d="M38 30 h24 l-3 22 h-18z" fill="#c9a46a" stroke="#8a6a3a" stroke-width="2"/>' },
  { k: 'marble', name: 'A glass marble', floats: false, svg: '<circle cx="50" cy="40" r="12" fill="#5ad0c0" opacity=".8"/><path d="M44 34 q4 -4 8 -2" stroke="#fff" stroke-width="2" fill="none"/>' }
];
function openFloat(){
  const st = S.flt || (S.flt = {});
  openModal('Overboard!', "Mr Nilsson's six splashes", `
    <p class="flag-p">${tx('What floats, you can scoop up with the net. What sinks, Pippi will have to dive for. Which of these float?')}</p>
    <div class="hp-floats">${FLOAT5.map(o => `<button type="button" class="hp-fl" data-k="${o.k}"><svg viewBox="0 0 100 80" aria-hidden="true"><rect width="100" height="80" rx="6" fill="#cfe7fb"/>${o.svg}</svg><span>${tx(o.name)}</span><b class="hp-fs" id="hp-fs-${o.k}"></b></button>`).join('')}</div>
    <div class="row-btns"><button type="button" class="btn" id="hp-fcheck">${tx('Out with the net!')}</button></div>
    <div class="feedback" id="hp-ffb">${tx('Click a thing to say whether it floats or sinks.')}</div>`, () => {
    const fb = $('#hp-ffb');
    const draw = () => FLOAT5.forEach(o => { const v = st[o.k], el = $('#hp-fs-' + o.k);
      el.textContent = v === 'f' ? tx('floats') : v === 's' ? tx('sinks') : '?';
      el.parentElement.classList.toggle('f', v === 'f'); el.parentElement.classList.toggle('s', v === 's'); });
    draw();
    document.querySelectorAll('.hp-fl').forEach(b => b.onclick = () => { const k = b.dataset.k; st[k] = st[k] === 'f' ? 's' : 'f'; save(); beep(st[k] === 'f' ? 700 : 300, .05); draw(); });
    $('#hp-fcheck').onclick = () => {
      if(FLOAT5.some(o => !st[o.k])){ nope(); fb.className = 'feedback bad'; fb.textContent = tx('Decide for every one of them first: floats or sinks?'); return; }
      const wrong = FLOAT5.find(o => (st[o.k] === 'f') !== o.floats);
      if(wrong){
        nope(); fb.className = 'feedback bad';
        fb.textContent = tx({ log: 'The log is big and heavy, but it\'s made of wood, and wood is lighter than the same amount of water. Big things can float!',
          key: 'The key is tiny and light, but iron is much heavier than the same amount of water. Small things can sink!',
          apple: 'An apple is full of tiny pockets of air. Ever tried apple-bobbing?',
          coin: 'Gold is very, very heavy for its size. Plop.',
          cork: 'Cork is so light for its size that fishermen use it to keep their nets afloat.',
          marble: 'Glass is heavier than the same amount of water. The marble goes straight to the bottom.' }[wrong.k]);
        return;
      }
      S.f.floats = true; take('net'); save(); applyVisuals(); chord([523,659,784,1046]);
      fb.className = 'feedback good'; fb.textContent = tx('The log, the apple and the cork bob on the waves: into the net they go! Whether a thing floats depends on what it\'s made of, not on how big it is.');
      setTimeout(() => { closeModal(); say([['pippi', "And now the sinkers!"], "Pippi dives in head first. A long time later she comes up again with the key in her teeth, the coin in her ear and the marble up her nose.", ['pippi', "In Egypt everybody can hold their breath for a week."], "It's getting hotter every day. Then, from the galley, a long slurping noise…", ['captain', "The horse has drunk the water barrel dry!"]]); }, 2000);
    };
  });
}

/* ---------- puzzle: fresh water from sea water (the sun evaporates the water; the salt stays behind) ---------- */
const STILL5 = [
  { k: 'bowl', label: 'A bowl of sea water', need: true },
  { k: 'cup', label: 'An empty cup in the middle of the bowl', need: true },
  { k: 'lid', label: 'A clear glass lid over the bowl', need: true },
  { k: 'pebble', label: 'A pebble on the lid, right above the cup', need: true },
  { k: 'sun', label: 'Put it in the hot sun', need: true },
  { k: 'shade', label: 'Put it in the cool shade', need: false },
  { k: 'salt', label: 'Add a spoonful of salt', need: false }
];
function openStill(){
  const on = S.stl || (S.stl = []);
  openModal('Fresh water from the sea', 'The captain\'s old trick', `
    <svg class="hp-still" viewBox="0 0 320 170" aria-hidden="true" id="hp-stillsvg"></svg>
    <div class="hp-parts">${STILL5.map(p => `<button type="button" class="tog hp-part" data-k="${p.k}">${tx(p.label)}</button>`).join('')}</div>
    <div class="row-btns"><button type="button" class="btn ghost" id="hp-drink">${tx('Just drink the sea water')}</button><button type="button" class="btn" id="hp-wait">${tx('Wait for the sun to work')}</button></div>
    <div class="feedback" id="hp-sfb">${tx('Sea water is too salty to drink. But when water dries up in the sun, the salt is left behind. Choose what you need.')}</div>`, () => {
    const fb = $('#hp-sfb');
    const draw = (drip) => {
      const has = k => on.includes(k);
      let s = `<rect width="320" height="170" fill="${has('shade') ? '#5a7a9a' : '#9fd0f0'}"/>`;
      if(has('sun')) s += '<circle cx="280" cy="30" r="20" fill="#ffd25a"/>';
      s += '<rect y="140" width="320" height="30" fill="#a5743f"/>';
      if(has('bowl')) s += '<path d="M60 100 Q60 140 160 140 Q260 140 260 100 Z" fill="#3a8ac0" opacity=".85"/><path d="M60 100 H260" stroke="#e9e1cc" stroke-width="3"/>';
      if(has('salt')) s += '<g fill="#fff"><circle cx="100" cy="120" r="2"/><circle cx="210" cy="118" r="2"/><circle cx="130" cy="128" r="2"/></g>';
      if(has('cup')) s += '<path d="M146 108 h28 l-3 26 h-22z" fill="#fffaf0" stroke="#c9b48a" stroke-width="2"/>';
      if(has('lid')) s += has('pebble') ? '<path d="M56 98 L160 74 L264 98" fill="none" stroke="#cfe7fb" stroke-width="4"/>' : '<path d="M56 98 Q160 60 264 98" fill="none" stroke="#cfe7fb" stroke-width="4"/>';
      if(has('pebble')) s += '<ellipse cx="160" cy="70" rx="9" ry="6" fill="#8a8f96"/>';
      if(drip) s += '<g fill="#e9f4ff"><circle class="hp-dripdot" cx="160" cy="86" r="3"/><circle cx="110" cy="84" r="2"/><circle cx="210" cy="84" r="2"/></g><path d="M150 128 h20" stroke="#5aa0e0" stroke-width="5"/>';
      $('#hp-stillsvg').innerHTML = s;
      document.querySelectorAll('.hp-part').forEach(b => b.classList.toggle('on', has(b.dataset.k)));
    };
    draw(false);
    document.querySelectorAll('.hp-part').forEach(b => b.onclick = () => {
      const k = b.dataset.k, i = on.indexOf(k);
      if(i >= 0) on.splice(i, 1);
      else { on.push(k); const other = { sun: 'shade', shade: 'sun' }[k]; if(other && on.includes(other)) on.splice(on.indexOf(other), 1); }
      save(); beep(500, .03); draw(false);
    });
    $('#hp-drink').onclick = () => { S.ach.tasted = true; save(); nope(); fb.className = 'feedback bad'; fb.textContent = tx('Bleurgh! It\'s horribly salty, and salty water makes you even thirstier. Never drink sea water.'); };
    $('#hp-wait').onclick = () => {
      const has = k => on.includes(k);
      const msg = has('salt') ? 'More salt? The sea has plenty already, thank you.'
        : has('shade') ? 'In the shade it hardly warms up. You\'d be waiting till next Christmas.'
        : !has('bowl') ? 'There\'s no sea water to make fresh water from.'
        : !has('sun') ? 'Where are you going to put it? Something has to warm the water up.'
        : !has('lid') ? 'The warm water turns into vapour and floats away into the sky. Something has to catch it.'
        : !has('cup') ? 'Drops form under the lid and fall… straight back into the salty water. Something has to catch them.'
        : !has('pebble') ? 'Drops form under the lid but run down the sides, back into the salty bowl. Make the lid dip, right above the cup.'
        : null;
      if(msg){ nope(); fb.className = 'feedback bad'; fb.textContent = tx(msg); return; }
      S.f.water = true; save(); draw(true); chord([523,659,784,1046]);
      fb.className = 'feedback good'; fb.textContent = tx('The sun warms the sea water and it evaporates: the salt stays behind. The vapour cools on the lid, turns back into drops, runs down to the pebble and drips into the cup. Fresh water!');
      setTimeout(() => { closeModal(); applyVisuals(); say(["Soon there are bowls in the sun all over the deck, and the cups fill up drop by drop. The horse gets the first cupful.", ['horse', "Slurrrp. Neigh!"], "The sun sets, red and gold. Night falls over the sea, and one by one the stars come out.", ['captain', "Tonight we cross the Equator, sailor. Or do we? Ask the stars. My sextant is in my cabin."]]); }, 2400);
    };
  });
}

/* ---------- puzzle: the Equator by the stars (the North Star's height is how far north you are) ---------- */
function openLog5(){
  openModal("The captain's logbook", 'His last voyage to the South Seas', `
    <div class="hp-log">
      <p>${tx('Day 1. Left Villa Villekulla. North Star 59° above the horizon. Fair wind.')}</p>
      <p>${tx('Day 8. North Star 40°. Ate a whole shark. Well, half.')}</p>
      <p>${tx('Day 15. North Star 20°. Hot. Very hot.')}</p>
      <p>${tx('Day 22. Crossed the Equator! King Neptune came aboard. (It was the cook in a beard made of seaweed.)')}</p>
      <p class="hp-rule">${tx('SAILOR\'S RULE: the higher the North Star, the further north you are. At the North Pole it is straight overhead, 90° up. Sail south, and every night it sinks a little lower.')}</p>
    </div>`);
}
function openSextant5(){
  const round = S.eqr || 0;
  const sky = `<svg class="hp-night" viewBox="0 0 400 200" aria-hidden="true"><rect width="400" height="200" fill="#070b24"/>
      <g fill="#fff"><circle cx="40" cy="40" r="1.5"/><circle cx="120" cy="80" r="1.2"/><circle cx="300" cy="30" r="1.5"/><circle cx="360" cy="90" r="1.2"/><circle cx="250" cy="70" r="1"/><circle cx="80" cy="120" r="1"/></g>
      <g fill="#fff8e1"><circle cx="230" cy="120" r="2.6"/><circle cx="246" cy="104" r="2.6"/><circle cx="270" cy="100" r="2.6"/><circle cx="290" cy="112" r="2.6"/><circle cx="292" cy="140" r="2.6"/><circle cx="318" cy="146" r="2.6"/><circle cx="314" cy="124" r="2.6"/></g>
      <circle cx="160" cy="150" r="4" fill="#fff8e1"/><circle cx="160" cy="150" r="10" fill="#fff8e1" opacity=".2"/>
      <rect y="152" width="400" height="48" fill="#0b2a4a"/><path d="M0 152 H400" stroke="#5aa0e0" stroke-width="1.5"/>
      <text x="172" y="146" font-size="11" fill="#fff8e1" font-family="Fredoka, sans-serif">${tx('the North Star')}</text></svg>`;
  const opts = round === 0
    ? [['pole', 'At the North Pole'], ['home', 'Back home near Villa Villekulla'], ['half', 'Halfway between home and the Equator'], ['eq', 'On the Equator']]
    : [['higher', 'Higher up again'], ['same', 'Exactly the same, on the horizon'], ['below', 'Below the horizon: we can\'t see it any more']];
  openModal("The captain's sextant", round === 0 ? 'Measuring the North Star' : 'And tomorrow night?', `${sky}
    <p class="flag-p">${tx(round === 0 ? 'Through the sextant, the North Star sits right on the horizon. The sextant reads: 0°. Where is the Hoppetossa tonight?' : 'Tomorrow night the ship will be south of the Equator. Where will the North Star be then?')}</p>
    <div class="hands">${opts.map(([k, l]) => `<button type="button" class="hand" data-q="${k}">${tx(l)}</button>`).join('')}</div>
    <div class="feedback" id="hp-qfb"></div>`, () => {
    const fb = $('#hp-qfb');
    document.querySelectorAll('.hand[data-q]').forEach(b => b.onclick = () => {
      const k = b.dataset.q;
      if(round === 0 && k === 'eq'){
        S.eqr = 1; save(); chord([523,659,784]);
        fb.className = 'feedback good'; fb.textContent = tx('0° up means 0° north: the Equator, right in the middle between the North Pole and the South Pole!');
        setTimeout(() => { if(!$('#modal').hidden) openSextant5(); }, 1700);
        return;
      }
      if(round === 1 && k === 'below'){
        S.f.equator = true; take('sextant'); save(); applyVisuals(); chord([523,659,784,1046,1318]);
        fb.className = 'feedback good'; fb.textContent = tx('Below the horizon! South of the Equator, the North Star is hidden behind the curve of the Earth. Instead, new stars appear, like the Southern Cross.');
        setTimeout(() => { closeModal(); say([['captain', "We're crossing the line! Hurrah for the Equator!"], "Pippi paints a big red 0° on the mainsail, and everybody gets a bucket of sea water over their head. Even the horse.", "The night goes by in songs and splashes. Then the sky in the east turns pink… and something tiny shows on the horizon.", ['captain', "Is that… Quick, sailor! My spyglass, and up to the crow's nest!"]]); }, 2200);
        return;
      }
      nope(); fb.className = 'feedback bad';
      fb.textContent = tx({ pole: 'At the North Pole, the North Star is straight above your head: 90° up. Tonight it\'s 0°.',
        home: 'At home it stood 59° up, high in the sky. Look at the captain\'s logbook: it sinks as you sail south.',
        half: 'Halfway, it would be about 30° up. Tonight it\'s sitting right on the sea: 0°.',
        higher: 'It has been sinking lower every night as you sailed south. Why would it climb again now?',
        same: 'It has moved every single night. Keep sailing south, and it keeps sinking.' }[k]);
    });
  });
}

/* ---------- puzzle: land ho! (the Earth is round: from higher up you can see further) ---------- */
function openLandHo(){
  const st = S.lho || (S.lho = { from: 'deck' });
  openModal('Land ho?', 'In the crow\'s nest, with the spyglass', `
    <svg class="hp-curve" viewBox="0 0 420 200" aria-hidden="true" id="hp-curvesvg"></svg>
    <div class="row-btns"><button type="button" class="btn ghost hp-from" data-f="deck">${tx('Look from the deck')}</button><button type="button" class="btn ghost hp-from" data-f="nest">${tx('Look from the crow\'s nest')}</button></div>
    <p class="flag-p">${tx('From the crow\'s nest you can see the top of the island\'s mountain. From the deck, you can\'t see it at all. Why?')}</p>
    <div class="hands">
      <button type="button" class="hand" data-l="near">${tx('Up in the crow\'s nest you\'re closer to the island.')}</button>
      <button type="button" class="hand" data-l="round">${tx('The Earth is round. The sea curves down, and from higher up you can see further over the bend.')}</button>
      <button type="button" class="hand" data-l="shy">${tx('The island is shy and ducks down when people on deck look at it.')}</button>
    </div>
    <div class="feedback" id="hp-lfb"></div>`, () => {
    const fb = $('#hp-lfb');
    const draw = () => {
      // a small, very curved Earth: the ship sits at -22°, the island at +30° round the curve
      const nest = st.from === 'nest';
      let s = '<rect width="420" height="200" fill="#ffd9a8"/><circle cx="210" cy="420" r="300" fill="#2a6a9a"/>';
      s += '<g transform="translate(360 160) rotate(30)"><path d="M-30 0 L0 -40 L30 0 Z" fill="#2f8a3a"/><path d="M8 -20 q2 -10 6 -14" stroke="#6b4423" stroke-width="2" fill="none"/></g>';
      s += `<g transform="translate(97.5 142) rotate(-22)"><path d="M-22 -8 h44 l-6 10 h-32z" fill="#6b3a1a"/><path d="M0 -8 V-70" stroke="#6b4423" stroke-width="3"/><rect x="-8" y="-76" width="16" height="8" fill="#8a5028"/><circle cx="0" cy="${nest ? -70 : -10}" r="4" fill="#c4302b"/></g>`;
      s += nest ? '<path d="M71 77 L380 125" stroke="#c4302b" stroke-width="2" stroke-dasharray="5 4"/>'
        : '<path d="M94 134 L212 123" stroke="#c4302b" stroke-width="2" stroke-dasharray="5 4"/><path d="M206 117 l12 12 M218 117 l-12 12" stroke="#c4302b" stroke-width="3"/>';
      s += `<text x="210" y="190" text-anchor="middle" font-size="12" fill="#fffaf0" font-family="Fredoka, sans-serif">${tx(nest ? 'From the crow\'s nest: your eye skims over the bend and finds the mountain top.' : 'From the deck: the bend of the sea is in the way.')}</text>`;
      $('#hp-curvesvg').innerHTML = s;
      document.querySelectorAll('.hp-from').forEach(b => b.classList.toggle('on', b.dataset.f === st.from));
    };
    draw();
    document.querySelectorAll('.hp-from').forEach(b => b.onclick = () => { st.from = b.dataset.f; save(); beep(600, .04); draw(); });
    document.querySelectorAll('.hand[data-l]').forEach(b => b.onclick = () => {
      const k = b.dataset.l;
      if(k !== 'round'){ nope(); fb.className = 'feedback bad';
        fb.textContent = tx(k === 'near' ? 'Only about 20 metres closer, and the island is many kilometres away. That\'s not it. Look at the picture: what is in the way of the line from the deck?' : 'Pippi says some islands are very shy. This one isn\'t. Look at the shape of the sea in the picture.'); return; }
      S.f.out5 = true; take('spyglass'); save(); chord([523,659,784,1046,1318,1568]);
      fb.className = 'feedback good'; fb.textContent = tx('The Earth is round! Ships and islands far away hide behind the curve of the sea. The higher you climb, the further you can see.');
      setTimeout(() => { closeModal(); applyVisuals(); win5(); }, 2000);
    });
  });
}

/* ---------- intro, start and win ---------- */
function intro5(){
  say([["sys", "The harbour, early in the morning. A big three-masted ship is tied up at the quay: the Hoppetossa. On her stern, a huge man with a red beard and a captain's hat is waving his arms."],
       ["captain", "Ahoy, Pippilotta! Ahoy, Tommy and Annika! And ahoy, new sailor!"],
       ["pippi", "Daddy! We're sailing to your island in the South Seas! I've never sailed to the South Seas, so I'm sure I'll be very good at it."],
       ["captain", "The wind is fair and the tide is high. All aboard!"],
       ["pippi", "Not without my horse!"],
       ["captain", "Then hoist it aboard with the cargo hoist on the stern, sailor. And Pippilotta: no lifting it yourself. Today we sail like proper sailors."],
       ["you", "A horse on a rope. Let's see how that hoist works."]],
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
  say([["you", "LAND HO!"],
       ["captain", "Land ho! That's my island! Pippilotta, look: the palm trees, the beach, and all my people running down to wave!"],
       ["sys", "The Hoppetossa sails into a turquoise lagoon. Palm trees sway, the sand is white, and a crowd of children is dancing on the beach."],
       ["pippi", "Daddy is a king, so I'm a princess! A thing-searching princess with a horse."],
       ["annika", "We hoisted a horse, crossed the Equator, made water out of the sea, and saw the island over the curve of the Earth. I've written it all down."],
       ["tommy", "Best. Voyage. Ever."],
       ["nilsson", "Eek!"]],
    () => showWin());
}
