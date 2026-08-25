import type { CompanyProfile, Product } from '../types/content';

export interface PageMetadata {
  title: string;
  description: string;
  canonicalPath: string;
  image?: string;
}

export function buildOrganizationJsonLd(company: CompanyProfile, site: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.name,
    url: new URL('/', site).toString(),
    slogan: company.slogan,
    ...(company.contact.email ? { email: company.contact.email } : {}),
    ...(company.contact.address
      ? { address: { '@type': 'PostalAddress', streetAddress: company.contact.address, addressCountry: 'ID' } }
      : {}),
  };
}

export function buildProductJsonLd(product: Product, company: CompanyProfile, site: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    url: new URL(`/produk#${product.slug}`, site).toString(),
    brand: { '@type': 'Brand', name: company.name },
    ...(product.image ? { image: new URL(product.image.src.src, site).toString() } : {}),
  };
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
