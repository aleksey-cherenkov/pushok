# Demo Scripts

Automated scripts for seeding demo data and recording walkthrough video.

## Prerequisites

1. Install dependencies: `npm install`
2. Install Playwright browsers: `npx playwright install chromium`
3. Start dev server: `npm run dev` (keep running)

## Quick Start

### Option 1: Seed + Manual Demo
```bash
# 1. Seed demo data
npx playwright test scripts/seed-demo-data.ts

# 2. Manually explore the app at http://localhost:3000
# 3. Record with OBS/screen recorder
```

### Option 2: Fully Automated Demo
```bash
# 1. Seed demo data
npx playwright test scripts/seed-demo-data.ts

# 2. Record automated walkthrough (1-2 min)
npx playwright test scripts/record-demo.ts

# 3. Find video: test-results/record-demo-*/video.webm
# 4. Add voiceover with ElevenLabs/Azure TTS
# 5. Combine in video editor (DaVinci Resolve, CapCut, ffmpeg)
```

## Planning

### `demo-plan.md`
Comprehensive plan for demo data:
- 5 aspirations
- 11 habits with 4-week progression
- 2 projects (Home Office, Garden)
- 12 moments with actual photos
- Demo script flow
- Photo requirements (18 total from `images/` folder)

## Scripts

### `seed-demo-data.ts`
Pre-populates app with realistic demo data:
- ✅ 5 aspirations (Be Present, Relationships, Physical Health, Creative Expression, Technology)
- ✅ 10 habits with progression data
- ✅ 2 projects (Home Office Setup COMPLETE, Garden & Nature IN PROGRESS)
- ✅ 12 moments with photos
- ✅ Stela values set
- ✅ Photo files copied to `public/demo-photos/`

**Run once before demo.**

### `record-demo.ts`
Automated 1-2 minute walkthrough:
- 🎯 **Act 1:** Dashboard - charts, projects (30s)
- 📝 **Act 2:** Log activity interaction (20s)
- 📊 **Act 3:** Habit detail with progression chart (20s)
- 🏗️ **Act 4:** Projects with photos (15s)
- 💛 **Act 5:** Stela Message (10s)
- 📖 **Finale:** About page with Stela photos (5s)

**Outputs:** `test-results/record-demo-*/video.webm`

### `test-playwright.spec.ts`
Basic test to verify Playwright setup is working.

## Demo Narration Script

Use this script for voiceover:

```
"Way Finder helps you track what matters—without the guilt.

This is the dashboard. Activity trends, resistance tracking, and projects—all in one view.

Logging an activity is simple. Just click, enter your data, and you're done.

Each habit shows your progression over time. Charts reveal your growth, not just numbers.

Projects track creative work with photos and phases. This home office? Fully complete.

And Stela Messages—gentle AI reminders of what truly matters to you.

Built with event sourcing. Local-first. No streaks, no pressure. Just meaningful progress.

Way Finder: Track your journey, your way."
```

## Voiceover Tools

### ElevenLabs (Recommended)
- Free tier: 10,000 characters/month
- Very natural voices
- https://elevenlabs.io

### Azure Text-to-Speech
- Already have Azure account
- Natural Neural voices
- https://azure.microsoft.com/en-us/products/ai-services/text-to-speech

### Your Own Voice
- Record with OBS Studio
- Clean up with Audacity
- Most authentic!

## Video Editing

### Combine Video + Audio

**ffmpeg (command line):**
```bash
ffmpeg -i video.webm -i voiceover.mp3 -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 demo-final.mp4
```

**DaVinci Resolve (free):**
1. Import video.webm
2. Import voiceover audio
3. Align on timeline
4. Export MP4

**CapCut (free, easy):**
1. Import video
2. Add audio track
3. Export

## Troubleshooting

**Seed script fails:**
- Ensure dev server is running: `npm run dev`
- Check `images/` folder has all 18 photos
- Clear IndexedDB: DevTools → Application → Storage → Clear site data

**Recording script fails:**
- Run seed script first
- Check Playwright config has `video: 'on'`
- Increase timeouts if app is slow

**No video generated:**
- Check `playwright.config.ts` has `video: 'on'`
- Look in `test-results/` folder
- Check console for errors

## Notes

- Seed script creates foundation data
- Recording shows app "lived in" with rich data
- Only 1-2 interactions shown (logging activity)
- Focus on features, not data entry
- Video is silent - add voiceover separately
- Total demo: ~90 seconds
