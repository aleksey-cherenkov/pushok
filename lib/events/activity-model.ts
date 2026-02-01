// Comprehensive Activity Data Model
// Flexible structure for aspirations, habits, projects, tasks, and time blocks

// Local base event type for this model (not yet integrated with main event store)
interface ModelBaseEvent {
  id: string;
  aggregateId: string;
  aggregateType: string;
  type: string;
  timestamp: number;
  version: number;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// LAYER 1: ASPIRATIONS - Long-term life directions
// ============================================================================

export interface Aspiration {
  id: string;
  title: string;                    // "Be healthier and more energetic"
  description?: string;             // "Build sustainable fitness habits"
  status: 'active' | 'achieved' | 'retired';
  reviewCycle: 'monthly' | 'quarterly' | 'yearly';
  linkedActivityIds: string[];      // Activities that support this aspiration
  createdAt: number;
  updatedAt: number;
  lastReviewedAt?: number;
  nextReviewAt?: number;
}

// Aspiration Events
export interface AspirationCreatedEvent extends ModelBaseEvent {
  type: 'AspirationCreated';
  data: {
    title: string;
    description?: string;
    reviewCycle: 'monthly' | 'quarterly' | 'yearly';
  };
}

export interface AspirationUpdatedEvent extends ModelBaseEvent {
  type: 'AspirationUpdated';
  data: Partial<Aspiration>;
}

export interface AspirationReviewedEvent extends ModelBaseEvent {
  type: 'AspirationReviewed';
  data: {
    reviewedAt: number;
    notes?: string;
    nextReviewAt: number;
    llmInsights?: string;
  };
}

export interface AspirationRetiredEvent extends ModelBaseEvent {
  type: 'AspirationRetired';
  data: {
    reason?: string;              // "Achieved", "No longer relevant", etc.
  };
}

export interface ActivityLinkedToAspirationEvent extends ModelBaseEvent {
  type: 'ActivityLinkedToAspiration';
  data: {
    activityId: string;
    aspirationId: string;
  };
}

// ============================================================================
// LAYER 2: METRIC TYPES - How we measure progress
// ============================================================================

export type MetricType =
  | 'checkmark'     // Simple done/not done (grocery shopping)
  | 'count'         // Number of reps (pushups: 10, 15, 20)
  | 'duration'      // Time spent (study: 30min, walk: 45min)
  | 'distance'      // Miles/km (walk: 2.5 miles)
  | 'steps'         // Step count (walk: 5000 steps)
  | 'percentage'    // % complete (bathroom: 45% done)
  | 'currency'      // Money spent/saved (project budget)
  | 'custom';       // User-defined unit

export interface MetricConfig {
  type: MetricType;
  unit?: string;           // 'reps', 'min', 'miles', 'steps', '%', '$', etc.
  target?: number;         // Optional target value
  allowMultiplePerDay?: boolean; // Can log multiple times per day?
}

// ============================================================================
// ACTIVITY TYPES - Different kinds of things to track
// ============================================================================

export type ActivityType =
  | 'habit'         // Recurring simple activity (pushups, walk)
  | 'project'       // Complex with sub-tasks (bathroom remodel)
  | 'task'          // One-time todo (grocery shopping)
  | 'routine'       // Required maintenance (groceries weekly, car maintenance)
  | 'timeblock';    // Scheduled focus time (study session)

export type RecurrencePattern =
  | 'daily'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'custom';

export interface RecurrenceConfig {
  pattern: RecurrencePattern;
  daysOfWeek?: number[];      // [1,3,5] = Mon, Wed, Fri
  timesPerDay?: number;       // Can do pushups 2-3x per day
  preferredTime?: string;     // "16:00" for gentle nudge
}

// ============================================================================
// ACTIVITY AGGREGATE STATE
// ============================================================================

export interface ActivityState {
  id: string;
  type: ActivityType;
  
  // Basic Info
  title: string;
  description?: string;
  category?: string;          // 'health', 'family', 'project', 'learning', etc.
  
  // Layer 1 Connection
  linkedAspirationId?: string; // Which aspiration does this support?
  
