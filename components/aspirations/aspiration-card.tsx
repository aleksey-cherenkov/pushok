'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { AspirationState } from '@/lib/aggregates/aspiration';

interface AspirationCardProps {
  aspiration: AspirationState;
  habitCount?: number;
  linkedHabits?: string[];
  onEdit?: (aspirationId: string) => void;
  onArchive?: (aspirationId: string) => void;
  onViewDetails?: (aspirationId: string) => void;
}

const categoryEmojis: Record<string, string> = {
  'Health & Fitness': '💪',
  'Creative Work': '🎨',
  'Learning': '📚',
  'Relationships': '❤️',
  'Career': '🚀',
  'Personal Growth': '🌱',
};

export function AspirationCard({ 
  aspiration, 
  habitCount = 0, 
  linkedHabits = [],
  onEdit, 
  onArchive, 
  onViewDetails 
}: AspirationCardProps) {
  const categoryEmoji = aspiration.category ? categoryEmojis[aspiration.category] : '✨';
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card className={aspiration.archived ? 'opacity-60 border-zinc-300 dark:border-zinc-700' : 'border-sky-200 dark:border-sky-900'}>
      <CardHeader>
        <CardTitle className="flex items-start justify-between">
          <div className="flex items-start gap-2">
            <span className="text-2xl">{categoryEmoji}</span>
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {aspiration.title}
              </h3>
              <div className="flex gap-2 mt-1">
                {aspiration.category && (
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {aspiration.category}
                  </span>
                )}
                {aspiration.paused && (
                  <span className="text-xs bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded">
                    Paused
                  </span>
                )}
              </div>
            </div>
          </div>
          {aspiration.archived && (
            <span className="text-xs bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 px-2 py-1 rounded">
              Archived
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Description */}
          {aspiration.description && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {aspiration.description}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-sky-600 dark:text-sky-400 font-semibold">{habitCount}</span>
              <span className="text-zinc-500 dark:text-zinc-400">
                {habitCount === 1 ? 'habit linked' : 'habits linked'}
              </span>
            </div>
            <div className="text-xs text-zinc-400 dark:text-zinc-500">
              Created {formatDate(aspiration.createdAt)}
            </div>
          </div>

          {/* Linked Habits */}
          {linkedHabits.length > 0 && (
            <div>
              <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                Linked Habits:
              </p>
              <div className="flex flex-wrap gap-2">
                {linkedHabits.map((habitTitle, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded"
                  >
                    🌱 {habitTitle}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = `/aspirations/${aspiration.id}`}
              className="flex-1"
            >
              View Progress
            </Button>
            {onEdit && !aspiration.archived && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(aspiration.id)}
              >
                Edit
              </Button>
            )}
            {onArchive && !aspiration.archived && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onArchive(aspiration.id)}
                className="text-zinc-600 dark:text-zinc-400"
              >
                Archive
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
