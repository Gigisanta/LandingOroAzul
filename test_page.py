from playwright.sync_api import sync_playwright

errors = []
warnings = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()

    # Capture console messages
    def handle_console(msg):
        if msg.type == 'error':
            errors.append(f"ERROR: {msg.text}")
        elif msg.type == 'warning':
            warnings.append(f"WARNING: {msg.text}")

    page.on("console", handle_console)

    # Capture page errors
    def handle_page_error(err):
        errors.append(f"PAGE ERROR: {err}")

    page.on("pageerror", handle_page_error)

    try:
        page.goto('http://localhost:3000', wait_until='networkidle', timeout=30000)
        page.wait_for_timeout(3000)  # Wait for animations

        # Take screenshot
        page.screenshot(path='/tmp/landing_page.png', full_page=True)
        print("Screenshot saved to /tmp/landing_page.png")

        # Check page content
        h1 = page.locator('h1').first
        if h1.is_visible():
            print(f"H1 visible: {h1.text_content()}")
        else:
            print("H1 NOT visible")

        # Check for main sections
        sections = ['inicio', 'beneficios', 'horarios', 'precios']
        for section_id in sections:
            section = page.locator(f'#{section_id}')
            if section.count() > 0:
                print(f"Section #{section_id} exists")
            else:
                print(f"Section #{section_id} NOT found")

        # Check hero visibility
        hero = page.locator('#inicio')
        if hero.is_visible():
            print("Hero section is visible")
        else:
            print("Hero section NOT visible")

    except Exception as e:
        print(f"Error: {e}")

    finally:
        browser.close()

    print("\n=== Console Errors ===")
    for err in errors[:10]:
        print(err)

    print("\n=== Console Warnings (first 5) ===")
    for warn in warnings[:5]:
        print(warn)
