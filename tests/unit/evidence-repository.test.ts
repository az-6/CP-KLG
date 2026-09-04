import { expect, it } from 'vitest';
import { groupEvidence } from '../../src/lib/sanity/evidence-repository';
import { sanityFixtures } from '../../src/data/sanity-fixtures';

it('groups only active evidence by controlled placement', () => {
  const fixtures = {
    facts: [
      ...sanityFixtures.companyFacts,
      { ...sanityFixtures.companyFacts[0], _id: 'inactive-test-item', isActive: false },
    ],
    media: [
      ...sanityFixtures.operationalMedia,
      { ...sanityFixtures.operationalMedia[0], _id: 'inactive-test-item', isActive: false },
    ],
    credentials: [
      ...sanityFixtures.credentials,
      { ...sanityFixtures.credentials[0], _id: 'inactive-test-item', isActive: false },
    ],
  };

  const grouped = groupEvidence(fixtures);
  expect(grouped.homeFacts.every((item) => item.placement === 'home')).toBe(true);
  expect(grouped.about.team.every((item) => item.documentationType === 'team')).toBe(true);
  expect(grouped.about.activities.every((item) => item.documentationType === 'activity')).toBe(true);
  expect(grouped.process.facilities.every((item) => item.documentationType === 'facility')).toBe(true);
  expect(JSON.stringify(grouped)).not.toContain('inactive-test-item');
});
