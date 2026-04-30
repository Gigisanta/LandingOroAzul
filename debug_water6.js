const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({ type: msg.type(), text: msg.text() });
  });
  
  await page.goto('https://oro-azul-landing.vercel.app', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  
  console.log('=== CHECK SECTION IDs ===');
  const sectionIds = ['inicio', 'beneficios', 'horarios', 'precios', 'galeria', 'testimonios', 'faq', 'contacto'];
  const existingSections = await page.evaluate((ids) => {
    return ids.map(id => ({
      id,
      exists: document.getElementById(id) !== null,
      rect: document.getElementById(id)?.getBoundingClientRect()
    }));
  }, sectionIds);
  console.log(JSON.stringify(existingSections, null, 2));
  
  console.log('\n=== CHECK WATER CANVAS STATE ===');
  const canvasState = await page.evaluate(() => {
    const canvas = document.querySelector('canvas[data-engine*="three.js"]');
    if (!canvas) return { error: 'No canvas found' };
    
    // Try to get WebGL context - might fail if already taken
    const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });
    
    return {
      canvasExists: true,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      dataEngine: canvas.dataset.engine,
      style: {
        width: canvas.style.width,
        height: canvas.style.height,
        position: window.getComputedStyle(canvas).position,
        zIndex: window.getComputedStyle(canvas).zIndex
      },
      parentStyles: {
        zIndex: window.getComputedStyle(canvas.parentElement).zIndex,
        position: window.getComputedStyle(canvas.parentElement).position
      }
    };
  });
  console.log(JSON.stringify(canvasState, null, 2));
  
  console.log('\n=== CHECK PIXEL AT CENTER (should be non-black if water is rendering) ===');
  // This is a simple check - if the water is rendering, center shouldn't be pure black
  const centerPixel = await page.evaluate(() => {
    const canvas = document.querySelector('canvas[data-engine*="three.js"]');
    if (!canvas) return null;
    
    // canvas is probably in a foreign object or has security restrictions
    return {
      note: 'Cannot read pixels due to CORS/security restrictions on WebGL canvas'
    };
  });
  console.log(JSON.stringify(centerPixel, null, 2));
  
  console.log('\n=== MAIN CONTENT OVERLAPPING ===');
  const mainContent = await page.evaluate(() => {
    const main = document.querySelector('main');
    if (!main) return { error: 'No main element' };
    const rect = main.getBoundingClientRect();
    return {
      exists: true,
      rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
      zIndex: window.getComputedStyle(main).zIndex
    };
  });
  console.log(JSON.stringify(mainContent, null, 2));
  
  console.log('\n=== CONSOLE ERRORS ===');
  consoleMessages.filter(m => m.type === 'error').forEach(m => console.log('ERROR:', m.text));
  
  await browser.close();
})();
