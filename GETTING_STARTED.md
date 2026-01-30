# Getting Started with Way Finder Development

> **Way Finder** (codenamed Pushok) - Find your way to what matters

## Quick Start

```bash
cd C:\Users\aleks\code\pushok

# Start development server
npm run dev

# Open browser
# http://localhost:3000
```

---

## First-Time Setup Checklist

### 1. Version Control
```bash
# Initialize Git (if not already)
git init

# Create .gitignore additions
echo ".env.local" >> .gitignore
echo "*.log" >> .gitignore

# Initial commit
git add .
git commit -m "feat: initial Way Finder setup with event sourcing architecture"

# Create GitHub repo and push
git remote add origin https://github.com/aleksey-cherenkov/pushok.git
git branch -M main
git push -u origin main
```

> **Note:** Repository name remains `pushok` (codename), but the app is branded as "Way Finder".

### 2. Environment Variables
Create `.env.local` in project root:

```env
# Azure OpenAI Configuration
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key-here
AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini

# App Configuration
NEXT_PUBLIC_APP_NAME=Way Finder
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note:** GPT-4o mini is the recommended model for cost optimization ($5-20/month budget).

### 3. Install shadcn/ui (Recommended)
```bash
# Initialize shadcn/ui
npx shadcn@latest init

# When prompted:
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes

# Add essential components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add textarea
npx shadcn@latest add badge
npx shadcn@latest add dialog
npx shadcn@latest add tabs
npx shadcn@latest add calendar
```

---

## Development Workflow

### Phase 2: Event Store Implementation (Current)

**Goal:** Build the event sourcing foundation

#### Step 1: Event Type Definitions
Create `lib/event-store/event-types.ts`:

```typescript
// Base event interface
export interface BaseEvent {
  id: string;
  type: string;
  aggregateId: string;
  aggregateType: 'goal' | 'activity' | 'photo' | 'reminder';
  payload: any;
  metadata: {
    userId: string;
    timestamp: number;
    version: number;
  };
}

// Goal events
export interface GoalDraftCreatedEvent extends BaseEvent {
  type: 'GoalDraftCreated';
  aggregateType: 'goal';
  payload: {
    roughIdea: string;
  };
}

// ... more event types
```

#### Step 2: Dexie Database
Create `lib/event-store/event-store.ts`:

```typescript
import Dexie, { Table } from 'dexie';
import { BaseEvent } from './event-types';

class EventStoreDB extends Dexie {
  events!: Table<BaseEvent>;
  snapshots!: Table<Snapshot>;  // Optional: for performance with 100+ events
  photos!: Table<PhotoBlob>;    // Photo blob storage

  constructor() {
    super('WayFinderEventStore');
    this.version(1).stores({
      events: 'id, [aggregateType+aggregateId], timestamp, [metadata.userId]',
      snapshots: '[aggregateId+aggregateType], version',
      photos: 'id, uploadedAt'
    });
  }
}

export const db = new EventStoreDB();

// Event store API
export async function appendEvent(event: BaseEvent): Promise<void> {
  await db.events.add(event);
}

export async function loadEvents(aggregateId: string, aggregateType: string = 'goal'): Promise<BaseEvent[]> {
  return db.events
    .where('[aggregateType+aggregateId]')
    .equals([aggregateType, aggregateId])
    .toArray();
}
```

#### Step 3: Base Aggregate
Create `lib/aggregates/base-aggregate.ts`

#### Step 4: Test It
Create `app/api/events/test/route.ts` to test event store

---

## Using GitHub Copilot CLI

### Commands to Try

**Generate event types:**
```bash
copilot "Generate TypeScript interfaces for goal lifecycle events"
```

**Create aggregate class:**
```bash
copilot "Create a Goal aggregate class with event sourcing"
```

**Build UI component:**
```bash
copilot "Create a React component for goal creation form"
```

**Write tests:**
```bash
copilot "Generate unit tests for event store using Vitest"
```

---

## Project Structure Guide

### Where to Put What

**Domain Logic:**
- `lib/event-store/` - Event sourcing infrastructure
- `lib/aggregates/` - Business rules, state reconstruction
- `lib/commands/` - Command handlers
- `lib/projections/` - Read models for UI

**API Routes:**
- `app/api/ai/` - Azure OpenAI integration
- `app/api/events/` - Event store endpoints (if needed)

**UI Components:**
- `components/ui/` - shadcn/ui base components
- `components/goals/` - Goal-specific components
- `components/timeline/` - Timeline & activity components
- `components/photos/` - Photo upload & gallery

**Pages:**
- `app/page.tsx` - Main dashboard
- `app/goals/` - Goal management pages
- `app/timeline/` - Timeline & photos
- `app/analytics/` - Progress & charts
- `app/settings/` - User preferences

**Hooks:**
- `hooks/useEventStore.ts` - Event store integration
- `hooks/useGoals.ts` - Goal queries
- `hooks/useTimeline.ts` - Timeline data

---

## Testing Strategy

### Philosophy: Minimal Testing for Event Sourcing

Based on event sourcing best practices (Martin Dilger, Adam Dymitruk):
- **Events are the tests** - If events are stored correctly, the system is correct
- **Projections are deterministic** - Same events always produce same state
- **No unit tests needed for MVP** - Delete IndexedDB and restart fresh during development

### During Development
```bash
# Clear IndexedDB when schemas change (Chrome DevTools)
# Application → IndexedDB → Delete "WayFinderEventStore"

