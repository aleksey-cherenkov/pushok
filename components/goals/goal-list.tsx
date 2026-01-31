'use client';

import { useState, useEffect } from 'react';
import { GoalCard } from './goal-card';
import type { GoalState } from '@/lib/aggregates/goal';

interface GoalListProps {
  goals: GoalState[];
  onEdit?: (goalId: string) => void;
  onArchive?: (goalId: string) => void;
  showArchived?: boolean;
}

export function GoalList({
  goals,
  onEdit,
  onArchive,
  showArchived = false,
}: GoalListProps) {
  const filteredGoals = showArchived
    ? goals
    : goals.filter((g) => !g.archived);

  const activeCount = goals.filter((g) => !g.archived).length;
  const archivedCount = goals.filter((g) => g.archived).length;

  if (goals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-zinc-500 dark:text-zinc-400">
          No goals yet. Start by creating your first one!
        </p>
        <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-2">
          Remember: Focus on what truly matters, like Stela would want.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="flex gap-4 text-sm text-zinc-600 dark:text-zinc-400">
        <span>
          <strong>{activeCount}</strong> active goal{activeCount !== 1 ? 's' : ''}
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

      {/* Goals Grid */}
      {filteredGoals.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-zinc-500 dark:text-zinc-400">
            {showArchived
              ? 'No archived goals'
              : 'No active goals - all goals are archived'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={onEdit}
              onArchive={onArchive}
            />
          ))}
        </div>
      )}
    </div>
  );
}
