"use client";

import { AspirationProgress } from "@/components/progress/aspiration-progress";
import { HabitProgress } from "@/components/progress/habit-progress";
import { Button } from "@/components/ui/button";
import { Aspiration, type AspirationState } from "@/lib/aggregates/aspiration";
import { Habit, type HabitState } from "@/lib/aggregates/habit";
import { eventStore } from "@/lib/events/store";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ActivityLog {
  loggedAt: number;
  value?: number;
  overcameResistance?: boolean;
}

export default function AspirationDetailPage() {
  const router = useRouter();
  const { id } = useParams() as { id?: string };
  const [aspiration, setAspiration] = useState<AspirationState | null>(null);
  const [linkedHabits, setLinkedHabits] = useState<HabitState[]>([]);
  const [habitActivities, setHabitActivities] = useState<
    Record<string, ActivityLog[]>
  >({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (!id) {
        setLoading(false);
        router.push("/aspirations");
        return;
      }

      const events = await eventStore.getAllEvents();

      // Load aspiration
      const asp = new Aspiration(id);
      await asp.load();
      const aspirationState = asp.getState();
      if (!aspirationState) {
        router.push("/aspirations");
        return;
      }
      setAspiration(aspirationState);

      // Load linked habits
      const habitEvents = events.filter((e) => e.aggregateType === "Habit");
      const habitIds = [...new Set(habitEvents.map((e) => e.aggregateId))];

      const linked: HabitState[] = [];
      for (const habitId of habitIds) {
        const habit = new Habit(habitId);
        await habit.load();
        const state = habit.getState();
        if (state && state.linkedAspirationId === id) {
          linked.push(state);
        }
      }
      setLinkedHabits(linked);

      // Load activities for each habit
      const activityEvents = events.filter((e) => e.type === "ActivityLogged");
      const activitiesByHabit: Record<string, ActivityLog[]> = {};

      linked.forEach((habit) => {
        const habitActivities = activityEvents
          .filter((e) => {
            const data = e.data as any;
            return data.habitId === habit.id;
          })
          .map((e) => {
            const data = e.data as any;
            return {
              loggedAt: e.timestamp,
              value: data.value as number | undefined,
              overcameResistance: data.overcameResistance as
                | boolean
                | undefined,
            };
          });
        activitiesByHabit[habit.id] = habitActivities;
      });

      setHabitActivities(activitiesByHabit);
    } catch (error) {
      console.error("Failed to load aspiration details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-emerald-50 dark:from-zinc-900 dark:to-zinc-950 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-zinc-500 dark:text-zinc-400">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!aspiration) {
    return null;
  }

  // Compute habit summaries for aspiration progress
  const habitSummaries = linkedHabits.map((habit) => {
    const activities = habitActivities[habit.id] || [];
    const now = new Date();
    const thisMonthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
    ).getTime();
    const lastMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
    ).getTime();

    const thisMonth = activities.filter(
      (a) => a.loggedAt >= thisMonthStart,
    ).length;
    const lastMonth = activities.filter(
      (a) => a.loggedAt >= lastMonthStart && a.loggedAt < thisMonthStart,
    ).length;
    const resistanceCount = activities.filter(
      (a) => a.overcameResistance,
    ).length;

    return {
      title: habit.title,
      sessions: activities.length,
      thisMonth,
      lastMonth,
      resistanceCount,
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-emerald-50 dark:from-zinc-900 dark:to-zinc-950 px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => router.push("/aspirations")}
              className="mb-4"
            >
              ← Back to Aspirations
            </Button>
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
              {aspiration.title}
            </h1>
            {aspiration.description && (
              <p className="text-lg text-zinc-600 dark:text-zinc-400 mt-2">
                {aspiration.description}
              </p>
            )}
            {aspiration.category && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                {aspiration.category}
              </p>
            )}
          </div>
        </div>

        {/* Aspiration-Level Progress */}
        <AspirationProgress
          aspirationTitle={aspiration.title}
          habitSummaries={habitSummaries}
        />

        {/* Per-Habit Progress */}
        {linkedHabits.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
              Progress by Habit
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {linkedHabits.map((habit) => (
                <HabitProgress
                  key={habit.id}
                  habitTitle={habit.title}
                  activities={habitActivities[habit.id] || []}
                  metric={habit.metric}
                  unit={habit.unit}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
