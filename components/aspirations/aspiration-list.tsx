'use client';

import { AspirationCard } from './aspiration-card';
import type { AspirationState } from '@/lib/aggregates/aspiration';

interface AspirationListProps {
  aspirations: AspirationState[];
  habitCounts?: Record<string, number>;
  onEdit?: (aspirationId: string) => void;
  onArchive?: (aspirationId: string) => void;
  onViewDetails?: (aspirationId: string) => void;
}

export function AspirationList({
  aspirations,
  habitCounts = {},
  onEdit,
  onArchive,
  onViewDetails,
}: AspirationListProps) {
  const activeAspirations = aspirations.filter((a) => !a.archived && !a.paused);
  const pausedAspirations = aspirations.filter((a) => !a.archived && a.paused);
  const archivedAspirations = aspirations.filter((a) => a.archived);

  if (aspirations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-2">
          No aspirations yet
        </p>
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          Create your first aspiration to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Active Aspirations */}
      {activeAspirations.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Active Aspirations
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeAspirations.map((aspiration) => (
              <AspirationCard
                key={aspiration.id}
                aspiration={aspiration}
                habitCount={habitCounts[aspiration.id] || 0}
                onEdit={onEdit}
                onArchive={onArchive}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </div>
      )}

      {/* Paused Aspirations */}
      {pausedAspirations.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Paused
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pausedAspirations.map((aspiration) => (
              <AspirationCard
                key={aspiration.id}
                aspiration={aspiration}
                habitCount={habitCounts[aspiration.id] || 0}
                onEdit={onEdit}
                onArchive={onArchive}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </div>
      )}

      {/* Archived Aspirations */}
      {archivedAspirations.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Archived
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {archivedAspirations.map((aspiration) => (
              <AspirationCard
                key={aspiration.id}
                aspiration={aspiration}
                habitCount={habitCounts[aspiration.id] || 0}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
