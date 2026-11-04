// Chapter 2: burglars in the night, in Pippi's bedroom.
// Loaded in order by js/boot.js; all game files share the same global scope.

const UNLOCK2 = KEY + '-ch2';
function unlocked2(){ try{ if(localStorage.getItem(UNLOCK2) === '1') return true; }catch(e){} return S.ch >= 2 || !!S.f.out1; }
function setUnlocked2(){ try{ localStorage.setItem(UNLOCK2, '1'); }catch(e){} }

/* ---------- Morse code ---------- */
const MORSE = { A:'.-', B:'-...', C:'-.-.', D:'-..', E:'.', F:'..-.', G:'--.', H:'....', I:'..', J:'.---', K:'-.-', L:'.-..', M:'--',
  N:'-.', O:'---', P:'.--.', Q:'--.-', R:'.-.', S:'...', T:'-', U:'..-', V:'...-', W:'.--', X:'-..-', Y:'-.--', Z:'--..', 'Å':'.--.-', 'Ä':'.-.-', 'Ö':'---.' };
const morseShow = code => code.replace(/\./g, '·').replace(/-/g, '−');
/* Tommy's answer, in the player's language: TICKLE / KIETEL / KITTLA. */
const tickleWord = () => tx('TICKLE').toUpperCase();
const SHADOW_GOAL = 250;   // cm: taller than a grown-up burglar

/* ---------- Chapter 2 items ---------- */
Object.assign(ITEMS, {
  batteries: { name:'Batteries', desc:"Two batteries from Pippi's alarm clock. Look: one end says +, the other −.",
    svg:'<svg viewBox="0 0 44 44"><rect x="6" y="12" width="14" height="24" rx="2" fill="#2b8a3e"/><rect x="10" y="9" width="6" height="3" fill="#cfd4d8"/><rect x="24" y="12" width="14" height="24" rx="2" fill="#2b8a3e"/><rect x="28" y="9" width="6" height="3" fill="#cfd4d8"/><text x="13" y="24" text-anchor="middle" font-size="9" fill="#fff" font-family="monospace">+</text><text x="31" y="24" text-anchor="middle" font-size="9" fill="#fff" font-family="monospace">+</text></svg>' },
  torch: { name:'Torch', desc:'Switched on and shining. Point it at something: select it, then click.',
    svg:'<svg viewBox="0 0 44 44"><path d="M30 14 l12 -6 v28 l-12 -6z" fill="#fff3c4" opacity=".7"/><rect x="4" y="16" width="22" height="12" rx="3" fill="#2f5f9a"/><rect x="24" y="13" width="7" height="18" rx="2" fill="#9aa0a6"/></svg>' },
  feather: { name:'Feather', desc:"A long orange feather from Pippi's hat. Extremely tickly.",
    svg:'<svg viewBox="0 0 44 44"><path d="M8 38 q8-26 30-32 q-4 10-12 16 q-8 8-18 16z" fill="#e8571f"/><path d="M8 38 L30 12" stroke="#7a2a0a" stroke-width="1.6"/></svg>' }
});

/* ---------- drawing the bedroom ---------- */
function applyBedroom(){
  const show = (sel, on) => { const el = $(sel); if(el) el.style.display = on ? '' : 'none'; };
  show('#br-spunk', !S.f.spunkTaken); show('#hit-spunk2', !S.f.spunkTaken);
  show('#br-torch', !S.f.torchOn);
  show('#br-beam', !!S.f.torchOn);
  $('#br-dark').setAttribute('opacity', S.f.torchOn ? '.18' : '.42');
  show('#br-thieves', !S.f.out2 && (!S.f.torchOn || S.f.scared));
  show('#br-doorthief', !!S.f.torchOn && !S.f.scared);
  show('#br-feather', !S.f.feather);
  show('#br-ontop', !!S.f.out2);
  show('#br-zzz', !S.f.out2);
  $('#br-talight').setAttribute('fill', S.f.sos ? '#fff3c4' : '#ffd27a');
  document.querySelectorAll('#sc-bedroom [data-hs="vdoor"]').forEach(h => { h.dataset.label = S.f.out2 ? 'Veranda door' : S.f.torchOn && !S.f.scared ? 'Veranda door (someone is at the lock!)' : 'Veranda door'; h.setAttribute('aria-label', h.dataset.label); });
}

