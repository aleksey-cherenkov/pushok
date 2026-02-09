// Aspiration Aggregate (Long-term directions without deadlines)

import { Aggregate } from '../events/aggregate';
import type {
  Event,
  AspirationCreatedEvent,
  AspirationUpdatedEvent,
  AspirationPausedEvent,
  AspirationResumedEvent,
  AspirationArchivedEvent,
} from '../events/types';

export interface AspirationState {
  id: string;
  title: string;
  description?: string;
  category?: string;
  createdAt: number;
  updatedAt: number;
  archivedAt?: number;
  archived: boolean;
  paused: boolean;
}

export class Aspiration extends Aggregate {
  protected aggregateType = 'Aspiration'; // Explicit type to survive minification
  private state: AspirationState | null = null;

  // Commands
  create(data: {
    title: string;
    description?: string;
    category?: string;
  }): void {
    if (this.state) {
      throw new Error('Aspiration already created');
    }

    const event = this.createEvent<AspirationCreatedEvent>('AspirationCreated', data);
    this.addEvent(event);
  }

  update(data: {
    title?: string;
    description?: string;
    category?: string;
  }): void {
    if (!this.state) {
      throw new Error('Aspiration not created');
    }

    const event = this.createEvent<AspirationUpdatedEvent>('AspirationUpdated', data);
    this.addEvent(event);
  }

  pause(): void {
    if (!this.state) {
      throw new Error('Aspiration not created');
    }
    if (this.state.paused) {
      throw new Error('Aspiration already paused');
    }

    const event = this.createEvent<AspirationPausedEvent>('AspirationPaused', {});
    this.addEvent(event);
  }

  resume(): void {
    if (!this.state) {
      throw new Error('Aspiration not created');
    }
    if (!this.state.paused) {
      throw new Error('Aspiration not paused');
    }

    const event = this.createEvent<AspirationResumedEvent>('AspirationResumed', {});
    this.addEvent(event);
  }

  archive(): void {
    if (!this.state) {
      throw new Error('Aspiration not created');
    }
    if (this.state.archived) {
      throw new Error('Aspiration already archived');
    }

    const event = this.createEvent<AspirationArchivedEvent>('AspirationArchived', {});
    this.addEvent(event);
  }

  // Query
  getState(): AspirationState | null {
    return this.state;
  }

  // Event Handlers
  protected apply(event: Event): void {
    switch (event.type) {
      case 'AspirationCreated':
        this.applyAspirationCreated(event as AspirationCreatedEvent);
        break;
      case 'AspirationUpdated':
        this.applyAspirationUpdated(event as AspirationUpdatedEvent);
        break;
      case 'AspirationPaused':
        this.applyAspirationPaused(event as AspirationPausedEvent);
        break;
      case 'AspirationResumed':
        this.applyAspirationResumed(event as AspirationResumedEvent);
        break;
      case 'AspirationArchived':
        this.applyAspirationArchived(event as AspirationArchivedEvent);
        break;
      default:
        throw new Error(`Unknown event type: ${event.type}`);
    }
  }

  private applyAspirationCreated(event: AspirationCreatedEvent): void {
    const data = event.data as any;
    this.state = {
      id: event.aggregateId,
      title: data.title as string,
      description: data.description as string | undefined,
      category: data.category as string | undefined,
      createdAt: event.timestamp,
      updatedAt: event.timestamp,
      archived: false,
      paused: false,
    };
  }

  private applyAspirationUpdated(event: AspirationUpdatedEvent): void {
    if (!this.state) return;

    const data = event.data as any;
    if (data.title !== undefined) {
      this.state.title = data.title as string;
    }
    if (data.description !== undefined) {
      this.state.description = data.description as string;
    }
    if (data.category !== undefined) {
      this.state.category = data.category as string;
    }
    this.state.updatedAt = event.timestamp;
  }

  private applyAspirationPaused(event: AspirationPausedEvent): void {
    if (!this.state) return;
    this.state.paused = true;
    this.state.updatedAt = event.timestamp;
  }

  private applyAspirationResumed(event: AspirationResumedEvent): void {
    if (!this.state) return;
    this.state.paused = false;
    this.state.updatedAt = event.timestamp;
  }

  private applyAspirationArchived(event: AspirationArchivedEvent): void {
    if (!this.state) return;
    this.state.archived = true;
    this.state.archivedAt = event.timestamp;
    this.state.updatedAt = event.timestamp;
  }
}
