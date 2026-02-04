import { test, expect } from '@playwright/test';

test('basic test - verify app loads', async ({ page }) => {
  await page.goto('/');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Check that the homepage has the title
  await expect(page.locator('h1')).toContainText('Way Finder');
  
  console.log('✅ App loaded successfully!');
});