/* ---------- hotspot handlers ---------- */
Object.assign(H, {
  spunk2(){ S.f.spunkTaken = true; give('spunk'); applyVisuals(); say(["The spunk, in its jam jar, on the bedside table. It doesn't seem to sleep.", "You take it. A spunk knows things, even at night."]); },
  clock2(){
    if(S.f.batteries) return say("The alarm clock has stopped at twenty-five to twelve. You took its batteries. Pippi never looks at it anyway.");
    S.f.batteries = true; give('batteries'); applyVisuals();
    say(["Pippi's alarm clock. The little hand is just before the 12 and the big hand on the 7: twenty-five to twelve.", "The burglars said midnight. That's twenty-five minutes.", "You open the back. Two batteries! You take them. The clock stops ticking. Time doesn't, unfortunately."]);
  },
  torch(){ if(S.f.torchOn) return say("The torch is in your pocket, switched on. Select it to point it at something."); if(S.inv.includes('batteries')) return openTorch2(); say(["A torch. You click the switch. Nothing. You shake it. It rattles: it's empty.", "Torches need batteries. Something else in this room runs on batteries too."]); },
  card2(){ openSpyCard(); },
  sky(){
    if(S.f.sos) return say(S.f.morse ? "Tommy and Annika's window is dark again. They've gone to wake their dad." : "Tommy and Annika's window is still flashing at you. Use your torch on the window to read it again.");
    if(S.f.north) return say(["The North Star, and right below it Tommy and Annika's upstairs window.", S.f.torchOn ? "Select your torch and use it on the window to send them a signal." : "If only you had some light to signal with."]);
    openSky();
  },
  nilsson2(){ say(S.f.scared ? [['nilsson', "Zzz… eek… zzz."], "Mr Nilsson is back in his doll's bed, very proud of himself, and fast asleep again."] : [['nilsson', "Zzz… eek… zzz."], "Mr Nilsson is asleep in his doll's bed, with his straw hat over his eyes. He's small. But his shadow doesn't have to be."]); },
  scale(){ openScale(); },
  dresser(){ say("Pippi's dresser. The top drawer is full of odd socks. The bottom drawer is full of odd socks too, but odder."); },
  stones(){ say(["Pippi's basket of stones, from her thing-searching. She has written a number on each one, in kilos: 1, 2, 3, 5 and 6.", "\"Perfectly good stones,\" says the label. \"For weighing things.\""]); },
  hat(){
    if(S.f.feather) return say("Pippi's enormous hat, without its feather now. She'll hardly notice.");
    S.f.feather = true; give('feather'); applyVisuals();
    say(["Pippi's enormous green hat, with a long orange feather.", "You pull out the feather. It's soft and very, very tickly."]);
  },
  wardrobe(){ say(S.f.out2 ? ["Thunder-Karlsson and Bloom are sitting on top of the wardrobe, looking very sorry for themselves.", "Pippi has made them a little sign: PLEASE DO NOT FEED THE BURGLARS."] : "A big wardrobe, much too heavy to move. Pippi could lift it with one finger. She's busy sleeping."); },
  case2(){
    if(S.f.swapped) return say("The suitcase, full of stones. The gold is safe under Pippi's feet. Let the burglars come.");
    say(["Pippi's suitcase full of gold coins. She took it to bed for safekeeping, then fell asleep on top of the problem.", "The burglars want this. If they carried off a suitcase just as heavy, but full of something else, they wouldn't notice until much later."]);
  },
  pippi2(){
    if(S.f.out2) return say(['pippi', "Burglars on the wardrobe and pancakes for breakfast. Best night ever!"]);
    S.f.shakes = (S.f.shakes || 0) + 1; save();
    if(S.f.shakes >= 3){ S.ach.shake = true; save(); }
    say(S.f.shakes === 1 ? ["You shake the lump under the blanket. \"Pippi! Wake up! Burglars!\"", ['pippi', "Zzzzz… pancakes… zzz."]]
      : S.f.shakes === 2 ? ["You shake harder. The lump rolls over and snores like a ship's horn.", "Pippi sleeps the way she does everything else: completely."]
      : ["You shake the lump with all your strength. Pippi doesn't notice. The bed does: it creaks.", "Shaking won't work. Maybe Tommy and Annika know how to wake her."]);
  },
  feet(){
    if(S.f.out2) return say("Pippi's feet, wide awake now and dancing under the blanket.");
    say(["Two feet on the pillow, in one brown stocking and one black one.", "Pippi sleeps the other way round: feet on the pillow, head under the blanket at the far end. She says feet deserve a soft pillow too."]);
  },
  vdoor(){
    if(S.f.out2) return say("The veranda door. Kling and Klang went out through it, with a burglar each.");
    if(S.f.torchOn && !S.f.scared){
      if(S.inv.includes('torch')) return openShadow();
      return say("Someone is scratching at the lock!");
    }
    if(!S.f.torchOn) return say(["The veranda door. Through the curtain you can see a lantern bobbing about in the garden.", "Somebody whispers outside: \"…at midnight, Bloom, when everyone's asleep.\""]);
    say(["The veranda door. The scratching has stopped. The burglars are hiding behind the old oak, waiting for midnight.", "They'll be back. You need help, and you need a plan."]);
  }
});

