const { test, expect } = require('@playwright/test');
const { seed, hs, skip, useSlot, waitModalClosed, expectWin } = require('./helpers');

const UNL = ['-ch2', '-ch3', '-ch4', '-ch5', '-ch6', '-ch7', '-ch8', '-ch9'];

test('Chapter 9: the voyage home', async ({ page }) => {
  await seed(page, null, UNL);
  await expect(page.locator('#btn-ch9')).toBeVisible();
  await page.locator('#btn-ch9').click();
  await expect(page.locator('#d-who')).toHaveText('The Hoppetossa · homeward');
  await skip(page);
  await expect(page.locator('#chap')).toHaveText('Chapter 9 · The Voyage Home');
  await expect(page.locator('#sc-voyage')).toHaveClass(/on/);

  // 1. the seasons: spring at home in April, autumn far south
  await hs(page, 'captain9');
  await page.locator('.ss9[data-i="0"]').click();
  await expect(page.locator('#season9-fb')).toContainText('months to melt');
  await page.locator('.ss9[data-i="1"]').click();
  await expect(page.locator('#season9-fb')).toHaveClass(/good/);
  await page.locator('.ss9[data-i="0"]').click();
  await expect(page.locator('#season9-fb')).toContainText("can't both have spring");
  await page.locator('.ss9[data-i="1"]').click();
  await expect(page.locator('#season9-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#sc-voyage')).toHaveClass(/vy-sea/);

  // 2. the message in a bottle: Pippi's letter, into the current that flows to Sweden
  await hs(page, 'pippi9');
  await skip(page);
  await useSlot(page, 'A message in a bottle');
  await hs(page, 'sea9');
  await page.locator('#bottle9-svg .dp9[data-i="0"]').dispatchEvent('click');
  await expect(page.locator('#bottle9-fb')).toContainText('round and round');
  await page.locator('#bottle9-svg .dp9[data-i="3"]').dispatchEvent('click');
  await expect(page.locator('#bottle9-fb')).toHaveClass(/good/);
  await page.locator('.bt9[data-i="1"]').click();
  await expect(page.locator('#bottle9-fb')).toContainText('address');
  await page.locator('.bt9[data-i="0"]').click();
  await expect(page.locator('#bottle9-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#sc-voyage')).toHaveClass(/vy-storm/);

  // the horse is seasick in the storm
  await hs(page, 'horse9'); await skip(page);

  // 3. the storm: reef the sails, then a reef knot
  await hs(page, 'sails9');
  await page.locator('.sm9[data-i="0"]').click();
  await expect(page.locator('#storm9-fb')).toContainText('leans over even further');
  await page.locator('.sm9[data-i="1"]').click();
  await expect(page.locator('#storm9-fb')).toHaveClass(/good/);
  await page.locator('.sm9[data-i="0"]').click();
  await expect(page.locator('#storm9-fb')).toContainText('granny knot');
  await page.locator('.sm9[data-i="1"]').click();
  await expect(page.locator('#storm9-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#vy-swallows')).toBeVisible();

  // 4. the swallows: north for the summer, for the insects
  await hs(page, 'birds9');
  await page.locator('.sw9[data-i="1"]').click();
  await expect(page.locator('#swallow9-fb')).toContainText('whole winter in Africa');
  await page.locator('.sw9[data-i="0"]').click();
  await page.locator('.sw9[data-i="0"]').click();
  await expect(page.locator('#swallow9-fb')).toContainText('all about food');
  await page.locator('.sw9[data-i="1"]').click();
  await expect(page.locator('#swallow9-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#sc-voyage')).toHaveClass(/vy-night/);

  // 5. the lighthouses: the captain's book, then two flashes every 10 seconds
  await hs(page, 'light9');
  await expect(page.locator('#d-txt')).toContainText('Three lighthouses', { timeout: 5_000 });
  await skip(page);
  await hs(page, 'box9');
  await skip(page);
  await useSlot(page, 'The Book of Lighthouses');
  await hs(page, 'light9');
  await page.locator('.lt9[data-i="0"]').click();
  await expect(page.locator('#lights9-fb')).toContainText('Seal Point');
  await page.locator('.lt9[data-i="1"]').click();
  await expect(page.locator('#lights9-fb')).toContainText('Gull Rock');
  await page.locator('.lt9[data-i="2"]').click();
  await expect(page.locator('#lights9-fb')).toHaveClass(/good/);
  await page.locator('.lq9[data-i="1"]').click();
  await expect(page.locator('#lights9-fb')).toContainText('nobody would see it');
  await page.locator('.lq9[data-i="0"]').click();
  await expect(page.locator('#lights9-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#sc-voyage')).toHaveClass(/vy-harbour/);

  // 6. the buoys: red on the left coming in, so route B
  await hs(page, 'buoys9');
  await page.locator('.by9[data-i="1"]').click();
  await expect(page.locator('#buoys9-fb')).toContainText('red on the left');
  await page.locator('.by9[data-i="0"]').click();
  await expect(page.locator('#buoys9-fb')).toHaveClass(/good/);
  await page.locator('.by9[data-i="0"]').click();
  await expect(page.locator('#buoys9-fb')).toContainText('green buoys');
  await page.locator('.by9[data-i="1"]').click();
  await expect(page.locator('#buoys9-fb')).toHaveClass(/good/);
  await expectWin(page, 'Safe in harbour · Chapter 9 complete');
  await expect(page.locator('#sc-voyage')).toHaveClass(/vy-docked/);
  await expect(page.locator('#btn-next')).toHaveText('Continue to Chapter 10');
  await expect(page.locator('#w-ach .got', { hasText: 'A seasick horse' })).toBeVisible();
});

test('Pippi shouts at the town three times', async ({ page }) => {
  await seed(page, { ch: 9, scene: 'voyage', f: { introDone: true, packed: true, bottle: true, reefed: true, swallows: true, light: true } }, UNL);
  await page.locator('#btn-cont').click();
  await skip(page);
  for (let i = 0; i < 3; i++) { await hs(page, 'town9'); await skip(page); }
  expect(await page.evaluate(() => S.ach.ahoy)).toBe(true);
});

test('finishing Chapter 8 leads to Chapter 9, also by boarding the Hoppetossa', async ({ page }) => {
  const UNL8 = ['-ch2', '-ch3', '-ch4', '-ch5', '-ch6', '-ch7', '-ch8'];
  await seed(page, { ch: 8, scene: 'island', f: { out8: true } }, UNL8);
  await expect(page.locator('#btn-cont')).toHaveText('Continue to Chapter 9');
  await page.locator('#btn-cont').click();
  await expect(page.locator('#chap')).toHaveText('Chapter 9 · The Voyage Home');
  await skip(page);
  await seed(page, { ch: 8, scene: 'island', f: { out8: true, introDone: true } }, UNL8);
  await expect(page.locator('#title')).not.toHaveClass(/loading/);
  await page.evaluate(() => { document.querySelector('#title').hidden = true; showWin(); });
  await expect(page.locator('#btn-next')).toHaveText('Continue to Chapter 9');
  await page.locator('#btn-stay').click();
  await skip(page);
  await expect(page.locator('#sc-island [data-hs="ship8"]')).toHaveAttribute('data-label', 'The Hoppetossa: on to Chapter 9');
  await hs(page, 'ship8');
  await expect(page.locator('#chap')).toHaveText('Chapter 9 · The Voyage Home');
  await expect(page.locator('#btn-ch9')).toBeAttached();
});
