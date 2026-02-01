'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Habit } from '@/lib/aggregates/habit';
import type { HabitSuggestion } from '@/lib/ai/openai-client';

interface HabitFormProps {
  onSubmit?: (habit: Habit) => void;
  onCancel?: () => void;
}

export function HabitForm({ onSubmit, onCancel }: HabitFormProps) {
  // AI Mode
  const [mode, setMode] = useState<'ai' | 'manual'>('ai');
  const [aiInput, setAiInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestion, setSuggestion] = useState<HabitSuggestion | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [recurring, setRecurring] = useState<'daily' | 'weekly' | 'custom'>('daily');
  const [nudgeTime, setNudgeTime] = useState('');
  const [metric, setMetric] = useState<'checkmark' | 'count' | 'duration' | 'distance'>('checkmark');
  const [unit, setUnit] = useState('');
  const [target, setTarget] = useState('');
  const [frequency, setFrequency] = useState('daily');

  const handleAIGenerate = async () => {
    if (!aiInput.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/suggest-habit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: aiInput }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate suggestion');
      }

      const data = await response.json();
      const sug = data.suggestion;
      setSuggestion(sug);

      // Populate form with suggestion
      setTitle(sug.title);
      setDescription(sug.description);
      setCategory(sug.category);
      setRecurring(sug.recurring);
      setNudgeTime(sug.nudgeTime || '');
      setMetric(sug.metric);
      setUnit(sug.unit || '');
      setTarget(sug.target?.toString() || '');
      setFrequency(sug.frequency || 'daily');
      
      // Switch to manual mode to show editable form
      setMode('manual');
    } catch (error) {
      console.error('AI generation error:', error);
      alert('Failed to generate suggestion. Please try manual mode.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const habit = new Habit();
    habit.create({
      title,
      description: description || undefined,
      category: category || undefined,
      recurring: recurring,
      nudgeTime: nudgeTime || undefined,
    });

    await habit.save();

    if (onSubmit) {
      onSubmit(habit);
    }

    // Reset form
    setTitle('');
    setDescription('');
    setCategory('');
    setRecurring('daily');
    setNudgeTime('');
    setMetric('checkmark');
    setUnit('');
    setTarget('');
    setFrequency('daily');
    setSuggestion(null);
    setAiInput('');
    setMode('ai');
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Create a New Habit</span>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={mode === 'ai' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('ai')}
            >
              🤖 AI Assist
            </Button>
            <Button
              type="button"
              variant={mode === 'manual' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('manual')}
            >
              ✏️ Manual
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {mode === 'ai' && !suggestion ? (
          /* AI Input Mode */
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Tell me what you want to do
              </label>
              <textarea
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="e.g., I want to go for daily walks and track how many minutes I walk each day"
                rows={3}
                className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-700 rounded-md 
                           bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100
                           focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              💡 Examples: "remind me to do 10 pushups daily" • "track time spent reading each week" • "log my morning meditation"
            </p>
            <div className="flex gap-3">
              <Button
                type="button"
                onClick={handleAIGenerate}
                disabled={!aiInput.trim() || isGenerating}
                className="flex-1"
              >
                {isGenerating ? '🔄 Generating...' : '✨ Generate Habit'}
              </Button>
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </div>
        ) : (
          /* Manual Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            {suggestion && (
              <div className="bg-sky-50 dark:bg-sky-950 border border-sky-200 dark:border-sky-800 rounded-lg p-4">
                <p className="text-sm text-sky-900 dark:text-sky-100 font-medium mb-1">
                  ✨ AI Suggestion Applied
                </p>
                <p className="text-xs text-sky-700 dark:text-sky-300">
                  {suggestion.reasoning || 'Review and adjust the fields below as needed.'}
                </p>
              </div>
            )}

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Habit Name *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g., Daily walk, Morning pushups"
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md 
                           bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100
                           focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Why does this matter? (Optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="e.g., Stay healthy and enjoy nature like Stela loved"
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md 
                           bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100
                           focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md 
                             bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100
                             focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  <option value="">Choose category</option>
                  <option value="health">🌱 Health</option>
                  <option value="nature">🌿 Nature</option>
                  <option value="mindfulness">🧘 Mindfulness</option>
                  <option value="family">👨‍👩‍👧 Family</option>
                  <option value="learning">📚 Learning</option>
                  <option value="creativity">🎨 Creativity</option>
                  <option value="home">🏠 Home</option>
                </select>
              </div>

              {/* Recurring */}
              <div>
                <label htmlFor="recurring" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  How often?
                </label>
                <select
                  id="recurring"
                  value={recurring}
                  onChange={(e) => setRecurring(e.target.value as 'daily' | 'weekly' | 'custom')}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md 
                             bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100
                             focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              {/* Metric Type */}
              <div>
                <label htmlFor="metric" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  How to track?
                </label>
                <select
                  id="metric"
                  value={metric}
                  onChange={(e) => setMetric(e.target.value as any)}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md 
                             bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100
                             focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                >
                  <option value="checkmark">✓ Checkmark (done/not done)</option>
                  <option value="count">🔢 Count (reps, steps, pages, etc.)</option>
                  <option value="duration">⏱️ Duration (seconds, minutes, hours)</option>
                  <option value="distance">📏 Distance (miles, km, meters)</option>
                </select>
              </div>

              {/* Nudge Time */}
              <div>
                <label htmlFor="nudgeTime" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Gentle reminder time
                </label>
                <input
                  type="time"
                  id="nudgeTime"
                  value={nudgeTime}
                  onChange={(e) => setNudgeTime(e.target.value)}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md 
                             bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100
                             focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Target (if metric needs it) */}
            {metric !== 'checkmark' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="target" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Target (optional)
                  </label>
                  <input
                    type="number"
                    id="target"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="e.g., 30"
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md 
                               bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100
                               focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="unit" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Unit
                  </label>
                  <input
                    type="text"
                    id="unit"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder={
                      metric === 'duration' 
                        ? 'seconds, minutes, hours' 
                        : metric === 'count' 
                        ? 'reps, steps, pages, etc.' 
                        : metric === 'distance'
                        ? 'miles, km, meters'
                        : ''
                    }
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md 
                               bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100
                               focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-700">
              <Button type="submit" className="flex-1">
                Create Habit
              </Button>
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              {suggestion && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSuggestion(null);
                    setMode('ai');
                  }}
                >
                  ← Try Again
                </Button>
              )}
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
