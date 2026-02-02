'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Habit, type HabitState } from '@/lib/aggregates/habit';
import { Activity, type ActivityState } from '@/lib/aggregates/activity';
import { eventStore } from '@/lib/events/store';
import { getResistanceLabel } from '@/lib/resistance-utils';
import { ActivityLogModal } from '@/components/habits/activity-log-modal';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Award, Calendar } from 'lucide-react';

type Period = 'week' | 'month' | 'year' | 'all';

interface ActivityData {
  date: string;
  value: number;
  timestamp: number;
}

export default function HabitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const habitId = params.id as string;

  const [habit, setHabit] = useState<HabitState | null>(null);
  const [activities, setActivities] = useState<ActivityState[]>([]);
  const [chartData, setChartData] = useState<ActivityData[]>([]);
  const [period, setPeriod] = useState<Period>('month');
  const [loading, setLoading] = useState(true);
  const [showLogModal, setShowLogModal] = useState(false);

  const [stats, setStats] = useState({
    average: 0,
    personalBest: 0,
    trend: 'stable' as 'up' | 'down' | 'stable',
    totalSessions: 0,
  });

  useEffect(() => {
    loadData();
  }, [habitId, period]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load habit
      const habitAggregate = new Habit(habitId);
      await habitAggregate.load();
      const habitState = habitAggregate.getState();

      if (!habitState) {
        router.push('/habits');
        return;
      }

      setHabit(habitState);

      // Load all activities for this habit
      const events = await eventStore.getAllEvents();
      const activityEvents = events.filter(
        (e) => e.aggregateType === 'Activity'
      );
      const activityIds = [...new Set(activityEvents.map((e) => e.aggregateId))];

      const loadedActivities: ActivityState[] = [];
      for (const activityId of activityIds) {
        const activity = new Activity(activityId);
        await activity.load();
        const state = activity.getState();
        if (state && state.habitId === habitId) {
          loadedActivities.push(state);
        }
      }

      // Sort by date (oldest first for chart)
      loadedActivities.sort((a, b) => a.loggedAt - b.loggedAt);

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

      setActivities(periodActivities.reverse()); // Newest first for table

      // Build chart data
      const data = buildChartData(periodActivities);
      setChartData(data);

      // Calculate stats
      calculateStats(periodActivities);
    } catch (error) {
      console.error('Error loading habit detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildChartData = (activities: ActivityState[]): ActivityData[] => {
    if (activities.length === 0) return [];

    // Sort oldest first for chart progression
    const sorted = [...activities].sort((a, b) => a.loggedAt - b.loggedAt);

    return sorted.map((activity) => ({
      date: new Date(activity.loggedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      value: activity.value || 0,
      timestamp: activity.loggedAt,
    }));
  };

  const calculateStats = (activities: ActivityState[]) => {
    if (activities.length === 0) {
      setStats({ average: 0, personalBest: 0, trend: 'stable', totalSessions: activities.length });
      return;
    }

    const values = activities.map((a) => a.value || 0);
    const average = values.reduce((sum, v) => sum + v, 0) / values.length;
    const personalBest = Math.max(...values);

    // Calculate trend (compare first half vs second half)
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (activities.length >= 4) {
      const midpoint = Math.floor(activities.length / 2);
      const firstHalf = values.slice(0, midpoint);
      const secondHalf = values.slice(midpoint);
      
      const firstAvg = firstHalf.reduce((sum, v) => sum + v, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, v) => sum + v, 0) / secondHalf.length;
      
      const change = ((secondAvg - firstAvg) / firstAvg) * 100;
      
      if (change > 10) trend = 'up';
      else if (change < -10) trend = 'down';
    }

    setStats({ average, personalBest, trend, totalSessions: activities.length });
  };

  const handleActivityLogged = async () => {
    setShowLogModal(false);
    await loadData(); // Reload to show new activity
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-7xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading habit details...</div>
        </div>
      </div>
    );
  }

  if (!habit) {
    return null;
  }

  const getTrendIcon = () => {
    if (stats.trend === 'up') return <TrendingUp className="h-5 w-5 text-emerald-600" />;
    if (stats.trend === 'down') return <TrendingDown className="h-5 w-5 text-red-600" />;
    return <Minus className="h-5 w-5 text-muted-foreground" />;
  };

  const getMetricLabel = () => {
    if (habit.metric === 'count') return 'Reps';
    if (habit.metric === 'duration') return habit.unit || 'Minutes';
    if (habit.metric === 'distance') return habit.unit || 'Miles';
    return habit.unit || 'Value';
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/habits')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{habit.title}</h1>
            <p className="text-muted-foreground mt-1">{habit.description}</p>
          </div>
        </div>
        <Button onClick={() => setShowLogModal(true)}>
          Log Activity
        </Button>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 flex-wrap">
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Sessions</CardDescription>
            <CardTitle className="text-3xl text-emerald-600">{stats.totalSessions}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Average {getMetricLabel()}</CardDescription>
            <CardTitle className="text-3xl text-sky-600">
              {stats.average > 0 ? stats.average.toFixed(1) : '—'}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Personal Best</CardDescription>
            <CardTitle className="text-3xl text-amber-600 flex items-center gap-2">
              {stats.personalBest > 0 ? stats.personalBest : '—'}
              {stats.personalBest > 0 && <Award className="h-6 w-6" />}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Trend</CardDescription>
            <CardTitle className="text-3xl flex items-center gap-2">
              {getTrendIcon()}
              <span className="text-lg capitalize">{stats.trend}</span>
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Progress Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Progress Over Time
          </CardTitle>
          <CardDescription>
            {habit.metric === 'count' && `Number of ${habit.unit || 'reps'} per session`}
            {habit.metric === 'duration' && `${habit.unit || 'Minutes'} per session`}
            {habit.metric === 'distance' && `${habit.unit || 'Miles'} per session`}
            {habit.metric === 'checkmark' && 'Completion tracking'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  strokeWidth={3}
                  name={getMetricLabel()}
                  dot={{ fill: '#10b981', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              No activity data for this period. Start logging to see your progress!
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Log Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity History</CardTitle>
          <CardDescription>All logged sessions for this habit</CardDescription>
        </CardHeader>
        <CardContent>
          {activities.length > 0 ? (
            <div className="space-y-2">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="border rounded-lg p-4 hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-emerald-600">
                          {activity.value || '✓'}
                        </span>
                        {habit.metric !== 'checkmark' && (
                          <span className="text-sm text-muted-foreground">{getMetricLabel()}</span>
                        )}
                        <span className="text-sm text-muted-foreground">
                          {new Date(activity.loggedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      {activity.notes && (
                        <p className="text-sm text-muted-foreground mt-2">{activity.notes}</p>
                      )}

                      <div className="flex items-center gap-3 mt-2 text-sm">
                        {activity.mood && (
                          <span className="text-muted-foreground">Mood: {activity.mood}</span>
                        )}
                        {activity.overcameResistance && (
                          <span className="text-amber-600 font-medium">
                            💪 {getResistanceLabel(activity.resistanceType)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              No activity logged yet. Click "Log Activity" to get started!
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Log Modal */}
      {showLogModal && habit && (
        <ActivityLogModal
          habit={habit}
          onLog={handleActivityLogged}
          onCancel={() => setShowLogModal(false)}
        />
      )}
    </div>
  );
}
