// Chapters and end screens, hint/reveal/sound buttons, timer, achievements, scores, title menu, installable app, and start-up.
// Loaded in order by js/boot.js; all game files share the same global scope.

/* ---------- chapters ---------- */
const LAST_CH = 10;   // the newest chapter; raise it when you add one
function chapterDone(){ return !!S.f['out' + S.ch]; }
function nextChapter(){ const f = { 0: startNew, 1: startCh2, 2: startCh3, 3: startCh4, 4: startCh5, 5: startCh6, 6: startCh7, 7: startCh8, 8: startCh9, 9: startCh10 }[S.ch]; if(f) f(); }
/* Exits lead on to the next chapter once a chapter is solved. */
function exitLabels(){
  const open = chapterDone() && S.ch < LAST_CH, n = S.ch + 1;
  const set = (sel, label) => document.querySelectorAll(sel).forEach(h => { h.dataset.label = label; h.setAttribute('aria-label', label); });
  set('#sc-move [data-hs="door0"]', open && S.ch === 0 ? tx('Front door: on to Chapter {n}', { n }) : 'The front door');
  set('#sc-kitchen [data-hs="door"]', open && S.ch === 1 ? tx('Front door: on to Chapter {n}', { n }) : 'Front door');
  // applyBedroom() sets the veranda door's other labels
  if(open && S.ch === 2) set('#sc-bedroom [data-hs="vdoor"]', tx('Veranda door: on to Chapter {n}', { n }));
  set('#sc-school [data-hs="door3"]', open && S.ch === 3 ? tx('Classroom door: on to Chapter {n}', { n }) : 'Classroom door');
  set('#sc-winter [data-hs="gate4"]', open && S.ch === 4 ? tx('Garden gate: on to Chapter {n}', { n }) : 'Garden gate');
  set('#sc-circus [data-hs="curtain"]', open && S.ch === 5 ? tx('Curtain: on to Chapter {n}', { n }) : "The performers' curtain");
  set('#sc-balloon [data-hs="harbour6"]', open && S.ch === 6 ? tx('The harbour: on to Chapter {n}', { n }) : 'The harbour');
  set('#sc-ship [data-hs="isle7"]', open && S.ch === 7 ? tx('The island: on to Chapter {n}', { n }) : 'The island');
  set('#sc-island [data-hs="ship8"]', open && S.ch === 8 ? tx('The Hoppetossa: on to Chapter {n}', { n }) : 'The Hoppetossa');
  set('#sc-voyage [data-hs="quay9"]', open && S.ch === 9 ? tx('The quay: on to Chapter {n}', { n }) : 'The quay');
}
/* The title screen tells the story of the room behind it: the saved chapter, or moving day for a new visitor. */
const TITLE_TXT = {
  0: ['Villa Villekulla · a small town in Sweden · moving day', "A girl with red plaits has come to town, with a horse, a monkey and a suitcase full of gold. Her name is Pippi, and the old house at the end of the road is hers. But nobody has lived in it for years…"],
  1: ["Villa Villekulla · a small town in Sweden · four o'clock", "You came to play at Pippi's house. Pippi has gone to town for sweets, and Mr Nilsson, her monkey, has locked the front door and run off with the key. Tommy and Annika are waiting outside. Get out!"],
  2: ['Villa Villekulla · the same night · nearly midnight', "Pippi is fast asleep with her feet on the pillow, and two burglars are creeping up to the house. They've heard about a certain suitcase full of gold…"],
  3: ['The little school · the last morning before the holidays', 'Pippi has come to school for the very first time. She has heard that schoolchildren get holidays, and she wants some too.'],
  4: ['Villa Villekulla · winter · half past two', 'Kling and Klang have challenged you to a snowball fight at three o\'clock. And Mr Nilsson has run off with your mittens.'],
  5: ['The big top · the circus has come to town', 'The show should have started ten minutes ago, but nothing is ready. The ringmaster is pulling at his moustache.'],
  6: ['Villa Villekulla · a frosty winter morning', 'The ringmaster has given Pippi the circus balloon, and the golden weathercock has been stolen from the church tower.'],
  7: ['The harbour · winter in Sweden', 'Captain Longstocking has sailed in to take Pippi to his island in the South Seas. But first the horse has to come aboard.'],
  8: ['Captain Longstocking\'s island · the South Seas', 'A whole day on the island, from breakfast to moonlight, with a surprise buried on Turtle Islet.'],
  9: ['The Hoppetossa · homeward · April', 'The long voyage home from the South Seas, through a storm and a night full of lighthouses.'],
  10: ['Villa Villekulla · spring', "Home at last! But the garden is overgrown, the door is locked, and the horse won't put a hoof in the wet grass."]
};
function refreshMenu(){
  const fin = chapterDone();
  const [eye, story] = TITLE_TXT[S.ch] || TITLE_TXT[1];
  $('#t-eye').textContent = eye; $('#t-story').textContent = story;
  $('#btn-cont').hidden = !S.started || (fin && S.ch >= LAST_CH);
  $('#btn-cont').textContent = fin ? tx('Continue to Chapter {n}', { n: S.ch + 1 }) : 'Continue';
  $('#btn-ch0').hidden = $('#btn-ch1').hidden = $('#chapters').hidden = !unlocked1();
  $('#btn-ch2').hidden = !unlocked2();
  $('#btn-ch3').hidden = !unlocked3();
  $('#btn-ch4').hidden = !unlocked4();
  $('#btn-ch5').hidden = !unlocked5();
  $('#btn-ch6').hidden = !unlocked6();
  $('#btn-ch7').hidden = !unlocked7();
  $('#btn-ch8').hidden = !unlocked8();
  $('#btn-ch9').hidden = !unlocked9();
  $('#btn-ch10').hidden = !unlocked10();
}

