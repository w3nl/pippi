// The Motion setting: on (the default), off, auto (follows the device). Every moving part in the rooms is a CSS animation,
// so the kill-switch at the end of css/animations.css stops them all.
const { test, expect } = require('@playwright/test');
const { KEY, seed, skip } = require('./helpers');

const anim = (page, sel) => page.locator(sel).first().evaluate(e => getComputedStyle(e).animationName);
/* How many elements in the shown room are animating right now. */
const moving = page => page.evaluate(() => [...document.querySelectorAll('.scene.on *')].filter(e => getComputedStyle(e).animationName !== 'none').length);

test('Motion is on by default, even on devices that prefer reduced motion; "Motion auto" follows the device', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await seed(page, { f: { introDone: true } });
  await page.locator('#btn-cont').click();
  await skip(page);
  await expect(page.locator('#btn-motion')).toHaveText('Motion on');
  await expect.poll(() => anim(page, '#vk-nilsson')).toBe('bob');
  expect(await anim(page, '#vk-ta .wave')).toBe('wave');

  await page.locator('#btn-motion').click();   // off
  await page.locator('#btn-motion').click();   // auto
  await expect(page.locator('#btn-motion')).toHaveText('Motion auto');
  await expect.poll(() => anim(page, '#vk-nilsson')).toBe('none');
  expect(await moving(page)).toBe(0);

  // the choice is remembered
  expect(await page.evaluate(KEY => localStorage.getItem(KEY + '-motion'), KEY)).toBe('auto');
  await page.reload();
  await expect(page.locator('#btn-motion')).toHaveText('Motion auto');
});

test('"Motion off" stops everything, in every room', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await seed(page, { ch: 2, scene: 'bedroom', f: { introDone: true, torchOn: true, scared: true, north: true, sos: true }, inv: ['torch'] }, ['-ch2']);
  await page.locator('#btn-cont').click();
  await skip(page);
  // the bedroom moves: stars twinkle, Pippi breathes, Tommy flashes his answer
  expect(await anim(page, '#br-window .tw')).toBe('tw');
  expect(await anim(page, '#br-bed .breathe')).toBe('breathe');
  await expect(page.locator('#br-talight')).toHaveClass(/flashing/);
  expect(await anim(page, '#br-talight')).toBe('tablink');
  expect(await moving(page)).toBeGreaterThan(10);

  await page.locator('#btn-motion').click();   // off
  await expect(page.locator('#btn-motion')).toHaveText('Motion off');
  await expect.poll(() => moving(page)).toBe(0);

  // and the kitchen too
  await page.evaluate(() => { S.ch = 1; S.scene = 'kitchen'; S.f = { fire: true }; applyVisuals(); });
  await expect(page.locator('#vk-steam')).toBeVisible();
  expect(await moving(page)).toBe(0);
  // and the classroom
  await page.evaluate(() => { S.ch = 3; S.scene = 'school'; S.f = {}; applyVisuals(); });
  await expect(page.locator('#sl-teacher')).toBeVisible();
  expect(await moving(page)).toBe(0);
  // and the snowy garden, even during the snowball fight
  await page.evaluate(() => { S.ch = 4; S.scene = 'winter'; S.f = { out4: true }; applyVisuals(); });
  await expect(page.locator('#wt-fight')).toBeVisible();
  expect(await moving(page)).toBe(0);
  await expect(page.locator('#wt-fight .wt-fly').first()).toHaveAttribute('transform', 'translate(-100 -100)');
  // and the big top, even during the show
  await page.evaluate(() => { S.ch = 5; S.scene = 'circus'; S.f = { juggle: true, out5: true }; applyVisuals(); });
  await expect(page.locator('#cc-confetti')).toBeVisible();
  expect(await moving(page)).toBe(0);
  // and the Hoppetossa, at sea and at the island
  await page.evaluate(() => { S.ch = 7; S.scene = 'ship'; S.f = { aboard: true, course: true, out7: true, equator: true, water: true }; applyVisuals(); });
  await expect(page.locator('#hp-isle')).toBeVisible();
  expect(await moving(page)).toBe(0);
  // the dolphins only exist while things move
  await expect(page.locator('#hp-seafar .hp-dolphin').first()).toHaveAttribute('transform', 'translate(-300 600)');
  // and the balloon: on the ground, over the town, in the cloud and at the church
  for (const f of [{}, { up: true }, { up: true, steer: true, found: true, dropped: true }, { up: true, steer: true, found: true, dropped: true, cloud: true, out6: true }]) {
    await page.evaluate(f => { S.ch = 6; S.scene = 'balloon'; S.f = f; applyVisuals(); }, f);
    expect(await moving(page)).toBe(0);
  }
  // and the island: in the shower, and with the turtles at night (the bird, the dolphin and the lightning only exist while moving)
  for (const f of [{ chest: true }, { chest: true, storm: true, out8: true }]) {
    await page.evaluate(f => { S.ch = 8; S.scene = 'island'; S.f = f; applyVisuals(); }, f);
    expect(await moving(page)).toBe(0);
  }
  expect(await page.locator('#si-flash').evaluate(e => getComputedStyle(e).opacity)).toBe('0');
  expect(await page.locator('#sc-island .si-dolphin').evaluate(e => getComputedStyle(e).opacity)).toBe('0');
  // and Villa Villekulla in spring: in the shower, and at the party
  for (const f of [{ larder: true }, { larder: true, rainbow: true, out10: true }]) {
    await page.evaluate(f => { S.ch = 10; S.scene = 'home'; S.f = f; applyVisuals(); }, f);
    expect(await moving(page)).toBe(0);
  }
  // and moving day: on the road, and with the clock ticking
  for (const f of [{}, { gate: true, water: true, veranda: true, light: true, boxes: true, out0: true }]) {
    await page.evaluate(f => { S.ch = 0; S.scene = 'move'; S.f = f; applyVisuals(); }, f);
    expect(await moving(page)).toBe(0);
  }
  // and the voyage home: in the storm, at night with the lighthouses, and in the harbour
  for (const f of [{ packed: true, bottle: true }, { packed: true, bottle: true, reefed: true, swallows: true }, { packed: true, bottle: true, reefed: true, swallows: true, light: true, out9: true }]) {
    await page.evaluate(f => { S.ch = 9; S.scene = 'voyage'; S.f = f; applyVisuals(); }, f);
    expect(await moving(page)).toBe(0);
  }
});

