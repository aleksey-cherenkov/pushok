// Project Aggregate - Track projects with phases (bathroom remodel, garden, etc.)

import { v4 as uuidv4 } from 'uuid';
import { eventStore } from '../events/store';
import type {
  ProjectCreatedEvent,
  ProjectUpdatedEvent,
  ProjectArchivedEvent,
  PhaseAddedEvent,
  PhaseUpdatedEvent,
  PhaseStatusChangedEvent,
  PhasePhotoAddedEvent,
} from '../events/types';

export type PhaseStatus = 'not-started' | 'in-progress' | 'complete';

export interface Phase {
  id: string;
  name: string;
  status: PhaseStatus;
  notes?: string;
  startDate?: number;
  endDate?: number;
  photos: Array<{ id: string; data: string; caption?: string; addedAt: number }>;
  order: number;
}

export interface ProjectState {
  id: string;
  title: string;
  description?: string;
  category?: string;
  phases: Phase[];
  archived: boolean;
  createdAt: number;
  updatedAt: number;
}

export class Project {
  private state: ProjectState;

  constructor(id: string) {
    this.state = {
      id,
      title: '',
      phases: [],
      archived: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }

  // Load project from events
  async load(): Promise<ProjectState> {
    const events = await eventStore.getEventsByAggregate(this.state.id);
    const projectEvents = events.filter((e) => e.aggregateType === 'project');

    for (const event of projectEvents) {
      const e = event as any;
      switch (e.type) {
        case 'ProjectCreated':
          this.state.title = e.data.title;
          this.state.description = e.data.description;
          this.state.category = e.data.category;
          this.state.createdAt = e.data.createdAt;
          this.state.updatedAt = e.data.createdAt;
          break;

        case 'ProjectUpdated':
          if (e.data.title) this.state.title = e.data.title;
          if (e.data.description !== undefined) this.state.description = e.data.description;
          if (e.data.category !== undefined) this.state.category = e.data.category;
          this.state.updatedAt = e.data.updatedAt;
          break;

        case 'ProjectArchived':
          this.state.archived = true;
          this.state.updatedAt = e.data.archivedAt;
          break;

        case 'PhaseAdded':
          this.state.phases.push({
            id: e.data.phaseId,
            name: e.data.name,
            status: 'not-started',
            photos: [],
            order: e.data.order,
          });
          break;

        case 'PhaseUpdated':
          const phaseToUpdate = this.state.phases.find((p) => p.id === e.data.phaseId);
          if (phaseToUpdate) {
            if (e.data.name) phaseToUpdate.name = e.data.name;
            if (e.data.notes !== undefined) phaseToUpdate.notes = e.data.notes;
            if (e.data.startDate !== undefined) phaseToUpdate.startDate = e.data.startDate;
            if (e.data.endDate !== undefined) phaseToUpdate.endDate = e.data.endDate;
          }
          this.state.updatedAt = e.data.updatedAt;
          break;

        case 'PhaseStatusChanged':
          const phaseToChangeStatus = this.state.phases.find((p) => p.id === e.data.phaseId);
          if (phaseToChangeStatus) {
            phaseToChangeStatus.status = e.data.status;
          }
          this.state.updatedAt = e.data.changedAt;
          break;

        case 'PhasePhotoAdded':
          const phaseToAddPhoto = this.state.phases.find((p) => p.id === e.data.phaseId);
          if (phaseToAddPhoto) {
            phaseToAddPhoto.photos.push({
              id: e.data.photoId,
              data: e.data.photoData,
              caption: e.data.caption,
              addedAt: e.data.addedAt,
            });
          }
          this.state.updatedAt = e.data.addedAt;
          break;
      }
    }

    return this.state;
  }

  // Create new project
  async create(data: {
    title: string;
    description?: string;
    category?: string;
  }): Promise<void> {
    const version = await eventStore.getLatestVersion(this.state.id);

    const event: ProjectCreatedEvent = {
      id: uuidv4(),
      aggregateId: this.state.id,
      aggregateType: 'project',
      type: 'ProjectCreated',
      timestamp: Date.now(),
      version: version + 1,
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        createdAt: Date.now(),
      },
    };

    await eventStore.append(event);
    await this.load();
  }

  // Update project
  async update(data: {
    title?: string;
    description?: string;
    category?: string;
  }): Promise<void> {
    const version = await eventStore.getLatestVersion(this.state.id);

    const event: ProjectUpdatedEvent = {
      id: uuidv4(),
      aggregateId: this.state.id,
      aggregateType: 'project',
      type: 'ProjectUpdated',
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

  // Add phase
  async addPhase(name: string): Promise<void> {
    const version = await eventStore.getLatestVersion(this.state.id);
    const order = this.state.phases.length;

    const event: PhaseAddedEvent = {
      id: uuidv4(),
      aggregateId: this.state.id,
      aggregateType: 'project',
      type: 'PhaseAdded',
      timestamp: Date.now(),
      version: version + 1,
      data: {
        phaseId: uuidv4(),
        name,
        order,
        addedAt: Date.now(),
      },
    };

    await eventStore.append(event);
    await this.load();
  }

  // Update phase
  async updatePhase(
    phaseId: string,
    data: {
      name?: string;
      notes?: string;
      startDate?: number;
      endDate?: number;
    }
  ): Promise<void> {
    const version = await eventStore.getLatestVersion(this.state.id);

    const event: PhaseUpdatedEvent = {
      id: uuidv4(),
      aggregateId: this.state.id,
      aggregateType: 'project',
      type: 'PhaseUpdated',
      timestamp: Date.now(),
      version: version + 1,
      data: {
        phaseId,
        ...data,
        updatedAt: Date.now(),
      },
    };

    await eventStore.append(event);
    await this.load();
  }

  // Change phase status
  async changePhaseStatus(phaseId: string, status: PhaseStatus): Promise<void> {
    const version = await eventStore.getLatestVersion(this.state.id);

    const event: PhaseStatusChangedEvent = {
      id: uuidv4(),
      aggregateId: this.state.id,
      aggregateType: 'project',
      type: 'PhaseStatusChanged',
      timestamp: Date.now(),
      version: version + 1,
      data: {
        phaseId,
        status,
        changedAt: Date.now(),
      },
    };

    await eventStore.append(event);
    await this.load();
  }

  // Add photo to phase
  async addPhotoToPhase(
    phaseId: string,
    photoData: string,
    caption?: string
  ): Promise<void> {
    const version = await eventStore.getLatestVersion(this.state.id);

    const event: PhasePhotoAddedEvent = {
      id: uuidv4(),
      aggregateId: this.state.id,
      aggregateType: 'project',
      type: 'PhasePhotoAdded',
      timestamp: Date.now(),
      version: version + 1,
      data: {
        phaseId,
        photoId: uuidv4(),
        photoData,
        caption,
        addedAt: Date.now(),
      },
    };

    await eventStore.append(event);
    await this.load();
  }

  async archive(): Promise<void> {
    if (this.state.archived) {
      throw new Error('Project is already archived');
    }

    const version = await eventStore.getLatestVersion(this.state.id);
    const event: ProjectArchivedEvent = {
      id: uuidv4(),
      aggregateId: this.state.id,
      aggregateType: 'project',
      type: 'ProjectArchived',
      version: version + 1,
      timestamp: Date.now(),
      data: {
        archivedAt: Date.now(),
      },
    };

    await eventStore.append(event);
    await this.load();
  }

  getState(): ProjectState {
    return this.state;
  }
}
