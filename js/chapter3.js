// Chapter 3: Pippi goes to school. The teacher has turned the classroom into an escape room.
// Loaded in order by js/boot.js; all game files share the same global scope.

const UNLOCK3 = KEY + '-ch3';
function unlocked3(){ try{ if(localStorage.getItem(UNLOCK3) === '1') return true; }catch(e){} return S.ch >= 3 || (S.ch === 2 && !!S.f.out2); }
function setUnlocked3(){ try{ localStorage.setItem(UNLOCK3, '1'); }catch(e){} }

/* ---------- Chapter 3 items ---------- */
Object.assign(ITEMS, {
  knife: { name:'Cake knife', desc:"From the teacher's drawer. For sharing, not for prising open cupboards.",
    svg:'<svg viewBox="0 0 44 44"><path d="M6 30 L30 10 q6 -2 6 4 L14 36z" fill="#cfd4d8" stroke="#8a8f96" stroke-width="1.5"/><rect x="4" y="30" width="14" height="7" rx="3" transform="rotate(-40 11 33)" fill="#8a5a2b"/></svg>' },
  ckey: { name:'Little key', desc:'A little brass key, still a bit creamy. Pippi baked it into her cake "to keep it safe".',
    svg:'<svg viewBox="0 0 44 44"><circle cx="14" cy="22" r="7" fill="none" stroke="#c9952a" stroke-width="3.5"/><path d="M21 22h16M32 22v5M36 22v4" stroke="#c9952a" stroke-width="3.5" stroke-linecap="round"/><circle cx="10" cy="16" r="3" fill="#fff4f7"/></svg>' },
  dkey: { name:'Classroom key', desc:'The key to the classroom door, from the prize box. Freedom! And summer!',
    svg:'<svg viewBox="0 0 44 44"><circle cx="13" cy="22" r="8" fill="none" stroke="#9aa0a6" stroke-width="4"/><path d="M21 22h18M33 22v7M38 22v5" stroke="#9aa0a6" stroke-width="4" stroke-linecap="round"/><rect x="8" y="30" width="14" height="8" rx="2" fill="#c4302b"/></svg>' }
});

/* ---------- the classroom ---------- */
function applyClassroom(){
  const show = (sel, on) => { const el = $(sel); if(el) el.style.display = on ? '' : 'none'; };
  show('#cl-spunk', !S.f.spunkTaken); show('#hit-spunk3', !S.f.spunkTaken);
  show('#cl-cakewhole', !S.f.cut); show('#cl-cakecut', !!S.f.cut);
  show('#cl-cuplock', !S.f.cupOpen);
  show('#cl-frog', !S.f.frog);
  show('#cl-globe-seam', !!S.f.plan);
  show('#cl-teacher', !S.f.out3);
  $('#cl-doorled').setAttribute('fill', S.f.out3 ? '#9fdc6e' : '#e2483d');
}

