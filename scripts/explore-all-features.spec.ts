import { test, expect } from '@playwright/test';

test.describe('Explore Way Finder Features', () => {
  test('comprehensive feature documentation', async ({ page }) => {
    test.setTimeout(180000); // 3 minutes for full exploration
    console.log('\n🔍 COMPREHENSIVE FEATURE EXPLORATION\n');
    console.log('Connecting to Edge with existing data...\n');

    // Navigate to app
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);

    // ========================================
    // PHASE 1: COMPLETE HABIT CREATION FLOW
    // ========================================
    console.log('\n📝 PHASE 1: COMPLETE HABIT CREATION FLOW\n');

    await page.goto('http://localhost:3000/habits');
    await page.waitForTimeout(2000);
    
    console.log('📸 Screenshot: Habits page with existing data');
    await page.screenshot({ path: 'test-results/explore-01-habits-initial.png', fullPage: true });

    // Count existing habits
    const habitElements = await page.locator('h3, h2').allTextContents();
    const existingHabits = habitElements.filter(t => t && t.length > 5 && !t.includes('Habit'));
    console.log(`\nExisting habits count: ${existingHabits.length}`);
    if (existingHabits.length > 0) {
      console.log('Habits found:');
      existingHabits.forEach((h, i) => console.log(`  ${i + 1}. ${h}`));
    }

    // Start creation flow
    console.log('\n▶ Starting habit creation...');
    const newHabitBtn = page.locator('button').filter({ hasText: /new habit/i }).first();
    await newHabitBtn.click();
    await page.waitForTimeout(1000);

    console.log('📸 Screenshot: Modal opened');
    await page.screenshot({ path: 'test-results/explore-02-modal-opened.png', fullPage: true });

    // Enter text
    const textInput = page.locator('input[type="text"], textarea').first();
    await textInput.fill('Evening Reading - 30 minutes before bed');
    await page.waitForTimeout(500);

    console.log('📸 Screenshot: Text entered');
    await page.screenshot({ path: 'test-results/explore-03-text-entered.png', fullPage: true });

    // Click Generate
    const generateBtn = page.locator('button').filter({ hasText: /generate/i }).first();
    await generateBtn.click();
    
    console.log('⏳ Waiting for AI response (20 seconds)...');
    await page.waitForTimeout(20000);

    console.log('📸 Screenshot: AI suggestions appeared');
    await page.screenshot({ path: 'test-results/explore-04-ai-suggestions.png', fullPage: true });

    // Find and click "Create Habit" button
    console.log('\n▶ Looking for "Create Habit" button...');
    const createHabitBtn = page.locator('button').filter({ hasText: /create habit/i }).first();
    const isVisible = await createHabitBtn.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (isVisible) {
      console.log('✅ Found "Create Habit" button - clicking...');
      await createHabitBtn.click();
      await page.waitForTimeout(2000);

      console.log('📸 Screenshot: After clicking Create Habit');
      await page.screenshot({ path: 'test-results/explore-05-habit-saved.png', fullPage: true });

      // Verify new habit appears
      const updatedHabits = await page.locator('h3, h2').allTextContents();
      const newCount = updatedHabits.filter(t => t && t.length > 5 && !t.includes('Habit')).length;
      console.log(`✅ Habit count after creation: ${newCount} (was ${existingHabits.length})`);
    } else {
      console.log('⚠️ "Create Habit" button not found - documenting what\'s visible');
      const allButtons = await page.locator('button').allTextContents();
      console.log('Visible buttons:', allButtons);
    }

    // ========================================
    // PHASE 2: EXPLORE ASPIRATIONS
    // ========================================
    console.log('\n\n🎯 PHASE 2: EXPLORE ASPIRATIONS\n');

    await page.goto('http://localhost:3000/aspirations');
    await page.waitForTimeout(2000);

    console.log('📸 Screenshot: Aspirations page');
    await page.screenshot({ path: 'test-results/explore-06-aspirations-page.png', fullPage: true });

    // Count existing aspirations
    const aspElements = await page.locator('h3, h2').allTextContents();
    console.log(`\nAspirations count: ${aspElements.filter(t => t && t.length > 3).length}`);
    
    // Find create button
    const createAspBtn = page.locator('button').filter({ hasText: /new|create|add/i }).first();
    const aspBtnExists = await createAspBtn.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (aspBtnExists) {
      console.log('✅ Found create aspiration button');
      const btnText = await createAspBtn.textContent();
      console.log(`Button text: "${btnText}"`);
      
      // Click to see creation flow
      await createAspBtn.click();
      await page.waitForTimeout(1000);

      console.log('📸 Screenshot: Aspiration creation modal/form');
      await page.screenshot({ path: 'test-results/explore-07-aspiration-create.png', fullPage: true });

      // Document form fields
      const inputs = await page.locator('input, textarea, select').all();
      console.log(`\nForm fields found: ${inputs.length}`);
      
      for (let i = 0; i < Math.min(inputs.length, 5); i++) {
        const placeholder = await inputs[i].getAttribute('placeholder');
        const name = await inputs[i].getAttribute('name');
        console.log(`  Field ${i + 1}: name="${name}", placeholder="${placeholder}"`);
      }

      // Close modal/cancel
      const cancelBtn = page.locator('button').filter({ hasText: /cancel|close/i }).first();
      const canCancel = await cancelBtn.isVisible({ timeout: 1000 }).catch(() => false);
      if (canCancel) {
        await cancelBtn.click();
        await page.waitForTimeout(500);
      }
    } else {
      console.log('⚠️ No create button found on aspirations page');
      const allText = await page.textContent('body');
      console.log('Page content sample:', allText?.substring(0, 300));
    }

    // ========================================
    // PHASE 3: EXPLORE PROJECTS
    // ========================================
    console.log('\n\n📋 PHASE 3: EXPLORE PROJECTS\n');

    await page.goto('http://localhost:3000/projects');
    await page.waitForTimeout(2000);

    console.log('📸 Screenshot: Projects page');
    await page.screenshot({ path: 'test-results/explore-08-projects-page.png', fullPage: true });

    // Count existing projects
    const projElements = await page.locator('h3, h2, h1').allTextContents();
    console.log(`\nProjects visible: ${projElements.filter(t => t && t.length > 3).length}`);
    
    // Find create button
    const createProjBtn = page.locator('button').filter({ hasText: /new|create|add/i }).first();
    const projBtnExists = await createProjBtn.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (projBtnExists) {
      console.log('✅ Found create project button');
      const btnText = await createProjBtn.textContent();
      console.log(`Button text: "${btnText}"`);
      
      // Click to see creation flow
      await createProjBtn.click();
      await page.waitForTimeout(1000);

      console.log('📸 Screenshot: Project creation modal/form');
      await page.screenshot({ path: 'test-results/explore-09-project-create.png', fullPage: true });

      // Document form fields
      const inputs = await page.locator('input, textarea, select').all();
      console.log(`\nForm fields found: ${inputs.length}`);
      
      for (let i = 0; i < Math.min(inputs.length, 10); i++) {
        const placeholder = await inputs[i].getAttribute('placeholder');
        const name = await inputs[i].getAttribute('name');
        const type = await inputs[i].getAttribute('type');
        console.log(`  Field ${i + 1}: type="${type}", name="${name}", placeholder="${placeholder}"`);
      }

      // Look for photo upload
      const fileInput = page.locator('input[type="file"]');
      const hasFileUpload = await fileInput.isVisible({ timeout: 1000 }).catch(() => false);
      console.log(`\nPhoto upload field: ${hasFileUpload ? '✅ Found' : '❌ Not found'}`);

      // Close modal/cancel
      const cancelBtn = page.locator('button').filter({ hasText: /cancel|close/i }).first();
      const canCancel = await cancelBtn.isVisible({ timeout: 1000 }).catch(() => false);
      if (canCancel) {
        await cancelBtn.click();
        await page.waitForTimeout(500);
      }
    } else {
      console.log('⚠️ No create button found on projects page');
    }

    // ========================================
    // PHASE 4: EXPLORE ACTIVITY LOGGING
    // ========================================
    console.log('\n\n📊 PHASE 4: EXPLORE ACTIVITY LOGGING\n');

    await page.goto('http://localhost:3000/habits');
    await page.waitForTimeout(2000);

    // Click on first habit to see detail
    const firstHabit = page.locator('article, [class*="card"]').first();
    const habitExists = await firstHabit.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (habitExists) {
      console.log('▶ Clicking on first habit to see detail...');
      await firstHabit.click();
      await page.waitForTimeout(2000);

      console.log('📸 Screenshot: Habit detail page');
      await page.screenshot({ path: 'test-results/explore-10-habit-detail.png', fullPage: true });

      // Look for "Log Activity" button
      const logBtn = page.locator('button').filter({ hasText: /log|track|add|check/i }).first();
      const logBtnExists = await logBtn.isVisible({ timeout: 2000 }).catch(() => false);
      
      if (logBtnExists) {
        console.log('✅ Found activity logging button');
        const btnText = await logBtn.textContent();
        console.log(`Button text: "${btnText}"`);
        
        await logBtn.click();
        await page.waitForTimeout(1000);

        console.log('📸 Screenshot: Activity logging form');
        await page.screenshot({ path: 'test-results/explore-11-log-activity.png', fullPage: true });

        // Document form
        const inputs = await page.locator('input, textarea, select, button').all();
        console.log(`\nForm elements found: ${inputs.length}`);
        
        // Close
        const cancelBtn = page.locator('button').filter({ hasText: /cancel|close/i }).first();
        const canCancel = await cancelBtn.isVisible({ timeout: 1000 }).catch(() => false);
        if (canCancel) {
          await cancelBtn.click();
          await page.waitForTimeout(500);
        }
      } else {
        console.log('⚠️ No log activity button found');
        const allButtons = await page.locator('button').allTextContents();
        console.log('Available buttons:', allButtons);
      }
    } else {
      console.log('⚠️ No habits found to click on');
    }

    // ========================================
    // PHASE 5: EXPLORE DASHBOARD
    // ========================================
    console.log('\n\n📈 PHASE 5: EXPLORE DASHBOARD\n');

    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);

    console.log('📸 Screenshot: Dashboard/home page');
    await page.screenshot({ path: 'test-results/explore-12-dashboard.png', fullPage: true });

    // Document visible sections
    const headings = await page.locator('h1, h2, h3').allTextContents();
    console.log('\nDashboard sections:');
    headings.forEach((h, i) => {
      if (h && h.trim().length > 0) {
        console.log(`  ${i + 1}. ${h.trim()}`);
      }
    });

    // Look for charts
    const svgElements = await page.locator('svg').count();
    console.log(`\nCharts/graphs found: ${svgElements}`);

    console.log('\n\n✅ EXPLORATION COMPLETE\n');
    console.log('📸 12 screenshots saved to test-results/');
    console.log('\nNext: Review screenshots and create final demo script\n');
  });
});
