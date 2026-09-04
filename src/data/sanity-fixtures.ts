import type { PortableTextBlock } from '@portabletext/types';
import type {
  CompanyFactDocument,
  CredentialDocument,
  DocumentationType,
  NewsDocument,
  OperationalMediaDocument,
  PartnerDocument,
  ProductCategoryDocument,
  ProductDocument,
  SanityImage,
} from '../types/sanity';

const image = (name: string, alt: string): SanityImage => ({
  _type: 'image',
  asset: {
    _type: 'reference',
    _ref: `image-${name.replace(/[^A-Za-z0-9]/g, '').padEnd(40, 'a').slice(0, 40)}-1200x800-jpg`,
  },
  alt,
});

const paragraph = (key: string, text: string): PortableTextBlock => ({
  _type: 'block',
  _key: key,
  style: 'normal',
  markDefs: [],
  children: [{ _type: 'span', _key: `${key}-span`, marks: [], text }],
});

const categories: ProductCategoryDocument[] = [
  {
    _id: 'category-tuna',
    name: 'Kategori Tuna',
    slug: 'tuna',
    description: 'Kategori pengujian untuk produk Tuna.',
    order: 0,
    isActive: true,
  },
  {
    _id: 'category-ikan-dasar',
    name: 'Kategori Ikan Dasar',
    slug: 'ikan-dasar',
    description: 'Kategori pengujian untuk produk Ikan Dasar.',
    order: 1,
    isActive: true,
  },
];

const products: ProductDocument[] = [
  {
    _id: 'product-tuna',
    name: 'Tuna',
    slug: 'tuna',
    categoryId: 'category-tuna',
    categoryName: 'Kategori Tuna',
    categorySlug: 'tuna',
    excerpt: 'Informasi pengujian produk Tuna untuk memvalidasi tampilan katalog.',
    description: [paragraph('tuna-description', 'Deskripsi pengujian produk Tuna.')],
    images: [image('tuna', 'Foto pengujian produk Tuna')],
    availabilityStatus: 'Tersedia berdasarkan konfirmasi',
    order: 0,
    isActive: true,
  },
  {
    _id: 'product-ikan-dasar',
    name: 'Ikan Dasar',
    slug: 'ikan-dasar',
    categoryId: 'category-ikan-dasar',
    categoryName: 'Kategori Ikan Dasar',
    categorySlug: 'ikan-dasar',
    excerpt: 'Informasi pengujian Ikan Dasar untuk memvalidasi tampilan katalog.',
    description: [paragraph('ikan-dasar-description', 'Deskripsi pengujian produk Ikan Dasar.')],
    images: [image('ikan-dasar', 'Foto pengujian produk Ikan Dasar')],
    availabilityStatus: 'Tersedia berdasarkan konfirmasi',
    order: 1,
    isActive: true,
  },
];

const news: NewsDocument[] = [
  {
    _id: 'news-test-activity',
    title: 'Test Berita',
    slug: 'test-berita',
    publishedAt: '2026-09-04T08:00:00.000Z',
    _updatedAt: '2026-09-04T08:00:00.000Z',
    excerpt: 'Konten pengujian untuk memastikan daftar dan detail berita tampil dengan benar.',
    coverImage: image('news', 'Foto pengujian aktivitas perusahaan'),
    body: [
      paragraph('news-body', 'Isi berita pengujian untuk pemeriksaan tampilan website.'),
      image('news-inline', 'Foto pengujian di dalam artikel'),
    ],
    isActive: true,
  },
];

const partners: PartnerDocument[] = [
  {
    _id: 'partner-test',
    name: 'Test Mitra Kerja',
    logo: image('partner', 'Logo pengujian mitra kerja'),
    order: 0,
    isActive: true,
  },
];

const documentationTypes: DocumentationType[] = ['process', 'facility', 'team', 'fleet', 'activity'];
const documentationAlt: Record<DocumentationType, string> = {
  process: 'Test foto proses',
  facility: 'Test foto fasilitas',
  team: 'Test foto tim',
  fleet: 'Test foto armada',
  activity: 'Test foto aktivitas',
};
const operationalMedia: OperationalMediaDocument[] = documentationTypes.map((documentationType, order) => ({
  _id: `operational-media-${documentationType}`,
  title: `Test Dokumentasi ${documentationType}`,
  image: image(documentationType, documentationAlt[documentationType]),
  documentationType,
  order,
  isActive: true,
}));

const credentials: CredentialDocument[] = [
  {
    _id: 'credential-test',
    name: 'Test Dokumen Legalitas',
    description: 'Pratinjau pengujian, bukan dokumen atau klaim legalitas perusahaan.',
    previewImage: image('credential', 'Pratinjau pengujian dokumen legalitas'),
    order: 0,
    isActive: true,
  },
];

const companyFacts: CompanyFactDocument[] = [
  {
    _id: 'fact-home-test',
    label: 'Test fakta Beranda',
    value: 'Data pengujian',
    description: 'Bukan klaim produksi.',
    placement: 'home',
    order: 0,
    isActive: true,
  },
  {
    _id: 'fact-about-test',
    label: 'Test fakta Tentang Kami',
    value: 'Data pengujian',
    description: 'Bukan klaim produksi.',
    placement: 'about',
    order: 0,
    isActive: true,
  },
];

export const sanityFixtures = {
  categories,
  products,
  news,
  partners,
  operationalMedia,
  credentials,
  companyFacts,
};
