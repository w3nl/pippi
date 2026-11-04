// Chapter 4: the circus has come to town, and Pippi wants to join the show.
// Loaded in order by js/boot.js; all game files share the same global scope.

const UNLOCK4 = KEY + '-ch4';
function unlocked4(){ try{ if(localStorage.getItem(UNLOCK4) === '1') return true; }catch(e){} return S.ch >= 4 || !!S.f.out3; }
function setUnlocked4(){ try{ localStorage.setItem(UNLOCK4, '1'); }catch(e){} }

const TASKS4 = ['tickets', 'symmetry', 'juggle', 'balance', 'lights'];
const stars4 = () => TASKS4.filter(k => S.f[k]).length;

function applyCircus(){
  const show = (sel, on) => { const el = $(sel); if(el) el.style.display = on ? '' : 'none'; };
  show('#ct-spunk', !S.f.spunkTaken);
  show('#ct-finale', !!S.f.out4);
  show('#ct-curtain', !S.f.out4);
  show('#ct-curtain-open', !!S.f.out4);
  show('#ct-confetti', !!S.f.out4);
  TASKS4.forEach((key, i) => show('#ct-tick' + i, !!S.f[key]));
  for(let i = 0; i < 5; i++){
    const star = $('#ct-star' + i);
    if(star) star.setAttribute('fill', i < stars4() ? '#f2c94c' : 'none');
  }
}

function goldStar4(lines){
  const n = stars4();
  say([...lines, ['pippi', n === 5 ? "Five shiny stars! I'm practically the whole circus." : tx('A gold star! {n} of 5 acts are ready.', { n })]]);
}

Object.assign(H, {
  ticket4(){ openTickets4(); },
  mirror4(){ openMirror4(); },
  juggler4(){ openJuggle4(); },
  balance4(){ openBalance4(); },
  lights4(){ openLights4(); },
  stars4(){ say(tx('The ringmaster’s board: {n} of 5 acts are ready.', { n: stars4() })); },
  curtain4(){
    if(S.f.out4) return say("The curtain is up. The crowd is still clapping, and Pippi is taking a bow with both feet.");
    if(stars4() < 5) return say(["The big red curtain. The ringmaster will open it when all five acts are ready.", tx('There are {n} of 5 gold stars on the board.', { n: stars4() })]);
    S.f.out4 = true; save(); applyVisuals(); chord([523,659,784,1046,1318]); win4();
  },
  spunk4(){ S.f.spunkTaken = true; give('spunk'); applyVisuals(); say(["The spunk has been sitting in a ticket booth, wearing a tiny paper hat.", "You take it. It looks ready to see the show for free."]); },
  pippi4(){ say(S.f.out4 ? ['pippi', "The audience clapped so hard that my plaits nearly came undone. Nearly."] : ['pippi', "I shall do five acts at once. Or perhaps one at a time, so everyone can see them."]); },
  boat4(){ say("A little painting by the tent entrance shows a ship with a smiling name on its side: Hoppetossa. The circus folk say they sail tomorrow."); }
});

function finishAct4(key, lines){
  S.f[key] = true; save(); applyVisuals(); chord([523,659,784,1046]);
  const fb = $('#c4-fb');
  if(fb){ fb.className = 'feedback good'; fb.textContent = tx(lines[0]); }
  setTimeout(() => { if(!$('#modal').hidden){ closeModal(); goldStar4(lines.slice(1)); } }, 1200);
}

function openTickets4(){
  if(S.f.tickets) return say("The ticket roll is ready: even numbers, neat as buttons. Pippi says buttons are just tiny tickets for coats.");
  openModal('The ticket booth', 'Act 1: count by twos', `
    <p class="flag-p">${tx('The tickets are numbered 12, 14, 16, 18… What number comes next?')}</p>
    <div class="c4-ticket-row" translate="no"><span>12</span><span>14</span><span>16</span><span>18</span><b>?</b></div>
    <div class="hands">${[19, 20, 22].map(n => `<button type="button" class="hand" data-ticket="${n}">${n}</button>`).join('')}</div>
    <div class="feedback" id="c4-fb"></div>`, () => {
    document.querySelectorAll('[data-ticket]').forEach(b => b.onclick = () => {
      const fb = $('#c4-fb');
      if(+b.dataset.ticket !== 20){ nope(); fb.className = 'feedback bad'; fb.textContent = tx('The numbers are getting two bigger each time. Count 18, then 19, then the next even number.'); return; }
      finishAct4('tickets', ['20! Each ticket number is two more than the one before.', 'Pippi counts the crowd in twos. She gets to eighteen kilos of sweets and loses count.']);
    });
  });
}