/* ---------- hotspot handlers ---------- */
Object.assign(H, {
  spunk3(){ S.f.spunkTaken = true; give('spunk'); applyVisuals(); say(["The spunk's jam jar, on the ledge under the blackboard. Pippi brought it to school.", "\"It wanted to learn something,\" she says. You take it. A spunk knows things, even at school."]); },
  board3(){ openBoard3(); },
  nine(){ openNine(); },
  clock3(){ say(["The classroom clock: the big hand is on the 10 and the little hand nearly on the 12. Ten to twelve.", "At twelve the bell rings, and then: SUMMER HOLIDAYS. If you're out of the classroom by then."]); },
  plan(){ openPlan(); },
  register(){ openRegister(); },
  tdesk(){
    if(S.f.knife) return say("The teacher's desk. The drawer is open and empty now, except for a red pen and a very old apple.");
    say(["The teacher's desk. Its drawer is locked, with a note taped to it:", "\"Opens when the REGISTER is in order. — Miss\""]);
  },
  cake(){
    if(S.f.cut) return say("What's left of Pippi's cake: eight fair slices, minus the ones Pippi has already eaten. That's most of them.");
    say(["Pippi's cake. It's enormous: pink, with three cherries and a big P on the side.", ['pippi', "I baked it myself! I'm sharing it with everybody. Fairly! Mostly fairly."], "You'll need something to cut it with."]);
  },
  cupboard(){
    if(S.f.frog){ S.ach.frogkiss = true; save(); return say(["The frog sits on the cupboard, looking very grown-up. You give it a little kiss.", "It stays a frog. It does look pleased, though."]); }
    if(S.f.cupOpen) return openFrog();
    say(["The nature cupboard, with jars of pond water, a tank, and a frog that looks bored. The glass doors are locked with a little brass lock.", ['pippi', "I hid that little key! Somewhere nobody will ever look. Somewhere delicious."]]);
  },
  globe(){
    if(S.f.out3 || S.f.boxOpen) return say("The globe, open like a box. The prize box is empty: you've got the key and the certificates.");
    if(S.f.plan) return openPrize();
    say(["A big globe. Pippi spins it and points: \"That's where my father is king! Somewhere about… here.\"", "She's pointing at the ceiling."]);
  },
  pippi3(){
    S.f.pippiTaps = (S.f.pippiTaps || 0) + 1; save();
    const lines = [
      ['pippi', "School is lovely! You sit down, somebody tells you things, and then you get holidays. I should have come years ago."],
      ['pippi', "Do you know what nine times seven is? A LOT. That's my answer for everything with a nine in it."],
      ['pippi', "I could just lift the door off its hinges. But the teacher says that's cheating. I've never cheated, so I'm sure I'd be very good at it."]
    ];
    say([lines[(S.f.pippiTaps - 1) % lines.length]]);
  },
  teacher(){
    if(S.f.out3) return say(['teacher', "Wonderful work! Off you go. Have a lovely summer."]);
    say([['teacher', "No peeking for help through the window! Well… one little tip: read the blackboard. It tells you what to do, step by step."]]);
  },
  cdoor(){
    if(S.f.out3) return say("The classroom door is open. Outside, the whole school is cheering. Summer holidays!");
    say(["The classroom door. Locked, and the teacher has the key… no, wait: she says the key is in the prize box.", ['teacher', "Find the prize box, and you find the way out!"]]);
  }
});

/* ---------- the blackboard: the teacher's rules ---------- */
function openBoard3(){
  S.f.readBoard = true; save();
  openModal('The blackboard', "The teacher's escape room", `
    <div class="chalk">
      <p class="ch-h">${tx('ESCAPE THE CLASSROOM!')}</p>
      <ol>
        <li>${tx('Put the REGISTER in order, from A to Z. It opens my drawer.')}</li>
        <li>${tx('Share Pippi\'s CAKE fairly: everybody in our class gets the same.')}</li>
        <li>${tx('Help the NATURE CUPBOARD grow up, from egg to frog.')}</li>
        <li>${tx('The PLAN of our classroom shows where the prize is hidden.')}</li>
        <li>${tx('The prize box opens with 9 × 7. Use the poster!')}</li>
      </ol>
      <p class="ch-sig">${tx('— Miss')}</p>
      <p class="ch-pippi">9 × 7 = ${tx('a LOT')} &nbsp;—P.</p>
    </div>`);
}

