import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './scripts',
  fullyParallel: false, // Run scripts sequentially
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    video: 'on', // Record video for demo
    screenshot: 'on', // Take screenshots
  },

  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Show URL bar in recordings
        viewport: { width: 1280, height: 720 },
        launchOptions: {
          args: ['--start-maximized'],
        },
      },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
