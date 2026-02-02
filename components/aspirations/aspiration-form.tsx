'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Aspiration } from '@/lib/aggregates/aspiration';

interface AspirationFormProps {
  onSubmit?: (aspiration: Aspiration) => void;
  onCancel?: () => void;
}

export function AspirationForm({ onSubmit, onCancel }: AspirationFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Please enter a title for your aspiration');
      return;
    }

    const aspiration = new Aspiration();
    aspiration.create({
      title: title.trim(),
      description: description.trim() || undefined,
      category: category.trim() || undefined,
    });

    await aspiration.save();

    if (onSubmit) {
      onSubmit(aspiration);
    }
  };

  return (
    <Card className="border-sky-200 dark:border-sky-900">
      <CardHeader>
        <CardTitle className="text-2xl">Create New Aspiration</CardTitle>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
          Aspirations are long-term directions without deadlines. Where do you want to grow?
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              What do you aspire to?
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Get stronger for hiking, Write a book, Be more present with family"
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md 
                         bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100
                         focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why does this matter to you?"
              rows={3}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md 
                         bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100
                         focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Category (optional)
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md 
                         bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100
                         focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              <option value="">Select a category...</option>
              <option value="Health & Fitness">Health & Fitness</option>
              <option value="Creative Work">Creative Work</option>
              <option value="Learning">Learning</option>
              <option value="Relationships">Relationships</option>
              <option value="Career">Career</option>
              <option value="Personal Growth">Personal Growth</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1 bg-sky-600 hover:bg-sky-700">
              Create Aspiration
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
