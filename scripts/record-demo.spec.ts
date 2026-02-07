/**
 * Demo Recording Script
 * 
 * Automated walkthrough of Way Finder features (1-2 minutes)
 * 
 * Prerequisites:
 * 1. Run seed-demo-data.ts first
 * 2. Start dev server: npm run dev
 * 3. Run this: npx playwright test record-demo.ts
 * 
 * Output: Video file in test-results/ folder
 */

import { test, expect } from '@playwright/test';

test.describe('Way Finder Demo', () => {
  test('should record 1-2 minute demo walkthrough', async ({ page, context }) => {
    test.slow(); // Give extra time for recording

    console.log('🎬 Starting demo recording...');
    console.log('📹 Video will be saved to test-results/');
    console.log('🌐 URL bar will be visible in recording');

    // ACT 1: Dashboard - Charts & Projects (30 seconds)
    console.log('\n🎯 Act 1: Dashboard (30s)');
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Pause for viewing

    // Scroll to show all charts
    await page.evaluate(() => window.scrollTo(0, 200));
    await page.waitForTimeout(2000);

    // Click period filter
    await page.click('button:has-text("Month")');
    await page.waitForTimeout(1500);

    // Scroll to projects
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(2000);

    // ACT 2: Log an Activity (20 seconds)
    console.log('\n📝 Act 2: Log Activity (20s)');
    await page.goto('http://localhost:3000/today');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    // Click on a habit card to log activity
    const habitCard = page.locator('text=Pushups').first();
    if (await habitCard.isVisible()) {
      await habitCard.click();
      await page.waitForTimeout(1000);

      // Fill in the activity log
      await page.fill('input[type="number"]', '52');
      await page.waitForTimeout(500);

      // Add a note
      const noteField = page.locator('textarea[placeholder*="note"]').first();
      if (await noteField.isVisible()) {
        await noteField.fill('Feeling strong today! 💪');
        await page.waitForTimeout(500);
      }

      // Log the activity
      await page.click('button:has-text("Log Activity")');
      await page.waitForTimeout(2000);
    }

    // ACT 3: Habit Detail Page - Progression Chart (20 seconds)
    console.log('\n📊 Act 3: Habit Detail (20s)');
    await page.goto('http://localhost:3000/habits');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    // Click into a habit detail
    const pushupHabit = page.locator('text=Pushups').first();
    if (await pushupHabit.isVisible()) {
      await pushupHabit.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2500);

      // Scroll to show chart
      await page.evaluate(() => window.scrollTo(0, 200));
      await page.waitForTimeout(2000);

      // Scroll to activity history
      await page.evaluate(() => window.scrollTo(0, 500));
      await page.waitForTimeout(1500);
    }

    // ACT 4: Projects with Photos (15 seconds)
    console.log('\n🏗️ Act 4: Projects (15s)');
    await page.goto('http://localhost:3000/projects');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    // Click into first project
    const firstProject = page.locator('article').first();
    if (await firstProject.isVisible()) {
      await firstProject.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);

      // Scroll to show photos
      await page.evaluate(() => window.scrollTo(0, 300));
      await page.waitForTimeout(2000);
    }

    // ACT 5: Stela Message (10 seconds)
    console.log('\n💛 Act 5: Stela Message (10s)');
    await page.goto('http://localhost:3000/today');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    // Scroll to Stela message if visible
    const stelaMessage = page.locator('text="Stela Says"').first();
    if (await stelaMessage.isVisible()) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(2500);
    }

    // Final: About page (5 seconds)
    console.log('\n📖 Finale: About (5s)');
    await page.goto('http://localhost:3000/about');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Scroll to show Stela photos
    await page.evaluate(() => window.scrollTo(0, 300));
    await page.waitForTimeout(2000);

    console.log('\n✅ Demo recording complete!');
    console.log('📹 Check test-results/ for video file');
    console.log('🎙️ Next: Add voiceover with ElevenLabs or Azure TTS');
  });
});
