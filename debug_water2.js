const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('https://oro-azul-landing.vercel.app', { waitUntil: 'networkidle', timeout: 30000 });
  
  // Wait a bit for animations to start
  await page.waitForTimeout(2000);
  
  console.log('=== CHECK WAVE ELEMENT DETAILS ===');
  const waveDetails = await page.evaluate(() => {
    const waveEl = document.querySelector('[class*="wave"]');
    if (waveEl) {
      const rect = waveEl.getBoundingClientRect();
      const style = window.getComputedStyle(waveEl);
      return {
        tag: waveEl.tagName,
        class: waveEl.className,
        id: waveEl.id,
        rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height, visibility: rect.visibility },
        display: style.display,
        visibility: style.visibility,
        opacity: style.opacity,
        position: style.position,
        zIndex: style.zIndex,
        overflow: style.overflow
      };
    }
    return null;
  });
  console.log('Wave element:', JSON.stringify(waveDetails, null, 2));
  
  console.log('\n=== CHECK CANVAS DETAILS ===');
  const canvasDetails = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const style = window.getComputedStyle(canvas);
      return {
        width: canvas.width,
        height: canvas.height,
        rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
        style: {
          display: style.display,
          visibility: style.visibility,
          opacity: style.opacity,
          position: style.position,
          zIndex: style.zIndex
        }
      };
    }
    return null;
  });
  console.log('Canvas element:', JSON.stringify(canvasDetails, null, 2));
  
  console.log('\n=== CHECK THREE.JS SCENE ===');
  const threeJsStatus = await page.evaluate(() => {
    // Check if THREE is defined
    if (typeof THREE !== 'undefined') {
      return { threeDefined: true, version: THREE.REVISION };
    }
    // Check for any global that might be the three.js namespace
    for (let key in window) {
      if (key.toLowerCase().includes('three') || key.toLowerCase().includes('webgl')) {
        console.log('Found global:', key, window[key]);
      }
    }
    return { threeDefined: false };
  });
  console.log('THREE.js status:', JSON.stringify(threeJsStatus, null, 2));
  
  console.log('\n=== CHECK VISIBILITY OF ANIMATION CONTAINER ===');
  const animContainer = await page.evaluate(() => {
    // Look for any fixed or absolute positioned elements that might be the water
    const allElements = document.querySelectorAll('*');
    const positionedElements = [];
    allElements.forEach(el => {
      const style = window.getComputedStyle(el);
      if ((style.position === 'fixed' || style.position === 'absolute') && 
          (style.opacity === '0' || style.opacity < 1 || style.display === 'none')) {
        positionedElements.push({
          tag: el.tagName,
          class: el.className,
          id: el.id,
          position: style.position,
          opacity: style.opacity,
          display: style.display,
          visibility: style.visibility
        });
      }
    });
    return positionedElements.slice(0, 20);
  });
  console.log('Hidden positioned elements:', JSON.stringify(animContainer, null, 2));
  
  await browser.close();
})();
