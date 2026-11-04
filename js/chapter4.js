// Chapter 4: Pippi goes to the circus. The show can't begin until the ringmaster's checklist is done.
// Loaded in order by js/boot.js; all game files share the same global scope.

const UNLOCK4 = KEY + '-ch4';
function unlocked4(){ try{ if(localStorage.getItem(UNLOCK4) === '1') return true; }catch(e){} return S.ch >= 4 || (S.ch === 3 && !!S.f.out3); }
function setUnlocked4(){ try{ localStorage.setItem(UNLOCK4, '1'); }catch(e){} }

/* The ringmaster's checklist: four acts to fix before the curtain may open. */
const TASKS4 = ['lights', 'teeter', 'juggle', 'trapeze'];
const TASK4_LABEL = { lights: 'Spotlights', teeter: 'Teeterboard', juggle: 'Clown', trapeze: 'Trapezes' };
const tasks4Done = () => TASKS4.filter(k => S.f[k]).length;

/* ---------- Chapter 4 items ---------- */
Object.assign(ITEMS, {
  tickets: { name:'Circus tickets', desc:'Four tickets: for Pippi, Tommy, Annika and you. Mr Nilsson goes in free, as hand luggage.',
    svg:'<svg viewBox="0 0 44 44"><rect x="6" y="12" width="30" height="18" rx="2" fill="#f2c94c" transform="rotate(-8 21 21)"/><rect x="10" y="16" width="30" height="18" rx="2" fill="#c4302b"/><path d="M18 16 v18" stroke="#fffaf0" stroke-width="1.5" stroke-dasharray="2 2"/><text x="29" y="29" text-anchor="middle" font-size="9" font-weight="700" fill="#fffaf0" font-family="sans-serif">★</text></svg>' }
});

/* ---------- drawing the big top ---------- */
function buildCircus(){
  // stripes rising to the top of the tent
  let st = '';
  for(let i = 0; i < 16; i++){ const x0 = i * 110 - 60, x1 = x0 + 110; st += `<path d="M800 0 L${x0} 560 L${x1} 560z" fill="${i % 2 ? '#f3e6c4' : '#b52222'}" opacity=".92"/>`; }
  $('#cc-stripes').innerHTML = st;
  // bunting
  let bu = '';
  for(let i = 0; i < 24; i++){ const x = 40 + i * 64, y = 96 + Math.sin(i / 23 * Math.PI) * 30; bu += `<path class="pennant" style="animation-delay:-${(i * .23).toFixed(2)}s" d="M${x} ${y} l32 0 l-16 26z" fill="${['#f2c94c','#2f5f9a','#3f8a4a','#e8571f'][i % 4]}"/>`; }
  $('#cc-bunting').innerHTML = `<path d="M40 96 Q800 160 1580 96" stroke="#fffaf0" stroke-width="2" fill="none"/>` + bu;
  // the light bulbs round the sign
  let bl = '', k = 0;
  for(let x = 622; x <= 978; x += 22){ bl += `<circle class="bulb" style="animation-delay:-${(k++ % 6) * .15}s" cx="${x}" cy="178" r="4.5" fill="#fff4b0"/><circle class="bulb" style="animation-delay:-${(k++ % 6) * .15}s" cx="${x}" cy="236" r="4.5" fill="#fff4b0"/>`; }
  $('#cc-bulbs').innerHTML = bl;
  // confetti for the finale
  let cf = '';
  for(let i = 0; i < 60; i++){ const x = (i * 97) % 1600, c = ['#f2c94c','#e8571f','#2f5f9a','#3f8a4a','#fffaf0','#c4302b'][i % 6];
    cf += `<rect class="confetto" style="animation-delay:-${((i * 0.37) % 4).toFixed(2)}s;animation-duration:${(3 + (i % 5) * .5).toFixed(1)}s" x="${x}" y="-20" width="10" height="16" fill="${c}"/>`; }
  $('#cc-confetti').innerHTML = cf;
}
function applyCircus(){
  const show = (sel, on) => { const el = $(sel); if(el) el.style.display = on ? '' : 'none'; };
  show('#cc-spunk', !S.f.spunkTaken); show('#hit-spunk4', !S.f.spunkTaken);
  const sc = $('#sc-circus'); if(!sc) return;
  sc.classList.toggle('lit', !!S.f.lights);          // the three beams turn white and meet in the ring
  sc.classList.toggle('synced', !!S.f.trapeze);      // the trapezes swing in time
  sc.classList.toggle('showtime', !!S.f.out4);       // the curtain opens, confetti, Pippi rides the horse
  show('#cc-balls-floor', !S.f.juggle); show('#cc-balls-air', !!S.f.juggle);
  show('#cc-frown', !S.f.juggle); show('#cc-smile', !!S.f.juggle);
  show('#cc-confetti', !!S.f.out4); show('#cc-rider', !!S.f.out4); show('#cc-pippi', !S.f.out4);
  $('#cc-board').setAttribute('transform', S.f.teeter ? '' : 'rotate(-7 1180 758)');
  ['#cc-beam0', '#cc-beam1', '#cc-beam2'].forEach((b, i) => $(b).setAttribute('fill', S.f.lights ? 'url(#ccBeamW)' : ['url(#ccBeamR)', 'url(#ccBeamG)', 'url(#ccBeamB)'][i]));
  $('#cc-ticks').innerHTML = TASKS4.map((k, i) => `<text x="222" y="${300 + i * 22}">${S.f[k] ? '✓' : '·'} ${tx(TASK4_LABEL[k])}</text>`).join('');
}

