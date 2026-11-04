// UK English and Dutch: the language switch, Dutch text in the game, and the translation files.
const { test, expect } = require('@playwright/test');
const { execFileSync } = require('child_process');
const path = require('path');
const { KEY, seed, hs, skip } = require('./helpers');

test('the language button switches between UK English and Dutch, and remembers it', async ({ page }) => {
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

  // and back: everything on the page returns to English
  await page.locator('#btn-lang').click();
  await expect(page.locator('#chap')).toHaveText('Chapter 1 · Locked In with Mr Nilsson');
  await expect(page.locator('#sc-kitchen [data-hs="door"]')).toHaveAttribute('data-label', 'Front door');
  await expect(page.locator('#tray-hint')).toContainText('Select an item');
});

test('every Dutch translation still matches the English text', () => {
  // Fails when English text changed without updating lang/nl (a stale key), or one text has two translations.
  const tool = path.join(__dirname, '..', 'tools', 'i18n-check.js');
  let out = '';
  try { out = execFileSync(process.execPath, [tool, '--stale'], { encoding: 'utf8' }); }
  catch (e) { out = e.stdout; throw new Error('tools/i18n-check.js --stale failed:\n' + out); }
  expect(out).toContain('0 stale keys, 0 conflicts');
});
