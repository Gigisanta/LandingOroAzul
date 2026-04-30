const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  const consoleMessages = [];
  const jsErrors = [];
  
  // Capture console messages
  page.on('console', msg => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
    }
  });
  
  // Capture JS errors
  page.on('pageerror', err => {
    jsErrors.push(err.message);
    console.log('PAGE ERROR:', err.message);
  });
  
  console.log('=== NAVIGATING TO PAGE ===');
  await page.goto('https://oro-azul-landing.vercel.app', { waitUntil: 'networkidle', timeout: 30000 });
  
  console.log('\n=== TAKING SCREENSHOT ===');
  await page.screenshot({ path: 'water_debug_screenshot.png', fullPage: false });
  console.log('Screenshot saved as water_debug_screenshot.png');
  
  console.log('\n=== PAGE TITLE ===');
  const title = await page.title();
  console.log('Title:', title);
  
  console.log('\n=== CHECKING FOR WEBGL ===');
  const webglSupport = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      return {
        supported: true,
        vendor: gl.getParameter(gl.VENDOR),
        renderer: gl.getParameter(gl.RENDERER),
        version: gl.getParameter(gl.VERSION)
      };
    }
    return { supported: false };
  });
  console.log('WebGL Support:', JSON.stringify(webglSupport, null, 2));
  
  console.log('\n=== CHECKING FOR CANVAS ELEMENTS ===');
  const canvasCount = await page.evaluate(() => {
    return document.querySelectorAll('canvas').length;
  });
  console.log('Canvas elements found:', canvasCount);
  
  console.log('\n=== CHECKING FOR WATER ANIMATION ELEMENTS ===');
  const waterElements = await page.evaluate(() => {
    const hasWaterClass = document.querySelector('[class*="water"]') !== null;
    const hasWaveClass = document.querySelector('[class*="wave"]') !== null;
    const hasOceanClass = document.querySelector('[class*="ocean"]') !== null;
    const hasAnimatedClass = document.querySelector('[class*="animated"]') !== null;
    return { hasWaterClass, hasWaveClass, hasOceanClass, hasAnimatedClass };
  });
  console.log('Water-related elements:', JSON.stringify(waterElements, null, 2));
  
  console.log('\n=== CONSOLE MESSAGES ===');
  consoleMessages.forEach(msg => {
    console.log(`[${msg.type}] ${msg.text}`);
  });
  
  console.log('\n=== JS ERRORS ===');
  if (jsErrors.length === 0) {
    console.log('No JS errors detected');
  }
  jsErrors.forEach(err => {
    console.log('ERROR:', err);
  });
  
  await browser.close();
  console.log('\n=== DEBUG COMPLETE ===');
})();
