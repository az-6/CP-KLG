import { defineField, defineType } from 'sanity';

export const partner = defineType({
  name: 'partner',
  title: 'Mitra Kerja',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nama perusahaan', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'logo', title: 'Logo', type: 'imageWithAlt', validation: (rule) => rule.required() }),
    defineField({ name: 'order', title: 'Urutan', type: 'number', initialValue: 0, validation: (rule) => rule.required().integer().min(0) }),
    defineField({ name: 'isActive', title: 'Tampilkan di website', type: 'boolean', initialValue: true, validation: (rule) => rule.required() }),
  ],
});
