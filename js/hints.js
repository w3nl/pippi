// All hints (two per puzzle: a nudge, then the answer) and how the game decides which puzzle you are on.
// Loaded in order by js/boot.js; all game files share the same global scope.

const HINTS = {
  note: ["Pippi's note on the table is written backwards. What in this kitchen shows everything the other way round?", "Take the note, select it in your pockets, and use it on the mirror."],
  sums: ["Pippi's note says the matches are in her secret drawer, and the code is the answers to her sums. Her exercise book is on the table, and Annika has left a sticky note in it.", "2 × 3 = 6, 9 − 4 = 5 and 8 ÷ 2 = 4. Turn the bureau's padlock to 6 5 4."],
  fire: ["The stove is cold. The enamel sign above it says the three things a fire needs.", "Open the stove: put the firewood in, open the air vent, then strike a match."],
  eggs: ["Pancakes need eggs. Where does Pippi keep her food?", "Open the pantry cupboard and take the eggs."],
  pancake: ["The stove is hot and you have eggs. Make a pancake: each step can only happen after the steps it needs.", "Eggs into the bowl, milk and flour, whisk, butter in the pan, pour, flip. (Melting the butter can come earlier.)"],
  trade: ["Pippi's note said Mr Nilsson will swap the key for one thing only.", "Select the pancake in your pockets and click Mr Nilsson on the bureau."],
  unlock: ["You have the front-door key.", "Select the key and use it on the front door."],
  flags: ["The horse is leaning on the door. Horses like sugar. The captain's sea chest has a letter lock, and the flags on the string over your head spell something.", "Use the flag chart by the mirror: the flags read S, P, U, N, K. Set the sea chest's lock to SPUNK."],
  horse: ["You have sugar, and the horse is right outside the door. But how do you give a horse a treat safely?", "Select the sugar cubes, click the horse in the door's window, and choose the flat, open hand."]
};
function stage1(){
  if(!S.f.noteRead) return 'note';
  if(!S.f.matches) return 'sums';
  if(!S.f.fire) return 'fire';
  if(!S.f.pancake) return S.inv.includes('eggs') ? 'pancake' : 'eggs';
  if(!S.f.key) return 'trade';
  if(!S.f.unlocked) return 'unlock';
  if(!S.f.chest) return 'flags';
  return 'horse';
}
Object.assign(HINTS, {
  b_batt: ["It's dark. The torch on the bedside table is empty. Something else on the table runs on batteries.", "Click the alarm clock to take its batteries, then click the torch."],
  b_torch: ["Put the batteries in the torch the right way round. Look at the + and − on each one.", "Both batteries must point the same way, with + towards the bulb on the right. Then switch on."],
  b_shadow: ["The burglars are picking the lock of the veranda door! A shadow on its curtain could scare them, if it's big enough. Mr Nilsson can help.", "Use the torch on the veranda door. Slide Mr Nilsson close to the torch (40 cm or less) so his shadow is huge, then make him wave."],
  b_star: ["You need help. Annika's spy card above the bed says their house is due north. Look out of the window and find the North Star.", "Follow the two stars at the end of the saucepan (the Big Dipper) upwards, about five times as far: the North Star is the lone star at the top. Not the bright one: that's a planet."],
  b_sos: ["Tommy and Annika's window is right under the North Star. Signal them with your torch in Morse code. Annika's card has the code.", "Use the torch on the window. SOS is short short short, long long long, short short short."],
  b_decode: ["Tommy is flashing back. Each group of flashes is one letter: look them up on Annika's spy card.", "The letters spell TICKLE."],
  b_scale: ["The burglars will be back at midnight for the gold. What if the suitcase felt just as heavy, but held something else?", "Open Pippi's scale. Put stones on the right pan until they weigh exactly 9 kg, for example 6 + 3, then swap them for the gold."],
  b_wake: ["Tommy said: TICKLE. But Pippi sleeps the other way round, and you need something soft and tickly.", "Take the feather from Pippi's hat, select it, and use it on her feet on the pillow."]
});
function stage2(){
  if(!S.f.torchOn) return S.f.batteries ? 'b_torch' : 'b_batt';
  if(!S.f.scared) return 'b_shadow';
  if(!S.f.north) return 'b_star';
  if(!S.f.sos) return 'b_sos';
  if(!S.f.morse) return 'b_decode';
  if(!S.f.swapped) return 'b_scale';
  return 'b_wake';
}
function stage_(){ return S.ch===6 ? stage6() : S.ch===5 ? stage5() : S.ch===4 ? stage4() : S.ch===3 ? stage3() : S.ch===2 ? stage2() : stage1(); }
Object.assign(HINTS, {
  s_drawer: ["The chalk box is empty. Miss keeps the chalk in her desk drawer, and she has written herself a note about its code.", "The plaque over the door says MDCCCXCIV: 1000 + 500 + 300 + 90 + 4 = 1894. Set the desk's padlock to 1 8 9 4."],
  s_nines: ["Task 1: Pippi's nines on the blackboard have three mistakes. The poster next to the board shows the nines trick.", "Use the chalk on the blackboard and mark 9 × 5, 9 × 8 and 9 × 10 (they should be 45, 72 and 90). Then click Done marking."],
  s_abc: ["Task 2: put the names in the class register on Miss's desk back in ABC order. When two names start with the same letter, look at the next letter.", "Annika, Axel, Britta, Olle, Peter, Pippi, Tommy, Tora."],
  s_bugs: ["Task 3: which creatures on the nature table are insects? They're tiny, so look through the magnifying glass. Count the legs.", "Use the magnifying glass on the nature table and tick the ant, the ladybird and the bumblebee: six legs each."],
  s_cake: ["Task 4: Pippi's cake. The more pieces you cut a cake into, the smaller each piece is.", "Click Pippi's cake and pick the piece of the cake cut into 3. Then: 1/4 and 2/8 are the same amount."],
  s_seasons: ["Task 5: the globe and the postcard from Pippi's father. Look at the way the Earth leans towards the Sun.", "Click the globe and choose: the Earth leans over, and in June the northern half leans towards the Sun."],
  s_bell: ["Five gold stars! Miss said the holidays start when the bell rings.", "Click the hand bell on Miss's desk."]
});
function stage3(){
  if(!S.f.drawer) return 's_drawer';
  for(const k of TASKS3) if(!S.f[k]) return { nines:'s_nines', abc:'s_abc', bugs:'s_bugs', cake:'s_cake', seasons:'s_seasons' }[k];
  return 's_bell';
}

