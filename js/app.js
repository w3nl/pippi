// Chapters and end screens, hint/reveal/sound buttons, timer, achievements, scores, title menu, installable app, and start-up.
// Loaded in order by js/boot.js; all game files share the same global scope.

/* ---------- chapters ---------- */
function chapterDone(){ return !!S.f.out1; }
function refreshMenu(){ const fin = chapterDone(); $('#btn-cont').hidden = !S.started || fin; $('#btn-cont').textContent = 'Continue'; }

const CH_END = {
  1:['Door open · Chapter 1 complete', "You're out", "Next: that night, two burglars come creeping up to Villa Villekulla. They've heard about a certain suitcase full of gold… Chapter 2 is still being written."]
};
function showWin(){
  const [eb, ti, note] = CH_END[S.ch] || CH_END[1];
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
const CH_NAMES = ['Locked in with Mr Nilsson'];
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
  const rows = CH_NAMES.map((n, i) => { const r = all[i + 1];
    return `<tr class="${r ? '' : 'todo'}"><td><b>${i + 1}</b> ${n}</td>` + (r ? `<td>${fmt(r.t)}</td><td>${r.hints}</td><td>${rankFor(r.hints)}</td>` : `<td colspan="3">Not finished yet</td>`) + '</tr>'; }).join('');
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
const ACH = [['spunk','Asked the spunk'],['egghead','Egg on your head'],['ceiling','Pancake on the ceiling'],['lift','Tried to lift the horse'],['drawers','Opened every little drawer'],['nilsson','Said please three times']];
function startNew(){ S = Object.assign(fresh(), { ach: S.ach || {} }); S.started = true; sel = null; $('#title').hidden = true; $('#win').hidden = true; renderInv(); applyVisuals(); $('#timer').textContent = '00:00'; save(); intro1(); }
function cont(){ $('#title').hidden = true; S.started = true; renderInv(); applyVisuals(); $('#timer').textContent = fmt(S.t);
  say([["sys", S.f.key ? "Back in Pippi's kitchen. Mr Nilsson is licking syrup off his fingers." : "Back in Pippi's kitchen. Mr Nilsson is still sitting on the bureau with the key."]]); }
$('#btn-new').onclick = startNew;
$('#btn-cont').onclick = cont;
$('#btn-again').onclick = startNew;
$('#btn-stay').onclick = () => { $('#win').hidden = true; say(['sys', "Take your time. Pippi is handing out sweets in the garden, and the horse is eating the lawn."]); };
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

function start(data){
  showLang(); document.title = tx('Villa Villekulla');
  setupRotate();
  buildKitchen();
  applyMotion();
  const saved = (data && data.v===1) ? data : load();
  if(saved){ S = Object.assign(fresh(), saved); }
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