/* ---------- puzzle: the register (alphabetical order) ---------- */
const REG_NAMES = ['Tommy', 'Olle', 'Annika', 'Pippi', 'Kalle', 'Axel', 'Britta'];
const REG_SORTED = [...REG_NAMES].sort();
function openRegister(){
  if(S.f.knife) return say(["The register, now in perfect order: Annika, Axel, Britta, Kalle, Olle, Pippi, Tommy.", "Pippi has written \"PRESENT!!!\" next to her name. Three times."]);
  const reg = S.reg || (S.reg = [...REG_NAMES]);
  openModal('The register', 'Class 3 · the names must go from A to Z', `
    <ol class="register" id="reg-list"></ol>
    <div class="row-btns"><button type="button" class="btn" id="reg-done">${tx('Done!')}</button></div>
    <div class="feedback" id="reg-fb">${tx('Move the names up and down until they are in alphabetical order.')}</div>`, () => {
    const draw = () => {
      $('#reg-list').innerHTML = reg.map((n, i) => `<li><span translate="no">${n}</span>
        <button type="button" class="mv" data-i="${i}" data-d="-1" aria-label="${tx('Move {name} up', { name: n })}" ${i === 0 ? 'disabled' : ''}>▲</button>
        <button type="button" class="mv" data-i="${i}" data-d="1" aria-label="${tx('Move {name} down', { name: n })}" ${i === reg.length - 1 ? 'disabled' : ''}>▼</button></li>`).join('');
      document.querySelectorAll('.mv').forEach(b => b.onclick = () => {
        const i = +b.dataset.i, j = i + +b.dataset.d; [reg[i], reg[j]] = [reg[j], reg[i]]; save(); beep(500 + j * 40, .03); draw();
      });
    };
    draw();
    $('#reg-done').onclick = () => {
      const fb = $('#reg-fb');
      const k = reg.findIndex((n, i) => i > 0 && reg[i - 1] > n);
      if(k < 0){
        S.f.registered = true; S.f.knife = true; save(); give('knife'); applyVisuals(); chord([523,659,784,1046]);
        fb.className = 'feedback good'; fb.textContent = tx('A to Z! Click: the teacher\'s drawer springs open.');
        setTimeout(() => { closeModal(); say(["In the drawer: a cake knife, and a card in the teacher's neat handwriting: \"Step 2: Pippi's cake. Fair shares!\"", "You take the knife."]); }, 1500);
        return;
      }
      nope(); fb.className = 'feedback bad';
      const a = reg[k - 1], b = reg[k];
      fb.textContent = a[0] === b[0]
        ? tx('{a} and {b} both start with {l}. Then look at the second letter: {x} comes before {y}.', { a, b, l: a[0], x: b[1], y: a[1] })
        : tx('{a} is above {b}, but {y} comes after {x} in the alphabet.', { a, b, x: b[0], y: a[0] });
    };
  });
}

