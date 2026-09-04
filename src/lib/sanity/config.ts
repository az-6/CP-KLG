export interface SanityRuntimeConfig {
  projectId: string;
  dataset: string;
  apiVersion: string;
}

type Env = Record<string, string | undefined>;

export const isSanityFixtureMode = (env: Env) => env.SANITY_DATA_MODE === 'fixture';

export function getSanityConfig(env: Env): SanityRuntimeConfig {
  const projectId = env.PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) throw new Error('PUBLIC_SANITY_PROJECT_ID is required');
  return {
    projectId,
    dataset: env.PUBLIC_SANITY_DATASET || 'production',
    apiVersion: env.PUBLIC_SANITY_API_VERSION || '2026-09-04',
  };
}