/* ---------- hotspot handlers ---------- */
const notInside4 = () => !S.f.inside && (say([['ringmaster', "Tickets, please! Nobody comes near my ring without a ticket. Not even strong little girls."]]), true);
Object.assign(H, {
  spunk4(){ S.f.spunkTaken = true; give('spunk'); applyVisuals(); say(["The spunk's jam jar, on the counter of the ticket booth. Pippi brought it to the circus.", "\"It has never seen a circus,\" she says. You take it. A spunk knows things. Even about circuses."]); },
  booth(){
    if(S.f.tickets) return say("The ticket booth. The ticket seller is counting Pippi's gold coin for the fourth time. It's real.");
    openTickets();
  },
  list4(){ say([tx("The ringmaster's checklist, BEFORE THE SHOW: spotlights, teeterboard, clown, trapezes. {n} of 4 done.", { n: tasks4Done() }), tasks4Done() >= 4 ? "All done! Now the curtain can open: the winch is next to it." : "When all four are ticked off, the curtain can open."]); },
  ringmaster(){
    if(S.f.out4) return say([['ringmaster', "Ladies and gentlemen! The strongest girl in the world!"]]);
    if(!S.f.inside) return say([['ringmaster', "Tickets, please! The show starts in a moment. Well… it should."]]);
    if(tasks4Done() >= 4) return say([['ringmaster', "Everything's ready! Open the curtain with the winch, and the show can begin!"]]);
    say([['ringmaster', "Oh, it's a disaster! The spotlights are all the wrong colours, the teeterboard won't balance, the clown has forgotten his juggling, and the trapeze artists can't catch each other."], ['ringmaster', "My checklist is on the tent pole. If only somebody could help…"], ['pippi', "I've never helped a circus, so I'm sure I can!"]]);
  },
  lamps(){ if(notInside4()) return; if(S.f.lights) return say("The three spotlights shine white together, right in the middle of the ring. Perfect for a star."); openLights(); },
  teeter(){ if(notInside4()) return; if(S.f.teeter) return say(["The teeterboard, perfectly balanced. The strongman is very impressed.", ['strongman', "Such a small girl. So far out. Perfect balance!"]]); openTeeter(); },
  clown(){
    if(notInside4()) return;
    S.f.honks = (S.f.honks || 0) + 1; save();
    if(S.f.honks >= 3){ S.ach.honk = true; save(); }
    if(S.f.juggle) return say([['clown', S.f.honks >= 3 ? "Honk! Honk! HONK! Please stop squeezing my nose, I'm working." : "Look at me go! Red, blue, blue, red, blue, blue…"]]);
    openJuggle();
  },
  trapeze(){ if(notInside4()) return; if(S.f.trapeze) return say("The two trapezes swing back and forth in perfect time. The flyers catch each other every single time."); openTrapeze(); },
  seal(){ say([['seal', "Ork! Ork!"], "A seal on a stool, balancing a ball on its nose. It's the only one in the circus who's ready for the show."]); },
  curtain(){
    if(S.f.out4) return say("The curtain is wide open, and the show is on!");
    say(["The performers' curtain, heavy red velvet with gold fringes. Behind it, the horses are stamping and someone is warming up a trumpet.", "It opens with the winch on its right. But only when the show is ready."]);
  },
  winch(){
    if(notInside4()) return;
    if(S.f.out4) return say("The winch has done its job. The curtain is open.");
    if(tasks4Done() < 4) return say([['ringmaster', tx("Not yet! First the checklist: {n} of 4 acts are ready.", { n: tasks4Done() })]]);
    openGears();
  },
  pippi4(){ say(['pippi', S.f.out4 ? "I'm a circus star!" : !S.f.inside ? "I've got a gold coin for the tickets. It's a bit big, but they'll have change." : "A circus! With a strongman! I wonder if he'd like to be lifted."]); }
});

