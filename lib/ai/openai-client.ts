// Azure OpenAI Client Wrapper

import { AzureOpenAI } from 'openai';

let client: AzureOpenAI | null = null;

export function getOpenAIClient(): AzureOpenAI {
  if (!client) {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-5-nano';

    if (!endpoint || !apiKey) {
      throw new Error('Azure OpenAI credentials not configured');
    }

    client = new AzureOpenAI({
      endpoint,
      apiKey,
      deployment,
      apiVersion: '2024-08-01-preview',
    });
  }

  return client;
}

export interface HabitSuggestion {
  title: string;
  description: string;
  category: 'health' | 'nature' | 'mindfulness' | 'family' | 'learning' | 'creativity' | 'home';
  recurring: 'daily' | 'weekly' | 'custom';
  nudgeTime?: string;
  metric: 'checkmark' | 'count' | 'duration' | 'distance' | 'steps';
  unit?: string;
  target?: number;
  frequency?: string;
  reasoning?: string;
}

const SYSTEM_PROMPT = `You are a thoughtful habit coach helping someone build sustainable, meaningful habits.

When a user describes what they want to do, analyze it and suggest a well-configured habit.

Categories:
- health: Exercise, nutrition, sleep, wellness
- nature: Outdoor activities, walking, gardening
- mindfulness: Meditation, journaling, reflection
- family: Time with loved ones, calls with parents
- learning: Reading, studying, skill development
- creativity: Art, music, writing, hobbies
- home: Cleaning, organizing, projects

Recurring patterns:
- daily: Best for small, consistent habits
- weekly: Good for larger activities or schedules
- custom: For irregular or flexible habits

Metrics:
- checkmark: Simple done/not done (e.g., "meditated today")
- count: Number of reps (e.g., "20 pushups")
- duration: Time spent in minutes (e.g., "30min walk")
- distance: Miles or km (e.g., "2.5 miles")
- steps: Step count (e.g., "10,000 steps")

Guidelines:
- Keep titles short and action-oriented
- Descriptions should be motivating, not pressuring
- Suggest realistic targets based on activity type
- Choose the most natural metric for tracking
- Nudge times should fit typical daily schedules
- Include reasoning to help user understand choices

Return a single JSON object (not an array) with the habit suggestion.`;

export async function suggestHabit(userInput: string): Promise<HabitSuggestion> {
  const client = getOpenAIClient();

  const response = await client.chat.completions.create({
    model: process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-5-nano',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `User says: "${userInput}"\n\nSuggest a habit configuration.` },
    ],
    temperature: 0.7,
    max_tokens: 500,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from AI');
  }

  const suggestion = JSON.parse(content) as HabitSuggestion;
  return suggestion;
}