  // Tracking Configuration
  metric: MetricConfig;
  recurrence?: RecurrenceConfig; // For habits/routines/timeblocks
  
  // LLM Assistance
  llmGenerated?: boolean;     // Was this created/refined by LLM?
  llmBreakdown?: {            // For projects: LLM-generated sub-tasks
    subtasks: SubTask[];
    totalEstimate?: number;   // Total estimated hours/days
  };
  
  // Status
  status: 'active' | 'paused' | 'completed' | 'archived';
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
  
  // Project-specific
  projectPhases?: ProjectPhase[]; // For complex projects
  budget?: {
    estimated?: number;
    actual?: number;
  };
}

export interface SubTask {
  id: string;
  title: string;
  description?: string;
  estimatedTime?: number;     // Hours/days
  actualTime?: number;
  status: 'pending' | 'in-progress' | 'completed';
  order: number;              // Display order
  dependencies?: string[];    // IDs of tasks that must complete first
}

export interface ProjectPhase {
  id: string;
  name: string;               // "Demo", "Plumbing", "Tiling", "Painting"
  status: 'pending' | 'in-progress' | 'completed';
  subtasks: string[];         // SubTask IDs
  photoIds?: string[];        // Progress photos
}

// ============================================================================
// ACTIVITY LOG - When you actually do something
// ============================================================================

export interface ActivityLog {
  id: string;
  activityId: string;
  timestamp: number;
  
  // The actual value logged
  value?: number;             // For count, duration, distance, etc.
  completed?: boolean;        // For checkmark type
  