/* ---------- puzzle: the torch (batteries the right way round) ---------- */
function openTorch2(){
  const tb = S.tb || (S.tb = [0, 1]);   // 0: + points left, 1: + points right (towards the bulb)
  const batt = i => `<button type="button" class="batt ${tb[i] ? 'r' : 'l'}" data-b="${i}" aria-label="${tx('Battery {n}: turn it round', { n: i + 1 })}"><span class="pl">+</span><span class="mi">−</span></button>`;
  openModal('The torch', 'Two batteries, one bulb, and a switch', `
    <div class="torch-body"><div class="tb-end"></div>${batt(0)}${batt(1)}<div class="tb-bulb" id="tb-bulb"></div></div>
    <div class="row-btns"><button type="button" class="btn" id="tb-on">${tx('Switch on')}</button></div>
    <div class="feedback" id="tb-fb">${tx('Click a battery to turn it round. The bulb is on the right.')}</div>`, () => {
    if(S.inv.includes('batteries')){ /* the batteries are in now */ }
    document.querySelectorAll('.batt').forEach(b => b.onclick = () => { const i = +b.dataset.b; tb[i] = 1 - tb[i]; save(); b.className = 'batt ' + (tb[i] ? 'r' : 'l'); beep(400, .03); });
    $('#tb-on').onclick = () => {
      const fb = $('#tb-fb');
      if(tb[0] !== tb[1]){ nope(); fb.className = 'feedback bad'; fb.textContent = tx("Click. Nothing. The two batteries face each other, so they push against each other. In a torch, the + end of one battery touches the − end of the next."); return; }
      if(!tb[0]){ nope(); fb.className = 'feedback bad'; fb.textContent = tx("Click. Nothing. They're in a line now, but the wrong way round: the + end has to point towards the bulb."); return; }
      S.f.torchOn = true; take('batteries'); give('torch'); save(); applyVisuals(); chord([523,659,784,1046]);
      $('#tb-bulb').classList.add('on');
      fb.className = 'feedback good'; fb.textContent = tx('Light! Two batteries in a line, + to −, and + towards the bulb: the electricity can go all the way round.');
      setTimeout(() => { closeModal(); say(["Torchlight! The bedroom isn't so scary now.", "Then you hear it: scritch, scratch. At the veranda door. Someone is poking at the lock!", ['karlsson', "Hurry up, Bloom! I want that gold before the clock strikes twelve."], ['bloom', "I'm hurrying, Karlsson! This lock is very… locky."]]); }, 1600);
    };
  });
}

