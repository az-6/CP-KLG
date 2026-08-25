import type { ImageMetadata } from 'astro';

export type ProductCategory = 'tuna' | 'ikan-dasar' | 'lainnya';

export interface MediaAsset {
  src: ImageMetadata;
  alt: string;
  position?: string;
}

export interface Product {
  slug: string;
  name: string;
  scientificName?: string;
  category: ProductCategory;
  description: string;
  image?: MediaAsset;
  sizes?: string[];
  forms?: string[];
  condition?: Array<'Segar' | 'Beku'>;
  packaging?: string[];
  volume?: string;
}

export interface ProofItem {
  title: string;
  description: string;
  evidence: string;
  icon: 'quality' | 'specification' | 'hygiene' | 'supply';
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface ContactDetails {
  whatsappNumber: string;
  email?: string;
  address?: string;
  operatingHours?: string;
  mapUrl?: string;
}

export interface CompanyProfile {
  name: 'PT Katalis Lintas Global';
  shortName: 'Katalis Lintas Global';
  slogan: 'Kualitas Terjaga, Spesifikasi Anda.';
  heroTitle: string;
  heroDescription: string;
  about: string;
  contact: ContactDetails;
  proofs: ProofItem[];
  process: ProcessStep[];
}
