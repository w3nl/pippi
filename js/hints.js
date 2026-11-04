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
function stage_(){ return stage1(); }