/* ---------- puzzle: the shadow (closer to the light = bigger shadow) ---------- */
function openShadow(){
  const st = S.shd || (S.shd = { d: 200 });
  openModal("Mr Nilsson's shadow", 'Torch · Mr Nilsson · curtain', `
    <svg class="shadow-svg" viewBox="0 0 600 260" aria-hidden="true">
      <rect x="0" y="0" width="600" height="260" fill="#141a33"/>
      <rect x="560" y="10" width="30" height="240" fill="#f6ead2"/>
      <polygon id="sh-beam" points="40,130 560,10 560,250" fill="#fff3c4" opacity=".14"/>
      <rect x="10" y="118" width="36" height="24" rx="4" fill="#2f5f9a"/><rect x="44" y="114" width="10" height="32" fill="#9aa0a6"/>
      <g id="sh-nil"><circle cx="0" cy="-30" r="9" fill="#6b4423"/><rect x="-8" y="-22" width="16" height="22" rx="5" fill="#2f5f9a"/><ellipse cx="0" cy="-38" rx="13" ry="3" fill="#e9d48a"/></g>
      <rect id="sh-shadow" x="562" width="26" fill="#1a120c" opacity=".8"/>
    </svg>
    <label class="sh-l" for="sh-d">${tx('Mr Nilsson\'s distance from the torch')}: <b id="sh-dv"></b></label>
    <input type="range" id="sh-d" min="20" max="280" step="10" value="${st.d}">
    <div class="sh-read">${tx('Shadow on the curtain')}: <b id="sh-h"></b></div>
    <div class="row-btns"><button type="button" class="btn" id="sh-go">${tx('Make him wave his arms!')}</button></div>
    <div class="feedback" id="sh-fb">${tx('Mr Nilsson is 40 cm tall, and the curtain is 3 metres from the torch. Move him and watch his shadow.')}</div>`, () => {
    const height = () => Math.round(40 * 300 / st.d);
    const draw = () => {
      const x = 46 + st.d / 300 * 514, h = height(), px = Math.min(240, h / 300 * 240 * .8);
      $('#sh-nil').setAttribute('transform', `translate(${x},170)`);
      $('#sh-shadow').setAttribute('y', 250 - px); $('#sh-shadow').setAttribute('height', px);
      $('#sh-dv').textContent = st.d + ' cm';
      $('#sh-h').textContent = (h >= 100 ? (h / 100).toFixed(1).replace('.0', '') + ' m' : h + ' cm');
    };
    draw();
    $('#sh-d').oninput = e => { st.d = +e.target.value; save(); draw(); };
    $('#sh-go').onclick = () => {
      const h = height(), fb = $('#sh-fb');
      if(h < SHADOW_GOAL){ nope(); fb.className = 'feedback bad';
        fb.textContent = tx(h < 80 ? "Outside, Bloom giggles: \"Look, Karlsson, a little monkey!\" They aren't scared one bit. The shadow is too small: move Mr Nilsson closer to the light." : "\"What's that, Karlsson?\" \"Just a big cat, Bloom.\" Nearly! The closer Mr Nilsson is to the torch, the bigger his shadow."); return; }
      S.f.scared = true; if(h >= 500) S.ach.giant = true; save(); applyVisuals(); chord([196,165,131]);
      fb.className = 'feedback good'; fb.textContent = tx('A GIANT hairy shadow with a hat waves at the curtain. Outside, somebody shrieks!');
      setTimeout(() => { closeModal(); say([['bloom', "K-K-Karlsson! There's a GORILLA in there!"], ['karlsson', "Back to the oak tree! We'll come back at midnight, when the gorilla's asleep."], "Footsteps run off across the garden. Mr Nilsson climbs back into his doll's bed, very pleased with himself.", "Close to the light, a small thing makes a huge shadow. But they'll be back at midnight. You need help. Annika's card on the wall might know how."]); }, 1700);
    };
  });
}

/* ---------- Annika's spy card: Morse code and the way to their house ---------- */
function openSpyCard(){
  const letters = Object.keys(MORSE).filter(L => LANG === 'sv' || !/[ÅÄÖ]/.test(L));
  openModal("Annika's spy card", 'TOP SECRET · for Pippi, Tommy and Annika only', `
    <div class="spycard">
      <p>${tx('<b>Our house is due NORTH of Villa Villekulla.</b> At night, find the North Star: it is always in the north. Take the two stars at the end of the Big Dipper\'s pan (it looks like a saucepan), go up from the bottom one through the top one, and keep going about five times as far.')}</p>
      <p>${tx('<b>Secret signal:</b> flash your torch at our window in Morse code. A dot is a short flash, a dash is a long one. SOS means HELP!')}</p>
      <div class="morse-tab" translate="no">${letters.map(L => `<span><b>${L}</b> ${morseShow(MORSE[L])}</span>`).join('')}</div>
    </div>`);
}

