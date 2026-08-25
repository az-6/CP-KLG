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
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
