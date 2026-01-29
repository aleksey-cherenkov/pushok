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
- Converts rough ideas into clear, actionable goals
- Suggests categories and milestones

### 📸 Photo Timeline
- Connect memorable photos to your life goals and activities
- Visual journey of your progress
- Tag photos with people, pets, moments that matter

### 🎮 Gamification Done Right
- Track positive goals AND avoidance of time-wasting activities
- Earn progress through meaningful actions, not virtual busywork
- Gentle reminders, not nagging notifications

### 🔄 Event Sourcing Architecture
- Complete audit trail of your journey
- Time-travel through your progress
- Rich analytics and insights
- Foundation for future mobile app with offline-first sync

### 🌿 Mindful Design
- Calming interface focused on reflection
- No stressful productivity pressure
- Gentle nudges to live intentionally

---

## 🛠️ Technology Stack

- **Framework**: Next.js 16 (App Router, React Server Components, Turbopack)
- **Database**: IndexedDB (Dexie.js) - local-first, browser-based event store
- **AI**: Azure OpenAI (GPT-4) for goal refinement
- **State**: Zustand with event sourcing
- **UI**: Tailwind CSS + shadcn/ui
- **Hosting**: Azure Static Web Apps
- **CI/CD**: GitHub Actions

### Why Event Sourcing?
- **Complete History**: Every goal change, activity logged
- **Time Travel**: Replay events to see patterns
- **Flexible Views**: Multiple projections from same data
- **Future-Proof**: Perfect foundation for mobile sync
- **Debugging**: Easy to understand state changes

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern browser (Chrome, Edge, Firefox, Safari)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/pushok.git
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

Pushok uses **Event Sourcing** - all state changes are stored as events in an append-only log.

### Key Aggregates
- **Goal**: User goals (positive, negative, avoidance)
- **Activity**: Logged activities linked to goals
- **Photo**: Photos with metadata and goal links
- **Reminder**: Scheduled reminders

### Sample Events
```typescript
GoalDefined → GoalRefined (AI) → GoalActivated → GoalProgressRecorded
ActivityLogged → PhotoAttached → ActivityTagged
PhotoUploaded → PhotoTagged → PhotoLinkedToGoal
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed event model.

---

## 🌐 Deployment

### Azure Static Web Apps

1. **Create Azure Static Web App** (Free tier available)
2. **Connect GitHub repository**
3. **Configure build settings:**
   - Build command: `npm run build`
   - Output folder: `.next`
4. **Push to main branch** - auto-deploys via GitHub Actions

### Environment Variables
```env
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_DEPLOYMENT=gpt-4
```

---

## 🧪 Development Workflow

### GitHub Copilot CLI Integration

This project showcases **GitHub Copilot CLI** throughout development:

- **Scaffolding**: Generated project structure with Copilot CLI
- **Event Store**: Built IndexedDB wrapper with AI assistance
- **Components**: Rapid UI development with Copilot suggestions
- **Testing**: Generated test cases and fixtures
- **Documentation**: This README and architecture docs

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
- [x] Project setup
- [x] Event store implementation
- [ ] Core goal management
- [ ] Basic UI components

### Phase 2: Core Features (Current)
- [ ] AI goal refinement
- [ ] Activity tracking
- [ ] Photo timeline
- [ ] Reminder system

### Phase 3: Polish
- [ ] Dashboard & analytics
- [ ] Gamification elements
- [ ] Responsive design
- [ ] Performance optimization

### Phase 4: Future (Mobile App)
- [ ] Flutter mobile app
- [ ] Native notifications
- [ ] Cloud sync (Azure Functions + SignalR)
- [ ] Camera integration
- [ ] Health app integration

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
> *sunshine, nature, presence, and love.*

---

## 🔗 Links

- **Live Demo**: https://pushok.life *(coming soon)*
- **Documentation**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **GitHub Copilot CLI**: [Learn more](https://github.com/features/copilot)
- **Next.js 16**: [Documentation](https://nextjs.org/docs)

---

Built with ❤️ using **GitHub Copilot CLI** | Deployed on **Azure Static Web Apps**
