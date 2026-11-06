const { test, expect } = require('@playwright/test');
const { skip } = require('./helpers');

test('the game is an installable web app that works offline', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForTimeout(500);

  const cdp = await context.newCDPSession(page);
  const { installabilityErrors } = await cdp.send('Page.getInstallabilityErrors');
  expect(installabilityErrors).toEqual([]);
  const { errors } = await cdp.send('Page.getAppManifest');
  expect(errors).toEqual([]);

  const cached = await page.evaluate(async () => { const keys = await caches.keys(); const c = await caches.open(keys[0]); return (await c.keys()).map(r => new URL(r.url).pathname); });
  expect(cached).toEqual(expect.arrayContaining(['/', '/index.html', '/manifest.webmanifest', '/icons/icon-512.png', '/js/core.js', '/js/chapter1.js', '/css/base.css', '/scenes/kitchen.svg']));

  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('#sc-kitchen')).toBeAttached();
  await expect(page.locator('#title')).not.toHaveClass(/loading/);
  await page.evaluate(() => startNew());
  await skip(page);
  await expect(page.locator('#chap')).toHaveText('Chapter 1 · Locked In with Mr Nilsson');
  await context.setOffline(false);
});

test('every file in the offline list exists, and every game file is in it', async () => {
  const fs = require('fs'), path = require('path'), root = path.join(__dirname, '..');
  const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
  const core = [...sw.match(/const CORE = \[([\s\S]*?)\];/)[1].matchAll(/'\.\/([^']*)'/g)].map(m => m[1]).filter(Boolean);
  for (const f of core) expect(fs.existsSync(path.join(root, f)), f).toBe(true);
  const dirs = ['js', 'css', 'scenes', 'portraits', ...fs.readdirSync(path.join(root, 'lang')).map(l => `lang/${l}`)];
  for (const dir of dirs)
    for (const f of fs.readdirSync(path.join(root, dir))) expect(core, `${dir}/${f} is not in sw.js`).toContain(`${dir}/${f}`);
});

test('the service worker only deletes its own old caches', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.evaluate(() => Promise.all([caches.open('it-v1'), caches.open('sint-v1'), caches.open('pippi-villa-v1')]));
  await page.evaluate(() => navigator.serviceWorker.getRegistration().then(r => r.unregister()));
  await page.reload();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await expect.poll(() => page.evaluate(() => caches.keys())).not.toContain('pippi-villa-v1');
  const keys = await page.evaluate(() => caches.keys());
  expect(keys).toEqual(expect.arrayContaining(['it-v1', 'sint-v1']));
});

test('the title screen shows the version, and a newer version offers a reload', async ({ page }) => {
  const sw = require('fs').readFileSync(require('path').join(__dirname, '..', 'sw.js'), 'utf8');
  const cacheVersion = +sw.match(/const CACHE = 'pippi-villa-v(\d+)'/)[1];
  await page.goto('/');
  await expect(page.locator('#title')).not.toHaveClass(/loading/);
  // GAME_VERSION in js/boot.js and CACHE in sw.js must be bumped together
  await expect(page.locator('#version')).toHaveText('v' + cacheVersion);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForTimeout(500);
  await expect(page.locator('#update-bar')).toBeHidden();      // the service worker serves this same version
  await page.evaluate(v => swVersion('pippi-villa-v' + (v - 1)), cacheVersion);
  await expect(page.locator('#update-bar')).toBeHidden();      // an older one: nothing to offer
  await page.evaluate(v => swVersion('pippi-villa-v' + (v + 1)), cacheVersion);
  await expect(page.locator('#update-bar')).toBeVisible();
  await page.locator('#btn-update').click();
  await page.waitForLoadState('load');
  await expect(page.locator('#update-bar')).toBeHidden();
});

test('opening index.html from disk explains that a web server is needed', async ({ page }) => {
  await page.goto('file://' + require('path').resolve(__dirname, '..', 'index.html'));
  await expect(page.locator('#title p.keep')).toContainText('npm start');
  await expect(page.locator('#btn-new')).toBeHidden();
});
