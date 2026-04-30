#!/usr/bin/env python3
"""Playwright test for hero text visibility."""
import sys
sys.path.insert(0, '/Users/prueba/.kilo/skills/webapp-testing')

from playwright.sync_api import sync_playwright

PAGE_URL = "http://localhost:3000"

def test_hero_visibility():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)  # Visible browser
        page = browser.new_page(viewport={"width": 1440, "height": 900})

        print("=" * 60)
        print("PLAYWRIGHT HERO TEXT VISIBILITY TEST")
        print("=" * 60)

        # Navigate
        page.goto(PAGE_URL, wait_until="networkidle", timeout=30000)
        page.wait_for_timeout(3000)  # Wait for hydration

        # Take screenshot of viewport
        page.screenshot(path="/tmp/playwright_hero.png")
        print("\n[1] Screenshot saved to /tmp/playwright_hero.png")

        # Check hero elements visibility
        print("\n[2] Checking hero text elements:")

        # Check h1 text
        h1_check = page.evaluate("""
            () => {
                const h1 = document.querySelector('#inicio h1');
                if (!h1) return { error: 'No h1 found' };
                const cs = window.getComputedStyle(h1);
                return {
                    text: h1.innerText,
                    textShadow: cs.textShadow,
                    color: cs.color,
                    opacity: cs.opacity,
                    visibility: cs.visibility
                };
            }
        """)
        print(f"    H1: {h1_check}")

        # Check first span (Aprendé a nadar)
        span1 = page.evaluate("""
            () => {
                const span = document.querySelector('#inicio h1 span');
                if (!span) return { error: 'No span found' };
                const cs = window.getComputedStyle(span);
                return {
                    text: span.textContent,
                    textShadow: cs.textShadow,
                    color: cs.color
                };
            }
        """)
        print(f"    Span 1 (Aprendé a nadar): {span1}")

        # Check all text visibility
        print("\n[3] Text visibility summary:")
        all_text_visible = page.evaluate("""
            () => {
                const texts = [
                    { sel: '#inicio h1', name: 'Hero H1' },
                    { sel: '#inicio', name: 'Hero Section' },
                    { sel: '#beneficios', name: 'Benefits Section' },
                    { sel: '#horarios', name: 'Schedule Section' },
                    { sel: '#precios', name: 'Pricing Section' },
                    { sel: '#faq', name: 'FAQ Section' },
                    { sel: '#contacto', name: 'Contact Section' },
                ];
                return texts.map(t => {
                    const el = document.querySelector(t.sel);
                    if (!el) return { name: t.name, found: false };
                    const cs = window.getComputedStyle(el);
                    return {
                        name: t.name,
                        found: true,
                        visible: el.offsetParent !== null,
                        opacity: cs.opacity,
                        display: cs.display,
                        visibility: cs.visibility
                    };
                });
            }
        """)
        for t in all_text_visible:
            status = "✓" if t.get('visible') else "✗"
            print(f"    {status} {t['name']}: visible={t.get('visible')}, opacity={t.get('opacity')}")

        # Check for any elements with opacity 0 or visibility hidden
        print("\n[4] Checking for hidden/empty elements:")
        issues = page.evaluate("""
            () => {
                const issues = [];
                const sections = document.querySelectorAll('section');
                sections.forEach(s => {
                    const cs = window.getComputedStyle(s);
                    if (cs.opacity === '0' || cs.visibility === 'hidden' || cs.display === 'none') {
                        issues.push({
                            id: s.id || 'no-id',
                            opacity: cs.opacity,
                            visibility: cs.visibility,
                            display: cs.display
                        });
                    }
                });
                return issues;
            }
        """)
        if issues:
            print(f"    Found issues: {issues}")
        else:
            print("    No hidden sections found!")

        # Check canvas and content overlap
        print("\n[5] Canvas vs Content:")
        overlap = page.evaluate("""
            () => {
                const canvas = document.querySelector('canvas');
                const hero = document.querySelector('#inicio');
                if (!canvas || !hero) return { error: 'Missing elements' };

                const canvasZ = window.getComputedStyle(canvas).zIndex;
                const heroZ = window.getComputedStyle(hero).zIndex;

                return {
                    canvasZIndex: canvasZ,
                    heroZIndex: heroZ,
                    canvasPointerEvents: window.getComputedStyle(canvas).pointerEvents,
                    heroPosition: window.getComputedStyle(hero).position
                };
            }
        """)
        print(f"    {overlap}")

        # Final screenshot
        page.screenshot(path="/tmp/playwright_final.png", full_page=True)
        print("\n[6] Full page screenshot saved to /tmp/playwright_final.png")

        print("\n" + "=" * 60)
        print("TEST COMPLETE")
        print("=" * 60)

        browser.close()

if __name__ == "__main__":
    test_hero_visibility()