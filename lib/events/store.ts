// Event Store using Dexie.js (IndexedDB wrapper)

import Dexie, { type EntityTable } from 'dexie';
import type { Event } from './types';

class EventStoreDB extends Dexie {
  events!: EntityTable<Event, 'id'>;

  constructor() {
    super('WayFinderEventStore');
    
    this.version(1).stores({
      events: 'id, aggregateId, aggregateType, type, timestamp, version',
    });
  }
}

export const db = new EventStoreDB();

// Event Store Operations
export class EventStore {
  async append(event: Event): Promise<void> {
    await db.events.add(event);
  }

  async getEventsByAggregate(aggregateId: string): Promise<Event[]> {
    return await db.events
      .where('aggregateId')
      .equals(aggregateId)
      .sortBy('version');
  }

  async getEventsByType(type: string): Promise<Event[]> {
    return await db.events
      .where('type')
      .equals(type)
      .sortBy('timestamp');
  }

  async getAllEvents(): Promise<Event[]> {
    return await db.events.orderBy('timestamp').toArray();
  }

  async getLatestVersion(aggregateId: string): Promise<number> {
    const events = await this.getEventsByAggregate(aggregateId);
    return events.length > 0 ? events[events.length - 1].version : 0;
  }
}

export const eventStore = new EventStore();