/* ---------- puzzle: the North Star ---------- */
const SKY = {
  dipper: [[330,300],[342,356],[412,366],[418,310],[474,316],[526,334],[576,366]],
  cass: [[70,110],[100,150],[134,118],[166,156],[198,112]],
  little: [[300,74],[318,104],[350,120],[372,150]],
  polaris: [276,46], venus: [110,340],
  bg: [[40,40],[150,30],[210,70],[380,40],[460,80],[540,40],[600,110],[560,200],[250,200],[180,250],[60,230],[620,300],[460,190],[240,330],[30,380],[620,40],[400,220],[160,390],[520,250]]
};
function openSky(){
  const star = (x, y, r, kind, i) => `<g class="star" data-k="${kind}" tabindex="0" role="button" aria-label="${tx('A star')}"><circle cx="${x}" cy="${y}" r="16" fill="transparent"/><circle cx="${x}" cy="${y}" r="${r}" fill="#fff8e1"/></g>`;
  let svg = '';
  SKY.bg.forEach(([x, y], i) => svg += star(x, y, 1.6, 'bg', i));
  SKY.cass.forEach(([x, y], i) => svg += star(x, y, 2.6, 'cass', i));
  SKY.little.forEach(([x, y], i) => svg += star(x, y, 1.8, 'little', i));
  SKY.dipper.forEach(([x, y], i) => svg += star(x, y, 3, i < 2 ? 'pointer' : 'dipper', i));
  svg += star(SKY.venus[0], SKY.venus[1], 6, 'venus', 0) + star(SKY.polaris[0], SKY.polaris[1], 2.8, 'polaris', 0);
  openModal('The night sky', 'Out of the bedroom window', `
    <svg class="sky-svg" viewBox="0 0 640 420" role="group" aria-label="${tx('Stars over the garden')}">
      <rect width="640" height="420" fill="#070b24"/>
      <path d="M0 400 q160-40 320-14 q160 26 320-10 v44 h-640z" fill="#0b160f"/>
      ${svg}
    </svg>
    <div class="feedback" id="sky-fb">${tx('Click the star you think is the North Star.')}</div>`, body => {
    body.querySelectorAll('.star').forEach(g => {
      const pick = () => {
        const k = g.dataset.k, fb = $('#sky-fb');
        if(k === 'polaris'){
          S.f.north = true; save(); applyVisuals(); chord([659,784,988]);
          fb.className = 'feedback good'; fb.textContent = tx('The North Star! Straight below it, far across the meadow, a window glows: Tommy and Annika\'s house.');
          setTimeout(() => { closeModal(); say(["The North Star never moves: all night, the other stars turn around it. So it always shows you where north is.", "And due north is Tommy and Annika's house. Their upstairs light is on. Time for the secret signal."]); }, 1700);
          return;
        }
        nope(); fb.className = 'feedback bad';
        if(k === 'venus'){ S.ach.venus = true; save(); }
        fb.textContent = tx({ venus: "That's the brightest light in the sky, but it isn't a star: it's the planet Venus. The North Star is not especially bright.",
          pointer: "Good: that's one of the two pointer stars at the end of the saucepan. Now follow the line they make, upwards.",
          dipper: "That's part of the Big Dipper, the saucepan. The two stars at the end of its pan point the way.",
          cass: "That W shape is Cassiopeia. Nice, but the pointer stars of the saucepan lead somewhere else.",
          little: "Close! Those faint stars are the Little Dipper. The North Star is the last star of its handle.",
          bg: "Just an ordinary star. Follow the two pointer stars of the saucepan upwards, about five times as far." }[k]);
      };
      g.addEventListener('click', pick);
      g.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); pick(); } });
    });
  });
}

