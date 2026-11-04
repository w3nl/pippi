// Optional voices: reads every dialogue line aloud with the browser's own speech (Web Speech API: speechSynthesis
// and SpeechSynthesisUtterance). Off by default; the Voices button turns it on, saved per device as KEY-voice.
// core.js calls speakLine() for each line in next(); the button stays hidden in browsers without speech.
// Loaded in order by js/boot.js; all game files share the same global scope.

const VOICE_KEY = KEY + '-voice';
const canSpeak = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
let voiceOn = (() => { try{ return localStorage.getItem(VOICE_KEY) === '1'; }catch(e){ return false; } })();

/* How each character sounds. Pitch and rate shape the voice; slot picks one of the device's voices for the language,
   so characters sound different when the device has several (and only differ in pitch and speed when it has one). */
const VOICE_STYLE = {
  sys:     { pitch: 1,    rate: 1,    slot: 0 },   // the narrator
  you:     { pitch: 1.05, rate: 1.05, slot: 1 },
  pippi:   { pitch: 1.45, rate: 1.15, slot: 2 },   // loud, fast and delighted with everything
  nilsson: { pitch: 2,    rate: 1.3,  slot: 3 },
  horse:   { pitch: .3,   rate: .8,   slot: 4 },
  spunk:   { pitch: 2,    rate: 1,    slot: 1 },
  tommy:   { pitch: 1.2,  rate: 1.05, slot: 5 },
  annika:  { pitch: 1.4,  rate: 1,    slot: 6 },
  karlsson:{ pitch: .55,  rate: .9,   slot: 7 },   // big and gruff
  bloom:   { pitch: 1.2,  rate: 1.25, slot: 8 },   // small and nervous
  teacher: { pitch: 1.1,  rate: .95,  slot: 9 }    // kind and clear
};

/* The device's voices for the current language: British English or Dutch, falling back to any English voice. */
function voicesFor(lang){
  const all = speechSynthesis.getVoices();
  if(lang !== 'en') return all.filter(v => new RegExp('^' + lang, 'i').test(v.lang));
  const gb = all.filter(v => /^en[-_]GB/i.test(v.lang));
  return gb.length ? gb : all.filter(v => /^en/i.test(v.lang));
}

function speakLine(who, text){
  if(!canSpeak || !voiceOn) return;
  speechSynthesis.cancel();
  const clean = String(text).replace(/[♪▸▶✕★⇄✓]/g, ' ').replace(/…/g, '... ').replace(/\s+/g, ' ').trim();
  if(!/[A-Za-z0-9]/.test(clean)) return;   // the spunk's "…" stays silent
  const u = new SpeechSynthesisUtterance(clean), st = VOICE_STYLE[who] || VOICE_STYLE.sys, vs = voicesFor(LANG);
  u.lang = LANG_TAGS[LANG] || 'en-GB';
  if(vs.length) u.voice = vs[st.slot % vs.length];
  u.pitch = st.pitch; u.rate = st.rate; u.volume = .9;
  speechSynthesis.speak(u);
}
function stopSpeaking(){ if(canSpeak) speechSynthesis.cancel(); }

/* ---------- the Voices button ---------- */
function showVoice(){
  const b = $('#btn-voice');
  b.hidden = !canSpeak;
  b.textContent = voiceOn ? 'Voices on' : 'Voices off';
  b.title = 'Reads the dialogue aloud with the voices on your device.';
}
$('#btn-voice').onclick = () => {
  voiceOn = !voiceOn;
  try{ localStorage.setItem(VOICE_KEY, voiceOn ? '1' : '0'); }catch(e){}
  showVoice(); beep(700, .04);
  if(voiceOn) say([['pippi', "Voices on! I've never done voices before, so I'm sure I'm brilliant at it."]]);
  else { stopSpeaking(); if(!$('#dialog').hidden && queue.length === 0) $('#dialog').hidden = true; }
};
if(canSpeak) speechSynthesis.getVoices();   // some browsers only load their voices after the first ask
onLangChange(() => { stopSpeaking(); showVoice(); });
showVoice();
