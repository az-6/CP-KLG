import type { PortableTextBlock } from '@portabletext/types';

export interface SanityImage {
  _type?: 'image';
  asset: { _ref: string; _type: 'reference' };
  alt: string;
  caption?: string;
  crop?: { top: number; bottom: number; left: number; right: number };
  hotspot?: { x: number; y: number; height: number; width: number };
}

export interface SeoFields {
  title?: string;
  description?: string;
  socialImage?: SanityImage;
}

export interface ProductCategoryDocument {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
  isActive: boolean;
}

export interface ProductDocument {
  _id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  scientificName?: string;
  excerpt: string;
  description: PortableTextBlock[];
  images: SanityImage[];
  sizes?: string[];
  forms?: string[];
  condition?: string[];
  packaging?: string[];
  volume?: string;
  availabilityStatus: 'Tersedia berdasarkan konfirmasi' | 'Musiman' | 'Tidak ditampilkan';
  order: number;
  isActive: boolean;
  seo?: SeoFields;
}

export interface NewsDocument {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  _updatedAt: string;
  excerpt: string;
  coverImage: SanityImage;
  body: PortableTextBlock[];
  seo?: SeoFields;
  isActive: boolean;
}

export interface PartnerDocument {
  _id: string;
  name: string;
  logo: SanityImage;
  order: number;
  isActive: boolean;
}

export type DocumentationType = 'process' | 'facility' | 'team' | 'fleet' | 'activity';

export interface OperationalMediaDocument {
  _id: string;
  title: string;
  image: SanityImage;
  documentationType: DocumentationType;
  order: number;
  isActive: boolean;
}

export interface CredentialDocument {
  _id: string;
  name: string;
  description: string;
  previewImage: SanityImage;
  order: number;
  isActive: boolean;
}

export interface CompanyFactDocument {
  _id: string;
  label: string;
  value: string;
  description?: string;
  placement: 'home' | 'about';
  order: number;
  isActive: boolean;
}
