/**
 * UI Flow Documentation Script
 * 
 * Scans localhost:3000 with user's EXISTING data
 * Documents actual UI state and interaction flows
 * 
 * Run: npx playwright test scripts/document-ui.spec.ts --headed
 */

import { test } from '@playwright/test';
import { chromium } from '@playwright/test';

test.describe('Document Way Finder UI', () => {
  test('scan and document actual UI with user data', async ({ }) => {
    test.setTimeout(180000); // 3 minutes

    console.log('\n📋 DOCUMENTING UI FLOW\n');
    console.log('Connecting to Edge with your existing data...\n');

    // Connect to Edge browser
    const browser = await chromium.launch({
      channel: 'msedge',
      headless: false,
    });

    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
    });

    const page = await context.newPage();

    // Navigate to habits page
    console.log('📍 Navigating to /habits...');
    await page.goto('http://localhost:3000/habits');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Take screenshot of current state
    console.log('📸 Screenshot: Habits page (with your data)');
    await page.screenshot({ 
      path: 'test-results/ui-docs-01-habits-page.png',
      fullPage: true 
    });

    // Document what's visible
    console.log('\n🔍 Analyzing page content...');
    
    const pageTitle = await page.locator('h1').textContent();
    console.log(`Title: ${pageTitle}`);

    const habitCards = await page.locator('[class*="border"]').count();
    console.log(`Habit cards found: ${habitCards}`);

    // Look for buttons
    const buttons = await page.locator('button').all();
    console.log(`\nButtons found: ${buttons.length}`);
    for (let i = 0; i < Math.min(buttons.length, 10); i++) {
      const text = await buttons[i].textContent();
      console.log(`  Button ${i + 1}: "${text?.trim()}"`);
    }

    // Look for input fields
    const inputs = await page.locator('input').all();
    console.log(`\nInput fields found: ${inputs.length}`);
    for (let i = 0; i < inputs.length; i++) {
      const type = await inputs[i].getAttribute('type');
      const placeholder = await inputs[i].getAttribute('placeholder');
      console.log(`  Input ${i + 1}: type="${type}", placeholder="${placeholder}"`);
    }

    console.log('\n📋 TESTING HABIT CREATION FLOW\n');
    console.log('Step 1: Click "+ New Habit" button\n');

    const newHabitBtn = page.locator('button').filter({ hasText: 'New Habit' });
    const btnVisible = await newHabitBtn.isVisible({ timeout: 3000 }).catch(() => false);
    
    if (btnVisible) {
      console.log('✅ Found "+ New Habit" button');
      await newHabitBtn.click();
      await page.waitForTimeout(2000);
      
      console.log('📸 Screenshot: Modal/Form opened');
      await page.screenshot({ path: 'test-results/ui-docs-02-modal-opened.png' });

      // Now look for the input field
      const habitInput = page.locator('input[type="text"], textarea').first();
      const inputVisible = await habitInput.isVisible({ timeout: 3000 }).catch(() => false);
      
      if (inputVisible) {
        console.log('✅ Found text input field');
        
        // Type in the field
        await habitInput.fill('Morning Exercise');
        await page.waitForTimeout(1000);
        
        console.log('📸 Screenshot: Text entered');
        await page.screenshot({ path: 'test-results/ui-docs-03-text-entered.png' });

        // Look for "Generate" button
        const buttons = await page.locator('button').all();
        console.log('\n🔍 Available buttons after typing:');
        for (const btn of buttons) {
          const text = await btn.textContent();
          console.log(`  - "${text?.trim()}"`);
        }

        const generateBtn = page.locator('button').filter({ hasText: /generate/i });
        const generateVisible = await generateBtn.isVisible({ timeout: 3000 }).catch(() => false);
        
        if (generateVisible) {
          console.log('\n✅ Found "Generate" button');
          await generateBtn.click();
          await page.waitForTimeout(3000);
          
          console.log('📸 Screenshot: After Generate clicked');
          await page.screenshot({ path: 'test-results/ui-docs-04-after-generate.png' });

          // Wait for AI response
          console.log('⏳ Waiting for AI suggestions...');
          await page.waitForTimeout(5000);
          
          console.log('📸 Screenshot: AI suggestions (if appeared)');
          await page.screenshot({ path: 'test-results/ui-docs-05-ai-response.png' });

          // Look for option cards or save buttons
          const allText = await page.textContent('body');
          if (allText?.includes('option') || allText?.includes('suggestion')) {
            console.log('✅ AI suggestions appeared!');
          }

          // Look for save/create buttons
          const finalButtons = await page.locator('button').all();
          console.log('\n🔍 Final buttons visible:');
          for (const btn of finalButtons) {
            const text = await btn.textContent();
            const isVisible = await btn.isVisible().catch(() => false);
            if (isVisible) {
              console.log(`  - "${text?.trim()}"`);
            }
          }

        } else {
          console.log('❌ "Generate" button not found');
          console.log('This might use a different button name');
        }

      } else {
        console.log('❌ Text input not visible after clicking button');
      }

    } else {
      console.log('❌ "+ New Habit" button not found');
    }

    console.log('\n✅ DOCUMENTATION COMPLETE');
    console.log('📁 Screenshots saved to test-results/');
    console.log('   - ui-docs-01-habits-page.png');
    console.log('   - ui-docs-02-text-entered.png');
    console.log('   - ui-docs-03-after-generate.png');
    console.log('   - ui-docs-04-ai-suggestions.png\n');

    console.log('Review screenshots to see actual UI state!');
    
    await page.waitForTimeout(3000);
    await browser.close();
  });
});
