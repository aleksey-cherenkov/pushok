'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Habit, type HabitState } from '@/lib/aggregates/habit';
import { Activity } from '@/lib/aggregates/activity';
import { ActivityLogModal } from '@/components/habits/activity-log-modal';
import { eventStore } from '@/lib/events/store';

interface TodayActivity {
  id: string;
  habitId: string;
  loggedAt: number;
  value?: number;
  notes?: string;
  mood?: string;
}

export default function TodayPage() {
  const [habits, setHabits] = useState<HabitState[]>([]);
  const [todayActivities, setTodayActivities] = useState<TodayActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingHabit, setLoggingHabit] = useState<HabitState | null>(null);
  const [expandedHabit, setExpandedHabit] = useState<string | null>(null);

  const loadData = async () => {
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
        if (state && !state.archived && !state.paused) {
          loadedHabits.push(state);
        }
      }

      setHabits(loadedHabits);

      // Load today's activities
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayTimestamp = today.getTime();

      const activityEvents = events.filter(
        (e) => e.type === 'ActivityLogged' && e.timestamp >= todayTimestamp
      );

      const activities = activityEvents.map((e) => {
        const data = e.data as any;
        return {
          id: e.aggregateId,
          habitId: data.habitId as string,
          loggedAt: e.timestamp,
          value: data.value as number | undefined,
          notes: data.notes as string | undefined,
          mood: data.mood as string | undefined,
        };
      });

      setTodayActivities(activities);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleQuickLog = async (habitId: string, logData: { value?: number; notes?: string; mood?: string }) => {
    try {
      const activity = new Activity();
      activity.log({
        habitId,
        completed: true,
        ...logData,
      });
      await activity.save();
      setLoggingHabit(null);
      await loadData();
    } catch (error) {
      console.error('Failed to log activity:', error);
      alert('Failed to log activity. Please try again.');
    }
  };

  const getHabitLogs = (habitId: string) => {
    return todayActivities.filter((a) => a.habitId === habitId);
  };

  const getHabitSummary = (habitId: string) => {
    const logs = getHabitLogs(habitId);
    const count = logs.length;
    const totalValue = logs.reduce((sum, log) => sum + (log.value || 0), 0);
    return { count, totalValue };
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50 dark:from-zinc-900 dark:to-zinc-950 px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-zinc-600 dark:text-zinc-400">Loading your day...</p>
        </div>
      </div>
    );
  }

  const completedCount = todayActivities.length;
  const totalHabits = habits.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50 dark:from-zinc-900 dark:to-zinc-950 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Today's Focus
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Progress Summary */}
        <Card className="border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                {completedCount}
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {completedCount === 0
                  ? 'Ready to start your day? ✨'
                  : completedCount === 1
                  ? 'Great start! 🌿'
                  : `${completedCount} activities logged today! Keep going! 🎉`}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Today's Habits */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Today's Habits
          </h2>

          {habits.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-zinc-500 dark:text-zinc-400 mb-4">
                  No active habits yet. Start by creating your first one!
                </p>
                <Button asChild>
                  <a href="/habits">Create Habit</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {habits.map((habit) => {
                const { count, totalValue } = getHabitSummary(habit.id);
                const logs = getHabitLogs(habit.id);
                const isExpanded = expandedHabit === habit.id;

                return (
                  <Card key={habit.id}>
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div>
                              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                                {habit.title}
                              </h3>
                              {habit.description && (
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
                                  {habit.description}
                                </p>
                              )}
                              {count > 0 && (
                                <div className="flex items-center gap-2 mt-2">
                                  <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                    {count} {count === 1 ? 'session' : 'sessions'} today
                                    {totalValue > 0 && ` • ${totalValue} total`}
                                  </p>
                                  <button
                                    onClick={() => setExpandedHabit(isExpanded ? null : habit.id)}
                                    className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                                  >
                                    {isExpanded ? '− hide' : '+ show'}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={() => setLoggingHabit(habit)}
                            className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600"
                          >
                            {count > 0 ? '+ Log Again' : '✓ Log Now'}
                          </Button>
                        </div>
                      </div>

                      {/* Expanded Logs */}
                      {isExpanded && logs.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700 space-y-2">
                          {logs.map((log) => (
                            <div
                              key={log.id}
                              className="flex items-center justify-between text-sm bg-zinc-50 dark:bg-zinc-900 rounded-lg p-3"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-zinc-600 dark:text-zinc-400">
                                    {formatTime(log.loggedAt)}
                                  </span>
                                  {log.value && (
                                    <span className="font-medium text-zinc-900 dark:text-zinc-50">
                                      • {log.value}
                                    </span>
                                  )}
                                  {log.mood && <span>{log.mood}</span>}
                                </div>
                                {log.notes && (
                                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                                    {log.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Motivational Footer */}
        {completedCount > 0 && (
          <div className="text-center py-6">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">
              "Small steps, big journey. Stela would be proud." 🐱
            </p>
          </div>
        )}
      </div>

      {/* Activity Log Modal */}
      {loggingHabit && (
        <ActivityLogModal
          habit={loggingHabit}
          onLog={(data) => handleQuickLog(loggingHabit.id, data)}
          onCancel={() => setLoggingHabit(null)}
        />
      )}
    </div>
  );
}
