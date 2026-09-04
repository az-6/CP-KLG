import groq from 'groq';
import { sanityFixtures } from '../../data/sanity-fixtures';
import type { NewsDocument, PartnerDocument } from '../../types/sanity';
import { sanityClient } from './client';
import { isSanityFixtureMode } from './config';

export const NEWS_QUERY = groq`*[
  _type == "news" &&
  isActive == true &&
  defined(slug.current)
] | order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  _updatedAt,
  excerpt,
  coverImage,
  body,
  seo,
  isActive
}`;

export const PARTNER_QUERY = groq`*[
  _type == "partner" &&
  isActive == true
] | order(order asc, name asc){
  _id,
  name,
  logo,
  order,
  isActive
}`;

export function normalizeNews(news: NewsDocument[]): NewsDocument[] {
  return news
    .filter((article) => article.isActive && Boolean(article.slug))
    .sort((left, right) => Date.parse(right.publishedAt) - Date.parse(left.publishedAt));
}

export function normalizePartners(partners: PartnerDocument[]): PartnerDocument[] {
  return partners
    .filter((partner) => partner.isActive)
    .sort((left, right) => left.order - right.order || left.name.localeCompare(right.name, 'id'));
}

export async function getPublishedNews(): Promise<NewsDocument[]> {
  const news = isSanityFixtureMode(import.meta.env, process.env)
    ? sanityFixtures.news
    : await sanityClient.fetch<NewsDocument[]>(NEWS_QUERY);
  return normalizeNews(news);
}

export async function getLatestNews(limit = 3): Promise<NewsDocument[]> {
  return (await getPublishedNews()).slice(0, Math.max(0, limit));
}

export async function getActivePartners(): Promise<PartnerDocument[]> {
  const partners = isSanityFixtureMode(import.meta.env, process.env)
    ? sanityFixtures.partners
    : await sanityClient.fetch<PartnerDocument[]>(PARTNER_QUERY);
  return normalizePartners(partners);
}
