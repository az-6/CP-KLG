import { describe, expect, it } from 'vitest';
import { getSanityConfig, isSanityFixtureMode } from '../../src/lib/sanity/config';

describe('Sanity configuration', () => {
  it('requires project and dataset outside fixture mode', () => {
    expect(() => getSanityConfig({})).toThrow('PUBLIC_SANITY_PROJECT_ID');
  });

  it('returns explicit public configuration', () => {
    expect(getSanityConfig({
      PUBLIC_SANITY_PROJECT_ID: 'abc12345',
      PUBLIC_SANITY_DATASET: 'production',
      PUBLIC_SANITY_API_VERSION: '2026-09-04',
    })).toEqual({ projectId: 'abc12345', dataset: 'production', apiVersion: '2026-09-04' });
  });

  it('recognizes fixture mode only when explicitly enabled', () => {
    expect(isSanityFixtureMode({ SANITY_DATA_MODE: 'fixture' })).toBe(true);
    expect(isSanityFixtureMode({})).toBe(false);
  });
});
