# Way Finder - Finding Your Path to What Matters

*This is a submission for the [GitHub Copilot CLI Challenge](https://dev.to/challenges/github-2026-01-21)*

---

## What I Built

**Way Finder** (codename: Pushok) is a mindful journaling and goal-tracking application built as a heartfelt alternative to stressful productivity apps. Named after Stela, my beloved cat who taught me that life's most meaningful moments are often the simplest ones—sunshine, nature, presence, and love.

### The Problem

We spend hours chasing virtual rewards in games while neglecting the real rewards in life. Productivity apps add stress with:
- Broken streak anxiety
- Constant notifications
- FOMO mechanics
- Task-focused pressure

### The Solution

Way Finder helps you:
- 🎯 **Define meaningful goals** with AI assistance (not just tasks)
- 📸 **Capture photo memories** tied to life goals
- 📓 **Reflect weekly/monthly/yearly** (journal style, not daily pressure)
- 🌿 **Gentle reminders** like Stela - encouraging, never guilt-tripping
- ✨ **Milestones, not streaks** - celebrate progress without stress

### Why It Matters

After losing Stela, I realized how much time I spent on "urgent" things instead of what truly matters. Way Finder is my answer to that problem - a tool that helps you discover and navigate toward relationships, nature, self-improvement, and intentional living.

### Technical Innovation

Built with **Event Sourcing** architecture - every goal change, activity, and moment is stored as an immutable event. This means:
- Complete audit trail of your journey
- Time-travel through your progress
- Rich analytics and pattern insights
- Foundation for future mobile sync
- No unit tests needed - events are the source of truth

---

## Demo

🌐 **Live Demo**: https://pushok.life ✅

### Screenshots

*(Coming soon as features are built)*

**Current Status:** Phase 1 Complete - Full deployment infrastructure live!

### Video Walkthrough

*(Coming soon - planned for final submission)*

---

## My Experience with GitHub Copilot (CLI, Chat, and Azure Copilot)

### Copilot Tools Used

This project leveraged the entire GitHub Copilot ecosystem:

1. **GitHub Copilot CLI** (Primary) - Terminal-based development assistant
   - Architecture decisions and planning
   - Research and comparisons
   - Documentation generation
   - Deployment troubleshooting

2. **GitHub Copilot Chat** (VS Code) - In-editor assistance
   - Code generation and completion
   - Quick syntax help
   - Refactoring suggestions

3. **Azure Copilot** (Azure Portal) - Cloud resource configuration
   - Double-checking Azure Static Web Apps settings
   - Verifying OpenAI deployment configuration
   - Resource navigation help

4. **Copilot.microsoft.com** - Web-based research
   - Cross-checking technical decisions
   - Exploring Azure features
   - Documentation lookup

### My Background Coming Into This

**Previous Experience:**
- ✅ Deployed first Azure Static Web App one month ago (static HTML site)
- ✅ Used GitHub Copilot Chat for that deployment

**First Time with This Project:**
- 🆕 **First Node.js deployment** to Azure
- 🆕 **First React/Next.js app** on Azure Static Web Apps
- 🆕 **First custom DNS configuration** (pushok.life)
- 🆕 **First Azure OpenAI integration**
- 🆕 **First SSR deployment** (vs static HTML)
- 🆕 **First Event Sourcing architecture**
- 🆕 **First comprehensive CI/CD pipeline**

This made GitHub Copilot CLI especially valuable—I was learning several new technologies simultaneously.

### How I Used GitHub Copilot CLI

#### 1. **Project Initialization & Architecture** 🏗️

**Challenge:** Setting up Next.js 16 with the latest features (App Router, Turbopack, SSR) while choosing the right architecture pattern.

**Copilot CLI Impact:**
```bash
# Used Copilot CLI to:
- Generate Next.js 16 project with optimal configuration
- Scaffold TypeScript strict mode setup
- Research and implement Event Sourcing patterns
- Create comprehensive architecture documentation
```

**Result:** Within hours, I had a solid foundation with proper TypeScript, Tailwind CSS 4, and event sourcing architecture documented in ARCHITECTURE.md.

#### 2. **Azure Deployment Configuration** ☁️

**Challenge:** First time deploying Node.js/React to Azure Static Web Apps. Previous experience was just static HTML. Now needed to:
- Choose between static export vs SSR mode
- Configure custom domain (first time with DNS)
- Set up Azure OpenAI integration (completely new)
- Choose the optimal AI model

**Copilot Tools Used:**
- **Copilot CLI**: Researched deployment options, generated deployment guide
- **Azure Copilot**: Verified settings in Azure Portal
- **Copilot.microsoft.com**: Cross-checked technical decisions

**Copilot CLI Impact:**
- Researched latest Azure Static Web Apps features
- Compared deployment modes and recommended SSR for API routes (new to me!)
- Investigated GPT-4o-mini vs GPT-4.1-nano vs GPT-5-nano pricing
- Discovered GPT-5-nano with 90% prompt caching discount (67% cheaper!)
- Generated comprehensive DEPLOYMENT.md guide (580 lines)

**Azure Copilot Impact:**
- Helped navigate new Azure Portal interface (different from static HTML deployment)
- Verified environment variable configuration
- Confirmed custom domain setup steps

**Result:** Successfully deployed Node.js/React app with SSR, custom domain, and OpenAI integration—all firsts for me. Saved ~$15-20/month by using GPT-5-nano instead of GPT-4o-mini.

#### 3. **Research & Decision Making** 🔍

**Example: AI Model Selection**

I asked Copilot CLI: *"What's the best Azure OpenAI model for goal refinement?"*

Copilot researched and compared:
- GPT-4o-mini: $0.15/$0.60 per M tokens
- GPT-4.1-nano: $0.10/$0.40 per M tokens
- GPT-5-nano: $0.05/$0.40 per M tokens + 90% caching

**Impact:** Chose GPT-5-nano, reducing monthly AI costs from $5-20 to $1-5.

**Example: Deployment Mode Decision**

Instead of guessing, I asked: *"Static export vs SSR for Azure Static Web Apps?"*

Copilot provided a detailed comparison table and recommended SSR because:
- ✅ API routes work (needed for Azure OpenAI)
- ✅ Environment secrets stay server-side
- ✅ No config changes needed
- ✅ Better image optimization

**Impact:** Avoided a dead-end with static export that would have broken AI integration.

#### 4. **Documentation Generation** 📝

**Challenge:** Creating comprehensive, consistent documentation across multiple files.

**Copilot CLI Generated:**
- README.md (290 lines) - Project overview, features, tech stack
- ARCHITECTURE.md (860 lines) - Event sourcing patterns, data flow, projections
- PROJECT.md (515 lines) - Implementation roadmap, phase tracking, decisions
- DEPLOYMENT.md (580 lines) - Complete Azure deployment guide
- GETTING_STARTED.md - Development workflow

**Result:** Professional-grade documentation that would typically take days, completed in hours. Documentation stays consistent across all files.

#### 5. **Real-Time Updates & Corrections** 🔄

**Example:** When I reported Azure UI changes:
> "When I click 'Go to Azure OpenAI Studio' I don't see it, I only see 'Go to Foundry portal'"

Copilot CLI immediately:
- Updated DEPLOYMENT.md to reflect current Azure interface
- Kept legacy instructions as fallback
- Updated model deployment steps

**Impact:** Documentation stays current with evolving Azure interfaces.

### Key Benefits I Experienced

#### 🚀 **Speed**
- Phase 1 (foundation + full deployment) completed in 1 day
- Typical timeline without Copilot: 3-5 days minimum

#### 💡 **Learning**
- Discovered Event Sourcing patterns I wouldn't have known
- Learned about Azure Static Web Apps SSR mode
- Found GPT-5-nano (newest, cheapest model)

#### 🎯 **Decision Quality**
- Data-driven choices (pricing comparisons, feature matrices)
- Avoided costly mistakes (wrong deployment mode, expensive AI model)
- Best practices applied from the start

#### 📚 **Documentation**
- Comprehensive docs generated alongside code
- Consistent formatting and terminology
- Easy to update as project evolves

#### 🔧 **Problem Solving**
- Quick answers to "how do I..." questions
- Troubleshooting deployment issues
- Understanding error messages

### Specific Copilot CLI Features Used

1. **Web Search Integration** 🌐
   - Researched Azure OpenAI model pricing (2026 rates)
   - Found GPT-5-nano release info and features
   - Compared deployment options with current data

2. **Code Generation** 💻
   - Event sourcing TypeScript interfaces
   - Dexie.js schema examples
   - GitHub Actions workflow templates

3. **Documentation Tools** 📖
   - Generated markdown with proper formatting
   - Created comparison tables
   - Structured multi-file documentation

4. **Interactive Q&A** 💬
   - Clarifying questions about deployment steps
   - Explaining technical concepts
   - Recommending best practices

### Development Workflow with Copilot CLI

**My Typical Flow:**

1. **Plan Phase**
   ```bash
   # Ask Copilot to create implementation plan
   "Create plan for event store implementation with Dexie.js"
   ```

2. **Research Phase**
   ```bash
   # Copilot researches latest best practices
   "What's the best way to handle event sourcing in TypeScript?"
   ```

3. **Implementation Phase**
   ```bash
   # Copilot generates starter code
   "Create base aggregate class with event replay"
   ```

4. **Documentation Phase**
   ```bash
   # Copilot updates docs as I build
   "Update PROJECT.md with completed deployment tasks"
   ```

5. **Deployment Phase**
   ```bash
   # Copilot troubleshoots issues
   "Explain 'Post Run actions/checkout@v3' error"
   ```

### Moments Where Copilot CLI Saved the Day

#### 🎯 **The Model Selection Breakthrough**

Initially planned to use GPT-4o-mini based on older documentation. Asked Copilot about newer models:

> "How about gpt-4.1-nano gpt-5-nano gpt-4.1-mini gpt-5-mini?"

Copilot researched and found:
- GPT-5-nano exists (released Aug 2025)
- 67% cheaper than GPT-4o-mini
- 90% caching discount for system prompts
- Perfect for my use case

**Savings:** ~$180/year in AI costs for personal use

#### 🌐 **The Network Configuration Mystery**

When creating Azure OpenAI resource, stuck on Network tab:

> "How do I configure Network tab, selected networks or disabled?"

Copilot explained:
- "All networks" is correct for Azure Static Web Apps
- Why other options won't work (complex IP management)
- Security still protected by API keys

**Impact:** Avoided hours debugging network connectivity issues

#### 📋 **The Documentation Consistency Win**

After deploying, I said:

> "Update progress in all markdown files"

Copilot CLI:
- Found all 6 markdown files
- Updated completion status consistently
- Added deployment date and live URLs
- Marked Phase 1 complete across all docs

**Impact:** Maintained documentation quality without manual grep/replace nightmares

### What I Learned

1. **The Copilot Ecosystem Works Together**
   - **CLI** for planning, research, and documentation
   - **Chat** for in-editor code assistance
   - **Azure Copilot** for cloud configuration
   - **Copilot.microsoft.com** for verification
   - Each tool fills a specific role

2. **Copilot CLI is a Research Partner**
   - Not just code generation, but informed decision-making
   - Real-time web search gives current, accurate info
   - Compares options with pros/cons

3. **Documentation Becomes Easy**
   - Generates comprehensive docs alongside code
   - Keeps multiple files in sync
   - Updates as project evolves

4. **Cost Optimization**
   - Found GPT-5-nano (67% cheaper)
   - Recommended SSR over more expensive static functions
   - Identified free tier Azure resources

5. **Faster Learning Curve for New Technologies**
   - First Node.js deployment → guided step-by-step
   - First React/Next.js app → architecture explained
   - First custom DNS → configuration simplified
   - First OpenAI integration → model selection optimized
   - Event sourcing patterns explained clearly

### Challenges Overcome with Copilot CLI

| Challenge | First Time? | Without Copilot | With Copilot Ecosystem |
|-----------|-------------|----------------|------------------------|
| Azure Static Web Apps deployment | No (2nd time) | 2-3 days research | 4 hours with guide |
| Node.js/React on Azure | **Yes** | 3-5 days trial/error | 1 day with CLI + Chat |
| Custom DNS configuration | **Yes** | 1-2 days setup | 2 hours with guide |
| Azure OpenAI integration | **Yes** | Week of learning | Same day with CLI |
| Choosing AI model | **Yes** | Trial and error | Research in minutes |
| Event sourcing architecture | **Yes** | Week of reading | Hours with examples |
| SSR vs Static export | **Yes** | Guess and troubleshoot | Instant comparison |
| Documentation | - | Days of writing | Generated alongside |
| Deployment troubleshooting | - | Stack Overflow digging | Instant explanations |

**Key Insight:** Having done one static HTML deployment helped, but adding Node.js, React, custom DNS, and OpenAI made this exponentially more complex. The Copilot ecosystem (CLI, Chat, Azure Copilot) made tackling all these "firsts" manageable.

---

## Technical Stack

Built with modern, cost-optimized technologies:

- **Framework**: Next.js 16 (App Router, SSR, Turbopack)
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 4
- **Database**: IndexedDB (Dexie.js) - local-first, privacy by default
- **State**: Zustand + Event Sourcing
- **AI**: Azure OpenAI (GPT-5-nano with 90% prompt caching)
- **Hosting**: Azure Static Web Apps (Free tier)
- **CI/CD**: GitHub Actions (auto-created)
- **Domain**: pushok.life (Cloudflare DNS)
- **Cost**: $1-5/month (AI + hosting)

---

## Project Status

### ✅ Phase 1: Foundation & Deployment (COMPLETE)
- [x] Next.js 16 project setup
- [x] Event sourcing architecture designed
- [x] Azure Static Web Apps configured
- [x] Azure OpenAI GPT-5-nano deployed
- [x] Custom domain with SSL (pushok.life)
- [x] GitHub Actions CI/CD pipeline
- [x] Comprehensive documentation (4 markdown files, 2,225+ lines)

**Live:** https://pushok.life ✅

### ✅ Phase 2: Event Store Implementation (COMPLETED) 🎉
- [x] Dexie.js event store with IndexedDB
- [x] Base aggregate class with event replay
- [x] Goal aggregate with create/update/archive commands
- [x] Event type definitions and TypeScript interfaces
- [x] Event sourcing foundation ready for UI

### 🔄 Phase 3: Goal Management UI (IN PROGRESS)
- [ ] GoalForm component for create/edit
- [ ] GoalList and GoalCard components
- [ ] Goals page with full CRUD
- [ ] Zustand store integration

### 📋 Upcoming Phases
- Phase 4: Journal & Reflections
- Phase 5: Photo Timeline
- Phase 6: Activity Tracking
- Phase 7: Gentle Reminder System
- Phase 8: AI Goal Refinement
- Phase 9: Dashboard & Analytics
- Phase 10: UI/UX Polish

---

## How GitHub Copilot CLI Changed My Approach

### Before Copilot CLI:
1. Google each question individually
2. Read through Stack Overflow threads
3. Piece together solutions from multiple sources
4. Trial and error with configuration
5. Documentation as afterthought

### With Copilot CLI:
1. Ask comprehensive questions in natural language
2. Get researched, compared answers with current data
3. Receive complete solutions with explanations
4. Generate documentation alongside development
5. Iterate quickly with instant feedback

**Result:** Building with confidence instead of guesswork.

---

## Lessons for Other Developers

### 1. **Use the Entire Copilot Ecosystem**
Each tool has strengths:
- **CLI**: Planning, research, documentation, complex decisions
- **Chat**: In-editor code completion, quick syntax help
- **Azure Copilot**: Navigating cloud portal, verifying settings
- **Copilot.microsoft.com**: Cross-checking and documentation

Don't rely on just one—use all four strategically.

### 2. **Use Copilot CLI for Research, Not Just Code**
The web search integration is powerful for:
- Comparing technology options
- Finding latest pricing/features (saved me $180/year!)
- Understanding best practices
- Making informed decisions

### 3. **Generate Documentation Early**
Don't wait until the end. Ask Copilot to create docs as you build:
- Architecture decisions
- Deployment guides
- API documentation
- Decision logs

### 4. **Ask "Why" Questions**
Don't just accept suggestions. Ask:
- "Why is SSR better than static export?"
- "Why choose GPT-5-nano over GPT-4o-mini?"
- "Why event sourcing for this use case?"

Copilot CLI explains the reasoning, helping you learn.

### 4. **Use It for Planning**
Before coding, ask for:
- Implementation plans
- Phase breakdowns
- Technology comparisons
- Architecture patterns

### 5. **Leverage Multi-Turn Conversations**
Build context across multiple questions:
```
Q: "What's the best Azure OpenAI model?"
A: [Recommends GPT-4o-mini]

Q: "How about newer models like GPT-5-nano?"
A: [Researches, finds better option]

Q: "Update all docs to use GPT-5-nano"
A: [Updates 6 files consistently]
```

### 6. **Double-Check with Multiple Copilot Tools**
When learning something new (like first custom DNS setup):
- Use **CLI** for step-by-step guide
- Verify settings with **Azure Copilot** in portal
- Cross-reference with **Copilot.microsoft.com**
- Get in-editor help from **Chat**

This multi-tool verification builds confidence when doing something for the first time.

---

## What's Next

### Immediate Goals
- [ ] Implement event store with Dexie.js
- [ ] Build goal creation UI
- [ ] Integrate Azure OpenAI for goal refinement
- [ ] Add photo upload and timeline
- [ ] Create gentle reminder system

### Future Vision
- Flutter mobile app (where photos truly shine)
- Cloud sync with Azure Functions
- Family sharing features
- Premium tier with advanced AI insights

### Challenge Submission
- [ ] Record comprehensive demo video
- [ ] Create screenshot gallery
- [ ] Document Copilot CLI usage examples
- [ ] Final polish and testing

---

## Repository

**GitHub**: [aleksey-cherenkov/pushok](https://github.com/aleksey-cherenkov/pushok)

**Documentation**:
- [README.md](./README.md) - Project overview
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Event sourcing design
- [PROJECT.md](./PROJECT.md) - Implementation roadmap
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Azure deployment guide
- [GETTING_STARTED.md](./GETTING_STARTED.md) - Development setup

---

## Dedication

> **In memory of Stela (Pushok)** 🐱
> 
> Who taught us that the best moments in life are simple:
> sunshine, nature, birds and squirrels, presence, and love.
> 
> This app is a journal for meaningful living—gentle like Stela,
> reminding us to focus on what truly matters.

---

## Acknowledgments

- **GitHub Copilot CLI** - For being an incredible development partner
- **Azure Static Web Apps** - For generous free tier
- **Azure OpenAI** - For making AI assistance affordable
- **Next.js Team** - For amazing framework
- **Event Sourcing Community** - For architectural insights

---

*Built with ❤️ and GitHub Copilot CLI*

**Status:** Active Development | **Phase:** 1 Complete (20%) | **Live:** https://pushok.life

---

**Last Updated:** 2026-01-31
