'use client';

import { useState, useEffect } from 'react';
import { GoalForm } from '@/components/goals/goal-form';
import { GoalList } from '@/components/goals/goal-list';
import { Button } from '@/components/ui/button';
import { Goal, type GoalState } from '@/lib/aggregates/goal';
import { eventStore } from '@/lib/events/store';

export default function GoalsPage() {
  const [goals, setGoals] = useState<GoalState[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load goals from event store
  const loadGoals = async () => {
    setLoading(true);
    try {
      const events = await eventStore.getAllEvents();
      
      // Group events by aggregateId
      const goalEvents = events.filter((e) => e.aggregateType === 'Goal');
      const goalIds = [...new Set(goalEvents.map((e) => e.aggregateId))];

      // Rebuild each goal from its events
      const loadedGoals: GoalState[] = [];
      for (const goalId of goalIds) {
        const goal = new Goal(goalId);
        await goal.load();
        const state = goal.getState();
        if (state) {
          loadedGoals.push(state);
        }
      }

      // Sort by created date (newest first)
      loadedGoals.sort((a, b) => b.createdAt - a.createdAt);
      setGoals(loadedGoals);
    } catch (error) {
      console.error('Failed to load goals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const handleGoalCreated = async () => {
    setShowForm(false);
    await loadGoals();
  };

  const handleArchive = async (goalId: string) => {
    try {
      const goal = new Goal(goalId);
      await goal.load();
      goal.archive('User archived this goal');
      await goal.save();
      await loadGoals();
    } catch (error) {
      console.error('Failed to archive goal:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-zinc-600 dark:text-zinc-400">
            Loading your goals...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
              Your Goals
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-2">
              Focus on what truly matters
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowArchived(!showArchived)}
            >
              {showArchived ? 'Show Active' : 'Show All'}
            </Button>
            <Button onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : '+ New Goal'}
            </Button>
          </div>
        </div>

        {/* Goal Form */}
        {showForm && (
          <div className="flex justify-center">
            <GoalForm
              onSubmit={handleGoalCreated}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Goal List */}
        <GoalList
          goals={goals}
          onArchive={handleArchive}
          showArchived={showArchived}
        />
      </div>
    </div>
  );
}
