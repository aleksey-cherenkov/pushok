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
          <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-8">
            Build meaningful habits without streaks, guilt, or pressure.
            <br />
            Track progress. Celebrate volume. Overcome Resistance.
          </p>

          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <a href="/today">Get Started</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/about">Learn More</a>
            </Button>
          </div>
        </div>

        {/* Core Features */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          <Card className="border-emerald-200 dark:border-emerald-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🌱 Habits & Activities
              </CardTitle>
              <CardDescription>
                Track what you want to nurture
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
              Multiple logs per day. Four metric types (checkmark, count, duration, distance). 
              "3 sessions • 75 pushups" — see real progress.
            </CardContent>
          </Card>

          <Card className="border-sky-200 dark:border-sky-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎯 Aspirations
              </CardTitle>
              <CardDescription>
                Connect daily actions to what matters
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
              Link habits to long-term meaningful pursuits. See how "50 pushups" 
              contributes to "Get stronger for hiking."
            </CardContent>
          </Card>

          <Card className="border-amber-200 dark:border-amber-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                💪 Resistance Tracking
              </CardTitle>
              <CardDescription>
                Celebrate overcoming
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
              "Logged even when I didn't feel like it" checkbox. Track victories 
              over perfectionism, self-doubt, procrastination.
            </CardContent>
          </Card>

          <Card className="border-violet-200 dark:border-violet-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🤖 AI Assistance
              </CardTitle>
              <CardDescription>
                Turn ideas into configured habits
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
              "Remind me to plank 60 sec daily" → Configured habit with metric. 
              Powered by Azure OpenAI (GPT-5-nano).
            </CardContent>
          </Card>

          <Card className="border-pink-200 dark:border-pink-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 Progress Visualization
              </CardTitle>
              <CardDescription>
                Milestones, not streaks
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
              Milestone badges (10→50→100→500→1000). Monthly comparison with 
              growth %. Focus on volume, not perfection.
            </CardContent>
          </Card>

          <Card className="border-emerald-200 dark:border-emerald-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🌿 No Guilt Design
              </CardTitle>
              <CardDescription>
                Aggregation, not shame
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-zinc-600 dark:text-zinc-400">
              "18 walks this month" (not "missed 12 days"). No broken streaks. 
              Just continuing. Celebrate what you did.
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            Ready to find your way?
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
            Start tracking what matters. No streaks. No guilt. Just progress.
          </p>

          <div className="flex gap-4 justify-center mb-8">
            <Button size="lg" asChild>
              <a href="/today">Get Started</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/habits">Manage Habits</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="/aspirations">Set Aspirations</a>
            </Button>
          </div>

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
