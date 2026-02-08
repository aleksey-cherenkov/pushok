/**
 * Simple Test: Create ONE habit via UI, then inspect IndexedDB
 */

import { test } from '@playwright/test';

test('create one habit and inspect DB', async ({ page }) => {
  test.setTimeout(120000);

  console.log('🚀 Testing UI data creation...\n');

  // Go to habits page
  await page.goto('http://localhost:3000/habits');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  console.log('📝 Step 1: Click + New Habit');
  await page.click('text=New Habit');
  await page.waitForTimeout(1500);

  console.log('✍️ Step 2: Enter habit text');
  const textarea = page.locator('textarea').first();
  await textarea.fill('Morning pushups - 20 reps daily');
  await page.waitForTimeout(500);

  console.log('✨ Step 3: Click Generate Habit');
  await page.click('button:has-text("Generate Habit")');
  console.log('⏳ Waiting 25 seconds for AI...');
  await page.waitForTimeout(25000);

  console.log('💾 Step 4: Click Create Habit');
  const createButton = page.locator('button:has-text("Create Habit")');
  if (await createButton.isVisible()) {
    await createButton.click();
    await page.waitForTimeout(2000);
    console.log('✅ Habit created!');
  } else {
    console.log('❌ Create Habit button not found');
  }

  // Inspect IndexedDB
  console.log('\n🔍 Inspecting IndexedDB...');
  const dbData = await page.evaluate(async () => {
    return new Promise((resolve) => {
      const request = indexedDB.open('way-finder-db', 1);
      
      request.onsuccess = () => {
        const db = request.result;
        
        if (!db.objectStoreNames.contains('events')) {
          resolve({ error: 'No events store found', stores: Array.from(db.objectStoreNames) });
          return;
        }

        const tx = db.transaction('events', 'readonly');
        const store = tx.objectStore('events');
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = () => {
          const events = getAllRequest.result;
          resolve({
            total: events.length,
            eventTypes: events.map((e: any) => e.eventType || e.type),
            firstEvent: events[0] ? {
              type: events[0].eventType || events[0].type,
              aggregateType: events[0].aggregateType,
              timestamp: events[0].timestamp
            } : null
          });
        };
      };

      request.onerror = () => {
        resolve({ error: 'Failed to open DB' });
      };
    });
  });

  console.log('\n📊 IndexedDB Contents:');
  console.log(JSON.stringify(dbData, null, 2));

  // Keep browser open to inspect
  console.log('\n⏸️ Pausing for 60 seconds - inspect the browser...');
  await page.waitForTimeout(60000);
});
