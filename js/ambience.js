// Ambient sound: a quiet, generated soundscape for each room, made with the Web Audio API (no audio files).
// Follows the Sound button, pauses on the title screen and when the tab is hidden, and changes with the story
// (the stove fire once it is lit). ambKey() decides what should be playing.

const AMB = { cur: null, master: null, nodes: [], timers: [] };
let noiseBuf = null;

function audioCtx(){ ac = ac || new (window.AudioContext || window.webkitAudioContext)(); return ac; }

/* What should be playing right now, as a key like 'kitchen+fire'. null means silence. */
function ambKey(){
  if(!soundOn || !S.started || !$('#title').hidden || document.visibilityState !== 'visible') return null;
  const f = S.f;
  switch(S.scene){
    case 'kitchen': return 'kitchen' + (f.fire ? '+fire' : '');
    case 'bedroom': return 'bedroom' + (f.out2 ? '' : '+snore');
    case 'school': return 'school' + (f.out3 ? '' : '+horse');
    case 'circus': return 'circus' + (f.out4 ? '+show' : '');
    case 'ship': return 'ship' + (!f.course ? '+harbour' : f.water && !f.equator ? '+night' : '+sailing');
  }
  return null;
}

function ambUpdate(){
  let want = null;
  try{ want = ambKey(); }catch(e){}
  if(want === AMB.cur) return;
  ambStop();
  AMB.cur = want;
  if(want){ try{ ambStart(want); }catch(e){ AMB.cur = null; } }
}

function ambStop(){
  AMB.timers.forEach(clearTimeout); AMB.timers = [];
  const m = AMB.master, nodes = AMB.nodes;
  AMB.master = null; AMB.nodes = [];
  if(!m || !ac) return;
  m.gain.cancelScheduledValues(ac.currentTime);
  m.gain.setTargetAtTime(0, ac.currentTime, .25);
  setTimeout(() => { nodes.forEach(n => { try{ n.stop && n.stop(); }catch(e){} try{ n.disconnect(); }catch(e){} }); try{ m.disconnect(); }catch(e){} }, 1500);
}

function ambStart(key){
  const ctx = audioCtx();
  if(ctx.state === 'suspended') ctx.resume().catch(() => {});
  const m = ctx.createGain();
  m.gain.value = 0; m.connect(ctx.destination); m.gain.setTargetAtTime(.9, ctx.currentTime, .8);
  AMB.master = m;
  const [scene, ...mods] = key.split('+');
  SOUNDSCAPES[scene](m, mods);
}

/* ---------- building blocks ---------- */
const keep = n => (AMB.nodes.push(n), n);

function noiseBuffer(){
  if(noiseBuf) return noiseBuf;
  const ctx = audioCtx(), b = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate), d = b.getChannelData(0);
  for(let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return noiseBuf = b;
}

/* A steady bed of filtered noise (fans, wind, water). wobble makes it swell slowly. */
function bed(out, { type = 'lowpass', freq = 500, q = .7, gain = .02, wobble = 0, rate = .2 } = {}){
  const src = keep(ac.createBufferSource()); src.buffer = noiseBuffer(); src.loop = true;
  const f = keep(ac.createBiquadFilter()); f.type = type; f.frequency.value = freq; f.Q.value = q;
  const g = keep(ac.createGain()); g.gain.value = gain;
  src.connect(f); f.connect(g); g.connect(out); src.start();
  if(wobble){ const l = keep(ac.createOscillator()); l.frequency.value = rate; const lg = keep(ac.createGain()); lg.gain.value = gain * wobble; l.connect(lg); lg.connect(g.gain); l.start(); }
  return g;
}

/* A constant tone (mains hum, motors). */
function hum(out, freq, gain, type = 'sine', lowpass){
  const o = keep(ac.createOscillator()); o.type = type; o.frequency.value = freq;
  const g = keep(ac.createGain()); g.gain.value = gain;
  if(lowpass){ const f = keep(ac.createBiquadFilter()); f.type = 'lowpass'; f.frequency.value = lowpass; o.connect(f); f.connect(g); } else o.connect(g);
  g.connect(out); o.start();
}

/* One short tone, optionally gliding to another pitch (chirps, drips, seagulls). */
function blip(out, freq, dur, vol, type = 'sine', glideTo){
  if(!AMB.master) return;
  const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t); if(glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t + dur);
  g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + .05);
}

/* One short burst of noise (crackles, footsteps, breath). */
function burst(out, dur, vol, freq = 2000, type = 'bandpass'){
  if(!AMB.master) return;
  const t = ac.currentTime, s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
  s.buffer = noiseBuffer(); f.type = type; f.frequency.value = freq;
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(out); s.start(t, Math.random() * 1.5); s.stop(t + dur + .05);
}

