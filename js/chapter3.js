// Chapter 3: Pippi goes to school, on the last morning before the summer holidays.
// Loaded in order by js/boot.js; all game files share the same global scope.

const UNLOCK3 = KEY + '-ch3';
function unlocked3(){ try{ if(localStorage.getItem(UNLOCK3) === '1') return true; }catch(e){} return S.ch >= 3 || !!S.f.out2; }
function setUnlocked3(){ try{ localStorage.setItem(UNLOCK3, '1'); }catch(e){} }

/* The five tasks on the blackboard. Each one earns Pippi a gold star; five stars and the bell may ring. */
const TASKS3 = ['nines', 'abc', 'bugs', 'cake', 'seasons'];
const stars3 = () => TASKS3.filter(k => S.f[k]).length;

/* ---------- Chapter 3 items ---------- */
Object.assign(ITEMS, {
  chalk: { name:'Chalk', desc:"A stick of white chalk from Miss's drawer. For the blackboard, not for Mr Nilsson.",
    svg:'<svg viewBox="0 0 44 44"><g transform="rotate(-25 22 22)"><rect x="7" y="17" width="30" height="10" rx="4" fill="#f6f1e6" stroke="#c9c2b2" stroke-width="1.5"/><rect x="7" y="17" width="7" height="10" rx="3" fill="#e9e3d6"/></g></svg>' },
  magnifier: { name:'Magnifying glass', desc:'Makes small things big. Select it, then click something tiny.',
    svg:'<svg viewBox="0 0 44 44"><circle cx="18" cy="18" r="11" fill="#cfe7fb" fill-opacity=".55" stroke="#c9952a" stroke-width="4"/><path d="M26 26 l11 11" stroke="#6b4423" stroke-width="6" stroke-linecap="round"/><path d="M12 14 q3-5 8-5" stroke="#fff" stroke-width="2" fill="none"/></svg>' }
});

/* ---------- drawing the classroom ---------- */
const NINES3 = [9, 18, 27, 36, 54, 54, 63, 27, 81, 100];   // Pippi's pluttification: 9 × 5, 9 × 8 and 9 × 10 are wrong
const NINES3_WRONG = [4, 7, 9];
function applySchool(){
  const show = vis;   // smooth when you can see it happen (core.js)
  show('#sl-spunk', !S.f.spunkTaken); show('#hit-spunk3', !S.f.spunkTaken);
  show('#sl-lock', !S.f.drawer);
  TASKS3.forEach((k, i) => show('#sl-tick' + i, !!S.f[k]));
  const n = stars3();
  for(let i = 0; i < 5; i++){ const st = $('#sl-star' + i); if(st) st.setAttribute('fill', i < n ? '#f2c94c' : 'none'); }
  [[5, 4], [8, 7], [10, 9]].forEach(([m, i]) => { const t = $('#sl-n' + m); if(t) t.textContent = `9×${m}=${S.f.nines ? 9 * m : NINES3[i]}`; });
  show('#sl-hol', !!S.f.out3);
  show('#sl-teacher', !S.f.out3);
  const snow = $('#sl-snow');
  if(snow && !snow.firstChild){
    let fl = '';
    for(let i = 0; i < 26; i++) fl += `<circle class="sl-flake" style="animation-delay:-${(i * .61 % 6).toFixed(2)}s;animation-duration:${5 + i % 4}s" cx="${56 + (i * 97) % 228}" cy="${124 + (i * 151) % 292}" r="${1.4 + (i % 3) * .7}"/>`;
    snow.innerHTML = fl;
  }
  ['#sl-snow', '#sl-white', '#sl-whitecap'].forEach(s => show(s, !!S.f.snow3));
}

/* Annika sticks a gold star on Pippi's chart after every task. */
function goldStar3(lines){
  const n = stars3();
  say([...lines, ['annika', n >= 5 ? "That's five gold stars! Every task on the blackboard is done. Now the holidays can start, as soon as the bell rings."
    : n === 4 ? 'Gold star number 4! Just one more to go.' : tx('Gold star number {n}! Only {left} to go.', { n, left: 5 - n })]]);
}

