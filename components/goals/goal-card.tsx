'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { GoalState } from '@/lib/aggregates/goal';

interface GoalCardProps {
  goal: GoalState;
  onEdit?: (goalId: string) => void;
  onArchive?: (goalId: string) => void;
}

const categoryEmojis: Record<string, string> = {
  nature: '🌿',
  mindfulness: '🧘',
  creativity: '🎨',
  connection: '💚',
  learning: '📚',
  health: '🌱',
  simplicity: '✨',
};

export function GoalCard({ goal, onEdit, onArchive }: GoalCardProps) {
  const categoryEmoji = goal.category ? categoryEmojis[goal.category] : '🎯';
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card className={goal.archived ? 'opacity-60' : ''}>
      <CardHeader>
        <CardTitle className="flex items-start justify-between">
          <div className="flex items-start gap-2">
            <span className="text-2xl">{categoryEmoji}</span>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {goal.title}
              </h3>
              {goal.category && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 capitalize mt-1">
                  {goal.category}
                </p>
              )}
            </div>
          </div>
          {goal.archived && (
            <span className="text-xs bg-zinc-200 dark:bg-zinc-700 px-2 py-1 rounded">
              Archived
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {goal.description && (
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            {goal.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span>Created {formatDate(goal.createdAt)}</span>
          {goal.targetDate && (
            <>
              <span>•</span>
              <span>Exploring by {new Date(goal.targetDate).toLocaleDateString()}</span>
            </>
          )}
        </div>

        {!goal.archived && (
          <div className="flex gap-2 pt-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(goal.id)}
              >
                Edit
              </Button>
            )}
            {onArchive && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onArchive(goal.id)}
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
