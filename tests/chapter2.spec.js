const { test, expect } = require('@playwright/test');
const { seed, hs, skip, useSlot, closeModal, waitModalClosed, expectWin } = require('./helpers');

test('Chapter 2: catch the burglars', async ({ page }) => {
  await seed(page, null, ['-ch2']);
  await expect(page.locator('#btn-ch2')).toBeVisible();
  await page.locator('#btn-ch2').click();
  await expect(page.locator('#d-who')).toHaveText('Villa Villekulla · night');
  await skip(page);
  await expect(page.locator('#chap')).toHaveText('Chapter 2 · Burglars in the Night');
  await expect(page.locator('#sc-bedroom')).toHaveClass(/on/);

  // the torch: no batteries yet
  await hs(page, 'torch');
  await expect(page.locator('#d-txt')).toBeVisible();
  await skip(page);
  // batteries from the alarm clock, then the right way round
  await hs(page, 'clock2');
  await skip(page);
  await hs(page, 'torch');
  await page.locator('#tb-on').click();
  await expect(page.locator('#tb-fb')).toContainText('push against each other');
  await page.locator('.batt[data-b="0"]').click();
  await page.locator('#tb-on').click();
  await expect(page.locator('#tb-fb')).toHaveClass(/good/);
  await waitModalClosed(page);

  // shake Pippi three times (an achievement); she won't wake
  for (let i = 0; i < 3; i++) { await hs(page, 'pippi2'); await skip(page); }

  // the shadow: too small, then huge
  await useSlot(page, 'Torch');
  await hs(page, 'vdoor');
  await page.locator('#sh-go').click();
  await expect(page.locator('#sh-fb')).toContainText('little monkey');
  await page.locator('#sh-d').fill('20');
  await expect(page.locator('#sh-h')).toHaveText('6 m');
  await page.locator('#sh-go').click();
  await expect(page.locator('#sh-fb')).toHaveClass(/good/);
  await waitModalClosed(page);

  // the North Star (Venus first)
  await hs(page, 'card2');
  await expect(page.locator('.morse-tab')).toContainText('S ···');
  await closeModal(page);
  await useSlot(page, 'Torch');
  await hs(page, 'sky');
  await skip(page);
  await hs(page, 'sky');
  await page.locator('.star[data-k="venus"]').click();
  await expect(page.locator('#sky-fb')).toContainText('Venus');
  await page.locator('.star[data-k="polaris"]').click();
  await expect(page.locator('#sky-fb')).toHaveClass(/good/);
  await waitModalClosed(page);

  // Morse: SOS, then read Tommy's answer
  await useSlot(page, 'Torch');
  await hs(page, 'sky');
  const flash = async s => { for (const c of s) await page.locator(`[data-m="${c}"]`).click(); };
  await flash('---');
  await page.locator('#m-send').click();
  await expect(page.locator('#m-fb')).toHaveClass(/bad/);
  await page.locator('#m-clr').click();
  await flash('... --- ...');
  await page.locator('#m-send').click();
  await expect(page.locator('#m-reply')).toBeVisible();
  await expect(page.locator('.m-code')).toContainText('−');
  await page.locator('#m-ans').fill('tickles');
  await page.locator('#m-form button[type=submit]').click();
  await expect(page.locator('#m-fb')).toContainText('6 letters');
  await page.locator('#m-ans').fill('tickle');
  await page.locator('#m-form button[type=submit]').click();
  await expect(page.locator('#m-fb')).toHaveClass(/good/);
  await waitModalClosed(page);

  // tickling before the gold is safe
  await hs(page, 'hat');
  await skip(page);
  await useSlot(page, 'Feather');
  await hs(page, 'pippi2');
  await expect(page.locator('#d-txt')).toBeVisible();
  await skip(page);
  await useSlot(page, 'Feather');
  await hs(page, 'feet');
  await expect(page.locator('#d-txt')).toContainText('where the gold is');
  await skip(page);

  // the scale: 9 kg of stones
  await hs(page, 'scale');
  await page.locator('.stone', { hasText: '5 kg' }).click();
  await page.locator('.stone', { hasText: '6 kg' }).click();
  await page.locator('#sc-swap').click();
  await expect(page.locator('#sc-fb')).toContainText('Take 2 kg off');
  await page.locator('.stone', { hasText: '5 kg' }).click();
  await page.locator('.stone', { hasText: '3 kg' }).click();
  await page.locator('#sc-swap').click();
  await expect(page.locator('#sc-fb')).toHaveClass(/good/);
  await waitModalClosed(page);

  // wake Pippi
  await useSlot(page, 'Feather');
  await hs(page, 'feet');
  await expectWin(page, 'Burglars caught · Chapter 2 complete');
  await expect(page.locator('#btn-next')).toBeHidden();
  for (const a of ['Shook Pippi three times', 'A shadow over 5 metres tall', 'Wished upon a planet'])
    await expect(page.locator('#w-ach .got', { hasText: a })).toBeVisible();
  await page.locator('#btn-stay').click();
  await skip(page);
  await expect(page.locator('#br-ontop')).toBeVisible();
});

test('finishing Chapter 1 leads to Chapter 2', async ({ page }) => {
  await seed(page, { f: { out1: true }, t: 100 });
  await page.locator('#btn-cont').click();
  await expect(page.locator('#chap')).toHaveText('Chapter 2 · Burglars in the Night');
  await skip(page);
  // and from the end screen, the next button and the front door both work
  await seed(page, { f: { out1: true, key: true, unlocked: true, chest: true, pancake: true, fire: true, matches: true, noteRead: true } });
  await expect(page.locator('#title')).not.toHaveClass(/loading/);
  await page.evaluate(() => { document.querySelector('#title').hidden = true; showWin(); });
  await expect(page.locator('#btn-next')).toHaveText('Continue to Chapter 2');
  await page.locator('#btn-stay').click();
  await skip(page);
  await expect(page.locator('#sc-kitchen [data-hs="door"]')).toHaveAttribute('data-label', 'Front door: on to Chapter 2');
  await hs(page, 'door');
  await expect(page.locator('#chap')).toHaveText('Chapter 2 · Burglars in the Night');
  await expect(page.locator('#btn-ch2')).toBeAttached();
});
