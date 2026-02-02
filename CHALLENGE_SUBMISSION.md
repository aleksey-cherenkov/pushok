# Way Finder - Finding Your Path to What Matters

*Submission for the [GitHub Copilot CLI Challenge](https://dev.to/challenges/github-2026-01-21)*

> **The Story:** 10+ years C# backend dev → 7 months away from coding → built my FIRST React app in 2 weeks 🚀
>
> From zero React knowledge to production Next.js app with AI integration, event sourcing, and Azure deployment. Every step—learning, architecture, debugging, deployment—powered by GitHub Copilot CLI.
>
> **Why this matters:** Copilot CLI didn't just make me faster. It made a career switch possible that I would've been too intimidated to try otherwise.

---

## What I Built

**Way Finder** (codename: Pushok) - a gentle habit tracker that fights the stress of "broken streaks" and guilt-driven productivity apps. 

Named after my cat Stela, who taught me that life's best moments are simple: sunshine, nature, presence, love.

### The Problem

Productivity apps stress you out:
- "You broke your 47-day streak!" 💔
- "You missed 3 days this week" 😞
- Constant notifications and FOMO tactics
- **FOMO tactics** - "You're about to lose your progress!"

### The Solution

### The Solution

Way Finder uses **aggregation, not streaks**:
- 🌿 "You walked 18 times this month!" (not "you missed 12 days")
- ✨ Celebrate volume (10 → 50 → 100 walks), not consistency
- 📊 Multiple logs per day with values ("3 sessions • 75 pushups total")
- ❌ NO broken streaks - miss a day? Just keep going

### Tech That Makes It Work

**Event Sourcing** - Every action stored as immutable event:
- "18 walks this month" calculated from events, not counters
- No streak metadata to break
- Complete history of your journey
- Foundation for mobile sync

**AI Integration** - GPT-5-nano with 90% prompt caching:
- "Do 50 pushups daily" → AI suggests metric, unit, target
- Natural language → configured habit
- Cost: ~$1/month (not $20 with GPT-4o-mini)

---

## Live Demo

🌐 **https://pushok.life** ✅

**What's Working:**
- AI-assisted habit creation
- Multiple activity logs per day with values
- Today's Focus dashboard with aggregated totals
- Timeline view of individual sessions
- Metric tracking (checkmark, count, duration, distance)

---

## The Copilot CLI Story

### My Background

- 10+ years C# backend dev (migrations, ETL, integrations)
- Never built a React app before this
- 7 months away from active development
- One month ago: deployed first Azure site (static HTML)

### What I Built in 2 Weeks

My **first React app ever** → Production Next.js with:
- Event sourcing architecture
- AI integration (Azure OpenAI)
- Custom domain + SSL
- Professional docs (3,100+ lines)

**Stack I learned while building:**
- React/Next.js 16 (zero experience)
- TypeScript (knew C# types)
- Node.js deployment
- IndexedDB + Dexie.js
- Tailwind CSS
- Azure Static Web Apps SSR

### How Copilot CLI Made It Possible

**1. Learning React as a C# Dev**
- Asked: "Explain React hooks in terms of C# patterns"
- Got: Comparisons I could understand
- Result: Confident with useState, useEffect quickly

**2. Architecture Decisions**
- Researched event sourcing for frontend
- Compared deployment modes (SSR vs static)
- Designed 3-layer system through conversation

**3. Cost Optimization**
- Discovered GPT-5-nano (90% caching discount)
- Saved $180/year vs GPT-4o-mini
- One research session = ROI on Copilot subscription

**4. Debugging & Deployment**
- "Why is Azure deployment failing?" → Instant explanation
- "How to configure custom DNS?" → Step-by-step guide  
- Network configs, SSL certs → All figured out

**5. Documentation**
- Generated 3,100+ lines alongside code
- Kept 4 markdown files in sync
- Professional quality without the grind

### The Game-Changing Moments

**🎯 The Model Selection Win**
```
Me: "What's the best Azure OpenAI model?"
Copilot: [Recommends GPT-4o-mini]

Me: "What about GPT-5-nano?"
Copilot: [Researches] "Exists! 67% cheaper with 90% caching"
```
**Boom. $180/year saved.**

**🌐 The Deployment Mode Save**
```
Me: "Static export vs SSR?"
Copilot: [Creates comparison table]
"SSR lets API routes work. You need that for AI."
```
**Avoided a dead-end that would've broken everything.**

**🎨 The Design Partnership**
```
Me: "Cats wake up, play, explore. Humans have extra chores..."
Copilot: [Helps organize] "3-layer system: Aspirations → Habits → Daily actions"
```
**Turned vague idea into comprehensive architecture.**

---

## What This Means for You

### If You're Switching Stacks

Coming from C# backend, I was intimidated by React. "Too different, too much to learn."

With Copilot CLI:
- Asked questions in terms I understood
- Got C# → React pattern comparisons
- Built confidence through explanation, not just code

**2 weeks later:** Shipping production React app.

**The lesson:** Don't stay in your comfort zone because new tech seems hard. Copilot CLI bridges the gap.

### If You're Learning Solo

Traditional path:
- Google each question
- Piece together Stack Overflow
- Trial and error
- Maybe it works? 🤷

With Copilot CLI:
- Ask comprehensive questions
- Get researched answers with comparisons
- Understand WHY, not just HOW
- Build with confidence

**Result:** Months of learning → 2 weeks of shipping.

### The Numbers

**Time Savings:**
- Without Copilot CLI: 6-8 weeks (or never attempt React)
- With Copilot CLI: 2 weeks to production
- **Savings: 65-75%**

**Cost Savings:**
- GPT-4o-mini: ~$20/month
- GPT-5-nano (discovered via CLI): ~$1/month
- **Savings: $180/year**

**Documentation:**
- Manually: 3-4 days of writing
- With Copilot CLI: Generated alongside code
- **Quality: Professional-grade, 3,100+ lines**

---

## Tech Stack

- Next.js 16 (App Router, SSR, Turbopack)
- TypeScript (strict mode)
- Tailwind CSS 4
- IndexedDB (Dexie.js) - local-first
- Azure OpenAI (GPT-5-nano)
- Azure Static Web Apps (Free tier)
- Custom domain: pushok.life

**Budget:** $1-5/month

---

## What's Next

**Coming Soon:**
- Aspirations layer ("Get stronger for hiking")
- Progress visualization (trends, not streaks)
- Resistance tracking (inspired by "The War of Art")
- Milestone celebrations
- Demo video

**Future (Post-Challenge):**
- Flutter mobile app
- Cloud sync
- Family sharing

---

## The Bottom Line

**Before Copilot CLI:**
C# backend dev → Intimidated by React → Stuck in comfort zone

**With Copilot CLI:**
C# backend dev → First React app in 2 weeks → Confident full-stack developer

**This isn't just code assistance. It's career transformation.** 🚀

---

## Links

**Live App:** https://pushok.life  
**GitHub:** [aleksey-cherenkov/pushok](https://github.com/aleksey-cherenkov/pushok)  
**Docs:** README • ARCHITECTURE • DEPLOYMENT • PROJECT

---

**Dedication**

> In memory of Stela (Pushok) 🐱  
> Who taught us that the best moments are simple:  
> sunshine, nature, birds, presence, love.

---

*Built with ❤️ and GitHub Copilot CLI*

**Status:** Phase 3 Complete (65%) | **Live:** pushok.life ✅

---

**Last Updated:** 2026-02-02

