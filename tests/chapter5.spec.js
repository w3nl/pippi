const { test, expect } = require('@playwright/test');
const { seed, hs, skip, useSlot, closeModal, waitModalClosed, expectWin } = require('./helpers');

test('Chapter 5: get the circus show started', async ({ page }) => {
  await seed(page, null, ['-ch2', '-ch3', '-ch4', '-ch5']);
  await expect(page.locator('#btn-ch5')).toBeVisible();
  await page.locator('#btn-ch5').click();
  await expect(page.locator('#d-who')).toHaveText('The big top');
  await skip(page);
  await expect(page.locator('#chap')).toHaveText('Chapter 5 · Pippi Goes to the Circus');
  await expect(page.locator('#sc-circus')).toHaveClass(/on/);

  // nothing without a ticket
  await hs(page, 'lamps');
  await expect(page.locator('#d-txt')).toContainText('Tickets, please', { timeout: 5_000 });
  await skip(page);

  // 1. the tickets: 4 × 3 = 12, 20 − 12 = 8 change
  await hs(page, 'booth');
  const coin = v => page.locator(`.till .coin[data-v="${v}"]`).click();
  await coin(5); await coin(5); await coin(2);
  await page.locator('#chg-give').click();
  await expect(page.locator('#chg-fb')).toContainText('12 crowns is what the tickets cost');
  await page.locator('#chg-clear').click();
  await coin(5); await coin(2); await coin(1);
  await page.locator('#chg-give').click();
  await expect(page.locator('#chg-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await useSlot(page, 'Circus tickets');
  await hs(page, 'ringmaster');
  await skip(page);

  // the winch won't turn before the checklist is done
  await hs(page, 'winch');
  await expect(page.locator('#d-txt')).toContainText('0 of 4', { timeout: 5_000 });
  await skip(page);

  // 2. the spotlights: lights out, then yellow, cyan, white
  await hs(page, 'lamps');
  await page.locator('#ld-go').click();
  await expect(page.locator('#ld-fb')).toContainText('Pitch dark');
  const sw = i => page.locator(`.ld-switches .tog[data-i="${i}"]`).click();
  await sw(0); await sw(1); await page.locator('#ld-go').click();
  await expect(page.locator('#ld-fb')).toContainText('Yellow!');
  await sw(0); await sw(2); await page.locator('#ld-go').click();
  await expect(page.locator('#ld-fb')).toContainText('Cyan!');
  await sw(0); await page.locator('#ld-go').click();
  await expect(page.locator('#ld-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#sc-circus')).toHaveClass(/lit/);

  // 3. the teeterboard: 4 m launches the strongman, 3 m balances
  await hs(page, 'teeter');
  await page.locator('.seat[data-m="4"]').click();
  await expect(page.locator('#tt-fb')).toContainText('flies up');
  await page.locator('.seat[data-m="3"]').click();
  await expect(page.locator('#tt-fb')).toHaveClass(/good/);
  await waitModalClosed(page);

  // 4. the clown's pattern: honk his nose first
  await hs(page, 'clown');
  const ball = async (i, clicks) => { for (let k = 0; k < clicks; k++) await page.locator(`.jb.pick[data-i="${i}"]`).click(); };
  await page.locator('#jug-go').click();
  await expect(page.locator('#jug-fb')).toContainText('every empty ball');
  await ball(0, 2); await ball(1, 2); await ball(2, 1);   // blue, blue, red
  await page.locator('#jug-go').click();
  await expect(page.locator('#jug-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#cc-balls-air')).toBeVisible();
  for (let i = 0; i < 3; i++) { await hs(page, 'clown'); await skip(page); }

  // 5. the trapezes: same rope length
  await hs(page, 'trapeze');
  await page.locator('#tp-go').click();
  await expect(page.locator('#tp-fb')).toContainText('safety net');
  await page.locator('#tpb').fill('4');
  await page.locator('#tp-go').click();
  await expect(page.locator('#tp-fb')).toHaveClass(/good/);
  await waitModalClosed(page);

  // 6. the winch: 1 gear in between is wrong, 2 is right
  await hs(page, 'winch');
  await page.locator('#gear-go').click();
  await expect(page.locator('#gear-fb')).toContainText('even tighter');
  await page.locator('.gcount[data-n="2"]').click();
  await page.locator('#gear-go').click();
  await expect(page.locator('#gear-fb')).toHaveClass(/good/);
  await expectWin(page, 'Showtime · Chapter 5 complete');
  await expect(page.locator('#sc-circus')).toHaveClass(/showtime/);
  await expect(page.locator('#cc-rider')).toBeAttached();
  for (const a of ['Lights out!', 'The flying strongman', "Honked the clown's nose"])
    await expect(page.locator('#w-ach .got', { hasText: a })).toBeVisible();
});

test('finishing Chapter 4 leads to Chapter 5', async ({ page }) => {
  await seed(page, { ch: 4, scene: 'winter', f: { out4: true } }, ['-ch2', '-ch3', '-ch4']);
  await expect(page.locator('#btn-cont')).toHaveText('Continue to Chapter 5');
  await page.locator('#btn-cont').click();
  await expect(page.locator('#chap')).toHaveText('Chapter 5 · Pippi Goes to the Circus');
  await skip(page);
  // the garden gate after "Look around"
  await seed(page, { ch: 4, scene: 'winter', f: { out4: true, introDone: true } }, ['-ch2', '-ch3', '-ch4']);
  await expect(page.locator('#title')).not.toHaveClass(/loading/);
  await page.evaluate(() => { document.querySelector('#title').hidden = true; showWin(); });
  await expect(page.locator('#btn-next')).toHaveText('Continue to Chapter 5');
  await page.locator('#btn-stay').click();
  await skip(page);
  await expect(page.locator('#sc-winter [data-hs="gate4"]')).toHaveAttribute('data-label', 'Garden gate: on to Chapter 5');
  await hs(page, 'gate4');
  await expect(page.locator('#chap')).toHaveText('Chapter 5 · Pippi Goes to the Circus');
});
