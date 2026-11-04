// Core engine: state and saving, sound, dialogue (say), inventory, scene visuals (applyVisuals), hotspot input and close-ups (openModal).
// Loaded in order by js/boot.js; all game files share the same global scope.

const KEY = 'pippi-villa-v1';
const $ = s => document.querySelector(s);
const fresh = () => ({ v:1, ch:1, scene:'kitchen', f:{}, inv:[], hl:{}, hints:0, t:0, ach:{}, started:false });
let S = fresh();
let sel = null;
let justGiven = null;   // the item that just went into your pockets: its slot pops (css/base.css .slot.pop)
/* Motion: 'auto' follows the device's "reduce motion" setting; 'on' and 'off' override it. Saved per device. */
let motionPref = (() => { try{ return localStorage.getItem(KEY + '-motion') || 'auto'; }catch(e){ return 'auto'; } })();
const deviceReducesMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
function reducedMotion(){ return motionPref === 'off' || (motionPref === 'auto' && deviceReducesMotion()); }
function applyMotion(){
  const root = document.documentElement;
  root.classList.toggle('motion-on', motionPref === 'on');
  root.classList.toggle('motion-off', motionPref === 'off');
  // SMIL animations inside the scenes ignore CSS, so pause them by hand
  document.querySelectorAll('svg.scene').forEach(s => { try{ reducedMotion() ? s.pauseAnimations() : s.unpauseAnimations(); }catch(e){} });
  const b = document.getElementById('btn-motion');
  if(b){ b.textContent = tx({ auto:'Motion auto', on:'Motion on', off:'Motion off' }[motionPref]);
    b.title = motionPref === 'auto' ? tx(`Auto follows your device's "reduce motion" setting (now: {now}). Click to change.`, { now: tx(deviceReducesMotion() ? 'reduced, so things stand still' : 'full motion') })
            : tx(motionPref === 'on' ? 'Everything moves, whatever your device prefers. Click to change.' : 'Nothing moves. Click to change.'); }
}
let soundOn = (() => { try{ return localStorage.getItem(KEY + '-sound') !== '0'; }catch(e){ return true; } })();

/* ---------- persistence ---------- */
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} }
function load(){ try{ const d = JSON.parse(localStorage.getItem(KEY)||'null'); return d && d.v===1 ? d : null; }catch(e){ return null; } }

/* ---------- sound ---------- */
let ac = null;
function beep(freq=660, dur=.08, type='triangle', vol=.06){
  if(!soundOn) return;
  try{
    ac = ac || new (window.AudioContext||window.webkitAudioContext)();
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.value = freq; g.gain.value = vol;
    o.connect(g); g.connect(ac.destination);
    g.gain.setValueAtTime(vol, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime+dur);
    o.start(); o.stop(ac.currentTime+dur+.02);
  }catch(e){}
}
const chord = (arr, gap=90) => arr.forEach((f,i)=>setTimeout(()=>beep(f,.14,'triangle',.06), i*gap));

/* ---------- dialogue ---------- */
const WHO = { you:'You', sys:'Villa Villekulla', pippi:'Pippi', nilsson:'Mr Nilsson', horse:'The horse', spunk:'The spunk', tommy:'Tommy', annika:'Annika', karlsson:'Thunder-Karlsson', bloom:'Bloom', teacher:'Miss', ringmaster:'The ringmaster', clown:'The clown', strongman:'The strongman', seal:'The seal', captain:'Captain Longstocking' };
let queue = [], typing = null, full = '', onDone = null, curLine = null;
function say(lines, done){
  queue = (Array.isArray(lines) ? lines : [lines]).map(l => typeof l === 'string' ? ['you', l] : l);
  onDone = done || null;
  next();
}
/* Portraits next to the dialogue (portraits/*.svg). The narrator ('sys') has none. */
function faceFor(who){
  const file = { you:'you', pippi:'pippi', nilsson:'nilsson', horse:'horse', spunk:'spunk', tommy:'tommy', annika:'annika', karlsson:'karlsson', bloom:'bloom', teacher:'teacher', ringmaster:'ringmaster', clown:'clown', strongman:'strongman', captain:'captain' }[who];
  return file ? `portraits/${file}.svg` : null;
}
function next(){
  clearInterval(typing); typing = null;
  const box = $('#dialog');
  if(!queue.length){ box.hidden = true; if(typeof stopSpeaking === 'function') stopSpeaking(); const d = onDone; onDone = null; d && d(); return; }
  const [who, text] = curLine = queue.shift();
  box.hidden = false;
  box.className = 'dialog who-' + who;
  const face = faceFor(who), fe = $('#d-face');
  if(face){ box.classList.add('has-face'); fe.hidden = false;
    if(fe.getAttribute('src') !== face){ fe.src = face; fe.classList.remove('face-in'); void fe.offsetWidth; fe.classList.add('face-in'); } }
  else fe.hidden = true;
  $('#d-who').textContent = (who==='sys' && S.ch===2) ? 'Villa Villekulla · night' : (who==='sys' && S.ch===3) ? 'The little school' : (who==='sys' && S.ch===4) ? 'The big top' : (who==='sys' && S.ch===5) ? 'The Hoppetossa' : (WHO[who] || who);
  $('#d-more').textContent = matchMedia('(hover: none)').matches ? (queue.length ? 'tap ▸' : 'tap ✕') : (queue.length ? 'click ▸' : 'click ✕');
  full = tx(text); let i = 0;
  const el = $('#d-txt'); el.textContent = '';
  if(typeof speakLine === 'function') speakLine(who, full);   // optional voices (js/voice.js)
  if(reducedMotion()){ el.textContent = full; return; }
  typing = setInterval(() => { i += 2; el.textContent = full.slice(0, i); if(i >= full.length){ clearInterval(typing); typing = null; } }, 16);
}
$('#dialog').addEventListener('click', () => {
  if(typing){ clearInterval(typing); typing = null; $('#d-txt').textContent = full; return; }
  next();
});

