# Demo Scripts

This folder contains Playwright scripts for creating demo data and recording demo videos.

## Scripts

### `test-playwright.spec.ts`
Basic test to verify Playwright setup is working.

### `seed-demo-data.ts` (Coming Soon)
Automated script to populate the app with realistic demo data:
- 5 aspirations
- 10 habits with progression over 4 weeks
- ~100 activity logs
- 3 projects with phases and photos
- 12 moments with photos

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

Place demo photos in the `demo-photos/` folder according to the plan in:
`~/.copilot/session-state/.../files/demo-plan.md`

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
