const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const events = [];
  page.on('console', m => { if (m.type() === 'error') events.push('CONSOLE: ' + m.text()); });
  page.on('pageerror', e => events.push('PAGEERROR: ' + e.message));
  page.on('response', r => { if (r.url().includes('music')) events.push('HTTP ' + r.status() + ': ' + r.url()); });
  page.on('requestfailed', r => events.push('REQFAIL: ' + r.url()));
  await page.goto('https://jiangrenbielang.github.io/', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.click('.aplayer-play');
  await page.waitForTimeout(6000);
  const state = await page.evaluate(() => {
    const time = document.querySelector('.aplayer-time');
    return JSON.stringify({
      timeText: time ? time.innerText.replace(/\s+/g, ' ').trim() : 'none',
    });
  });
  console.log('STATE:', state);
  console.log('EVENTS:', events.length ? events.join('\n') : 'none');
  await browser.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