/* ---------- puzzle: the tickets (money: 4 × 3 = 12, and 20 − 12 = 8 change) ---------- */
const TICKET_PRICE = 3, TICKETS_N = 4, COIN_PAID = 20;
function openTickets(){
  const ch = S.chg || (S.chg = []);
  openModal('The ticket booth', 'Tickets: 3 crowns each', `
    <div class="booth4">
      <p>${tx('Pippi buys {n} tickets, for herself, Tommy, Annika and you, and pays with a gold coin worth {paid} crowns. The ticket seller has gone to fetch more change, so you\'re in charge of the till.', { n: TICKETS_N, paid: COIN_PAID })}</p>
      <p><b>${tx('How much change does Pippi get?')}</b></p>
      <div class="till">${[5, 2, 1].map(v => `<button type="button" class="coin c${v}" data-v="${v}" aria-label="${tx('Add a {v}-crown coin', { v })}">${v}</button>`).join('')}</div>
      <div class="change" id="change"></div>
      <div class="row-btns"><button type="button" class="btn ghost" id="chg-clear">${tx('Take it back')}</button><button type="button" class="btn" id="chg-give">${tx('Give the change')}</button></div>
      <div class="feedback" id="chg-fb"></div>
    </div>`, () => {
    const fb = $('#chg-fb');
    const draw = () => { $('#change').innerHTML = ch.length ? ch.map(v => `<span class="coin c${v}">${v}</span>`).join('') + ` <b>= ${ch.reduce((a, b) => a + b, 0)}</b>` : `<i>${tx('No coins yet.')}</i>`; };
    draw();
    document.querySelectorAll('.till .coin').forEach(b => b.onclick = () => { if(ch.length < 12){ ch.push(+b.dataset.v); save(); draw(); beep(900 + +b.dataset.v * 40, .05); } });
    $('#chg-clear').onclick = () => { ch.length = 0; save(); draw(); };
    $('#chg-give').onclick = () => {
      const sum = ch.reduce((a, b) => a + b, 0), want = COIN_PAID - TICKET_PRICE * TICKETS_N;
      if(sum === want){
        S.f.tickets = true; ch.length = 0; save(); give('tickets'); applyVisuals(); chord([523,659,784,1046]);
        fb.className = 'feedback good'; fb.textContent = tx('4 × 3 = 12 crowns for the tickets, and 20 − 12 = 8 crowns change. Four tickets for you!');
        setTimeout(() => { closeModal(); say([['pippi', "Eight crowns change! That's enough for eight crowns' worth of sweets."], "You take the tickets. Now show them to the ringmaster."]); }, 1700);
        return;
      }
      nope(); fb.className = 'feedback bad';
      fb.textContent = tx(sum === 12 ? "12 crowns is what the tickets cost. Pippi paid 20: how much is left over?" : sum === 17 ? "That would be right for one ticket. But Pippi buys four." : sum > want ? 'Too much! The circus would go bankrupt. First work out what four tickets cost.' : 'Not enough. What do four tickets cost, and how much is left of 20?');
    };
  });
}

