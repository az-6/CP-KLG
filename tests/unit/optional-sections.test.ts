import { expect, it } from 'vitest';
import { hasItems } from '../../src/lib/optional-sections';

it('shows optional sections only when content exists', () => {
  expect(hasItems([])).toBe(false);
  expect(hasItems(['content'])).toBe(true);
});
