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
  | 'MilestoneReached'
  | 'StelaMessageCreated'
  | 'StelaMessageDismissed'
  | 'ProjectCreated'
  | 'ProjectUpdated'
  | 'ProjectArchived'
  | 'PhaseAdded'
  | 'PhaseUpdated'
  | 'PhaseStatusChanged'
  | 'PhasePhotoAdded'
  | 'PhaseDeleted'
  | 'MomentCreated'
  | 'MomentUpdated'
  | 'MomentDeleted';

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

// Stela Message Events
export interface StelaMessageCreatedEvent extends BaseEvent {
  type: 'StelaMessageCreated';
  data: {
    message: string;
    category: 'family' | 'nature' | 'creativity' | 'rest' | 'connection' | 'mindfulness' | 'play';
    generatedAt: number;
  };
}

export interface StelaMessageDismissedEvent extends BaseEvent {
  type: 'StelaMessageDismissed';
  data: {
    dismissedAt: number;
    reason?: 'not-relevant' | 'done' | 'later';
  };
}

// Project Events
export interface ProjectCreatedEvent extends BaseEvent {
  type: 'ProjectCreated';
  data: {
    title: string;
    description?: string;
    category?: string;
    createdAt: number;
  };
}

export interface ProjectUpdatedEvent extends BaseEvent {
  type: 'ProjectUpdated';
  data: {
    title?: string;
    description?: string;
    category?: string;
    updatedAt: number;
  };
}

export interface ProjectArchivedEvent extends BaseEvent {
  type: 'ProjectArchived';
  data: {
    archivedAt: number;
  };
}

export interface PhaseAddedEvent extends BaseEvent {
  type: 'PhaseAdded';
  data: {
    phaseId: string;
    name: string;
    order: number;
    addedAt: number;
  };
}

export interface PhaseUpdatedEvent extends BaseEvent {
  type: 'PhaseUpdated';
  data: {
    phaseId: string;
    name?: string;
    notes?: string;
    progress?: number; // 0-100
    timeSpentMinutes?: number;
    startDate?: number;
    endDate?: number;
    updatedAt: number;
  };
}

export interface PhaseStatusChangedEvent extends BaseEvent {
  type: 'PhaseStatusChanged';
  data: {
    phaseId: string;
    status: 'not-started' | 'in-progress' | 'complete';
    changedAt: number;
  };
}

export interface PhasePhotoAddedEvent extends BaseEvent {
  type: 'PhasePhotoAdded';
  data: {
    phaseId: string;
    photoId: string;
    photoData: string; // base64 encoded
    caption?: string;
    addedAt: number;
  };
}

export interface PhaseDeletedEvent extends BaseEvent {
  type: 'PhaseDeleted';
  data: {
    phaseId: string;
    deletedAt: number;
  };
}

// Moment Events
export interface MomentCreatedEvent extends BaseEvent {
  type: 'MomentCreated';
  data: {
    photoData: string; // base64 encoded
    caption?: string;
    createdAt: number;
  };
}

export interface MomentUpdatedEvent extends BaseEvent {
  type: 'MomentUpdated';
  data: {
    caption?: string;
    updatedAt: number;
  };
}

export interface MomentDeletedEvent extends BaseEvent {
  type: 'MomentDeleted';
  data: {
    deletedAt: number;
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
  | MilestoneReachedEvent
  | StelaMessageCreatedEvent
  | StelaMessageDismissedEvent
  | ProjectCreatedEvent
  | ProjectUpdatedEvent
  | ProjectArchivedEvent
  | PhaseAddedEvent
  | PhaseUpdatedEvent
  | PhaseStatusChangedEvent
  | PhasePhotoAddedEvent
  | PhaseDeletedEvent
  | MomentCreatedEvent
  | MomentUpdatedEvent
  | MomentDeletedEvent;
