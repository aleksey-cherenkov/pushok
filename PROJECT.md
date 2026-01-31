# Pushok - Project Implementation Guide

**GitHub Copilot CLI Challenge - Way Finder for Meaningful Living**

---

## Project Information

- **Name**: Way Finder (codename: Pushok)
- **Tagline**: Find your way to what matters
- **Domain**: pushok.life ✓ (owned)
- **Repository**: https://github.com/aleksey-cherenkov/pushok
- **Live Demo**: https://pushok.life (Azure Static Web Apps)
- **Challenge**: Build with GitHub Copilot CLI

---

## Technology Stack

### Core
- **Framework**: Next.js 16.1.6 (App Router, Turbopack)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x
- **UI Components**: shadcn/ui (to be added)

### State & Data
- **State Management**: Zustand
- **Database**: IndexedDB via Dexie.js
- **Architecture**: Event Sourcing + Event Modeling

### AI & Cloud
- **AI**: Azure OpenAI (GPT-5-nano primary - with prompt caching)
- **Hosting**: Azure Static Web Apps
- **CI/CD**: GitHub Actions
- **Budget**: $1-5/month for AI + hosting

### Development
- **Package Manager**: npm
- **Linting**: ESLint
- **Testing**: Integration tests only (event sourcing philosophy - no unit tests needed)

---

## Development Phases

### ✅ Phase 1: Foundation Setup (COMPLETED) 🎉

**Status:** All infrastructure deployed and live at https://pushok.life

**Tasks:**
- [x] Create Next.js 16 project with TypeScript
- [x] Configure Tailwind CSS
- [x] Set up project directory structure
- [x] Install core dependencies (Zustand, Dexie, date-fns, uuid)
- [x] Install Azure OpenAI SDK
- [x] Create README.md
- [x] Create ARCHITECTURE.md
- [x] Create PROJECT.md
- [x] Create DEPLOYMENT.md
- [x] Create GitHub Copilot instructions (`.github/copilot-instructions.md`)
- [x] Configure VS Code settings for Copilot (`.vscode/settings.json`)
- [x] Add shadcn/ui components
- [x] Configure GitHub repository
- [x] Set up Azure Static Web Apps resource
- [x] Set up Azure OpenAI resource with GPT-5-nano
- [x] Configure GitHub Actions workflows
- [x] Configure custom domain (pushok.life)
- [x] Test successful deployment
- [x] Create homepage with Stela's memorial

**Achievement Unlocked:** Full production deployment pipeline + First UI! 🚀

**Next Steps:**
1. ✅ shadcn/ui initialized with first components
2. Begin Phase 2: Event Store Implementation

---

### 🔄 Phase 2: Event Store Implementation (IN PROGRESS)

**Tasks:**
- [ ] Create event type definitions (`lib/event-store/event-types.ts`)
- [ ] Implement Dexie database schema (`lib/event-store/event-store.ts`)
- [ ] Build event store API (append, load, query)
- [ ] Create base aggregate class (`lib/aggregates/base-aggregate.ts`)
- [ ] Implement snapshot store (optional, for performance)
- [ ] Create Zustand store integration
- [ ] Add event replay capability

**Dependencies:** None (can start immediately)

**Testing Approach:** Manual verification through UI; delete IndexedDB and restart when schemas change during development.

**Copilot CLI Usage:**
- Generate event type interfaces
- Scaffold Dexie schema

---

### 📋 Phase 3: Goal Management

**Tasks:**
- [ ] Define goal aggregate (`lib/aggregates/goal.aggregate.ts`)
- [ ] Implement goal commands (`lib/commands/goal.commands.ts`)
- [ ] Create goal projection (`lib/projections/goals-dashboard.projection.ts`)
- [ ] Build goal UI components (`components/goals/`)
- [ ] Create goal dashboard page (`app/goals/page.tsx`)
- [ ] Add goal creation form with AI refinement
- [ ] Implement goal progress tracking
- [ ] Add milestone tracking (not streaks - no stress mechanics)
- [ ] Create goal category management

**Dependencies:** Phase 2 (Event Store)

**Design Decision:** No streaks - focus on milestones and reflection instead.

**UI Components Needed:**
- GoalCard
- GoalForm
- GoalProgressBar
- GoalCategoryBadge
- MilestoneList

---

### 📸 Phase 4: Photo Timeline

