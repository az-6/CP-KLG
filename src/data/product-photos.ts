import tunaLoinPortrait from '../assets/tuna-loin-1.jpeg';
import tunaLoinLandscape from '../assets/tuna-loin-2.jpeg';

export interface LocalPhoto {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export const tunaLoinHeroPhoto: LocalPhoto = {
  src: tunaLoinPortrait.src,
  width: tunaLoinPortrait.width,
  height: tunaLoinPortrait.height,
  alt: 'Tuna loin segar di atas meja penanganan yang bersih',
};

const tunaLoinPhotos: LocalPhoto[] = [
  {
    src: tunaLoinLandscape.src,
    width: tunaLoinLandscape.width,
    height: tunaLoinLandscape.height,
    alt: 'Tuna loin utuh dilihat dari sisi memanjang',
  },
  tunaLoinHeroPhoto,
];

const photosBySlug: Record<string, LocalPhoto[]> = {
  tuna: tunaLoinPhotos,
  'tuna-loin': tunaLoinPhotos,
};

/**
 * Foto lokal dipakai selama produk terkait belum memiliki foto di Sanity
 * (termasuk saat website berjalan dalam mode fixture).
 */
export function getLocalProductPhotos(product: { slug: string; name: string }): LocalPhoto[] {
  return photosBySlug[product.slug] ?? (/\btuna\b/i.test(product.name) ? tunaLoinPhotos : []);
}
