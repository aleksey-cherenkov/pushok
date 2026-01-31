// Goal Aggregate

import { Aggregate } from '../events/aggregate';
import type {
  Event,
  GoalCreatedEvent,
  GoalUpdatedEvent,
  GoalArchivedEvent,
} from '../events/types';

export interface GoalState {
  id: string;
  title: string;
  description?: string;
  category?: string;
  targetDate?: string;
  createdAt: number;
  updatedAt: number;
  archivedAt?: number;
  archived: boolean;
}

export class Goal extends Aggregate {
  private state: GoalState | null = null;

  // Commands
  create(data: {
    title: string;
    description?: string;
    category?: string;
    targetDate?: string;
  }): void {
    if (this.state) {
      throw new Error('Goal already created');
    }

    const event = this.createEvent<GoalCreatedEvent>('GoalCreated', data);
    this.addEvent(event);
  }

  update(data: {
    title?: string;
    description?: string;
    category?: string;
    targetDate?: string;
  }): void {
    if (!this.state) {
      throw new Error('Goal does not exist');
    }
    if (this.state.archived) {
      throw new Error('Cannot update archived goal');
    }

    const event = this.createEvent<GoalUpdatedEvent>('GoalUpdated', data);
    this.addEvent(event);
  }

  archive(reason?: string): void {
    if (!this.state) {
      throw new Error('Goal does not exist');
    }
    if (this.state.archived) {
      throw new Error('Goal already archived');
    }

    const event = this.createEvent<GoalArchivedEvent>('GoalArchived', {
      reason,
    });
    this.addEvent(event);
  }

  // Event Handlers
  protected apply(event: Event): void {
    switch (event.type) {
      case 'GoalCreated':
        this.applyGoalCreated(event as GoalCreatedEvent);
        break;
      case 'GoalUpdated':
        this.applyGoalUpdated(event as GoalUpdatedEvent);
        break;
      case 'GoalArchived':
        this.applyGoalArchived(event as GoalArchivedEvent);
        break;
    }
  }

  private applyGoalCreated(event: GoalCreatedEvent): void {
    this.state = {
      id: event.aggregateId,
      title: event.data.title,
      description: event.data.description,
      category: event.data.category,
      targetDate: event.data.targetDate,
      createdAt: event.timestamp,
      updatedAt: event.timestamp,
      archived: false,
    };
  }

  private applyGoalUpdated(event: GoalUpdatedEvent): void {
    if (!this.state) return;

    this.state = {
      ...this.state,
      ...event.data,
      updatedAt: event.timestamp,
    };
  }

  private applyGoalArchived(event: GoalArchivedEvent): void {
    if (!this.state) return;

    this.state = {
      ...this.state,
      archived: true,
      archivedAt: event.timestamp,
    };
  }

  // Queries
  getState(): GoalState | null {
    return this.state;
  }

  isArchived(): boolean {
    return this.state?.archived ?? false;
  }
}