function mirrorChoice4(mirrored){
  const left = '<circle cx="25" cy="24" r="7" fill="#e2483d"/><circle cx="43" cy="45" r="7" fill="#f2c94c"/><circle cx="25" cy="66" r="7" fill="#3a7ac0"/>';
  const right = mirrored ? '<circle cx="75" cy="24" r="7" fill="#e2483d"/><circle cx="57" cy="45" r="7" fill="#f2c94c"/><circle cx="75" cy="66" r="7" fill="#3a7ac0"/>'
    : mirrored === 'wrong' ? '<circle cx="57" cy="24" r="7" fill="#e2483d"/><circle cx="75" cy="45" r="7" fill="#f2c94c"/><circle cx="57" cy="66" r="7" fill="#3a7ac0"/>'
      : '<circle cx="75" cy="45" r="7" fill="#f2c94c"/>';
  return `<svg viewBox="0 0 100 90" aria-hidden="true"><path d="M50 8v74" stroke="#8a6c45" stroke-dasharray="3 3"/>${left}${right}</svg>`;
}
function openMirror4(){
  if(S.f.symmetry) return say("The mirror tent's new panels match on both sides. Mr Nilsson says his face is symmetrical, but his hat disagrees.");
  openModal('The mirror tent', 'Act 2: symmetry', `
    <p class="flag-p">${tx('The left side of each panel is shown. Choose the right side that is an exact mirror image across the dotted line.')}</p>
    <div class="c4-mirror-choices">${[['mirror', 'A'], ['wrong', 'B'], ['one', 'C']].map(([key, label]) => `<button type="button" class="c4-mirror" data-mirror="${key}" aria-label="${tx('Mirror choice {label}', { label })}">${mirrorChoice4(key === 'mirror' ? true : key === 'wrong' ? 'wrong' : false)}<b>${label}</b></button>`).join('')}</div>
    <div class="feedback" id="c4-fb"></div>`, () => {
    document.querySelectorAll('[data-mirror]').forEach(b => b.onclick = () => {
      const fb = $('#c4-fb');
      if(b.dataset.mirror !== 'mirror'){ nope(); fb.className = 'feedback bad'; fb.textContent = tx('A mirror keeps each colour the same distance from the dotted line, on the opposite side.'); return; }
      finishAct4('symmetry', ['That is symmetry: every dot has a matching dot the same distance from the mirror line.', 'Pippi says she is symmetrical too. Her left sock and right sock are both on her hands.']);
    });
  });
}

function openJuggle4(){
  if(S.f.juggle) return say("The juggler's colour pattern is back in order. The balls are relieved: they were going round in circles.");
  openModal("The juggler's pattern", 'Act 3: find the repeating group', `
    <p class="flag-p">${tx('The juggler repeats the same three-ball pattern. Which colour comes next?')}</p>
    <div class="c4-balls" aria-label="Red, blue, blue, red, blue, blue, red, question mark"><i class="red"></i><i class="blue"></i><i class="blue"></i><i class="red"></i><i class="blue"></i><i class="blue"></i><i class="red"></i><b>?</b></div>
    <div class="hands"><button type="button" class="hand" data-ball="red">${tx('Red')}</button><button type="button" class="hand" data-ball="blue">${tx('Blue')}</button><button type="button" class="hand" data-ball="yellow">${tx('Yellow')}</button></div>
    <div class="feedback" id="c4-fb"></div>`, () => {
    document.querySelectorAll('[data-ball]').forEach(b => b.onclick = () => {
      const fb = $('#c4-fb');
      if(b.dataset.ball !== 'red'){ nope(); fb.className = 'feedback bad'; fb.textContent = tx('Look for the group that repeats: one red ball, then two blue balls.'); return; }
      finishAct4('juggle', ['Red, blue, blue: the three-ball pattern starts again.', 'Pippi can juggle eggs, but only if they are very hard-boiled.']);
    });
  });
}

function openBalance4(){
  if(S.f.balance) return say("The seesaw is level. The ringmaster has put a feather on it to check. The feather is winning.");
  const picked = S.bal4 || (S.bal4 = []);
  openModal('The strong-person act', 'Act 4: balance the seesaw at 8 kg', `
    <div class="c4-balance"><div class="c4-beam"><span></span></div><b>${tx('Target: 8 kg')}</b></div>
    <p class="flag-p">${tx('Choose weights from 1 kg, 3 kg and 5 kg. Make the total exactly 8 kg.')}</p>
    <div class="c4-weights">${[1, 3, 5].map(n => `<button type="button" class="c4-weight${picked.includes(n) ? ' on' : ''}" data-kg="${n}" aria-pressed="${picked.includes(n)}">${n} kg</button>`).join('')}</div>
    <div class="row-btns"><button type="button" class="btn" id="c4-weigh">${tx('Check the weight')}</button></div>
    <div class="feedback" id="c4-fb"></div>`, () => {
    const fb = $('#c4-fb');
    document.querySelectorAll('[data-kg]').forEach(b => b.onclick = () => {
      const n = +b.dataset.kg, i = picked.indexOf(n);
      if(i >= 0) picked.splice(i, 1); else picked.push(n);
      save(); b.classList.toggle('on', i < 0); b.setAttribute('aria-pressed', i < 0);
    });
    $('#c4-weigh').onclick = () => {
      const total = picked.reduce((sum, n) => sum + n, 0);
      if(total !== 8){ nope(); fb.className = 'feedback bad'; fb.textContent = tx('That makes {n} kg. Add the weights together; the target is exactly 8 kg.', { n: total }); return; }
      finishAct4('balance', ['3 kg + 5 kg = 8 kg. Equal totals balance the seesaw.', 'Pippi lifts the seesaw, the weights and the ringmaster. In that order.']);
    };
  });
}

