import { test, expect } from '@playwright/test';

test('verify trend calculation with seed data', async ({ page }) => {
  // Navigate to habits page
  await page.goto('http://localhost:3000/habits');
  
  // Wait for page to load
  await page.waitForTimeout(2000);
  
  // Find "Daily Pushups" habit and click it
  const pushupsCard = page.locator('text=Daily Pushups').first();
  await pushupsCard.click();
  
  // Wait for detail page to load
  await page.waitForTimeout(2000);
  
  // Take screenshot
  await page.screenshot({ path: 'test-results/trend-check.png', fullPage: true });
  
  // Check what trend is displayed
  const trendElement = page.locator('text=/Trend/').locator('..').locator('div').last();
  const trendText = await trendElement.textContent();
  
  console.log('Trend displayed:', trendText);
  
  // Get activities from console
  await page.evaluate(() => {
    const activities = JSON.parse(localStorage.getItem('pushok-activities') || '[]');
    console.log('Activities in localStorage:', activities);
  });
});