const CH_END = {
  0:['Moved in · Chapter 0 complete', 'Home sweet home', "Pippi lives at Villa Villekulla now, with a horse on the veranda and a monkey on the clock. Next: four o'clock on a Saturday, and Mr Nilsson has a trick up his sleeve…", 'Continue to Chapter 1'],
  1:['Door open · Chapter 1 complete', "You're out", "Next: that night, two burglars come creeping up to Villa Villekulla. They've heard about a certain suitcase full of gold…", 'Continue to Chapter 2'],
  2:['Burglars caught · Chapter 2 complete', 'Caught', "Thunder-Karlsson and Bloom are off to the police station, and the gold is safe. Next: Pippi goes to school for the very first time. She has heard that schoolchildren get holidays…", 'Continue to Chapter 3'],
  3:["School's out · Chapter 3 complete", 'Holidays', "Pippi has her holidays, and Miss has the biggest piece of cake. Next: winter comes to Villa Villekulla, and two policemen have a challenge…", 'Continue to Chapter 4'],
  4:['Snowball fight · Chapter 4 complete', "Bull's-eye", "Kling and Klang surrendered, and everybody had hot chocolate. Next: the circus comes to town, and the show can't begin…", 'Continue to Chapter 5'],
  5:['Showtime · Chapter 5 complete', 'Bravo', "Pippi lifted the strongman, and the circus wants her to stay. Next: the ringmaster has a thank-you present for Pippi. It is very big, very round, and it flies…", 'Continue to Chapter 6'],
  6:['Weathercock home · Chapter 6 complete', 'Up and away', "The burglars are caught, and the golden weathercock is back on the church tower. Next: a ship sails into the harbour, and her captain has a red beard…", 'Continue to Chapter 7'],
  7:['Land ho · Chapter 7 complete', 'Land ho', "The Hoppetossa has reached Captain Longstocking's island. Next: a whole day on the island, with a buried surprise for Pippi…", 'Continue to Chapter 8'],
  8:['Goodnight, turtles · Chapter 8 complete', 'Hooray', "Treasure, thunder and turtles: what a day on Captain Longstocking's island. Next: the long voyage home, through a storm and a night full of lighthouses…", 'Continue to Chapter 9'],
  9:['Safe in harbour · Chapter 9 complete', 'Home port', "Through the storm, past the lighthouses and between the buoys: the Hoppetossa is home. Next: Villa Villekulla in spring, where somebody can't wait to see its veranda…", 'Continue to Chapter 10'],
  10:['Home sweet home · Chapter 10 complete', 'Welcome home', "The horse is on its veranda, the hedgehog is under the lilac, and the whole town is at the party. More adventures are still being written…", '']
};
function showWin(){
  const unlock = { 0: setUnlocked1, 1: setUnlocked2, 2: setUnlocked3, 3: setUnlocked4, 4: setUnlocked5, 5: setUnlocked6, 6: setUnlocked7, 7: setUnlocked8, 8: setUnlocked9, 9: setUnlocked10 }[S.ch];
  if(unlock) unlock();
  const [eb, ti, note, next] = CH_END[S.ch] || CH_END[1];
  $('#btn-next').hidden = !next; $('#btn-next').textContent = next;
  $('#w-eyebrow').textContent = eb;
  $('#w-title').innerHTML = tx(ti) + '<span class="cursor">!</span>';
  $('#w-note').textContent = note;
  $('#w-time').textContent = fmt(S.t); $('#w-hints').textContent = S.hints;
  $('#w-rank').textContent = rankFor(S.hints);
  recordScore(S.ch, S.t, S.hints);
  $('#w-ach').innerHTML = ACH.map(([k,l]) => `<span class="${S.ach[k]?'got':''}">${S.ach[k]?'✓ ':''}${tx(l)}</span>`).join('');
  $('#win').hidden = false;
}

