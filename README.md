# Pushok 🐱

**Way Finder - In Memory of Stela**

> *"The best time to plant a tree was 20 years ago. The second best time is now."*

Pushok is a way finder for meaningful living - helping you discover and navigate toward what truly matters: relationships, nature, self-improvement, and living with intention.

Built with **GitHub Copilot CLI** for the **Build with GitHub Copilot** challenge.

---

## 🌟 Why Pushok?

We spend hours chasing virtual rewards in games while neglecting the real rewards in life - time with loved ones, moments in nature, personal growth, and meaningful connections. Pushok - your way finder (named after our beloved cat Stela) - helps you discover and navigate toward:

- **Connect**: Talk to parents, spend time with kids and pets
- **Experience**: Look outside, enjoy nature, be present
- **Grow**: Self-study, home improvement, healthy lifestyle
- **Reflect**: Track progress, celebrate wins, learn from patterns

---

## ✨ Core Features

### 🎯 AI-Powered Goal Definition
- Struggle to articulate goals? AI helps you refine and structure them
- Claude/Copilot CLI style: shows suggestions, allows clarify & regenerate
- You always have final control over your goals
- Cost-optimized with GPT-5-nano (with prompt caching)

### 📸 Photo Timeline & Memories
- Connect memorable photos to your life goals and activities
- Project photos: before/during/after for home improvement, creative work
- Family & pets, nature moments (Stela's favorites: birds, squirrels, sunshine)
- Special memorial gallery for Stela

### 📓 Journal/Diary Approach
- Weekly, monthly, yearly reflection on your wins
- Milestones instead of streaks (no stress from broken chains)
- Quick logging with optional details for better reminiscence
- Focus on meaningful moments, not productivity metrics

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
- **Complete History**: Every goal change, activity logged as immutable facts
- **Time Travel**: Replay events to see patterns at any point in time
- **Flexible Views**: Multiple projections from same data
- **Future-Proof**: Perfect foundation for mobile sync
- **No Unit Tests Needed**: Events are the source of truth - if they're correct, state is correct
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
│   ├── (dashboard)/       # Main dashboard routes
│   │   ├── goals/         # Goal management
│   │   ├── timeline/      # Activity & photo timeline
│   │   ├── analytics/     # Progress & insights
│   │   └── settings/      # User preferences
│   └── api/               # API routes
│       ├── ai/            # Azure OpenAI integration
│       └── events/        # Event store API
├── lib/                   # Core business logic
│   ├── event-store/       # Event sourcing implementation
│   ├── aggregates/        # Domain aggregates (Goal, Activity, Photo)
│   ├── projections/       # Read models for UI
│   ├── commands/          # Command handlers
│   └── ai/                # AI integration helpers
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   ├── goals/             # Goal-specific components
│   ├── timeline/          # Timeline components
│   └── photos/            # Photo gallery components
└── hooks/                 # Custom React hooks
```

---

## 🎯 Event Model Overview

Pushok uses **Event Sourcing** - all state changes are stored as immutable events in an append-only log.

### Key Aggregates
- **Goal**: User goals (positive or avoidance), milestones, progress
- **Activity**: Logged activities linked to goals (quick or detailed)
- **Photo**: Photos with phases (before/during/after), tags, goal links
- **Reminder**: Gentle scheduled reminders (daily digest style)

### Sample Events
```typescript
GoalDefined → AIRefinementReceived → GoalActivated → GoalMilestoneCompleted
ActivityLogged → PhotoAttached → ActivityTagged
PhotoUploaded → PhotoPhaseSet → PhotoLinkedToGoal
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

### Phase 1: Foundation ✅
- [x] Project setup with Next.js 16
- [x] Project documentation
- [x] Azure Static Web Apps deployment configured
- [x] Azure OpenAI resource and GPT-5-nano model deployed
- [x] Custom domain (pushok.life) configured
- [ ] Event store implementation
- [ ] Core goal management
- [ ] Basic UI components

### Phase 2: Core Features (Current - GitHub Copilot CLI Challenge)
- [ ] AI goal refinement (GPT-5-nano with prompt caching)
- [ ] Activity tracking (quick + detailed logging)
- [ ] Photo timeline (projects, family, nature)
- [ ] Gentle reminder system (daily digest)

### Phase 3: Polish & Submit
- [ ] Dashboard with weekly/monthly/yearly reflection
- [ ] Milestone tracking (no streaks)
- [ ] Stela memorial gallery
- [ ] Demo video for challenge submission

### Phase 4: Future (Post-Challenge)
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

- **Live Demo**: https://pushok.life
- **Documentation**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **GitHub Copilot CLI**: [Learn more](https://github.com/features/copilot)
- **Next.js 16**: [Documentation](https://nextjs.org/docs)

---

Built with ❤️ using **GitHub Copilot CLI** | Deployed on **Azure Static Web Apps**
