// WeeklyReflection Aggregate - Weekly check-ins combining habits, projects, and reflections

import { v4 as uuidv4 } from 'uuid';
import { eventStore } from '../events/store';
import type {
  WeeklyReflectionCreatedEvent,
  WeeklyReflectionUpdatedEvent,
} from '../events/types';

export interface WeeklyReflectionState {
  id: string;
  weekStart: number; // ISO week start date (Monday)
  weekEnd: number; // ISO week end date (Sunday)
  habitReview?: string; // Review of habits this week
  projectProgress?: string; // Review of project progress
  personalReflections?: string; // Personal thoughts/insights
  mood?: number; // 1-5 scale (1=tough, 5=great)
  createdAt: number;
  updatedAt: number;
}

export class WeeklyReflection {
  private state: WeeklyReflectionState;

  constructor(id: string) {
    this.state = {
      id,
      weekStart: 0,
      weekEnd: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }

  // Load reflection from events
  async load(): Promise<WeeklyReflectionState> {
    const events = await eventStore.getEventsByAggregate(this.state.id);
    const reflectionEvents = events.filter(
      (e) => e.aggregateType === 'weekly-reflection'
    );

    for (const event of reflectionEvents) {
      const e = event as any;
      switch (e.type) {
        case 'WeeklyReflectionCreated':
          this.state.weekStart = e.data.weekStart;
          this.state.weekEnd = e.data.weekEnd;
          this.state.habitReview = e.data.habitReview;
          this.state.projectProgress = e.data.projectProgress;
          this.state.personalReflections = e.data.personalReflections;
          this.state.mood = e.data.mood;
          this.state.createdAt = e.data.createdAt;
          this.state.updatedAt = e.data.createdAt;
          break;

        case 'WeeklyReflectionUpdated':
          if (e.data.habitReview !== undefined)
            this.state.habitReview = e.data.habitReview;
          if (e.data.projectProgress !== undefined)
            this.state.projectProgress = e.data.projectProgress;
          if (e.data.personalReflections !== undefined)
            this.state.personalReflections = e.data.personalReflections;
          if (e.data.mood !== undefined) this.state.mood = e.data.mood;
          this.state.updatedAt = e.data.updatedAt;
          break;
      }
    }

    return this.state;
  }

  // Create new weekly reflection
  async create(data: {
    weekStart: number;
    weekEnd: number;
    habitReview?: string;
    projectProgress?: string;
    personalReflections?: string;
    mood?: number;
  }): Promise<void> {
    const version = await eventStore.getLatestVersion(this.state.id);

    const event: WeeklyReflectionCreatedEvent = {
      id: uuidv4(),
      aggregateId: this.state.id,
      aggregateType: 'weekly-reflection',
      type: 'WeeklyReflectionCreated',
      timestamp: Date.now(),
      version: version + 1,
      data: {
        weekStart: data.weekStart,
        weekEnd: data.weekEnd,
        habitReview: data.habitReview,
        projectProgress: data.projectProgress,
        personalReflections: data.personalReflections,
        mood: data.mood,
        createdAt: Date.now(),
      },
    };

    await eventStore.append(event);
    await this.load();
  }

  // Update weekly reflection
  async update(data: {
    habitReview?: string;
    projectProgress?: string;
    personalReflections?: string;
    mood?: number;
  }): Promise<void> {
    const version = await eventStore.getLatestVersion(this.state.id);

    const event: WeeklyReflectionUpdatedEvent = {
      id: uuidv4(),
      aggregateId: this.state.id,
      aggregateType: 'weekly-reflection',
      type: 'WeeklyReflectionUpdated',
      timestamp: Date.now(),
      version: version + 1,
      data: {
        ...data,
        updatedAt: Date.now(),
      },
    };

    await eventStore.append(event);
    await this.load();
  }

  getState(): WeeklyReflectionState {
    return this.state;
  }
}
