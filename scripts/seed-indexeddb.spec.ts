/**
 * Direct IndexedDB Seed Script
 * 
 * Bypasses UI and seeds events directly to IndexedDB.
 * Much faster than UI automation.
 * 
 * Run: npx playwright test scripts/seed-indexeddb.spec.ts
 */

import { test } from '@playwright/test';
import { v4 as uuid } from 'uuid';

test.describe('Seed via IndexedDB', () => {
  test('should seed demo data directly to IndexedDB', async ({ page }) => {
    test.setTimeout(60000); // 1 minute should be plenty

    console.log('🚀 Seeding demo data via IndexedDB...');

    // Navigate to app
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await page.evaluate(() => {
      localStorage.clear();
      return indexedDB.deleteDatabase('way-finder-db');
    });
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Seed data via script injection
    console.log('📝 Injecting seed data...');
    
    await page.evaluate(async () => {
      // Helper to generate UUID
      const generateId = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };

      // Helper to create event
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

      // Open IndexedDB
      const dbRequest = indexedDB.open('way-finder-db', 1);
      
      await new Promise<void>((resolve, reject) => {
        dbRequest.onerror = () => reject(dbRequest.error);
        dbRequest.onsuccess = () => resolve();
        
        dbRequest.onupgradeneeded = (event: any) => {
          const db = event.target.result;
          
          // Create object stores if they don't exist
          if (!db.objectStoreNames.contains('events')) {
            db.createObjectStore('events', { keyPath: 'id' });
          }
        };
      });

      const db = dbRequest.result;
      const events: any[] = [];

      // Set Stela values in localStorage
      localStorage.setItem('stela-values', JSON.stringify(['Family', 'Cats', 'Nature', 'Rest']));
      localStorage.setItem('stela-onboarding-complete', 'true');

      // 1. CREATE ASPIRATIONS
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

      // 2. CREATE HABITS
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

      // 3. LOG ACTIVITIES (sample - showing progression)
      const activityData = [
        // Pushups progression
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
        { habitId: habits[0].id, value: 10, date: '2026-01-14' },
        { habitId: habits[0].id, value: 12, date: '2026-01-17' },
        { habitId: habits[0].id, value: 15, date: '2026-01-20' },
        
        // Running (with resistance example)
        { habitId: habits[9].id, value: 15, date: '2026-01-09' },
        { habitId: habits[9].id, value: 20, date: '2026-01-12' },
        { habitId: habits[9].id, value: 25, date: '2026-01-16', resistance: 'physical', resistanceNote: 'Shin splints' },
        { habitId: habits[9].id, value: 20, date: '2026-01-19' },
        { habitId: habits[9].id, value: 30, date: '2026-01-23' },
        { habitId: habits[9].id, value: 35, date: '2026-01-27', resistance: 'environmental', resistanceNote: 'Too hot' },
        { habitId: habits[9].id, value: 40, date: '2026-02-02' },
        
        // Dev Projects
        { habitId: habits[5].id, value: 45, date: '2026-01-15' },
        { habitId: habits[5].id, value: 60, date: '2026-01-17' },
        { habitId: habits[5].id, value: 90, date: '2026-01-20', note: 'Deep focus session!' },
        { habitId: habits[5].id, value: 75, date: '2026-01-24' },
        { habitId: habits[5].id, value: 120, date: '2026-01-28', note: 'Built entire feature!' },
      ];

      activityData.forEach((activity, idx) => {
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

      // Store all events in IndexedDB
      const transaction = db.transaction(['events'], 'readwrite');
      const objectStore = transaction.objectStore('events');

      for (const event of events) {
        objectStore.add(event);
      }

      await new Promise<void>((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });

      console.log(`✅ Seeded ${events.length} events to IndexedDB`);
    });

    console.log('✅ Demo data seeded successfully!');
    console.log('🎬 Ready to record demo.');
    
    // Reload to show seeded data
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    console.log('📊 Data should now be visible in the app');
  });
});
