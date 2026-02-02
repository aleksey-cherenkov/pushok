// Event Sourcing - Event Type Definitions

export type EventType =
  | 'HabitCreated'
  | 'HabitUpdated'
  | 'HabitArchived'
  | 'HabitPaused'
  | 'HabitResumed'
  | 'ActivityLogged'
  | 'ActivityUpdated'
  | 'AspirationCreated'
  | 'AspirationUpdated'
  | 'AspirationPaused'
  | 'AspirationResumed'
  | 'AspirationArchived'
  | 'ReflectionAdded'
  | 'MilestoneReached';

export interface BaseEvent {
  id: string;
  aggregateId: string;
  aggregateType: string;
  type: EventType;
  timestamp: number;
  version: number;
  metadata?: Record<string, unknown>;
}

// Habit Events
export interface HabitCreatedEvent extends BaseEvent {
  type: 'HabitCreated';
  data: {
    title: string;
    description?: string;
    category?: string;
    linkedAspirationId?: string;
    recurring?: 'daily' | 'weekly' | 'custom';
    nudgeTime?: string;
    metric?: 'checkmark' | 'count' | 'duration' | 'distance';
    unit?: string;
    target?: number;
  };
}

export interface HabitUpdatedEvent extends BaseEvent {
  type: 'HabitUpdated';
  data: {
    title?: string;
    description?: string;
    category?: string;
    linkedAspirationId?: string;
    recurring?: 'daily' | 'weekly' | 'custom';
    nudgeTime?: string;
  };
}

export interface HabitArchivedEvent extends BaseEvent {
  type: 'HabitArchived';
  data: {
    reason?: string;
  };
}

export interface HabitPausedEvent extends BaseEvent {
  type: 'HabitPaused';
  data: {
    reason?: string;
  };
}

export interface HabitResumedEvent extends BaseEvent {
  type: 'HabitResumed';
  data: Record<string, never>;
}

// Activity Log Events (when you do something)
export interface ActivityLoggedEvent extends BaseEvent {
  type: 'ActivityLogged';
  data: {
    habitId: string;
    value?: number;
    completed?: boolean;
    notes?: string;
    mood?: string;
    photoIds?: string[];
    overcameResistance?: boolean;
    resistanceType?: 'perfectionism' | 'self-doubt' | 'procrastination' | 'fatigue' | 'fear' | 'distraction';
  };
}

export interface ActivityUpdatedEvent extends BaseEvent {
  type: 'ActivityUpdated';
  data: {
    logId: string;
    value?: number;
    notes?: string;
    mood?: string;
  };
}

// Aspiration Events
export interface AspirationCreatedEvent extends BaseEvent {
  type: 'AspirationCreated';
  data: {
    title: string;
    description?: string;
    category?: string;
  };
}

export interface AspirationUpdatedEvent extends BaseEvent {
  type: 'AspirationUpdated';
  data: {
    title?: string;
    description?: string;
    category?: string;
  };
}

export interface AspirationPausedEvent extends BaseEvent {
  type: 'AspirationPaused';
  data: Record<string, never>;
}

export interface AspirationResumedEvent extends BaseEvent {
  type: 'AspirationResumed';
  data: Record<string, never>;
}

export interface AspirationArchivedEvent extends BaseEvent {
  type: 'AspirationArchived';
  data: Record<string, never>;
}

// Reflection Events
export interface ReflectionAddedEvent extends BaseEvent {
  type: 'ReflectionAdded';
  data: {
    content: string;
    habitId?: string;
    period?: 'weekly' | 'monthly' | 'quarterly';
  };
}

// Milestone Events
export interface MilestoneReachedEvent extends BaseEvent {
  type: 'MilestoneReached';
  data: {
    habitId: string;
    title: string;
    count: number;
    description?: string;
  };
}

export type Event =
  | HabitCreatedEvent
  | HabitUpdatedEvent
  | HabitArchivedEvent
  | HabitPausedEvent
  | HabitResumedEvent
  | ActivityLoggedEvent
  | ActivityUpdatedEvent
  | AspirationCreatedEvent
  | AspirationUpdatedEvent
  | AspirationPausedEvent
  | AspirationResumedEvent
  | AspirationArchivedEvent
  | ReflectionAddedEvent
  | MilestoneReachedEvent;