/* ---------- puzzle: the spotlights (mixing coloured light) ---------- */
const LIGHT_ROUNDS = [
  { want: 'yellow', mix: [1, 1, 0], ask: 'Yellow light for the clown' },
  { want: 'cyan', mix: [0, 1, 1], ask: "Sea-blue light for the seal: cyan, a mix of green and blue" },
  { want: 'white', mix: [1, 1, 1], ask: 'White light for the star of the show' }
];
const LIGHT_NAME = { '000': 'darkness', '100': 'red', '010': 'green', '001': 'blue', '110': 'yellow', '011': 'cyan', '101': 'magenta (pink-purple)', '111': 'white' };
const LIGHT_CSS = { '000': '#111', '100': '#ff3b3b', '010': '#3bff5a', '001': '#3b6bff', '110': '#ffee3b', '011': '#3bf0ff', '101': '#ff3bf0', '111': '#ffffff' };
function openLights(){
  const st = S.lgt || (S.lgt = { r: 0, on: [0, 0, 0] });
  openModal('The lighting desk', 'Three spotlights: red, green and blue', `
    <div class="lightdesk">
      <svg class="mix-svg" viewBox="0 0 240 200" aria-hidden="true"><rect width="240" height="200" fill="#000"/><g style="mix-blend-mode:screen"><circle id="mx0" cx="96" cy="80" r="60" fill="#ff0000"/><circle id="mx1" cx="144" cy="80" r="60" fill="#00ff00" style="mix-blend-mode:screen"/><circle id="mx2" cx="120" cy="124" r="60" fill="#0000ff" style="mix-blend-mode:screen"/></g></svg>
      <div class="ld-ctl">
        <div class="ld-ask" id="ld-ask"></div>
        <div class="ld-switches">${['Red', 'Green', 'Blue'].map((n, i) => `<button type="button" class="tog ld${i}" data-i="${i}">${tx(n)}</button>`).join('')}</div>
        <div class="ld-now" id="ld-now"></div>
        <button type="button" class="btn" id="ld-go">${tx('Shine!')}</button>
      </div>
    </div>
    <div class="feedback" id="ld-fb">${tx('Coloured LIGHT mixes differently from paint: the more colours you add, the brighter it gets.')}</div>`, () => {
    const fb = $('#ld-fb');
    const key = () => st.on.join('');
    const draw = () => {
      st.on.forEach((v, i) => { $('#mx' + i).style.display = v ? '' : 'none'; document.querySelector('.ld' + i).classList.toggle('on', !!v); });
      $('#ld-ask').innerHTML = `<b>${tx('Round {n} of 3:', { n: st.r + 1 })}</b> ${tx(LIGHT_ROUNDS[st.r].ask)}`;
      $('#ld-now').innerHTML = `${tx('The ring is now:')} <span class="swatch" style="background:${LIGHT_CSS[key()]}"></span> ${tx(LIGHT_NAME[key()])}`;
    };
    draw();
    document.querySelectorAll('.ld-switches .tog').forEach(b => b.onclick = () => { const i = +b.dataset.i; st.on[i] = st.on[i] ? 0 : 1; save(); beep(400 + i * 200, .05); draw(); });
    $('#ld-go').onclick = () => {
      const round = LIGHT_ROUNDS[st.r];
      if(key() === '000'){ S.ach.lightsout = true; save(); nope(); fb.className = 'feedback bad'; fb.textContent = tx('Pitch dark! Somewhere in the dark, the seal goes "Ork?" Switch some lights on.'); return; }
      if(key() !== round.mix.join('')){ nope(); fb.className = 'feedback bad';
        fb.textContent = tx(round.want === 'yellow' && key() === '100' ? 'Only red. Yellow light is red light plus another colour. Not blue!' : round.want === 'white' ? 'Not white yet. White light is every colour of light together.' : 'That makes {got}. Which two colours of light together make {want}?', { got: tx(LIGHT_NAME[key()]), want: tx(round.want) }); return; }
      chord([523, 659, 784]);
      if(st.r < 2){ st.r++; save(); fb.className = 'feedback good'; fb.textContent = tx(round.want === 'yellow' ? 'Yellow! Red light and green light make yellow light. (With paint you would get brown!)' : 'Cyan! Green and blue light make a bright sea-blue.'); draw(); return; }
      S.f.lights = true; save(); applyVisuals();
      fb.className = 'feedback good'; fb.textContent = tx('White! Red, green and blue light together make white light. A screen makes every colour from just those three.');
      setTimeout(() => { closeModal(); say([['ringmaster', "The lights are perfect! Tick it off!"], "Up on the checklist, a tick appears next to Spotlights."]); }, 1800);
    };
  });
}

