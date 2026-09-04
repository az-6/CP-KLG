import { defineField, defineType } from 'sanity';

export const operationalMedia = defineType({
  name: 'operationalMedia',
  title: 'Dokumentasi Operasional',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Judul internal', type: 'string', validation: (rule) => rule.required() }),
    defineField({ name: 'image', title: 'Foto', type: 'imageWithAlt', validation: (rule) => rule.required() }),
    defineField({
      name: 'documentationType',
      title: 'Jenis dokumentasi',
      type: 'string',
      options: {
        list: [
          { title: 'Proses', value: 'process' },
          { title: 'Fasilitas', value: 'facility' },
          { title: 'Tim', value: 'team' },
          { title: 'Armada', value: 'fleet' },
          { title: 'Kegiatan', value: 'activity' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'order', title: 'Urutan', type: 'number', initialValue: 0, validation: (rule) => rule.required().integer().min(0) }),
    defineField({ name: 'isActive', title: 'Tampilkan di website', type: 'boolean', initialValue: true, validation: (rule) => rule.required() }),
  ],
});