/* Run fn every min–max milliseconds while this soundscape plays. */
function every(min, max, fn){
  const tick = () => { if(!AMB.master) return; try{ fn(); }catch(e){} AMB.timers.push(setTimeout(tick, min + Math.random() * (max - min))); };
  AMB.timers.push(setTimeout(tick, 300 + Math.random() * min));
}
const later = (ms, fn) => AMB.timers.push(setTimeout(() => AMB.master && fn(), ms));
/* ---------- one soundscape per room ---------- */
const SOUNDSCAPES = {
  // Chapter 1, the kitchen of Villa Villekulla: an evening breeze, a ticking clock, a blackbird in the garden,
  // the odd monkey chatter from Mr Nilsson, and the stove crackling once it's lit.
  kitchen(m, mods){
    bed(m, { freq: 320, gain: .02, wobble: .6, rate: .06 });
    every(1000, 1000, () => burst(m, .03, .02, 3800));
    every(7000, 15000, () => [0, 1, 2, 3].forEach(i => later(i * 140, () => blip(m, 2200 + Math.random() * 900, .12, .012, 'sine', 1700 + Math.random() * 600))));
    every(14000, 26000, () => [0, 1, 2].forEach(i => later(i * 110, () => blip(m, 900 + i * 120, .08, .01, 'triangle', 1400))));
    if(mods.includes('fire')){
      bed(m, { freq: 180, gain: .025, wobble: .4, rate: .3 });
      every(80, 420, () => burst(m, .04 + Math.random() * .06, .01 + Math.random() * .025, 1800 + Math.random() * 2500, 'highpass'));
    }
  },
  // Chapter 2, Pippi's bedroom at night: crickets, an owl now and then, the wind, and Pippi snoring (until she wakes).
  bedroom(m, mods){
    bed(m, { freq: 260, gain: .015, wobble: .5, rate: .05 });
    every(180, 420, () => blip(m, 4200 + Math.random() * 500, .03, .006, 'sine'));
    every(12000, 22000, () => { blip(m, 420, .35, .02, 'sine', 380); later(500, () => blip(m, 400, .55, .02, 'sine', 360)); });
    if(mods.includes('snore')) every(3600, 3600, () => { burst(m, 1.1, .03, 220, 'lowpass'); later(1500, () => burst(m, .7, .015, 600, 'bandpass')); });
  },
  // Chapter 4, the big top: the murmur of the audience, a barrel-organ waltz, the odd honk from the clown,
  // and once the show starts, a drumroll and cheering.
  circus(m, mods){
    bed(m, { type: 'bandpass', freq: 500, q: .5, gain: .025, wobble: .4, rate: .15 });
    const tune = [67, 71, 74, 71, 72, 76, 74, 0, 67, 71, 74, 79, 78, 74, 76, 0]; let i = 0;
    const play = () => { if(!AMB.master) return; const n = tune[i++ % tune.length]; if(n) blip(m, 440 * Math.pow(2, (n - 69) / 12), .3, .012, 'square'); AMB.timers.push(setTimeout(play, 330)); };
    AMB.timers.push(setTimeout(play, 600));
    every(9000, 17000, () => { blip(m, 330, .12, .02, 'sawtooth', 300); later(160, () => blip(m, 330, .12, .02, 'sawtooth', 300)); });
    if(mods.includes('show')){ every(80, 120, () => burst(m, .05, .008, 300, 'lowpass')); every(3000, 6000, () => burst(m, 1.2, .03, 1500, 'bandpass')); }
  },
  // Chapter 3, the classroom on a summer morning: a quiet room, the school clock, sparrows outside,
  // and the horse munching geraniums in the schoolyard (until the holidays start).
  school(m, mods){
    bed(m, { freq: 400, gain: .012, wobble: .3, rate: .08 });
    every(1000, 1000, () => burst(m, .025, .018, 3200));
    every(5000, 11000, () => [0, 1, 2].forEach(i => later(i * 120, () => blip(m, 3000 + Math.random() * 800, .07, .01, 'sine', 2600))));
    if(mods.includes('horse')) every(6000, 12000, () => [0, 1, 2, 3].forEach(i => later(i * 260, () => burst(m, .12, .02, 500, 'bandpass'))));
  },
  // Chapter 5, the Hoppetossa: waves against the hull and creaking timbers; gulls in the harbour,
  // wind in the sails at sea, and the ship's bell now and then at night.
  ship(m, mods){
    bed(m, { freq: 380, gain: .022, wobble: .8, rate: .12 });
    every(4000, 9000, () => blip(m, 90 + Math.random() * 40, .5, .012, 'sawtooth', 70));
    if(mods.includes('harbour')) every(5000, 11000, () => [0, 1, 2].forEach(i => later(i * 180, () => blip(m, 1500 + Math.random() * 300, .18, .012, 'sine', 1100))));
    if(mods.includes('sailing')) bed(m, { type: 'bandpass', freq: 900, q: .5, gain: .012, wobble: .6, rate: .2 });
    if(mods.includes('night')) every(9000, 16000, () => { blip(m, 1320, .9, .015, 'sine'); later(450, () => blip(m, 1320, .9, .015, 'sine')); });
  }
};

/* Keep the soundscape in step with the game. Browsers only allow sound after the player has clicked or tapped. */
setInterval(ambUpdate, 700);
document.addEventListener('visibilitychange', ambUpdate);
['pointerdown', 'keydown'].forEach(ev => document.addEventListener(ev, () => { if(ac && ac.state === 'suspended') ac.resume().catch(() => {}); ambUpdate(); }, { passive: true }));