function openLights4(){
  if(S.f.lights) return say("The spotlights are glowing. The ringmaster says, 'Brilliant!' Pippi says, 'I know.'");
  openModal('The spotlight', 'Act 5: complete the circuit', `
    <p class="flag-p">${tx('The bulb only lights when electricity has a complete loop from the battery, through the wires and switch, and back again.')}</p>
    <svg class="c4-circuit" viewBox="0 0 320 150" aria-label="${tx('A battery, switch and bulb connected by wires')}">
      <path d="M70 35H113M151 35H198M240 35H266V112H70V92M70 50V35" fill="none" stroke="#697c88" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M70 50V35" fill="none" stroke="#697c88" stroke-width="6"/>
      <path d="M70 62v30" stroke="#dc4f42" stroke-width="5"/><path d="M58 67h24M62 84h16" stroke="#f2c94c" stroke-width="4"/>
      <circle id="c4-bulb" cx="220" cy="35" r="22" fill="#263a47" stroke="#f2c94c" stroke-width="4"/><path d="M210 59h20v9h-20z" fill="#89939b"/>
      <g id="c4-rays" stroke="#f2c94c" stroke-width="3"><path d="M220 3v-10M188 35h-10M252 35h10M197 12l-7-7M243 12l7-7"/></g>
      <circle cx="70" cy="35" r="5" fill="#f2c94c"/><circle cx="70" cy="112" r="5" fill="#f2c94c"/>
      <path id="c4-switch-wire" d="M113 35l25-13" stroke="#e2483d" stroke-width="5" stroke-linecap="round"/>
      <circle cx="113" cy="35" r="5" fill="#e2483d"/><circle cx="151" cy="35" r="5" fill="#e2483d"/>
    </svg>
    <div class="hands"><button type="button" class="hand" id="c4-switch" aria-pressed="false">${tx('Close the switch')}</button></div>
    <div class="row-btns"><button type="button" class="btn" id="c4-test">${tx('Test the lights')}</button></div>
    <div class="feedback" id="c4-fb"></div>`, () => {
    const draw = () => {
      $('#c4-switch').textContent = tx(S.closed4 ? 'Open the switch' : 'Close the switch');
      $('#c4-switch').setAttribute('aria-pressed', !!S.closed4);
      $('#c4-switch-wire').setAttribute('d', S.closed4 ? 'M113 35h38' : 'M113 35l25-13');
      $('#c4-bulb').setAttribute('fill', S.closed4 ? '#f2c94c' : '#263a47');
      $('#c4-rays').style.opacity = S.closed4 ? '1' : '.15';
    };
    draw();
    $('#c4-switch').onclick = () => { S.closed4 = !S.closed4; save(); draw(); };
    $('#c4-test').onclick = () => {
      const fb = $('#c4-fb');
      if(!S.closed4){ nope(); fb.className = 'feedback bad'; fb.textContent = tx('The switch is open, so the loop has a gap. Close it and try again.'); return; }
      finishAct4('lights', ['The switch closes the loop. Current can flow all the way around, so the bulb lights.', 'Pippi wants a spotlight on every sweet in the tent. The ringmaster suggests starting with the stage.']);
    };
  });
}

function intro4(){
  say([['sys', 'The circus has come to town. Beyond its bright striped tent, the harbour shines in the evening light.'],
       ['pippi', "A circus! I have never been the star of one before, so I'm sure I can."],
       ['tommy', 'The ringmaster says the show cannot start until five little jobs are done.'],
       ['annika', 'Each finished act gets a gold star. Then the curtain can go up.'],
       ['pippi', 'Five jobs? I can do them all at once. But first, I shall do them one at a time.'],
       ['sys', 'A ticket roll, a mirror tent, a juggler, a seesaw and a dark spotlight wait around the big top.']]);
}
function startCh4(){
  setUnlocked4();
  S = Object.assign(fresh(), { ach: S.ach || {}, ch: 4, scene: 'circus' });
  S.started = true; sel = null;
  $('#title').hidden = true; $('#win').hidden = true;
  renderInv(); applyVisuals(); $('#timer').textContent = '00:00'; save(); intro4();
}
function win4(){
  say([['sys', 'The curtain rises. The crowd cheers as Pippi takes her place in the ring.'],
       ['pippi', 'I shall juggle, balance and count tickets. Perhaps not all at the same time.'],
       ['tommy', 'That was the best circus show I have ever seen.'],
       ['annika', 'The ringmaster has invited everyone aboard the Hoppetossa tomorrow!'],
       ['pippi', 'A ship! I shall pack eighteen kilos of sweets. A sensible amount for a short trip.']], () => showWin());
}