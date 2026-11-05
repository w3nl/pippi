const { test, expect } = require('@playwright/test');
const { seed, hs, skip, useSlot, waitModalClosed, expectWin } = require('./helpers');

test('Chapter 0: Pippi moves in to Villa Villekulla', async ({ page }) => {
  await seed(page);
  // a new visitor sees moving day behind the title, and its story
  await expect(page.locator('#t-story')).toContainText('nobody has lived in it for years');
  await page.locator('#btn-new').click();
  await expect(page.locator('#d-who')).toHaveText('Villa Villekulla · moving day');
  await skip(page);
  await expect(page.locator('#chap')).toHaveText('Chapter 0 · Pippi Moves In');
  await expect(page.locator('#sc-move')).toHaveClass(/on/);

  // the very first spunk
  await hs(page, 'spunk0'); await skip(page);
  await expect(page.locator('.slot[title="The spunk"]')).toBeVisible();

  // 1. the rusty gate: oil, because rust is iron eaten by water and air
  await hs(page, 'gate0');
  await expect(page.locator('#d-txt')).toContainText('rusted solid', { timeout: 5_000 });
  await skip(page);
  await hs(page, 'cart0'); await skip(page);
  await useSlot(page, 'An oil can');
  await hs(page, 'gate0');
  await page.locator('.gt0[data-i="0"]').click();
  await expect(page.locator('#gate0-fb')).toContainText('made it rusty');
  await page.locator('.gt0[data-i="1"]').click();
  await expect(page.locator('#gate0-fb')).toHaveClass(/good/);
  await page.locator('.gt0[data-i="0"]').click();
  await expect(page.locator('#gate0-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#mv-gateopen')).toBeVisible();

  // 2. the dry pump: prime it, then air pressure pushes the water up
  await hs(page, 'pump0');
  await page.locator('.pm0[data-i="0"]').click();
  await expect(page.locator('#pump0-fb')).toContainText('dried out');
  await page.locator('.pm0[data-i="1"]').click();
  await page.locator('.pm0[data-i="0"]').click();
  await expect(page.locator('#pump0-fb')).toHaveClass(/good/);
  await waitModalClosed(page);

  // 3. the veranda: a horse is about 400 kg, and 400 + 30 < 500
  await hs(page, 'veranda0');
  await page.locator('.vr0[data-i="2"]').click();
  await expect(page.locator('#vrd0-fb')).toContainText('elephant');
  await page.locator('.vr0[data-i="1"]').click();
  await page.locator('.vr0[data-i="1"]').click();
  await expect(page.locator('#vrd0-fb')).toContainText('700');
  await page.locator('.vr0[data-i="0"]').click();
  await expect(page.locator('#vrd0-fb')).toHaveClass(/good/);
  await waitModalClosed(page);

  // 4. the dark hall: Pippi's mirror, tipped a little
  await hs(page, 'hall0');
  await expect(page.locator('#d-txt')).toContainText('pitch dark', { timeout: 5_000 });
  await skip(page);
  await hs(page, 'cart0'); await skip(page);
  await useSlot(page, "Pippi's hand mirror");
  await hs(page, 'door0');
  await page.locator('.lg0[data-i="0"]').click();
  await expect(page.locator('#light0-fb')).toContainText('into the sky');
  await page.locator('.lg0[data-i="1"]').click();
  await expect(page.locator('#light0-fb')).toHaveClass(/good/);
  await page.locator('.lq0[data-i="0"]').click();
  await expect(page.locator('#light0-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#mv-view')).toBeVisible();

  // 5. the boxes: heaviest at the bottom
  await hs(page, 'boxes0');
  await page.locator('.bx0[data-i="4"]').click();
  await expect(page.locator('#boxes0-fb')).toContainText('Omelette');
  for (const i of [0, 1, 2, 3, 4]) await page.locator(`.bx0[data-i="${i}"]`).click();
  await expect(page.locator('#boxes0-fb')).toHaveClass(/good/);
  await page.locator('.bq0[data-i="0"]').click();
  await expect(page.locator('#boxes0-fb')).toHaveClass(/good/);
  await waitModalClosed(page);

  // 6. the grandfather clock: a quarter past ten, like the church clock
  await hs(page, 'clock0');
  for (let i = 0; i < 9; i++) await page.locator('#ck0-mup').click();   // 0 → 45: a quarter to
  await page.locator('#ck0-go').click();
  await expect(page.locator('#clock0-fb')).toContainText('quarter TO');
  for (let i = 0; i < 6; i++) await page.locator('#ck0-mup').click();   // 45 → 15
  await page.locator('#ck0-go').click();
  await expect(page.locator('#clock0-fb')).toContainText('little hand');
  for (let i = 0; i < 2; i++) await page.locator('#ck0-hdn').click();   // 12 → 10
  await page.locator('#ck0-go').click();
  await expect(page.locator('#clock0-fb')).toHaveClass(/good/);
  await expectWin(page, 'Moved in · Chapter 0 complete');
  await expect(page.locator('#btn-next')).toHaveText('Continue to Chapter 1');
  await expect(page.locator('#w-ach .got', { hasText: 'Found the very first spunk' })).toBeVisible();
});

test('finishing Chapter 0 leads to Chapter 1, also through the front door', async ({ page }) => {
  await seed(page, { ch: 0, scene: 'move', f: { out0: true, gate: true, water: true, veranda: true, light: true, boxes: true } });
  await expect(page.locator('#btn-cont')).toHaveText('Continue to Chapter 1');
  await page.locator('#btn-cont').click();
  await expect(page.locator('#chap')).toHaveText('Chapter 1 · Locked In with Mr Nilsson');
  await skip(page);
  await seed(page, { ch: 0, scene: 'move', f: { out0: true, introDone: true, gate: true, water: true, veranda: true, light: true, boxes: true } });
  await expect(page.locator('#title')).not.toHaveClass(/loading/);
  await page.evaluate(() => { document.querySelector('#title').hidden = true; S.started = true; applyVisuals(); showWin(); });
  await expect(page.locator('#btn-next')).toHaveText('Continue to Chapter 1');
  await page.locator('#btn-stay').click();
  await skip(page);
  await expect(page.locator('#sc-move [data-hs="door0"]')).toHaveAttribute('data-label', 'Front door: on to Chapter 1');
  await hs(page, 'door0');
  await expect(page.locator('#chap')).toHaveText('Chapter 1 · Locked In with Mr Nilsson');
  await expect(page.locator('#btn-ch1')).toBeAttached();
});

test('the title screen tells the story of the saved chapter', async ({ page }) => {
  // Pippi is asleep in bed in Chapter 2, so the title must not say she has gone to town for sweets
  await seed(page, { ch: 2, scene: 'bedroom', f: { introDone: true } }, ['-ch2']);
  await expect(page.locator('#title')).not.toHaveClass(/loading/);
  await expect(page.locator('#t-story')).toContainText('fast asleep');
  await expect(page.locator('#t-story')).not.toContainText('sweets');
  await seed(page, { ch: 1, scene: 'kitchen', f: { introDone: true } });
  await expect(page.locator('#t-story')).toContainText('gone to town for sweets');
  await expect(page.locator('#btn-ch0')).toBeVisible();
});
