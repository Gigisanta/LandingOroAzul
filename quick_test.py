#!/usr/bin/env python3
"""Quick test for hero text-shadow."""
import sys
sys.path.insert(0, '/Users/prueba/.kilo/skills/webapp-testing')

from playwright.sync_api import sync_playwright

PAGE_URL = "http://localhost:3000"

def quick_test():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        page.goto(PAGE_URL, wait_until="domcontentloaded", timeout=30000)
        page.wait_for_timeout(5000)  # Wait for hydration and animations

        # Check hero h1 text-shadow
        result = page.evaluate("""
            () => {
                const span = document.querySelector('#inicio h1 span');
                if (!span) return { error: 'No span found' };
                const cs = window.getComputedStyle(span);
                return {
                    textContent: span.textContent,
                    textShadow: cs.textShadow,
                    color: cs.color,
                    style_textShadow: span.style.textShadow
                };
            }
        """)

        print("Hero span check:")
        print(f"  textContent: {result.get('textContent')}")
        print(f"  textShadow (computed): {result.get('textShadow')}")
        print(f"  color: {result.get('color')}")
        print(f"  inline style.textShadow: {result.get('style_textShadow')}")

        # Check all spans in hero
        all_shadows = page.evaluate("""
            () => {
                const spans = document.querySelectorAll('#inicio span');
                const results = [];
                spans.forEach(s => {
                    const cs = window.getComputedStyle(s);
                    results.push({
                        text: s.textContent?.substring(0, 30),
                        textShadow: cs.textShadow,
                        color: cs.color
                    });
                });
                return results;
            }
        """)

        print("\nAll spans in hero:")
        for s in all_shadows:
            print(f"  {s}")

        browser.close()

if __name__ == "__main__":
    quick_test()