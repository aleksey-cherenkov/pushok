// Event Sourcing - Event Type Definitions

export type EventType =
  | 'GoalCreated'
  | 'GoalUpdated'
  | 'GoalArchived'
  | 'JournalEntryAdded'
  | 'JournalEntryUpdated'
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

// Goal Events
export interface GoalCreatedEvent extends BaseEvent {
  type: 'GoalCreated';
  data: {
    title: string;
    description?: string;
    category?: string;
    targetDate?: string;
  };
}

export interface GoalUpdatedEvent extends BaseEvent {
  type: 'GoalUpdated';
  data: {
    title?: string;
    description?: string;
    category?: string;
    targetDate?: string;
  };
}

export interface GoalArchivedEvent extends BaseEvent {
  type: 'GoalArchived';
  data: {
    reason?: string;
  };
}

// Journal Events
export interface JournalEntryAddedEvent extends BaseEvent {
  type: 'JournalEntryAdded';
  data: {
    content: string;
    mood?: string;
    tags?: string[];
    goalIds?: string[];
  };
}

export interface JournalEntryUpdatedEvent extends BaseEvent {
  type: 'JournalEntryUpdated';
  data: {
    content?: string;
    mood?: string;
    tags?: string[];
  };
}

// Reflection Events
export interface ReflectionAddedEvent extends BaseEvent {
  type: 'ReflectionAdded';
  data: {
    content: string;
    journalEntryId?: string;
    goalId?: string;
  };
}

// Milestone Events
export interface MilestoneReachedEvent extends BaseEvent {
  type: 'MilestoneReached';
  data: {
    goalId: string;
    title: string;
    description?: string;
  };
}

export type Event =
  | GoalCreatedEvent
  | GoalUpdatedEvent
  | GoalArchivedEvent
  | JournalEntryAddedEvent
  | JournalEntryUpdatedEvent
  | ReflectionAddedEvent
  | MilestoneReachedEvent;
