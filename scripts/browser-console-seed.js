/**
 * BROWSER CONSOLE SEED SCRIPT
 * 
 * How to use:
 * 1. Open http://localhost:3000 in Edge
 * 2. Press F12 (DevTools)
 * 3. Go to Console tab
 * 4. Copy and paste this ENTIRE script
 * 5. Press Enter
 * 6. Wait ~5 seconds
 * 7. Refresh page - data should appear!
 */

(async function seedDemoData() {
  console.log('🚀 Starting demo data seed...');

  // Helper to generate UUID
  const generateId = () => crypto.randomUUID();

  // Helper to create event
  const createEvent = (aggregateId, aggregateType, type, data, timestamp) => ({
    id: generateId(),
    aggregateId,
    aggregateType,
    type,
    timestamp: timestamp || Date.now(),
    version: 1,
    data,
  });

  // Open database (use current version!)
  const db = await new Promise((resolve, reject) => {
    const request = indexedDB.open('WayFinderEventStore');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  console.log(`📦 Database version: ${db.version}`);

  const events = [];

  // 1. CREATE ASPIRATIONS
  console.log('📝 Creating aspirations...');
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
  console.log('📝 Creating habits...');
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
      name: habit.name,
      why: habit.why,
      category: habit.category,
      frequency: habit.frequency,
      trackingType: habit.trackingType,
      target: habit.target,
      unit: habit.unit,
      aspirationId: aspirations[0].id, // Link to first aspiration
      createdAt: Date.now(),
    }));
  });

  // 3. CREATE ACTIVITY LOGS (last 7 days)
  console.log('📝 Creating activity logs...');
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(9, 0, 0, 0);

    // Log for pushups
    events.push(createEvent(generateId(), 'Activity', 'ActivityLogged', {
      habitId: habits[0].id,
      value: 20 + i * 2, // Progressive increase
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

  // 4. CREATE PROJECT
  console.log('📝 Creating project...');
  const projectId = generateId();
  events.push(createEvent(projectId, 'Project', 'ProjectCreated', {
    title: 'Home Office Setup',
    description: 'Create a comfortable workspace',
    category: 'home-improvement',
    createdAt: Date.now(),
  }));

  // Add phases to project
  const phases = ['Planning', 'Furniture', 'Setup', 'Decor'];
  phases.forEach((phaseName, idx) => {
    events.push(createEvent(projectId, 'Project', 'PhaseAdded', {
      phaseId: generateId(),
      name: phaseName,
      order: idx,
      addedAt: Date.now(),
    }));
  });

  // Save all events to IndexedDB
  console.log(`💾 Saving ${events.length} events to database...`);
  const tx = db.transaction('events', 'readwrite');
  const store = tx.objectStore('events');

  for (const event of events) {
    store.add(event);
  }

  await new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });

  console.log('✅ Demo data seeded successfully!');
  console.log('📊 Refresh the page to see your data!');
  console.log('');
  console.log('Data created:');
  console.log(`  - ${aspirations.length} aspirations`);
  console.log(`  - ${habits.length} habits`);
  console.log(`  - ${events.filter(e => e.type === 'ActivityLogged').length} activity logs`);
  console.log(`  - 1 project with ${phases.length} phases`);

})().catch(error => {
  console.error('❌ Seed failed:', error);
});