test('the voyage home moves: the ship rocks, the waves roll, the storm rains, the lighthouses flash', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await seed(page, { ch: 9, scene: 'voyage', f: { introDone: true } }, ['-ch2', '-ch3', '-ch4', '-ch5', '-ch6', '-ch7', '-ch8', '-ch9']);
  await page.locator('#btn-cont').click();
  await skip(page);
  expect(await anim(page, '#vy-ship .vy-rock')).toBe('vyRock');
  expect(await anim(page, '#vy-crests')).toBe('vyCrests');
  expect(await anim(page, '#sc-voyage .vy-flag')).toBe('vyFlag');
  await page.evaluate(() => { Object.assign(S.f, { packed: true, bottle: true }); applyVisuals(); });
  expect(await anim(page, '#vy-ship .vy-rock')).toBe('vyHeel');
  expect(await anim(page, '#vy-rain .vy-drop')).toBe('vyRain');
  await expect.poll(() => page.locator('#vy-world').evaluate(e => getComputedStyle(e).transform)).not.toBe('none');
  await page.evaluate(() => { Object.assign(S.f, { reefed: true, swallows: true }); applyVisuals(); });
  expect(await anim(page, '#vy-lights .vy-flash.c')).toBe('vyFlashC');
  expect(await moving(page)).toBeGreaterThan(20);
});

test('Villa Villekulla moves: swallows swoop, Pippi wobbles under the horse, the rain falls, the lanterns glow', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await seed(page, { ch: 10, scene: 'home', f: { introDone: true } }, ['-ch2', '-ch3', '-ch4', '-ch5', '-ch6', '-ch7', '-ch8', '-ch9', '-ch10']);
  await page.locator('#btn-cont').click();
  await skip(page);
  expect(await anim(page, '#sc-home .vh-swallow')).toBe('vhSwallowA');
  expect(await anim(page, '#vh-held .vh-wobble')).toBe('vhWobble');
  expect(await anim(page, '#sc-home .vh-crown')).toBe('vhCrown');
  await page.evaluate(() => { S.f.larder = true; applyVisuals(); });
  expect(await anim(page, '#vh-rain .vh-drops')).toBe('vhRain');
  await page.evaluate(() => { S.f.rainbow = true; applyVisuals(); });
  expect(await anim(page, '#vh-hog .vh-snuffle')).toBe('vhSnuffle');
  await page.evaluate(() => { S.f.out10 = true; applyVisuals(); });
  expect(await anim(page, '#vh-lanterns .vh-glow')).toBe('vhGlow');
  expect(await moving(page)).toBeGreaterThan(12);
});