/* ---------- puzzle: the cake (fractions) ---------- */
const CLASS_SIZE = 8;   // seven names in the register, plus the teacher
function openCake(){
  const st = S.cake || (S.cake = { n: 4 });
  openModal("Pippi's cake", 'Everybody in our class gets the same', `
    <div class="cake-wrap">
      <svg class="cake-svg" viewBox="0 0 220 220" aria-hidden="true"><circle cx="110" cy="110" r="100" fill="#f2a7b8" stroke="#fff4f7" stroke-width="8"/><g id="cake-lines"></g><circle cx="110" cy="110" r="10" fill="#c4302b"/></svg>
      <div class="cake-ctl">
        <div class="stepper"><button type="button" class="btn ghost" id="ck-minus" aria-label="${tx('Fewer slices')}">−</button><b id="ck-n"></b><button type="button" class="btn ghost" id="ck-plus" aria-label="${tx('More slices')}">+</button></div>
        <div class="ck-l">${tx('slices')}</div>
        <button type="button" class="btn" id="ck-cut">${tx('Cut!')}</button>
      </div>
    </div>
    <div id="ck-q" class="ck-q" hidden>
      <p>${tx('Now, how big is one slice?')}</p>
      <div class="row-btns">${['1/2', '1/4', '1/8', '8'].map(v => `<button type="button" class="btn ghost frac" data-v="${v}">${v}</button>`).join('')}</div>
    </div>
    <div class="feedback" id="ck-fb">${tx('Count everybody in our class: the register knows who the children are. And don\'t forget the teacher!')}</div>`, () => {
    const fb = $('#ck-fb');
    const draw = () => {
      $('#ck-n').textContent = st.n;
      let l = '';
      if(st.n > 1) for(let i = 0; i < st.n; i++){ const a = i / st.n * Math.PI * 2 - Math.PI / 2; l += `<line x1="110" y1="110" x2="${(110 + 100 * Math.cos(a)).toFixed(1)}" y2="${(110 + 100 * Math.sin(a)).toFixed(1)}" stroke="#7a1e14" stroke-width="3"/>`; }
      $('#cake-lines').innerHTML = l;
    };
    draw();
    $('#ck-minus').onclick = () => { st.n = Math.max(1, st.n - 1); save(); draw(); beep(400, .03); };
    $('#ck-plus').onclick = () => { st.n = Math.min(12, st.n + 1); save(); draw(); beep(500, .03); };
    $('#ck-cut').onclick = () => {
      if(st.n === 1){ S.ach.wholecake = true; save(); nope(); fb.className = 'feedback bad'; fb.textContent = tx('One slice? Pippi grabs it: "Thank you! The whole cake, just for me!" That isn\'t sharing. How many people are in the class?'); return; }
      if(st.n === CLASS_SIZE - 1){ nope(); fb.className = 'feedback bad'; fb.textContent = tx('Seven slices: one for every child in the register. And the teacher? She looks very sad through the window.'); return; }
      if(st.n !== CLASS_SIZE){ nope(); fb.className = 'feedback bad'; fb.textContent = tx(st.n < CLASS_SIZE ? '{n} slices for 8 people? Somebody gets nothing, and it might be you. Count again: the register, plus the teacher.' : '{n} slices for 8 people? Some get two and some get one. That isn\'t fair.', { n: st.n }); return; }
      S.f.cut = true; save(); applyVisuals(); beep(300, .12);
      fb.className = 'feedback good'; fb.textContent = tx('Eight equal slices, one for everybody. Clunk! The knife hits something hard inside…');
      $('#ck-cut').disabled = true; $('#ck-q').hidden = false;
      document.querySelectorAll('.frac').forEach(b => b.onclick = () => {
        if(b.dataset.v !== '1/8'){ nope(); fb.className = 'feedback bad';
          fb.textContent = tx(b.dataset.v === '8' ? "8 is how many slices there are. But how big is ONE of them, compared with the whole cake?" : 'Then you would only need {d} slices. You cut it into 8.', { d: b.dataset.v.split('/')[1] }); return; }
        S.f.cakeDone = true; save(); give('ckey'); chord([523,659,784,1046]);
        fb.className = 'feedback good'; fb.textContent = tx('One eighth: 1/8! The whole cake is 8/8. And in one of the slices: a little brass key.');
        setTimeout(() => { closeModal(); say([['pippi', "There's my key! I baked it in to keep it safe. Nobody looks inside a cake. Except for cake."], "A little brass key, a bit creamy. You lick it clean. Well, you wipe it."]); }, 1700);
      });
    };
  });
}

