const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  
  await page.goto('https://oro-azul-landing.vercel.app', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  
  console.log('=== CHECK THREE.JS SCENE DETAILS ===');
  const threeScene = await page.evaluate(() => {
    const canvas = document.querySelector('canvas[data-engine*="three.js"]');
    if (!canvas) return { error: 'No three.js canvas found' };
    
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return { error: 'No WebGL context' };
    
    // Get WebGL info
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    return {
      canvasSize: { width: canvas.width, height: canvas.height },
      canvasStyle: {
        width: canvas.style.width,
        height: canvas.style.height,
        position: window.getComputedStyle(canvas).position,
        zIndex: window.getComputedStyle(canvas).zIndex,
        opacity: window.getComputedStyle(canvas).opacity
      },
      parentElements: Array.from(canvas.parentElement?.parentElement?.children || []).map(el => ({
        tag: el.tagName,
        class: el.className.toString().substring(0, 50),
        zIndex: window.getComputedStyle(el).zIndex
      })),
      glVendor: gl.getParameter(gl.VENDOR),
      glRenderer: gl.getParameter(gl.RENDERER),
      glVersion: gl.getParameter(gl.VERSION),
      glShadingVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
    };
  });
  console.log(JSON.stringify(threeScene, null, 2));
  
  console.log('\n=== FIXED POSITION ELEMENTS Z-INDEX ===');
  const fixedElements = await page.evaluate(() => {
    const all = document.querySelectorAll('*');
    const fixed = [];
    all.forEach(el => {
      const style = window.getComputedStyle(el);
      if (style.position === 'fixed' || style.position === 'absolute') {
        fixed.push({
          tag: el.tagName,
          class: el.className.toString().substring(0, 80),
          zIndex: style.zIndex,
          opacity: style.opacity
        });
      }
    });
    // Sort by zIndex
    fixed.sort((a, b) => {
      const za = parseInt(a.zIndex) || 0;
      const zb = parseInt(b.zIndex) || 0;
      return zb - za;
    });
    return fixed.slice(0, 15);
  });
  console.log(JSON.stringify(fixedElements, null, 2));
  
  await browser.close();
})();
