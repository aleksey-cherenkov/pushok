'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { HabitState } from '@/lib/aggregates/habit';

interface ActivityLogModalProps {
  habit: HabitState;
  onLog: (data: { value?: number; notes?: string; mood?: string; overcameResistance?: boolean }) => void;
  onCancel: () => void;
}

export function ActivityLogModal({ habit, onLog, onCancel }: ActivityLogModalProps) {
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');
  const [mood, setMood] = useState('');
  const [overcameResistance, setOvercameResistance] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Determine metric info from habit
  const metric = habit.metric || 'checkmark';
  const unit = habit.unit || '';
  
  const needsValue = metric !== 'checkmark';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const logData: { value?: number; notes?: string; mood?: string; overcameResistance?: boolean } = {};

    if (needsValue && value) {
      logData.value = parseFloat(value);
    }

    if (notes) {
      logData.notes = notes;
    }

    if (mood) {
      logData.mood = mood;
    }

    if (overcameResistance) {
      logData.overcameResistance = true;
    }

    onLog(logData);
  };

  const getPlaceholder = () => {
    if (metric === 'count') return `Number of ${unit || 'reps'}`;
    if (metric === 'duration') return `Time in ${unit || 'minutes'}`;
    if (metric === 'distance') return `Distance in ${unit || 'miles'}`;
    return '';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onCancel}>
      <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Log Activity</span>
            <button
              onClick={onCancel}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              ✕
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Habit Info */}
            <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-4">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">
                {habit.title}
              </h3>
              {habit.description && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {habit.description}
                </p>
              )}
            </div>

            {/* Value Input (if needed) */}
            {needsValue && (
              <div>
                <label htmlFor="value" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  How much? *
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    id="value"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    required={needsValue}
                    placeholder={getPlaceholder()}
                    step="any"
                    min="0"
                    className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md 
                               bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100
                               focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  {unit && (
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">{unit}</span>
                  )}
                </div>
              </div>
            )}

            {/* Resistance Tracking */}
            <div className="flex items-start space-x-3 py-2">
              <input
                type="checkbox"
                id="overcameResistance"
                checked={overcameResistance}
                onChange={(e) => setOvercameResistance(e.target.checked)}
                className="mt-1 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-zinc-300 rounded"
              />
              <label htmlFor="overcameResistance" className="text-sm text-zinc-700 dark:text-zinc-300">
                <span className="font-medium">Overcame Resistance 💪</span>
                <span className="block text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Check this if you logged even when you didn't feel like it
                </span>
              </label>
            </div>

            {/* Optional Details */}
            <div>
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                {showDetails ? '− Hide details' : '+ Add notes or mood'}
              </button>
            </div>

            {showDetails && (
              <div className="space-y-3 pt-2">
                {/* Notes */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    placeholder="How did it feel? Any observations?"
                    className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md 
                               bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100
                               focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                {/* Mood */}
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    How are you feeling?
                  </label>
                  <div className="flex gap-2">
                    {['😊', '😌', '😐', '😔', '😫'].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setMood(mood === emoji ? '' : emoji)}
                        className={`text-2xl p-2 rounded-lg transition-colors ${
                          mood === emoji
                            ? 'bg-emerald-100 dark:bg-emerald-900'
                            : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                ✓ Log It
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
