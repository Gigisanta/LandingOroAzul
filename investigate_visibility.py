#!/usr/bin/env python3
"""Deep investigation of text visibility issues."""
import sys
sys.path.insert(0, '/Users/prueba/.kilo/skills/webapp-testing')

from playwright.sync_api import sync_playwright

PAGE_URL = "http://localhost:3000"

def investigate_visibility():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1440, "height": 900})

        console_errors = []
        console_warnings = []
        page.on("console", lambda msg: (
            console_errors.append(f"[{msg.type}] {msg.text}") if msg.type == "error"
            else console_warnings.append(f"[{msg.type}] {msg.text}") if msg.type == "warning"
            else None
        ))

        page_errors = []
        page.on("pageerror", lambda err: page_errors.append(str(err)))

        print("=" * 70)
        print("INVESTIGATING TEXT VISIBILITY")
        print("=" * 70)

        page.goto(PAGE_URL, wait_until="networkidle", timeout=30000)
        page.wait_for_timeout(3000)

        # 1. Check font loading
        print("\n[1] FONT LOADING STATUS:")
        font_check = page.evaluate("""
            () => {
                const fonts = document.fonts;
                const results = [];
                fonts.forEach(font => {
                    results.push({
                        family: font.family,
                        status: font.status,
                        weight: font.weight
                    });
                });
                return results;
            }
        """)
        print(f"   Loaded fonts: {font_check}")

        # 2. Check computed styles for hero text
        print("\n[2] HERO TEXT COMPUTED STYLES:")
        hero_text_styles = page.evaluate("""
            () => {
                const h1 = document.querySelector('#inicio h1');
                if (!h1) return { error: 'No h1 found' };
                const cs = window.getComputedStyle(h1);
                const parent = h1.parentElement;
                const parentCs = window.getComputedStyle(parent);
                return {
                    h1: {
                        color: cs.color,
                        backgroundColor: cs.backgroundColor,
                        fontSize: cs.fontSize,
                        fontFamily: cs.fontFamily,
                        fontWeight: cs.fontWeight,
                        opacity: cs.opacity,
                        visibility: cs.visibility,
                        display: cs.display,
                        lineHeight: cs.lineHeight,
                        position: cs.position,
                        zIndex: cs.zIndex,
                        textShadow: cs.textShadow,
                        WebkitTextStroke: cs.WebkitTextStroke,
                        fill: cs.fill
                    },
                    parent: {
                        className: parent.className,
                        position: parentCs.position,
                        zIndex: parentCs.zIndex,
                        opacity: parentCs.opacity
                    }
                };
            }
        """)
        print(f"   H1 styles: {hero_text_styles}")

        # 3. Check ALL text elements color
        print("\n[3] ALL TEXT COLORS IN HERO:")
        hero_text_colors = page.evaluate("""
            () => {
                const section = document.querySelector('#inicio');
                if (!section) return { error: 'No #inicio found' };
                const allText = section.querySelectorAll('*');
                const colors = [];
                const seen = new Set();
                allText.forEach(el => {
                    const cs = window.getComputedStyle(el);
                    const color = cs.color;
                    const bg = cs.backgroundColor;
                    const key = color + '-' + bg;
                    if (!seen.has(key)) {
                        seen.add(key);
                        colors.push({
                            tag: el.tagName,
                            className: el.className.substring(0, 50),
                            color: color,
                            backgroundColor: bg,
                            opacity: cs.opacity
                        });
                    }
                });
                return colors;
            }
        """)
        for c in hero_text_colors[:15]:
            print(f"   {c['tag']}: color={c['color']}, bg={c['backgroundColor']}, opacity={c['opacity']}")

        # 4. Check stacking context and z-index
        print("\n[4] STACKING CONTEXT ANALYSIS:")
        stacking = page.evaluate("""
            () => {
                const fixedElements = document.querySelectorAll('.fixed, [style*="fixed"]');
                const results = [];
                fixedElements.forEach(el => {
                    const cs = window.getComputedStyle(el);
                    results.push({
                        tag: el.tagName,
                        className: el.className.substring(0, 40),
                        id: el.id,
                        zIndex: cs.zIndex,
                        position: cs.position,
                        opacity: cs.opacity
                    });
                });
                return results;
            }
        """)
        print(f"   Fixed elements: {stacking}")

        # 5. Check if canvas is covering content
        print("\n[5] CANVAS vs CONTENT OVERLAP:")
        overlap_check = page.evaluate("""
            () => {
                const canvas = document.querySelector('canvas');
                const mainContent = document.querySelector('#main-content');
                if (!canvas || !mainContent) return { error: 'Missing elements' };

                const canvasRect = canvas.getBoundingClientRect();
                const contentRect = mainContent.getBoundingClientRect();

                return {
                    canvas: {
                        rect: canvasRect,
                        zIndex: window.getComputedStyle(canvas).zIndex,
                        pointerEvents: window.getComputedStyle(canvas).pointerEvents
                    },
                    content: {
                        rect: contentRect,
                        zIndex: window.getComputedStyle(mainContent).zIndex
                    },
                    overlap: !(canvasRect.bottom < contentRect.top || canvasRect.top > contentRect.bottom)
                };
            }
        """)
        print(f"   Overlap check: {overlap_check}")

        # 6. Check the Scene wrapper div
        print("\n[6] SCENE WRAPPER:")
        scene_wrapper = page.evaluate("""
            () => {
                const sceneDiv = document.querySelector('.fixed.inset-0.z-0');
                if (!sceneDiv) return 'Not found';
                const cs = window.getComputedStyle(sceneDiv);
                return {
                    zIndex: cs.zIndex,
                    position: cs.position,
                    opacity: cs.opacity,
                    pointerEvents: cs.pointerEvents,
                    children: sceneDiv.children.length
                };
            }
        """)
        print(f"   Scene wrapper: {scene_wrapper}")

        # 7. Check navigation z-index
        print("\n[7] NAVIGATION z-INDEX:")
        nav_z = page.evaluate("""
            () => {
                const nav = document.querySelector('nav');
                if (!nav) return 'No nav found';
                const cs = window.getComputedStyle(nav);
                return {
                    zIndex: cs.zIndex,
                    position: cs.position,
                    opacity: cs.opacity
                };
            }
        """)
        print(f"   Nav: {nav_z}")

        # 8. Take screenshot
        print("\n[8] Taking screenshot...")
        page.screenshot(path="/tmp/text_visibility.png", full_page=True)
        page.screenshot(path="/tmp/text_visibility_viewport.png")
        print("   Screenshots saved")

        # 9. Check for JavaScript errors that might prevent rendering
        print("\n[9] JS ERRORS:")
        if page_errors:
            for err in page_errors:
                print(f"   ERROR: {err}")
        else:
            print("   No page errors!")

        # 10. Check network fonts
        print("\n[10] FONT NETWORK REQUESTS:")
        fonts_loaded = page.evaluate("""
            () => {
                const styles = Array.from(document.styleSheets);
                const fontFaces = [];
                styles.forEach(sheet => {
                    try {
                        const rules = Array.from(sheet.cssRules || []);
                        rules.forEach(rule => {
                            if (rule instanceof CSSFontFaceRule) {
                                fontFaces.push({
                                    family: rule.style.fontFamily,
                                    src: rule.style.src
                                });
                            }
                        });
                    } catch (e) {}
                });
                return fontFaces;
            }
        """)
        print(f"   Font faces: {fontFaces_loaded}")

        # 11. Check body background
        print("\n[11] BODY & HTML STYLES:")
        body_html = page.evaluate("""
            () => {
                const body = document.body;
                const html = document.documentElement;
                const bodyCs = window.getComputedStyle(body);
                const htmlCs = window.getComputedStyle(html);
                return {
                    body: {
                        background: bodyCs.background,
                        backgroundColor: bodyCs.backgroundColor,
                        color: bodyCs.color,
                        opacity: bodyCs.opacity
                    },
                    html: {
                        background: htmlCs.background,
                        backgroundColor: htmlCs.backgroundColor
                    }
                };
            }
        """)
        print(f"   Body/HTML: {body_html}")

        # 12. Check the loading state
        print("\n[12] HYDRATION STATE:")
        hydration = page.evaluate("""
            () => {
                const main = document.querySelector('#main-content');
                if (!main) return { error: 'No main' };
                const children = Array.from(main.children).map(c => c.tagName);
                const hasNav = main.querySelector('nav') !== null;
                const hasSections = main.querySelectorAll('section').length;
                return {
                    children: children,
                    hasNav: hasNav,
                    sectionCount: hasSections,
                    innerHTML_length: main.innerHTML.length
                };
            }
        """)
        print(f"   Hydration: {hydration}")

        print("\n" + "=" * 70)
        print("INVESTIGATION COMPLETE")
        print("=" * 70)

        browser.close()

if __name__ == "__main__":
    investigate_visibility()