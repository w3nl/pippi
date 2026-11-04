const { test, expect } = require('@playwright/test');
const { seed, hs, skip, useSlot, closeModal, waitModalClosed, expectWin } = require('./helpers');

test('Chapter 3: escape the classroom', async ({ page }) => {
  await seed(page, null, ['-ch2', '-ch3']);
  await expect(page.locator('#btn-ch3')).toBeVisible();
  await page.locator('#btn-ch3').click();
  await expect(page.locator('#d-who')).toHaveText('School');
  await skip(page);
  await expect(page.locator('#chap')).toHaveText('Chapter 3 · Pippi Goes to School');
  await expect(page.locator('#sc-classroom')).toHaveClass(/on/);

  // the blackboard explains the steps
  await hs(page, 'board3');
  await expect(page.locator('.chalk')).toContainText('ESCAPE THE CLASSROOM!');
  await closeModal(page);

  // 1. the register, A to Z (with a wrong try first)
  await hs(page, 'register');
  await page.locator('#reg-done').click();
  await expect(page.locator('#reg-fb')).toHaveClass(/bad/);
  const order = async () => page.locator('#reg-list li span').allTextContents();
  const want = ['Annika', 'Axel', 'Britta', 'Kalle', 'Olle', 'Pippi', 'Tommy'];
  for (let target = 0; target < want.length; target++) {
    let cur = (await order()).indexOf(want[target]);
    while (cur > target) { await page.locator(`.mv[data-i="${cur}"][data-d="-1"]`).click(); cur--; }
    if (target === 1) {
      // Annika and Axel are in place: check the "second letter" advice on a deliberate swap
      await page.locator('.mv[data-i="0"][data-d="1"]').click();
      await page.locator('#reg-done').click();
      await expect(page.locator('#reg-fb')).toContainText('second letter');
      await page.locator('.mv[data-i="1"][data-d="-1"]').click();
    }
  }
  expect(await order()).toEqual(want);
  await page.locator('#reg-done').click();
  await expect(page.locator('#reg-fb')).toHaveClass(/good/);
  await waitModalClosed(page);

  // 2. the cake: 1 slice, 7 slices, then 8, then 1/8
  await useSlot(page, 'Cake knife');
  await hs(page, 'cake');
  for (let i = 0; i < 3; i++) await page.locator('#ck-minus').click();
  await page.locator('#ck-cut').click();
  await expect(page.locator('#ck-fb')).toContainText('The whole cake');
  for (let i = 0; i < 6; i++) await page.locator('#ck-plus').click();
  await page.locator('#ck-cut').click();
  await expect(page.locator('#ck-fb')).toContainText('And the teacher?');
  await page.locator('#ck-plus').click();
  await page.locator('#ck-cut').click();
  await expect(page.locator('#ck-q')).toBeVisible();
  await page.locator('.frac[data-v="8"]').click();
  await expect(page.locator('#ck-fb')).toContainText('ONE of them');
  await page.locator('.frac[data-v="1/8"]').click();
  await expect(page.locator('#ck-fb')).toContainText('1/8');
  await waitModalClosed(page);

  // 3. the nature cupboard: the frog's life cycle
  await useSlot(page, 'Little key');
  await hs(page, 'cupboard');
  await skip(page);
  await expect(page.locator('#frog-cards')).toBeVisible();
  await page.locator('.fcard[data-i="4"]').click();
  await expect(page.locator('#frog-fb')).toContainText('Start with the eggs');
  for (const i of [0, 1, 2, 3, 4]) await page.locator(`.fcard[data-i="${i}"]`).click();
  await waitModalClosed(page);

  // 4. the plan: B3 first, then A2
  await hs(page, 'plan');
  await page.locator('.pcell[data-ref="B3"]').click();
  await expect(page.locator('#plan-fb')).toContainText("B3: teacher's desk");
  await page.locator('.pcell[data-ref="A2"]').click();
  await expect(page.locator('#plan-fb')).toHaveClass(/good/);
  await waitModalClosed(page);

  // 5. the prize box in the globe: 9 × 7 with the finger trick
  await hs(page, 'globe');
  await page.locator('.finger[data-n="10"]').click();
  await expect(page.locator('#finger-out')).toContainText('That makes 90');
  await page.locator('.finger[data-n="7"]').click();
  await expect(page.locator('#finger-out')).toContainText('6 fingers on the left, 3 on the right. That makes 63');
  const wheel = async (w, n) => { for (let i = 0; i < n; i++) await page.locator(`.wheel .up[data-w="${w}"]`).click(); };
  await wheel(0, 3); await wheel(1, 6);
  await page.locator('#prize-try').click();
  await expect(page.locator('#prize-fb')).toContainText('example on the poster');
  await wheel(0, 3); await wheel(1, 7);
  await page.locator('#prize-try').click();
  await expect(page.locator('#prize-fb')).toHaveClass(/good/);
  await waitModalClosed(page);

  // kiss the frog, then out of the door
  await hs(page, 'cupboard');
  await skip(page);
  await useSlot(page, 'Classroom key');
  await hs(page, 'cdoor');
  await expectWin(page, "School's out · Chapter 3 complete");
  await expect(page.locator('#btn-next')).toBeHidden();
  for (const a of ['The whole cake for Pippi', 'Kissed the frog', 'Nine times ten'])
    await expect(page.locator('#w-ach .got', { hasText: a })).toBeVisible();
});

test('finishing Chapter 2 leads to Chapter 3', async ({ page }) => {
  await seed(page, { ch: 2, scene: 'bedroom', f: { out2: true } }, ['-ch2']);
  await expect(page.locator('#btn-cont')).toHaveText('Continue to Chapter 3');
  await page.locator('#btn-cont').click();
  await expect(page.locator('#chap')).toHaveText('Chapter 3 · Pippi Goes to School');
  await skip(page);
  // the end screen's button, and the veranda door after "Look around"
  await seed(page, { ch: 2, scene: 'bedroom', f: { out2: true, introDone: true } }, ['-ch2']);
  await expect(page.locator('#title')).not.toHaveClass(/loading/);
  await page.evaluate(() => { document.querySelector('#title').hidden = true; showWin(); });
  await expect(page.locator('#btn-next')).toHaveText('Continue to Chapter 3');
  await page.locator('#btn-stay').click();
  await skip(page);
  await expect(page.locator('#sc-bedroom [data-hs="vdoor"]')).toHaveAttribute('data-label', 'Veranda door: on to Chapter 3');
  await hs(page, 'vdoor');
  await expect(page.locator('#chap')).toHaveText('Chapter 3 · Pippi Goes to School');
});
