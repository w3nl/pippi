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
  if(item==='mittens'){
    if(hs==='thermo4' || hs==='snow4' || hs==='steps4') return S.f.balls ? say("You've made enough snowballs. Any more and the horse won't be able to pull the sledge.") : openThermo4();
    if(hs==='ta4') return say(['annika', "Thank you, but those are yours. Pippi says she has spare ones somewhere. Somewhere in that wardrobe."]);
    if(hs==='oak4' || hs==='nilsson4') return say([['nilsson', "Eek!"], "Mr Nilsson eyes your mittens greedily. You put them safely back in your pocket."]);
    return say("Warm, woolly mittens. Perfect for making snowballs, if the snow is the right kind.");
  }
  if(item==='tickets'){
    if(hs!=='ringmaster') return say("Circus tickets are for showing to the ringmaster.");
    take('tickets'); S.f.inside = true; save(); applyVisuals(); beep(700,.06);
    return say([['ringmaster', "Four tickets, very good. Welcome to the circus!"], ['ringmaster', "But oh dear, oh dear. The show can't begin! Everything is going wrong."], ['ringmaster', "The spotlights are all the wrong colours, the teeterboard won't balance, the clown has forgotten his juggling, and the trapeze artists can't catch each other. My checklist is on the tent pole."], ['pippi', "I've never fixed a circus, so I'm sure I can!"]]);
  }
  if(item==='note6'){
    if(hs==='police6') return openChute6();
    return say("Annika's note is for Kling and Klang, on the road far below.");
  }
  if(item==='rooster'){
    if(hs==='tower6') return openVane6();
    if(hs==='nilsson6') return say([['nilsson', "Eek!"], "Mr Nilsson tries to sit on the weathercock. It's not a rocking horse."]);
    return say("The golden weathercock belongs on top of the church tower.");
  }
  if(item==='bottle9'){
    if(hs==='sea9') return openBottle9();
    if(hs==='nilsson9') return say([['nilsson', "Eek!"], "Mr Nilsson wants to pull the cork out. You hold the bottle up high."]);
    return say("A message in a bottle is for throwing into the sea. The right bit of sea.");
  }
  if(item==='book9'){
    if(hs==='light9' || (hs==='sky9' && leg9() === 'night')) return openLights9();
    if(hs==='captain9') return say(['captain', "My Book of Lighthouses! Every light on the coast is in there. Find ours, sailor."]);
    return say("The Book of Lighthouses is for telling lighthouses apart at night.");
  }
  if(item==='oil0'){
    if(hs==='gate0') return S.f.gate ? say("The gate already swings like a dream.") : openGate0();
    if(hs==='pump0') return say("Oil in the drinking water? The horse would not thank you.");
    if(hs==='nilsson0') return say([['nilsson', "Eek!"], "Mr Nilsson holds out his tail to be oiled. You decide not to."]);
    return say("Oil is for things that squeak, stick or won't move.");
  }
  if(item==='mirror0'){
    if(hs==='door0' || hs==='hall0' || hs==='window0') return S.f.veranda ? openLight0() : say("First get onto the veranda. Then you can shine the sun in through the front door.");
    if(hs==='pippi0') return say(['pippi', "Forty-two freckles. No, forty-three. Mr Nilsson, keep still, you're in the way."]);
    if(hs==='horse0') return say(["The horse looks into the mirror, and the horse in the mirror looks back.", ['horse', "Pfrrr?!"]]);
    return say("The mirror catches the sun and throws a bright spot around. Where is it dark?");
  }
  if(item==='net'){
    if(hs==='sea7'){
      if(!S.f.course) return say("In the harbour? The only thing to catch here is a bored seagull.");
      if(S.f.floats) return say("There's nothing left to fish out. Only fish, and they'd rather stay where they are.");
      return openFloat();
    }
    if(hs==='nilsson7') return say([['nilsson', "Eek!"], "You catch Mr Nilsson in the net. He looks delighted. You let him go again."]);
    return say("A fishing net is for fishing things out of the sea.");
  }
  if(item==='sextant'){
    if(hs==='sky7'){
      if(S.f.water && !S.f.equator) return openSextant7();
      return say("The note in the box said: only works at night. Obviously.");
    }
    return say("A sextant measures how high a star is above the horizon. Point it at the sky.");
  }
  if(item==='spyglass'){
    if(hs==='crow' || hs==='sky7' || hs==='sea7'){
      if(S.f.equator && !S.f.out7 && hs==='crow') return openLandHo();
      if(S.f.equator && !S.f.out7) return say("From down here on deck, there's nothing but sea. Climb higher: the crow's nest!");
      return say("You look through the spyglass. Sea. More sea. A seagull, very close up.");
    }
    if(hs==='horse7'){ S.ach.closehorse = true; save(); return say(["You look at the horse through the spyglass. An enormous eye looks back at you.", ['horse', "Pfrrrr!"]]); }
    if(hs==='pippi7') return say(['pippi', "I can see you! Your freckle is enormous. Well, my freckles are, anyway."]);
    return say("Through the spyglass, everything nearby is a blur. It's for things far away.");
  }
  if(item==='map'){
    if(hs==='islet8') return S.f.tide ? openPaces8() : say("Turtle Islet is still cut off by the water. Wait for low tide.");
    if(hs==='captain8') return say([['captain', "Zzz… my map? You keep it, sailor. Twelve of MY paces… zzz…"]]);
    if(hs==='nilsson8') return say([['nilsson', "Eek!"], "Mr Nilsson wants to eat the map. You hold it up high."]);
    return say("The map shows Turtle Islet, out in the lagoon. That's where the X is.");
  }
  if(item==='spade'){
    if((hs==='dig8' || hs==='islet8') && S.f.paces && !S.f.dug){
      take('spade'); S.f.dug = true; save(); applyVisuals(); beep(180,.15,'square',.03);
      return say(["You dig, and dig, and dig. Pippi helps, with her hands, very fast. Sand flies everywhere.", "CLONK! The spade hits wood. A treasure chest, with a strange lock on its lid!"]);
    }
    if(hs==='islet8' || hs==='dig8') return say(S.f.tide ? "Where to dig? The map says: 12 of the captain's paces from the turtle rock." : "Turtle Islet is still cut off by the water.");
    if(hs==='captain8') return say([['captain', "Dig me up later, sailor. Zzz."]]);
    return say("You dig a little hole. Nothing in it but sand and an offended crab. The X is somewhere else.");
  }
  if(item==='magnet'){
    if(hs==='barrel10') return S.f.key ? say("There's nothing left down there that a magnet likes.") : openMagnet10();
    if(hs==='nilsson10') return say([['nilsson', "Eek?"], "You hold the magnet next to Mr Nilsson. Nothing happens: his trouser buttons are made of brass, and brass isn't magnetic."]);
    if(hs==='gate10') return say("CLANK! The magnet jumps onto the iron hinge of the gate and sticks. It takes both hands to pull it off again.");
    if(hs==='door10') return say("The magnet sticks to the iron lock. But it doesn't unlock anything. You need the key, and the key is in the rain barrel.");
    if(hs==='pippi10') return say(['pippi', "Nothing sticks to me. I'm made of muscles, freckles and pancakes."]);
    return say("A magnet pulls things made of iron or steel. Somewhere around here, an iron key is hiding.");
  }
  if(item==='key10'){
    if(hs!=='door10') return say(hs==='nilsson10' ? "Mr Nilsson reaches for the key. Not this time: you hold on tight." : "It's the front-door key. It belongs in the front door.");
    take('key10'); S.f.door = true; save(); applyVisuals(); beep(300,.12,'triangle');
    return say(["Click! The front door of Villa Villekulla swings open. Inside it smells of dust, old pancakes and home.", ['annika', "Let's get the party food out of the larder!"], "Tommy and Annika carry everything from Pippi's larder out to the garden table."]);
  }
  say("That doesn't do anything useful.");
}
