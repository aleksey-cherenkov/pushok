export type StelaMessageEventType = 
  | 'StelaMessageCreated'
  | 'StelaMessageDismissed'
  | 'StelaMessageRegenerated';

export interface StelaMessageCreatedEvent {
  type: 'StelaMessageCreated';
  data: {
    message: string;
    category: 'family' | 'nature' | 'creativity' | 'rest' | 'connection' | 'mindfulness' | 'play';
    generatedAt: number;
  };
}

export interface StelaMessageDismissedEvent {
  type: 'StelaMessageDismissed';
  data: {
    dismissedAt: number;
    reason?: 'not-relevant' | 'done' | 'later';
  };
}

export interface StelaMessageRegeneratedEvent {
  type: 'StelaMessageRegenerated';
  data: {
    regeneratedAt: number;
  };
}

export type StelaMessageEvent = 
  | StelaMessageCreatedEvent
  | StelaMessageDismissedEvent
  | StelaMessageRegeneratedEvent;
