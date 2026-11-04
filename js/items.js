// Using inventory items on hotspots, for every chapter (useItem).
// Loaded in order by js/boot.js; all game files share the same global scope.

function useItem(item, hs){
  if(item==='spunk'){
    const st = stage_(), arr = HINTS[st];
    if(chapterDone() || !arr) return say([['spunk', "…"], "The spunk has nothing to add. It looks pleased with you."]);
    S.ach.spunk = true; save();
    return say([['spunk', "…"], ['sys', tx('The spunk seems to be thinking: {hint}', { hint: tx(arr[0]) })]]);
  }
  if(item==='note'){
    if(hs!=='mirror') return say(["You turn the note this way and that. It's still backwards.", "What in this kitchen shows things the other way round?"]);
    S.f.noteRead = true; take('note'); save(); applyVisuals(); chord([523,659,784]);
    say("You hold the note up to the mirror. In the reflection, the writing turns the right way round!", () => openNote(true));
    return;
  }
  if(item==='matches'){
    if(hs==='stove') return openStove();
    if(hs==='nilsson') return say([['nilsson', "EEK!"], "Mr Nilsson snatches his tail out of the way. No matches near the monkey."]);
    return say("Matches are for lighting a fire. And there's only one place in this kitchen where you should do that.");
  }
  if(item==='eggs'){
    if(hs==='stove') return openStove();
    if(hs==='bowl') return say("Good thinking, but Pippi mixes the batter at the stove. Take the eggs there.");
    return say("Eggs are for pancakes, and pancakes are made at the stove.");
  }
  if(item==='pancake'){
    if(hs!=='nilsson') return say(hs==='horse' ? "The horse sniffs the pancake, then looks at you as if to say: I'm a horse." : "Somebody in this kitchen would swap anything for this pancake. Somebody small, with a straw hat.");
    take('pancake'); S.f.key = true; give('key'); applyVisuals();
    return say([['nilsson', "Eek!"], "Mr Nilsson grabs the pancake with both hands and drops the key into yours. A fair swap.", ['nilsson', "Nom nom nom."]]);
  }
  if(item==='key'){
    if(hs!=='door') return say("It's the front-door key. It belongs in the front door.");
    take('key'); S.f.unlocked = true; save(); applyVisuals(); beep(300,.12,'triangle');
    return say(["You turn the big key. Click-clack: unlocked!", "You push the door… and it opens just a crack. Something large and spotty is leaning against it from outside.", ['horse', "Pfrrrr."], "Pippi's horse. Of course."]);
  }
  if(item==='sugar'){
    if(hs!=='horse' && hs!=='door') return say("Sugar cubes for the horse. It's just outside the front door.");
    if(!S.f.unlocked) return say("The horse is outside, and the door is locked. You can't reach it through the glass.");
    return openHorse();
  }
  if(item==='batteries'){
    if(hs==='torch') return openTorch2();
    return say("Batteries make things work. The torch on the bedside table is empty.");
  }
  if(item==='torch'){
    if(hs==='vdoor' || hs==='nilsson2'){
      if(!S.f.scared) return openShadow();
      return say("The burglars have gone back to hide behind the old oak. No need for gorillas right now.");
    }
    if(hs==='sky'){
      if(!S.f.north) return say(["You point the torch out of the window. Which of all those lights out there is Tommy and Annika's house?", "Annika's spy card says their house is due north. Find north first."]);
      return openMorse();
    }
    if(hs==='pippi2' || hs==='feet') return say("You shine the torch on Pippi. She snores on, happily. Light doesn't wake her. Nothing does, apparently.");
    if(hs==='card2') return openSpyCard();
    return say("You shine the torch around. Lovely. Not scary at all, now.");
  }
  if(item==='feather'){
    if(hs==='feet') return tickle('feet');
    if(hs==='pippi2') return tickle('head');
    if(hs==='nilsson2') return say([['nilsson', "Hihi-eek!"], "Mr Nilsson giggles in his sleep. Wrong sleepyhead."]);
    return say("You tickle it. It isn't ticklish. Someone in this room is, though.");
  }
  if(item==='chalk'){
    if(hs==='board') return openBoard();
    if(hs==='nilsson3') return say([['nilsson', "Eek?"], "Mr Nilsson sniffs the chalk and takes a nibble. He pulls a face. Chalk is not a biscuit."]);
    return say("Chalk is for the blackboard.");
  }
  if(item==='magnifier'){
    if(hs==='nature') return openNature();
    if(hs==='pippi3'){ S.ach.freckles = true; save();
      return say(["Pippi turns round, and you look at her nose through the magnifying glass. Freckles. Lots and lots of freckles.", ['pippi', "I've got exactly a thousand. That's M in Roman numerals. I counted them once, in the mirror, backwards."]]); }
    if(hs==='spunk3') return say("Through the glass, the spunk is enormous. It has six legs and a shiny green shell. It looks back at you, unimpressed.");
    if(hs==='nilsson3') return say([['nilsson', "Eek!"], "You inspect Mr Nilsson for fleas. None. A very clean monkey. He inspects you back."]);
    if(hs==='plaque' || hs==='romans' || hs==='clock3') return say("Bigger letters. Still Roman.");
    return say("Everything looks bigger. It doesn't look any cleverer.");
  }
  say("That doesn't do anything useful.");
}
