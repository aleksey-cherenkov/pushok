'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Habit, type HabitState } from '@/lib/aggregates/habit';
import { Aspiration, type AspirationState } from '@/lib/aggregates/aspiration';
import { Activity, type ActivityState } from '@/lib/aggregates/activity';
import { eventStore } from '@/lib/events/store';

type Period = 'week' | 'month' | 'year' | 'all';

interface AspirationWithProgress {
  aspiration: AspirationState;
  linkedHabits: HabitState[];
  totalSessions: number;
  resistanceVictories: number;
  lastActivity?: number;
}

export default function DashboardPage() {
  const [aspirations, setAspirations] = useState<AspirationWithProgress[]>([]);
  const [period, setPeriod] = useState<Period>('month');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalResistanceVictories: 0,
    activeHabits: 0,
    activeAspirations: 0,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const events = await eventStore.getAllEvents();

      // Load all habits
      const habitEvents = events.filter((e) => e.aggregateType === 'Habit');
      const habitIds = [...new Set(habitEvents.map((e) => e.aggregateId))];

      const loadedHabits: HabitState[] = [];
      for (const habitId of habitIds) {
        const habit = new Habit(habitId);
        await habit.load();
        const state = habit.getState();
        if (state && !state.archived) {
          loadedHabits.push(state);
        }
      }

      // Load all aspirations
      const aspirationEvents = events.filter((e) => e.aggregateType === 'Aspiration');
      const aspirationIds = [...new Set(aspirationEvents.map((e) => e.aggregateId))];

      const loadedAspirations: AspirationState[] = [];
      for (const aspirationId of aspirationIds) {
        const aspiration = new Aspiration(aspirationId);
        await aspiration.load();
        const state = aspiration.getState();
        if (state && !state.archived) {
          loadedAspirations.push(state);
        }
      }

      // Load all activities
      const activityEvents = events.filter((e) => e.aggregateType === 'Activity');
      const activityIds = [...new Set(activityEvents.map((e) => e.aggregateId))];

      const loadedActivities: ActivityState[] = [];
      for (const activityId of activityIds) {
        const activity = new Activity(activityId);
        await activity.load();
        const state = activity.getState();
        if (state) {
          loadedActivities.push(state);
        }
      }

      // Calculate period start
      const now = Date.now();
      let periodStart = 0;
      if (period === 'week') {
        periodStart = now - 7 * 24 * 60 * 60 * 1000;
      } else if (period === 'month') {
        periodStart = now - 30 * 24 * 60 * 60 * 1000;
      } else if (period === 'year') {
        periodStart = now - 365 * 24 * 60 * 60 * 1000;
      }

      // Filter activities by period
      const periodActivities = loadedActivities.filter((a) => 
        period === 'all' || a.loggedAt >= periodStart
      );

      // Calculate overall stats
      const totalSessions = periodActivities.length;
      const totalResistanceVictories = periodActivities.filter((a) => a.overcameResistance).length;
      const activeHabits = loadedHabits.filter((h) => !h.paused).length;
      const activeAspirations = loadedAspirations.filter((a) => !a.paused).length;

      setStats({
        totalSessions,
        totalResistanceVictories,
        activeHabits,
        activeAspirations,
      });

      // Build aspiration progress summaries
      const aspirationsWithProgress: AspirationWithProgress[] = loadedAspirations.map((aspiration) => {
        const linkedHabits = loadedHabits.filter((h) => h.linkedAspirationId === aspiration.id);
        const linkedHabitIds = linkedHabits.map((h) => h.id);
        const linkedActivities = periodActivities.filter((a) => linkedHabitIds.includes(a.habitId));

        const totalSessions = linkedActivities.length;
        const resistanceVictories = linkedActivities.filter((a) => a.overcameResistance).length;
        const lastActivity = linkedActivities.length > 0
          ? Math.max(...linkedActivities.map((a) => a.loggedAt))
          : undefined;

        return {
          aspiration,
          linkedHabits,
          totalSessions,
          resistanceVictories,
          lastActivity,
        };
      });

      // Sort by last activity (most recent first)
      aspirationsWithProgress.sort((a, b) => {
        if (!a.lastActivity) return 1;
        if (!b.lastActivity) return -1;
        return b.lastActivity - a.lastActivity;
      });

      setAspirations(aspirationsWithProgress);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [period]);

  const getPeriodLabel = () => {
    switch (period) {
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'year': return 'This Year';
      case 'all': return 'All Time';
    }
  };

  const formatLastActivity = (timestamp?: number) => {
    if (!timestamp) return 'No activity yet';
    const days = Math.floor((Date.now() - timestamp) / (24 * 60 * 60 * 1000));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50 dark:from-zinc-900 dark:to-zinc-950 px-4 py-12">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-zinc-600 dark:text-zinc-400">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50 dark:from-zinc-900 dark:to-zinc-950 px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              Your Progress
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              {getPeriodLabel()} overview
            </p>
          </div>

          {/* Period Selector */}
          <div className="flex gap-2">
            <Button
              variant={period === 'week' ? 'default' : 'outline'}
              onClick={() => setPeriod('week')}
              size="sm"
            >
              Week
            </Button>
            <Button
              variant={period === 'month' ? 'default' : 'outline'}
              onClick={() => setPeriod('month')}
              size="sm"
            >
              Month
            </Button>
            <Button
              variant={period === 'year' ? 'default' : 'outline'}
              onClick={() => setPeriod('year')}
              size="sm"
            >
              Year
            </Button>
            <Button
              variant={period === 'all' ? 'default' : 'outline'}
              onClick={() => setPeriod('all')}
              size="sm"
            >
              All Time
            </Button>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Sessions</CardDescription>
              <CardTitle className="text-3xl text-emerald-600 dark:text-emerald-400">
                {stats.totalSessions}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Resistance Victories</CardDescription>
              <CardTitle className="text-3xl text-amber-600 dark:text-amber-400">
                {stats.totalResistanceVictories}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active Habits</CardDescription>
              <CardTitle className="text-3xl text-emerald-600 dark:text-emerald-400">
                {stats.activeHabits}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Active Aspirations</CardDescription>
              <CardTitle className="text-3xl text-sky-600 dark:text-sky-400">
                {stats.activeAspirations}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Aspirations Progress */}
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Aspirations
          </h2>

          {aspirations.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                  No aspirations yet. Create one to get started!
                </p>
                <Button asChild>
                  <a href="/aspirations">Create Aspiration</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {aspirations.map(({ aspiration, linkedHabits, totalSessions, resistanceVictories, lastActivity }) => (
                <Card key={aspiration.id} className="hover:border-sky-300 dark:hover:border-sky-700 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">{aspiration.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {aspiration.description}
                        </CardDescription>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`/aspirations/${aspiration.id}`}>View →</a>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                          {totalSessions}
                        </p>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">Sessions</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                          {resistanceVictories}
                        </p>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">Victories</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-sky-600 dark:text-sky-400">
                          {linkedHabits.length}
                        </p>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">Habits</p>
                      </div>
                    </div>

                    {/* Linked Habits */}
                    {linkedHabits.length > 0 && (
                      <div className="pt-3 border-t border-zinc-200 dark:border-zinc-700">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">
                          Linked habits:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {linkedHabits.map((habit) => (
                            <span
                              key={habit.id}
                              className="text-xs px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                            >
                              {habit.title}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Last Activity */}
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-200 dark:border-zinc-700">
                      Last activity: {formatLastActivity(lastActivity)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 justify-center pt-4">
          <Button asChild>
            <a href="/today">Today's Focus</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/habits">Manage Habits</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/aspirations">Manage Aspirations</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
