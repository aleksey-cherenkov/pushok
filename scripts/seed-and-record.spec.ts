/**
 * Combined Seed + Record Script
 * 
 * Seeds data and immediately records demo in the SAME browser session.
 * This way the seeded data is visible in the recording!
 * 
 * Run: npx playwright test scripts/seed-and-record.spec.ts --headed
 */

import { test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Load real photos BEFORE page.evaluate (can't use fs inside browser context)
const loadPhotoAsBase64 = (filename: string): string => {
  const photoPath = path.join(__dirname, '..', 'images', filename);
  const buffer = fs.readFileSync(photoPath);
  const base64 = buffer.toString('base64');
  const ext = filename.toLowerCase();
  const mimeType = ext.endsWith('.png') ? 'image/png' : 'image/jpeg';
  return `data:${mimeType};base64,${base64}`;
};

test('seed data and record demo', async ({ page }) => {
  test.setTimeout(180000); // 3 minutes

  console.log('🚀 Step 1: Initializing app and seeding data...\n');

  // Navigate to app first to let it initialize the database
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000); // Give app time to create DB

  // Load real photos BEFORE page.evaluate (can't use fs inside browser context)
  console.log('Loading project photos from images/ folder...');
  const photo1 = loadPhotoAsBase64('room-before.jpg');
  const photo2 = loadPhotoAsBase64('room-during.jpg');
  const photo3 = loadPhotoAsBase64('room-done.jpg');
  console.log(`Loaded 3 project photos (${((photo1.length + photo2.length + photo3.length) / 1024).toFixed(0)} KB total)\n`);

  console.log('Loading 12 moments photos...');
  const moment1 = loadPhotoAsBase64('cat-nika-1.JPG');
  const moment2 = loadPhotoAsBase64('snow-rocks.JPG');
  const moment3 = loadPhotoAsBase64('christmas-tree.JPG');
  const moment4 = loadPhotoAsBase64('sunset.JPG');
  const moment5 = loadPhotoAsBase64('vintage.JPG');
  const moment6 = loadPhotoAsBase64('cat-nika-2.JPG'); // Coffee/book substitute
  const moment7 = loadPhotoAsBase64('epic-children.jpg');
  const moment8 = loadPhotoAsBase64('flowers-1.JPG');
  const moment9 = loadPhotoAsBase64('garden-1.jpg'); // Painting substitute
  const moment10 = loadPhotoAsBase64('bizon.JPG'); // Deer substitute
  const moment11 = loadPhotoAsBase64('winter-sky.jpg'); // Stars
  const moment12 = loadPhotoAsBase64('mountain-1.JPG');
  console.log(`Loaded 12 moments photos\n`);

  // SEED DATA directly in this browser
  await page.evaluate(async (photos: { 
    photo1: string; photo2: string; photo3: string;
    moment1: string; moment2: string; moment3: string; moment4: string;
    moment5: string; moment6: string; moment7: string; moment8: string;
    moment9: string; moment10: string; moment11: string; moment12: string;
  }) => {
    // Helper to generate UUID
    const generateId = () => crypto.randomUUID();

    // Helper to create event
    const createEvent = (aggregateId: string, aggregateType: string, type: string, data: any, timestamp?: number) => ({
      id: generateId(),
      aggregateId,
      aggregateType,
      type,
      timestamp: timestamp || Date.now(),
      version: 1,
      data,
    });

    // Open database (let it upgrade if needed)
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('WayFinderEventStore');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('events')) {
          db.createObjectStore('events', { keyPath: 'id' });
        }
      };
    });

    console.log(`Database has stores: ${Array.from(db.objectStoreNames).join(', ')}`);

    // If events store doesn't exist, we need to close and reopen with version bump
    if (!db.objectStoreNames.contains('events')) {
      db.close();
      throw new Error('Events store not found! App needs to create it first. Visit /habits to initialize.');
    }

    const events: any[] = [];

    // 1. CREATE ASPIRATIONS
    const aspirations = [
      { id: generateId(), title: 'Be Present & Mindful', description: 'Practice mindfulness and being fully present', category: 'mindfulness' },
      { id: generateId(), title: 'Strengthen Relationships', description: 'Invest time in family and friends', category: 'family' },
      { id: generateId(), title: 'Build Physical Health', description: 'Move daily, build strength', category: 'health' },
    ];

    aspirations.forEach(asp => {
      events.push(createEvent(asp.id, 'Aspiration', 'AspirationCreated', {
        title: asp.title,
        description: asp.description,
        category: asp.category,
        createdAt: Date.now(),
      }));
    });

    // 2. CREATE HABITS
    const habits = [
      {
        id: generateId(),
        name: 'Morning Pushups',
        why: 'Build upper body strength',
        category: 'health',
        frequency: 'daily',
        trackingType: 'count',
        target: 20,
        unit: 'reps'
      },
      {
        id: generateId(),
        name: 'Evening Reading',
        why: 'Calm the mind before sleep',
        category: 'learning',
        frequency: 'daily',
        trackingType: 'duration',
        target: 30,
        unit: 'minutes'
      },
      {
        id: generateId(),
        name: 'Daily Walk',
        why: 'Connect with nature',
        category: 'nature',
        frequency: 'daily',
        trackingType: 'distance',
        target: 2,
        unit: 'miles'
      },
    ];

    habits.forEach(habit => {
      events.push(createEvent(habit.id, 'Habit', 'HabitCreated', {
        title: habit.name, // Fix: use 'title' not 'name'
        description: habit.why,
        category: habit.category,
        recurring: habit.frequency,
        metric: habit.trackingType,
        target: habit.target,
        unit: habit.unit,
        aspirationId: aspirations[0].id,
        createdAt: Date.now(),
      }));
    });

    // 3. CREATE ACTIVITY LOGS (last 7 days)
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(9, 0, 0, 0);

      // Log for pushups (progressive increase)
      events.push(createEvent(generateId(), 'Activity', 'ActivityLogged', {
        habitId: habits[0].id,
        value: 20 + i * 2,
        note: i === 0 ? 'Feeling strong!' : null,
        mood: 4,
        resistance: null,
        loggedAt: date.getTime(),
      }, date.getTime()));

      // Log for reading
      events.push(createEvent(generateId(), 'Activity', 'ActivityLogged', {
        habitId: habits[1].id,
        value: 30,
        note: null,
        mood: 5,
        resistance: null,
        loggedAt: date.getTime(),
      }, date.getTime()));
    }

    // 4. CREATE MOMENTS (12 photos)
    const momentsData = [
      { caption: 'Nika being perfect as always', date: new Date(2026, 0, 10), photo: photos.moment1 },
      { caption: 'Winter hike - the silence was healing', date: new Date(2026, 0, 13), photo: photos.moment2 },
      { caption: 'Decorated the tree with family', date: new Date(2026, 0, 16), photo: photos.moment3 },
      { caption: 'Worth the climb', date: new Date(2026, 0, 19), photo: photos.moment4 },
      { caption: 'Made me smile and cry', date: new Date(2026, 0, 22), photo: photos.moment5 },
      { caption: 'Coffee + good book = Sunday bliss', date: new Date(2026, 0, 25), photo: photos.moment6 },
      { caption: 'Their laughter is contagious', date: new Date(2026, 0, 28), photo: photos.moment7 },
      { caption: 'Early crocus breaking through', date: new Date(2026, 1, 1), photo: photos.moment8 },
      { caption: 'Proud of this one', date: new Date(2026, 1, 2), photo: photos.moment9 },
      { caption: 'Stood still and watched for 10 minutes', date: new Date(2026, 1, 3, 8, 0), photo: photos.moment10 },
      { caption: 'Star-filled night sky', date: new Date(2026, 1, 4), photo: photos.moment11 },
      { caption: 'Love this view', date: new Date(2026, 1, 5), photo: photos.moment12 },
    ];

    momentsData.forEach((moment) => {
      const momentId = generateId();
      events.push(createEvent(momentId, 'moment', 'MomentCreated', {
        photoData: moment.photo,
        caption: moment.caption,
        createdAt: moment.date.getTime(),
      }));
    });

    // 5. CREATE PROJECT
    const projectId = generateId();
    events.push(createEvent(projectId, 'project', 'ProjectCreated', {
      title: 'Home Office Setup',
      description: 'Create a comfortable workspace',
      category: 'home-improvement',
      createdAt: Date.now(),
    }));

    // Add phases with photos
    const phases = [
      { id: generateId(), name: 'Planning', order: 0 },
      { id: generateId(), name: 'Furniture', order: 1 },
      { id: generateId(), name: 'Setup', order: 2 },
      { id: generateId(), name: 'Decor', order: 3 },
    ];
    
    phases.forEach((phase) => {
      events.push(createEvent(projectId, 'project', 'PhaseAdded', {
        phaseId: phase.id,
        name: phase.name,
        order: phase.order,
        addedAt: Date.now(),
      }));
    });

    // Add 3 PROJECT PHOTOS (as specified in demo-plan.md)
    // Phase 0: Planning - room-before.jpg
    events.push(createEvent(projectId, 'project', 'PhasePhotoAdded', {
      phaseId: phases[0].id,
      photoId: generateId(),
      photoData: photos.photo1,
      caption: 'Empty room - starting point',
      addedAt: Date.now() - 20 * 24 * 60 * 60 * 1000, // 20 days ago
    }));

    // Phase 1: Furniture - room-during.jpg  
    events.push(createEvent(projectId, 'project', 'PhasePhotoAdded', {
      phaseId: phases[1].id,
      photoId: generateId(),
      photoData: photos.photo2,
      caption: 'Desk assembled - work in progress',
      addedAt: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
    }));

    // Phase 2: Setup - room-done.jpg
    events.push(createEvent(projectId, 'project', 'PhasePhotoAdded', {
      phaseId: phases[2].id,
      photoId: generateId(),
      photoData: photos.photo3,
      caption: 'Complete setup with dual monitors!',
      addedAt: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
    }));

    // Save all events to IndexedDB
    const tx = db.transaction('events', 'readwrite');
    const store = tx.objectStore('events');

    for (const event of events) {
      store.add(event);
    }

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });

    console.log(`✅ Seeded ${events.length} events!`);
  }, { photo1, photo2, photo3, moment1, moment2, moment3, moment4, moment5, moment6, moment7, moment8, moment9, moment10, moment11, moment12 }); // Pass all photos

  console.log('✅ Data seeded successfully!\n');
  console.log('📹 Step 2: Recording demo video...\n');

  // Reload to show seeded data
  await page.reload();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // START RECORDING THE SAME BROWSER WITH DATA!
  console.log('📊 Act 1: Dashboard (8s)');
  await page.goto('http://localhost:3000/dashboard');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  await page.evaluate(() => window.scrollTo(0, 300));
  await page.waitForTimeout(2000);

  console.log('✅ Act 2: Today - Log Now (12s)');
  await page.goto('http://localhost:3000/today');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Click "Log Now" button on first habit
  try {
    await page.click('button:has-text("Log Now")', { timeout: 3000 });
    await page.waitForTimeout(2000);
    
    // If modal opens, just show it (don't fill, too complex)
    await page.waitForTimeout(2000);
    
    // Press Escape to close modal
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);
  } catch {
    // If "Log Now" doesn't exist, just show the page
    await page.waitForTimeout(3000);
  }
  
  // Scroll to see moment
  await page.evaluate(() => window.scrollBy(0, 300));
  await page.waitForTimeout(2000);

  console.log('📝 Act 3: Habits - View Detail (10s)');
  await page.goto('http://localhost:3000/habits');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Click on first habit card to go to detail page
  await page.click('text=Morning Pushups');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Scroll to see activity chart
  await page.evaluate(() => window.scrollBy(0, 300));
  await page.waitForTimeout(2000);

  console.log('🎯 Act 4: Aspirations (6s)');
  await page.goto('http://localhost:3000/aspirations');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  console.log('🏗️ Act 5: Projects (10s)');
  await page.goto('http://localhost:3000/projects');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Click on the project to see detail page with all photos
  await page.click('text=Home Office Setup');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  // Scroll down to see all phases and photos
  await page.evaluate(() => window.scrollBy(0, 400));
  await page.waitForTimeout(2000);

  console.log('📸 Act 6: Moments (8s)');
  await page.goto('http://localhost:3000/moments');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  await page.evaluate(() => window.scrollBy(0, 400));
  await page.waitForTimeout(2000);

  console.log('\n✅ Recording complete!');
  console.log('📹 Video saved to: test-results/');
  console.log('');
  console.log('Data created:');
  console.log('  - 3 aspirations');
  console.log('  - 3 habits');
  console.log('  - 14 activity logs');
  console.log('  - 1 project with 4 phases and 3 photos');
  console.log('  - 12 moments with photos');
});
