const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  
  await page.goto('https://oro-azul-landing.vercel.app', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);
  
  console.log('=== PAGE DOM STRUCTURE (body children) ===');
  const bodyChildren = await page.evaluate(() => {
    const body = document.body;
    const children = [];
    const traverse = (el, depth) => {
      if (depth > 3) return;
      const directChildren = Array.from(el.children);
      directChildren.forEach(child => {
        const style = window.getComputedStyle(child);
        children.push({
          tag: child.tagName,
          class: child.className.substring(0, 100),
          id: child.id,
          position: style.position,
          zIndex: style.zIndex,
          display: style.display,
          rect: child.getBoundingClientRect()
        });
        traverse(child, depth + 1);
      });
    };
    traverse(document.body, 0);
    return children;
  });
  console.log(JSON.stringify(bodyChildren, null, 2));
  
  console.log('\n=== LOOKING FOR ANIMATION SCRIPTS ===');
  const scripts = await page.evaluate(() => {
    const scripts = Array.from(document.scripts);
    return scripts.map(s => ({
      src: s.src,
      type: s.type,
      inline: !s.src && s.textContent.length > 0
    }));
  });
  console.log('Scripts:', JSON.stringify(scripts, null, 2));
  
  console.log('\n=== CHECK STYLESHEETS ===');
  const styles = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    return links.map(l => l.href);
  });
  console.log('Stylesheets:', JSON.stringify(styles, null, 2));
  
  await browser.close();
})();
