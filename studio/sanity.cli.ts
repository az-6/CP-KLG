import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || '',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  // Studio yang sudah berjalan di https://klg-content.sanity.studio; `sanity deploy`
  // memperbarui alamat yang sama tanpa menanyakan hostname baru.
  deployment: {
    appId: 'xzow0tn9kmmxdln87zhfewxy',
  },
});
