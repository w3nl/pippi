const { test, expect } = require('@playwright/test');
const { seed, skip } = require('./helpers');

const noSideScroll = page => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

test('portrait: rotate banner, swipeable room, tappable hotspots', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#rotate')).toBeVisible();
  await expect(page.locator('#rot-line')).not.toBeEmpty();
  expect(await noSideScroll(page)).toBe(true);
  await page.locator('#btn-new').tap();
  await skip(page);
  await expect(page.locator('.swipe')).toBeVisible();
  await page.locator('#pan').evaluate(e => e.scrollLeft = 120);
  const box = await page.locator('#sc-kitchen [data-hs="mirror"]').boundingBox();
  expect(box.width).toBeGreaterThan(20);
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
  await expect(page.locator('#d-txt')).toContainText('You look in the mirror', { timeout: 5_000 });
  await expect(page.locator('#d-more')).toContainText('tap');
  await page.locator('#rot-x').tap();
  await expect(page.locator('#rotate')).toBeHidden();
});

test('landscape: the whole room and the title screen fit', async ({ page }) => {
  await page.setViewportSize({ width: 915, height: 412 });
  await seed(page, { f: { introDone: true } });
  const fits = await page.locator('#title').evaluate(e => e.scrollHeight <= e.clientHeight + 1);
  expect(fits).toBe(true);
  await expect(page.locator('#rotate')).toBeHidden();
  expect(await noSideScroll(page)).toBe(true);
});

