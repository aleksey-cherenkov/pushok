'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Goal } from '@/lib/aggregates/goal';

interface GoalFormProps {
  onSubmit?: (goal: Goal) => void;
  onCancel?: () => void;
  initialData?: {
    title: string;
    description?: string;
    category?: string;
    targetDate?: string;
  };
}

export function GoalForm({ onSubmit, onCancel, initialData }: GoalFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [targetDate, setTargetDate] = useState(initialData?.targetDate || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const goal = new Goal();
    goal.create({
      title,
      description: description || undefined,
      category: category || undefined,
      targetDate: targetDate || undefined,
    });

    await goal.save();

    if (onSubmit) {
      onSubmit(goal);
    }

    // Reset form
    setTitle('');
    setDescription('');
    setCategory('');
    setTargetDate('');
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create a New Goal</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              What would you like to focus on? *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g., Watch birds for 10 minutes daily"
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
              <option value="nature">🌿 Nature & Outdoors</option>
              <option value="mindfulness">🧘 Mindfulness & Presence</option>
              <option value="creativity">🎨 Creativity & Expression</option>
              <option value="connection">💚 Connection & Relationships</option>
              <option value="learning">📚 Learning & Growth</option>
              <option value="health">🌱 Health & Wellness</option>
              <option value="simplicity">✨ Simplicity & Joy</option>
            </select>
          </div>

          {/* Target Date */}
          <div>
            <label
              htmlFor="targetDate"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
            >
              When would you like to explore this by?
            </label>
            <input
              type="date"
              id="targetDate"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md 
                         bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100
                         focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Optional - think of this as gentle guidance, not a deadline
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Create Goal
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
