#!/usr/bin/env python3
"""Mobile QA Test for landing page at 375x812 viewport (iPhone size)."""
import sys
sys.path.insert(0, '/Users/prueba/.kilo/skills/webapp-testing')

from playwright.sync_api import sync_playwright
import time

PAGE_URL = "http://localhost:3000"
MOBILE_VIEWPORT = {"width": 375, "height": 812}

def qa_mobile_test():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page(viewport=MOBILE_VIEWPORT)

        print("=" * 60)
        print("MOBILE QA TEST - iPhone Viewport (375x812)")
        print("=" * 60)

        # Collect console messages
        console_messages = []
        console_errors = []

        page.on("console", lambda msg: (
            console_messages.append({"type": msg.type, "text": msg.text}),
            console_errors.append(msg.text) if msg.type == "error" else None
        ))

        # Navigate
        print("\n[1] Navigating to page...")
        page.goto(PAGE_URL, wait_until="networkidle", timeout=30000)
        page.wait_for_timeout(3000)
        print("    Page loaded successfully")

        # Screenshot 1: Initial mobile view (hero)
        page.screenshot(path="/Users/prueba/Desktop/LandingOroAzul/qa-mobile-initial-hero.png")
        print("\n[2] Screenshot: Initial hero view saved")

        # Check for canvas/water animation
        print("\n[3] Checking water/background animation...")
        canvas_info = page.evaluate("""
            () => {
                const canvas = document.querySelector('canvas');
                if (!canvas) return { found: false };

                const ctx = canvas.getContext('webgl2') || canvas.getContext('webgl');
                return {
                    found: true,
                    width: canvas.width,
                    height: canvas.height,
                    style: {
                        width: canvas.style.width,
                        height: canvas.style.height,
                        position: window.getComputedStyle(canvas).position,
                        zIndex: window.getComputedStyle(canvas).zIndex,
                        opacity: window.getComputedStyle(canvas).opacity
                    },
                    hasWebGL: !!ctx
                };
            }
        """)
        print(f"    Canvas found: {canvas_info}")

        # Check if animation is running
        animation_check = page.evaluate("""
            () => {
                const canvas = document.querySelector('canvas');
                if (!canvas) return { animated: false, reason: 'No canvas' };

                try {
                    const dataUrl = canvas.toDataURL();
                    return {
                        animated: true,
                        hasContent: dataUrl.length > 100,
                        canvasSize: { w: canvas.width, h: canvas.height }
                    };
                } catch (e) {
                    return { animated: false, reason: e.message };
                }
            }
        """)
        print(f"    Animation status: {animation_check}")

        # Test scrolling - check for flickering
        print("\n[4] Testing scroll behavior for flickering...")
        scroll_tests = []
        for i in range(5):
            page.evaluate(f"window.scrollTo(0, {i * 500})")
            page.wait_for_timeout(500)
            scroll_state = page.evaluate("""
                () => {
                    const hero = document.querySelector('#inicio');
                    const beneficios = document.querySelector('#beneficios');
                    const canvas = document.querySelector('canvas');

                    return {
                        scrollY: window.scrollY,
                        heroOpacity: hero ? window.getComputedStyle(hero).opacity : null,
                        beneficiosOpacity: beneficios ? window.getComputedStyle(beneficios).opacity : null,
                        canvasOpacity: canvas ? window.getComputedStyle(canvas).opacity : null,
                        anyVisible: {
                            hero: hero ? hero.offsetParent !== null : null,
                            beneficios: beneficios ? beneficios.offsetParent !== null : null
                        }
                    };
                }
            """)
            scroll_tests.append(scroll_state)

        # Screenshots at different scroll positions
        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(500)
        page.screenshot(path="/Users/prueba/Desktop/LandingOroAzul/qa-mobile-scroll-0.png")

        page.evaluate("window.scrollTo(0, 500)")
        page.wait_for_timeout(500)
        page.screenshot(path="/Users/prueba/Desktop/LandingOroAzul/qa-mobile-scroll-500.png")

        page.evaluate("window.scrollTo(0, 1500)")
        page.wait_for_timeout(500)
        page.screenshot(path="/Users/prueba/Desktop/LandingOroAzul/qa-mobile-scroll-1500.png")

        page.evaluate("window.scrollTo(0, 2500)")
        page.wait_for_timeout(500)
        page.screenshot(path="/Users/prueba/Desktop/LandingOroAzul/qa-mobile-scroll-2500.png")

        page.evaluate("window.scrollTo(0, 4000)")
        page.wait_for_timeout(500)
        page.screenshot(path="/Users/prueba/Desktop/LandingOroAzul/qa-mobile-scroll-4000.png")

        print(f"    Captured 5 scroll position screenshots")

        # Check for flickering issues
        flickering_issues = []
        for idx, state in enumerate(scroll_tests):
            if state['heroOpacity'] == '0' or state['canvasOpacity'] == '0':
                flickering_issues.append(f"Scroll {idx}: elements became invisible")

        print(f"    Flickering check: {'ISSUES FOUND' if flickering_issues else 'No flickering detected'}")
        for issue in flickering_issues:
            print(f"      - {issue}")

        # Full page screenshot
        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(1000)
        page.screenshot(path="/Users/prueba/Desktop/LandingOroAzul/qa-mobile-fullpage.png", full_page=True)
        print("\n[5] Full page screenshot saved")

        # Check all sections visibility
        print("\n[6] Checking section visibility...")
        sections_check = page.evaluate("""
            () => {
                const sections = ['inicio', 'beneficios', 'horarios', 'precios', 'galeria', 'testimonios', 'faq', 'contacto'];
                return sections.map(id => {
                    const el = document.getElementById(id) || document.querySelector(`#${id}`);
                    if (!el) return { id, found: false };
                    const cs = window.getComputedStyle(el);
                    return {
                        id,
                        found: true,
                        visible: el.offsetParent !== null || window.getComputedStyle(el).display !== 'none',
                        opacity: cs.opacity,
                        display: cs.display,
                        visibility: cs.visibility
                    };
                });
            }
        """)
        for s in sections_check:
            status = "OK" if s.get('visible') and s.get('opacity') != '0' else "ISSUE"
            print(f"    [{status}] Section {s['id']}: visible={s.get('visible')}, opacity={s.get('opacity')}")

        # Console errors report
        print("\n[7] Console errors check...")
        error_count = len([m for m in console_messages if m['type'] == 'error'])
        print(f"    Total console errors: {error_count}")
        if console_errors:
            print("    Error messages:")
            for err in console_errors[:10]:
                print(f"      - {err[:200]}")

        # Mobile-specific layout issues
        print("\n[8] Mobile layout check...")
        layout_issues = page.evaluate("""
            () => {
                const issues = [];
                const hasHorizontalScroll = document.documentElement.scrollWidth > document.documentElement.clientWidth;

                const allText = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a');
                const smallText = [];
                allText.forEach(el => {
                    const fontSize = parseFloat(window.getComputedStyle(el).fontSize);
                    if (fontSize < 12) smallText.push({ tag: el.tagName, size: fontSize });
                });

                const smallButtons = document.querySelectorAll('button, a, [role="button"]');
                const untouchable = [];
                smallButtons.forEach(btn => {
                    const rect = btn.getBoundingClientRect();
                    if (rect.width < 44 || rect.height < 44) {
                        untouchable.push({
                            tag: btn.tagName,
                            width: Math.round(rect.width),
                            height: Math.round(rect.height)
                        });
                    }
                });

                return {
                    hasHorizontalScroll,
                    smallTextCount: smallText.length,
                    smallText: smallText.slice(0, 5),
                    untouchableButtons: untouchable.slice(0, 5)
                };
            }
        """)
        print(f"    Horizontal scroll: {layout_issues['hasHorizontalScroll']}")
        print(f"    Small text elements (<12px): {layout_issues['smallTextCount']}")
        print(f"    Untouchable buttons (<44px): {len(layout_issues['untouchableButtons'])}")
        if layout_issues['untouchableButtons']:
            print(f"    Sample untouchable: {layout_issues['untouchableButtons'][:3]}")

        print("\n" + "=" * 60)
        print("MOBILE QA TEST COMPLETE")
        print("=" * 60)

        page.screenshot(path="/Users/prueba/Desktop/LandingOroAzul/qa-mobile-final-fullpage.png", full_page=True)

        browser.close()

        return {
            'flickering_issues': flickering_issues,
            'console_errors': console_errors,
            'layout_issues': layout_issues
        }

if __name__ == "__main__":
    results = qa_mobile_test()
    print(f"\nResults: {len(results['console_errors'])} console errors, {len(results['flickering_issues'])} flickering issues")