/* ---------- inventory ---------- */
const ITEMS = {
  spunk: { name:'The spunk', desc:'Pippi invented the word "spunk" and then went looking for one. It turned out to be this little green beetle. Use it on anything for a free hint.',
    svg:'<svg viewBox="0 0 44 44"><rect x="9" y="12" width="26" height="26" rx="5" fill="#cfe6e0" opacity=".6" stroke="#e9f4f0" stroke-width="1.5"/><rect x="8" y="8" width="28" height="6" rx="2" fill="#e8571f"/><ellipse cx="22" cy="28" rx="6" ry="4.5" fill="#2f8a3a"/><circle cx="22" cy="22.5" r="2.6" fill="#1d5a25"/><path d="M16 28h-3M28 28h3M17 31l-3 3M27 31l3 3" stroke="#1d5a25" stroke-width="1.4"/></svg>' },
  note: { name:"Pippi's note", desc:'Written backwards. Pippi says that in Egypt everybody writes like this.',
    svg:'<svg viewBox="0 0 44 44"><rect x="8" y="9" width="28" height="26" fill="#fffaf0" transform="rotate(-6 22 22)"/><path d="M13 16h18M13 21h15M13 26h18M13 31h10" stroke="#e8571f" stroke-width="2" transform="rotate(-6 22 22)"/></svg>' },
  matches: { name:'Matches', desc:'A box of matches from the secret drawer. Strike them on the box, not on the monkey.',
    svg:'<svg viewBox="0 0 44 44"><rect x="8" y="14" width="28" height="18" rx="2" fill="#f2c94c" stroke="#8a5a1a" stroke-width="2"/><rect x="8" y="14" width="28" height="5" fill="#8a3a1a"/><path d="M14 24h14" stroke="#e8571f" stroke-width="3"/><circle cx="30" cy="24" r="3" fill="#c33"/></svg>' },
  eggs: { name:'Eggs', desc:'Three eggs from the pantry. Handle with care. (Pippi never does.)',
    svg:'<svg viewBox="0 0 44 44"><ellipse cx="14" cy="26" rx="7" ry="9" fill="#f7efe0" stroke="#c9b48a"/><ellipse cx="30" cy="26" rx="7" ry="9" fill="#f3e6cc" stroke="#c9b48a"/><ellipse cx="22" cy="18" rx="7" ry="9" fill="#fff8ea" stroke="#c9b48a"/></svg>' },
  pancake: { name:'Pancake', desc:'A warm, golden pancake. Mr Nilsson would sell his own hat for one.',
    svg:'<svg viewBox="0 0 44 44"><ellipse cx="22" cy="26" rx="17" ry="10" fill="#e3a54e" stroke="#a8692a" stroke-width="2"/><ellipse cx="22" cy="24" rx="12" ry="6" fill="#f2c26e"/><circle cx="17" cy="23" r="1.5" fill="#a8692a"/><circle cx="26" cy="25" r="1.5" fill="#a8692a"/></svg>' },
  key: { name:'Front-door key', desc:'A big old iron key, slightly sticky with monkey and pancake.',
    svg:'<svg viewBox="0 0 44 44"><circle cx="13" cy="22" r="8" fill="none" stroke="#c9952a" stroke-width="4"/><path d="M21 22h18M33 22v7M38 22v5" stroke="#c9952a" stroke-width="4" stroke-linecap="round"/></svg>' },
  sugar: { name:'Sugar cubes', desc:"From the captain's sea chest. Horses love them.",
    svg:'<svg viewBox="0 0 44 44"><rect x="8" y="20" width="13" height="13" fill="#fff" stroke="#c9c2b2"/><rect x="22" y="22" width="13" height="13" fill="#f6f1e6" stroke="#c9c2b2"/><rect x="15" y="9" width="13" height="13" fill="#fdfbf6" stroke="#c9c2b2"/></svg>' }
};
function renderInv(){
  const wrap = $('#slots'); wrap.innerHTML = '';
  for(let i=0;i<4;i++){
    const id = S.inv[i];
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'slot' + (id ? ' filled' : '') + (id && sel===id ? ' sel' : '');
    if(id && id===justGiven){ b.classList.add('pop'); justGiven = null; }
    if(id){ b.innerHTML = ITEMS[id].svg; b.title = ITEMS[id].name; b.setAttribute('aria-label', ITEMS[id].name);   // translated on the page by i18n.js
      b.onclick = () => { sel = sel===id ? null : id; beep(880,.04); renderInv(); };
    } else { b.disabled = true; b.setAttribute('aria-label','Empty pocket'); }
    wrap.appendChild(b);
  }
  $('#tray-hint').textContent = sel ? tx('{name}: {desc} Click a spot to use it, or the item again to put it away.', { name: tx(ITEMS[sel].name), desc: tx(ITEMS[sel].desc) }) : (matchMedia('(hover: none)').matches ? 'Select an item, then tap where you want to use it.' : 'Select an item, then click where you want to use it.');
  document.querySelectorAll('.hit').forEach(h => h.classList.toggle('item-cursor', !!sel));
}
function give(id){ if(!S.inv.includes(id)) S.inv.push(id); justGiven = id; chord([523,659,784]); renderInv(); save(); }
function take(id){ S.inv = S.inv.filter(x=>x!==id); if(sel===id) sel=null; renderInv(); save(); }

