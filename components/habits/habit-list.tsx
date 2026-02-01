'use client';

import { HabitCard } from './habit-card';
import type { HabitState } from '@/lib/aggregates/habit';

interface HabitListProps {
  habits: HabitState[];
  onEdit?: (habitId: string) => void;
  onArchive?: (habitId: string) => void;
  onLogActivity?: (habitId: string) => void;
  showArchived?: boolean;
}

export function HabitList({
  habits,
  onEdit,
  onArchive,
  onLogActivity,
  showArchived = false,
}: HabitListProps) {
  const filteredHabits = showArchived
    ? habits
    : habits.filter((h) => !h.archived);

  const activeCount = habits.filter((h) => !h.archived).length;
  const archivedCount = habits.filter((h) => h.archived).length;

  if (habits.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-zinc-500 dark:text-zinc-400">
          No habits yet. Start by creating your first one!
        </p>
        <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-2">
          Remember: Small steps, big journey. No guilt, just progress.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="flex gap-4 text-sm text-zinc-600 dark:text-zinc-400">
        <span>
          <strong>{activeCount}</strong> active habit{activeCount !== 1 ? 's' : ''}
        </span>
        {archivedCount > 0 && (
          <>
            <span>•</span>
            <span>
              <strong>{archivedCount}</strong> archived
            </span>
          </>
        )}
      </div>

      {/* Habits Grid */}
      {filteredHabits.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-zinc-500 dark:text-zinc-400">
            {showArchived
              ? 'No archived habits'
              : 'No active habits - all habits are archived'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onEdit={onEdit}
              onArchive={onArchive}
              onLogActivity={onLogActivity}
            />
          ))}
        </div>
      )}
    </div>
  );
}
