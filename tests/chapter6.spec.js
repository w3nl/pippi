const { test, expect } = require('@playwright/test');
const { seed, hs, skip, useSlot, closeModal, waitModalClosed, expectWin } = require('./helpers');

test('Chapter 6: sail the Hoppetossa to the island', async ({ page }) => {
  await seed(page, null, ['-ch2', '-ch3', '-ch4', '-ch5', '-ch6']);
  await expect(page.locator('#btn-ch6')).toBeVisible();
  await page.locator('#btn-ch6').click();
  await expect(page.locator('#d-who')).toHaveText('The Hoppetossa');
  await skip(page);
  await expect(page.locator('#chap')).toHaveText('Chapter 6 · On Board the Hoppetossa');
  await expect(page.locator('#sc-ship')).toHaveClass(/on/);
  await expect(page.locator('#hp-snow')).toBeVisible();
  await expect(page.locator('#hp-sun')).toBeHidden();
  await expect(page.locator('#hp-harbour')).toBeVisible();

  // not without the horse
  await hs(page, 'wheel');
  await expect(page.locator('#d-txt')).toContainText('without the horse');
  await skip(page);

  // 1. the hoist: one rope is far too heavy, four is right
  await hs(page, 'hoist');
  await page.locator('#hp-heave').click();
  await expect(page.locator('#hp-hfb')).toContainText('all 400 kg');
  await page.locator('.hp-ropes[data-n="4"]').click();
  await expect(page.locator('#hp-tackle')).toContainText('100 kg');
  await page.locator('#hp-heave').click();
  await expect(page.locator('#hp-hfb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#hp-dhorse')).toBeVisible();
  // an achievement: the spyglass on the horse
  await hs(page, 'glass6');
  await skip(page);
  await useSlot(page, 'Spyglass');
  await hs(page, 'horse6');
  await skip(page);

  // 2. the chart and the wheel: south-west
  await hs(page, 'chart6');
  await expect(page.locator('.hp-chart')).toContainText('Equator 0°');
  await closeModal(page);
  await hs(page, 'wheel');
  for (let i = 0; i < 4; i++) await page.locator('#hp-star').click();
  await page.locator('#hp-setsail').click();
  await expect(page.locator('#hp-wfb')).toContainText('Due south');
  await page.locator('#hp-star').click();
  await expect(page.locator('#hp-heading')).toContainText('south-west');
  await page.locator('#hp-setsail').click();
  await expect(page.locator('#hp-wfb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#sc-ship')).toHaveClass(/sailing/);
  await expect(page.locator('#hp-harbour')).toBeHidden({ timeout: 6_000 });
  await expect(page.locator('#hp-snow')).toBeHidden();
  await expect(page.locator('#hp-sun')).toBeVisible();
  await expect(page.locator('#hp-sails')).toBeVisible();

  // 3. overboard! fetch the net first; the big log floats, the little key sinks
  await hs(page, 'sea6');
  await expect(page.locator('#d-txt')).toContainText('thrown the captain');
  await skip(page);
  await hs(page, 'net6');
  await skip(page);
  await useSlot(page, 'Fishing net');
  await hs(page, 'sea6');
  for (const k of ['log', 'key', 'apple', 'coin', 'cork', 'marble']) await page.locator(`.hp-fl[data-k="${k}"]`).click();
  await page.locator('#hp-fcheck').click();
  await expect(page.locator('#hp-ffb')).toContainText('Small things can sink');
  for (const k of ['key', 'coin', 'marble']) await page.locator(`.hp-fl[data-k="${k}"]`).click();
  await page.locator('#hp-fcheck').click();
  await expect(page.locator('#hp-ffb')).toHaveClass(/good/);
  await waitModalClosed(page);

  // 4. fresh water from the sea (and a taste of sea water first)
  await hs(page, 'barrel');
  await page.locator('#hp-drink').click();
  await expect(page.locator('#hp-sfb')).toContainText('Never drink sea water');
  for (const k of ['bowl', 'cup', 'lid', 'sun']) await page.locator(`.hp-part[data-k="${k}"]`).click();
  await page.locator('#hp-wait').click();
  await expect(page.locator('#hp-sfb')).toContainText('run down the sides');
  await page.locator('.hp-part[data-k="pebble"]').click();
  await page.locator('#hp-wait').click();
  await expect(page.locator('#hp-sfb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#sc-ship')).toHaveClass(/night/);

  // 5. the Equator, by the North Star
  await hs(page, 'sky6');
  await expect(page.locator('#d-txt')).toContainText('North Star hangs very low');
  await skip(page);
  await hs(page, 'log6');
  await expect(page.locator('.hp-log')).toContainText('59°');
  await closeModal(page);
  await hs(page, 'case6');
  await skip(page);
  await useSlot(page, 'Sextant');
  await hs(page, 'sky6');
  await page.locator('.hand[data-q="pole"]').click();
  await expect(page.locator('#hp-qfb')).toContainText('90°');
  await page.locator('.hand[data-q="eq"]').click();
  await expect(page.locator('#hp-qfb')).toHaveClass(/good/);
  await page.locator('.hand[data-q="below"]').click();
  await expect(page.locator('#hp-qfb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#hp-zero')).toBeVisible();
  await expect(page.locator('#hp-isletip')).toBeVisible();
  // King Neptune
  await hs(page, 'pippi6');
  await skip(page);

  // 6. land ho, from the crow's nest
  await hs(page, 'crow');
  await page.locator('.hp-from[data-f="nest"]').click();
  await page.locator('.hand[data-l="near"]').click();
  await expect(page.locator('#hp-lfb')).toHaveClass(/bad/);
  await page.locator('.hand[data-l="round"]').click();
  await expect(page.locator('#hp-lfb')).toHaveClass(/good/);
  await expectWin(page, 'Land ho · Chapter 6 complete');
  await expect(page.locator('#hp-isle')).toBeVisible();
  await expect(page.locator('#btn-next')).toHaveText('Continue to Chapter 7');
  for (const a of ['Tasted the sea', 'A horse, very close up', 'Met King Neptune'])
    await expect(page.locator('#w-ach .got', { hasText: a })).toBeVisible();
});

