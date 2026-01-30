# GitHub Copilot Instructions for Way Finder

> **Project Codename**: Pushok | **Domain**: pushok.life
> **Purpose**: A journaling and goal-tracking app for meaningful living
> **Dedicated to**: Stela, a beloved cat whose memory inspires this project

---

## Project Documentation Reference

Before writing any code, **always consult these project documents**:

| Document | Purpose | When to Reference |
|----------|---------|-------------------|
| [README.md](../README.md) | Project overview, features, quick start | Understanding project purpose |
| [ARCHITECTURE.md](../ARCHITECTURE.md) | Event sourcing design, data models, patterns | Implementing any feature |
| [GETTING_STARTED.md](../GETTING_STARTED.md) | Dev setup, workflow, debugging | Development questions |
| [PROJECT.md](../PROJECT.md) | Implementation roadmap, phase tracking, decisions | Planning work, checking progress |

**Important**: When you make architectural decisions or complete significant work, suggest updates to the relevant documentation file.

---

## Technology Stack (Use Latest Versions)

### Core Framework
- **Next.js 16+** with App Router (NOT Pages Router)
- **React 19+** with Server Components
- **TypeScript 5+** with strict mode
- **Tailwind CSS 4+** with `@tailwindcss/postcss`

### State & Data
- **Zustand 5+** for client state management
- **Dexie.js 4+** for IndexedDB (local-first storage)
- **date-fns 4+** for date manipulation
- **uuid 13+** for ID generation

### AI Integration
- **@azure/openai 2+** for AI features
- Models: GPT-4o mini (primary), Phi 3.5 (simple tasks)

### UI Components
- **shadcn/ui** components (when needed)
- Import from `@/components/ui/*`

---

## Architecture Patterns

### Event Sourcing (Critical)

This project uses **event sourcing** as the core architectural pattern. All state changes are stored as immutable events.

```typescript
// Event structure - ALWAYS follow this pattern
interface DomainEvent {
  id: string;              // UUID
  aggregateId: string;     // Entity this event belongs to
  aggregateType: string;   // 'Goal' | 'Activity' | 'Photo' | 'Reminder'
  eventType: string;       // Past tense: 'GoalCreated', 'ActivityLogged'
  timestamp: string;       // ISO 8601
  version: number;         // Aggregate version for ordering
  payload: Record<string, unknown>;
  metadata?: {
    userId?: string;
    correlationId?: string;
    causationId?: string;
  };
}
```

**Rules**:
1. Events are **immutable facts** - never modify past events
2. Event types use **past tense** (GoalCreated, not CreateGoal)
3. Commands trigger events, projections read events
4. Store events in IndexedDB via Dexie.js

### CQRS Pattern

- **Commands**: Write operations that produce events
- **Queries**: Read from projections, not from events directly
- **Projections**: Materialized views built from events

### File Organization

```
app/                    # Next.js App Router pages
  (dashboard)/          # Route groups for dashboard
  api/                  # API routes
lib/                    # Core business logic
  event-store/          # Event sourcing infrastructure
  aggregates/           # Domain aggregates (Goal, Activity, Photo, Reminder)
  projections/          # Read models for UI
  commands/             # Command handlers
  ai/                   # AI integration helpers
components/             # React components
  ui/                   # shadcn/ui base components
  goals/                # Feature-specific components
  timeline/
  photos/
hooks/                  # Custom React hooks
```

---

## Coding Standards

### TypeScript

```typescript
// Use strict typing - no 'any' unless absolutely necessary
// Use path aliases: @/ maps to project root
import { eventStore } from '@/lib/event-store';
import { GoalAggregate } from '@/lib/aggregates/goal';

// Prefer interfaces for object shapes
interface Goal {
  id: string;
  title: string;
  status: GoalStatus;
  createdAt: Date;
}

// Use union types for enums
type GoalStatus = 'draft' | 'active' | 'paused' | 'completed' | 'archived';

// Use readonly for immutable data
interface DomainEvent {
  readonly id: string;
  readonly eventType: string;
  readonly payload: Readonly<Record<string, unknown>>;
}
```

### React Components

```typescript
// Use function components with TypeScript
interface GoalCardProps {
  goal: Goal;
  onSelect?: (id: string) => void;
}

export function GoalCard({ goal, onSelect }: GoalCardProps) {
  // Use hooks at top level
  const [isExpanded, setIsExpanded] = useState(false);

  // Early returns for loading/error states
  if (!goal) return null;

  return (
    <div className="rounded-lg border p-4">
      {/* Component content */}
    </div>
  );
}
```

