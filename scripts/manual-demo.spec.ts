/**
 * Manual Demo Recording
 * 
 * Records a demo using EXISTING data in your Edge browser.
 * Just interact with the app naturally, this captures it.
 * 
 * INSTRUCTIONS:
 * 1. Make sure Edge is open to http://localhost:3000
 * 2. Have some habits/activities already created
 * 3. Run: npx playwright test scripts/manual-demo.spec.ts
 * 4. Follow the prompts in the console
 */

import { test } from '@playwright/test';

test.describe('Manual Demo Recording', () => {
  test('record demo with manual interaction', async ({ }) => {
    test.setTimeout(300000); // 5 minutes
    
    const { chromium } = require('@playwright/test');
    const browser = await chromium.launch({ 
      channel: 'msedge',
      headless: false,
      args: ['--start-maximized']
    });
    
    // Use existing user data
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      recordVideo: {
        dir: './test-results/manual-demo',
        size: { width: 1280, height: 720 }
      }
    });
    
    const page = await context.newPage();

    console.log('\n🎬 MANUAL DEMO RECORDING');
    console.log('========================\n');
    console.log('Follow these steps:\n');
    console.log('1. I\'ll navigate to different pages');
    console.log('2. Interact naturally with the app');
    console.log('3. Video is recording everything\n');
    console.log('Starting in 3 seconds...\n');

    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Add URL banner
    await page.evaluate(() => {
      const banner = document.createElement('div');
      banner.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        background: #2563eb !important;
        color: white !important;
        padding: 12px 20px !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
        font-size: 16px !important;
        font-weight: 600 !important;
        z-index: 999999 !important;
        text-align: center !important;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3) !important;
      `;
      banner.innerHTML = '🌐 localhost:3000 — Way Finder Demo';
      document.body.prepend(banner);
      document.body.style.paddingTop = '52px';
    });

    await page.waitForTimeout(3000);

    console.log('📊 Scene 1: Dashboard (10s)');
    console.log('   → Showing charts and overview');
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(10000);

    console.log('\n📋 Scene 2: Habits (10s)');
    console.log('   → Browse your habits');
    await page.goto('http://localhost:3000/habits');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(10000);

    console.log('\n✏️ Scene 3: Today (20s)');
    console.log('   → Log an activity if you want!');
    console.log('   → Or just browse');
    await page.goto('http://localhost:3000/today');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(20000);

    console.log('\n🎯 Scene 4: Aspirations (10s)');
    await page.goto('http://localhost:3000/aspirations');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(10000);

    console.log('\nℹ️ Scene 5: About (10s)');
    await page.goto('http://localhost:3000/about');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(10000);

    console.log('\n✅ Recording complete!');
    console.log('📹 Closing and saving video...\n');

    await context.close();
    await browser.close();

    console.log('✅ Video saved to: test-results/manual-demo/');
    console.log('🎙️ Next: Add voiceover and you\'re done!\n');
  });
});