/* ---------- scores: each chapter's best result, kept across new games (KEY-scores) ---------- */
const SCORES_KEY = KEY + '-scores';
const CH_NAMES = ['Pippi moves in', 'Locked in with Mr Nilsson', 'Burglars in the night', 'Pippi goes to school', 'Snowball fight', 'Pippi goes to the circus', "Pippi's balloon ride", 'On board the Hoppetossa', 'The South Sea island', 'The voyage home', 'Home again'];
const rankFor = hints => hints===0 ? 'Strongest in the world' : hints<=2 ? 'Thing-finder' : hints<=5 ? 'Pirate in training' : 'Mr Nilsson';
let scoresMem = null;   // also works when the browser blocks storage (for this visit only)
function getScores(){
  if(!scoresMem){ try{ scoresMem = JSON.parse(localStorage.getItem(SCORES_KEY) || '{}') || {}; }catch(e){ scoresMem = {}; } }
  return scoresMem;
}
/* Best time and fewest hints are kept separately: a faster run with more hints still improves the time. */
function recordScore(ch, t, hints){
  const all = getScores(), old = all[ch];
  all[ch] = { t: old ? Math.min(old.t, t) : t, hints: old ? Math.min(old.hints, hints) : hints };
  try{ localStorage.setItem(SCORES_KEY, JSON.stringify(all)); }catch(e){}
}
function openScores(){
  const all = getScores();
  const rows = CH_NAMES.map((n, i) => { const r = all[i];
    return `<tr class="${r ? '' : 'todo'}"><td><b>${i}</b> ${n}</td>` + (r ? `<td>${fmt(r.t)}</td><td>${r.hints}</td><td>${rankFor(r.hints)}</td>` : `<td colspan="3">Not finished yet</td>`) + '</tr>'; }).join('');
  const got = ACH.filter(([k]) => S.ach[k]).length;
  openModal('Scores', 'Your best result per chapter. A new game keeps them.', `
    <table class="scores"><thead><tr><th>Chapter</th><th>Best time</th><th>Fewest hints</th><th>Rank</th></tr></thead><tbody>${rows}</tbody></table>
    ${Object.keys(all).length ? '' : '<div class="feedback">No chapter finished yet. Escape and your result appears here.</div>'}
    <h4 class="scores-h">${tx('Achievements ({n} of {m})', { n: got, m: ACH.length })}</h4>
    <div class="ach">${ACH.map(([k, l]) => `<span class="${S.ach[k] ? 'got' : ''}">${S.ach[k] ? '✓ ' : ''}${tx(l)}</span>`).join('')}</div>`);
}
$('#btn-scores').onclick = openScores;

