import { eventStore } from '../events/store';
import type { StelaMessageEvent } from '../events/stela-message-types';
import type { Event } from '../events/types';

export interface StelaMessageState {
  id: string;
  message: string;
  category: 'family' | 'nature' | 'creativity' | 'rest' | 'connection' | 'mindfulness' | 'play';
  generatedAt: number;
  dismissed: boolean;
  dismissedAt?: number;
  dismissReason?: 'not-relevant' | 'done' | 'later';
}

export class StelaMessage {
  private state: StelaMessageState | null = null;

  constructor(private id: string) {}

  async load(): Promise<void> {
    const events = await eventStore.getEventsByAggregate(this.id);
    
    // Filter to only StelaMessage events
    const messageEvents = events.filter(e => e.aggregateType === 'StelaMessage');
    
    if (messageEvents.length === 0) {
      this.state = null;
      return;
    }

    // Initialize state from first event
    const firstEvent = messageEvents[0];
    const firstData = firstEvent.data as any;
    if (firstEvent.type === 'StelaMessageCreated') {
      this.state = {
        id: this.id,
        message: firstData.message,
        category: firstData.category,
        generatedAt: firstData.generatedAt,
        dismissed: false,
      };
    }

    // Apply subsequent events
    for (let i = 1; i < messageEvents.length; i++) {
      this.applyEvent(messageEvents[i]);
    }
  }

  private applyEvent(event: Event): void {
    if (!this.state) return;
    const data = event.data as any;

    switch (event.type) {
      case 'StelaMessageDismissed':
        this.state.dismissed = true;
        this.state.dismissedAt = data.dismissedAt;
        this.state.dismissReason = data.reason;
        break;
    }
  }

  async create(message: string, category: StelaMessageState['category']): Promise<void> {
    const version = await eventStore.getLatestVersion(this.id);
    
    const event: Event = {
      id: `${this.id}-${Date.now()}`,
      aggregateId: this.id,
      aggregateType: 'StelaMessage',
      type: 'StelaMessageCreated',
      version: version + 1,
      timestamp: Date.now(),
      data: {
        message,
        category,
        generatedAt: Date.now(),
      },
    };

    await eventStore.append(event);
    await this.load();
  }

  async dismiss(reason?: 'not-relevant' | 'done' | 'later'): Promise<void> {
    if (!this.state || this.state.dismissed) return;

    const version = await eventStore.getLatestVersion(this.id);
    
    const event: Event = {
      id: `${this.id}-${Date.now()}`,
      aggregateId: this.id,
      aggregateType: 'StelaMessage',
      type: 'StelaMessageDismissed',
      version: version + 1,
      timestamp: Date.now(),
      data: {
        dismissedAt: Date.now(),
        reason,
      },
    };

    await eventStore.append(event);
    await this.load();
  }

  getState(): StelaMessageState | null {
    return this.state;
  }
}
