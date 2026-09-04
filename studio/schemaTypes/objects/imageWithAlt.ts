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
  ],
});
