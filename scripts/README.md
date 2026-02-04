# Demo Scripts

This folder contains Playwright scripts for creating demo data and recording demo videos.

## Planning

### `demo-plan.md`
Comprehensive plan for demo data including:
- 5 aspirations
- 10 habits with 4-week progression
- 3 projects with phases
- 12 moments
- Demo script flow (~12 minutes)
- Photo requirements (23 total)

## Scripts

### `test-playwright.spec.ts`
Basic test to verify Playwright setup is working.

### `seed-demo-data.ts` (Coming Soon)
Automated script to populate the app with realistic demo data based on demo-plan.md.

### `record-demo.ts` (Coming Soon)
Automated script to record a demo video showing all app features.

## Usage

```bash
# Run the basic test
npm run test:playwright

# Seed demo data (once created)
npx playwright test scripts/seed-demo-data.ts

# Record demo video (once created)
npx playwright test scripts/record-demo.ts
```

## Photos

Place demo photos in the `demo-photos/` folder according to the plan in `demo-plan.md`.

Required structure:
```
demo-photos/
  projects/
    home-office/
    watercolor/
    garden/
  moments/
    cat-sunbeam.jpg
    first-snow.jpg
    ...
```