/* ---------- puzzle: the nature cupboard (the life cycle of a frog) ---------- */
const FROG_STAGES = [
  ['spawn', 'Frog spawn: eggs in jelly'],
  ['tadpole', 'Tadpole: a head and a tail'],
  ['legs', 'Tadpole with back legs'],
  ['froglet', 'Froglet: four legs and a short tail'],
  ['frog', 'Frog']
];
const FROG_SHOWN = [3, 0, 4, 1, 2];   // the order the cards lie on the shelf
const FROG_SVG = {
  spawn: '<g fill="#cfe6e0" stroke="#7aa"><circle cx="30" cy="30" r="9"/><circle cx="46" cy="28" r="9"/><circle cx="38" cy="42" r="9"/><circle cx="22" cy="44" r="9"/><circle cx="52" cy="44" r="9"/></g><g fill="#1a1a1a"><circle cx="30" cy="30" r="3"/><circle cx="46" cy="28" r="3"/><circle cx="38" cy="42" r="3"/><circle cx="22" cy="44" r="3"/><circle cx="52" cy="44" r="3"/></g>',
  tadpole: '<ellipse cx="28" cy="36" rx="12" ry="9" fill="#3a3a2a"/><path d="M38 36 q14 -8 26 4 q-12 4 -26 -4z" fill="#3a3a2a"/>',
  legs: '<ellipse cx="28" cy="34" rx="12" ry="9" fill="#4a5a2a"/><path d="M38 34 q14 -8 26 4 q-12 4 -26 -4z" fill="#4a5a2a"/><path d="M30 42 l-6 10 M36 41 l4 10" stroke="#4a5a2a" stroke-width="3"/>',
  froglet: '<ellipse cx="34" cy="38" rx="14" ry="10" fill="#3f8a4a"/><path d="M47 38 l12 0" stroke="#3f8a4a" stroke-width="4" stroke-linecap="round"/><path d="M24 46 l-8 8 M42 46 l6 8 M26 32 l-8 -6 M42 32 l6 -6" stroke="#3f8a4a" stroke-width="3"/><circle cx="28" cy="32" r="2" fill="#111"/>',
  frog: '<ellipse cx="38" cy="40" rx="18" ry="12" fill="#3f8a4a"/><circle cx="28" cy="28" r="6" fill="#3f8a4a"/><circle cx="48" cy="28" r="6" fill="#3f8a4a"/><circle cx="28" cy="27" r="2.6" fill="#111"/><circle cx="48" cy="27" r="2.6" fill="#111"/><path d="M20 50 q-8 6 -12 2 M56 50 q8 6 12 2" stroke="#3f8a4a" stroke-width="5" stroke-linecap="round" fill="none"/>'
};
function openFrog(){
  const st = S.frg || (S.frg = []);   // indexes into FROG_STAGES, in the order placed
  openModal('The nature cupboard', 'From egg to frog: put them in order', `
    <div class="frog-row" id="frog-slots"></div>
    <div class="frog-row cards" id="frog-cards"></div>
    <div class="row-btns"><button type="button" class="btn ghost" id="frog-reset">${tx('Start again')}</button></div>
    <div class="feedback" id="frog-fb">${tx('Click the pictures in the right order, from the very beginning of a frog\'s life.')}</div>`, () => {
    const fb = $('#frog-fb');
    const card = i => `<svg viewBox="0 0 76 64" aria-hidden="true">${FROG_SVG[FROG_STAGES[i][0]]}</svg><span>${tx(FROG_STAGES[i][1])}</span>`;
    const draw = () => {
      $('#frog-slots').innerHTML = [0,1,2,3,4].map(k => `<div class="fslot">${st[k] !== undefined ? card(st[k]) : `<b>${k + 1}</b>`}</div>`).join('');
      $('#frog-cards').innerHTML = FROG_SHOWN.map(i => st.includes(i) ? '<div class="fcard gone"></div>' : `<button type="button" class="fcard" data-i="${i}">${card(i)}</button>`).join('');
      document.querySelectorAll('.fcard[data-i]').forEach(b => b.onclick = () => pick(+b.dataset.i));
    };
    const pick = i => {
      const want = st.length;
      if(i !== want){ nope(); fb.className = 'feedback bad';
        fb.textContent = i > want ? tx('Not yet! First comes: {what}.', { what: want === 0 ? tx('the very beginning: eggs') : tx('the next small change') }) : tx('That one came earlier.');
        if(want === 0 && i === 4) fb.textContent = tx('A frog first? Then where did it come from? Start with the eggs.');
        return; }
      st.push(i); save(); beep(400 + i * 80, .07);
      fb.className = 'feedback good'; fb.textContent = tx(['Frog spawn: hundreds of eggs in jelly, floating in the pond.', 'The eggs hatch into tadpoles. They breathe under water, like fish.', 'The tadpole grows its back legs first…', '…then its front legs, while its tail gets shorter and shorter.', 'A frog! Now it breathes air and hops about on land.'][i]);
      draw();
      if(st.length === 5){
        S.f.frog = true; save(); applyVisuals(); chord([523,659,784,1046]);
        setTimeout(() => { closeModal(); say(["The frog in the tank gives a big \"Ribbit!\" and hops out onto the top of the cupboard, very proud of having grown up.", "Under the stone where it sat, there's a folded note: \"The prize is hidden at A2 on the plan of our classroom. — Miss\""]); }, 1700);
      }
    };
    draw();
    $('#frog-reset').onclick = () => { st.length = 0; save(); fb.className = 'feedback'; fb.textContent = tx('Start again from the very beginning.'); draw(); };
  });
}