$('#btn-hint').onclick = () => {
  if(!$('#title').hidden || chapterDone()) return;
  const st = stage_(); const lv = S.hl[st] || 0; const arr = HINTS[st];
  S.hints++; S.hl[st] = lv + 1; save(); applyVisuals();
  say([['sys', tx(lv>=arr.length-1 ? 'Big hint: {hint}' : 'Hint: {hint}', { hint: tx(arr[Math.min(lv, arr.length-1)]) })]]);
};
const rev = $('#btn-reveal');
rev.onclick = () => { stage.classList.add('reveal'); setTimeout(()=>stage.classList.remove('reveal'), 1600); };
document.addEventListener('keydown', e => {
  if(e.key==='Escape') closeModal();
  if(e.code==='Space' && $('#modal').hidden && document.activeElement && !/INPUT|BUTTON/.test(document.activeElement.tagName) && !document.activeElement.classList.contains('hit')){ e.preventDefault(); stage.classList.add('reveal'); }
});
document.addEventListener('keyup', e => { if(e.code==='Space') stage.classList.remove('reveal'); });
$('#btn-sound').textContent = soundOn ? 'Sound on' : 'Sound off';
$('#btn-sound').onclick = () => { soundOn = !soundOn; $('#btn-sound').textContent = soundOn ? 'Sound on' : 'Sound off';
  try{ localStorage.setItem(KEY + '-sound', soundOn ? '1' : '0'); }catch(e){}
  ambUpdate(); };

/* ---------- timer ---------- */
const fmt = s => String(Math.floor(s/60)).padStart(2,'0') + ':' + String(s%60).padStart(2,'0');
setInterval(() => { if(S.started && !chapterDone() && $('#title').hidden && document.visibilityState==='visible'){ S.t++; $('#timer').textContent = fmt(S.t); if(S.t%5===0) save(); } }, 1000);

/* ---------- flow ---------- */
const ACH = [['spunk','Asked the spunk'],['egghead','Egg on your head'],['ceiling','Pancake on the ceiling'],['lift','Tried to lift the horse'],['drawers','Opened every little drawer'],['nilsson','Said please three times'],
  ['shake','Shook Pippi three times'],['giant','A shadow over 5 metres tall'],['venus','Wished upon a planet'],
  ['quarter','Four is more than three'],['freckles',"Counted Pippi's freckles"],
  ['honk','Honked the clown\'s nose'],['lightsout','Lights out!'],['flyer','The flying strongman'],
  ['tasted','Tasted the sea'],['closehorse','A horse, very close up'],['neptune','Met King Neptune'],
  ['snowangel','Made a snow angel'],['carrot',"The snowman's nose"],['ownhead','Snowball on your own head'],
  ['bonk','Bonked by a coconut'],['soaked','Soaked to the skin'],['polly','Taught the parrot a word'],
  ['postbox','Read all the post'],['furry','A very furry pancake'],['potofgold','Looked for the pot of gold'],
  ['upside','Upside down in the sky'],['cloudjar','Tried to bottle a cloud'],['saab','Spotted the little Saab'],
  ['greenhorse','A seasick horse'],['ahoy','Ahoy, Sweden!'],['firstspunk','Found the very first spunk']];
