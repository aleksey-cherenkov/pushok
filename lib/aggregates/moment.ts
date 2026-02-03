// Moment Aggregate - Spontaneous life captures

import { v4 as uuidv4 } from 'uuid';
import { eventStore } from '../events/store';
import type { MomentCreatedEvent, MomentUpdatedEvent, MomentDeletedEvent } from '../events/types';

export interface MomentState {
  id: string;
  photoData: string; // base64 encoded compressed image
  caption?: string;
  createdAt: number;
  updatedAt: number;
  deleted?: boolean;
}

export class Moment {
  private state: MomentState;

  constructor(id: string) {
    this.state = {
      id,
      photoData: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }

  // Load moment from events
  async load(): Promise<MomentState> {
    const events = await eventStore.getEventsByAggregate(this.state.id);
    const momentEvents = events.filter((e) => e.aggregateType === 'moment');

    for (const event of momentEvents) {
      const e = event as any;
      switch (e.type) {
        case 'MomentCreated':
          this.state.photoData = e.data.photoData;
          this.state.caption = e.data.caption;
          this.state.createdAt = e.data.createdAt;
          this.state.updatedAt = e.data.createdAt;
          break;

        case 'MomentUpdated':
          if (e.data.caption !== undefined) this.state.caption = e.data.caption;
          this.state.updatedAt = e.data.updatedAt;
          break;

        case 'MomentDeleted':
          this.state.deleted = true;
          break;
      }
    }

    return this.state;
  }

  // Create new moment
  async create(data: { photoData: string; caption?: string }): Promise<void> {
    const now = Date.now();
    const version = await eventStore.getLatestVersion(this.state.id);

    const event: MomentCreatedEvent = {
      id: uuidv4(),
      aggregateId: this.state.id,
      aggregateType: 'moment',
      type: 'MomentCreated',
      timestamp: now,
      version: version + 1,
      data: {
        photoData: data.photoData,
        caption: data.caption,
        createdAt: now,
      },
    };

    await eventStore.append(event);

    this.state.photoData = data.photoData;
    this.state.caption = data.caption;
    this.state.createdAt = now;
    this.state.updatedAt = now;
  }

  // Update caption
  async updateCaption(caption: string): Promise<void> {
    const now = Date.now();
    const version = await eventStore.getLatestVersion(this.state.id);

    const event: MomentUpdatedEvent = {
      id: uuidv4(),
      aggregateId: this.state.id,
      aggregateType: 'moment',
      type: 'MomentUpdated',
      timestamp: now,
      version: version + 1,
      data: {
        caption,
        updatedAt: now,
      },
    };

    await eventStore.append(event);

    this.state.caption = caption;
    this.state.updatedAt = now;
  }

  // Delete moment
  async delete(): Promise<void> {
    const now = Date.now();
    const version = await eventStore.getLatestVersion(this.state.id);

    const event: MomentDeletedEvent = {
      id: uuidv4(),
      aggregateId: this.state.id,
      aggregateType: 'moment',
      type: 'MomentDeleted',
      timestamp: now,
      version: version + 1,
      data: {
        deletedAt: now,
      },
    };

    await eventStore.append(event);

    this.state.deleted = true;
  }

  getState(): MomentState {
    return { ...this.state };
  }
}
