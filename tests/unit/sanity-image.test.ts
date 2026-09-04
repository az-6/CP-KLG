import { describe, expect, it } from 'vitest';
import { getSanityImageSet } from '../../src/lib/sanity/image';

describe('getSanityImageSet', () => {
  it('creates responsive image URLs for each requested width', () => {
    const image = {
      asset: {
        _ref: 'image-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa-1200x800-jpg',
        _type: 'reference' as const,
      },
    };

    const result = getSanityImageSet(image, [400, 800]);

    expect(result.src).toContain('w=800');
    expect(result.srcset).toContain('w=400');
    expect(result.srcset).toContain('400w');
    expect(result.srcset).toContain('800w');
  });
});
