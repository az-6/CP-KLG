import { defineField, type FieldDefinition } from 'sanity';

/**
 * Grup "English" pada setiap dokumen yang tampil di website. Semua isinya
 * opsional: kolom yang dikosongkan memakai teks Bahasa Indonesia di halaman
 * /en/, sehingga website tidak pernah kosong selama terjemahan belum lengkap.
 */
export const englishGroup = (fields: FieldDefinition[]) => defineField({
  name: 'en',
  title: 'English (opsional)',
  description: 'Teks untuk versi Bahasa Inggris website. Kolom yang kosong akan memakai teks Bahasa Indonesia.',
  type: 'object',
  options: { collapsible: true, collapsed: false },
  fields,
});