/* ---------- puzzle: the teeterboard (a lever: weight × distance on each side) ---------- */
const STRONG_KG = 90, STRONG_M = 1, PIPPI_KG = 30;
function openTeeter(){
  const st = S.tee || (S.tee = { m: 1 });
  openModal('The teeterboard', 'The strongman: 90 kg, 1 metre from the middle', `
    <svg class="teeter-svg" viewBox="0 0 520 220" aria-hidden="true">
      <rect width="520" height="220" fill="#d9a861"/>
      <path d="M260 170 l-22 40 h44z" fill="#8a5a2b"/>
      <g id="tt-board" class="tt-board"><rect x="20" y="162" width="480" height="10" rx="4" fill="#c98a4b" stroke="#7a4a1f" stroke-width="2"/>
        ${[1,2,3,4].map(m => `<g><text x="${260 - m * 55}" y="190" text-anchor="middle" font-size="11" fill="#5a3a1a">${m} m</text><text x="${260 + m * 55}" y="190" text-anchor="middle" font-size="11" fill="#5a3a1a">${m} m</text></g>`).join('')}
        <g transform="translate(${260 - STRONG_M * 55},0)"><rect x="-18" y="110" width="36" height="52" rx="12" fill="#1a1a1a"/><circle cy="98" r="14" fill="#e2b38c"/><text y="140" text-anchor="middle" font-size="12" fill="#fffaf0">90</text></g>
        <g id="tt-pippi"><rect x="-10" y="128" width="20" height="34" rx="6" fill="#3f8a4a"/><circle cy="118" r="10" fill="#f3c9a4"/><path d="M-10 116 l-12 -4 M10 116 l12 -4" stroke="#e8571f" stroke-width="5" stroke-linecap="round"/><text y="152" text-anchor="middle" font-size="10" fill="#fffaf0">30</text></g>
      </g>
    </svg>
    <div class="row-btns">${[1,2,3,4].map(m => `<button type="button" class="btn ghost seat" data-m="${m}">${tx('Pippi at {m} m', { m })}</button>`).join('')}</div>
    <div class="feedback" id="tt-fb">${tx('Pippi weighs 30 kg. Where must she sit so the board balances? The strongman says: "Heavy and close, or light and far, it\'s all the same to a teeterboard."')}</div>`, () => {
    const fb = $('#tt-fb');
    const draw = () => {
      const left = STRONG_KG * STRONG_M, right = PIPPI_KG * st.m, ang = Math.max(-12, Math.min(12, (right - left) / 6));
      $('#tt-board').setAttribute('transform', `rotate(${ang.toFixed(1)} 260 167)`);
      $('#tt-pippi').setAttribute('transform', `translate(${260 + st.m * 55},0)`);
      document.querySelectorAll('.seat').forEach(b => b.classList.toggle('on', +b.dataset.m === st.m));
    };
    draw();
    document.querySelectorAll('.seat').forEach(b => b.onclick = () => {
      st.m = +b.dataset.m; save(); draw(); beep(300 + st.m * 80, .06);
      const left = STRONG_KG * STRONG_M, right = PIPPI_KG * st.m;
      if(right === left){
        S.f.teeter = true; save(); applyVisuals(); chord([523,659,784,1046]);
        fb.className = 'feedback good'; fb.textContent = tx('Balanced! 90 kg × 1 m = 90, and 30 kg × 3 m = 90. A light person far out balances a heavy person close in.');
        setTimeout(() => { closeModal(); say([['strongman', "Such a small girl, so far out, and we balance perfectly! Teeterboard act: ready!"]]); }, 1800);
        return;
      }
      fb.className = 'feedback bad';
      if(right > left){ S.ach.flyer = true; save(); nope(); fb.textContent = tx('Pippi\'s end goes down with a bump, and the strongman flies up into the air! 30 × 4 = 120 is more than 90 × 1 = 90.'); return; }
      fb.textContent = tx('The strongman\'s side stays down. 30 kg × {m} m = {r}, but 90 kg × 1 m = 90. Sit further out.', { m: st.m, r: right });
    });
  });
}