Object.assign(HINTS, {
  w_tracks: ["Mr Nilsson has run off with your mittens. Monkeys leave very odd footprints: look at the tracks in the snow.", "Click the tracks and pick trail B: five long fingers and a thumb, like a little hand. It leads to the old oak."],
  w_balls: ["Snowballs only stick when the snow is a little damp. The thermometer by the kitchen window shows four places in the garden.", "Pick the sunny veranda at −1 °C: just below freezing. (You need your mittens on.)"],
  w_fort: ["Your fort is still a heap of snow blocks. A wall falls apart where the joints line up from top to bottom.", "Click our fort and shift every other row by half a block, like bricks in a house wall. Then let Pippi push."],
  w_steps: ["The horse should pull the sledge with the snowballs, but it slides on the icy veranda steps. What melts ice even below 0 °C?", "Click the veranda steps and choose salt."],
  w_warm: ["Annika is shivering by the fence. What keeps you warmest: one thick thing, or several thin ones?", "Click Tommy and Annika: three thin layers, then mittens (fingers together keep each other warm)."],
  w_throw: ["Three o'clock! You always throw just as hard. Which angle makes a snowball fly furthest?", "Click Kling and Klang (or our fort) and throw at 45°, halfway between flat and straight up."]
});
function stage4(){
  if(!S.f.tracks) return 'w_tracks';
  for(const k of READY4) if(!S.f[k]) return 'w_' + k;
  return 'w_throw';
}

