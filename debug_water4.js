const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  
  await page.goto('https://oro-azul-landing.vercel.app', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  
  // Get page content summary
  console.log('=== PAGE HTML SUMMARY ===');
  const htmlSummary = await page.evaluate(() => {
    const body = document.body.innerHTML;
    // Get first 3000 chars
    return body.length + ' total chars, first 3000: ' + body.substring(0, 3000);
  });
  console.log(htmlSummary);
  
  console.log('\n=== CHECK IF ANIMATION JS LOADS ===');
  await page.waitForTimeout(5000); // Wait longer for JS to execute
  const afterWait = await page.evaluate(() => {
    return {
      hasCanvas: document.querySelectorAll('canvas').length,
      bodyLength: document.body.innerHTML.length,
      lastChildTag: document.body.lastElementChild?.tagName,
      lastChildClass: document.body.lastElementChild?.className?.toString?.().substring(0, 100)
    };
  });
  console.log('After wait:', JSON.stringify(afterWait, null, 2));
  
  // Screenshot after animations have time to start
  await page.screenshot({ path: 'water_debug_screenshot2.png', fullPage: false });
  console.log('Second screenshot saved');
  
  await browser.close();
})();