test('the hints follow the voyage, and the close-ups stay as you left them', async ({ page }) => {
  await seed(page, { ch: 6, scene: 'ship', f: { introDone: true } }, ['-ch2', '-ch3', '-ch4', '-ch5', '-ch6']);
  await page.locator('#btn-cont').click();
  await expect(page.locator('#d-txt')).toContainText('Back at the harbour', { timeout: 5_000 });
  await skip(page);
  await page.locator('#btn-hint').click();
  await expect(page.locator('#d-txt')).toContainText('cargo hoist', { timeout: 5_000 });
  await skip(page);
  await hs(page, 'hoist');
  await page.locator('.hp-ropes[data-n="3"]').click();
  await page.reload();
  await page.locator('#btn-cont').click();
  await skip(page);
  await hs(page, 'hoist');
  await expect(page.locator('.hp-ropes[data-n="3"]')).toHaveClass(/on/);
});

test('finishing Chapter 5 leads to Chapter 6', async ({ page }) => {
  await seed(page, { ch: 5, scene: 'circus', f: { out5: true }, t: 100 }, ['-ch2', '-ch3', '-ch4', '-ch5']);
  await expect(page.locator('#btn-cont')).toHaveText('Continue to Chapter 6');
  await page.locator('#btn-cont').click();
  await expect(page.locator('#chap')).toHaveText('Chapter 6 · On Board the Hoppetossa');
  await skip(page);
  // the curtain after "Look around"
  await seed(page, { ch: 5, scene: 'circus', f: { out5: true, introDone: true, inside: true } }, ['-ch2', '-ch3', '-ch4', '-ch5']);
  await expect(page.locator('#title')).not.toHaveClass(/loading/);
  await page.evaluate(() => { document.querySelector('#title').hidden = true; S.started = true; applyVisuals(); showWin(); });
  await expect(page.locator('#btn-next')).toHaveText('Continue to Chapter 6');
  await page.locator('#btn-stay').click();
  await skip(page);
  await expect(page.locator('#sc-circus [data-hs="curtain"]')).toHaveAttribute('data-label', 'Curtain: on to Chapter 6');
  await hs(page, 'curtain');
  await expect(page.locator('#chap')).toHaveText('Chapter 6 · On Board the Hoppetossa');
});
