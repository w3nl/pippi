// The Motion setting: auto (follows the device), on, off. Every moving part in the rooms is a CSS animation,
// so the kill-switch at the end of css/animations.css stops them all.
const { test, expect } = require('@playwright/test');
const { KEY, seed, skip } = require('./helpers');

const anim = (page, sel) => page.locator(sel).first().evaluate(e => getComputedStyle(e).animationName);
/* How many elements in the shown room are animating right now. */
const moving = page => page.evaluate(() => [...document.querySelectorAll('.scene.on *')].filter(e => getComputedStyle(e).animationName !== 'none').length);

test('devices that prefer reduced motion stand still, unless the player picks "Motion on"', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await seed(page, { f: { introDone: true } });
  await page.locator('#btn-cont').click();
  await skip(page);
  await expect(page.locator('#btn-motion')).toHaveText('Motion auto');
  expect(await anim(page, '#vk-nilsson')).toBe('none');
  expect(await moving(page)).toBe(0);

  await page.locator('#btn-motion').click();
  await expect(page.locator('#btn-motion')).toHaveText('Motion on');
  await expect.poll(() => anim(page, '#vk-nilsson')).toBe('bob');
  expect(await anim(page, '#vk-ta .wave')).toBe('wave');

  // the choice is remembered
  expect(await page.evaluate(KEY => localStorage.getItem(KEY + '-motion'), KEY)).toBe('on');
  await page.reload();
  await expect(page.locator('#btn-motion')).toHaveText('Motion on');
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

  await page.locator('#btn-motion').click();   // on
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
  // and the big top, even during the show
  await page.evaluate(() => { S.ch = 4; S.scene = 'circus'; S.f = { juggle: true, out4: true }; applyVisuals(); });
  await expect(page.locator('#cc-confetti')).toBeVisible();
  expect(await moving(page)).toBe(0);
  // and the Hoppetossa, at sea and at the island
  await page.evaluate(() => { S.ch = 5; S.scene = 'ship'; S.f = { aboard: true, course: true, out5: true, equator: true, water: true }; applyVisuals(); });
  await expect(page.locator('#hp-isle')).toBeVisible();
  expect(await moving(page)).toBe(0);
  // the dolphins only exist while things move
  await expect(page.locator('#hp-seafar .hp-dolphin').first()).toHaveAttribute('transform', 'translate(-300 600)');
});

test('the Hoppetossa moves: she bobs at the quay, then rocks at sea with full sails, fish and dolphins', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await seed(page, { ch: 5, scene: 'ship', f: { introDone: true } }, ['-ch2', '-ch3', '-ch4', '-ch5']);
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
  await seed(page, { ch: 4, scene: 'circus', f: { introDone: true } }, ['-ch2', '-ch3', '-ch4']);
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
  await page.evaluate(() => { S.f.out4 = true; applyVisuals(); });
  expect(await anim(page, '#cc-confetti .confetto')).toBe('ccConfetti');
  expect(await moving(page)).toBeGreaterThan(40);
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
