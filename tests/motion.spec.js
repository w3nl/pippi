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
  await page.evaluate(() => { S.ch = 4; S.scene = 'circus'; S.f = {}; applyVisuals(); });
  expect(await moving(page)).toBe(0);
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

test('the circus lights, beams and trapeze artists move', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await seed(page, { ch: 4, scene: 'circus', f: { introDone: true } }, ['-ch2', '-ch3', '-ch4']);
  await page.locator('#btn-cont').click();
  await skip(page);
  expect(await anim(page, '.ct-lights circle')).toBe('ctTwinkle');
  expect(await anim(page, '.ct-theatre-beam.beam-a')).toBe('ctBeamRed');
  expect(await anim(page, '.ct-trapeze.swing-a')).toBe('ctSwing');
  expect(await anim(page, '.ct-juggle-ball')).toBe('ctToss');
  expect(await moving(page)).toBeGreaterThan(8);
  await page.evaluate(() => { S.f.out4 = true; applyVisuals(); });
  await expect(page.locator('#ct-confetti')).toBeVisible();
  expect(await anim(page, '.ct-confetto')).toBe('ctConfetti');
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
