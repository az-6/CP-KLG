import { defineField, defineType } from 'sanity';
import { englishGroup } from '../objects/english';

export const credential = defineType({
  name: 'credential',
  title: 'Legalitas & Sertifikasi',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nama', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'description', title: 'Keterangan publik', type: 'text', rows: 3, validation: (rule) => rule.required() }),
    defineField({ name: 'previewImage', title: 'Gambar pratinjau', type: 'imageWithAlt', validation: (rule) => rule.required() }),
    defineField({ name: 'order', title: 'Urutan', type: 'number', initialValue: 0, validation: (rule) => rule.required().integer().min(0) }),
    defineField({ name: 'isActive', title: 'Tampilkan di website', type: 'boolean', initialValue: true, validation: (rule) => rule.required() }),
    englishGroup([
      defineField({ name: 'name', title: 'Name', type: 'string' }),
      defineField({ name: 'description', title: 'Public description', type: 'text', rows: 3 }),
    ]),
  ],
});
