const { test, expect } = require('@playwright/test');
const { seed, hs, skip, useSlot, waitModalClosed, expectWin } = require('./helpers');

const ALL = ['-ch2', '-ch3', '-ch4', '-ch5', '-ch6', '-ch7', '-ch8', '-ch9', '-ch10'];

test('Chapter 10: home again to Villa Villekulla', async ({ page }) => {
  await seed(page, null, ALL);
  await expect(page.locator('#btn-ch10')).toBeVisible();
  await page.locator('#btn-ch10').click();
  await expect(page.locator('#d-who')).toHaveText('Villa Villekulla · spring');
  await skip(page);
  await expect(page.locator('#chap')).toHaveText('Chapter 10 · Home Again');
  await expect(page.locator('#sc-home')).toHaveClass(/on/);

  // the chest can't move yet, and the door is locked
  await hs(page, 'chest10');
  await expect(page.locator('#d-txt')).toContainText('sea chest', { timeout: 5_000 });
  await skip(page);
  await hs(page, 'door10');
  await expect(page.locator('#d-txt')).toContainText('locked', { timeout: 5_000 });
  await skip(page);

  // 1. the tree rings: 18 counts light and dark, 9 is right; the newest ring is the outside one
  await hs(page, 'branch10');
  for (let i = 0; i < 17; i++) await page.locator('#rg10-plus').click();
  await page.locator('#rg10-go').click();
  await expect(page.locator('#rings10-fb')).toContainText('light rings and the dark lines');
  for (let i = 0; i < 9; i++) await page.locator('#rg10-minus').click();
  await page.locator('#rg10-go').click();
  await expect(page.locator('#rings10-fb')).toHaveClass(/good/);
  await page.locator('#rings10-svg .rg10[data-i="0"]').dispatchEvent('click');
  await expect(page.locator('#rings10-fb')).toContainText('very first ring');
  await page.locator('#rings10-svg .rg10[data-i="8"]').dispatchEvent('click');
  await expect(page.locator('#rings10-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#vh-logs')).toBeVisible();

  // 2. the sea chest: dragging is too hard; logs, because rolling hardly rubs
  await hs(page, 'chest10');
  await page.locator('.ro10[data-i="1"]').click();
  await expect(page.locator('#roll10-fb')).toContainText('50 kilos');
  await page.locator('.ro10[data-i="3"]').click();
  await page.locator('.rq10[data-i="1"]').click();
  await expect(page.locator('#roll10-fb')).toContainText('still weighs 80 kilos');
  await page.locator('.rq10[data-i="0"]').click();
  await expect(page.locator('#roll10-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#vh-chest2')).toBeVisible();

  // open the chest: the captain's magnet
  await hs(page, 'chest10');
  await skip(page);
  await expect(page.locator('.slot[title="A horseshoe magnet"]')).toBeVisible();

  // 3. the rain barrel: gold isn't magnetic; iron and steel are
  await useSlot(page, 'A horseshoe magnet');
  await hs(page, 'barrel10');
  const mag = i => page.locator(`.mg10[data-i="${i}"]`).click();
  await mag(0); await mag(1); await mag(2);   // key, gold coin, nail
  await page.locator('#mg10-go').click();
  await expect(page.locator('#mg10-fb')).toContainText("Gold isn't magnetic");
  await mag(1);                               // not the coin
  await page.locator('#mg10-go').click();
  await expect(page.locator('#mg10-fb')).toContainText("missed something");
  await mag(4);                               // the bottle top
  await page.locator('#mg10-go').click();
  await expect(page.locator('#mg10-fb')).toHaveClass(/good/);
  await waitModalClosed(page);

  // the key opens the front door
  await useSlot(page, 'Front-door key');
  await hs(page, 'door10');
  await skip(page);
  await expect(page.locator('#vh-dooropen')).toBeVisible();

  // 4. the larder: what's still good after five months?
  await hs(page, 'table10');
  const food = i => page.locator(`.ld10[data-i="${i}"]`).click();
  await food(0); await food(2); await food(4); await food(6); await food(7);   // the good four, and the old pancake
  await page.locator('#ld10-go').click();
  await expect(page.locator('#ld10-fb')).toContainText('green fur coat');
  await food(7);
  await page.locator('#ld10-go').click();
  await expect(page.locator('#ld10-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#sc-home')).toHaveClass(/vh-shower/);

  // 5. the rainbow: opposite the sun
  await hs(page, 'sky10');
  await page.locator('.rb10[data-i="3"]').click();
  await expect(page.locator('#rbw10-fb')).toContainText('straight into the sun');
  await page.locator('.rb10[data-i="1"]').click();
  await expect(page.locator('#rbw10-fb')).toContainText('East');
  await page.locator('.rb10[data-i="2"]').click();
  await expect(page.locator('#rbw10-fb')).toContainText('Egypt');
  await page.locator('.rb10[data-i="0"]').click();
  await expect(page.locator('#rbw10-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#vh-rainbow')).toBeVisible();
  await expect(page.locator('#sc-home')).not.toHaveClass(/vh-shower/);

  // 6. the hedgehog: hibernation, and never milk
  await hs(page, 'straw10');
  await page.locator('.hg10[data-i="1"]').click();
  await expect(page.locator('#hog10-fb')).toContainText('South Seas');
  await page.locator('.hg10[data-i="0"]').click();
  await expect(page.locator('#hog10-fb')).toContainText('Hibernating');
  await page.locator('.hg10[data-i="0"]').click();
  await expect(page.locator('#hog10-fb')).toContainText('No milk');
  await page.locator('.hg10[data-i="2"]').click();
  await expect(page.locator('#hog10-fb')).toHaveClass(/good/);
  await expectWin(page, 'Home sweet home · Chapter 10 complete');
  await expect(page.locator('#sc-home')).toHaveClass(/vh-party/);
  await expect(page.locator('#btn-next')).toBeHidden();
  await expect(page.locator('#w-ach .got', { hasText: 'A very furry pancake' })).toBeVisible();
});

