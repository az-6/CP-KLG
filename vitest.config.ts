import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
  },
  define: {
    'import.meta.env.PUBLIC_SANITY_PROJECT_ID': JSON.stringify('test1234'),
    'import.meta.env.PUBLIC_SANITY_DATASET': JSON.stringify('production'),
    'import.meta.env.PUBLIC_SANITY_API_VERSION': JSON.stringify('2026-09-04'),
  },
});
