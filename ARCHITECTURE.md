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

### Design Philosophy: Gentle Habit Tracking & Reflection

Pushok is **not a task manager** or productivity tool with streaks. It's a **gentle companion** that helps you:

- **Nurture good habits** without pressure or guilt
- **Track meaningful moments** with photos and notes
- **Reflect on progress** through aggregated views (weekly, monthly, yearly)
- **Celebrate wins** without broken streaks or FOMO
- **Remember what matters** (In memory of Stela - simple joys: birds, nature, presence)

**Core Principles:**

- ✅ **Aggregation without guilt**: "You walked 18 times this month!" (not "You broke a 3-day streak!")
- ✅ **Gentle nudging**: Daily reminders without pressure
- ✅ **Celebrate milestones**: 10 walks, 30 walks, 100 walks - feel good!
- ✅ **Remove procrastination**: Quick check-ins make it easy to log wins
- ❌ **No broken streaks**: Missing a day? Just keep going, no guilt
- ❌ **No FOMO mechanics**: No countdown timers, no "losing progress"

**Single User Design (MVP):**

- No authentication required
- All data stored locally in IndexedDB
- Privacy by default - your data never leaves your device
- Future: Cloud sync for mobile app with optional family sharing

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

### Habit (formerly Goal) Aggregate

**Events:**

- `HabitCreated` - User defines a habit to nurture
- `HabitUpdated` - Modify habit details
- `HabitCategorized` - Assign category (nature, mindfulness, connection, health, etc.)
- `HabitRecurringSet` - Set recurrence (daily, weekly, custom)
- `NudgeScheduleSet` - Set gentle reminder time (optional)
- `HabitPaused` / `HabitResumed` - Temporarily pause without guilt
- `HabitArchived` - Move to archived (no longer active)

**Commands:**

- `CreateHabit(title, description, category, recurring, nudgeTime)`
- `UpdateHabit(habitId, updates)`
- `SetNudgeSchedule(habitId, time)`
- `PauseHabit(habitId)` / `ResumeHabit(habitId)`
- `ArchiveHabit(habitId)`

**Example:**

```typescript
habit = {
  id: "habit_123",
  title: "Go for daily walks",
  description: "Connect with nature like Stela loved",
  category: "nature",
  recurring: "daily",
  nudgeTime: "16:00", // 4pm gentle reminder
  status: "active",
};
```

### Activity Aggregate (The Check-ins)

**Events:**

- `ActivityLogged` - User logs "I did it!" (quick check-in)
- `ActivityNotesAdded` - Optional: Add reflection/notes
- `ActivityPhotoAttached` - Optional: Link photos
- `ActivityDurationSet` - Optional: Set time spent
- `ActivityMoodSet` - Optional: How did it feel?
- `ActivityEdited` - Modify activity
- `ActivityDeleted` - Soft delete

**Commands:**

- `LogActivity(habitId, timestamp, note?, photo?, duration?, mood?)`
- `AddActivityNote(activityId, note)`
- `AttachPhoto(activityId, photoId)`

**Use Cases:**

- Quick: Tap "✓ Walked today" (2 seconds, saved)
- Detailed: "Walked 30min, saw 2 cardinals and a squirrel 🐿️ [photo attached]"

**No Streaks - Just Facts:**

```
ActivityLogged: Jan 29 - Walked
ActivityLogged: Jan 30 - Walked
(Jan 31 - no event, no guilt)
ActivityLogged: Feb 1 - Walked

Aggregation shows: "3 walks this week" ✓
NOT: "You broke a streak!" ✗
```

### Photo Aggregate

**Photo Categories (User-Defined):**

