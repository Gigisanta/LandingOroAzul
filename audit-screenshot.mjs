import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 }
];

const results = [];

for (const vp of viewports) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.screenshot({ path: `/tmp/audit-${vp.name}-initial.png`, fullPage: false });
  results.push({ viewport: vp.name, loaded: true });
}

// Check for console errors
const errors = [];
page.on('console', msg => {
  if (msg.type() === 'error') errors.push(msg.text());
});

// Scroll through the page
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(1000);

for (const vp of viewports) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.screenshot({ path: `/tmp/audit-${vp.name}-scroll-middle.png`, fullPage: false });

  // Scroll to bottom
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `/tmp/audit-${vp.name}-scroll-bottom.png`, fullPage: false });
}

console.log('Screenshots captured');
console.log('Errors:', errors.length > 0 ? errors : 'None');

await browser.close();