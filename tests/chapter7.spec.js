const { test, expect } = require('@playwright/test');
const { seed, hs, skip, useSlot, waitModalClosed, expectWin } = require('./helpers');

test('Chapter 7: a day on Captain Longstocking\'s island', async ({ page }) => {
  await seed(page, null, ['-ch2', '-ch3', '-ch4', '-ch5', '-ch6', '-ch7']);
  await expect(page.locator('#btn-ch7')).toBeVisible();
  await page.locator('#btn-ch7').click();
  await expect(page.locator('#d-who')).toHaveText('The island');
  await skip(page);
  await expect(page.locator('#chap')).toHaveText('Chapter 7 · The South Sea Island');
  await expect(page.locator('#sc-island')).toHaveClass(/on/);

  // the islet is cut off at high tide, and the tide post needs the time first
  await hs(page, 'islet7');
  await expect(page.locator('#d-txt')).toContainText('Turtle Islet', { timeout: 5_000 });
  await skip(page);
  await hs(page, 'tidepost');
  await expect(page.locator('#d-txt')).toContainText('tide post', { timeout: 5_000 });
  await skip(page);

  // wake the king: the treasure map
  await hs(page, 'captain7');
  await skip(page);
  await expect(page.locator('.slot[title="Treasure map"]')).toBeVisible();

  // 1. the sundial: the shadow points away from the sun, and is shortest at noon
  await hs(page, 'sundial');
  await page.locator('#dial7-svg .hr[data-h="15"]').dispatchEvent('click');
  await expect(page.locator('#dial7-fb')).toContainText('same side as the sun');
  await page.locator('#dial7-svg .hr[data-h="9"]').dispatchEvent('click');
  await expect(page.locator('#dial7-fb')).toHaveClass(/good/);
  await page.locator('.d6o[data-i="1"]').click();
  await expect(page.locator('#dial7-fb')).toContainText('sun is low');
  await page.locator('.d6o[data-i="0"]').click();
  await expect(page.locator('#dial7-fb')).toHaveClass(/good/);
  await waitModalClosed(page);

  // 2. the tide: 9 + 6 = 3 o'clock, and the Moon
  await hs(page, 'tidepost');
  await page.locator('.t6o[data-i="3"]').click();
  await expect(page.locator('#tide7-fb')).toContainText('High tide again');
  await page.locator('.t6o[data-i="1"]').click();
  await expect(page.locator('#tide7-fb')).toContainText("3 o'clock");
  await page.locator('.t6o[data-i="1"]').click();
  await expect(page.locator('#tide7-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#sc-island')).toHaveClass(/lowtide/);

  // 3. the captain's paces: 12 of Pippi's paces is only 6 metres; 24 is 12 metres
  await useSlot(page, 'Treasure map');
  await hs(page, 'islet7');
  await page.locator('.wk7[data-i="0"]').click();
  await page.locator('#pc7').fill('12');
  await page.locator('#pc7-go').click();
  await expect(page.locator('#pc7-fb')).toContainText('only 6 metres');
  await page.locator('#pc7').fill('24');
  await page.locator('#pc7-go').click();
  await expect(page.locator('#pc7-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#si-x')).toBeVisible();

  // dig with the king's spade
  await hs(page, 'shovel7');
  await skip(page);
  await useSlot(page, 'A spade');
  await hs(page, 'dig7');
  await skip(page);
  await expect(page.locator('#si-hole')).toBeVisible();

  // 4. the chest's lock: a food chain
  await hs(page, 'dig7');
  const card = k => page.locator(`.card7[data-i="${k}"]`).click();
  await card(2); await card(0); await card(4); await card(1);   // coconut first
  await page.locator('#ch7-go').click();
  await expect(page.locator('#ch7-fb')).toContainText('starts with the Sun');
  await page.locator('#ch7-clear').click();
  await card(0); await card(4); await card(1); await card(3);   // sun, seaweed, crab, octopus
  await page.locator('#ch7-go').click();
  await expect(page.locator('#ch7-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#sc-island')).toHaveClass(/storm/);

  // 5. the thunder: 9 seconds = 3 km, then 3 seconds: closer! (after getting soaked)
  await hs(page, 'sky7');
  await page.locator('#th7-watch').click();
  await expect(page.locator('#th7-q')).toBeVisible({ timeout: 8_000 });
  await page.locator('.th6o[data-i="2"]').click();
  await expect(page.locator('#th7-fb')).toContainText('27 seconds');
  await page.locator('.th6o[data-i="1"]').click();
  await expect(page.locator('#th7-fb')).toHaveClass(/good/);
  await page.locator('#th7-watch').click();
  await expect(page.locator('#th7-q')).toBeVisible({ timeout: 8_000 });
  await page.locator('.th6o[data-i="1"]').click();
  await expect(page.locator('#th7-fb')).toContainText('wet right through');
  await page.locator('.th6o[data-i="0"]').click();
  await expect(page.locator('#th7-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#sc-island')).toHaveClass(/dusk/);

  // 6. the turtles: switch off the lights the nest can see, keep the feast torches on
  await hs(page, 'nest7');
  await page.locator('#tt7-go').click();
  await expect(page.locator('#tt7-fb')).toContainText('wrong way');
  for (const i of [0, 1, 2, 3]) await page.locator(`.lt7[data-i="${i}"]`).click();
  await page.locator('#tt7-go').click();
  await expect(page.locator('#tt7-fb')).toContainText('pitch dark');
  await page.locator('.lt7[data-i="3"]').click();
  await page.locator('#tt7-go').click();
  await expect(page.locator('#tt7-fb')).toHaveClass(/good/);
  await expectWin(page, 'Goodnight, turtles · Chapter 7 complete');
  await expect(page.locator('#sc-island')).toHaveClass(/hatch/);
  await expect(page.locator('#w-ach .got', { hasText: 'Soaked to the skin' })).toBeVisible();
});

