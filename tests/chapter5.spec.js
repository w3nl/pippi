const { test, expect } = require('@playwright/test');
const { seed, hs, skip, useSlot, waitModalClosed, expectWin } = require('./helpers');

test('Chapter 5: sail the Hoppetossa to Captain Efraim\'s island', async ({ page }) => {
  await seed(page, null, ['-ch2', '-ch3', '-ch4', '-ch5']);
  await expect(page.locator('#btn-ch5')).toBeVisible();
  await page.locator('#btn-ch5').click();
  await expect(page.locator('#d-who')).toHaveText('The Hoppetossa');
  await skip(page);
  await expect(page.locator('#chap')).toHaveText('Chapter 5 · On Board the Hoppetossa');
  await expect(page.locator('#sc-ship')).toHaveClass(/on/);

  // the wheel and the bell aren't ready yet
  await hs(page, 'wheel');
  await expect(page.locator('#d-txt')).toContainText('chart', { timeout: 5_000 });
  await skip(page);
  await hs(page, 'bell5');
  await expect(page.locator('#d-txt')).toContainText('Ding', { timeout: 5_000 });
  await skip(page);

  // 1. the net: only what floats
  await hs(page, 'net');
  const pick = async (...ks) => { for (const k of ks) await page.locator(`.ob[data-i="${k}"]`).click(); };
  await pick(0, 1);                      // cork and the gold coin
  await page.locator('#ob-go').click();
  await expect(page.locator('#ob-fb')).toContainText('sank to the bottom');
  await pick(1, 2, 6);                   // coin off; apple and wooden spoon on
  await page.locator('#ob-go').click();
  await expect(page.locator('#ob-fb')).toContainText('the bottle');
  await pick(4);
  await page.locator('#ob-go').click();
  await expect(page.locator('#ob-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#hp-floaters')).toBeHidden();

  // 2. the chart: E1, then north-east
  await useSlot(page, "Captain Efraim's chart");
  await hs(page, 'captain');
  await page.locator('#chart-svg .sq[data-sq="A5"]').dispatchEvent('click');
  await expect(page.locator('#ch5-fb')).toContainText('A5');
  await page.locator('#chart-svg .sq[data-sq="E1"]').dispatchEvent('click');
  await expect(page.locator('#ch5-fb')).toHaveClass(/good/);
  await page.locator('.dirb[data-d="SW"]').click();
  await expect(page.locator('#ch5-fb')).toContainText('wrong way');
  await page.locator('.dirb[data-d="NE"]').click();
  await expect(page.locator('#ch5-fb')).toHaveClass(/good/);
  await waitModalClosed(page);

  // 3. the compass: take away the magnet, the horseshoe and the tin, and nothing else
  await hs(page, 'binnacle');
  await page.locator('#bn-grid .ob[data-i="0"]').click();
  await page.locator('#bn-go').click();
  await expect(page.locator('#bn-fb')).toContainText('iron and steel');
  await page.locator('#bn-grid .ob[data-i="2"]').click();
  await page.locator('#bn-grid .ob[data-i="4"]').click();
  await page.locator('#bn-grid .ob[data-i="1"]').click();   // the banana: not needed
  await page.locator('#bn-go').click();
  await expect(page.locator('#bn-fb')).toContainText('for nothing');
  await page.locator('#bn-grid .ob[data-i="1"]').click();
  await page.locator('#bn-go').click();
  await expect(page.locator('#bn-fb')).toHaveClass(/good/);
  await waitModalClosed(page);

  // 4. the wheel: from south, round to south-west (home!) and on to north-east
  await hs(page, 'wheel');
  await page.locator('#wh-star').click();
  await page.locator('#wh-go').click();
  await expect(page.locator('#wh-fb')).toContainText('Villa Villekulla');
  for (let i = 0; i < 4; i++) await page.locator('#wh-star').click();
  await expect(page.locator('#wh-now')).toContainText('north-east');
  await page.locator('#wh-go').click();
  await expect(page.locator('#wh-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#sc-ship')).toHaveClass(/sailing/);

  // 5. the sun still, then water for the horse
  await hs(page, 'barrel');
  const opt = (q, o) => page.locator(`.so[data-q="${q}"][data-o="${o}"]`).click();
  await opt(0, 1); await opt(1, 0); await opt(2, 1); await opt(3, 1);
  await page.locator('#still-go').click();
  await expect(page.locator('#still-fb')).toContainText('shade');
  await opt(0, 0);
  await page.locator('#still-go').click();
  await expect(page.locator('#still-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await useSlot(page, 'A bucket of fresh water');
  await hs(page, 'horse5');
  await skip(page);
  await expect(page.locator('#hp-tongue')).toBeHidden();

  // 6. the log line: 6 knots, 18 sea miles → 3 hours
  await hs(page, 'log');
  await page.locator('#log-throw').click();
  await expect(page.locator('#log-q')).toBeVisible({ timeout: 6_000 });
  await page.locator('.hrs[data-h="12"]').click();
  await expect(page.locator('#log-fb')).toContainText('taking away');
  await page.locator('.hrs[data-h="3"]').click();
  await expect(page.locator('#log-fb')).toHaveClass(/good/);
  await waitModalClosed(page);

  // 7. the ship's bell: 6 rings for 3 o'clock (after waking the whole crew)
  await hs(page, 'bell5');
  for (let i = 0; i < 12; i++) await page.locator('#bell-ding').click();
  await page.locator('#bell-go').click();
  await expect(page.locator('#bell-fb')).toContainText('hammocks');
  await page.locator('#bell-clear').click();
  for (let i = 0; i < 6; i++) await page.locator('#bell-ding').click();
  await page.locator('#bell-go').click();
  await expect(page.locator('#bell-fb')).toHaveClass(/good/);
  await expectWin(page, 'Land ahoy · Chapter 5 complete');
  await expect(page.locator('#sc-ship')).toHaveClass(/landho/);
  await expect(page.locator('#hp-island')).toBeVisible();
  for (const a of ['Sailed for home by mistake', 'Woke the whole crew'])
    await expect(page.locator('#w-ach .got', { hasText: a })).toBeVisible();
});

test('finishing Chapter 4 leads to Chapter 5, also through the performers\' curtain', async ({ page }) => {
  await seed(page, { ch: 4, scene: 'circus', f: { out4: true } }, ['-ch2', '-ch3', '-ch4']);
  await expect(page.locator('#btn-cont')).toHaveText('Continue to Chapter 5');
  await page.locator('#btn-cont').click();
  await expect(page.locator('#chap')).toHaveText('Chapter 5 · On Board the Hoppetossa');
  await skip(page);
  await seed(page, { ch: 4, scene: 'circus', f: { out4: true, introDone: true } }, ['-ch2', '-ch3', '-ch4']);
  await expect(page.locator('#title')).not.toHaveClass(/loading/);
  await page.evaluate(() => { document.querySelector('#title').hidden = true; showWin(); });
  await expect(page.locator('#btn-next')).toHaveText('Continue to Chapter 5');
  await page.locator('#btn-stay').click();
  await skip(page);
  await expect(page.locator('#sc-circus [data-hs="curtain"]')).toHaveAttribute('data-label', "The performers' curtain: on to Chapter 5");
  await hs(page, 'curtain');
  await expect(page.locator('#chap')).toHaveText('Chapter 5 · On Board the Hoppetossa');
});