function startNew(){ S = Object.assign(fresh(), { ach: S.ach || {} }); S.started = true; sel = null; $('#title').hidden = true; $('#win').hidden = true; renderInv(); applyVisuals(); $('#timer').textContent = '00:00'; save(); intro1(); }
function cont(){ $('#title').hidden = true; S.started = true; renderInv(); applyVisuals(); $('#timer').textContent = fmt(S.t);
  say([["sys", S.scene==='move' ? (S.f.veranda ? "Back at Villa Villekulla. The horse is on its veranda, and there's still work to do inside." : "Back on moving day. The cart is still waiting in the road.")
    : S.scene==='home' ? (S.f.rainbow ? "Back home. The rainbow is still over the roof, and something is snuffling on the veranda." : S.f.door ? "Back at Villa Villekulla. The party table is waiting in the garden." : "Back at Villa Villekulla. Pippi is still holding the horse over her head.")
    : S.scene==='voyage' ? (S.f.out9 ? "Back in the harbour. The whole town is still waiting on the quay." : S.f.light ? "Back on board. The harbour at home is right ahead." : "Back on board the Hoppetossa, sailing north towards home.")
    : S.scene==='island' ? (S.f.storm ? "Back on the island. It's getting dark, and the turtle nest is waiting." : S.f.tide ? "Back on the island. It's low tide, and Turtle Islet is waiting." : "Back on the island. The king is still snoring in his hammock.")
    : S.scene==='ship' ? (S.f.course ? "Back on board the Hoppetossa. The captain is humming at the wheel, and Mr Nilsson is looking for things to throw." : "Back at the harbour. The horse is still waiting on the quay.")
    : S.scene==='balloon' ? (S.f.up ? "Back in the balloon basket, high above the ground. Mr Nilsson is hanging from the ropes by his tail." : "Back in the garden. The circus balloon is still lying flat in the snow.")
    : S.scene==='circus' ? (S.f.inside ? "Back in the big top. The ringmaster is still pulling at his moustache." : "Back at the circus. The ringmaster is still waiting for tickets.")
    : S.scene==='winter' ? "Back in the snowy garden. Kling and Klang are still building their fort."
    : S.scene==='school' ? "Back in the classroom. Miss is still watching through the little window in the door."
    : S.scene==='bedroom' ? (S.f.scared ? "Back in Pippi's bedroom. The lantern is still waiting behind the old oak." : "Back in Pippi's bedroom. Pippi is still snoring like a ship's horn.")
    : S.f.key ? "Back in Pippi's kitchen. Mr Nilsson is licking syrup off his fingers." : "Back in Pippi's kitchen. Mr Nilsson is still sitting on the bureau with the key."]]); }
$('#btn-new').onclick = startCh0;
$('#btn-cont').onclick = () => chapterDone() ? nextChapter() : cont();
$('#btn-again').onclick = () => ({ 0: startCh0, 2: startCh2, 3: startCh3, 4: startCh4, 5: startCh5, 6: startCh6, 7: startCh7, 8: startCh8, 9: startCh9, 10: startCh10 }[S.ch] || startNew)();
$('#btn-next').onclick = nextChapter;
$('#btn-ch0').onclick = startCh0;
$('#btn-ch1').onclick = startNew;
$('#btn-ch2').onclick = startCh2;
$('#btn-ch3').onclick = startCh3;
$('#btn-ch4').onclick = startCh4;
$('#btn-ch5').onclick = startCh5;
$('#btn-ch6').onclick = startCh6;
$('#btn-ch7').onclick = startCh7;
$('#btn-ch8').onclick = startCh8;
$('#btn-ch9').onclick = startCh9;
$('#btn-ch10').onclick = startCh10;
const STAY = {
  0: "Take your time. The clock is ticking, the horse is dozing on its veranda, and Tommy and Annika are exploring the house. When you're ready, the front door leads on to Chapter {n}.",
  1: "Take your time. Pippi is handing out sweets in the garden. When you're ready, the front door leads on to Chapter {n}.",
  2: "Take your time. The burglars aren't going anywhere: they're on top of the wardrobe. When you're ready, the veranda door leads on to Chapter {n}.",
  3: "Take your time. School's out, and the classroom is all yours. Mr Nilsson is finishing the cake. When you're ready, the classroom door leads on to Chapter {n}.",
  4: "Take your time. Kling and Klang are digging their cap out of the snow. When you're ready, the garden gate leads on to Chapter {n}.",
  5: "Take your time. The show goes on: the horse is still trotting round the ring, and the confetti keeps coming. When you're ready, the curtain leads on to Chapter {n}.",
  6: "Take your time. The weathercock is shining on the church tower, and the whole town is still waving at the balloon. When you're ready, the harbour leads on to Chapter {n}: a ship has just sailed in.",
  7: "Take your time. The Hoppetossa is anchored in the lagoon, the palm trees are swaying, and Pippi is already up a coconut tree. When you're ready, go ashore: click the island to go on to Chapter {n}.",
  8: "Take your time. The feast goes on behind the hut, the moon shines on the lagoon, and somewhere out there, twenty-five little turtles are swimming. When you're ready, the Hoppetossa will sail you home: click her to go on to Chapter {n}.",
  9: "Take your time. The Hoppetossa is resting against the quay, and the whole town is waving. When you're ready, step onto the quay to go on to Chapter {n}.",
  10: "Take your time. The party goes on under the lanterns in the old oak, the horse is dozing on its veranda, and the hedgehog is eating its supper under the lilac."
};
$('#btn-stay').onclick = () => { $('#win').hidden = true; exitLabels();
  say(['sys', tx(STAY[S.ch] || STAY[1], { n: S.ch + 1 })]); };
