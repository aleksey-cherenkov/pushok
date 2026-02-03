import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

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
          <p className="text-sm text-zinc-500 dark:text-zinc-500 italic">
            9 years and 9 months of joy
          </p>
        </div>

        {/* Stela's Memorial */}
        <Card className="border-2 border-pink-200 dark:border-pink-900 bg-pink-50/30 dark:bg-pink-950/10">
          <CardHeader>
            <CardTitle className="text-center">In Memory of Stela 💙</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-zinc-700 dark:text-zinc-300 space-y-4">
            <div className="flex justify-center gap-4 flex-wrap">
              <Image
                src="/images/stela-august-25.jpg"
                alt="Stela as a kitten"
                width={250}
                height={250}
                className="rounded-lg shadow-lg object-cover"
              />
              <Image
                src="/images/stela-june-16.JPG"
                alt="Stela"
                width={250}
                height={250}
                className="rounded-lg shadow-lg object-cover"
              />
            </div>
            <p>
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
            <p className="text-sm bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900 rounded-lg p-3">
              <strong>Built 100% with GitHub Copilot CLI</strong> for the Build with GitHub Copilot CLI Challenge. 
              From first conversation to deployed app—all features, infrastructure, and design driven by AI pair programming. 
              This is a working prototype proving the anti-guilt philosophy with real habits, projects, photos, and AI assistance.
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
            <CardTitle>Built With GitHub Copilot CLI</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-zinc-700 dark:text-zinc-300">
            <p className="text-sm">
              <strong>100% built with GitHub Copilot CLI</strong> — from the first conversation about Stela 
              to deployed app at pushok.life. Design → Infrastructure → Code → Deploy → Iterate. 
              No tutorials. No Stack Overflow. Just one continuous conversation.
            </p>
            <div className="text-sm space-y-2 pt-2">
              <p>🤖 <strong>GitHub Copilot CLI</strong> - Complete project lifecycle</p>
              <p>⚛️ <strong>Next.js 16</strong> - React framework with App Router</p>
              <p>🎨 <strong>Tailwind CSS + shadcn/ui</strong> - Beautiful, accessible components</p>
              <p>🤖 <strong>Azure OpenAI (GPT-5-nano)</strong> - AI-assisted creation ($1/month with 90% caching)</p>
              <p>💾 <strong>Event Sourcing + IndexedDB</strong> - Complete history, no data loss</p>
              <p>☁️ <strong>Azure Static Web Apps</strong> - Fast, global deployment</p>
            </div>
            <p className="pt-3 text-xs text-zinc-500 dark:text-zinc-400">
              Built for the <strong>Build with GitHub Copilot CLI Challenge</strong> — 
              fighting Resistance while building an app that fights Resistance.
            </p>
          </CardContent>
        </Card>

        {/* Project Status */}
        <Card>
          <CardHeader>
            <CardTitle>What You Can Do Today</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">✅ Track Habits</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Log activities with metrics (count, duration, distance). Track resistance. See volume, not streaks.
                  Multiple logs per day supported. AI helps create habits from vague ideas.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">🎯 Connect to Aspirations</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Link habits to what matters. "Why am I doing this?" AI refines vague goals into clear aspirations.
                  See how daily actions build toward meaningful pursuits.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">📁 Manage Projects</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Break down projects into phases. Add photos to track visual progress. Log time invested.
                  AI creates structured phases from rough project ideas.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">📸 Capture Moments</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Life isn't all structure. Capture spontaneous photos with captions. Keep your journey real.
                  Daily AI-generated messages for inspiration.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">📊 Visualize Progress</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  See volume over time, resistance tracking, weekly patterns. Milestone celebrations (not streaks!).
                  AI surfaces insights about your patterns.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Core Features (All Live)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                <span className="text-zinc-700 dark:text-zinc-300">Event sourcing architecture</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                <span className="text-zinc-700 dark:text-zinc-300">Multi-metric habit tracking</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                <span className="text-zinc-700 dark:text-zinc-300">Resistance tracking</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                <span className="text-zinc-700 dark:text-zinc-300">AI habit refinement</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                <span className="text-zinc-700 dark:text-zinc-300">Aspiration linking</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                <span className="text-zinc-700 dark:text-zinc-300">AI aspiration creation</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                <span className="text-zinc-700 dark:text-zinc-300">Project phase management</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                <span className="text-zinc-700 dark:text-zinc-300">Photo uploads (compressed)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                <span className="text-zinc-700 dark:text-zinc-300">Time tracking per phase</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                <span className="text-zinc-700 dark:text-zinc-300">Progress % tracking</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                <span className="text-zinc-700 dark:text-zinc-300">Moments gallery</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                <span className="text-zinc-700 dark:text-zinc-300">Daily AI messages</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                <span className="text-zinc-700 dark:text-zinc-300">Interactive charts</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                <span className="text-zinc-700 dark:text-zinc-300">Milestone celebrations</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                <span className="text-zinc-700 dark:text-zinc-300">Weekly pattern analysis</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                <span className="text-zinc-700 dark:text-zinc-300">Local-first (IndexedDB)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Open Source */}
        <Card className="border-2 border-sky-200 dark:border-sky-900">
          <CardHeader>
            <CardTitle>Will This Actually Help People?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-zinc-700 dark:text-zinc-300">
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">✅ What Works Well</h3>
              <ul className="text-sm space-y-1 ml-4">
                <li>• <strong>Anti-guilt design</strong> - No broken streaks, volume-focused metrics</li>
                <li>• <strong>Resistance tracking</strong> - Unique! Celebrates showing up when it's hard</li>
                <li>• <strong>AI assistance</strong> - Lowers barrier to entry (vague idea → structured habit)</li>
                <li>• <strong>Visual progress</strong> - Photos make abstract progress tangible</li>
                <li>• <strong>Moments</strong> - Balances structure with spontaneity</li>
                <li>• <strong>Aspiration linking</strong> - Answers "why am I doing this?"</li>
              </ul>
            </div>
            
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4">
              <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">⚠️ Gaps & Missing Features</h3>
              <ul className="text-sm space-y-1 ml-4 text-amber-900 dark:text-amber-100">
                <li>• <strong>No reminders/nudges</strong> - You must remember to open the app</li>
                <li>• <strong>Web-only</strong> - Not in pocket when you need it</li>
                <li>• <strong>No social/accountability</strong> - Solo journey only</li>
                <li>• <strong>Manual logging</strong> - No automatic tracking (steps, etc.)</li>
                <li>• <strong>Limited insights</strong> - AI could do more pattern detection</li>
                <li>• <strong>No habit chains</strong> - Can't say "do X before Y"</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">💡 Recommendations for Real Use</h3>
              <ul className="text-sm space-y-2 ml-4">
                <li>
                  <strong>1. Add gentle reminders</strong> - "Time for your evening walk?" at user-set times. 
                  Not guilt, just helpful nudges.
                </li>
                <li>
                  <strong>2. Build mobile app</strong> - Flutter PWA or native. In pocket = higher engagement.
                  Camera integration makes photos seamless.
                </li>
                <li>
                  <strong>3. Smarter insights</strong> - "You always skip walks on Mondays. What's blocking you?" 
                  Use AI to surface patterns you don't see.
                </li>
                <li>
                  <strong>4. Optional sharing</strong> - Share progress photos with friends/family without 
                  full social network noise.
                </li>
                <li>
                  <strong>5. Habit stacking</strong> - "After morning coffee → meditate → stretch" 
                  Build routines, not isolated habits.
                </li>
                <li>
                  <strong>6. Export/backup</strong> - Download all data as JSON. Event sourcing makes this easy.
                </li>
                <li>
                  <strong>7. Better onboarding</strong> - Interactive tutorial. Most people won't figure out 
                  aspirations → habits → activities on their own.
                </li>
                <li>
                  <strong>8. Reflection prompts</strong> - Weekly "What went well? What was hard?" 
                  Structured reflection, not just open notes.
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t text-sm">
              <p className="font-semibold mb-2">Bottom Line:</p>
              <p>
                The <strong>philosophy is solid</strong> (anti-guilt, volume over streaks, resistance tracking). 
                The <strong>architecture is sound</strong> (event sourcing, local-first, AI integration). 
                But it needs <strong>mobile presence and smarter nudges</strong> to work in real life. 
                Nobody opens a web app daily unless something reminds them.
              </p>
              <p className="mt-3 text-emerald-700 dark:text-emerald-300 font-semibold">
                Best use case right now: People who already journal/track and want a better tool. 
                Not quite ready for "I want to start but don't know how."
              </p>
            </div>
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
