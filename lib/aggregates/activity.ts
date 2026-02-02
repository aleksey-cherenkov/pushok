// Activity Aggregate (Logged check-ins for habits)

import { Aggregate } from '../events/aggregate';
import type {
  Event,
  ActivityLoggedEvent,
  ActivityUpdatedEvent,
} from '../events/types';

export interface ActivityState {
  id: string;
  habitId: string;
  loggedAt: number;
  value?: number;
  completed?: boolean;
  notes?: string;
  mood?: string;
  photoIds?: string[];
  overcameResistance?: boolean;
  updatedAt?: number;
}

export class Activity extends Aggregate {
  private state: ActivityState | null = null;

  // Commands
  log(data: {
    habitId: string;
    value?: number;
    completed?: boolean;
    notes?: string;
    mood?: string;
    photoIds?: string[];
    overcameResistance?: boolean;
  }): void {
    if (this.state) {
      throw new Error('Activity already logged');
    }

    const event = this.createEvent<ActivityLoggedEvent>('ActivityLogged', data);
    this.addEvent(event);
  }

  update(data: {
    value?: number;
    notes?: string;
    mood?: string;
  }): void {
    if (!this.state) {
      throw new Error('Activity does not exist');
    }

    const event = this.createEvent<ActivityUpdatedEvent>('ActivityUpdated', {
      logId: this.state.id,
      ...data,
    });
    this.addEvent(event);
  }

  // Event Handlers
  protected apply(event: Event): void {
    switch (event.type) {
      case 'ActivityLogged':
        this.applyActivityLogged(event as ActivityLoggedEvent);
        break;
      case 'ActivityUpdated':
        this.applyActivityUpdated(event as ActivityUpdatedEvent);
        break;
    }
  }

  private applyActivityLogged(event: ActivityLoggedEvent): void {
    this.state = {
      id: event.aggregateId,
      habitId: event.data.habitId,
      loggedAt: event.timestamp,
      value: event.data.value,
      completed: event.data.completed ?? true,
      notes: event.data.notes,
      mood: event.data.mood,
      photoIds: event.data.photoIds,
      overcameResistance: event.data.overcameResistance,
    };
  }

  private applyActivityUpdated(event: ActivityUpdatedEvent): void {
    if (!this.state) return;

    this.state = {
      ...this.state,
      value: event.data.value ?? this.state.value,
      notes: event.data.notes ?? this.state.notes,
      mood: event.data.mood ?? this.state.mood,
      updatedAt: event.timestamp,
    };
  }

  // Queries
  getState(): ActivityState | null {
    return this.state;
  }

  getHabitId(): string | null {
    return this.state?.habitId ?? null;
  }

  isCompleted(): boolean {
    return this.state?.completed ?? false;
  }
}