$('#btn-menu').onclick = () => { closeModal(); $('#dialog').hidden = true; queue = []; stopSpeaking(); $('#title').hidden = false; $('#win').hidden = true; refreshMenu(); };

const ROT_LINES = [
  "Pippi says: why stand up straight when you can lie on your side? Turn your phone and see the whole kitchen.",
  "In Egypt, everybody holds their phone sideways. Pippi says so.",
  "Pippi sleeps with her feet on the pillow. You could at least turn your phone.",
  "Mr Nilsson holds phones upside down. Sideways is a good compromise."
];
function setupRotate(){
  const r = $('#rotate'); let off = false;
  try{ off = localStorage.getItem(KEY + '-norotate') === '1'; }catch(e){}
  r.hidden = off;
  $('#rot-line').textContent = ROT_LINES[Math.floor(Math.random() * ROT_LINES.length)];
  $('#rot-x').onclick = () => { r.hidden = true; beep(500,.04); try{ localStorage.setItem(KEY + '-norotate','1'); }catch(e){} };
}
const MOTION_NEXT = { auto: 'on', on: 'off', off: 'auto' };
$('#btn-motion').onclick = () => {
  motionPref = MOTION_NEXT[motionPref] || 'auto';
  try{ localStorage.setItem(KEY + '-motion', motionPref); }catch(e){}
  applyMotion();
  say([['sys', motionPref === 'on' ? 'Motion on: flags flutter and fires flicker, even if your device asks for less motion.'
             : motionPref === 'off' ? 'Motion off: everything stands still. Even Mr Nilsson. Well, almost.'
             : tx("Motion auto: following your device's setting, which is {now}.", { now: tx(deviceReducesMotion() ? '"reduce motion", so things stand still' : 'full motion') })]]);
};
matchMedia('(prefers-reduced-motion: reduce)').addEventListener?.('change', applyMotion);

/* ---------- language (js/i18n.js) ---------- */
function showLang(){
  const b = $('#btn-lang');
  b.querySelectorAll('[data-l]').forEach(s => s.classList.toggle('on', s.dataset.l === LANG));
  b.title = { en: 'Language: English. Next: Nederlands.', nl: 'Taal: Nederlands. Nästa: svenska.', sv: 'Språk: svenska. Next: English.' }[LANG];
  b.setAttribute('aria-label', b.title);
}
/* The button cycles English → Dutch → Swedish → English. */
const LANG_NEXT = { en: 'nl', nl: 'sv', sv: 'en' };
const LANG_HELLO = {
  en: 'English! Here Pippi is Pippi Longstocking, and her house is Villa Villekulla.',
  nl: 'Nederlands! Pippi heet hier Pippi Langkous, en haar huis Villa Kakelbont.',
  sv: 'Svenska! Här heter Pippi Pippi Långstrump, precis som i Astrid Lindgrens böcker.'
};
$('#btn-lang').onclick = async () => {
  const to = LANG_NEXT[LANG] || 'en';
  if(!(await setLang(to))) return say([['sys', 'The text for that language could not be loaded. Are you offline? Try again when you are connected.']]);
  beep(700,.04);
  if(!$('#title').hidden || !$('#win').hidden || !$('#dialog').hidden) return;
  say([['sys', LANG_HELLO[to]]]);
};
onLangChange(() => {
  closeModal(); showLang(); applyMotion(); renderInv(); applyVisuals(); refreshMenu();
  document.title = tx('Villa Villekulla');
  if(!$('#win').hidden) showWin();
  if(!$('#dialog').hidden && curLine){ clearInterval(typing); typing = null; full = tx(curLine[1]); $('#d-txt').textContent = full; }
});

/* Chapters were added in between three times: winter became Chapter 4 (the circus and the Hoppetossa moved up one, '-ord' 2),
   the balloon ride became Chapter 6 (the Hoppetossa, the island and home moved up one, '-ord' 3),
   and the voyage home became Chapter 9 (home moved up one, '-ord' 4). */