test('the palm and the parrot have their achievements', async ({ page }) => {
  await seed(page, { ch: 7, scene: 'island', f: { introDone: true } }, ['-ch2', '-ch3', '-ch4', '-ch5', '-ch6', '-ch7']);
  await page.locator('#btn-cont').click();
  await skip(page);
  for (let i = 0; i < 3; i++) { await hs(page, 'palm7'); await skip(page); }
  for (let i = 0; i < 3; i++) { await hs(page, 'parrot7'); await skip(page); }
  const ach = await page.evaluate(() => S.ach);
  expect(ach.bonk && ach.polly).toBe(true);
});

test('finishing Chapter 6 leads to Chapter 7, also by going ashore', async ({ page }) => {
  await seed(page, { ch: 6, scene: 'ship', f: { out6: true } }, ['-ch2', '-ch3', '-ch4', '-ch5', '-ch6']);
  await expect(page.locator('#btn-cont')).toHaveText('Continue to Chapter 7');
  await page.locator('#btn-cont').click();
  await expect(page.locator('#chap')).toHaveText('Chapter 7 · The South Sea Island');
  await skip(page);
  await seed(page, { ch: 6, scene: 'ship', f: { out6: true, introDone: true } }, ['-ch2', '-ch3', '-ch4', '-ch5', '-ch6']);
  await expect(page.locator('#title')).not.toHaveClass(/loading/);
  await page.evaluate(() => { document.querySelector('#title').hidden = true; showWin(); });
  await expect(page.locator('#btn-next')).toHaveText('Continue to Chapter 7');
  await page.locator('#btn-stay').click();
  await skip(page);
  await expect(page.locator('#sc-ship [data-hs="isle6"]')).toHaveAttribute('data-label', 'The island: on to Chapter 7');
  await hs(page, 'isle6');
  await expect(page.locator('#chap')).toHaveText('Chapter 7 · The South Sea Island');
});