- **Project Photos**: Before/during/after shots for home improvement, creative work
- **Family & Pets**: Kids, pets, meaningful moments together
- **Nature**: Birds, squirrels, outdoor moments (Stela's favorites)
- **Health/Lifestyle**: Food, exercise, wellness activities
- **Custom**: User decides what matters to them

**Events:**

- `PhotoUploaded` - Upload photo (blob to IndexedDB)
- `PhotoMetadataExtracted` - EXIF data (date, location)
- `PhotoTagged` - Tag with people, pets, activities
- `PhotoMemoryCreated` - Mark as memorable moment
- `PhotoLinkedToGoal` - Connect to goal/activity
- `PhotoCaptionAdded` - Add description
- `PhotoPhaseSet` - Before/During/After for project tracking

**Special: In Memory of Stela Gallery**

- Dedicated gallery accessible from settings/about (couple clicks away)
- Photos tagged with "Stela" appear here
- Story of why this app exists
- Memorial, not sad - celebrating her life and lessons

### Reminder Aggregate

**Events:**

- `ReminderCreated` - Define reminder rule
- `ReminderScheduleSet` - Set recurrence (daily, weekly, custom)
- `ReminderTriggered` - Reminder fires (browser notification)
- `ReminderDismissed` - User dismisses
- `ReminderCompleted` - User marks complete
- `ReminderSnoozed` - Delay reminder
- `ReminderDisabled` / `ReminderEnabled`

**Gentle Reminder Philosophy (Like Stela):**

- **Not intrusive**: Daily digest instead of individual pop-ups
- **Calm dashboard**: Suggestions appear softly, not demanding
- **Nature imagery**: Birds, squirrels, grass, sunshine throughout
- **Encouraging messages**: "Stela would be proud" style, never guilt-tripping
- **No stress mechanics**: No streaks, no FOMO, no artificial urgency
- **Learn from behavior**: Suggest optimal times based on when user is receptive

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
├── events/
│   ├── store.ts                     # Dexie.js IndexedDB event store
│   ├── types.ts                     # Event type definitions
│   └── aggregate.ts                 # Base aggregate with event replay
├── aggregates/
│   ├── habit.ts                     # Habit domain logic (formerly goal)
│   ├── activity.ts                  # Activity check-in logic
│   ├── photo.ts                     # Photo domain logic
│   └── reminder.ts                  # Nudge/reminder domain logic
├── projections/
│   ├── habits-dashboard.ts          # Active habits view
│   ├── activity-aggregation.ts      # Weekly/monthly aggregations
│   ├── timeline.ts                  # Activity timeline
│   ├── analytics.ts                 # Charts & insights (NO STREAKS!)
│   └── photo-gallery.ts             # Photo views
└── ai/
    ├── habit-refiner.ts             # AI habit refinement logic
    └── openai-client.ts         # Azure OpenAI wrapper
```

---

## Data Flow

### Example: User Creates a Habit & Logs Activities

**Step 1: User Creates Habit**

```typescript
// User: "I want to go for daily walks"
const habitCommand = {
  title: "Go for daily walks",
  description: "Connect with nature, like Stela loved",
  category: "nature",
  recurring: "daily",
  nudgeTime: "16:00", // gentle 4pm reminder
};

// Create habit aggregate
const habit = new Habit();
habit.create(habitCommand);
await habit.save();

// Events stored:
// - HabitCreated
// - HabitRecurringSet
// - NudgeScheduleSet
```

**Step 2: User Logs Activity (Quick Check-in)**

```typescript
// Day 1: User taps "✓ Walked today"
const activity1 = new Activity();
activity1.log({
  habitId: habit.getId(),
  timestamp: Date.now(),
  note: "Saw cardinals at the park",
});
await activity1.save();

// Event stored: ActivityLogged { habitId, timestamp, note }
```

**Step 3: Aggregation (Weekly Reflection)**

```typescript
// Projection builds view from events
const activityEvents = await eventStore.getEventsByType("ActivityLogged");
const thisWeekActivities = activityEvents.filter(
  (e) => e.data.habitId === habit.getId() && isThisWeek(e.timestamp),
);

// Display: "You walked 5 times this week! 🌿"
// NOT: "You broke a streak on Tuesday" ✗
```

**The Difference:**

- ✅ **No Streaks**: Missing Tuesday doesn't "break" anything
- ✅ **Aggregation**: "5 times this week" feels good
- ✅ **Gentle**: Just facts, no guilt
- ✅ **Milestones**: 10 walks → 20 walks → 50 walks (celebrate!)

```

await eventStore.append(activatedEvent);
```

**Step 5: Projection Updates**

```typescript
// Projection rebuilds from events
const activeGoalsProjection = await rebuildProjection("activeGoals");
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
  version: number; // Last event version included
  state: any; // Aggregate state at that version
  createdAt: number;
}
```

**Photos Table**

```typescript
interface PhotoBlob {
  id: string;
  blob: Blob; // Actual photo data
  thumbnail: Blob; // Generated thumbnail
  uploadedAt: number;
}
```

### Dexie.js Configuration

```typescript
import Dexie, { Table } from "dexie";

class EventStoreDB extends Dexie {
  events!: Table<StoredEvent>;
  snapshots!: Table<Snapshot>;
  photos!: Table<PhotoBlob>;

