'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface HabitSummary {
  title: string;
  sessions: number;
  thisMonth: number;
  lastMonth: number;
  resistanceCount: number;
}

interface AspirationProgressProps {
  aspirationTitle: string;
  habitSummaries: HabitSummary[];
}

export function AspirationProgress({ aspirationTitle, habitSummaries }: AspirationProgressProps) {
  // Aggregate totals across all habits
  const totalSessions = habitSummaries.reduce((sum, h) => sum + h.sessions, 0);
  const totalThisMonth = habitSummaries.reduce((sum, h) => sum + h.thisMonth, 0);
  const totalLastMonth = habitSummaries.reduce((sum, h) => sum + h.lastMonth, 0);
  const totalResistance = habitSummaries.reduce((sum, h) => sum + h.resistanceCount, 0);

  // Calculate growth
  let growthPercent = 0;
  if (totalLastMonth > 0) {
    growthPercent = Math.round(((totalThisMonth - totalLastMonth) / totalLastMonth) * 100);
  } else if (totalThisMonth > 0) {
    growthPercent = 100;
  }

  if (habitSummaries.length === 0) {
    return (
      <Card className="border-sky-200 dark:border-sky-900">
        <CardContent className="py-12 text-center">
          <p className="text-zinc-500 dark:text-zinc-400">
            No habits linked yet. Link habits to see progress toward this aspiration.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-sky-200 dark:border-sky-900">
      <CardHeader>
        <CardTitle className="text-lg">
          Progress Toward: {aspirationTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total Sessions */}
        <div className="text-center">
          <div className="text-5xl font-bold text-sky-600 dark:text-sky-400 mb-2">
            {totalSessions}
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Total sessions across all linked habits
          </p>
        </div>

        {/* Monthly Comparison */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-sky-50 dark:bg-sky-950/20 rounded-lg">
            <div className="text-3xl font-semibold text-sky-700 dark:text-sky-300">
              {totalThisMonth}
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">This Month</p>
          </div>
          <div className="text-center p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
            <div className="text-3xl font-semibold text-zinc-700 dark:text-zinc-300">
              {totalLastMonth}
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">Last Month</p>
          </div>
        </div>

        {/* Growth Indicator */}
        {totalLastMonth > 0 && (
          <div className="text-center">
            {growthPercent > 0 ? (
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                📈 +{growthPercent}% growth this month
              </p>
            ) : growthPercent < 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {growthPercent}% from last month
              </p>
            ) : (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Consistent with last month
              </p>
            )}
          </div>
        )}

        {/* Resistance Count */}
        {totalResistance > 0 && (
          <div className="text-center p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
            <div className="text-3xl font-bold text-amber-700 dark:text-amber-400 mb-1">
              💪 {totalResistance}
            </div>
            <p className="text-sm text-amber-900 dark:text-amber-300 font-medium">
              Resistance Victories
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
              Times you showed up when it was hard
            </p>
          </div>
        )}

        {/* Per-Habit Breakdown */}
        <div>
          <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
            Progress by Habit:
          </h4>
          <div className="space-y-2">
            {habitSummaries.map((habit, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg"
              >
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {habit.title}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {habit.thisMonth} this month • {habit.sessions} total
                  </p>
                </div>
                {habit.resistanceCount > 0 && (
                  <span className="text-xs bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-2 py-1 rounded">
                    💪 {habit.resistanceCount}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Encouragement */}
        <div className="text-center text-sm text-sky-700 dark:text-sky-300 italic">
          Every session moves you closer to your aspiration. Keep going! 🌟
        </div>
      </CardContent>
    </Card>
  );
}
