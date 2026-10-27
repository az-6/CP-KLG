import { defineField, defineType } from 'sanity';

export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Gambar',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Teks alternatif',
      type: 'string',
      validation: (r) => r.required().min(5),
    }),
    defineField({ name: 'caption', title: 'Keterangan', type: 'string' }),
    defineField({
      name: 'altEn',
      title: 'Teks alternatif (English)',
      description: 'Opsional. Bila kosong, versi Inggris memakai teks alternatif Bahasa Indonesia.',
      type: 'string',
    }),
    defineField({ name: 'captionEn', title: 'Keterangan (English)', type: 'string' }),
  ],
});
