import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

// Desktop view for detailed checks
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await page.screenshot({ path: '/tmp/audit-hero-desktop.png', fullPage: false });

// Scroll to Gallery section
await page.evaluate(() => document.querySelector('#galeria')?.scrollIntoView());
await page.waitForTimeout(1000);
await page.screenshot({ path: '/tmp/audit-gallery-desktop.png', fullPage: false });

// Scroll to Schedule section
await page.evaluate(() => document.querySelector('#horarios')?.scrollIntoView());
await page.waitForTimeout(1000);
await page.screenshot({ path: '/tmp/audit-schedule-desktop.png', fullPage: false });

// Scroll to Testimonials section
await page.evaluate(() => document.querySelector('#testimonios')?.scrollIntoView());
await page.waitForTimeout(1000);
await page.screenshot({ path: '/tmp/audit-testimonials-desktop.png', fullPage: false });

// Scroll to Pricing section
await page.evaluate(() => document.querySelector('#precios')?.scrollIntoView());
await page.waitForTimeout(1000);
await page.screenshot({ path: '/tmp/audit-pricing-desktop.png', fullPage: false });

// Scroll to Contact section
await page.evaluate(() => document.querySelector('#contacto')?.scrollIntoView());
await page.waitForTimeout(1000);
await page.screenshot({ path: '/tmp/audit-contact-desktop.png', fullPage: false });

console.log('Detailed screenshots captured');

await browser.close();