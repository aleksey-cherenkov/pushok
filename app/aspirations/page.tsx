'use client';

import { useState, useEffect } from 'react';
import { AspirationForm } from '@/components/aspirations/aspiration-form';
import { AspirationList } from '@/components/aspirations/aspiration-list';
import { Button } from '@/components/ui/button';
import { Aspiration, type AspirationState } from '@/lib/aggregates/aspiration';
import { eventStore } from '@/lib/events/store';

export default function AspirationsPage() {
  const [aspirations, setAspirations] = useState<AspirationState[]>([]);
  const [habitCounts, setHabitCounts] = useState<Record<string, number>>({});
  const [showForm, setShowForm] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadAspirations = async () => {
    setLoading(true);
    try {
      const events = await eventStore.getAllEvents();
      
      const aspirationEvents = events.filter((e) => e.aggregateType === 'Aspiration');
      const aspirationIds = [...new Set(aspirationEvents.map((e) => e.aggregateId))];

      const loadedAspirations: AspirationState[] = [];
      for (const aspirationId of aspirationIds) {
        const aspiration = new Aspiration(aspirationId);
        await aspiration.load();
        const state = aspiration.getState();
        if (state) {
          loadedAspirations.push(state);
        }
      }

      setAspirations(loadedAspirations);

      const habitEvents = events.filter((e) => e.aggregateType === 'Habit' && e.type === 'HabitCreated');
      const counts: Record<string, number> = {};
      
      habitEvents.forEach((e) => {
        const data = e.data as any;
        const linkedAspirationId = data.linkedAspirationId as string | undefined;
        if (linkedAspirationId) {
          counts[linkedAspirationId] = (counts[linkedAspirationId] || 0) + 1;
        }
      });

      setHabitCounts(counts);
    } catch (error) {
      console.error('Failed to load aspirations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAspirations();
  }, []);

  const handleCreateAspiration = async () => {
    setShowForm(false);
    await loadAspirations();
  };

  const handleArchive = async (aspirationId: string) => {
    if (!confirm('Archive this aspiration? You can restore it later.')) {
      return;
    }

    try {
      const aspiration = new Aspiration(aspirationId);
      await aspiration.load();
      aspiration.archive();
      await aspiration.save();
      await loadAspirations();
    } catch (error) {
      console.error('Failed to archive aspiration:', error);
      alert('Failed to archive aspiration. Please try again.');
    }
  };

  const displayAspirations = showArchived
    ? aspirations
    : aspirations.filter((a) => !a.archived);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-emerald-50 dark:from-zinc-900 dark:to-zinc-950 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-zinc-500 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-emerald-50 dark:from-zinc-900 dark:to-zinc-950 px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
              Aspirations
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 mt-2">
              Long-term directions without deadlines
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-sky-600 hover:bg-sky-700"
          >
            {showForm ? 'Cancel' : '+ New Aspiration'}
          </Button>
        </div>

        {showForm && (
          <AspirationForm
            onSubmit={handleCreateAspiration}
            onCancel={() => setShowForm(false)}
          />
        )}

        {aspirations.some((a) => a.archived) && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowArchived(!showArchived)}
            >
              {showArchived ? 'Hide Archived' : 'Show Archived'}
            </Button>
          </div>
        )}

        <AspirationList
          aspirations={displayAspirations}
          habitCounts={habitCounts}
          onArchive={handleArchive}
        />

        {aspirations.length === 0 && !showForm && (
          <div className="text-center py-16 space-y-4">
            <div className="text-6xl mb-4">✨</div>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              Start Your Journey
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
              Aspirations are long-term directions that give meaning to your daily habits.
              They have no deadlines—just a direction you're moving toward.
            </p>
            <div className="pt-4">
              <Button
                onClick={() => setShowForm(true)}
                className="bg-sky-600 hover:bg-sky-700"
              >
                Create Your First Aspiration
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