# Or in browser console:
indexedDB.deleteDatabase('WayFinderEventStore');
```

### Optional: Integration Testing (Future)

```bash
# Install testing dependencies (if needed later)
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom

# Add test script to package.json
"scripts": {
  "test": "vitest",
  "test:ui": "vitest --ui"
}
```

---

## Debugging Tips

### IndexedDB Debugging
**Chrome DevTools:**
1. Open DevTools (F12)
2. Go to "Application" tab
3. Expand "IndexedDB"
4. See "WayFinderEventStore" database

**View Events:**
```typescript
// In browser console
const db = await new Dexie('WayFinderEventStore').open();
const events = await db.table('events').toArray();
console.table(events);
```

### Event Replay Debugging
```typescript
// Load and replay aggregate
const events = await loadEvents('goal_123');
const goal = new GoalAggregate();
events.forEach(e => {
  console.log('Applying event:', e.type, e.payload);
  goal.apply(e);
});
console.log('Final state:', goal);
```

---

## Common Tasks

### Add a New Event Type
1. Define interface in `lib/event-store/event-types.ts`
2. Add case in aggregate's `apply()` method
3. Create command that generates the event
4. Update projections to handle the event

### Add a New UI Component
1. Create in `components/[category]/`
2. Use shadcn/ui base components
3. Import Tailwind classes
4. Connect to Zustand store or hooks

### Create API Route
1. Add route in `app/api/[name]/route.ts`
2. Use Next.js route handlers
3. Return JSON responses
4. Handle errors properly

---

## Performance Tips

### Event Store Optimization
- Use snapshots for aggregates with 100+ events
- Index frequently queried fields
- Batch event writes when possible
- Use Web Workers for projection rebuilding

### UI Optimization
- Lazy load photo components
- Use React.memo for expensive components
- Implement virtual scrolling for long lists
- Code split by route

---

## Azure Deployment (When Ready)

### 1. Create Azure Resources
```bash
# Install Azure CLI
# https://learn.microsoft.com/cli/azure/install-azure-cli

# Login
az login

# Create resource group
az group create --name wayfinder-rg --location eastus

# Create Static Web App
az staticwebapp create \
  --name wayfinder-app \
  --resource-group wayfinder-rg \
  --source https://github.com/aleksey-cherenkov/pushok \
  --location eastus \
  --branch main \
  --app-location "/" \
  --output-location ".next"
```

### 2. Configure Custom Domain
```bash
# Add custom domain (keeping pushok.life domain)
az staticwebapp hostname set \
  --name wayfinder-app \
  --resource-group wayfinder-rg \
  --hostname pushok.life
```

### 3. Set Environment Variables
In Azure Portal:
- Go to Static Web App → Settings → Environment variables
- Add production variables:

```env
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-production-key
AZURE_OPENAI_DEPLOYMENT=gpt-4o-mini
NEXT_PUBLIC_APP_NAME=Way Finder
NEXT_PUBLIC_APP_URL=https://pushok.life
```

---

## Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Dexie.js Guide](https://dexie.org/docs/)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Azure OpenAI](https://learn.microsoft.com/azure/ai-services/openai/)

### Event Sourcing
- [Martin Fowler: Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html)
- [Event Modeling](https://eventmodeling.org)
- Book: "Understanding Eventsourcing" by Martin Dilger

### Project Docs
- `README.md` - Project overview & features
- `ARCHITECTURE.md` - Event sourcing & technical architecture
- `PROJECT.md` - Implementation roadmap & phase tracking
- `GETTING_STARTED.md` - This file (developer onboarding)

---

## Need Help?

### Stuck on Event Sourcing?
- Read ARCHITECTURE.md section on Event Model
- Check example aggregate in documentation
- Review event flow diagrams

### UI/UX Questions?
- Check shadcn/ui documentation
- Review Tailwind CSS classes
- Look at Next.js examples

### Copilot CLI?
- Use `copilot "your question here"`
- Reference documentation: `copilot --help`

---

## Next Session Checklist

When you return to development:

1. ✅ Pull latest changes: `git pull`
2. ✅ Install dependencies: `npm install`
3. ✅ Review PROJECT.md for current phase
4. ✅ Check TODO list in session plan.md
5. ✅ Start dev server: `npm run dev`
6. ✅ Continue where you left off!

---

Happy coding! 🚀

**Remember:** You're building Way Finder - a way finder for meaningful living, in memory of Stela. Take your time, enjoy the process, and create something beautiful.

---

## Key Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Branding** | Way Finder (codename: Pushok) | More unique, describes purpose |
| **AI Model** | GPT-4o mini | Cost-optimized ($5-20/month) |
| **Testing** | No unit tests | Event sourcing philosophy |
| **Streaks** | No streaks | Milestones instead (no stress) |
| **Auth** | None (single user) | MVP simplicity |
| **Database** | IndexedDB (Dexie) | Local-first, privacy by default |