  constructor() {
    super("PushokEventStore");
    this.version(1).stores({
      events: "id, [aggregateType+aggregateId], timestamp, [metadata.userId]",
      snapshots: "[aggregateId+aggregateType], version",
      photos: "id, uploadedAt",
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
  AggregateClass: new () => T,
): Promise<T> {
  // Try snapshot first (if exists)
  const snapshot = await db.snapshots
    .where("[aggregateId+aggregateType]")
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
    .where("[aggregateType+aggregateId]")
    .equals([aggregateType, aggregateId])
    .and((e) => e.metadata.version > fromVersion)
    .toArray();

  events.forEach((e) => aggregate.apply(e));
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
        version: ++this.version,
      },
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
  title: string = "";
  description: string = "";
  category: string = "";
  status: "draft" | "active" | "paused" | "completed" = "draft";
  progress: number = 0;
  target: { value: number; unit: string; frequency: string } | null = null;

  apply(event: StoredEvent): void {
    switch (event.type) {
      case "GoalDefined":
        this.title = event.payload.title;
        this.description = event.payload.description;
        this.category = event.payload.category;
        this.target = event.payload.target;
        break;

      case "GoalActivated":
        this.status = "active";
        break;

      case "GoalProgressRecorded":
        this.progress += event.payload.amount;
        break;

      case "GoalCompleted":
        this.status = "completed";
        this.progress = this.target?.value || 100;
        break;

      // ... more cases
    }
  }

  // Commands
  defineGoal(
    title: string,
    description: string,
    category: string,
    target: any,
  ): void {
    if (!title) throw new Error("Goal title required");
    this.addEvent("GoalDefined", { title, description, category, target });
  }

  activate(): void {
    if (this.status !== "draft") throw new Error("Goal must be in draft");
    this.addEvent("GoalActivated", { activatedAt: Date.now() });
  }

  recordProgress(amount: number): void {
    if (this.status !== "active") throw new Error("Goal must be active");
    this.addEvent("GoalProgressRecorded", { amount, recordedAt: Date.now() });

    if (this.target && this.progress >= this.target.value) {
      this.addEvent("GoalCompleted", { completedAt: Date.now() });
    }
  }
}
```

---

## Projections & Read Models

### Goals Dashboard Projection

**Design Decision: No Streaks**

Streaks create stress when broken. Instead, we focus on:

- **Milestones** - Celebrate achievements, not consecutive days
- **Progress over time** - Weekly, monthly, yearly reflection
- **Photo memories** - Visual proof of meaningful moments

```typescript
interface GoalDashboardItem {
  id: string;
  title: string;
  category: string;
  progress: number;
  target: number;
  lastActivity: number;
  status: string;
  milestones: Milestone[];
  photoCount: number;
}

class GoalsDashboardProjection {
  private goals: Map<string, GoalDashboardItem> = new Map();

  async rebuild(): Promise<void> {
    this.goals.clear();

    const events = await db.events
      .where("aggregateType")
      .equals("goal")
      .toArray();

    events.forEach((e) => this.apply(e));
  }

  apply(event: StoredEvent): void {
    const goalId = event.aggregateId;
    const goal = this.goals.get(goalId) || this.createEmpty(goalId);

    switch (event.type) {
      case "GoalDefined":
        goal.title = event.payload.title;
        goal.category = event.payload.category;
        goal.target = event.payload.target?.value || 100;
        break;

      case "GoalProgressRecorded":
        goal.progress += event.payload.amount;
        goal.lastActivity = event.payload.recordedAt;
        break;

      case "GoalMilestoneCompleted":
        goal.milestones.push(event.payload.milestone);
        break;

      case "GoalCompleted":
        goal.status = "completed";
        goal.progress = goal.target;
        break;
    }

    this.goals.set(goalId, goal);
  }

  getActiveGoals(): GoalDashboardItem[] {
    return Array.from(this.goals.values())
      .filter((g) => g.status === "active")
      .sort((a, b) => b.lastActivity - a.lastActivity);
  }
}
```

### Timeline Projection

```typescript
interface TimelineItem {
  id: string;
  type: "activity" | "photo" | "milestone";
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
      .where("type")
      .anyOf(["ActivityLogged", "PhotoUploaded", "GoalMilestoneCompleted"])
      .toArray();

    this.items = events
      .map((e) => this.eventToTimelineItem(e))
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  getTimeline(limit: number = 50): TimelineItem[] {
    return this.items.slice(0, limit);
  }

  getTimelineByGoal(goalId: string): TimelineItem[] {
    return this.items.filter((i) => i.goalIds.includes(goalId));
  }

  getPhotoTimeline(): TimelineItem[] {
    return this.items.filter((i) => i.photoIds.length > 0);
  }
}
```

---

## AI Integration

### Azure OpenAI for Goal Refinement

**Model Strategy (Cost-Optimized):**

- **Primary**: GPT-5-nano - Lowest cost with 90% prompt caching discount
- **Alternative**: GPT-4.1-nano - Fallback option if GPT-5-nano unavailable
- **Budget**: $1-5/month for personal use

**Why GPT-5-nano:**

- Input: $0.05 per 1M tokens (67% cheaper than GPT-4o-mini)
- Cached input: $0.01 per 1M tokens (90% discount for system prompts)
- Output: $0.40 per 1M tokens
- Released: Aug 2025
- Perfect for goal refinement with consistent system prompts

**Interaction Pattern (Claude/Copilot CLI style):**

- Show multiple suggestions for user to choose
- Allow "clarify" to ask follow-up questions
- Allow "regenerate" for new suggestions
- User always has final control

```typescript
import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

const client = new OpenAIClient(
  process.env.AZURE_OPENAI_ENDPOINT!,
  new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY!),
);

// System prompt - will be cached for 90% cost savings on subsequent calls
const SYSTEM_PROMPT = `You are a thoughtful life coach helping someone define meaningful goals.

For each goal suggestion:
- Make it specific and measurable (SMART framework)
- Suggest a category (family, nature, health, learning, home)
- Suggest if it's a positive goal (do something) or avoidance goal (stop doing something)
- Include a realistic target (daily, weekly, etc.)

Return JSON array of 3 goals.`;

async function refineGoalWithAI(roughIdea: string): Promise<GoalSuggestion[]> {
  const response = await client.getChatCompletions(
    process.env.AZURE_OPENAI_DEPLOYMENT!, // gpt-5-nano recommended
    [
      { role: "system", content: SYSTEM_PROMPT }, // Cached after first call
      { role: "user", content: `The person said: "${roughIdea}"` },
    ],
    { maxTokens: 500, temperature: 1 },
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

**Azure Resources (Future):**

- **Resource Group**: `rg-pushok` (same as web app)
- **Cosmos DB**: `pushok-cosmos` (event store)
- **Azure Functions**: `pushok-sync` (sync service)
- **SignalR Service**: `pushok-signalr` (real-time updates)
- **Blob Storage**: `pushokstorage` (photo storage)

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│  Mobile App     │         │  Azure Functions │         │   Cosmos DB     │
│  (Flutter)      │◄────────┤  (Sync Service)  │────────►│  (Event Store)  │
│                 │  SignalR│  pushok-sync     │         │  pushok-cosmos  │
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

## Testing Philosophy

**Decision: Minimal Testing for Event Sourcing**

Based on guidance from Martin Dilger and Adam Dymitruk (event sourcing experts), properly designed event sourcing systems don't require extensive unit tests because:

1. **Events are the tests** - Events are immutable facts; if events are stored correctly, the system is correct
2. **Projections are deterministic** - Given the same events, you always get the same state
3. **Business rules live in aggregates** - Simple, focused logic that's easy to verify manually

### What We Test (Integration Only)

**Manual/Integration Testing:**

- Full flow: Command → Events → Projection → UI
- AI refinement pipeline (GPT-4o mini responses)
- Photo upload & retrieval
- Event replay and state reconstruction

**During Development:**

- Delete IndexedDB and restart fresh when schemas change
- No migration scripts needed for MVP
- Visual verification through the UI

### Future Considerations

For production/mobile app:

- Consider integration tests for sync logic
- E2E tests for critical user flows
- But still no unit tests for aggregates/projections

---

## References

- **Event Sourcing**: Martin Fowler - [martinfowler.com/eaaDev/EventSourcing.html](https://martinfowler.com/eaaDev/EventSourcing.html)
- **Event Modeling**: [eventmodeling.org](https://eventmodeling.org)
- **Book**: "Understanding Eventsourcing" by Martin Dilger
- **Dexie.js**: [dexie.org](https://dexie.org)
- **Azure OpenAI**: [learn.microsoft.com/azure/ai-services/openai](https://learn.microsoft.com/azure/ai-services/openai/)

---

**Built with ❤️ for the GitHub Copilot CLI Challenge**
