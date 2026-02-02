# Pushok 🐱

**Way Finder - In Memory of Stela**

> *"The best time to plant a tree was 20 years ago. The second best time is now."*

Pushok is a way finder for meaningful living - helping you discover and navigate toward what truly matters: relationships, nature, self-improvement, and living with intention.

Built with **GitHub Copilot CLI** for the **Build with GitHub Copilot** challenge.

---

## 🌟 Why Pushok?

We spend hours chasing virtual rewards in games while neglecting the real rewards in life - time with loved ones, moments in nature, personal growth, and meaningful connections. Pushok - your way finder (named after our beloved cat Stela) - helps you nurture good habits with:

- **No Guilt**: Miss a day? No problem. No broken streaks, no pressure.
- **Aggregation**: "You walked 18 times this month!" - celebrate wins!
- **Gentle Nudging**: Daily reminders without stress or FOMO
- **Meaningful Reflection**: Weekly/monthly views show progress over time
- **Remove Procrastination**: Quick 2-second check-ins make logging easy

**What matters:**
- **Connect**: Talk to parents, spend time with kids and pets
- **Experience**: Walk in nature, watch birds, be present
- **Grow**: Self-improvement, healthy habits, creativity
- **Reflect**: Celebrate progress without productivity pressure

---

## ✨ Core Features

### 🌿 Gentle Habit Tracking
- Create habits you want to nurture (daily walks, time with family, etc.)
- Quick check-ins: "✓ Did it today" (2 seconds, no friction)
- Optional details: Add notes, photos, mood, duration
- **Aggregated reflections**: "5 walks this week" - feel good!
- **NO STREAKS**: Missing a day doesn't break anything

### 🔔 Gentle Reminders (No Guilt)
- Optional daily nudges at your preferred time
- "Hey, want to go for a walk?" - suggestion, not pressure
- No countdown timers, no "you're about to lose your streak!"
- Learn from your patterns: suggest optimal times

### 📊 Reflection Views (Not Productivity Metrics)
- Weekly/monthly/yearly aggregations
- Milestone celebrations: 10 walks → 50 walks → 100 walks
- Charts show trends without guilt
- Focus on what you **did** accomplish, not what you missed

### 🔄 Event Sourcing Architecture
- Complete audit trail of your journey
- Time-travel through your progress at any point
- Rich analytics and pattern insights
- Foundation for future mobile app with offline-first sync
- No unit tests needed - events are the source of truth

### 🌿 Mindful Design (Like Stela)
- Calming interface with nature imagery
- Daily digest instead of constant notifications
- "Stela would be proud" style encouragement
- No guilt-tripping, no FOMO, no artificial urgency

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router, React Server Components, Turbopack)
- **Database**: IndexedDB (Dexie.js) - local-first, single-user, ~50 photos capacity
- **AI**: Azure OpenAI (GPT-5-nano with prompt caching)
- **State**: Zustand with event sourcing
- **UI**: Tailwind CSS + shadcn/ui
- **Hosting**: Azure Static Web Apps
- **CI/CD**: GitHub Actions
- **Budget**: $1-5/month for AI + hosting

### Why Event Sourcing?
- **Complete History**: Every habit change, activity logged as immutable facts
- **Time Travel**: Replay events to see patterns at any point in time
- **Flexible Views**: Multiple projections from same data
- **Future-Proof**: Perfect foundation for mobile sync
- **Simple Development**: Delete IndexedDB and restart fresh during development

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern browser (Chrome, Edge, Firefox, Safari)

### Installation

```bash
# Clone the repository
git clone https://github.com/aleksey-cherenkov/pushok.git
cd pushok

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
pushok/
├── app/                    # Next.js App Router
│   ├── habits/            # Habit management
│   ├── api/               # API routes (future)
│   └── page.tsx           # Homepage
├── lib/                   # Core business logic
│   ├── events/            # Event sourcing (types, store, aggregate)
│   ├── aggregates/        # Domain aggregates (Habit)
│   └── ai/                # AI integration helpers (future)
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   └── habits/            # Habit-specific components
└── hooks/                 # Custom React hooks
```

---

## 🎯 Event Model Overview

Pushok uses **Event Sourcing** - all state changes are stored as immutable events in an append-only log.

### Key Aggregates
- **Habit**: Activities you want to nurture (walks, time with family, etc.)
- **Activity**: Logged check-ins with optional details
- **Photo**: Photos with phases (before/during/after), tags (future)
- **Reminder**: Gentle scheduled reminders (future)