/* ---------- puzzle: Morse code (send SOS, then read Tommy's answer) ---------- */
function openMorse(){
  const st = S.mrs || (S.mrs = { seq: '' });
  const reply = [...tickleWord()].map(L => MORSE[L] || '').join(' ');
  openModal('Signalling with the torch', "Tommy and Annika's window, due north", `
    <div class="morse">
      ${S.f.sos ? '' : `<div class="m-seq" id="m-seq" translate="no"></div>
      <div class="row-btns m-keys">
        <button type="button" class="btn ghost" data-m=".">${tx('Short flash')} ·</button>
        <button type="button" class="btn ghost" data-m="-">${tx('Long flash')} −</button>
        <button type="button" class="btn ghost" data-m=" ">${tx('Next letter')}</button>
        <button type="button" class="btn ghost" id="m-clr">${tx('Clear')}</button>
        <button type="button" class="btn" id="m-send">${tx('Send')}</button>
      </div>`}
      <div class="m-reply" id="m-reply" ${S.f.sos ? '' : 'hidden'}>
        <div class="ta-lamp" id="ta-lamp"></div>
        <div><b>${tx('Their window flashes back:')}</b><div class="m-code" translate="no">${morseShow(reply).split(' ').join('&nbsp;&nbsp;&nbsp;')}</div>
        <button type="button" class="btn ghost" id="m-again">${tx('Watch it again')}</button></div>
        <form id="m-form" class="m-form"><label for="m-ans">${tx('What does it say?')}</label><input id="m-ans" autocomplete="off" spellcheck="false"><button type="submit" class="btn">${tx('Check')}</button></form>
      </div>
      <div class="feedback" id="m-fb">${S.f.sos ? '' : tx('Annika\'s spy card has the Morse alphabet. Send the signal for HELP.')}</div>
    </div>`, () => {
    const fb = $('#m-fb');
    const drawSeq = () => { const el = $('#m-seq'); if(el) el.textContent = morseShow(st.seq) || '…'; };
    drawSeq();
    const blink = () => {   // Tommy's torch blinks the reply
      const lamp = $('#ta-lamp'); if(!lamp || reducedMotion()) return;
      let t = 300;
      [...reply].forEach(ch => {
        if(ch === ' '){ t += 600; return; }
        const on = ch === '.' ? 220 : 650;
        setTimeout(() => { const l = $('#ta-lamp'); if(l) l.classList.add('on'); beep(880, on / 1000, 'sine', .03); }, t);
        setTimeout(() => { const l = $('#ta-lamp'); if(l) l.classList.remove('on'); }, t + on);
        t += on + 220;
      });
    };
    document.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { st.seq = (st.seq + b.dataset.m).replace(/ {2,}/g, ' ').slice(0, 40); save(); drawSeq(); beep(b.dataset.m === '-' ? 500 : 700, b.dataset.m === '-' ? .25 : .08, 'sine', .04); });
    const clr = $('#m-clr'); if(clr) clr.onclick = () => { st.seq = ''; save(); drawSeq(); };
    const send = $('#m-send'); if(send) send.onclick = () => {
      const s = st.seq.replace(/ /g, '');
      if(s === '...---...'){
        S.f.sos = true; save(); applyVisuals(); chord([523,523,523,784,784,784]);
        $('.m-keys').remove(); $('#m-seq').remove(); $('#m-reply').hidden = false;
        fb.className = 'feedback good'; fb.textContent = tx('· · · − − − · · ·  SOS! A moment later, Tommy and Annika\'s window starts to flash back.');
        blink(); return;
      }
      nope(); fb.className = 'feedback bad';
      fb.textContent = tx(s === '---...---' ? "That's the other way round: long, short, long. HELP starts with three short flashes." : !s ? 'You flash nothing. The night stays dark.' : "Tommy and Annika's window stays dark. They don't understand that one. The help signal is three letters: S, O, S.");
    };
    const again = $('#m-again'); if(again) again.onclick = blink;
    $('#m-form').onsubmit = e => {
      e.preventDefault();
      const a = $('#m-ans').value.toUpperCase().replace(/[^A-ZÅÄÖ]/g, '');
      if(a === tickleWord()){
        S.f.morse = true; save(); applyVisuals(); chord([523,659,784,1046]);
        fb.className = 'feedback good'; fb.textContent = tx('"{word}"! Then their window goes dark: they have gone to wake their dad.', { word: tickleWord() });
        setTimeout(() => { closeModal(); say([tx('{word}? Tickle whom?', { word: tickleWord() }), "Of course: Pippi! Shaking doesn't wake her. Tickling might.", "Downstairs, the kitchen clock whirrs. Nearly midnight. Make sure the burglars don't get the gold, then wake Pippi."]); }, 1800);
        return;
      }
      nope(); fb.className = 'feedback bad';
      fb.textContent = tx(a.length !== tickleWord().length ? 'Count the groups of flashes: each group is one letter. That makes {n} letters.' : 'Not quite. Look up each group on Annika\'s card, one letter at a time.', { n: tickleWord().length });
    };
    if(S.f.sos) blink();
  });
}

