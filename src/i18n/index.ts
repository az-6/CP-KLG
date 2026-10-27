import { company } from '../data/company';
import { getMeetingHref } from '../lib/whatsapp';
import type { ProcessStep, ProofItem } from '../types/content';

export type Locale = 'id' | 'en';

/** Pasangan URL setiap halaman dalam dua bahasa. */
export const routes = {
  home: { id: '/', en: '/en/' },
  products: { id: '/produk', en: '/en/products' },
  quality: { id: '/mutu-proses', en: '/en/quality-process' },
  about: { id: '/tentang-kami', en: '/en/about' },
  news: { id: '/berita', en: '/en/news' },
  contact: { id: '/hubungi-kami', en: '/en/contact' },
} as const;

export type RouteKey = keyof typeof routes;
export type Alternates = Partial<Record<Locale, string>>;

export const alternatesFor = (key: RouteKey): Alternates => ({ ...routes[key] });

/** Halaman detail memakai slug yang sama di kedua bahasa. */
export const productPath = (locale: Locale, slug: string) => `${routes.products[locale]}/${slug}`;
export const newsPath = (locale: Locale, slug: string) => `${routes.news[locale]}/${slug}`;

export const productAlternates = (slug: string): Alternates => ({ id: productPath('id', slug), en: productPath('en', slug) });
export const newsAlternates = (slug: string): Alternates => ({ id: newsPath('id', slug), en: newsPath('en', slug) });

export interface NavItem {
  label: string;
  href: string;
  /** Diisi bila tujuan tautan berbahasa lain dari halaman saat ini. */
  hreflang?: Locale;
}

export const navigation: Record<Locale, NavItem[]> = {
  id: [
    { label: 'Beranda', href: '/' },
    { label: 'Produk', href: '/produk' },
    { label: 'Mutu & Proses', href: '/mutu-proses' },
    { label: 'Tentang Kami', href: '/tentang-kami' },
    { label: 'Berita', href: '/berita' },
    { label: 'Hubungi Kami', href: '/hubungi-kami' },
  ],
  en: [
    { label: 'Home', href: '/en/' },
    { label: 'Products', href: '/en/products' },
    { label: 'Quality & Process', href: '/en/quality-process' },
    { label: 'About', href: '/en/about' },
    { label: 'News', href: '/en/news' },
    { label: 'Contact', href: '/en/contact' },
  ],
};

export const ui = {
  id: {
    htmlLang: 'id',
    ogLocale: 'id_ID',
    skipLink: 'Lewati ke konten utama',
    homeLabel: 'Beranda',
    primaryNav: 'Navigasi utama',
    menu: 'Menu',
    close: 'Tutup',
    meeting: 'Jadwalkan Pertemuan',
    languageLabel: 'Bahasa',
    otherLanguage: 'English',
    sectionIndex: 'Indeks bagian halaman',
    port: 'Muara Baru · Jakarta',
    since: `Sejak ${company.establishedYear}`,
    footerNav: 'Navigasi',
    footerContact: 'Kontak bisnis',
    footerLocations: 'Lokasi',
    footerDescription: 'Pemasok tuna dan ikan dasar untuk distributor dan pedagang besar di Indonesia.',
    footerNote: 'Informasi produk mengikuti hasil diskusi dan kesepakatan bisnis.',
    whatsapp: 'WhatsApp',
  },
  en: {
    htmlLang: 'en',
    ogLocale: 'en_US',
    skipLink: 'Skip to main content',
    homeLabel: 'Home',
    primaryNav: 'Main navigation',
    menu: 'Menu',
    close: 'Close',
    meeting: 'Schedule a Meeting',
    languageLabel: 'Language',
    otherLanguage: 'Bahasa Indonesia',
    sectionIndex: 'Page section index',
    port: 'Muara Baru · Jakarta',
    since: `Since ${company.establishedYear}`,
    footerNav: 'Navigation',
    footerContact: 'Business contact',
    footerLocations: 'Locations',
    footerDescription: 'Supplier of tuna and demersal fish for distributors and wholesalers in Indonesia.',
    footerNote: 'Product details follow business discussion and agreement.',
    whatsapp: 'WhatsApp',
  },
} as const;

export interface CompanyCopy {
  slogan: string;
  heroTitle: string;
  heroDescription: string;
  about: string;
  proofs: ProofItem[];
  process: ProcessStep[];
}

