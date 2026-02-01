// Azure OpenAI Client Wrapper

import { AzureOpenAI } from "openai";

let client: AzureOpenAI | null = null;

export function getOpenAIClient(): AzureOpenAI {
  if (!client) {
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-5-nano";

    if (!endpoint || !apiKey) {
      throw new Error("Azure OpenAI credentials not configured");
    }

    client = new AzureOpenAI({
      endpoint,
      apiKey,
      deployment,
      apiVersion: "2024-08-01-preview",
    });
  }

  return client;
}

export interface HabitSuggestion {
  title: string;
  description: string;
  category:
    | "health"
    | "nature"
    | "mindfulness"
    | "family"
    | "learning"
    | "creativity"
    | "home";
  recurring: "daily" | "weekly" | "custom";
  nudgeTime?: string;
  metric: "checkmark" | "count" | "duration" | "distance";
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

Metrics (choose the most natural way to track):
- checkmark: Simple done/not done (e.g., "meditated today", "called parents")
  * No target or unit needed - just track completion
  
- count: Numeric tracking with a unit (reps, pages, items, steps, etc.)
  * Examples: "20 pushups" → metric: count, target: 20, unit: "reps"
  * Examples: "10,000 steps" → metric: count, target: 10000, unit: "steps"
  * Examples: "30 pages" → metric: count, target: 30, unit: "pages"
  
- duration: Time-based with flexible units (seconds, minutes, hours)
  * Examples: "30min walk" → metric: duration, target: 30, unit: "minutes"
  * Examples: "60s plank" → metric: duration, target: 60, unit: "seconds"
  * Examples: "2hr study" → metric: duration, target: 2, unit: "hours"
  
- distance: Spatial measurement (miles, km, meters)
  * Examples: "2.5 miles" → metric: distance, target: 2.5, unit: "miles"
  * Examples: "5k run" → metric: distance, target: 5, unit: "km"

IMPORTANT: Always include 'unit' field when using count, duration, or distance metrics.

Guidelines:
- Keep titles short and action-oriented
- Descriptions should be motivating, not pressuring
- Suggest realistic targets based on activity type
- Choose the most natural metric for tracking
- Nudge times should fit typical daily schedules (use 24-hour format HH:MM)
- Include reasoning to help user understand choices

Response format:
{
  "title": "Short action-oriented title",
  "description": "Motivating description",
  "category": "health|nature|mindfulness|family|learning|creativity|home",
  "recurring": "daily|weekly|custom",
  "metric": "checkmark|count|duration|distance",
  "unit": "only if metric is count/duration/distance",
  "target": number (optional),
  "nudgeTime": "HH:MM in 24-hour format (e.g., '08:00', '16:30')",
  "reasoning": "Brief explanation of your choices"
}

Return a single JSON object with these exact field names.`;

export async function suggestHabit(
  userInput: string,
): Promise<HabitSuggestion> {
  const client = getOpenAIClient();

  try {
    const response = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-5-nano",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `User says: "${userInput}"\n\nSuggest a habit configuration.`,
        },
      ],
      temperature: 1,
      response_format: { type: "json_object" },
    });

    console.log("OpenAI response:", JSON.stringify(response, null, 2));

    const content = response.choices[0]?.message?.content;
    if (!content) {
      console.error("No content in response. Full response:", response);
      throw new Error("No response from AI");
    }

    const suggestion = JSON.parse(content) as HabitSuggestion;
    return suggestion;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw error;
  }
}
