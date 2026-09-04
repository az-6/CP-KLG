import { createImageUrlBuilder } from '@sanity/image-url';
import { sanityClient } from './client';

const builder = createImageUrlBuilder(sanityClient);
type SanityImageSource = Parameters<typeof builder.image>[0];

export function getSanityImageSet(image: SanityImageSource, widths = [480, 768, 1200]) {
  if (widths.length === 0) throw new Error('At least one image width is required');

  const urls = widths.map((width) => ({
    width,
    url: builder.image(image).width(width).fit('max').auto('format').url(),
  }));

  return {
    src: urls.at(-1)!.url,
    srcset: urls.map(({ width, url }) => `${url} ${width}w`).join(', '),
  };
}