**Tasks:**
- [ ] Define photo aggregate (`lib/aggregates/photo.aggregate.ts`)
- [ ] Implement photo blob storage in IndexedDB (25-50 photos sufficient for web)
- [ ] Create photo upload component (`components/photos/PhotoUpload.tsx`)
- [ ] Build photo gallery component (`components/photos/PhotoGallery.tsx`)
- [ ] Implement photo timeline projection (`lib/projections/timeline.projection.ts`)
- [ ] Create timeline page (`app/timeline/page.tsx`)
- [ ] Add photo tagging (people, pets, activities)
- [ ] Implement photo-goal linking
- [ ] Add before/during/after phases for project photos
- [ ] Create special "Stela Memorial" gallery (couple clicks from settings)
- [ ] Add thumbnail generation
- [ ] Build photo detail view

**Dependencies:** Phase 2 (Event Store), Phase 3 (Goals for linking)

**Photo Categories:**
- Projects (before/during/after)
- Family & pets
- Nature (birds, squirrels - Stela's favorites)
- Health/lifestyle
- User-defined categories

**UI Components Needed:**
- PhotoUploader
- PhotoCard
- PhotoTimeline
- PhotoTagger
- ProjectPhotoViewer (before/during/after)
- StelaMemorialGallery

---

### 🎯 Phase 5: Activity Tracking

**Tasks:**
- [ ] Define activity aggregate (`lib/aggregates/activity.aggregate.ts`)
- [ ] Implement activity commands (`lib/commands/activity.commands.ts`)
- [ ] Create activity logging form (`components/timeline/ActivityLogger.tsx`)
- [ ] Build activity timeline component
- [ ] Add activity-goal linking
- [ ] Implement time tracking
- [ ] Create activity analytics projection
- [ ] Add activity categories & tags
- [ ] Build activity edit/delete

**Dependencies:** Phase 2 (Event Store), Phase 3 (Goals)

**Logging Philosophy:** Quick to log, but with optional details for better reminiscence. Default is simple checkmark + auto timestamp; expand for notes/photos/duration.

**UI Components Needed:**
- ActivityLogger (expandable - quick or detailed)
- ActivityCard
- ActivityTimeline
- TimeTracker
- ActivityStats

---

### 🔔 Phase 6: Reminder System (Prototype)

**Tasks:**
- [ ] Define reminder aggregate (`lib/aggregates/reminder.aggregate.ts`)
- [ ] Implement reminder scheduling logic
- [ ] Create reminder UI (`components/reminders/`)
- [ ] Integrate browser Notification API (limited on web)
- [ ] Build gentle reminder UX (daily digest, not individual pings)
- [ ] Add reminder effectiveness tracking
- [ ] Create reminder settings page
- [ ] Implement smart reminder timing (AI suggestions)

**Dependencies:** Phase 3 (Goals), Phase 5 (Activities)

**Gentle Reminder Principles (Like Stela):**
- Daily digest instead of constant notifications
- Calm dashboard with soft suggestions
- Nature imagery (birds, squirrels, sunshine)
- "Stela would be proud" style encouragement
- No guilt-tripping, no FOMO mechanics

**UI Components Needed:**
- ReminderForm
- DailyDigest
- GentleNotification
- ReminderSettings

**Note:** This is a prototype. Full reminder system will shine in Flutter mobile app with native notifications.

---

### 🤖 Phase 7: AI Integration

**Tasks:**
- [ ] Create Azure OpenAI client wrapper (`lib/ai/openai-client.ts`)
- [ ] Implement goal refinement API route (`app/api/ai/refine-goal/route.ts`)
- [ ] Build AI suggestion UI (Claude/Copilot CLI style - show options, clarify, regenerate)
- [ ] Add AI suggestion UI components
- [ ] Implement prompt engineering for goal refinement
- [ ] Create AI analytics suggestions (future)
- [ ] Add error handling & rate limiting

**Dependencies:** Phase 3 (Goals)

**AI Interaction Pattern (Like Claude/Copilot CLI):**
- Show multiple suggestions for user to choose
- Allow "clarify" to ask follow-up questions
- Allow "regenerate" for new suggestions
- User always has final control

**Model Strategy (Cost-Optimized):**
- Primary: GPT-5-nano (lowest cost with 90% prompt caching discount)
- Alternative: GPT-4.1-nano (if GPT-5-nano unavailable)
- Budget: $1-5/month

**API Routes:**
- `POST /api/ai/refine-goal` - Refine user's rough goal idea
- `POST /api/ai/suggest-reminders` - Suggest optimal reminder times
- `POST /api/ai/analyze-patterns` - Analyze user's goal patterns (future)

**Environment Variables (Azure Portal Configuration):**
```env
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_DEPLOYMENT=gpt-5-nano
```

**GitHub Secrets Required:**
- `AZURE_STATIC_WEB_APPS_API_TOKEN` (deployment token from Azure)
- `AZURE_OPENAI_ENDPOINT` (optional, if using client-side)
- `AZURE_OPENAI_API_KEY` (optional, if using client-side)
- `AZURE_OPENAI_DEPLOYMENT` (optional, if using client-side)

---

### 📊 Phase 8: Dashboard & Analytics

**Tasks:**
- [ ] Create main dashboard page (`app/page.tsx`)
- [ ] Build analytics projection (`lib/projections/analytics.projection.ts`)
- [ ] Implement progress charts (Chart.js or Recharts)
- [ ] Create milestone visualizations (not streaks)
- [ ] Build time distribution charts
- [ ] Add reflection features (weekly, monthly, yearly wins)
- [ ] Create positive vs avoidance goals tracking
- [ ] Implement weekly/monthly/yearly reports
- [ ] Add export data feature
- [ ] Build settings page with Stela memorial link

**Dependencies:** All previous phases

**Journal/Diary Approach:**
- Weekly wins reflection
- Monthly progress summary
- Yearly review with photo highlights
- No daily pressure or streak stress

**Charts & Visualizations:**
- Goal progress over time
- Activity calendar (not heatmap pressure)
- Category distribution
- Milestone achievements
- Time invested in meaningful activities
- Photo memories timeline

---

### 🎨 Phase 9: UI/UX Polish

**Tasks:**
- [ ] Design calming color scheme (nature-inspired)
- [ ] Add smooth animations & transitions
- [ ] Implement responsive design (mobile, tablet, desktop)
- [ ] Create loading states & skeletons
- [ ] Add empty states with helpful prompts
- [ ] Implement dark mode (optional)
- [ ] Add keyboard shortcuts
- [ ] Create onboarding flow
- [ ] Add help tooltips & documentation
- [ ] Optimize performance (lazy loading, code splitting)
- [ ] Test accessibility (WCAG AA)

**Dependencies:** All feature phases

**Design Principles:**
- Calming, not stressful
- Nature imagery (Stela's favorite: birds, squirrels, grass, sun)
- Gentle colors (greens, blues, soft pastels)
- Clear typography
- Generous whitespace
- Thoughtful animations (not flashy)

---

### 🚀 Phase 10: Deployment & Demo ✅ DEPLOYMENT COMPLETE

**Tasks:**
- [x] Create Azure Static Web App resource
- [x] Configure custom domain (pushok.life)
- [x] Set up GitHub Actions deployment workflow
- [x] Configure environment variables in Azure
- [x] Test production build
- [ ] Create demo data generator
- [ ] Record demo video for GitHub Copilot CLI Challenge
- [x] Write deployment documentation (DEPLOYMENT.md)
- [ ] Test on multiple browsers
- [ ] Performance audit (Lighthouse)
- [ ] Create project submission for challenge

**Dependencies:** All phases

**Azure Resources:**
- **Resource Group**: `rg-pushok`
- **Static Web App**: `pushok-app`
- **Plan**: Free tier
- **Region**: Choose closest (e.g., East US, West US 2)
- **Domain**: pushok.life
- **Deployment Mode**: SSR (`.next` output)

**Deployment Strategy:**
- **Phase 1 (Challenge)**: Public demo on pushok.life, public GitHub repo
- **Phase 2 (Post-Challenge)**: Private repo, public mobile app later

**Deployment Checklist:**
- [x] Next.js production build works
- [x] Domain owned: pushok.life
- [x] Deployment documentation created (DEPLOYMENT.md)
- [x] SSR mode selected (API routes support)
- [x] Azure Static Web App created (pushok-app)
- [x] Azure OpenAI resource created (pushok-openai)
- [x] GPT-5-nano model deployed
- [x] Custom domain configured (pushok.life)
- [x] DNS records configured (Cloudflare)
- [x] TXT validation completed
- [x] SSL certificate active ✅
- [x] Environment variables set (Azure portal)
- [x] GitHub Actions workflow auto-created
- [x] First deployment successful ✅
- [ ] Demo mode available (pre-populated data)

**Live URLs:**
- 🌐 Production: https://pushok.life ✅
- 🔧 Azure URL: https://[your-app].azurestaticapps.net ✅

**See DEPLOYMENT.md for complete step-by-step guide.**

**Challenge Submission Requirements:**
- Build with GitHub Copilot CLI
- Show what you built and why it matters
- Demo video walkthrough
- Document Copilot CLI experience

---

## Copilot CLI Integration Log

### How GitHub Copilot CLI Enhanced Development

**Phase 1: Setup**
- Used Copilot CLI to scaffold Next.js project with optimal config
- Generated comprehensive README and ARCHITECTURE docs
- Created project structure with proper TypeScript setup
- **Created `.github/copilot-instructions.md`** - Custom instructions for Copilot Chat & CLI:
  - Project context and architecture patterns
  - Coding standards (TypeScript strict, event sourcing rules)
  - Documentation references and update guidelines
  - Tech stack versions and best practices
- **Configured VS Code settings** for optimal Copilot experience:
  - Enabled instruction file usage
  - Set up code formatting and linting on save
  - Recommended extensions for team consistency

**Phase 2: Event Store** (upcoming)
- Plan to use Copilot to generate event type definitions
- Auto-generate Dexie schema from TypeScript interfaces
- Create test fixtures for various event scenarios

**Phase 3-10:** (To be documented as development progresses)

---

## Testing Philosophy

**Decision: Minimal Testing for Event Sourcing**

Based on event sourcing best practices (Martin Dilger, Adam Dymitruk), properly designed event sourcing systems don't need extensive unit tests:
- Events are immutable facts - if stored correctly, the system is correct
- Projections are deterministic - same events always produce same state
- Business rules live in focused aggregates - easy to verify manually

### During Development
- Delete IndexedDB and restart fresh when schemas change
- Manual verification through the UI
- No migration scripts needed for MVP

### Integration Testing (If Needed)
- **Full Flow**: Command → Aggregate → Events → Projection → UI
- **AI Pipeline**: Goal input → AI refinement → Event generation
- **Photo Upload**: File → Blob → IndexedDB → Retrieval

### Tools (Optional, for future)
- **Integration**: Vitest for critical flows
- **E2E**: Playwright for user journeys (mobile app phase)

---

## Performance Targets

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Lighthouse Score**: > 90
- **Event Store Operations**: < 100ms
- **AI Refinement**: < 2s response
- **Photo Upload**: < 1s for 5MB image

---

## Future Roadmap (Post-Challenge)

### Flutter Mobile App
- [ ] Set up Flutter project
- [ ] Implement local event store (Drift SQLite)
- [ ] Build native UI with Material Design
- [ ] Add camera integration
- [ ] Implement rich notifications
- [ ] Create home screen widgets
- [ ] Build offline-first sync with Azure

### Cloud Backend
- [ ] Azure Functions for sync service
- [ ] Azure SignalR for real-time updates
- [ ] Azure Cosmos DB for global event store
- [ ] Azure Blob Storage for photos
- [ ] Authentication (Azure AD B2C)

### Advanced Features
- [ ] Health app integration (steps, sleep)
- [ ] Location-based reminders
- [ ] Share memories with family
- [ ] Goal templates marketplace
- [ ] Social features (optional)
- [ ] Premium tier with advanced AI

---

## Resources & References

### Documentation
- [Next.js 16 Docs](https://nextjs.org/docs)
- [Dexie.js Docs](https://dexie.org)
- [Azure OpenAI Docs](https://learn.microsoft.com/azure/ai-services/openai/)
- [shadcn/ui](https://ui.shadcn.com)

### Event Sourcing
- Martin Fowler: Event Sourcing
- Greg Young: CQRS & Event Sourcing
- Martin Dilger: "Understanding Eventsourcing"

### Design Inspiration
- Calm technology principles
- Nature-inspired color palettes
- Mindful productivity apps (Headspace, Calm)

---

## Team & Credits

- **Developer**: Aleksey Cherenkov
- **In Memory Of**: Stela (Pushok) 🐱
- **Built With**: GitHub Copilot CLI
- **Hosting**: Azure Static Web Apps
- **Domain**: pushok.life ✓

---

## License

MIT License - See LICENSE file

---

## Status Summary

**Current Phase**: Phase 1 Complete ✅ → UI Added ✅ → Phase 2 Starting (Event Store Implementation)
**Completion**: ~25% (Foundation + deployment + first UI complete)
**Next Milestone**: Working event store with goal creation
**Timeline**: ~1 week for GitHub Copilot CLI Challenge, then ongoing if useful
**Approach**: Journal/diary for meaningful living, not task manager

**Deployment Status:** 🎉 LIVE at https://pushok.life with beautiful homepage

**Key Decisions Made:**
- Single user (no auth) for MVP
- No unit tests (event sourcing philosophy)
- GPT-5-nano for AI (cost-optimized with prompt caching)
- No streaks (milestones instead)
- Gentle reminders like Stela
- SSR mode for Azure Static Web Apps (API routes support)
- Cloudflare DNS for pushok.life domain
- shadcn/ui with Neutral color scheme and calming nature colors

**Infrastructure Complete:**
- ✅ Next.js 16 with SSR mode
- ✅ Azure Static Web Apps (pushok-app)
- ✅ Azure OpenAI (pushok-openai) with GPT-5-nano
- ✅ Custom domain (pushok.life) with SSL
- ✅ GitHub Actions CI/CD pipeline
- ✅ Environment variables configured
- ✅ Auto-deployment on every push to main
- ✅ shadcn/ui components (Button, Card)
- ✅ Beautiful homepage with Stela's memorial

---

**Last Updated**: 2026-01-30
