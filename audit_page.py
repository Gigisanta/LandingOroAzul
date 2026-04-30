from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 900})

    errors = []
    def handle_console(msg):
        if msg.type in ['error', 'warning']:
            errors.append(f"{msg.type.upper()}: {msg.text}")

    page.on("console", handle_console)
    page.on("pageerror", lambda e: errors.append(f"PAGE ERROR: {e}"))

    page.goto('http://localhost:3000', wait_until='networkidle', timeout=20000)
    page.wait_for_timeout(5000)

    print("=== Full DOM Analysis ===")

    # Check if Scene component exists
    scene = page.locator('[class*="fixed"]')
    print(f"Fixed elements: {scene.count()}")

    # Get all elements with position fixed
    fixed_elements = page.evaluate("""
        (function() {
            const els = document.querySelectorAll('*');
            const result = [];
            for (let el of els) {
                const style = getComputedStyle(el);
                if (style.position === 'fixed') {
                    result.push({
                        tag: el.tagName,
                        id: el.id,
                        class: el.className.substring(0, 60),
                        zIndex: style.zIndex,
                        width: style.width,
                        height: style.height,
                        top: style.top,
                        left: style.left
                    });
                }
            }
            return result;
        })()
    """)

    print(f"Fixed position elements: {len(fixed_elements)}")
    for el in fixed_elements:
        print(f"  {el['tag']} #{el['id']} z={el['zIndex']} {el['width']}x{el['height']}")

    # Check main content
    main = page.locator('#main-content')
    main_html_len = len(main.inner_html()) if main.count() > 0 else 0
    print(f"\n#main-content exists: {main.count() > 0}, HTML length: {main_html_len}")

    # Check sections
    sections = ['inicio', 'beneficios', 'horarios', 'precios', 'galeria']
    for section_id in sections:
        section = page.locator(f'#{section_id}')
        section_html_len = len(section.inner_html()) if section.count() > 0 else 0
        print(f"  #{section_id}: exists={section.count() > 0}, HTML length={section_html_len}")

    # Check h1
    h1 = page.locator('h1')
    h1_text = h1.inner_text() if h1.count() > 0 else "NOT FOUND"
    h1_style = page.evaluate("""
        (function() {
            const h1 = document.querySelector('h1');
            if (!h1) return null;
            const s = getComputedStyle(h1);
            return {
                color: s.color,
                fontSize: s.fontSize,
                opacity: s.opacity,
                visibility: s.visibility,
                display: s.display,
                zIndex: s.zIndex,
                position: s.position
            };
        })()
    """) if h1.count() > 0 else None
    print(f"\nH1: text='{h1_text[:50]}...' style={h1_style}")

    # Check for Scene wrapper
    scene_wrapper = page.locator('.fixed.inset-0')
    print(f"\n.fixed.inset-0 elements: {scene_wrapper.count()}")

    # Look for Scene component specifically
    scene_component = page.locator('[data-scene], #scene, [class*="three"]')
    print(f"Scene-related elements: {scene_component.count()}")

    print("\n=== Console Errors/Warnings ===")
    for err in errors[:15]:
        print(err)

    browser.close()