/* ---------- hotspot handlers ---------- */
Object.assign(H, {
  spunk3(){ S.f.spunkTaken = true; give('spunk'); applyVisuals(); say(["The spunk, in its jam jar on Pippi's desk. Pippi has brought it to school. \"It wants to learn things,\" she says.", "You take it. A spunk knows things, even at school. Especially at school."]); },
  horse3(){
    S.f.horse3 = (S.f.horse3 || 0) + 1;
    gag('#sl-horsebox', 'gag-hop', 1100); gagText('Pfrrrr!'); chord([200, 260], 120);
    if(S.f.horse3 === 3) say(['teacher', "My geraniums! Would somebody please take that horse home after school?"]);
  },
  window3(){
    if(S.f.snow3) return say("The schoolyard is white with snow. The horse is trying to catch snowflakes on its tongue. It's on holiday too.");
    if(S.f.out3) return say("The horse is lying in the sun in the schoolyard, full of geraniums. It's on holiday too.");
    say(["Out in the schoolyard, Pippi's horse is eating Miss's flowerbed, one geranium at a time.", "Miss chased it round and round for a while. The horse thought it was a game, and won. Now she's watching you all through the little window in the door instead."]);
  },
  board(){ openBoard(); },
  tables(){ openTables(); },
  romans(){ openRomans(); },
  clock3(){ say(["The school clock has Roman numerals: XII at the top, then III, VI and IX. The little hand is just before the XII and the big hand points at VIII: twenty to twelve.", "At twelve, Miss rings the bell and the summer holidays begin."]); },
  stars(){
    const n = stars3();
    say([tx("Pippi's gold-star chart: {n} of 5 stars.", { n }), n >= 5 ? "All five! Now for the bell." : "Annika sticks on a star for every task on the blackboard that's done."]);
  },
  plaque(){ say(["A brass plaque over the door: BUILT IN MDCCCXCIV.", "Roman numerals. Grown-ups like them for things that are meant to look important. The chart next to the clock says what each letter is worth."]); },
  teacher3(){
    if(S.f.out3) return say("Miss has come back in. She's handing out certificates and humming.");
    say([['teacher', stars3() >= 5 ? "Five gold stars? Then what are you waiting for? The bell is on my desk!" : "No help through the window! Well… one little tip: the blackboard says what to do. Five tasks, five gold stars, then the bell."]]);
  },
  door3(){
    if(S.f.out3) return startCh4();
    say(["The classroom door. Miss is right outside, peering in through its little window.", "You could go out too. But Pippi wants her holidays properly: with gold stars, and the bell."]);
  },
  tdesk(){ openDrawer3(); },
  register(){ openRegister(); },
  bell3(){
    if(S.f.out3) return say("Miss's hand bell. It's still humming, from all the excitement.");
    const n = stars3();
    if(n < 5) return say(["Miss's hand bell. At twelve o'clock she rings it, and the holidays begin.", tx('Pippi has {n} of 5 gold stars. Miss said: no holidays until every task on the blackboard is done.', { n })]);
    S.f.out3 = true; save(); applyVisuals(); chord([784,988,784,988,1175,1568]);
    win3();
  },
  nature(){ openNature(); },
  globe(){ openGlobe(); },
  cake(){
    if(S.f.cake) return say("Pippi's cake. A third of it is on a plate on Miss's desk, with a paper flag stuck in it: FOR MISS. THE BIGGEST PIECE.");
    openCake();
  },
  ta3(){
    if(S.f.out3) return say([['tommy', "No school for ten whole weeks!"], ['annika', "I'll miss it. A bit. Maybe."]]);
    if(stars3() >= 5) return say([['annika', "Five stars! Miss said the holidays start when the bell rings. It's on her desk."], ['tommy', "Go on, ring it!"]]);
    say([['tommy', "Miss said Pippi only gets holidays if all five tasks on the blackboard are done."],
         ['annika', "I'm in charge of the gold stars while she's out. I'm not allowed to do the tasks for Pippi. But you can help her!"],
         ...(S.f.drawer ? [] : [['annika', "Miss keeps the chalk in her desk drawer. She can never remember the code, so she wrote herself a note."]])]);
  },
  pippi3(){
    const n = stars3();
    if(S.f.out3) return say(['pippi', "Holidays! I'm going to spend them thing-searching. And eating cake. And thing-searching for cake."]);
    say(['pippi', n === 0 ? "School is wonderful! I've already learnt that there are holidays. I've never done a task before, so I'm sure I can."
      : n < 5 ? "Gold stars! I'm going to have them made into earrings." : "Five stars! Ring the bell, ring the bell!"]);
  },
  nilsson3(){
    say(S.f.cake ? [['nilsson', "Eek!"], "Mr Nilsson is licking cream off his hat. Nobody saw anything."]
      : [['nilsson', "Eek! Eek!"], "Mr Nilsson came to school in Pippi's pocket. He's sitting on the end of her desk, staring at the cake."]);
  }
});