/* ---------- puzzle: the clown's juggling (a repeating pattern) ---------- */
const JUGGLE_PATTERN = ['R', 'B', 'B', 'R', 'B', 'B', 'R', 'B', 'B', 'R'];
const JUGGLE_GIVEN = 7;   // the clown remembers the first seven
const JCOL = { R: '#e2483d', B: '#2f5f9a', Y: '#f2c94c' };
function openJuggle(){
  const st = S.jug || (S.jug = ['', '', '']);
  openModal("The clown's juggling", 'He has forgotten how it goes on', `
    <p class="flag-p">${tx('"I always juggle in a pattern," sniffs the clown, "but I\'ve forgotten the end! Which balls come next?"')}</p>
    <div class="jrow" id="jrow"></div>
    <p class="hint-s">${tx('Click an empty ball to change its colour.')}</p>
    <div class="row-btns"><button type="button" class="btn" id="jug-go">${tx('Juggle!')}</button></div>
    <div class="feedback" id="jug-fb"></div>`, () => {
    const fb = $('#jug-fb'), cyc = ['', 'R', 'B', 'Y'];
    const draw = () => {
      $('#jrow').innerHTML = JUGGLE_PATTERN.map((c, i) => i < JUGGLE_GIVEN ? `<span class="jb" style="background:${JCOL[c]}"></span>`
        : `<button type="button" class="jb pick" data-i="${i - JUGGLE_GIVEN}" style="background:${st[i - JUGGLE_GIVEN] ? JCOL[st[i - JUGGLE_GIVEN]] : 'transparent'}" aria-label="${tx('Ball {n}', { n: i + 1 })}">${st[i - JUGGLE_GIVEN] ? '' : '?'}</button>`).join('');
      document.querySelectorAll('.jb.pick').forEach(b => b.onclick = () => { const i = +b.dataset.i; st[i] = cyc[(cyc.indexOf(st[i]) + 1) % cyc.length]; save(); beep(600, .03); draw(); });
    };
    draw();
    $('#jug-go').onclick = () => {
      const want = JUGGLE_PATTERN.slice(JUGGLE_GIVEN);
      if(st.join('') === want.join('')){
        S.f.juggle = true; save(); applyVisuals(); chord([523,659,784,1046]);
        fb.className = 'feedback good'; fb.textContent = tx('Red, blue, blue, again and again: the pattern repeats every three balls. Up they go!');
        setTimeout(() => { closeModal(); say([['clown', "Red, blue, blue! Red, blue, blue! I remember! Honk honk!"], "The clown juggles, and the balls fly round and round in the spotlight."]); }, 1700);
        return;
      }
      nope(); fb.className = 'feedback bad';
      fb.textContent = tx(st.includes('Y') ? 'Yellow? There\'s no yellow anywhere in his pattern so far.' : st.some(c => !c) ? 'Choose a colour for every empty ball first.' : 'The clown drops a ball on his foot. Look at the start: which group of colours keeps repeating?');
    };
  });
}

