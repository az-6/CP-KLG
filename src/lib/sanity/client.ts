import { createClient } from '@sanity/client';
import { getSanityConfig } from './config';

const config = getSanityConfig(import.meta.env);

export const sanityClient = createClient({
  ...config,
  perspective: 'published',
  useCdn: false,
});