  // Optional enrichment
  notes?: string;
  mood?: string;              // 'great', 'good', 'okay', 'struggled'
  photoIds?: string[];
  duration?: number;          // Actual time spent (for time blocks)
  location?: string;
  tags?: string[];
}

// ============================================================================
// EVENTS FOR EVENT SOURCING
// ============================================================================

// Activity Lifecycle Events
export interface ActivityCreatedEvent extends ModelBaseEvent {
  type: 'ActivityCreated';
  data: {
    activityType: ActivityType;
    title: string;
    description?: string;
    category?: string;
    metric: MetricConfig;
    recurrence?: RecurrenceConfig;
  };
}

export interface ActivityUpdatedEvent extends ModelBaseEvent {
  type: 'ActivityUpdated';
  data: Partial<ActivityState>;
}

export interface ActivityPausedEvent extends ModelBaseEvent {
  type: 'ActivityPaused';
  data: {
    reason?: string;
  };
}

export interface ActivityResumedEvent extends ModelBaseEvent {
  type: 'ActivityResumed';
  data: Record<string, never>;
}

export interface ActivityCompletedEvent extends ModelBaseEvent {
  type: 'ActivityCompleted';
  data: {
    completedAt: number;
  };
}

export interface ActivityArchivedEvent extends ModelBaseEvent {
  type: 'ActivityArchived';
  data: {
    reason?: string;
  };
}

// LLM-Generated Breakdown Events
export interface LLMBreakdownRequestedEvent extends ModelBaseEvent {
  type: 'LLMBreakdownRequested';
  data: {
    prompt: string;           // User's description
  };
}

export interface LLMBreakdownReceivedEvent extends ModelBaseEvent {
  type: 'LLMBreakdownReceived';
  data: {
    subtasks: SubTask[];
    phases?: ProjectPhase[];
    suggestedMetric?: MetricConfig;
    estimatedTotal?: number;
  };
}

export interface LLMBreakdownAcceptedEvent extends ModelBaseEvent {
  type: 'LLMBreakdownAccepted';
  data: {
    subtaskIds: string[];
  };
}

// Activity Logging Events
export interface ActivityLoggedEvent extends ModelBaseEvent {
  type: 'ActivityLogged';
  data: {
    value?: number;
    completed?: boolean;
    notes?: string;
    mood?: string;
    photoIds?: string[];
    duration?: number;
    location?: string;
    tags?: string[];
  };
}

export interface ActivityLogUpdatedEvent extends ModelBaseEvent {
  type: 'ActivityLogUpdated';
  data: {
    logId: string;
    updates: Partial<ActivityLog>;
  };
}

export interface ActivityLogDeletedEvent extends ModelBaseEvent {
  type: 'ActivityLogDeleted';
  data: {
    logId: string;
  };
}

// SubTask Events (for projects)
export interface SubTaskStartedEvent extends ModelBaseEvent {
  type: 'SubTaskStarted';
  data: {
    subtaskId: string;
    startedAt: number;
  };
}

export interface SubTaskCompletedEvent extends ModelBaseEvent {
  type: 'SubTaskCompleted';
  data: {
    subtaskId: string;
    completedAt: number;
    actualTime?: number;
  };
}

export interface SubTaskPhotoAddedEvent extends ModelBaseEvent {
  type: 'SubTaskPhotoAdded';
  data: {
    subtaskId: string;
    photoId: string;
    phase?: string;           // 'before', 'during', 'after'
  };
}

// Nudge/Reminder Events (future)
export interface NudgeScheduledEvent extends ModelBaseEvent {
  type: 'NudgeScheduled';
  data: {
    time: string;             // "16:00"
    message?: string;
  };
}

export interface NudgeUpdatedEvent extends ModelBaseEvent {
  type: 'NudgeUpdated';
  data: {
    time?: string;
    enabled?: boolean;
  };
}

// ============================================================================
// UNION TYPE FOR ALL ACTIVITY EVENTS
// ============================================================================

export type ActivityEvent =
  | AspirationCreatedEvent
  | AspirationUpdatedEvent
  | AspirationReviewedEvent
  | AspirationRetiredEvent
  | ActivityLinkedToAspirationEvent
  | ActivityCreatedEvent
  | ActivityUpdatedEvent
  | ActivityPausedEvent
  | ActivityResumedEvent
  | ActivityCompletedEvent
  | ActivityArchivedEvent
  | LLMBreakdownRequestedEvent
  | LLMBreakdownReceivedEvent
  | LLMBreakdownAcceptedEvent
  | ActivityLoggedEvent
  | ActivityLogUpdatedEvent
  | ActivityLogDeletedEvent
  | SubTaskStartedEvent
  | SubTaskCompletedEvent
  | SubTaskPhotoAddedEvent
  | NudgeScheduledEvent
  | NudgeUpdatedEvent;

// ============================================================================
// LLM SETUP EXAMPLES - How AI helps configure activities
// ============================================================================

/*
// EXAMPLE 1: Simple Habit with Reminder
// User: "I want to be reminded to go for a walk and track minutes"

// Step 1: LLM analyzes request
const userPrompt = "I want to be reminded to go for a walk and track minutes";

// Step 2: LLM suggests configuration
const llmSuggestion = {
  activityType: 'habit',
  title: 'Go for a walk',
  category: 'health',
  metric: {
    type: 'duration',
    unit: 'min',
    target: 30,                    // LLM suggests 30min based on health guidelines
    allowMultiplePerDay: false
  },
  recurrence: {
    pattern: 'daily',
    preferredTime: '16:00'         // LLM suggests 4pm (common walking time)
  },
  alternativeMetrics: [             // LLM offers alternatives
    { type: 'distance', unit: 'miles', target: 2 },
    { type: 'steps', unit: 'steps', target: 5000 },
    { type: 'checkmark' }           // Just "did it" without measuring
  ],
  questions: [                       // LLM asks for clarification
    {
      question: 'What time would you like a gentle reminder?',
      suggestions: ['Morning (8am)', 'Lunch (12pm)', 'Afternoon (4pm)', 'Evening (6pm)', 'No reminder'],
      defaultAnswer: '16:00'
    },
    {
      question: 'Would you also like to track distance or steps?',
      suggestions: ['Just minutes', 'Minutes + distance', 'Minutes + steps', 'All three'],
      defaultAnswer: 'Just minutes'
    }
  ]
};

// Step 3: User reviews and confirms (or adjusts time to 5pm)
const finalConfig: ActivityState = {
  id: 'act_walk_1',
  type: 'habit',
  title: 'Go for a walk',
  category: 'health',
  metric: {
    type: 'duration',
    unit: 'min',
    target: 30,
    allowMultiplePerDay: false
  },
  recurrence: {
    pattern: 'daily',
    preferredTime: '17:00'         // User adjusted to 5pm
  },
  llmGenerated: true,
  status: 'active',
  createdAt: Date.now(),
  updatedAt: Date.now()
};

// Step 4: Events stored
const events = [
  {
    type: 'LLMBreakdownRequested',
    data: { prompt: userPrompt }
  },
  {
    type: 'LLMBreakdownReceived',
    data: {
      suggestedMetric: { type: 'duration', unit: 'min', target: 30 },
      alternativeMetrics: [...]
    }
  },
  {
    type: 'ActivityCreated',
    data: finalConfig
  },
  {
    type: 'NudgeScheduled',
    data: { time: '17:00', message: 'Hey, want to go for a walk?' }
  }
];


// EXAMPLE 2: Complex Project
// User: "I want to remodel my bathroom"

const projectPrompt = "I want to remodel my bathroom";

const llmProjectSuggestion = {
  activityType: 'project',
  title: 'Bathroom Remodel',
  category: 'home',
  metric: {
    type: 'percentage',
    unit: '%',
    target: 100
  },
  llmBreakdown: {
    phases: [
      {
        name: 'Demo & Removal',
        subtasks: [
          { title: 'Remove old fixtures', estimatedTime: 4 },
          { title: 'Demo tile and drywall', estimatedTime: 6 },
          { title: 'Haul away debris', estimatedTime: 2 }
        ]
      },
      {
        name: 'Rough Work',
        subtasks: [
          { title: 'Update electrical', estimatedTime: 8 },
          { title: 'Rough plumbing', estimatedTime: 10 },
          { title: 'Install new subfloor if needed', estimatedTime: 4 }
        ]
      },
      {
        name: 'Finishing',
        subtasks: [
          { title: 'Install cement board', estimatedTime: 4 },
          { title: 'Tile walls and floor', estimatedTime: 20 },
          { title: 'Grout and seal', estimatedTime: 6 },
          { title: 'Install new fixtures', estimatedTime: 8 },
          { title: 'Paint ceiling and trim', estimatedTime: 6 }
        ]
      }
    ],
    totalEstimate: 78,                // hours
    suggestedTracking: [
      'Photos: Before/During/After each phase',
      'Time spent per subtask',
      'Budget tracking',
      'Percentage completion'
    ]
  },
  budget: {
    estimated: 5000,
    breakdown: {
      materials: 3000,
      tools: 500,
      professional: 1500
    }
  },
  questions: [
    {
      question: 'Are you doing this yourself or hiring professionals?',
      suggestions: ['DIY', 'Hiring contractor', 'Mix of both'],
      impact: 'Affects time estimates and budget breakdown'
    },
    {
      question: 'Do you want to track photos for each phase?',
      suggestions: ['Yes, before/during/after', 'Just before/after', 'No photos'],
      defaultAnswer: 'Yes, before/during/after'
    },
    {
      question: 'Would you like budget tracking?',
      suggestions: ['Yes, track expenses', 'No, just time and progress'],
      defaultAnswer: 'Yes, track expenses'
    }
  ]
};


// EXAMPLE 3: Study/Certification
// User: "I need to study for Azure certification, 30 minutes daily on weekdays"

const studyPrompt = "I need to study for Azure certification, 30 minutes daily on weekdays";

const llmStudySuggestion = {
  activityType: 'timeblock',
  title: 'Study for Azure Certification',
  category: 'learning',
  metric: {
    type: 'duration',
    unit: 'min',
    target: 30,
    allowMultiplePerDay: false
  },
  recurrence: {
    pattern: 'custom',
    daysOfWeek: [1, 2, 3, 4, 5],     // Mon-Fri
    preferredTime: '20:00'           // LLM suggests evening (common study time)
  },
  llmBreakdown: {
    subtasks: [
      {
        title: 'Complete MS Learn modules',
        estimatedTime: 40,             // hours total
        metric: { type: 'count', unit: 'modules' }
      },
      {
        title: 'Practice labs',
        estimatedTime: 20,
        metric: { type: 'count', unit: 'labs' }
      },
      {
        title: 'Practice exams',
        estimatedTime: 10,
        metric: { type: 'count', unit: 'exams' }
      }
    ],
    totalEstimate: 70,                 // hours = ~14 weeks at 30min/day
    milestones: [
      { at: 25, title: '25 hours logged - you\'re committed!' },
      { at: 50, title: 'Halfway there - great progress!' },
      { at: 70, title: 'Ready for the exam - you got this!' }
    ]
  },
  questions: [
    {
      question: 'What time works best for studying?',
      suggestions: ['Morning (before work)', 'Lunch break', 'Evening (after work)', 'Weekends only'],
      defaultAnswer: 'Evening (after work)'
    },
    {
      question: 'Do you want to track specific modules/labs completed?',
      suggestions: ['Yes, track details', 'No, just time spent'],
      defaultAnswer: 'Yes, track details'
    }
  ]
};


// EXAMPLE 4: Aspiration-to-Activity Flow
// User starts with long-term vision, then breaks into activities

// Step 1: User defines aspiration (with LLM help)
// User: "I want to be healthier"

const llmAspirationRefinement = {
  original: "I want to be healthier",
  
  clarifyingQuestions: [
    {
      question: "When you think 'healthier', what matters most to you?",
      options: [
        'Physical fitness (strength, endurance)',
        'Weight management',
        'Mental wellness (stress, sleep)',
        'More energy for daily life',
        'Longevity and prevention',
        'All of the above'
      ]
    }
  ],
  
  suggestedAspiration: {
    title: "Build sustainable fitness and energy",
    description: "Develop daily habits that support physical health, mental clarity, and sustained energy",
    reviewCycle: 'quarterly'
  },
  
  suggestedActivities: [
    {
      type: 'habit',
      title: 'Go for daily walks',
      metric: { type: 'duration', target: 30 },
      why: 'Foundation of sustainable fitness'
    },
    {
      type: 'habit', 
      title: 'Do pushups',
      metric: { type: 'count', target: 10 },
      why: 'Build upper body strength'
    },
    {
      type: 'habit',
      title: 'Drink water',
      metric: { type: 'count', unit: 'glasses', target: 8 },
      why: 'Stay hydrated for energy'
    },
    {
      type: 'timeblock',
      title: 'Evening wind-down',
      metric: { type: 'duration', target: 30 },
      why: 'Better sleep = more energy'
    }
  ]
};

// User selects: aspiration + walk habit + pushups habit
// System creates and links them

const healthAspiration: Aspiration = {
  id: 'asp_1',
  title: 'Build sustainable fitness and energy',
  description: 'Develop daily habits that support physical health and energy',
  status: 'active',
  reviewCycle: 'quarterly',
  linkedActivityIds: ['act_walk_1', 'act_pushups_1'],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  nextReviewAt: Date.now() + (90 * 24 * 60 * 60 * 1000) // 90 days
};


// EXAMPLE 5: Quarterly Aspiration Review (LLM-Assisted)
// System prompts for review when nextReviewAt is reached

const llmQuarterlyReview = {
  aspiration: healthAspiration,
  
  activitySummary: {
    'Go for daily walks': {
      totalLogs: 65,
      totalMinutes: 1950, // 32.5 hours
      averagePerWeek: 5,
      trend: 'increasing'
    },
    'Do pushups': {
      totalLogs: 40,
      totalReps: 520,
      averagePerWeek: 3,
      trend: 'steady'
    }
  },
  
  llmAnalysis: `
    Great progress on your "Build sustainable fitness" aspiration!
    
    **Wins:**
    - Walking is now a solid habit (5x/week average)
    - 32.5 hours of walking this quarter - amazing!
    - Pushups are consistent, even if not daily
    
    **Observations:**
    - Walking peaks on weekends (you love weekend walks!)
    - Pushups often happen in evening (maybe add morning set?)
    
    **Questions for you:**
    1. Is this aspiration still meaningful to you?
    2. Want to add new activities (stretching, weights)?
    3. Adjust any targets (walk longer? more pushups?)
    4. Anything blocking you from more consistency?
  `,
  
  suggestedActions: [
    { action: 'Keep aspiration as-is', recommended: true },
    { action: 'Add stretching habit' },
    { action: 'Increase pushup target to 15' },
    { action: 'Add sleep tracking activity' },
    { action: 'Retire this aspiration (achieved!)' }
  ]
};


// ============================================================================
// EXAMPLE USAGE - MANUALLY CREATED ACTIVITIES
// ============================================================================

/*
// Simple Habit: Do pushups
const pushups: ActivityState = {
  id: 'act_1',
  type: 'habit',
  title: 'Do pushups',
  category: 'health',
  metric: {
    type: 'count',
    unit: 'reps',
    target: 10,
    allowMultiplePerDay: true
  },
  recurrence: {
    pattern: 'daily',
    timesPerDay: 2,
    preferredTime: '07:00'
  },
  status: 'active',
  createdAt: Date.now(),
  updatedAt: Date.now()
};

// Flexible Walk Tracking
const walk: ActivityState = {
  id: 'act_2',
  type: 'habit',
  title: 'Go for a walk',
  category: 'health',
  metric: {
    type: 'duration',        // User can log: checkmark, minutes, miles, or steps
    unit: 'min',
    allowMultiplePerDay: false
  },
  recurrence: {
    pattern: 'daily',
    preferredTime: '16:00'
  },
  status: 'active',
  createdAt: Date.now(),
  updatedAt: Date.now()
};

// Complex Project with LLM breakdown
const bathroomRemodel: ActivityState = {
  id: 'act_3',
  type: 'project',
  title: 'Remodel bathroom',
  category: 'home',
  metric: {
    type: 'percentage',
    unit: '%'
  },
  llmGenerated: true,
  llmBreakdown: {
    subtasks: [
      {
        id: 'sub_1',
        title: 'Demo existing fixtures',
        estimatedTime: 8,
        status: 'completed',
        order: 1
      },
      {
        id: 'sub_2',
        title: 'Rough plumbing',
        estimatedTime: 12,
        status: 'in-progress',
        order: 2,
        dependencies: ['sub_1']
      },
      {
        id: 'sub_3',
        title: 'Install new tiling',
        estimatedTime: 20,
        status: 'pending',
        order: 3,
        dependencies: ['sub_2']
      },
      {
        id: 'sub_4',
        title: 'Paint and finish',
        estimatedTime: 6,
        status: 'pending',
        order: 4,
        dependencies: ['sub_3']
      }
    ],
    totalEstimate: 46
  },
  projectPhases: [
    {
      id: 'phase_1',
      name: 'Demo',
      status: 'completed',
      subtasks: ['sub_1'],
      photoIds: ['photo_1', 'photo_2']
    },
    {
      id: 'phase_2',
      name: 'Plumbing',
      status: 'in-progress',
      subtasks: ['sub_2']
    }
  ],
  budget: {
    estimated: 5000,
    actual: 1200
  },
  status: 'active',
  createdAt: Date.now(),
  updatedAt: Date.now()
};

// Certification Study (time block)
const msLearnStudy: ActivityState = {
  id: 'act_4',
  type: 'timeblock',
  title: 'Study for Azure certification',
  category: 'learning',
  metric: {
    type: 'duration',
    unit: 'min',
    target: 30
  },
  recurrence: {
    pattern: 'daily',
    daysOfWeek: [1, 2, 3, 4, 5], // Weekdays only
    preferredTime: '20:00'
  },
  status: 'active',
  createdAt: Date.now(),
  updatedAt: Date.now()
};

// Activity Log Examples
const pushupsLog: ActivityLog = {
  id: 'log_1',
  activityId: 'act_1',
  timestamp: Date.now(),
  value: 15,                    // Did 15 pushups
  notes: 'Felt good today!'
};

const walkLog: ActivityLog = {
  id: 'log_2',
  activityId: 'act_2',
  timestamp: Date.now(),
  value: 30,                    // 30 minutes
  mood: 'great',
  notes: 'Saw 2 cardinals and a squirrel',
  photoIds: ['photo_3']
};

const studyLog: ActivityLog = {
  id: 'log_3',
  activityId: 'act_4',
  timestamp: Date.now(),
  duration: 45,                 // Studied for 45min (over 30min target!)
  notes: 'Completed 3 modules on Azure Functions'
};
*/
