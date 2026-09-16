import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// Domain kanonis produksi. Dipakai sebagai cadangan agar build produksi tidak
// pernah jatuh ke domain *.vercel.app bila SITE_URL lupa diset atau diisi kosong
// di Vercel.
const PRODUCTION_SITE_URL = 'https://katalislintasglobal.com';

const readEnv = (name: string) => {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
};

const vercelProjectUrl = readEnv('VERCEL_PROJECT_PRODUCTION_URL');

const site =
  readEnv('SITE_URL')
  ?? (readEnv('VERCEL_ENV') === 'production' ? PRODUCTION_SITE_URL : undefined)
  ?? (vercelProjectUrl ? `https://${vercelProjectUrl}` : undefined)
  ?? 'http://localhost:4321';

export default defineConfig({
  output: 'static',
  site,
  integrations: [sitemap()],
});