function renumber(){
  try{
    const ord = +(localStorage.getItem(KEY + '-ord') || 0);
    if(ord >= 4) return;
    const shift = (from, top) => {
      for(let n = top; n >= from; n--) if(localStorage.getItem(KEY + '-ch' + n)) localStorage.setItem(KEY + '-ch' + (n + 1), '1');
      const sc = JSON.parse(localStorage.getItem(SCORES_KEY) || 'null');
      if(sc){ const out = {}; Object.keys(sc).forEach(k => { out[+k >= from ? +k + 1 : k] = sc[k]; }); localStorage.setItem(SCORES_KEY, JSON.stringify(out)); }
    };
    if(ord < 3){
      if(ord < 2){ if(localStorage.getItem(KEY + '-ch5')) localStorage.setItem(KEY + '-ch6', '1'); if(localStorage.getItem(KEY + '-ch4')) localStorage.setItem(KEY + '-ch5', '1');
        const sc = JSON.parse(localStorage.getItem(SCORES_KEY) || 'null');
        if(sc){ const out = {}; Object.keys(sc).forEach(k => { out[+k >= 4 ? +k + 1 : k] = sc[k]; }); localStorage.setItem(SCORES_KEY, JSON.stringify(out)); } }
      shift(6, 8);
    }
    shift(9, 9);
    localStorage.setItem(KEY + '-ord', '4');
  }catch(e){}
}
/* Which chapter each room belongs to: an old save's room tells its chapter under the current numbering. */
const ROOM_CH = { move: 0, kitchen: 1, bedroom: 2, school: 3, winter: 4, circus: 5, balloon: 6, ship: 7, island: 8, voyage: 9, home: 10 };
function start(data){
  showLang(); document.title = tx('Villa Villekulla');
  setupRotate();
  renumber();
  buildKitchen(); buildWinter(); buildCircus(); buildBalloon(); buildShip(); buildVoyage();
  applyMotion();
  const saved = (data && data.v===1) ? data : load();
  if(saved){ S = Object.assign(fresh(), saved); }
  else { S.ch = 0; S.scene = 'move'; }   // a new visitor sees moving day behind the title
  const ch = ROOM_CH[S.scene];
  if(ch && S.ch !== ch){
    if(S.f['out' + S.ch]){ S.f['out' + ch] = true; delete S.f['out' + S.ch]; }
    S.ch = ch; save();
    try{ if(ch > 1) localStorage.setItem(KEY + '-ch' + ch, '1'); }catch(e){}
  }
  refreshMenu();
  renderInv(); applyVisuals(); $('#timer').textContent = fmt(S.t);
}
/* ---------- installable app (PWA) ---------- */
if('serviceWorker' in navigator && document.querySelector('link[rel="manifest"]') && /^https?:$/.test(location.protocol)){
  navigator.serviceWorker.addEventListener('message', e => { if(e.data && e.data.type === 'version') swVersion(e.data.cache); });
  navigator.serviceWorker.register('sw.js').catch(() => {});
  navigator.serviceWorker.ready.then(r => r.active && r.active.postMessage({ type: 'version?' })).catch(() => {});
}
/* The service worker serves a newer version than the code running on this page: offer a reload (the game is saved). */
function swVersion(cache){
  const n = +String(cache).replace(/\D/g, '');
  if(n > GAME_VERSION) $('#update-bar').hidden = false;
}
$('#btn-update').onclick = () => { save(); location.reload(); };
$('#version').textContent = 'v' + GAME_VERSION;
let installEvt = null;
window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; $('#btn-install').hidden = false; });
window.addEventListener('appinstalled', () => { installEvt = null; $('#btn-install').hidden = true; say(['pippi', "Installed! Now Villa Villekulla lives on your device. Mr Nilsson has already moved in."]); });
$('#btn-install').onclick = async () => { if(!installEvt) return; installEvt.prompt(); try{ await installEvt.userChoice; }catch(e){} installEvt = null; $('#btn-install').hidden = true; };

window.claude?.hot?.snapshot?.(() => S);
window.claude?.hot?.ready ? window.claude.hot.ready(start) : start(window.claude?.hot?.data ?? null);
