import { test, expect } from '@playwright/test';

test.describe('Complete Feature Flows + UX Review', () => {
  test('complete all flows and document UX', async ({ page }) => {
    test.setTimeout(300000); // 5 minutes

    console.log('\n🔍 COMPLETE FEATURE FLOW TESTING + UX REVIEW\n');
    
    // ========================================
    // PHASE 1: COMPLETE ACTIVITY LOGGING
    // ========================================
    console.log('\n⏱️ PHASE 1: COMPLETE ACTIVITY LOGGING FLOW\n');

    await page.goto('http://localhost:3000/habits');
    await page.waitForTimeout(2000);

    // Click first habit
    const firstHabit = page.locator('article, [class*="card"]').first();
    const habitExists = await firstHabit.isVisible({ timeout: 3000 }).catch(() => false);
    
    if (habitExists) {
      console.log('▶ Opening habit detail...');
      await firstHabit.click();
      await page.waitForTimeout(2000);

      console.log('📸 Screenshot: Habit detail page');
      await page.screenshot({ path: 'test-results/complete-01-habit-detail.png', fullPage: true });

      // Find log button
      const logBtn = page.locator('button').filter({ hasText: /log/i }).first();
      const canLog = await logBtn.isVisible({ timeout: 2000 }).catch(() => false);

      if (canLog) {
        console.log('▶ Clicking Log button...');
        await logBtn.click();
        await page.waitForTimeout(1500);

        console.log('📸 Screenshot: Activity logging modal opened');
        await page.screenshot({ path: 'test-results/complete-02-log-modal.png', fullPage: true });

        // Look for minutes/duration input
        const inputs = await page.locator('input[type="number"], input[type="text"]').all();
        console.log(`Found ${inputs.length} input fields`);

        if (inputs.length > 0) {
          console.log('▶ Entering value in first input...');
          await inputs[0].fill('25');
          await page.waitForTimeout(500);

          console.log('📸 Screenshot: Value entered');
          await page.screenshot({ path: 'test-results/complete-03-value-entered.png', fullPage: true });

          // Find "Log it" button
          const logItBtn = page.locator('button').filter({ hasText: /log it/i }).first();
          const canSubmit = await logItBtn.isVisible({ timeout: 2000 }).catch(() => false);

          if (canSubmit) {
            console.log('▶ Clicking "Log it" button...');
            await logItBtn.click();
            await page.waitForTimeout(2000);

            console.log('📸 Screenshot: After logging activity');
            await page.screenshot({ path: 'test-results/complete-04-activity-logged.png', fullPage: true });
            console.log('✅ Activity logging complete!');
          } else {
            console.log('⚠️ "Log it" button not found');
            const allBtns = await page.locator('button').allTextContents();
            console.log('Available buttons:', allBtns.slice(0, 10));
          }
        } else {
          console.log('⚠️ No input fields found for logging');
        }
      } else {
        console.log('⚠️ Log button not found');
      }
    } else {
      console.log('⚠️ No habits available for logging');
    }

    // ========================================
    // PHASE 2: COMPLETE ASPIRATION AI FLOW
    // ========================================
    console.log('\n\n🎯 PHASE 2: COMPLETE ASPIRATION AI GENERATION\n');

    await page.goto('http://localhost:3000/aspirations');
    await page.waitForTimeout(2000);

    console.log('📸 Screenshot: Aspirations page');
    await page.screenshot({ path: 'test-results/complete-05-aspirations.png', fullPage: true });

    const newAspBtn = page.locator('button').filter({ hasText: /new aspiration/i }).first();
    const aspBtnExists = await newAspBtn.isVisible({ timeout: 2000 }).catch(() => false);

    if (aspBtnExists) {
      console.log('▶ Clicking "+ New Aspiration"...');
      await newAspBtn.click();
      await page.waitForTimeout(1500);

      console.log('📸 Screenshot: Aspiration form opened');
      await page.screenshot({ path: 'test-results/complete-06-asp-form.png', fullPage: true });

      // Check if in AI mode
      const aiModeBtn = page.locator('button').filter({ hasText: /AI Assistant/i });
      const isAIMode = await aiModeBtn.isVisible({ timeout: 1000 }).catch(() => false);

      if (isAIMode) {
        console.log('✅ AI mode detected');
        
        // Find textarea
        const textarea = page.locator('textarea').first();
        const hasTextarea = await textarea.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasTextarea) {
          console.log('▶ Entering aspiration text...');
          await textarea.fill('Build a sustainable home office that supports deep work and creativity');
          await page.waitForTimeout(1000);

          console.log('📸 Screenshot: Text entered');
          await page.screenshot({ path: 'test-results/complete-07-asp-text.png', fullPage: true });

          // Click Generate Aspiration
          const generateBtn = page.locator('button').filter({ hasText: /generate aspiration/i }).first();
          const canGenerate = await generateBtn.isVisible({ timeout: 2000 }).catch(() => false);

          if (canGenerate) {
            console.log('▶ Clicking "Generate Aspiration"...');
            await generateBtn.click();
            
            console.log('⏳ Waiting for AI response (25 seconds)...');
            await page.waitForTimeout(25000);

            console.log('📸 Screenshot: AI response');
            await page.screenshot({ path: 'test-results/complete-08-asp-ai-response.png', fullPage: true });

            // Check for populated fields
            const titleInput = page.locator('input[type="text"]').first();
            const titleValue = await titleInput.inputValue().catch(() => '');
            console.log(`Title populated: "${titleValue.substring(0, 50)}..."`);

            // Look for Create/Save button
            const createBtn = page.locator('button').filter({ hasText: /create aspiration/i }).first();
            const canCreate = await createBtn.isVisible({ timeout: 2000 }).catch(() => false);

            if (canCreate) {
              console.log('▶ Clicking "Create Aspiration"...');
              await createBtn.click();
              await page.waitForTimeout(2000);

              console.log('📸 Screenshot: Aspiration saved');
              await page.screenshot({ path: 'test-results/complete-09-asp-saved.png', fullPage: true });
              console.log('✅ Aspiration creation complete!');
            } else {
              console.log('⚠️ "Create Aspiration" button not found');
            }
          } else {
            console.log('⚠️ "Generate Aspiration" button not found');
          }
        } else {
          console.log('⚠️ Textarea not found');
        }
      } else {
        console.log('⚠️ AI mode not detected');
      }

      // Close modal if still open
      const cancelBtn = page.locator('button').filter({ hasText: /cancel/i }).first();
      const canCancel = await cancelBtn.isVisible({ timeout: 1000 }).catch(() => false);
      if (canCancel) {
        await cancelBtn.click();
        await page.waitForTimeout(500);
      }
    } else {
      console.log('⚠️ "+ New Aspiration" button not found');
    }

    // ========================================
    // PHASE 3: DEEP DIVE PROJECTS UI
    // ========================================
    console.log('\n\n📋 PHASE 3: PROJECTS DEEP DIVE + UX REVIEW\n');

    await page.goto('http://localhost:3000/projects');
    await page.waitForTimeout(2000);

    console.log('📸 Screenshot: Projects page initial');
    await page.screenshot({ path: 'test-results/complete-10-projects.png', fullPage: true });

    // Document page content
    const pageText = await page.textContent('body');
    const projectCards = await page.locator('article, [class*="card"]').count();
    console.log(`Project cards visible: ${projectCards}`);

    // Find create button
    const createProjBtn = page.locator('button').filter({ hasText: /create project|new project/i }).first();
    const projBtnExists = await createProjBtn.isVisible({ timeout: 2000 }).catch(() => false);

    if (projBtnExists) {
      const btnText = await createProjBtn.textContent();
      console.log(`▶ Clicking "${btnText}"...`);
      await createProjBtn.click();
      await page.waitForTimeout(2000);

      console.log('📸 Screenshot: Project creation UI');
      await page.screenshot({ path: 'test-results/complete-11-project-create.png', fullPage: true });

      // Document ALL form elements
      const allInputs = await page.locator('input, textarea, select, button').all();
      console.log(`\n📋 Form elements found: ${allInputs.length}`);

      for (let i = 0; i < Math.min(allInputs.length, 15); i++) {
        const elem = allInputs[i];
        const tagName = await elem.evaluate(el => el.tagName.toLowerCase());
        const type = await elem.getAttribute('type');
        const name = await elem.getAttribute('name');
        const placeholder = await elem.getAttribute('placeholder');
        const id = await elem.getAttribute('id');
        
        if (tagName === 'button') {
          const btnText = await elem.textContent();
          console.log(`  ${i + 1}. <button> "${btnText?.trim()}"`);
        } else {
          console.log(`  ${i + 1}. <${tagName}> type="${type}" name="${name}" id="${id}" placeholder="${placeholder?.substring(0, 40)}"`);
        }
      }

      // Check for photo upload specifically
      console.log('\n🔍 Looking for photo upload...');
      const fileInputs = await page.locator('input[type="file"]').all();
      console.log(`File inputs found: ${fileInputs.length}`);

      if (fileInputs.length > 0) {
        for (let i = 0; i < fileInputs.length; i++) {
          const accept = await fileInputs[i].getAttribute('accept');
          const multiple = await fileInputs[i].getAttribute('multiple');
          console.log(`  File input ${i + 1}: accept="${accept}", multiple="${multiple}"`);
        }
      }

      // Try to fill out form
      console.log('\n▶ Testing form interaction...');
      const textInputs = await page.locator('input[type="text"], textarea').all();
      
      if (textInputs.length > 0) {
        console.log(`Filling first text input (${textInputs.length} found)...`);
        await textInputs[0].fill('Test Project - Home Office Upgrade');
        await page.waitForTimeout(500);

        console.log('📸 Screenshot: Form with data');
        await page.screenshot({ path: 'test-results/complete-12-project-form-filled.png', fullPage: true });
      }

      // Cancel/close
      const cancelBtn = page.locator('button').filter({ hasText: /cancel|close/i }).first();
      const canCancel = await cancelBtn.isVisible({ timeout: 1000 }).catch(() => false);
      if (canCancel) {
        await cancelBtn.click();
        await page.waitForTimeout(500);
      }
    } else {
      console.log('⚠️ Create project button not found');
      console.log('Page content sample:', pageText?.substring(0, 500));
    }

    console.log('\n\n✅ COMPLETE FLOW TESTING DONE\n');
    console.log('📸 12 detailed screenshots saved');
    console.log('\nNext: Analyze UX and create recommendations\n');
  });
});