test('the balloon moves: it sways, the burner flickers, the kite flies, the world slides past, the crowd cheers', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await seed(page, { ch: 6, scene: 'balloon', f: { introDone: true, up: true } }, ['-ch2', '-ch3', '-ch4', '-ch5', '-ch6']);
  await page.locator('#btn-cont').click();
  await skip(page);
  expect(await anim(page, '#bl-balloon .bl-sway')).toBe('blSway');
  expect(await anim(page, '#bl-balloon .bl-fire')).toBe('blFire');
  expect(await anim(page, '#sc-balloon .bl-kitefly')).toBe('blKite');
  expect(await anim(page, '#sc-balloon .bl-puff')).toBe('blPuff');
  await page.evaluate(() => { S.f.steer = true; applyVisuals(); });
  await expect.poll(() => page.locator('#bl-world').evaluate(e => getComputedStyle(e).transform)).not.toBe('none');
  await page.evaluate(() => { Object.assign(S.f, { found: true, dropped: true, cloud: true, out6: true }); applyVisuals(); });
  expect(await anim(page, '#sc-balloon .bl-cheer')).toBe('blCheer');
  expect(await moving(page)).toBeGreaterThan(20);
});

test('the island moves: palms sway, the captain snores in his hammock, the rain falls, the turtles scurry', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await seed(page, { ch: 8, scene: 'island', f: { introDone: true } }, ['-ch2', '-ch3', '-ch4', '-ch5', '-ch6', '-ch7', '-ch8']);
  await page.locator('#btn-cont').click();
  await skip(page);
  expect(await anim(page, '#sc-island .palm')).toBe('siPalm');
  expect(await anim(page, '#si-captain .sway')).toBe('siHammock');
  expect(await anim(page, '#si-ship')).toBe('siBob');
  await page.evaluate(() => { S.f.chest = true; applyVisuals(); });
  expect(await anim(page, '#sc-island .palm')).toBe('siPalmStorm');
  expect(await anim(page, '#si-rain .drops')).toBe('siRain');
  await page.evaluate(() => { S.f.storm = true; S.f.out8 = true; applyVisuals(); });
  expect(await anim(page, '#sc-island .si-baby')).toBe('siBaby');
  expect(await moving(page)).toBeGreaterThan(25);
});

test('the Hoppetossa moves: she bobs at the quay, then rocks at sea with full sails, fish and dolphins', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await seed(page, { ch: 7, scene: 'ship', f: { introDone: true } }, ['-ch2', '-ch3', '-ch4', '-ch5', '-ch6', '-ch7']);
  await page.locator('#btn-cont').click();
  await skip(page);
  expect(await anim(page, '#hp-ship')).toBe('hpBob');
  expect(await anim(page, '.hp-cloud')).toBe('hpCloud');
  expect(await anim(page, '.hp-fish')).toBe('hpFish');
  expect(await anim(page, '.hp-gull')).toBe('hpGull');
  await page.evaluate(() => { S.f.aboard = true; S.f.course = true; applyVisuals(); });
  expect(await anim(page, '#hp-ship')).toBe('hpRock');
  expect(await anim(page, '#hp-sails .hp-sail')).toBe('hpFull');
  expect(await anim(page, '.hp-dolphin')).toBe('hpDolphin');
  expect(await moving(page)).toBeGreaterThan(20);
});