Object.assign(HINTS, {
  c_tickets: ["Nobody gets in without a ticket. The ticket booth is by the entrance, and the sign says what a ticket costs.", "Four tickets at 3 crowns is 12 crowns. Pippi pays 20, so give 8 crowns change (for example 5 + 2 + 1)."],
  c_show: ["You have the tickets. Who wants to see them?", "Select the tickets and click the ringmaster."],
  c_lights: ["The spotlights need the right colours. Coloured light mixes differently from paint.", "Yellow = red + green. Cyan = green + blue. White = red + green + blue."],
  c_teeter: ["The teeterboard balances when weight × distance is the same on both sides. The strongman: 90 kg at 1 metre.", "Pippi weighs 30 kg: put her at 3 metres, because 30 × 3 = 90 × 1."],
  c_juggle: ["The clown juggles in a repeating pattern. Look at the first balls: which group repeats?", "Red, blue, blue keeps repeating. The last three are blue, blue, red."],
  c_trapeze: ["The trapezes must swing in the same rhythm. Does a heavier flyer swing slower?", "No: only the length of the rope matters. Give both ropes the same length."],
  c_gears: ["Everything on the checklist is done. The curtain winch on the right of the curtain opens it. Gears that touch turn opposite ways.", "Put 2 gears in between: crank ↻, gear ↺, gear ↻, drum ↺. Then turn the crank."]
});
function stage5(){
  if(!S.f.tickets) return 'c_tickets';
  if(!S.f.inside) return 'c_show';
  for(const k of TASKS5) if(!S.f[k]) return { lights: 'c_lights', teeter: 'c_teeter', juggle: 'c_juggle', trapeze: 'c_trapeze' }[k];
  return 'c_gears';
}
Object.assign(HINTS, {
  h_hoist: ["Pippi won't sail without her horse. The cargo hoist on the stern has pulleys: the more ropes hold the horse up, the less each one has to carry.", "Click the hoist and choose 4 ropes: 400 kg ÷ 4 = 100 kg each, just what the three of you can pull. Then heave."],
  h_course: ["The captain wants a course for his island. His chart in the cabin shows which way to go, and the compass by the wheel shows which way the ship points.", "On the chart the island is down and to the left: south-west. Turn the wheel until the ship points south-west, then set sail."],
  h_net: ["Mr Nilsson has thrown things overboard! You'll need something to fish them out with. Look in the hold.", "Take the fishing net from the hold, select it and use it on the sea."],
  h_floats: ["Which of Mr Nilsson's things float? It depends on what they're made of, not on how big or heavy they are.", "The log, the apple and the cork float. The key, the coin and the marble sink."],
  h_water: ["The horse drank all the drinking water, and sea water is far too salty. The hot sun can turn sea water into fresh water.", "Click the water barrel and choose: a bowl of sea water, an empty cup, a glass lid, a pebble above the cup, in the hot sun."],
  h_sextant: ["It's night. Where are we? The captain measures the stars with his sextant: it's in the instrument box in his cabin.", "Take the sextant from the instrument box, select it and use it on the sky."],
  h_equator: ["The captain's logbook shows how the North Star sank lower every night on his last voyage south.", "0° on the horizon means the Equator. South of the Equator, the North Star sinks below the horizon."],
  h_glass: ["Dawn, and something tiny on the horizon. To see far you need the captain's spyglass, and a high place.", "Take the spyglass from its hook by the wheel, then climb to the crow's nest."],
  h_landho: ["From the crow's nest you can see the island, from the deck you can't. Think about the shape of the Earth.", "Choose: the Earth is round, so from higher up you can see further over the bend of the sea."]
});
function stage6(){
  if(!S.f.aboard) return 'h_hoist';
  if(!S.f.course) return 'h_course';
  if(!S.f.floats) return S.inv.includes('net') ? 'h_floats' : 'h_net';
  if(!S.f.water) return 'h_water';
  if(!S.f.equator) return S.inv.includes('sextant') ? 'h_equator' : 'h_sextant';
  return S.inv.includes('spyglass') ? 'h_landho' : 'h_glass';
}
