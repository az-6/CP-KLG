import tunaLoinPortrait from '../assets/tuna-loin-1.jpeg';
import tunaLoinLandscape from '../assets/tuna-loin-2.jpeg';
import type { Locale } from '../i18n';

export interface LocalPhoto {
  src: string;
  width: number;
  height: number;
  alt: string;
}

interface LocalPhotoSource extends Omit<LocalPhoto, 'alt'> {
  alt: Record<Locale, string>;
}

const tunaLoinPhotos: LocalPhotoSource[] = [
  {
    src: tunaLoinLandscape.src,
    width: tunaLoinLandscape.width,
    height: tunaLoinLandscape.height,
    alt: { id: 'Tuna loin utuh dilihat dari sisi memanjang', en: 'Whole tuna loin seen lengthwise' },
  },
  {
    src: tunaLoinPortrait.src,
    width: tunaLoinPortrait.width,
    height: tunaLoinPortrait.height,
    alt: { id: 'Tuna loin segar di atas meja penanganan yang bersih', en: 'Fresh tuna loin on a clean handling table' },
  },
];

const photosBySlug: Record<string, LocalPhotoSource[]> = {
  tuna: tunaLoinPhotos,
  'tuna-loin': tunaLoinPhotos,
};

/**
 * Foto lokal dipakai selama produk terkait belum memiliki foto di Sanity
 * (termasuk saat website berjalan dalam mode fixture).
 */
export function getLocalProductPhotos(product: { slug: string; name: string }, locale: Locale = 'id'): LocalPhoto[] {
  const photos = photosBySlug[product.slug] ?? (/\btuna\b/i.test(product.name) ? tunaLoinPhotos : []);
  return photos.map((photo) => ({ ...photo, alt: photo.alt[locale] }));
}
