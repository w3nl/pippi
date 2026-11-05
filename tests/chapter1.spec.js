const { test, expect } = require('@playwright/test');
const { seed, hs, skip, useSlot, closeModal, waitModalClosed, expectWin } = require('./helpers');

test('Chapter 1: get out of Villa Villekulla', async ({ page }) => {
  await seed(page, null, ['-ch1']);
  await page.locator('#btn-ch1').click();
  await expect(page.locator('#d-who')).toHaveText('Villa Villekulla');
  await skip(page);
  await expect(page.locator('#chap')).toHaveText('Chapter 1 · Locked In with Mr Nilsson');

  // the spunk: a free hint
  await hs(page, 'spunk');
  await skip(page);
  await useSlot(page, 'The spunk');
  await hs(page, 'stove');
  await page.locator('#dialog').click();
  await expect(page.locator('#d-txt')).toContainText('The spunk seems to be thinking');
  await expect(page.locator('#d-txt')).toContainText('other way round');
  await skip(page);
  await expect(page.locator('#hint-count')).toHaveText('0');

  // Pippi's backwards note, read in the mirror
  await hs(page, 'note');
  await expect(page.locator('#pnote')).toHaveClass(/mirrored/);
  await closeModal(page);
  await useSlot(page, "Pippi's note");
  await hs(page, 'window');
  await skip(page);
  await useSlot(page, "Pippi's note");
  await hs(page, 'mirror');
  await skip(page);
  await expect(page.locator('#pnote')).not.toHaveClass(/mirrored/);
  await expect(page.locator('#pnote')).toContainText('He will swap it for a PANCAKE');
  await closeModal(page);

  // the stove without matches
  await hs(page, 'stove');
  await page.locator('#fb-match').click();
  await expect(page.locator('#fire-fb')).toContainText('nothing to light it with');
  await closeModal(page);

  // Pippi's sums: 6 5 4 on the bureau's secret drawer
  await hs(page, 'homework');
  await expect(page.locator('.sticky')).toContainText('RIGHT answers');
  await closeModal(page);
  await hs(page, 'bureau');
  for (let i = 0; i < 9; i++) await page.locator(`.drw[data-d="${i}"]`).click();
  await page.locator('.wheel .up[data-w="0"]').click();
  await page.locator('#lock-try').click();
  await expect(page.locator('#bur-fb')).toHaveClass(/bad/);
  const turn = async (w, n) => { for (let i = 0; i < n; i++) await page.locator(`.wheel .up[data-w="${w}"]`).click(); };
  await turn(0, 5); await turn(1, 5); await turn(2, 4);
  await page.locator('#lock-try').click();
  await expect(page.locator('#bur-fb')).toHaveClass(/good/);
  await waitModalClosed(page);

  // the fire: fuel, air and heat
  await hs(page, 'stove');
  await page.locator('#fb-match').click();
  await expect(page.locator('#fire-fb')).toContainText('needs fuel');
  await page.locator('#fb-wood').click();
  await page.locator('#fb-match').click();
  await expect(page.locator('#fire-fb')).toContainText('no air');
  await page.locator('#fb-vent').click();
  await page.locator('#fb-match').click();
  await expect(page.locator('#fire-fb')).toHaveClass(/good/);
  await waitModalClosed(page);
  await expect(page.locator('#vk-fire')).toBeVisible();

  // eggs from the pantry, then pancakes in the right order
  await hs(page, 'stove');
  await expect(page.locator('#d-txt')).toBeVisible();
  await skip(page);
  await hs(page, 'pantry');
  await page.locator('#take-eggs').click();
  await skip(page);
  await hs(page, 'stove');
  const step = k => page.locator(`.pstep[data-k="${k}"]`).click();
  await step('whisk');
  await expect(page.locator('#pk-fb')).toContainText('empty bowl');
  await step('head');
  await expect(page.locator('#pk-fb')).toContainText('Splat');
  await step('eggs'); await step('milk'); await step('whisk');
  await step('pour');
  await expect(page.locator('#pk-fb')).toContainText('Without butter');
  await step('butter'); await step('pour'); await step('toss');
  await expect(page.locator('#pk-fb')).toContainText('ceiling');
  await waitModalClosed(page);

  // the pancake for the key, the key in the door
  await useSlot(page, 'Pancake');
  await hs(page, 'nilsson');
  await skip(page);
  await hs(page, 'door');
  await skip(page);
  await useSlot(page, 'Front-door key');
  await hs(page, 'door');
  await skip(page);
  await hs(page, 'horse'); await skip(page);
  await hs(page, 'horse'); await skip(page);

  // the sea chest: SPUNK in signal flags
  await hs(page, 'flags');
  await expect(page.locator('.bigflags polygon').first()).toBeAttached();
  await closeModal(page);
  await hs(page, 'chest');
  await page.locator('#chest-try').click();
  await page.locator('#chest-try').click();
  await expect(page.locator('#chest-fb')).toContainText('Look up');
  const letter = async (w, n) => { for (let i = 0; i < n; i++) await page.locator(`.wheel .up[data-w="${w}"]`).click(); };
  await letter(0, 18); await letter(1, 15); await letter(2, 20); await letter(3, 13); await letter(4, 10);
  expect(await page.locator('.wheel b').allTextContents()).toEqual(['S', 'P', 'U', 'N', 'K']);
  await page.locator('#chest-try').click();
  await waitModalClosed(page);

  // the horse: a flat hand
  await useSlot(page, 'Sugar cubes');
  await hs(page, 'horse');
  await page.locator('.hand[data-h="tips"]').click();
  await expect(page.locator('#horse-fb')).toContainText('nibble');
  await page.locator('.hand[data-h="flat"]').click();
  await expectWin(page, 'Door open · Chapter 1 complete');
  await expect(page.locator('#w-rank')).toHaveText('Strongest in the world');
  for (const a of ['Asked the spunk', 'Egg on your head', 'Pancake on the ceiling', 'Tried to lift the horse', 'Opened every little drawer'])
    await expect(page.locator('#w-ach .got', { hasText: a })).toBeVisible();
});
