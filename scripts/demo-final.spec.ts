/**
 * Combined Seed + Record Demo
 * 
 * Seeds data AND records in one test so data persists.
 * Adds URL overlay to page so it's visible in video.
 * 
 * Run: npx playwright test scripts/demo-final.spec.ts
 */

import { test } from '@playwright/test';

test.describe('Way Finder Full Demo', () => {
  test('seed data and record demo in one session', async ({ page }) => {
    test.setTimeout(180000); // 3 minutes

    console.log('🎬 Starting combined seed + record demo...');

    // Navigate to app
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Clear existing data first
    console.log('🗑️  Clearing existing data...');
    await page.evaluate(() => {
      localStorage.clear();
      return indexedDB.deleteDatabase('way-finder-db');
    });
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // SEED DATA via IndexedDB
    console.log('📝 Seeding demo data...');
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
        eventType,
        timestamp,
        version: 1,
        payload,
        metadata: { userId: 'demo-user' },
      });

      const dbRequest = indexedDB.open('way-finder-db', 1);
      
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
        { id: generateId(), title: 'Be Present & Mindful', description: 'Practice mindfulness, gratitude, and being fully present in each moment.' },
        { id: generateId(), title: 'Strengthen Relationships', description: 'Invest time in family and friends. Quality over quantity.' },
        { id: generateId(), title: 'Build Physical Health', description: 'Move daily, build strength, feel energized.' },
        { id: generateId(), title: 'Creative Expression', description: 'Make time for art, music, and creative projects.' },
        { id: generateId(), title: 'Technology & Learning', description: 'Continuous learning through tech practice and exploration.' },
      ];

      aspirations.forEach(asp => {
        events.push(createEvent(
          asp.id,
          'Aspiration',
          'AspirationCreated',
          { title: asp.title, description: asp.description },
          new Date('2026-01-07T10:00:00Z').toISOString()
        ));
      });

      // Habits
      const habits = [
        { id: generateId(), title: 'Morning Meditation', metric: 'duration', target: 10, aspId: aspirations[0].id },
        { id: generateId(), title: 'Pushups', metric: 'count', target: 30, aspId: aspirations[2].id },
        { id: generateId(), title: 'Yoga Practice', metric: 'duration', target: 20, aspId: aspirations[2].id },
        { id: generateId(), title: 'Microsoft Learn', metric: 'duration', target: 30, aspId: aspirations[4].id },
        { id: generateId(), title: 'John Savill Videos', metric: 'count', target: 1, aspId: aspirations[4].id },
        { id: generateId(), title: 'Dev Projects', metric: 'duration', target: 60, aspId: aspirations[4].id },
        { id: generateId(), title: 'Codewars Katas', metric: 'count', target: 2, aspId: aspirations[4].id },
        { id: generateId(), title: 'Painting', metric: 'duration', target: 30, aspId: aspirations[3].id },
        { id: generateId(), title: 'Sketching', metric: 'duration', target: 20, aspId: aspirations[3].id },
        { id: generateId(), title: 'Running', metric: 'duration', target: 20, aspId: aspirations[2].id },
      ];

      habits.forEach((habit, idx) => {
        const timestamp = new Date(2026, 0, 7 + idx, 10, 0, 0).toISOString();
        events.push(createEvent(
          habit.id,
          'Habit',
          'HabitCreated',
          {
            title: habit.title,
            metric: habit.metric,
            target: habit.target,
            aspirationIds: [habit.aspId],
          },
          timestamp
        ));
      });

      // Activities with progression
      const activityData = [
        // Pushups progression (10 → 52)
        { habitId: habits[1].id, value: 10, date: '2026-01-08' },
        { habitId: habits[1].id, value: 15, date: '2026-01-10' },
        { habitId: habits[1].id, value: 20, date: '2026-01-13' },
        { habitId: habits[1].id, value: 25, date: '2026-01-15' },
        { habitId: habits[1].id, value: 30, date: '2026-01-18' },
        { habitId: habits[1].id, value: 35, date: '2026-01-22' },
        { habitId: habits[1].id, value: 40, date: '2026-01-25' },
        { habitId: habits[1].id, value: 45, date: '2026-01-28' },
        { habitId: habits[1].id, value: 50, date: '2026-02-01' },
        { habitId: habits[1].id, value: 52, date: '2026-02-04' },
        
        // Meditation
        { habitId: habits[0].id, value: 5, date: '2026-01-08' },
        { habitId: habits[0].id, value: 7, date: '2026-01-09' },
        { habitId: habits[0].id, value: 10, date: '2026-01-11' },
        { habitId: habits[0].id, value: 12, date: '2026-01-17' },
        { habitId: habits[0].id, value: 15, date: '2026-01-20' },
        
        // Running with resistance
        { habitId: habits[9].id, value: 15, date: '2026-01-09' },
        { habitId: habits[9].id, value: 20, date: '2026-01-12' },
        { habitId: habits[9].id, value: 25, date: '2026-01-16', resistance: 'physical', resistanceNote: 'Shin splints' },
        { habitId: habits[9].id, value: 30, date: '2026-01-23' },
        { habitId: habits[9].id, value: 35, date: '2026-01-27', resistance: 'environmental', resistanceNote: 'Too hot' },
        { habitId: habits[9].id, value: 40, date: '2026-02-02' },
        
        // Dev Projects
        { habitId: habits[5].id, value: 45, date: '2026-01-15' },
        { habitId: habits[5].id, value: 60, date: '2026-01-17' },
        { habitId: habits[5].id, value: 90, date: '2026-01-20', note: 'Deep focus session!' },
        { habitId: habits[5].id, value: 120, date: '2026-01-28', note: 'Built entire feature!' },
        
        // Yoga
        { habitId: habits[2].id, value: 15, date: '2026-01-10' },
        { habitId: habits[2].id, value: 20, date: '2026-01-14' },
        { habitId: habits[2].id, value: 25, date: '2026-01-18' },
        { habitId: habits[2].id, value: 30, date: '2026-01-24' },
      ];

      activityData.forEach((activity) => {
        const activityId = generateId();
        const timestamp = new Date(activity.date + 'T14:00:00Z').toISOString();
        
        events.push(createEvent(
          activityId,
          'Activity',
          'ActivityLogged',
          {
            habitId: activity.habitId,
            value: activity.value,
            note: activity.note || null,
            mood: null,
            values: [],
            resistance: activity.resistance
              ? { type: activity.resistance, note: activity.resistanceNote }
              : null,
          },
          timestamp
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

      console.log(`✅ Seeded ${events.length} events`);
    });

    console.log('✅ Data seeded! Reloading to show data...');
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // ADD URL OVERLAY to page
    console.log('🌐 Adding URL overlay...');
    await page.evaluate(() => {
      const urlBanner = document.createElement('div');
      urlBanner.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(to right, #1e40af, #3b82f6);
        color: white;
        padding: 8px 16px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 14px;
        font-weight: 500;
        z-index: 99999;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        gap: 12px;
      `;
      urlBanner.innerHTML = `
        <span style="opacity: 0.8;">🌐</span>
        <span>localhost:3000</span>
        <span style="opacity: 0.6;">|</span>
        <span style="opacity: 0.8;">Way Finder Demo</span>
      `;
      document.body.appendChild(urlBanner);
      
      // Adjust page content to account for banner
      document.body.style.paddingTop = '40px';
    });

    await page.waitForTimeout(1000);

    // NOW RECORD THE DEMO
    console.log('\n🎬 Starting demo recording...\n');

    // ACT 1: Dashboard (30s)
    console.log('📊 Act 1: Dashboard (30s)');
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(2000);

    const monthBtn = page.locator('button:has-text("Month")');
    if (await monthBtn.isVisible()) {
      await monthBtn.click();
      await page.waitForTimeout(2000);
    }

    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(2000);

    // ACT 2: Habits List (15s)
    console.log('📋 Act 2: Habits List (15s)');
    await page.goto('http://localhost:3000/habits');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(2000);

    // ACT 3: Habit Detail (20s)
    console.log('📈 Act 3: Habit Detail (20s)');
    const pushupCard = page.locator('text=Pushups').first();
    if (await pushupCard.isVisible()) {
      await pushupCard.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);

      await page.evaluate(() => window.scrollTo(0, 300));
      await page.waitForTimeout(2500);
    }

    // ACT 4: Today Page - Log Activity (20s)
    console.log('✏️ Act 4: Log Activity (20s)');
    await page.goto('http://localhost:3000/today');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(2000);

    // ACT 5: About (10s)
    console.log('ℹ️ Act 5: About (10s)');
    await page.goto('http://localhost:3000/about');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await page.evaluate(() => window.scrollTo(0, 400));
    await page.waitForTimeout(2000);

    console.log('\n✅ Demo recording complete!');
    console.log('📹 Video: test-results/demo-final-*/video.webm');
    console.log('🎙️ Next: Add voiceover');
  });
});
