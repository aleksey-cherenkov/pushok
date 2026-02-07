/**
 * Inspect IndexedDB in Edge
 * 
 * Connects to Edge and dumps the database structure
 * so we can see what real events look like.
 */

import { test } from '@playwright/test';

test('inspect Edge IndexedDB', async ({ }) => {
  // Use Edge browser
  const { chromium } = require('@playwright/test');
  const browser = await chromium.launch({ 
    channel: 'msedge',
    headless: false 
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');

  console.log('\n🔍 Inspecting IndexedDB...\n');

  // Get all database names
  const databases = await page.evaluate(async () => {
    const dbs = await indexedDB.databases();
    return dbs.map(db => db.name);
  });

  console.log('📦 Databases found:', databases);

  // Inspect WayFinderEventStore
  const structure = await page.evaluate(async () => {
    return new Promise((resolve) => {
      const request = indexedDB.open('WayFinderEventStore');
      
      request.onsuccess = async () => {
        const db = request.result;
        const storeNames = Array.from(db.objectStoreNames);
        
        console.log('Store names:', storeNames);
        
        // Get sample events
        const transaction = db.transaction(['events'], 'readonly');
        const store = transaction.objectStore('events');
        const allEvents = await new Promise<any[]>((res) => {
          const req = store.getAll();
          req.onsuccess = () => res(req.result);
        });

        resolve({
          version: db.version,
          storeNames,
          eventCount: allEvents.length,
          sampleEvents: allEvents.slice(0, 3), // First 3 events
          allEventTypes: [...new Set(allEvents.map((e: any) => e.type))],
        });
      };
    });
  });

  console.log('\n📊 Database Structure:');
  console.log(JSON.stringify(structure, null, 2));

  console.log('\n✅ Inspection complete!');
  console.log('Check the output above to see the event structure.');

  await page.waitForTimeout(5000);
  await browser.close();
});
