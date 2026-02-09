import { test, expect } from '@playwright/test';

test('test habit creation on live site', async ({ page }) => {
  // Enable console logging to catch errors
  page.on('console', msg => {
    console.log(`[Browser ${msg.type()}]:`, msg.text());
  });
  
  page.on('pageerror', error => {
    console.error(`[Browser Error]:`, error.message);
  });

  // Navigate to live site
  await page.goto('https://pushok.life/habits');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  console.log('Page loaded, taking screenshot...');
  await page.screenshot({ path: 'test-results/live-habits-page.png', fullPage: true });

  // Try to create a habit
  console.log('Looking for Create Habit button...');
  
  // Check if button exists
  const createButton = page.locator('button:has-text("New Habit"), button:has-text("Create")');
  const buttonCount = await createButton.count();
  console.log(`Found ${buttonCount} create buttons`);

  if (buttonCount > 0) {
    await createButton.first().click();
    await page.waitForTimeout(2000);
    
    console.log('Create button clicked, checking form...');
    await page.screenshot({ path: 'test-results/live-habit-form.png', fullPage: true });

    // Check if form is visible
    const formVisible = await page.locator('form').isVisible().catch(() => false);
    console.log(`Form visible: ${formVisible}`);

    // Try AI mode
    const aiInput = page.locator('textarea');
    const aiInputVisible = await aiInput.isVisible().catch(() => false);
    console.log(`AI input visible: ${aiInputVisible}`);

    if (aiInputVisible) {
      await aiInput.fill('Daily morning stretches for 10 minutes');
      await page.screenshot({ path: 'test-results/live-habit-ai-input.png', fullPage: true });
      
      // Try manual mode instead
      const manualButton = page.locator('button:has-text("Manual")');
      const manualButtonVisible = await manualButton.isVisible().catch(() => false);
      
      if (manualButtonVisible) {
        console.log('Switching to manual mode...');
        await manualButton.click();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'test-results/live-habit-manual-form.png', fullPage: true });

        // Fill manual form
        await page.fill('input[id="title"]', 'Test Habit');
        await page.fill('textarea', 'Testing habit creation on live site');
        
        await page.screenshot({ path: 'test-results/live-habit-filled.png', fullPage: true });

        // Try to submit
        const submitButton = page.locator('button[type="submit"]:has-text("Create"), button:has-text("Save")');
        const submitExists = await submitButton.count();
        console.log(`Found ${submitExists} submit buttons`);

        if (submitExists > 0) {
          console.log('Clicking submit...');
          await submitButton.first().click();
          await page.waitForTimeout(3000);
          
          await page.screenshot({ path: 'test-results/live-habit-after-submit.png', fullPage: true });

          // Check if habit appears in list
          const habitList = await page.textContent('body');
          console.log('Checking if habit saved...');
          const hasSavedHabit = habitList?.includes('Test Habit');
          console.log(`Habit saved: ${hasSavedHabit}`);
        }
      }
    }
  }

  // Check IndexedDB state
  const dbState = await page.evaluate(async () => {
    return new Promise((resolve) => {
      const request = indexedDB.open('WayFinderEventStore');
      request.onsuccess = () => {
        const db = request.result;
        const stores = Array.from(db.objectStoreNames);
        
        if (stores.includes('events')) {
          const tx = db.transaction('events', 'readonly');
          const store = tx.objectStore('events');
          const getAllRequest = store.getAll();
          
          getAllRequest.onsuccess = () => {
            const events = getAllRequest.result;
            resolve({
              storeNames: stores,
              eventCount: events.length,
              habitEvents: events.filter((e: any) => e.aggregateType === 'Habit').length,
              recentEvents: events.slice(-5).map((e: any) => ({
                type: e.type,
                aggregateType: e.aggregateType,
                timestamp: e.timestamp
              }))
            });
          };
        } else {
          resolve({ storeNames: stores, eventCount: 0, error: 'No events store' });
        }
      };
      
      request.onerror = () => {
        resolve({ error: request.error?.message });
      };
    });
  });

  console.log('IndexedDB State:', JSON.stringify(dbState, null, 2));
});
