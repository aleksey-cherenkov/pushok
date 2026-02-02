'use client';

import { useState, useEffect } from 'react';
import { HabitForm } from '@/components/habits/habit-form';
import { HabitList } from '@/components/habits/habit-list';
import { ActivityLogModal } from '@/components/habits/activity-log-modal';
import { Button } from '@/components/ui/button';
import { Habit, type HabitState } from '@/lib/aggregates/habit';
import { Aspiration, type AspirationState } from '@/lib/aggregates/aspiration';
import { eventStore } from '@/lib/events/store';

export default function HabitsPage() {
  const [habits, setHabits] = useState<HabitState[]>([]);
  const [activityCounts, setActivityCounts] = useState<Record<string, number>>({});
  const [aspirationNames, setAspirationNames] = useState<Record<string, string>>({});
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<HabitState | null>(null);
  const [loggingHabit, setLoggingHabit] = useState<HabitState | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load habits from event store
  const loadHabits = async () => {
    setLoading(true);
    try {
      const events = await eventStore.getAllEvents();
      
      // Load habits
      const habitEvents = events.filter((e) => e.aggregateType === 'Habit');
      const habitIds = [...new Set(habitEvents.map((e) => e.aggregateId))];

      const loadedHabits: HabitState[] = [];
      for (const habitId of habitIds) {
        const habit = new Habit(habitId);
        await habit.load();
        const state = habit.getState();
        if (state) {
          loadedHabits.push(state);
        }
      }

      loadedHabits.sort((a, b) => b.createdAt - a.createdAt);
      setHabits(loadedHabits);

      // Load aspirations
      const aspirationEvents = events.filter((e) => e.aggregateType === 'Aspiration');
      const aspirationIds = [...new Set(aspirationEvents.map((e) => e.aggregateId))];

      const names: Record<string, string> = {};
      for (const aspirationId of aspirationIds) {
        const aspiration = new Aspiration(aspirationId);
        await aspiration.load();
        const state = aspiration.getState();
        if (state) {
          names[state.id] = state.title;
        }
      }
      setAspirationNames(names);

      // Calculate activity counts
      const activityEvents = events.filter((e) => e.type === 'ActivityLogged');
      const counts: Record<string, number> = {};
      for (const event of activityEvents) {
        const habitId = event.data.habitId;
        counts[habitId] = (counts[habitId] || 0) + 1;
      }
      setActivityCounts(counts);
    } catch (error) {
      console.error('Failed to load habits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHabits();
  }, []);

  const handleHabitCreated = async () => {
    setShowForm(false);
    setEditingHabit(null);
    await loadHabits();
  };

  const handleEdit = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (habit) {
      setEditingHabit(habit);
      setShowForm(true);
    }
  };

  const handleArchive = async (habitId: string) => {
    try {
      const habit = new Habit(habitId);
      await habit.load();
      habit.archive('User archived this habit');
      await habit.save();
      await loadHabits();
    } catch (error) {
      console.error('Failed to archive habit:', error);
    }
  };

  const handleLogActivity = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (habit) {
      setLoggingHabit(habit);
    }
  };

  const handleActivityLogged = async (data: { 
    value?: number; 
    notes?: string; 
    mood?: string; 
    overcameResistance?: boolean;
    resistanceType?: 'perfectionism' | 'self-doubt' | 'procrastination' | 'fatigue' | 'fear' | 'distraction';
  }) => {
    if (!loggingHabit) return;

    try {
      const { Activity } = await import('@/lib/aggregates/activity');
      const activity = new Activity();
      activity.log({
        habitId: loggingHabit.id,
        ...data,
        completed: true,
      });
      await activity.save();
      
      setLoggingHabit(null);
      await loadHabits();
    } catch (error) {
      console.error('Failed to log activity:', error);
      alert('Failed to log activity. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-zinc-50 dark:from-zinc-900 dark:to-zinc-950 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-zinc-600 dark:text-zinc-400">
            Loading your habits...
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
              Your Habits
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-2">
              Small steps, big journey. No guilt, just progress.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowArchived(!showArchived)}
            >
              {showArchived ? 'Show Active' : 'Show All'}
            </Button>
            <Button onClick={() => {
              setShowForm(!showForm);
              if (showForm) {
                setEditingHabit(null);
              }
            }}>
              {showForm ? 'Cancel' : '+ New Habit'}
            </Button>
          </div>
        </div>

        {/* Habit Form */}
        {showForm && (
          <div className="flex justify-center">
            <HabitForm
              habit={editingHabit || undefined}
              onSubmit={handleHabitCreated}
              onCancel={() => {
                setShowForm(false);
                setEditingHabit(null);
              }}
            />
          </div>
        )}

        {/* Habit List */}
        <HabitList
          habits={habits}
          activityCounts={activityCounts}
          aspirationNames={aspirationNames}
          onEdit={handleEdit}
          onArchive={handleArchive}
          onLogActivity={handleLogActivity}
          showArchived={showArchived}
        />

        {/* Activity Log Modal */}
        {loggingHabit && (
          <ActivityLogModal
            habit={loggingHabit}
            onLog={handleActivityLogged}
            onCancel={() => setLoggingHabit(null)}
          />
        )}
      </div>
    </div>
  );
}