/* ---------- puzzle: the trapezes (a pendulum's rhythm depends on its length, not its weight) ---------- */
const swingTime = L => 2 * Math.PI * Math.sqrt(L / 9.8);
function openTrapeze(){
  const st = S.trp || (S.trp = { a: 4, b: 2 });
  openModal('The trapezes', 'The Flying Svenssons must swing in time', `
    <svg class="trap-svg" viewBox="0 0 400 230" aria-hidden="true">
      <rect width="400" height="230" fill="#1f2a5c"/>
      <g id="tp-a" class="tp"><line id="tpa-r" x1="110" y1="0" x2="110" y2="160" stroke="#d9c79a" stroke-width="3"/><g id="tpa-p"><circle cx="110" cy="170" r="10" fill="#f3c9a4"/><rect x="100" y="178" width="20" height="26" rx="5" fill="#e8571f"/></g></g>
      <g id="tp-b" class="tp"><line id="tpb-r" x1="290" y1="0" x2="290" y2="160" stroke="#d9c79a" stroke-width="3"/><g id="tpb-p"><circle cx="290" cy="170" r="12" fill="#e2b38c"/><rect x="278" y="180" width="24" height="30" rx="6" fill="#2f5f9a"/></g></g>
    </svg>
    <div class="trap-ctl">
      <label>${tx('Left rope (Sofia, 35 kg)')}: <b id="tpa-v"></b><input type="range" id="tpa" min="2" max="6" step="1" value="${st.a}"></label>
      <label>${tx('Right rope (Sven, 70 kg)')}: <b id="tpb-v"></b><input type="range" id="tpb" min="2" max="6" step="1" value="${st.b}"></label>
    </div>
    <div class="row-btns"><button type="button" class="btn" id="tp-go">${tx('Jump across!')}</button></div>
    <div class="feedback" id="tp-fb">${tx('To catch each other, the two trapezes must swing in exactly the same rhythm. Sven is twice as heavy as Sofia. Does that matter?')}</div>`, () => {
    const fb = $('#tp-fb');
    const draw = () => {
      [['a', 110], ['b', 290]].forEach(([k, x]) => {
        const L = st[k], len = 40 + L * 22, T = swingTime(L);
        $(`#tp${k}-r`).setAttribute('y2', len); $(`#tp${k}-p`).setAttribute('transform', `translate(0,${len - 160})`);
        const g = $('#tp-' + k); g.style.animationDuration = T.toFixed(2) + 's'; g.style.transformOrigin = `${x}px 0px`;
        $(`#tp${k}-v`).textContent = tx('{L} m · one swing there and back: {T} s', { L, T: T.toFixed(1) });
      });
    };
    draw();
    $('#tpa').oninput = e => { st.a = +e.target.value; save(); draw(); };
    $('#tpb').oninput = e => { st.b = +e.target.value; save(); draw(); };
    $('#tp-go').onclick = () => {
      if(st.a === st.b){
        S.f.trapeze = true; save(); applyVisuals(); chord([523,659,784,1046]);
        fb.className = 'feedback good'; fb.textContent = tx('Same length, same rhythm: Sven catches Sofia! How fast a swing goes depends on the length of the rope, not on how heavy you are.');
        setTimeout(() => { closeModal(); say(["The Flying Svenssons swing in perfect time and catch each other in mid-air. The audience isn't even in yet, and Pippi is already clapping.", ['pippi', "Bravo! Next time, I'll be the one in the middle."]]); }, 1900);
        return;
      }
      nope(); fb.className = 'feedback bad';
      fb.textContent = tx('Swish… they miss each other, and land in the safety net. The ropes have different lengths, so they swing at different speeds. The weight doesn\'t matter.');
    };
  });
}