/* ---------- puzzle: Roman numerals (the drawer in Miss's desk: the year on the plaque, MDCCCXCIV = 1894) ---------- */
const SCHOOL_YEAR = '1894';
function openDrawer3(){
  if(S.f.drawer) return say("Miss's drawer, open. Red pens, a ruler, and a bag of peppermints labelled FOR EMERGENCIES. You already took the chalk and the magnifying glass.");
  const dig = S.rl || (S.rl = [0, 0, 0, 0]);
  openModal("Miss's desk", 'The drawer has a padlock with four number wheels', `
    <div class="s3-note">${tx("So I don't forget: the code is the year our school was built. It's on the plaque over the door. Nobody can read that, so it's perfectly safe. — Miss")}</div>
    <div class="padlock">${dig.map((v, i) => `<div class="wheel"><button type="button" class="up" data-w="${i}" aria-label="${tx('Wheel {n} up', { n: i + 1 })}">▲</button><b id="rw${i}">${v}</b><button type="button" class="dn" data-w="${i}" aria-label="${tx('Wheel {n} down', { n: i + 1 })}">▼</button></div>`).join('')}
      <button type="button" class="btn" id="dr-try">${tx('Open')}</button></div>
    <div class="feedback" id="dr-fb"></div>`, body => {
    body.querySelectorAll('.wheel button').forEach(b => b.onclick = () => {
      const i = +b.dataset.w; dig[i] = (dig[i] + (b.classList.contains('up') ? 1 : 9)) % 10; save();
      $('#rw' + i).textContent = dig[i]; beep(500, .02);
    });
    $('#dr-try').onclick = () => {
      const code = dig.join(''), fb = $('#dr-fb');
      if(code === SCHOOL_YEAR){
        S.f.drawer = true; save(); give('chalk'); give('magnifier'); applyVisuals(); chord([523,659,784,1046]);
        fb.className = 'feedback good'; fb.textContent = tx('Click! 1894. The drawer slides open: chalk, red pens, and a magnifying glass.');
        setTimeout(() => { closeModal(); say(["M is 1000, D is 500, CCC is 300, XC is 90 and IV is 4: 1894. Roman numerals add up, except when a small one stands in front of a bigger one: then you take it away.", "You take the chalk and the magnifying glass. Now for the tasks on the blackboard."]); }, 1600);
        return;
      }
      nope(); fb.className = 'feedback bad';
      fb.textContent = tx(code === '1916' || code === '1914' ? "Close! But XC isn't 10 + 100. When a smaller numeral stands in front of a bigger one, you take it away: XC is 100 − 10 = 90."
        : code === '1896' ? "Nearly! But IV isn't 1 + 5. The I comes first, so take it away: IV is 5 − 1 = 4. (Look at the IX on the clock: that's 9.)"
        : code === '0000' ? 'Zero, zero, zero, zero. The Romans had no zero at all, so that can\'t be it.'
        : 'The padlock doesn\'t budge. Read the plaque over the door one numeral at a time, with the chart next to the clock.');
    };
  });
}
function openRomans(){
  const R = [['I', 1], ['V', 5], ['X', 10], ['L', 50], ['C', 100], ['D', 500], ['M', 1000]];
  openModal('Roman numerals', 'A chart on the classroom wall', `
    <div class="s3-roman">
      <div class="s3-rgrid" translate="no">${R.map(([l, v]) => `<span><b>${l}</b>${v}</span>`).join('')}</div>
      <p>${tx('<b>Add them up</b>, biggest first: VI = 5 + 1 = 6, XX = 10 + 10 = 20, CCC = 300.')}</p>
      <p>${tx('<b>But</b> a small numeral IN FRONT of a bigger one is taken away: IV = 5 − 1 = 4, IX = 10 − 1 = 9, XC = 100 − 10 = 90.')}</p>
    </div>`);
}

