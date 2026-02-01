import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-emerald-50 dark:from-zinc-900 dark:to-zinc-950 px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            About Way Finder
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            In memory of Stela (Pushok) 🐱
          </p>
        </div>

        {/* Stela's Story */}
        <Card className="border-emerald-200 dark:border-emerald-900">
          <CardHeader>
            <CardTitle>Why Way Finder Exists</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-zinc-700 dark:text-zinc-300">
            <p>
              This app is named after Stela (nicknamed Pushok), my beloved cat who taught me that life's most 
              meaningful moments are often the simplest ones—sunshine, nature, birds and squirrels, presence, and love.
            </p>
            <p>
              After losing Stela, I realized how much time I spent on "urgent" things instead of what truly matters. 
              Way Finder is my answer—a tool that helps you build good habits without the stress of typical productivity apps.
            </p>
          </CardContent>
        </Card>

        {/* Philosophy */}
        <Card>
          <CardHeader>
            <CardTitle>The Way Finder Philosophy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-zinc-700 dark:text-zinc-300">
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">No Broken Streaks</h3>
              <p className="text-sm">
                Miss a day? No problem. No guilt, no pressure. Just keep going. We celebrate what you <strong>did</strong> do, 
                not what you missed.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Aggregation, Not Shame</h3>
              <p className="text-sm">
                "You walked 18 times this month!" feels way better than "You broke a 47-day streak!" We show your wins, 
                not your misses.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Gentle Nudges</h3>
              <p className="text-sm">
                Reminders are suggestions, not demands. "Hey, want to go for a walk?" not "YOU'RE ABOUT TO LOSE YOUR PROGRESS!"
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">Calming Design</h3>
              <p className="text-sm">
                Nature colors, gentle animations, thoughtful spacing. Like Stela—calm, peaceful, present.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Built With */}
        <Card>
          <CardHeader>
            <CardTitle>Built With</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
            <p>🤖 <strong>GitHub Copilot CLI</strong> - Terminal-based development assistant</p>
            <p>⚛️ <strong>Next.js 16</strong> - React framework with App Router</p>
            <p>🎨 <strong>Tailwind CSS + shadcn/ui</strong> - Beautiful, accessible components</p>
            <p>🤖 <strong>Azure OpenAI (GPT-5-nano)</strong> - AI-assisted habit creation</p>
            <p>💾 <strong>Event Sourcing + IndexedDB</strong> - Complete history, no data loss</p>
            <p>☁️ <strong>Azure Static Web Apps</strong> - Fast, global deployment</p>
            <p className="pt-4 text-xs text-zinc-500 dark:text-zinc-400">
              Built for the <strong>Build with GitHub Copilot CLI Challenge</strong>
            </p>
          </CardContent>
        </Card>

        {/* Open Source */}
        <Card>
          <CardHeader>
            <CardTitle>Open Source & Feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              Way Finder is open source and built in the open. Check out the code, suggest features, or just say hi!
            </p>
            <div className="flex gap-3">
              <Button asChild variant="outline">
                <a href="https://github.com/aleksey-cherenkov/pushok" target="_blank" rel="noopener">
                  GitHub Repository
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Back Link */}
        <div className="text-center">
          <Button asChild variant="outline">
            <a href="/">← Back to Home</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
