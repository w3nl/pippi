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
function stage_(){ return S.ch===3 ? stage3() : S.ch===2 ? stage2() : stage1(); }
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
