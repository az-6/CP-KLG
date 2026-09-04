import { defineField, defineType } from 'sanity';

export const companyFact = defineType({
  name: 'companyFact',
  title: 'Fakta Perusahaan',
  type: 'document',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'value', title: 'Nilai', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'description', title: 'Keterangan', type: 'text', rows: 2 }),
    defineField({
      name: 'placement',
      title: 'Penempatan',
      type: 'string',
      options: { list: [{ title: 'Beranda', value: 'home' }, { title: 'Tentang Kami', value: 'about' }] },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'order', title: 'Urutan', type: 'number', initialValue: 0, validation: (rule) => rule.required().integer().min(0) }),
    defineField({ name: 'isActive', title: 'Tampilkan di website', type: 'boolean', initialValue: true, validation: (rule) => rule.required() }),
  ],
});
