const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('=== BACKGROUND ELEMENTS DEEP INSPECTION ===\n');

  await page.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Detailed analysis of the fixed background container
  console.log('1. FIXED BACKGROUND CONTAINER (-z-10):');
  const fixedBg = await page.evaluate(() => {
    const allDivs = document.querySelectorAll('div');
    const fixedBg = Array.from(allDivs).find(d => {
      const style = getComputedStyle(d);
      return style.position === 'fixed' && style.zIndex === '-10';
    });

    if (fixedBg) {
      const style = getComputedStyle(fixedBg);
      const children = Array.from(fixedBg.children).map(c => ({
        tag: c.tagName.toLowerCase(),
        id: c.id,
        className: c.className,
        visible: c.offsetWidth > 0 && c.offsetHeight > 0,
        dims: { w: c.offsetWidth, h: c.offsetHeight }
      }));

      return {
        id: fixedBg.id,
        className: fixedBg.className,
        style: {
          position: style.position,
          zIndex: style.zIndex,
          inset: style.inset,
          overflow: style.overflow,
          background: style.background,
          opacity: style.opacity
        },
        children,
        innerHTML: fixedBg.innerHTML.substring(0, 2000)
      };
    }
    return null;
  });

  if (fixedBg) {
    console.log(`   Container: .${fixedBg.className}`);
    console.log(`   Style: pos=${fixedBg.style.position}, z=${fixedBg.style.zIndex}, inset=${fixedBg.style.inset}`);
    console.log(`   Background: ${fixedBg.style.background}`);
    console.log(`   Overflow: ${fixedBg.style.overflow}`);
    console.log(`   Children: ${fixedBg.children.length}`);
    fixedBg.children.forEach(c => {
      console.log(`   - [${c.tag}] .${c.className} (${c.dims.w}x${c.dims.h}) visible=${c.visible}`);
    });
    console.log(`   InnerHTML preview:\n   ${fixedBg.innerHTML}`);
  }

  // Check all absolute/fixed positioned elements
  console.log('\n2. ALL ABSOLUTE/FIXED POSITIONED ELEMENTS:');
  const absElements = await page.evaluate(() => {
    const all = document.querySelectorAll('*');
    return Array.from(all)
      .filter(el => {
        const style = getComputedStyle(el);
        const pos = style.position;
        return pos === 'absolute' || pos === 'fixed';
      })
      .map(el => {
        const style = getComputedStyle(el);
        return {
          tag: el.tagName.toLowerCase(),
          id: el.id,
          className: el.className,
          pos: style.position,
          zIndex: style.zIndex,
          inset: style.inset,
          w: el.offsetWidth,
          h: el.offsetHeight,
          x: el.offsetLeft,
          y: el.offsetTop,
          bg: style.background,
          opacity: style.opacity,
          visibility: style.visibility,
          display: style.display
        };
      })
      .sort((a, b) => (parseInt(b.zIndex) || 0) - (parseInt(a.zIndex) || 0));
  });

  absElements.forEach(el => {
    const zStr = el.zIndex ? `z=${el.zIndex}` : 'z=auto';
    const visible = el.display !== 'none' && el.visibility !== 'hidden' && el.opacity !== '0' && el.w > 0 && el.h > 0;
    console.log(`   [${el.tag}] .${el.className || ''}`);
    console.log(`        ${zStr} ${el.pos} ${el.w}x${el.h}@(${el.x},${el.y}) visible=${visible}`);
    console.log(`        inset=${el.inset}`);
    console.log(`        bg=${el.bg.substring(0, 80)}...`);
  });

  // Look specifically for gradient/orb elements
  console.log('\n3. GRADIENT/ORB/EFFECT ELEMENTS:');
  const gradientElements = await page.evaluate(() => {
    const all = document.querySelectorAll('div, span');
    return Array.from(all)
      .filter(el => {
        const style = getComputedStyle(el);
        return style.background.includes('gradient') ||
               el.className.includes('orb') ||
               el.className.includes('gradient') ||
               el.className.includes('glow') ||
               el.className.includes('blur') ||
               el.className.includes('backdrop');
      })
      .map(el => {
        const style = getComputedStyle(el);
        return {
          tag: el.tagName.toLowerCase(),
          className: el.className,
          pos: style.position,
          zIndex: style.zIndex,
          w: el.offsetWidth,
          h: el.offsetHeight,
          x: el.offsetLeft,
          y: el.offsetTop,
          bg: style.background,
          opacity: style.opacity
        };
      });
  });

  gradientElements.forEach(el => {
    console.log(`   [${el.tag}] .${el.className}`);
    console.log(`        pos=${el.pos} z=${el.zIndex} ${el.w}x${el.h}@(${el.x},${el.y})`);
    console.log(`        bg: ${el.bg.substring(0, 120)}...`);
  });

  // Check what the WebGL canvas parent is
  console.log('\n4. WEBGL CANVAS PARENT HIERARCHY:');
  const canvasParent = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return null;

    const ancestors = [];
    let el = canvas.parentElement;
    while (el && el !== document.body) {
      const style = getComputedStyle(el);
      ancestors.push({
        tag: el.tagName.toLowerCase(),
        id: el.id,
        className: el.className,
        pos: style.position,
        zIndex: style.zIndex,
        w: el.offsetWidth,
        h: el.offsetHeight
      });
      el = el.parentElement;
    }
    return ancestors;
  });

  if (canvasParent) {
    console.log(`   Canvas has ${canvasParent.length} ancestors:`);
    canvasParent.forEach((a, i) => {
      console.log(`   ${i + 1}. [${a.tag}] .${a.className} pos=${a.pos} z=${a.zIndex} ${a.w}x${a.h}`);
    });
  }

  console.log('\n=== BACKGROUND INSPECTION COMPLETE ===');

  await browser.close();
})();