test('every close-up fits on a phone without sideways scrolling', async ({ page }) => {
  const spots = ['note', 'homework', 'bureau', 'pantry', 'sign', 'stove', 'flags', 'chart', 'chest'];
  await seed(page);
  await expect(page.locator('#title')).not.toHaveClass(/loading/);
  await page.evaluate(() => recordScore(1, 754, 2));
  await page.locator('#btn-scores').tap();
  expect(await page.locator('.panel').evaluate(e => e.scrollWidth <= e.clientWidth + 1), 'scores are wider than the screen').toBe(true);
  await page.locator('#m-close').tap();
  for (const fire of [false, true]) {
    await seed(page, { f: { introDone: true, fire }, inv: fire ? ['eggs', 'sugar'] : [] });
    await page.locator('#btn-cont').tap();
    await skip(page);
    const all = fire ? ['stove'] : spots;
    for (const id of all) {
      await page.evaluate(id => document.querySelector(`#sc-kitchen [data-hs="${id}"]`).dispatchEvent(new MouseEvent('click', { bubbles: true })), id);
      await page.waitForTimeout(150);
      if (await page.locator('#modal').isVisible()) {
        const ok = await page.locator('.panel').evaluate(e => e.scrollWidth <= e.clientWidth + 1);
        expect(ok, `${id} is wider than the screen`).toBe(true);
        await page.locator('#m-close').tap();
      } else await skip(page);
      expect(await noSideScroll(page), `${id} made the page scroll sideways`).toBe(true);
    }
    if (fire) {
      await page.evaluate(() => { S.f.unlocked = true; openHorse(); });
      expect(await page.locator('.panel').evaluate(e => e.scrollWidth <= e.clientWidth + 1), 'the horse is wider than the screen').toBe(true);
      await page.locator('#m-close').tap();
    }
  }
  // Chapter 2: the bedroom's close-ups
  await seed(page, { ch: 2, scene: 'bedroom', f: { introDone: true, torchOn: true, north: true }, inv: ['torch', 'batteries'] }, ['-ch2']);
  await page.locator('#btn-cont').tap();
  await skip(page);
  for (const open of ['openTorch2()', 'openShadow()', 'openSpyCard()', 'openSky()', 'openMorse()', 'S.f.sos = true; openMorse()', 'openScale()']) {
    await page.evaluate(open);
    await page.waitForTimeout(150);
    const ok = await page.locator('.panel').evaluate(e => e.scrollWidth <= e.clientWidth + 1);
    expect(ok, `${open} is wider than the screen`).toBe(true);
    await page.locator('#m-close').tap();
    expect(await noSideScroll(page), `${open} made the page scroll sideways`).toBe(true);
  }
  // Chapter 6: the Hoppetossa's close-ups
  await seed(page, { ch: 6, scene: 'ship', f: { introDone: true, aboard: true, course: true }, inv: ['net', 'sextant', 'spyglass'] }, ['-ch2', '-ch3', '-ch4', '-ch5', '-ch6']);
  await page.locator('#btn-cont').tap();
  await skip(page);
  for (const open of ['openHoist()', 'S.pul = { n: 3 }; openHoist()', 'openWheel()', 'openChart6()', 'openFloat()', 'openStill()', 'openLog6()', 'openSextant6()', 'S.eqr = 1; openSextant6()', 'openLandHo()']) {
    await page.evaluate(open);
    await page.waitForTimeout(150);
    const ok = await page.locator('.panel').evaluate(e => e.scrollWidth <= e.clientWidth + 1);
    expect(ok, `${open} is wider than the screen`).toBe(true);
    await page.locator('#m-close').tap();
    expect(await noSideScroll(page), `${open} made the page scroll sideways`).toBe(true);
  }
  // Chapter 7: the island's close-ups
  await seed(page, { ch: 7, scene: 'island', f: { introDone: true } }, ['-ch2', '-ch3', '-ch4', '-ch5', '-ch6', '-ch7']);
  await page.locator('#btn-cont').tap();
  await skip(page);
  for (const open of ['openSundial7()', 'S.sdl = { r: 1, pick: 9 }; openSundial7()', 'openTide7()', 'openPaces7()', 'openChest7()', 'openThunder7()', 'S.thn = { r: 1, seen: true }; openThunder7()', 'openTurtles7()']) {
    await page.evaluate(open);
    await page.waitForTimeout(150);
    const ok = await page.locator('.panel').evaluate(e => e.scrollWidth <= e.clientWidth + 1);
    expect(ok, `${open} is wider than the screen`).toBe(true);
    await page.locator('#m-close').tap();
    expect(await noSideScroll(page), `${open} made the page scroll sideways`).toBe(true);
  }
  // Chapter 4: the snowy garden's close-ups
  await seed(page, { ch: 4, scene: 'winter', f: { introDone: true } }, ['-ch2', '-ch3', '-ch4']);
  await page.locator('#btn-cont').tap();
  await skip(page);
  for (const open of ['openTracks4()', 'openThermo4()', 'openFort4()', 'openSteps4()', 'openWarm4()', 'S.wrm = 1; openWarm4()', 'openThrow4()']) {
    await page.evaluate(open);
    await page.waitForTimeout(150);
    const ok = await page.locator('.panel').evaluate(e => e.scrollWidth <= e.clientWidth + 1);
    expect(ok, `${open} is wider than the screen`).toBe(true);
    await page.locator('#m-close').tap();
    expect(await noSideScroll(page), `${open} made the page scroll sideways`).toBe(true);
  }
  // Chapter 5: the big top's close-ups
  await seed(page, { ch: 5, scene: 'circus', f: { introDone: true, tickets: true, inside: true } }, ['-ch2', '-ch3', '-ch4', '-ch5']);
  await page.locator('#btn-cont').tap();
  await skip(page);
  for (const open of ['openTickets()', 'openLights()', 'openTeeter()', 'openJuggle()', 'openTrapeze()', 'openGears()', 'S.gr = { n: 3 }; openGears()']) {
    await page.evaluate(open);
    await page.waitForTimeout(150);
    const ok = await page.locator('.panel').evaluate(e => e.scrollWidth <= e.clientWidth + 1);
    expect(ok, `${open} is wider than the screen`).toBe(true);
    await page.locator('#m-close').tap();
    expect(await noSideScroll(page), `${open} made the page scroll sideways`).toBe(true);
  }
  // Chapter 3: the classroom's close-ups
  await seed(page, { ch: 3, scene: 'school', f: { introDone: true }, inv: ['chalk', 'magnifier'] }, ['-ch2', '-ch3']);
  await page.locator('#btn-cont').tap();
  await skip(page);
  for (const open of ['openDrawer3()', 'openRomans()', 'openBoard()', 'openTables()', 'openRegister()', 'openNature()', 'openCake()', 'S.frc = 1; openCake()', 'openGlobe()']) {
    await page.evaluate(open);
    await page.waitForTimeout(150);
    const ok = await page.locator('.panel').evaluate(e => e.scrollWidth <= e.clientWidth + 1);
    expect(ok, `${open} is wider than the screen`).toBe(true);
    await page.locator('#m-close').tap();
    expect(await noSideScroll(page), `${open} made the page scroll sideways`).toBe(true);
  }
});
