'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Habit, type HabitState } from '@/lib/aggregates/habit';
import { Aspiration, type AspirationState } from '@/lib/aggregates/aspiration';
import { Activity, type ActivityState } from '@/lib/aggregates/activity';
import { Project, type ProjectState } from '@/lib/aggregates/project';
import { eventStore } from '@/lib/events/store';
import { getResistanceLabel } from '@/lib/resistance-utils';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ArrowRight, TrendingUp, Target, Zap, FolderKanban, CheckCircle2, Trophy } from 'lucide-react';

type Period = 'week' | 'month' | 'year' | 'all';

interface DayData {
  date: string;
  sessions: number;
  resistance: number;
}

interface ResistanceTypeData {
  type: string;
  count: number;
  label: string;
}

interface HabitPerformanceData {
  habit: string;
  sessions: number;
  habitId: string;
}

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#ec4899'];

export default function DashboardPage() {
  const router = useRouter();
  const [habits, setHabits] = useState<HabitState[]>([]);
  const [aspirations, setAspirations] = useState<AspirationState[]>([]);
  const [activities, setActivities] = useState<ActivityState[]>([]);
  const [projects, setProjects] = useState<ProjectState[]>([]);
  const [period, setPeriod] = useState<Period>('month');
  const [loading, setLoading] = useState(true);
  
  // Chart data
  const [activityTrend, setActivityTrend] = useState<DayData[]>([]);
  const [resistanceBreakdown, setResistanceBreakdown] = useState<ResistanceTypeData[]>([]);
  const [habitPerformance, setHabitPerformance] = useState<HabitPerformanceData[]>([]);

  const [stats, setStats] = useState({
    totalSessions: 0,
    totalResistanceVictories: 0,
    activeHabits: 0,
    activeAspirations: 0,
    activeProjects: 0,
    completedProjects: 0,
  });

  useEffect(() => {
    loadData();
  }, [period]);

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

      // Load all projects
      const projectEvents = events.filter((e) => e.aggregateType === 'project');
      const projectIds = [...new Set(projectEvents.map((e) => e.aggregateId))];

      const loadedProjects: ProjectState[] = [];
      for (const projectId of projectIds) {
        const project = new Project(projectId);
        await project.load();
        const state = project.getState();
        if (state && !state.archived) {
          loadedProjects.push(state);
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
        activeProjects: 0, // Will be updated below
        completedProjects: 0, // Will be updated below
      });

      // Build activity trend data
      const trendData = buildActivityTrend(periodActivities, period, periodStart);
      setActivityTrend(trendData);

      // Build resistance breakdown
      const resistanceData = buildResistanceBreakdown(periodActivities);
      setResistanceBreakdown(resistanceData);

      // Build habit performance
      const performanceData = buildHabitPerformance(periodActivities, loadedHabits);
      setHabitPerformance(performanceData);

      setHabits(loadedHabits);
      setAspirations(loadedAspirations);
      setActivities(periodActivities);
      setProjects(loadedProjects);

      // Calculate project completion stats
      const completedProjects = loadedProjects.filter(p => 
        p.phases.length > 0 && p.phases.every(phase => phase.status === 'complete')
      ).length;

      // Update stats to include projects
      setStats(prev => ({
        ...prev,
        activeProjects: loadedProjects.length,
        completedProjects,
      }));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const buildActivityTrend = (activities: ActivityState[], period: Period, periodStart: number): DayData[] => {
    if (activities.length === 0) return [];

    const dayMap = new Map<string, { sessions: number; resistance: number }>();
    
    // Determine grouping interval
    let days = 30;
    if (period === 'week') days = 7;
    else if (period === 'year') days = 52; // weekly for year view
    else if (period === 'all') days = 90; // show last 90 days for all-time

    const now = Date.now();
    const start = period === 'all' ? now - 90 * 24 * 60 * 60 * 1000 : periodStart;

    // Initialize all days/weeks
    for (let i = 0; i < days; i++) {
      const date = new Date(start + i * 24 * 60 * 60 * 1000);
      const key = period === 'year' 
        ? `W${Math.floor(i / 7) + 1}` 
        : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      if (!dayMap.has(key)) {
        dayMap.set(key, { sessions: 0, resistance: 0 });
      }
    }

    // Aggregate activities
    activities.forEach((activity) => {
      const date = new Date(activity.loggedAt);
      let key: string;
      
      if (period === 'year') {
        const weekNum = Math.floor((activity.loggedAt - start) / (7 * 24 * 60 * 60 * 1000));
        key = `W${weekNum + 1}`;
      } else {
        key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }

      const entry = dayMap.get(key) || { sessions: 0, resistance: 0 };
      entry.sessions++;
      if (activity.overcameResistance) {
        entry.resistance++;
      }
      dayMap.set(key, entry);
    });

    return Array.from(dayMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .slice(period === 'year' ? -52 : period === 'all' ? -90 : -days);
  };

  const buildResistanceBreakdown = (activities: ActivityState[]): ResistanceTypeData[] => {
    const typeMap = new Map<string, number>();
    
    activities.forEach((activity) => {
      if (activity.overcameResistance && activity.resistanceType) {
        const count = typeMap.get(activity.resistanceType) || 0;
        typeMap.set(activity.resistanceType, count + 1);
      }
    });

    return Array.from(typeMap.entries())
      .map(([type, count]) => ({
        type,
        count,
        label: getResistanceLabel(type as any),
      }))
      .sort((a, b) => b.count - a.count);
  };

  const buildHabitPerformance = (activities: ActivityState[], habits: HabitState[]): HabitPerformanceData[] => {
    const habitMap = new Map<string, number>();
    
    activities.forEach((activity) => {
      const count = habitMap.get(activity.habitId) || 0;
      habitMap.set(activity.habitId, count + 1);
    });

    return Array.from(habitMap.entries())
      .map(([habitId, sessions]) => {
        const habit = habits.find((h) => h.id === habitId);
        return {
          habit: habit?.title || 'Unknown',
          sessions,
          habitId,
        };
      })
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 10); // Top 10
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-7xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading your progress...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Progress Dashboard</h1>
        <p className="text-muted-foreground">Visualize your journey and celebrate your wins</p>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={period === 'week' ? 'default' : 'outline'}
          onClick={() => setPeriod('week')}
        >
          Week
        </Button>
        <Button
          variant={period === 'month' ? 'default' : 'outline'}
          onClick={() => setPeriod('month')}
        >
          Month
        </Button>
        <Button
          variant={period === 'year' ? 'default' : 'outline'}
          onClick={() => setPeriod('year')}
        >
          Year
        </Button>
        <Button
          variant={period === 'all' ? 'default' : 'outline'}
          onClick={() => setPeriod('all')}
        >
          All Time
        </Button>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Sessions</CardDescription>
            <CardTitle className="text-3xl text-emerald-600">{stats.totalSessions}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Resistance Victories</CardDescription>
            <CardTitle className="text-3xl text-amber-600">{stats.totalResistanceVictories}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Habits</CardDescription>
            <CardTitle className="text-3xl text-emerald-600">{stats.activeHabits}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Aspirations</CardDescription>
            <CardTitle className="text-3xl text-sky-600">{stats.activeAspirations}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Activity Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Activity Over Time
          </CardTitle>
          <CardDescription>
            {period === 'week' && 'Daily activity for the past 7 days'}
            {period === 'month' && 'Daily activity for the past 30 days'}
            {period === 'year' && 'Weekly activity for the past year'}
            {period === 'all' && 'Daily activity for the past 90 days'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activityTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sessions" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Sessions"
                />
                <Line 
                  type="monotone" 
                  dataKey="resistance" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  name="Resistance Victories"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              No activity data for this period
            </div>
          )}
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resistance Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Resistance Types Overcome
            </CardTitle>
            <CardDescription>What you pushed through most</CardDescription>
          </CardHeader>
          <CardContent>
            {resistanceBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={resistanceBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.label} ${(entry.percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {resistanceBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                No resistance data yet. Start logging!
              </div>
            )}
          </CardContent>
        </Card>

        {/* Habit Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Top Performing Habits
            </CardTitle>
            <CardDescription>Your most practiced habits</CardDescription>
          </CardHeader>
          <CardContent>
            {habitPerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={habitPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="habit" type="category" width={120} />
                  <Tooltip />
                  <Bar 
                    dataKey="sessions" 
                    fill="#10b981" 
                    onClick={(data) => router.push(`/habits`)}
                    style={{ cursor: 'pointer' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                No habit data yet. Create your first habit!
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Aspirations Overview */}
      {aspirations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Aspirations</CardTitle>
            <CardDescription>Long-term goals and their progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aspirations.map((aspiration) => {
                const linkedHabits = habits.filter((h) => h.linkedAspirationId === aspiration.id);
                const aspirationActivities = activities.filter((a) => 
                  linkedHabits.some((h) => h.id === a.habitId)
                );

                return (
                  <div
                    key={aspiration.id}
                    className="border rounded-lg p-4 hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => router.push(`/aspirations/${aspiration.id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{aspiration.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{aspiration.description}</p>
                        
                        <div className="flex items-center gap-4 mt-3 text-sm">
                          <span className="text-emerald-600 font-medium">
                            {aspirationActivities.length} sessions
                          </span>
                          <span className="text-muted-foreground">
                            {linkedHabits.length} {linkedHabits.length === 1 ? 'habit' : 'habits'}
                          </span>
                        </div>
                      </div>
                      
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projects Overview */}
      {projects.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FolderKanban className="h-5 w-5 text-blue-500" />
                  Your Projects
                </CardTitle>
                <CardDescription>Track progress on meaningful projects</CardDescription>
              </div>
              {stats.completedProjects > 0 && (
                <div className="flex items-center gap-2 bg-green-100 dark:bg-green-950 px-3 py-1 rounded-full">
                  <Trophy className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">
                    {stats.completedProjects} Completed!
                  </span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((project) => {
                const totalPhases = project.phases.length;
                const completedPhases = project.phases.filter(p => p.status === 'complete').length;
                const inProgressPhases = project.phases.filter(p => p.status === 'in-progress').length;
                
                // Weighted average progress (each phase contributes equally)
                const phaseProgressSum = project.phases.reduce((sum, p) => sum + (p.progress || 0), 0);
                const avgProgress = totalPhases > 0 ? phaseProgressSum / totalPhases : 0;
                
                // Total time spent
                const totalMinutes = project.phases.reduce((sum, p) => sum + (p.timeSpentMinutes || 0), 0);
                const totalHours = Math.floor(totalMinutes / 60);
                const remainingMins = totalMinutes % 60;
                
                // Get first and last photos
                const allPhotos = project.phases.flatMap(p => p.photos).sort((a, b) => a.addedAt - b.addedAt);
                const firstPhoto = allPhotos[0];
                const lastPhoto = allPhotos.length > 1 ? allPhotos[allPhotos.length - 1] : null;
                
                const isComplete = totalPhases > 0 && completedPhases === totalPhases;

                return (
                  <div
                    key={project.id}
                    className="border rounded-lg p-4 hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => router.push(`/projects/${project.id}`)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Photos */}
                      {(firstPhoto || lastPhoto) && (
                        <div className="flex gap-2 shrink-0">
                          {firstPhoto && (
                            <div className="relative">
                              <img
                                src={firstPhoto.data}
                                alt="First photo"
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-0.5 rounded-b-lg">
                                Before
                              </div>
                            </div>
                          )}
                          {lastPhoto && (
                            <div className="relative">
                              <img
                                src={lastPhoto.data}
                                alt="Latest photo"
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-0.5 rounded-b-lg">
                                After
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg truncate">{project.title}</h3>
                          {isComplete && (
                            <div className="flex items-center gap-1 bg-green-100 dark:bg-green-950 px-2 py-0.5 rounded-full shrink-0">
                              <CheckCircle2 className="h-3 w-3 text-green-600 dark:text-green-400" />
                              <span className="text-xs font-medium text-green-700 dark:text-green-300">
                                Complete
                              </span>
                            </div>
                          )}
                        </div>
                        {project.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{project.description}</p>
                        )}
                        
                        {/* Progress Bar */}
                        {totalPhases > 0 && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground">
                                {completedPhases}/{totalPhases} phases
                              </span>
                              <span className="font-medium">{Math.round(avgProgress)}% complete</span>
                            </div>
                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all ${
                                  isComplete ? 'bg-green-500' : 'bg-blue-500'
                                }`}
                                style={{ width: `${avgProgress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-4 mt-3 text-sm">
                          {totalMinutes > 0 && (
                            <span className="text-blue-600 dark:text-blue-400 font-medium">
                              {totalHours > 0 ? `${totalHours}h${remainingMins > 0 ? ` ${remainingMins}m` : ''}` : `${remainingMins}m`} invested
                            </span>
                          )}
                          {inProgressPhases > 0 && (
                            <span className="text-amber-600 font-medium">
                              {inProgressPhases} in progress
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="flex gap-3 flex-wrap">
        <Button onClick={() => router.push('/today')}>
          Log Activity Today
        </Button>
        <Button variant="outline" onClick={() => router.push('/habits')}>
          Manage Habits
        </Button>
        <Button variant="outline" onClick={() => router.push('/aspirations')}>
          Manage Aspirations
        </Button>
      </div>
    </div>
  );
}

