import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Calendar, Target, FolderKanban, BarChart3, Camera } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50 dark:from-zinc-900 dark:to-zinc-800">
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            Way Finder
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-2">
            Find your way to what matters
          </p>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-8">
            Track habits, projects, and aspirations without guilt.
            <br />
            Celebrate volume. Overcome Resistance. See real progress.
          </p>

          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/today">
                <Calendar className="h-5 w-5 mr-2" />
                Start Today
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="max-w-5xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6 text-center">
            What would you like to do?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Today's Activities */}
            <Link href="/today">
              <Card className="h-full border-emerald-200 dark:border-emerald-900 hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-emerald-600" />
                      Log Today
                    </span>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </CardTitle>
                  <CardDescription>
                    Track your habits and activities
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
                  Log workouts, meditation, walks, and more. Multiple sessions per day.
                  Track metrics and celebrate overcoming resistance.
                </CardContent>
              </Card>
            </Link>

            {/* Habits Management */}
            <Link href="/habits">
              <Card className="h-full border-sky-200 dark:border-sky-900 hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      🌱 Manage Habits
                    </span>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </CardTitle>
                  <CardDescription>
                    Create and organize your habits
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
                  Set up habits with metrics (count, duration, distance). Use AI to help
                  configure them. See your progress at a glance.
                </CardContent>
              </Card>
            </Link>

            {/* Aspirations */}
            <Link href="/aspirations">
              <Card className="h-full border-violet-200 dark:border-violet-900 hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-violet-600" />
                      Aspirations
                    </span>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </CardTitle>
                  <CardDescription>
                    Connect habits to what matters
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
                  Link daily habits to long-term goals. See how your actions build toward
                  meaningful pursuits.
                </CardContent>
              </Card>
            </Link>

            {/* Projects */}
            <Link href="/projects">
              <Card className="h-full border-blue-200 dark:border-blue-900 hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <FolderKanban className="h-5 w-5 text-blue-600" />
                      Projects
                    </span>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </CardTitle>
                  <CardDescription>
                    Track meaningful projects
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
                  Break projects into phases. Add photos to track progress. Log time invested.
                  Celebrate completion.
                </CardContent>
              </Card>
            </Link>

            {/* Progress Dashboard */}
            <Link href="/dashboard">
              <Card className="h-full border-pink-200 dark:border-pink-900 hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-pink-600" />
                      Progress
                    </span>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </CardTitle>
                  <CardDescription>
                    Visualize your journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
                  See charts, trends, and milestones. Track activity over time. Celebrate
                  what you've accomplished.
                </CardContent>
              </Card>
            </Link>

            {/* Moments */}
            <Link href="/moments">
              <Card className="h-full border-amber-200 dark:border-amber-900 hover:shadow-lg transition-shadow cursor-pointer group">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Camera className="h-5 w-5 text-amber-600" />
                      Moments
                    </span>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </CardTitle>
                  <CardDescription>
                    Capture spontaneous memories
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
                  Life isn't all structure. Capture photos and thoughts as they happen.
                  Keep your journey real.
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Philosophy Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6 text-center">
            A Different Approach
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-emerald-200 dark:border-emerald-900">
              <CardHeader>
                <CardTitle className="text-lg">🌿 No Guilt Design</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
                "18 walks this month" (not "missed 12 days"). No broken streaks. No shame.
                Just continuing. Celebrate what you did.
              </CardContent>
            </Card>

            <Card className="border-amber-200 dark:border-amber-900">
              <CardHeader>
                <CardTitle className="text-lg">💪 Resistance Tracking</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
                Mark when you overcame resistance. Track victories over perfectionism,
                self-doubt, procrastination. Every session counts.
              </CardContent>
            </Card>

            <Card className="border-violet-200 dark:border-violet-900">
              <CardHeader>
                <CardTitle className="text-lg">🤖 AI Assistance</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
                "Walk 30 min daily" → Configured habit with duration metric. AI helps
                refine habits and suggest phases for projects.
              </CardContent>
            </Card>

            <Card className="border-pink-200 dark:border-pink-900">
              <CardHeader>
                <CardTitle className="text-lg">📊 Milestones, Not Streaks</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
                Badge system: 10→50→100→500→1000 sessions. Focus on volume and growth,
                not perfection. Real progress, real celebration.
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            Ready to find your way?
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-2">
            Start tracking what matters. No streaks. No guilt. Just progress.
          </p>
          <p className="text-sm text-amber-600 dark:text-amber-400 mb-8 italic">
            ⚡ Web prototype — Full experience coming to mobile (Flutter)
          </p>

          <Button size="lg" asChild className="mb-8">
            <Link href="/today">
              <Calendar className="h-5 w-5 mr-2" />
              Start Your Journey
            </Link>
          </Button>

          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            Built with ❤️ using{" "}
            <a
              href="https://github.com/features/copilot"
              target="_blank"
              rel="noopener"
              className="underline hover:text-zinc-700 dark:hover:text-zinc-300"
            >
              GitHub Copilot CLI
            </a>
            {" • "}
            <a href="/about" className="underline hover:text-zinc-700 dark:hover:text-zinc-300">
              Learn more about Way Finder
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