### Sample Events
```typescript
HabitCreated → HabitUpdated → ActivityLogged → MilestoneReached
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed event model.

---

## 🌐 Deployment

### Azure Static Web Apps

**Resource Details:**
- **Resource Group**: `rg-pushok`
- **Static Web App**: `pushok-app`
- **Plan**: Free tier
- **Domain**: pushok.life
- **Output Location**: `.next` (SSR mode)

**Deployment Steps:**
1. Create Azure Static Web App (see [DEPLOYMENT.md](./DEPLOYMENT.md))
2. Connect GitHub repository
3. Configure build settings (auto-configured)
4. Push to main branch - auto-deploys via GitHub Actions

### Environment Variables
```env
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_DEPLOYMENT=gpt-5-nano
```

**Detailed deployment guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🧪 Development Workflow

### GitHub Copilot Configuration

This project includes custom Copilot instructions for consistent, high-quality code:

```
.github/
  └── copilot-instructions.md   # Project context, coding standards, patterns
.vscode/
  ├── settings.json             # Copilot & editor settings
  └── extensions.json           # Recommended extensions
```

**Copilot instructions include:**
- Project architecture (event sourcing, CQRS patterns)
- Coding standards (TypeScript strict, naming conventions)
- Documentation references (README, ARCHITECTURE, PROJECT, GETTING_STARTED)
- Guidelines for keeping documentation updated

### GitHub Copilot CLI Integration

This project showcases **GitHub Copilot CLI** throughout development:

- **Scaffolding**: Generated project structure with Copilot CLI
- **Event Store**: Built IndexedDB wrapper with AI assistance
- **Components**: Rapid UI development with Copilot suggestions
- **Documentation**: This README and architecture docs
- **Problem Solving**: Debug assistance and code explanations

### Testing Philosophy

Event sourcing with proper design doesn't need extensive unit tests:
- Events are immutable facts - if stored correctly, the system is correct
- Manual verification through the UI during development
- Delete IndexedDB and restart fresh when schemas change

### Scripts
```bash
npm run dev          # Development server (Turbopack)
npm run build        # Production build
npm run lint         # ESLint
npm run type-check   # TypeScript check
```

---

## 🗺️ Roadmap

### Phase 1: Foundation ✅ COMPLETE
- [x] Project setup with Next.js 16
- [x] Project documentation
- [x] Azure Static Web Apps deployment
- [x] Custom domain (pushok.life) with SSL
- [x] GitHub Actions CI/CD pipeline
- [x] shadcn/ui components
- [x] Homepage with Stela's memorial 💙
- [x] Event store implementation
- [x] Core habit management UI

**🎉 Live at https://pushok.life**

### Phase 2: Core Features ✅ COMPLETE
- [x] Activity logging with multiple logs per day ✅
- [x] AI habit creation with GPT-5-nano ✅
- [x] Metric tracking (count, duration, distance) ✅
- [x] Today's Focus dashboard ✅
- [x] Navigation bar ✅
- [x] About page with Stela's story ✅

**Recent additions:**
- 🤖 **AI-Assisted Habit Creation**: Natural language → configured habit with metrics
- 📊 **Flexible Metrics**: checkmark, count (reps/steps), duration (sec/min/hr), distance (mi/km)
- ✅ **Enhanced Activity Logging**: Multiple sessions per day with value tracking
- 📈 **Aggregated Progress**: "3 sessions today • 45 total" - see real progress
- 🗓️ **Today's Focus**: Daily dashboard with expandable log timelines
- 🧭 **Navigation**: Seamless flow between Home, Today, Habits, About

### Phase 3: Progress & Motivation (Current)
- [ ] Long-term aspirations/goals
- [ ] Progress visualization (combat futility)
- [ ] Resistance tracking (inspired by "The War of Art")
- [ ] Weekly/monthly aggregations
- [ ] Milestone celebrations

### Phase 4: Polish & Submit
- [ ] Reflection views
- [ ] Demo video for challenge submission

### Phase 5: Future (Post-Challenge)
- [ ] Flutter mobile app (where photos really shine)
- [ ] Native notifications (proper gentle reminders)
- [ ] Cloud sync (Azure Functions + SignalR)
- [ ] Camera integration
- [ ] Private repo with public mobile app

---

## 🤝 Contributing

This is a personal project built for the GitHub Copilot CLI challenge, but suggestions and feedback are welcome!

---

## 📝 License

MIT License - See [LICENSE](./LICENSE) for details

---

## 💭 Dedication

> **In memory of Stela (Pushok)** 🐱
> *Who taught us that the best moments in life are simple:*
> *sunshine, nature, birds and squirrels, presence, and love.*
>
> *This app is a journal for meaningful living - gentle like Stela,*
> *reminding us to focus on what truly matters.*

---

## 🔗 Links

- **Live Demo**: https://pushok.life ✅ (deployed!)
- **Documentation**: [ARCHITECTURE.md](./ARCHITECTURE.md) | [DEPLOYMENT.md](./DEPLOYMENT.md)
- **GitHub Copilot CLI**: [Learn more](https://github.com/features/copilot)
- **Next.js 16**: [Documentation](https://nextjs.org/docs)

---

Built with ❤️ using **GitHub Copilot CLI** | Deployed on **Azure Static Web Apps**
