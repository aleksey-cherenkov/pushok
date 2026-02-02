'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, Plus, Calendar, Smile, Meh, Frown } from 'lucide-react';
import { WeeklyReflection, type WeeklyReflectionState } from '@/lib/aggregates/weekly-reflection';
import { eventStore } from '@/lib/events/store';
import { v4 as uuidv4 } from 'uuid';
import { format, startOfWeek, endOfWeek, subWeeks } from 'date-fns';

export default function ReflectionsPage() {
  const [reflections, setReflections] = useState<WeeklyReflectionState[]>([]);
  const [loading, setLoading] = useState(true);
  const [showingForm, setShowingForm] = useState(false);

  // Form state
  const [habitReview, setHabitReview] = useState('');
  const [projectProgress, setProjectProgress] = useState('');
  const [personalReflections, setPersonalReflections] = useState('');
  const [mood, setMood] = useState<number>(3);

  useEffect(() => {
    loadReflections();
  }, []);

  const loadReflections = async () => {
    setLoading(true);
    try {
      const events = await eventStore.getAllEvents();
      const reflectionEvents = events.filter((e) => e.aggregateType === 'weekly-reflection');
      
      // Get unique reflection IDs
      const reflectionIds = Array.from(new Set(reflectionEvents.map((e) => e.aggregateId)));
      
      // Load each reflection
      const loadedReflections = await Promise.all(
        reflectionIds.map(async (id) => {
          const reflection = new WeeklyReflection(id);
          return await reflection.load();
        })
      );

      // Sort by week start (newest first)
      loadedReflections.sort((a, b) => b.weekStart - a.weekStart);
      setReflections(loadedReflections);
    } catch (error) {
      console.error('Error loading reflections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReflection = async () => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 }); // Sunday

    const reflectionId = uuidv4();
    const reflection = new WeeklyReflection(reflectionId);
    
    await reflection.create({
      weekStart: weekStart.getTime(),
      weekEnd: weekEnd.getTime(),
      habitReview,
      projectProgress,
      personalReflections,
      mood,
    });

    // Reset form
    setHabitReview('');
    setProjectProgress('');
    setPersonalReflections('');
    setMood(3);
    setShowingForm(false);

    await loadReflections();
  };

  const getMoodIcon = (moodValue: number) => {
    if (moodValue >= 4) return <Smile className="h-5 w-5 text-green-500" />;
    if (moodValue === 3) return <Meh className="h-5 w-5 text-yellow-500" />;
    return <Frown className="h-5 w-5 text-red-500" />;
  };

  const getMoodLabel = (moodValue: number) => {
    const labels = ['Very Tough', 'Tough', 'Okay', 'Good', 'Great'];
    return labels[moodValue - 1] || 'Okay';
  };

  if (loading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading reflections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Weekly Reflections</h1>
          <p className="text-muted-foreground">
            Review your habits, projects, and personal growth each week
          </p>
        </div>
        {!showingForm && (
          <Button onClick={() => setShowingForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Reflection
          </Button>
        )}
      </div>

      {/* Reflection Form */}
      {showingForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>This Week's Reflection</CardTitle>
            <CardDescription>
              {format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'MMM d')} -{' '}
              {format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'MMM d, yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Habit Review */}
            <div>
              <Label className="text-base font-semibold mb-2 block">
                🌱 Habit Review
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                Which habits thrived this week? Which ones struggled? Any patterns you notice?
              </p>
              <Textarea
                value={habitReview}
                onChange={(e) => setHabitReview(e.target.value)}
                placeholder="e.g., Pushups were consistent (5x this week). Walking struggled because of rain..."
                rows={4}
              />
            </div>

            {/* Project Progress */}
            <div>
              <Label className="text-base font-semibold mb-2 block">
                📁 Project Progress
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                What progress did you make on your projects? Any breakthroughs or blockers?
              </p>
              <Textarea
                value={projectProgress}
                onChange={(e) => setProjectProgress(e.target.value)}
                placeholder="e.g., Bathroom demo completed! Plumbing inspection scheduled for next week..."
                rows={4}
              />
            </div>

            {/* Personal Reflections */}
            <div>
              <Label className="text-base font-semibold mb-2 block">
                💭 Personal Reflections
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                What did you learn this week? What are you grateful for? What's on your mind?
              </p>
              <Textarea
                value={personalReflections}
                onChange={(e) => setPersonalReflections(e.target.value)}
                placeholder="e.g., Feeling good about consistency. Stela would be proud of the morning walks..."
                rows={4}
              />
            </div>

            {/* Mood */}
            <div>
              <Label className="text-base font-semibold mb-2 block">
                😊 Overall Mood
              </Label>
              <div className="flex items-center gap-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => setMood(value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      mood === value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    {getMoodLabel(value)}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button onClick={handleCreateReflection}>
                Save Reflection
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowingForm(false);
                  setHabitReview('');
                  setProjectProgress('');
                  setPersonalReflections('');
                  setMood(3);
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Past Reflections */}
      {reflections.length === 0 && !showingForm ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No reflections yet</h3>
            <p className="text-muted-foreground mb-4">
              Start your first weekly reflection to track growth over time
            </p>
            <Button onClick={() => setShowingForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Reflection
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Past Reflections</h2>
          {reflections.map((reflection) => (
            <Card key={reflection.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-500" />
                      Week of {format(reflection.weekStart, 'MMM d, yyyy')}
                    </CardTitle>
                    <CardDescription>
                      {format(reflection.weekStart, 'MMM d')} -{' '}
                      {format(reflection.weekEnd, 'MMM d, yyyy')}
                    </CardDescription>
                  </div>
                  {reflection.mood && (
                    <div className="flex items-center gap-2">
                      {getMoodIcon(reflection.mood)}
                      <span className="text-sm font-medium">
                        {getMoodLabel(reflection.mood)}
                      </span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {reflection.habitReview && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1 text-muted-foreground">
                      🌱 Habit Review
                    </h4>
                    <p className="text-sm whitespace-pre-wrap">{reflection.habitReview}</p>
                  </div>
                )}

                {reflection.projectProgress && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1 text-muted-foreground">
                      📁 Project Progress
                    </h4>
                    <p className="text-sm whitespace-pre-wrap">{reflection.projectProgress}</p>
                  </div>
                )}

                {reflection.personalReflections && (
                  <div>
                    <h4 className="text-sm font-semibold mb-1 text-muted-foreground">
                      💭 Personal Reflections
                    </h4>
                    <p className="text-sm whitespace-pre-wrap">{reflection.personalReflections}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
