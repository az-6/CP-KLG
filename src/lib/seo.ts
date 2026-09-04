import type { CompanyProfile } from '../types/content';
import type { NewsDocument, ProductDocument } from '../types/sanity';
import { getSanityImageSet } from './sanity/image';

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

export function buildProductJsonLd(product: ProductDocument, company: CompanyProfile, site: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.seo?.description ?? product.excerpt,
    url: new URL(`/produk/${product.slug}`, site).toString(),
    brand: { '@type': 'Brand', name: company.name },
    ...(product.images.length
      ? { image: product.images.map((image) => getSanityImageSet(image, [1200]).src) }
      : {}),
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[], site: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: new URL(item.path, site).toString(),
    })),
  };
}

export function buildNewsArticleJsonLd(article: NewsDocument, company: CompanyProfile, site: URL) {
  const organization = { '@type': 'Organization', name: company.name };
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.seo?.description ?? article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article._updatedAt,
    mainEntityOfPage: new URL(`/berita/${article.slug}`, site).toString(),
    author: organization,
    publisher: organization,
    ...(article.coverImage ? { image: getSanityImageSet(article.coverImage, [1200]).src } : {}),
  };
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
