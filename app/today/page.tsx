'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Habit, type HabitState } from '@/lib/aggregates/habit';
import { Activity } from '@/lib/aggregates/activity';
import { eventStore } from '@/lib/events/store';

interface TodayActivity {
  habitId: string;
  loggedAt: number;
  notes?: string;
}

export default function TodayPage() {
  const [habits, setHabits] = useState<HabitState[]>([]);
  const [todayActivities, setTodayActivities] = useState<TodayActivity[]>([]);
  const [loading, setLoading] = useState(true);

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
          habitId: data.habitId as string,
          loggedAt: e.timestamp,
          notes: data.notes as string | undefined,
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

  const handleQuickLog = async (habitId: string) => {
    try {
      const activity = new Activity();
      activity.log({
        habitId,
        completed: true,
      });
      await activity.save();
      await loadData();
    } catch (error) {
      console.error('Failed to log activity:', error);
      alert('Failed to log activity. Please try again.');
    }
  };

  const isLoggedToday = (habitId: string) => {
    return todayActivities.some((a) => a.habitId === habitId);
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
                {completedCount} / {totalHabits}
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {completedCount === 0
                  ? 'Ready to start your day? ✨'
                  : completedCount === totalHabits
                  ? 'Amazing! All done for today! 🎉'
                  : `You're doing great! Keep going! 🌿`}
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
                const logged = isLoggedToday(habit.id);
                const activityTime = todayActivities.find((a) => a.habitId === habit.id)?.loggedAt;

                return (
                  <Card
                    key={habit.id}
                    className={logged ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/10' : ''}
                  >
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            {logged && (
                              <span className="text-2xl">✅</span>
                            )}
                            <div>
                              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                                {habit.title}
                              </h3>
                              {habit.description && (
                                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
                                  {habit.description}
                                </p>
                              )}
                              {logged && activityTime && (
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                                  Logged at {formatTime(activityTime)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {!logged ? (
                            <Button
                              onClick={() => handleQuickLog(habit.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600"
                            >
                              ✓ Log Now
                            </Button>
                          ) : (
                            <Button variant="outline" disabled>
                              Done ✨
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="flex gap-3 justify-center pt-4">
          <Button variant="outline" asChild>
            <a href="/">← Home</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/habits">Manage Habits</a>
          </Button>
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
    </div>
  );
}
