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

test('Chapter 2: Tommy\'s Morse answer is a word in every language', async ({ page }) => {
  for (const [lang, word] of [['nl', 'KIETEL'], ['sv', 'KITTLA']]) {
    await seed(page, { ch: 2, scene: 'bedroom', f: { introDone: true, torchOn: true, scared: true, north: true, sos: true }, inv: ['torch'] }, ['-ch2']);
    await page.evaluate(([KEY, lang]) => localStorage.setItem(KEY + '-lang', lang), [KEY, lang]);
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await page.locator('#btn-cont').click();
    await skip(page);
    await page.evaluate(() => openMorse());
    const code = await page.evaluate(w => [...w].map(L => MORSE[L]).join(' '), word);
    await expect(page.locator('.m-code')).toHaveText(code.replace(/\./g, '·').replace(/-/g, '−').split(' ').join('\u00a0\u00a0\u00a0'));
    await page.locator('#m-ans').fill('TICKLE');
    await page.locator('#m-form button[type=submit]').click();
    await expect(page.locator('#m-fb')).toHaveClass(/bad/);
    await page.locator('#m-ans').fill(word.toLowerCase());
    await page.locator('#m-form button[type=submit]').click();
    await expect(page.locator('#m-fb')).toHaveClass(/good/);
  }
});

test('Chapter 3: Pippi\'s own word for multiplying, in every language', async ({ page }) => {
  for (const [lang, word, chap] of [['nl', 'PLUTIMICEREN', 'Hoofdstuk 3 · Pippi gaat naar school'], ['sv', 'PLUTTIFIKATION', 'Kapitel 3 · Pippi börjar skolan']]) {
    await seed(page, { ch: 3, scene: 'school', f: { introDone: true } }, ['-ch2', '-ch3']);
    await page.evaluate(([KEY, lang]) => localStorage.setItem(KEY + '-lang', lang), [KEY, lang]);
    await page.reload();
    await page.locator('#btn-cont').click();
    await skip(page);
    await expect(page.locator('#chap')).toHaveText(chap);
    await hs(page, 'board');
    await expect(page.locator('.s3-h')).toHaveText(word);
    await page.locator('#m-close').click();
  }
});

test('Chapter 4 in Dutch and Swedish: the ringmaster, the ticket booth and the chapter title', async ({ page }) => {
  for (const [lang, who, chap, booth] of [['nl', 'De directeur', 'Hoofdstuk 4 · Pippi gaat naar het circus', 'Kaartjeshokje'], ['sv', 'Direktören', 'Kapitel 4 · Pippi på cirkus', 'Biljettlucka']]) {
    await seed(page, { ch: 4, scene: 'circus', f: { introDone: true } }, ['-ch2', '-ch3', '-ch4']);
    await page.evaluate(([KEY, lang]) => localStorage.setItem(KEY + '-lang', lang), [KEY, lang]);
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await page.locator('#btn-cont').click();
    await skip(page);
    await expect(page.locator('#chap')).toHaveText(chap);
    await expect(page.locator('#sc-circus [data-hs="booth"]')).toHaveAttribute('data-label', booth);
    await hs(page, 'ringmaster');
    await expect(page.locator('#d-who')).toHaveText(who);
    await skip(page);
  }
});

test('Chapter 5 in Dutch and Swedish: the captain, the compass points and the chapter title', async ({ page }) => {
  for (const [lang, chap, sw, label] of [['nl', 'Hoofdstuk 5 · Aan boord van de Hoppetossa', 'zuidwest', 'Kraaiennest'], ['sv', 'Kapitel 5 · Ombord på Hoppetossa', 'sydväst', 'Utkiken']]) {
    await seed(page, { ch: 5, scene: 'ship', f: { introDone: true, aboard: true }, hd: { i: 5 } }, ['-ch2', '-ch3', '-ch4', '-ch5']);
    await page.evaluate(([KEY, lang]) => localStorage.setItem(KEY + '-lang', lang), [KEY, lang]);
    await page.reload();
    await page.locator('#btn-cont').click();
    await skip(page);
    await expect(page.locator('#chap')).toHaveText(chap);
    await expect(page.locator('#sc-ship [data-hs="crow"]')).toHaveAttribute('data-label', label);
    await hs(page, 'wheel');
    await expect(page.locator('#hp-heading')).toContainText(sw);
    await page.locator('#m-close').click();
  }
});

test('every Dutch and Swedish translation still matches the English text', () => {
  // Fails when English text changed without updating lang/nl (a stale key), or one text has two translations.
  const tool = path.join(__dirname, '..', 'tools', 'i18n-check.js');
  let out = '';
  try { out = execFileSync(process.execPath, [tool, '--stale'], { encoding: 'utf8' }); }
  catch (e) { out = e.stdout; throw new Error('tools/i18n-check.js --stale failed:\n' + out); }
  expect(out).toContain('All languages: 0 stale keys, 0 conflicts.');
});