/* ---------- puzzle: the balance scale (swap the gold for stones of the same weight) ---------- */
const STONES = [1, 2, 3, 5, 6];
const GOLD_KG = 9;
function openScale(){
  if(S.f.swapped) return say("The scale stands level and empty. The gold is safe under Pippi's feet, and the suitcase is full of stones.");
  const sel = S.stn || (S.stn = []);
  openModal("Pippi's scale", 'Gold on the left, stones on the right', `
    <svg class="scale-svg" viewBox="0 0 400 200" aria-hidden="true">
      <rect x="194" y="60" width="12" height="120" fill="#c9952a"/><rect x="150" y="178" width="100" height="12" rx="4" fill="#c9952a"/>
      <g id="sc-beam"><rect x="60" y="56" width="280" height="8" rx="4" fill="#c9952a"/>
        <g id="sc-l"><path d="M80 60 l-30 60 h60z" fill="none" stroke="#c9952a" stroke-width="2"/><rect x="40" y="120" width="80" height="8" rx="3" fill="#c9952a"/><g fill="url(#scGold)"><circle cx="66" cy="112" r="8"/><circle cx="82" cy="110" r="8"/><circle cx="98" cy="112" r="8"/><circle cx="74" cy="100" r="8"/><circle cx="90" cy="100" r="8"/></g><text x="80" y="146" text-anchor="middle" font-size="14" font-weight="700" fill="#f3d27a">${tx('gold')}: ${GOLD_KG} kg</text></g>
        <g id="sc-r"><path d="M320 60 l-30 60 h60z" fill="none" stroke="#c9952a" stroke-width="2"/><rect x="280" y="120" width="80" height="8" rx="3" fill="#c9952a"/><text x="320" y="146" text-anchor="middle" font-size="14" font-weight="700" fill="#cfd4d8" id="sc-rt"></text></g>
      </g>
      <defs><linearGradient id="scGold" x1="0" x2="1"><stop offset="0" stop-color="#c9952a"/><stop offset=".5" stop-color="#f3d27a"/><stop offset="1" stop-color="#b07f1f"/></linearGradient></defs>
    </svg>
    <div class="stones">${STONES.map((w, i) => `<button type="button" class="stone${sel.includes(i) ? ' on' : ''}" data-s="${i}" aria-pressed="${sel.includes(i)}">${w} kg</button>`).join('')}</div>
    <div class="row-btns"><button type="button" class="btn" id="sc-swap">${tx('Swap: gold out, stones in')}</button></div>
    <div class="feedback" id="sc-fb">${tx('Click the stones to put them on the right pan, or take them off again.')}</div>`, () => {
    const total = () => sel.reduce((s, i) => s + STONES[i], 0);
    const draw = () => {
      const t = total(), tilt = Math.max(-12, Math.min(12, (GOLD_KG - t) * 2.5));
      $('#sc-beam').setAttribute('transform', `rotate(${-tilt} 200 60)`);
      $('#sc-l').setAttribute('transform', `rotate(${tilt} 80 60)`); $('#sc-r').setAttribute('transform', `rotate(${tilt} 320 60)`);
      $('#sc-rt').textContent = tx('stones') + ': ' + t + ' kg';
    };
    draw();
    document.querySelectorAll('.stone').forEach(b => b.onclick = () => {
      const i = +b.dataset.s, k = sel.indexOf(i);
      if(k >= 0) sel.splice(k, 1); else sel.push(i);
      save(); b.classList.toggle('on', k < 0); b.setAttribute('aria-pressed', k < 0); beep(260 + STONES[i] * 40, .05); draw();
    });
    $('#sc-swap').onclick = () => {
      const t = total(), fb = $('#sc-fb');
      if(t !== GOLD_KG){ nope(); fb.className = 'feedback bad';
        fb.textContent = tx(t < GOLD_KG ? 'The stones are lighter: the gold side sinks. The burglars would notice the suitcase is too light. Add {n} kg more.' : 'Now the stones are heavier: the stone side sinks. Take {n} kg off.', { n: Math.abs(GOLD_KG - t) }); return; }
      S.f.swapped = true; save(); applyVisuals(); chord([523,659,784,1046]);
      fb.className = 'feedback good'; fb.textContent = tx('Level! Same weight on both sides. You tip the gold out and fill the suitcase with the stones.');
      setTimeout(() => { closeModal(); say(["A level scale means both sides weigh exactly the same. The suitcase is just as heavy as before. The burglars won't notice a thing.", "You hide the gold coins in the safest place in Sweden: under Pippi's feet, on the pillow."]); }, 1700);
    };
  });
}