/* ---------- puzzle: pluttification (the nines: the tens go up, the units go down, and they always add up to 9) ---------- */
function openBoard(){
  const marks = S.nn || (S.nn = []);
  const chalk = S.inv.includes('chalk');
  const line = (v, i) => `<button type="button" class="s3-line${marks.includes(i) ? ' x' : ''}${S.f.nines && NINES3_WRONG.includes(i) ? ' fixed' : ''}" data-i="${i}" translate="no" ${S.f.nines ? 'disabled' : ''}>9 × ${i + 1} = <b>${S.f.nines ? 9 * (i + 1) : v}</b></button>`;
  openModal('The blackboard', "Today's tasks, and Pippi's pluttification", `
    <div class="s3-board">
      <div class="s3-tasks"><b>${tx('To do:')}</b>${['Nines', 'ABC', 'Insects', 'Cake', 'Globe'].map((t, i) => `<span class="${S.f[TASKS3[i]] ? 'done' : ''}">${i + 1}. ${tx(t)} ${S.f[TASKS3[i]] ? '✓' : ''}</span>`).join('')}</div>
      <div class="s3-nines"><div class="s3-h">${tx('PLUTTIFICATION')}</div><div class="s3-lines">${NINES3.map(line).join('')}</div></div>
    </div>
    ${S.f.nines ? '' : `<div class="row-btns"><button type="button" class="btn" id="b3-check">${tx('Done marking')}</button></div>`}
    <div class="feedback" id="b3-fb">${S.f.nines ? tx('Every answer is right now. Annika has given Pippi a gold star for it.') : chalk ? tx("Task 1: find Pippi's wrong answers. Click a line to mark it with the chalk, or click it again to rub the mark out.") : tx("Task 1: find Pippi's wrong answers and mark them. But the chalk box on the ledge is empty.")}</div>`, () => {
    if(S.f.nines) return;
    const fb = $('#b3-fb');
    document.querySelectorAll('.s3-line').forEach(b => b.onclick = () => {
      if(!S.inv.includes('chalk')){ nope(); fb.className = 'feedback bad'; fb.textContent = tx("You need chalk to mark anything. Miss keeps the chalk in her desk."); return; }
      const i = +b.dataset.i, k = marks.indexOf(i);
      if(k >= 0) marks.splice(k, 1); else marks.push(i);
      save(); b.classList.toggle('x', k < 0); beep(k < 0 ? 900 : 400, .04);
    });
    $('#b3-check').onclick = () => {
      if(!S.inv.includes('chalk')){ nope(); fb.className = 'feedback bad'; fb.textContent = tx("You need chalk to mark anything. Miss keeps the chalk in her desk."); return; }
      const wrongMark = marks.find(i => !NINES3_WRONG.includes(i));
      if(wrongMark !== undefined){
        const n = wrongMark + 1, v = 9 * n;
        nope(); fb.className = 'feedback bad';
        fb.textContent = tx('9 × {n} = {v} is right: {t} tens and {u} units. The tens are one less than {n}, and {t} + {u} = 9. Rub that mark out.', { n, v, t: Math.floor(v / 10), u: v % 10 });
        return;
      }
      const left = NINES3_WRONG.filter(i => !marks.includes(i)).length;
      if(left){
        nope(); fb.className = 'feedback bad';
        fb.textContent = tx(left === 1 ? 'There is still one wrong answer without a mark. Check each line: the tens are one less than the number you multiply by, and the two digits add up to 9.'
          : 'There are still {k} wrong answers without a mark. Check each line: the tens are one less than the number you multiply by, and the two digits add up to 9.', { k: left });
        return;
      }
      S.f.nines = true; take('chalk'); save(); applyVisuals(); chord([523,659,784,1046]);
      NINES3_WRONG.forEach(i => { const b = document.querySelector(`.s3-line[data-i="${i}"]`); if(b){ b.classList.add('fixed'); b.querySelector('b').textContent = 9 * (i + 1); } });
      document.querySelectorAll('.s3-line').forEach(b => b.disabled = true);
      fb.className = 'feedback good'; fb.textContent = tx("Marked and corrected: 9 × 5 = 45, 9 × 8 = 72 and 9 × 10 = 90. You've used up the chalk.");
      setTimeout(() => { closeModal(); goldStar3(["In the nines, the tens go up by one and the units go down by one, and the two digits always add up to 9.", ['pippi', "Pluttification is easy once you know the trick. I'll do the nines on my toes next."]]); }, 1800);
    };
  });
}
function openTables(){
  let hands = '';
  for(let i = 0; i < 10; i++){
    const x = 14 + i * 26 + (i >= 5 ? 24 : 0), folded = i === 3;
    hands += `<rect x="${x}" y="${folded ? 86 : 20 + Math.abs(2 - (i % 5)) * 8}" width="20" height="${folded ? 34 : 100 - Math.abs(2 - (i % 5)) * 8}" rx="9" fill="${folded ? '#e0a77a' : '#f3c9a4'}" stroke="#c98a5a" stroke-width="2"/>`;
  }
  openModal('The nines poster', 'Pinned up next to the blackboard', `
    <svg class="s3-hands" viewBox="0 0 320 170" aria-hidden="true"><rect width="320" height="170" rx="8" fill="#fffaf0"/>${hands}
      <g font-family="IBM Plex Mono, monospace" font-weight="600" font-size="22" fill="#1f4d8c"><text x="54" y="152" text-anchor="middle">3</text><text x="200" y="152" text-anchor="middle">6</text></g></svg>
    <p class="flag-p">${tx('<b>The nines on your fingers.</b> Hold up all ten fingers. For 9 × 4, fold down your 4th finger. The fingers on its left are the tens (3), the fingers on its right are the units (6): 9 × 4 = 36.')}</p>
    <p class="flag-p">${tx('And look: in the nines, the two digits always add up to 9. 3 + 6 = 9.')}</p>`);
}

