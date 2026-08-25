import type { Product } from '../types/content';

export const products: Product[] = [
  {
    slug: 'tuna',
    name: 'Tuna',
    category: 'tuna',
    description: 'Pilihan tuna untuk kebutuhan pasokan distributor dan pedagang besar.',
  },
  {
    slug: 'ikan-dasar',
    name: 'Ikan Dasar',
    category: 'ikan-dasar',
    description: 'Beragam ikan dasar untuk kebutuhan perdagangan dalam volume besar.',
  },
  {
    slug: 'udang',
    name: 'Udang',
    category: 'lainnya',
    description: 'Contoh kategori produk untuk pembahasan awal dengan calon buyer.',
    isPlaceholder: true,
  },
  {
    slug: 'kakap',
    name: 'Kakap',
    category: 'ikan-dasar',
    description: 'Contoh kategori ikan dasar; ketersediaan dan spesifikasi perlu dikonfirmasi.',
    isPlaceholder: true,
  },
];

export const productCategoryLabels = {
  tuna: 'Tuna',
  'ikan-dasar': 'Ikan Dasar',
  lainnya: 'Lainnya',
} as const;
