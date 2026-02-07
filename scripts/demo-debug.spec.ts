/**
 * Debug + Demo Script
 * 
 * Verifies data is seeded and visible before recording.
 * Demonstrates actual feature usage (not just viewing).
 * Slower pace for better visibility.
 * 
 * Run: npx playwright test scripts/demo-debug.spec.ts --headed
 */

import { test, expect } from '@playwright/test';

test.describe('Way Finder Demo - Debug Version', () => {
  test('verify seeding and record interactive demo', async ({ page }) => {
    test.setTimeout(300000); // 5 minutes

    console.log('\n🔍 DEBUG MODE: Running with visible browser\n');
    console.log('Watch the browser to see what\'s happening...\n');

    // Navigate and clear
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    console.log('🗑️  Clearing existing data...');
    await page.evaluate(() => {
      localStorage.clear();
      return indexedDB.deleteDatabase('WayFinderEventStore'); // Correct database name!
    });
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // SEED DATA
    console.log('📝 Seeding data...');
    await page.evaluate(async () => {
      const generateId = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };

      const createEvent = (aggregateId: string, aggregateType: string, eventType: string, payload: any, timestamp: string) => ({
        id: generateId(),
        aggregateId,
        aggregateType,
        type: eventType, // Use 'type' not 'eventType' - matches schema!
        timestamp,
        version: 1,
        payload,
        metadata: { userId: 'demo-user' },
      });

      const dbRequest = indexedDB.open('WayFinderEventStore', 1); // Correct database name!
      
      await new Promise<void>((resolve, reject) => {
        dbRequest.onerror = () => reject(dbRequest.error);
        dbRequest.onsuccess = () => resolve();
        
        dbRequest.onupgradeneeded = (event: any) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains('events')) {
            db.createObjectStore('events', { keyPath: 'id' });
          }
        };
      });

      const db = dbRequest.result;
      const events: any[] = [];

      localStorage.setItem('stela-values', JSON.stringify(['Family', 'Cats', 'Nature', 'Rest']));
      localStorage.setItem('stela-onboarding-complete', 'true');

      // Aspirations
      const aspirations = [
        { id: generateId(), title: 'Be Present & Mindful', description: 'Practice mindfulness and gratitude' },
        { id: generateId(), title: 'Build Physical Health', description: 'Move daily, build strength' },
        { id: generateId(), title: 'Technology & Learning', description: 'Continuous learning and growth' },
      ];

      aspirations.forEach(asp => {
        events.push(createEvent(asp.id, 'Aspiration', 'AspirationCreated', 
          { title: asp.title, description: asp.description }, 
          new Date('2026-01-07T10:00:00Z').toISOString()
        ));
      });

      // Habits
      const habits = [
        { id: generateId(), title: 'Morning Meditation', metric: 'duration', target: 10, aspId: aspirations[0].id },
        { id: generateId(), title: 'Pushups', metric: 'count', target: 30, aspId: aspirations[1].id },
        { id: generateId(), title: 'Running', metric: 'duration', target: 20, aspId: aspirations[1].id },
        { id: generateId(), title: 'Dev Projects', metric: 'duration', target: 60, aspId: aspirations[2].id },
      ];

      habits.forEach((habit, idx) => {
        events.push(createEvent(habit.id, 'Habit', 'HabitCreated',
          { title: habit.title, metric: habit.metric, target: habit.target, aspirationIds: [habit.aspId] },
          new Date(2026, 0, 8 + idx, 10, 0, 0).toISOString()
        ));
      });

      // Activities showing progression
      const activities = [
        // Pushups: 10 → 52
        { habitId: habits[1].id, value: 10, date: '2026-01-09' },
        { habitId: habits[1].id, value: 15, date: '2026-01-11' },
        { habitId: habits[1].id, value: 20, date: '2026-01-13' },
        { habitId: habits[1].id, value: 25, date: '2026-01-16' },
        { habitId: habits[1].id, value: 30, date: '2026-01-19' },
        { habitId: habits[1].id, value: 35, date: '2026-01-22' },
        { habitId: habits[1].id, value: 40, date: '2026-01-26' },
        { habitId: habits[1].id, value: 45, date: '2026-01-29' },
        { habitId: habits[1].id, value: 50, date: '2026-02-02' },
        // Meditation
        { habitId: habits[0].id, value: 5, date: '2026-01-09' },
        { habitId: habits[0].id, value: 10, date: '2026-01-12' },
        { habitId: habits[0].id, value: 12, date: '2026-01-15' },
        { habitId: habits[0].id, value: 15, date: '2026-01-20' },
        // Running
        { habitId: habits[2].id, value: 15, date: '2026-01-10' },
        { habitId: habits[2].id, value: 20, date: '2026-01-14' },
        { habitId: habits[2].id, value: 25, date: '2026-01-18', resistance: 'physical', resistanceNote: 'Shin splints' },
        { habitId: habits[2].id, value: 30, date: '2026-01-24' },
      ];

      activities.forEach((activity) => {
        events.push(createEvent(generateId(), 'Activity', 'ActivityLogged',
          {
            habitId: activity.habitId,
            value: activity.value,
            note: activity.note || null,
            mood: null,
            values: [],
            resistance: activity.resistance ? { type: activity.resistance, note: activity.resistanceNote } : null,
          },
          new Date(activity.date + 'T14:00:00Z').toISOString()
        ));
      });

      const transaction = db.transaction(['events'], 'readwrite');
      const objectStore = transaction.objectStore('events');

      for (const event of events) {
        objectStore.add(event);
      }

      await new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });
    });

    console.log('✅ Data seeded, reloading...');
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // VERIFY data is visible
    console.log('🔍 Verifying data loaded...');
    await page.goto('http://localhost:3000/habits');
    await page.waitForLoadState('networkidle');
    
    const pushups = await page.locator('text=Pushups').count();
    console.log(`Found ${pushups} "Pushups" elements`);
    
    if (pushups === 0) {
      console.log('❌ ERROR: No habits visible! Data did not load.');
      console.log('Check the browser - do you see any habits?');
      await page.waitForTimeout(5000); // Pause so you can see
      throw new Error('No data visible - aborting demo');
    }

    console.log('✅ Data verified! Starting recording...\n');

    // ADD URL BANNER - make it VERY obvious
    await page.evaluate(() => {
      const banner = document.createElement('div');
      banner.id = 'url-banner';
      banner.style.cssText = `
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        background: #2563eb !important;
        color: white !important;
        padding: 12px 20px !important;
        font-family: monospace !important;
        font-size: 16px !important;
        font-weight: bold !important;
        z-index: 999999 !important;
        text-align: center !important;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3) !important;
      `;
      banner.textContent = '🌐 localhost:3000 — Way Finder Demo';
      document.body.prepend(banner);
      document.body.style.paddingTop = '50px';
    });

    await page.waitForTimeout(2000);

    // Verify banner is there
    const bannerExists = await page.locator('#url-banner').isVisible();
    console.log(`URL Banner visible: ${bannerExists}`);

    // DEMO RECORDING START
    console.log('\n🎬 RECORDING DEMO...\n');

    // Scene 1: Dashboard with data (5s)
    console.log('📊 Scene 1: Dashboard');
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(4000);

    // Scene 2: Habits List (3s)
    console.log('📋 Scene 2: Habits');
    await page.goto('http://localhost:3000/habits');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Scene 3: Habit Detail with Chart (5s)
    console.log('📈 Scene 3: Pushups Detail');
    await page.click('text=Pushups');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(4000);
    await page.evaluate(() => window.scrollTo(0, 300));
    await page.waitForTimeout(2000);

    // Scene 4: Log New Activity (10s) - DEMONSTRATE FEATURE
    console.log('✏️ Scene 4: Log Activity');
    await page.goto('http://localhost:3000/today');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Click on Pushups card to log
    const pushupCard = page.locator('text=Pushups').first();
    if (await pushupCard.isVisible()) {
      await pushupCard.click();
      await page.waitForTimeout(1500);

      // Fill in the form
      const valueInput = page.locator('input[type="number"]').first();
      if (await valueInput.isVisible()) {
        await valueInput.fill('55');
        await page.waitForTimeout(1000);

        // Add note
        const noteField = page.locator('textarea').first();
        if (await noteField.isVisible()) {
          await noteField.fill('New personal record! 💪');
          await page.waitForTimeout(1500);
        }

        // Submit
        const logButton = page.locator('button:has-text("Log Activity")').first();
        if (await logButton.isVisible()) {
          await logButton.click();
          await page.waitForTimeout(2000);
        }
      }
    }

    // Scene 5: About Page (3s)
    console.log('ℹ️ Scene 5: About');
    await page.goto('http://localhost:3000/about');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    console.log('\n✅ DEMO COMPLETE!');
    console.log('📹 Check video: test-results/demo-debug-*/video.webm\n');
  });
});
