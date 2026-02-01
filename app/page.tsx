import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
          <p className="text-sm text-zinc-500 dark:text-zinc-500 italic mb-8">
            In memory of Stela (Pushok) 🐱
          </p>

          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <a href="/today">Today's Focus</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/habits">Manage Habits</a>
            </Button>
          </div>
        </div>

        {/* Purpose Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
          <Card className="border-emerald-200 dark:border-emerald-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🌿 Gentle, Not Stressful
              </CardTitle>
              <CardDescription>
                No streaks, no pressure, no guilt
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
              Focus on milestones and meaningful moments. Like Stela taught us—
              life's best moments are simple: sunshine, birds, squirrels, and
              presence.
            </CardContent>
          </Card>

          <Card className="border-sky-200 dark:border-sky-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📓 Journal, Not Task Manager
              </CardTitle>
              <CardDescription>
                Reflect on your journey, not productivity
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
              Weekly, monthly, and yearly reflection. Capture photos and
              memories of what truly matters in your life.
            </CardContent>
          </Card>

          <Card className="border-violet-200 dark:border-violet-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎯 AI-Powered Goals
              </CardTitle>
              <CardDescription>
                Turn rough ideas into meaningful goals
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
              Struggle to articulate what you want? AI helps refine your goals
              while you keep full control. Powered by Azure OpenAI (GPT-5-nano).
            </CardContent>
          </Card>

          <Card className="border-amber-200 dark:border-amber-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📸 Photo Memories
              </CardTitle>
              <CardDescription>Connect moments to your journey</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
              Before/during/after photos for projects. Family moments, nature,
              pets—capture what makes life meaningful.
            </CardContent>
          </Card>
        </div>

        {/* Stela's Memory Section */}
        <Card className="max-w-2xl mx-auto mb-16 border-2 border-pink-200 dark:border-pink-900 bg-pink-50/30 dark:bg-pink-950/10">
          <CardHeader>
            <CardTitle className="text-center">In Memory of Stela 💙</CardTitle>
            <CardDescription className="text-center">
              9 years and 9 months of joy
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-zinc-700 dark:text-zinc-300">
            <p className="mb-3">
              Stela loved the simple things—watching birds and squirrels from the window,
              the warmth of the fireplace, the magic of Christmas trees, and the joy
              of playing with wrapping paper.
            </p>
            <p className="text-sm italic">
              This app honors her memory by helping us focus on what truly matters:
              presence, nature, and the simple moments that make life beautiful.
            </p>
          </CardContent>
        </Card>

        {/* Status Section */}
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Project Status
          </h2>
          <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-zinc-600 dark:text-zinc-400">
                Phase 1: Foundation
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                ✅ Complete
              </span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-zinc-600 dark:text-zinc-400">
                Phase 2: Event Store
              </span>
              <span className="text-sky-600 dark:text-sky-400 font-semibold">
                🔄 Next
              </span>
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-500 mt-4">
              Overall Progress: ~20%
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Button variant="default" size="lg" asChild>
              <a
                href="https://github.com/aleksey-cherenkov/pushok"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
              </a>
            </Button>
            <Button variant="outline" size="lg" disabled>
              Coming Soon
            </Button>
          </div>

          <p className="mt-8 text-sm text-zinc-500 dark:text-zinc-500">
            Built with ❤️ using GitHub Copilot CLI • Deployed on Azure Static
            Web Apps
          </p>
        </div>
      </main>
    </div>
  );
}
