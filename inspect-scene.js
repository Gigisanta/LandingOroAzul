const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('=== DEEP 3D SCENE INSPECTION ===\n');

  // Navigate to the page
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000); // Wait for 3D scene to initialize

  // 1. Take full-page screenshot
  console.log('1. TAKING FULL-PAGE SCREENSHOT...');
  await page.screenshot({ path: '/Users/prueba/Desktop/LandingOroAzul/inspection-screenshot.png', fullPage: true });
  console.log('   Saved to: inspection-screenshot.png\n');

  // 2. Query ALL canvas elements
  console.log('2. CANVAS ELEMENTS ANALYSIS:');
  const canvasInfo = await page.evaluate(() => {
    const canvases = document.querySelectorAll('canvas');
    return Array.from(canvases).map((canvas, i) => {
      const ctx = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('2d');
      return {
        index: i,
        id: canvas.id,
        className: canvas.className,
        width: canvas.width,
        height: canvas.height,
        offsetWidth: canvas.offsetWidth,
        offsetHeight: canvas.offsetHeight,
        style: {
          display: canvas.style.display,
          visibility: canvas.style.visibility,
          opacity: canvas.style.opacity,
          zIndex: canvas.style.zIndex,
          position: canvas.style.position,
          left: canvas.style.left,
          top: canvas.style.top
        },
        hasWebGL: !!(ctx && (ctx instanceof WebGLRenderingContext || ctx instanceof WebGL2RenderingContext)),
        contextType: ctx ? ctx.constructor.name : 'none'
      };
    });
  });
  console.log(`   Found ${canvasInfo.length} canvas element(s):`);
  canvasInfo.forEach(c => {
    console.log(`   [${c.index}] id="${c.id}", class="${c.className}"`);
    console.log(`        dimensions: ${c.width}x${c.height} (offset: ${c.offsetWidth}x${c.offsetHeight})`);
    console.log(`        style: display=${c.style.display}, opacity=${c.style.opacity}, zIndex=${c.style.zIndex}, pos=${c.style.position}`);
    console.log(`        WebGL: ${c.hasWebGL} (${c.contextType})`);
  });
  console.log('');

  // 3. Check DOM for overlay divs and non-canvas elements
  console.log('3. DOM OVERLAY ANALYSIS:');
  const overlayInfo = await page.evaluate(() => {
    const allElements = document.querySelectorAll('*');
    const overlays = [];
    const divsWithCanvas = [];
    const likely3dRelated = [];

    allElements.forEach(el => {
      const tag = el.tagName.toLowerCase();
      const hasCanvas = el.querySelector('canvas') !== null;
      const isCanvas = tag === 'canvas';

      // Check for elements with z-index higher than typical
      const zIndex = parseInt(getComputedStyle(el).zIndex) || 0;
      const hasPosition = getComputedStyle(el).position !== 'static';

      // Look for elements that might be 3D-related overlays
      if (!isCanvas && !hasCanvas && tag === 'div') {
        const opacity = parseFloat(getComputedStyle(el).opacity) || 1;
        const visibility = getComputedStyle(el).visibility;
        const display = getComputedStyle(el).display;
        const pointerEvents = getComputedStyle(el).pointerEvents;

        // Check if element is visible and might be an overlay
        if (opacity > 0 && visibility === 'visible' && display !== 'none' && zIndex > 0) {
          overlays.push({
            tag,
            id: el.id,
            className: el.className,
            zIndex,
            opacity,
            position: getComputedStyle(el).position,
            dimensions: {
              w: el.offsetWidth,
              h: el.offsetHeight,
              left: el.offsetLeft,
              top: el.offsetTop
            },
            pointerEvents,
            innerHTML_preview: el.innerHTML.substring(0, 100)
          });
        }
      }

      if (hasCanvas) {
        divsWithCanvas.push({
          id: el.id,
          className: el.className,
          zIndex
        });
      }

      // Check for Three.js specific attributes and classes
      const threeClasses = ['three-container', 'webgl', 'webgl-content', '3d-scene', 'canvas-container'];
      const hasThreeClass = Array.from(el.classList).some(c => threeClasses.includes(c));
      if (hasThreeClass) {
        likely3dRelated.push({
          tag,
          id: el.id,
          className: el.className,
          zIndex
        });
      }
    });

    return { overlays, divsWithCanvas, likely3dRelated };
  });

  console.log(`   Found ${overlayInfo.overlays.length} visible div overlays with z-index > 0:`);
  overlayInfo.overlays.slice(0, 20).forEach(el => {
    console.log(`   [${el.tag}]#${el.id || '(no-id)'} .${el.className || '(no-class)'}`);
    console.log(`        zIndex=${el.zIndex}, opacity=${el.opacity}, pos=${el.position}`);
    console.log(`        dims: ${el.dimensions.w}x${el.dimensions.h} at (${el.dimensions.left}, ${el.dimensions.top})`);
    console.log(`        pointerEvents=${el.pointerEvents}`);
    console.log(`        innerHTML: ${el.innerHTML_preview}...`);
  });

  console.log(`\n   Found ${overlayInfo.divsWithCanvas.length} divs containing canvas:`);
  overlayInfo.divsWithCanvas.forEach(el => {
    console.log(`   #${el.id || '(no-id)'} .${el.className} zIndex=${el.zIndex}`);
  });

  console.log(`\n   Found ${overlayInfo.likely3dRelated.length} likely 3D-related elements:`);
  overlayInfo.likely3dRelated.forEach(el => {
    console.log(`   [${el.tag}]#${el.id} .${el.className} zIndex=${el.zIndex}`);
  });

  // 4. Check for Three.js scene objects
  console.log('\n4. THREE.JS SCENE ANALYSIS:');
  const threeInfo = await page.evaluate(() => {
    const result = {
      hasThreeJS: false,
      sceneObjects: [],
      rendererInfo: null,
      memoryUsage: null
    };

    // Check if THREE is defined globally
    if (typeof window.THREE !== 'undefined') {
      result.hasThreeJS = true;
      result.threeVersion = window.THREE.REVISION;
    }

    // Check for renderer on window or in canvas data
    if (window.renderer) {
      result.rendererInfo = {
        type: window.renderer.constructor.name,
        domElement: window.renderer.domElement ? {
          width: window.renderer.domElement.width,
          height: window.renderer.domElement.height
        } : null,
        info: window.renderer.info
      };
    }

    // Look for any global that might be a renderer
    const possibleGlobals = ['renderer', 'scene', 'camera', 'composer', 'effectComposer'];
    const foundGlobals = {};
    possibleGlobals.forEach(name => {
      if (window[name]) {
        foundGlobals[name] = {
          type: window[name].constructor ? window[name].constructor.name : typeof window[name],
          keys: Object.keys(window[name]).slice(0, 20)
        };
      }
    });

    // Get all canvas contexts and their associated renderers
    const canvasContexts = [];
    document.querySelectorAll('canvas').forEach((canvas, i) => {
      const ctx2d = canvas.getContext('2d');
      const ctxWebgl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (ctxWebgl) {
        const debugInfo = ctxWebgl.getExtension('WEBGL_debug_renderer_info');
        canvasContexts.push({
          canvasIndex: i,
          canvasId: canvas.id,
          webglRenderer: debugInfo ? ctxWebgl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'unknown',
          webglVendor: debugInfo ? ctxWebgl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'unknown',
          drawingBufferWidth: ctxWebgl.drawingBufferWidth,
          drawingBufferHeight: ctxWebgl.drawingBufferHeight
        });
      }
    });

    return { ...result, foundGlobals, canvasContexts };
  });

  console.log(`   Three.js present: ${threeInfo.hasThreeJS}`);
  if (threeInfo.hasThreeJS) {
    console.log(`   Three.js revision: ${threeInfo.threeVersion}`);
  }

  console.log('\n   Found globals:', Object.keys(threeInfo.foundGlobals).length > 0 ? Object.keys(threeInfo.foundGlobals).join(', ') : 'none');
  Object.entries(threeInfo.foundGlobals).forEach(([name, info]) => {
    console.log(`   - ${name}: ${info.type}`);
  });

  console.log('\n   Canvas WebGL contexts:');
  threeInfo.canvasContexts.forEach(ctx => {
    console.log(`   [${ctx.canvasIndex}] ${ctx.canvasId || '(no-id)'}`);
    console.log(`        Renderer: ${ctx.webglRenderer}`);
    console.log(`        Vendor: ${ctx.webglVendor}`);
    console.log(`        Buffer: ${ctx.drawingBufferWidth}x${ctx.drawingBufferHeight}`);
  });

  // 5. Get computed styles for body and html
  console.log('\n5. PAGE BACKGROUND ANALYSIS:');
  const bgInfo = await page.evaluate(() => {
    const html = document.documentElement;
    const body = document.body;
    return {
      htmlBg: getComputedStyle(html).background,
      bodyBg: getComputedStyle(body).background,
      bodyOverflow: getComputedStyle(body).overflow,
      bodyMargin: getComputedStyle(body).margin,
      bodyPadding: getComputedStyle(body).padding,
      bodyPosition: getComputedStyle(body).position,
      bodyWidth: body.offsetWidth,
      bodyHeight: body.offsetHeight
    };
  });
  console.log(`   HTML background: ${bgInfo.htmlBg}`);
  console.log(`   Body background: ${bgInfo.bodyBg}`);
  console.log(`   Body overflow: ${bgInfo.bodyOverflow}`);
  console.log(`   Body dimensions: ${bgInfo.bodyWidth}x${bgInfo.bodyHeight}`);
  console.log(`   Body margin: ${bgInfo.bodyMargin}, padding: ${bgInfo.bodyPadding}`);

  // 6. List ALL visible elements with dimensions
  console.log('\n6. ALL VISIBLE ELEMENTS (positioned/visible divs, images, canvases):');
  const visibleElements = await page.evaluate(() => {
    const result = [];
    const walkDOM = (el, depth = 0) => {
      if (depth > 10) return;

      const tag = el.tagName ? el.tagName.toLowerCase() : null;
      if (!tag) return;

      const style = getComputedStyle(el);
      const isVisible = el.offsetWidth > 0 && el.offsetHeight > 0 &&
                        style.display !== 'none' &&
                        style.visibility !== 'hidden' &&
                        style.opacity !== '0';

      if (isVisible && (tag === 'div' || tag === 'canvas' || tag === 'img' || tag === 'svg' || tag === 'span')) {
        result.push({
          tag,
          id: el.id,
          className: el.className,
          zIndex: style.zIndex,
          pos: style.position,
          dims: { w: el.offsetWidth, h: el.offsetHeight },
          loc: { x: el.offsetLeft, y: el.offsetTop },
          opacity: style.opacity
        });
      }

      Array.from(el.children).forEach(child => walkDOM(child, depth + 1));
    };

    walkDOM(document.body);
    return result.sort((a, b) => (parseInt(b.zIndex) || 0) - (parseInt(a.zIndex) || 0));
  });

  console.log(`   Total visible elements: ${visibleElements.length}`);
  visibleElements.slice(0, 50).forEach(el => {
    const zStr = el.zIndex ? `z=${el.zIndex}` : 'z=auto';
    console.log(`   [${el.tag}]#${el.id || ''} .${el.className || ''} ${zStr} ${el.pos} ${el.dims.w}x${el.dims.h}@(${el.loc.x},${el.loc.y}) opacity=${el.opacity}`);
  });

  console.log('\n=== INSPECTION COMPLETE ===');
  console.log('Screenshot saved to: inspection-screenshot.png');

  await browser.close();
})();