/* ---------- puzzle: the plan of the classroom (grid references) ---------- */
const PLAN = {
  A1: '9-times poster', B1: 'blackboard', C1: 'blackboard', D1: 'blackboard', E1: 'plan of the classroom', F1: 'clock',
  A2: 'nature cupboard, with the globe on top', B2: 'empty floor', C2: 'empty floor', D2: 'empty floor', E2: 'empty floor', F2: 'classroom door',
  A3: 'wastepaper basket', B3: "teacher's desk", C3: 'pupils\' desks', D3: 'pupils\' desks', E3: "Pippi's cake", F3: 'coat pegs',
  A4: 'bookshelf', B4: 'empty floor', C4: 'pupils\' desks', D4: 'pupils\' desks', E4: 'empty floor', F4: 'umbrella stand'
};
const PLAN_ICON = { 'blackboard':'▬', 'nature cupboard, with the globe on top':'◍', "teacher's desk":'▭', "pupils' desks":'▪', "Pippi's cake":'◉', 'classroom door':'▯', 'clock':'◷', 'plan of the classroom':'▦', '9-times poster':'9', 'coat pegs':'⌐', 'bookshelf':'≡', 'wastepaper basket':'◡', 'umbrella stand':'☂', 'empty floor':'' };
function openPlan(){
  const cols = 'ABCDEF', rows = [1,2,3,4];
  openModal('Plan of our classroom', 'A letter across, then a number down', `
    <div class="plan-grid" role="grid">
      <span></span>${[...cols].map(c => `<b>${c}</b>`).join('')}
      ${rows.map(r => `<b>${r}</b>${[...cols].map(c => { const ref = c + r, what = PLAN[ref]; return `<button type="button" class="pcell${what === 'empty floor' ? ' empty' : ''}" data-ref="${ref}" aria-label="${ref}: ${tx(what)}">${PLAN_ICON[what] || ''}</button>`; }).join('')}`).join('')}
    </div>
    <div class="feedback" id="plan-fb">${tx(S.f.frog ? 'The frog\'s note says: the prize is hidden at A2. Find A2 on the plan.' : 'Each square has a name: first its letter (across the top), then its number (down the side). Click a square.')}</div>`, () => {
    document.querySelectorAll('.pcell').forEach(b => b.onclick = () => {
      const ref = b.dataset.ref, fb = $('#plan-fb'), what = tx(PLAN[ref]);
      if(ref === 'A2' && S.f.frog && !S.f.plan){
        S.f.plan = true; save(); applyVisuals(); chord([523,659,784,1046]);
        fb.className = 'feedback good'; fb.textContent = tx('A2: column A, row 2. The nature cupboard… and on top of it, the globe!');
        setTimeout(() => { closeModal(); say(["The prize is hidden at A2: the nature cupboard, with the globe on top.", "Look: the globe has a thin line all the way round its middle. It opens!"]); }, 1700);
        return;
      }
      fb.className = 'feedback';
      fb.textContent = tx('{ref}: {what}.', { ref, what }) + (S.f.frog && !S.f.plan ? ' ' + tx('Not A2: the letter goes across, the number goes down.') : '');
    });
  });
}

