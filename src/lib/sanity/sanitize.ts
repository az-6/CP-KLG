import type {
  CredentialDocument,
  NewsDocument,
  OperationalMediaDocument,
  PartnerDocument,
  PortableBody,
  ProductDocument,
  SanityImage,
  SeoFields,
} from '../../types/sanity';

/*
 * Editor bisa menyimpan kolom gambar yang baru berisi teks alternatif tanpa
 * berkas (misalnya SEO → Social image). Gambar seperti itu tidak punya URL dan
 * akan menggagalkan build, jadi dibuang di sini sebelum sampai ke halaman.
 */

export const hasImageAsset = (image?: Partial<SanityImage> | null): image is SanityImage =>
  Boolean(image?.asset?._ref);

const cleanSeo = (seo?: SeoFields): SeoFields | undefined =>
  seo ? { ...seo, socialImage: hasImageAsset(seo.socialImage) ? seo.socialImage : undefined } : seo;

const cleanBody = (body?: PortableBody): PortableBody | undefined =>
  body?.filter((block) => !(block._type === 'imageWithAlt' || block._type === 'image') || hasImageAsset(block as SanityImage));

export const sanitizeProduct = (product: ProductDocument): ProductDocument => ({
  ...product,
  images: (product.images ?? []).filter(hasImageAsset),
  description: cleanBody(product.description) ?? [],
  seo: cleanSeo(product.seo),
  en: product.en ? { ...product.en, description: cleanBody(product.en.description), seo: cleanSeo(product.en.seo) } : product.en,
});

/** Berita tanpa gambar sampul yang valid tidak ditampilkan (sampul wajib di Studio). */
export const sanitizeNews = (articles: NewsDocument[]): NewsDocument[] =>
  articles
    .filter((article) => hasImageAsset(article.coverImage))
    .map((article) => ({
      ...article,
      body: cleanBody(article.body) ?? [],
      seo: cleanSeo(article.seo),
      en: article.en ? { ...article.en, body: cleanBody(article.en.body), seo: cleanSeo(article.en.seo) } : article.en,
    }));

export const sanitizePartners = (partners: PartnerDocument[]) => partners.filter((partner) => hasImageAsset(partner.logo));
export const sanitizeMedia = (items: OperationalMediaDocument[]) => items.filter((item) => hasImageAsset(item.image));
export const sanitizeCredentials = (credentials: CredentialDocument[]) =>
  credentials.filter((credential) => hasImageAsset(credential.previewImage));