/* ---------- puzzle: ABC order (the class register) ---------- */
const PUPILS3 = ['Tommy', 'Pippi', 'Britta', 'Axel', 'Tora', 'Annika', 'Olle', 'Per'];   // Pippi's order: her favourites first
const PUPILS3_ABC = ['Annika', 'Axel', 'Britta', 'Olle', 'Per', 'Pippi', 'Tommy', 'Tora'];
function openRegister(){
  if(S.f.abc) return say("The class register, in perfect ABC order again. Miss will be pleased. Pippi has drawn a small horse next to her own name.");
  const reg = S.reg || (S.reg = []);
  openModal('The class register', 'Pippi has "tidied" it', `
    <ol class="s3-reg" id="s3-reg" translate="no"></ol>
    <div class="s3-names" translate="no">${PUPILS3.map(n => `<button type="button" class="s3-name" data-n="${n}">${n}</button>`).join('')}</div>
    <div class="feedback" id="reg-fb">${tx('Task 2: Pippi has put the names in order of how much she likes them. Miss keeps them in ABC order. Click the names in ABC order.')}</div>`, () => {
    const fb = $('#reg-fb');
    const draw = () => { $('#s3-reg').innerHTML = reg.map(n => `<li>${n}</li>`).join('');
      document.querySelectorAll('.s3-name').forEach(b => b.disabled = reg.includes(b.dataset.n)); };
    draw();
    document.querySelectorAll('.s3-name').forEach(b => b.onclick = () => {
      const c = b.dataset.n, e = PUPILS3_ABC[reg.length];
      if(c !== e){
        nope(); fb.className = 'feedback bad';
        let p = 0; while(e[p] === c[p]) p++;
        fb.textContent = p === 0 ? tx('Not yet. {b} starts with {y}, but another name starts with a letter that comes earlier in the alphabet.', { b: c, y: c[0] })
          : tx('Not yet. {a} and {b} both start with {pre}, so look at the next letter: {x} comes before {y}.', { a: e, b: c, pre: e.slice(0, p), x: e[p], y: c[p] });
        return;
      }
      reg.push(c); save(); beep(500 + reg.length * 50, .06); draw();
      fb.className = 'feedback good'; fb.textContent = tx('{name}: yes.', { name: c });
      if(reg.length === PUPILS3_ABC.length){
        S.f.abc = true; save(); applyVisuals(); chord([523,659,784,1046]);
        fb.textContent = tx('A, A, B, O, P, P, T, T: the register is in ABC order again.');
        setTimeout(() => { closeModal(); goldStar3(["When two names start with the same letter, you look at the next letter: An before Ax, Pe before Pi, Tom before Tor.", ['pippi', "I'd still have put me first. P is a very good letter."]]); }, 1700);
      }
    });
  });
}

