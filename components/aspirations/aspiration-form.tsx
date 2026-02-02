'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Aspiration } from '@/lib/aggregates/aspiration';
import type { AspirationSuggestion } from '@/lib/ai/openai-client';

interface AspirationFormProps {
  onSubmit?: (aspiration: Aspiration) => void;
  onCancel?: () => void;
}

export function AspirationForm({ onSubmit, onCancel }: AspirationFormProps) {
  // AI Mode
  const [mode, setMode] = useState<'ai' | 'manual'>('ai');
  const [aiInput, setAiInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestion, setSuggestion] = useState<AspirationSuggestion | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const handleAIGenerate = async () => {
    if (!aiInput.trim()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/suggest-aspiration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: aiInput }),
      });

      const data = await response.json();

      // Handle rate limiting
      if (response.status === 429) {
        alert(data.error || 'Rate limit exceeded. Please try again later.');
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate suggestion');
      }

      const sug = data.suggestion;
      setSuggestion(sug);

      // Populate form with suggestion
      setTitle(sug.title);
      setDescription(sug.description);
      setCategory(sug.category);
      
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
        
        {/* Mode Toggle */}
        <div className="flex gap-2 mt-4">
          <Button
            type="button"
            variant={mode === 'ai' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('ai')}
            className={mode === 'ai' ? 'bg-sky-600 hover:bg-sky-700' : ''}
          >
            ✨ AI Assistant
          </Button>
          <Button
            type="button"
            variant={mode === 'manual' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('manual')}
            className={mode === 'manual' ? 'bg-sky-600 hover:bg-sky-700' : ''}
          >
            ✍️ Manual
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {mode === 'ai' ? (
          /* AI Mode */
          <div className="space-y-4">
            <div>
              <label htmlFor="ai-input" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Describe what you aspire to
              </label>
              <textarea
                id="ai-input"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="e.g., I want to get stronger for hiking, write a book, be more present with my family..."
                rows={4}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md 
                           bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100
                           focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
            
            {suggestion?.reasoning && (
              <div className="p-3 bg-sky-50 dark:bg-sky-950 rounded-md text-sm text-zinc-700 dark:text-zinc-300">
                <strong>AI Reasoning:</strong> {suggestion.reasoning}
              </div>
            )}

            <Button
              onClick={handleAIGenerate}
              disabled={isGenerating || !aiInput.trim()}
              className="w-full bg-sky-600 hover:bg-sky-700"
            >
              {isGenerating ? 'Generating...' : '✨ Generate Aspiration'}
            </Button>
          </div>
        ) : (
          /* Manual Mode */
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
        )}
      </CardContent>
    </Card>
  );
}