/* ---------- puzzle: the prize box (the 9-times finger trick) ---------- */
function openNine(){
  openModal('The 9-times trick', 'A poster, with ten paper fingers', `
    ${fingerTrick()}
    <p class="flag-p">${tx('Hold up ten fingers. For 9 × 4, fold down the 4th finger. The fingers to its left are the tens (3), the fingers to its right are the ones (6): 9 × 4 = 36.')}</p>`, bindFingers);
}
function fingerTrick(){
  return `<div class="fingers" id="fingers">${[1,2,3,4,5,6,7,8,9,10].map(n => `<button type="button" class="finger" data-n="${n}" aria-label="${tx('Fold down finger {n}', { n })}"><span>${n}</span></button>`).join('')}</div>
    <div class="finger-out" id="finger-out">${tx('Click a finger to fold it down.')}</div>`;
}
function bindFingers(){
  document.querySelectorAll('.finger').forEach(b => b.onclick = () => {
    const n = +b.dataset.n;
    document.querySelectorAll('.finger').forEach(f => f.classList.toggle('down', f === b));
    beep(300 + n * 50, .05);
    if(n === 10){ S.ach.fingers = true; save(); }
    $('#finger-out').textContent = tx('9 × {n}: {l} fingers on the left, {r} on the right. That makes {res}.', { n, l: n - 1, r: 10 - n, res: 9 * n });
  });
}
function openPrize(){
  const dig = S.prz || (S.prz = [0, 0]);
  openModal('The prize box', 'Inside the globe · a lock with two wheels', `
    <p class="flag-p">${tx('The lid says: 9 × 7')}</p>
    ${fingerTrick()}
    <div class="padlock">${[0,1].map(i => `<div class="wheel"><button type="button" class="up" data-w="${i}" aria-label="${tx('Wheel {n} up', { n: i + 1 })}">▲</button><b id="pw${i}">${dig[i]}</b><button type="button" class="dn" data-w="${i}" aria-label="${tx('Wheel {n} down', { n: i + 1 })}">▼</button></div>`).join('')}
      <button type="button" class="btn" id="prize-try">${tx('Open')}</button></div>
    <div class="feedback" id="prize-fb"></div>`, body => {
    bindFingers();
    body.querySelectorAll('.wheel button').forEach(b => b.onclick = () => { const i = +b.dataset.w; dig[i] = (dig[i] + (b.classList.contains('up') ? 1 : 9)) % 10; save(); $('#pw' + i).textContent = dig[i]; beep(520, .02); });
    $('#prize-try').onclick = () => {
      const v = dig[0] * 10 + dig[1], fb = $('#prize-fb');
      if(v === 63){
        S.f.boxOpen = true; save(); give('dkey'); applyVisuals(); chord([523,659,784,1046,1318]);
        fb.className = 'feedback good'; fb.textContent = tx('63! The lid pops open: the classroom key, and a pile of certificates with gold stars.');
        setTimeout(() => { closeModal(); say(["Nine times seven is sixty-three: six fingers on the left, three on the right.", ['pippi', "Sixty-three! That's what I meant by A LOT."], "You take the classroom key."]); }, 1700);
        return;
      }
      nope(); fb.className = 'feedback bad';
      fb.textContent = tx(v === 99 ? '99 is a LOT, Pippi agrees. But the lock wants exactly 9 × 7.' : v === 36 ? "That's 9 × 4, the example on the poster. You need 9 × 7: fold down the 7th finger." : v === 16 ? "9 + 7 is 16. But the lid says 9 TIMES 7." : 'The lock stays shut. Fold down the 7th finger and count the fingers on each side.');
    };
  });
}

/* ---------- intro, start and win ---------- */
function intro3(){
  say([["sys", "The little school in town, on the very last morning before the summer holidays."],
       ["teacher", "Good morning! Today is special: I've turned our classroom into an escape room. Tommy and Annika's group has already escaped. Now it's your turn, with Pippi."],
       ["pippi", "An escape room! I've never done one, so I'm sure I can!"],
       ["teacher", "I'll lock the door and wait outside. Everything you need is in here, and the rules are on the blackboard."],
       ["sys", "Click. The key turns, and the teacher's face appears in the little window in the door."],
       ["pippi", "I could just lift the door off its hinges…"],
       ["teacher", "No lifting doors, Pippi!"],
       ["you", "Let's read the blackboard first."]],
    () => { S.f.introDone = true; save(); });
}
function startCh3(){
  setUnlocked3();
  S = Object.assign(fresh(), { ach: S.ach || {}, ch: 3, scene: 'classroom' });
  S.started = true; sel = null;
  $('#title').hidden = true; $('#win').hidden = true;
  renderInv(); applyVisuals(); $('#timer').textContent = '00:00'; save(); intro3();
}
function win3(){
  say([["sys", "The key turns. The door swings open, and the school bell rings: twelve o'clock!"],
       ["teacher", "You did it! The register, the cake, the frog, the plan and the nine-times table. I'm very proud of you."],
       ["tommy", "You took longer than us. But you had Pippi."],
       ["annika", "Did you really share the cake fairly? There's only one slice left."],
       ["teacher", "Here are your certificates. And Pippi, this one is for you: \"For the most surprising sums\"."],
       ["pippi", "A certificate! And now I get summer holidays too. That's why I came to school in the first place!"]],
    () => showWin());
}
