import { defineArrayMember, defineField, defineType } from 'sanity';

/** Anggota isi yang sama untuk versi Indonesia dan versi Inggris. */
export const portableContentMembers = [
  defineArrayMember({
    type: 'block',
    styles: [
      { title: 'Normal', value: 'normal' },
      { title: 'Subjudul', value: 'h2' },
      { title: 'Sub-subjudul', value: 'h3' },
    ],
  }),
  defineArrayMember({ type: 'imageWithAlt' }),
];

export const portableContent = defineType({
  name: 'portableContent',
  title: 'Isi',
  type: 'array',
  of: portableContentMembers,
  validation: (r) => r.required().min(1),
});

/**
 * Isi versi Inggris: struktur sama, tetapi tidak wajib. Bila kosong, website
 * memakai isi Bahasa Indonesia.
 */
export const englishContentField = (name: string, title: string) => defineField({
  name,
  title,
  type: 'array',
  of: portableContentMembers,
});
