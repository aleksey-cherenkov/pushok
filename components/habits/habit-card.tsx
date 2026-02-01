'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { HabitState } from '@/lib/aggregates/habit';

interface HabitCardProps {
  habit: HabitState;
  activityCount?: number;
  onEdit?: (habitId: string) => void;
  onArchive?: (habitId: string) => void;
  onLogActivity?: (habitId: string) => void;
}

const categoryEmojis: Record<string, string> = {
  health: '🌱',
  nature: '🌿',
  mindfulness: '🧘',
  family: '👨‍👩‍👧',
  learning: '📚',
  creativity: '🎨',
  home: '🏠',
};

export function HabitCard({ habit, activityCount = 0, onEdit, onArchive, onLogActivity }: HabitCardProps) {
  const categoryEmoji = habit.category ? categoryEmojis[habit.category] : '✨';
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card className={habit.archived ? 'opacity-60' : ''}>
      <CardHeader>
        <CardTitle className="flex items-start justify-between">
          <div className="flex items-start gap-2">
            <span className="text-2xl">{categoryEmoji}</span>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {habit.title}
              </h3>
              <div className="flex gap-2 mt-1">
                {habit.category && (
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 capitalize">
                    {habit.category}
                  </span>
                )}
                {habit.recurring && (
                  <span className="text-xs bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded">
                    {habit.recurring}
                  </span>
                )}
              </div>
            </div>
          </div>
          {habit.archived && (
            <span className="text-xs bg-zinc-200 dark:bg-zinc-700 px-2 py-1 rounded">
              Archived
            </span>
          )}
          {habit.paused && !habit.archived && (
            <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded">
              Paused
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {habit.description && (
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            {habit.description}
          </p>
        )}

        {habit.nudgeTime && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            ⏰ Gentle reminder at {habit.nudgeTime}
          </p>
        )}

        <div className="flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span>Started {formatDate(habit.createdAt)}</span>
          {activityCount > 0 && (
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              • {activityCount} {activityCount === 1 ? 'time' : 'times'} logged ✨
            </span>
          )}
        </div>

        {!habit.archived && (
          <div className="flex gap-2 pt-2">
            {onLogActivity && (
              <Button
                size="sm"
                onClick={() => onLogActivity(habit.id)}
              >
                ✓ Log Today
              </Button>
            )}
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(habit.id)}
              >
                Edit
              </Button>
            )}
            {onArchive && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onArchive(habit.id)}
              >
                Archive
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
