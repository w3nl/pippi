const { test, expect } = require('@playwright/test');
const { seed, hs, skip, useSlot, closeModal, waitModalClosed, expectWin } = require('./helpers');

/** Turn a padlock wheel (ids rw0…rw3) to a digit with its arrows. */
async function setWheel(page, i, digit) {
  for (let n = 0; n < 10 && (await page.locator('#rw' + i).textContent()) !== String(digit); n++)
    await page.locator(`.wheel .up[data-w="${i}"]`).click();
}

test('Chapter 3: Pippi earns her holidays', async ({ page }) => {
  await seed(page, null, ['-ch2', '-ch3']);
  await expect(page.locator('#btn-ch3')).toBeVisible();
  await page.locator('#btn-ch3').click();
  await expect(page.locator('#d-who')).toHaveText('The little school');
  await skip(page);
  await expect(page.locator('#chap')).toHaveText('Chapter 3 · Pippi Goes to School');
  await expect(page.locator('#sc-school')).toHaveClass(/on/);

  // the blackboard: no chalk yet
  await hs(page, 'board');
  await page.locator('.s3-line[data-i="4"]').click();
  await expect(page.locator('#b3-fb')).toContainText('You need chalk');
  await closeModal(page);

  // Miss's drawer: the year on the plaque in Roman numerals (IV read as 6 first)
  await hs(page, 'tdesk');
  for (const [i, d] of [[0, 1], [1, 8], [2, 9], [3, 6]]) await setWheel(page, i, d);
  await page.locator('#dr-try').click();
  await expect(page.locator('#dr-fb')).toContainText('IV is 5 − 1 = 4');
  await setWheel(page, 3, 4);
  await page.locator('#dr-try').click();
  await expect(page.locator('#dr-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('.slot[title="Chalk"]')).toBeVisible();

  // task 1: the nines
  await useSlot(page, 'Chalk');
  await hs(page, 'board');
  await page.locator('.s3-line[data-i="0"]').click();
  await page.locator('#b3-check').click();
  await expect(page.locator('#b3-fb')).toContainText('9 × 1 = 9 is right');
  await page.locator('.s3-line[data-i="0"]').click();
  for (const i of [4, 7]) await page.locator(`.s3-line[data-i="${i}"]`).click();
  await page.locator('#b3-check').click();
  await expect(page.locator('#b3-fb')).toContainText('still one wrong answer');
  await page.locator('.s3-line[data-i="9"]').click();
  await page.locator('#b3-check').click();
  await expect(page.locator('#b3-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#sl-n5')).toHaveText('9×5=45');

  // task 2: the class register in ABC order (Pippi before Peter is wrong)
  await hs(page, 'register');
  for (const n of ['Annika', 'Axel', 'Britta', 'Olle']) await page.locator(`.s3-name[data-n="${n}"]`).click();
  await page.locator('.s3-name[data-n="Pippi"]').click();
  await expect(page.locator('#reg-fb')).toContainText('e comes before i');
  for (const n of ['Peter', 'Pippi', 'Tommy', 'Tora']) await page.locator(`.s3-name[data-n="${n}"]`).click();
  await expect(page.locator('#reg-fb')).toHaveClass(/good/);
  await waitModalClosed(page);

  // task 3: insects (the spider is not one)
  await useSlot(page, 'Magnifying glass');
  await hs(page, 'nature');
  for (const i of [0, 1, 2]) await page.locator(`.s3-bug[data-b="${i}"]`).click();
  await page.locator('#bug-check').click();
  await expect(page.locator('#bug-fb')).toContainText('eight');
  await page.locator('.s3-bug[data-b="1"]').click();
  await page.locator('#bug-check').click();
  await expect(page.locator('#bug-fb')).toContainText('One insect');
  await page.locator('.s3-bug[data-b="4"]').click();
  await page.locator('#bug-check').click();
  await expect(page.locator('#bug-fb')).toHaveClass(/good/);
  await waitModalClosed(page);

  // an achievement: Pippi's freckles
  await useSlot(page, 'Magnifying glass');
  await hs(page, 'pippi3');
  await expect(page.locator('#d-txt')).toContainText('Freckles');
  await skip(page);

  // too early for the bell
  await hs(page, 'bell3');
  await expect(page.locator('#d-txt')).toBeVisible();
  await skip(page);
  await expect(page.locator('#win')).toBeHidden();

  // task 4: fractions (a quarter first: "four is more than three")
  await hs(page, 'cake');
  await page.locator('.s3-cakeb[data-n="4"]').click();
  await expect(page.locator('#cake-fb')).toContainText('Four is more than three');
  await page.locator('.s3-cakeb[data-n="3"]').click();
  await expect(page.locator('#cake-fb')).toHaveClass(/good/);
  await page.locator('.hand[data-w="Annika"]').click();
  await expect(page.locator('#cake-fb')).toContainText('half as big');
  await page.locator('.hand[data-w="The same"]').click();
  await expect(page.locator('#cake-fb')).toHaveClass(/good/);
  await waitModalClosed(page);

  // task 5: the seasons
  await hs(page, 'globe');
  await page.locator('.hand[data-g="far"]').click();
  await expect(page.locator('#globe-fb')).toHaveClass(/bad/);
  await page.locator('.hand[data-g="tilt"]').click();
  await expect(page.locator('#globe-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#sl-star4')).toHaveAttribute('fill', '#f2c94c');

  // the bell
  await hs(page, 'bell3');
  await expectWin(page, "School's out · Chapter 3 complete");
  await expect(page.locator('#btn-next')).toHaveText('Continue to Chapter 4');
  for (const a of ['Four is more than three', "Counted Pippi's freckles"])
    await expect(page.locator('#w-ach .got', { hasText: a })).toBeVisible();
  await page.locator('#btn-stay').click();
  await skip(page);
  await expect(page.locator('#sl-hol')).toBeVisible();
});

test('the hints follow Chapter 3, and the close-ups stay as you left them', async ({ page }) => {
  await seed(page, { ch: 3, scene: 'school', f: { introDone: true } }, ['-ch2', '-ch3']);
  await page.locator('#btn-cont').click();
  await expect(page.locator('#d-txt')).toContainText('Back in the classroom', { timeout: 5_000 });
  await skip(page);
  await page.locator('#btn-hint').click();
  await expect(page.locator('#d-txt')).toContainText('chalk box is empty', { timeout: 5_000 });
  await skip(page);
  await hs(page, 'tdesk');
  await page.locator('.wheel .up[data-w="0"]').click();
  await closeModal(page);
  await hs(page, 'register');
  await page.locator('.s3-name[data-n="Annika"]').click();
  await page.reload();
  await page.locator('#btn-cont').click();
  await skip(page);
  await hs(page, 'tdesk');
  await expect(page.locator('#rw0')).toHaveText('1');
  await closeModal(page);
  await hs(page, 'register');
  await expect(page.locator('#s3-reg li')).toHaveText(['Annika']);
});

test('finishing Chapter 2 leads to Chapter 3', async ({ page }) => {
  await seed(page, { ch: 2, scene: 'bedroom', f: { out2: true }, t: 100 }, ['-ch2']);
  await expect(page.locator('#btn-cont')).toHaveText('Continue to Chapter 3');
  await page.locator('#btn-cont').click();
  await expect(page.locator('#chap')).toHaveText('Chapter 3 · Pippi Goes to School');
  await skip(page);
  // and from the end screen, the veranda door leads on too
  await seed(page, { ch: 2, scene: 'bedroom', f: { out2: true, torchOn: true, scared: true } }, ['-ch2']);
  await expect(page.locator('#title')).not.toHaveClass(/loading/);
  await page.evaluate(() => { document.querySelector('#title').hidden = true; S.started = true; applyVisuals(); showWin(); });
  await expect(page.locator('#btn-next')).toHaveText('Continue to Chapter 3');
  await page.locator('#btn-stay').click();
  await skip(page);
  await expect(page.locator('#sc-bedroom [data-hs="vdoor"]')).toHaveAttribute('data-label', 'Veranda door: on to Chapter 3');
  await hs(page, 'vdoor');
  await expect(page.locator('#chap')).toHaveText('Chapter 3 · Pippi Goes to School');
  await expect(page.locator('#btn-ch3')).toBeAttached();
});

test('Miss watches through the window in the door, and leaves it once the bell has rung', async ({ page }) => {
  await seed(page, { ch: 3, scene: 'school', f: { introDone: true } }, ['-ch2', '-ch3']);
  await page.locator('#btn-cont').click();
  await skip(page);
  await expect(page.locator('#sl-teacher')).toBeVisible();
  await hs(page, 'teacher3');
  await expect(page.locator('#d-who')).toHaveText('Miss');
  await expect(page.locator('#d-txt')).toContainText('No help through the window', { timeout: 5_000 });
  await skip(page);
  await page.evaluate(() => { S.f.out3 = true; applyVisuals(); });
  await expect(page.locator('#sl-teacher')).toBeHidden();
});
