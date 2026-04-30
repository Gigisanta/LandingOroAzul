const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  
  // Only listen for errors, don't try to access WebGL ourselves
  const jsErrors = [];
  page.on('pageerror', err => {
    jsErrors.push(err.message);
  });
  
  await page.goto('https://oro-azul-landing.vercel.app', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(5000); // Wait for animations to start
  
  console.log('=== JS ERRORS ===');
  if (jsErrors.length === 0) {
    console.log('No JS errors detected');
  } else {
    jsErrors.forEach(e => console.log('ERROR:', e));
  }
  
  console.log('\n=== TAKE FINAL SCREENSHOT ===');
  await page.screenshot({ path: 'water_final_screenshot.png', fullPage: false });
  console.log('Screenshot: water_final_screenshot.png');
  
  // Check page state
  console.log('\n=== PAGE STATE ===');
  const state = await page.evaluate(() => {
    const canvas = document.querySelector('canvas[data-engine]');
    return {
      hasThreeCanvas: !!canvas,
      threeVersion: canvas?.dataset.engine,
      bodyChildren: document.body.children.length
    };
  });
  console.log(JSON.stringify(state, null, 2));
  
  await browser.close();
})();
