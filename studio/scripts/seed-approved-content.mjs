import { createClient } from '@sanity/client';

for (const key of ['SANITY_STUDIO_PROJECT_ID', 'SANITY_WRITE_TOKEN']) {
  if (!process.env[key]) throw new Error(`${key} is required`);
}

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  apiVersion: '2026-09-04',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const paragraph = (key, text) => ({
  _type: 'block',
  _key: key,
  style: 'normal',
  markDefs: [],
  children: [{ _type: 'span', _key: `${key}-span`, marks: [], text }],
});

const tunaExcerpt = 'Pilihan tuna untuk kebutuhan pasokan distributor dan pedagang besar.';
const bottomFishExcerpt = 'Beragam ikan dasar untuk kebutuhan perdagangan dalam volume besar.';

const documents = [
  {
    _id: 'product-category-tuna',
    _type: 'productCategory',
    name: 'Tuna',
    slug: { _type: 'slug', current: 'tuna' },
    order: 0,
    isActive: true,
  },
  {
    _id: 'product-category-ikan-dasar',
    _type: 'productCategory',
    name: 'Ikan Dasar',
    slug: { _type: 'slug', current: 'ikan-dasar' },
    order: 1,
    isActive: true,
  },
  {
    _id: 'drafts.product-tuna',
    _type: 'product',
    name: 'Tuna',
    slug: { _type: 'slug', current: 'tuna' },
    category: { _type: 'reference', _ref: 'product-category-tuna' },
    excerpt: tunaExcerpt,
    description: [paragraph('description', tunaExcerpt)],
    images: [],
    availabilityStatus: 'Tersedia berdasarkan konfirmasi',
    order: 0,
    isActive: false,
  },
  {
    _id: 'drafts.product-ikan-dasar',
    _type: 'product',
    name: 'Ikan Dasar',
    slug: { _type: 'slug', current: 'ikan-dasar' },
    category: { _type: 'reference', _ref: 'product-category-ikan-dasar' },
    excerpt: bottomFishExcerpt,
    description: [paragraph('description', bottomFishExcerpt)],
    images: [],
    availabilityStatus: 'Tersedia berdasarkan konfirmasi',
    order: 1,
    isActive: false,
  },
];

let transaction = client.transaction();
for (const document of documents) transaction = transaction.createIfNotExists(document);
await transaction.commit();
process.stdout.write('Seed konten awal selesai tanpa menimpa dokumen yang sudah ada.\n');
