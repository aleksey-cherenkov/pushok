'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Habit } from '@/lib/aggregates/habit';

interface HabitFormProps {
  onSubmit?: (habit: Habit) => void;
  onCancel?: () => void;
  initialData?: {
    title: string;
    description?: string;
    category?: string;
    recurring?: 'daily' | 'weekly' | 'custom';
    nudgeTime?: string;
  };
}

export function HabitForm({ onSubmit, onCancel, initialData }: HabitFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [recurring, setRecurring] = useState<'daily' | 'weekly' | 'custom'>(initialData?.recurring || 'daily');
  const [nudgeTime, setNudgeTime] = useState(initialData?.nudgeTime || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const habit = new Habit();
    habit.create({
      title,
      description: description || undefined,
      category: category || undefined,
      recurring: recurring as 'daily' | 'weekly' | 'custom',
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
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create a New Habit</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              What habit would you like to nurture? *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g., Go for a walk, Do pushups, Read before bed"
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md 
                         bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100
                         focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Why does this matter to you?
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="What will this bring to your life?"
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md 
                         bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100
                         focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>

          {/* Recurring */}
          <div>
            <label
              htmlFor="recurring"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
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

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
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
              <option value="">Choose a category (optional)</option>
              <option value="health">🌱 Health & Fitness</option>
              <option value="nature">🌿 Nature & Outdoors</option>
              <option value="mindfulness">🧘 Mindfulness & Presence</option>
              <option value="family">👨‍👩‍👧 Family & Connection</option>
              <option value="learning">📚 Learning & Growth</option>
              <option value="creativity">🎨 Creativity & Expression</option>
              <option value="home">🏠 Home & Organization</option>
            </select>
          </div>

          {/* Nudge Time */}
          <div>
            <label
              htmlFor="nudgeTime"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              Gentle reminder time (optional)
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
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              A soft nudge, not pressure. Skip days guilt-free.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Create Habit
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
