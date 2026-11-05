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
function stage_(){ return S.ch===0 ? stage0() : S.ch===10 ? stage10() : S.ch===9 ? stage9() : S.ch===8 ? stage8() : S.ch===7 ? stage7() : S.ch===6 ? stage6() : S.ch===5 ? stage5() : S.ch===4 ? stage4() : S.ch===3 ? stage3() : S.ch===2 ? stage2() : stage1(); }
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
  a_lift: ["The circus balloon is lying flat in the snow. What makes a hot-air balloon go up? The clue is in its name.", "Click the balloon in the snow: heat the air inside with the burner. Hot air is lighter than the cold air around it, so it rises."],
  a_steer: ["Down low, the wind blows you the wrong way. A balloon can't steer, but the wind isn't the same at every height. Look at the smoke, the kite and the clouds.", "Click the burner. The kite's tail streams out towards the farms, so go to the middle, at kite height. Balloon pilots steer by going up or down."],
  a_map: ["The burglars are hiding at the farm with the L-shaped barn, the round duck pond and three haystacks. From up here, everything looks like a map.", "Click the farms below. From above, a haystack is a circle. The right farm has an L-shaped barn, a round pond and three round haystacks."],
  a_chute: ["Kling and Klang can't hear you from up here. Annika has written them a note, but how do you get it down to them safely?", "Use the note on Kling and Klang: tie it to Pippi's big handkerchief, like a parachute. Big and wide means lots of air resistance, so it falls slowly."],
  a_cloud: ["Everything has gone white and wet: you're inside a cloud!", "Click the cloud. It's made of billions of tiny drops of water. And the higher you go, the colder the air gets."],
  a_vane: ["Put the golden weathercock back on the church tower, the right way round. The flag on the tower shows which way the wind is blowing.", "Use the weathercock on the tower. The flag streams east, so the wind comes from the west: turn the beak to the west, into the wind. It's a west wind."]
});
function stage6(){
  if(!S.f.up) return 'a_lift';
  if(!S.f.steer) return 'a_steer';
  if(!S.f.found) return 'a_map';
  if(!S.f.dropped) return 'a_chute';
  if(!S.f.cloud) return 'a_cloud';
  return 'a_vane';
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
function stage7(){
  if(!S.f.aboard) return 'h_hoist';
  if(!S.f.course) return 'h_course';
  if(!S.f.floats) return S.inv.includes('net') ? 'h_floats' : 'h_net';
  if(!S.f.water) return 'h_water';
  if(!S.f.equator) return S.inv.includes('sextant') ? 'h_equator' : 'h_sextant';
  return S.inv.includes('spyglass') ? 'h_landho' : 'h_glass';
}

Object.assign(HINTS, {
  i_map: ["The captain is asleep in his hammock. Wake him up: he has something for Pippi.", "Click Captain Longstocking in the hammock. He gives you his treasure map."],
  i_sundial: ["Before you can walk to Turtle Islet, you need to know what time it is. There are no clocks on the island, but there is a sundial.", "Click the sundial. The shadow points away from the sun: click the 9. At 12 o'clock the shadow is shortest."],
  i_tide: ["It's 9 o'clock and the water is at the top of the tide post. The sign says: about 6 hours out, then 6 hours back in.", "Click the tide post: 9 + 6 hours = 3 o'clock. And it's the Moon that pulls the sea in and out."],
  i_paces: ["Low tide! Take the captain's map to Turtle Islet. His paces are 1 metre long; other people's are shorter.", "Select the map and click Turtle Islet. 12 metres is 24 of Pippi's paces (50 cm), 30 of Tommy's (40 cm), 40 of Annika's (30 cm) or 6 of the horse's (2 m)."],
  i_spade: ["There's the X! You need something to dig with. Kings don't dig their own holes, but they do own a spade.", "Take the spade leaning on the king's hut, select it and click the X on Turtle Islet."],
  i_chest: ["The chest's lock wants a chain: from the one who feeds everybody to the one who eats the most.", "Click the chest and put in: the Sun, seaweed, a crab, an octopus. (Not the coconut.)"],
  i_storm: ["A tropical shower! Light arrives at once, but thunder travels about 1 km every 3 seconds.", "Click the sky (or the captain) and watch: 9 seconds = 3 km. Then 3 seconds = 1 km: it's coming closer, so everybody into the hut."],
  i_turtles: ["The turtles are hatching! Baby turtles crawl towards the brightest light. On a dark beach that should be the sea.", "Click the turtle nest. Switch off the torch by the nest, the torch on the dunes and the lantern in the hut window; leave the feast torches behind the hut on. Then let them go!"]
});
function stage8(){
  if(!S.f.mapTaken) return 'i_map';
  if(!S.f.sundial) return 'i_sundial';
  if(!S.f.tide) return 'i_tide';
  if(!S.f.paces) return 'i_paces';
  if(!S.f.dug) return 'i_spade';
  if(!S.f.chest) return 'i_chest';
  if(!S.f.storm) return 'i_storm';
  return 'i_turtles';
}

Object.assign(HINTS, {
  m_oil: ["The garden gate is rusted shut. Pippi's moving cart is full of useful things.", "Click the moving cart and take the oil can."],
  m_gate: ["The gate's hinges are rusty. What makes rusty metal move again?", "Use the oil can on the gate: a few drops of oil. Rust is iron eaten away by water and air."],
  m_pump: ["The horse is thirsty, but the old pump only wheezes. Its leather seal has dried out.", "Click the pump: pour a little water in first. The air pressing on the water in the well pushes it up, like drinking through a straw."],
  m_veranda: ["The horse needs a home. The veranda can carry 500 kg. How heavy is a horse?", "Click the veranda (or the horse): about 400 kg. With Pippi on top, 400 + 30 = 430 kg, still less than 500."],
  m_mirror: ["The house is pitch dark inside. You could throw some sunshine in, with something shiny from the cart.", "Click the moving cart again for Pippi's hand mirror."],
  m_light: ["Pippi's mirror can bounce the sunbeam into the dark hall. Light bounces off a mirror at the same angle it comes in.", "Use the mirror on the front door (or the dark hall). Pick B, tipped a little, so the beam goes straight in."],
  m_boxes: ["The moving boxes are in a heap in front of the clock. Stack them up so nothing topples or gets squashed.", "Click the boxes. Heaviest at the bottom: the gold, the books, the pans, the hat box, and the eggs on top."],
  m_clock: ["The grandfather clock stopped years ago. Through the window, the church clock shows the real time.", "Click the clock. The big hand on the 3 (15 minutes), the little hand just past the 10: a quarter past ten."]
});
function stage0(){
  if(!S.f.gate) return S.inv.includes('oil0') ? 'm_gate' : 'm_oil';
  if(!S.f.water) return 'm_pump';
  if(!S.f.veranda) return 'm_veranda';
  if(!S.f.light) return S.inv.includes('mirror0') ? 'm_light' : 'm_mirror';
  if(!S.f.boxes) return 'm_boxes';
  return 'm_clock';
}

Object.assign(HINTS, {
  y_season: ["The captain wants to know if you've packed the right clothes. It was winter at home when you left, and now it's April.", "Click the captain (or the wheel). At home in April it's spring. Far south, below the Equator, it's autumn: the north and the south have opposite seasons."],
  y_letter: ["Pippi has been writing something. Maybe she has a letter to post. In the middle of the sea.", "Click Pippi for her message in a bottle."],
  y_bottle: ["Pippi's letter is in a bottle. The sea can deliver it, if you throw it into the right current.", "Use the bottle on the sea and pick number 4: that current flows north-east, to Sweden. Ocean currents are like rivers in the sea."],
  y_storm: ["A storm! The wind pushes on the sails, and the ship leans over a long way. What could make it lean less?", "Click the sails (or the captain). Take in a reef: smaller sails. Then tie a reef knot: right over left, then left over right."],
  y_swallows: ["Little birds have landed on the yard to rest. Where could they be going?", "Click the swallows. They're flying north to Sweden for the summer, because the northern summer is full of insects to eat."],
  y_book: ["Three lighthouses, all flashing differently. The captain has a book that says which is which.", "Take the Book of Lighthouses from the captain's sea chest on deck."],
  y_light: ["Our harbour's lighthouse flashes twice, then stays dark, every 10 seconds. Count the yellow squares and the dark ones.", "Use the book on the lighthouses (or click them). Pick C: two flashes every 10 seconds."],
  y_buoys: ["Red and green buoys mark the safe way into the harbour. Ships have a red lamp on their left side, and a green one on their right.", "Click the buoys (or the wheel). Coming in from the sea, keep the red buoys on your left: route B."]
});
function stage9(){
  if(!S.f.packed) return 'y_season';
  if(!S.f.bottle) return S.inv.includes('bottle9') ? 'y_bottle' : 'y_letter';
  if(!S.f.reefed) return 'y_storm';
  if(!S.f.swallows) return 'y_swallows';
  if(!S.f.light) return S.inv.includes('book9') ? 'y_light' : 'y_book';
  return 'y_buoys';
}

Object.assign(HINTS, {
  v_rings: ["A branch of the old oak is lying across the path. Before Pippi breaks it up, look at its broken end: a tree grows one ring every year.", "Click the fallen branch. Count the dark lines: 9 rings, so 9 years. The newest ring is the outside one, just under the bark."],
  v_roll: ["The sea chest is far too heavy to carry or drag. But Pippi has just made a pile of nice round logs…", "Click the sea chest and put the round logs under it: rolling rubs much less than sliding."],
  v_magnet: ["The front door is locked, and Mr Nilsson dropped the key in the rain barrel. The sea chest has a present from the captain in it.", "Open the sea chest for the magnet, then use it on the rain barrel. Tick the key, the nail and the bottle top: iron and steel. Not gold, glass or rubber."],
  v_door: ["You've got the front-door key.", "Select the key and use it on the front door."],
  v_larder: ["The things from Pippi's larder are on the garden table. But you've been away for five months: what is still good to eat?", "Click the garden table. Tick the crispbread, the honey, the raisins and the jam: dry or very sweet food keeps. Not the bread, the milk, the cucumber or the old pancake."],
  v_rainbow: ["Sun and rain at the same time: a rainbow! A rainbow is always on the other side of the sky from the sun.", "Click the sky (or Pippi). The sun is in the west, so look east. A rainbow is sunlight, split into its colours by the raindrops."],
  v_hog: ["Something is snuffling in the horse's straw on the veranda.", "Click the horse's straw. The hedgehog was hibernating. Give it water and cat food. Never milk!"]
});
function stage10(){
  if(!S.f.rings) return 'v_rings';
  if(!S.f.rolled) return 'v_roll';
  if(!S.f.key) return 'v_magnet';
  if(!S.f.door) return 'v_door';
  if(!S.f.larder) return 'v_larder';
  if(!S.f.rainbow) return 'v_rainbow';
  return 'v_hog';
}