test('the post box and the rainbow have their achievements', async ({ page }) => {
  await seed(page, { ch: 10, scene: 'home', f: { introDone: true, rings: true, rolled: true, key: true, door: true, larder: true, rainbow: true } }, ALL);
  await page.locator('#btn-cont').click();
  await skip(page);
  for (let i = 0; i < 3; i++) { await hs(page, 'post10'); await skip(page); }
  await hs(page, 'sky10'); await skip(page);
  const ach = await page.evaluate(() => S.ach);
  expect(ach.postbox && ach.potofgold).toBe(true);
});

test('finishing Chapter 9 leads to Chapter 10, also by stepping onto the quay', async ({ page }) => {
  const UNL = ['-ch2', '-ch3', '-ch4', '-ch5', '-ch6', '-ch7', '-ch8', '-ch9'];
  await seed(page, { ch: 9, scene: 'voyage', f: { out9: true } }, UNL);
  await expect(page.locator('#btn-cont')).toHaveText('Continue to Chapter 10');
  await page.locator('#btn-cont').click();
  await expect(page.locator('#chap')).toHaveText('Chapter 10 · Home Again');
  await skip(page);
  await seed(page, { ch: 9, scene: 'voyage', f: { out9: true, introDone: true } }, UNL);
  await expect(page.locator('#title')).not.toHaveClass(/loading/);
  await page.evaluate(() => { document.querySelector('#title').hidden = true; S.started = true; applyVisuals(); showWin(); });
  await expect(page.locator('#btn-next')).toHaveText('Continue to Chapter 10');
  await page.locator('#btn-stay').click();
  await skip(page);
  await expect(page.locator('#sc-voyage [data-hs="quay9"]')).toHaveAttribute('data-label', 'The quay: on to Chapter 10');
  await hs(page, 'quay9');
  await expect(page.locator('#chap')).toHaveText('Chapter 10 · Home Again');
  await expect(page.locator('#btn-ch10')).toBeAttached();
});

test('an old save at home (Chapter 9 before the voyage) moves to Chapter 10', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    const K = 'pippi-villa-v1';
    localStorage.clear();
    localStorage.setItem(K + '-norotate', '1');
    localStorage.setItem(K + '-ord', '3');
    ['-ch2', '-ch3', '-ch4', '-ch5', '-ch6', '-ch7', '-ch8', '-ch9'].forEach(k => localStorage.setItem(K + k, '1'));
    localStorage.setItem(K + '-scores', JSON.stringify({ 8: { t: 100, hints: 0 }, 9: { t: 200, hints: 1 } }));
    localStorage.setItem(K, JSON.stringify({ v: 1, ch: 9, scene: 'home', f: { introDone: true, rings: true, out9: true }, inv: [], hl: {}, hints: 0, t: 50, ach: {}, started: true }));
  });
  await page.reload();
  await expect(page.locator('#title')).not.toHaveClass(/loading/);
  const after = await page.evaluate(() => ({ ch: S.ch, out10: S.f.out10, out9: S.f.out9, ch9: localStorage.getItem('pippi-villa-v1-ch9'), ch10: localStorage.getItem('pippi-villa-v1-ch10'), scores: Object.keys(JSON.parse(localStorage.getItem('pippi-villa-v1-scores'))).sort() }));
  expect(after).toEqual({ ch: 10, out10: true, out9: undefined, ch9: '1', ch10: '1', scores: ['10', '8'] });
  await expect(page.locator('#btn-ch9')).toBeVisible();
  await expect(page.locator('#btn-ch10')).toBeVisible();
});
