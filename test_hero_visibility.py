#!/usr/bin/env python3
"""Test Hero visibility specifically."""
import sys
sys.path.insert(0, '/Users/prueba/.kilo/skills/webapp-testing')

from playwright.sync_api import sync_playwright

PAGE_URL = "http://localhost:3000"

def test_hero_visibility():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 900})

        page.goto(PAGE_URL, wait_until="networkidle", timeout=30000)
        page.wait_for_timeout(2000)

        print("=" * 60)
        print("HERO VISIBILITY TEST")
        print("=" * 60)

        # Check the hero heading
        hero_h1 = page.locator('#inicio h1').first
        if hero_h1.count() > 0:
            bounding = hero_h1.bounding_box()
            print(f"\n[1] Hero H1 bounding box: {bounding}")

            # Get computed styles
            styles = page.evaluate("""
                () => {
                    const h1 = document.querySelector('#inicio h1');
                    if (!h1) return null;
                    const cs = window.getComputedStyle(h1);
                    return {
                        color: cs.color,
                        fontSize: cs.fontSize,
                        fontWeight: cs.fontWeight,
                        textShadow: cs.textShadow,
                        opacity: cs.opacity,
                        visibility: cs.visibility,
                        display: cs.display,
                        position: cs.position,
                        zIndex: cs.zIndex
                    };
                }
            """)
            print(f"\n[2] H1 computed styles: {styles}")

            # Check if text is actually rendered
            text_content = hero_h1.inner_text()
            print(f"\n[3] H1 text content: '{text_content}'")

            # Check parent section
            section_styles = page.evaluate("""
                () => {
                    const section = document.querySelector('#inicio');
                    if (!section) return null;
                    const cs = window.getComputedStyle(section);
                    return {
                        position: cs.position,
                        zIndex: cs.zIndex,
                        minHeight: cs.minHeight,
                        display: cs.display,
                        visibility: cs.visibility,
                        opacity: cs.opacity,
                        backgroundColor: cs.backgroundColor,
                        background: cs.background
                    };
                }
            """)
            print(f"\n[4] #inicio section styles: {section_styles}")

            # Check the gradient overlay div
            overlay = page.evaluate("""
                () => {
                    const section = document.querySelector('#inicio');
                    const overlay = section?.querySelector('div[style*="gradient"]');
                    if (!overlay) return 'No overlay found';
                    const cs = window.getComputedStyle(overlay);
                    return {
                        style: cs.cssText,
                        position: cs.position,
                        zIndex: cs.zIndex,
                        pointerEvents: cs.pointerEvents,
                        background: cs.background
                    };
                }
            """)
            print(f"\n[5] Overlay div: {overlay}")

        # Check if there's a stacking context issue
        z_index_check = page.evaluate("""
            () => {
                const checks = [
                    { sel: '.fixed', name: 'fixed elements' },
                    { sel: '#main-content', name: 'main-content' },
                    { sel: '#inicio', name: 'inicio section' },
                ];
                return checks.map(c => {
                    const el = document.querySelector(c.sel);
                    if (!el) return { sel: c.name, found: false };
                    const cs = window.getComputedStyle(el);
                    return {
                        sel: c.name,
                        found: true,
                        position: cs.position,
                        zIndex: cs.zIndex
                    };
                });
            }
        """)
        print(f"\n[6] Z-index check: {z_index_check}")

        # Check canvas position relative to hero
        canvas_check = page.evaluate("""
            () => {
                const canvas = document.querySelector('canvas');
                if (!canvas) return 'No canvas found';
                const cs = window.getComputedStyle(canvas);
                const rect = canvas.getBoundingClientRect();
                return {
                    position: cs.position,
                    zIndex: cs.zIndex,
                    bounding: rect,
                    display: cs.display,
                    visibility: cs.visibility,
                    opacity: cs.opacity
                };
            }
        """)
        print(f"\n[7] Canvas: {canvas_check}")

        # Take a specific screenshot of the hero area
        page.screenshot(path="/tmp/hero_area.png", clip={"x": 0, "y": 0, "width": 1440, "height": 900})

        print("\n[8] Screenshot saved to /tmp/hero_area.png")
        print("=" * 60)

        browser.close()

if __name__ == "__main__":
    test_hero_visibility()