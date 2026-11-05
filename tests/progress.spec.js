const { test, expect } = require('@playwright/test');
const { KEY, seed, hs, skip } = require('./helpers');

test('progress is saved and survives a refresh', async ({ page }) => {
  await seed(page, null, ['-ch1']);
  await page.locator('#btn-ch1').click();
  await skip(page);
  await hs(page, 'spunk');
  await skip(page);
  await page.reload();
  await expect(page.locator('#btn-cont')).toBeVisible();
  await page.locator('#btn-cont').click();
  await expect(page.locator('.slot[title="The spunk"]')).toBeVisible();
  await expect(page.locator('#d-who')).toHaveText('Villa Villekulla');
  await expect(page.locator('#d-txt')).toContainText("Back in Pippi's kitchen", { timeout: 5_000 });
});

test('padlock wheels and the stove stay as you left them', async ({ page }) => {
  await seed(page, { f: { noteRead: true }, inv: ['matches'] });
  await page.locator('#btn-cont').click();
  await skip(page);
  await hs(page, 'stove');
  await page.locator('#fb-wood').click();
  await page.locator('#m-close').click();
  await hs(page, 'chest');
  await page.locator('.wheel .up[data-w="0"]').click();
  await page.reload();
  await page.locator('#btn-cont').click();
  await skip(page);
  await hs(page, 'stove');
  await expect(page.locator('#fb-wood')).toHaveText('Firewood: in');
  await page.locator('#m-close').click();
  await hs(page, 'chest');
  await expect(page.locator('#cw0')).toHaveText('B');
});

test('hints give a nudge, then the answer, and are counted', async ({ page }) => {
  await seed(page, null, ['-ch1']);
  await page.locator('#btn-ch1').click();
  await skip(page);
  await page.locator('#btn-hint').click();
  await expect(page.locator('#d-txt')).toContainText('Hint: ', { timeout: 5_000 });
  await skip(page);
  await page.locator('#btn-hint').click();
  await expect(page.locator('#d-txt')).toContainText('Big hint: Take the note', { timeout: 5_000 });
  await expect(page.locator('#hint-count')).toHaveText('2');
});

test('scores keep the best result, and achievements carry over to a new game', async ({ page }) => {
  await seed(page, { f: { out1: true }, t: 300, hints: 3, ach: { spunk: true } });
  await expect(page.locator('#title')).not.toHaveClass(/loading/);
  await page.evaluate(() => { recordScore(1, 300, 3); recordScore(1, 400, 1); });
  await page.locator('#btn-scores').click();
  await expect(page.locator('.scores tbody tr').nth(1)).toContainText('05:00');
  await expect(page.locator('.scores tbody tr').nth(1)).toContainText('Thing-finder');
  await page.locator('#m-close').click();
  await page.locator('#btn-new').click();
  const ach = await page.evaluate(KEY => JSON.parse(localStorage.getItem(KEY)).ach, KEY);
  expect(ach.spunk).toBe(true);
});
