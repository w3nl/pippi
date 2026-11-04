const { test, expect } = require('@playwright/test');
const { seed, hs, skip, waitModalClosed, expectWin } = require('./helpers');

test('Chapter 4: Pippi joins the circus', async ({ page }) => {
  await seed(page, { ch: 3, scene: 'school', f: { out3: true } }, ['-ch2', '-ch3']);
  await expect(page.locator('#btn-cont')).toHaveText('Continue to Chapter 4');
  await page.locator('#btn-cont').click();
  await expect(page.locator('#chap')).toHaveText('Chapter 4 · The Circus');
  await expect(page.locator('#d-who')).toHaveText('The circus');
  await skip(page);
  await expect(page.locator('#sc-circus')).toHaveClass(/on/);
  await page.locator('#sc-circus [data-hs="balance4"]').click();
  await expect(page.locator('#m-title')).toHaveText('The strong-person act');
  await page.locator('#m-close').click();

  await hs(page, 'ticket4');
  await page.locator('[data-ticket="19"]').click();
  await expect(page.locator('#c4-fb')).toContainText('two bigger each time');
  await page.locator('[data-ticket="20"]').click();
  await expect(page.locator('#c4-fb')).toHaveClass(/good/);
  await waitModalClosed(page);

  await hs(page, 'mirror4');
  await page.locator('[data-mirror="wrong"]').click();
  await expect(page.locator('#c4-fb')).toContainText('same distance');
  await page.locator('[data-mirror="mirror"]').click();
  await waitModalClosed(page);

  await hs(page, 'juggler4');
  await page.locator('[data-ball="blue"]').click();
  await expect(page.locator('#c4-fb')).toContainText('one red ball');
  await page.locator('[data-ball="red"]').click();
  await waitModalClosed(page);

  await hs(page, 'balance4');
  await page.locator('[data-kg="1"]').click();
  await page.locator('[data-kg="3"]').click();
  await page.locator('#c4-weigh').click();
  await expect(page.locator('#c4-fb')).toContainText('4 kg');
  await page.locator('[data-kg="1"]').click();
  await page.locator('[data-kg="5"]').click();
  await page.locator('#c4-weigh').click();
  await waitModalClosed(page);

  await hs(page, 'lights4');
  await page.locator('#c4-test').click();
  await expect(page.locator('#c4-fb')).toContainText('loop has a gap');
  await page.locator('#c4-switch').click();
  await page.locator('#c4-test').click();
  await waitModalClosed(page);

  await hs(page, 'curtain4');
  await expectWin(page, 'The big top is open · Chapter 4 complete');
  await expect(page.locator('#btn-next')).toBeHidden();
  await expect(page.locator('#w-note')).toContainText('Hoppetossa');
  await page.locator('#btn-stay').click();
  await skip(page);
  await expect(page.locator('#ct-finale')).toBeVisible();
});

test('Chapter 4 hints follow the unsolved act', async ({ page }) => {
  await seed(page, { ch: 4, scene: 'circus', f: { introDone: true } }, ['-ch2', '-ch3', '-ch4']);
  await page.locator('#btn-cont').click();
  await skip(page);
  await page.locator('#btn-hint').click();
  await expect(page.locator('#d-txt')).toContainText('ticket numbers go up');
  await skip(page);
  await page.locator('#btn-hint').click();
  await expect(page.locator('#d-txt')).toContainText('The next ticket is 20');
});

test('the classroom door leads to Chapter 4 after the holidays', async ({ page }) => {
  await seed(page, { ch: 3, scene: 'school', f: { out3: true } }, ['-ch2', '-ch3']);
  await expect(page.locator('#title')).not.toHaveClass(/loading/);
  await page.evaluate(() => { document.querySelector('#title').hidden = true; S.started = true; applyVisuals(); });
  await hs(page, 'door3');
  await expect(page.locator('#chap')).toHaveText('Chapter 4 · The Circus');
  await expect(page.locator('#sc-circus')).toHaveClass(/on/);
});