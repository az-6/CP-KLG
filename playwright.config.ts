import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://127.0.0.1:4321',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: !process.env.CI,
    env: {
      ...process.env,
      ASTRO_DEV_BACKGROUND: '0',
      PUBLIC_WHATSAPP_NUMBER: '6281319426006',
      PUBLIC_WHATSAPP_CONTACT: 'Zuhud',
      PUBLIC_SECONDARY_WHATSAPP_NUMBER: '628151931083',
      PUBLIC_SECONDARY_WHATSAPP_CONTACT: 'Hanggi',
      PUBLIC_COMPANY_ADDRESS: 'Muara Baru, Jakarta Utara',
      SANITY_DATA_MODE: 'fixture',
      PUBLIC_SANITY_PROJECT_ID: 'test1234',
      PUBLIC_SANITY_DATASET: 'production',
      PUBLIC_SANITY_API_VERSION: '2026-09-04',
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
