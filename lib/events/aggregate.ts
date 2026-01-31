// Base Aggregate Class for Event Sourcing

import { v4 as uuidv4 } from 'uuid';
import type { Event, BaseEvent } from './types';
import { eventStore } from './store';

export abstract class Aggregate {
  protected id: string;
  protected version: number;
  protected uncommittedEvents: Event[];

  constructor(id?: string) {
    this.id = id || uuidv4();
    this.version = 0;
    this.uncommittedEvents = [];
  }

  getId(): string {
    return this.id;
  }

  getVersion(): number {
    return this.version;
  }

  protected abstract apply(event: Event): void;

  protected addEvent(event: Event): void {
    this.apply(event);
    this.uncommittedEvents.push(event);
  }

  async load(): Promise<void> {
    const events = await eventStore.getEventsByAggregate(this.id);
    events.forEach((event) => {
      this.apply(event);
      this.version = event.version;
    });
  }

  async save(): Promise<void> {
    for (const event of this.uncommittedEvents) {
      await eventStore.append(event);
    }
    this.uncommittedEvents = [];
  }

  protected createEvent<T extends Event>(
    type: T['type'],
    data: T['data']
  ): T {
    this.version++;
    return {
      id: uuidv4(),
      aggregateId: this.id,
      aggregateType: this.constructor.name,
      type,
      timestamp: Date.now(),
      version: this.version,
      data,
    } as T;
  }
}
