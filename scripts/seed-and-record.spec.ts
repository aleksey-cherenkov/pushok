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

  // SEED DATA directly in this browser
  await page.evaluate(async (photos: { photo1: string; photo2: string; photo3: string }) => {
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

    // 4. CREATE WEEKLY REFLECTIONS (2 reflections)
    const thisWeekStart = new Date();
    thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay()); // Start of this week (Sunday)
    thisWeekStart.setHours(0, 0, 0, 0);
    
    const thisWeekEnd = new Date(thisWeekStart);
    thisWeekEnd.setDate(thisWeekEnd.getDate() + 6); // End of week (Saturday)
    thisWeekEnd.setHours(23, 59, 59, 999);

    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    
    const lastWeekEnd = new Date(lastWeekStart);
    lastWeekEnd.setDate(lastWeekEnd.getDate() + 6);

    // This week's reflection
    const reflection1Id = generateId();
    events.push(createEvent(reflection1Id, 'weekly-reflection', 'WeeklyReflectionCreated', {
      weekStart: thisWeekStart.getTime(),
      weekEnd: thisWeekEnd.getTime(),
      habitReview: 'Great week! Hit my pushup goals 6 out of 7 days.',
      projectProgress: 'Office setup is 75% complete. Loving the new desk!',
      personalReflections: 'Feeling more focused with the improved workspace.',
      mood: 4,
      createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000, // Yesterday
    }));

    // Last week's reflection
    const reflection2Id = generateId();
    events.push(createEvent(reflection2Id, 'weekly-reflection', 'WeeklyReflectionCreated', {
      weekStart: lastWeekStart.getTime(),
      weekEnd: lastWeekEnd.getTime(),
      habitReview: 'Building momentum. Started the office project.',
      projectProgress: 'Ordered furniture and started planning layout.',
      personalReflections: 'Excited about creating a better work environment.',
      mood: 5,
      createdAt: Date.now() - 8 * 24 * 60 * 60 * 1000, // 8 days ago
    }));

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
  }, { photo1, photo2, photo3 }); // Pass 3 photos as parameter

  console.log('✅ Data seeded successfully!\n');
  console.log('📹 Step 2: Recording demo video...\n');

  // Reload to show seeded data
  await page.reload();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // START RECORDING THE SAME BROWSER WITH DATA!
  console.log('🎬 Act 1: Dashboard (10s)');
  await page.goto('http://localhost:3000/dashboard');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  await page.evaluate(() => window.scrollTo(0, 300));
  await page.waitForTimeout(2000);

  console.log('📝 Act 2: Habits (10s)');
  await page.goto('http://localhost:3000/habits');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  console.log('🎯 Act 3: Aspirations (8s)');
  await page.goto('http://localhost:3000/aspirations');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  console.log('🏗️ Act 4: Projects (10s)');
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

  console.log('📖 Act 5: Reflections (8s)');
  await page.goto('http://localhost:3000/reflections');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  console.log('📊 Act 6: Today (8s)');
  await page.goto('http://localhost:3000/today');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  console.log('\n✅ Recording complete!');
  console.log('📹 Video saved to: test-results/');
  console.log('');
  console.log('Data created:');
  console.log('  - 3 aspirations');
  console.log('  - 3 habits');
  console.log('  - 14 activity logs');
  console.log('  - 1 project with 4 phases and 3 photos');
  console.log('  - 2 weekly reflections (with weekEnd fixed)');
});
