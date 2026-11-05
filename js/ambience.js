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
    case 'move': return 'move' + (f.out0 ? '+tick' : '');
    case 'kitchen': return 'kitchen' + (f.fire ? '+fire' : '');
    case 'bedroom': return 'bedroom' + (f.out2 ? '' : '+snore');
    case 'school': return 'school' + (f.out3 ? '' : '+horse');
    case 'winter': return 'winter' + (f.out4 ? '+cheer' : '');
    case 'circus': return 'circus' + (f.out5 ? '+show' : '');
    case 'balloon': return 'balloon' + (!f.up ? '+ground' : f.dropped && !f.cloud ? '+cloud' : f.out6 ? '+cheer' : '');
    case 'island': return 'island' + (f.chest && !f.storm ? '+storm' : f.storm ? '+night' : '');
    case 'home': return 'home' + (f.larder && !f.rainbow ? '+shower' : f.out10 ? '+party' : '');
    case 'ship': return 'ship' + (!f.course ? '+harbour' : f.water && !f.equator ? '+night' : '+sailing');
    case 'voyage': { const leg = leg9(); return 'voyage' + (leg === 'storm' ? '+storm' : leg === 'night' ? '+night' : leg === 'harbour' ? '+harbour' : ''); }
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
  // Chapter 0, moving day: a summer breeze, birdsong, the creak of the old house; the clock ticking once it's set.
  move(m, mods){
    bed(m, { freq: 360, gain: .016, wobble: .6, rate: .08 });
    every(6000, 12000, () => [0, 1, 2, 3].forEach(i => later(i * 150, () => blip(m, 1800 + Math.random() * 1200, .12, .012, 'sine', 1500 + Math.random() * 900))));
    every(9000, 18000, () => blip(m, 110, .6, .01, 'sawtooth', 90));
    if(mods.includes('tick')) every(1000, 1000, () => burst(m, .03, .02, 3000));
  },
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
  // Chapter 5, the big top: the murmur of the audience, a barrel-organ waltz, the odd honk from the clown,
  // and once the show starts, a drumroll and cheering.
  // Chapter 6, the balloon ride: the wind up high and the roar of the burner now and then; birdsong in the garden
  // before take-off; dripping fog inside the cloud; the church bell and cheering at the end.
  balloon(m, mods){
    bed(m, { type: 'bandpass', freq: 600, q: .4, gain: mods.includes('ground') ? .01 : .022, wobble: .8, rate: .1 });
    if(mods.includes('ground')){ every(5000, 10000, () => [0, 1, 2, 3].forEach(i => later(i * 150, () => blip(m, 2000 + Math.random() * 1000, .12, .01, 'sine', 1600)))); return; }
    every(9000, 16000, () => burst(m, 1.4, .03, 300, 'lowpass'));
    if(mods.includes('cloud')){ every(300, 900, () => blip(m, 1800 + Math.random() * 900, .04, .006, 'sine', 900)); return; }
    every(8000, 15000, () => [0, 1].forEach(i => later(i * 260, () => blip(m, 520, .2, .01, 'sawtooth', 430))));
    if(mods.includes('cheer')){ every(3000, 6000, () => burst(m, 1, .025, 1500, 'bandpass')); every(7000, 12000, () => blip(m, 392, 2, .014, 'sine')); }
  },
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
  // Chapter 4, the snowy garden: a soft winter wind, crows cawing, the church bell far away now and then,
  // and laughing once the snowball fight is won.
  winter(m, mods){
    bed(m, { type: 'bandpass', freq: 700, q: .4, gain: .018, wobble: .9, rate: .07 });
    every(9000, 18000, () => [0, 1].forEach(i => later(i * 300, () => blip(m, 520, .22, .012, 'sawtooth', 430))));
    every(20000, 35000, () => blip(m, 392, 2.2, .012, 'sine'));
    if(mods.includes('cheer')) every(3000, 6000, () => burst(m, 1, .025, 1500, 'bandpass'));
  },
  // Chapter 6, the Hoppetossa: waves against the hull and creaking timbers; gulls in the harbour,
  // wind in the sails at sea, and the ship's bell now and then at night.
  // Chapter 7, the South Sea island: waves lapping on the beach, palm fronds rustling, the parrot; rain and thunder
  // during the shower; crickets and the crackle of the feast torches at night.
  island(m, mods){
    bed(m, { type: 'lowpass', freq: 520, gain: .04, wobble: .8, rate: .1 });
    if(mods.includes('storm')){ bed(m, { type: 'highpass', freq: 2500, gain: .03, wobble: .2, rate: .3 }); every(6000, 12000, () => burst(m, 1.6, .06, 180, 'lowpass')); return; }
    if(mods.includes('night')){ every(160, 380, () => blip(m, 4400 + Math.random() * 400, .03, .005, 'sine')); every(90, 260, () => burst(m, .03, .01, 1400 + Math.random() * 1500, 'highpass')); return; }
    every(7000, 15000, () => { blip(m, 1500, .12, .015, 'square', 1100); later(160, () => blip(m, 1700, .1, .012, 'square', 1300)); });
    every(4000, 9000, () => burst(m, .8, .012, 2600, 'bandpass'));
  },
  ship(m, mods){
    bed(m, { freq: 380, gain: .022, wobble: .8, rate: .12 });
    every(4000, 9000, () => blip(m, 90 + Math.random() * 40, .5, .012, 'sawtooth', 70));
    if(mods.includes('harbour')) every(5000, 11000, () => [0, 1, 2].forEach(i => later(i * 180, () => blip(m, 1500 + Math.random() * 300, .18, .012, 'sine', 1100))));
    if(mods.includes('sailing')) bed(m, { type: 'bandpass', freq: 900, q: .5, gain: .012, wobble: .6, rate: .2 });
    if(mods.includes('night')) every(9000, 16000, () => { blip(m, 1320, .9, .015, 'sine'); later(450, () => blip(m, 1320, .9, .015, 'sine')); });
  },
  // Chapter 9, the voyage home: waves and wind in the sails; howling wind, rain and thunder in the storm;
  // the ship's bell at night; gulls and the church bell in the harbour at home.
  voyage(m, mods){
    bed(m, { freq: 380, gain: .022, wobble: .8, rate: .12 });
    every(4000, 9000, () => blip(m, 90 + Math.random() * 40, .5, .012, 'sawtooth', 70));
    if(mods.includes('storm')){ bed(m, { type: 'bandpass', freq: 700, q: .4, gain: .03, wobble: .9, rate: .25 }); bed(m, { type: 'highpass', freq: 2500, gain: .025, wobble: .2, rate: .3 }); every(6000, 12000, () => burst(m, 1.6, .06, 180, 'lowpass')); return; }
    if(mods.includes('night')){ every(9000, 16000, () => { blip(m, 1320, .9, .015, 'sine'); later(450, () => blip(m, 1320, .9, .015, 'sine')); }); return; }
    bed(m, { type: 'bandpass', freq: 900, q: .5, gain: .012, wobble: .6, rate: .2 });
    if(mods.includes('harbour')){ every(5000, 11000, () => [0, 1, 2].forEach(i => later(i * 180, () => blip(m, 1500 + Math.random() * 300, .18, .012, 'sine', 1100)))); every(20000, 35000, () => blip(m, 392, 2.2, .012, 'sine')); }
  },
  // Chapter 10, home again in spring: a soft breeze, a blackbird singing and swallows twittering; the patter of
  // the April shower; and once the party starts, laughter and a little accordion tune.
  home(m, mods){
    bed(m, { freq: 340, gain: .015, wobble: .6, rate: .08 });
    if(mods.includes('shower')){ bed(m, { type: 'highpass', freq: 2200, gain: .025, wobble: .3, rate: .4 }); every(150, 500, () => burst(m, .02, .01, 3000 + Math.random() * 2000, 'highpass')); return; }
    every(6000, 12000, () => [0, 1, 2, 3, 4].forEach(i => later(i * 160, () => blip(m, 1400 + Math.random() * 1200, .14, .012, 'sine', 1200 + Math.random() * 1400))));
    every(3000, 7000, () => [0, 1, 2].forEach(i => later(i * 70, () => blip(m, 3800 + Math.random() * 600, .05, .008, 'sine', 4200))));
    if(mods.includes('party')){
      every(3000, 6000, () => burst(m, 1, .02, 1500, 'bandpass'));
      const tune = [72, 76, 79, 76, 77, 74, 71, 0, 72, 76, 79, 84, 81, 79, 77, 0]; let i = 0;
      const play = () => { if(!AMB.master) return; const n = tune[i++ % tune.length]; if(n) blip(m, 440 * Math.pow(2, (n - 69) / 12), .35, .01, 'sawtooth'); AMB.timers.push(setTimeout(play, 360)); };
      AMB.timers.push(setTimeout(play, 800));
    }
  }
};

/* Keep the soundscape in step with the game. Browsers only allow sound after the player has clicked or tapped. */
setInterval(ambUpdate, 700);
document.addEventListener('visibilitychange', ambUpdate);
['pointerdown', 'keydown'].forEach(ev => document.addEventListener(ev, () => { if(ac && ac.state === 'suspended') ac.resume().catch(() => {}); ambUpdate(); }, { passive: true }));
