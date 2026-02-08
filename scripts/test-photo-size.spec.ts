import { test } from '@playwright/test';

test('check today photo size', async ({ page }) => {
  // First, seed a moment
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  
  // Seed a moment via browser console
  await page.evaluate(async () => {
    const generateId = () => crypto.randomUUID();
    
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('WayFinderEventStore');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    
    const event = {
      id: generateId(),
      aggregateId: generateId(),
      aggregateType: 'moment',
      type: 'MomentCreated',
      timestamp: Date.now(),
      version: 1,
      data: {
        photoData: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjgwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjAwIiBoZWlnaHQ9IjgwMCIgZmlsbD0iIzY2NiIvPjwvc3ZnPg==',
        caption: 'Test moment',
        createdAt: Date.now(),
      }
    };
    
    const tx = db.transaction('events', 'readwrite');
    const store = tx.objectStore('events');
    store.add(event);
    
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  });
  
  // Now go to today page
  await page.goto('http://localhost:3000/today');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Find the moment photo
  const photo = page.locator('img[alt*="Moment"]').first();
  
  // Check if visible
  const isVisible = await photo.isVisible();
  console.log('Photo visible:', isVisible);
  
  if (isVisible) {
    // Get the bounding box
    const box = await photo.boundingBox();
    console.log('Photo rendered size:', box);
    console.log('Width:', box?.width, 'Height:', box?.height);
    
    // Get computed styles
    const classes = await photo.getAttribute('class');
    console.log('Photo classes:', classes);
    
    // Get computed width/height
    const computed = await photo.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        width: style.width,
        height: style.height,
        objectFit: style.objectFit
      };
    });
    console.log('Computed styles:', computed);
  }
});
