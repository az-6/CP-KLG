import type { Locale } from '../../i18n';
import type {
  CompanyFactDocument,
  CredentialDocument,
  NewsDocument,
  OperationalMediaDocument,
  PartnerDocument,
  PortableBody,
  ProductCategoryDocument,
  ProductDocument,
  SanityImage,
  SeoFields,
} from '../../types/sanity';

/*
 * Konten Sanity disimpan dalam Bahasa Indonesia, dengan grup "en" opsional.
 * Fungsi di sini mengembalikan dokumen dengan teks Inggris bila diisi, dan
 * teks Bahasa Indonesia bila kosong, sehingga halaman /en/ tidak pernah kosong.
 */

const filled = (value?: string) => (value && value.trim() ? value : undefined);
const filledList = (value?: string[]) => (value && value.length ? value : undefined);
const filledBody = (value?: PortableBody) => (value && value.length ? value : undefined);

export function localizeImage<T extends SanityImage | undefined>(image: T, locale: Locale): T {
  if (!image || locale === 'id') return image;
  return { ...image, alt: filled(image.altEn) ?? image.alt, caption: filled(image.captionEn) ?? image.caption };
}

export function localizeBody(body: PortableBody, locale: Locale): PortableBody {
  if (locale === 'id') return body;
  return body.map((block) => (block._type === 'image' || 'asset' in block ? localizeImage(block as SanityImage, locale) : block));
}

function localizeSeo(seo: SeoFields | undefined, en: SeoFields | undefined, locale: Locale): SeoFields | undefined {
  if (locale === 'id') return seo;
  const merged = {
    title: filled(en?.title) ?? seo?.title,
    description: filled(en?.description) ?? seo?.description,
    socialImage: localizeImage(en?.socialImage ?? seo?.socialImage, locale),
  };
  return merged.title || merged.description || merged.socialImage ? merged : undefined;
}

export function localizeCategory(category: ProductCategoryDocument, locale: Locale): ProductCategoryDocument {
  if (locale === 'id') return category;
  return {
    ...category,
    name: filled(category.en?.name) ?? category.name,
    description: filled(category.en?.description) ?? category.description,
  };
}

export function localizeProduct(
  product: ProductDocument,
  locale: Locale,
  categories: ProductCategoryDocument[] = [],
): ProductDocument {
  if (locale === 'id') return product;
  const en = product.en;
  const category = categories.find((item) => item._id === product.categoryId);
  return {
    ...product,
    name: filled(en?.name) ?? product.name,
    categoryName: category ? localizeCategory(category, locale).name : product.categoryName,
    excerpt: filled(en?.excerpt) ?? product.excerpt,
    description: localizeBody(filledBody(en?.description) ?? product.description, locale),
    images: product.images.map((image) => localizeImage(image, locale)),
    sizes: filledList(en?.sizes) ?? product.sizes,
    forms: filledList(en?.forms) ?? product.forms,
    condition: filledList(en?.condition) ?? product.condition,
    packaging: filledList(en?.packaging) ?? product.packaging,
    volume: filled(en?.volume) ?? product.volume,
    seo: localizeSeo(product.seo, en?.seo, locale),
  };
}

export function localizeNews(article: NewsDocument, locale: Locale): NewsDocument {
  if (locale === 'id') return article;
  const en = article.en;
  return {
    ...article,
    title: filled(en?.title) ?? article.title,
    excerpt: filled(en?.excerpt) ?? article.excerpt,
    coverImage: localizeImage(article.coverImage, locale),
    body: localizeBody(filledBody(en?.body) ?? article.body, locale),
    seo: localizeSeo(article.seo, en?.seo, locale),
  };
}

export function localizeFact(fact: CompanyFactDocument, locale: Locale): CompanyFactDocument {
  if (locale === 'id') return fact;
  return {
    ...fact,
    label: filled(fact.en?.label) ?? fact.label,
    value: filled(fact.en?.value) ?? fact.value,
    description: filled(fact.en?.description) ?? fact.description,
  };
}

export function localizeCredential(credential: CredentialDocument, locale: Locale): CredentialDocument {
  if (locale === 'id') return credential;
  return {
    ...credential,
    name: filled(credential.en?.name) ?? credential.name,
    description: filled(credential.en?.description) ?? credential.description,
    previewImage: localizeImage(credential.previewImage, locale),
  };
}

export function localizeMedia(item: OperationalMediaDocument, locale: Locale): OperationalMediaDocument {
  if (locale === 'id') return item;
  return { ...item, image: localizeImage(item.image, locale) };
}

export function localizePartner(partner: PartnerDocument, locale: Locale): PartnerDocument {
  if (locale === 'id') return partner;
  return { ...partner, logo: localizeImage(partner.logo, locale) };
}