/* ---------- puzzle: insects (six legs, three body parts) ---------- */
/* Legs seen from above: one pair for every x along the body; front legs reach forwards, back legs backwards. */
const legs3 = (xs, cy, len, col) => xs.map((x, k) => {
  const d = (k - (xs.length - 1) / 2) * Math.min(8, 24 / Math.max(1, xs.length - 1));
  return `<path d="M${x} ${cy} l${d} -${len} l${d * .6} -${len / 2} M${x} ${cy} l${d} ${len} l${d * .6} ${len / 2}" stroke="${col}" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
}).join('');
const BUGS3 = [
  { name: 'Ant', insect: true, svg: legs3([54, 60, 66], 40, 14, '#2b2118') + '<path d="M27 37 l-10 -12 M27 43 l-10 12" stroke="#2b2118" stroke-width="2"/><ellipse cx="33" cy="40" rx="9" ry="7" fill="#2b2118"/><ellipse cx="60" cy="40" rx="12" ry="6" fill="#2b2118"/><ellipse cx="90" cy="40" rx="17" ry="11" fill="#2b2118"/>' },
  { name: 'Spider', insect: false, svg: legs3([34, 40, 46, 52], 40, 17, '#3a3a3a') + '<ellipse cx="43" cy="40" rx="13" ry="10" fill="#3a3a3a"/><ellipse cx="80" cy="40" rx="22" ry="16" fill="#3a3a3a"/><circle cx="34" cy="37" r="2" fill="#fff"/><circle cx="34" cy="43" r="2" fill="#fff"/>' },
  { name: 'Ladybird', insect: true, svg: legs3([50, 62, 74], 40, 19, '#1a1a1a') + '<path d="M24 37 l-8 -10 M24 43 l-8 10" stroke="#1a1a1a" stroke-width="2"/><ellipse cx="28" cy="40" rx="7" ry="8" fill="#1a1a1a"/><ellipse cx="40" cy="40" rx="7" ry="12" fill="#1a1a1a"/><ellipse cx="68" cy="40" rx="26" ry="20" fill="#d22d2d"/><path d="M42 40 h52" stroke="#1a1a1a" stroke-width="2"/><g fill="#1a1a1a"><circle cx="60" cy="30" r="4"/><circle cx="60" cy="50" r="4"/><circle cx="78" cy="28" r="4"/><circle cx="78" cy="52" r="4"/></g>' },
  { name: 'Woodlouse', insect: false, svg: legs3([32, 40, 48, 56, 64, 72, 80], 40, 16, '#5a5f66') + '<path d="M22 37 l-10 -12 M22 43 l-10 12" stroke="#5a5f66" stroke-width="2"/><ellipse cx="60" cy="40" rx="38" ry="14" fill="#7a7f86"/><path d="M34 28 v24 M44 27 v26 M54 26 v28 M64 26 v28 M74 27 v26 M84 28 v24" stroke="#5a5f66" stroke-width="2"/>' },
  { name: 'Bumblebee', insect: true, svg: '<g fill="#cfe7fb" opacity=".75"><ellipse cx="70" cy="20" rx="12" ry="6"/><ellipse cx="70" cy="60" rx="12" ry="6"/></g>' + legs3([44, 50, 56], 40, 15, '#1a1a1a') + '<circle cx="30" cy="40" r="8" fill="#1a1a1a"/><circle cx="50" cy="40" r="11" fill="#f2c94c"/><ellipse cx="82" cy="40" rx="21" ry="14" fill="#f2c94c"/><path d="M74 27 v26 M86 27 v26" stroke="#1a1a1a" stroke-width="5"/>' }
];
function openNature(){
  if(S.f.bugs) return say("The nature table. The ant, the ladybird and the bumblebee have a card each now: INSECT. The spider and the woodlouse are sulking.");
  if(!S.inv.includes('magnifier')) return say(["The nature table: five jam jars, each with something tiny inside. A card says: WHICH ONES ARE INSECTS?", "They're far too small to see properly. You'd need something to make them bigger."]);
  const tick = S.bug || (S.bug = []);
  openModal('The nature table', 'Seen through the magnifying glass', `
    <div class="s3-card">${tx('Miss says: an INSECT has <b>six legs</b>, and a body in <b>three parts</b>: head, middle and back end.')}</div>
    <div class="s3-bugs">${BUGS3.map((b, i) => `<button type="button" class="s3-bug${tick.includes(i) ? ' on' : ''}" data-b="${i}" aria-pressed="${tick.includes(i)}"><svg viewBox="0 0 120 80" aria-hidden="true">${b.svg}</svg><span>${tx(b.name)}</span></button>`).join('')}</div>
    <div class="row-btns"><button type="button" class="btn" id="bug-check">${tx('These are the insects')}</button></div>
    <div class="feedback" id="bug-fb">${tx('Task 3: click every creature that is an insect. Pippi\'s label says: ALL OF THEM. AND MR NILSSON.')}</div>`, () => {
    const fb = $('#bug-fb');
    document.querySelectorAll('.s3-bug').forEach(b => b.onclick = () => {
      const i = +b.dataset.b, k = tick.indexOf(i);
      if(k >= 0) tick.splice(k, 1); else tick.push(i);
      save(); b.classList.toggle('on', k < 0); b.setAttribute('aria-pressed', k < 0); beep(k < 0 ? 820 : 420, .04);
    });
    $('#bug-check').onclick = () => {
      nope(); fb.className = 'feedback bad';
      if(tick.includes(1)){ fb.textContent = tx("Count the spider's legs: eight! And its body has only two parts. Spiders aren't insects: they're arachnids."); return; }
      if(tick.includes(3)){ fb.textContent = tx("Count the woodlouse's legs: fourteen! It isn't an insect at all. It's a crustacean, more like a tiny crab than a beetle."); return; }
      const left = BUGS3.filter((b, i) => b.insect && !tick.includes(i)).length;
      if(left){ fb.textContent = tx(left === 1 ? 'One insect is still not ticked. Count the legs again: six legs means insect.' : 'There are more insects than that. Count the legs: six legs means insect.'); return; }
      S.f.bugs = true; save(); applyVisuals(); chord([523,659,784,1046]);
      fb.className = 'feedback good'; fb.textContent = tx('The ant, the ladybird and the bumblebee: six legs and three body parts each. Insects!');
      setTimeout(() => { closeModal(); goldStar3(["Six legs and three body parts: an insect. The spider has eight legs, the woodlouse fourteen, and Mr Nilsson has no business being on the list at all.", "And the spunk? You count its legs: six. The spunk is an insect too!"]); }, 1800);
    };
  });
}

/* ---------- puzzle: fractions (more pieces means smaller pieces; 2/8 = 1/4) ---------- */
/* A round cake cut into n equal pieces, with the first `shade` pieces iced pink. */
function cakeSVG3(n, shade){
  const pt = a => [50 + 40 * Math.cos(a), 50 + 40 * Math.sin(a)].map(v => v.toFixed(1)).join(' ');
  const ang = k => -Math.PI / 2 + k * 2 * Math.PI / n;
  let s = '<circle cx="50" cy="50" r="40" fill="#e3a54e" stroke="#a8692a" stroke-width="2"/>';
  for(let k = 0; k < shade; k++) s += `<path d="M50 50 L${pt(ang(k))} A40 40 0 0 1 ${pt(ang(k + 1))} Z" fill="#f2a7b8"/>`;
  for(let k = 0; k < n; k++) s += `<path d="M50 50 L${pt(ang(k))}" stroke="#6b3a1a" stroke-width="2"/>`;
  return `<svg viewBox="0 0 100 100" aria-hidden="true">${s}</svg>`;
}
const CAKES3 = [8, 3, 6, 4];
function openCake(){
  const round = S.frc || 0;
  const body = round === 0 ? `
    <p class="flag-p">${tx('Pippi has baked four cakes, all exactly the same size, and cut them up: one into 8 pieces, one into 3, one into 6 and one into 4. Miss gets the biggest piece. Which piece is it?')}</p>
    <div class="s3-cakes">${CAKES3.map(n => `<button type="button" class="s3-cakeb" data-n="${n}" aria-label="${tx('A piece of the cake cut into {n}', { n })}">${cakeSVG3(n, 1)}<span translate="no">1/${n}</span></button>`).join('')}</div>`
  : `
    <p class="flag-p">${tx('Now Tommy asks for one quarter of a cake (1/4), and Annika asks for two eighths (2/8). Who gets more cake?')}</p>
    <div class="s3-cakes two"><figure>${cakeSVG3(4, 1)}<figcaption>${tx('Tommy')}: 1/4</figcaption></figure><figure>${cakeSVG3(8, 2)}<figcaption>${tx('Annika')}: 2/8</figcaption></figure></div>
    <div class="hands">${['Tommy', 'Annika', 'The same'].map(w => `<button type="button" class="hand" data-w="${w}">${tx(w === 'The same' ? 'They get the same' : '{who} gets more', { who: w })}</button>`).join('')}</div>`;
  openModal("Pippi's cake", 'Task 4: fractions', body + `<div class="feedback" id="cake-fb"></div>`, () => {
    const fb = $('#cake-fb');
    document.querySelectorAll('.s3-cakeb').forEach(b => b.onclick = () => {
      const n = +b.dataset.n;
      if(n !== 3){
        nope(); fb.className = 'feedback bad';
        if(n === 4){ S.ach.quarter = true; save(); }
        fb.textContent = tx({ 8: 'Pippi says the eighth, because 8 is the most! But the more pieces you cut a cake into, the smaller each piece is.',
          6: 'A sixth is smaller than that: the cake is shared out into more pieces.',
          4: 'Four is more than three, so a quarter must be bigger? No! A cake cut into 4 has smaller pieces than one cut into 3.' }[n]);
        return;
      }
      S.frc = 1; save(); chord([523,659,784]);
      fb.className = 'feedback good'; fb.textContent = tx('A third! Cut into only 3 pieces, each piece is the biggest.');
      setTimeout(() => { if(!$('#modal').hidden) openCake(); }, 1500);
    });
    document.querySelectorAll('.hand[data-w]').forEach(b => b.onclick = () => {
      const w = b.dataset.w;
      if(w !== 'The same'){
        nope(); fb.className = 'feedback bad';
        fb.textContent = tx(w === 'Annika' ? 'Two pieces sounds like more. But each eighth is only half as big as a quarter. Look at the pink parts.' : 'Look at the pink parts: they are exactly the same size. Cut a quarter in half, and you get two eighths.');
        return;
      }
      S.f.cake = true; save(); applyVisuals(); chord([523,659,784,1046]);
      fb.className = 'feedback good'; fb.textContent = tx('The same! 2/8 is exactly 1/4.');
      setTimeout(() => { closeModal(); goldStar3(["The more pieces you cut a cake into, the smaller each piece. A third is bigger than a quarter, and two eighths is exactly one quarter.", ['pippi', "Then Miss gets a third. And I'll have the other two thirds. And the other three cakes. That's only fair."]]); }, 1700);
    });
  });
}

/* ---------- puzzle: the seasons (the Earth is tilted) ---------- */
function openGlobe(){
  if(S.f.seasons) return say("The globe, leaning over as always. In June the North leans towards the Sun: summer in Sweden, winter on Pippi's father's island.");
  openModal('The globe', 'Task 5: a postcard from the South Seas', `
    <div class="s3-post">${tx('"Dear Pippi, happy summer holidays! Here on my island it is winter now, so I am wearing my woolly hat. (Only the hat.) Love, Daddy"')}</div>
    <svg class="s3-globe" viewBox="0 0 400 190" aria-hidden="true">
      <rect width="400" height="190" rx="8" fill="#141a33"/>
      <circle cx="56" cy="95" r="34" fill="#ffd25a"/><circle cx="56" cy="95" r="44" fill="#ffd25a" opacity=".2"/>
      <g stroke="#ffd25a" stroke-width="2" opacity=".5"><path d="M100 70 H210 M100 95 H210 M100 120 H210"/></g>
      <g transform="rotate(-23 280 95)">
        <circle cx="280" cy="95" r="60" fill="#3a7ac0"/>
        <path d="M252 52 q20-12 36 2 q-6 20-26 16z M290 108 q22-4 28 14 q-10 22-24 22 q-10-18-4-36z M236 96 q12 4 14 20 q-12 8-18-6z" fill="#5aa04a"/>
        <path d="M220 95 h120" stroke="#f3d27a" stroke-width="2" stroke-dasharray="5 4"/>
        <path d="M280 25 v140" stroke="#cfd4d8" stroke-width="3"/>
        <circle cx="280" cy="52" r="6" fill="#e2483d" stroke="#fff" stroke-width="2"/>
        <circle cx="296" cy="132" r="6" fill="#f2c94c" stroke="#fff" stroke-width="2"/>
        <text x="280" y="20" text-anchor="middle" font-size="14" font-weight="700" fill="#fff">N</text>
      </g>
      <path d="M280 35 a60 60 0 0 1 0 120 z" fill="#05081a" opacity=".5"/>
    </svg>
    <div class="s3-legend"><span class="s3-dot red"></span>${tx('Sweden')} <span class="s3-dot yellow"></span>${tx("Pippi's father's island")} <span class="s3-dot sun"></span>${tx('the Sun, in June')}</div>
    <p class="flag-p">${tx('Why is it winter on the island when it is summer in Sweden?')}</p>
    <div class="hands mix">
      <button type="button" class="hand" data-g="far">${tx('The island is further away from the Sun.')}</button>
      <button type="button" class="hand" data-g="tilt">${tx('The Earth leans over. In June the northern half leans towards the Sun, and the southern half leans away.')}</button>
      <button type="button" class="hand" data-g="chest">${tx("Pippi's father packed all the summer into a sea chest and sent it to Sweden.")}</button>
    </div>
    <div class="feedback" id="globe-fb"></div>`, () => {
    document.querySelectorAll('.hand[data-g]').forEach(b => b.onclick = () => {
      const g = b.dataset.g, fb = $('#globe-fb');
      if(g === 'far'){ nope(); fb.className = 'feedback bad'; fb.textContent = tx('Lots of people think so! But Sweden and the island are almost exactly as far from the Sun. Look at the globe: which half leans towards the Sun?'); return; }
      if(g === 'chest'){ nope(); fb.className = 'feedback bad'; fb.textContent = tx('Pippi nods: "That\'s exactly what happened." It isn\'t. Look at the way the Earth leans.'); return; }
      S.f.seasons = true; save(); applyVisuals(); chord([523,659,784,1046]);
      fb.className = 'feedback good'; fb.textContent = tx('Yes! The Earth is tilted, and it stays tilted all the way round the Sun.');
      setTimeout(() => { closeModal(); goldStar3(["In June the North leans towards the Sun: long days, a high sun, summer in Sweden. The South leans away: short days and winter.", "In December it's the other way round. Then Pippi's father can take his woolly hat off."]); }, 1800);
    });
  });
}

/* ---------- intro, start and win ---------- */
function intro3(){
  say([["sys", "The little school, on the last morning before the summer holidays. Sunshine through the windows, and chalk dust in the air."],
       ["teacher", "Good morning, class! And look who's here: Pippi has come to school, for the very first time."],
       ["pippi", "Good morning! I heard that children who go to school get holidays. It didn't seem fair that I don't, so I've come to get some."],
       ["teacher", "Holidays are for children who have done their work, Pippi. There are five tasks on the blackboard. Do them all, and when I ring the bell at twelve, you'll get your holidays too."],
       ["pippi", "Five tasks! I've never done a task before, so I'm sure I can. And my friend here will help me."],
       ["sys", "Outside, a loud munching noise. Pippi's horse is eating the flowerbed in the schoolyard."],
       ["teacher", "My geraniums! Annika, you're in charge of the gold stars. I'll keep an eye on you through the window in the door!"],
       ["you", "Five tasks before twelve. But the chalk box is empty. Miss must keep the chalk somewhere."]],
    () => { S.f.introDone = true; save(); });
}
function startCh3(){
  setUnlocked3();
  S = Object.assign(fresh(), { ach: S.ach || {}, ch: 3, scene: 'school' });
  S.started = true; sel = null;
  $('#title').hidden = true; $('#win').hidden = true;
  renderInv(); applyVisuals(); $('#timer').textContent = '00:00'; save(); intro3();
}
function win3(){
  say([["sys", "Pippi grabs the hand bell and rings it. Very loudly. For a very long time. The windows rattle, and out in the schoolyard the horse stops chewing."],
       ["teacher", "Pippi! Who said you could ring the bell? It's only twenty to twelve!"],
       ["annika", "But Miss, she's done all five tasks. Look: five gold stars. We only helped a little."],
       ["teacher", "Let me see. The nines, the register, the insects, the cake, the globe… Well I never. Every one of them is right."],
       ["teacher", "Twenty minutes early, but you've earned it. Happy holidays, everyone!"],
       ["pippi", "Hooray! And here's the biggest piece of cake for you, Miss: a third. Not a quarter. A quarter is smaller. I learnt that today."],
       ["pippi", "School is lovely. I'll come back after the holidays. For the next holidays."]],
    () => {
      S.f.snow3 = true; save();
      const sc = $('#sc-school');
      if(!reducedMotion()){ sc.classList.add('sl-firstsnow'); setTimeout(() => sc.classList.remove('sl-firstsnow'), 10000); }
      applyVisuals();
      say([["sys", "The holidays fly by: long sunny days, then falling leaves… and then one morning, the first snowflakes drift past the classroom window."],
           ["pippi", "Snow! Heaps and heaps of it! Tommy, Annika, come on: it's snowball weather!"]], () => showWin());
    });
}
