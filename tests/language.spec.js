// UK English, Dutch and Swedish: the language switch, translated text in the game, and the translation files.
const { test, expect } = require('@playwright/test');
const { execFileSync } = require('child_process');
const path = require('path');
const { KEY, seed, hs, skip } = require('./helpers');

test('the language button switches to Dutch, remembers it, and comes back to English', async ({ page }) => {
  await seed(page);
  await expect(page.locator('#title')).not.toHaveClass(/loading/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-GB');
  await expect(page.locator('#btn-new')).toHaveText('New game');

  await page.locator('#btn-lang').click();
  await expect(page.locator('#btn-new')).toHaveText('Nieuw spel');
  await expect(page.locator('html')).toHaveAttribute('lang', 'nl');
  await page.reload();
  await expect(page.locator('#btn-new')).toHaveText('Nieuw spel');

  await page.locator('#btn-new').click();
  await expect(page.locator('#d-who')).toHaveText('Villa Kakelbont');
  await skip(page);
  await expect(page.locator('#chap')).toHaveText('Hoofdstuk 1 · Opgesloten met meneer Nilsson');
  await hs(page, 'nilsson');
  await expect(page.locator('#d-txt')).toContainText('Iek!');
  await skip(page);
  await expect(page.locator('#sc-kitchen [data-hs="door"]')).toHaveAttribute('data-label', 'Voordeur');

  // Pippi's note and the exercise book are in Dutch too
  await hs(page, 'note');
  await expect(page.locator('#pnote')).toContainText('PANNENKOEK');
  await page.locator('#m-close').click();
  await hs(page, 'homework');
  await expect(page.locator('.sticky')).toContainText('GOEDE antwoorden');
  await page.locator('#m-close').click();

  // and back (via Swedish): everything on the page returns to English
  await page.locator('#btn-lang').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'sv');
  await page.locator('#btn-lang').click();
  await expect(page.locator('#chap')).toHaveText('Chapter 1 · Locked In with Mr Nilsson');
  await expect(page.locator('#sc-kitchen [data-hs="door"]')).toHaveAttribute('data-label', 'Front door');
  await expect(page.locator('#tray-hint')).toContainText('Select an item');
});

test('Swedish: the third press of the button, with the original names', async ({ page }) => {
  await seed(page);
  await expect(page.locator('#title')).not.toHaveClass(/loading/);
  await page.locator('#btn-lang').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'nl');
  await page.locator('#btn-lang').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'sv');
  await expect(page.locator('#btn-new')).toHaveText('Nytt spel');
  await expect(page.locator('#btn-lang [data-l="sv"]')).toHaveClass(/on/);
  await page.reload();
  await expect(page.locator('#btn-new')).toHaveText('Nytt spel');

  await page.locator('#btn-new').click();
  await skip(page);
  await expect(page.locator('#chap')).toHaveText('Kapitel 1 · Inlåst med Herr Nilsson');
  await expect(page.locator('#sc-kitchen [data-hs="horse"]')).toHaveAttribute('data-label', 'Lilla Gubben');
  await hs(page, 'note');
  await expect(page.locator('#pnote')).toContainText('PANNKAKA');
  await page.locator('#m-close').click();
  await hs(page, 'stove');
  await expect(page.locator('#fb-vent')).toHaveText('Spjäll: stängt');
  await page.locator('#m-close').click();

  // a fourth press goes back to English
  await page.locator('#btn-lang').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en-GB');
  await expect(page.locator('#chap')).toHaveText('Chapter 1 · Locked In with Mr Nilsson');
});

test('every Dutch and Swedish translation still matches the English text', () => {
  // Fails when English text changed without updating lang/nl (a stale key), or one text has two translations.
  const tool = path.join(__dirname, '..', 'tools', 'i18n-check.js');
  let out = '';
  try { out = execFileSync(process.execPath, [tool, '--stale'], { encoding: 'utf8' }); }
  catch (e) { out = e.stdout; throw new Error('tools/i18n-check.js --stale failed:\n' + out); }
  expect(out).toContain('All languages: 0 stale keys, 0 conflicts.');
});