export const companyCopy: Record<Locale, CompanyCopy> = {
  id: {
    slogan: company.slogan,
    heroTitle: company.heroTitle,
    heroDescription: company.heroDescription,
    about: company.about,
    proofs: company.proofs,
    process: company.process,
  },
  en: {
    slogan: 'Consistent quality, your specification.',
    heroTitle: 'Consistent Quality Fish Supply for Your Business',
    heroDescription:
      'We supply tuna and a range of demersal fish, handled hygienically and prepared to the specifications distributors and wholesalers ask for.',
    about:
      'PT Katalis Lintas Global serves large-volume fish supply for distributors and wholesalers in Indonesia, with a focus on consistent quality, clean handling, and buyer specifications.',
    proofs: [
      {
        title: 'Consistent Quality',
        description: 'Quality standards are kept at every stage of product handling.',
        evidence: 'Backed by sorting, grading, and product documentation.',
        icon: 'quality',
      },
      {
        title: 'Buyer Specification',
        description: 'Product requirements are discussed around how each buyer does business.',
        evidence: 'Size, form, condition, and packing are open to discussion.',
        icon: 'specification',
      },
      {
        title: 'Hygienic Handling',
        description: 'Cleanliness is a working part of daily operations.',
        evidence: 'Backed by facilities, handling procedures, and compliance records.',
        icon: 'hygiene',
      },
    ],
    process: [
      { number: '01', title: 'Receiving', description: 'Product is received and recorded before it enters handling.' },
      { number: '02', title: 'Sorting & Grading', description: 'Product is grouped by quality and by the relevant specification.' },
      { number: '03', title: 'Hygienic Handling', description: 'Work is done with attention to clean areas and clean product.' },
      { number: '04', title: 'Cold Storage', description: 'Product stays in the cold chain before packing and dispatch.' },
      { number: '05', title: 'Packing & Dispatch', description: 'Packing and delivery are prepared to the agreed requirements.' },
    ],
  },
};

export interface CompanyLocation {
  id: string;
  city: string;
  region: string;
  lat: number;
  lon: number;
  kind: 'address' | 'branch';
}

/**
 * Lokasi yang dikonfirmasi pemilik pada 24 Oktober 2026 (Padang ditambahkan hari yang sama). Fungsi tiap cabang
 * (kantor, cold storage, titik penerimaan) belum dikonfirmasi, jadi jangan diberi label peran.
 */
export const locations: CompanyLocation[] = [
  { id: 'muara-baru', city: 'Muara Baru', region: 'Jakarta Utara', lat: -6.1, lon: 106.8, kind: 'address' },
  { id: 'padang', city: 'Padang', region: 'Sumatera Barat', lat: -0.95, lon: 100.35, kind: 'branch' },
  { id: 'kupang', city: 'Kupang', region: 'Nusa Tenggara Timur', lat: -10.17, lon: 123.61, kind: 'branch' },
  { id: 'bitung', city: 'Bitung', region: 'Sulawesi Utara', lat: 1.44, lon: 125.19, kind: 'branch' },
  { id: 'manokwari', city: 'Manokwari', region: 'Papua Barat', lat: -0.86, lon: 134.06, kind: 'branch' },
  { id: 'jayapura', city: 'Jayapura', region: 'Papua', lat: -2.53, lon: 140.72, kind: 'branch' },
];

const branchCities = () => locations.filter((location) => location.kind === 'branch').map((location) => location.city);

/** "Padang, Kupang, ... dan Jayapura": dibuat dari `locations` agar teks tidak tertinggal saat cabang bertambah. */
export const branchList = (locale: Locale) => {
  const cities = branchCities();
  if (cities.length < 2) return cities.join('');
  const last = cities[cities.length - 1];
  return locale === 'en'
    ? `${cities.slice(0, -1).join(', ')}, and ${last}`
    : `${cities.slice(0, -1).join(', ')}, dan ${last}`;
};

export const locationKindLabel: Record<Locale, Record<CompanyLocation['kind'], string>> = {
  id: { address: 'Kantor pusat', branch: 'Cabang' },
  en: { address: 'Head office', branch: 'Branch' },
};

export const meetingHrefFor = (locale: Locale, productName?: string) =>
  getMeetingHref(company.contact.whatsappNumber, productName, locale);