/* ---------- waking Pippi ---------- */
function tickle(where){
  if(where !== 'feet') return say(["You tickle the lump under the blanket. A sleepy voice: \"Mmf. That's my nose. Go away, nose-tickler.\"", "That's her head end. Pippi sleeps the other way round, remember: her feet are on the pillow."]);
  if(!S.f.morse) return say(["You tickle Pippi's feet. She giggles in her sleep and mumbles: \"Not now. Wake me when the police come.\"", "Then she snores on. Nobody has called the police yet. Maybe Tommy and Annika can help."]);
  if(!S.f.swapped) return say(["You lift the feather… and stop. If Pippi wakes now, she'll leap up and show the burglars where the gold is, just to be friendly.", "Better make sure the gold is safe first."]);
  take('feather'); S.f.out2 = true; save(); applyVisuals(); chord([523,659,784,1046,1318]);
  win2();
}

/* ---------- intro, start and win ---------- */
function intro2(){
  say([["sys", "That night. You're sleeping over at Villa Villekulla. The moon is up, and Pippi is snoring like a ship's horn."],
       ["you", "I can't sleep. And what's that light in the garden?"],
       ["sys", "A lantern, bobbing between the trees. Two men are creeping towards the house: one big, one small."],
       ["karlsson", "Psst, Bloom. Everyone says that girl has a whole suitcase full of gold."],
       ["bloom", "Then let's go and get it, Karlsson. At midnight, when they're all fast asleep."],
       ["you", "Burglars! It's pitch dark in here. First things first: some light."]],
    () => { S.f.introDone = true; save(); });
}
function startCh2(){
  setUnlocked2();
  S = Object.assign(fresh(), { ach: S.ach || {}, ch: 2, scene: 'bedroom' });
  S.started = true; sel = null;
  $('#title').hidden = true; $('#win').hidden = true;
  renderInv(); applyVisuals(); $('#timer').textContent = '00:00'; save(); intro2();
}
function win2(){
  say([["sys", "You tickle Pippi's feet with the feather. The blanket shakes. Then it shakes a lot."],
       ["pippi", "Hihihi! Stop it! Who's tickling me in the middle of the night? Oh, it's you! Is it Christmas?"],
       ["you", "Burglars, Pippi! They're coming for your gold!"],
       ["sys", "Bong… bong… bong… The kitchen clock strikes twelve. The veranda door creaks. Thunder-Karlsson and Bloom tiptoe in and grab the suitcase."],
       ["karlsson", "Got it! Heavy as anything. Full of gold, Bloom!"],
       ["bloom", "Karlsson… I peeked. It's full of stones."],
       ["pippi", "Good evening! How lovely, visitors! Shall we dance?"],
       ["sys", "Pippi dances the two burglars round and round the bedroom until they're dizzy, then lifts them up, one in each hand, and sits them on top of the wardrobe."],
       ["sys", "Blue lights in the lane. Tommy and Annika's dad has called the police, and the two policemen, Kling and Klang, come stomping in."],
       ["annika", "You saw our signal! I knew the spy card would come in handy."],
       ["pippi", "Officers! I've found two wardrobe ornaments. You can have them. They're not very pretty."]],
    () => showWin());
}
