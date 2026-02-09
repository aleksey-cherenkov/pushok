// Habit Aggregate (Simple recurring activities)

import { Aggregate } from '../events/aggregate';
import type {
  Event,
  HabitCreatedEvent,
  HabitUpdatedEvent,
  HabitArchivedEvent,
} from '../events/types';

export interface HabitState {
  id: string;
  title: string;
  description?: string;
  category?: string;
  linkedAspirationId?: string;
  recurring?: 'daily' | 'weekly' | 'custom';
  nudgeTime?: string;
  metric?: 'checkmark' | 'count' | 'duration' | 'distance';
  unit?: string;
  target?: number;
  createdAt: number;
  updatedAt: number;
  archivedAt?: number;
  archived: boolean;
  paused: boolean;
}

export class Habit extends Aggregate {
  protected aggregateType = 'Habit'; // Explicit type to survive minification
  private state: HabitState | null = null;

  // Commands
  create(data: {
    title: string;
    description?: string;
    category?: string;
    linkedAspirationId?: string;
    recurring?: 'daily' | 'weekly' | 'custom';
    nudgeTime?: string;
    metric?: 'checkmark' | 'count' | 'duration' | 'distance';
    unit?: string;
    target?: number;
  }): void {
    if (this.state) {
      throw new Error('Habit already created');
    }

    const event = this.createEvent<HabitCreatedEvent>('HabitCreated', data);
    this.addEvent(event);
  }

  update(data: {
    title?: string;
    description?: string;
    category?: string;
    linkedAspirationId?: string;
    recurring?: 'daily' | 'weekly' | 'custom';
    nudgeTime?: string;
  }): void {
    if (!this.state) {
      throw new Error('Habit does not exist');
    }
    if (this.state.archived) {
      throw new Error('Cannot update archived habit');
    }

    const event = this.createEvent<HabitUpdatedEvent>('HabitUpdated', data);
    this.addEvent(event);
  }

  archive(reason?: string): void {
    if (!this.state) {
      throw new Error('Habit does not exist');
    }
    if (this.state.archived) {
      throw new Error('Habit already archived');
    }

    const event = this.createEvent<HabitArchivedEvent>('HabitArchived', {
      reason,
    });
    this.addEvent(event);
  }

  // Event Handlers
  protected apply(event: Event): void {
    switch (event.type) {
      case 'HabitCreated':
        this.applyHabitCreated(event as HabitCreatedEvent);
        break;
      case 'HabitUpdated':
        this.applyHabitUpdated(event as HabitUpdatedEvent);
        break;
      case 'HabitArchived':
        this.applyHabitArchived(event as HabitArchivedEvent);
        break;
    }
  }

  private applyHabitCreated(event: HabitCreatedEvent): void {
    this.state = {
      id: event.aggregateId,
      title: event.data.title,
      description: event.data.description,
      category: event.data.category,
      linkedAspirationId: event.data.linkedAspirationId,
      recurring: event.data.recurring,
      nudgeTime: event.data.nudgeTime,
      metric: event.data.metric,
      unit: event.data.unit,
      target: event.data.target,
      createdAt: event.timestamp,
      updatedAt: event.timestamp,
      archived: false,
      paused: false,
    };
  }

  private applyHabitUpdated(event: HabitUpdatedEvent): void {
    if (!this.state) return;

    this.state = {
      ...this.state,
      ...event.data,
      updatedAt: event.timestamp,
    };
  }

  private applyHabitArchived(event: HabitArchivedEvent): void {
    if (!this.state) return;

    this.state = {
      ...this.state,
      archived: true,
      archivedAt: event.timestamp,
    };
  }

  // Queries
  getState(): HabitState | null {
    return this.state;
  }

  isArchived(): boolean {
    return this.state?.archived ?? false;
  }

  isPaused(): boolean {
    return this.state?.paused ?? false;
  }
}
