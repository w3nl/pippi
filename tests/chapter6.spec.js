const { test, expect } = require('@playwright/test');
const { seed, hs, skip, useSlot, waitModalClosed, expectWin } = require('./helpers');

const UNL = ['-ch2', '-ch3', '-ch4', '-ch5', '-ch6'];

test("Chapter 6: Pippi's balloon ride, from the garden to the church tower", async ({ page }) => {
  await seed(page, null, UNL);
  await expect(page.locator('#btn-ch6')).toBeVisible();
  await page.locator('#btn-ch6').click();
  await expect(page.locator('#d-who')).toHaveText('In the balloon');
  await skip(page);
  await expect(page.locator('#chap')).toHaveText("Chapter 6 · Pippi's Balloon Ride");
  await expect(page.locator('#sc-balloon')).toHaveClass(/bl-ground/);

  // 1. lift-off: pumping in cold air doesn't help; hot air rises
  await hs(page, 'balloon6');
  await page.locator('.lf6[data-i="0"]').click();
  await expect(page.locator('#lift6-fb')).toContainText('sleepy elephant');
  await page.locator('.lf6[data-i="1"]').click();
  await expect(page.locator('#lift6-fb')).toHaveClass(/good/);
  await page.locator('.lf6[data-i="0"]').click();
  await expect(page.locator('#lift6-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#sc-balloon')).toHaveClass(/bl-town/);
  await expect(page.locator('#bl-balloon')).toBeVisible();

  // 2. steering: low and high blow the wrong way; the middle, at kite height, goes to the farms
  await hs(page, 'burner6');
  await page.locator('.wh6[data-i="2"]').click();
  await expect(page.locator('#winds6-fb')).toContainText('chimney smoke');
  await page.locator('.wh6[data-i="1"]').click();
  await page.locator('.wq6[data-i="1"]').click();
  await expect(page.locator('#winds6-fb')).toContainText('no steering wheel');
  await page.locator('.wq6[data-i="0"]').click();
  await expect(page.locator('#winds6-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#sc-balloon')).toHaveClass(/bl-farms/);

  // the little Saab on the country road
  await hs(page, 'saab6');
  await skip(page);

  // 3. the map: a haystack from above is a circle; the farm with the L-shaped barn, round pond, three haystacks
  await hs(page, 'farms6');
  await page.locator('.shp6[data-i="1"]').click();
  await expect(page.locator('#map6-fb')).toContainText('from the side');
  await page.locator('.shp6[data-i="0"]').click();
  await page.locator('.map6-svg .fm6[data-i="1"]').dispatchEvent('click');
  await expect(page.locator('#map6-fb')).toContainText('square');
  await page.locator('.map6-svg .fm6[data-i="2"]').dispatchEvent('click');
  await expect(page.locator('#map6-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('.slot[title="Annika\'s note"]')).toBeVisible();

  // 4. the parachute: never drop a sandbag; the handkerchief floats down slowly
  await useSlot(page, "Annika's note");
  await hs(page, 'police6');
  await page.locator('.ch6b[data-i="1"]').click();
  await expect(page.locator('#chute6-fb')).toContainText('Never drop heavy things');
  await page.locator('.ch6b[data-i="2"]').click();
  await page.locator('.ch6b[data-i="0"]').click();
  await expect(page.locator('#chute6-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('.slot[title="The golden weathercock"]')).toBeVisible();
  await expect(page.locator('#sc-balloon')).toHaveClass(/bl-cloud/);

  // 5. the cloud: tiny drops of water; colder higher up (and Annika's jam jar)
  await hs(page, 'kids6');
  await skip(page);
  await hs(page, 'cloud6');
  await page.locator('.cl6[data-i="1"]').click();
  await expect(page.locator('#cloud6-fb')).toContainText('No cotton wool');
  await page.locator('.cl6[data-i="0"]').click();
  await page.locator('.cl6[data-i="2"]').click();
  await expect(page.locator('#cloud6-fb')).toContainText('closer to it');
  await page.locator('.cl6[data-i="0"]').click();
  await expect(page.locator('#cloud6-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#sc-balloon')).toHaveClass(/bl-church/);

  // 6. the weathercock: beak into the wind (west), and it's a west wind
  await useSlot(page, 'The golden weathercock');
  await hs(page, 'tower6');
  await page.locator('#vn6-r').click(); await page.locator('#vn6-r').click();   // east
  await page.locator('#vn6-go').click();
  await expect(page.locator('#vane6-fb')).toContainText('INTO the wind');
  for (let i = 0; i < 4; i++) await page.locator('#vn6-r').click();   // west
  await page.locator('#vn6-go').click();
  await expect(page.locator('#vane6-fb')).toHaveClass(/good/);
  await page.locator('.vq6[data-i="1"]').click();
  await expect(page.locator('#vane6-fb')).toContainText('comes FROM');
  await page.locator('.vq6[data-i="0"]').click();
  await expect(page.locator('#vane6-fb')).toHaveClass(/good/);
  await expectWin(page, 'Weathercock home · Chapter 6 complete');
  await expect(page.locator('#bl-cock')).toBeVisible();
  await expect(page.locator('#btn-next')).toHaveText('Continue to Chapter 7');
  for (const a of ['Tried to bottle a cloud', 'Spotted the little Saab'])
    await expect(page.locator('#w-ach .got', { hasText: a })).toBeVisible();
});

test('Pippi hangs upside down, and the Saab is hidden in other rooms too', async ({ page }) => {
  await seed(page, { ch: 6, scene: 'balloon', f: { introDone: true, up: true } }, UNL);
  await page.locator('#btn-cont').click();
  await skip(page);
  for (let i = 0; i < 3; i++) { await hs(page, 'pippi6'); await skip(page); }
  expect(await page.evaluate(() => S.ach.upside)).toBe(true);
  for (const [ch, scene, id] of [[1, 'kitchen', 'saab1'], [4, 'winter', 'saab4'], [10, 'home', 'saab10']]) {
    await seed(page, { ch, scene, f: { introDone: true } }, ['-ch2', '-ch3', '-ch4', '-ch5', '-ch6', '-ch7', '-ch8', '-ch9', '-ch10']);
    await page.locator('#btn-cont').click();
    await skip(page);
    await hs(page, id);
    await expect(page.locator('#d-txt')).toContainText('Saab 96', { timeout: 5_000 });
    await skip(page);
    expect(await page.evaluate(() => S.ach.saab)).toBe(true);
  }
});

test('finishing Chapter 5 leads to Chapter 6, also through the curtain', async ({ page }) => {
  await seed(page, { ch: 5, scene: 'circus', f: { out5: true }, t: 100 }, ['-ch2', '-ch3', '-ch4', '-ch5']);
  await expect(page.locator('#btn-cont')).toHaveText('Continue to Chapter 6');
  await page.locator('#btn-cont').click();
  await expect(page.locator('#chap')).toHaveText("Chapter 6 · Pippi's Balloon Ride");
  await skip(page);
  await seed(page, { ch: 5, scene: 'circus', f: { out5: true, introDone: true, inside: true } }, ['-ch2', '-ch3', '-ch4', '-ch5']);
  await expect(page.locator('#title')).not.toHaveClass(/loading/);
  await page.evaluate(() => { document.querySelector('#title').hidden = true; S.started = true; applyVisuals(); showWin(); });
  await expect(page.locator('#btn-next')).toHaveText('Continue to Chapter 6');
  await page.locator('#btn-stay').click();
  await skip(page);
  await expect(page.locator('#sc-circus [data-hs="curtain"]')).toHaveAttribute('data-label', 'Curtain: on to Chapter 6');
  await hs(page, 'curtain');
  await expect(page.locator('#chap')).toHaveText("Chapter 6 · Pippi's Balloon Ride");
});

test('an old save of the Hoppetossa (Chapter 6 before the balloon) moves to Chapter 7', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => {
    const K = 'pippi-villa-v1';
    localStorage.clear();
    localStorage.setItem(K + '-norotate', '1');
    localStorage.setItem(K + '-ord', '2');
    ['-ch2', '-ch3', '-ch4', '-ch5', '-ch6'].forEach(k => localStorage.setItem(K + k, '1'));
    localStorage.setItem(K + '-scores', JSON.stringify({ 5: { t: 100, hints: 0 }, 6: { t: 200, hints: 1 } }));
    localStorage.setItem(K, JSON.stringify({ v: 1, ch: 6, scene: 'ship', f: { introDone: true, aboard: true, out6: true }, inv: [], hl: {}, hints: 0, t: 50, ach: {}, started: true }));
  });
  await page.reload();
  await expect(page.locator('#btn-cont')).toHaveText('Continue to Chapter 8');
  const after = await page.evaluate(() => ({ ch: S.ch, out7: S.f.out7, out6: S.f.out6, ch7: localStorage.getItem('pippi-villa-v1-ch7'), scores: Object.keys(JSON.parse(localStorage.getItem('pippi-villa-v1-scores'))).sort() }));
  expect(after).toEqual({ ch: 7, out7: true, out6: undefined, ch7: '1', scores: ['5', '7'] });
  await expect(page.locator('#btn-ch6')).toBeVisible();
});
