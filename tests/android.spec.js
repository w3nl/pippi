// The Android app (android/): the back button asks the game for one step back (window.appBack in js/app.js),
// and the privacy page that Google Play links to.
const { test, expect } = require('@playwright/test');
const { seed, skip } = require('./helpers');

test('the Android back button: close-up → room → title screen → close the app', async ({ page }) => {
  await seed(page, { f: { introDone: true } });
  await page.locator('#btn-cont').click();
  await skip(page);
  await page.evaluate(() => openModal('Test', '', '<p>…</p>'));
  await expect(page.locator('#modal')).toBeVisible();
  expect(await page.evaluate(() => window.appBack())).toBe(true);    // closes the close-up
  await expect(page.locator('#modal')).toBeHidden();
  expect(await page.evaluate(() => window.appBack())).toBe(true);    // back to the title screen
  await expect(page.locator('#title')).toBeVisible();
  expect(await page.evaluate(() => window.appBack())).toBe(false);   // on the title screen: the app closes
});

test('the privacy page for Google Play', async ({ page }) => {
  await page.goto('/privacy.html');
  await expect(page.locator('h1').first()).toHaveText('Privacy');
  await expect(page.locator('body')).toContainText('collects no personal data');
  await expect(page.locator('#nl')).toBeVisible();
});
