# Pushok - Architecture Documentation

**Way Finder - Event Sourcing & Event Modeling for Meaningful Living**

---

## Table of Contents

1. [Overview](#overview)
2. [Event Sourcing Fundamentals](#event-sourcing-fundamentals)
3. [Event Model](#event-model)
4. [System Architecture](#system-architecture)
5. [Data Flow](#data-flow)
6. [IndexedDB Event Store](#indexeddb-event-store)
7. [Aggregates & Domain Logic](#aggregates--domain-logic)
8. [Projections & Read Models](#projections--read-models)
9. [AI Integration](#ai-integration)
10. [Future: Mobile Sync Strategy](#future-mobile-sync-strategy)

---

## Overview

Pushok - Way Finder implements **Event Sourcing** and **Event Modeling** as described in "Understanding Eventsourcing" by Martin Dilger. Instead of storing current state, we store the complete history of events that led to that state.

### Why Event Sourcing for a Way Finder App?

1. **Complete Audit Trail**: Know exactly when goals changed and why
2. **Time Travel**: See your progress at any point in history
3. **Analytics**: Rich data for insights and pattern recognition
4. **Debugging**: Easy to reproduce and fix issues
5. **Flexibility**: Add new projections without database migrations
6. **Offline-First**: Perfect foundation for mobile sync (future)

---

## Event Sourcing Fundamentals

### Core Concepts

**Event**: An immutable fact that something happened
```typescript
{
  id: "evt_123",
  type: "GoalActivated",
  aggregateId: "goal_456",
  aggregateType: "goal",
  payload: { title: "Exercise 30min daily", category: "health" },
  metadata: { userId: "user_789", timestamp: 1738180000000, version: 3 }
}
```

**Aggregate**: A cluster of domain objects treated as a unit
- Enforces business rules
- Generates events from commands
- Rebuilds state by replaying events

**Projection**: A read model built from events
- Optimized for queries
- Can be rebuilt at any time
- Multiple projections from same events

**Command**: An intent to change state
```typescript
{ type: "ActivateGoal", goalId: "goal_456", activatedAt: Date.now() }
```

### Event Flow
```
Command → Aggregate → Events → Event Store → Projections → UI
   ↑                                               ↓
   └─────────── User Action ────────────────────────┘
```

---

## Event Model

### Goal Aggregate

**Events:**
- `GoalDraftCreated` - User starts defining a goal
- `AIRefinementRequested` - User asks AI for help
- `AIRefinementReceived` - AI suggests improvements
- `AIRefinementAccepted` / `AIRefinementRejected`
- `GoalDefined` - Final goal definition
- `GoalCategorized` - Assign category (family, nature, health, learning, home)
- `GoalTypeSet` - positive / negative / avoidance
- `GoalActivated` - Start tracking
- `GoalPaused` / `GoalResumed`
- `GoalCompleted` - Goal achieved
- `GoalArchived` - Remove from active list
- `GoalProgressRecorded` - Log progress
- `GoalMilestoneAdded` - Break into smaller milestones
- `GoalMilestoneCompleted`

**State Reconstruction:**
```typescript
class GoalAggregate {
  apply(event: GoalEvent): void {
    switch (event.type) {
      case 'GoalDefined':
        this.title = event.payload.title;
        this.description = event.payload.description;
        break;
      case 'GoalActivated':
        this.status = 'active';
        this.activatedAt = event.payload.activatedAt;
        break;
      case 'GoalProgressRecorded':
        this.progress += event.payload.amount;
        this.lastProgressAt = event.payload.recordedAt;
        break;
      // ... more cases
    }
  }
}
```

### Activity Aggregate

**Events:**
- `ActivityLogged` - User logs an activity
- `ActivityTagged` - Add tags (goal, category, people, location)
- `ActivityDurationSet` - Set time spent
- `ActivityNotesAdded` - Add reflection/notes
- `ActivityPhotoAttached` - Link photos
- `ActivityGoalLinked` - Connect to goal
- `ActivityEdited` - Modify activity
- `ActivityDeleted` - Soft delete

**Use Cases:**
- Log "Spent 30min with kids in park"
- Tag with: goal="Quality time with family", category="family", people=["Emma", "Noah"]
- Attach photos from the park
- AI analyzes patterns: "You're most active on weekends"

### Photo Aggregate

**Events:**
- `PhotoUploaded` - Upload photo (blob to IndexedDB)
- `PhotoMetadataExtracted` - EXIF data (date, location)
- `PhotoTagged` - Tag with people, pets, activities
- `PhotoMemoryCreated` - Mark as memorable moment
- `PhotoLinkedToGoal` - Connect to goal/activity
- `PhotoCaptionAdded` - Add description
- `PhotoPrivacySet` - Set visibility

**Special: In Memory of Stela**
- Photos tagged with "Stela" get special treatment
- Memory gallery for cherished moments
- Timeline of meaningful experiences

### Reminder Aggregate

**Events:**
- `ReminderCreated` - Define reminder rule
- `ReminderScheduleSet` - Set recurrence (daily, weekly, custom)
- `ReminderTriggered` - Reminder fires (browser notification)
- `ReminderDismissed` - User dismisses
- `ReminderCompleted` - User marks complete
- `ReminderSnoozed` - Delay reminder
- `ReminderDisabled` / `ReminderEnabled`

**Gentle Reminder Philosophy:**
- No nagging, just gentle nudges
- Learn from user behavior (dismiss patterns)
- Suggest optimal times based on completion history

---

## System Architecture

### High-Level Components

```
┌─────────────────────────────────────────────────────────┐
│                       Next.js App                       │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │    Pages    │  │  Components  │  │  API Routes   │  │
│  │  (Routes)   │  │     (UI)     │  │  (AI, Events) │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
│         │                 │                  │          │
│         └─────────────────┴──────────────────┘          │
│                           │                             │
│                    ┌──────▼──────┐                      │
│                    │   Zustand   │                      │
│                    │    Store    │                      │
│                    └──────┬──────┘                      │
│                           │                             │
│         ┌─────────────────┴─────────────────┐           │
│         │                                   │           │
│    ┌────▼─────┐                      ┌─────▼──────┐    │
│    │ Commands │                      │ Projections│    │
│    └────┬─────┘                      └─────▲──────┘    │
│         │                                   │           │
│    ┌────▼──────────┐                       │           │
│    │  Aggregates   │───── Events ──────────┘           │
│    └────┬──────────┘                                    │
│         │                                               │
│    ┌────▼──────────────────────────────┐                │
│    │       Event Store (IndexedDB)     │                │
│    │  ┌──────────────────────────────┐ │                │
│    │  │  Events Table (append-only)  │ │                │
│    │  └──────────────────────────────┘ │                │
│    │  ┌──────────────────────────────┐ │                │
│    │  │     Snapshots Table (opt)    │ │                │
│    │  └──────────────────────────────┘ │                │
│    │  ┌──────────────────────────────┐ │                │
│    │  │     Photos Blob Storage      │ │                │
│    │  └──────────────────────────────┘ │                │
│    └───────────────────────────────────┘                │
└─────────────────────────────────────────────────────────┘
                          │
                    ┌─────▼─────┐
                    │  Azure    │
                    │  OpenAI   │
                    │  (GPT-4)  │
                    └───────────┘
```

### Directory Structure Mapped to Architecture

```
lib/
├── event-store/
│   ├── event-store.ts           # IndexedDB wrapper, append events
│   ├── event-types.ts           # Event type definitions
│   └── snapshot-store.ts        # Optional: snapshots for performance
├── aggregates/
│   ├── base-aggregate.ts        # Abstract aggregate with event replay
│   ├── goal.aggregate.ts        # Goal domain logic
│   ├── activity.aggregate.ts    # Activity domain logic
│   ├── photo.aggregate.ts       # Photo domain logic
│   └── reminder.aggregate.ts    # Reminder domain logic
├── commands/
│   ├── goal.commands.ts         # Goal command handlers
│   ├── activity.commands.ts     # Activity command handlers
│   └── photo.commands.ts        # Photo command handlers
├── projections/
│   ├── goals-dashboard.projection.ts    # Active goals view
│   ├── timeline.projection.ts           # Activity timeline
│   ├── analytics.projection.ts          # Charts & insights
│   └── photo-gallery.projection.ts      # Photo views
└── ai/
    ├── goal-refiner.ts          # AI goal refinement logic
    └── openai-client.ts         # Azure OpenAI wrapper
```

---

## Data Flow

### Example: User Creates a Goal with AI Assistance

**Step 1: User Input**
```typescript
// User types: "I want to be healthier"
const draftGoal = { roughIdea: "I want to be healthier" };
```

**Step 2: Command → Aggregate**
```typescript
// Command handler
async function createGoalDraft(draft: GoalDraft) {
  const goalId = generateId();
  const event = {
    type: 'GoalDraftCreated',
    aggregateId: goalId,
    aggregateType: 'goal',
    payload: draft,
    metadata: { userId, timestamp: Date.now(), version: 1 }
  };
  
  await eventStore.append(event);
  return goalId;
}
```

**Step 3: User Requests AI Refinement**
```typescript
const aiEvent = {
  type: 'AIRefinementRequested',
  aggregateId: goalId,
  payload: { roughIdea: "I want to be healthier" },
  metadata: { userId, timestamp: Date.now(), version: 2 }
};

await eventStore.append(aiEvent);

// Call Azure OpenAI
const refinement = await refineGoalWithAI(roughIdea);

const aiResultEvent = {
  type: 'AIRefinementReceived',
  aggregateId: goalId,
  payload: {
    suggestions: [
      { title: "Exercise 30 minutes daily", category: "health", type: "positive" },
      { title: "Eat 5 servings of vegetables daily", category: "nutrition", type: "positive" },
      { title: "Sleep 8 hours nightly", category: "health", type: "positive" }
    ]
  },
  metadata: { userId, timestamp: Date.now(), version: 3 }
};

await eventStore.append(aiResultEvent);
```

**Step 4: User Selects & Activates Goal**
```typescript
const definedEvent = {
  type: 'GoalDefined',
  aggregateId: goalId,
  payload: {
    title: "Exercise 30 minutes daily",
    description: "Walk, jog, or gym - 30min of movement each day",
    category: "health",
    type: "positive",
    target: { value: 30, unit: "minutes", frequency: "daily" }
  },
  metadata: { userId, timestamp: Date.now(), version: 4 }
};

await eventStore.append(definedEvent);

const activatedEvent = {
  type: 'GoalActivated',
  aggregateId: goalId,
  payload: { activatedAt: Date.now() },
  metadata: { userId, timestamp: Date.now(), version: 5 }
};

await eventStore.append(activatedEvent);
```

**Step 5: Projection Updates**
```typescript
// Projection rebuilds from events
const activeGoalsProjection = await rebuildProjection('activeGoals');
// Result: Shows new goal in dashboard

// UI subscribes to projection changes (Zustand)
useStore.setState({ activeGoals: activeGoalsProjection });
```

---

## IndexedDB Event Store

### Schema

**Events Table**
```typescript
interface StoredEvent {
  id: string;              // evt_xxx
  type: string;            // GoalDefined, ActivityLogged, etc.
  aggregateId: string;     // goal_xxx, activity_xxx
  aggregateType: string;   // goal, activity, photo, reminder
  payload: any;            // Event-specific data
  metadata: {
    userId: string;
    timestamp: number;
    version: number;       // Aggregate version for optimistic locking
  };
}

// Indexes
- by_aggregate: [aggregateType + aggregateId]
- by_timestamp: [timestamp]
- by_user: [userId]
```

**Snapshots Table (Optional - for performance)**
```typescript
interface Snapshot {
  aggregateId: string;
  aggregateType: string;
  version: number;        // Last event version included
  state: any;             // Aggregate state at that version
  createdAt: number;
}
```

**Photos Table**
```typescript
interface PhotoBlob {
  id: string;
  blob: Blob;             // Actual photo data
  thumbnail: Blob;        // Generated thumbnail
  uploadedAt: number;
}
```

### Dexie.js Configuration

```typescript
import Dexie, { Table } from 'dexie';

class EventStoreDB extends Dexie {
  events!: Table<StoredEvent>;
  snapshots!: Table<Snapshot>;
  photos!: Table<PhotoBlob>;

  constructor() {
    super('PushokEventStore');
    this.version(1).stores({
      events: 'id, [aggregateType+aggregateId], timestamp, [metadata.userId]',
      snapshots: '[aggregateId+aggregateType], version',
      photos: 'id, uploadedAt'
    });
  }
}

export const db = new EventStoreDB();
```

### Event Store Operations

**Append Event**
```typescript
async function appendEvent(event: StoredEvent): Promise<void> {
  await db.events.add(event);
  // Notify projection engine to update
  await updateProjections(event);
}
```

**Load Aggregate**
```typescript
async function loadAggregate<T>(
  aggregateId: string,
  AggregateClass: new () => T
): Promise<T> {
  // Try snapshot first (if exists)
  const snapshot = await db.snapshots
    .where('[aggregateId+aggregateType]')
    .equals([aggregateId, aggregateType])
    .first();

  const aggregate = new AggregateClass();
  let fromVersion = 0;

  if (snapshot) {
    aggregate.loadFromSnapshot(snapshot.state);
    fromVersion = snapshot.version;
  }

  // Load events after snapshot
  const events = await db.events
    .where('[aggregateType+aggregateId]')
    .equals([aggregateType, aggregateId])
    .and(e => e.metadata.version > fromVersion)
    .toArray();

  events.forEach(e => aggregate.apply(e));
  return aggregate;
}
```

---

## Aggregates & Domain Logic

### Base Aggregate

```typescript
abstract class BaseAggregate {
  id: string;
  version: number = 0;
  private uncommittedEvents: StoredEvent[] = [];

  abstract apply(event: StoredEvent): void;

  protected addEvent(type: string, payload: any): void {
    const event = {
      id: generateId(),
      type,
      aggregateId: this.id,
      aggregateType: this.constructor.name.toLowerCase(),
      payload,
      metadata: {
        userId: getCurrentUserId(),
        timestamp: Date.now(),
        version: ++this.version
      }
    };
    
    this.uncommittedEvents.push(event);
    this.apply(event);
  }

  getUncommittedEvents(): StoredEvent[] {
    return this.uncommittedEvents;
  }

  clearUncommittedEvents(): void {
    this.uncommittedEvents = [];
  }
}
```

### Goal Aggregate Example

```typescript
class GoalAggregate extends BaseAggregate {
  title: string = '';
  description: string = '';
  category: string = '';
  status: 'draft' | 'active' | 'paused' | 'completed' = 'draft';
  progress: number = 0;
  target: { value: number; unit: string; frequency: string } | null = null;

  apply(event: StoredEvent): void {
    switch (event.type) {
      case 'GoalDefined':
        this.title = event.payload.title;
        this.description = event.payload.description;
        this.category = event.payload.category;
        this.target = event.payload.target;
        break;

      case 'GoalActivated':
        this.status = 'active';
        break;

      case 'GoalProgressRecorded':
        this.progress += event.payload.amount;
        break;

      case 'GoalCompleted':
        this.status = 'completed';
        this.progress = this.target?.value || 100;
        break;

      // ... more cases
    }
  }

  // Commands
  defineGoal(title: string, description: string, category: string, target: any): void {
    if (!title) throw new Error('Goal title required');
    this.addEvent('GoalDefined', { title, description, category, target });
  }

  activate(): void {
    if (this.status !== 'draft') throw new Error('Goal must be in draft');
    this.addEvent('GoalActivated', { activatedAt: Date.now() });
  }

  recordProgress(amount: number): void {
    if (this.status !== 'active') throw new Error('Goal must be active');
    this.addEvent('GoalProgressRecorded', { amount, recordedAt: Date.now() });
    
    if (this.target && this.progress >= this.target.value) {
      this.addEvent('GoalCompleted', { completedAt: Date.now() });
    }
  }
}
```

---

## Projections & Read Models

### Goals Dashboard Projection

```typescript
interface GoalDashboardItem {
  id: string;
  title: string;
  category: string;
  progress: number;
  target: number;
  streak: number;
  lastActivity: number;
  status: string;
}

class GoalsDashboardProjection {
  private goals: Map<string, GoalDashboardItem> = new Map();

  async rebuild(): Promise<void> {
    this.goals.clear();
    
    const events = await db.events
      .where('aggregateType')
      .equals('goal')
      .toArray();

    events.forEach(e => this.apply(e));
  }

  apply(event: StoredEvent): void {
    const goalId = event.aggregateId;
    const goal = this.goals.get(goalId) || this.createEmpty(goalId);

    switch (event.type) {
      case 'GoalDefined':
        goal.title = event.payload.title;
        goal.category = event.payload.category;
        goal.target = event.payload.target?.value || 100;
        break;

      case 'GoalProgressRecorded':
        goal.progress += event.payload.amount;
        goal.lastActivity = event.payload.recordedAt;
        goal.streak = this.calculateStreak(goalId);
        break;

      case 'GoalCompleted':
        goal.status = 'completed';
        goal.progress = goal.target;
        break;
    }

    this.goals.set(goalId, goal);
  }

  getActiveGoals(): GoalDashboardItem[] {
    return Array.from(this.goals.values())
      .filter(g => g.status === 'active')
      .sort((a, b) => b.lastActivity - a.lastActivity);
  }
}
```

### Timeline Projection

```typescript
interface TimelineItem {
  id: string;
  type: 'activity' | 'photo' | 'milestone';
  timestamp: number;
  title: string;
  tags: string[];
  goalIds: string[];
  photoIds: string[];
}

class TimelineProjection {
  private items: TimelineItem[] = [];

  async rebuild(): Promise<void> {
    const events = await db.events
      .where('type')
      .anyOf(['ActivityLogged', 'PhotoUploaded', 'GoalMilestoneCompleted'])
      .toArray();

    this.items = events.map(e => this.eventToTimelineItem(e))
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  getTimeline(limit: number = 50): TimelineItem[] {
    return this.items.slice(0, limit);
  }

  getTimelineByGoal(goalId: string): TimelineItem[] {
    return this.items.filter(i => i.goalIds.includes(goalId));
  }

  getPhotoTimeline(): TimelineItem[] {
    return this.items.filter(i => i.photoIds.length > 0);
  }
}
```

---

## AI Integration

### Azure OpenAI for Goal Refinement

```typescript
import { OpenAIClient, AzureKeyCredential } from '@azure/openai';

const client = new OpenAIClient(
  process.env.AZURE_OPENAI_ENDPOINT!,
  new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY!)
);

async function refineGoalWithAI(roughIdea: string): Promise<GoalSuggestion[]> {
  const prompt = `
You are a thoughtful life coach helping someone define meaningful goals.

The person said: "${roughIdea}"

Suggest 3 clear, actionable goals based on this. For each goal:
- Make it specific and measurable (SMART framework)
- Suggest a category (family, nature, health, learning, home)
- Suggest if it's a positive goal (do something) or avoidance goal (stop doing something)
- Include a realistic target (daily, weekly, etc.)

Return JSON array of goals.
`;

  const response = await client.getChatCompletions(
    process.env.AZURE_OPENAI_DEPLOYMENT!,
    [{ role: 'user', content: prompt }],
    { maxTokens: 500, temperature: 0.7 }
  );

  return JSON.parse(response.choices[0].message.content);
}
```

### Future: Pattern Analysis

Once enough user data exists:
- Analyze successful goal patterns
- Suggest optimal reminder times
- Identify correlations (e.g., "Exercise goals succeed more when paired with photo tracking")
- Personalized encouragement

---

## Future: Mobile Sync Strategy

### Event Sync Architecture (Flutter App)

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│  Mobile App     │         │  Azure Functions │         │   Cosmos DB     │
│  (Flutter)      │◄────────┤  (Sync Service)  │────────►│  (Event Store)  │
│                 │  SignalR│                  │         │                 │
│  Local Events   │         │  Conflict Res.   │         │  Global Events  │
│  (Drift SQLite) │         │  Auth (JWT)      │         │  (Partitioned)  │
└─────────────────┘         └──────────────────┘         └─────────────────┘
        │                            │
        └────── Sync Protocol ───────┘
        
        1. Mobile appends local events
        2. Periodic sync pushes uncommitted events
        3. Azure Functions validates & appends to Cosmos DB
        4. SignalR pushes new events to all devices
        5. Mobile replays new events to update state
```

### Conflict Resolution

Event sourcing makes conflicts rare:
- Events are facts, not state updates
- Timestamp + device ID ensures unique events
- Commutative events (e.g., two progress logs) don't conflict
- Non-commutative events (e.g., goal deletion) use last-write-wins or manual resolution

---

## Performance Considerations

### Snapshot Strategy

For aggregates with many events (100+), create snapshots:
- Snapshot every 50 events
- Load snapshot + replay remaining events
- Rebuild projections in background (Web Worker)

### Projection Caching

- Cache projection results in Zustand store
- Only rebuild when new events affect projection
- Use IndexedDB indexes for fast queries

### Photo Optimization

- Generate thumbnails on upload
- Lazy load full-resolution photos
- Consider Azure Blob Storage for production (IndexedDB has ~50MB limit per domain)

---

## Testing Strategy

### Event Store Tests
- Append events
- Load aggregates
- Replay events
- Snapshot creation & loading

### Aggregate Tests
- Command validation
- Event generation
- State reconstruction
- Business rules

### Projection Tests
- Rebuild from events
- Query results
- Event handling

### Integration Tests
- Full flow: Command → Events → Projection → UI
- AI refinement pipeline
- Photo upload & retrieval

---

## References

- **Event Sourcing**: Martin Fowler - [martinfowler.com/eaaDev/EventSourcing.html](https://martinfowler.com/eaaDev/EventSourcing.html)
- **Event Modeling**: [eventmodeling.org](https://eventmodeling.org)
- **Book**: "Understanding Eventsourcing" by Martin Dilger
- **Dexie.js**: [dexie.org](https://dexie.org)
- **Azure OpenAI**: [learn.microsoft.com/azure/ai-services/openai](https://learn.microsoft.com/azure/ai-services/openai/)

---

**Built with ❤️ for the GitHub Copilot CLI Challenge**
