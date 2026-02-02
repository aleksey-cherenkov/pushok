'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ActivityLog {
  loggedAt: number;
  value?: number;
  overcameResistance?: boolean;
}

interface HabitProgressProps {
  habitTitle: string;
  activities: ActivityLog[];
  metric?: 'checkmark' | 'count' | 'duration' | 'distance';
  unit?: string;
}

const MILESTONES = [10, 50, 100, 500, 1000];

export function HabitProgress({ habitTitle, activities, metric = 'checkmark', unit }: HabitProgressProps) {
  // Calculate stats
  const totalSessions = activities.length;
  const resistanceCount = activities.filter(a => a.overcameResistance).length;

  // Calculate this month vs last month
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();

  const thisMonthActivities = activities.filter(a => a.loggedAt >= thisMonthStart);
  const lastMonthActivities = activities.filter(
    a => a.loggedAt >= lastMonthStart && a.loggedAt < thisMonthStart
  );

  const thisMonthCount = thisMonthActivities.length;
  const lastMonthCount = lastMonthActivities.length;

  // Calculate growth percentage
  let growthPercent = 0;
  if (lastMonthCount > 0) {
    growthPercent = Math.round(((thisMonthCount - lastMonthCount) / lastMonthCount) * 100);
  } else if (thisMonthCount > 0) {
    growthPercent = 100;
  }

  // Calculate total value for count/duration/distance metrics
  let totalValue = 0;
  if (metric !== 'checkmark') {
    totalValue = activities.reduce((sum, a) => sum + (a.value || 0), 0);
  }

  // Find current and next milestone
  const currentMilestone = MILESTONES.filter(m => totalSessions >= m).pop() || 0;
  const nextMilestone = MILESTONES.find(m => m > totalSessions) || MILESTONES[MILESTONES.length - 1];
  const progressToNext = nextMilestone > 0 ? (totalSessions / nextMilestone) * 100 : 100;

  return (
    <Card className="border-emerald-200 dark:border-emerald-900">
      <CardHeader>
        <CardTitle className="text-lg">Progress: {habitTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total Sessions & Milestone */}
        <div className="text-center">
          <div className="text-5xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
            {totalSessions}
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {totalSessions === 1 ? 'session completed' : 'sessions completed'}
          </p>
          {currentMilestone > 0 && (
            <div className="mt-2">
              <span className="inline-block bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-sm font-medium">
                🎉 {currentMilestone} Session Milestone Reached!
              </span>
            </div>
          )}
        </div>

        {/* Progress to Next Milestone */}
        {totalSessions < MILESTONES[MILESTONES.length - 1] && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-zinc-600 dark:text-zinc-400">Next Milestone: {nextMilestone}</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                {totalSessions}/{nextMilestone}
              </span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
              <div
                className="bg-emerald-600 dark:bg-emerald-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(progressToNext, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Total Value (for non-checkmark metrics) */}
        {metric !== 'checkmark' && totalValue > 0 && (
          <div className="text-center p-4 bg-sky-50 dark:bg-sky-950/20 rounded-lg">
            <div className="text-3xl font-bold text-sky-600 dark:text-sky-400">
              {totalValue.toLocaleString()} {unit || ''}
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Total {metric === 'duration' ? 'time' : metric === 'distance' ? 'distance' : 'count'}
            </p>
          </div>
        )}

        {/* Monthly Comparison */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
            <div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              {thisMonthCount}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">This Month</p>
          </div>
          <div className="text-center p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
            <div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
              {lastMonthCount}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Last Month</p>
          </div>
        </div>

        {/* Growth Indicator */}
        {lastMonthCount > 0 && (
          <div className="text-center">
            {growthPercent > 0 ? (
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                📈 +{growthPercent}% from last month
              </p>
            ) : growthPercent < 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {growthPercent}% from last month
              </p>
            ) : (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Same as last month
              </p>
            )}
          </div>
        )}

        {/* Resistance Victories */}
        {resistanceCount > 0 && (
          <div className="text-center p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900">
            <div className="text-3xl font-bold text-amber-700 dark:text-amber-400 mb-1">
              💪 {resistanceCount}
            </div>
            <p className="text-sm text-amber-900 dark:text-amber-300 font-medium">
              {resistanceCount === 1 ? 'Resistance Victory' : 'Resistance Victories'}
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
              You showed up when it was hard. That's growth.
            </p>
          </div>
        )}

        {/* Encouragement */}
        {totalSessions === 0 && (
          <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            Start logging activities to see your progress! 🌱
          </div>
        )}
      </CardContent>
    </Card>
  );
}