/* ---------- puzzle: the curtain winch (gears next to each other turn opposite ways) ---------- */
function openGears(){
  const st = S.gr || (S.gr = { n: 1 });
  openModal('The curtain winch', 'Crank → gears → curtain drum', `
    <svg class="gear-svg" viewBox="0 0 460 170" aria-hidden="true" id="gear-svg"></svg>
    <p class="flag-p">${tx('You turn the crank clockwise ↻. The curtain drum on the right must turn anticlockwise ↺ to open the curtain. How many gears go in between?')}</p>
    <div class="row-btns">${[1, 2, 3].map(n => `<button type="button" class="btn ghost gcount" data-n="${n}">${tx('{n} in between', { n })}</button>`).join('')}</div>
    <div class="row-btns"><button type="button" class="btn" id="gear-go">${tx('Turn the crank!')}</button></div>
    <div class="feedback" id="gear-fb">${tx('Two gears that touch always turn opposite ways.')}</div>`, () => {
    const fb = $('#gear-fb');
    const gear = (cx, cy, r, cls, label, odd) => {
      let teeth = ''; for(let i = 0; i < 10; i++){ const a = i * 36 + (odd ? 18 : 0); teeth += `<rect x="${cx - 5}" y="${cy - r - 8}" width="10" height="12" rx="2" fill="#c9952a" transform="rotate(${a} ${cx} ${cy})"/>`; }
      return `<g class="gear ${cls}" style="transform-origin:${cx}px ${cy}px">${teeth}<circle cx="${cx}" cy="${cy}" r="${r}" fill="#c9952a"/><circle cx="${cx}" cy="${cy}" r="${r * .35}" fill="#7a5a1a"/><path d="M${cx} ${cy - r + 4} v${r - 8}" stroke="#7a5a1a" stroke-width="4"/></g>` + (label ? `<text x="${cx}" y="${cy + r + 26}" text-anchor="middle" font-size="12" fill="#f3efe3">${label}</text>` : '');
    };
    const draw = (spin) => {
      // the gears touch: each one sits exactly one gear-width further along, and the row is centred
      const n = st.n, total = n + 2, r = 30, step = 2 * r + 10, x0 = 230 - (total - 1) * step / 2;
      let g = '';
      for(let i = 0; i < total; i++){ const cls = spin ? (i % 2 ? 'ccw' : 'cw') : ''; g += gear(x0 + i * step, 70, r, cls, i === 0 ? tx('crank ↻') : i === total - 1 ? tx('drum') : '', i % 2); }
      $('#gear-svg').innerHTML = `<rect width="460" height="170" fill="#2a1a0c"/>` + g;
      document.querySelectorAll('.gcount').forEach(b => b.classList.toggle('on', +b.dataset.n === n));
    };
    draw(false);
    document.querySelectorAll('.gcount').forEach(b => b.onclick = () => { st.n = +b.dataset.n; save(); draw(false); fb.className = 'feedback'; fb.textContent = tx('Two gears that touch always turn opposite ways.'); });
    $('#gear-go').onclick = () => {
      draw(true); beep(200, .3, 'sawtooth', .03);
      const drumCW = (st.n + 2) % 2 === 1;   // gear 0 (the crank) turns clockwise; every next gear turns the other way
      if(!drumCW){
        S.f.out4 = true; save();
        fb.className = 'feedback good'; fb.textContent = tx('Crank ↻, then ↺, ↻, and the drum turns ↺: the curtain opens! With an even number of gears in between, the last gear turns the other way from the crank.');
        setTimeout(() => { closeModal(); applyVisuals(); chord([523,659,784,1046,1318,1568]); win4(); }, 2400);
        return;
      }
      nope(); fb.className = 'feedback bad';
      fb.textContent = tx(st.n === 1 ? 'Crank ↻, middle gear ↺, drum ↻: the curtain winds up even tighter! Count the turns: each gear turns the other way from the one before.' : 'Crank ↻, ↺, ↻, ↺, and the drum ↻: tighter still! Three in between is one too many, or one too few.');
    };
  });
}

/* ---------- intro, start and win ---------- */
function intro4(){
  say([["sys", "The circus has come to town! A big red-and-white tent in the meadow, music, sawdust, and the smell of candyfloss."],
       ["pippi", "A circus! I've never been to a circus, so I'm sure I'll be very good at it."],
       ["annika", "Pippi, you're supposed to WATCH the circus. Not be in it."],
       ["sys", "Inside the big top, nothing is happening. The ringmaster is pacing up and down in front of the curtain, pulling at his moustache."],
       ["ringmaster", "Tickets, please! And then… oh dear. The show should have started ten minutes ago."],
       ["you", "First, tickets. The booth is by the entrance."]],
    () => { S.f.introDone = true; save(); });
}
function startCh4(){
  setUnlocked4();
  S = Object.assign(fresh(), { ach: S.ach || {}, ch: 4, scene: 'circus' });
  S.started = true; sel = null;
  $('#title').hidden = true; $('#win').hidden = true;
  renderInv(); applyVisuals(); $('#timer').textContent = '00:00'; save(); intro4();
}
function win4(){
  say([["sys", "The drum turns, and the red velvet curtain swings open. A drumroll! The spotlights meet in the middle of the ring."],
       ["ringmaster", "Ladies and gentlemen! The greatest show on earth!"],
       ["sys", "The trapezes swing, the clown juggles, the seal bounces its ball, and round the ring trots the circus horse… with Pippi standing on its back, on one leg."],
       ["ringmaster", "Who let her in there?!"],
       ["pippi", "You did! With a ticket! And now I'd like to lift the strongman, please."],
       ["strongman", "Nobody lifts me. Nobody has ever…"],
       ["sys", "Pippi lifts the strongman over her head, carries him once round the ring, and puts him down very gently. The whole tent stands up and cheers."],
       ["tommy", "Best circus ever."],
       ["annika", "Pippi, you were supposed to WATCH."]],
    () => showWin());
}
