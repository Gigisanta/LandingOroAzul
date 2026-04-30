#!/usr/bin/env python3
"""Deep audit of the Oro Azul landing page."""
import sys
sys.path.insert(0, '/Users/prueba/.kilo/skills/webapp-testing')

from playwright.sync_api import sync_playwright

PAGE_URL = "http://localhost:3000"

def audit_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 900})

        # Capture console messages
        console_logs = []
        console_errors = []
        page.on("console", lambda msg: (
            console_errors.append(f"[{msg.type}] {msg.text}") if msg.type == "error"
            else console_logs.append(f"[{msg.type}] {msg.text}")
        ))

        # Capture page errors
        page_errors = []
        page.on("pageerror", lambda err: page_errors.append(str(err)))

        print("=" * 70)
        print("AUDITING ORO AZUL LANDING PAGE")
        print("=" * 70)

        # Navigate
        print("\n[1] Navigating to page...")
        page.goto(PAGE_URL, wait_until="networkidle", timeout=30000)
        page.wait_for_timeout(3000)  # Extra wait for hydration

        # Take screenshot
        print("\n[2] Taking screenshot...")
        page.screenshot(path="/tmp/oro_azul_audit.png", full_page=True)
        print("   Screenshot saved to /tmp/oro_azul_audit.png")

        # Check page title
        print(f"\n[3] Page title: {page.title()}")

        # Check main content
        content = page.content()
        print(f"\n[4] HTML length: {len(content)} chars")

        # Check critical elements
        print("\n[5] Checking critical elements:")
        checks = {
            "html": "html",
            "body": "body",
            "#main-content": "#main-content",
            "#inicio": "#inicio",
            "#beneficios": "#beneficios",
            "#garantias": "#garantias",
            "#testimonios": "#testimonios",
            "#faq": "#faq",
            "#contacto": "#contacto",
            "nav": "nav",
            "header": "header",
            "footer": "footer",
            ".hero-section": ".hero-section",
            ".water-canvas": ".water-canvas",
            "canvas": "canvas",
        }

        for name, selector in checks.items():
            try:
                elem = page.locator(selector).first
                exists = elem.count() > 0
                if exists:
                    bounding = elem.bounding_box()
                    is_visible = elem.is_visible() if exists else False
                    text = elem.inner_text()[:100] if exists else ""
                    print(f"   {name}: exists={exists}, visible={is_visible}, bounding={bounding}")
                    if text and name in ["#inicio", "#beneficios", "#garantias", "#faq"]:
                        print(f"      text: {text[:80]}...")
                else:
                    print(f"   {name}: NOT FOUND")
            except Exception as e:
                print(f"   {name}: ERROR - {e}")

        # Check for hydration
        print("\n[6] Checking hydration state:")
        hydration_check = page.evaluate("""
            () => {
                const main = document.querySelector('#main-content');
                if (!main) return { error: 'No #main-content found' };
                return {
                    innerHTML_length: main.innerHTML.length,
                    innerHTML_preview: main.innerHTML.substring(0, 200),
                    has_loading: main.innerHTML.includes('loading') || main.innerHTML.includes('Loading'),
                    childCount: main.children.length,
                    childTags: Array.from(main.children).map(c => c.tagName)
                };
            }
        """)
        print(f"   Hydration check: {hydration_check}")

        # Check computed styles of body
        print("\n[7] Checking body visibility:")
        body_styles = page.evaluate("""
            () => {
                const body = document.body;
                const style = window.getComputedStyle(body);
                return {
                    display: style.display,
                    visibility: style.visibility,
                    opacity: style.opacity,
                    backgroundColor: style.backgroundColor,
                    background: style.background
                };
            }
        """)
        print(f"   Body styles: {body_styles}")

        # Check hero section specifically
        print("\n[8] Checking hero section:")
        hero_check = page.evaluate("""
            () => {
                const hero = document.querySelector('.hero-section');
                if (!hero) return { error: 'No .hero-section found' };
                const style = window.getComputedStyle(hero);
                return {
                    display: style.display,
                    visibility: style.visibility,
                    opacity: style.opacity,
                    bounding: hero.getBoundingClientRect(),
                    zIndex: style.zIndex,
                    position: style.position,
                    pointerEvents: style.pointerEvents,
                    textContent: hero.textContent?.substring(0, 150)
                };
            }
        """)
        print(f"   Hero check: {hero_check}")

        # Check all visible text
        print("\n[9] Checking visible text content:")
        all_text = page.evaluate("""
            () => {
                const body = document.body;
                const walk = (node, depth = 0) => {
                    let texts = [];
                    if (node.nodeType === Node.TEXT_NODE) {
                        const text = node.textContent?.trim();
                        if (text) texts.push(text);
                    }
                    if (depth < 10 && node.childNodes) {
                        for (const child of node.childNodes) {
                            texts = texts.concat(walk(child, depth + 1));
                        }
                    }
                    return texts;
                };
                return walk(body).slice(0, 50);
            }
        """)
        for i, text in enumerate(all_text[:30]):
            print(f"   [{i}] {text[:100]}")

        # Check all images
        print("\n[10] Checking images:")
        images = page.evaluate("""
            () => {
                const imgs = document.querySelectorAll('img');
                return Array.from(imgs).map(img => ({
                    src: img.src.substring(0, 80),
                    alt: img.alt,
                    naturalWidth: img.naturalWidth,
                    complete: img.complete,
                    loaded: img.complete && img.naturalWidth > 0
                }));
            }
        """)
        for img in images:
            print(f"   Image: {img}")

        # Check canvas/WebGL
        print("\n[11] Checking canvas elements:")
        canvases = page.evaluate("""
            () => {
                const canvases = document.querySelectorAll('canvas');
                return Array.from(canvases).map(c => ({
                    width: c.width,
                    height: c.height,
                    bounding: c.getBoundingClientRect(),
                    style: {
                        display: window.getComputedStyle(c).display,
                        visibility: window.getComputedStyle(c).visibility,
                        opacity: window.getComputedStyle(c).opacity
                    }
                }));
            }
        """)
        print(f"   Canvases found: {len(canvases)}")
        for i, canvas in enumerate(canvases):
            print(f"   Canvas {i}: {canvas}")

        # Check navigation
        print("\n[12] Checking navigation:")
        nav_check = page.evaluate("""
            () => {
                const nav = document.querySelector('nav');
                if (!nav) return { error: 'No nav found' };
                const style = window.getComputedStyle(nav);
                const links = Array.from(nav.querySelectorAll('a')).map(a => ({
                    text: a.textContent?.trim(),
                    href: a.href
                }));
                return {
                    display: style.display,
                    visibility: style.visibility,
                    opacity: style.opacity,
                    links: links,
                    bounding: nav.getBoundingClientRect()
                };
            }
        """)
        print(f"   Nav check: {nav_check}")

        # Console output
        print("\n[13] Console logs (first 20):")
        for log in console_logs[:20]:
            print(f"   {log}")

        print("\n[14] Console ERRORS:")
        if console_errors:
            for err in console_errors:
                print(f"   {err}")
        else:
            print("   No errors!")

        print("\n[15] Page errors:")
        if page_errors:
            for err in page_errors:
                print(f"   {err}")
        else:
            print("   No page errors!")

        # Check network requests that might have failed
        print("\n[16] Checking for failed resources:")
        failed = page.evaluate("""
            () => {
                const failed = [];
                if (performance.getEntriesByType) {
                    const resources = performance.getEntriesByType('resource');
                    for (const r of resources) {
                        if (r.responseStatus >= 400) {
                            failed.push({ name: r.name, status: r.responseStatus });
                        }
                    }
                }
                return failed;
            }
        """)
        print(f"   Failed resources: {failed}")

        print("\n" + "=" * 70)
        print("AUDIT COMPLETE")
        print("=" * 70)

        browser.close()

if __name__ == "__main__":
    audit_page()