### Tailwind CSS 4

```typescript
// Use Tailwind utility classes directly
<div className="flex flex-col gap-4 p-6 bg-background rounded-xl shadow-sm">

// For complex/reusable styles, use CSS with @apply in globals.css
// Keep component files focused on structure, not style definitions
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files (components) | kebab-case | `goal-card.tsx` |
| Files (lib) | kebab-case | `event-store.ts` |
| Components | PascalCase | `GoalCard` |
| Functions | camelCase | `createGoal` |
| Constants | UPPER_SNAKE | `MAX_PHOTOS` |
| Types/Interfaces | PascalCase | `GoalStatus` |
| Event types | PascalCase past tense | `GoalCreated` |
| Commands | camelCase imperative | `createGoal` |

---

## Code Quality Rules

### Do's
- Use Server Components by default, Client Components only when needed
- Add `'use client'` directive only for interactive components
- Use `@/` path alias for all imports
- Handle loading and error states explicitly
- Use Zustand for client-side state that needs to persist across components
- Write self-documenting code with clear variable/function names

### Don'ts
- Don't use `any` type - use `unknown` and narrow types
- Don't use `var` - use `const` or `let`
- Don't mix Pages Router and App Router patterns
- Don't store sensitive data in IndexedDB (it's local-first but not encrypted)
- Don't create unit tests for event sourcing - events are immutable facts
- Don't implement authentication (single-user MVP)

### Error Handling

```typescript
// Use Result pattern for operations that can fail
type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// Handle errors explicitly, don't swallow them
async function saveEvent(event: DomainEvent): Promise<Result<void>> {
  try {
    await db.events.add(event);
    return { success: true, data: undefined };
  } catch (error) {
    console.error('Failed to save event:', error);
    return { success: false, error: error as Error };
  }
}
```

---

## AI Integration Guidelines

When implementing AI features (goal refinement, insights):

```typescript
// Use Azure OpenAI SDK
import { AzureOpenAI } from '@azure/openai';

// Follow the 3-option pattern for AI suggestions
interface AIRefinementResponse {
  options: Array<{
    title: string;
    description: string;
    reasoning: string;
  }>;
  clarifyingQuestions?: string[];
}

// Always give user final control
// AI suggests, user decides
```

---

## Documentation Maintenance

### When to Update Documentation

**Update PROJECT.md when**:
- Completing a task or phase
- Making an architectural decision
- Encountering blockers or changing approach

**Update ARCHITECTURE.md when**:
- Adding new event types
- Creating new aggregates
- Modifying data flow patterns

**Update README.md when**:
- Adding major features
- Changing setup instructions
- Updating tech stack

### Documentation Update Format

When suggesting documentation updates, use this format:

```markdown
## Suggested Documentation Update

**File**: PROJECT.md
**Section**: Phase 2 Tasks
**Change**: Mark task as completed

\`\`\`diff
- [ ] Implement event store API
+ [x] Implement event store API
\`\`\`
```

---

## Current Development Context

### Phase Status
- **Phase 1**: Foundation - COMPLETED
- **Phase 2**: Event Store Implementation - IN PROGRESS
- **Phases 3-10**: Planned

### Priority Focus Areas
1. Event type definitions in `lib/event-store/events.ts`
2. Dexie database schema in `lib/event-store/db.ts`
3. Event store API in `lib/event-store/store.ts`
4. Base aggregate class in `lib/aggregates/base.ts`

### Key Design Decisions
- No authentication (single-user MVP)
- No unit tests for event sourcing
- Milestones instead of streaks (no stress mechanics)
- Local-first with IndexedDB
- Azure Static Web Apps for deployment

---

## Quick Reference Commands

```bash
# Development
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm run lint         # Run ESLint

# When schemas change during development
# Delete IndexedDB in browser DevTools > Application > Storage
```

---

## Remember

This project is built **in memory of Stela**. The tone should be:
- Encouraging, not guilt-tripping
- Mindful, not overwhelming
- Focused on meaningful progress, not productivity metrics
- Calming, with nature-inspired design elements

When in doubt, ask: "Would this feature help someone reflect on their meaningful life journey?"