/* ---------- scene visuals ---------- */
function applyVisuals(){
  $('#sc-kitchen').classList.toggle('on', S.scene==='kitchen');
  $('#sc-bedroom').classList.toggle('on', S.scene==='bedroom');
  $('#sc-school').classList.toggle('on', S.scene==='school');
  $('#sc-circus').classList.toggle('on', S.scene==='circus');
  $('#sc-ship').classList.toggle('on', S.scene==='ship');
  $('#chap').textContent = S.ch===5 ? 'Chapter 5 · On Board the Hoppetossa' : S.ch===4 ? 'Chapter 4 · Pippi Goes to the Circus' : S.ch===3 ? 'Chapter 3 · Pippi Goes to School' : S.ch===2 ? 'Chapter 2 · Burglars in the Night' : 'Chapter 1 · Locked In with Mr Nilsson';
  applyKitchen(); applyBedroom(); applySchool(); applyCircus(); applyShip(); exitLabels();
  $('#hint-count').textContent = S.hints;
}
function go(scene){
  const f = $('#fade'); f.classList.add('on'); beep(220,.08,'sine',.04);
  setTimeout(() => { S.scene = scene; applyVisuals(); save(); f.classList.remove('on'); }, 330);
}

/* ---------- tooltip & hotspot input ---------- */
const stage = $('#stage'), tip = $('#tip');
stage.addEventListener('mousemove', e => {
  const h = e.target.closest && e.target.closest('.hit');
  if(!h || !$('#title').hidden || !$('#win').hidden){ tip.hidden = true; return; }
  const r = stage.getBoundingClientRect();
  tip.hidden = false;
  tip.textContent = sel ? tx('Use {item} on {spot}', { item: tx(ITEMS[sel].name), spot: h.dataset.label }) : h.dataset.label;
  tip.style.left = Math.min(Math.max(e.clientX - r.left, 80), r.width-80) + 'px';
  tip.style.top = (e.clientY - r.top) + 'px';
});
stage.addEventListener('mouseleave', () => tip.hidden = true);
stage.addEventListener('click', e => {
  const h = e.target.closest && e.target.closest('.hit');
  if(!h) return;
  if(e.detail) h.blur();
  if(matchMedia('(hover: none)').matches) tip.hidden = true;
  beep(440,.03,'sine',.03);
  const id = h.dataset.hs;
  if(sel){ const it = sel; sel = null; renderInv(); useItem(it, id); return; }
  (H[id] || (() => say("Nothing interesting. Which is unusual, in this house.")))();
});
stage.addEventListener('contextmenu', e => { if(sel){ e.preventDefault(); sel=null; renderInv(); } });
// keyboard access to hotspots
document.querySelectorAll('.hit').forEach(h => { h.setAttribute('tabindex','0'); h.setAttribute('role','button'); h.setAttribute('aria-label', h.dataset.label);
  h.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' '){ e.preventDefault(); e.stopPropagation(); h.dispatchEvent(new MouseEvent('click',{bubbles:true})); } }); });

/* ---------- modal ---------- */
let modalClose = null;
function openModal(title, sub, html, onOpen, onClose){
  $('#m-title').textContent = title; $('#m-sub').textContent = sub || '';
  $('#m-body').innerHTML = html; $('#modal').hidden = false; tip.hidden = true;
  modalClose = onClose || null;
  onOpen && onOpen($('#m-body'));
}
function closeModal(){ if($('#modal').hidden) return; $('#modal').hidden = true; $('#m-body').innerHTML=''; const c = modalClose; modalClose=null; c && c(); }
$('#m-close').onclick = closeModal;
$('#modal').addEventListener('click', e => { if(e.target.id==='modal') closeModal(); });

const nope = () => beep(140,.2,'sawtooth',.04);   // the 'wrong answer' buzz
