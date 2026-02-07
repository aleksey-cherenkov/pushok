/**
 * Test: Create 1 Habit via UI
 * 
 * Verifies Playwright can interact with the UI to create a habit
 * and that the habit appears on the page.
 * 
 * Run with: npx playwright test scripts/test-create-habit.spec.ts --headed
 */

import { test, expect } from '@playwright/test';

test.describe('UI Creation Test', () => {
  test('create one habit via UI and verify it appears', async ({ page }) => {
    test.setTimeout(120000); // 2 minutes

    console.log('\n🧪 TEST: Creating 1 habit via UI\n');

    // Navigate to habits page
    await page.goto('http://localhost:3000/habits');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('📸 Screenshot 1: Initial habits page');
    await page.screenshot({ path: 'test-results/01-initial-habits-page.png' });

    // Find and click Create Habit button
    console.log('🔍 Looking for "+ New Habit" button...');
    const createButton = page.locator('button').filter({ hasText: 'New Habit' });
    
    const buttonExists = await createButton.isVisible({ timeout: 5000 }).catch(() => false);
    console.log(`Button found: ${buttonExists}`);

    if (!buttonExists) {
      console.log('❌ ERROR: Create Habit button not found');
      console.log('Page content:', await page.content());
      throw new Error('Create Habit button not visible');
    }

    await createButton.click();
    await page.waitForTimeout(1500);

    console.log('📸 Screenshot 2: Create modal opened');
    await page.screenshot({ path: 'test-results/02-create-modal.png' });

    // Fill in the form
    console.log('✍️ Filling form...');
    
    // Title
    const titleInput = page.locator('input[type="text"]').first();
    await titleInput.fill('Test Pushups');
    await page.waitForTimeout(500);

    // Metric (select dropdown)
    const metricSelect = page.locator('select').first();
    await metricSelect.selectOption('count');
    await page.waitForTimeout(500);

    // Target
    const targetInput = page.locator('input[type="number"]').first();
    await targetInput.fill('30');
    await page.waitForTimeout(500);

    console.log('📸 Screenshot 3: Form filled');
    await page.screenshot({ path: 'test-results/03-form-filled.png' });

    // Submit
    console.log('🚀 Submitting form...');
    const submitButton = page.locator('button').filter({ hasText: /create.*habit/i }).last();
    await submitButton.click();
    await page.waitForTimeout(2000);

    console.log('📸 Screenshot 4: After submission');
    await page.screenshot({ path: 'test-results/04-after-submit.png' });

    // Verify habit appears
    console.log('🔍 Verifying "Test Pushups" appears...');
    const habitCard = page.locator('text=Test Pushups');
    const habitVisible = await habitCard.isVisible({ timeout: 5000 }).catch(() => false);

    if (habitVisible) {
      console.log('✅ SUCCESS: Habit created and visible!');
      console.log('📸 Screenshot 5: Habit visible');
      await page.screenshot({ path: 'test-results/05-habit-visible.png' });
    } else {
      console.log('❌ FAILED: Habit not visible after creation');
      console.log('Page content:', await page.textContent('body'));
      throw new Error('Habit not visible after creation');
    }

    console.log('\n✅ TEST PASSED: UI creation works!\n');
    console.log('Next step: Scale to create multiple habits + activities');
  });
});