test('the big top moves: the horse trots, the spotlights sweep, the trapezes swing, and the show adds confetti', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await seed(page, { ch: 5, scene: 'circus', f: { introDone: true } }, ['-ch2', '-ch3', '-ch4', '-ch5']);
  await page.locator('#btn-cont').click();
  await skip(page);
  expect(await anim(page, '#cc-horse')).toBe('ccTrot');
  expect(await anim(page, '#sc-circus .beam.a')).toBe('ccSweepA');
  expect(await anim(page, '#sc-circus .swing.l')).toBe('ccSwing');
  // out of time until the trapeze puzzle is solved
  const dur = () => page.evaluate(() => [...document.querySelectorAll('#sc-circus .swing')].map(e => getComputedStyle(e).animationDuration));
  expect(new Set(await dur()).size).toBe(2);
  await page.evaluate(() => { S.f.trapeze = true; S.f.juggle = true; applyVisuals(); });
  expect(new Set(await dur()).size).toBe(1);
  expect(await anim(page, '#cc-balls-air .jball')).toBe('ccJugA');
  await page.evaluate(() => { S.f.out5 = true; applyVisuals(); });
  expect(await anim(page, '#cc-confetti .confetto')).toBe('ccConfetti');
  expect(await moving(page)).toBeGreaterThan(40);
});

test('the snowy garden moves: snow falls, smoke rises, Annika shivers, the policemen stamp, and snowballs fly', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await seed(page, { ch: 4, scene: 'winter', f: { introDone: true } }, ['-ch2', '-ch3', '-ch4']);
  await page.locator('#btn-cont').click();
  await skip(page);
  expect(await anim(page, '.wt-flake')).toBe('wtFall');
  expect(await anim(page, '.wt-puff')).toBe('wtPuff');
  expect(await anim(page, '#wt-annika')).toBe('wtShiver');
  expect(await anim(page, '.wt-stamp')).toBe('wtStamp');
  await page.evaluate(() => { S.f.warm = true; S.f.out4 = true; applyVisuals(); });
  expect(await anim(page, '#wt-annika')).toBe('none');
  expect(await anim(page, '.wt-fly')).toBe('wtFlyA');
  expect(await moving(page)).toBeGreaterThan(70);
});

test('the classroom moves: the horse munches, Miss bobs at the door window, the clock ticks', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await seed(page, { ch: 3, scene: 'school', f: { introDone: true } }, ['-ch2', '-ch3']);
  await page.locator('#btn-cont').click();
  await skip(page);
  expect(await anim(page, '#sl-horse')).toBe('nod');
  expect(await anim(page, '#sl-teacher')).toBe('peek');
  expect(await anim(page, '.sl-sec')).toBe('slsec');
  expect(await moving(page)).toBeGreaterThan(8);
});

test('a new item pops into your pockets', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await seed(page, { f: { introDone: true } });
  await page.locator('#btn-cont').click();
  await skip(page);
  await page.evaluate(() => give('eggs'));
  await expect(page.locator('.slot.pop')).toHaveAttribute('title', 'Eggs');
  expect(await anim(page, '.slot.pop')).toBe('slotpop');
});

test('things come and go smoothly: the horse trots off, the island grows; with Motion off they switch at once', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await seed(page, { f: { introDone: true, key: true, unlocked: true } });
  await page.locator('#btn-cont').click();
  await skip(page);
  await page.evaluate(() => { S.f.out1 = true; applyVisuals(); });
  await expect(page.locator('#vk-horse')).toHaveClass(/vk-horse-off/);
  await expect(page.locator('#vk-horse')).toBeVisible();          // still on its way out
  await expect(page.locator('#vk-horse')).toBeHidden({ timeout: 5_000 });
  // a change made behind a close-up waits until it closes
  await page.evaluate(() => { S.f.out1 = false; openModal('Test', '', '<p>…</p>'); applyVisuals(); });
  await expect(page.locator('#vk-horse')).toBeHidden();
  await page.evaluate(() => closeModal());
  await expect(page.locator('#vk-horse')).toBeVisible();
  // the island at land ho
  await seed(page, { ch: 7, scene: 'ship', f: { introDone: true, aboard: true, course: true, floats: true, water: true, equator: true } }, ['-ch2', '-ch3', '-ch4', '-ch5', '-ch6', '-ch7']);
  await page.locator('#btn-cont').click();
  await skip(page);
  await page.evaluate(() => { S.f.out7 = true; applyVisuals(); });
  await expect(page.locator('#hp-isle')).toHaveClass(/hp-isle-in/);
  // Motion off: no fades, things just switch
  await page.locator('#btn-motion').click();
  await expect(page.locator('#btn-motion')).toHaveText('Motion off');
  await page.evaluate(() => { S.f.out7 = false; applyVisuals(); });
  await expect(page.locator('#hp-isle')).toBeHidden();
});
