const { test, expect } = require('@playwright/test');
const { seed, hs, skip, useSlot, waitModalClosed, expectWin } = require('./helpers');

test('Chapter 4: win the snowball fight against Kling and Klang', async ({ page }) => {
  await seed(page, null, ['-ch2', '-ch3', '-ch4']);
  await expect(page.locator('#btn-ch4')).toBeVisible();
  await page.locator('#btn-ch4').click();
  await expect(page.locator('#d-who')).toHaveText('Villa Villekulla · winter');
  await skip(page);
  await expect(page.locator('#chap')).toHaveText('Chapter 4 · Snowball Fight');
  await expect(page.locator('#sc-winter')).toHaveClass(/on/);
  expect(await page.evaluate(() => stage_())).toBe('w_tracks');

  // a snow angel, just for fun
  await hs(page, 'snow4');
  await skip(page);

  // no snowballs with bare hands
  await hs(page, 'thermo4');
  await page.locator('.wt-spot[data-k="sun"]').click();
  await expect(page.locator('#wt-hfb')).toContainText('Get your mittens back first');
  await page.locator('#m-close').click();

  // 1. the tracks: the monkey leaves handprints
  await hs(page, 'tracks4');
  await page.locator('.wt-trail[data-k="cat"]').click();
  await expect(page.locator('#wt-tfb')).toContainText('a cat');
  await page.locator('.wt-trail[data-k="monkey"]').click();
  await expect(page.locator('#wt-tfb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('.slot[title="Mittens"]')).toBeVisible();
  await expect(page.locator('#wt-nilsson')).toBeVisible();

  // 2. snow that sticks: just below freezing
  await useSlot(page, 'Mittens');
  await hs(page, 'thermo4');
  await page.locator('.wt-spot[data-k="north"]').click();
  await expect(page.locator('#wt-hfb')).toContainText('powdered sugar');
  await page.locator('.wt-spot[data-k="sun"]').click();
  await expect(page.locator('#wt-hfb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#wt-balls')).toBeVisible();

  // 3. the fort: joints must not line up
  await hs(page, 'fort4');
  await page.locator('#wt-push').click();
  await expect(page.locator('#wt-ffb')).toContainText('one straight line');
  await page.locator('.wt-shift[data-r="1"]').click();
  await page.locator('#wt-push').click();
  await expect(page.locator('#wt-ffb')).toContainText('still splits');
  await page.locator('.wt-shift[data-r="3"]').click();
  await page.locator('#wt-push').click();
  await expect(page.locator('#wt-ffb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#wt-fortwall')).toBeVisible();

  // 4. the icy steps: salt
  expect(await page.evaluate(() => stage_())).toBe('w_steps');
  await hs(page, 'steps4');
  await page.locator('.hand[data-i="water"]').click();
  await expect(page.locator('#wt-sfb')).toContainText('freezes again');
  await page.locator('.hand[data-i="salt"]').click();
  await expect(page.locator('#wt-sfb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#wt-ghorse')).toBeVisible();
  await expect(page.locator('#wt-ice')).toBeHidden();

  // 5. keeping Annika warm: layers, then mittens
  await hs(page, 'ta4');
  await page.locator('.hand[data-w="one"]').click();
  await expect(page.locator('#wt-wfb')).toContainText('only one layer');
  await page.locator('.hand[data-w="layers"]').click();
  await expect(page.locator('#wt-wfb')).toHaveClass(/good/);
  await page.locator('.hand[data-w="gloves"]').click();
  await expect(page.locator('#wt-wfb')).toHaveClass(/bad/);
  await page.locator('.hand[data-w="mittens"]').click();
  await expect(page.locator('#wt-wfb')).toHaveClass(/good/);
  await expect(page.locator('#modal')).toBeHidden({ timeout: 15_000 });
  // everything is ready: the church clock strikes three
  await expect(page.locator('#d-txt')).toContainText('warm as a pancake');
  await skip(page);
  expect(await page.evaluate(() => stage_())).toBe('w_throw');
  await expect(page.locator('#wt-min')).toHaveAttribute('transform', 'rotate(0 1020 292)');

  // the horse eats the snowman's nose
  for (let i = 0; i < 3; i++) { await hs(page, 'snowman4'); await skip(page); }
  await expect(page.locator('#wt-carrot')).toBeHidden();

  // 6. the throw: straight up lands on your own head; 45° goes furthest
  await hs(page, 'police4');
  await page.locator('.wt-ang[data-a="90"]').click();
  await page.locator('#wt-throw').click();
  await expect(page.locator('#wt-afb')).toContainText('On your own head');
  await page.locator('.wt-ang[data-a="30"]').click();
  await page.locator('#wt-throw').click();
  await expect(page.locator('#wt-afb')).toContainText('60°');
  await page.locator('.wt-ang[data-a="45"]').click();
  await page.locator('#wt-throw').click();
  await expect(page.locator('#wt-afb')).toHaveClass(/good/);
  await expectWin(page, 'Snowball fight · Chapter 4 complete');
  await expect(page.locator('#btn-next')).toHaveText('Continue to Chapter 5');
  await expect(page.locator('#wt-capfly')).toBeVisible();
  for (const a of ['Made a snow angel', "The snowman's nose", 'Snowball on your own head'])
    await expect(page.locator('#w-ach .got', { hasText: a })).toBeVisible();
});

test('every hotspot in the garden can be clicked: nothing lies on top of it', async ({ page }) => {
  await seed(page, { ch: 4, scene: 'winter', f: { introDone: true } }, ['-ch2', '-ch3', '-ch4']);
  await page.locator('#btn-cont').click();
  await skip(page);
  const covered = await page.evaluate(() => [...document.querySelectorAll('#sc-winter .hit')]
    .filter(h => getComputedStyle(h).display !== 'none')
    .filter(h => { const r = h.getBoundingClientRect(), top = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
      return !top || top.dataset.hs !== h.dataset.hs; })
    .map(h => h.dataset.hs));
  expect(covered).toEqual([]);
});

test('finishing Chapter 3 leads to Chapter 4', async ({ page }) => {
  await seed(page, { ch: 3, scene: 'school', f: { out3: true } }, ['-ch2', '-ch3']);
  await expect(page.locator('#btn-cont')).toHaveText('Continue to Chapter 4');
  await page.locator('#btn-cont').click();
  await expect(page.locator('#chap')).toHaveText('Chapter 4 · Snowball Fight');
  await skip(page);
  // the classroom door after "Look around"
  await seed(page, { ch: 3, scene: 'school', f: { out3: true, introDone: true } }, ['-ch2', '-ch3']);
  await expect(page.locator('#title')).not.toHaveClass(/loading/);
  await page.evaluate(() => { document.querySelector('#title').hidden = true; showWin(); });
  await expect(page.locator('#btn-next')).toHaveText('Continue to Chapter 4');
  await page.locator('#btn-stay').click();
  await skip(page);
  await expect(page.locator('#sc-school [data-hs="door3"]')).toHaveAttribute('data-label', 'Classroom door: on to Chapter 4');
  await hs(page, 'door3');
  await expect(page.locator('#chap')).toHaveText('Chapter 4 · Snowball Fight');
  await expect(page.locator('#btn-ch4')).toBeAttached();
});

test('a game saved before winter was added moves the circus and the ship up one chapter', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    const K = 'pippi-villa-v1';
    localStorage.clear();
    localStorage.setItem(K + '-norotate', '1');
    ['-ch2', '-ch3', '-ch4'].forEach(k => localStorage.setItem(K + k, '1'));
    localStorage.setItem(K + '-scores', JSON.stringify({ 3: { t: 100, h: 0 }, 4: { t: 200, h: 1 } }));
    localStorage.setItem(K, JSON.stringify({ v: 1, ch: 4, scene: 'circus', f: { introDone: true, inside: true, out4: true }, inv: [], hl: {}, hints: 0, t: 50, ach: {}, started: true }));
  });
  await page.reload();
  await expect(page.locator('#btn-cont')).toHaveText('Continue to Chapter 6');
  await expect(page.locator('#btn-ch4')).toBeVisible();
  await expect(page.locator('#btn-ch5')).toBeVisible();
  const after = await page.evaluate(() => ({ ch: S.ch, out5: S.f.out5, out4: S.f.out4, scores: JSON.parse(localStorage.getItem('pippi-villa-v1-scores')) }));
  expect(after.ch).toBe(5);
  expect(after.out5).toBe(true);
  expect(after.out4).toBeUndefined();
  expect(Object.keys(after.scores).sort()).toEqual(['3', '5']);
});
